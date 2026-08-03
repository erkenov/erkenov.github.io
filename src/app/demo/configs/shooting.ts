/**
 * Shooting ranges — Erken Shooting Range (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from. Copy stays on training,
 * membership, and corporate events per Shamil's explicit call — never
 * on selling firearms.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-shooting-photo.jpg";

const shooting: DemoConfig = {
  slug: "shooting",
  industryLabel: "shooting range and training center",
  business: {
    name: "Erken Shooting Range",
    short: "Erken Range",
    tagline: "Training courses & lane memberships",
    location: "6600 W Buckeye Rd · Phoenix, AZ",
    phoneDisplay: "(325) 241-2298",
    hours: "Mon–Sat 9am–8pm · Sun 10am–5pm",
    icon: "target",
  },
  meta: {
    title: "Erken Shooting Range — Training Courses & Memberships in Phoenix | Demo by Erken Systems",
    description:
      "Certified firearms safety courses, lane memberships, and corporate range events in Phoenix, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0E0E0D",
    surface: "#181815",
    surface2: "#121210",
    border: "#2A2924",
    borderStrong: "#413F36",
    text: "#F3F2ED",
    textMuted: "#AEAA9D",
    textDim: "#757164",
    accent: "#8A8A4E",
    accentHover: "#9C9C5F",
    accentSoft: "rgba(138, 138, 78, 0.14)",
    accentText: "#0B0F15",
    dark: "#0A0A08",
    darkText: "#F3F2ED",
    darkMuted: "#9E9A8C",
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
    kicker: "Buckeye Rd · Phoenix, AZ",
    headline: "Certified training, booked in the time it takes to call.",
    headlineAccent: "booked in the time it takes to call",
    sub: "Certified safety courses, concealed-carry certification, and lane memberships, taught by instructors with law enforcement and military training backgrounds. Corporate events welcome.",
    image: IMG,
    imageAlt: "Instructor guiding a student on the firing line at Erken Shooting Range",
    primaryCta: "Book a course",
    secondaryCta: "Ask our AI front desk",
    badge: "NRA Certified Instructors · Est. 2008",
  },
  mission: {
    kicker: "Why we train",
    statement:
      "Answer the course inquiry while instructors are running a class on the line — and book the seat right there.",
    statementAccent: "book the seat right there",
    sub: "Certified instruction, a real course calendar, and a range that treats safety as the whole point.",
    values: ["Safety first", "Certified instructors", "Real availability", "All experience levels"],
  },
  stats: [
    { value: "22,000+", label: "Students trained since 2008" },
    { value: "12", label: "NRA-certified instructors" },
    { value: "18", label: "Firing lanes on site" },
    { value: "180+", label: "Corporate events hosted" },
  ],
  services: {
    kicker: "Courses & Membership",
    headline: "From your first safety course to a standing membership",
    sub: "Every course runs on a real curriculum and a real roster — your instructor knows who's in the room before class starts.",
    moreLabel: "Also at the range",
    items: [
      {
        icon: "target",
        title: "Firearms Safety Fundamentals",
        body: "A certified introductory course covering handling, storage, and range etiquette. Required before first-time renters can use the range.",
        price: "$95",
        image: IMG,
        imageAlt: "Firearms safety fundamentals course at Erken Shooting Range",
      },
      {
        icon: "shield",
        title: "Concealed Carry Certification",
        body: "State-recognized certification course covering law, safe carry practices, and live-fire qualification.",
        price: "$149",
      },
      {
        icon: "calendar",
        title: "Lane Membership",
        body: "Unlimited range time across 18 lanes, with member-only hours and discounted course pricing.",
        price: "from $79/mo",
      },
      {
        icon: "users",
        title: "Corporate Events",
        body: "Team-building range days with a dedicated instructor, gear, and lane block for groups of 10 or more.",
        price: "custom quote",
      },
      {
        icon: "graduation",
        title: "Advanced Tactical Courses",
        body: "Skill-building courses for experienced shooters covering defensive shooting fundamentals and low-light scenarios.",
        price: "from $225",
      },
      {
        icon: "key",
        title: "Gear & Lane Rental",
        body: "Eye and ear protection, target setups, and lane rental for members and first-time visitors.",
        price: "from $25/hour",
      },
    ],
  },
  about: {
    kicker: "The range",
    headline: "A range built on instruction, not just lanes",
    paragraphs: [
      "Erken Range opened in 2008 with six lanes and a promise: every new shooter starts with certified instruction, not a rental counter handshake. Today we run 18 lanes and a full instructor team on Buckeye Road — and the promise still holds.",
      "Your instructor knows your course roster before class starts, our booking calendar shows real course and corporate-event availability, and our front desk answers every call — even the one asking what a fundamentals class actually covers.",
    ],
    bullets: [
      "NRA-certified instructors with law enforcement and military backgrounds",
      "18 climate-controlled lanes with modern ventilation",
      "Corporate and group events booked through a real pipeline",
      "Membership renewal reminders before a lane pass quietly lapses",
    ],
    image: IMG,
    imageAlt: "Instructor and student reviewing technique at Erken Shooting Range",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first certified course",
    sub: "No walk-up confusion, no guessing which course fits your goal.",
    items: [
      {
        title: "Book your course or event",
        body: "Pick a course date online or call — our AI front desk answers 24/7 and qualifies your certification goal.",
      },
      {
        title: "Complete certified instruction",
        body: "Classroom fundamentals followed by supervised live-fire practice with a certified instructor on the line.",
      },
      {
        title: "Get certified and keep training",
        body: "Walk out with your certification and a membership option for ongoing range access at member rates.",
      },
    ],
  },
  testimonials: {
    kicker: "Students & members",
    headline: "People who wanted real instruction, not just a rental",
    items: [
      {
        quote:
          "I called nervous with zero experience. The AI receptionist got my goals and booked me straight into the fundamentals course instead of just renting me a lane.",
        name: "Ben H.",
        role: "Fundamentals course graduate",
      },
      {
        quote:
          "Booked a corporate event for 15 people and the whole thing — lanes, gear, instructor — was handled in one conversation.",
        name: "Priya M.",
        role: "Corporate event organizer",
      },
      {
        quote:
          "Got a renewal reminder before my membership lapsed instead of finding out at the front desk. Small thing that actually matters.",
        name: "Carl D.",
        role: "Lane member, 5 years",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first visit",
    items: [
      {
        q: "Do I need to own a firearm to take a course?",
        a: "No — rental firearms are available for all courses and range sessions. Bring your own if you have one, or use ours at no extra charge during class.",
      },
      {
        q: "Is the fundamentals course required before I can rent a lane?",
        a: "Yes, first-time visitors complete our fundamentals course before renting a lane independently. It's a one-time requirement, roughly 90 minutes.",
      },
      {
        q: "What is your concealed carry course based on?",
        a: "Our concealed carry course meets state certification requirements, covering relevant law, safe carry practices, and a live-fire qualification component.",
      },
      {
        q: "Can I book a private lesson instead of a group course?",
        a: "Yes — one-on-one instruction is available for any course level, useful for shooters who want a more personalized pace.",
      },
      {
        q: "What's included in a corporate event?",
        a: "A dedicated instructor, reserved lane block, all safety gear, and a structured intro session, scaled to your group size and experience mix.",
      },
    ],
  },
  booking: {
    kicker: "Book a course",
    headline: "Book your course — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    // Reuses the SAME shared demo GHL calendar as flight-schools/skydiving
    // (no dedicated Erken Shooting Range calendar exists yet) — fine for a
    // click-through demo, flagged for a real/distinct calendar later.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    note: "Confirmed instantly — you'll get a text and email with what to bring. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The line is open and staffed.",
    sub: "One certified course tells you more than a year of putting off proper training.",
    buttonLabel: "Book your course",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "shooting range and training center",
      demo_business: "Erken Shooting Range",
      demo_context:
        "Caller is on the Erken Shooting Range demo site (a fictional shooting range and training center demo by Erken Systems, positioned in Phoenix, AZ). Play the range's AI front desk: answer questions about certified safety courses, concealed carry certification, lane memberships, and corporate events, and offer to book a course. Never discuss selling firearms.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Certified firearms safety courses, lane memberships, and corporate range events in Phoenix, AZ since 2008.",
  },
};

export default shooting;
