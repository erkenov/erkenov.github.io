/**
 * Cafes & restaurants — Café Erken (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from. Catering & events angle per
 * the carousel money map, not a single low-margin coffee counter.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-restaurant-photo.jpg";

const cafe: DemoConfig = {
  slug: "cafe",
  industryLabel: "restaurant and catering company",
  business: {
    name: "Café Erken",
    short: "Café Erken",
    tagline: "Dinner, drinks, and catering",
    location: "1122 N 7th Ave · Phoenix, AZ",
    phoneDisplay: "(325) 241-4488",
    hours: "Tue–Sun 5pm–10pm · Mon closed",
    icon: "coffee",
  },
  meta: {
    title: "Café Erken — Reservations, Private Events & Catering in Phoenix | Demo by Erken Systems",
    description:
      "Dinner reservations, private events, and catering out of a neighborhood restaurant in Phoenix, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#100C09",
    surface: "#1C1610",
    surface2: "#15100C",
    border: "#2F251A",
    borderStrong: "#4A3B29",
    text: "#F7F1E7",
    textMuted: "#BCAC92",
    textDim: "#82735D",
    accent: "#C1622E",
    accentHover: "#D3763F",
    accentSoft: "rgba(193, 98, 46, 0.14)",
    accentText: "#0B0F15",
    dark: "#0B0806",
    darkText: "#F7F1E7",
    darkMuted: "#AD9D82",
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
    kicker: "7th Avenue · Phoenix, AZ",
    headline: "Never lose a table or a catering lead again.",
    headlineAccent: "Never lose a table or a catering lead",
    sub: "A neighborhood dinner spot with a real reservation system and a catering arm that actually gets answered during the dinner rush, not left on voicemail.",
    image: IMG,
    imageAlt: "Dining room interior at Café Erken during dinner service",
    primaryCta: "Book a table",
    secondaryCta: "Ask our AI front desk",
    badge: "Chef-Owned · Est. 2018",
  },
  mission: {
    kicker: "Why we cook",
    statement:
      "Answer the phone during dinner rush when nobody at the host stand can pick up — and qualify the catering lead that actually justifies the fee.",
    statementAccent: "qualify the catering lead that actually justifies the fee",
    sub: "A real reservation system, a real catering pipeline, and a kitchen that doesn't stop because the phone's ringing.",
    values: ["Chef-owned", "Real reservations", "Catering that scales", "Neighborhood roots"],
  },
  stats: [
    { value: "1,900+", label: "Private events catered since 2018" },
    { value: "68", label: "Seats in the dining room" },
    { value: "4.7★", label: "Average review rating" },
    { value: "6yr", label: "Serving 7th Avenue since 2018" },
  ],
  services: {
    kicker: "Dine & Celebrate",
    headline: "From a Tuesday dinner to a full private buyout",
    sub: "Every reservation and catering inquiry runs on a real system, not a paper reservation book by the host stand.",
    moreLabel: "Also at Café Erken",
    items: [
      {
        icon: "coffee",
        title: "Dinner Reservations",
        body: "Nightly dinner service with a seasonal menu, held tables, and a waitlist that texts you when your spot is ready.",
        price: "no fee",
        image: IMG,
        imageAlt: "Reserved table setting at Café Erken",
      },
      {
        icon: "users",
        title: "Private Events & Buyouts",
        body: "Full or partial restaurant buyouts for rehearsal dinners, birthdays, and corporate events, with a custom menu built around your budget.",
        price: "from $2,500",
      },
      {
        icon: "calendar",
        title: "Off-Site Catering",
        body: "Full-service catering for weddings and corporate events, from a plated dinner to a passed-appetizer reception.",
        price: "from $65/person",
      },
      {
        icon: "clock",
        title: "Private Dining Room",
        body: "A semi-private room seating up to 20 for smaller celebrations without a full buyout.",
        price: "from $500 minimum",
      },
      {
        icon: "shield",
        title: "Gift Cards & Group Deposits",
        body: "Digital gift cards and group deposit handling for large parties, collected upfront so no-shows don't cost the kitchen.",
        price: "varies",
      },
      {
        icon: "map",
        title: "Wine Dinners & Tasting Events",
        body: "Monthly seated wine-pairing dinners with a guest sommelier, limited to 30 seats.",
        price: "$120/person",
      },
    ],
  },
  about: {
    kicker: "The restaurant",
    headline: "A restaurant run by the chef who owns it",
    paragraphs: [
      "Café Erken opened in 2018 with 12 tables and a promise: the chef who owns the place is in the kitchen every service. Today we seat 68 and cater events across the valley — and the chef's still there most nights.",
      "A review request goes out automatically after every great event, our reservation and catering systems both run online instead of a shared paper book, and our front desk answers every call — even during dinner rush when nobody at the host stand can pick up.",
    ],
    bullets: [
      "Chef-owned since day one — no corporate menu changes",
      "Real-time reservation system with waitlist texting",
      "Dedicated events lead for catering and private buyouts",
      "Regulars win-back messaging before they quietly stop coming in",
    ],
    image: IMG,
    imageAlt: "Chef plating a dish in the Café Erken kitchen",
  },
  steps: {
    kicker: "How it works",
    headline: "Three steps to your table or your event",
    sub: "No voicemail during dinner rush, no guessing on catering pricing.",
    items: [
      {
        title: "Book your table or event",
        body: "Reserve online or call — our AI assistant answers even during the dinner rush and qualifies catering leads by headcount and date.",
      },
      {
        title: "Get a quote if it's an event",
        body: "Catering and private-event inquiries get a menu and quote from our events lead, usually within one business day.",
      },
      {
        title: "Show up and enjoy",
        body: "A held table or a fully staffed event, followed by a review request if everything went the way it should.",
      },
    ],
  },
  testimonials: {
    kicker: "Guests",
    headline: "People who stopped calling and getting voicemail",
    items: [
      {
        quote:
          "Tried to book a table during a packed Friday rush and actually got through. The AI assistant held a table and texted the confirmation before I hung up.",
        name: "Alyssa N.",
        role: "Weekly regular",
      },
      {
        quote:
          "Got a real quote for my rehearsal dinner within a day, no chasing anyone down. The buyout was worth every penny.",
        name: "The Kowalski Family",
        role: "Private event client",
      },
      {
        quote:
          "Haven't been in for a few months and got a genuine invite back instead of a generic coupon blast. Went that weekend.",
        name: "Devon R.",
        role: "Returning regular",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before booking",
    items: [
      {
        q: "How far ahead should I book a table?",
        a: "Weekends fill up a few days out; weeknights often have same-day availability. Our waitlist texts you if a table opens sooner.",
      },
      {
        q: "Do you require a deposit for private events?",
        a: "Yes, a deposit secures your date for buyouts and off-site catering, applied to your final invoice.",
      },
      {
        q: "Can you accommodate dietary restrictions?",
        a: "Yes — let us know at booking and our kitchen will build accommodations into your reservation or event menu.",
      },
      {
        q: "What's the minimum group size for the private dining room?",
        a: "The private room has a $500 food and beverage minimum, typically comfortable for parties of 10 to 20 guests.",
      },
      {
        q: "Do you cater off-site events outside the restaurant?",
        a: "Yes — full-service off-site catering for weddings and corporate events, with menus scaled from small gatherings to large receptions.",
      },
    ],
  },
  booking: {
    kicker: "Reserve a table",
    headline: "Book your table — pick a real time",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email confirmation. Prefer to talk now? Use the voice assistant.",
    // Reuses the SAME shared demo GHL calendar as flight-schools / skydiving
    // (no dedicated Café Erken calendar exists yet) — good enough for a
    // click-through pilot, flagged for Shamil to swap for a real/distinct
    // calendar before this pattern replicates further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
  },
  cta: {
    headline: "The kitchen is firing tonight.",
    sub: "One reservation tells you more than a year of takeout.",
    buttonLabel: "Book your table",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "restaurant and catering company",
      demo_business: "Café Erken",
      demo_context:
        "Caller is on the Café Erken demo site (a fictional chef-owned restaurant demo by Erken Systems, positioned in Phoenix, AZ). Play the restaurant's AI front desk: answer questions about dinner reservations, private events, and off-site catering, and offer to book a table or start a catering quote.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Chef-owned dinner service, private events, and catering out of a neighborhood restaurant in Phoenix, AZ since 2018.",
  },
};

export default cafe;
