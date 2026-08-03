import type { Metadata } from "next";
import BjjErkenClient from "./BjjErkenClient";

/**
 * /bjj-erken — Erken Jiu-Jitsu Academy (fictional Phoenix, AZ Brazilian
 * Jiu-Jitsu academy).
 *
 * REPLICATION (2026-08-03): a CLONE of the approved /sky-erken pilot
 * pattern (itself a clone of the live erken.systems homepage), all content
 * repurposed for an independent BJJ academy. Serves bjj.erken.systems via
 * src/proxy.ts host rewrite (the older /demo/bjj page stays reachable
 * directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from src/app/demo/configs/bjj.ts (getDemoConfig("bjj")).
 *
 * Everything here is intentionally DUPLICATED from sky-erken rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Jiu-Jitsu Academy is fictional. All prices,
 * stats, and program claims are invented demo content. Public demo —
 * indexable on purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Jiu-Jitsu Academy — Adult & Kids BJJ in Phoenix, AZ",
  description:
    "Adult and kids Brazilian Jiu-Jitsu classes taught by black belts on Camelback Road, Phoenix. Free trial class, attendance-based win-back, and automatic payment recovery. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Jiu-Jitsu Academy — Adult & Kids BJJ in Phoenix, AZ",
    description:
      "Adult and kids Brazilian Jiu-Jitsu, taught by black belts who still teach fundamentals themselves. Your first roll is one trial class away.",
    images: ["/industries/card-bjj-photo.jpg"],
  },
};

export default function BjjErkenPage() {
  return <BjjErkenClient />;
}
