import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type DishCardProps = {
  title?: string;
  category?: string;
  date?: string;
  rating?: number;
  tags?: string[];
};

const DishCard = ({
  title = "Lasagna Classica",
  category = "Main Course",
  date = "Oct 12, 2023",
  rating = 4.8,
  tags = ["Pasta", "Beef", "Béchamel", "Tomato"],
}: DishCardProps) => (
  <article className="flex flex-col overflow-hidden rounded-lg border bg-card">
    <div className="relative aspect-square bg-[#f1efe7]">
      <Image
        src="/dishes/chebakia.jpg"
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover"
      />
      <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold">
        <Star className="size-4 fill-amber-400 text-amber-400" />
        {rating}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {category}
        </span>
        <span className="shrink-0 text-sm font-medium text-secondary-foreground">{date}</span>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <Button className="mt-auto w-full">View Full Recipe</Button>
    </div>
  </article>
);

export default DishCard;
