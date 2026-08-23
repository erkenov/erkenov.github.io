import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DOC_ARTICLES, getArticle, getCategory } from "../docs-data";
import { DocVideo, StuckCallout } from "../components";

/**
 * /docs/[slug] — the single article template for the docs portal (public
 * since 2026-08-22). Driven entirely by ../docs-data.ts: title → video
 * placeholder → intro → numbered steps → prev/next → "Stuck?" callout
 * (portal-gated contact, no public phone — Shamil 2026-08-23).
 * The left sidebar tree comes from ../layout.tsx. Indexable (robots set
 * in ../layout.tsx).
 */

export function generateStaticParams() {
  return DOC_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Erken Systems Docs`,
    description: article.blurb,
  };
}

export default async function DocArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const category = getCategory(article.category);

  const idx = DOC_ARTICLES.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? DOC_ARTICLES[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < DOC_ARTICLES.length - 1
      ? DOC_ARTICLES[idx + 1]
      : undefined;

  return (
    <article className="py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All docs
        </Link>

        {category && (
          <div className="mono-label mt-8">{category.name}</div>
        )}
        <h1
          className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          {article.title}
        </h1>

        <div className="mt-8">
          <DocVideo label={article.videoLabel} />
        </div>

        <p className="mt-8 text-base leading-relaxed text-text-muted md:text-lg">
          {article.intro}
        </p>

        <ol className="mt-10 space-y-8">
          {article.steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-sm font-medium text-accent">
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-text">
                  {step.title}
                </h2>
                <p className="mt-1.5 leading-relaxed text-text-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {article.outro && (
          <p className="mt-10 rounded-2xl border border-border bg-surface-2 p-5 leading-relaxed text-text-muted">
            {article.outro}
          </p>
        )}

        {(prev || next) && (
          <nav
            aria-label="More articles"
            className="mt-12 grid gap-3 border-t border-border/60 pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/40"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-text-dim transition-colors group-hover:text-accent" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                    Previous
                  </span>
                  <span className="block truncate text-sm font-medium text-text group-hover:text-accent">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/docs/${next.slug}`}
                className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-right transition-colors hover:border-accent/40"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                    Next
                  </span>
                  <span className="block truncate text-sm font-medium text-text group-hover:text-accent">
                    {next.title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-text-dim transition-colors group-hover:text-accent" />
              </Link>
            )}
          </nav>
        )}

        <StuckCallout />
      </div>
    </article>
  );
}
