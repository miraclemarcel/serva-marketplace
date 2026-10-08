"use client";

import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { SORTS } from "@/lib/taxonomy";
import { useCatalog } from "./CatalogNavigation";

/** Styled, keyboard-accessible sort menu (replaces the native <select>). */
export function SortSelect() {
  const { filters, update } = useCatalog();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = SORTS.find((s) => s.id === filters.sort) ?? SORTS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openMenu = () => {
    setActive(Math.max(0, SORTS.findIndex((s) => s.id === filters.sort)));
    setOpen(true);
  };

  const choose = (i: number) => {
    setOpen(false);
    button.current?.focus();
    if (SORTS[i].id !== filters.sort) update({ sort: SORTS[i].id });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + SORTS.length) % SORTS.length);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(e.key === "Home" ? 0 : SORTS.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <div ref={wrapper} className="relative flex-1 sm:flex-none">
      <button
        ref={button}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={`Sort by: ${current.label}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex h-11 w-full items-center gap-2 rounded-full border bg-white pr-3 pl-4 text-sm transition sm:w-auto sm:min-w-52 ${
          open ? "border-violet ring-4 ring-violet/15" : "border-line hover:border-ink/30"
        }`}
      >
        <ArrowUpDown className="size-4 shrink-0 text-muted" aria-hidden />
        <span className="hidden text-muted sm:inline">Sort:</span>
        <span className="flex-1 truncate text-left font-semibold text-ink">{current.label}</span>
        <ChevronDown className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sort services"
          className="absolute top-full right-0 z-30 mt-2 w-full min-w-56 origin-top-right animate-pop rounded-2xl border border-line bg-white p-1.5 shadow-lift"
        >
          {SORTS.map((s, i) => {
            const selected = s.id === filters.sort;
            return (
              <li
                key={s.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  active === i ? "bg-violet-soft" : ""
                } ${selected ? "font-semibold text-violet-deep" : "text-ink"}`}
              >
                {s.label}
                {selected && <Check className="size-4 text-violet" aria-hidden />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
