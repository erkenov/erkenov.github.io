/**
 * /demo/[industry] — per-industry demo-site registry.
 *
 * One template (src/app/demo/[industry]) + one config entry here = one
 * complete fictional local-business website. These demos show prospects
 * what THEIR site + AI receptionist could look like on the Erken Systems
 * platform. Add an industry by adding a DemoConfig to DEMO_REGISTRY —
 * no template changes needed.
 *
 * DEMO PLACEHOLDER DATA: every business in this registry is fictional.
 * All stats, reviews, names, prices, and history are invented.
 */

export type DemoSectionId =
  | "hero"
  | "mission"
  | "stats"
  | "services"
  | "about"
  | "steps"
  | "testimonials"
  | "faq"
  | "booking"
  | "cta";

/** Icon names resolved in components/primitives.tsx (lucide-react). */
export type DemoIconName =
  | "plane"
  | "compass"
  | "gauge"
  | "key"
  | "graduation"
  | "radio"
  | "phone"
  | "calendar"
  | "shield"
  | "clock"
  | "map"
  | "users"
  // Added 2026-08-03 for the 17 additional passion-industry demos
  // (sky/auto/moto/bjj/gym/surf/tennis/farm/climb/yacht/ski/horse/shoot/
  // hotel/cafe/fix/make) — see src/app/demo/configs/*.ts.
  | "wind"
  | "wrench"
  | "bike"
  | "dumbbell"
  | "waves"
  | "mountain"
  | "anchor"
  | "snowflake"
  | "target"
  | "hotel"
  | "coffee"
  | "cpu"
  | "hammer"
  | "sprout";

export interface DemoTheme {
  /** Page background. */
  bg: string;
  /** Card / elevated surface. */
  surface: string;
  /** Nested surface (alt band). */
  surface2: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentHover: string;
  /** Translucent accent wash for chips/kickers. */
  accentSoft: string;
  /**
   * Text color on solid-accent fills (buttons). Dark palettes often use a
   * light accent (brass, gold) that needs dark button text; light palettes
   * usually want white here.
   */
  accentText: string;
  /** Dark band (footer / CTA) background + its text colors. */
  dark: string;
  darkText: string;
  darkMuted: string;
}

export interface DemoConfig {
  slug: string;
  /** Lowercase label used in copy and passed to the AI as context. */
  industryLabel: string;
  business: {
    name: string;
    short: string; // compact name for the nav wordmark
    tagline: string;
    location: string;
    phoneDisplay: string;
    hours: string;
    /** Small mark next to the nav wordmark. */
    icon: DemoIconName;
  };
  meta: { title: string; description: string };
  theme: DemoTheme;
  /** Which sections render, in this order. */
  sections: DemoSectionId[];
  hero: {
    kicker: string;
    /** Headline; `accent` substring (if found) gets the accent color. */
    headline: string;
    headlineAccent?: string;
    sub: string;
    image: string;
    imageAlt: string;
    primaryCta: string; // scrolls to booking
    secondaryCta: string; // starts the AI voice call
    badge?: string; // small proof chip on the hero image
  };
  /** Centered mission statement + optional value words (ffiaz-style rhythm). */
  mission?: {
    kicker: string;
    /** One clear sentence. `statementAccent` substring gets the accent color. */
    statement: string;
    statementAccent?: string;
    sub?: string;
    /** Short value words rendered as a divided row. */
    values?: string[];
  };
  stats?: { value: string; label: string }[];
  services?: {
    kicker: string;
    headline: string;
    sub: string;
    /** Heading over the compact cards for items without an image. */
    moreLabel?: string;
    items: {
      icon: DemoIconName;
      title: string;
      body: string;
      price?: string;
      /**
       * Items with an image render as full alternating photo/text modules;
       * items without one collect into a compact card row below.
       */
      image?: string;
      imageAlt?: string;
    }[];
  };
  about?: {
    kicker: string;
    headline: string;
    paragraphs: string[];
    bullets: string[];
    image: string;
    imageAlt: string;
  };
  steps?: {
    kicker: string;
    headline: string;
    sub: string;
    items: { title: string; body: string }[];
  };
  testimonials?: {
    kicker: string;
    headline: string;
    items: { quote: string; name: string; role: string; image?: string }[];
  };
  faq?: {
    kicker: string;
    headline: string;
    items: { q: string; a: string }[];
  };
  booking: {
    kicker: string;
    headline: string;
    sub: string;
    /**
     * GHL calendar id — renders the real booking widget
     * (https://api.leadconnectorhq.com/widget/booking/<id>). Preferred over
     * `formId` when both are set.
     */
    calendarId?: string;
    /**
     * GHL inline form id (legacy path) — the form fires the live AI callback
     * workflow. Kept as a fallback embed when no calendarId is configured;
     * the "Call me back" modal (nav + hero) covers the callback flow now.
     */
    formId?: string;
    note?: string;
  };
  cta?: {
    headline: string;
    sub: string;
    buttonLabel: string;
    image?: string;
  };
  voice: {
    enabled: boolean;
    /** Label on nav + hero secondary CTA. */
    buttonLabel: string;
    /** Passed to Retell as retell_llm_dynamic_variables. */
    dynamicVariables: Record<string, string>;
  };
  chat: { enabled: boolean };
  footer: { blurb: string };
}

/* ------------------------------------------------------------------ */
/* Flight schools — Fly Erken Flight Academy (fictional)               */
/* ------------------------------------------------------------------ */

const flightSchools: DemoConfig = {
  slug: "flight-schools",
  industryLabel: "flight school",
  business: {
    name: "Fly Erken Flight Academy",
    short: "Fly Erken",
    tagline: "Learn to fly in Phoenix",
    location: "Deer Valley Airport (KDVT) · Phoenix, AZ",
    phoneDisplay: "(325) 241-2460",
    hours: "Mon–Sat 8am–5pm · Sun closed",
    icon: "plane",
  },
  meta: {
    title: "Fly Erken Flight Academy — Learn to Fly in Phoenix | Demo by Erken Systems",
    description:
      "Discovery flights, private pilot training, and aircraft rental out of Deer Valley Airport in Phoenix, AZ. Demo website by Erken Systems.",
  },
  // Dark navy + brass — premium aviation, the demo brand's own palette
  // (deliberately NOT the erken.systems cream/sage look).
  theme: {
    bg: "#0A1119",
    surface: "#101927",
    surface2: "#0D1520",
    border: "#1D2A3B",
    borderStrong: "#2C3F58",
    text: "#EEF3F9",
    textMuted: "#9DAEC2",
    textDim: "#64768B",
    accent: "#D9A94E",
    accentHover: "#E5BA66",
    accentSoft: "rgba(217, 169, 78, 0.12)",
    accentText: "#0B0F15",
    dark: "#070C13",
    darkText: "#F2F6FB",
    darkMuted: "#8DA0B5",
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
    kicker: "Deer Valley Airport · Phoenix, AZ",
    headline: "Your first takeoff is closer than you think.",
    headlineAccent: "first takeoff",
    sub: "Discovery flights, private pilot training, and aircraft rental — taught by career instructors who still love the traffic pattern. Most students solo in under three months.",
    image: "/demo/flight-schools/sunset-pilots.jpg",
    imageAlt:
      "Two pilots watching the sunset from under the wing of a trainer at Deer Valley Airport",
    primaryCta: "Book a discovery flight",
    secondaryCta: "Ask our AI front desk",
    badge: "FAA Part 61 · Est. 2011",
  },
  mission: {
    kicker: "Why we fly",
    statement:
      "Train pilots the way the airlines wish every school did — full-time instructors, a written syllabus, and an airplane that's ready when you are.",
    statementAccent: "an airplane that's ready when you are",
    sub: "300+ clear-sky flying days a year over Phoenix. We don't waste a single one.",
    values: ["Safety", "Structure", "Consistency", "Straight answers"],
  },
  stats: [
    { value: "320+", label: "Pilot certificates earned" },
    { value: "9", label: "Aircraft in the training fleet" },
    { value: "96%", label: "First-attempt checkride pass rate" },
    { value: "300+", label: "Clear-sky flying days a year in Phoenix" },
  ],
  services: {
    kicker: "Programs",
    headline: "From first flight to the left seat",
    sub: "Every program runs on a written syllabus, a real schedule, and instructors who stay with you from intro flight to checkride.",
    moreLabel: "Also at the academy",
    items: [
      {
        icon: "compass",
        title: "Discovery Flight",
        body: "A 45-minute intro lesson where you take the controls with an instructor beside you. Bring a passenger, take photos, and log the time — it counts toward your license.",
        price: "$199",
        image: "/demo/flight-schools/cockpit-lesson.jpg",
        imageAlt:
          "Student and instructor side by side in the cockpit during a discovery flight",
      },
      {
        icon: "graduation",
        title: "Private Pilot (PPL)",
        body: "The full course from zero hours to certificated pilot: flight lessons, ground school, and checkride prep on one schedule that fits around your job.",
        price: "from $11,900",
        image: "/demo/flight-schools/preflight-hangar.jpg",
        imageAlt:
          "Instructor briefing a student pilot beside the trainer in the Fly Erken hangar",
      },
      {
        icon: "gauge",
        title: "Instrument Rating",
        body: "Fly in the clouds, on real trips, on real schedules. Scenario-based IFR training in glass-cockpit 172s with instructors who fly IFR weekly.",
        price: "from $9,800",
        image: "/demo/flight-schools/cockpit-checkout.jpg",
        imageAlt: "Pilot running the panel during an instrument checkout",
      },
      {
        icon: "key",
        title: "Aircraft Rental",
        body: "Certificated pilots rent our 172s and Cherokees wet, with online scheduling and same-day checkouts for current members.",
        price: "$165/hr wet",
        image: "/demo/flight-schools/fleet-cessna.jpg",
        imageAlt: "Rental Cessna 172 waiting on the Deer Valley ramp",
      },
      {
        icon: "radio",
        title: "Ground School",
        body: "Live evening classes every eight weeks. Pass the FAA written before your flying catches up to it — the cheapest hours you'll ever save.",
        price: "$349",
      },
      {
        icon: "plane",
        title: "Time Building",
        body: "Block rates and shared-cost cross-countries for pilots working toward commercial minimums. Structured routes, honest airplanes.",
        price: "block rates",
      },
    ],
  },
  about: {
    kicker: "The academy",
    headline: "A school built by instructors, not a rental counter",
    paragraphs: [
      "Fly Erken started in 2011 with one Cessna 150 and a promise: no student waits two weeks to fly. Today we run nine aircraft and a full-time instructor team out of Deer Valley — and the promise still holds.",
      "Your instructor stays with you from your first lesson to your checkride. Your schedule lives online, your progress is tracked against a written syllabus, and our front desk answers every call — even the 9pm ones about tomorrow's weather.",
    ],
    bullets: [
      "Full-time career instructors — average 1,900 hours dwell time",
      "Maintenance done in-house, on our own hangar floor",
      "Online scheduling with real availability, not phone tag",
      "Fixed-price checkride prep — no surprise hours",
    ],
    image: "/demo/flight-schools/hero-hangar.jpg",
    imageAlt:
      "Flight instructor and student talking beside a Piper trainer in the Fly Erken hangar",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first logbook entry",
    sub: "No paperwork marathon, no sales pitch. You fly first, then decide.",
    items: [
      {
        title: "Book a discovery flight",
        body: "Pick a slot online or call — our AI front desk answers 24/7 and books you straight into the schedule.",
      },
      {
        title: "Fly the airplane",
        body: "Preflight with your instructor, taxi out, and take the controls in the air. The flight is a real lesson and logs toward your license.",
      },
      {
        title: "Get your training plan",
        body: "Land, debrief over coffee, and leave with a written plan: timeline, cost breakdown, and your next three lessons on the calendar.",
      },
    ],
  },
  testimonials: {
    kicker: "Student pilots",
    headline: "People who started exactly where you are",
    items: [
      {
        quote:
          "I called on a Tuesday night expecting voicemail. The AI receptionist booked my discovery flight for Saturday morning, texted me the details, and my instructor already knew my name when I walked in.",
        name: "Dana R.",
        role: "Private pilot, certificated 2025",
        image: "/demo/flight-schools/student-smile.jpg",
      },
      {
        quote:
          "Soloed at 14 hours. The syllabus is on rails — you always know what the next lesson is, what it costs, and what you have to nail to move on.",
        name: "Marcus T.",
        role: "Student pilot, PPL in progress",
      },
      {
        quote:
          "I train around hospital shifts, so I book at weird hours. The scheduling is genuinely 24/7 — I've rebooked a weather cancellation at midnight from the break room.",
        name: "Priya S.",
        role: "Instrument student · ER nurse",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first lesson",
    items: [
      {
        q: "How much does a private pilot license cost?",
        a: "Most Fly Erken students finish between $12,000 and $15,000 including aircraft, instructor, ground school, and exam fees. We publish a written cost breakdown after your discovery flight — and we track your spend against it every lesson, so there are no surprises at hour forty.",
      },
      {
        q: "How long does it take?",
        a: "Flying twice a week, most students solo in 2–3 months and finish the license in 8–12 months. Once-a-week students should plan on 12–18 months. The biggest factor isn't talent — it's schedule consistency, which is why ours runs online, 24/7.",
      },
      {
        q: "Do I need a medical certificate before I start?",
        a: "Not for a discovery flight, and not for early lessons. We recommend getting your FAA third-class medical before you solo — we'll point you to the two examiners nearest the field and what to expect.",
      },
      {
        q: "Can I really take the controls on the first flight?",
        a: "Yes. Your instructor handles takeoff and landing; you fly the airplane in the practice area — climbs, turns, and straight-and-level. It's a real lesson with a real logbook entry, not a sightseeing ride.",
      },
      {
        q: "What if the weather cancels my lesson?",
        a: "You'll get a text from our front desk as soon as your instructor makes the call, with three rebooking options already checked against your availability. Weather cancellations never cost you anything.",
      },
    ],
  },
  booking: {
    kicker: "Book a flight",
    headline: "Book your discovery flight — pick a real time on our calendar",
    sub: "Grab an open slot below and you're on the schedule instantly — no back-and-forth. Prefer a call instead? Use the callback button up top.",
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    formId: "e3uSHlYnl0MrQe29KItJ",
    note: "Confirmed instantly — you'll get a text and email with the details. Prefer to talk now? Use the voice assistant — it books the same calendar.",
  },
  cta: {
    headline: "The ramp is a short drive away.",
    sub: "One discovery flight tells you more than a year of reading about it.",
    buttonLabel: "Book your discovery flight",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "flight school",
      demo_business: "Fly Erken Flight Academy",
      demo_context:
        "Caller is on the Fly Erken Flight Academy demo site (a fictional flight school demo by Erken Systems, positioned in Phoenix, AZ). Play the school's AI front desk: answer questions about discovery flights ($199), private pilot training, instrument rating, and aircraft rental, and offer to book a discovery flight.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Flight training, aircraft rental, and discovery flights out of Deer Valley Airport in Phoenix, AZ since 2011.",
  },
};

/* ------------------------------------------------------------------ */
/* 17 additional passion-industry demos (2026-08-03) — each is its own  */
/* fictional business in its own file under ./configs, one subdomain    */
/* each (see src/proxy.ts). Data/copy replication of the flight-schools */
/* pattern above; no template changes beyond the DemoIconName additions.*/
/* ------------------------------------------------------------------ */

import skydiving from "./configs/skydiving";
import automotive from "./configs/automotive";
import motorcycle from "./configs/motorcycle";
import bjj from "./configs/bjj";
import gym from "./configs/gym";
import surf from "./configs/surf";
import tennis from "./configs/tennis";
import farm from "./configs/farm";
import climbing from "./configs/climbing";
// Batch 3+ (2026-08-03): remaining imports added back in as their config
// files are written — see worker-status.md for progress.
// import yacht from "./configs/yacht";
// import ski from "./configs/ski";
// import horse from "./configs/horse";
// import shooting from "./configs/shooting";
// import hotel from "./configs/hotel";
// import cafe from "./configs/cafe";
// import electronics from "./configs/electronics";
// import makerspace from "./configs/makerspace";

const ALL_DEMOS: DemoConfig[] = [
  flightSchools,
  skydiving,
  automotive,
  motorcycle,
  bjj,
  gym,
  surf,
  tennis,
  farm,
  climbing,
];

export const DEMO_REGISTRY: Record<string, DemoConfig> = Object.fromEntries(
  ALL_DEMOS.map((d) => [d.slug, d]),
);

export function getDemoConfig(slug: string): DemoConfig | undefined {
  return DEMO_REGISTRY[slug];
}

export function allDemoSlugs(): string[] {
  return Object.keys(DEMO_REGISTRY);
}
