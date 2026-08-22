"use client";

/**
 * DocsSidebar — the left-hand category/article tree for /docs, after the
 * docs.flightschoolcrm.com pattern (2026-08-22). Client component because
 * it highlights the current article (usePathname) and collapses.
 *
 * Desktop (lg+): sticky, always visible, self-scrolling.
 * Mobile: hidden behind a "Browse the docs" toggle; closes on navigation.
 * Categories are collapsible; all start expanded like the reference.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PanelLeft, X } from "lucide-react";
import { DOC_CATEGORIES, articlesInCategory } from "./docs-data";
import { CategoryIcon } from "./components";

export function DocsSidebar() {
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith("/docs/")
    ? pathname.split("/")[2]
    : null;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCategory = (id: string) =>
    setClosed((prev) => ({ ...prev, [id]: !prev[id] }));

  const nav = (
    <nav aria-label="Docs">
      <ul className="space-y-1">
        {DOC_CATEGORIES.map((cat) => {
          const articles = articlesInCategory(cat.id);
          const isClosed = !!closed[cat.id];
          const catHasActive = articles.some((a) => a.slug === activeSlug);
          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                aria-expanded={!isClosed}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface ${
                  catHasActive ? "text-text" : "text-text-muted"
                }`}
              >
                <span className="text-accent">
                  <CategoryIcon icon={cat.icon} className="h-4 w-4" />
                </span>
                <span className="flex-1">{cat.name}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-text-dim transition-transform ${
                    isClosed ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {!isClosed && (
                <ul className="mb-2 ml-4 space-y-0.5 border-l border-border/70 pl-3">
                  {articles.map((a) => {
                    const active = a.slug === activeSlug;
                    return (
                      <li key={a.slug}>
                        <Link
                          href={`/docs/${a.slug}`}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-md px-2.5 py-1.5 text-[13px] leading-snug transition-colors ${
                            active
                              ? "bg-accent/10 font-medium text-accent"
                              : "text-text-muted hover:bg-surface hover:text-text"
                          }`}
                        >
                          {a.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        className="mt-6 flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-text-muted lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <PanelLeft className="h-4 w-4 text-accent" />
          Browse the docs
        </span>
        {mobileOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Mobile panel (in-flow) */}
      {mobileOpen && (
        <div className="mt-3 rounded-2xl border border-border bg-surface p-3 lg:hidden">
          {nav}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-10 pr-4">
          <p className="mono-label px-3 pb-3">Docs</p>
          {nav}
        </div>
      </aside>
    </>
  );
}
