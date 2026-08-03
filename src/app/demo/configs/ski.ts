/**
 * Ski schools & lodges — Erken Ski Lodge (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-skiing-photo.jpg";

const ski: DemoConfig = {
  slug: "ski",
  industryLabel: "independent ski school and lodge",
  business: {
    name: "Erken Ski Lodge",
    short: "Erken Ski",
    tagline: "Learn, rent, stay",
    location: "115 Silver King Dr · Park City, UT",
    phoneDisplay: "(325) 241-8867",
    hours: "Daily 7:30am–5pm, in-season",
    icon: "snowflake",
  },
  meta: {
    title: "Erken Ski Lodge — Lessons, Rentals & Stays in Park City | Demo by Erken Systems",
    description:
      "Independent ski and snowboard lessons, rental gear, and lodge rooms in Park City, UT. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0B1016",
    surface: "#131C25",
    surface2: "#0E161D",
    border: "#22303B",
    borderStrong: "#354957",
    text: "#EFF5FA",
    textMuted: "#A0B2C0",
    textDim: "#677988",
    accent: "#4A9FD8",
    accentHover: "#5EAFE4",
    accentSoft: "rgba(74, 159, 216, 0.14)",
    accentText: "#0B0F15",
    dark: "#080C10",
    darkText: "#EFF5FA",
    darkMuted: "#93A6B5",
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
    kicker: "Silver King Dr · Park City, UT",
    headline: "Book your peak-week lesson before the line forms.",
    headlineAccent: "before the line forms",
    sub: "Independent ski and snowboard lessons, full rental gear, and lodge rooms three minutes from the lift. Book your whole trip in one place, no line at the rental counter.",
    image: IMG,
    imageAlt: "Ski instructor with a student on the slopes near Erken Ski Lodge",
    primaryCta: "Book a lesson or rental",
    secondaryCta: "Ask our AI front desk",
    badge: "PSIA Certified Instructors · Est. 2009",
  },
  mission: {
    kicker: "Why we ski",
    statement:
      "Answer every line ringing at once during peak week — and have your rental gear waiting instead of a line out the door.",
    statementAccent: "have your rental gear waiting instead of a line out the door",
    sub: "PSIA-certified instructors, pre-booked gear, and a lodge that answers the phone during the busiest week of the season.",
    values: ["Real availability", "Pre-booked gear", "Certified instructors", "No line, no wait"],
  },
  stats: [
    { value: "14,000+", label: "Lessons taught since 2009" },
    { value: "22", label: "PSIA-certified instructors" },
    { value: "40", label: "Lodge rooms on site" },
    { value: "16yr", label: "Serving Park City since 2009" },
  ],
  services: {
    kicker: "Lessons, Rentals & Stays",
    headline: "From your first turn to a full ski-week stay",
    sub: "Every lesson and rental runs on a real fleet calendar so peak week never starts with a line out the door.",
    moreLabel: "Also at the lodge",
    items: [
      {
        icon: "snowflake",
        title: "Group Ski or Snowboard Lesson",
        body: "Half-day and full-day group lessons for all levels, taught by PSIA-certified instructors in small skill-matched groups.",
        price: "from $145",
        image: IMG,
        imageAlt: "Group ski lesson on the slopes at Erken Ski Lodge",
      },
      {
        icon: "graduation",
        title: "Private Lessons",
        body: "One-on-one instruction for skiers and riders who want faster progress or a specific technical fix, any age.",
        price: "$285/half-day",
      },
      {
        icon: "key",
        title: "Full Rental Package",
        body: "Skis or board, boots, and poles sized and pre-fit before you arrive so peak week doesn't start with a fitting line.",
        price: "from $55/day",
      },
      {
        icon: "hotel",
        title: "Lodge Rooms",
        body: "Ski-in, ski-out style rooms three minutes from the lift, with gear storage and a heated boot room.",
        price: "from $219/night",
      },
      {
        icon: "graduation",
        title: "Kids Ski School",
        body: "Full-day supervised programs for ages 4–12 combining lessons, lunch, and supervised free-ski time.",
        price: "$189/day",
      },
      {
        icon: "users",
        title: "Group & Corporate Packages",
        body: "Multi-room bookings with bundled lessons and rentals for groups of 8 or more, coordinated by one point of contact.",
        price: "custom quote",
      },
    ],
  },
  about: {
    kicker: "The lodge",
    headline: "A lodge run by instructors, not a big-resort counter",
    paragraphs: [
      "Erken Ski Lodge opened in 2009 with 12 rooms and a promise: your rental gear is ready when you walk in, not queued behind everyone else's. Today we run 40 rooms and a full instructor team in Park City — and the promise still holds.",
      "Your gear is pre-fit from the sizes you give us online, our rental and lesson calendar shows real fleet availability, and our front desk answers every call — even when every line is ringing at once during peak week.",
    ],
    bullets: [
      "PSIA-certified instructors for every lesson level",
      "Rental gear pre-fit and ready before you arrive",
      "40 rooms, three minutes from the lift",
      "Off-season reactivation so past guests never lose touch",
    ],
    image: IMG,
    imageAlt: "Erken Ski Lodge exterior with mountains in the background",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first run",
    sub: "No line at the rental counter, no fitting delays on day one.",
    items: [
      {
        title: "Book your stay, lesson, and rental",
        body: "One booking covers your room, lesson, and gear — our AI front desk answers 24/7 even during peak-week chaos.",
      },
      {
        title: "Pick up your pre-fit gear",
        body: "Gear sized from the info you gave online is ready and waiting — no fitting line to slow down your first morning.",
      },
      {
        title: "Take your lesson and ski",
        body: "Meet your instructor at the base, get matched to a skill-appropriate group, and hit the slopes.",
      },
    ],
  },
  testimonials: {
    kicker: "Guests",
    headline: "People who skipped the peak-week chaos",
    items: [
      {
        quote:
          "Called during the craziest week of the season and actually got through. The AI receptionist booked our lesson and rental together and had gear waiting when we arrived.",
        name: "The Hendersons",
        role: "Family of four, peak week stay",
      },
      {
        quote:
          "My kid's ski school program was the first vacation activity that ran exactly on the schedule they promised.",
        name: "Marta G.",
        role: "Parent, kids ski school",
      },
      {
        quote:
          "Got a reactivation message when the season opened and rebooked our annual trip in under five minutes.",
        name: "The Ortiz Family",
        role: "Returning guests, 4th season",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before a ski trip",
    items: [
      {
        q: "Can I book rental gear ahead of arrival?",
        a: "Yes — and we recommend it. Give us your sizes online and your gear is pre-fit and waiting, skipping the peak-week fitting line entirely.",
      },
      {
        q: "What skill levels do you teach?",
        a: "First-timers through advanced, in small skill-matched groups. Private lessons are available at any level for faster, more personalized progress.",
      },
      {
        q: "How far is the lodge from the lift?",
        a: "About a 3-minute walk, with a heated boot room and gear storage so you don't have to haul everything back to your room.",
      },
      {
        q: "Do you have programs for young kids?",
        a: "Yes — our kids ski school runs full-day programs for ages 4 to 12, combining lessons, lunch, and supervised free-ski time.",
      },
      {
        q: "What if the weather is bad during my stay?",
        a: "Lessons run in most conditions; on rare full-closure days we reschedule your lesson at no charge for the remainder of your stay.",
      },
    ],
  },
  booking: {
    kicker: "Book your trip",
    headline: "Book your lesson, rental, or room — pick real dates",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    // Reuses the SAME shared demo GHL calendar as flight-schools/skydiving
    // (no dedicated Erken Ski Lodge calendar exists yet) — fine for a
    // click-through demo, flagged for a real/distinct calendar later.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
    note: "Confirmed instantly — you'll get a text and email with pickup and check-in details. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The lifts open again soon.",
    sub: "One booked week beats a season of last-minute scrambling.",
    buttonLabel: "Book your ski trip",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "independent ski school and lodge",
      demo_business: "Erken Ski Lodge",
      demo_context:
        "Caller is on the Erken Ski Lodge demo site (a fictional independent ski school and lodge demo by Erken Systems, positioned in Park City, UT). Play the lodge's AI front desk: answer questions about group and private lessons, rental gear, lodge rooms, and kids ski school, and offer to book a lesson, rental, or room.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Independent ski and snowboard lessons, rental gear, and lodge rooms in Park City, UT since 2009.",
  },
};

export default ski;
