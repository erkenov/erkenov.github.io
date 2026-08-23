/**
 * Docs-local chrome for the /docs portal (public since 2026-08-22).
 * Mirrors the fly-home pattern: self-contained header/footer with NO
 * industry links, cream/sage palette, mono-label kickers, rounded-2xl
 * surface cards. DocVideo replicates the VideoSlot pattern from
 * src/components/ProductSections.tsx — deliberately copied, NOT imported,
 * so the shared component stays untouched.
 */

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarCheck,
  Compass,
  CreditCard,
  Megaphone,
  MessagesSquare,
  PhoneCall,
  PhoneMissed,
  Play,
  Receipt,
  Star,
  Users,
  Zap,
} from "lucide-react";
import type { DocCategory } from "./docs-data";

/* Phone constants removed 2026-08-23 (Shamil): no public phone numbers in
   the docs — contact is gated to paying customers via the portal. */

/* ---- Category icon map (ids defined in docs-data.ts). ---- */
export function CategoryIcon({
  icon,
  className,
}: {
  icon: DocCategory["icon"];
  className?: string;
}) {
  const cls = className ?? "h-5 w-5";
  switch (icon) {
    case "compass":
      return <Compass className={cls} />;
    case "phone-call":
      return <PhoneCall className={cls} />;
    case "messages":
      return <MessagesSquare className={cls} />;
    case "calendar-check":
      return <CalendarCheck className={cls} />;
    case "phone-missed":
      return <PhoneMissed className={cls} />;
    case "zap":
      return <Zap className={cls} />;
    case "users":
      return <Users className={cls} />;
    case "star":
      return <Star className={cls} />;
    case "megaphone":
      return <Megaphone className={cls} />;
    case "credit-card":
      return <CreditCard className={cls} />;
    case "bar-chart":
      return <BarChart3 className={cls} />;
    case "receipt":
      return <Receipt className={cls} />;
  }
}

/* ---- Local header — same shape as FlyHomeHeader, links only to /docs
        and /fly-home. ---- */
export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/docs"
            className="font-mono text-sm font-medium uppercase tracking-tight text-text"
          >
            erken<span className="text-accent"> </span>systems
            <span className="ml-2 hidden text-xs normal-case text-text-dim sm:inline">
              · docs
            </span>
          </Link>
          <Link
            href="/"
            className="hidden items-center gap-1.5 font-mono text-xs text-text-muted transition-colors hover:text-text sm:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the site
          </Link>
        </div>
        {/* Contact removed from the docs chrome 2026-08-23 (Shamil): no
            public phone number, no "call us" — reaching him is gated to
            paying customers via the portal, not open to every visitor. */}
      </div>
    </header>
  );
}

/* ---- Local footer — no industry links. ---- */
export function DocsFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-8">
        <div>
          <p className="font-mono text-sm font-medium uppercase tracking-tight text-text">
            erken<span className="text-accent"> </span>systems
            <span className="ml-2 text-xs normal-case text-text-dim">
              · platform docs for flight schools
            </span>
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Can&apos;t find it in these docs? If you&apos;re a customer,
            message us from your portal — we already know your setup.
          </p>
        </div>
        <div className="flex items-center gap-5 font-mono text-xs text-text-dim">
          <Link href="/docs" className="transition-colors hover:text-text">
            All articles
          </Link>
          <Link href="/" className="transition-colors hover:text-text">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ---- DocVideo — the house "Video coming — {label}" placeholder, copied
        from ProductSections' VideoSlot (light theme). The shared component
        is intentionally NOT imported/modified. ---- */
export function DocVideo({ label }: { label: string }) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 transition group-hover:bg-amber-400/20">
          <Play className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
          Video coming — {label}
        </p>
      </div>
    </div>
  );
}

/* ---- "Stuck?" footer line for the end of every article. 2026-08-23
        (Shamil): no public phone number — contact is gated to paying
        customers through the portal. ---- */
export function StuckCallout() {
  return (
    <div className="mt-14 rounded-2xl border border-border bg-surface p-6">
      <p className="mono-label">Stuck?</p>
      <p className="mt-2 text-base text-text-muted">
        Docs cover the platform. For anything about YOUR account, message us
        from your portal — a person reads it, and we already know your setup.
      </p>
    </div>
  );
}
