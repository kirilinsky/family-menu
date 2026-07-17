"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { buildFinalPrompt } from "@/lib/image-prompt";
import { ensureRows } from "@/lib/taxonomy";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Forbidden");
}

export type DishMeta = {
  finalPrompt: string;
  name: string;
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
    required: ["dish_description", "name", "ingredients", "cuisines", "category"],
    properties: {
      dish_description: {
        type: "string",
        description: "The image-generator phrase following the slot pattern",
      },
      name: {
        type: "string",
        description: "Dish display name in English, Title Case, max 5 words",
      },
      ingredients: {
        type: "array",
        items: { type: "string" },
        description: "3-6 main ingredients, short English names, Capitalized",
      },
      cuisines: {
        type: "array",
        items: { type: "string" },
        description: "1-2 canonical English cuisine names for the dish",
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
        "No composition or layout words (arranged, positioned, stacked, cluster, centered, row). " +
        "Concrete colors and textures. " +
        "Preserve EVERY concrete detail the user mentions — specific ingredients, cooking style, " +
        "doneness, sauces, toppings, colors ('with crispy cheese crust', 'extra dill'): keep them " +
        "all in the phrase, expand around them, never drop or genericize them. " +
        "One phrase, comma-separated clauses, 25-60 words, no line breaks.\n\n" +
        "name — the dish display name in English, Title Case, short (e.g. 'Borscht', " +
        "'Moroccan Chebakia').\n" +
        "ingredients — 3-6 main ingredients of the dish, short English names, Capitalized.\n" +
        "cuisines — 1-2 canonical English cuisine names the dish truly belongs to " +
        "(e.g. Ukrainian, Moroccan, Thai). Known cuisines so far: " +
        `[${options.cuisines.join(", ")}] — reuse the exact spelling from this list when the ` +
        "dish's cuisine is already there; otherwise output its proper canonical name and it " +
        "will be added. Never substitute a neighboring cuisine for the real one " +
        "(borscht is Ukrainian, not Balkan).\n" +
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
      name: string;
      ingredients: string[];
      cuisines: string[];
      category: string;
    };
    // Register cuisines the model named that aren't in the list yet
    await ensureRows("cuisines", parsed.cuisines);
    return {
      ok: true,
      data: {
        finalPrompt: buildFinalPrompt(parsed.dish_description),
        name: parsed.name,
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
  // On Vercel public/ isn't on the function's filesystem (/var/task) — but the
  // asset is already served from our own domain, Replicate can fetch it directly.
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (host) return `https://${host}/dishes/chebakia.jpg`;

  // Local dev: localhost isn't reachable for Replicate — upload the file bytes.
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
async function persistImage(temporaryUrl: string): Promise<string> {
  if (!process.env.VERCEL_READ_WRITE_TOKEN) {
    // In production a dying URL must never reach the DB — fail loudly.
    if (process.env.VERCEL) {
      throw new Error("Image storage not configured (VERCEL_READ_WRITE_TOKEN missing)");
    }
    console.warn("VERCEL_READ_WRITE_TOKEN not set — returning temporary Replicate URL");
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
    "https://api.replicate.com/v1/models/google/nano-banana-2/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        // Fixed output contract: square 1:1, ~1024px, single jpg
        input: {
          prompt,
          image_input: [referenceUrl],
          aspect_ratio: "1:1",
          resolution: "1K",
          output_format: "jpg",
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
