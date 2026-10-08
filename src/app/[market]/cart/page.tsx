import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="container-x py-10 sm:py-14">
      <header className="mb-8">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your cart</h1>
      </header>
      <CartView />
    </div>
  );
}
