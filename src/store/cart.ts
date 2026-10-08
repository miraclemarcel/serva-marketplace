"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getMarket, type MarketCode } from "@/lib/markets";
import { convert, linePrice, round, type PriceInput } from "@/lib/pricing";
import type { ArtKind, CategoryId } from "@/lib/types";

export type Selection = { groupId: string; group: string; choiceId: string; choice: string };

export type CartItem = {
  /** slug + selected options; identical configurations merge. */
  key: string;
  slug: string;
  name: string;
  category: CategoryId;
  unit: string;
  art: { kind: ArtKind; palette: [string, string, string, string] };
  selections: Selection[];
  quantity: number;
  rules: { min: number; max: number; step: number };
  pricing: PriceInput;
  turnaroundDays: number;
};

export type OrderSnapshot = {
  id: string;
  placedAt: string;
  market: MarketCode;
  customer: { name: string; email: string; company?: string; phone?: string; notes?: string; address?: string };
  lines: { name: string; slug: string; selections: string; quantity: number; unit: number; total: number }[];
  totals: Totals;
  eta: number;
};

export type Totals = {
  itemCount: number;
  /** Before offers and volume discounts. */
  listSubtotal: number;
  /** After offers and volume discounts; tax applies to this. */
  subtotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
  hasPhysical: boolean;
  freeShippingRemaining: number;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  lastOrder: OrderSnapshot | null;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity: number) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  placeOrder: (market: MarketCode, customer: OrderSnapshot["customer"]) => OrderSnapshot;
};

const keyFor = (slug: string, selections: Selection[]) =>
  [slug, ...selections.map((s) => `${s.groupId}:${s.choiceId}`)].join("|");

const clamp = (q: number, r: CartItem["rules"]) => {
  const snapped = r.min + Math.round((q - r.min) / r.step) * r.step;
  return Math.min(r.max, Math.max(r.min, snapped));
};

const PHYSICAL: CategoryId[] = ["gifts", "prints"];

/** Derives localised totals for a set of cart items. */
export function computeTotals(items: CartItem[], code: MarketCode): Totals {
  const market = getMarket(code);
  let subtotal = 0;
  let savings = 0;
  let physicalSubtotal = 0;
  for (const item of items) {
    const p = linePrice(item.pricing, item.quantity, market);
    subtotal += p.total;
    savings += p.savings;
    if (PHYSICAL.includes(item.category)) physicalSubtotal += p.total;
  }
  subtotal = round(subtotal, market);
  const hasPhysical = physicalSubtotal > 0;
  const freeOver = convert(market.shipping.freeOverUSD, market);
  const shipping = hasPhysical && physicalSubtotal < freeOver ? convert(market.shipping.flatUSD, market) : 0;
  const tax = round(subtotal * market.tax.rate, market);
  return {
    itemCount: items.length,
    listSubtotal: round(subtotal + savings, market),
    subtotal,
    savings: round(savings, market),
    shipping,
    tax,
    total: round(subtotal + shipping + tax, market),
    hasPhysical,
    freeShippingRemaining: hasPhysical ? Math.max(0, round(freeOver - physicalSubtotal, market)) : 0,
  };
}

export const describeSelections = (s: Selection[]) => s.map((x) => x.choice).join(" · ");

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      lastOrder: null,

      addItem: (item, quantity) => {
        const key = keyFor(item.slug, item.selections);
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) =>
                i.key === key ? { ...i, quantity: clamp(i.quantity + quantity, i.rules) } : i,
              )
            : [...state.items, { ...item, key, quantity: clamp(quantity, item.rules) }];
          return { items };
        });
      },

      removeItem: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),

      setQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, quantity: clamp(quantity, i.rules) } : i)),
        })),

      increment: (key) => {
        const item = get().items.find((i) => i.key === key);
        if (item) get().setQuantity(key, item.quantity + item.rules.step);
      },

      decrement: (key) => {
        const item = get().items.find((i) => i.key === key);
        if (item) get().setQuantity(key, item.quantity - item.rules.step);
      },

      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      placeOrder: (code, customer) => {
        const market = getMarket(code);
        const { items } = get();
        const order: OrderSnapshot = {
          id: `SRV-${Date.now().toString(36).toUpperCase().slice(-6)}`,
          placedAt: new Date().toISOString(),
          market: code,
          customer,
          lines: items.map((i) => {
            const p = linePrice(i.pricing, i.quantity, market);
            return {
              name: i.name,
              slug: i.slug,
              selections: describeSelections(i.selections),
              quantity: i.quantity,
              unit: p.unit,
              total: p.total,
            };
          }),
          totals: computeTotals(items, code),
          eta: Math.max(0, ...items.map((i) => i.turnaroundDays)),
        };
        set({ items: [], lastOrder: order, drawerOpen: false });
        return order;
      },
    }),
    {
      name: "serva-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, lastOrder: s.lastOrder }),
    },
  ),
);
