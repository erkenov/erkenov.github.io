import type { Metadata } from "next";
import ClimbErkenClient from "./ClimbErkenClient";

/**
 * /climb-erken — Erken Climbing Co. (fictional Phoenix, AZ climbing gym).
 *
 * REPLICATION (2026-08-03): cloned from the owner-approved /sky-erken pilot
 * (same SphereScrollStage/Celly mechanics, same section structure) with all
 * content repurposed for a fictional climbing gym and guide service.
 * Reachable as the climb.erken.systems root via src/proxy.ts host rewrite.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/climbing.ts registry entry
 * (getDemoConfig("climbing")) — same pattern sky-erken uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Climbing Co. is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Climbing Co. — Gym Memberships & Guided Trips in Phoenix",
  description:
    "Bouldering and top-rope climbing, intro classes, and guided outdoor trips out of Phoenix, AZ. Book an intro class online. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Climbing Co. — Gym Memberships & Guided Trips in Phoenix",
    description:
      "Bouldering and top-rope walls, intro classes, and guided outdoor trips into the Superstitions. Climb your first wall today.",
    images: ["/industries/card-climbing-photo.jpg"],
  },
};

export default function ClimbErkenPage() {
  return <ClimbErkenClient />;
}
