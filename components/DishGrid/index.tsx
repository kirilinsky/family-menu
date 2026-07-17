"use client";

import { useState } from "react";
import DishCard from "@/components/DishCard";
import { CardGrid } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import type { Dish } from "@/lib/dishes";

const GROUP_OPTIONS = [
  { value: "none", label: "No grouping" },
  { value: "category", label: "Category" },
  { value: "country", label: "Country" },
] as const;

type GroupBy = (typeof GROUP_OPTIONS)[number]["value"];

const groupDishes = (dishes: Dish[], groupBy: Exclude<GroupBy, "none">) => {
  const groups = new Map<string, Dish[]>();
  for (const dish of dishes) {
    const key = dish[groupBy];
    groups.set(key, [...(groups.get(key) ?? []), dish]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
};

const DishGrid = ({ dishes }: { dishes: Dish[] }) => {
  const [groupBy, setGroupBy] = useState<GroupBy>("none");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-medium text-muted-foreground">Group by</span>
        {GROUP_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={groupBy === value ? "secondary" : "ghost"}
            onClick={() => setGroupBy(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {groupBy === "none" ? (
        <CardGrid>
          {dishes.map((dish) => (
            <DishCard key={dish.id} {...dish} />
          ))}
        </CardGrid>
      ) : (
        groupDishes(dishes, groupBy).map(([group, items]) => (
          <section key={group} className="flex flex-col gap-4">
            <h2 className="flex items-baseline gap-2 text-xl font-semibold tracking-tight">
              {group}
              <span className="text-sm font-normal text-muted-foreground">{items.length}</span>
            </h2>
            <CardGrid>
              {items.map((dish) => (
                <DishCard key={dish.id} {...dish} />
              ))}
            </CardGrid>
          </section>
        ))
      )}
    </div>
  );
};

export default DishGrid;
