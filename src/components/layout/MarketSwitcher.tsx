"use client";

import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Flag } from "@/components/ui/Flag";
import { MARKET_LIST, MARKETS, type MarketCode } from "@/lib/markets";
import { rememberMarket } from "@/lib/remember-market";

function Trigger({ code, ...props }: { code: MarketCode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const m = MARKETS[code];
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 text-sm font-medium text-ink transition hover:border-ink/30 sm:h-11 sm:gap-2 sm:px-3"
      {...props}
    >
      <Flag code={code} className="h-3.5 w-5 sm:h-4 sm:w-6" />
      <span className="hidden sm:inline">{m.currency}</span>
      <span className="font-semibold sm:hidden">{m.currencySymbol}</span>
      <span className="sr-only">
        {" "}— {m.country}, prices in {m.currency}. Change country
      </span>
      <ChevronDown className="size-3.5 text-muted sm:size-4" aria-hidden />
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
    rememberMarket(target);
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
          className={`absolute top-full z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] animate-pop rounded-2xl border border-line bg-white p-1.5 shadow-lift sm:w-72 sm:p-2 ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}
        >
          <p className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-wider text-muted uppercase sm:px-3 sm:pt-2 sm:text-xs">Country & currency</p>
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
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] text-ink outline-none hover:bg-violet-soft focus-visible:bg-violet-soft sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              <Flag code={m.code} className="h-4 w-6 sm:h-5 sm:w-7" />
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
