import type { Metadata } from "next";
import HotelErkenClient from "./HotelErkenClient";

/**
 * /hotel-erken — Hotel Erken (fictional 32-room boutique hotel in
 * Phoenix, AZ).
 *
 * REPLICATION (2026-08-03): built from the APPROVED pilot template at
 * /sky-erken — a CLONE of the live erken.systems homepage (same
 * SphereScrollStage/Celly mechanics, same section structure, same
 * components) with all content repurposed for a fictional boutique hotel.
 * Reachable as the hotel.erken.systems root via src/proxy.ts host rewrite.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/hotel.ts registry entry
 * (getDemoConfig("hotel")) — same pattern sky-erken/fly-erken use.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Hotel Erken is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Hotel Erken — Boutique Stays & Direct Booking in Phoenix, AZ",
  description:
    "A 32-room boutique hotel in central Phoenix with a best-rate guarantee and a 24/7 front desk that answers direct bookers, not just the OTAs. Live demo site by Erken Systems.",
  openGraph: {
    title: "Hotel Erken — Boutique Stays & Direct Booking in Phoenix, AZ",
    description:
      "32 rooms, a best-rate guarantee, and a front desk that answers at 2am — booking direct in central Phoenix.",
    images: ["/industries/card-hotel-photo.jpg"],
  },
};

export default function HotelErkenPage() {
  return <HotelErkenClient />;
}
