"use client";

/**
 * /start — the trial funnel page (2026-07-20 redesign: three separate
 * prepay-term plan cards instead of a radio selector, Erken moved onto her
 * own card with a store-download CTA, plus two new asks — custom
 * GoHighLevel/snapshot work and the rent-leads partnership — each with their
 * own zero-friction capture path into /api/custom-request).
 *
 * Zero friction by design (Shamil 2026-06-12, extended 2026-07-20): every
 * card asks for the minimum needed to start a conversation — email, plus
 * whatever's structurally required (a message, a phone number) — never more.
 *
 * Styled with the site's light-cream tokens (globals.css) — NOT the dark
 * palette (first version mismatched; Shamil flagged it 2026-06-12).
 */

import { useEffect, useRef, useState } from "react";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, { openErkenChat } from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

type SendState = "idle" | "sending" | "sent" | "error";

// Prepay tiers (Shamil 2026-07-08): three options only — month / 6 months /
// year. $97 monthly is the anchor (matches the platform's own entry price,
// never discounted); prepay earns the discount. Manual billing (Wise/
// Payoneer) means fewer, bigger payments = less collection friction.
const PLANS = [
  { id: "monthly", label: "Monthly", price: "$97/mo", note: "billed monthly" },
  { id: "6-months", label: "6 months", price: "$87/mo", note: "$522 once — save 10%" },
  { id: "yearly", label: "Yearly", price: "$81/mo", note: "$970 once — 2 months free" },
] as const;

// Same platform, every tier — the price difference is only the prepay term.
const PLAN_FEATURES = [
  "CRM + pipelines",
  "Calendars + booking",
  "Automations + follow-ups",
  "AI voice receptionist",
  "Reputation + review management",
  "Erken assistant included",
  "Free first week",
];

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** One plan — its own inline email capture, posts { email, plan } to /api/signup. */
function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const [expanded, setExpanded] = useState(false);
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
        body: JSON.stringify({ email: email.trim(), plan: plan.id }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface p-8">
      <h3 className="text-lg font-semibold">{plan.label}</h3>
      <div className="mt-2">
        <span className="text-2xl font-bold">{plan.price}</span>
        <span className="ml-2 text-xs text-text-dim">{plan.note}</span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.05em] text-text-dim">
        What&apos;s included
      </p>
      <ul className="mt-2 flex-1 space-y-1.5 text-sm text-text-muted">
        {PLAN_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 text-accent">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {state === "sent" ? (
        <div className="mt-6 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
          ✅ You&apos;re in. We&apos;re setting up your account and
          you&apos;ll hear from us shortly — usually within a few hours.
        </div>
      ) : !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-6 w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg transition-all hover:bg-accent-hover"
        >
          Start my free week
        </button>
      ) : (
        <form onSubmit={submit} className="mt-6">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-3 w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
          >
            {state === "sending"
              ? "One second…"
              : state === "error"
                ? "Didn't go through — try again"
                : "Confirm →"}
          </button>
        </form>
      )}
      <p className="mt-3 text-xs text-text-dim">
        No card. No questionnaire. Just your email — we set everything up and
        reach out.
      </p>
    </section>
  );
}

type CustomRoute = null | "form" | "audio";
type RecState =
  | "idle"
  | "recording"
  | "transcribing"
  | "ready"
  | "sending"
  | "sent"
  | "error" // recording/permission/transcription failure — back to the record button
  | "send-error"; // POST to /api/custom-request failed — keep transcript + email, offer retry

/** Custom GoHighLevel / snapshot work — voice call, typed form, or a recorded audio message. */
function CustomSolutionsCard() {
  const [route, setRoute] = useState<CustomRoute>(null);

  // typed-form sub-flow
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<SendState>("idle");

  // audio sub-flow
  const [recState, setRecState] = useState<RecState>("idle");
  const [transcript, setTranscript] = useState("");
  const [audioEmail, setAudioEmail] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "sending" || !email.trim() || !message.trim()) return;
    setFormState("sending");
    try {
      const r = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          kind: "custom-solution",
          channel: "form",
        }),
      });
      setFormState(r.ok ? "sent" : "error");
    } catch {
      setFormState("error");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const mime = mr.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        setRecState("transcribing");
        try {
          const b64 = await blobToBase64(blob);
          const r = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: b64, mime }),
          });
          const d = (await r.json().catch(() => ({ text: "" }))) as { text?: string };
          if (r.ok && d.text) {
            setTranscript(d.text);
            setRecState("ready");
          } else {
            setRecState("error");
          }
        } catch {
          setRecState("error");
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecState("recording");
    } catch {
      setRecState("error");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const sendAudioRequest = async () => {
    if (recState === "sending" || !audioEmail.trim() || !transcript.trim()) return;
    setRecState("sending");
    try {
      const r = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: audioEmail.trim(),
          message: transcript.trim(),
          kind: "custom-solution",
          channel: "audio",
        }),
      });
      // A failed POST is a send failure, not a recording failure — keep the
      // transcript + email on screen and let the user retry the send
      // (Shamil 2026-07-20: previously shared the "error" state with
      // recording failures, which silently dropped the transcript).
      setRecState(r.ok ? "sent" : "send-error");
    } catch {
      setRecState("send-error");
    }
  };

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface p-8">
      <h3 className="text-lg font-semibold">Custom solutions</h3>
      <p className="mt-1 text-sm text-text-muted">
        Want your snapshot configured for you, or custom GoHighLevel
        configuration? Describe what you need — we&apos;ll assess it and send
        you an offer.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => window.__startErkenVoiceCall?.()}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-4 py-3 text-left text-sm font-medium text-text transition-colors hover:border-border-strong"
        >
          <span aria-hidden>🎙️</span> Talk to the voice AI
        </button>
        <button
          type="button"
          onClick={() => setRoute(route === "form" ? null : "form")}
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
            route === "form"
              ? "border-accent bg-accent/10 text-text"
              : "border-border bg-surface-2 text-text hover:border-border-strong"
          }`}
        >
          <span aria-hidden>📝</span> Fill out a form
        </button>
        <button
          type="button"
          onClick={() => setRoute(route === "audio" ? null : "audio")}
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
            route === "audio"
              ? "border-accent bg-accent/10 text-text"
              : "border-border bg-surface-2 text-text hover:border-border-strong"
          }`}
        >
          <span aria-hidden>🎤</span> Send an audio message
        </button>
      </div>

      {route === "form" &&
        (formState === "sent" ? (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
            ✅ Got it — we&apos;ll review and send you an offer shortly.
          </div>
        ) : (
          <form onSubmit={submitForm} className="mt-4 flex flex-col gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              autoFocus
              placeholder="What do you need?"
              className="w-full resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              disabled={formState === "sending"}
              className="mt-1 w-full cursor-pointer rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              {formState === "sending"
                ? "Sending…"
                : formState === "error"
                  ? "Didn't go through — try again"
                  : "Send request"}
            </button>
          </form>
        ))}

      {route === "audio" &&
        (recState === "sent" ? (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
            ✅ Got it — we&apos;ll review and send you an offer shortly.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {recState === "idle" || recState === "error" ? (
              <button
                type="button"
                onClick={startRecording}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-border-strong"
              >
                {recState === "error" ? "Couldn't record — try again" : "● Start recording"}
              </button>
            ) : recState === "recording" ? (
              <button
                type="button"
                onClick={stopRecording}
                className="w-full rounded-xl border border-accent bg-accent/10 px-4 py-2.5 text-sm font-medium text-text"
              >
                ■ Stop recording
              </button>
            ) : recState === "transcribing" ? (
              <div className="px-1 text-sm text-text-muted">Transcribing…</div>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text-muted">
                  &ldquo;{transcript}&rdquo;
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={audioEmail}
                  onChange={(e) => setAudioEmail(e.target.value)}
                  placeholder="your email"
                  className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
                />
                <button
                  type="button"
                  onClick={sendAudioRequest}
                  disabled={recState === "sending"}
                  className="w-full cursor-pointer rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
                >
                  {recState === "sending"
                    ? "Sending…"
                    : recState === "send-error"
                      ? "Couldn't send — try again"
                      : "Send request"}
                </button>
              </>
            )}
          </div>
        ))}
    </section>
  );
}

/**
 * Rent-leads partnership — light by design, details still being worked
 * out. Display name changed to "Get leads" (Shamil 2026-07-20); the
 * underlying kind value stays "rent-leads" (wired to the
 * "rent-leads-applicant" GHL tag in /api/custom-request) — this is a
 * display-only rename, not a re-tagging.
 */
function GetLeadsCard() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<SendState>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || !email.trim()) return;
    setState("sending");
    try {
      const r = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          kind: "rent-leads",
        }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface p-8">
      <h3 className="text-lg font-semibold">Get leads</h3>
      <p className="mt-1 text-sm text-text-muted">
        We build and market our own lead-generating sites in your industry.
        Partner with us and we hand you live leads — delivered by phone — for
        a share of the revenue.
      </p>
      {state === "sent" ? (
        <div className="mt-6 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
          ✅ Got it — we&apos;ll be in touch to talk details.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-1 flex-col justify-end gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="phone number"
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="company / industry"
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-1 w-full cursor-pointer rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
          >
            {state === "sending" ? "Sending…" : state === "error" ? "Didn't go through — try again" : "Apply"}
          </button>
        </form>
      )}
    </section>
  );
}

export default function StartPage() {
  const [botMenu, setBotMenu] = useState(false);
  const [menuPanel, setMenuPanel] = useState<"feedback" | "roadmap" | "whatsnew" | null>(null);
  const [fbText, setFbText] = useState("");
  const [fbState, setFbState] = useState<SendState>("idle");

  // Bot-menu is a popover anchored to the card sprite (Shamil 2026-07-20:
  // it used to float at a fixed page position that matched the old
  // page-level roaming sprite, which no longer exists now that Erken
  // lives only on her card). Position is computed from the sprite's own
  // on-screen rect each time it's opened, viewport-clamped so it never
  // runs off-screen on narrow/mobile widths.
  const spriteRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const MENU_WIDTH = 280;
  const MENU_MARGIN = 16;
  // Tallest panel measured live is the main menu (label + 6 rows) at
  // ~335px — pad generously since sub-panels (roadmap/what's new) wrap
  // more text and can run taller.
  const MENU_EST_HEIGHT = 380;

  const positionBotMenu = () => {
    const el = spriteRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left = Math.min(rect.left, window.innerWidth - MENU_WIDTH - MENU_MARGIN);
    left = Math.max(MENU_MARGIN, left);

    // Open on whichever side of the sprite actually has more room — a
    // fixed "flip if it doesn't fit below" rule can pick the cramped side
    // when the sprite sits near the top of a short viewport.
    const spaceBelow = window.innerHeight - rect.bottom - MENU_MARGIN;
    const spaceAbove = rect.top - MENU_MARGIN;
    const openBelow = spaceBelow >= MENU_EST_HEIGHT || spaceBelow >= spaceAbove;
    let top = openBelow ? rect.bottom + 12 : rect.top - MENU_EST_HEIGHT - 12;
    // Final safety clamp so it's always fully on-screen even if neither
    // side has the full estimated height (very short viewport).
    top = Math.min(top, window.innerHeight - MENU_EST_HEIGHT - MENU_MARGIN);
    top = Math.max(MENU_MARGIN, top);
    setMenuPos({ top, left });
  };

  const openBotMenu = () => {
    positionBotMenu();
    setBotMenu(true);
  };

  // Keep the popover glued to the sprite if the viewport resizes while open
  // (e.g. rotating a phone).
  useEffect(() => {
    if (!botMenu) return;
    const onResize = () => positionBotMenu();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botMenu]);

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

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}

          {/* Erkenbot — free, zero friction, lives on her own card now */}
          <section className="flex flex-col rounded-2xl border border-border bg-surface p-8">
            <div className="flex items-start gap-8">
              <div
                ref={spriteRef}
                onClick={() => (botMenu ? closeBotMenu() : openBotMenu())}
                className="shrink-0 cursor-pointer"
                title="Chat with Erken"
              >
                <CellDragonSprite scale={0.42} />
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-semibold">Erken, the assistant</h3>
              </div>
            </div>
            <div className="mt-8 flex flex-1 flex-col gap-2 text-sm leading-relaxed text-text-muted">
              <div>
                Talks, teaches, walks you through any task step by step.
              </div>
              <div>💬 Try it right now — it&apos;s the creature on our homepage.</div>
              <div>🖥️ Desktop version on the way — it does tasks on your computer for you.</div>
            </div>
            <a
              href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-center text-base font-medium text-bg transition-colors hover:bg-accent-hover"
            >
              Download for free
            </a>
          </section>

          <CustomSolutionsCard />
          <GetLeadsCard />
        </div>
      </div>

      {/* Erken lives on her own card now (see the grid above) — this just
          keeps the chat + voice engines mounted so the card sprite's click
          handler (botMenu state) and the Retell agent stay wired up. */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />
      {botMenu && (
        <>
          <div className="fixed inset-0 z-[55]" aria-hidden onClick={closeBotMenu} />
          <div
            className={`fixed z-[56] flex w-[280px] flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md ${
              menuPos ? "" : "bottom-1/3 right-[6rem] max-lg:bottom-36 max-lg:right-4"
            }`}
            style={menuPos ? { top: menuPos.top, left: menuPos.left } : undefined}
          >
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
                <button
                  onClick={() => setMenuPanel("whatsnew")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">✨</span> What&apos;s new
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
                <button
                  onClick={() => setMenuPanel(null)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
                >
                  <span aria-hidden>←</span> Back to main menu
                </button>
                <div className="pb-1.5 text-xs text-white/55">Where Erken is going</div>
                <div className="flex flex-col gap-1.5 leading-snug">
                  <div>
                    🧠 <b>Memory is here</b> — Erken remembers you, your business, and
                    where you left off. It keeps getting smarter over time.
                  </div>
                  <div>
                    🌐 <b>Works on GoHighLevel today</b> — expanding to Zapier,
                    QuickBooks, and the popular apps you already connect
                  </div>
                  <div>
                    🧰 <b>Universal helpers on the way</b> — summarize any page, size up
                    a competitor, quick market research
                  </div>
                  <div>
                    💬 <b>Real conversation</b> — talk back-and-forth by voice, not one
                    question at a time
                  </div>
                  <div>
                    🖥️ <b>A desktop companion</b> — Erken on your screen, eventually
                    doing tasks for you, not just guiding
                  </div>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 text-xs text-white/55">
                  Your vote decides what Erken learns next — tell us via{" "}
                  <button
                    onClick={() => setMenuPanel("feedback")}
                    className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90"
                  >
                    📝 Feedback
                  </button>
                  .
                </div>
              </div>
            )}
            {menuPanel === "whatsnew" && (
              <div className="w-[280px] px-3 py-2 text-sm text-white">
                <button
                  onClick={() => setMenuPanel(null)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
                >
                  <span aria-hidden>←</span> Back to main menu
                </button>
                <div className="pb-1.5 text-xs text-white/55">What&apos;s new in Erken</div>
                <div className="flex flex-col gap-1.5 leading-snug">
                  <div>
                    🧭 <b>Meet the Platform</b> — a guided tour of everything the
                    platform can do
                  </div>
                  <div>
                    📂 Erken now <b>opens the menu for you</b> so it can point things
                    out
                  </div>
                  <div>
                    🚩 <b>&ldquo;Wrong instruction&rdquo; button</b> — flag Erken if it
                    points at the wrong spot
                  </div>
                  <div>🔊 Smoother step-by-step voice walkthroughs</div>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 text-xs text-white/55">
                  Got an idea or found a bug? Tell us via{" "}
                  <button
                    onClick={() => setMenuPanel("feedback")}
                    className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90"
                  >
                    📝 Feedback
                  </button>
                  .
                </div>
              </div>
            )}
            {menuPanel === "feedback" && (
              <div className="w-[280px] px-3 py-2">
                <button
                  onClick={() => setMenuPanel(null)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
                >
                  <span aria-hidden>←</span> Back to main menu
                </button>
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
