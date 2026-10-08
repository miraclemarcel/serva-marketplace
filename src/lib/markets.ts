export const MARKET_CODES = ["ng", "us", "gb", "ca"] as const;
export type MarketCode = (typeof MARKET_CODES)[number];

export const DEFAULT_MARKET: MarketCode = "ng";
export const MARKET_COOKIE = "serva-market";

export type Market = {
  code: MarketCode;
  country: string;
  /** BCP 47 locale used for number formatting and hreflang. */
  locale: string;
  currency: "NGN" | "USD" | "GBP" | "CAD";
  currencySymbol: string;
  /** Units of local currency per 1 USD. */
  rate: number;
  /** Rounding increment for converted prices. */
  roundTo: number;
  fractionDigits: number;
  tax: { label: string; rate: number };
  shipping: { flatUSD: number; freeOverUSD: number };
  announcement: string;
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
  };
  popularSearches: string[];
  featured: string[];
  featuredHeading: string;
  testimonial: { quote: string; name: string; role: string };
};

export const MARKETS: Record<MarketCode, Market> = {
  ng: {
    code: "ng",
    country: "Nigeria",
    locale: "en-NG",
    currency: "NGN",
    currencySymbol: "₦",
    rate: 1550,
    roundTo: 50,
    fractionDigits: 0,
    tax: { label: "VAT (7.5%)", rate: 0.075 },
    shipping: { flatUSD: 6, freeOverUSD: 120 },
    announcement: "Free delivery in Lagos, Abuja & Port Harcourt on print orders over ₦186,000",
    hero: {
      eyebrow: "From Lagos launches to Abuja boardrooms",
      title: "Build a brand Naija",
      highlight: "can't stop talking about.",
      subtitle:
        "Logos, owambe-ready backdrops, branded merch and studio shoots — designed by top Nigerian creatives and delivered to your door.",
    },
    popularSearches: ["Event backdrop", "Branded mugs", "Logo design", "Roll-up banner"],
    featured: [
      "event-backdrop",
      "branded-mugs",
      "logo-design",
      "roll-up-banner",
      "branded-t-shirts",
      "social-media-kit",
      "corporate-gift-box",
      "event-photography",
    ],
    featuredHeading: "Trending across Nigeria",
    testimonial: {
      quote:
        "Our backdrop, souvenirs and invites for the product launch all came from Serva. Everything matched — guests thought we hired an agency.",
      name: "Adaeze Okafor",
      role: "Founder, Kora Skincare, Lagos",
    },
  },
  us: {
    code: "us",
    country: "United States",
    locale: "en-US",
    currency: "USD",
    currencySymbol: "$",
    rate: 1,
    roundTo: 0.01,
    fractionDigits: 2,
    tax: { label: "Est. sales tax (8%)", rate: 0.08 },
    shipping: { flatUSD: 12, freeOverUSD: 250 },
    announcement: "Free shipping on physical orders over $250 · Express turnaround on 40+ services",
    hero: {
      eyebrow: "The all-in-one branding studio",
      title: "Your brand, beautifully made",
      highlight: "everywhere it shows up.",
      subtitle:
        "From a first logo to a full launch kit — order design, merch, prints and studio content in minutes, not meetings.",
    },
    popularSearches: ["Logo design", "Business cards", "Hoodies", "Pitch deck"],
    featured: [
      "logo-design",
      "brand-identity-kit",
      "landing-page-design",
      "business-cards",
      "branded-hoodies",
      "product-photography",
      "pitch-deck-design",
      "custom-stickers",
    ],
    featuredHeading: "Popular with US founders",
    testimonial: {
      quote:
        "We went from napkin sketch to a full identity, swag for our team offsite and a pitch deck in under two weeks.",
      name: "Jordan Reyes",
      role: "Co-founder, Fieldnote AI, Austin",
    },
  },
  gb: {
    code: "gb",
    country: "United Kingdom",
    locale: "en-GB",
    currency: "GBP",
    currencySymbol: "£",
    rate: 0.79,
    roundTo: 0.01,
    fractionDigits: 2,
    tax: { label: "VAT (20%)", rate: 0.2 },
    shipping: { flatUSD: 9, freeOverUSD: 200 },
    announcement: "Next-day UK delivery on prints ordered before 2pm · Prices include free proofs",
    hero: {
      eyebrow: "Branding, sorted — brilliantly",
      title: "Make your brand look",
      highlight: "properly brilliant.",
      subtitle:
        "Considered design, premium merch and studio-quality content for independents, start-ups and the high street.",
    },
    popularSearches: ["Brand identity", "Tote bags", "Letterheads", "Headshots"],
    featured: [
      "brand-identity-kit",
      "branded-tote-bags",
      "letterhead-stationery",
      "team-headshots",
      "packaging-design",
      "business-cards",
      "brand-naming",
      "branded-notebooks",
    ],
    featuredHeading: "Loved by UK independents",
    testimonial: {
      quote:
        "The packaging and stationery felt bespoke, yet the whole thing cost less than one agency workshop. Lovely people, too.",
      name: "Harriet Cole",
      role: "Owner, Marlow & Bean, Bristol",
    },
  },
  ca: {
    code: "ca",
    country: "Canada",
    locale: "en-CA",
    currency: "CAD",
    currencySymbol: "C$",
    rate: 1.37,
    roundTo: 0.01,
    fractionDigits: 2,
    tax: { label: "HST (13%)", rate: 0.13 },
    shipping: { flatUSD: 14, freeOverUSD: 260 },
    announcement: "Free shipping coast to coast on orders over C$356 · Bilingual design available",
    hero: {
      eyebrow: "Coast-to-coast branding studio",
      title: "Brand boldly,",
      highlight: "from Vancouver to St. John's.",
      subtitle:
        "Design, merch and print for Canadian makers and teams — bilingual-ready, built to stand out in any season.",
    },
    popularSearches: ["Hoodies", "Water bottles", "Brand video", "Stickers"],
    featured: [
      "branded-hoodies",
      "branded-water-bottles",
      "brand-video",
      "custom-stickers",
      "logo-design",
      "trade-show-booth",
      "social-media-kit",
      "corporate-gift-box",
    ],
    featuredHeading: "Canada's favourites this season",
    testimonial: {
      quote:
        "Our hoodies and bottles were the hit of the winter retreat. Ordering in both English and French took minutes.",
      name: "Émilie Tremblay",
      role: "People Lead, Northwind Labs, Montréal",
    },
  },
};

export const MARKET_LIST = MARKET_CODES.map((code) => MARKETS[code]);

export function isMarketCode(value: string | undefined | null): value is MarketCode {
  return !!value && (MARKET_CODES as readonly string[]).includes(value);
}

export function getMarket(code: string): Market {
  return isMarketCode(code) ? MARKETS[code] : MARKETS[DEFAULT_MARKET];
}

export const COUNTRY_TO_MARKET: Record<string, MarketCode> = {
  NG: "ng",
  US: "us",
  GB: "gb",
  UK: "gb",
  CA: "ca",
};
