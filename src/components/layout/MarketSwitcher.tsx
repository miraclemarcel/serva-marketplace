"use client";

import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Flag } from "@/components/ui/Flag";
import { MARKET_COOKIE, MARKET_LIST, MARKETS, type MarketCode } from "@/lib/markets";

function Trigger({ code, ...props }: { code: MarketCode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const m = MARKETS[code];
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-3 text-sm font-medium text-ink transition hover:border-ink/30"
      {...props}
    >
      <Flag code={code} />
      <span className="hidden sm:inline">{m.currency}</span>
      <span className="font-semibold sm:hidden">{m.currencySymbol}</span>
      <span className="sr-only">
        {" "}— {m.country}, prices in {m.currency}. Change country
      </span>
      <ChevronDown className="size-4 text-muted" aria-hidden />
    </button>
  );
}

/** Rendered while the URL-dependent switcher streams in. */
export function MarketSwitcherFallback({ code }: { code: MarketCode }) {
  return <Trigger code={code} aria-disabled />;
}

export function MarketSwitcher({ code, align = "right" }: { code: MarketCode; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wrapper = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    const active = MARKET_LIST.findIndex((m) => m.code === code);
    items.current[active]?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, code]);

  const hrefFor = (target: MarketCode) => {
    const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    const qs = searchParams.toString();
    return `/${target}${rest}${qs ? `?${qs}` : ""}`;
  };

  const choose = (target: MarketCode) => {
    document.cookie = `${MARKET_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    if (target !== code) router.push(hrefFor(target), { scroll: false });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const idx = items.current.findIndex((el) => el === document.activeElement);
    if (e.key === "Escape") {
      setOpen(false);
      wrapper.current?.querySelector("button")?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (idx + (e.key === "ArrowDown" ? 1 : -1) + MARKET_LIST.length) % MARKET_LIST.length;
      items.current[next]?.focus();
    }
  };

  return (
    <div ref={wrapper} className="relative" onKeyDown={onKeyDown}>
      <Trigger code={code} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} />
      {open && (
        <div
          role="menu"
          aria-label="Choose your country and currency"
          className={`absolute top-full z-50 mt-2 w-72 animate-pop rounded-2xl border border-line bg-white p-2 shadow-lift ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}
        >
          <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wider text-muted uppercase">Country & currency</p>
          {MARKET_LIST.map((m, i) => (
            <a
              key={m.code}
              ref={(el) => {
                items.current[i] = el;
              }}
              href={hrefFor(m.code)}
              role="menuitemradio"
              aria-checked={m.code === code}
              onClick={(e) => {
                e.preventDefault();
                choose(m.code);
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink outline-none hover:bg-violet-soft focus-visible:bg-violet-soft"
            >
              <Flag code={m.code} className="h-5 w-7" />
              <span className="flex-1">
                <span className="block font-medium">{m.country}</span>
                <span className="block text-xs text-muted">
                  {m.currencySymbol} · {m.currency}
                </span>
              </span>
              {m.code === code && <Check className="size-4 text-violet" aria-hidden />}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
