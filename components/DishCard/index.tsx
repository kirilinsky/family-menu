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
        <span className="absolute top-4 right-4 rounded-full bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground">
          Want to try
        </span>
      ) : (
        dish.rating != null && (
          <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {dish.rating}
          </span>
        )
      )}
    </div>
    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {dish.category}
        </span>
        {dish.triedOn && (
          <span className="shrink-0 text-sm font-medium text-secondary-foreground">
            {dish.triedOn}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">{dish.name}</h3>
      {dish.ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {dish.ingredients.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <Button asChild size="sm" className="mt-auto self-start">
        <Link href={`/dish/${dish.id}`}>Details</Link>
      </Button>
    </div>
  </article>
);

export default DishCard;
