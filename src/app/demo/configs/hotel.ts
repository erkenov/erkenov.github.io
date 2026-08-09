/**
 * Boutique hotels — Hotel Erken (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-hotel-photo.jpg";

const hotel: DemoConfig = {
  slug: "hotel",
  industryLabel: "boutique hotel",
  business: {
    name: "Hotel Erken",
    short: "Hotel Erken",
    tagline: "Book direct, stay longer",
    location: "212 W Camelback Rd · Phoenix, AZ",
    phoneDisplay: "(888) 799-6065",
    hours: "Front desk 24/7",
    icon: "hotel",
  },
  meta: {
    title: "Hotel Erken — Boutique Stays & Direct Booking in Phoenix | Demo by Erken Systems",
    description:
      "A 32-room boutique hotel in central Phoenix with direct-booking rates below the OTAs. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0F0E0A",
    surface: "#1A180F",
    surface2: "#14120C",
    border: "#2C2718",
    borderStrong: "#463D25",
    text: "#F6F2E7",
    textMuted: "#BAB090",
    textDim: "#807759",
    accent: "#C9A227",
    accentHover: "#DBB439",
    accentSoft: "rgba(201, 162, 39, 0.14)",
    accentText: "#0B0F15",
    dark: "#0A0907",
    darkText: "#F6F2E7",
    darkMuted: "#AC9F7C",
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
    kicker: "212 W Camelback Rd · Phoenix, AZ",
    headline: "Book direct and skip the OTA markup.",
    headlineAccent: "skip the OTA markup",
    sub: "32 rooms in central Phoenix, a rate that beats the booking sites, and a front desk that answers at 2am, not just during business hours.",
    image: IMG,
    imageAlt: "Boutique hotel room interior at Hotel Erken",
    primaryCta: "Book direct",
    secondaryCta: "Ask our AI front desk",
    badge: "32 Rooms · Est. 2016",
  },
  mission: {
    kicker: "Why book direct",
    statement:
      "Answer a booking inquiry the moment a guest is deciding between us and a listing charging you twenty percent commission on every stay.",
    statementAccent: "twenty percent commission on every stay",
    sub: "Every direct booking is a rate we can actually pass savings from — to you and to the guest.",
    values: ["Best-rate guarantee", "24/7 front desk", "Local character", "No OTA markup"],
  },
  stats: [
    { value: "32", label: "Rooms" },
    { value: "4.8★", label: "Average guest rating" },
    { value: "41%", label: "Of bookings now direct" },
    { value: "9yr", label: "Open in Phoenix since 2016" },
  ],
  services: {
    kicker: "Stay With Us",
    headline: "From a one-night stay to your next local trip",
    sub: "Every booking runs on real-time room availability, whether you book direct online or call the front desk.",
    moreLabel: "Also at the hotel",
    items: [
      {
        icon: "hotel",
        title: "Standard & Deluxe Rooms",
        body: "32 individually designed rooms across two categories, all with local art, a stocked minibar, and a rainfall shower.",
        price: "from $219/night",
        image: IMG,
        imageAlt: "Deluxe room interior at Hotel Erken",
      },
      {
        icon: "shield",
        title: "Best-Rate Guarantee",
        body: "Find our room cheaper on an OTA and we'll match it, plus give you a room upgrade if one's available.",
        price: "included",
      },
      {
        icon: "map",
        title: "Local Experience Packages",
        body: "Curated add-ons — a desert hike, a chef's table dinner, a spa evening — booked alongside your room, not upsold at check-in.",
        price: "from $89",
      },
      {
        icon: "clock",
        title: "Late Checkout & Early Check-In",
        body: "Flexible timing for direct bookers, subject to availability, arranged before you even arrive.",
        price: "$0–$45",
      },
      {
        icon: "users",
        title: "Small Event & Meeting Space",
        body: "A rooftop space for private dinners, small weddings, and corporate meetings for up to 60 guests.",
        price: "custom quote",
      },
      {
        icon: "calendar",
        title: "Extended-Stay Rates",
        body: "Weekly and monthly discounted rates for guests staying 7 nights or more, with kitchenette rooms available.",
        price: "from $1,290/wk",
      },
    ],
  },
  about: {
    kicker: "The hotel",
    headline: "A boutique property, not a franchise script",
    paragraphs: [
      "Hotel Erken opened in 2016 with 32 rooms and a promise: guests booking direct get the best rate, not the worst one. Today we still run all 32 rooms ourselves, no franchise handbook, no call-center front desk.",
      "A pre-arrival sequence covers transfers, local recommendations, and upgrade offers before you walk in, our availability calendar shows real rooms in real time, and our front desk answers every inquiry — even the one at 2am from a guest deciding between us and a listing on Booking.com.",
    ],
    bullets: [
      "Independently owned — every guest gets a real answer, not a script",
      "Best-rate guarantee on every direct booking",
      "24/7 front desk, no automated call center",
      "Past-guest reactivation when it's time for their next trip",
    ],
    image: IMG,
    imageAlt: "Hotel Erken lobby and front desk",
  },
  steps: {
    kicker: "How it works",
    headline: "Three steps to your best rate",
    sub: "No OTA account, no third-party markup baked in.",
    items: [
      {
        title: "Check availability and book",
        body: "See real room availability and book directly — our AI assistant handles it any hour if you'd rather message than click.",
      },
      {
        title: "Get your pre-arrival details",
        body: "Transfer options, local recommendations, and any upgrade offers land in your inbox before you arrive.",
      },
      {
        title: "Check in and settle in",
        body: "A real front desk, day or night, and a follow-up message after checkout to see how the stay went.",
      },
    ],
  },
  testimonials: {
    kicker: "Guests",
    headline: "People who stopped booking through the middleman",
    items: [
      {
        quote:
          "I was comparing rates at midnight and messaged the hotel directly on a whim. The AI assistant matched the OTA rate and threw in a room upgrade.",
        name: "Odalys F.",
        role: "Direct booker, business trip",
      },
      {
        quote:
          "Got a text before arrival with a great taco spot two blocks away. Small thing, but it made the stay feel personal.",
        name: "Grant P.",
        role: "Repeat guest",
      },
      {
        quote:
          "Extended my stay from 3 nights to 10 mid-trip and the front desk handled it in two minutes on the phone, no OTA modification fee.",
        name: "Simone K.",
        role: "Extended-stay guest",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before booking direct",
    items: [
      {
        q: "Is booking direct actually cheaper?",
        a: "Yes — our best-rate guarantee means our direct rate matches or beats any OTA listing, and we can offer perks like upgrades that OTA bookings don't qualify for.",
      },
      {
        q: "What if I need to change my dates after booking?",
        a: "Direct bookings can be modified by calling or messaging the front desk directly — no OTA modification fee or hold time.",
      },
      {
        q: "Do you offer airport transfers?",
        a: "Yes, arranged as part of your pre-arrival sequence — just let us know your flight details after booking.",
      },
      {
        q: "Is there parking on site?",
        a: "Yes, self-parking is included for all direct bookings; valet is available for an additional fee.",
      },
      {
        q: "Can I host a small event at the hotel?",
        a: "Yes — our rooftop space accommodates up to 60 guests for private dinners, small weddings, and corporate meetings.",
      },
    ],
  },
  booking: {
    kicker: "Book direct",
    headline: "Book your stay direct — see real room availability",
    sub: "Grab an open date below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email confirmation. Prefer to talk now? Use the voice assistant.",
    // Reuses the SAME shared demo GHL calendar as flight-schools and
    // skydiving (no dedicated Hotel Erken calendar exists yet) — good
    // enough for a click-through pilot, flagged for Shamil to swap for a
    // real/distinct calendar before this pattern replicates further.
    calendarId: "SS2V1nuWEIbOlNrzyxpt",
  },
  cta: {
    headline: "Your room rate just got better.",
    sub: "One direct booking tells you more than a year of OTA markups.",
    buttonLabel: "Book direct",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "boutique hotel",
      demo_business: "Hotel Erken",
      demo_context:
        "Caller is on the Hotel Erken demo site (a fictional boutique hotel demo by Erken Systems, positioned in Phoenix, AZ). Play the hotel's AI front desk: answer questions about room types, the best-rate guarantee, local experience packages, and event space, and offer to book a stay direct.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "A 32-room independently owned boutique hotel in central Phoenix, AZ since 2016.",
  },
};

export default hotel;
