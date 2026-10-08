import { Star } from "lucide-react";

export function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const formatted = new Intl.NumberFormat("en", { notation: "compact" }).format(count ?? 0);
  return (
    <span className={`inline-flex items-center gap-1 ${size === "md" ? "text-sm" : "text-xs"} text-ink-soft`}>
      <Star className={size === "md" ? "size-4" : "size-3.5"} fill="#FFB020" stroke="#FFB020" aria-hidden />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span>({formatted}<span className="sr-only"> reviews</span>)</span>}
      <span className="sr-only">out of 5 stars</span>
    </span>
  );
}
