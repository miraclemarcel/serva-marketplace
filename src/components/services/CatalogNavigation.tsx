"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { servicesHref } from "@/lib/filters";
import type { Filters } from "@/lib/types";

type Ctx = { market: string; filters: Filters; pending: boolean; update: (patch: Partial<Filters>) => void };

const CatalogContext = createContext<Ctx | null>(null);

/**
 * Owns URL navigation for the catalogue so every control keeps filters in the
 * URL (shareable + indexable) and the result grid can show a pending state.
 */
export function CatalogNavigation({ market, filters, children }: { market: string; filters: Filters; children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, page: 1, ...patch };
    startTransition(() => router.push(servicesHref(market, next), { scroll: false }));
  };

  return <CatalogContext.Provider value={{ market, filters, pending, update }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogNavigation>");
  return ctx;
}

export function PendingRegion({ children }: { children: ReactNode }) {
  const { pending } = useCatalog();
  return (
    <div aria-busy={pending} className={`transition-opacity duration-200 ${pending ? "pointer-events-none opacity-50" : ""}`}>
      {children}
    </div>
  );
}
