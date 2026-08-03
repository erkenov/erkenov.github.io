import type { Metadata } from "next";
import MotoErkenClient from "./MotoErkenClient";

/**
 * /moto-erken — Erken Moto Rides & Repair (fictional Scottsdale, AZ
 * motorcycle tour operator, rental shop, riding school, and repair shop).
 *
 * REPLICATION (2026-08-03): a CLONE of the approved /sky-erken pilot
 * pattern (itself a clone of the live erken.systems homepage), all content
 * repurposed for an independent motorcycle rides & repair shop. Serves
 * moto.erken.systems via src/proxy.ts host rewrite (the older
 * /demo/motorcycle page stays reachable directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from src/app/demo/configs/motorcycle.ts (getDemoConfig("motorcycle")).
 *
 * Everything here is intentionally DUPLICATED from sky-erken rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Moto Rides & Repair is fictional. All prices,
 * stats, and program claims are invented demo content. Public demo —
 * indexable on purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Moto Rides & Repair — Tours, Rentals & Riding Courses in Scottsdale, AZ",
  description:
    "Guided desert tours, rentals, riding courses, and full-service repair out of Scottsdale, AZ. Real-time booking, deposit-secured tours, and a front desk that answers travelers around the clock. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Moto Rides & Repair — Tours, Rentals & Riding Courses in Scottsdale, AZ",
    description:
      "Guided desert tours, rentals, riding courses, and full-service repair. Ride the desert on two wheels, today.",
    images: ["/industries/card-motorcycle-photo.jpg"],
  },
};

export default function MotoErkenPage() {
  return <MotoErkenClient />;
}
