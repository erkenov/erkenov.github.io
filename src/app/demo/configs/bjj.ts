/**
 * Jiu Jitsu academies — Erken Jiu-Jitsu Academy (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-bjj-photo.jpg";

const bjj: DemoConfig = {
  slug: "bjj",
  industryLabel: "Brazilian Jiu-Jitsu academy",
  business: {
    name: "Erken Jiu-Jitsu Academy",
    short: "Erken BJJ",
    tagline: "Train hard, roll smart",
    location: "3300 E Camelback Rd · Phoenix, AZ",
    phoneDisplay: "(325) 241-5512",
    hours: "Mon–Fri 6am–9pm · Sat 9am–1pm",
    icon: "shield",
  },
  meta: {
    title: "Erken Jiu-Jitsu Academy — Adult & Kids BJJ in Phoenix | Demo by Erken Systems",
    description:
      "Adult and kids Brazilian Jiu-Jitsu classes, trial-class booking, and belt-progression tracking in Phoenix, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0C0F0D",
    surface: "#141917",
    surface2: "#0F1311",
    border: "#212B27",
    borderStrong: "#334339",
    text: "#F0F5F2",
    textMuted: "#A3B5AC",
    textDim: "#69796F",
    accent: "#C1272D",
    accentHover: "#D33E44",
    accentSoft: "rgba(193, 39, 45, 0.14)",
    accentText: "#F5F0EA",
    dark: "#080B09",
    darkText: "#F0F5F2",
    darkMuted: "#93A79B",
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
    kicker: "Camelback Corridor · Phoenix, AZ",
    headline: "Your first roll is one trial class away.",
    headlineAccent: "one trial class away",
    sub: "Adult and kids Brazilian Jiu-Jitsu, taught by black belts who still teach every fundamentals class themselves. No experience needed for your first trial.",
    image: IMG,
    imageAlt: "Two Jiu-Jitsu practitioners rolling on the mats at Erken Academy",
    primaryCta: "Book a trial class",
    secondaryCta: "Ask our AI front desk",
    badge: "IBJJF Affiliated · Est. 2014",
  },
  mission: {
    kicker: "Why we train",
    statement:
      "Get every trial student on the mat, remembered by name, and back for a second class — not a one-and-done.",
    statementAccent: "back for a second class",
    sub: "A real schedule, real belt tracking, and instructors who notice when you've been gone two weeks.",
    values: ["Fundamentals first", "No ego", "Real accountability", "Kids and adults"],
  },
  stats: [
    { value: "480+", label: "Active members" },
    { value: "6", label: "Black belt instructors" },
    { value: "31", label: "Classes on the weekly schedule" },
    { value: "12yr", label: "Teaching Phoenix since 2014" },
  ],
  services: {
    kicker: "Programs",
    headline: "From your first trial to competition team",
    sub: "Every program runs on a real curriculum, a real mat schedule, and instructors who track your belt progress by hand.",
    moreLabel: "Also at the academy",
    items: [
      {
        icon: "shield",
        title: "Adult Fundamentals",
        body: "The on-ramp for new members — positions, escapes, and live rolling introduced at a pace that doesn't overwhelm your first month.",
        price: "free trial",
        image: IMG,
        imageAlt: "Fundamentals class practicing a guard pass at Erken Academy",
      },
      {
        icon: "dumbbell",
        title: "Adult All-Levels & Advanced",
        body: "Open-mat rolling and advanced technique classes for members past fundamentals, six days a week.",
        price: "$179/mo",
      },
      {
        icon: "graduation",
        title: "Kids BJJ (Ages 5–12)",
        body: "Discipline, focus, and self-defense fundamentals in a structured kids curriculum with its own belt system.",
        price: "$149/mo",
      },
      {
        icon: "users",
        title: "Competition Team",
        body: "Invite-only team training for members preparing for local and regional IBJJF tournaments.",
        price: "included",
      },
      {
        icon: "calendar",
        title: "Private Lessons",
        body: "One-on-one instruction with a black belt for members working through a specific weakness or preparing for competition.",
        price: "$90/session",
      },
      {
        icon: "clock",
        title: "Open Mat",
        body: "Unstructured rolling time every Saturday for members who want extra reps outside the class schedule.",
        price: "included",
      },
    ],
  },
  about: {
    kicker: "The academy",
    headline: "A school built by black belts, not a franchise sign",
    paragraphs: [
      "Erken Jiu-Jitsu opened in 2014 with one small mat space and a promise: every fundamentals class is taught by a black belt, not a rotating assistant. Today we run a full academy on Camelback Road — and the promise still holds.",
      "Your belt progress is tracked on a real curriculum, our class schedule lives online with real headcounts, and our front desk answers every call — even the nervous first-timer asking if they'll get hurt.",
    ],
    bullets: [
      "Black belt instructors teach every fundamentals class",
      "Structured curriculum with tracked belt and stripe progress",
      "Separate kids and adults programs, same mat space",
      "Free trial class — no contract required to try it",
    ],
    image: IMG,
    imageAlt: "Instructor demonstrating a technique to students at Erken Jiu-Jitsu Academy",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first stripe",
    sub: "No contract pressure, no sales pitch. You roll first, then decide.",
    items: [
      {
        title: "Book a trial class",
        body: "Pick a fundamentals slot online or call — our AI front desk answers 24/7 and sends a reminder so you actually show up.",
      },
      {
        title: "Show up and roll",
        body: "A warm welcome, a beginner-paced fundamentals class, and your first live rolling with a partner matched to your experience.",
      },
      {
        title: "Get your training plan",
        body: "A quick chat after class about your goals and a recommended weekly schedule to start building toward your first belt promotion.",
      },
    ],
  },
  testimonials: {
    kicker: "Members",
    headline: "People who almost didn't walk through the door",
    items: [
      {
        quote:
          "I DM'd the academy at 10pm terrified to try my first class. The AI receptionist booked my trial and sent a reminder text the morning of, so I actually showed up instead of chickening out.",
        name: "Elena V.",
        role: "Member since 2024",
      },
      {
        quote:
          "Missed two weeks with a work trip and got a genuine check-in text instead of an auto-billing reminder. Came back the day I landed.",
        name: "Marcus D.",
        role: "Blue belt",
      },
      {
        quote:
          "My son's kids class tracks his stripes on a real chart he can see. He asks to go now instead of me dragging him.",
        name: "Priya S.",
        role: "Parent, kids program",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first class",
    items: [
      {
        q: "Do I need any experience to try a class?",
        a: "No. Your free trial is a fundamentals class built for first-timers — an instructor will pair you with a patient training partner and walk you through everything.",
      },
      {
        q: "What should I wear or bring?",
        a: "Athletic clothes for your first trial (a t-shirt and shorts or leggings work fine). We have loaner gis if you decide to join and need one.",
      },
      {
        q: "Is Jiu-Jitsu safe for beginners?",
        a: "Yes — fundamentals classes are taught at a controlled pace with an emphasis on tapping early and often. Injuries are rare when new students train with instructor oversight, which every class has.",
      },
      {
        q: "How long does it take to get a blue belt?",
        a: "Most consistent students (training 3+ times a week) promote to blue belt in 1–2 years. Progress is tracked on stripes so you always know where you stand.",
      },
      {
        q: "Is there a kids program?",
        a: "Yes — ages 5 to 12, with its own curriculum and belt system focused on discipline, focus, and age-appropriate self-defense.",
      },
    ],
  },
  booking: {
    kicker: "Book a trial",
    headline: "Book your free trial class — pick a real time",
    sub: "Grab an open slot below and you're on the mat schedule instantly. Prefer a call instead? Use the callback button up top.",
    // NOTE (flag for Shamil's review, mirrors the sky-erken pilot comment):
    // reuses the SAME shared demo GHL calendar as flight-schools/sky-erken
    // (SS2V1nuWEIbOlNrzyxpt) — there is no dedicated Erken BJJ calendar yet.
    // Fine for a pilot click-through; a real per-industry calendar should
    // probably exist before this pattern goes further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    note: "Confirmed instantly — you'll get a text and email with what to bring. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The mats are warmed up.",
    sub: "One trial class tells you more than a year of watching highlight reels.",
    buttonLabel: "Book your trial class",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "Brazilian Jiu-Jitsu academy",
      demo_business: "Erken Jiu-Jitsu Academy",
      demo_context:
        "Caller is on the Erken Jiu-Jitsu Academy demo site (a fictional BJJ academy demo by Erken Systems, positioned in Phoenix, AZ). Play the academy's AI front desk: answer questions about adult and kids classes, membership pricing, and the free trial class, and offer to book a trial.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Adult and kids Brazilian Jiu-Jitsu classes on Camelback Road in Phoenix, AZ since 2014.",
  },
};

export default bjj;
