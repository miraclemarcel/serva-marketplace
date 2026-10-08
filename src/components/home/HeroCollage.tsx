import { BadgeCheck, Zap } from "lucide-react";
import Link from "next/link";
import { ServiceArt } from "@/components/art/ServiceArt";
import { startingPrice } from "@/lib/catalog";
import type { Market } from "@/lib/markets";
import { convert, formatMoney } from "@/lib/pricing";
import type { Service } from "@/lib/types";

const SLOTS = [
  { pos: "left-0 top-6 w-[58%] z-20", rot: "-6deg", anim: "animate-float" },
  { pos: "right-0 top-0 w-[46%] z-10", rot: "7deg", anim: "animate-float-slow" },
  { pos: "right-2 bottom-2 w-[52%] z-30", rot: "-3deg", anim: "animate-float" },
  { pos: "left-6 bottom-0 w-[40%] z-10", rot: "5deg", anim: "animate-float-slow" },
];

/** Playful, Canva-style floating collage of the market's featured services. */
export function HeroCollage({ services, market }: { services: Service[]; market: Market }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div aria-hidden className="absolute inset-[12%] rounded-full bg-gradient-to-br from-violet/30 via-pink/20 to-sun/30 blur-2xl" />
      {services.slice(0, 4).map((s, i) => {
        const slot = SLOTS[i];
        return (
          <Link
            key={s.id}
            href={`/${market.code}/services/${s.slug}`}
            className={`group absolute ${slot.pos} ${slot.anim}`}
            style={{ ["--r" as string]: slot.rot, animationDelay: `${i * -1.7}s` }}
          >
            <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-lift ring-1 ring-black/5 transition duration-300 group-hover:scale-[1.03]">
              <ServiceArt kind={s.art.kind} palette={s.art.palette} title={s.name} className="aspect-4/3 w-full rounded-2xl" />
              <div className="flex items-center justify-between gap-2 px-2 pt-2 pb-1">
                <span className="truncate text-xs font-semibold text-ink sm:text-sm">{s.name}</span>
                <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white sm:text-xs">
                  {formatMoney(convert(startingPrice(s), market), market, { trim: true })}
                </span>
              </div>
            </div>
          </Link>
        );
      })}

      <div className="absolute top-[44%] -left-2 z-40 hidden animate-float-slow items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lift sm:flex" style={{ ["--r" as string]: "-4deg" }}>
        <span className="grid size-8 place-items-center rounded-full bg-mint/20">
          <BadgeCheck className="size-4 text-mint-deep" aria-hidden />
        </span>
        <span className="text-xs leading-tight">
          <span className="block font-semibold">Proof approved</span>
          <span className="text-muted">2 min ago</span>
        </span>
      </div>
      <div className="absolute -right-2 top-[38%] z-40 hidden animate-float items-center gap-2 rounded-2xl bg-ink px-3 py-2 text-white shadow-lift sm:flex" style={{ ["--r" as string]: "5deg" }}>
        <Zap className="size-4 text-sun" aria-hidden />
        <span className="text-xs font-semibold">Express in 48h</span>
      </div>
    </div>
  );
}
