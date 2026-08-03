/**
 * Yacht charters & sailing schools — Erken Yacht Charters (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-yachting-photo.jpg";

const yacht: DemoConfig = {
  slug: "yacht",
  industryLabel: "yacht charter and sailing school",
  business: {
    name: "Erken Yacht Charters",
    short: "Erken Yacht",
    tagline: "Charter, sail, learn",
    location: "Bahia Mar Marina · Fort Lauderdale, FL",
    phoneDisplay: "(325) 241-6650",
    hours: "Daily 8am–8pm, charters by appointment",
    icon: "anchor",
  },
  meta: {
    title: "Erken Yacht Charters — Charters & Sailing Courses in Fort Lauderdale | Demo by Erken Systems",
    description:
      "Day and multi-day charters, ASA sailing courses, and boat club membership out of Fort Lauderdale, FL. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#081018",
    surface: "#0E1C2A",
    surface2: "#0A1621",
    border: "#1B3040",
    borderStrong: "#294860",
    text: "#ECF4FA",
    textMuted: "#9AB2C5",
    textDim: "#61798C",
    accent: "#2E8FBF",
    accentHover: "#41A2D2",
    accentSoft: "rgba(46, 143, 191, 0.14)",
    accentText: "#0B0F15",
    dark: "#060C12",
    darkText: "#ECF4FA",
    darkMuted: "#8AA1B4",
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
    kicker: "Bahia Mar Marina · Fort Lauderdale, FL",
    headline: "An instant quote, before you book someone else's boat.",
    headlineAccent: "before you book someone else's boat",
    sub: "Day and multi-day charters, ASA-certified sailing courses, and a boat club membership for locals who want to sail without owning. Real availability, real crew, no hidden fees.",
    image: IMG,
    imageAlt: "Sailing yacht underway off the coast of Fort Lauderdale",
    primaryCta: "Get a charter quote",
    secondaryCta: "Ask our AI front desk",
    badge: "ASA Certified School · Est. 2011",
  },
  mission: {
    kicker: "Why we sail",
    statement:
      "Answer the midnight charter inquiry with an instant quote — before the client books the boat down the dock instead.",
    statementAccent: "before the client books the boat down the dock",
    sub: "Real-time availability, transparent pricing, and crew who know these waters cold.",
    values: ["Instant quotes", "Licensed crew", "Transparent pricing", "Real availability"],
  },
  stats: [
    { value: "2,200+", label: "Charters run since 2011" },
    { value: "6", label: "Yachts in the charter fleet" },
    { value: "480+", label: "Sailors certified through our ASA courses" },
    { value: "4.9★", label: "Average charter rating" },
  ],
  services: {
    kicker: "Charters & Courses",
    headline: "From a sunset sail to your own captain's license",
    sub: "Every charter and course runs on real-time fleet availability and crew who've sailed these waters for years.",
    moreLabel: "Also at the marina",
    items: [
      {
        icon: "anchor",
        title: "Day Charter",
        body: "Half-day and full-day charters with a licensed captain and crew, from a sunset sail to a full day on the water for up to 12 guests.",
        price: "from $895",
        image: IMG,
        imageAlt: "Guests aboard an Erken Yacht Charters day charter",
      },
      {
        icon: "map",
        title: "Multi-Day Charter",
        body: "3 to 7 night crewed charters through the Keys or the Bahamas, fully provisioned with a captain and chef.",
        price: "from $6,200",
      },
      {
        icon: "graduation",
        title: "ASA Sailing Courses",
        body: "Basic Keelboat through Coastal Navigation, taught aboard our training fleet by ASA-certified instructors.",
        price: "from $595",
      },
      {
        icon: "users",
        title: "Boat Club Membership",
        body: "Unlimited access to a fleet of boats without the cost of ownership — maintenance, docking, and insurance included.",
        price: "from $349/mo",
      },
      {
        icon: "calendar",
        title: "Corporate & Event Charters",
        body: "Full-boat buyouts for corporate events, proposals, and celebrations, with custom catering arranged through our team.",
        price: "custom quote",
      },
      {
        icon: "shield",
        title: "Captained Bareboat Add-On",
        body: "Certified sailors can charter bareboat, or add a licensed captain for local knowledge and peace of mind.",
        price: "from $250/day",
      },
    ],
  },
  about: {
    kicker: "The charter company",
    headline: "Run by sailors, not a booking agency",
    paragraphs: [
      "Erken Yacht Charters opened in 2011 with one sailboat and a promise: an instant, honest quote, every time, day or night. Today we run a six-boat fleet and a full ASA sailing school out of Bahia Mar — and the promise still holds.",
      "Your captain knows these waters and your itinerary before you step aboard, our availability calendar is live online, and our front desk answers every inquiry — even the one that comes in at midnight from a client deciding between us and the marina down the dock.",
    ],
    bullets: [
      "USCG-licensed captains on every crewed charter",
      "ASA-certified instructors teaching all six course levels",
      "Transparent, all-in pricing — no fuel surcharge surprises",
      "Boat club membership for locals who sail without owning",
    ],
    image: IMG,
    imageAlt: "Crew preparing a yacht for departure at Bahia Mar Marina",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to being on the water",
    sub: "No back-and-forth on pricing, no waiting overnight for a quote.",
    items: [
      {
        title: "Get an instant quote",
        body: "Message us any hour — our AI assistant checks live fleet availability and quotes your date and guest count on the spot.",
      },
      {
        title: "Confirm with a deposit",
        body: "A deposit link goes out the moment your charter or course is confirmed, holding your date on the calendar.",
      },
      {
        title: "Board and go",
        body: "Meet your captain and crew dockside, get a safety briefing, and head out — the rest is just enjoying the water.",
      },
    ],
  },
  testimonials: {
    kicker: "Guests",
    headline: "People who booked before anyone else answered",
    items: [
      {
        quote:
          "I messaged at 11pm the night before a friend's birthday. The AI assistant quoted the boat, checked availability, and had a deposit link in my inbox in under a minute.",
        name: "Isabelle F.",
        role: "Day charter guest",
      },
      {
        quote:
          "Took the ASA Basic Keelboat course and felt genuinely ready to sail on my own by the end of the weekend.",
        name: "Deshawn R.",
        role: "ASA course graduate",
      },
      {
        quote:
          "Joined the boat club instead of buying — I sail three weekends a month and never think about maintenance.",
        name: "Lorenzo P.",
        role: "Boat club member",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first charter",
    items: [
      {
        q: "Do I need sailing experience to book a charter?",
        a: "No — crewed charters come with a licensed captain who handles the boat. You're a guest, not the crew, unless you specifically want a hands-on sail.",
      },
      {
        q: "How far in advance should I book?",
        a: "Weekends and holidays book out several weeks ahead in peak season (November–April). Weekday and off-season charters often have same-week availability.",
      },
      {
        q: "What's included in the charter price?",
        a: "Captain, crew, fuel, and basic beverages are included in every quote. Catering, alcohol upgrades, and water toys are optional add-ons quoted upfront.",
      },
      {
        q: "Do I need any certification to take the boat club option?",
        a: "Boat club members who want to skipper themselves need at minimum our Basic Keelboat certification or equivalent; otherwise every club outing includes a captain.",
      },
      {
        q: "What happens if weather cancels my charter?",
        a: "We rebook at no charge to the next available date, or refund your deposit in full if no date works for you.",
      },
    ],
  },
  booking: {
    kicker: "Get a quote",
    headline: "Get your charter quote — check real fleet availability",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer to talk first? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with dock details. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The fleet is at the dock, ready.",
    sub: "One afternoon on the water tells you more than a year of scrolling boat photos.",
    buttonLabel: "Get your charter quote",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "yacht charter and sailing school",
      demo_business: "Erken Yacht Charters",
      demo_context:
        "Caller is on the Erken Yacht Charters demo site (a fictional yacht charter and sailing school demo by Erken Systems, positioned in Fort Lauderdale, FL). Play the company's AI front desk: answer questions about day and multi-day charters, ASA sailing courses, and boat club membership, and offer to quote a charter.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Day and multi-day charters, ASA sailing courses, and boat club membership out of Fort Lauderdale, FL since 2011.",
  },
};

export default yacht;
