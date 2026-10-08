import type { CategoryId, IndustryId, SortId, UrgencyId, UseCaseId } from "./types";

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  blurb: string;
  /** Tailwind classes for the category accent. */
  tone: { bg: string; soft: string; text: string; ring: string };
  gradient: string;
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "digital",
    label: "Digital",
    blurb: "Logos, identity systems, social kits and websites.",
    tone: { bg: "bg-violet", soft: "bg-violet-soft", text: "text-violet-deep", ring: "ring-violet" },
    gradient: "from-[#6D3BFF] to-[#B18CFF]",
  },
  {
    id: "gifts",
    label: "Gifts",
    blurb: "Branded merch your team and clients will keep.",
    tone: { bg: "bg-coral", soft: "bg-coral-soft", text: "text-coral-deep", ring: "ring-coral" },
    gradient: "from-[#FF6A4D] to-[#FFB199]",
  },
  {
    id: "create",
    label: "Create",
    blurb: "Naming, copy, illustration and packaging design.",
    tone: { bg: "bg-pink", soft: "bg-pink-soft", text: "text-pink-deep", ring: "ring-pink" },
    gradient: "from-[#F0468C] to-[#FFA6CB]",
  },
  {
    id: "studio",
    label: "Studio",
    blurb: "Photography, video and headshots that sell.",
    tone: { bg: "bg-teal", soft: "bg-teal-soft", text: "text-teal-deep", ring: "ring-teal" },
    gradient: "from-[#00A6B4] to-[#7DE3E9]",
  },
  {
    id: "prints",
    label: "Prints",
    blurb: "Cards, banners, backdrops and everything on paper.",
    tone: { bg: "bg-sun", soft: "bg-sun-soft", text: "text-sun-deep", ring: "ring-sun" },
    gradient: "from-[#FFB020] to-[#FFE08A]",
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryMeta
>;

export const USE_CASES: { id: UseCaseId; label: string }[] = [
  { id: "launch", label: "Brand launch" },
  { id: "events", label: "Events & conferences" },
  { id: "gifting", label: "Corporate gifting" },
  { id: "marketing", label: "Marketing campaign" },
  { id: "social", label: "Social media" },
  { id: "onboarding", label: "Team onboarding" },
];

export const INDUSTRIES: { id: IndustryId; label: string }[] = [
  { id: "tech", label: "Tech & SaaS" },
  { id: "hospitality", label: "Food & hospitality" },
  { id: "retail", label: "Retail & e-commerce" },
  { id: "finance", label: "Finance & legal" },
  { id: "education", label: "Education" },
  { id: "health", label: "Health & beauty" },
  { id: "creative", label: "Creative & media" },
  { id: "nonprofit", label: "Non-profit & faith" },
];

export const URGENCIES: { id: UrgencyId; label: string; hint: string }[] = [
  { id: "express", label: "Express", hint: "48 hours or less" },
  { id: "standard", label: "Standard", hint: "3–7 days" },
  { id: "flexible", label: "Flexible", hint: "1–3 weeks" },
];

export const SORTS: { id: SortId; label: string }[] = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Top rated" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

export const labelOf = <T extends string>(list: { id: T; label: string }[], id: T) =>
  list.find((x) => x.id === id)?.label ?? id;
