/**
 * Automotive shops — Erken Auto Garage (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-automotive-photo.jpg";

const automotive: DemoConfig = {
  slug: "automotive",
  industryLabel: "auto repair and performance shop",
  business: {
    name: "Erken Auto Garage",
    short: "Erken Auto",
    tagline: "Repair, tune, rebuild",
    location: "1440 E McDowell Rd · Phoenix, AZ",
    phoneDisplay: "(888) 799-6065",
    hours: "Mon–Sat 7am–6pm · Sun closed",
    icon: "wrench",
  },
  meta: {
    title: "Erken Auto Garage — Repair, Tuning & Performance in Phoenix | Demo by Erken Systems",
    description:
      "General repair, dyno tuning, and custom builds out of a full-service Phoenix, AZ garage. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0F0D0B",
    surface: "#1A1613",
    surface2: "#141110",
    border: "#2C2620",
    borderStrong: "#453B31",
    text: "#F5F0EA",
    textMuted: "#B4A99A",
    textDim: "#7A6F62",
    accent: "#D6702E",
    accentHover: "#E4843F",
    accentSoft: "rgba(214, 112, 46, 0.14)",
    accentText: "#0B0F15",
    dark: "#0A0807",
    darkText: "#F5F0EA",
    darkMuted: "#A69A8B",
  },
  sections: [
    "hero",
    "mission",
    "stats",
    "services",
    "about",
    "steps",
    "testimonials",
    "faq",
    "booking",
    "cta",
  ],
  hero: {
    kicker: "1440 E McDowell Rd · Phoenix, AZ",
    headline: "The shop that answers when the bay is full.",
    headlineAccent: "answers when the bay is full",
    sub: "General repair, dyno tuning, and custom builds from techs who've worked on everything from daily drivers to track cars. Most jobs quoted the same day.",
    image: IMG,
    imageAlt: "Technician working on a car lift inside Erken Auto Garage",
    primaryCta: "Book a drop-off",
    secondaryCta: "Ask our AI front desk",
    badge: "ASE Certified Techs · Est. 2013",
  },
  mission: {
    kicker: "Why we wrench",
    statement:
      "Fix it right the first time, quote it straight, and answer the phone even when every tech is elbow-deep in an engine.",
    statementAccent: "answer the phone even when every tech is elbow-deep",
    sub: "A real booking calendar and a real front desk — not a machine that just takes a message.",
    values: ["Honest quotes", "Same-day diagnostics", "No upsell games", "Straight answers"],
  },
  stats: [
    { value: "18,000+", label: "Vehicles serviced since 2013" },
    { value: "9", label: "ASE-certified technicians" },
    { value: "4.9★", label: "Average shop rating" },
    { value: "24hr", label: "Average quote turnaround" },
  ],
  services: {
    kicker: "Services",
    headline: "From an oil change to a full engine build",
    sub: "Every job runs through the same intake, the same bay schedule, and the same techs who answer your follow-up questions.",
    moreLabel: "Also at the shop",
    items: [
      {
        icon: "wrench",
        title: "General Repair & Diagnostics",
        body: "Check-engine lights, brakes, suspension, and everything in between. Full diagnostic scan and a written quote before any work starts.",
        price: "from $89",
        image: IMG,
        imageAlt: "Technician running a diagnostic scan on a vehicle",
      },
      {
        icon: "gauge",
        title: "Dyno Tuning",
        body: "In-house dyno for naturally aspirated and forced-induction builds. Baseline pull, tune, and a printout that shows exactly what changed.",
        price: "from $450",
      },
      {
        icon: "hammer",
        title: "Custom & Performance Builds",
        body: "Engine swaps, forced induction, and full builds project-managed from parts sourcing to dyno day.",
        price: "custom quote",
      },
      {
        icon: "calendar",
        title: "Scheduled Maintenance",
        body: "Oil changes, fluid services, and manufacturer-interval maintenance that keeps your warranty intact.",
        price: "from $59",
      },
      {
        icon: "shield",
        title: "Pre-Purchase Inspection",
        body: "A 100-point inspection before you buy a used car, with photos and a written report the same day.",
        price: "$149",
      },
      {
        icon: "clock",
        title: "Same-Day Express Service",
        body: "Brakes, batteries, and quick fixes while you wait in the lobby. No appointment needed for express jobs.",
        price: "varies",
      },
    ],
  },
  about: {
    kicker: "The garage",
    headline: "A shop built by techs, not a franchise counter",
    paragraphs: [
      "Erken Auto opened in 2013 with two lifts and a promise: a quote you can trust and a tech who'll explain it in plain English. Today we run nine lifts and a full-time ASE-certified team on McDowell Road — and the promise still holds.",
      "Your car gets one tech from drop-off to pickup, our bay schedule lives online so you can see real availability, and our front desk answers every call — even the ones asking if that noise is serious.",
    ],
    bullets: [
      "ASE-certified technicians — average 11 years experience",
      "In-house dyno, alignment rack, and diagnostic bay",
      "Digital inspection reports with photos, sent same day",
      "Written quotes before any work starts — no surprise labor",
    ],
    image: IMG,
    imageAlt: "Erken Auto Garage bay with a car on the lift",
  },
  steps: {
    kicker: "How it works",
    headline: "Three steps to a fixed car",
    sub: "No guessing, no surprise invoice. You approve the quote first.",
    items: [
      {
        title: "Book your drop-off",
        body: "Pick a slot online or call — our AI front desk answers 24/7 and books you straight into the bay schedule.",
      },
      {
        title: "Get a written quote",
        body: "Full diagnostic scan, then a written quote before a single wrench turns. You approve it, or you don't pay for the diagnostic.",
      },
      {
        title: "Pick up and drive",
        body: "A text the moment it's ready, a walk-through of what was done, and a follow-up if anything feels off.",
      },
    ],
  },
  testimonials: {
    kicker: "Customers",
    headline: "People who stopped shopping around for a mechanic",
    items: [
      {
        quote:
          "I called mid-morning expecting to leave a voicemail. The AI receptionist got my make, model, and the noise it was making, and booked me in for that afternoon.",
        name: "Marco T.",
        role: "Repeat customer since 2021",
      },
      {
        quote:
          "Got a text with photos of exactly what was wrong with my brakes before they called to explain the quote. First shop that's ever done that.",
        name: "Renee A.",
        role: "Daily-driver customer",
      },
      {
        quote:
          "Brought my build in for a tune and got a dyno printout that actually made sense. No hand-waving, just numbers.",
        name: "Chris B.",
        role: "Performance build customer",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first visit",
    items: [
      {
        q: "How much does a diagnostic cost?",
        a: "Our diagnostic fee starts at $89 and is waived if you approve the repair. You get a written quote before we touch anything else.",
      },
      {
        q: "Do you work on all makes and models?",
        a: "Yes — domestic, import, and most performance platforms. If a job needs a specialty tool or dealer-only part, we'll tell you upfront instead of guessing.",
      },
      {
        q: "How long will my car be in the shop?",
        a: "Most general repairs finish same-day or next-day. Custom builds get a project timeline at quote time, and we update you at every milestone.",
      },
      {
        q: "Can I get a loaner or a ride?",
        a: "We offer local drop-off and pickup, and can arrange a loaner for multi-day jobs — just ask when you book.",
      },
      {
        q: "Do you honor my extended warranty?",
        a: "We work with most third-party warranty providers and handle the claims paperwork on our end so you're not stuck on hold with an insurer.",
      },
    ],
  },
  booking: {
    kicker: "Book a drop-off",
    headline: "Book your drop-off — pick a real bay slot",
    sub: "Grab an open slot below and you're on the schedule instantly. Prefer a call instead? Use the callback button up top.",
    // NOTE (flag for Shamil's review, mirrors the sky-erken pilot comment):
    // reuses the SAME shared demo GHL calendar as flight-schools/sky-erken
    // (SS2V1nuWEIbOlNrzyxpt) — there is no dedicated Erken Auto calendar yet.
    // Fine for a pilot click-through; a real per-industry calendar should
    // probably exist before this pattern goes further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    note: "Confirmed instantly — you'll get a text and email with drop-off details. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The bay is a short drive away.",
    sub: "One written quote tells you more than a year of guessing what's wrong.",
    buttonLabel: "Book your drop-off",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "auto repair and performance shop",
      demo_business: "Erken Auto Garage",
      demo_context:
        "Caller is on the Erken Auto Garage demo site (a fictional auto repair and performance shop demo by Erken Systems, positioned in Phoenix, AZ). Play the shop's AI front desk: answer questions about general repair, dyno tuning, custom builds, and scheduled maintenance, and offer to book a drop-off slot.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "General repair, dyno tuning, and custom builds out of a full-service garage in Phoenix, AZ since 2013.",
  },
};

export default automotive;
