import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MarketProvider } from "@/components/MarketProvider";
import { isMarketCode, MARKET_CODES, MARKETS } from "@/lib/markets";

export function generateStaticParams() {
  return MARKET_CODES.map((market) => ({ market }));
}

export async function generateMetadata({ params }: LayoutProps<"/[market]">): Promise<Metadata> {
  const { market } = await params;
  if (!isMarketCode(market)) return {};
  return {
    openGraph: { locale: MARKETS[market].locale.replace("-", "_") },
  };
}

export default async function MarketLayout({ children, params }: LayoutProps<"/[market]">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();
  const market = MARKETS[code];

  return (
    <MarketProvider code={code}>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header market={market} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer market={market} />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
    </MarketProvider>
  );
}
