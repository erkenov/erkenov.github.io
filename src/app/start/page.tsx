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

// Batch 14 (Shamil 2026-07-20): with the Get leads card parked, 5 cards
// remain — Shamil's preference is all 5 in one row at wide desktop.
// Tried at the xl breakpoint (1280px, Tailwind default) first; the page's
// max-w-6xl container is a fixed ~1152px there regardless of monitor
// size, which only leaves ~211px per card after gaps — too tight for the
// "What's included" bullet lists (long lines like "Reputation + review
// management" wrap badly even after shrinking type/padding one notch).
// So: true 5-up only kicks in at a custom ≥1400px breakpoint, where the
// container is also widened (see max-w-6xl min-[1400px]:max-w-[84rem]!
// below) to give each card real room. Between lg (1024px) and 1400px —
// which includes 1280px — cards stay 3-up; the leftover pair (Erken +
// Custom solutions) centers itself via flex-wrap + justify-content:
// center rather than grid column math, which centers any leftover-row
// count for free. Mobile (<768px) stays a single stacked column.
const CARD_BASIS =
  "w-full md:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] min-[1400px]:basis-[calc(20%-1.2rem)]!";

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

/**
 * One plan — its own inline email capture, posts { email, plan } to
 * /api/signup. The email input + submit button are ALWAYS rendered
 * (Shamil 2026-07-20: the old expand-on-click two-step made the button
 * jump down and the CSS-grid row reflow every neighboring card — felt
 * unfinished). The `min-h` wrapper reserves the form's footprint so
 * swapping to the "sent" confirmation doesn't reflow the row either.
 */
function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          plan: plan.id,
          ...(phone.trim() ? { phone: phone.trim() } : {}),
        }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-surface p-8 min-[1400px]:p-6!">
      <h3 className="text-lg font-semibold min-[1400px]:text-base!">{plan.label}</h3>
      <div className="mt-2">
        <span className="text-2xl font-bold min-[1400px]:text-xl!">{plan.price}</span>
        <span className="ml-2 text-xs text-text-dim">{plan.note}</span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.05em] text-text-dim">
        What&apos;s included
      </p>
      <ul className="mt-2 flex-1 space-y-1.5 text-sm text-text-muted min-[1400px]:space-y-1! min-[1400px]:text-xs!">
        {PLAN_FEATURES.map((f) => (
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
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-1 w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              {state === "sending"
                ? "One second…"
                : state === "error"
                  ? "Didn't go through — try again"
                  : "Start my free week"}
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

type ContactKind = "custom-solution" | "rent-leads";

type MicState =
  | "idle" // ready — click to start recording
  | "recording" // click again to stop
  | "transcribing" // POSTing to /api/transcribe
  | "denied" // getUserMedia rejected — icon disabled
  | "error"; // transcription failed — icon back to idle, hint line shows why

/**
 * ContactMethods — the shared contact block (voice call, or a typed
 * message with an in-textarea mic for dictation) used by both
 * CustomSolutionsCard and GetLeadsCard (Shamil 2026-07-20: extracted
 * rather than duplicated so the state machine lives in exactly one
 * place). `kind` picks the /api/custom-request tag. Phone is always
 * offered and always OPTIONAL — email is the one required field, phone is
 * a low-friction "leave it if you want a callback" extra (the endpoint
 * forwards `phone` to the GHL contact for any `kind`, not just
 * rent-leads — see /api/custom-request).
 *
 * v2 (Shamil 2026-07-20): the old "Send an audio message" button + its
 * morph-into-a-panel flow is gone — two complaints: the transcript wasn't
 * editable, and the panel reflowed the card. Replaced with a small mic
 * icon inside the "or send us a message" textarea (Telegram/WhatsApp style):
 * record → transcribe via the existing /api/transcribe → insert the text
 * into the textarea, fully editable, sent through the normal form submit.
 * Zero layout shift — the icon is absolutely positioned over the
 * textarea, and the error hint line below it is always reserved (empty
 * when unused) so nothing ever moves between states.
 */
function ContactMethods({
  kind,
  textareaPlaceholder,
}: {
  kind: ContactKind;
  textareaPlaceholder: string;
}) {
  // typed-form sub-flow — always-visible (Shamil 2026-07-20: no expand/
  // collapse toggle). The mic icon inside the textarea (v2, same day)
  // records via MediaRecorder, transcribes through the existing
  // /api/transcribe endpoint, and inserts the result into the textarea so
  // it stays fully editable before sending.
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState<SendState>("idle");

  const [micState, setMicState] = useState<MicState>("idle");
  const [micError, setMicError] = useState("");
  // True once any transcribed text has been inserted into the current
  // message — drives channel:"audio" vs "form" on submit. Reset when the
  // textarea is cleared back to empty so a fully-retyped message reports
  // as "form".
  const [audioContributed, setAudioContributed] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Release the mic on unmount even if a recording is mid-flight.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setMessage(v);
    if (!v.trim()) setAudioContributed(false);
  };

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
          kind,
          channel: audioContributed ? "audio" : "form",
          ...(name.trim() ? { name: name.trim() } : {}),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
        }),
      });
      setFormState(r.ok ? "sent" : "error");
    } catch {
      setFormState("error");
    }
  };

  const startMicRecording = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const mime = mr.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        setMicState("transcribing");
        try {
          const b64 = await blobToBase64(blob);
          const r = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: b64, mime }),
          });
          const d = (await r.json().catch(() => ({ text: "" }))) as { text?: string };
          if (r.ok && d.text) {
            setMessage((prev) => (prev.trim() ? `${prev.trim()} ${d.text}` : String(d.text)));
            setAudioContributed(true);
            setMicState("idle");
          } else {
            setMicError("Couldn't transcribe — try again");
            setMicState("error");
          }
        } catch {
          setMicError("Couldn't transcribe — try again");
          setMicState("error");
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setMicState("recording");
    } catch {
      setMicState("denied");
    }
  };

  const stopMicRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleMicClick = () => {
    if (micState === "idle" || micState === "error") {
      startMicRecording();
    } else if (micState === "recording") {
      stopMicRecording();
    }
    // transcribing / denied: no-op (both render disabled anyway).
  };

  const micTooltip =
    micState === "recording"
      ? "Recording — click to stop"
      : micState === "denied"
        ? "Microphone access denied"
        : micState === "transcribing"
          ? "Transcribing…"
          : "Record a voice message";

  return (
    <>
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => window.__startErkenVoiceCall?.()}
          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-6 py-3 text-left text-base font-medium text-text transition-colors hover:border-border-strong"
        >
          <span aria-hidden>🎙️</span> Talk to our receptionist
        </button>
      </div>

      <div className="mt-6">
        {/* Reserved error-hint line lives here, above the "or send us a
            message" label (Shamil 2026-07-20 live review), not between the
            textarea and email input below — putting it there made that gap
            bigger than the email-to-phone gap. Fixed height so it never
            shifts layout; the empty default state is the intentional wider
            breathing room above the label. */}
        <p className="h-4 text-xs text-red-500">
          {micState === "error" ? micError : ""}
        </p>
        {/* Batch 13 (Shamil 2026-07-20): renamed from "Ask by text" so the
            card reads as one sentence flowing from the voice button —
            "Talk to our receptionist" / "or send us a message". Same
            mono-label styling. */}
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.05em] text-text-dim">
          or send us a message
        </p>
        <div className="mt-2 min-h-[15rem]">
          {formState === "sent" ? (
            <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
              ✅ Got it — we&apos;ll review and send you an offer shortly.
            </div>
          ) : (
            <form onSubmit={submitForm} className="flex flex-col gap-2">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={onMessageChange}
                  rows={3}
                  required
                  placeholder={textareaPlaceholder}
                  className="block w-full resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 pr-12 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={micState === "denied" || micState === "transcribing"}
                  title={micTooltip}
                  aria-label={micTooltip}
                  className={`absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                    micState === "recording"
                      ? "cursor-pointer border-red-500/40 bg-red-500/10 text-red-500 animate-pulse"
                      : micState === "denied"
                        ? "cursor-not-allowed border-border bg-surface-2 text-text-dim opacity-50"
                        : micState === "transcribing"
                          ? "cursor-default border-border bg-surface-2 text-text-dim"
                          : "cursor-pointer border-border bg-surface-2 text-text-dim hover:border-border-strong hover:text-text"
                  }`}
                >
                  {micState === "transcribing" ? (
                    <span
                      aria-hidden
                      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-text-dim border-t-transparent"
                    />
                  ) : (
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      {micState === "denied" && <line x1="4" y1="4" x2="20" y2="20" />}
                    </svg>
                  )}
                </button>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name (optional)"
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
              />
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
                placeholder="phone (optional)"
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none transition-colors focus:border-accent"
              />
              <button
                type="submit"
                disabled={formState === "sending"}
                className="mt-1 w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg transition-all hover:bg-accent-hover disabled:opacity-50"
              >
                {formState === "sending"
                  ? "Sending…"
                  : formState === "error"
                    ? "Didn't go through — try again"
                    : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

/** Custom GoHighLevel / snapshot work — voice call, or a typed form with dictation. */
function CustomSolutionsCard() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-surface p-8 min-[1400px]:p-6!">
      <h3 className="text-lg font-semibold min-[1400px]:text-base!">Custom solutions</h3>
      <p className="mt-1 text-sm text-text-muted min-[1400px]:text-xs!">
        Want your snapshot configured for you, or any custom platform
        configuration? Describe what you need — we&apos;ll assess it and
        send you an offer.
      </p>
      <ContactMethods
        kind="custom-solution"
        textareaPlaceholder="Describe the solution you need"
      />
    </section>
  );
}

/**
 * Parked 2026-07-20 (Batch 14, Shamil's call) — future offering, not a
 * present one: no lead-gen sites exist yet to actually deliver leads
 * from. Component kept intact and unrendered (not deleted) so it's a
 * one-line re-add to the grid below once the lead-gen sites exist. The
 * shared ContactMethods component it depends on stays live — Custom
 * solutions still uses it — and /api/custom-request's "rent-leads" kind
 * keeps working (harmless to leave wired, nothing points at it right now).
 *
 * Original context, still accurate for whenever this comes back: display
 * name is "Get leads" (Shamil 2026-07-20); the underlying kind value
 * stays "rent-leads" (wired to the "rent-leads-applicant" GHL tag in
 * /api/custom-request) — that was a display-only rename, not a
 * re-tagging. Contact structure matches CustomSolutionsCard: voice call
 * or typed form via the shared ContactMethods component, phone kept
 * since a leads partnership needs a callback number. NOTE (Shamil): a
 * further copy pass for this card was pending as a follow-up — don't
 * invent more text beyond what's here when it comes back.
 */
function GetLeadsCard() {
  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface p-8">
      <h3 className="text-lg font-semibold">Get leads</h3>
      <p className="mt-1 text-sm text-text-muted">
        We run and market our own lead-generating sites in your industry.
        Partner with us and we hand you live leads — delivered by phone — for
        a share of the revenue.
      </p>
      <ContactMethods
        kind="rent-leads"
        textareaPlaceholder="Tell us about your company and the leads you need"
      />
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
      <div className="mx-auto max-w-6xl min-[1400px]:max-w-[84rem]!">
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

        {/* Batch 14 (Shamil 2026-07-20): Get leads card parked (see
            GetLeadsCard below) — 5 cards left, all in one row at wide
            desktop. flex-wrap + justify-center (not CSS grid) so a
            leftover row of fewer-than-N cards centers itself as a group
            automatically, no column-math needed. Each card is wrapped in
            a CARD_BASIS div that sets its width per breakpoint; the card's
            own root keeps h-full so flex's default row-stretch still
            equalizes height across a row, same as the old grid did. */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {PLANS.map((p) => (
            <div key={p.id} className={CARD_BASIS}>
              <PlanCard plan={p} />
            </div>
          ))}

          {/* Erkenbot — free, zero friction, lives on her own card now */}
          <div className={CARD_BASIS}>
            <section className="flex h-full flex-col rounded-2xl border border-border bg-surface p-8 min-[1400px]:p-6!">
              <div className="flex items-start gap-8 min-[1400px]:gap-4!">
                <div
                  ref={spriteRef}
                  onClick={() => (botMenu ? closeBotMenu() : openBotMenu())}
                  className="shrink-0 cursor-pointer"
                  title="Chat with Erken"
                >
                  <CellDragonSprite scale={0.42} />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold min-[1400px]:text-base!">Erken, the assistant</h3>
                </div>
              </div>
              <div className="mt-12 flex flex-1 flex-col justify-end gap-2 text-sm leading-relaxed text-text-muted min-[1400px]:mt-8! min-[1400px]:text-xs!">
                <div>
                  🗣️ <b>Ask it anything</b> — by voice or chat, about the
                  platform or your business
                </div>
                <div>
                  👉 <b>Shows you the exact button</b> — walks you through any
                  task on screen, out loud, step by step
                </div>
                <div>
                  🧠 <b>Remembers you</b> — your business, your setup, where
                  you left off
                </div>
                <div>
                  ⚡ <b>Actions on the way</b> — soon it won&apos;t just guide,
                  it&apos;ll do the task for you
                </div>
                <div>
                  🧩 <b>Already in your browser</b> — free extension,
                  installs in one click. Desktop version on the way.
                </div>
              </div>
              <a
                href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                target="_blank"
                rel="noopener"
                className="mt-6 inline-block w-full cursor-pointer rounded-xl bg-accent px-6 py-3 text-center text-base font-medium text-bg transition-colors hover:bg-accent-hover min-[1400px]:px-4! min-[1400px]:py-2.5! min-[1400px]:text-sm!"
              >
                Download for free
              </a>
            </section>
          </div>

          <div className={CARD_BASIS}>
            <CustomSolutionsCard />
          </div>
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
              <div className="w-full px-3 py-2 text-sm text-white">
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
                    ⚡ <b>Actions are coming</b> — Erken won&apos;t just show you
                    the button, it will do the task for you, right in your
                    account.
                  </div>
                  <div>
                    🌐 <b>Works on the Erken platform today</b> — expanding
                    to Zapier, QuickBooks, and the popular apps you already
                    connect
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
                    🖥️ <b>A desktop companion</b> — Erken on your screen, working
                    across every app you use, not just this one
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
              <div className="w-full px-3 py-2 text-sm text-white">
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
              <div className="w-full px-3 py-2">
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
