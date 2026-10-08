"use client";

import { useMarket } from "@/components/MarketProvider";
import { formatMoney } from "@/lib/pricing";
import type { Totals } from "@/store/cart";

export function TotalsTable({ totals }: { totals: Totals }) {
  const market = useMarket();
  const row = "flex items-center justify-between py-1.5";
  return (
    <dl className="text-sm">
      <div className={row}>
        <dt className="text-ink-soft">Subtotal</dt>
        <dd className="font-medium tabular-nums">{formatMoney(totals.listSubtotal, market)}</dd>
      </div>
      {totals.savings > 0 && (
        <div className={row}>
          <dt className="text-mint-deep">Offers & volume savings</dt>
          <dd className="font-medium text-mint-deep tabular-nums">−{formatMoney(totals.savings, market)}</dd>
        </div>
      )}
      <div className={row}>
        <dt className="text-ink-soft">Delivery</dt>
        <dd className="font-medium tabular-nums">
          {!totals.hasPhysical ? "Digital — free" : totals.shipping ? formatMoney(totals.shipping, market) : "Free"}
        </dd>
      </div>
      <div className={row}>
        <dt className="text-ink-soft">{market.tax.label}</dt>
        <dd className="font-medium tabular-nums">{formatMoney(totals.tax, market)}</dd>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-4">
        <dt className="text-base font-bold">Total</dt>
        <dd className="text-2xl font-bold tabular-nums">{formatMoney(totals.total, market)}</dd>
      </div>
    </dl>
  );
}
