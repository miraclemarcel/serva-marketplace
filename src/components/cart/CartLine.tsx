"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { ServiceArt } from "@/components/art/ServiceArt";
import { useMarket } from "@/components/MarketProvider";
import { formatMoney, linePrice, tierFor } from "@/lib/pricing";
import { CATEGORY_MAP } from "@/lib/taxonomy";
import { describeSelections, useCart, type CartItem } from "@/store/cart";
import { QuantityStepper } from "./QuantityStepper";

export function CartLine({ item, compact = false, onNavigate }: { item: CartItem; compact?: boolean; onNavigate?: () => void }) {
  const market = useMarket();
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const price = linePrice(item.pricing, item.quantity, market);
  const tier = tierFor(item.pricing.tiers, item.quantity);
  const href = `/${market.code}/services/${item.slug}`;

  return (
    <li className="flex gap-4 py-5">
      <Link href={href} onClick={onNavigate} className={`shrink-0 overflow-hidden rounded-2xl ${compact ? "size-20" : "size-24 sm:size-28"}`}>
        <ServiceArt kind={item.art.kind} palette={item.art.palette} title="" className="size-full" />
        <span className="sr-only">{item.name}</span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-xs font-semibold ${CATEGORY_MAP[item.category].tone.text}`}>
              {CATEGORY_MAP[item.category].label}
            </p>
            <Link href={href} onClick={onNavigate} className="block truncate font-semibold text-ink hover:text-violet">
              {item.name}
            </Link>
            {item.selections.length > 0 && <p className="mt-0.5 text-xs text-muted">{describeSelections(item.selections)}</p>}
          </div>
          <div className="text-right">
            <p className="font-semibold text-ink tabular-nums">{formatMoney(price.total, market)}</p>
            {price.savings > 0 && (
              <p className="text-xs text-muted tabular-nums line-through">{formatMoney(price.listTotal, market)}</p>
            )}
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            min={item.rules.min}
            max={item.rules.max}
            step={item.rules.step}
            label={`${item.name} quantity`}
            onChange={(q) => setQuantity(item.key, q)}
          />
          <div className="flex items-center gap-3">
            {!compact && (
              <span className="hidden text-xs text-muted sm:inline">
                {formatMoney(price.unit, market)} / {item.unit}
                {tier && <span className="ml-1 font-semibold text-mint-deep">−{tier.percent}% volume</span>}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeItem(item.key)}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium text-muted transition hover:bg-coral-soft hover:text-coral-deep"
            >
              <Trash2 className="size-3.5" aria-hidden /> Remove<span className="sr-only"> {item.name}</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
