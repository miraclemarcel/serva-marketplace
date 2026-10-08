"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { getMarket, type Market, type MarketCode } from "@/lib/markets";

const MarketContext = createContext<Market | null>(null);

export function MarketProvider({ code, children }: { code: MarketCode; children: ReactNode }) {
  return <MarketContext.Provider value={getMarket(code)}>{children}</MarketContext.Provider>;
}

export function useMarket(): Market {
  const market = useContext(MarketContext);
  if (!market) throw new Error("useMarket must be used inside <MarketProvider>");
  return market;
}

const noop = () => () => {};

/** True once the client has hydrated — guards persisted (localStorage) state. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
