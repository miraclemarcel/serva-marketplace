import Link from "next/link";

export function Logo({ href, light = false }: { href: string; light?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="Serva home">
      <span className={`text-[1.4rem] font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        serva<span className="text-coral">.</span>
      </span>
    </Link>
  );
}
