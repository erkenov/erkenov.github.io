"use client";

/**
 * /start — the trial funnel page (2026-06-12 positioning: the site sells TWO
 * products — the white-label CRM at $97/mo and the free Erkenbot).
 *
 * ONE field, one button. Zero friction by design: email is all we ask;
 * everything else gets discussed after Shamil reaches out. The bot column has
 * no form at all — downloads stay friction-free, contact capture happens
 * in-product later.
 */

import { useState } from "react";

type SendState = "idle" | "sending" | "sent" | "error";

export default function StartPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");

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
    <main className="min-h-screen bg-[#0A0E1A] px-6 py-20 text-[#EAF3EC] md:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#7ea687]">
          Get started
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
          Your business, running itself.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#b8c4bf]">
          One platform that answers, books, follows up and reports — with Erken,
          the assistant that teaches you the whole thing as you use it.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* CRM trial — the one-field form */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-xl font-semibold">The platform</h2>
            <p className="mt-1 text-sm text-[#b8c4bf]">
              CRM, pipelines, calendars, automations —{" "}
              <span className="text-[#EAF3EC]">$97/month after a free week</span>.
            </p>
            {state === "sent" ? (
              <div className="mt-6 rounded-xl border border-[#7ea687]/40 bg-[#7ea687]/10 p-4 text-sm leading-relaxed">
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
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-base text-white placeholder-white/35 outline-none transition-colors focus:border-[#7ea687]"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-3 w-full rounded-xl bg-[#7ea687] px-6 py-3 text-base font-semibold text-[#0A0E1A] transition-all hover:bg-[#B8D4BD] disabled:opacity-50"
                >
                  {state === "sending"
                    ? "One second…"
                    : state === "error"
                      ? "Didn't go through — try again"
                      : "Start my free week"}
                </button>
                <p className="mt-3 text-xs text-[#6a7a72]">
                  No card. No questionnaire. Just your email — we set everything
                  up and reach out.
                </p>
              </form>
            )}
          </section>

          {/* Erkenbot — free, zero friction, no form */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-xl font-semibold">Erken, the assistant</h2>
            <p className="mt-1 text-sm text-[#b8c4bf]">
              Talks, teaches, walks you through any task step by step.{" "}
              <span className="text-[#EAF3EC]">Free.</span>
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-[#b8c4bf]">
              <div>💬 Try it right now — it&apos;s the creature on our homepage.</div>
              <div>
                🧩 Browser extension —{" "}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/55">
                  rolling out
                </span>{" "}
                pending store approval.
              </div>
              <div>🖥️ Desktop version on the way — it does tasks on your computer for you.</div>
            </div>
            <a
              href="/"
              className="mt-6 inline-block rounded-xl border border-white/15 px-6 py-3 text-base font-medium text-white transition-colors hover:border-white/35 hover:bg-white/5"
            >
              Meet Erken →
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
