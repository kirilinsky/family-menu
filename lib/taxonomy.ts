import "server-only";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

// Shared CRUD for flat name-lists (categories, cuisines).
// Table names are a closed whitelist — never interpolate user input here.
export type TaxonomyTable = "categories" | "cuisines";

export type TaxonomyItem = { id: number; name: string };

export type TaxonomyResult = { ok: true; data: TaxonomyItem[] } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Forbidden");
}

export async function listRows(table: TaxonomyTable): Promise<TaxonomyItem[]> {
  const db = await getDb();
  const { rows } = await db.execute(`SELECT id, name FROM ${table} ORDER BY name COLLATE NOCASE`);
  return rows.map((r) => ({ id: Number(r.id), name: String(r.name) }));
}

function validate(name: string): { ok: true; value: string } | { ok: false; error: string } {
  const value = name.trim();
  if (!value) return { ok: false, error: "Name is empty" };
  if (value.length > 40) return { ok: false, error: "Name too long (max 40)" };
  return { ok: true, value };
}

export async function createRow(table: TaxonomyTable, name: string): Promise<TaxonomyResult> {
  await requireAdmin();
  const v = validate(name);
  if (!v.ok) return v;

  const db = await getDb();
  try {
    await db.execute({
      sql: `INSERT INTO ${table} (name) VALUES (?)`,
      args: [v.value],
    });
  } catch {
    return { ok: false, error: `"${v.value}" already exists` };
  }
  revalidatePath("/", "layout");
  return { ok: true, data: await listRows(table) };
}

export async function renameRow(
  table: TaxonomyTable,
  id: number,
  name: string
): Promise<TaxonomyResult> {
  await requireAdmin();
  const v = validate(name);
  if (!v.ok) return v;

  const db = await getDb();
  try {
    await db.execute({
      sql: `UPDATE ${table} SET name = ? WHERE id = ?`,
      args: [v.value, id],
    });
  } catch {
    return { ok: false, error: `"${v.value}" already exists` };
  }
  revalidatePath("/", "layout");
  return { ok: true, data: await listRows(table) };
}

// Bulk "add if missing" — used by the prompt-improver to register cuisines
// the model names that aren't in the list yet. Relies on UNIQUE COLLATE NOCASE.
export async function ensureRows(table: TaxonomyTable, names: string[]): Promise<void> {
  await requireAdmin();
  const values = names.map((n) => n.trim()).filter((n) => n && n.length <= 40);
  if (!values.length) return;

  const db = await getDb();
  for (const name of values) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO ${table} (name) VALUES (?)`,
      args: [name],
    });
  }
  revalidatePath("/", "layout");
}

export async function deleteRow(table: TaxonomyTable, id: number): Promise<TaxonomyResult> {
  await requireAdmin();

  const db = await getDb();
  await db.execute({ sql: `DELETE FROM ${table} WHERE id = ?`, args: [id] });
  revalidatePath("/", "layout");
  return { ok: true, data: await listRows(table) };
}
