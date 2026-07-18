/**
 * /storm-v2 — Storm Roofing Heroes landing page, v2.
 *
 * Structural skeleton borrowed from the strongest Dallas roofer's site
 * (hero fork → credibility wall → six services → territory → story →
 * storm urgency → intake form); design, copy, and imagery are original.
 * Part of the sellable roofing-agency snapshot.
 *
 * DEMO DATA: SRH is a fictional demo client — every stat, review count,
 * founder name, and storm event on this page is invented placeholder
 * data (see components/data.tsx). Replace before production use.
 */

import type { Metadata } from "next";
import StormV2Client from "./components/StormV2Client";

export const metadata: Metadata = {
  title: "Storm Roofing Heroes — Dallas–Fort Worth Roofing & Storm Restoration",
  description:
    "Roof replacement, storm & hail restoration, and insurance claim support across the DFW metroplex. 500+ roofs restored since 2016. Free inspections, 3-year workmanship warranty.",
  robots: { index: false, follow: false }, // demo page — keep out of search
};

export default function StormV2Page() {
  return (
    <>
      {/* Injects a real HTML comment into the served page marking the demo data. */}
      <div
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html:
            "<!-- DEMO PLACEHOLDER DATA: Storm Roofing Heroes is a fictional demo client. All statistics, review counts, founder names, storm events, and company history on this page are invented placeholder content for demo purposes. -->",
        }}
      />
      <StormV2Client />
    </>
  );
}
