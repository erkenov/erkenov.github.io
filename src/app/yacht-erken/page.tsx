import type { Metadata } from "next";
import YachtErkenClient from "./YachtErkenClient";

/**
 * /yacht-erken — Erken Yacht Charters (fictional Fort Lauderdale, FL charter
 * company and ASA sailing school).
 *
 * REPLICATION (2026-08-03): cloned from the approved sky-erken pilot — same
 * SphereScrollStage/Celly mechanics, same section structure, same
 * components — with all content repurposed for a fictional yacht charter
 * and sailing school. Serves as the yacht.erken.systems root via
 * src/proxy.ts host rewrite (the older /demo/yacht page stays reachable
 * directly).
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/yacht.ts registry entry
 * (getDemoConfig("yacht")) — same pattern the pilot uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Yacht Charters is fictional. All prices, stats,
 * and program claims are invented demo content. Public demo — indexable
 * on purpose (no noindex), matching the pilot's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Yacht Charters — Charters & Sailing Courses in Fort Lauderdale, FL",
  description:
    "Day and multi-day yacht charters, ASA sailing courses, and boat club membership out of Bahia Mar Marina, Fort Lauderdale, FL. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Yacht Charters — Charters & Sailing Courses in Fort Lauderdale, FL",
    description:
      "Day and multi-day charters, ASA sailing courses, and boat club membership. Book direct — no broker commission.",
    images: ["/industries/card-yachting-photo.jpg"],
  },
};

export default function YachtErkenPage() {
  return <YachtErkenClient />;
}
