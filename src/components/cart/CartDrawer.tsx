"use client";

import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useHydrated, useMarket } from "@/components/MarketProvider";
import { formatMoney } from "@/lib/pricing";
import { computeTotals, useCart } from "@/store/cart";
import { CartLine } from "./CartLine";

export function CartButton() {
  const hydrated = useHydrated();
  const count = useCart((s) => s.items.length);
  const open = useCart((s) => s.openDrawer);
  const shown = hydrated ? count : 0;
  return (
    <button
      type="button"
      onClick={open}
      className="relative grid size-11 place-items-center rounded-full bg-ink text-white transition hover:-translate-y-0.5 hover:bg-black"
      aria-label={`Open cart, ${shown} ${shown === 1 ? "item" : "items"}`}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {shown > 0 && (
        <span
          key={shown}
          className="absolute -top-1 -right-1 grid min-w-5 animate-pop place-items-center rounded-full bg-coral px-1 text-[11px] leading-5 font-bold text-white ring-2 ring-paper"
        >
          {shown}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const market = useMarket();
  const isOpen = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Close when the route changes (e.g. after clicking a link inside).
  useEffect(() => {
    close();
  }, [pathname, close]);

  const totals = computeTotals(items, market.code);

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => e.target === ref.current && close()}
      aria-labelledby="cart-drawer-title"
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md bg-white p-0 shadow-lift backdrop:bg-ink/40 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <header className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 id="cart-drawer-title" className="text-lg font-bold">
          Your cart <span className="font-medium text-muted">({items.length})</span>
        </h2>
        <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-paper" aria-label="Close cart">
          <X className="size-5" aria-hidden />
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-violet-soft">
            <ShoppingBag className="size-9 text-violet" aria-hidden />
          </div>
          <p className="text-lg font-semibold">Your cart is feeling light</p>
          <p className="text-sm text-muted">Logos, mugs, backdrops — your next brand moment is a click away.</p>
          <Link href={`/${market.code}/services`} className="btn-primary mt-2" onClick={close}>
            Browse services
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {items.map((item) => (
              <CartLine key={item.key} item={item} compact onNavigate={close} />
            ))}
          </ul>
          <footer className="space-y-3 border-t border-line bg-paper px-6 py-5">
            {totals.freeShippingRemaining > 0 && (
              <p className="rounded-xl bg-sun-soft px-3 py-2 text-xs text-sun-deep">
                Add {formatMoney(totals.freeShippingRemaining, market)} of merch or prints for free delivery.
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="text-lg font-bold tabular-nums">{formatMoney(totals.subtotal, market)}</span>
            </div>
            <p className="text-xs text-muted">Tax and delivery calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/${market.code}/cart`} className="btn-ghost" onClick={close}>
                View cart
              </Link>
              <Link href={`/${market.code}/checkout`} className="btn-primary" onClick={close}>
                Checkout
              </Link>
            </div>
          </footer>
        </>
      )}
    </dialog>
  );
}
