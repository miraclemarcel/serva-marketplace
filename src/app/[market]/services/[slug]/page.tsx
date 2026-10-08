import { BadgeCheck, CheckCircle2, Clock, Package, PenTool, ShieldCheck, Truck, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Configurator } from "@/components/detail/Configurator";
import { Gallery } from "@/components/detail/Gallery";
import { ServiceCard, turnaroundLabel } from "@/components/services/ServiceCard";
import { Rating } from "@/components/ui/Rating";
import { getAllServices, getRelated, getService, getServicesBySlugs, startingPrice } from "@/lib/catalog";
import { getMarket, MARKET_LIST } from "@/lib/markets";
import { convert, formatMoney } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";
import { CATEGORY_MAP, INDUSTRIES, USE_CASES, labelOf } from "@/lib/taxonomy";

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[market]/services/[slug]">): Promise<Metadata> {
  const { market: code, slug } = await params;
  const [market, service] = [getMarket(code), await getService(slug)];
  if (!service) return { title: "Service not found" };

  const from = formatMoney(convert(startingPrice(service), market), market, { trim: true });
  const title = `${service.name} — from ${from} in ${market.country}`;
  const description = `${service.tagline} ${service.includes.slice(0, 2).join(". ")}. Turnaround ${turnaroundLabel(service)}.`;
  const path = `/${market.code}/services/${service.slug}`;

  return {
    title,
    description,
    keywords: service.tags,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(MARKET_LIST.map((m) => [m.locale, `/${m.code}/services/${service.slug}`])),
    },
    openGraph: {
      type: "website",
      title: `${service.name} · Serva ${market.country}`,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServicePage({ params }: PageProps<"/[market]/services/[slug]">) {
  const { market: code, slug } = await params;
  const market = getMarket(code);
  const service = await getService(slug);
  if (!service) notFound();

  const [related, pairs] = await Promise.all([getRelated(service, 4), getServicesBySlugs(service.pairsWith)]);
  const cat = CATEGORY_MAP[service.category];
  const m = market.code;
  const from = convert(startingPrice(service), market);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: service.name,
        description: service.description,
        category: cat.label,
        sku: service.id,
        brand: { "@type": "Brand", name: "Serva" },
        image: `${SITE_URL}/${m}/services/${service.slug}/opengraph-image`,
        aggregateRating: { "@type": "AggregateRating", ratingValue: service.rating, reviewCount: service.reviews },
        offers: {
          "@type": "Offer",
          price: from,
          priceCurrency: market.currency,
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/${m}/services/${service.slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${m}` },
          { "@type": "ListItem", position: 2, name: cat.label, item: `${SITE_URL}/${m}/services?category=${cat.id}` },
          { "@type": "ListItem", position: 3, name: service.name },
        ],
      },
    ],
  };

  const steps = [
    { icon: PenTool, label: "Brief & artwork", days: "Day 0" },
    { icon: BadgeCheck, label: "Proof approved", days: "Day 1" },
    {
      icon: Package,
      label: service.category === "gifts" || service.category === "prints" ? "Production" : "Creation",
      days: `Day ${Math.max(1, service.turnaround.min - 1)}`,
    },
    { icon: Truck, label: "Delivered", days: `Day ${service.turnaround.max}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container-x py-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${m}`} className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/${m}/services?category=${cat.id}`} className="hover:text-ink">
                {cat.label}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-ink">
              {service.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Gallery service={service} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/${m}/services?category=${cat.id}`} className={`rounded-full px-3 py-1 text-xs font-semibold ${cat.tone.soft} ${cat.tone.text}`}>
                {cat.label}
              </Link>
              {service.badge && <span className="rounded-full bg-sun px-3 py-1 text-xs font-semibold text-ink">{service.badge}</span>}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{service.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <Rating value={service.rating} count={service.reviews} size="md" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden /> {turnaroundLabel(service)}
              </span>
              {service.turnaround.express && (
                <span className="inline-flex items-center gap-1.5 text-coral-deep">
                  <Zap className="size-4" aria-hidden /> Express in {service.turnaround.express} days
                </span>
              )}
            </div>
            <p className="mt-4 text-lg text-ink-soft">{service.tagline}</p>
            <p className="mt-4 text-sm text-muted">
              Starting at{" "}
              <strong className="text-xl font-bold text-ink">{formatMoney(from, market, { trim: true })}</strong> per{" "}
              {service.unit}
              {service.discount && (
                <span className="ml-2 rounded-full bg-coral-soft px-2 py-0.5 text-xs font-bold text-coral-deep">
                  {service.discount.label}: −{service.discount.percent}%
                </span>
              )}
            </p>

            <div className="mt-8">
              <Configurator service={service} />
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-5 shrink-0 text-mint-deep" aria-hidden /> Free proof before production
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="size-5 shrink-0 text-violet" aria-hidden /> Vetted creatives
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-5 shrink-0 text-coral" aria-hidden /> Delivery across {market.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <section aria-labelledby="about-heading" className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8 lg:col-span-2">
            <h2 id="about-heading" className="text-xl font-bold">
              About this service
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{service.description}</p>

            <h3 className="mt-8 font-semibold">What&apos;s included</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-violet" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Great for</dt>
                <dd className="mt-1 text-muted">{service.useCases.map((u) => labelOf(USE_CASES, u)).join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold">Popular with</dt>
                <dd className="mt-1 text-muted">{service.industries.map((i) => labelOf(INDUSTRIES, i)).join(", ")}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="turnaround-heading" className="rounded-4xl bg-violet-soft p-6 sm:p-8">
            <h2 id="turnaround-heading" className="text-xl font-bold">
              Turnaround estimate
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {turnaroundLabel(service)} from proof approval
              {service.turnaround.express ? `, or ${service.turnaround.express} days with express.` : "."}
            </p>
            <ol className="mt-6 space-y-5">
              {steps.map(({ icon: Icon, label, days }, i) => (
                <li key={label} className="relative flex items-center gap-4">
                  {i < steps.length - 1 && <span aria-hidden className="absolute top-11 left-5 h-5 w-0.5 bg-violet/25" />}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-violet shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                  <span className="text-sm text-muted">{days}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {pairs.length > 0 && (
          <section aria-labelledby="pairs-heading" className="mt-20">
            <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Bundle across categories</p>
                <h2 id="pairs-heading" className="mt-2 text-2xl font-bold sm:text-3xl">
                  Complete the look
                </h2>
              </div>
              <p className="max-w-sm text-sm text-muted">
                Brands that order {service.name.toLowerCase()} usually pair it with these — matched to the same artwork.
              </p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pairs.slice(0, 4).map((s) => (
                <li key={s.id} className="grid">
                  <ServiceCard service={s} market={market} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 id="related-heading" className="text-2xl font-bold sm:text-3xl">
                More in {cat.label}
              </h2>
              <Link href={`/${m}/services?category=${cat.id}`} className="text-sm font-semibold text-violet hover:underline">
                View all
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((s) => (
                <li key={s.id} className="grid">
                  <ServiceCard service={s} market={market} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
