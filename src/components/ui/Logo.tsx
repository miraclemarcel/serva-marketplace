import Link from "next/link";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="serva-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6D3BFF" />
          <stop offset="0.55" stopColor="#F0468C" />
          <stop offset="1" stopColor="#FF6A4D" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#serva-logo)" />
      <path d="M12 23a8 8 0 0 1 16 0" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="20" cy="23" r="3" fill="#FFC93C" />
    </svg>
  );
}

export function Logo({ href, light = false }: { href: string; light?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="Serva home">
      <LogoMark className="size-9 transition-transform duration-300 group-hover:-rotate-6" />
      <span className={`text-[1.4rem] font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        serva<span className="text-coral">.</span>
      </span>
    </Link>
  );
}
