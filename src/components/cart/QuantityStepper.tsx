"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
};

export function QuantityStepper({ value, min, max, step, onChange, label, size = "md" }: Props) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const n = Number.parseInt(draft, 10);
    if (!Number.isFinite(n)) return setDraft(String(value));
    const snapped = Math.min(max, Math.max(min, min + Math.round((n - min) / step) * step));
    setDraft(String(snapped));
    if (snapped !== value) onChange(snapped);
  };

  const sm = size === "sm";
  const btn = `grid place-items-center rounded-full text-ink transition hover:bg-violet-soft disabled:opacity-30 disabled:hover:bg-transparent ${sm ? "size-8" : "size-11"}`;

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center rounded-full border border-line bg-white ${sm ? "p-0.5" : "p-1"}`}
    >
      <button type="button" className={btn} onClick={() => onChange(value - step)} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        inputMode="numeric"
        aria-label={label}
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
        className={`bg-transparent text-center font-semibold tabular-nums outline-none ${sm ? "w-12 text-sm" : "w-16 text-base"}`}
      />
      <button type="button" className={btn} onClick={() => onChange(value + step)} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
