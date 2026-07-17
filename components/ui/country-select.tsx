"use client";

import * as React from "react";
import { anyaround } from "anyaround";
import { ChevronDown, X } from "lucide-react";
import { COUNTRY_CODES } from "@/lib/countries";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CountrySelectProps = {
  id?: string;
  name?: string;
  value: string; // alpha-2 code or ""
  onChange: (code: string) => void;
  placeholder?: string;
};

function CountrySelect({
  id,
  name,
  value,
  onChange,
  placeholder = "Search country…",
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlighted, setHighlighted] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const countries = React.useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        code,
        label: anyaround(code, { mode: "region", display: "flag-name" }),
      })).sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      ({ code, label }) => label.toLowerCase().includes(q) || code.toLowerCase() === q
    );
  }, [countries, query]);

  const selected = countries.find((c) => c.code === value);

  React.useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const pick = (code: string) => {
    onChange(code);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative" data-slot="country-select">
      {name && <input type="hidden" name={name} value={value} />}
      {selected && !open ? (
        <button
          type="button"
          id={id}
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-card px-4 py-3 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/30"
        >
          <span>{selected.label}</span>
          <span className="flex items-center gap-1">
            <span
              role="button"
              aria-label="Clear country"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </span>
        </button>
      ) : (
        <>
          <Input
            id={id}
            role="combobox"
            aria-expanded={open}
            placeholder={placeholder}
            value={query}
            onFocus={() => {
              setOpen(true);
              setHighlighted(0);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlighted(0);
            }}
            onKeyDown={(e) => {
              if (!open) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlighted((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (filtered[highlighted]) pick(filtered[highlighted].code);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
          />
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        </>
      )}

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover py-1 shadow-[var(--shadow-floating)]"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-sm text-muted-foreground">No countries found</li>
          )}
          {filtered.map(({ code, label }, index) => (
            <li
              key={code}
              role="option"
              aria-selected={code === value}
              onPointerDown={(e) => {
                e.preventDefault();
                pick(code);
              }}
              onPointerMove={() => setHighlighted(index)}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm",
                index === highlighted && "bg-accent text-accent-foreground",
                code === value && "font-medium"
              )}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { CountrySelect };
