"use client";

/**
 * /start — the trial funnel page (2026-07-20 redesign: three separate
 * prepay-term plan cards instead of a radio selector, plus two new asks —
 * custom GoHighLevel/snapshot work and the rent-leads partnership — each
 * with their own zero-friction capture path into /api/custom-request).
 *
 * Zero friction by design (Shamil 2026-06-12, extended 2026-07-20): every
 * card asks for the minimum needed to start a conversation — email, plus
 * whatever's structurally required (a message, a phone number) — never more.
 *
 * Styled with the site's light-cream tokens (globals.css) — NOT the dark
 * palette (first version mismatched; Shamil flagged it 2026-06-12).
 *
 * 2026-07-30: the Erken store-download card + its bot-menu popover
 * (Text/Voice/Feedback/Roadmap/What's-new/extension) were removed — Erkenbot
 * is retired as a downloadable product and stays only as this site's
 * assistant. Voice access to Erken remains via the "Talk to our
 * receptionist" button already built into ContactMethods below.
 */

import { useEffect, useRef, useState } from "react";
import ErkenChatWidget from "@/components/ErkenChatWidget";
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
  "Erken assistant included (beta)",
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

/**
 * One plan — its own inline email capture, posts { email, plan, phone?,
 * name? } to /api/signup. The email input + submit button are ALWAYS
 * rendered (Shamil 2026-07-20: the old expand-on-click two-step made the
 * button jump down and the CSS-grid row reflow every neighboring card —
 * felt unfinished). The `min-h` wrapper reserves the form's footprint so
 * swapping to the "sent" confirmation doesn't reflow the row either.
 * Field order (Shamil 2026-07-21): email, phone (optional), name (optional)
 * last — both optional extras, but name is intentionally the final field.
 */
function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
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
          plan: plan.id,
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
    // id + scroll-mt so /home-v8-draft's "Get a custom offer" deep-link
    // (/start#custom-solutions) lands right on this card, clear of any sticky
    // header (2026-07-20).
    <section id="custom-solutions" className="flex scroll-mt-24 flex-col rounded-2xl border border-border bg-surface p-8">
      <h3 className="text-lg font-semibold">Custom solutions</h3>
      <p className="mt-1 text-sm text-text-muted">
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
 * Get leads — Batch 15 (Shamil 2026-07-20): back in the grid, but INACTIVE.
 * It's a future offering (no lead-gen sites exist yet to deliver leads
 * from), so it advertises the idea without taking submissions. Deliberately
 * NOT using the shared ContactMethods component here — that component owns
 * live fetch() handlers and form state, and this card must have zero
 * functional handlers, not just visually-disabled ones. Instead this is a
 * static, inert copy of the same button/textarea/input shape (so it still
 * *looks* like the other contact cards, just dimmed) with every control
 * `disabled` + `aria-disabled` + `tabIndex={-1}` (belt-and-suspenders: disabled
 * already pulls inputs out of tab order and blocks all interaction; the
 * explicit tabIndex/aria-disabled make the inert state unambiguous to
 * assistive tech too) and the whole block wrapped in `pointer-events-none`
 * so nothing here is clickable even if a future edit forgets a disabled attr.
 *
 * Underlying kind value for whenever this reactivates: "rent-leads" (wired
 * to the "rent-leads-applicant" GHL tag in /api/custom-request, which keeps
 * working — nothing currently posts to it). Re-enabling: swap this static
 * markup back for `<ContactMethods kind="rent-leads" textareaPlaceholder="Tell
 * us about your company and the leads you need" />` (see CustomSolutionsCard
 * for the live pattern) and drop the badge/disabled/opacity wrapper.
 */
function GetLeadsCard() {
  return (
    <section className="relative flex flex-col rounded-2xl border border-border bg-surface p-8">
      {/* Badge color history (Shamil 2026-07-20 live review, two rounds):
          muted border pill read as too faint -> filled sage accent (matched
          the rest of the site's one accent color, but read as a positive/
          active signal, wrong tone for "not available yet") -> filled clay
          (--clay in globals.css: a desaturated terracotta/brick red picked
          specifically to harmonize with the sage+cream palette rather than
          clash against it — checked at ~4.8:1 contrast against the light
          --bg text color it pairs with here, meets WCAG AA for small text).
          Full opacity, sits outside the dimmed/opacity-50 wrapper below so
          only the badge pops while the rest of the card stays visibly inert. */}
      <span className="absolute right-6 top-6 rounded-full bg-[var(--clay)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-bg">
        Coming soon
      </span>
      <div className="pointer-events-none flex flex-1 flex-col opacity-50" aria-disabled="true">
        <h3 className="text-lg font-semibold">Get leads</h3>
        <p className="mt-1 text-sm text-text-muted">
          We run and market our own lead-generating sites in your industry.
          Partner with us and we hand you live leads — delivered by phone — for
          a share of the revenue.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled
            aria-disabled="true"
            tabIndex={-1}
            className="flex cursor-not-allowed items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-6 py-3 text-left text-base font-medium text-text"
          >
            <span aria-hidden>🎙️</span> Talk to our receptionist
          </button>
        </div>

        <div className="mt-6">
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.05em] text-text-dim">
            or send us a message
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              disabled
              aria-disabled="true"
              tabIndex={-1}
              rows={3}
              placeholder="Tell us about your company and the leads you need"
              className="block w-full cursor-not-allowed resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none"
            />
            <input
              type="text"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              placeholder="name (optional)"
              className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none"
            />
            <input
              type="email"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              placeholder="your email"
              className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none"
            />
            <input
              type="tel"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              placeholder="phone (optional)"
              className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-dim outline-none"
            />
            <button
              type="button"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              className="mt-1 w-full cursor-not-allowed rounded-xl bg-accent px-6 py-3 text-base font-semibold text-bg"
            >
              Send request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

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

        {/* Batch 15 (Shamil 2026-07-20): rolled back Batch 14's 5-up
            flex-wrap experiment — Shamil viewed it on his wide screen and
            called it squeezed (email input didn't fit). Back to the
            stable grid rhythm: 3 per row at desktop, 2-up at md, stacked
            on mobile.
            2026-07-30: the Erken store-download card was removed from row 2
            (Erkenbot retired as a downloadable product), leaving Custom
            solutions + Get leads (coming soon) as an even pair. Split into
            its own 2-up grid below, width-matched and centered under the
            3-up plans grid, so five cards read as a deliberate 3-then-2
            layout instead of a 3-column grid with a gap where the sixth
            card used to be. */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-[760px]">
          <CustomSolutionsCard />
          <GetLeadsCard />
        </div>
      </div>

      {/* Keeps the chat + voice engines mounted — ContactMethods' "Talk to
          our receptionist" buttons above call window.__startErkenVoiceCall,
          and ErkenChatWidget keeps the GHL loader/launcher-suppression
          wired up for the site's chat widget. */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />
    </main>
  );
}
