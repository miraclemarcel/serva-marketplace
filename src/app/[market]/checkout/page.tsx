import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="container-x py-10 sm:py-14">
      <header className="mb-8">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
      </header>
      <CheckoutView />
    </div>
  );
}
