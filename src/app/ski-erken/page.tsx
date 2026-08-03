import type { Metadata } from "next";
import SkiErkenClient from "./SkiErkenClient";

/**
 * /ski-erken — Erken Ski Lodge (fictional Park City, UT independent ski
 * school and lodge).
 *
 * REPLICATION (2026-08-03): cloned from the approved sky-erken pilot — same
 * SphereScrollStage/Celly mechanics, same section structure, same
 * components — with all content repurposed for a fictional ski school and
 * lodge. Serves as the ski.erken.systems root via src/proxy.ts host
 * rewrite (the older /demo/ski page stays reachable directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/ski.ts registry entry
 * (getDemoConfig("ski")) — same pattern the pilot uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Ski Lodge is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching the pilot's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Ski Lodge — Lessons, Rentals & Stays in Park City, UT",
  description:
    "Independent ski and snowboard lessons, rental gear, and lodge rooms three minutes from the lift in Park City, UT. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Ski Lodge — Lessons, Rentals & Stays in Park City, UT",
    description:
      "Lessons, rentals, and lodge rooms in one booking. Gear pre-fit and waiting when you arrive.",
    images: ["/industries/card-skiing-photo.jpg"],
  },
};

export default function SkiErkenPage() {
  return <SkiErkenClient />;
}
