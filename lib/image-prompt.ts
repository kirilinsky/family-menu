// Service part of the image prompt — every dish shot shares this styling.
const PROMPT_TEMPLATE = `[DISH_DESCRIPTION], served on a simple round matte ceramic plate in warm off-white color,
centered composition, 3D isometric view at 30 degrees, high angle,
ultra-detailed food photography, realistic textures, appetizing glossy highlights,
soft diffused studio lighting, gentle shadow under the plate,
clean light gray seamless background (#f0f2f5), minimalist style,
no props, no cutlery, no table, negative space around the plate,
square format, product shot quality`;

export function buildFinalPrompt(dishDescription: string): string {
  return PROMPT_TEMPLATE.replace("[DISH_DESCRIPTION]", dishDescription.trim());
}
