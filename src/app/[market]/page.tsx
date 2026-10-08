import {
  ArrowRight,
  ArrowUpRight,
  Gift,
  Megaphone,
  MousePointerClick,
  Palette,
  PartyPopper,
  Quote,
  Rocket,
  Smartphone,
  Star,
  Truck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ServiceArt } from "@/components/art/ServiceArt";
import { HeroCollage } from "@/components/home/HeroCollage";
import { SearchBox } from "@/components/layout/SearchBox";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Flag } from "@/components/ui/Flag";
import { getCategoryStats, getServicesBySlugs, startingPrice } from "@/lib/catalog";
import { currentMarket } from "@/lib/current-market";
import { MARKET_LIST } from "@/lib/markets";
import { convert, formatMoney } from "@/lib/pricing";
import { CATEGORIES, USE_CASES } from "@/lib/taxonomy";
import type { UseCaseId } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const market = await currentMarket();
  const title = `Branding services in ${market.country} — logos, merch, prints & studio`;
  return {
    title: { absolute: `Serva ${market.country} · ${market.hero.title} ${market.hero.highlight}` },
    description: market.hero.subtitle,
    alternates: {
      canonical: `/${market.code}`,
      languages: Object.fromEntries(MARKET_LIST.map((m) => [m.locale, `/${m.code}`])),
    },
    openGraph: { title, description: market.hero.subtitle, url: `/${market.code}` },
  };
}

const USE_CASE_ICON: Record<UseCaseId, typeof Rocket> = {
  launch: Rocket,
  events: PartyPopper,
  gifting: Gift,
  marketing: Megaphone,
  social: Smartphone,
  onboarding: Users,
};

const USE_CASE_TONE = ["bg-violet", "bg-coral", "bg-pink", "bg-teal", "bg-sun", "bg-mint"];

const BRANDS = ["Kora Skincare", "Fieldnote AI", "Marlow & Bean", "Northwind Labs", "Bolt Bistro", "Lumen Health", "Ayo Tech", "Oak & Ivy", "Tidewater Co.", "Sabi Pay"];

export default async function HomePage() {
  const market = await currentMarket();
  const m = market.code;
  const [featured, stats, bundle] = await Promise.all([
    getServicesBySlugs(market.featured),
    getCategoryStats(),
    getServicesBySlugs(["logo-design", "business-cards", "social-media-kit", "custom-stickers"]),
  ]);
  const bundleList = bundle.reduce((sum, s) => sum + convert(startingPrice(s), market), 0);
  const bundlePrice = convert(bundle.reduce((sum, s) => sum + startingPrice(s), 0) * 0.85, market);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-violet/20 blur-3xl" />
          <div className="absolute top-20 right-[-10%] size-[460px] rounded-full bg-pink/20 blur-3xl" />
          <div className="absolute bottom-[-30%] left-1/3 size-[420px] rounded-full bg-sun/25 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#16123a14_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="relative container-x grid items-center gap-12 pt-10 pb-16 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-xs font-semibold text-ink shadow-card ring-1 ring-line sm:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-white">
                <Flag code={m} className="h-3 w-4.5" /> {market.code.toUpperCase()}
              </span>
              {market.hero.eyebrow}
            </p>
            <h1 className="mt-6 text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-ink sm:text-6xl xl:text-7xl">
              {market.hero.title} <span className="text-gradient">{market.hero.highlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-ink-soft sm:text-lg">{market.hero.subtitle}</p>

            <div className="mt-8 max-w-xl">
              <SearchBox size="lg" placeholder="What do you want to create today?" />
            </div>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-sm" aria-label="Popular searches">
              <li className="mr-1 text-muted">Popular:</li>
              {market.popularSearches.map((p) => (
                <li key={p}>
                  <Link href={`/${m}/services?q=${encodeURIComponent(p)}`} className="chip py-1.5 text-xs">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex -space-x-3" aria-hidden>
                {["#6D3BFF", "#FF6A4D", "#00B8C2", "#FFC93C", "#F0468C"].map((c, i) => (
                  <span key={c} className="grid size-10 place-items-center rounded-full text-sm font-bold text-white ring-4 ring-paper" style={{ background: c }}>
                    {"AJMEK"[i]}
                  </span>
                ))}
              </div>
              <div>
                <p className="flex items-center gap-1" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4" fill="#FFB020" stroke="#FFB020" />
                  ))}
                </p>
                <p className="text-sm text-ink-soft">
                  <strong className="text-ink">4.9/5</strong> from 18,000+ brands
                </p>
              </div>
            </div>
          </div>

          <HeroCollage services={featured} market={market} />
        </div>
      </section>

      {/* ───────────── Brand marquee ───────────── */}
      <section aria-label="Brands that build with Serva" className="border-y border-line bg-white py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee gap-12 pr-12">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <li key={i} aria-hidden={i >= BRANDS.length} className="text-xl font-bold whitespace-nowrap text-ink/35">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Categories bento ───────────── */}
      <section aria-labelledby="categories-heading" className="container-x py-20 sm:py-28">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Five ways to build your brand</p>
            <h2 id="categories-heading" className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
              Start with what you need. <span className="text-muted">We&apos;ll handle the rest.</span>
            </h2>
          </div>
          <Link href={`/${m}/services`} className="btn-dark self-start md:self-auto">
            All services <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ul className="grid auto-rows-[minmax(240px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const stat = stats[c.id];
            const big = i === 0;
            return (
              <li key={c.id} className={big ? "sm:col-span-2 lg:row-span-2" : i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <Link
                  href={`/${m}/services?category=${c.id}`}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl bg-gradient-to-br ${c.gradient} p-6 text-ink transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-8`}
                >
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-ink/70">
                      {stat.count} services · from {formatMoney(convert(stat.from, market), market, { trim: true })}
                    </p>
                    <h3 className={`mt-1 font-extrabold tracking-tight ${big ? "text-5xl sm:text-6xl" : "text-3xl"}`}>{c.label}</h3>
                    <p className={`mt-2 max-w-xs text-sm font-medium text-ink/75 ${big ? "sm:text-base" : ""}`}>{c.blurb}</p>
                  </div>
                  <div className={`relative z-10 mt-6 flex items-end ${big ? "gap-4" : "gap-2"}`}>
                    {stat.top.slice(0, big ? 3 : 2).map((s, j) => (
                      <ServiceArt
                        key={s.id}
                        kind={s.art.kind}
                        palette={s.art.palette}
                        title=""
                        className={`rounded-2xl shadow-lift ring-4 ring-white/70 transition duration-500 group-hover:-translate-y-1 ${
                          big ? "w-1/3" : "w-[45%]"
                        } ${j % 2 ? "rotate-3" : "-rotate-3"}`}
                      />
                    ))}
                  </div>
                  <span className="absolute top-6 right-6 z-10 grid size-11 place-items-center rounded-full bg-white text-ink transition duration-300 group-hover:rotate-45 sm:top-8 sm:right-8">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────── Featured per market ───────────── */}
      <section aria-labelledby="featured-heading" className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow inline-flex items-center gap-2">
                <Flag code={m} className="h-3 w-4.5" /> Picked for {market.country}
              </p>
              <h2 id="featured-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                {market.featuredHeading}
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted">
              All prices in {market.currency} ({market.currencySymbol}). Volume discounts apply automatically at checkout.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((s) => (
              <li key={s.id} className="grid">
                <ServiceCard service={s} market={market} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section aria-labelledby="how-heading" className="container-x py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 id="how-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            From idea to doorstep in three easy steps
          </h2>
        </div>
        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          <span aria-hidden className="absolute top-10 right-[16%] left-[16%] hidden border-t-2 border-dashed border-line md:block" />
          {[
            { icon: MousePointerClick, title: "Pick a service", text: "Browse 35+ services or search for exactly what you need.", tone: "bg-violet text-white" },
            { icon: Palette, title: "Customise & approve", text: "Choose options, share your brief and approve a free proof.", tone: "bg-pink text-white" },
            { icon: Truck, title: "We create & deliver", text: `Designers, printers and studios deliver across ${market.country}.`, tone: "bg-sun text-ink" },
          ].map(({ icon: Icon, title, text, tone }, i) => (
            <li key={title} className="relative rounded-4xl bg-white p-8 text-center shadow-card ring-1 ring-line/60">
              <span className={`relative mx-auto grid size-20 place-items-center rounded-3xl ${tone} shadow-lift`}>
                <Icon className="size-8" aria-hidden />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-ink text-xs font-bold text-white ring-4 ring-paper">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── Launch kit bundle ───────────── */}
      <section aria-labelledby="bundle-heading" className="container-x">
        <div className="relative overflow-hidden rounded-5xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
          <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-violet/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 left-10 size-80 rounded-full bg-coral/30 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">Bundle & save 15%</p>
              <h2 id="bundle-heading" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                The Launch Kit
              </h2>
              <p className="mt-4 max-w-md text-white/75">
                A logo, business cards, a social media kit and die-cut stickers — designed together so everything matches
                from day one.
              </p>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold tabular-nums">{formatMoney(bundlePrice, market, { trim: true })}</span>
                <span className="text-lg text-white/50 tabular-nums line-through">
                  <span className="sr-only">was </span>
                  {formatMoney(bundleList, market, { trim: true })}
                </span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${m}/services?useCase=launch`} className="btn-primary">
                  Build your launch kit <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href={`/${m}/services/logo-design`} className="btn border border-white/25 text-white hover:bg-white/10">
                  Start with a logo
                </Link>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-4">
              {bundle.map((s, i) => (
                <li key={s.id} className={i % 2 ? "translate-y-6" : ""}>
                  <Link href={`/${m}/services/${s.slug}`} className="group block rounded-3xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15">
                    <ServiceArt kind={s.art.kind} palette={s.art.palette} title={s.name} className="aspect-4/3 w-full rounded-2xl" />
                    <p className="px-2 pt-2 pb-1 text-sm font-semibold">{s.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── Use cases ───────────── */}
      <section aria-labelledby="usecase-heading" className="container-x py-20 sm:py-28">
        <div className="mb-10 text-center">
          <p className="eyebrow">Shop by moment</p>
          <h2 id="usecase-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Whatever you&apos;re planning, we&apos;ve got it covered
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {USE_CASES.map((u, i) => {
            const Icon = USE_CASE_ICON[u.id];
            return (
              <li key={u.id}>
                <Link
                  href={`/${m}/services?useCase=${u.id}`}
                  className="group flex h-full flex-col items-center gap-4 rounded-4xl bg-white p-6 text-center shadow-card ring-1 ring-line/60 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className={`grid size-16 place-items-center rounded-2xl ${USE_CASE_TONE[i]} text-white transition duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                    <Icon className={`size-7 ${USE_CASE_TONE[i] === "bg-sun" || USE_CASE_TONE[i] === "bg-mint" ? "text-ink" : ""}`} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold">{u.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────── Testimonial + stats ───────────── */}
      <section aria-labelledby="love-heading" className="container-x pb-20 sm:pb-28">
        <h2 id="love-heading" className="sr-only">
          What customers say
        </h2>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <figure className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-violet-soft to-pink-soft p-8 sm:p-12">
            <Quote className="size-12 text-violet" aria-hidden />
            <blockquote className="mt-4 text-xl leading-relaxed font-medium text-ink sm:text-2xl">
              “{market.testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-violet font-bold text-white" aria-hidden>
                {market.testimonial.name[0]}
              </span>
              <span>
                <span className="block font-semibold">{market.testimonial.name}</span>
                <span className="block text-sm text-muted">{market.testimonial.role}</span>
              </span>
            </figcaption>
          </figure>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { k: "Brands served", v: "18k+", tone: "bg-sun-soft" },
              { k: "Average rating", v: "4.9★", tone: "bg-teal-soft" },
              { k: "Express turnaround", v: "48h", tone: "bg-coral-soft" },
              { k: "Markets", v: String(MARKET_LIST.length), tone: "bg-violet-soft" },
            ].map((s) => (
              <div key={s.k} className={`flex flex-col justify-end rounded-4xl ${s.tone} p-6`}>
                <dt className="order-2 text-sm text-ink-soft">{s.k}</dt>
                <dd className="order-1 text-4xl font-extrabold tracking-tight">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="container-x pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-5xl bg-gradient-to-r from-violet via-pink to-coral px-6 py-14 text-center text-white sm:py-20">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(#ffffff26_1px,transparent_1px)] [background-size:18px_18px]" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to make your brand unforgettable?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/90">
            Join thousands of businesses across {market.country} building beautiful brands with Serva.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${m}/services`} className="btn bg-white text-ink hover:-translate-y-0.5">
              Start creating <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href={`/${m}/services?sale=1`} className="btn border border-white/50 text-white hover:bg-white/10">
              See today&apos;s offers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
