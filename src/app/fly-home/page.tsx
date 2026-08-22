import type { Metadata } from "next";
import FlyHomeClient from "./FlyHomeClient";

/**
 * /fly-home — LOCAL-ONLY draft homepage repurposed for FLIGHT SCHOOL
 * OWNERS exclusively (2026-08-22). Sells The Receptionist ($97/mo +
 * $197 setup) as the answer to the missed-call leak, per the
 * right-rudder-website-analysis borrow list (vault 03-research).
 *
 * Everything here is intentionally DUPLICATED / local to this folder —
 * no shared homepage component is touched, so the live site cannot
 * change. Local minimal header/footer replace the shared chrome so no
 * industry links appear.
 *
 * noindex: review draft, not meant to be crawled or linked publicly yet.
 */
export const metadata: Metadata = {
  title: "Erken Systems for Flight Schools — Homepage Draft (Internal Review)",
  description:
    "Draft homepage for flight school owners: The Receptionist answers every call, text, and website chat 24/7 and books discovery flights into your calendar. Not the live site.",
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

export default function FlyHomePage() {
  return <FlyHomeClient />;
}
