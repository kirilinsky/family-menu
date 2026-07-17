// Reference-image mode: plate, angle, lighting and framing are inherited
// from the reference pixels, the prompt only swaps the food.
const PROMPT_TEMPLATE = `Using the reference image: keep the exact same plate, camera angle,
isometric perspective, lighting, shadows, background color and framing.
Replace the food on the plate with: [DISH_DESCRIPTION].
Do not change anything else.`;

export function buildFinalPrompt(dishDescription: string): string {
  return PROMPT_TEMPLATE.replace("[DISH_DESCRIPTION]", dishDescription.trim());
}
