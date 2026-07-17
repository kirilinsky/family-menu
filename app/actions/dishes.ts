"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { DishStatus, DishType } from "@/lib/dishes";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type SaveDishInput = {
  type: DishType;
  status: DishStatus;
  name: string;
  country: string;
  city: string;
  category: string;
  cuisines: string[];
  ingredients: string[];
  rating: number;
  triedOn: string;
  comment: string;
  link: string;
  linkTitle: string;
  imageUrl: string;
};

export async function saveDish(input: SaveDishInput): Promise<ActionResult<number>> {
  const session = await getSession();
  if (!session?.isAdmin) return { ok: false, error: "Forbidden" };

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Dish name is required" };

  // Domestic dishes are cooked/tasted by definition; wishlist has no rating.
  const status: DishStatus = input.type === "domestic" ? "tried" : input.status;
  const rating = status === "tried" && input.rating > 0 ? input.rating : null;
  const triedOn =
    status === "tried" ? input.triedOn.trim() || new Date().toISOString().slice(0, 10) : null;

  const db = await getDb();
  const result = await db.execute({
    sql: `INSERT INTO dishes
      (type, status, name, country, city, category, cuisines, ingredients,
       rating, tried_on, comment, link, link_title, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.type,
      status,
      name,
      input.country.trim(),
      input.city.trim() || null,
      input.category,
      JSON.stringify(input.cuisines),
      JSON.stringify(input.ingredients),
      rating,
      triedOn,
      input.comment.trim() || null,
      input.link.trim() || null,
      input.linkTitle.trim() || null,
      input.imageUrl || null,
    ],
  });

  revalidatePath("/travel-food");
  revalidatePath("/domestic-food");
  return { ok: true, data: Number(result.lastInsertRowid) };
}
