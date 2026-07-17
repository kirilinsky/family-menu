"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
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
  const [rating, setRating] = useState(0);
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const toggleCuisine = (cuisine: string) =>
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setTagInput("");
  };

  return (
    <form
      className="grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-2"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Block 1: image generator + result; improve-step also autofills details */}
      <ImageGenerator
        categories={categories}
        cuisines={cuisines}
        onAutofill={(meta) => {
          if (meta.category) setCategory(meta.category);
          setSelectedCuisines(meta.cuisines.filter((c) => cuisines.includes(c)));
          setTags((prev) => [...prev, ...meta.ingredients.filter((i) => !prev.includes(i))]);
        }}
      />

      {/* Block 2: info fields */}
      <section className="flex flex-col gap-5 rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold tracking-tight">Details</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-name">Dish name</Label>
          <Input id="dish-name" name="name" placeholder="Lasagna Classica" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dish-country">Country</Label>
          <CountrySelect id="dish-country" name="country" value={country} onChange={setCountry} />
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

        {variant === "domestic" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="dish-date">Tried / cooked on</Label>
            <Input id="dish-date" name="date" type="date" />
          </div>
        )}

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

        {/* Rating exists only for tasted dishes — a wishlist item has none */}
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
            {cuisines.map((cuisine) => {
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

        <Button type="submit" className="mt-2">
          Save dish
        </Button>
      </section>
    </form>
  );
};

export default DishForm;
