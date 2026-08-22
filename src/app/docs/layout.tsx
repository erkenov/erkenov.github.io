import type { Metadata } from "next";
import { DocsHeader, DocsFooter } from "./components";
import { DocsSidebar } from "./sidebar";

/**
 * /docs layout — LIVE since 2026-08-22; sidebar tree layout added the same
 * day after docs.flightschoolcrm.com (Shamil: "this is how my docs should
 * look like"). The tree is INDEXABLE on purpose — the homepage's "Platform
 * instructions" button links here and the portal is public. Docs-local
 * chrome (header/footer, no industry links), left sidebar with the full
 * category/article tree (collapses to a toggle panel on mobile), content
 * column on the right.
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
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-8">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <DocsSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <DocsFooter />
    </>
  );
}
