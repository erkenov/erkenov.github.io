import type { Metadata } from "next";
import GymErkenClient from "./GymErkenClient";

/**
 * /gym-erken — Erken Fitness Box (fictional Phoenix, AZ boutique gym and
 * fitness box).
 *
 * REPLICATION (2026-08-03): a CLONE of the approved /sky-erken pilot
 * pattern (itself a clone of the live erken.systems homepage), all content
 * repurposed for an independent boutique gym. Serves gym.erken.systems via
 * src/proxy.ts host rewrite (the older /demo/gym page stays reachable
 * directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from src/app/demo/configs/gym.ts (getDemoConfig("gym")).
 *
 * Everything here is intentionally DUPLICATED from sky-erken rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Fitness Box is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Fitness Box — Group Training & Free Trial in Phoenix, AZ",
  description:
    "Coached group classes and a free trial session out of a boutique gym on Indian School Road, Phoenix. Attendance-based win-back, missed-call text-back, and automatic payment recovery. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Fitness Box — Group Training & Free Trial in Phoenix, AZ",
    description:
      "Coached group training, real programming, and a coaching staff that knows your name. Your first class is free, and it's today.",
    images: ["/industries/card-gym-photo.jpg"],
  },
};

export default function GymErkenPage() {
  return <GymErkenClient />;
}
