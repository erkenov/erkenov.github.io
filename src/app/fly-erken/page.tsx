import type { Metadata } from "next";
import FlyErkenClient from "./FlyErkenClient";

/**
 * /fly-erken — Fly Erken Flight Academy (fictional Phoenix flight school).
 *
 * Owner-approved rebuild (2026-07-30): a CLONE of the live erken.systems
 * homepage — same SphereScrollStage/Celly mechanics, same section
 * structure, same components — with all content repurposed for the
 * fictional flight school. Served at the root of fly.erken.systems via
 * src/proxy.ts host rewrite (the older /demo/flight-schools page stays
 * reachable directly).
 *
 * Everything here is intentionally DUPLICATED from home-v8-draft rather
 * than shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Fly Erken Flight Academy is fictional. All prices,
 * stats, fleet details, and program claims are invented demo content.
 * Public demo — indexable on purpose (no noindex).
 */
export const metadata: Metadata = {
  title: "Fly Erken Flight Academy — Learn to Fly in Phoenix",
  description:
    "Discovery flights, ground school, private pilot training, and a career path to the airlines — out of Deer Valley Airport in Phoenix, AZ. 300+ clear-sky flying days a year. Live demo site by Erken Systems.",
  openGraph: {
    title: "Fly Erken Flight Academy — Learn to Fly in Phoenix",
    description:
      "Discovery flights, pilot training, and aircraft rental at Deer Valley Airport, Phoenix. Your first takeoff is closer than you think.",
    images: ["/fly-erken/hero-poster.jpg"],
  },
};

export default function FlyErkenPage() {
  return <FlyErkenClient />;
}
