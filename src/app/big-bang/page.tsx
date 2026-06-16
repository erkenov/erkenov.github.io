"use client";

/**
 * /big-bang — an experiment (Shamil 2026-06-16): the real homepage DESIGN
 * and content, but with the Big-Bang particle sphere as the hero particle
 * effect instead of the dust/dragon-cell system. No roaming Celly, no dragon
 * trail — those are fused to SphereScrollStage and can't be lifted out without
 * a much larger rebuild, so this version omits them by design.
 *
 * The section copy + scene media mirror preview-v7 (the production homepage).
 * The main page is untouched. Rollback tag: pre-bigbang-2026-06-16.
 */

import { useEffect, useState } from "react";
import { BigBangSphere } from "@/components/BigBangSphere";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { Scene2Channels } from "@/components/Scene2Channels";
import { Scene3LeadCaptureCarousel } from "@/components/Scene3LeadCaptureCarousel";
import { Scene4LeadMgmtCarousel } from "@/components/Scene4LeadMgmtCarousel";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import { MacbookFrame3D } from "@/components/MacbookFrame3D";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, { openErkenChat } from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "One platform runs your business. Erken teaches you how.",
    body: "If you can answer your phone, you can run this. Every business runs the same pipeline — leads come in, get captured, get tracked, get reported on. The platform runs all four steps. And Erken — the assistant living on every screen — shows you the right button and walks you through any task, out loud. $97 a month after a free week. The assistant is free.",
    cta: "Try for free",
  },
  {
    side: "right" as const,
    kicker: "Step 1 · Lead generation",
    headline: "Where your next ten customers come from.",
    body: "Funnels and landing pages that capture attention. Forms and surveys that qualify it. A social planner that keeps your pages alive. Review automation that grows your Google rating — the first thing local customers check. And when a call gets missed, an instant text-back brings the lead back before they dial a competitor. Every channel lands structured, ready for the next step.",
  },
  {
    side: "left" as const,
    kicker: "Step 2 · Lead capture",
    headline: "Every channel answered.",
    body: "Your phone, your inbox, your DMs, your forms — all wired into one pipeline. The AI voice receptionist picks up in two rings. The web chat books appointments. WhatsApp and Instagram DMs route through the same flow. Missed calls trigger an instant text-back. Leads can come from anywhere — they all land in one place.",
  },
  {
    side: "right" as const,
    kicker: "Step 3 · Lead management",
    headline: "Every lead tracked, every follow-up automated.",
    body: "Your branded CRM, your pipeline, your automation — all in one place. Leads come in, get scored, get routed, get followed up — no manual touchpoints. Calendar, SMS, email, funnels, integrations to your tools. The platform sets up before you log in, so you don't learn anything — you just use it.",
  },
  {
    side: "left" as const,
    kicker: "Step 4 · The control panel",
    headline: "Your whole operation, one screen.",
    body: "Calls, chats, forms, emails, deals — all visible in one dashboard. Workflow automation runs underneath everything, moving data between tools without you touching a thing. You see exactly where every customer is. Your operation runs. You read the dashboard.",
  },
];

type SectionData = (typeof SECTIONS)[number];

const DEFAULT_MEDIA_WRAPPER = (isLeft: boolean) =>
  `absolute -top-[55vh] -bottom-[10vh] ${isLeft ? "-right-12" : "-left-12"} hidden md:flex md:w-[90%] items-center justify-center px-2 lg:px-4 pointer-events-none`;

function Section({
  kicker,
  headline,
  body,
  side,
  cta,
  media,
  mediaWrapperClassName,
  isMobile = false,
}: SectionData & {
  media?: React.ReactNode;
  mediaWrapperClassName?: string;
  isMobile?: boolean;
}) {
  const isLeft = side === "left";
  const wrapperClass = mediaWrapperClassName ?? DEFAULT_MEDIA_WRAPPER(isLeft);
  return (
    <section
      className={`relative px-6 md:px-12 py-10 ${
        isMobile && media ? "md:py-16" : "md:min-h-screen md:flex md:items-center md:py-0"
      }`}
    >
      <div
        className={`relative z-30 w-full md:w-[44%] ${isLeft ? "md:mr-auto" : "md:ml-auto"} max-w-xl`}
      >
        <div className="mono-label">{kicker}</div>
        <h2
          className="mt-3 text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {headline}
        </h2>
        <p className="mt-5 text-base xl:text-lg text-text-muted leading-relaxed">{body}</p>
        {cta && (
          <a
            href="/start"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            {cta} →
          </a>
        )}
      </div>
      {media && isMobile && <div className="mt-10 w-full">{media}</div>}
      {media && !isMobile && <div className={wrapperClass}>{media}</div>}
    </section>
  );
}

export default function BigBangCombinedPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const compute = () => setIsMobile(window.innerWidth < 768);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Pinned Erken bot menu (text / voice / feedback / roadmap). Same actions
  // as the homepage, minus the roaming/dragon/dust machinery.
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPanel, setMenuPanel] = useState<"feedback" | "roadmap" | null>(null);
  const [fbText, setFbText] = useState("");
  const [fbState, setFbState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const closeMenu = () => {
    setMenuOpen(false);
    setMenuPanel(null);
    setFbText("");
    setFbState("idle");
  };
  const sendSiteFeedback = async () => {
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

  const mediaFor = (i: number): React.ReactNode =>
    i === 0 ? <Scene1IntroVideo />
    : i === 1 ? <Scene2Channels />
    : i === 2 ? <Scene3LeadCaptureCarousel />
    : i === 3 ? <Scene4LeadMgmtCarousel />
    : i === 4 ? <MacbookFrame3D />
    : null;

  const mediaWrapperFor = (i: number): string | undefined =>
    i === 0
      ? "absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
      : i === 2
      ? "absolute inset-y-[8vh] left-[48vw] right-[3vw] 2xl:left-[42vw] hidden md:flex items-center justify-center pointer-events-auto"
      : i === 1 || i === 3
      ? "absolute inset-y-[8vh] left-[4vw] right-[48vw] 2xl:right-auto 2xl:w-[55%] hidden md:flex items-center justify-start pointer-events-auto"
      : i === 4
      ? "absolute inset-y-0 left-[44vw] right-0 min-[1920px]:left-0 hidden md:flex items-center justify-center px-2 lg:px-4 pointer-events-none"
      : undefined;

  return (
    <>
      {/* Big Bang particle sphere — fixed background (above the body bg). */}
      <BigBangSphere />
      {/* Subtle dim between the sphere and content so particles never fight
          the copy for legibility. */}
      <div aria-hidden className="fixed inset-0 z-[1] bg-bg/55 pointer-events-none" />

      <main className="relative z-10">
        {SECTIONS.map((s, i) => (
          <Section
            key={i}
            isMobile={isMobile}
            {...s}
            media={mediaFor(i)}
            mediaWrapperClassName={mediaWrapperFor(i)}
          />
        ))}

        {/* "Built for your industry" — full-width, below the four steps. */}
        <section className="relative px-6 md:px-12 pt-36 md:pt-52 pb-16 md:pb-24">
          <div className="relative z-30 max-w-3xl mx-auto mb-6 md:mb-8 text-center">
            <div className="mono-label">Built for your industry</div>
            <h2
              className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              Pre-configured for what you actually do.
            </h2>
            <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
              Sixteen industries with the pipeline already wired for your operation. Voice
              scripts in your language. Intake forms with the questions that matter. Pipeline
              stages that match your sales cycle. Click your industry to see what comes pre-built.
            </p>
          </div>
          <div className="relative z-10">
            <SceneIndustriesCarousel />
          </div>
        </section>

        {/* Meet Erken — the assistant sold as a product. */}
        <section className="relative px-6 md:px-12 pt-24 md:pt-36 pb-16 md:pb-24">
          <div className="relative z-30 max-w-3xl mx-auto text-center">
            <div className="mono-label">Meet Erken</div>
            <h2
              className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              The assistant who teaches you the whole platform.
            </h2>
            <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
              Ask anything — by voice or text. Erken points at the real button and walks you
              through the whole task, step by step, out loud. It lives on this site, in your
              browser as an extension, and soon on your desktop. It learns new skills constantly —
              and your votes decide what it learns next. Free.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
              >
                🧩 Add Erken to your browser — free
              </a>
              <a
                href="/start"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-colors hover:border-border-strong hover:bg-surface"
              >
                Start the platform&apos;s free week →
              </a>
            </div>
          </div>
        </section>

        <div className="h-[20vh]" />
      </main>

      {/* Pinned Erken bot — fixed bottom-RIGHT so it already sits beside the
          GHL chat panel when it opens (Shamil 2026-06-16: no jumping needed).
          No roaming / dragon / dust. */}
      <div
        className="fixed z-40 right-[7vw] bottom-[1vh] md:right-[6vw] md:bottom-[1.5vh]"
        style={{ transform: "scale(0.62)", transformOrigin: "bottom right" }}
      >
        <CellDragonSprite
          scale={1}
          pointDirection="left"
          showOuterShell={false}
          bubbleText={null}
          onClick={() => {
            setMenuPanel(null);
            setMenuOpen((v) => !v);
          }}
        />
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[55]" aria-hidden onClick={closeMenu} />
          <div
            role="menu"
            aria-label="How would you like to talk to Erken?"
            className="fixed z-[56] right-[5vw] bottom-[24vh] flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md"
          >
            {menuPanel === null && (
              <>
                <div className="px-3 pb-1 pt-1 text-xs text-white/55">Talk to Erken</div>
                <button
                  role="menuitem"
                  onClick={() => {
                    closeMenu();
                    openErkenChat();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">💬</span> Text chat
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    closeMenu();
                    window.__startErkenVoiceCall?.();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🎙️</span> Voice chat
                </button>
                <div className="mx-2 h-px bg-white/10" aria-hidden />
                <button
                  role="menuitem"
                  onClick={() => setMenuPanel("feedback")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">📝</span> Feedback
                </button>
                <button
                  role="menuitem"
                  onClick={() => setMenuPanel("roadmap")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🗺️</span> Roadmap
                </button>
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
                  <div>📚 <b>New skills in training:</b> Excel &amp; Google Sheets, Canva, QuickBooks — taught step by step</div>
                  <div>🔊 Voice answers on every page</div>
                  <div>🧠 <b>Personal memory:</b> Erken remembers you — your business, your setup, what you&apos;ve learned</div>
                  <div>🖥️ <b>Desktop version on the way</b> — it can do tasks on your computer for you</div>
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
                <div className="pb-1.5 text-xs text-white/55">Your feedback — bugs, ideas, anything</div>
                {fbState === "sent" ? (
                  <div className="py-2 text-sm text-white">✅ Got it — passed along. Thank you!</div>
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
                      onClick={sendSiteFeedback}
                      disabled={fbState === "sending" || !fbText.trim()}
                      className="mt-1.5 w-full rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:opacity-40"
                    >
                      {fbState === "sending" ? "Sending…" : fbState === "error" ? "Couldn't send — try again" : "Send"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Chat + voice machinery (panels + window.__startErkenVoiceCall). */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />
    </>
  );
}
