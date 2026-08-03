import type { Metadata } from "next";
import FixErkenClient from "./FixErkenClient";

/**
 * /fix-erken — Erken Device Repair (fictional Tempe, AZ repair shop).
 *
 * REPLICATION (2026-08-03): built from the approved /sky-erken pilot — a
 * CLONE of the live erken.systems homepage (same SphereScrollStage/Celly
 * mechanics, same section structure, same components as /fly-erken and
 * /sky-erken) with all content repurposed for a fictional electronics
 * repair shop.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/electronics.ts registry
 * entry (getDemoConfig("electronics")) — same pattern the other -erken
 * demo pages use.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Device Repair is fictional. All prices, stats,
 * and program claims are invented demo content. Public demo — indexable
 * on purpose (no noindex), matching sky-erken/fly-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Device Repair — Phone, Laptop & Console Repair in Tempe, AZ",
  description:
    "Walk-in and mail-in repair for phones, laptops, consoles, drones, and appliances out of Tempe, AZ — a real quote before you drop it off, and status texts at every stage. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Device Repair — Phone, Laptop & Console Repair in Tempe, AZ",
    description:
      "Get a real repair quote in minutes, not a callback tomorrow — phone, laptop, console, drone, and appliance repair out of Tempe, AZ.",
    images: ["/industries/card-electronics-photo.jpg"],
  },
};

export default function FixErkenPage() {
  return <FixErkenClient />;
}
