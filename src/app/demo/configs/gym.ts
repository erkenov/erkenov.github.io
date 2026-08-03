/**
 * Gyms & boxes — Erken Fitness Box (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-gym-photo.jpg";

const gym: DemoConfig = {
  slug: "gym",
  industryLabel: "boutique gym and fitness box",
  business: {
    name: "Erken Fitness Box",
    short: "Erken Fitness",
    tagline: "Train together, get stronger",
    location: "918 E Indian School Rd · Phoenix, AZ",
    phoneDisplay: "(325) 241-7743",
    hours: "Mon–Fri 5am–8pm · Sat–Sun 8am–12pm",
    icon: "dumbbell",
  },
  meta: {
    title: "Erken Fitness Box — Group Training & Free Trial in Phoenix | Demo by Erken Systems",
    description:
      "Coached group classes, free trial sessions, and a real coaching team out of a boutique gym in Phoenix, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0D0F0C",
    surface: "#161915",
    surface2: "#101310",
    border: "#242B21",
    borderStrong: "#3A4534",
    text: "#F1F5EE",
    textMuted: "#AAB89F",
    textDim: "#6F7C65",
    accent: "#8FB03C",
    accentHover: "#A0C24C",
    accentSoft: "rgba(143, 176, 60, 0.14)",
    accentText: "#0B0F15",
    dark: "#090B08",
    darkText: "#F1F5EE",
    darkMuted: "#9AAA8E",
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
    kicker: "Indian School Rd · Phoenix, AZ",
    headline: "Your first class is free, and it's today.",
    headlineAccent: "free, and it's today",
    sub: "Coached group training, real programming, and a coaching staff that knows your name by your third visit. No experience needed, no judgment either.",
    image: IMG,
    imageAlt: "Group class training together at Erken Fitness Box",
    primaryCta: "Book a free trial",
    secondaryCta: "Ask our AI front desk",
    badge: "Certified Coaching Staff · Est. 2017",
  },
  mission: {
    kicker: "Why we train",
    statement:
      "Catch a member before they quietly stop showing up — not after the next billing cycle already failed.",
    statementAccent: "before they quietly stop showing up",
    sub: "Real class caps, real coach check-ins, and a schedule that fits before or after work.",
    values: ["Coached, not solo", "Every level welcome", "Real accountability", "No contracts to start"],
  },
  stats: [
    { value: "620+", label: "Active members" },
    { value: "42", label: "Coached classes a week" },
    { value: "11", label: "Certified coaches on staff" },
    { value: "89%", label: "Members still active after 6 months" },
  ],
  services: {
    kicker: "Programs",
    headline: "From your first trial to your own program",
    sub: "Every class runs on real coaching, capped headcounts, and a schedule built around real work hours.",
    moreLabel: "Also at the box",
    items: [
      {
        icon: "dumbbell",
        title: "Group Training Classes",
        body: "Capped-headcount coached classes covering strength, conditioning, and mobility. Every workout scaled to your level by the coach on the floor.",
        price: "free trial",
        image: IMG,
        imageAlt: "Coached group training class at Erken Fitness Box",
      },
      {
        icon: "graduation",
        title: "Foundations Program",
        body: "A 4-week onboarding track for new members covering form, movement basics, and how our class structure works.",
        price: "included",
      },
      {
        icon: "calendar",
        title: "Open Gym Access",
        body: "Self-directed training time outside class hours for members who want extra reps on their own program.",
        price: "included",
      },
      {
        icon: "users",
        title: "Personal Training",
        body: "One-on-one coaching for members working toward a specific goal — a competition, an injury comeback, or just faster progress.",
        price: "from $75/session",
      },
      {
        icon: "shield",
        title: "Nutrition Coaching",
        body: "Monthly check-ins with a coach on nutrition habits that actually stick, no crash diets or meal-plan spreadsheets.",
        price: "$99/mo",
      },
      {
        icon: "clock",
        title: "Corporate Wellness",
        body: "On-site or in-gym sessions for local companies looking to add a fitness perk for their team.",
        price: "custom quote",
      },
    ],
  },
  about: {
    kicker: "The box",
    headline: "A gym built by coaches, not a franchise checklist",
    paragraphs: [
      "Erken Fitness opened in 2017 with one small room and a promise: every class is coached, not just supervised. Today we run a full facility on Indian School Road — and the promise still holds.",
      "Your coach scales every workout to your level in real time, our class schedule shows real headcounts online, and our front desk answers every call — even the nervous first-timer asking if they're too out of shape to start.",
    ],
    bullets: [
      "Certified coaches lead every class — no unsupervised sessions",
      "Capped class sizes so every rep gets watched",
      "Foundations program for every new member's first month",
      "Free trial class — no contract required to try it",
    ],
    image: IMG,
    imageAlt: "Coach guiding a member through a lift at Erken Fitness Box",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first workout",
    sub: "No intimidation, no sales pitch. You train first, then decide.",
    items: [
      {
        title: "Book a free trial class",
        body: "Pick a slot online or call — our AI front desk answers 24/7 and confirms it with a reminder text.",
      },
      {
        title: "Show up and train",
        body: "A quick intro with the coach, a scaled version of that day's workout, and a group that'll actually cheer you on.",
      },
      {
        title: "Get your membership plan",
        body: "A short chat after class about your goals and the class schedule that fits your week, no pressure to decide on the spot.",
      },
    ],
  },
  testimonials: {
    kicker: "Members",
    headline: "People who thought gyms weren't for them",
    items: [
      {
        quote:
          "I texted at 6am nervous about my first class. The AI receptionist booked me for that evening and sent a reminder so I couldn't talk myself out of it.",
        name: "Talia R.",
        role: "Member since 2023",
      },
      {
        quote:
          "Missed two weeks after surgery and got a real check-in text from a coach, not just a billing reminder. Came back stronger because someone noticed.",
        name: "Dave O.",
        role: "Member, 3 years",
      },
      {
        quote:
          "First gym where the coach actually watches my form instead of just counting reps on a screen somewhere.",
        name: "Ines P.",
        role: "New member",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first class",
    items: [
      {
        q: "Do I need to be in shape to start?",
        a: "No. Every workout is scaled to your level by the coach on the floor — beginners and advanced members do the same class at different intensities.",
      },
      {
        q: "What should I bring to my first class?",
        a: "Athletic clothes, closed-toe shoes, and a water bottle. We have loaner equipment for anything else you'd need.",
      },
      {
        q: "Is there a contract?",
        a: "No contract required for your free trial or your first month. Month-to-month membership after that, cancel anytime with 30 days notice.",
      },
      {
        q: "How big are the classes?",
        a: "We cap classes at 16 members so every coach can actually watch your form and correct it in real time.",
      },
      {
        q: "Do you offer personal training too?",
        a: "Yes — one-on-one sessions with a certified coach for members working toward a specific goal, alongside or instead of group classes.",
      },
    ],
  },
  booking: {
    kicker: "Book a class",
    headline: "Book your free trial class — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    // NOTE (flag for Shamil's review, mirrors the sky-erken pilot comment):
    // reuses the SAME shared demo GHL calendar as flight-schools/sky-erken
    // (SS2V1nuWEIbOlNrzyxpt) — there is no dedicated Erken Fitness calendar
    // yet. Fine for a pilot click-through; a real per-industry calendar
    // should probably exist before this pattern goes further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    note: "Confirmed instantly — you'll get a text and email with what to bring. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The next class starts soon.",
    sub: "One free trial tells you more than a year of putting it off.",
    buttonLabel: "Book your free trial",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "boutique gym and fitness box",
      demo_business: "Erken Fitness Box",
      demo_context:
        "Caller is on the Erken Fitness Box demo site (a fictional boutique gym demo by Erken Systems, positioned in Phoenix, AZ). Play the gym's AI front desk: answer questions about group classes, personal training, membership pricing, and the free trial, and offer to book a trial class.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Coached group training and personal coaching out of a boutique gym in Phoenix, AZ since 2017.",
  },
};

export default gym;
