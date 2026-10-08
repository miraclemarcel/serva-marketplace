import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { servicesHref } from "@/lib/filters";
import type { Filters } from "@/lib/types";

function pages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? (["…", p] as const) : [p]));
}

/** Crawlable, server-rendered pagination using real links. */
export function Pagination({ market, filters, page, pageCount }: { market: string; filters: Filters; page: number; pageCount: number }) {
  if (pageCount <= 1) return null;
  const href = (p: number) => servicesHref(market, { ...filters, page: p });
  const base = "grid size-11 place-items-center rounded-full text-sm font-semibold transition";

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" scroll={false} className={`${base} bg-white ring-1 ring-line hover:ring-ink/30`} aria-label="Previous page">
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={`${base} text-muted/50`} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pages(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            scroll={false}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={`${base} ${p === page ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink/30"}`}
          >
            {p}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link href={href(page + 1)} rel="next" scroll={false} className={`${base} bg-white ring-1 ring-line hover:ring-ink/30`} aria-label="Next page">
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={`${base} text-muted/50`} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
