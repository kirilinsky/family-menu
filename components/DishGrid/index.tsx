"use client";

import { useState } from "react";
import { anyaround } from "anyaround";
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
  return [...groups.entries()]
    .map(([key, items]) => ({
      key,
      label: groupBy === "country" ? anyaround(key, { mode: "region", display: "flag-name" }) : key,
      items,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "tried", label: "Tried" },
  { value: "want", label: "Want to try" },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];

type DishGridProps = {
  dishes: Dish[];
  withStatusFilter?: boolean;
};

const DishGrid = ({ dishes: allDishes, withStatusFilter = false }: DishGridProps) => {
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const dishes =
    withStatusFilter && statusFilter !== "all"
      ? allDishes.filter((d) => d.status === statusFilter)
      : allDishes;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
        {withStatusFilter && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-medium text-muted-foreground">Status</span>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={statusFilter === value ? "secondary" : "ghost"}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {dishes.length === 0 && <p className="text-sm text-muted-foreground">No dishes yet.</p>}

      {groupBy === "none" ? (
        <CardGrid>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </CardGrid>
      ) : (
        groupDishes(dishes, groupBy).map(({ key, label, items }) => (
          <section key={key} className="flex flex-col gap-4">
            <h2 className="flex items-baseline gap-2 text-xl font-semibold tracking-tight">
              {label}
              <span className="text-sm font-normal text-muted-foreground">{items.length}</span>
            </h2>
            <CardGrid>
              {items.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </CardGrid>
          </section>
        ))
      )}
    </div>
  );
};

export default DishGrid;
