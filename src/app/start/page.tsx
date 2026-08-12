"use client";

/**
 * /start — the signup page. Owner-approved pricing restructure (2026-08-12,
 * same-day addendum): exactly THREE cards — the Platform as three separate
 * billing-period cards (Monthly $97 / 6 months $87/mo / Yearly $77/mo),
 * each with its own self-serve signup form that posts that card's period.
 * The Complete-system card AND the Custom-solutions card are removed
 * everywhere (their shared ContactMethods block, the ContactChooser /
 * CallbackRequestModal mounts — which nothing on this page opened anymore —
 * went with them; /api/custom-request stays untouched server-side in case
 * the "custom-solution" / "rent-leads" kinds are reactivated). The old
 * five-card layout (three prepay-term plan cards + Custom solutions + the
 * inactive "Get leads" card) stays retired.
 *
 * No "free week" / "try for free" language on this page. Only the Platform
 * period cards end in a form, because they're the one offer that's still a
 * self-serve signup.
 *
 * Zero friction by design (Shamil 2026-06-12): every capture path asks for
 * the minimum needed to start a conversation — email, plus whatever's
 * structurally required — never more.
 *
 * Styled with the site's light-cream tokens (globals.css) — NOT the dark
 * palette (first version mismatched; Shamil flagged it 2026-06-12).
 *
 * 2026-07-30: the Erken store-download card + its bot-menu popover
 * (Text/Voice/Feedback/Roadmap/What's-new/extension) were removed earlier
 * the same day — Erkenbot is retired as a downloadable product and stays
 * only as this site's assistant.
 */

import { useState } from "react";
import ErkenChatWidget from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";
import {
  PLATFORM_BILLING_PERIODS,
  PLATFORM_FEATURES,
  billingPeriodNote,
  type BillingPeriod,
} from "@/lib/pricing";

type SendState = "idle" | "sending" | "sent" | "error";

/**
 * Platform period card — one card per billing period (owner-approved
 * restructure, 2026-08-12, replacing the old single Platform card with an
 * in-card billing-period selector). The card's period is FIXED: the inline
 * email capture posts { email, plan: period.id, phone?, name? } to
 * /api/signup — period.id is one of "monthly" | "6-months" | "yearly",
 * exactly the whitelist that route already validates against, so no API
 * change was needed. The email input + submit button are ALWAYS rendered
 * (Shamil 2026-07-20: the old expand-on-click two-step made the button
 * jump and reflow neighboring cards). The `min-h` wrapper reserves the
 * form's footprint so swapping to the "sent" confirmation doesn't reflow
 * the row either. Field order (Shamil 2026-07-21): email, phone
 * (optional), name (optional) last. The 6-months card carries the
 * emphasized treatment (accent border + "Most popular" badge).
 */
function PlatformCard({ period }: { period: BillingPeriod }) {
  const emphasized = period.id === "6-months";
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<SendState>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || !email.trim()) return;
    setState("sending");
    try {
      const r = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          plan: period.id,
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          ...(name.trim() ? { name: name.trim() } : {}),
        }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section
      className={`relative flex flex-col rounded-2xl bg-surface p-8 ${
        emphasized ? "border-2 border-accent" : "border border-border"
      }`}
    >
      {emphasized && (
        <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-bg">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{period.label}</h3>
      <div className="mt-4">
        <span className="text-2xl font-bold">${period.perMonth}/mo</span>
        <span className="ml-2 text-xs text-text-dim">{billingPeriodNote(period)}</span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.05em] text-text-dim">
        What&apos;s included
      </p>
      <ul className="mt-2 flex-1 space-y-1.5 text-sm text-text-muted">
        {PLATFORM_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 text-accent">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 min-h-[10rem]">
        {state === "sent" ? (
          <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
            ✅ You&apos;re in. We&apos;re setting up your account and
            you&apos;ll hear from us shortly — usually within a few hours.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="phone (optional)"
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name (optional)"
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-1 w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              {state === "sending"
                ? "One second…"
                : state === "error"
                  ? "Didn't go through — try again"
                  : "Get started"}
            </button>
          </form>
        )}
      </div>
      <p className="mt-3 text-xs text-text-dim">
        No card. No questionnaire. Just your email — we set everything up and
        reach out.
      </p>
    </section>
  );
}

// Get-leads card REMOVED entirely (owner-decided pricing restructure,
// 2026-07-30) — it was an inactive "Coming soon" placeholder with no live
// capture path. Its underlying kind, "rent-leads", is left untouched in
// /api/custom-request in case the partnership offer is reactivated later.

export default function StartPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-20 text-text md:py-28">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
        >
          ← Back home
        </a>
        <p className="font-mono text-xs uppercase tracking-[0.05em] text-accent">
          Get started
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
          Your business, running itself.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
          One platform that answers, books, follows up and reports — with Erken,
          the assistant that teaches you the whole thing as you use it.
        </p>

        {/* Owner-approved pricing restructure (2026-08-12, same-day
            addendum): exactly three cards — the Platform as three
            billing-period cards (Monthly / 6 months / Yearly), each with
            its own self-serve signup form. One row at md, stacked on
            mobile. */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLATFORM_BILLING_PERIODS.map((p) => (
            <PlatformCard key={p.id} period={p} />
          ))}
        </div>
        {/* Usage-cost disclosure (owner ask, 2026-08-12): voice minutes are
            pass-through, so heavy call volume never surprises anyone. No
            per-minute number — rates change. */}
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-text-dim">
          AI voice minutes are billed separately at cost — you only pay for
          what you use, so a busy month never brings a surprise bill.
        </p>
      </div>

      {/* Keeps the chat + voice engines mounted — ErkenChatWidget keeps
          the GHL loader/launcher-suppression wired up for the site's chat
          widget, ErkenVoiceWidget powers window.__startErkenVoiceCall. */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />
    </main>
  );
}
