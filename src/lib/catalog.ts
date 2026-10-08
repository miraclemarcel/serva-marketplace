import { cacheLife, cacheTag } from "next/cache";
import rawServices from "@/data/services.json";
import { PER_PAGE } from "./filters";
import { searchServices } from "./search";
import { CATEGORIES } from "./taxonomy";
import type { CategoryId, FacetCounts, Filters, SearchResult, Service } from "./types";

/**
 * Mock catalogue API. In production these functions would call a CMS or
 * commerce backend; `use cache` keeps the same contract either way.
 */
const SERVICES = rawServices as Service[];

export const startingPrice = (s: Service) => s.basePrice * (1 - (s.discount?.percent ?? 0) / 100);

export async function getAllServices(): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");
  return SERVICES;
}

export async function getService(slug: string): Promise<Service | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("services", `service:${slug}`);
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

export async function getServicesBySlugs(slugs: string[]): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");
  return slugs.map((slug) => SERVICES.find((s) => s.slug === slug)).filter((s): s is Service => !!s);
}

type Dimension = "category" | "useCase" | "industry" | "urgency" | "sale";

function matches(s: Service, f: Filters, skip?: Dimension) {
  if (skip !== "category" && f.category && s.category !== f.category) return false;
  if (skip !== "useCase" && f.useCase.length && !f.useCase.some((u) => s.useCases.includes(u))) return false;
  if (skip !== "industry" && f.industry.length && !f.industry.some((i) => s.industries.includes(i)))
    return false;
  if (skip !== "urgency" && f.urgency.length && !f.urgency.includes(s.urgency)) return false;
  if (skip !== "sale" && f.sale && !s.discount) return false;
  return true;
}

function countBy(items: Service[], pick: (s: Service) => string[]) {
  const counts: Record<string, number> = {};
  for (const s of items) for (const key of pick(s)) counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}

export async function queryServices(filters: Filters): Promise<SearchResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  const { hits, approximate } = searchServices(SERVICES, filters.q);
  const pool = hits.map((h) => h.service);
  const relevance = new Map(hits.map((h) => [h.service.id, h.score]));

  const facets: FacetCounts = {
    category: countBy(pool.filter((s) => matches(s, filters, "category")), (s) => [s.category]),
    useCase: countBy(pool.filter((s) => matches(s, filters, "useCase")), (s) => s.useCases),
    industry: countBy(pool.filter((s) => matches(s, filters, "industry")), (s) => s.industries),
    urgency: countBy(pool.filter((s) => matches(s, filters, "urgency")), (s) => [s.urgency]),
    sale: pool.filter((s) => matches(s, filters, "sale") && s.discount).length,
  };

  const filtered = pool.filter((s) => matches(s, filters));

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return startingPrice(a) - startingPrice(b);
      case "price-desc":
        return startingPrice(b) - startingPrice(a);
      case "rating":
        return b.rating - a.rating || b.reviews - a.reviews;
      case "newest":
        return b.createdAt.localeCompare(a.createdAt);
      default:
        // With a query, relevance leads and popularity breaks ties.
        return (
          (filters.q ? (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0) : 0) ||
          b.popularity - a.popularity
        );
    }
  });

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(filters.page, pageCount);

  return {
    items: sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    total,
    page,
    pageCount,
    perPage: PER_PAGE,
    approximate,
    facets,
  };
}

/** Same-category services, ranked by overlapping use cases and popularity. */
export async function getRelated(service: Service, limit = 4): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");
  return SERVICES.filter((s) => s.category === service.category && s.id !== service.id)
    .map((s) => ({
      s,
      score: s.useCases.filter((u) => service.useCases.includes(u)).length * 10 + s.popularity / 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
}

export async function getCategoryStats(): Promise<
  Record<CategoryId, { count: number; from: number; top: Service[] }>
> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");
  return Object.fromEntries(
    CATEGORIES.map((c) => {
      const items = SERVICES.filter((s) => s.category === c.id);
      return [
        c.id,
        {
          count: items.length,
          from: Math.min(...items.map(startingPrice)),
          top: [...items].sort((a, b) => b.popularity - a.popularity).slice(0, 3),
        },
      ];
    }),
  ) as Record<CategoryId, { count: number; from: number; top: Service[] }>;
}
