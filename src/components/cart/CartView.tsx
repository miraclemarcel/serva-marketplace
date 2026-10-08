"use client";

import { ArrowRight, Lock, ShoppingBag, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import { useHydrated, useMarket } from "@/components/MarketProvider";
import { formatMoney } from "@/lib/pricing";
import { computeTotals, useCart } from "@/store/cart";
import { CartLine } from "./CartLine";
import { TotalsTable } from "./OrderSummary";

export function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]" role="status" aria-label="Loading cart">
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton h-28 rounded-3xl" />
        ))}
      </div>
      <div className="skeleton h-80 rounded-4xl" />
    </div>
  );
}

export function EmptyCart() {
  const market = useMarket();
  return (
    <div className="flex flex-col items-center rounded-4xl bg-white px-6 py-20 text-center shadow-card ring-1 ring-line/60">
      <div className="relative">
        <div className="grid size-24 place-items-center rounded-full bg-violet-soft">
          <ShoppingBag className="size-10 text-violet" aria-hidden />
        </div>
        <Sparkles className="absolute -top-1 -right-2 size-7 text-sun" aria-hidden />
      </div>
      <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
      <p className="mt-2 max-w-sm text-muted">
        Start with a logo, grab some merch, or plan your next event backdrop — we&apos;ll keep everything on brand.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/${market.code}/services`} className="btn-primary">
          Explore services <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href={`/${market.code}/services?sale=1`} className="btn-ghost">
          See current offers
        </Link>
      </div>
    </div>
  );
}

export function CartView() {
  const market = useMarket();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  if (!hydrated) return <CartSkeleton />;
  if (!items.length) return <EmptyCart />;

  const totals = computeTotals(items, market.code);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <section aria-labelledby="cart-items-heading" className="rounded-4xl bg-white px-5 py-2 shadow-card ring-1 ring-line/60 sm:px-8">
        <div className="flex items-center justify-between border-b border-line py-4">
          <h2 id="cart-items-heading" className="font-semibold">
            {items.length} {items.length === 1 ? "service" : "services"}
          </h2>
          <button type="button" onClick={clear} className="text-sm font-medium text-muted hover:text-coral-deep">
            Clear cart
          </button>
        </div>
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <CartLine key={item.key} item={item} />
          ))}
        </ul>
      </section>

      <aside aria-labelledby="summary-heading" className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 lg:sticky lg:top-28">
        <h2 id="summary-heading" className="mb-4 text-lg font-bold">
          Order summary
        </h2>
        {totals.freeShippingRemaining > 0 && (
          <div className="mb-4 rounded-2xl bg-sun-soft p-3 text-xs text-sun-deep">
            <p className="flex items-center gap-1.5 font-semibold">
              <Truck className="size-4" aria-hidden /> {formatMoney(totals.freeShippingRemaining, market)} away from free delivery
            </p>
          </div>
        )}
        <TotalsTable totals={totals} />
        <Link href={`/${market.code}/checkout`} className="btn-primary mt-6 w-full py-4 text-base">
          Proceed to checkout <ArrowRight className="size-4" aria-hidden />
        </Link>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Lock className="size-3.5" aria-hidden /> Secure checkout · Free proofs on every order
        </p>
      </aside>
    </div>
  );
}
