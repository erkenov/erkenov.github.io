/**
 * Motorcycle shops — Erken Moto Rides & Repair (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-motorcycle-photo.jpg";

const motorcycle: DemoConfig = {
  slug: "motorcycle",
  industryLabel: "motorcycle shop and tour operator",
  business: {
    name: "Erken Moto Rides & Repair",
    short: "Erken Moto",
    tagline: "Ride, tour, repair",
    location: "2210 N Scottsdale Rd · Scottsdale, AZ",
    phoneDisplay: "(325) 241-6674",
    hours: "Tue–Sun 8am–6pm · Mon closed",
    icon: "bike",
  },
  meta: {
    title: "Erken Moto Rides & Repair — Tours, Rentals & Riding Courses in Scottsdale | Demo by Erken Systems",
    description:
      "Guided desert tours, rentals, riding courses, and full-service repair out of Scottsdale, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#100C0A",
    surface: "#1B1512",
    surface2: "#150F0D",
    border: "#2E241D",
    borderStrong: "#493A2E",
    text: "#F6F0E9",
    textMuted: "#B8A996",
    textDim: "#7E7061",
    accent: "#C9581F",
    accentHover: "#DA6C31",
    accentSoft: "rgba(201, 88, 31, 0.14)",
    accentText: "#0B0F15",
    dark: "#0B0807",
    darkText: "#F6F0E9",
    darkMuted: "#AA9A87",
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
    kicker: "Scottsdale, AZ · Sonoran Desert routes",
    headline: "Ride the desert on two wheels, today.",
    headlineAccent: "today",
    sub: "Guided tours, rentals, riding courses, and full-service repair — one shop, whether you're visiting for a week or riding here every weekend.",
    image: IMG,
    imageAlt: "Rider on a motorcycle on a desert road outside Scottsdale",
    primaryCta: "Book a tour or rental",
    secondaryCta: "Ask our AI front desk",
    badge: "MSF Certified Instructors · Est. 2015",
  },
  mission: {
    kicker: "Why we ride",
    statement:
      "Answer the traveler messaging at 2am about tomorrow's tour before they book somewhere else.",
    statementAccent: "before they book somewhere else",
    sub: "Same-day rentals, real-time tour availability, and instructors who actually ride.",
    values: ["Real availability", "No hidden fees", "Safety first", "Local routes"],
  },
  stats: [
    { value: "3,100+", label: "Guided tours run since 2015" },
    { value: "22", label: "Bikes in the rental fleet" },
    { value: "96%", label: "5-star tour reviews" },
    { value: "300+", label: "Rideable days a year in Scottsdale" },
  ],
  services: {
    kicker: "Rides & Services",
    headline: "From a first rental to your own gear",
    sub: "Every tour and rental runs on real-time availability and instructors who know the desert routes cold.",
    moreLabel: "Also at the shop",
    items: [
      {
        icon: "map",
        title: "Guided Desert Tours",
        body: "Half-day and full-day guided rides through the Sonoran Desert, led by a local guide on routes graded by skill level.",
        price: "from $189",
        image: IMG,
        imageAlt: "Guided motorcycle tour group riding through the desert",
      },
      {
        icon: "key",
        title: "Motorcycle Rentals",
        body: "Cruisers, adventure bikes, and sport bikes by the day or the week. Full gear included, no deposit hassle at pickup.",
        price: "from $99/day",
      },
      {
        icon: "graduation",
        title: "Riding Courses",
        body: "MSF-certified beginner and intermediate courses, licensing prep, and a track day clinic for experienced riders.",
        price: "from $325",
      },
      {
        icon: "wrench",
        title: "Repair & Custom Work",
        body: "Full-service repair, tire changes, and custom builds for owners who ride here year-round.",
        price: "from $79",
      },
      {
        icon: "users",
        title: "Group & Corporate Tours",
        body: "Bachelor parties and corporate offsites on two wheels — we block-book the fleet and route for groups of 6+.",
        price: "custom quote",
      },
      {
        icon: "shield",
        title: "Gear Rental",
        body: "Helmets, jackets, and riding boots in every size, sanitized and inspected between every renter.",
        price: "$25/day",
      },
    ],
  },
  about: {
    kicker: "The shop",
    headline: "Run by riders, not a rental counter",
    paragraphs: [
      "Erken Moto opened in 2015 with three bikes and a promise: every tour runs on the routes we actually ride ourselves. Today we run a 22-bike fleet and a full instructor team out of Scottsdale — and the promise still holds.",
      "Your guide knows the route before you throw a leg over the bike, our booking calendar shows real availability, and our front desk answers every call — even the tourist messaging from a different time zone at odd hours.",
    ],
    bullets: [
      "MSF-certified instructors and guides",
      "Full gear included with every rental and tour",
      "Same-day pickup with online scheduling",
      "In-house repair bay for fleet and customer bikes alike",
    ],
    image: IMG,
    imageAlt: "Motorcycles lined up outside Erken Moto Rides & Repair",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first ride",
    sub: "Book online, gear up, ride. No paperwork marathon.",
    items: [
      {
        title: "Book your tour or rental",
        body: "Pick a slot online or call — our AI front desk answers 24/7, even for travelers booking from overseas.",
      },
      {
        title: "Gear up and brief",
        body: "A 15-minute safety briefing and gear fitting before you or your group heads out.",
      },
      {
        title: "Ride and return",
        body: "Guided tours end with a debrief and photos; rentals return with a quick walkaround and you're done.",
      },
    ],
  },
  testimonials: {
    kicker: "Riders",
    headline: "People who booked from a different time zone",
    items: [
      {
        quote:
          "I messaged at midnight my time about a tour the next morning. The AI assistant confirmed availability, took the deposit, and I had my confirmation before I fell asleep.",
        name: "Tobias H.",
        role: "Tourist, guided desert tour",
      },
      {
        quote:
          "Rented for a week and the pickup took ten minutes. Gear fit right, bike was spotless, no upsell pressure.",
        name: "Priya D.",
        role: "Weekly rental customer",
      },
      {
        quote:
          "Took the beginner course nervous and left with a license plan and an instructor who actually made it fun.",
        name: "Sam W.",
        role: "MSF course graduate",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first tour",
    items: [
      {
        q: "Do I need my own motorcycle license?",
        a: "Yes, for rentals and tours you need a valid motorcycle license or endorsement from home. Our riding courses are for licensing, not for renting a bike the same day.",
      },
      {
        q: "What's included in a rental?",
        a: "Every rental includes a helmet, jacket, and gloves, plus basic insurance. Boots and additional gear rent separately.",
      },
      {
        q: "How far in advance should I book a tour?",
        a: "Popular tour times fill up a few days ahead in peak season (October–April). Same-day booking is often available in summer.",
      },
      {
        q: "What if I've never ridden in the desert before?",
        a: "Our guides grade every tour by skill level and will match you to an easier route if this is your first desert ride.",
      },
      {
        q: "Can I bring my own bike in for repair while I'm visiting?",
        a: "Yes — walk-ins are welcome for quick repairs, and we can schedule bigger jobs around your travel dates.",
      },
    ],
  },
  booking: {
    kicker: "Book a ride",
    headline: "Book your tour or rental — pick a real time slot",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with pickup details. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The desert is a short ride away.",
    sub: "One guided tour tells you more than a year of watching other people's ride videos.",
    buttonLabel: "Book your tour or rental",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "motorcycle shop and tour operator",
      demo_business: "Erken Moto Rides & Repair",
      demo_context:
        "Caller is on the Erken Moto Rides & Repair demo site (a fictional motorcycle tour, rental, and repair shop demo by Erken Systems, positioned in Scottsdale, AZ). Play the shop's AI front desk: answer questions about guided desert tours, rentals, riding courses, and repair, and offer to book a tour or rental slot.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Guided desert tours, rentals, riding courses, and full-service repair out of Scottsdale, AZ since 2015.",
  },
};

export default motorcycle;
