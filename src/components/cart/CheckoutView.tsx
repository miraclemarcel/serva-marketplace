"use client";

import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ServiceArt } from "@/components/art/ServiceArt";
import { useHydrated, useMarket } from "@/components/MarketProvider";
import { formatMoney, linePrice } from "@/lib/pricing";
import { computeTotals, describeSelections, useCart } from "@/store/cart";
import { CartSkeleton, EmptyCart } from "./CartView";
import { TotalsTable } from "./OrderSummary";

const field =
  "mt-1.5 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-violet focus:ring-4 focus:ring-violet/15 user-invalid:border-coral";

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={`co-${name}`} className="text-sm font-medium text-ink">
        {label} {required ? <span className="text-coral-deep" aria-hidden>*</span> : <span className="text-muted">(optional)</span>}
      </label>
      <input id={`co-${name}`} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} className={field} />
    </div>
  );
}

export function CheckoutView() {
  const market = useMarket();
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const placeOrder = useCart((s) => s.placeOrder);
  const [placing, setPlacing] = useState(false);

  if (!hydrated) return <CartSkeleton />;
  if (!items.length && !placing) return <EmptyCart />;

  const totals = computeTotals(items, market.code);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => (data.get(k) as string | null)?.trim() || undefined;
    setPlacing(true);
    // Mock payment processing.
    await new Promise((r) => setTimeout(r, 1200));
    placeOrder(market.code, {
      name: get("name") ?? "",
      email: get("email") ?? "",
      company: get("company"),
      phone: get("phone"),
      address: [get("address"), get("city")].filter(Boolean).join(", ") || undefined,
      notes: get("notes"),
    });
    router.replace(`/${market.code}/checkout/confirmation`);
  };

  return (
    <form onSubmit={onSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <section aria-labelledby="contact-heading" className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8">
          <h2 id="contact-heading" className="text-lg font-bold">
            <span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-violet text-sm text-white">1</span>
            Your details
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required autoComplete="name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <Field label="Company / brand" name="company" autoComplete="organization" />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
          </div>
        </section>

        {totals.hasPhysical && (
          <section aria-labelledby="delivery-heading" className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8">
            <h2 id="delivery-heading" className="text-lg font-bold">
              <span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-violet text-sm text-white">2</span>
              Delivery address
            </h2>
            <p className="mt-1 text-sm text-muted">For your merch and print items, delivered within {market.country}.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Street address" name="address" required autoComplete="street-address" className="sm:col-span-2" />
              <Field label="City" name="city" required autoComplete="address-level2" />
              <div>
                <span className="text-sm font-medium text-ink">Country</span>
                <p className={`${field} flex items-center bg-paper text-ink-soft`}>{market.country}</p>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="notes-heading" className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8">
          <h2 id="notes-heading" className="text-lg font-bold">
            <span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-violet text-sm text-white">
              {totals.hasPhysical ? 3 : 2}
            </span>
            Project brief
          </h2>
          <label htmlFor="co-notes" className="mt-4 block text-sm font-medium">
            Anything we should know? <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="co-notes"
            name="notes"
            rows={4}
            placeholder="Brand colours, deadlines, links to your existing artwork…"
            className={`${field} h-auto py-3`}
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="size-4 text-mint-deep" aria-hidden /> Payment is simulated in this demo — no card required.
          </p>
        </section>

        <Link href={`/${market.code}/cart`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Back to cart
        </Link>
      </div>

      <aside aria-labelledby="review-heading" className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 lg:sticky lg:top-28">
        <h2 id="review-heading" className="text-lg font-bold">
          Review your order
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {items.map((item) => {
            const p = linePrice(item.pricing, item.quantity, market);
            return (
              <li key={item.key} className="flex gap-3 py-3">
                <ServiceArt kind={item.art.kind} palette={item.art.palette} title="" className="size-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  {item.selections.length > 0 && <p className="truncate text-xs text-muted">{describeSelections(item.selections)}</p>}
                  <p className="text-xs text-muted tabular-nums">
                    {item.quantity} × {formatMoney(p.unit, market)}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{formatMoney(p.total, market)}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 border-t border-line pt-4">
          <TotalsTable totals={totals} />
        </div>
        <button type="submit" disabled={placing} className="btn-primary mt-6 w-full py-4 text-base">
          {placing ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden /> Placing order…
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden /> Place order · {formatMoney(totals.total, market)}
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          By placing your order you agree to our terms. You&apos;ll approve a proof before anything is produced.
        </p>
        <p className="sr-only" role="status" aria-live="polite">
          {placing ? "Placing your order, please wait." : ""}
        </p>
      </aside>
    </form>
  );
}
