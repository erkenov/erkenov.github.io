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

// drifting cell-particles around Celly — a lightweight CSS echo of the
// homepage's 3D dust cloud (deterministic, index-seeded; no Three.js here)
const DUST = Array.from({ length: 22 }, (_, i) => {
  const COLORS = ["#7ea687", "#B8D4BD", "#EAF3EC", "#7ea687", "#F2C94C"];
  const ang = (i / 22) * Math.PI * 2 + (i % 3) * 0.7;
  const rad = 7 + ((i * 37) % 10) * 0.55; // rem from center
  return {
    left: 9 + Math.cos(ang) * rad,
    top: 9 + Math.sin(ang) * rad * 0.85,
    size: 0.18 + ((i * 13) % 10) * 0.035,
    color: COLORS[i % COLORS.length],
    opacity: 0.35 + ((i * 7) % 10) * 0.06,
    dur: 5 + ((i * 11) % 10) * 0.6,
    delay: -((i * 17) % 10) * 0.7,
  };
});

export default function StartPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [botMenu, setBotMenu] = useState(false);
  const [menuPanel, setMenuPanel] = useState<"feedback" | "roadmap" | null>(null);
  const [fbText, setFbText] = useState("");
  const [fbState, setFbState] = useState<SendState>("idle");

  const closeBotMenu = () => {
    setBotMenu(false);
    setMenuPanel(null);
    setFbText("");
    setFbState("idle");
  };
  const sendFeedback = async () => {
    const message = fbText.trim();
    if (!message || fbState === "sending") return;
    setFbState("sending");
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "idea",
          message,
          url: window.location.href,
          title: document.title,
        }),
      });
      setFbState(r.ok ? "sent" : "error");
    } catch {
      setFbState("error");
    }
  };

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
                🧩{" "}
                <a
                  href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Browser extension — install from the Chrome Web Store
                </a>
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

      {/* Erken lives here too — same look (sprite + drifting cell particles),
          same chat + same Retell agent as the homepage. STATIC by design:
          she sits in the free space right of the bot card (Shamil 2026-06-12),
          no roaming on this page. */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />
      <div
        className="fixed z-[50] hidden cursor-pointer lg:block"
        style={{ right: "max(1.5rem, calc(50vw - 24rem - 19rem))", top: "50%", transform: "translateY(-50%)" }}
        onClick={() => (botMenu ? closeBotMenu() : setBotMenu(true))}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {DUST.map((d, i) => (
            <i
              key={i}
              style={{
                position: "absolute",
                left: `${d.left}rem`,
                top: `${d.top}rem`,
                width: `${d.size}rem`,
                height: `${d.size}rem`,
                borderRadius: "50%",
                background: d.color,
                opacity: d.opacity,
                filter: "blur(0.5px)",
                boxShadow: `0 0 6px ${d.color}`,
                animation: `startDust ${d.dur}s ease-in-out ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <CellDragonSprite scale={1} />
      </div>
      {/* small screens: corner Celly so the page still has her */}
      <div
        className="fixed bottom-5 right-4 z-[50] cursor-pointer lg:hidden"
        onClick={() => (botMenu ? closeBotMenu() : setBotMenu(true))}
      >
        <CellDragonSprite scale={0.6} />
      </div>
      <style>{`
        @keyframes startDust {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0.6rem, -0.8rem); }
        }
      `}</style>
      {botMenu && (
        <>
          <div className="fixed inset-0 z-[55]" aria-hidden onClick={closeBotMenu} />
          <div className="fixed bottom-1/3 right-[6rem] z-[56] flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md max-lg:bottom-36 max-lg:right-4">
            {menuPanel === null && (
              <>
                <div className="px-3 pb-1 pt-1 text-xs text-white/55">Talk to Erken</div>
                <button
                  onClick={() => {
                    closeBotMenu();
                    openErkenChat();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">💬</span> Text chat
                </button>
                <button
                  onClick={() => {
                    closeBotMenu();
                    window.__startErkenVoiceCall?.();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🎙️</span> Voice chat
                </button>
                <div className="mx-2 h-px bg-white/10" aria-hidden />
                <button
                  onClick={() => setMenuPanel("feedback")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">📝</span> Feedback
                </button>
                <button
                  onClick={() => setMenuPanel("roadmap")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🗺️</span> Roadmap
                </button>
                <a
                  href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🧩</span> Add the browser extension
                </a>
              </>
            )}
            {menuPanel === "roadmap" && (
              <div className="w-[280px] px-3 py-2 text-sm text-white">
                <div className="pb-1.5 text-xs text-white/55">Where Erken is going</div>
                <div className="flex flex-col gap-1.5 leading-snug">
                  <div>
                    📚 <b>New skills in training:</b> Excel &amp; Google Sheets, Canva,
                    QuickBooks — taught step by step
                  </div>
                  <div>🔊 Voice answers on every page</div>
                  <div>
                    🧠 <b>Personal memory:</b> Erken remembers you — your business, your
                    setup, what you&apos;ve already learned
                  </div>
                  <div>
                    🖥️ <b>Desktop version on the way</b> — unlike the browser extension,
                    it can do tasks on your computer for you
                  </div>
                </div>
                <div className="pt-2 text-xs text-white/55">
                  Your vote decides what Erken learns next — tell us via 📝 Feedback.
                </div>
              </div>
            )}
            {menuPanel === "feedback" && (
              <div className="w-[280px] px-3 py-2">
                <div className="pb-1.5 text-xs text-white/55">
                  Your feedback — bugs, ideas, anything
                </div>
                {fbState === "sent" ? (
                  <div className="py-2 text-sm text-white">
                    ✅ Got it — passed along. Thank you!
                  </div>
                ) : (
                  <>
                    <textarea
                      value={fbText}
                      onChange={(e) => setFbText(e.target.value)}
                      rows={3}
                      autoFocus
                      className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/30"
                      placeholder="Tell us…"
                    />
                    <button
                      onClick={sendFeedback}
                      disabled={fbState === "sending" || !fbText.trim()}
                      className="mt-1.5 w-full rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:opacity-40"
                    >
                      {fbState === "sending"
                        ? "Sending…"
                        : fbState === "error"
                          ? "Couldn't send — try again"
                          : "Send"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
