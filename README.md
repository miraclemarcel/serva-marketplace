# Serva — Service Ordering Interface

A responsive branding-services marketplace built with **Next.js 16.4 (App Router, Cache Components)**, **TypeScript**, **Tailwind CSS v4** and **Zustand**, set in **Poppins**.

**Live preview:** [servamarketplace.netlify.app](https://servamarketplace.netlify.app)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /ng (Nigeria) by default
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` in production so canonical URLs, hreflang links, the sitemap and Open Graph tags use your domain.

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Proxy redirect | Picks a market from the saved cookie, then the geo header, and falls back to Nigeria (`/ng`) |
| `/{ng,us,gb,ca}` | Static per market | Landing page with market-specific hero copy, featured services and testimonial |
| `/[market]/services` | Static shell + streamed results | Search, category, filters, sort and page are all in the URL |
| `/[market]/services/[slug]` | Static (35 services × 4 markets) | Gallery, options, quantity, bundles, `generateMetadata`, JSON-LD, generated OG image |
| `/[market]/cart`, `/checkout`, `/checkout/confirmation` | Client (Zustand, persisted) | Mock payment |
| `/api/services`, `/api/services/[slug]` | Route handlers | Mock REST API with prices converted to each market's currency |

**Listing URL parameters:** `q`, `category`, `useCase`, `industry`, `urgency` (comma-separated), `sale=1`, `sort` (`popular` · `rating` · `newest` · `price-asc` · `price-desc`), `page`.
Example: `/ng/services?category=gifts&useCase=events,gifting&sort=price-asc`.

## Where things live

- `src/data/services.json` — mock catalogue (35 services in Digital, Gifts, Create, Studio and Prints). Prices are stored in USD.
- `src/lib/catalog.ts` — catalogue API (`use cache`), filtering, facet counts, sorting, related services.
- `src/lib/search.ts` — search with synonyms (“tee” → T-shirt), prefix matching, typo tolerance (“bussiness card”), weighted relevance and a closest-match fallback.
- `src/lib/markets.ts` — per-market currency, FX rate, rounding, tax, shipping, hero copy and featured services.
- `src/lib/pricing.ts` — currency conversion, offer and volume-tier pricing, formatting.
- `src/store/cart.ts` — Zustand cart (persisted to `localStorage`), totals, order snapshot.
- `src/components/art/ServiceArt.tsx` — SVG product illustrations, so the app needs no external images.

## Markets

| Market | Currency | Tax |
| --- | --- | --- |
| `/ng` Nigeria | NGN ₦ | VAT 7.5% |
| `/us` United States | USD $ | Est. sales tax 8% |
| `/gb` United Kingdom | GBP £ | VAT 20% |
| `/ca` Canada | CAD C$ | HST 13% |

FX rates in `markets.ts` are fixed mock values.
