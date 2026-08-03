import type { Metadata } from "next";
import TennisErkenClient from "./TennisErkenClient";

/**
 * /tennis-erken — Erken Tennis Academy (fictional Scottsdale, AZ tennis club).
 *
 * REPLICATION (2026-08-03): cloned from the owner-approved /sky-erken pilot
 * (same SphereScrollStage/Celly mechanics, same section structure) with all
 * content repurposed for a fictional tennis club and academy. Reachable as
 * the tennis.erken.systems root via src/proxy.ts host rewrite.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/tennis.ts registry entry
 * (getDemoConfig("tennis")) — same pattern sky-erken uses for skydiving.
 *
 * IMPORTANT positioning note (research, vault Notes/problem-solution.md):
 * tennis clubs have the OPPOSITE problem from most industries — too much
 * demand, not too little. This page deliberately never pitches lead
 * generation; it sells smoother booking, reminders, and no-show rescue only.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Tennis Academy is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Tennis Academy — Junior & Adult Programs in Scottsdale",
  description:
    "Junior development, adult clinics, and private lessons on 12 courts in Scottsdale, AZ. Book a trial lesson online. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Tennis Academy — Junior & Adult Programs in Scottsdale",
    description:
      "Junior development, adult clinics, and private lessons across 12 courts. A junior program parents actually trust.",
    images: ["/industries/card-tennis-photo.jpg"],
  },
};

export default function TennisErkenPage() {
  return <TennisErkenClient />;
}
