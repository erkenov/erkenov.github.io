import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DOC_CATEGORIES, articlesInCategory } from "./docs-data";
import { CategoryIcon } from "./components";

/**
 * /docs — index of the Erken Systems docs portal for flight schools
 * (public since 2026-08-22, ordered by Shamil after
 * docs.flightschoolcrm.com). Category cards, each listing its articles;
 * the full tree also lives in the left sidebar from ./layout.tsx.
 * Indexable (robots set in ./layout.tsx).
 */
export const metadata: Metadata = {
  title: "Platform Docs for Flight Schools — Erken Systems",
  description:
    "Documentation for flight school owners on The Receptionist platform: bookings, missed-call callbacks, reviews, campaigns, payments, reporting, and billing.",
};

export default function DocsIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 lg:py-14">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative z-10">
          <div className="mono-label">Platform docs</div>
          <h1
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Run your school on the platform — here&apos;s how everything works.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted xl:text-lg">
            Straight answers for flight school owners: how discovery flights
            get booked, what happens when a call is missed, where reviews come
            from, and what your $97 buys. Every article is short, exact, and
            written for your school — not a generic CRM manual.
          </p>
        </div>
      </section>

      {/* Category cards */}
      <section className="pb-16 lg:pb-20">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {DOC_CATEGORIES.map((cat) => {
            const articles = articlesInCategory(cat.id);
            return (
              <div
                key={cat.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-accent">
                  <CategoryIcon icon={cat.icon} />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-text">
                  {cat.name}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {cat.tagline}
                </p>
                <ul className="mt-5 flex-1 space-y-3 border-t border-border/60 pt-5">
                  {articles.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/docs/${a.slug}`}
                        className="group flex items-start justify-between gap-3 text-sm font-medium text-text transition-colors hover:text-accent"
                      >
                        <span>{a.title}</span>
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                  {articles.length === 0 && (
                    <li className="text-sm text-text-dim">
                      Articles coming soon.
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
