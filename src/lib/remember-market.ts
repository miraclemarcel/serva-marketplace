import { MARKET_COOKIE, type MarketCode } from "./markets";

/** Persists the visitor's market choice so the proxy redirects "/" correctly. */
export function rememberMarket(code: MarketCode) {
  document.cookie = `${MARKET_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
}
