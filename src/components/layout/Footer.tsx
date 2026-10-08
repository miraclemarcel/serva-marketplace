import Link from "next/link";
import { Flag } from "@/components/ui/Flag";
import { Logo } from "@/components/ui/Logo";
import { MARKET_LIST, type Market } from "@/lib/markets";
import { CATEGORIES, USE_CASES } from "@/lib/taxonomy";

export function Footer({ market }: { market: Market }) {
  const m = market.code;
  return (
    <footer className="mt-auto bg-ink text-white/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="max-w-sm space-y-4">
          <Logo href={`/${m}`} light />
          <p className="text-sm leading-relaxed text-white/70">
            Serva is the all-in-one branding marketplace — design, merch, print and studio content from vetted
            creatives, delivered across {MARKET_LIST.map((x) => x.country).join(", ").replace(/, ([^,]*)$/, " and $1")}.
          </p>
        </div>
        <nav aria-labelledby="footer-categories">
          <h2 id="footer-categories" className="mb-4 text-sm font-semibold text-white">
            Categories
          </h2>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/${m}/services?category=${c.id}`} className="hover:text-white">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-usecases">
          <h2 id="footer-usecases" className="mb-4 text-sm font-semibold text-white">
            Shop by need
          </h2>
          <ul className="space-y-2.5 text-sm">
            {USE_CASES.map((u) => (
              <li key={u.id}>
                <Link href={`/${m}/services?useCase=${u.id}`} className="hover:text-white">
                  {u.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-markets">
          <h2 id="footer-markets" className="mb-4 text-sm font-semibold text-white">
            Serva around the world
          </h2>
          <ul className="space-y-2.5 text-sm">
            {MARKET_LIST.map((mk) => (
              <li key={mk.code}>
                <a
                  href={`/${mk.code}`}
                  hrefLang={mk.locale}
                  aria-current={mk.code === m ? "true" : undefined}
                  className={`inline-flex items-center gap-2.5 hover:text-white ${mk.code === m ? "font-semibold text-white" : ""}`}
                >
                  <Flag code={mk.code} />
                  {mk.country} · {mk.currency}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Serva Technologies. All rights reserved.</p>
          <p>Prices shown in {market.currency}. {market.tax.label.split(" (")[0]} applied at checkout.</p>
        </div>
      </div>
    </footer>
  );
}
