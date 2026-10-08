export function ServiceDetailSkeleton() {
  return (
    <div className="container-x py-6 sm:py-10" role="status" aria-label="Loading service">
      <div className="skeleton mb-6 h-4 w-60" />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <div className="skeleton aspect-4/3 rounded-4xl" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton aspect-4/3 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-16 w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-14 w-32 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-12 w-48 rounded-full" />
          <div className="skeleton h-40 rounded-3xl" />
        </div>
      </div>
      <span className="sr-only">Loading service details…</span>
    </div>
  );
}
