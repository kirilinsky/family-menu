"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { buildFinalPrompt } from "@/lib/image-prompt";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Forbidden");
}

export type DishMeta = {
  finalPrompt: string;
  ingredients: string[];
  cuisines: string[];
  category: string;
};

// Step 1: user's rough description → Haiku → structured result:
// strict dish description (merged with the service template) + main
// ingredients + cuisine/category picked from the lists stored in the DB.
export async function improveDishPrompt(
  description: string,
  options: { categories: string[]; cuisines: string[] }
): Promise<ActionResult<DishMeta>> {
  await requireAdmin();

  const input = description.trim();
  if (!input) return { ok: false, error: "Description is empty" };

  const client = new Anthropic();

  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["dish_description", "ingredients", "cuisines", "category"],
    properties: {
      dish_description: {
        type: "string",
        description: "The image-generator phrase following the slot pattern",
      },
      ingredients: {
        type: "array",
        items: { type: "string" },
        description: "3-6 main ingredients, short English names, Capitalized",
      },
      cuisines: {
        type: "array",
        items: options.cuisines.length
          ? { type: "string", enum: options.cuisines }
          : { type: "string" },
        description: "1-2 matching cuisines from the allowed list, empty if none fit",
      },
      category: options.categories.length
        ? { type: "string", enum: options.categories }
        : { type: "string" },
    },
  };

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      temperature: 0.2,
      system:
        "You analyze a rough dish description (any language) for a family menu app and return JSON.\n\n" +
        "dish_description — one strict English phrase for a food image generator that swaps " +
        "the food on a fixed reference shot. Exact slot pattern:\n" +
        "<Dish name in English> — <shape/form and how it is made>, " +
        "<dominant colors and doneness>, <glaze/sauce/coating>, <toppings or garnish>, " +
        "<surface texture qualities>.\n" +
        "Example: 'Moroccan chebakia — flower-shaped fried sesame cookies folded from strips of dough, " +
        "deep golden-amber color, glazed with honey, generously sprinkled with toasted sesame seeds, " +
        "glossy sticky surface'\n" +
        "Rules: describe only the food itself — never plate, bowl, background, lighting, camera. " +
        "No composition or layout words (arranged, positioned, stacked, cluster, centered, row) — " +
        "the reference image dictates layout. Concrete colors and textures. " +
        "One phrase, comma-separated clauses, 25-50 words, no line breaks.\n\n" +
        "ingredients — 3-6 main ingredients of the dish, short English names, Capitalized.\n" +
        "cuisines — 1-2 from the allowed list, only if the dish truly belongs to that cuisine " +
        "tradition. First name the dish's actual cuisine to yourself, then check: is it in the " +
        "list? Not listed → empty array. Never substitute a neighboring or similar cuisine " +
        "(e.g. borscht is Ukrainian: if Ukrainian is absent, return [] — not Balkan).\n" +
        "category — the single best fit from the allowed list.",
      messages: [{ role: "user", content: input }],
      output_config: { format: { type: "json_schema", schema } },
    });

    const block = response.content[0];
    if (block?.type !== "text" || !block.text.trim()) {
      return { ok: false, error: "Empty response from model" };
    }
    const parsed = JSON.parse(block.text) as {
      dish_description: string;
      ingredients: string[];
      cuisines: string[];
      category: string;
    };
    return {
      ok: true,
      data: {
        finalPrompt: buildFinalPrompt(parsed.dish_description),
        ingredients: parsed.ingredients,
        cuisines: parsed.cuisines,
        category: parsed.category,
      },
    };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, error: "ANTHROPIC_API_KEY missing or invalid" };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "Rate limited, try again in a minute" };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, error: `Anthropic API error ${error.status}` };
    }
    throw error;
  }
}

// Style reference: every generation reuses the chebakia shot so plate, angle,
// lighting and framing come from pixels, not words. Uploaded to Replicate
// Files API (they can't fetch localhost); cached per server instance.
let referenceCache: { url: string; expires: number } | null = null;

async function getReferenceImageUrl(token: string): Promise<string> {
  if (referenceCache && referenceCache.expires > Date.now()) {
    return referenceCache.url;
  }
  const bytes = await readFile(path.join(process.cwd(), "public/dishes/chebakia.jpg"));
  const form = new FormData();
  form.append("content", new Blob([new Uint8Array(bytes)], { type: "image/jpeg" }), "chebakia.jpg");
  const response = await fetch("https://api.replicate.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Reference upload failed: ${response.status}`);
  }
  const file = await response.json();
  const url = file?.urls?.get;
  if (typeof url !== "string") throw new Error("Reference upload: no URL");
  referenceCache = { url, expires: Date.now() + 60 * 60 * 1000 };
  return url;
}

// Replicate URLs die within ~1 hour — persist the bytes to Vercel Blob.
// Without BLOB_READ_WRITE_TOKEN (local dev) the temporary URL is returned as-is.
async function persistImage(temporaryUrl: string): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("BLOB_READ_WRITE_TOKEN not set — returning temporary Replicate URL");
    return temporaryUrl;
  }
  const image = await fetch(temporaryUrl);
  if (!image.ok) throw new Error(`Image download failed: ${image.status}`);
  const blob = await put("dishes/dish.jpg", await image.arrayBuffer(), {
    access: "public",
    addRandomSuffix: true,
    contentType: "image/jpeg",
  });
  return blob.url;
}

// Step 2: final prompt + reference image → Replicate → persisted image URL.
export async function generateDishImage(finalPrompt: string): Promise<ActionResult<string>> {
  await requireAdmin();

  const prompt = finalPrompt.trim();
  if (!prompt) return { ok: false, error: "Prompt is empty" };

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return { ok: false, error: "REPLICATE_API_TOKEN is not set" };

  let referenceUrl: string;
  try {
    referenceUrl = await getReferenceImageUrl(token);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  const response = await fetch(
    "https://api.replicate.com/v1/models/bytedance/seedream-4/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        // Fixed output contract: square 1:1, 1024x1024, single image
        input: {
          prompt,
          // "custom" required for width/height to apply ("2K" preset would force 2048px)
          size: "custom",
          width: 1024,
          height: 1024,
          aspect_ratio: "1:1",
          max_images: 1,
          image_input: [referenceUrl],
          // no rewriting of our prompt — determinism over "creativity"
          enhance_prompt: false,
          sequential_image_generation: "disabled",
        },
      }),
    }
  );

  if (!response.ok) {
    return { ok: false, error: `Replicate error ${response.status}` };
  }

  const prediction = await response.json();
  const url = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  if (typeof url !== "string") {
    return { ok: false, error: `Generation ${prediction.status ?? "failed"}` };
  }

  try {
    return { ok: true, data: await persistImage(url) };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}
