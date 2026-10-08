export type CategoryId = "digital" | "gifts" | "create" | "studio" | "prints";

export type UseCaseId =
  | "launch"
  | "events"
  | "gifting"
  | "marketing"
  | "social"
  | "onboarding";

export type IndustryId =
  | "tech"
  | "hospitality"
  | "retail"
  | "finance"
  | "education"
  | "health"
  | "creative"
  | "nonprofit";

export type UrgencyId = "express" | "standard" | "flexible";

export type SortId = "popular" | "price-asc" | "price-desc" | "rating" | "newest";

export type ArtKind =
  | "logo"
  | "identity"
  | "social"
  | "web"
  | "motion"
  | "deck"
  | "mug"
  | "tote"
  | "apparel"
  | "bottle"
  | "notebook"
  | "giftbox"
  | "pen"
  | "copy"
  | "illustration"
  | "packaging"
  | "camera"
  | "video"
  | "headshot"
  | "card"
  | "flyer"
  | "rollup"
  | "backdrop"
  | "sticker"
  | "letterhead";

export type OptionChoice = {
  id: string;
  label: string;
  /** Extra cost per unit, in USD. */
  delta: number;
  hint?: string;
};

export type OptionGroup = {
  id: string;
  label: string;
  choices: OptionChoice[];
};

export type QuantityTier = { min: number; percent: number };

export type Service = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  /** Price per unit at the minimum configuration, in USD. */
  basePrice: number;
  unit: string;
  discount?: { percent: number; label: string };
  badge?: "Bestseller" | "New" | "Trending" | "Staff pick";
  popularity: number;
  rating: number;
  reviews: number;
  createdAt: string;
  useCases: UseCaseId[];
  industries: IndustryId[];
  urgency: UrgencyId;
  turnaround: { min: number; max: number; express?: number };
  includes: string[];
  options: OptionGroup[];
  quantity: { min: number; max: number; step: number };
  tiers?: QuantityTier[];
  tags: string[];
  art: { kind: ArtKind; palette: [string, string, string, string] };
  /** Cross-category services that complete a bundle. */
  pairsWith: string[];
};

export type Filters = {
  q: string;
  category: CategoryId | null;
  useCase: UseCaseId[];
  industry: IndustryId[];
  urgency: UrgencyId[];
  sale: boolean;
  sort: SortId;
  page: number;
};

export type FacetCounts = {
  category: Record<string, number>;
  useCase: Record<string, number>;
  industry: Record<string, number>;
  urgency: Record<string, number>;
  sale: number;
};

export type SearchResult = {
  items: Service[];
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
  approximate: boolean;
  facets: FacetCounts;
};
