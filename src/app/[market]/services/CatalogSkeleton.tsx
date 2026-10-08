import { ServiceCardSkeleton } from "@/components/services/ServiceCard";

export function CatalogSkeleton() {
  return (
    <div className="container-x py-8 sm:py-10" role="status" aria-label="Loading services">
      <div className="mb-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:gap-12">
        <div className="hidden space-y-4 lg:block">
          <div className="skeleton h-16 rounded-2xl" />
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-6" />
          ))}
        </div>
        <div>
          <div className="skeleton mb-6 h-11 rounded-full" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading services…</span>
    </div>
  );
}
