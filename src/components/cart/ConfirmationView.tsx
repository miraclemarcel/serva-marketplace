"use client";

import { ArrowRight, CheckCircle2, FileCheck2, Mail, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useHydrated, useMarket } from "@/components/MarketProvider";
import { getMarket } from "@/lib/markets";
import { formatMoney } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import { CartSkeleton } from "./CartView";

export function ConfirmationView() {
  const current = useMarket();
  const hydrated = useHydrated();
  const order = useCart((s) => s.lastOrder);

  if (!hydrated) return <CartSkeleton />;

  if (!order) {
    return (
      <div className="rounded-4xl bg-white px-6 py-20 text-center shadow-card ring-1 ring-line/60">
        <h1 className="text-2xl font-bold">No recent order found</h1>
        <p className="mt-2 text-muted">Once you place an order, its confirmation will appear here.</p>
        <Link href={`/${current.code}/services`} className="btn-primary mt-6">
          Browse services
        </Link>
      </div>
    );
  }

  const market = getMarket(order.market);
  const money = (n: number) => formatMoney(n, market);
  const placed = new Date(order.placedAt);
  const eta = new Date(placed.getTime() + (order.eta + 1) * 86_400_000);
  const dateFmt = new Intl.DateTimeFormat(market.locale, { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-violet via-pink to-coral p-8 text-center text-white sm:p-12">
        <div aria-hidden className="absolute -top-10 -left-10 size-40 rounded-full bg-white/15" />
        <div aria-hidden className="absolute -right-8 -bottom-12 size-48 rounded-full bg-sun/30" />
        <CheckCircle2 className="relative mx-auto size-16 animate-pop" aria-hidden />
        <h1 className="relative mt-4 text-3xl font-bold sm:text-4xl">Order confirmed!</h1>
        <p className="relative mt-2 text-white/90">
          Thanks{order.customer.name ? `, ${order.customer.name.split(" ")[0]}` : ""}. Your brand is in good hands.
        </p>
        <p className="relative mt-5 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          Order {order.id}
        </p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, title: "Confirmation sent", text: order.customer.email || "Check your inbox" },
          { icon: FileCheck2, title: "Proof within 24h", text: "Approve or request changes" },
          { icon: PackageCheck, title: "Estimated delivery", text: dateFmt.format(eta) },
        ].map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-line/60">
            <Icon className="size-6 text-violet" aria-hidden />
            <p className="mt-3 font-semibold">{title}</p>
            <p className="truncate text-sm text-muted">{text}</p>
          </li>
        ))}
      </ol>

      <section aria-labelledby="receipt-heading" className="mt-8 rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8">
        <h2 id="receipt-heading" className="text-lg font-bold">
          Order summary
        </h2>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Items in order {order.id}</caption>
          <thead className="text-left text-xs text-muted uppercase">
            <tr>
              <th scope="col" className="pb-2 font-semibold">Service</th>
              <th scope="col" className="pb-2 text-right font-semibold">Qty</th>
              <th scope="col" className="pb-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.lines.map((l) => (
              <tr key={`${l.slug}-${l.selections}`}>
                <td className="py-3 pr-3">
                  <p className="font-semibold">{l.name}</p>
                  {l.selections && <p className="text-xs text-muted">{l.selections}</p>}
                </td>
                <td className="py-3 text-right tabular-nums">{l.quantity}</td>
                <td className="py-3 text-right font-medium tabular-nums">{money(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="tabular-nums">{money(order.totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Delivery</dt>
            <dd className="tabular-nums">{order.totals.shipping ? money(order.totals.shipping) : "Free"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">{market.tax.label}</dt>
            <dd className="tabular-nums">{money(order.totals.tax)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold">
            <dt>Total paid</dt>
            <dd className="tabular-nums">{money(order.totals.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/${current.code}/services`} className="btn-primary">
          Keep exploring <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href={`/${current.code}`} className="btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
