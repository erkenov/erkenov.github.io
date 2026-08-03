/**
 * Tennis clubs & academies — Erken Tennis Academy (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-tennis-photo.jpg";

const tennis: DemoConfig = {
  slug: "tennis",
  industryLabel: "tennis club and academy",
  business: {
    name: "Erken Tennis Academy",
    short: "Erken Tennis",
    tagline: "Junior and adult programs",
    location: "7700 E Gainey Ranch Rd · Scottsdale, AZ",
    phoneDisplay: "(325) 241-9034",
    hours: "Mon–Fri 6am–8pm · Sat–Sun 7am–5pm",
    icon: "gauge",
  },
  meta: {
    title: "Erken Tennis Academy — Junior & Adult Programs in Scottsdale | Demo by Erken Systems",
    description:
      "Junior development, adult clinics, and private lessons on 12 courts in Scottsdale, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0B120C",
    surface: "#131F15",
    surface2: "#0E1811",
    border: "#213024",
    borderStrong: "#34493A",
    text: "#EFF5F0",
    textMuted: "#A2B8A9",
    textDim: "#697C6E",
    accent: "#4C9E4A",
    accentHover: "#5FAF5C",
    accentSoft: "rgba(76, 158, 74, 0.14)",
    accentText: "#0B0F15",
    dark: "#080C09",
    darkText: "#EFF5F0",
    darkMuted: "#93A899",
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
    kicker: "Gainey Ranch · Scottsdale, AZ",
    headline: "A junior program parents actually trust.",
    headlineAccent: "parents actually trust",
    sub: "Junior development, adult clinics, and private lessons across 12 courts, with a written curriculum and pros who stay with your child from their first trial to tournament play.",
    image: IMG,
    imageAlt: "Junior tennis player practicing a forehand on a court at Erken Tennis Academy",
    primaryCta: "Book a trial lesson",
    secondaryCta: "Ask our AI front desk",
    badge: "USTA Affiliated · Est. 2010",
  },
  mission: {
    kicker: "Why we coach",
    statement:
      "Answer the parent calling mid-lesson about the junior program — and get their kid on court within a week, not a month.",
    statementAccent: "on court within a week",
    sub: "12 courts, a written development curriculum, and pros who know every junior by name.",
    values: ["Structured levels", "Real progress tracking", "Court time that doesn't sit empty", "Straight answers"],
  },
  stats: [
    { value: "340+", label: "Junior players enrolled" },
    { value: "12", label: "Courts on site" },
    { value: "9", label: "USPTA-certified pros" },
    { value: "14yr", label: "Teaching Scottsdale since 2010" },
  ],
  services: {
    kicker: "Programs",
    headline: "From a first trial lesson to tournament play",
    sub: "Every program runs on a written development level, a real court schedule, and pros who track progress season to season.",
    moreLabel: "Also at the academy",
    items: [
      {
        icon: "graduation",
        title: "Junior Development Program",
        body: "Age- and level-based groups from ages 5 to 18, following a written USTA-aligned curriculum with quarterly level assessments.",
        price: "from $220/mo",
        image: IMG,
        imageAlt: "Junior development group lesson at Erken Tennis Academy",
      },
      {
        icon: "users",
        title: "Adult Clinics",
        body: "Beginner through advanced group clinics that run year-round, matched by skill level so you're never the weakest or strongest player on court.",
        price: "from $28/session",
      },
      {
        icon: "gauge",
        title: "Private Lessons",
        body: "One-on-one coaching with a USPTA pro, video-reviewed for players working on a specific technical fix.",
        price: "$85/hour",
      },
      {
        icon: "calendar",
        title: "Court Rental",
        body: "Members and non-members book any of our 12 courts online, day or night under the lights.",
        price: "from $25/hour",
      },
      {
        icon: "shield",
        title: "Tournament Team",
        body: "Invite-only competitive team for junior players preparing for USTA sanctioned tournaments, with match strategy sessions.",
        price: "included",
      },
      {
        icon: "clock",
        title: "Summer Camps",
        body: "Full-day and half-day camps during school breaks combining tennis, fitness, and match play.",
        price: "from $65/day",
      },
    ],
  },
  about: {
    kicker: "The academy",
    headline: "An academy built on a curriculum, not a court-rental sign-up",
    paragraphs: [
      "Erken Tennis opened in 2010 with four courts and a promise: every junior follows a written development plan, not a rotating lesson with whoever's free. Today we run 12 courts and a full coaching staff in Scottsdale — and the promise still holds.",
      "Your child's pro tracks their level quarter over quarter, our court schedule shows real availability online, and our front desk answers every call — even the parent calling mid-lesson to ask if their kid is ready to move up a level.",
    ],
    bullets: [
      "USPTA-certified pros on every court, every session",
      "Written, level-based curriculum with quarterly assessments",
      "12 lit courts — evening and weekend availability year-round",
      "Fixed clinic pricing — no surprise per-session upcharges",
    ],
    image: IMG,
    imageAlt: "Coach working with a student on technique at Erken Tennis Academy",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first lesson",
    sub: "No long-term contract to see if it's the right fit.",
    items: [
      {
        title: "Book a trial lesson",
        body: "Pick a slot online or call — our AI front desk answers 24/7 and gets your child's age and level to match the right group.",
      },
      {
        title: "Get a level assessment",
        body: "A pro evaluates your child's level in the trial lesson and places them in the right development group, not just the next available slot.",
      },
      {
        title: "Start the program",
        body: "A written development plan for the season, real court time every week, and quarterly check-ins on progress.",
      },
    ],
  },
  testimonials: {
    kicker: "Parents & players",
    headline: "People who stopped shopping around for a coach",
    items: [
      {
        quote:
          "I called mid-lesson drop-off frantic about switching my daughter's group. The AI receptionist got her level and rescheduled her into the right group before I even got home.",
        name: "Karen L.",
        role: "Parent, junior program",
      },
      {
        quote:
          "First academy that gave me an actual written plan instead of just booking me into whatever clinic had space.",
        name: "Andre F.",
        role: "Adult clinic member",
      },
      {
        quote:
          "My son moved from beginner to the tournament team in 18 months, and I could see exactly why every step of the way.",
        name: "Michelle R.",
        role: "Parent, tournament team",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What every parent asks before enrolling",
    items: [
      {
        q: "What age can my child start?",
        a: "Our youngest development group starts at age 5, with a QuickStart curriculum using smaller courts and lower-compression balls built for beginners.",
      },
      {
        q: "How do you decide which group my child is in?",
        a: "A trial lesson with one of our pros determines their starting level. We reassess quarterly and move players up as they're ready, not on a fixed schedule.",
      },
      {
        q: "Do you offer adult beginner programs?",
        a: "Yes — our adult clinics run beginner through advanced, and most new adult players start in our 6-week beginner series before joining an ongoing clinic.",
      },
      {
        q: "Can I rent a court without joining a program?",
        a: "Yes, court rental is open to the public online, day or night. Members get priority booking windows and discounted rates.",
      },
      {
        q: "What happens if we miss a lesson?",
        a: "Missed group lessons can be made up in another same-level session that week, subject to space. Private lessons follow a 24-hour cancellation policy.",
      },
    ],
  },
  booking: {
    kicker: "Book a lesson",
    headline: "Book your trial lesson — pick a real time",
    sub: "Grab an open slot below and you're on the schedule instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with which court to head to. Prefer to talk now? Use the voice assistant.",
    // Reuses the SAME shared demo GHL calendar as skydiving/flight-schools
    // (no dedicated Erken Tennis Academy calendar exists yet) — good enough
    // for a click-through replication, flagged for Shamil to swap for a
    // real/distinct calendar later.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
  },
  cta: {
    headline: "Court time is open this week.",
    sub: "One trial lesson tells you more than a season of wondering if it's the right fit.",
    buttonLabel: "Book your trial lesson",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "tennis club and academy",
      demo_business: "Erken Tennis Academy",
      demo_context:
        "Caller is on the Erken Tennis Academy demo site (a fictional tennis academy demo by Erken Systems, positioned in Scottsdale, AZ). Play the academy's AI front desk: answer questions about the junior development program, adult clinics, private lessons, and court rental, and offer to book a trial lesson.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Junior development, adult clinics, and private lessons across 12 courts in Scottsdale, AZ since 2010.",
  },
};

export default tennis;
