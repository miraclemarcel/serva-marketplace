import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/catalog";
import { MARKET_LIST } from "@/lib/markets";
import { SITE_URL } from "@/lib/site";
import { CATEGORIES } from "@/lib/taxonomy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getAllServices();
  const alternates = (path: string) => ({
    languages: Object.fromEntries(MARKET_LIST.map((m) => [m.locale, `${SITE_URL}/${m.code}${path}`])),
  });

  return MARKET_LIST.flatMap((m) => [
    { url: `${SITE_URL}/${m.code}`, changeFrequency: "weekly" as const, priority: 1, alternates: alternates("") },
    { url: `${SITE_URL}/${m.code}/services`, changeFrequency: "daily" as const, priority: 0.9, alternates: alternates("/services") },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/${m.code}/services?category=${c.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...services.map((s) => ({
      url: `${SITE_URL}/${m.code}/services/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: alternates(`/services/${s.slug}`),
    })),
  ]);
}
