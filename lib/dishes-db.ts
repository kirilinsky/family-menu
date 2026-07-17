import "server-only";
import { getDb } from "@/lib/db";
import type { Dish, DishStatus, DishType } from "@/lib/dishes";

function parseList(value: unknown): string[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function listDishes(type: DishType): Promise<Dish[]> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: "SELECT * FROM dishes WHERE type = ? ORDER BY created_at DESC",
    args: [type],
  });
  return rows.map((r) => ({
    id: Number(r.id),
    type: r.type as DishType,
    status: (r.status as DishStatus) ?? "tried",
    name: String(r.name),
    country: String(r.country ?? ""),
    city: r.city == null ? null : String(r.city),
    category: String(r.category ?? ""),
    cuisines: parseList(r.cuisines),
    ingredients: parseList(r.ingredients),
    rating: r.rating == null ? null : Number(r.rating),
    triedOn: r.tried_on == null ? null : String(r.tried_on),
    comment: r.comment == null ? null : String(r.comment),
    link: r.link == null ? null : String(r.link),
    linkTitle: r.link_title == null ? null : String(r.link_title),
    imageUrl: r.image_url == null ? null : String(r.image_url),
  }));
}
