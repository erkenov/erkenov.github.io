/**
 * Electronics & repair shops — Erken Device Repair (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-electronics-photo.jpg";

const electronics: DemoConfig = {
  slug: "electronics",
  industryLabel: "electronics and device repair shop",
  business: {
    name: "Erken Device Repair",
    short: "Erken Repair",
    tagline: "Phones, laptops, consoles, drones",
    location: "3010 E Baseline Rd · Tempe, AZ",
    phoneDisplay: "(325) 241-3357",
    hours: "Mon–Sat 9am–7pm · Sun 11am–4pm",
    icon: "cpu",
  },
  meta: {
    title: "Erken Device Repair — Phone, Laptop & Console Repair in Tempe | Demo by Erken Systems",
    description:
      "Walk-in and mail-in repair for phones, laptops, consoles, drones, and appliances out of Tempe, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0A1014",
    surface: "#101A20",
    surface2: "#0C1519",
    border: "#1D2E36",
    borderStrong: "#2C4753",
    text: "#ECF3F6",
    textMuted: "#9DB2BC",
    textDim: "#647882",
    accent: "#3D9CB0",
    accentHover: "#50AFC3",
    accentSoft: "rgba(61, 156, 176, 0.14)",
    accentText: "#0B0F15",
    dark: "#080D10",
    darkText: "#ECF3F6",
    darkMuted: "#8DA2AC",
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
    kicker: "Baseline Rd · Tempe, AZ",
    headline: "A quote in minutes, not a callback tomorrow.",
    headlineAccent: "not a callback tomorrow",
    sub: "Phone, laptop, console, drone, and appliance repair with a real quote before you drop it off, and text updates so you stop calling to ask if it's ready.",
    image: IMG,
    imageAlt: "Technician repairing a device at Erken Device Repair",
    primaryCta: "Get a repair quote",
    secondaryCta: "Ask our AI front desk",
    badge: "Same-Day Repairs Available · Est. 2015",
  },
  mission: {
    kicker: "Why we fix it",
    statement:
      "Answer the quote request while the tech is mid-teardown, and stop the \"is it ready yet\" calls before they start.",
    statementAccent: "stop the \"is it ready yet\" calls before they start",
    sub: "A real ballpark quote, a real repair-status text at every stage, and technicians who explain what actually broke.",
    values: ["Real quotes upfront", "Status texts at every stage", "Walk-in or mail-in", "No surprise fees"],
  },
  stats: [
    { value: "38,000+", label: "Devices repaired since 2015" },
    { value: "94%", label: "Same-day repair rate" },
    { value: "9", label: "Certified technicians" },
    { value: "90-day", label: "Warranty on every repair" },
  ],
  services: {
    kicker: "Repairs",
    headline: "From a cracked screen to a full board repair",
    sub: "Every job runs on a written quote, a real repair queue, and status texts you don't have to ask for.",
    moreLabel: "Also at the shop",
    items: [
      {
        icon: "cpu",
        title: "Phone & Tablet Repair",
        body: "Screen, battery, and water-damage repair for all major phone and tablet brands, most done same-day.",
        price: "from $59",
        image: IMG,
        imageAlt: "Technician repairing a smartphone screen at Erken Device Repair",
      },
      {
        icon: "wrench",
        title: "Laptop & Computer Repair",
        body: "Screen replacement, data recovery, virus removal, and hardware upgrades for Windows and Mac laptops.",
        price: "from $89",
      },
      {
        icon: "gauge",
        title: "Game Console Repair",
        body: "Disc drive, HDMI port, and overheating repairs for major console brands, with diagnostic before any work starts.",
        price: "from $69",
      },
      {
        icon: "wind",
        title: "Drone Repair",
        body: "Motor, gimbal, and crash-damage repair for consumer and prosumer drones, plus firmware troubleshooting.",
        price: "from $79",
      },
      {
        icon: "shield",
        title: "Appliance Repair",
        body: "In-home diagnostic and repair for major kitchen and laundry appliances, scheduled around your day.",
        price: "from $95 house call",
      },
      {
        icon: "key",
        title: "Data Recovery & Transfer",
        body: "Recovery from damaged drives and full data transfer to a new device, with a no-recovery-no-fee policy.",
        price: "from $120",
      },
    ],
  },
  about: {
    kicker: "The shop",
    headline: "A repair shop that texts you back, not a mystery box drop-off",
    paragraphs: [
      "Erken Repair opened in 2015 with one bench and a promise: a real quote before you commit, and no surprise line items at pickup. Today we run a full repair bay in Tempe handling phones, laptops, consoles, drones, and appliances — and the promise still holds.",
      "Every job gets a status text at each stage — received, diagnosed, in repair, ready — so you stop calling to check. Our intake system tracks walk-ins and mail-ins in one place, and our front desk answers every call, even while a tech is elbow-deep in a teardown.",
    ],
    bullets: [
      "Certified technicians for phones, computers, consoles, and drones",
      "Automatic status texts at every repair stage",
      "90-day warranty on all parts and labor",
      "No-recovery-no-fee data recovery policy",
    ],
    image: IMG,
    imageAlt: "Repair bench with tools and devices at Erken Device Repair",
  },
  steps: {
    kicker: "How it works",
    headline: "Three steps to a fixed device",
    sub: "No mystery quote, no chasing the shop for updates.",
    items: [
      {
        title: "Get a quote",
        body: "Describe the device and issue online or call — our AI receptionist gives a ballpark quote and books your walk-in slot or mail-in intake.",
      },
      {
        title: "We diagnose and confirm",
        body: "A full diagnostic before any repair starts, with a final quote you approve before we touch anything.",
      },
      {
        title: "Get status texts until pickup",
        body: "Automatic texts at every stage — diagnosed, in repair, ready for pickup — so you never have to call and ask.",
      },
    ],
  },
  testimonials: {
    kicker: "Customers",
    headline: "People who stopped calling to check if it's ready",
    items: [
      {
        quote:
          "Cracked my screen the morning of a flight. The AI receptionist quoted the repair and had my phone ready in two hours — no calling to check every twenty minutes.",
        name: "Farida T.",
        role: "Same-day repair customer",
      },
      {
        quote:
          "Mailed in a water-damaged laptop from three states away and got a text at every step. Felt way less like a black box than I expected.",
        name: "Owen K.",
        role: "Mail-in repair customer",
      },
      {
        quote:
          "My drone crashed mid-shoot and they had it flying again by the next afternoon with a clear explanation of what broke.",
        name: "Priyanka D.",
        role: "Drone repair customer",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before dropping off a device",
    items: [
      {
        q: "How accurate is the quote I get over the phone?",
        a: "The phone quote is a ballpark based on the symptoms you describe. We confirm the exact price after a full diagnostic, before any repair work starts.",
      },
      {
        q: "How long do repairs usually take?",
        a: "Most phone and console repairs finish same-day. Laptop repairs and parts-dependent jobs typically take 1–3 business days, and we'll tell you upfront if yours will take longer.",
      },
      {
        q: "Can I mail in my device instead of visiting?",
        a: "Yes — mail-in intake works the same as a walk-in, with a prepaid shipping label and the same status-text updates.",
      },
      {
        q: "What if my device can't be repaired?",
        a: "If we can't fix it, you only pay the diagnostic fee, not the full repair quote. We'll also tell you honestly if replacing is a better option.",
      },
      {
        q: "Is my data safe during repair?",
        a: "Yes — we don't access personal data during hardware repairs unless you request data recovery or transfer, and all technicians follow a strict privacy policy.",
      },
    ],
  },
  booking: {
    kicker: "Get a quote",
    headline: "Get your repair quote — book a real drop-off slot",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with drop-off details. Prefer to talk now? Use the voice assistant.",
    // Reuses the SAME shared demo GHL calendar as skydiving/flight-schools
    // (SS2V1nuWEIbOlNrzyxpt) — there is no dedicated Erken Device Repair
    // calendar yet. Fine for a pilot click-through, flagged for Shamil to
    // swap in a real/distinct calendar before this pattern replicates
    // further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
  },
  cta: {
    headline: "The bench has an opening today.",
    sub: "One quote tells you more than a week of wondering what's wrong.",
    buttonLabel: "Get your repair quote",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "electronics and device repair shop",
      demo_business: "Erken Device Repair",
      demo_context:
        "Caller is on the Erken Device Repair demo site (a fictional electronics repair shop demo by Erken Systems, positioned in Tempe, AZ). Play the shop's AI front desk: answer questions about phone, laptop, console, drone, and appliance repair, give a ballpark quote, and offer to book a drop-off slot or mail-in intake.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Walk-in and mail-in repair for phones, laptops, consoles, drones, and appliances out of Tempe, AZ since 2015.",
  },
};

export default electronics;
