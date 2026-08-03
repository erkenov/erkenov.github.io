/**
 * Climbing gyms & guides — Erken Climbing Co. (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-climbing-photo.jpg";

const climbing: DemoConfig = {
  slug: "climbing",
  industryLabel: "climbing gym and guide service",
  business: {
    name: "Erken Climbing Co.",
    short: "Erken Climbing",
    tagline: "Climb indoors, guide outdoors",
    location: "4455 E Thomas Rd · Phoenix, AZ",
    phoneDisplay: "(325) 241-4420",
    hours: "Mon–Fri 6am–11pm · Sat–Sun 8am–9pm",
    icon: "mountain",
  },
  meta: {
    title: "Erken Climbing Co. — Gym Memberships & Guided Trips in Phoenix | Demo by Erken Systems",
    description:
      "Bouldering and top-rope climbing, intro classes, and guided outdoor trips out of Phoenix, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0D1013",
    surface: "#161B1F",
    surface2: "#111519",
    border: "#252C32",
    borderStrong: "#38434B",
    text: "#F0F3F5",
    textMuted: "#A5AFB7",
    textDim: "#6B767E",
    accent: "#4E8CB8",
    accentHover: "#619FCB",
    accentSoft: "rgba(78, 140, 184, 0.14)",
    accentText: "#0B0F15",
    dark: "#090C0E",
    darkText: "#F0F3F5",
    darkMuted: "#96A2AA",
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
    kicker: "Thomas Road · Phoenix, AZ",
    headline: "Climb your first wall today, no experience needed.",
    headlineAccent: "no experience needed",
    sub: "Bouldering and top-rope walls, intro classes, and guided outdoor trips into the Superstitions — from your first foothold to your first real crag.",
    image: IMG,
    imageAlt: "Climber working a bouldering problem at Erken Climbing Co.",
    primaryCta: "Book an intro class",
    secondaryCta: "Ask our AI front desk",
    badge: "AMGA Guides on Staff · Est. 2016",
  },
  mission: {
    kicker: "Why we climb",
    statement:
      "Turn a first-time visitor into a member before the chalk on their hands is even dry.",
    statementAccent: "before the chalk on their hands is even dry",
    sub: "A real intro program, real belay certification, and guides who take members outdoors, not just up a plastic wall.",
    values: ["Safety certified", "All levels welcome", "Indoor to outdoor", "No intimidation"],
  },
  stats: [
    { value: "2,900+", label: "Active members" },
    { value: "18,000 sq ft", label: "Of climbing surface" },
    { value: "6", label: "AMGA-certified guides on staff" },
    { value: "140+", label: "Guided outdoor trips a year" },
  ],
  services: {
    kicker: "Programs",
    headline: "From your first hold to your first real crag",
    sub: "Every program runs on a real skill progression, from intro class to belay certification to guided outdoor trips.",
    moreLabel: "Also at the gym",
    items: [
      {
        icon: "mountain",
        title: "Intro to Climbing Class",
        body: "A 90-minute class covering basic movement, gym etiquette, and safety, with gear included. No experience or partner required.",
        price: "$35",
        image: IMG,
        imageAlt: "Intro to climbing class at Erken Climbing Co.",
      },
      {
        icon: "shield",
        title: "Belay Certification",
        body: "A required course for members who want to top-rope climb with a partner. Pass the belay test and you're certified for life at our gym.",
        price: "$25",
      },
      {
        icon: "graduation",
        title: "Guided Outdoor Trips",
        body: "Half-day and full-day guided climbs in the Superstition Mountains for members ready to move outdoors, led by AMGA-certified guides.",
        price: "from $175",
      },
      {
        icon: "users",
        title: "Youth Climbing Team",
        body: "A competitive team program for climbers ages 8–18, training three days a week toward regional competitions.",
        price: "$189/mo",
      },
      {
        icon: "calendar",
        title: "Birthday Parties & Groups",
        body: "Two-hour private party packages with a dedicated staff belayer and party room, for groups of up to 15.",
        price: "from $299",
      },
      {
        icon: "key",
        title: "Gear Rental",
        body: "Shoes, harnesses, and chalk bags available for day passes and first-timers, sanitized between every use.",
        price: "$8/session",
      },
    ],
  },
  about: {
    kicker: "The gym",
    headline: "A gym built by guides, not a franchise wall",
    paragraphs: [
      "Erken Climbing opened in 2016 with a single bouldering room and a promise: every new climber gets real instruction, not just a wall and a chalk bucket. Today we run 18,000 square feet of climbing and a guide service into the Superstitions — and the promise still holds.",
      "Your first visit includes a real intro class, not just a waiver to sign, our booking calendar shows real class and trip availability, and our front desk answers every call — even the first-timer asking if they're strong enough to try.",
    ],
    bullets: [
      "AMGA-certified guides lead every outdoor trip",
      "Belay certification required and taught in-house",
      "Youth team program with regional competition results",
      "Intro class included with every new membership",
    ],
    image: IMG,
    imageAlt: "Instructor guiding a new climber up the wall at Erken Climbing Co.",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first climb",
    sub: "No harness confusion, no standing around unsure what to do.",
    items: [
      {
        title: "Book an intro class",
        body: "Pick a slot online or call — our AI front desk answers 24/7 and books you into the next available class.",
      },
      {
        title: "Learn the basics",
        body: "A 90-minute class on movement, safety, and etiquette, with a staff member on hand the entire time.",
      },
      {
        title: "Start climbing on your own",
        body: "Get your day pass or membership card and start climbing solo on the bouldering walls right after class.",
      },
    ],
  },
  testimonials: {
    kicker: "Members",
    headline: "People who walked in nervous and left addicted",
    items: [
      {
        quote:
          "I called the day before terrified I'd look ridiculous. The AI receptionist booked my intro class for the next morning and told me exactly what to wear.",
        name: "Naomi K.",
        role: "Member since 2024",
      },
      {
        quote:
          "Took my belay cert on a Tuesday and was top-roping with a friend by the weekend. No gatekeeping, just clear instruction.",
        name: "Ravi S.",
        role: "Member",
      },
      {
        quote:
          "My first outdoor trip with their guides was the first time climbing outside didn't feel terrifying. They actually teach you how to read the rock.",
        name: "Colette M.",
        role: "Guided trip client",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first visit",
    items: [
      {
        q: "Do I need to bring my own gear?",
        a: "No — shoes, harnesses, and chalk are all available to rent, and everything is included in your intro class.",
      },
      {
        q: "Can I just boulder without a partner?",
        a: "Yes. Bouldering doesn't require a partner or belay certification — you can start solo the same day as your intro class.",
      },
      {
        q: "How do I get certified to top-rope climb?",
        a: "Take our belay certification course, a one-time class that tests you on tying in, belaying, and communication commands. It's good for life at our gym.",
      },
      {
        q: "Do the outdoor trips require gym experience first?",
        a: "Most trips are graded by difficulty, and our guides recommend a few months of gym climbing and belay certification before your first outdoor trip.",
      },
      {
        q: "Is there a youth program?",
        a: "Yes — a competitive youth team for ages 8 to 18, plus regular kids' camps during school breaks.",
      },
    ],
  },
  booking: {
    kicker: "Book a class",
    headline: "Book your intro class — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with what to bring. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The wall is warmed up and waiting.",
    sub: "One intro class tells you more than a year of watching climbing videos.",
    buttonLabel: "Book your intro class",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "climbing gym and guide service",
      demo_business: "Erken Climbing Co.",
      demo_context:
        "Caller is on the Erken Climbing Co. demo site (a fictional climbing gym demo by Erken Systems, positioned in Phoenix, AZ). Play the gym's AI front desk: answer questions about intro classes, belay certification, guided outdoor trips, and memberships, and offer to book an intro class.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Bouldering and top-rope climbing, intro classes, and guided outdoor trips out of Phoenix, AZ since 2016.",
  },
};

export default climbing;
