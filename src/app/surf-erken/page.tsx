import type { Metadata } from "next";
import SurfErkenClient from "./SurfErkenClient";

/**
 * /surf-erken — Erken Surf Camp (fictional Tamarindo, Costa Rica surf camp).
 *
 * REPLICATION (2026-08-03): cloned from the owner-approved /sky-erken pilot
 * (same SphereScrollStage/Celly mechanics, same section structure) with all
 * content repurposed for a fictional surf school and camp. Reachable as the
 * surf.erken.systems root via src/proxy.ts host rewrite.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/surf.ts registry entry
 * (getDemoConfig("surf")) — same pattern sky-erken uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Surf Camp is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Surf Camp — Surf Lessons & Week-Long Packages in Tamarindo",
  description:
    "Beginner surf lessons, week-long surf-and-stay packages, and board rentals on Playa Tamarindo, Costa Rica. 300+ surfable days a year. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Surf Camp — Surf Lessons & Week-Long Packages in Tamarindo",
    description:
      "Beginner lessons, week-long surf-and-stay packages, and board rentals on Playa Tamarindo. Stand up on your first wave this week.",
    images: ["/industries/card-surfing-photo.jpg"],
  },
};

export default function SurfErkenPage() {
  return <SurfErkenClient />;
}
