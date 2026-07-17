import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dish } from "@/lib/dishes";

const DishCard = ({ dish }: { dish: Dish }) => (
  <article className="flex flex-col overflow-hidden rounded-lg border bg-card">
    <div className="relative aspect-square bg-[#f1efe7]">
      {dish.imageUrl ? (
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      ) : (
        <span
          className="flex h-full items-center justify-center text-7xl"
          role="img"
          aria-label={dish.name}
        >
          🍽️
        </span>
      )}
      {dish.status === "want" ? (
        <span className="absolute top-3 right-3 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          Want to try
        </span>
      ) : (
        dish.rating != null && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-semibold">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {dish.rating}
          </span>
        )
      )}
    </div>
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
          {dish.category}
        </span>
        {dish.triedOn && (
          <span className="shrink-0 text-xs font-medium text-secondary-foreground">
            {dish.triedOn}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{dish.name}</h3>
      {dish.ingredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {dish.ingredients.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
          {dish.ingredients.length > 4 && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              +{dish.ingredients.length - 4}
            </span>
          )}
        </div>
      )}
      <Button asChild size="sm" className="mt-auto self-start">
        <Link href={`/dish/${dish.id}`}>Details</Link>
      </Button>
    </div>
  </article>
);

export default DishCard;
