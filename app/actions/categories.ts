"use server";

import {
  createRow,
  deleteRow,
  listRows,
  renameRow,
  type TaxonomyItem,
  type TaxonomyResult,
} from "@/lib/taxonomy";

export type Category = TaxonomyItem;

// Public read — the grid and the form need categories without auth.
export async function listCategories(): Promise<Category[]> {
  return listRows("categories");
}

export async function createCategory(name: string): Promise<TaxonomyResult> {
  return createRow("categories", name);
}

export async function renameCategory(id: number, name: string): Promise<TaxonomyResult> {
  return renameRow("categories", id, name);
}

export async function deleteCategory(id: number): Promise<TaxonomyResult> {
  return deleteRow("categories", id);
}
