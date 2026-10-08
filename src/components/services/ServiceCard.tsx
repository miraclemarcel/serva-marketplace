import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { ServiceArt } from "@/components/art/ServiceArt";
import { Rating } from "@/components/ui/Rating";
import { startingPrice } from "@/lib/catalog";
import type { Market } from "@/lib/markets";
import { convert, formatMoney } from "@/lib/pricing";
import { CATEGORY_MAP } from "@/lib/taxonomy";
import type { Service } from "@/lib/types";

const BADGE_TONE: Record<NonNullable<Service["badge"]>, string> = {
  Bestseller: "bg-sun text-ink",
  New: "bg-mint text-ink",
  Trending: "bg-pink text-white",
  "Staff pick": "bg-ink text-white",
};

export function turnaroundLabel(s: Service) {
  const { min, max } = s.turnaround;
  return min === max ? `${min} day${min > 1 ? "s" : ""}` : `${min}–${max} days`;
}

export function ServiceCard({ service, market }: { service: Service; market: Market }) {
  const cat = CATEGORY_MAP[service.category];
  const from = convert(startingPrice(service), market);
  const list = convert(service.basePrice, market);
  const href = `/${market.code}/services/${service.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line/60 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ServiceArt
          kind={service.art.kind}
          palette={service.art.palette}
          title={`${service.name} preview`}
          className="size-full transition duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {service.badge && (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_TONE[service.badge]}`}>{service.badge}</span>
          )}
          {service.discount && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-coral-deep shadow-sm">
              −{service.discount.percent}% · {service.discount.label}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cat.tone.soft} ${cat.tone.text}`}>{cat.label}</span>
          <Rating value={service.rating} count={service.reviews} />
        </div>
        <div>
          <h3 className="text-lg leading-snug font-semibold text-ink">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {service.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{service.tagline}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">Starting at</p>
            <p className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-ink tabular-nums">{formatMoney(from, market, { trim: true })}</span>
              {service.discount && (
                <span className="text-sm text-muted tabular-nums line-through">
                  <span className="sr-only">was </span>
                  {formatMoney(list, market, { trim: true })}
                </span>
              )}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <Clock className="size-3" aria-hidden /> {turnaroundLabel(service)} · per {service.unit}
            </p>
          </div>
          <span
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink pr-3 pl-4 text-sm font-semibold text-white transition duration-300 group-hover:bg-violet"
            aria-hidden
          >
            Order
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line/60" aria-hidden>
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-8 w-28" />
      </div>
    </div>
  );
}
