import type { Metadata } from "next";
import ShootErkenClient from "./ShootErkenClient";

/**
 * /shoot-erken — Erken Shooting Range (fictional Phoenix, AZ shooting
 * range and training center).
 *
 * REPLICATION (2026-08-03): cloned from the approved sky-erken pilot — same
 * SphereScrollStage/Celly mechanics, same section structure, same
 * components — with all content repurposed for a fictional shooting range.
 * Serves as the shoot.erken.systems root via src/proxy.ts host rewrite
 * (the older /demo/shooting page stays reachable directly).
 *
 * Copy stays on training, membership, and corporate events per Shamil's
 * explicit call — never on selling firearms — mirroring
 * src/app/demo/configs/shooting.ts.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/shooting.ts registry entry
 * (getDemoConfig("shooting")) — same pattern the pilot uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Shooting Range is fictional. All prices, stats,
 * and program claims are invented demo content. Public demo — indexable
 * on purpose (no noindex), matching the pilot's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Shooting Range — Training Courses & Memberships in Phoenix, AZ",
  description:
    "Certified firearms safety courses, lane memberships, and corporate range events in Phoenix, AZ. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Shooting Range — Training Courses & Memberships in Phoenix, AZ",
    description:
      "Certified instruction, a real course calendar, and 24/7 front-desk answers.",
    images: ["/industries/card-shooting-photo.jpg"],
  },
};

export default function ShootErkenPage() {
  return <ShootErkenClient />;
}
