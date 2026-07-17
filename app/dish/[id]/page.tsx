import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { anyaround } from "anyaround";
import { ArrowLeft, ExternalLink, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDish } from "@/lib/dishes-db";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
      {label}
    </span>
    {children}
  </div>
);

const ChipList = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((item) => (
      <span
        key={item}
        className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
      >
        {item}
      </span>
    ))}
  </div>
);

export default async function DishDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dishId = Number(id);
  const dish = Number.isInteger(dishId) ? await getDish(dishId) : null;
  if (!dish) notFound();

  const countryLabel = dish.country
    ? anyaround(dish.country, { mode: "region", display: "flag-name" })
    : null;
  const location = [countryLabel, dish.city].filter(Boolean).join(", ");
  const backHref = dish.type === "travel" ? "/travel-food" : "/domestic-food";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left half: image + name */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-[#f1efe7]">
            {dish.imageUrl ? (
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <span
                className="flex h-full items-center justify-center text-8xl"
                role="img"
                aria-label={dish.name}
              >
                🍽️
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{dish.name}</h1>
        </div>

        {/* Right half: everything we know about the dish */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {dish.category && (
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {dish.category}
              </span>
            )}
            {dish.status === "want" ? (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                Want to try
              </span>
            ) : (
              dish.rating != null && (
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {dish.rating}
                </span>
              )
            )}
          </div>

          {location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {dish.cuisines.length > 0 && (
            <Field label="Cuisines">
              <ChipList items={dish.cuisines} />
            </Field>
          )}

          {dish.ingredients.length > 0 && (
            <Field label="Ingredients">
              <ChipList items={dish.ingredients} />
            </Field>
          )}

          {dish.triedOn && (
            <Field label={dish.status === "want" ? "Added" : "Tried on"}>
              <span className="text-sm">{dish.triedOn}</span>
            </Field>
          )}

          {dish.comment && (
            <Field label="Comment">
              <p className="text-sm leading-relaxed">{dish.comment}</p>
            </Field>
          )}

          {dish.link && (
            <Button asChild variant="outline" className="w-fit">
              <a href={dish.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                {dish.linkTitle || "Source"}
              </a>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
