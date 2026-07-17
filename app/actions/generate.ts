"use server";

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
        "for a food image generator. Always follow this exact slot pattern:\n\n" +
        "<Dish name in English> — <shape/form and how it is made>, " +
        "<dominant colors and doneness>, <glaze/sauce/coating>, <toppings or garnish>, " +
        "<surface texture qualities>, <piece count and arrangement OR single-portion shape>.\n\n" +
        "Rules:\n" +
        "- Describe only the food itself. Never mention plate, bowl, background, lighting, camera.\n" +
        "- Concrete visual details: colors by name, textures (glossy, crispy, flaky), sizes.\n" +
        "- Countable items: state count (3-6 pieces) and arrangement (loose cluster, stacked, row).\n" +
        "- Non-countable dishes: describe the single portion shape (neat mound, ladled portion, wedge slice). " +
        "Never say bowl/plate for the portion; mention a vessel only when it is part of the dish itself (small dipping cup).\n" +
        "- One phrase, comma-separated clauses, 30-60 words. No quotes, no explanations, no line breaks.",
      messages: [
        // Few-shot: locks the output pattern
        { role: "user", content: "марокканская чебакия" },
        {
          role: "assistant",
          content:
            "Moroccan chebakia — flower-shaped fried sesame cookies folded from strips of dough, " +
            "deep golden-amber color, glazed with honey, generously sprinkled with toasted sesame seeds, " +
            "glossy sticky surface, 4-5 pieces arranged in a loose cluster",
        },
        { role: "user", content: "борщ со сметаной" },
        {
          role: "assistant",
          content:
            "Ukrainian borscht — hearty beet soup with shredded cabbage and tender beef chunks, " +
            "deep ruby-red color, topped with a swirl of white sour cream and scattered fresh dill, " +
            "glossy surface with light golden fat droplets, single ladled portion",
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

// Step 2: final prompt → Replicate → image URL.
// TODO: persist the image (Vercel Blob) instead of returning the temporary URL.
export async function generateDishImage(finalPrompt: string): Promise<ActionResult<string>> {
  await requireAdmin();

  const prompt = finalPrompt.trim();
  if (!prompt) return { ok: false, error: "Prompt is empty" };

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return { ok: false, error: "REPLICATE_API_TOKEN is not set" };

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
          image_input: [],
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
