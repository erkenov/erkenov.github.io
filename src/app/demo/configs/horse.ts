/**
 * Horse riding schools — Erken Riding Stables (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-horseriding-photo.jpg";

const horse: DemoConfig = {
  slug: "horse",
  industryLabel: "horse riding school and stable",
  business: {
    name: "Erken Riding Stables",
    short: "Erken Stables",
    tagline: "Lessons, trail rides, boarding",
    location: "9800 E Rio Verde Dr · Scottsdale, AZ",
    phoneDisplay: "(325) 241-3305",
    hours: "Tue–Sun 7am–6pm · Mon closed",
    icon: "map",
  },
  meta: {
    title: "Erken Riding Stables — Lessons, Trail Rides & Boarding in Scottsdale | Demo by Erken Systems",
    description:
      "English and western riding lessons, guided desert trail rides, and horse boarding out of Scottsdale, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#100C09",
    surface: "#1B1611",
    surface2: "#14100D",
    border: "#2D251C",
    borderStrong: "#473A2B",
    text: "#F6F1E8",
    textMuted: "#B9AB93",
    textDim: "#7F725C",
    accent: "#A8632E",
    accentHover: "#BA7640",
    accentSoft: "rgba(168, 99, 46, 0.14)",
    accentText: "#0B0F15",
    dark: "#0B0806",
    darkText: "#F6F1E8",
    darkMuted: "#AA9C86",
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
    kicker: "Rio Verde Dr · Scottsdale, AZ",
    headline: "No paper booking book. Just a horse and a real time slot.",
    headlineAccent: "No paper booking book",
    sub: "English and western riding lessons, guided desert trail rides, and full-service boarding on 20 acres. Book online instead of leaving a message that might not get read.",
    image: IMG,
    imageAlt: "Rider on horseback on a desert trail near Erken Riding Stables",
    primaryCta: "Book a lesson or trail ride",
    secondaryCta: "Ask our AI front desk",
    badge: "Certified Instructors · Est. 2005",
  },
  mission: {
    kicker: "Why we ride",
    statement:
      "Move off the paper booking book and the Facebook DMs that sat unread for days.",
    statementAccent: "the Facebook DMs that sat unread for days",
    sub: "Real online scheduling, real waiver collection, and instructors who know every horse's temperament.",
    values: ["Safety first", "All experience levels", "Real scheduling", "20 acres to explore"],
  },
  stats: [
    { value: "26", label: "Horses in our herd" },
    { value: "19yr", label: "Teaching Scottsdale since 2005" },
    { value: "9", label: "Certified instructors and guides" },
    { value: "40+", label: "Horses boarded on site" },
  ],
  services: {
    kicker: "Lessons & Rides",
    headline: "From your first lesson to boarding your own horse",
    sub: "Every lesson and ride runs on a real online schedule — no more calling and hoping someone picks up.",
    moreLabel: "Also at the stables",
    items: [
      {
        icon: "map",
        title: "Guided Trail Ride",
        body: "1-hour and 2-hour guided rides through the Sonoran Desert, matched to your experience level, no prior riding required.",
        price: "from $75",
        image: IMG,
        imageAlt: "Guided desert trail ride group at Erken Riding Stables",
      },
      {
        icon: "graduation",
        title: "Riding Lessons",
        body: "English and western instruction for all ages and levels, from a first time in the saddle to competition prep.",
        price: "from $65/lesson",
      },
      {
        icon: "hotel",
        title: "Horse Boarding",
        body: "Full-care and self-care boarding with daily turnout, on 20 acres with a covered arena and trail access.",
        price: "from $450/mo",
      },
      {
        icon: "users",
        title: "Summer Camps",
        body: "Full-day and half-day summer camps for kids covering riding, horse care, and stable life.",
        price: "from $85/day",
      },
      {
        icon: "shield",
        title: "Birthday Parties",
        body: "Private trail ride or pony experience packages for birthday and group celebrations, with a dedicated wrangler.",
        price: "from $325",
      },
      {
        icon: "calendar",
        title: "Show & Competition Prep",
        body: "Lesson packages built around a specific show date, with an instructor who travels to select competitions with students.",
        price: "custom quote",
      },
    ],
  },
  about: {
    kicker: "The stables",
    headline: "A stable run by horsepeople, not a paper booking book",
    paragraphs: [
      "Erken Riding Stables has run lessons and trail rides on this property since 2005, starting with six horses and a handwritten booking book. Today we're home to 26 horses and 40+ boarders — and we finally moved that booking book online.",
      "Every horse is matched to your experience level by an instructor who knows their temperament, our schedule shows real availability instead of a guess, and our front desk answers every call — even the one asking if a nervous first-timer will be safe.",
    ],
    bullets: [
      "Certified instructors matched to every rider's experience level",
      "26-horse herd known individually by our staff",
      "20 acres with a covered arena and desert trail access",
      "Online waiver signing — no paperwork at check-in",
    ],
    image: IMG,
    imageAlt: "Instructor with a student and horse in the arena at Erken Riding Stables",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first ride",
    sub: "No flipping through a paper book to find an open Saturday.",
    items: [
      {
        title: "Book online or call",
        body: "Pick a lesson or trail-ride slot online, or call — our AI front desk answers 24/7 and books you straight into the schedule.",
      },
      {
        title: "Sign your waiver ahead of time",
        body: "Waivers get sent and signed digitally before you arrive, so check-in is just meeting your horse.",
      },
      {
        title: "Ride and get matched again",
        body: "After your ride, we note your comfort level so every future booking matches you with the right horse automatically.",
      },
    ],
  },
  testimonials: {
    kicker: "Riders",
    headline: "People who used to leave messages that went unanswered",
    items: [
      {
        quote:
          "I used to DM the old Facebook page and wait days for a reply. Now the AI receptionist books me the same day I call.",
        name: "Whitney A.",
        role: "Weekly lesson student",
      },
      {
        quote:
          "First trail ride ever and they matched me to the calmest horse in the herd without me even asking. Felt safe the whole time.",
        name: "Julian K.",
        role: "First-time trail rider",
      },
      {
        quote:
          "Boarding my horse here for three years — the online scheduling for the arena alone is worth switching stables for.",
        name: "Renata C.",
        role: "Boarder since 2022",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first ride",
    items: [
      {
        q: "Do I need riding experience for a trail ride?",
        a: "No. Our guides match first-timers with our calmest, most experienced trail horses and walk you through everything before you mount up.",
      },
      {
        q: "What should I wear?",
        a: "Long pants and closed-toe shoes with a slight heel are best. We provide helmets for every rider at no extra charge.",
      },
      {
        q: "How do lessons work for complete beginners?",
        a: "Your first lesson covers grooming, tacking up, and basic control at a walk. Most beginners are trotting confidently within their first few lessons.",
      },
      {
        q: "What's included in full-care boarding?",
        a: "Daily feeding, stall cleaning, and turnout, plus access to the covered arena and trails. Self-care boarding is available at a lower monthly rate for owners who prefer to do their own care.",
      },
      {
        q: "Can I board my horse if I don't live nearby?",
        a: "Yes — many of our boarders visit a few times a week rather than daily. We handle daily care and can arrange additional exercise sessions if needed.",
      },
    ],
  },
  booking: {
    kicker: "Book a ride",
    headline: "Book your lesson or trail ride — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    // Reuses the SAME shared demo GHL calendar as flight-schools/skydiving
    // (no dedicated Erken Riding Stables calendar exists yet) — fine for a
    // click-through demo, flagged for a real/distinct calendar later.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    note: "Confirmed instantly — you'll get a text and email with what to bring. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The trail is saddled up and ready.",
    sub: "One ride tells you more than a year of watching from the fence line.",
    buttonLabel: "Book your ride",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "horse riding school and stable",
      demo_business: "Erken Riding Stables",
      demo_context:
        "Caller is on the Erken Riding Stables demo site (a fictional horse riding school demo by Erken Systems, positioned in Scottsdale, AZ). Play the stable's AI front desk: answer questions about guided trail rides, riding lessons, and boarding, and offer to book a lesson or trail ride.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "English and western riding lessons, guided desert trail rides, and horse boarding in Scottsdale, AZ since 2005.",
  },
};

export default horse;
