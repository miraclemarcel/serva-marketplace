"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { ServiceArt } from "@/components/art/ServiceArt";
import type { Service } from "@/lib/types";

const VIEWS = ["Hero view", "Close-up detail", "Pattern study", "In context"];

export function Gallery({ service }: { service: Pick<Service, "name" | "art" | "discount"> }) {
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + VIEWS.length) % VIEWS.length);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  return (
    <section aria-label={`${service.name} image gallery`} aria-roledescription="carousel" onKeyDown={onKeyDown}>
      <div className="group relative overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-line/60">
        <div aria-live="polite" className="aspect-4/3">
          <ServiceArt
            key={index}
            kind={service.art.kind}
            palette={service.art.palette}
            variant={index}
            title={`${service.name} — ${VIEWS[index].toLowerCase()} (image ${index + 1} of ${VIEWS.length})`}
            className="size-full animate-[pop_0.4s_ease-out]"
          />
        </div>
        {service.discount && (
          <span className="absolute top-4 left-4 rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            −{service.discount.percent}% {service.discount.label}
          </span>
        )}
        <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur transition hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur transition hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Choose image">
        {VIEWS.map((view, i) => (
          <li key={view}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${view.toLowerCase()}`}
              aria-current={i === index ? "true" : undefined}
              className={`block w-full overflow-hidden rounded-2xl ring-2 transition ${
                i === index ? "ring-violet" : "opacity-70 ring-transparent hover:opacity-100"
              }`}
            >
              <ServiceArt kind={service.art.kind} palette={service.art.palette} variant={i} title="" className="aspect-4/3 w-full" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
