import { Compass } from "lucide-react";
import Link from "next/link";
import { currentMarket } from "@/lib/current-market";

export default async function MarketNotFound() {
  const market = await currentMarket();
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-violet-soft">
          <Compass className="size-9 text-violet" aria-hidden />
        </div>
        <p className="mt-6 text-6xl font-extrabold tracking-tight text-gradient">404</p>
        <h1 className="mt-3 text-2xl font-bold">This page went off-brand</h1>
        <p className="mt-2 text-muted">It doesn&apos;t exist or has moved. Let&apos;s get you back to something beautiful.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/${market.code}/services`} className="btn-primary">
            Browse services
          </Link>
          <Link href={`/${market.code}`} className="btn-ghost">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
