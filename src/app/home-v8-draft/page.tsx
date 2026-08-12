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
 *   3. Pipeline — HubSpot-style sticky-column, always-expanded phase panels
 *   4. AI section — "Built-in AI that works for you 24/7" (3 agent cards)
 *   5. Meet Erken — five sell bullets + three CTAs in one row
 *   6. Pricing — three Platform billing-period cards (Monthly / 6 months /
 *      Yearly; Complete-system and Custom-solutions cards removed 2026-08-12)
 *   7. Stack-comparison — replace-your-stack table ($400–700/mo vs $97)
 *   8. Integrations marquee — last section (auto-scroll ticker)
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
