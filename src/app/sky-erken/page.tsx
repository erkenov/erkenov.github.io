import type { Metadata } from "next";
import SkyErkenClient from "./SkyErkenClient";

/**
 * /sky-erken — Sky Erken Skydiving (fictional Eloy, AZ dropzone).
 *
 * PILOT (2026-08-03): the CORRECTED demo template — a CLONE of the live
 * erken.systems homepage (same SphereScrollStage/Celly mechanics, same
 * section structure, same components as /fly-erken) with all content
 * repurposed for a fictional skydiving dropzone. Replaces the rejected
 * black-and-orange /demo/skydiving page as the sky.erken.systems root via
 * src/proxy.ts host rewrite (the older page stays reachable directly at
 * /demo/skydiving).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/skydiving.ts registry
 * entry (getDemoConfig("skydiving")) — same pattern fly-erken uses for
 * flight-schools.
 *
 * Everything here is intentionally DUPLICATED from home-v8-draft rather
 * than shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Sky Erken Skydiving is fictional. All prices, stats,
 * and program claims are invented demo content. Public demo — indexable
 * on purpose (no noindex), matching fly-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Sky Erken Skydiving — Tandem Jumps & AFF Courses in Eloy, AZ",
  description:
    "Tandem jumps from 13,000 feet, AFF licensing, and experienced-jumper load space out of Eloy Municipal Airport, AZ. 300+ jumpable days a year. Live demo site by Erken Systems.",
  openGraph: {
    title: "Sky Erken Skydiving — Tandem Jumps & AFF Courses in Eloy, AZ",
    description:
      "Tandem jumps, AFF licensing, and load space out of Eloy Municipal Airport. Freefall over the desert at 120 miles an hour.",
    images: ["/industries/card-skydiving-photo.jpg"],
  },
};

export default function SkyErkenPage() {
  return <SkyErkenClient />;
}
