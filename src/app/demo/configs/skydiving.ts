/**
 * Skydiving — Sky Erken Skydiving (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-skydiving-photo.jpg";

const skydiving: DemoConfig = {
  slug: "skydiving",
  industryLabel: "skydiving dropzone",
  business: {
    name: "Sky Erken Skydiving",
    short: "Sky Erken",
    tagline: "Jump over the desert",
    location: "Eloy Municipal Airport (E60) · Eloy, AZ",
    phoneDisplay: "(325) 241-8821",
    hours: "Loads run Thu–Sun, weather permitting",
    icon: "wind",
  },
  meta: {
    title: "Sky Erken Skydiving — Tandem Jumps & AFF Courses in Eloy, AZ | Demo by Erken Systems",
    description:
      "Tandem jumps, AFF licensing, and experienced-jumper load space out of Eloy Municipal Airport, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#0B1420",
    surface: "#111D2C",
    surface2: "#0D1826",
    border: "#1E2F42",
    borderStrong: "#2D465F",
    text: "#EFF5FA",
    textMuted: "#9FB2C4",
    textDim: "#66798D",
    accent: "#E8622C",
    accentHover: "#F2794A",
    accentSoft: "rgba(232, 98, 44, 0.14)",
    accentText: "#0B0F15",
    dark: "#070E16",
    darkText: "#F2F7FB",
    darkMuted: "#8CA0B4",
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
    kicker: "Eloy Municipal Airport · Eloy, AZ",
    headline: "Freefall over the desert at 120 miles an hour.",
    headlineAccent: "120 miles an hour",
    sub: "Tandem jumps from 13,000 feet, AFF licensing, and experienced-jumper load space, seven miles from Phoenix. No experience required for your first jump.",
    image: IMG,
    imageAlt: "Tandem skydiving pair in freefall over the Arizona desert",
    primaryCta: "Book a tandem jump",
    secondaryCta: "Ask our AI front desk",
    badge: "USPA Member Dropzone · Est. 2009",
  },
  mission: {
    kicker: "Why we jump",
    statement:
      "Run the safest, most on-time load schedule in the state — so your one shot at this doesn't get lost to a scrubbed morning.",
    statementAccent: "your one shot at this",
    sub: "300+ jumpable days a year in the Arizona sun. We fly loads, not excuses.",
    values: ["Safety", "On-time loads", "Straight answers", "No pressure"],
  },
  stats: [
    { value: "41,000+", label: "Jumps logged since 2009" },
    { value: "6", label: "Tandem instructors on staff" },
    { value: "13,000ft", label: "Standard jump altitude" },
    { value: "300+", label: "Jumpable days a year in Eloy" },
  ],
  services: {
    kicker: "Programs",
    headline: "From your first jump to your own gear",
    sub: "Every jump runs on a real weather call, a real manifest, and instructors who've done this thousands of times.",
    moreLabel: "Also at the dropzone",
    items: [
      {
        icon: "wind",
        title: "Tandem Jump",
        body: "Strapped to an instructor with 1,000+ jumps, you freefall for 60 seconds from 13,000 feet before a 5-minute canopy ride back down. No experience or training required.",
        price: "$229",
        image: IMG,
        imageAlt: "Tandem instructor and student in freefall",
      },
      {
        icon: "graduation",
        title: "AFF Licensing Course",
        body: "Accelerated Freefall — the fastest path to jumping solo. Seven levels of coached freefall, ground school, and ratings review, most students license inside 3–6 months.",
        price: "from $2,400",
      },
      {
        icon: "shield",
        title: "Gear Rental & Check",
        body: "Rig, altimeter, and jumpsuit rental for licensed jumpers, plus a pre-jump gear inspection from a certified rigger every time you fly.",
        price: "$45/jump",
      },
      {
        icon: "calendar",
        title: "Load Space (Experienced)",
        body: "Licensed jumpers buy load space same-day or reserve ahead online. Group discounts on 10-jump and 25-jump punch cards.",
        price: "$32/load",
      },
      {
        icon: "users",
        title: "Group & Event Jumps",
        body: "Bachelor parties, birthdays, and corporate team days. We block-book the load and handle manifest for groups of 6 or more.",
        price: "custom quote",
      },
      {
        icon: "radio",
        title: "Video & Photo Package",
        body: "A second jumper flies alongside with a helmet cam, or your instructor wears one. Edited footage delivered same day.",
        price: "$129",
      },
    ],
  },
  about: {
    kicker: "The dropzone",
    headline: "A dropzone run by jumpers, not a ticket counter",
    paragraphs: [
      "Sky Erken opened in 2009 with one Cessna 182 and a promise: loads fly on time or you know exactly why. Today we run a turbine aircraft and a full tandem and AFF instructor team out of Eloy — and the promise still holds.",
      "Your instructor briefs you personally before every jump, our manifest board is live online, and our front desk answers every call — even the ones asking whether Saturday's forecast is holding.",
    ],
    bullets: [
      "USPA-rated instructors — average 4,200 jumps each",
      "Turbine aircraft, 20-minute ride to altitude",
      "Live weather-call updates texted straight to your phone",
      "Fixed tandem pricing — no surprise add-ons at check-in",
    ],
    image: IMG,
    imageAlt: "Jumpers preparing gear before boarding at Sky Erken Skydiving",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first freefall",
    sub: "No sales pitch, no waiting all day. Book, jump, land.",
    items: [
      {
        title: "Book your slot",
        body: "Pick a load time online or call — our AI front desk answers 24/7 and checks the weight limit and morning weather call with you.",
      },
      {
        title: "Suit up and board",
        body: "A 20-minute ground briefing, gear-up with your instructor, and a scenic 20-minute ride to altitude in the plane.",
      },
      {
        title: "Jump and land smiling",
        body: "60 seconds of freefall, a 5-minute canopy ride, and a debrief with your instructor the second your feet hit the ground.",
      },
    ],
  },
  testimonials: {
    kicker: "First-time jumpers",
    headline: "People who were terrified right up until they jumped",
    items: [
      {
        quote:
          "I called at 11pm the night before, sure I'd get voicemail. The AI receptionist booked me into the 9am load, texted the weight requirements, and my instructor knew my name at check-in.",
        name: "Jordan K.",
        role: "First tandem jump, 2025",
      },
      {
        quote:
          "Weather scrubbed my first attempt. I got a text with three rebooking slots before I'd even left the parking lot — no calling around, no losing my deposit.",
        name: "Alicia M.",
        role: "Tandem jumper",
      },
      {
        quote:
          "Started my AFF course not knowing anyone. The board makes it obvious what level I'm on and what's next — no guessing where I stand.",
        name: "Devon P.",
        role: "AFF student, Level 4",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first jump",
    items: [
      {
        q: "Is there a weight or age limit?",
        a: "Tandem jumpers must be 18+ and generally under 230 lbs (check with us above that — some instructors can accommodate more with a surcharge). There's no upper age limit as long as you can complete a basic health questionnaire.",
      },
      {
        q: "What if the weather cancels my jump?",
        a: "You'll get a text as soon as the morning weather call is made, with open rebooking slots already checked against your availability. Weather scrubs never cost you your deposit.",
      },
      {
        q: "Do I need any training for a tandem jump?",
        a: "No. A 20-minute ground briefing covers body position and landing — your instructor handles the rest, including opening the parachute.",
      },
      {
        q: "How long does the whole thing take?",
        a: "Plan on 2–3 hours at the dropzone: check-in, gear, briefing, the ride to altitude, the jump itself, and photos after. The freefall is about 60 seconds; the canopy ride down is another 5.",
      },
      {
        q: "How much does AFF licensing cost overall?",
        a: "Most students finish their A-license between $2,400 and $3,200 across all seven AFF levels, gear rental, and the exam. We track your spend against a written estimate after your first level.",
      },
    ],
  },
  booking: {
    kicker: "Book a jump",
    headline: "Book your tandem jump — pick a real load time",
    sub: "Grab an open slot below and you're on the manifest instantly. Prefer to talk first? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with weight requirements and check-in time. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "The plane leaves on schedule.",
    sub: "One jump tells you more than a lifetime of watching other people's videos.",
    buttonLabel: "Book your tandem jump",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "skydiving dropzone",
      demo_business: "Sky Erken Skydiving",
      demo_context:
        "Caller is on the Sky Erken Skydiving demo site (a fictional dropzone demo by Erken Systems, positioned in Eloy, AZ). Play the dropzone's AI front desk: answer questions about tandem jumps ($229), AFF licensing, gear rental, and group jumps, and offer to book a tandem jump slot.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Tandem jumps, AFF licensing, and experienced-jumper load space out of Eloy Municipal Airport, AZ since 2009.",
  },
};

export default skydiving;
