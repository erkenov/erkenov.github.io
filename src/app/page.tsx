import type { Metadata } from "next";
import HomeV8Client from "./home-v8-draft/HomeV8Client";

/**
 * Homepage → the v8 page (Shamil approved 2026-07-20).
 *
 * `/` now renders the same client tree as /home-v8-draft — the restructured
 * homepage (hero → industries → pipeline → AI → Meet Erken → pricing → stack
 * comparison → integrations marquee) with the live
 * SphereScrollStage + roaming Celly. This route carries PRODUCTION metadata
 * and is INDEXABLE; /home-v8-draft keeps its own noindex metadata as a draft
 * alias.
 *
 * ROLLBACK: the previous homepage was preview-v7. To roll back, replace this
 * whole file with:  export { default } from "./preview-v7/page";
 * /preview-v7 is still reachable and unchanged, so rollback is instant.
 */
export const metadata: Metadata = {
  title: "Erken Systems — Smart Business Systems Builder",
  description:
    "One platform runs your business — leads captured, tracked, and reported on automatically — with built-in AI and Erken, the assistant that teaches you every step. Voice agents, CRM, automations, dashboards; built by an operator, not an agency. From $77/mo.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Erken Systems — Smart Business Systems Builder",
    description:
      "One platform runs your business, with built-in AI and an assistant that teaches you every step. From $77/mo.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeV8Client />;
}
