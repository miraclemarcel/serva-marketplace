import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MarketProvider } from "@/components/MarketProvider";
import { currentMarketCode } from "@/lib/current-market";
import { MARKET_CODES, MARKETS } from "@/lib/markets";
import { SITE_URL } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return MARKET_CODES.map((market) => ({ market }));
}

export async function generateMetadata(): Promise<Metadata> {
  const code = await currentMarketCode();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Serva — Design, merch & print for brands that mean business",
      template: "%s · Serva",
    },
    description:
      "Order logo design, branded merch, prints and studio content in minutes. Serva is the all-in-one branding marketplace for Nigeria, the US, the UK and Canada.",
    applicationName: "Serva",
    openGraph: { siteName: "Serva", type: "website", locale: code ? MARKETS[code].locale.replace("-", "_") : undefined },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#6d3bff",
};

/**
 * Root layout. `[market]` is a root parameter, so every page under it shares
 * one App Shell per market and can read the market without URL data.
 */
export default async function MarketLayout({ children }: LayoutProps<"/[market]">) {
  const code = await currentMarketCode();
  if (!code) notFound();
  const market = MARKETS[code];

  return (
    <html lang={market.locale} className={`${poppins.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <MarketProvider code={code}>
          <a
            href="#main"
            className="sr-only z-60 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
      </body>
    </html>
  );
}
