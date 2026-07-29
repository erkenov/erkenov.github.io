/**
 * /demo/[industry] — per-industry demo-website template.
 *
 * Each route is a complete fictional local-business site driven entirely
 * by its DemoConfig entry in ../config.ts. Static params come from the
 * registry; unknown slugs 404.
 *
 * DEMO PLACEHOLDER DATA: every business shown is fictional; all stats,
 * reviews, names, and prices are invented.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allDemoSlugs, getDemoConfig } from "../config";
import DemoPageClient from "./DemoPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return allDemoSlugs().map((industry) => ({ industry }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const config = getDemoConfig((await params).industry);
  if (!config) return {};
  return {
    title: config.meta.title,
    description: config.meta.description,
    robots: { index: false, follow: false }, // demo pages — keep out of search
  };
}

export default async function DemoIndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const config = getDemoConfig((await params).industry);
  if (!config) notFound();

  return (
    <>
      {/* Real HTML comment in the served page marking the demo data. */}
      <div
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html: `<!-- DEMO PLACEHOLDER DATA: ${config.business.name} is a fictional demo business by Erken Systems. All statistics, reviews, names, prices, and history on this page are invented placeholder content. -->`,
        }}
      />
      <DemoPageClient config={config} />
    </>
  );
}
