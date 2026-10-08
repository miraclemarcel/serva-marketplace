import type { Market } from "./markets";
import type { QuantityTier } from "./types";

/** Converts a USD amount into the market currency, rounded to its increment. */
export function convert(usd: number, market: Market): number {
  const raw = usd * market.rate;
  const rounded = Math.round(raw / market.roundTo) * market.roundTo;
  return Number(rounded.toFixed(market.fractionDigits));
}

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(
  amount: number,
  market: Market,
  { trim = false }: { trim?: boolean } = {},
): string {
  const digits = trim && Number.isInteger(amount) ? 0 : market.fractionDigits;
  const key = `${market.locale}-${market.currency}-${digits}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(market.locale, {
      style: "currency",
      currency: market.currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(amount);
}

export function tierFor(tiers: QuantityTier[] | undefined, quantity: number): QuantityTier | null {
  if (!tiers?.length) return null;
  return [...tiers].sort((a, b) => b.min - a.min).find((t) => quantity >= t.min) ?? null;
}

export type PriceInput = {
  /** Base unit price plus selected option deltas, USD. */
  unitUSD: number;
  discountPercent?: number;
  tiers?: QuantityTier[];
};

/** Effective USD unit price after offer and volume discounts. */
export function effectiveUnitUSD({ unitUSD, discountPercent = 0, tiers }: PriceInput, quantity: number) {
  const tier = tierFor(tiers, quantity);
  return unitUSD * (1 - discountPercent / 100) * (1 - (tier?.percent ?? 0) / 100);
}

/** Localised pricing for a configured line. */
export function linePrice(input: PriceInput, quantity: number, market: Market) {
  const listUnit = convert(input.unitUSD, market);
  const unit = convert(effectiveUnitUSD(input, quantity), market);
  const total = round(unit * quantity, market);
  const listTotal = round(listUnit * quantity, market);
  return { unit, listUnit, total, listTotal, savings: round(listTotal - total, market) };
}

export function round(amount: number, market: Market) {
  return Number(amount.toFixed(market.fractionDigits));
}
