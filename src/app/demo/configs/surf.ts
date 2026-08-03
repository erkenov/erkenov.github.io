/**
 * Surf schools & camps — Erken Surf Camp (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-surfing-photo.jpg";

const surf: DemoConfig = {
  slug: "surf",
  industryLabel: "surf school and camp",
  business: {
    name: "Erken Surf Camp",
    short: "Erken Surf",
    tagline: "Learn to surf in Tamarindo",
    location: "Playa Tamarindo · Guanacaste, Costa Rica",
    phoneDisplay: "+506 4001 2286",
    hours: "Daily 6am–6pm, tide dependent",
    icon: "waves",
  },
  meta: {
    title: "Erken Surf Camp — Surf Lessons & Week-Long Packages in Tamarindo | Demo by Erken Systems",
    description:
      "Beginner surf lessons, week-long surf-and-stay packages, and board rentals on Playa Tamarindo, Costa Rica. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0A1418",
    surface: "#102026",
    surface2: "#0C191E",
    border: "#1D343C",
    borderStrong: "#2C4E59",
    text: "#EEF7F8",
    textMuted: "#9DBAC1",
    textDim: "#647F86",
    accent: "#2FB6A3",
    accentHover: "#42C7B4",
    accentSoft: "rgba(47, 182, 163, 0.14)",
    accentText: "#0B0F15",
    dark: "#071013",
    darkText: "#EEF7F8",
    darkMuted: "#8DA8AF",
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
    kicker: "Playa Tamarindo · Guanacaste, Costa Rica",
    headline: "Stand up on your first wave, this week.",
    headlineAccent: "this week",
    sub: "Beginner lessons, week-long surf-and-stay packages, and board rentals on a beach break built for learning. English, Spanish, and French spoken.",
    image: IMG,
    imageAlt: "Surf instructor helping a beginner student catch a wave in Tamarindo",
    primaryCta: "Book a lesson",
    secondaryCta: "Ask our AI front desk",
    badge: "ISA Certified Instructors · Est. 2012",
  },
  mission: {
    kicker: "Why we surf",
    statement:
      "Answer a guest messaging from a different time zone at 3am, and have them standing on a board within 48 hours of landing.",
    statementAccent: "standing on a board within 48 hours",
    sub: "300+ surfable days a year on a beach break that's forgiving for beginners.",
    values: ["Safety first", "Small groups", "Multilingual", "Real progress tracking"],
  },
  stats: [
    { value: "9,400+", label: "Students taught since 2012" },
    { value: "8", label: "ISA-certified instructors" },
    { value: "1:4", label: "Instructor-to-student ratio" },
    { value: "300+", label: "Surfable days a year in Tamarindo" },
  ],
  services: {
    kicker: "Programs",
    headline: "From your first wave to a week-long stay",
    sub: "Every package runs on a real tide schedule, small groups, and instructors who track your progress day to day.",
    moreLabel: "Also at the camp",
    items: [
      {
        icon: "waves",
        title: "Beginner Group Lesson",
        body: "A 2-hour lesson covering pop-up technique, wave selection, and safety, in groups of 4 or fewer on the gentlest part of the break.",
        price: "$65",
        image: IMG,
        imageAlt: "Beginner group surf lesson on Playa Tamarindo",
      },
      {
        icon: "graduation",
        title: "7-Day Surf & Stay Package",
        body: "Daily lessons, board rental, and shared accommodation steps from the beach — the full progression from pop-up to riding unassisted.",
        price: "from $890",
      },
      {
        icon: "key",
        title: "Board & Wetsuit Rental",
        body: "Soft-tops for beginners, performance shortboards for progressing surfers, by the hour, day, or week.",
        price: "from $20/day",
      },
      {
        icon: "phone",
        title: "Private Coaching",
        body: "One-on-one sessions with a certified coach for surfers working on a specific skill, filmed and reviewed after the session.",
        price: "$95/session",
      },
      {
        icon: "users",
        title: "Group & Retreat Bookings",
        body: "Custom week-long retreats for groups of 6+, with yoga, accommodation, and meal packages arranged alongside the surfing.",
        price: "custom quote",
      },
      {
        icon: "shield",
        title: "Kids Surf Camp",
        body: "Half-day supervised sessions for ages 8–14 during school-holiday weeks, with certified junior coaches.",
        price: "$45/half-day",
      },
    ],
  },
  about: {
    kicker: "The camp",
    headline: "A surf camp run by instructors, not a tour desk",
    paragraphs: [
      "Erken Surf opened in 2012 with two boards and a promise: every student gets real instruction, not just a push into a wave. Today we run a full camp on Playa Tamarindo with instructors from three countries — and the promise still holds.",
      "Your instructor tracks your progress day to day so week two builds on week one, our booking calendar covers every time zone, and our front desk answers every message — even the ones that come in at 3am from a guest halfway around the world.",
    ],
    bullets: [
      "ISA-certified instructors fluent in English, Spanish, and French",
      "Small groups — 4 students per instructor, max",
      "Beach break rated one of the best in Central America for beginners",
      "Daily progress notes so you can see exactly what improved",
    ],
    image: IMG,
    imageAlt: "Instructor and students carrying surfboards to the beach at Erken Surf Camp",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first wave",
    sub: "No paperwork, no pressure to book the full week upfront.",
    items: [
      {
        title: "Book your lesson or package",
        body: "Message us from anywhere — our AI assistant answers WhatsApp and web chat around the clock and books your slot on the spot.",
      },
      {
        title: "Learn on the sand first",
        body: "A land briefing on pop-up technique and ocean safety before you ever paddle out, so the water time counts.",
      },
      {
        title: "Catch your first wave",
        body: "Your instructor pushes you into the right wave at the right moment — most first-timers stand up within the first hour.",
      },
    ],
  },
  testimonials: {
    kicker: "Students",
    headline: "People who booked from the other side of the world",
    items: [
      {
        quote:
          "I messaged at 3am my time asking about a week-long package. The AI assistant answered in my language, confirmed dates, and had a deposit link waiting when I woke up.",
        name: "Freya L.",
        role: "7-day package, Sweden",
      },
      {
        quote:
          "Stood up on my very first wave. My instructor filmed every session so I could actually see what I was doing wrong between days.",
        name: "Marcus B.",
        role: "5-day lesson package",
      },
      {
        quote:
          "Booked a group retreat for six friends and the whole thing — surfing, yoga, meals — was handled in one conversation.",
        name: "Yuki T.",
        role: "Group retreat organizer",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first lesson",
    items: [
      {
        q: "Do I need to know how to swim?",
        a: "Yes, basic swimming ability is required. Our instructors handle everything else, including how to fall safely and read the waves.",
      },
      {
        q: "What's the best time of year to visit?",
        a: "Tamarindo is surfable year-round. December through April has smaller, more consistent waves that are ideal for beginners; May through November brings bigger swells for progressing surfers.",
      },
      {
        q: "Is equipment included in the lesson price?",
        a: "Yes — board and rash guard are included in every lesson and package. Wetsuits aren't needed in Tamarindo's warm water.",
      },
      {
        q: "Can complete beginners really do the 7-day package?",
        a: "Yes — it's designed for zero-experience starters. Most students go from land briefing to riding unassisted white water by day 3 or 4.",
      },
      {
        q: "Do you offer airport transfers?",
        a: "Yes, we can arrange transfers from Liberia International Airport (LIR) as part of any multi-day package — just ask when you book.",
      },
    ],
  },
  booking: {
    kicker: "Book a lesson",
    headline: "Book your surf lesson or package — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer to message first? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a WhatsApp message and email with meeting point and gear details. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The waves are breaking right now.",
    sub: "One lesson tells you more than a year of watching surf videos.",
    buttonLabel: "Book your surf lesson",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "surf school and camp",
      demo_business: "Erken Surf Camp",
      demo_context:
        "Caller is on the Erken Surf Camp demo site (a fictional surf school demo by Erken Systems, positioned in Tamarindo, Costa Rica). Play the camp's AI front desk: answer questions about beginner lessons, the 7-day surf-and-stay package, board rentals, and group retreats, and offer to book a lesson.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Beginner surf lessons, week-long surf-and-stay packages, and board rentals on Playa Tamarindo, Costa Rica since 2012.",
  },
};

export default surf;
