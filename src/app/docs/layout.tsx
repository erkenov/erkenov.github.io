import type { Metadata } from "next";
import { DocsHeader, DocsFooter } from "./components";

/**
 * /docs layout — LOCAL-ONLY review draft (2026-08-22). Docs-local chrome
 * (header/footer, no industry links), same pattern as /fly-home.
 *
 * noindex on the whole /docs tree: review draft, not meant to be crawled
 * yet. The robots value set here is inherited by /docs and every article
 * page (neither overrides it).
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
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
