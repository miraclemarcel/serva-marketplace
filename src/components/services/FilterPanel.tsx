"use client";

import { Check, SlidersHorizontal, X } from "lucide-react";
import { useId, useRef } from "react";
import { activeFilterCount } from "@/lib/filters";
import { INDUSTRIES, URGENCIES, USE_CASES } from "@/lib/taxonomy";
import type { FacetCounts, Filters } from "@/lib/types";
import { useCatalog } from "./CatalogNavigation";

type Group = {
  key: "useCase" | "industry" | "urgency";
  title: string;
  options: { id: string; label: string; hint?: string }[];
};

const GROUPS: Group[] = [
  { key: "urgency", title: "Turnaround", options: URGENCIES },
  { key: "useCase", title: "Use case", options: USE_CASES },
  { key: "industry", title: "Industry", options: INDUSTRIES },
];

function Panel({ facets, onDone }: { facets: FacetCounts; onDone?: () => void }) {
  const { filters, market, update } = useCatalog();
  const uid = useId();

  const toggle = (key: Group["key"], id: string) => {
    const current = filters[key] as string[];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    update({ [key]: next } as Partial<Filters>);
  };

  return (
    // GET form keeps filtering usable without JavaScript.
    <form action={`/${market}/services`} method="get" className="space-y-7" onSubmit={(e) => (e.preventDefault(), onDone?.())}>
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      {filters.category && <input type="hidden" name="category" value={filters.category} />}
      {filters.sort !== "popular" && <input type="hidden" name="sort" value={filters.sort} />}

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-coral-soft px-4 py-3">
        <span>
          <span className="block text-sm font-semibold text-coral-deep">Deals & offers</span>
          <span className="block text-xs text-ink-soft">{facets.sale} services on offer</span>
        </span>
        <input
          type="checkbox"
          name="sale"
          value="1"
          role="switch"
          checked={filters.sale}
          onChange={() => update({ sale: !filters.sale })}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-6 w-11 shrink-0 rounded-full bg-ink/20 transition peer-checked:bg-coral peer-focus-visible:ring-4 peer-focus-visible:ring-coral/30 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
        />
      </label>

      {GROUPS.map((group) => {
        const counts = facets[group.key];
        const selected = filters[group.key] as string[];
        return (
          <fieldset key={group.key}>
            <legend className="mb-3 text-sm font-semibold text-ink">{group.title}</legend>
            <ul className="space-y-1">
              {group.options.map((o) => {
                const id = `${uid}-${group.key}-${o.id}`;
                const count = counts[o.id] ?? 0;
                const checked = selected.includes(o.id);
                return (
                  <li key={o.id}>
                    <label
                      htmlFor={id}
                      className={`group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm transition hover:bg-white ${
                        !count && !checked ? "opacity-45" : ""
                      }`}
                    >
                      <input
                        id={id}
                        type="checkbox"
                        name={group.key}
                        value={o.id}
                        checked={checked}
                        disabled={!count && !checked}
                        onChange={() => toggle(group.key, o.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="grid size-5 shrink-0 place-items-center rounded-md border-2 border-line bg-white transition peer-checked:border-violet peer-checked:bg-violet peer-focus-visible:ring-4 peer-focus-visible:ring-violet/25"
                      >
                        <Check className="size-3.5 text-white" strokeWidth={3} />
                      </span>
                      <span className="flex-1 text-ink-soft group-hover:text-ink">
                        {o.label}
                        {o.hint && <span className="block text-xs text-muted">{o.hint}</span>}
                      </span>
                      <span className="text-xs text-muted tabular-nums">{count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
      <noscript>
        <button type="submit" className="btn-dark w-full">
          Apply filters
        </button>
      </noscript>
    </form>
  );
}

export function FilterSidebar({ facets }: { facets: FacetCounts }) {
  const { filters, update } = useCatalog();
  const count = activeFilterCount(filters);
  return (
    <div className="sticky top-28 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-6 [scrollbar-width:thin] lg:block">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="size-4" aria-hidden /> Filters
        </h2>
        {count > 0 && (
          <button
            type="button"
            onClick={() => update({ category: null, useCase: [], industry: [], urgency: [], sale: false })}
            className="text-xs font-semibold text-violet hover:underline"
          >
            Clear all ({count})
          </button>
        )}
      </div>
      <Panel facets={facets} />
    </div>
  );
}

export function MobileFilters({ facets, total }: { facets: FacetCounts; total: number }) {
  const { filters, update, pending } = useCatalog();
  const ref = useRef<HTMLDialogElement>(null);
  const count = activeFilterCount(filters) - (filters.category ? 1 : 0);
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="btn-ghost h-11 py-0 lg:hidden" aria-haspopup="dialog">
        <SlidersHorizontal className="size-4" aria-hidden /> Filters
        {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-violet text-[11px] text-white">{count}</span>}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="mobile-filters-title"
        onClick={(e) => e.target === ref.current && close()}
        className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[88dvh] w-full max-w-none rounded-t-4xl bg-paper p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="mobile-filters-title" className="text-lg font-bold">
            Filters
          </h2>
          <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full bg-white" aria-label="Close filters">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <Panel facets={facets} onDone={close} />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-line bg-white px-5 py-4">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => update({ useCase: [], industry: [], urgency: [], sale: false })}
          >
            Reset
          </button>
          <button type="button" className="btn-primary" onClick={close}>
            {pending ? "Updating…" : `Show ${total} results`}
          </button>
        </div>
      </dialog>
    </>
  );
}

