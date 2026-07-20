import type { Metadata } from "next";
import HomeV8Client from "./HomeV8Client";

/**
 * /home-v8-draft — the REAL live homepage (preview-v7) with the approved
 * home-draft restructure applied (2026-07-20).
 *
 * This is a COPY of preview-v7's page (Three.js SphereScrollStage, roaming
 * Celly + dust trail, scroll-driven cell) — so every live effect comes along
 * natively — reordered to the approved story:
 *   1. Hero (kept live, + price tease + "See your industry" button)
 *   2. Industries — moved up to section 2 (self-identification hook)
 *   3. Compressed illustrated pipeline — replaces the four full-screen
 *      step scenes with home-draft's Variant-A stepper + inline-SVG illos
 *   4. Meet Erken — five sell bullets + three CTAs in one row
 *   5. Pricing — full /start-style plan cards
 *   6. Custom solutions
 *   (the get-leads / "you want customers" section was removed; the real
 *    coming-soon card still lives on /start)
 *   (no footer, no divider lines between sections)
 *
 * preview-v7 / page.tsx / /home-draft are all untouched. Split into a server
 * page (metadata) + client tree because the client tree is "use client".
 *
 * noindex: review draft, not meant to be crawled or linked publicly yet.
 */
export const metadata: Metadata = {
  title: "Erken Systems — Homepage v8 Draft (Internal Review)",
  description:
    "Draft homepage: the live preview-v7 page restructured to the approved order. Not the live site.",
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

export default function HomeV8DraftPage() {
  return <HomeV8Client />;
}
