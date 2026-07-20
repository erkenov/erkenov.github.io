import type { Metadata } from "next";
import HomeDraftClient from "./HomeDraftClient";

/**
 * /home-draft — Administrator's proposed homepage restructure (2026-07-20).
 *
 * DRAFT ONLY. The live homepage (src/app/page.tsx → preview-v7) is
 * untouched. This route reorders the story for a cold visitor:
 *   1. Hero (kept)
 *   2. Industries — moved up to section 2 (self-identification hook)
 *   3. Pipeline proof — the four steps compressed into one tight section
 *   4. Pricing tease — $97/mo, transparent, one glance
 *   5. Meet Erken — current /start positioning (sell bullets + download)
 *   6. Get leads door — second audience (companies that want customers,
 *      not software)
 *
 * Kept as a plain server component (metadata export) that renders the
 * interactive client tree — preview-v7's own page.tsx is "use client" at
 * the top, which can't export metadata in the same file.
 *
 * noindex: this is a review draft, not meant to be crawled or linked
 * publicly yet.
 */
export const metadata: Metadata = {
  title: "Erken Systems — Homepage Draft (Internal Review)",
  description:
    "Draft homepage restructure for internal review. Not the live site.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function HomeDraftPage() {
  return <HomeDraftClient />;
}
