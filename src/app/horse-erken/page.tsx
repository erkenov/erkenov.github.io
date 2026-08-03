import type { Metadata } from "next";
import HorseErkenClient from "./HorseErkenClient";

/**
 * /horse-erken — Erken Riding Stables (fictional Scottsdale, AZ horse
 * riding school and stable).
 *
 * REPLICATION (2026-08-03): cloned from the approved sky-erken pilot — same
 * SphereScrollStage/Celly mechanics, same section structure, same
 * components — with all content repurposed for a fictional riding stable.
 * Serves as the horse.erken.systems root via src/proxy.ts host rewrite
 * (the older /demo/horse page stays reachable directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/horse.ts registry entry
 * (getDemoConfig("horse")) — same pattern the pilot uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Riding Stables is fictional. All prices, stats,
 * and program claims are invented demo content. Public demo — indexable
 * on purpose (no noindex), matching the pilot's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Riding Stables — Lessons, Trail Rides & Boarding in Scottsdale, AZ",
  description:
    "English and western riding lessons, guided desert trail rides, and horse boarding out of Scottsdale, AZ. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Riding Stables — Lessons, Trail Rides & Boarding in Scottsdale, AZ",
    description:
      "Real online scheduling for lessons, trail rides, and boarding — no more paper booking book.",
    images: ["/industries/card-horseriding-photo.jpg"],
  },
};

export default function HorseErkenPage() {
  return <HorseErkenClient />;
}
