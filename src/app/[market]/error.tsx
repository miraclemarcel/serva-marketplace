"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { DEFAULT_MARKET } from "@/lib/markets";

export default function MarketError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ market: string }>();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-md text-center" role="alert">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-coral-soft">
          <TriangleAlert className="size-9 text-coral-deep" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Something went sideways</h1>
        <p className="mt-2 text-muted">
          We couldn&apos;t load this page. It&apos;s probably temporary — try again, or head back to browse services.
        </p>
        {error.digest && <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={retry} className="btn-primary">
            <RotateCcw className="size-4" aria-hidden /> Try again
          </button>
          <Link href={`/${params?.market ?? DEFAULT_MARKET}/services`} className="btn-ghost">
            Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
