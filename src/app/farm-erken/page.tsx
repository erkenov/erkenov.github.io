import type { Metadata } from "next";
import FarmErkenClient from "./FarmErkenClient";

/**
 * /farm-erken — Erken Family Farm (fictional Queen Creek, AZ family farm).
 *
 * REPLICATION (2026-08-03): cloned from the owner-approved /sky-erken pilot
 * (same SphereScrollStage/Celly mechanics, same section structure) with all
 * content repurposed for a fictional family farm and agritourism operation.
 * Reachable as the farm.erken.systems root via src/proxy.ts host rewrite.
 *
 * Business facts (phone, booking calendar, Retell dynamic variables) are
 * pulled from the existing src/app/demo/configs/farm.ts registry entry
 * (getDemoConfig("farm")) — same pattern sky-erken uses for skydiving.
 *
 * Everything here is intentionally DUPLICATED from the pilot rather than
 * shared, so nothing on this page can ever change the real homepage.
 *
 * DEMO DISCLAIMER: Erken Family Farm is fictional. All prices, stats, and
 * program claims are invented demo content. Public demo — indexable on
 * purpose (no noindex), matching sky-erken's SEO behavior.
 */
export const metadata: Metadata = {
  title: "Erken Family Farm — CSA Boxes, Farm Tours & U-Pick in Queen Creek",
  description:
    "Weekly CSA boxes, guided farm tours, and seasonal u-pick events on a family farm in Queen Creek, AZ. Live demo site by Erken Systems.",
  openGraph: {
    title: "Erken Family Farm — CSA Boxes, Farm Tours & U-Pick in Queen Creek",
    description:
      "Weekly CSA boxes, guided farm tours, and seasonal u-pick events on 40 acres outside Phoenix. Fresh from the field, straight to your porch.",
    images: ["/industries/card-farming-photo.jpg"],
  },
};

export default function FarmErkenPage() {
  return <FarmErkenClient />;
}
