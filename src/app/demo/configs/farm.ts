/**
 * Farms & agritourism — Erken Family Farm (fictional).
 * See ../config.ts for the DemoConfig shape and the flight-schools
 * flagship this pattern was copied from.
 */

import type { DemoConfig } from "../config";

const IMG = "/industries/card-farming-photo.jpg";

const farm: DemoConfig = {
  slug: "farm",
  industryLabel: "family farm and agritourism operation",
  business: {
    name: "Erken Family Farm",
    short: "Erken Farm",
    tagline: "Visit the farm, join the CSA",
    location: "14200 N Farm Rd · Queen Creek, AZ",
    phoneDisplay: "(325) 241-1187",
    hours: "Farm stand Wed–Sun 9am–5pm",
    icon: "sprout",
  },
  meta: {
    title: "Erken Family Farm — CSA Boxes, Farm Tours & U-Pick in Queen Creek | Demo by Erken Systems",
    description:
      "Weekly CSA boxes, farm tours, and seasonal u-pick events on a family farm in Queen Creek, AZ. Demo website by Erken Systems.",
  },
  theme: {
    bg: "#100D07",
    surface: "#1B1710",
    surface2: "#15120C",
    border: "#2E2818",
    borderStrong: "#493F26",
    text: "#F6F1E7",
    textMuted: "#BAAC8E",
    textDim: "#80735A",
    accent: "#C99A2E",
    accentHover: "#DBAC3F",
    accentSoft: "rgba(201, 154, 46, 0.14)",
    accentText: "#0B0F15",
    dark: "#0B0906",
    darkText: "#F6F1E7",
    darkMuted: "#AB9C7E",
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
    kicker: "Queen Creek, AZ · Family owned since 1998",
    headline: "Fresh from the field, straight to your porch.",
    headlineAccent: "straight to your porch",
    sub: "Weekly CSA boxes, guided farm tours, and seasonal u-pick events on 40 acres outside Phoenix. Book a visit or join the box list — both take under a minute.",
    image: IMG,
    imageAlt: "Farm rows with produce ready for harvest at Erken Family Farm",
    primaryCta: "Book a farm visit",
    secondaryCta: "Ask our AI front desk",
    badge: "Certified Naturally Grown · Est. 1998",
  },
  mission: {
    kicker: "Why we farm",
    statement:
      "Answer the tour or CSA inquiry from the field, with no signal, without losing the sign-up to a missed call.",
    statementAccent: "without losing the sign-up to a missed call",
    sub: "Fresh produce, honest growing practices, and a farm that answers even when we're elbow-deep in the greenhouse.",
    values: ["Naturally grown", "Family run", "Seasonal honesty", "Community first"],
  },
  stats: [
    { value: "480+", label: "Active CSA members" },
    { value: "40", label: "Acres in production" },
    { value: "26yr", label: "Farming Queen Creek since 1998" },
    { value: "9", label: "U-pick and harvest events a year" },
  ],
  services: {
    kicker: "Visit & Subscribe",
    headline: "From a Saturday visit to a weekly box on your porch",
    sub: "Every visit and subscription runs on a real seasonal calendar, not a guess about what's ripe this week.",
    moreLabel: "Also at the farm",
    items: [
      {
        icon: "sprout",
        title: "Weekly CSA Box",
        body: "A seasonal mix of whatever's ripe that week, picked the morning of pickup or delivery. Pause or skip any week from your account.",
        price: "$38/week",
        image: IMG,
        imageAlt: "Freshly harvested CSA box from Erken Family Farm",
      },
      {
        icon: "map",
        title: "Guided Farm Tours",
        body: "A 90-minute walking tour of the fields, greenhouse, and animals, ending with a tasting from that week's harvest.",
        price: "$18/person",
      },
      {
        icon: "calendar",
        title: "Seasonal U-Pick",
        body: "Strawberries in spring, tomatoes in summer, pumpkins in fall — pick your own at farm-stand prices during open windows.",
        price: "varies by season",
      },
      {
        icon: "users",
        title: "School & Group Field Trips",
        body: "Educational visits for school groups covering where food comes from, with hands-on planting and harvesting activities.",
        price: "$12/student",
      },
      {
        icon: "shield",
        title: "Farm-to-Table Dinners",
        body: "Monthly outdoor dinners in the field featuring a local chef cooking that week's harvest, seated at long communal tables.",
        price: "$85/person",
      },
      {
        icon: "clock",
        title: "Wholesale & Restaurant Accounts",
        body: "Weekly wholesale delivery for local restaurants and markets, with a standing order system and seasonal availability sheets.",
        price: "custom pricing",
      },
    ],
  },
  about: {
    kicker: "The farm",
    headline: "A farm run by the family that owns it, not a co-op sign",
    paragraphs: [
      "Erken Family Farm has grown produce in Queen Creek since 1998, starting with two acres and a farm stand by the road. Today we farm 40 acres and ship CSA boxes across the valley — and it's still the same family running it.",
      "Every box is picked the morning it goes out, our tour and CSA calendar lives online so you always see real availability, and our front desk answers every call — even when we're out in the greenhouse with no signal on us.",
    ],
    bullets: [
      "Certified Naturally Grown — no synthetic pesticides",
      "CSA boxes picked the morning of pickup or delivery",
      "Family-owned and operated for three generations",
      "Transparent seasonal calendar — no guessing what's in season",
    ],
    image: IMG,
    imageAlt: "Farmer walking through rows of crops at Erken Family Farm",
  },
  steps: {
    kicker: "How it starts",
    headline: "Three steps to your first box or visit",
    sub: "No paperwork marathon, no minimum commitment to try it.",
    items: [
      {
        title: "Book a visit or join the box list",
        body: "Sign up online or call — our AI assistant answers even when we're out in the field and books your tour or first CSA delivery.",
      },
      {
        title: "Get your first delivery or visit",
        body: "Your first CSA box arrives with a card explaining what's in it and how to use anything unfamiliar. Tours start with a welcome at the farm stand.",
      },
      {
        title: "Settle into the rhythm",
        body: "Weekly box updates land automatically so you always know what's coming, and seasonal event announcements go out the moment a window opens.",
      },
    ],
  },
  testimonials: {
    kicker: "Members & visitors",
    headline: "People who now plan meals around the harvest",
    items: [
      {
        quote:
          "I called about joining the CSA while they were mid-harvest. The AI assistant signed me up right there and my first box showed up two days later.",
        name: "Renata H.",
        role: "CSA member since 2024",
      },
      {
        quote:
          "Brought my daughter's class for a field trip and every kid left knowing where a tomato actually comes from.",
        name: "Coach Williams",
        role: "Local elementary teacher",
      },
      {
        quote:
          "The u-pick strawberry announcement hit my inbox the morning the field opened. Beat the weekend crowd by getting there Thursday.",
        name: "Tobias N.",
        role: "Repeat u-pick visitor",
      },
    ],
  },
  faq: {
    kicker: "Questions",
    headline: "What everyone asks before their first box or visit",
    items: [
      {
        q: "Can I pause my CSA box?",
        a: "Yes, pause or skip any week from your account up to 48 hours before pickup. No penalty, no phone call needed.",
      },
      {
        q: "What comes in a typical box?",
        a: "Whatever's ripe that week — expect 6 to 9 items ranging from leafy greens and tomatoes to seasonal fruit and herbs. We include a card explaining anything less common.",
      },
      {
        q: "Do I need to book a tour in advance?",
        a: "Yes, tours run on a fixed schedule to keep group sizes small. Book at least 48 hours ahead, though weekday slots sometimes have same-week openings.",
      },
      {
        q: "How do u-pick events work?",
        a: "We announce each opening window (strawberries, tomatoes, pumpkins) to our list the day the field is ready. You pay by weight at the farm stand.",
      },
      {
        q: "Is the farm pet-friendly?",
        a: "Leashed dogs are welcome on tours and at the farm stand, but not in u-pick fields to protect the crops.",
      },
    ],
  },
  booking: {
    kicker: "Visit the farm",
    headline: "Book a tour or start your CSA box — pick a real date",
    sub: "Grab an open slot below and you're confirmed instantly. Prefer a call instead? Use the callback button up top.",
    note: "Confirmed instantly — you'll get a text and email with details. Prefer to talk now? Use the voice assistant.",
  },
  cta: {
    headline: "This week's harvest is coming in.",
    sub: "One box or one visit tells you more than a year of grocery-store produce.",
    buttonLabel: "Book your visit",
  },
  voice: {
    enabled: true,
    buttonLabel: "Ask our AI front desk",
    dynamicVariables: {
      demo_industry: "family farm and agritourism operation",
      demo_business: "Erken Family Farm",
      demo_context:
        "Caller is on the Erken Family Farm demo site (a fictional family farm demo by Erken Systems, positioned in Queen Creek, AZ). Play the farm's AI front desk: answer questions about the weekly CSA box, guided farm tours, seasonal u-pick, and group visits, and offer to book a tour or start a CSA subscription.",
    },
  },
  chat: { enabled: true },
  footer: {
    blurb:
      "Weekly CSA boxes, guided farm tours, and seasonal u-pick events on a family farm in Queen Creek, AZ since 1998.",
  },
};

export default farm;
