import { CATEGORIES, INDUSTRIES, SORTS, URGENCIES, USE_CASES } from "./taxonomy";
import type { CategoryId, Filters, IndustryId, SortId, UrgencyId, UseCaseId } from "./types";

export const PER_PAGE = 12;

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function list<T extends string>(raw: string | string[] | undefined, allowed: readonly { id: T }[]): T[] {
  const ids = new Set(allowed.map((a) => a.id));
  const values = (Array.isArray(raw) ? raw : [raw ?? ""]).flatMap((v) => v.split(","));
  return [...new Set(values.map((v) => v.trim()).filter((v): v is T => ids.has(v as T)))];
}

/** Parses and sanitises URL search params into a typed filter object. */
export function parseFilters(params: RawParams | URLSearchParams): Filters {
  const raw: RawParams =
    params instanceof URLSearchParams
      ? Object.fromEntries([...params.keys()].map((k) => [k, params.getAll(k)]))
      : params;

  const category = first(raw.category);
  const sort = first(raw.sort);
  const page = Number.parseInt(first(raw.page), 10);

  return {
    q: first(raw.q).trim().slice(0, 80),
    category: CATEGORIES.some((c) => c.id === category) ? (category as CategoryId) : null,
    useCase: list<UseCaseId>(raw.useCase, USE_CASES),
    industry: list<IndustryId>(raw.industry, INDUSTRIES),
    urgency: list<UrgencyId>(raw.urgency, URGENCIES),
    sale: first(raw.sale) === "1",
    sort: SORTS.some((s) => s.id === sort) ? (sort as SortId) : "popular",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Serialises filters back to a canonical, shareable query string. */
export function toQueryString(filters: Partial<Filters>): string {
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  if (filters.category) sp.set("category", filters.category);
  if (filters.useCase?.length) sp.set("useCase", filters.useCase.join(","));
  if (filters.industry?.length) sp.set("industry", filters.industry.join(","));
  if (filters.urgency?.length) sp.set("urgency", filters.urgency.join(","));
  if (filters.sale) sp.set("sale", "1");
  if (filters.sort && filters.sort !== "popular") sp.set("sort", filters.sort);
  if (filters.page && filters.page > 1) sp.set("page", String(filters.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function servicesHref(market: string, filters: Partial<Filters> = {}) {
  return `/${market}/services${toQueryString(filters)}`;
}

export function activeFilterCount(f: Filters) {
  return (f.category ? 1 : 0) + f.useCase.length + f.industry.length + f.urgency.length + (f.sale ? 1 : 0);
}
