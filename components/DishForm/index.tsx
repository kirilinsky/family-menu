"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star, X } from "lucide-react";
import { saveDish } from "@/app/actions/dishes";
import ImageGenerator from "@/components/DishForm/ImageGenerator";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/ui/country-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type DishFormProps = {
  variant: "domestic" | "travel";
  categories: string[];
  cuisines: string[];
};

const DishForm = ({ variant, categories, cuisines }: DishFormProps) => {
  const [status, setStatus] = useState<"want" | "tried">("tried");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  // Improve-step may introduce cuisines that weren't in the DB list yet
  const [availableCuisines, setAvailableCuisines] = useState(cuisines);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const router = useRouter();

  const toggleCuisine = (cuisine: string) =>
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setTagInput("");
  };

  const submit = (form: HTMLFormElement) =>
    startSaving(async () => {
      setSaveError(null);
      const fields = new FormData(form);
      const result = await saveDish({
        type: variant,
        status,
        name,
        country,
        city: String(fields.get("city") ?? ""),
        category,
        cuisines: selectedCuisines,
        ingredients: tags,
        rating,
        triedOn: String(fields.get("date") ?? ""),
        comment: String(fields.get("comment") ?? ""),
        link: String(fields.get("link") ?? ""),
        linkTitle: String(fields.get("linkTitle") ?? ""),
        imageUrl,
        imagePrompt,
      });
      if (result.ok) {
        router.push(variant === "travel" ? "/travel-food" : "/domestic-food");
      } else {
        setSaveError(result.error);
      }
    });

  return (
    <form
      className="grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
    >
      {/* Block 1: image generator + result; improve-step also autofills details */}
      <ImageGenerator
        categories={categories}
        cuisines={cuisines}
        onAutofill={(meta) => {
          if (meta.name) setName(meta.name);
          if (meta.category) setCategory(meta.category);
          setAvailableCuisines((prev) => [
            ...prev,
            ...meta.cuisines.filter((c) => !prev.includes(c)),
          ]);
          setSelectedCuisines(meta.cuisines);
          setTags((prev) => [...prev, ...meta.ingredients.filter((i) => !prev.includes(i))]);
        }}
        onImage={(url, prompt) => {
          setImageUrl(url);
          setImagePrompt(prompt);
        }}
      />

      {/* Block 2: info fields */}
      <section className="flex flex-col gap-5 rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold tracking-tight">Details</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-name">Dish name</Label>
          <Input
            id="dish-name"
            name="name"
            placeholder="Lasagna Classica"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-country">Country</Label>
          <CountrySelect id="dish-country" name="country" value={country} onChange={setCountry} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-city">City (optional)</Label>
          <Input id="dish-city" name="city" placeholder="Marrakesh" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-category">Category</Label>
          <Select
            id="dish-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select category…
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        {variant === "travel" && (
          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <input type="hidden" name="status" value={status} />
            <div className="flex gap-2">
              {(
                [
                  { value: "want", label: "Want to try" },
                  { value: "tried", label: "Tried" },
                ] as const
              ).map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={status === value ? "secondary" : "ghost"}
                  aria-pressed={status === value}
                  onClick={() => setStatus(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Date + rating exist only for tasted dishes — a wishlist item has neither */}
        {(variant === "domestic" || status === "tried") && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="dish-date">Tried / cooked on</Label>
            <Input
              id="dish-date"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>
        )}

        {(variant === "domestic" || status === "tried") && (
          <div className="flex flex-col gap-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} of 5`}
                  onClick={() => setRating(value === rating ? 0 : value)}
                  className="rounded-sm p-0.5 outline-none focus-visible:ring-[2px] focus-visible:ring-ring/50"
                >
                  <Star
                    className={cn(
                      "size-6 text-muted-foreground/40 transition-colors",
                      value <= rating && "fill-amber-400 text-amber-400"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label>Cuisines</Label>
          <input type="hidden" name="cuisines" value={selectedCuisines.join(",")} />
          <div className="flex flex-wrap gap-2">
            {availableCuisines.map((cuisine) => {
              const active = selectedCuisines.includes(cuisine);
              return (
                <button
                  key={cuisine}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCuisine(cuisine)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-[2px] focus-visible:ring-ring/50",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  )}
                >
                  {cuisine}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-tags">Ingredients</Label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-secondary py-1 pr-1.5 pl-3 text-sm text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="rounded-full p-0.5 hover:bg-foreground/10"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <Input
            id="dish-tags"
            placeholder="Type ingredient, press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-comment">Comment</Label>
          <Textarea id="dish-comment" name="comment" placeholder="Notes, impressions…" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-link">Link (optional)</Label>
          <Input id="dish-link" name="link" placeholder="https://…" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-link-title">Link title</Label>
          <Input id="dish-link-title" name="linkTitle" placeholder="Recipe source" />
        </div>

        {saveError && (
          <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {saveError}
          </p>
        )}

        <Button type="submit" className="mt-2" disabled={saving || !name.trim()}>
          {saving && <Loader2 className="animate-spin" />}
          Save dish
        </Button>
      </section>
    </form>
  );
};

export default DishForm;
