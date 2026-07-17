// Reference-image mode: the reference supplies ONLY the scene — plate, camera,
// lighting, background. The food itself must be rendered fresh from the
// description, never echoing the shapes of the reference dish.
const PROMPT_TEMPLATE = `Use the reference image only for the scene: keep the exact same plate, camera angle,
isometric perspective, lighting, shadows, background color and framing.
Completely remove the food shown in the reference and render a different dish on the plate:
[DISH_DESCRIPTION].
The new dish's shape, structure and presentation must follow this description only —
do not copy or echo the shapes, pieces or textures of the reference food.
Do not change the plate, background, lighting or framing.`;

export function buildFinalPrompt(dishDescription: string): string {
  return PROMPT_TEMPLATE.replace("[DISH_DESCRIPTION]", dishDescription.trim());
}
