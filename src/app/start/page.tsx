"use client";

/**
 * /start — the trial funnel page (2026-06-12 positioning: the site sells TWO
 * products — the white-label CRM at $97/mo and the free Erkenbot).
 *
 * ONE field, one button. Zero friction by design: email is all we ask;
 * everything else gets discussed after Shamil reaches out. The bot column has
 * no form at all — downloads stay friction-free, contact capture happens
 * in-product later.
 *
 * Styled with the site's light-cream tokens (globals.css) — NOT the dark
 * palette (first version mismatched; Shamil flagged it 2026-06-12).
 */

import { useState } from "react";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, { openErkenChat } from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

type SendState = "idle" | "sending" | "sent" | "error";

export default function StartPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [botMenu, setBotMenu] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || !email.trim()) return;
    setState("sending");
    try {
      const r = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <main className="min-h-screen bg-bg px-6 py-20 text-text md:py-28">
      <div className="mx-auto max-w-3xl">
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

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* CRM trial — the one-field form */}
          <section className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-xl font-semibold">The platform</h2>
            <p className="mt-1 text-sm text-text-muted">
              CRM, pipelines, calendars, automations —{" "}
              <span className="text-text">$97/month after a free week</span>.
            </p>
            {state === "sent" ? (
              <div className="mt-6 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
                ✅ You&apos;re in. We&apos;re setting up your account and
                you&apos;ll hear from us shortly — usually within a few hours.
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourbusiness.com"
                  className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-3 w-full rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
                >
                  {state === "sending"
                    ? "One second…"
                    : state === "error"
                      ? "Didn't go through — try again"
                      : "Start my free week"}
                </button>
                <p className="mt-3 text-xs text-text-dim">
                  No card. No questionnaire. Just your email — we set everything
                  up and reach out.
                </p>
              </form>
            )}
          </section>

          {/* Erkenbot — free, zero friction, no form */}
          <section className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-xl font-semibold">Erken, the assistant</h2>
            <p className="mt-1 text-sm text-text-muted">
              Talks, teaches, walks you through any task step by step.{" "}
              <span className="text-text">Free.</span>
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
              <div>💬 Try it right now — it&apos;s the creature on our homepage.</div>
              <div>
                🧩 Browser extension —{" "}
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                  rolling out
                </span>{" "}
                pending store approval.
              </div>
              <div>🖥️ Desktop version on the way — it does tasks on your computer for you.</div>
            </div>
            <button
              onClick={() => setBotMenu(true)}
              className="mt-6 inline-block rounded-xl border border-border px-6 py-3 text-base font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-2"
            >
              Meet Erken →
            </button>
          </section>
        </div>
      </div>

      {/* Erken lives here too — same chat + same Retell agent as the homepage */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />
      <div className="fixed bottom-6 right-6 z-[50] cursor-pointer">
        <CellDragonSprite scale={0.75} onClick={() => setBotMenu((v) => !v)} />
      </div>
      {botMenu && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            aria-hidden
            onClick={() => setBotMenu(false)}
          />
          <div className="fixed bottom-40 right-6 z-[56] flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md">
            <div className="px-3 pb-1 pt-1 text-xs text-white/55">Talk to Erken</div>
            <button
              onClick={() => {
                setBotMenu(false);
                openErkenChat();
              }}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
            >
              <span aria-hidden className="text-base">💬</span> Text chat
            </button>
            <button
              onClick={() => {
                setBotMenu(false);
                window.__startErkenVoiceCall?.();
              }}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
            >
              <span aria-hidden className="text-base">🎙️</span> Voice chat
            </button>
          </div>
        </>
      )}
    </main>
  );
}
