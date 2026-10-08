import type { NextRequest } from "next/server";
import { queryServices, startingPrice } from "@/lib/catalog";
import { parseFilters } from "@/lib/filters";
import { getMarket } from "@/lib/markets";
import { convert, formatMoney } from "@/lib/pricing";
import type { Service } from "@/lib/types";

export type ServiceSummary = Pick<Service, "slug" | "name" | "category" | "tagline" | "art" | "badge" | "rating"> & {
  from: number;
  fromFormatted: string;
};

/**
 * GET /api/services?q=&category=&useCase=&industry=&urgency=&sale=&sort=&page=&market=&limit=
 * Mock catalogue endpoint with localised pricing.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const market = getMarket(sp.get("market") ?? "");
  const limit = Math.min(48, Math.max(1, Number(sp.get("limit")) || 12));

  try {
    const result = await queryServices(parseFilters(sp));
    const items: ServiceSummary[] = result.items.slice(0, limit).map((s) => {
      const from = convert(startingPrice(s), market);
      return {
        slug: s.slug,
        name: s.name,
        category: s.category,
        tagline: s.tagline,
        art: s.art,
        badge: s.badge,
        rating: s.rating,
        from,
        fromFormatted: formatMoney(from, market, { trim: true }),
      };
    });
    return Response.json({
      market: market.code,
      currency: market.currency,
      total: result.total,
      page: result.page,
      pageCount: result.pageCount,
      approximate: result.approximate,
      facets: result.facets,
      items,
    });
  } catch {
    return Response.json({ error: "Unable to load services" }, { status: 500 });
  }
}
