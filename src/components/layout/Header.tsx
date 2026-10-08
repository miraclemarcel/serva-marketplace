import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/components/cart/CartDrawer";
import { Logo } from "@/components/ui/Logo";
import type { Market } from "@/lib/markets";
import { CATEGORIES } from "@/lib/taxonomy";
import { MarketSwitcher, MarketSwitcherFallback } from "./MarketSwitcher";
import { MobileMenu } from "./MobileMenu";
import { SearchBox } from "./SearchBox";

export function Header({ market }: { market: Market }) {
  const m = market.code;
  return (
    <>
      <div className="bg-ink text-white">
        <p className="container-x flex items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-[13px]">
          <span>{market.announcement}</span>
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
        <div className="container-x flex h-[72px] items-center gap-3 lg:gap-6">
          <Logo href={`/${m}`} />
          <nav aria-label="Categories" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/${m}/services?category=${c.id}`}
                    className="group relative rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-ink"
                  >
                    {c.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full ${c.tone.bg} transition-transform duration-300 group-hover:scale-x-100`}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden max-w-sm flex-1 md:block">
            <SearchBox />
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:ml-0">
            <Suspense fallback={<MarketSwitcherFallback code={m} />}>
              <MarketSwitcher code={m} />
            </Suspense>
            <CartButton />
            <MobileMenu />
          </div>
        </div>
        <div className="container-x pb-3 md:hidden">
          <SearchBox />
        </div>
      </header>
    </>
  );
}
