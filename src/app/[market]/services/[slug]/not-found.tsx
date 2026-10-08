import { SearchX } from "lucide-react";
import Link from "next/link";
import { currentMarket } from "@/lib/current-market";

export default async function ServiceNotFound() {
  const market = await currentMarket();
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-violet-soft">
          <SearchX className="size-9 text-violet" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold">We couldn&apos;t find that service</h1>
        <p className="mt-2 text-muted">It may have been renamed or retired. Explore the full catalogue instead.</p>
        <Link href={`/${market.code}/services`} className="btn-primary mt-6">
          Browse all services
        </Link>
      </div>
    </div>
  );
}
