// Shared Dish shape (client-safe — no server imports here).
export type DishType = "domestic" | "travel";

// "want" = wishlist (no rating yet), "tried" = tasted/cooked, rating applies.
export type DishStatus = "want" | "tried";

export type Dish = {
  id: number;
  type: DishType;
  status: DishStatus;
  name: string;
  country: string; // ISO 3166-1 alpha-2 or ""
  category: string;
  cuisines: string[];
  ingredients: string[];
  rating: number | null;
  triedOn: string | null;
  comment: string | null;
  link: string | null;
  linkTitle: string | null;
  imageUrl: string | null;
};
