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
  | "users";

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
  stats?: { value: string; label: string }[];
  services?: {
    kicker: string;
    headline: string;
    sub: string;
    items: {
      icon: DemoIconName;
      title: string;
      body: string;
      price?: string;
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
    /** GHL inline form id; the form fires the live AI callback workflow. */
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
/* Flight schools — Skyline Flight Academy (fictional)                 */
/* ------------------------------------------------------------------ */

const flightSchools: DemoConfig = {
  slug: "flight-schools",
  industryLabel: "flight school",
  business: {
    name: "Skyline Flight Academy",
    short: "Skyline",
    tagline: "Learn to fly at Cedar Valley Regional",
    location: "Cedar Valley Regional Airport · Hangar 4",
    phoneDisplay: "(555) 214-0480",
    hours: "Mon–Sat 8am–7pm · Sun by appointment",
  },
  meta: {
    title: "Skyline Flight Academy — Learn to Fly | Demo by Erken Systems",
    description:
      "Discovery flights, private pilot training, and aircraft rental at Cedar Valley Regional Airport. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#F6F8FB",
    surface: "#FFFFFF",
    surface2: "#EDF2F8",
    border: "#D7DFE9",
    borderStrong: "#B9C6D6",
    text: "#16212E",
    textMuted: "#51606F",
    textDim: "#8494A5",
    accent: "#1D5FA8",
    accentHover: "#2971C2",
    accentSoft: "rgba(29, 95, 168, 0.10)",
    dark: "#101B28",
    darkText: "#F2F6FA",
    darkMuted: "#93A5B8",
  },
  sections: [
    "hero",
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
    kicker: "Cedar Valley Regional Airport",
    headline: "Your first takeoff is closer than you think.",
    headlineAccent: "first takeoff",
    sub: "Discovery flights, private pilot training, and aircraft rental — taught by career instructors who still love the traffic pattern. Most students solo in under three months.",
    image: "/demo/flight-schools/hero-hangar.jpg",
    imageAlt:
      "Flight instructor and student talking beside a Piper trainer in the Skyline hangar",
    primaryCta: "Book a discovery flight",
    secondaryCta: "Ask our AI front desk",
    badge: "FAA Part 61 · Est. 2011",
  },
  stats: [
    { value: "320+", label: "Pilot certificates earned" },
    { value: "9", label: "Aircraft in the training fleet" },
    { value: "96%", label: "First-attempt checkride pass rate" },
    { value: "14 yrs", label: "Teaching at Cedar Valley" },
  ],
  services: {
    kicker: "Programs",
    headline: "From first flight to the left seat",
    sub: "Every program runs on a written syllabus, a real schedule, and instructors who stay with you from intro flight to checkride.",
    items: [
      {
        icon: "compass",
        title: "Discovery Flight",
        body: "A 45-minute intro lesson where you take the controls with an instructor beside you. Bring a passenger, take photos, and log the time — it counts toward your license.",
        price: "$199",
      },
      {
        icon: "graduation",
        title: "Private Pilot (PPL)",
        body: "The full course from zero hours to certificated pilot: flight lessons, ground school, and checkride prep on one schedule that fits around your job.",
        price: "from $11,900",
      },
      {
        icon: "gauge",
        title: "Instrument Rating",
        body: "Fly in the clouds, on real trips, on real schedules. Scenario-based IFR training in glass-cockpit 172s with instructors who fly IFR weekly.",
        price: "from $9,800",
      },
      {
        icon: "key",
        title: "Aircraft Rental",
        body: "Certificated pilots rent our 172s and Cherokees wet, with online scheduling and same-day checkouts for current members.",
        price: "$165/hr wet",
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
      "Skyline started in 2011 with one Cessna 150 and a promise: no student waits two weeks to fly. Today we run nine aircraft and a full-time instructor team — and the promise still holds.",
      "Your instructor stays with you from your first lesson to your checkride. Your schedule lives online, your progress is tracked against a written syllabus, and our front desk answers every call — even the 9pm ones about tomorrow's weather.",
    ],
    bullets: [
      "Full-time career instructors — average 1,900 hours dwell time",
      "Maintenance done in-house, on our own hangar floor",
      "Online scheduling with real availability, not phone tag",
      "Fixed-price checkride prep — no surprise hours",
    ],
    image: "/demo/flight-schools/fleet-cessna.jpg",
    imageAlt: "Skyline Cessna 172 trainer on the Cedar Valley ramp",
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
        a: "Most Skyline students finish between $12,000 and $15,000 including aircraft, instructor, ground school, and exam fees. We publish a written cost breakdown after your discovery flight — and we track your spend against it every lesson, so there are no surprises at hour forty.",
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
    headline: "Request a discovery flight — we call you back in a minute",
    sub: "Leave your number and our AI front desk calls you back, checks the schedule with you, and books your flight — live, not a form that goes to a mailbox.",
    formId: "e3uSHlYnl0MrQe29KItJ",
    note: "Live callback works for US phone numbers. Prefer to talk now? Use the voice assistant — it books the same calendar.",
  },
  cta: {
    headline: "The ramp is a short drive away.",
    sub: "One discovery flight tells you more than a year of reading about it.",
    buttonLabel: "Book your discovery flight",
    image: "/demo/flight-schools/sunset-pilots.jpg",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "flight school",
      demo_business: "Skyline Flight Academy",
      demo_context:
        "Caller is on the Skyline Flight Academy demo site (a fictional flight school demo by Erken Systems). Play the school's AI front desk: answer questions about discovery flights ($199), private pilot training, instrument rating, and aircraft rental, and offer to book a discovery flight.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Flight training, aircraft rental, and discovery flights at Cedar Valley Regional Airport since 2011.",
  },
};

/* ------------------------------------------------------------------ */

export const DEMO_REGISTRY: Record<string, DemoConfig> = {
  [flightSchools.slug]: flightSchools,
};

export function getDemoConfig(slug: string): DemoConfig | undefined {
  return DEMO_REGISTRY[slug];
}

export function allDemoSlugs(): string[] {
  return Object.keys(DEMO_REGISTRY);
}
