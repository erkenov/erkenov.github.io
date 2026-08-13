import type { Metadata } from "next";

/**
 * /trades — "See all trades by category" (Shamil 2026-08-13, Stone Systems
 * pattern): the homepage carousel shows the featured passion verticals;
 * this page lists EVERYTHING — the featured industries, the 21 archived
 * cards (restored as list entries), plus text-only trades for coverage.
 * All entries are plain text (Shamil, same day: "make them all not
 * clickable"); the href data stays in the list in case linking comes back.
 */

export const metadata: Metadata = {
  title: "Every Industry We Build For — Erken Systems",
  description:
    "AI receptionist, website, review engine, and customer campaigns — pre-configured for your industry. Flight schools to roofing, dental to yacht charters: find your trade.",
  robots: { index: true, follow: true },
};

type Trade = { name: string; href?: string };
type Category = { title: string; trades: Trade[] };

const CATEGORIES: Category[] = [
  {
    title: "Aviation & adventure",
    trades: [
      { name: "Flight schools", href: "/receptionist" },
      { name: "Skydiving", href: "/sky-erken" },
      { name: "Climbing gyms & guides", href: "/climb-erken" },
      { name: "Surf schools & camps", href: "/surf-erken" },
      { name: "Ski schools", href: "/ski-erken" },
      { name: "Yacht charters & sailing schools", href: "/yacht-erken" },
      { name: "Horse riding schools", href: "/horse-erken" },
      { name: "Shooting ranges", href: "/shoot-erken" },
    ],
  },
  {
    title: "Automotive & motorcycle",
    trades: [
      { name: "Automotive shops", href: "/auto-erken" },
      { name: "Motorcycle shops", href: "/moto-erken" },
      { name: "Auto detailing" },
      { name: "Tire shops" },
      { name: "Towing services" },
    ],
  },
  {
    title: "Fitness & martial arts",
    trades: [
      { name: "Jiu Jitsu academies", href: "/bjj-erken" },
      { name: "Gyms & boxes", href: "/gym-erken" },
      { name: "Tennis clubs & coaches", href: "/tennis-erken" },
      { name: "Personal trainers & coaches" },
      { name: "Dance studios" },
      { name: "Yoga & pilates studios" },
    ],
  },
  {
    title: "Trades & home services",
    trades: [
      { name: "Roofing contractors" },
      { name: "HVAC contractors" },
      { name: "Plumbing services" },
      { name: "Electricians" },
      { name: "Landscapers" },
      { name: "Painters" },
      { name: "Cleaning services" },
      { name: "Locksmiths" },
      { name: "Handyman services" },
      { name: "Pest control" },
      { name: "Tree services" },
      { name: "Pressure washing" },
      { name: "Solar installers" },
      { name: "Garage door repair" },
      { name: "Appliance repair" },
      { name: "Moving companies" },
    ],
  },
  {
    title: "Healthcare & wellness",
    trades: [
      { name: "Dental practices" },
      { name: "Chiropractic clinics" },
      { name: "Med spas" },
      { name: "Physical therapy" },
      { name: "Optometrists" },
      { name: "Massage therapy" },
    ],
  },
  {
    title: "Professional services",
    trades: [
      { name: "Law firms" },
      { name: "Accountants & CPAs" },
      { name: "Real estate agents" },
      { name: "Insurance agents" },
      { name: "Mortgage brokers" },
    ],
  },
  {
    title: "Beauty & personal care",
    trades: [
      { name: "Beauty salons & barbers" },
      { name: "Nail salons" },
      { name: "Tattoo studios" },
      { name: "Day spas" },
    ],
  },
  {
    title: "Pets & animals",
    trades: [
      { name: "Veterinary clinics" },
      { name: "Pet grooming & boarding" },
      { name: "Dog training" },
      { name: "Pet daycare" },
    ],
  },
  {
    title: "Hospitality & food",
    trades: [
      { name: "Boutique hotels", href: "/hotel-erken" },
      { name: "Cafes & restaurants", href: "/cafe-erken" },
      { name: "Farms & agritourism", href: "/farm-erken" },
      { name: "Bakeries" },
      { name: "Catering companies" },
      { name: "Wedding venues" },
      { name: "Campgrounds & RV parks" },
    ],
  },
  {
    title: "Creative & education",
    trades: [
      { name: "Photographers & creatives" },
      { name: "Makerspaces", href: "/make-erken" },
      { name: "Music schools" },
      { name: "Tutoring & learning centers" },
      { name: "Driving schools" },
      { name: "Language schools" },
    ],
  },
  {
    title: "Repair & custom",
    trades: [
      { name: "Electronics & repair", href: "/fix-erken" },
      { name: "Boat & marine services" },
      { name: "Bike shops" },
      { name: "Jewelers & watchmakers" },
    ],
  },
  {
    title: "And more",
    trades: [
      { name: "Window cleaning" },
      { name: "Carpet cleaning" },
      { name: "Dry cleaners" },
      { name: "Florists" },
      { name: "Sign & print shops" },
      { name: "Self-storage facilities" },
    ],
  },
];

export default function TradesPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <header className="border-b border-border/60 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <a
            href="/"
            className="font-mono text-sm font-medium tracking-tight uppercase"
          >
            erken<span className="text-accent"> </span>systems
          </a>
          <a
            href="/"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            ← Back to home
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <p className="font-mono text-xs font-medium tracking-[0.18em] text-accent uppercase">
          All trades by category
        </p>
        <h1
          className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          If your business lives on the phone, we build for it.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-text-muted md:text-lg">
          Every industry below gets the same four-part system — website, AI
          receptionist, review engine, and customer campaigns — pre-configured
          for how that trade actually works.
        </p>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h2 className="font-mono text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                {cat.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {cat.trades.map((t) => (
                  <li key={t.name}>
                    <span className="text-[15px] text-text-muted">
                      {t.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-border bg-surface p-8 text-center md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Don't see your trade?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-text-muted">
            If your customers call, message, or book — the system fits. Tell
            us what you do and we'll show you exactly how it would run for
            your business.
          </p>
          <a
            href="/#pricing"
            className="mt-6 inline-block rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Get started →
          </a>
        </div>
      </div>
    </main>
  );
}
