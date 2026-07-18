"use client";

import { useState } from "react";
import { anyaround } from "anyaround";
import { Layers, ListFilter } from "lucide-react";
import DishCard from "@/components/DishCard";
import { CardGrid } from "@/components/PageLayout";
import { cn } from "@/lib/utils";
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

type SegmentedControlProps<T extends string> = {
  icon: React.ElementType;
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

const SegmentedControl = <T extends string>({
  icon: Icon,
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) => (
  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
    <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
      <Icon className="size-4" aria-hidden />
      {label}
    </span>
    <div
      role="radiogroup"
      aria-label={label}
      className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-full border border-border bg-muted/60 p-1 sm:inline-flex"
    >
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <button
          key={optionValue}
          type="button"
          role="radio"
          aria-checked={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
            value === optionValue
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
          )}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  </div>
);

const DishGrid = ({ dishes: allDishes, withStatusFilter = false }: DishGridProps) => {
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const dishes =
    withStatusFilter && statusFilter !== "all"
      ? allDishes.filter((d) => d.status === statusFilter)
      : allDishes;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3 sm:p-4">
        <SegmentedControl
          icon={Layers}
          label="Group by"
          options={GROUP_OPTIONS}
          value={groupBy}
          onChange={setGroupBy}
        />
        {withStatusFilter && (
          <SegmentedControl
            icon={ListFilter}
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        )}
      </div>

      {dishes.length === 0 && <p className="text-sm text-muted-foreground">No dishes yet.</p>}

      {groupBy === "none" ? (
        <CardGrid>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} showCountry />
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
                <DishCard key={dish.id} dish={dish} showCountry={groupBy !== "country"} />
              ))}
            </CardGrid>
          </section>
        ))
      )}
    </div>
  );
};

export default DishGrid;
