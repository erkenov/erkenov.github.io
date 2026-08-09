/**
 * Makerspaces & workshops — Erken Makerspace (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-makerspace-photo.jpg";

const makerspace: DemoConfig = {
  slug: "makerspace",
  industryLabel: "makerspace and fabrication workshop",
  business: {
    name: "Erken Makerspace",
    short: "Erken Makerspace",
    tagline: "Build, learn, fabricate",
    location: "550 S Rockford Dr · Tempe, AZ",
    phoneDisplay: "(888) 799-6065",
    hours: "Mon–Fri 9am–9pm · Sat 10am–6pm",
    icon: "hammer",
  },
  meta: {
    title: "Erken Makerspace — Classes, Memberships & Fab Services in Tempe | Demo by Erken Systems",
    description:
      "Laser cutting, 3D printing, CNC fabrication, kids robotics classes, and memberships out of a community makerspace in Tempe, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0E0D0B",
    surface: "#181613",
    surface2: "#12100E",
    border: "#282520",
    borderStrong: "#3F3A30",
    text: "#F4F1EB",
    textMuted: "#ACA396",
    textDim: "#736C5F",
    accent: "#B8752E",
    accentHover: "#CA8740",
    accentSoft: "rgba(184, 117, 46, 0.14)",
    accentText: "#0B0F15",
    dark: "#0A0907",
    darkText: "#F4F1EB",
    darkMuted: "#9E9583",
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
    kicker: "Rockford Dr · Tempe, AZ",
    headline: "Bring your idea, leave with a made thing.",
    headlineAccent: "leave with a made thing",
    sub: "Laser cutting, 3D printing, CNC fabrication, and kids robotics classes on real machines, taught and staffed by people who use them every day.",
    image: IMG,
    imageAlt: "Member using a laser cutter at Erken Makerspace",
    primaryCta: "Book an intro class",
    secondaryCta: "Ask our AI front desk",
    badge: "Open Machine Access · Est. 2017",
  },
  mission: {
    kicker: "Why we make",
    statement:
      "Answer the intro-class inquiry while everyone's already at the machines — not leave it unanswered until Monday.",
    statementAccent: "not leave it unanswered until Monday",
    sub: "Real machine access, real safety training, and a fab-service team that quotes RFQs fast.",
    values: ["Real safety training", "Open machine access", "Kids and adults", "Fast RFQ turnaround"],
  },
  stats: [
    { value: "1,100+", label: "Active members" },
    { value: "24", label: "Machines on the floor" },
    { value: "9", label: "Certified class instructors" },
    { value: "600+", label: "Fab-service jobs quoted a year" },
  ],
  services: {
    kicker: "Classes & Machine Access",
    headline: "From your first intro class to a full fab-service quote",
    sub: "Every class and membership runs on real machine availability and instructors who staff the floor themselves.",
    moreLabel: "Also at the makerspace",
    items: [
      {
        icon: "hammer",
        title: "Laser Cutter & 3D Printer Intro Class",
        body: "A required 90-minute safety and operation class before independent machine access, covering software basics and material limits.",
        price: "$45",
        image: IMG,
        imageAlt: "Intro class on the laser cutter at Erken Makerspace",
      },
      {
        icon: "graduation",
        title: "Kids Robotics & STEM Classes",
        body: "After-school and weekend robotics classes for ages 8–14, building toward a robotics competition each spring.",
        price: "from $149/mo",
      },
      {
        icon: "key",
        title: "Membership & Open Machine Access",
        body: "Unlimited access to laser cutters, 3D printers, and the CNC floor once you're certified, plus locker and storage space.",
        price: "from $89/mo",
      },
      {
        icon: "wrench",
        title: "Fab-Service Quotes",
        body: "Send us your CAD file for laser cutting, 3D printing, or CNC work and get a quote back within one business day, no membership required.",
        price: "custom quote",
      },
      {
        icon: "users",
        title: "Birthday & Group Workshops",
        body: "Private workshop sessions for birthday parties and team-building events, building a take-home project on our machines.",
        price: "from $349",
      },
      {
        icon: "calendar",
        title: "Workshop Rental",
        body: "Book the woodshop or electronics bench by the hour for members working on a personal project outside class time.",
        price: "from $18/hour",
      },
    ],
  },
  about: {
    kicker: "The makerspace",
    headline: "A workshop run by makers, not a co-working sign-up",
    paragraphs: [
      "Erken Makerspace opened in 2017 with a handful of machines and a promise: real safety training before independent access, not a waiver and a shrug. Today we run 24 machines and a full class schedule in Tempe — and the promise still holds.",
      "Every booking, parent contact for kids' programs, and fab-service RFQ lands in one place instead of a shared calendar and a text thread nobody can find, and our front desk answers every inquiry — even while staff are running the laser cutter or teaching a kids' class.",
    ],
    bullets: [
      "Certified instructors staff the floor during all open hours",
      "Required safety class before independent machine access",
      "Fab-service RFQs quoted within one business day",
      "Separate kids and adult program tracks, same shared floor",
    ],
    image: IMG,
    imageAlt: "Members working at benches inside Erken Makerspace",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to making your first thing",
    sub: "No waiver-and-walk-away — real training before you touch a machine.",
    items: [
      {
        title: "Book an intro class",
        body: "Pick a slot online or call — our AI assistant answers even while staff are on the floor and books your class or checks age requirements for kids programs.",
      },
      {
        title: "Get certified on the machine",
        body: "A hands-on safety and operation class, ending with you making a small project on your first day.",
      },
      {
        title: "Come back and build",
        body: "Book open machine time whenever you want, or send an RFQ if you'd rather have our team fabricate it for you.",
      },
    ],
  },
  testimonials: {
    kicker: "Members",
    headline: "People who turned an idea into a real object",
    items: [
      {
        quote:
          "I emailed an RFQ for a laser-cut sign on a Sunday and had a quote back by Monday afternoon, with the part ready two days later.",
        name: "Wren A.",
        role: "Fab-service customer",
      },
      {
        quote:
          "My kid's robotics class actually builds toward a real competition instead of just busywork. He asks to go every week.",
        name: "Malik F.",
        role: "Parent, kids robotics program",
      },
      {
        quote:
          "Took the 3D printer intro class nervous about breaking something. Left certified and printing my own parts within the hour.",
        name: "Sienna V.",
        role: "New member",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first visit",
    items: [
      {
        q: "Do I need experience to take an intro class?",
        a: "No — intro classes are built for zero-experience makers and cover everything from software basics to safe machine operation.",
      },
      {
        q: "How does the kids robotics program work?",
        a: "Weekly after-school or weekend sessions for ages 8 to 14, building toward a robotics competition each spring, taught by certified instructors.",
      },
      {
        q: "Can I get a quote without being a member?",
        a: "Yes — fab-service RFQs are open to anyone. Send a CAD file and get a quote back within one business day, no membership required.",
      },
      {
        q: "What machines are available to certified members?",
        a: "Laser cutters, 3D printers, a CNC router, and a full woodshop and electronics bench, all included with an open-access membership.",
      },
      {
        q: "Is there a minimum age for adult classes and membership?",
        a: "Adult classes and membership start at 16 with a guardian waiver, or 18 without one.",
      },
    ],
  },
  booking: {
    kicker: "Book a class",
    headline: "Book your intro class — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with what to bring. Prefer to talk now? Use the voice assistant.",
    // Reuses the SAME shared demo GHL calendar as skydiving/flight-schools
    // (no dedicated Erken Makerspace calendar exists yet) — good enough for
    // a click-through pilot, flagged for Shamil to swap for a real/distinct
    // calendar before this pattern replicates further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
  },
  cta: {
    headline: "The machines are warmed up.",
    sub: "One intro class tells you more than a year of watching maker videos.",
    buttonLabel: "Book your intro class",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "makerspace and fabrication workshop",
      demo_business: "Erken Makerspace",
      demo_context:
        "Caller is on the Erken Makerspace demo site (a fictional community makerspace demo by Erken Systems, positioned in Tempe, AZ). Play the makerspace's AI front desk: answer questions about intro classes, kids robotics, membership machine access, and fab-service RFQs, and offer to book an intro class.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Laser cutting, 3D printing, CNC fabrication, and kids robotics classes out of a community makerspace in Tempe, AZ since 2017.",
  },
};

export default makerspace;
