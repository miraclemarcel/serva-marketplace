"use client";

import { Check, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { useMarket } from "@/components/MarketProvider";
import { convert, formatMoney, linePrice, tierFor } from "@/lib/pricing";
import type { Service } from "@/lib/types";
import { useCart, type Selection } from "@/store/cart";

export function Configurator({ service }: { service: Service }) {
  const market = useMarket();
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);

  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(service.options.map((g) => [g.id, g.choices[0].id])),
  );
  const [quantity, setQuantity] = useState(service.quantity.min);
  const [announce, setAnnounce] = useState("");

  const selections: Selection[] = service.options.map((g) => {
    const choice = g.choices.find((c) => c.id === choices[g.id]) ?? g.choices[0];
    return { groupId: g.id, group: g.label, choiceId: choice.id, choice: choice.label };
  });
  const unitUSD =
    service.basePrice +
    service.options.reduce((sum, g) => sum + (g.choices.find((c) => c.id === choices[g.id])?.delta ?? 0), 0);
  const pricing = { unitUSD, discountPercent: service.discount?.percent, tiers: service.tiers };
  const price = linePrice(pricing, quantity, market);
  const tier = tierFor(service.tiers, quantity);
  const nextTier = service.tiers?.filter((t) => t.min > quantity).sort((a, b) => a.min - b.min)[0];
  const q = service.quantity;
  const setQty = (n: number) => setQuantity(Math.min(q.max, Math.max(q.min, n)));

  const add = () => {
    addItem(
      {
        slug: service.slug,
        name: service.name,
        category: service.category,
        unit: service.unit,
        art: service.art,
        selections,
        rules: service.quantity,
        pricing,
        turnaroundDays: service.turnaround.max,
      },
      quantity,
    );
    setAnnounce(`${quantity} × ${service.name} added to your cart.`);
  };

  return (
    <div className="space-y-6">
      {service.options.map((group) => (
        <fieldset key={group.id}>
          <legend className="mb-2.5 text-sm font-semibold text-ink">
            {group.label}
            <span className="ml-2 font-normal text-muted">
              {group.choices.find((c) => c.id === choices[group.id])?.label}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.choices.map((c) => {
              const selected = choices[group.id] === c.id;
              const delta = convert(c.delta, market);
              return (
                <label
                  key={c.id}
                  className={`relative cursor-pointer rounded-2xl border-2 px-4 py-2.5 text-sm transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-violet/25 ${
                    selected ? "border-violet bg-violet-soft text-ink" : "border-line bg-white text-ink-soft hover:border-ink/25"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${service.slug}-${group.id}`}
                    value={c.id}
                    checked={selected}
                    onChange={() => setChoices((prev) => ({ ...prev, [group.id]: c.id }))}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-1.5 font-semibold">
                    {selected && <Check className="size-3.5 text-violet" strokeWidth={3} aria-hidden />}
                    {c.label}
                  </span>
                  {(c.hint || c.delta !== 0) && (
                    <span className="block text-xs text-muted">
                      {c.hint}
                      {c.hint && c.delta !== 0 && " · "}
                      {c.delta !== 0 && `${c.delta > 0 ? "+" : "−"}${formatMoney(Math.abs(delta), market, { trim: true })}`}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <p id="qty-label" className="text-sm font-semibold text-ink">
            Quantity <span className="font-normal text-muted">({service.unit}s{q.step > 1 ? `, in steps of ${q.step}` : ""})</span>
          </p>
          <p className="text-xs text-muted">
            Min {q.min} · Max {q.max.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper value={quantity} min={q.min} max={q.max} step={q.step} onChange={setQty} label="Quantity" />
          {service.tiers && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Volume discounts">
              {service.tiers.map((t) => (
                <li key={t.min}>
                  <button
                    type="button"
                    onClick={() => setQty(t.min)}
                    aria-pressed={tier?.min === t.min}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      tier?.min === t.min ? "bg-mint text-ink" : "bg-white text-ink-soft ring-1 ring-line hover:ring-ink/30"
                    }`}
                  >
                    {t.min}+ · −{t.percent}%
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {nextTier && (
          <p className="mt-2 text-xs text-mint-deep">
            Add {nextTier.min - quantity} more to unlock {nextTier.percent}% volume savings.
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-ink p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-white/60 uppercase">Your price</p>
            <p className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">{formatMoney(price.total, market)}</span>
              {price.savings > 0 && (
                <span className="text-sm text-white/50 tabular-nums line-through">{formatMoney(price.listTotal, market)}</span>
              )}
            </p>
            <p className="mt-1 text-xs text-white/60">
              {formatMoney(price.unit, market)} per {service.unit} · excl. {market.tax.label.split(" (")[0]}
            </p>
          </div>
          {price.savings > 0 && (
            <span className="rounded-full bg-sun px-3 py-1.5 text-xs font-bold text-ink">
              You save {formatMoney(price.savings, market)}
            </span>
          )}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="btn bg-white text-ink hover:-translate-y-0.5 hover:bg-violet-soft"
            onClick={() => {
              add();
              openDrawer();
            }}
          >
            <ShoppingBag className="size-4" aria-hidden /> Add to cart
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              add();
              router.push(`/${market.code}/checkout`);
            }}
          >
            <Zap className="size-4" aria-hidden /> Order now
          </button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
