import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DOC_ARTICLES, getArticle, getCategory } from "../docs-data";
import { DocVideo, StuckCallout } from "../components";

/**
 * /docs/[slug] — the single article template for the docs portal
 * (LOCAL-ONLY review draft, 2026-08-22). Driven entirely by
 * ../docs-data.ts: title → video placeholder → intro → numbered steps →
 * "Stuck? Call us". noindex inherited from ../layout.tsx.
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
    title: `${article.title} — Erken Systems Docs (Internal Review)`,
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

  return (
    <article className="px-6 py-14 md:px-12 md:py-20">
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

        <StuckCallout />
      </div>
    </article>
  );
}
