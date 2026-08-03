import type { Metadata } from "next";
import MakeErkenClient from "./MakeErkenClient";

/**
 * /make-erken — Erken Makerspace (fictional Tempe, AZ community makerspace).
 *
 * REPLICATION (2026-08-03): the CORRECTED demo template — a CLONE of the
 * live erken.systems homepage (same SphereScrollStage/Celly mechanics, same
 * section structure, same components as /sky-erken and /fly-erken) with all
 * content repurposed for a fictional community fabrication workshop.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/makerspace.ts registry
 * entry (getDemoConfig("makerspace")) — same pattern sky-erken/fly-erken
 * use for their industries.
 *
 * Everything here is intentionally DUPLICATED from home-v8-draft rather
 * than shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Makerspace is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken/fly-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Makerspace — Classes, Memberships & Fab Services in Tempe, AZ",
  description:
    "Laser cutting, 3D printing, CNC fabrication, and kids robotics classes out of a community makerspace in Tempe, AZ. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Makerspace — Classes, Memberships & Fab Services in Tempe, AZ",
    description:
      "Laser cutting, 3D printing, CNC fabrication, and kids robotics classes on real machines, taught by people who use them every day.",
    images: ["/industries/card-makerspace-photo.jpg"],
  },
};

export default function MakeErkenPage() {
  return <MakeErkenClient />;
}
