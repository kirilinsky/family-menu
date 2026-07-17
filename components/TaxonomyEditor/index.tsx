"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { TaxonomyItem, TaxonomyResult } from "@/lib/taxonomy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaxonomyEditorProps = {
  title: string;
  initial: TaxonomyItem[];
  onCreate: (name: string) => Promise<TaxonomyResult>;
  onRename: (id: number, name: string) => Promise<TaxonomyResult>;
  onDelete: (id: number) => Promise<TaxonomyResult>;
};

const TaxonomyEditor = ({ title, initial, onCreate, onRename, onDelete }: TaxonomyEditorProps) => {
  const [items, setItems] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<TaxonomyResult>) =>
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (result.ok) {
        setItems(result.data);
        setNewName("");
        setEditingId(null);
      } else {
        setError(result.error);
      }
    });

  return (
    <section className="flex w-full max-w-xl flex-col gap-4 rounded-lg border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (newName.trim()) run(() => onCreate(newName));
        }}
      >
        <Input
          placeholder={`New ${title.toLowerCase().replace(/s$/, "")}…`}
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
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 py-2">
            {editingId === item.id ? (
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
                  onClick={() => run(() => onRename(item.id, editName))}
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
                <span className="flex-1 text-sm">{item.name}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Rename ${item.name}`}
                  onClick={() => {
                    setEditingId(item.id);
                    setEditName(item.name);
                  }}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Delete ${item.name}`}
                  className="text-destructive hover:text-destructive"
                  disabled={pending}
                  onClick={() => run(() => onDelete(item.id))}
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

export default TaxonomyEditor;
