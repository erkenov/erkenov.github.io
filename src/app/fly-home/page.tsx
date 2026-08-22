import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FlyHomeClient from "./FlyHomeClient";

/**
 * /fly-home — LOCAL-ONLY draft homepage repurposed for FLIGHT SCHOOL
 * OWNERS exclusively (2026-08-22). Sells The Receptionist ($97/mo flat,
 * NO setup fee — Shamil 2026-08-22 revision) as the answer to the
 * missed-call leak, per the right-rudder-website-analysis borrow list
 * (vault 03-research).
 *
 * Everything here is intentionally DUPLICATED / local to this folder —
 * no shared homepage component is touched, so the live site cannot
 * change. Local minimal header/footer replace the shared chrome so no
 * industry links appear.
 *
 * Pass 2 (2026-08-22): missing-layer section, missed-call cost
 * calculator, FAQ section with FAQPage JSON-LD (served below),
 * public/llms.txt.
 * Revision 2 (2026-08-22): hero intro video, five-card framework,
 * process + 5th step, accordion FAQ in sage/amber (merged WhyUs),
 * stack table at bottom, $197 setup removed everywhere.
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

/* FAQPage structured data — mirrors the FAQ section in FlyHomeClient.
   Keep the two in sync when the Q&A copy changes. */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does it replace my front desk?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It covers what a front desk can't: after-hours, weekends, and the calls that come in while everyone's flying. Your staff keeps the day shift; nothing gets missed around it.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when it doesn't know an answer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It says so honestly, takes the caller's details, and texts you the summary — no invented answers, ever.",
      },
    },
    {
      "@type": "Question",
      name: "How does discovery-flight booking work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It connects to your calendar and books straight into it, with automatic reminders. If you don't use a calendar today, setup includes one.",
      },
    },
    {
      "@type": "Question",
      name: "Do I keep my phone number?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Calls forward to the Receptionist only when you can't answer — after hours, or when the line is busy.",
      },
    },
    {
      "@type": "Question",
      name: "Why is it only $97 a month?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The honest answer: it runs on GoHighLevel — a platform that costs me $297 a month and already has everything built in. You can buy GoHighLevel yourself for $97 a month — exactly what I charge. The difference: buying direct gets you no setup, no one monitoring your account, no one looking for ways to improve it. From me, the same $97 includes all of that. My math is simple — $97 times the months you stay, and you stay because the system keeps improving. Cheap enough never to resent, valuable enough never to leave.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a contract?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. $97 a month, cancel anytime — no setup fee, no contract, no hostage-taking. The demo line on this page is the product, live — judge it before you pay anything.",
      },
    },
  ],
};

export default function FlyHomePage() {
  // HIDDEN 2026-08-22 (Shamil: "fly-home shouldn't be accessible — delete
  // it or hide it"): the route 404s publicly; the code stays in the repo
  // (recoverable — remove this call to re-enable the draft).
  notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <FlyHomeClient />
    </>
  );
}
