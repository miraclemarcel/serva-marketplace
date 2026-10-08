import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { MARKET_LIST } from "@/lib/markets";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "600", "800"] });

export const metadata: Metadata = {
  title: "Page not found · Serva",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <main className="grid min-h-dvh place-items-center bg-gradient-to-br from-violet-soft via-paper to-pink-soft px-4 py-16">
          <div className="max-w-lg text-center">
            <LogoMark className="mx-auto size-14" />
            <p className="mt-8 text-8xl font-extrabold tracking-tight text-gradient">404</p>
            <h1 className="mt-4 text-2xl font-bold">This page went off-brand</h1>
            <p className="mt-2 text-muted">
              The page you&apos;re looking for doesn&apos;t exist or has moved. Pick your market to keep exploring.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {MARKET_LIST.map((m) => (
                <li key={m.code}>
                  <Link href={`/${m.code}`} className="chip">
                    {m.country} · {m.currency}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </body>
    </html>
  );
}
