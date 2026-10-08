"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Flag } from "@/components/ui/Flag";
import { Logo } from "@/components/ui/Logo";
import { useMarket } from "@/components/MarketProvider";
import { MARKET_LIST } from "@/lib/markets";
import { CATEGORIES } from "@/lib/taxonomy";
import { SearchBox } from "./SearchBox";

export function MobileMenu() {
  const market = useMarket();
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  const m = market.code;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="grid size-11 place-items-center rounded-full border border-line bg-white lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label="Site menu"
        onClick={(e) => e.target === ref.current && close()}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-dvh w-full max-w-sm bg-paper p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span onClick={close}>
            <Logo href={`/${m}`} />
          </span>
          <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full bg-white" aria-label="Close menu">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 pb-4">
          <SearchBox onNavigate={close} />
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5">
          <Link
            href={`/${m}/services`}
            onClick={close}
            className="mb-3 flex items-center justify-between rounded-2xl bg-ink px-5 py-4 font-semibold text-white"
          >
            Explore all services <ArrowRight className="size-4" aria-hidden />
          </Link>
          <ul className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${m}/services?category=${c.id}`}
                  onClick={close}
                  className={`flex h-full flex-col gap-1 rounded-2xl ${c.tone.soft} px-4 py-3`}
                >
                  <span className={`font-semibold ${c.tone.text}`}>{c.label}</span>
                  <span className="text-xs text-ink-soft">{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Country & currency</p>
          <ul className="space-y-1 pb-6">
            {MARKET_LIST.map((mk) => (
              <li key={mk.code}>
                <a
                  href={`/${mk.code}`}
                  aria-current={mk.code === m ? "true" : undefined}
                  onClick={() => {
                    document.cookie = `serva-market=${mk.code}; path=/; max-age=31536000; samesite=lax`;
                  }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${mk.code === m ? "bg-white font-semibold shadow-card" : "text-ink-soft"}`}
                >
                  <Flag code={mk.code} className="h-5 w-7" />
                  <span className="flex-1">{mk.country}</span>
                  <span className="text-muted">{mk.currency}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
