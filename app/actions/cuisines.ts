"use server";

import {
  createRow,
  deleteRow,
  listRows,
  renameRow,
  type TaxonomyItem,
  type TaxonomyResult,
} from "@/lib/taxonomy";

export type Cuisine = TaxonomyItem;

// Public read — the grid and the form need cuisines without auth.
export async function listCuisines(): Promise<Cuisine[]> {
  return listRows("cuisines");
}

export async function createCuisine(name: string): Promise<TaxonomyResult> {
  return createRow("cuisines", name);
}

export async function renameCuisine(id: number, name: string): Promise<TaxonomyResult> {
  return renameRow("cuisines", id, name);
}

export async function deleteCuisine(id: number): Promise<TaxonomyResult> {
  return deleteRow("cuisines", id);
}
