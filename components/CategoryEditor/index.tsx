"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  renameCategory,
  type Category,
} from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CategoryEditor = ({ initial }: { initial: Category[] }) => {
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean } & Record<string, unknown>>) =>
    startTransition(async () => {
      setError(null);
      const result = (await action()) as
        { ok: true; data: Category[] } | { ok: false; error: string };
      if (result.ok) {
        setCategories(result.data);
        setNewName("");
        setEditingId(null);
      } else {
        setError(result.error);
      }
    });

  return (
    <section className="flex max-w-xl flex-col gap-4 rounded-lg border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">Categories</h2>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (newName.trim()) run(() => createCategory(newName));
        }}
      >
        <Input
          placeholder="New category…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit" disabled={!newName.trim() || pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Plus />} Add
        </Button>
      </form>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      <ul className="flex flex-col divide-y">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center gap-2 py-2">
            {editingId === category.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-9"
                  autoFocus
                />
                <Button
                  size="icon-sm"
                  variant="secondary"
                  aria-label="Save"
                  disabled={!editName.trim() || pending}
                  onClick={() => run(() => renameCategory(category.id, editName))}
                >
                  <Check />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Cancel"
                  onClick={() => setEditingId(null)}
                >
                  <X />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{category.name}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Rename ${category.name}`}
                  onClick={() => {
                    setEditingId(category.id);
                    setEditName(category.name);
                  }}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Delete ${category.name}`}
                  className="text-destructive hover:text-destructive"
                  disabled={pending}
                  onClick={() => run(() => deleteCategory(category.id))}
                >
                  <Trash2 />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategoryEditor;
