import { market } from "next/root-params";
import { getMarket, isMarketCode, type Market, type MarketCode } from "./markets";

/** The `[market]` root parameter, or null when it isn't a supported market. Server Components only. */
export async function currentMarketCode(): Promise<MarketCode | null> {
  const code = await market();
  return isMarketCode(code) ? code : null;
}

/** The active market for the current route (falls back to the default market). */
export async function currentMarket(): Promise<Market> {
  return getMarket((await market()) ?? "");
}
