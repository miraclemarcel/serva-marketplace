import type { Metadata } from "next";
import { ConfirmationView } from "@/components/cart/ConfirmationView";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="container-x py-10 sm:py-14">
      <ConfirmationView />
    </div>
  );
}
