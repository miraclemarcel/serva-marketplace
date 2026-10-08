import { Search, SearchX, Sparkles, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogNavigation, PendingRegion } from "@/components/services/CatalogNavigation";
import { FilterSidebar, MobileFilters } from "@/components/services/FilterPanel";
import { Pagination } from "@/components/services/Pagination";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SortSelect } from "@/components/services/SortSelect";
import { queryServices } from "@/lib/catalog";
import { parseFilters, servicesHref, toQueryString } from "@/lib/filters";
import { getMarket, MARKET_LIST, type Market } from "@/lib/markets";
import { CATEGORIES, CATEGORY_MAP, INDUSTRIES, URGENCIES, USE_CASES, labelOf } from "@/lib/taxonomy";
import type { Filters } from "@/lib/types";
import { CatalogSkeleton } from "./CatalogSkeleton";

export async function generateMetadata({ params, searchParams }: PageProps<"/[market]/services">): Promise<Metadata> {
  const market = getMarket((await params).market);
  const filters = parseFilters(await searchParams);
  const cat = filters.category ? CATEGORY_MAP[filters.category] : null;

  const title = filters.q
    ? `“${filters.q}” — search results`
    : cat
      ? `${cat.label} services in ${market.country}`
      : `All branding services in ${market.country}`;
  const description = cat
    ? `${cat.blurb} Order online in ${market.currency} with fast turnaround across ${market.country}.`
    : `Browse logo design, branded merch, prints and studio services with prices in ${market.currency}. Filter by category, use case, industry and turnaround.`;

  // Canonical keeps indexable dimensions (category, page) and drops volatile ones.
  const canonicalQs = toQueryString({ category: filters.category, page: filters.page });
  return {
    title,
    description,
    alternates: {
      canonical: `/${market.code}/services${canonicalQs}`,
      languages: Object.fromEntries(MARKET_LIST.map((m) => [m.locale, `/${m.code}/services${canonicalQs}`])),
    },
    robots: filters.q ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: `/${market.code}/services${canonicalQs}` },
  };
}

export default async function ServicesPage({ params, searchParams }: PageProps<"/[market]/services">) {
  const market = getMarket((await params).market);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-violet-soft via-paper to-pink-soft">
        <div aria-hidden className="absolute -top-24 -right-20 size-80 rounded-full bg-sun/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-teal/20 blur-3xl" />
        <div className="relative container-x py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href={`/${market.code}`} className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="font-medium text-ink">
                Services
              </li>
            </ol>
          </nav>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Everything your brand needs, <span className="text-gradient">in one place.</span>
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Transparent prices in {market.currency}, free proofs on every physical order, and delivery across{" "}
            {market.country}.
          </p>
        </div>
      </section>

      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog market={market} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Catalog({
  market,
  searchParams,
}: {
  market: Market;
  searchParams: PageProps<"/[market]/services">["searchParams"];
}) {
  const filters = parseFilters(await searchParams);
  const result = await queryServices(filters);
  const m = market.code;
  const first = (result.page - 1) * result.perPage + 1;
  const last = first + result.items.length - 1;
  const allCount = Object.values(result.facets.category).reduce((a, b) => a + b, 0);

  return (
    <CatalogNavigation market={m} filters={filters}>
      <div className="container-x py-8 sm:py-10">
        {/* Category tabs are real links: crawlable and shareable. */}
        <nav aria-label="Service categories" className="-mx-4 mb-6 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-2">
            <li>
              <Link
                href={servicesHref(m, { ...filters, category: null, page: 1 })}
                scroll={false}
                aria-current={!filters.category ? "page" : undefined}
                className={`chip ${!filters.category ? "chip-active" : ""}`}
              >
                All <span className="opacity-60">{allCount}</span>
              </Link>
            </li>
            {CATEGORIES.map((c) => {
              const active = filters.category === c.id;
              return (
                <li key={c.id}>
                  <Link
                    href={servicesHref(m, { ...filters, category: c.id, page: 1 })}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={`chip ${active ? "chip-active" : ""}`}
                  >
                    <span className={`size-2 rounded-full ${c.tone.bg}`} aria-hidden />
                    {c.label} <span className="opacity-60">{result.facets.category[c.id] ?? 0}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:gap-12">
          <aside aria-label="Filters" className="hidden lg:block">
            <FilterSidebar facets={result.facets} />
          </aside>

          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <form action={`/${m}/services`} role="search" className="relative flex-1">
                <label htmlFor="catalog-q" className="sr-only">
                  Search within services
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  id="catalog-q"
                  key={filters.q}
                  name="q"
                  type="search"
                  defaultValue={filters.q}
                  placeholder="Try “tee for event” or “bussiness card”"
                  className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-11 text-sm outline-none focus:border-violet focus:ring-4 focus:ring-violet/15"
                />
                {filters.category && <input type="hidden" name="category" value={filters.category} />}
                {filters.useCase.length > 0 && <input type="hidden" name="useCase" value={filters.useCase.join(",")} />}
                {filters.industry.length > 0 && <input type="hidden" name="industry" value={filters.industry.join(",")} />}
                {filters.urgency.length > 0 && <input type="hidden" name="urgency" value={filters.urgency.join(",")} />}
                {filters.sale && <input type="hidden" name="sale" value="1" />}
                {filters.sort !== "popular" && <input type="hidden" name="sort" value={filters.sort} />}
              </form>
              <div className="flex gap-2">
                <MobileFilters facets={result.facets} total={result.total} />
                <SortSelect />
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <h2 id="results-heading" className="mr-2 text-sm text-muted" aria-live="polite">
                {result.total > 0 ? (
                  <>
                    Showing{" "}
                    <strong className="text-ink">
                      {first}–{last}
                    </strong>{" "}
                    of <strong className="text-ink">{result.total}</strong> services
                    {filters.q && (
                      <>
                        {" "}
                        for <strong className="text-ink">“{filters.q}”</strong>
                      </>
                    )}
                  </>
                ) : (
                  "No services found"
                )}
              </h2>
              <ActiveFilters market={m} filters={filters} />
            </div>

            {result.approximate && (
              <p className="mb-6 flex items-start gap-2 rounded-2xl bg-sun-soft px-4 py-3 text-sm text-sun-deep">
                <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
                No exact match for “{filters.q}”, so we&apos;re showing the closest services instead.
              </p>
            )}

            <PendingRegion>
              {result.items.length ? (
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {result.items.map((s) => (
                    <li key={s.id} className="grid">
                      <ServiceCard service={s} market={market} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState market={m} filters={filters} />
              )}
            </PendingRegion>

            <Pagination market={m} filters={filters} page={result.page} pageCount={result.pageCount} />
          </section>
        </div>
      </div>
    </CatalogNavigation>
  );
}

function ActiveFilters({ market, filters }: { market: string; filters: Filters }) {
  const chips: { label: string; href: string }[] = [];
  const without = (patch: Partial<Filters>) => servicesHref(market, { ...filters, ...patch, page: 1 });
  if (filters.q) chips.push({ label: `“${filters.q}”`, href: without({ q: "" }) });
  if (filters.sale) chips.push({ label: "On offer", href: without({ sale: false }) });
  for (const u of filters.urgency)
    chips.push({ label: labelOf(URGENCIES, u), href: without({ urgency: filters.urgency.filter((x) => x !== u) }) });
  for (const u of filters.useCase)
    chips.push({ label: labelOf(USE_CASES, u), href: without({ useCase: filters.useCase.filter((x) => x !== u) }) });
  for (const i of filters.industry)
    chips.push({
      label: labelOf(INDUSTRIES, i),
      href: without({ industry: filters.industry.filter((x) => x !== i) }),
    });
  if (!chips.length) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.label}>
          <Link
            href={c.href}
            scroll={false}
            className="inline-flex items-center gap-1 rounded-full bg-violet-soft px-3 py-1 text-xs font-semibold text-violet-deep hover:bg-violet hover:text-white"
          >
            {c.label}
            <X className="size-3" aria-hidden />
            <span className="sr-only">Remove filter</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ market, filters }: { market: string; filters: Filters }) {
  return (
    <div className="flex flex-col items-center rounded-4xl border-2 border-dashed border-line bg-white px-6 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-violet-soft">
        <SearchX className="size-9 text-violet" aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-bold">Nothing matches those filters — yet</h3>
      <p className="mt-2 max-w-md text-sm text-muted">
        Try removing a filter or searching for something broader. Our team can also quote custom projects.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={servicesHref(market, { q: filters.q })} className="btn-primary">
          Clear filters
        </Link>
        <Link href={servicesHref(market)} className="btn-ghost">
          View all services
        </Link>
      </div>
    </div>
  );
}
