"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/auth";
import { buildFinalPrompt } from "@/lib/image-prompt";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Forbidden");
}

// Step 1: user's rough description → Haiku → strict detailed dish description,
// merged with the service template into the final image prompt.
export async function improveDishPrompt(description: string): Promise<ActionResult<string>> {
  await requireAdmin();

  const input = description.trim();
  if (!input) return { ok: false, error: "Description is empty" };

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      temperature: 0.2,
      system:
        "You turn a rough dish description (any language) into one strict English phrase " +
        "for a food image generator that swaps the food on a fixed reference shot. " +
        "Always follow this exact slot pattern:\n\n" +
        "<Dish name in English> — <shape/form and how it is made>, " +
        "<dominant colors and doneness>, <glaze/sauce/coating>, <toppings or garnish>, " +
        "<surface texture qualities>.\n\n" +
        "Rules:\n" +
        "- Describe only the food itself. Never mention plate, bowl, background, lighting, camera.\n" +
        "- No composition or layout words (arranged, positioned, stacked, cluster, centered, row) — " +
        "the reference image dictates the layout. Only form, color, texture of the dish.\n" +
        "- Concrete visual details: colors by name, textures (glossy, crispy, flaky), sizes of pieces.\n" +
        "- One phrase, comma-separated clauses, 25-50 words. No quotes, no explanations, no line breaks.",
      messages: [
        // Few-shot: locks the output pattern
        { role: "user", content: "марокканская чебакия" },
        {
          role: "assistant",
          content:
            "Moroccan chebakia — flower-shaped fried sesame cookies folded from strips of dough, " +
            "deep golden-amber color, glazed with honey, generously sprinkled with toasted sesame seeds, " +
            "glossy sticky surface",
        },
        { role: "user", content: "борщ со сметаной" },
        {
          role: "assistant",
          content:
            "Ukrainian borscht — hearty beet soup with shredded cabbage and tender beef chunks, " +
            "deep ruby-red color, topped with a swirl of white sour cream and scattered fresh dill, " +
            "glossy surface with light golden fat droplets",
        },
        { role: "user", content: input },
      ],
    });

    const block = response.content[0];
    if (block?.type !== "text" || !block.text.trim()) {
      return { ok: false, error: "Empty response from model" };
    }
    return { ok: true, data: buildFinalPrompt(block.text) };
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

// Step 2: final prompt + reference image → Replicate → image URL.
// TODO: persist the image (Vercel Blob) instead of returning the temporary URL.
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
  return { ok: true, data: url };
}
