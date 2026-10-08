"use client";

import { ArrowUpRight, Loader2, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { ServiceSummary } from "@/app/api/services/route";
import { ServiceArt } from "@/components/art/ServiceArt";
import { useMarket } from "@/components/MarketProvider";
import { CATEGORY_MAP } from "@/lib/taxonomy";

type Props = { size?: "md" | "lg"; placeholder?: string; autoFocus?: boolean; onNavigate?: () => void };

/**
 * Accessible combobox with instant, typo-tolerant suggestions served by
 * /api/services. Falls back to a plain GET form without JavaScript.
 */
export function SearchBox({ size = "md", placeholder = "Search logos, mugs, banners…", autoFocus, onNavigate }: Props) {
  const market = useMarket();
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [results, setResults] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const action = `/${market.code}/services`;

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/services?q=${encodeURIComponent(q)}&market=${market.code}&limit=6`, {
          signal: ctrl.signal,
        });
        if (res.ok) setResults((await res.json()).items);
      } catch {
        /* aborted or offline — keep previous suggestions */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 140);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, market.code]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const trimmed = query.trim();
  const options = trimmed
    ? results.map((r) => ({ key: r.slug, href: `/${market.code}/services/${r.slug}`, item: r }))
    : market.popularSearches.map((p) => ({
        key: p,
        href: `${action}?q=${encodeURIComponent(p)}`,
        item: null,
        label: p,
      }));

  const go = (href: string) => {
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && options[active]) return go(options[active].href);
    go(trimmed ? `${action}?q=${encodeURIComponent(trimmed)}` : action);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const n = options.length;
      if (!n) return;
      setActive((a) => (e.key === "ArrowDown" ? (a + 1) % n : (a - 1 + n) % n));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const lg = size === "lg";
  const showList = open && (options.length > 0 || (trimmed && !loading));

  return (
    <div ref={wrapper} className="relative w-full">
      <form role="search" action={action} onSubmit={onSubmit} className="relative">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search services
        </label>
        <Search
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${lg ? "left-5 size-5" : "left-4 size-4"}`}
          aria-hidden
        />
        <input
          id={`${listId}-input`}
          name="q"
          type="search"
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={!!showList}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
            if (!e.target.value.trim()) setResults([]);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`w-full rounded-full border border-line bg-white text-ink placeholder:text-muted/80 transition outline-none focus:border-violet focus:ring-4 focus:ring-violet/15 [&::-webkit-search-cancel-button]:hidden ${
            lg ? "h-16 pr-36 pl-13 text-base shadow-lift" : "h-11 pr-4 pl-11 text-sm"
          }`}
        />
        {lg && (
          <button type="submit" className="btn-primary absolute top-2 right-2 bottom-2 px-6">
            Search
          </button>
        )}
        {loading && !lg && (
          <Loader2 className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-muted" aria-hidden />
        )}
      </form>

      {showList && (
        <div
          className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
          aria-live="polite"
        >
          {!trimmed && (
            <p className="flex items-center gap-1.5 px-4 pt-3 pb-1 text-xs font-semibold tracking-wider text-muted uppercase">
              <TrendingUp className="size-3.5" aria-hidden /> Popular in {market.country}
            </p>
          )}
          <ul id={`${listId}-list`} role="listbox" aria-label="Search suggestions" className="max-h-[60vh] overflow-auto p-2">
            {options.map((o, i) => (
              <li
                key={o.key}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={active === i}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => go(o.href)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 ${active === i ? "bg-violet-soft" : ""}`}
              >
                {o.item ? (
                  <>
                    <ServiceArt
                      kind={o.item.art.kind}
                      palette={o.item.art.palette}
                      title=""
                      className="size-11 shrink-0 rounded-lg"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{o.item.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {CATEGORY_MAP[o.item.category].label} · from {o.item.fromFormatted}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 text-muted" aria-hidden />
                  </>
                ) : (
                  <>
                    <Search className="ml-1 size-4 text-muted" aria-hidden />
                    <span className="text-sm text-ink">{"label" in o ? o.label : ""}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          {trimmed && !loading && results.length === 0 && (
            <p className="px-4 pb-4 text-sm text-muted">
              No instant matches for “{trimmed}”. Press Enter to search everything.
            </p>
          )}
          {trimmed && results.length > 0 && (
            <button
              type="button"
              onClick={() => go(`${action}?q=${encodeURIComponent(trimmed)}`)}
              className="w-full border-t border-line px-4 py-3 text-left text-sm font-semibold text-violet hover:bg-violet-soft"
            >
              See all results for “{trimmed}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
