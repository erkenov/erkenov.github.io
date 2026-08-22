import type { Metadata } from "next";
import { DocsHeader, DocsFooter } from "./components";

/**
 * /docs layout — LIVE since 2026-08-22 (Shamil: the homepage's "Platform
 * instructions" button links here — the docs publish with that push; the
 * SEO surface is intentional, so the tree is INDEXABLE). Docs-local chrome
 * (header/footer, no industry links), same pattern as /fly-home.
 */
export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DocsHeader />
      <main className="flex-1">{children}</main>
      <DocsFooter />
    </>
  );
}
