import type { Metadata } from "next";
import CafeErkenClient from "./CafeErkenClient";

/**
 * /cafe-erken — Café Erken (fictional chef-owned restaurant in Phoenix, AZ).
 *
 * REPLICATION of the approved sky-erken pilot pattern (2026-08-03): a CLONE
 * of the live erken.systems homepage (same SphereScrollStage/Celly
 * mechanics, same section structure, same components as /sky-erken and
 * /fly-erken) with all content repurposed for a fictional restaurant +
 * catering business. Reachable as the cafe.erken.systems root via
 * src/proxy.ts host rewrite (the older black-and-orange /demo/cafe page
 * stays reachable directly at /demo/cafe).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/cafe.ts registry entry
 * (getDemoConfig("cafe")) — same pattern sky-erken/fly-erken use.
 *
 * Everything here is intentionally DUPLICATED from the homepage pattern
 * rather than shared, so nothing on this page can ever change the real
 * homepage.
 *
 * DEMO DISCLAIMER: Café Erken is fictional. All prices, stats, and program
 * claims are invented demo content. Public demo — indexable on purpose (no
 * noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Café Erken — Reservations, Private Events & Catering in Phoenix, AZ",
  description:
    "Dinner reservations, private events, and off-site catering out of a chef-owned dining room in Phoenix, AZ. Live demo site by Erken Systems.",
  openGraph: {
    title: "Café Erken — Reservations, Private Events & Catering in Phoenix, AZ",
    description:
      "Dinner reservations, private events, and off-site catering out of a chef-owned dining room on 7th Avenue. The front desk answers every call, even during the dinner rush.",
    images: ["/industries/card-restaurant-photo.jpg"],
  },
};

export default function CafeErkenPage() {
  return <CafeErkenClient />;
}
