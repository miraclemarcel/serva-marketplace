import type { MarketCode } from "@/lib/markets";

/** Inline SVG flags (emoji flags don't render on Windows). */
export function Flag({ code, className = "h-4 w-6" }: { code: MarketCode; className?: string }) {
  const common = { viewBox: "0 0 30 20", className: `${className} shrink-0 rounded-[3px] ring-1 ring-black/10`, "aria-hidden": true } as const;
  switch (code) {
    case "ng":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#fff" />
          <rect width="10" height="20" fill="#008751" />
          <rect x="20" width="10" height="20" fill="#008751" />
        </svg>
      );
    case "us":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
          ))}
          <rect width="13" height={(7 * 20) / 13} fill="#3C3B6E" />
        </svg>
      );
    case "gb":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
          <path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6" />
          <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
          <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.4" />
        </svg>
      );
    case "ca":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#fff" />
          <rect width="7.5" height="20" fill="#D52B1E" />
          <rect x="22.5" width="7.5" height="20" fill="#D52B1E" />
          <path
            d="M15 4l1.2 2.3 1.8-.6-.5 3 1.8-1.1.5 1.2 1.7-.3-.8 2.2.8.4-3 2.2.3 1.2-3-.4V16h-.6v-1.9l-3 .4.3-1.2-3-2.2.8-.4-.8-2.2 1.7.3.5-1.2 1.8 1.1-.5-3 1.8.6z"
            fill="#D52B1E"
          />
        </svg>
      );
  }
}
