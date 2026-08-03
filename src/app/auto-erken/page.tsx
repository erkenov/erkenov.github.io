import type { Metadata } from "next";
import AutoErkenClient from "./AutoErkenClient";

/**
 * /auto-erken — Erken Auto Garage (fictional Phoenix, AZ auto repair &
 * performance shop).
 *
 * REPLICATION (2026-08-03): a CLONE of the approved /sky-erken pilot
 * pattern (itself a clone of the live erken.systems homepage), all content
 * repurposed for an independent auto repair shop. Serves auto.erken.systems
 * via src/proxy.ts host rewrite (the older /demo/automotive page stays
 * reachable directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from src/app/demo/configs/automotive.ts (getDemoConfig("automotive")).
 *
 * Everything here is intentionally DUPLICATED from sky-erken rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Auto Garage is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Auto Garage — Repair, Tuning & Performance in Phoenix, AZ",
  description:
    "General repair, dyno tuning, and custom builds from ASE-certified techs on McDowell Road, Phoenix. Written quotes, status texts, and a front desk that answers even when the bay is full. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Auto Garage — Repair, Tuning & Performance in Phoenix, AZ",
    description:
      "General repair, dyno tuning, and custom builds from ASE-certified techs. The shop that answers when the bay is full.",
    images: ["/industries/card-automotive-photo.jpg"],
  },
};

export default function AutoErkenPage() {
  return <AutoErkenClient />;
}
