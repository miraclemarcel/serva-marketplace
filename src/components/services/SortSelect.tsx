"use client";

import { ArrowUpDown } from "lucide-react";
import { SORTS } from "@/lib/taxonomy";
import type { SortId } from "@/lib/types";
import { useCatalog } from "./CatalogNavigation";

export function SortSelect() {
  const { filters, update } = useCatalog();
  return (
    <label className="relative inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white pr-4 pl-4 text-sm">
      <ArrowUpDown className="size-4 text-muted" aria-hidden />
      <span className="sr-only">Sort by</span>
      <select
        value={filters.sort}
        onChange={(e) => update({ sort: e.target.value as SortId })}
        className="cursor-pointer appearance-none bg-transparent pr-1 font-medium text-ink outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
