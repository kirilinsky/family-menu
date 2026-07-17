"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export type Category = { id: number; name: string };

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Forbidden");
}

async function allCategories(): Promise<Category[]> {
  const db = await getDb();
  const { rows } = await db.execute("SELECT id, name FROM categories ORDER BY name COLLATE NOCASE");
  return rows.map((r) => ({ id: Number(r.id), name: String(r.name) }));
}

// Public read — the grid and the form need categories without auth.
export async function listCategories(): Promise<Category[]> {
  return allCategories();
}

export async function createCategory(name: string): Promise<ActionResult<Category[]>> {
  await requireAdmin();

  const value = name.trim();
  if (!value) return { ok: false, error: "Name is empty" };
  if (value.length > 40) return { ok: false, error: "Name too long (max 40)" };

  const db = await getDb();
  try {
    await db.execute({
      sql: "INSERT INTO categories (name) VALUES (?)",
      args: [value],
    });
  } catch {
    return { ok: false, error: `"${value}" already exists` };
  }
  revalidatePath("/", "layout");
  return { ok: true, data: await allCategories() };
}

export async function renameCategory(id: number, name: string): Promise<ActionResult<Category[]>> {
  await requireAdmin();

  const value = name.trim();
  if (!value) return { ok: false, error: "Name is empty" };
  if (value.length > 40) return { ok: false, error: "Name too long (max 40)" };

  const db = await getDb();
  try {
    await db.execute({
      sql: "UPDATE categories SET name = ? WHERE id = ?",
      args: [value, id],
    });
  } catch {
    return { ok: false, error: `"${value}" already exists` };
  }
  revalidatePath("/", "layout");
  return { ok: true, data: await allCategories() };
}

export async function deleteCategory(id: number): Promise<ActionResult<Category[]>> {
  await requireAdmin();

  const db = await getDb();
  await db.execute({
    sql: "DELETE FROM categories WHERE id = ?",
    args: [id],
  });
  revalidatePath("/", "layout");
  return { ok: true, data: await allCategories() };
}
