import type { Metadata } from "next";
import HomeV8Client from "./HomeV8Client";

/**
 * /flightschool — SNAPSHOT of the flight-school homepage (copied from
 * home-v8-draft on 2026-09-03; Shamil task: "move main page to
 * flightschool.erken.systems"). The subdomain flightschool.erken.systems
 * rewrites its root "/" to this route via src/proxy.ts; the page is also
 * reachable directly at erken.systems/flightschool.
 *
 * Deliberately a COPY, not a shared import of the homepage: the live
 * homepage (HomeV8 at erken.systems/) is being reworked toward universal
 * positioning next, and this snapshot must keep the flight-school version
 * regardless of those edits. Same isolation pattern as /fly-home.
 *
 * INDEXABLE — this is the public flight-school landing page; all
 * flight-school traffic (ads, outreach links) is sent here.
 */
export const metadata: Metadata = {
  title: "Erken Systems for Flight Schools — AI-Powered Marketing & Operating System",
  description:
    "One platform runs your flight school — every call, text, and website chat answered 24/7, discovery flights booked straight into your calendar, leads tracked and reported on automatically. Built by an operator, not an agency. From $77/mo.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://flightschool.erken.systems" },
  openGraph: {
    title: "Erken Systems for Flight Schools — AI-Powered Marketing & Operating System",
    description:
      "One platform runs your flight school, with built-in AI and an assistant that teaches you every step. From $77/mo.",
    type: "website",
  },
};

export default function FlightschoolPage() {
  return <HomeV8Client />;
}
