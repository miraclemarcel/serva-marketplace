import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_TO_MARKET, DEFAULT_MARKET, isMarketCode, MARKET_COOKIE, type MarketCode } from "@/lib/markets";

/** Picks a market from the saved preference, then edge geo headers; defaults to Nigeria. */
function preferredMarket(request: NextRequest): MarketCode {
  const saved = request.cookies.get(MARKET_COOKIE)?.value;
  if (isMarketCode(saved)) return saved;

  const country =
    request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? undefined;
  if (country && COUNTRY_TO_MARKET[country.toUpperCase()]) return COUNTRY_TO_MARKET[country.toUpperCase()];

  return DEFAULT_MARKET;
}

/**
 * Subfolder market routing (/ng, /us, /gb, /ca). Unprefixed URLs redirect to
 * the visitor's market; prefixed URLs pass through untouched for SEO.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isMarketCode(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredMarket(request)}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip API routes, Next internals and files with an extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
