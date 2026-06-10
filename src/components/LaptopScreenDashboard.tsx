"use client";

/**
 * LaptopScreenDashboard — a live-looking Erken Systems control panel that
 * renders ON the MacBook screen in Step 4 (the Control Panel section).
 *
 * Replaces the deleted Scene5ControlPanelCarousel as a *visual*: instead of
 * a separate swipeable carousel, the control-panel modules now cycle as
 * dashboard "views" inside the 3D laptop's screen, so the section reads as
 * a real CRM running on the machine (Shamil 2026-06-06).
 *
 * Auto-rotates through four desktop views drawn from the old control-panel
 * cards: Overview KPIs, Unified inbox, Live activity feed, Workflow
 * automations. (The 5th card — "mobile app for owners" — is intentionally
 * dropped here; a phone UI doesn't belong on a laptop screen.)
 *
 * Pure CSS/React — no WebGL. It's positioned as an overlay over the laptop's
 * screen rectangle by MacbookFrame3D.
 */

import { useEffect, useState } from "react";

const VIEWS = ["overview", "inbox", "activity", "automations"] as const;
type View = (typeof VIEWS)[number];

const NAV: { view: View; label: string; glyph: string }[] = [
  { view: "overview", label: "Overview", glyph: "▦" },
  { view: "inbox", label: "Inbox", glyph: "✉" },
  { view: "activity", label: "Activity", glyph: "⟂" },
  { view: "automations", label: "Workflows", glyph: "⚙" },
];

export function LaptopScreenDashboard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % VIEWS.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const view = VIEWS[active];

  return (
    <div
      className="w-full h-full overflow-hidden flex text-[#E8EFE9]"
      style={{
        background:
          "radial-gradient(120% 120% at 20% 0%, #16241d 0%, #0c140f 60%, #080d0a 100%)",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      {/* Left nav rail */}
      <div
        className="flex flex-col items-stretch justify-start gap-[2%] py-[3%] px-[2.5%] shrink-0"
        style={{ width: "20%", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-[6%] mb-[8%] px-[4%]">
          <span
            className="inline-block rounded-[3px]"
            style={{ width: "0.55em", height: "0.55em", background: "#7ea687" }}
          />
          <span className="font-semibold tracking-tight text-[clamp(7px,1.4vw,13px)] truncate">
            Erken Systems
          </span>
        </div>
        {NAV.map((n, i) => {
          const on = i === active;
          return (
            <div
              key={n.view}
              className="flex items-center gap-[6%] rounded-[6px] px-[6%] py-[5%] transition-colors"
              style={{
                background: on ? "rgba(126,166,135,0.16)" : "transparent",
                color: on ? "#CDEBD2" : "rgba(232,239,233,0.5)",
              }}
            >
              <span
                className="text-[clamp(7px,1.3vw,12px)] leading-none"
                style={{ color: on ? "#7ea687" : "rgba(232,239,233,0.4)" }}
              >
                {n.glyph}
              </span>
              <span className="text-[clamp(6px,1.1vw,11px)] font-medium truncate">
                {n.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-[4%] py-[3%] shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[clamp(7px,1.4vw,13px)] font-semibold tracking-tight capitalize">
            {NAV[active].label}
          </span>
          <div className="flex items-center gap-[4%]">
            <span
              className="flex items-center gap-[0.4em] text-[clamp(5px,0.95vw,10px)]"
              style={{ color: "#7ea687" }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: "0.45em", height: "0.45em", background: "#7ea687" }}
              />
              Live
            </span>
            <span
              className="inline-block rounded-full"
              style={{
                width: "1.5em",
                height: "1.5em",
                background:
                  "linear-gradient(135deg, #C76B58 0%, #E89F1F 100%)",
              }}
            />
          </div>
        </div>

        {/* View content (keyed so it cross-fades on change) */}
        <div className="flex-1 min-h-0 relative">
          <div key={view} className="absolute inset-0 dash-fade px-[4%] py-[3.5%]">
            {view === "overview" && <OverviewView />}
            {view === "inbox" && <InboxView />}
            {view === "activity" && <ActivityView />}
            {view === "automations" && <AutomationsView />}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dashFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dash-fade {
          animation: dashFadeIn 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}

/* ---------- Views ---------- */

function OverviewView() {
  const tiles = [
    { label: "New leads", value: "18", delta: "+9%", up: true, c: "#7ea687" },
    { label: "Booked", value: "12", delta: "+4%", up: true, c: "#E89F1F" },
    { label: "Won", value: "7", delta: "+2", up: true, c: "#C76B58" },
    { label: "Revenue", value: "$14.2k", delta: "+11%", up: true, c: "#8B7BB8" },
  ];
  const bars = [42, 58, 35, 70, 52, 64, 48];
  return (
    <div className="w-full h-full flex flex-col gap-[4%]">
      <div className="grid grid-cols-2 gap-[3%]">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-[7px] px-[7%] py-[6%]"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-[clamp(5px,0.95vw,10px)] text-[rgba(232,239,233,0.5)]">
              {t.label}
            </div>
            <div className="flex items-baseline gap-[0.5em]">
              <span
                className="font-bold tracking-tight text-[clamp(11px,2.1vw,20px)]"
                style={{ color: "#F2F6F2" }}
              >
                {t.value}
              </span>
              <span
                className="text-[clamp(5px,0.9vw,9px)] font-medium"
                style={{ color: t.c }}
              >
                ▲ {t.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex-1 min-h-0 rounded-[7px] px-[5%] py-[4%] flex flex-col"
        style={{
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="text-[clamp(5px,0.95vw,10px)] text-[rgba(232,239,233,0.5)] mb-[3%]">
          Leads · last 7 days
        </div>
        <div className="flex-1 min-h-0 flex items-end gap-[3%]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${h}%`,
                background:
                  i === bars.length - 1
                    ? "#7ea687"
                    : "rgba(126,166,135,0.4)",
              }}
            />
          ))}
        </div>
      </div>
      <div className="text-[clamp(5px,0.95vw,10px)] text-[rgba(232,239,233,0.6)] leading-snug">
        You&apos;re at 14 of 20 leads — slightly behind pace. Booked rate up,
        revenue per booking steady.
      </div>
    </div>
  );
}

function InboxView() {
  const rows = [
    { name: "Marcus T.", ch: "Call", snip: "Need a quote for a re-roof…", tag: "Quote", c: "#7ea687", t: "2m" },
    { name: "Instagram DM", ch: "IG", snip: "Do you do gutter work?", tag: "Booking", c: "#E89F1F", t: "8m" },
    { name: "Dana R.", ch: "Chat", snip: "Storm damage, insurance…", tag: "Hot", c: "#C76B58", t: "14m" },
    { name: "WhatsApp", ch: "WA", snip: "Reschedule Thursday?", tag: "Service", c: "#8B7BB8", t: "31m" },
    { name: "form@site", ch: "Form", snip: "Free estimate request", tag: "Quote", c: "#7ea687", t: "1h" },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-[2.5%]">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-[3%] rounded-[6px] px-[4%] py-[3%]"
          style={{
            background: i === 0 ? "rgba(126,166,135,0.10)" : "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span
            className="shrink-0 rounded-[4px] text-center text-[clamp(4px,0.8vw,8px)] font-semibold py-[0.3em]"
            style={{
              width: "2.6em",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(232,239,233,0.65)",
            }}
          >
            {r.ch}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[clamp(5px,1vw,11px)] font-medium truncate text-[#EDF3ED]">
              {r.name}
            </div>
            <div className="text-[clamp(4px,0.85vw,9px)] text-[rgba(232,239,233,0.45)] truncate">
              {r.snip}
            </div>
          </div>
          <span
            className="shrink-0 rounded-full text-[clamp(4px,0.8vw,8px)] font-medium px-[0.7em] py-[0.2em]"
            style={{ background: `${r.c}22`, color: r.c }}
          >
            {r.tag}
          </span>
          <span className="shrink-0 text-[clamp(4px,0.8vw,8px)] text-[rgba(232,239,233,0.35)]">
            {r.t}
          </span>
        </div>
      ))}
      <div
        className="mt-auto flex items-center gap-[1.5%] text-[clamp(4px,0.85vw,9px)]"
        style={{ color: "#7ea687" }}
      >
        <span>✓ AI reply drafted for Marcus T. — ready to approve</span>
      </div>
    </div>
  );
}

function ActivityView() {
  const events = [
    { dot: "#7ea687", text: "Call answered — booked estimate", t: "just now" },
    { dot: "#E89F1F", text: "Booking made · Tue 2:00 PM", t: "3m ago" },
    { dot: "#C76B58", text: "Payment received · $3,400", t: "12m ago" },
    { dot: "#8B7BB8", text: "Form filled — free estimate", t: "26m ago" },
    { dot: "#7ea687", text: "Review request sent · 5★ reply", t: "48m ago" },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-between">
        {events.map((e, i) => (
          <div key={i} className="flex items-center gap-[3%]">
            <span className="relative flex flex-col items-center self-stretch shrink-0" style={{ width: "0.8em" }}>
              <span
                className="rounded-full shrink-0 mt-[0.55em]"
                style={{ width: "0.5em", height: "0.5em", background: e.dot }}
              />
              {i < events.length - 1 && (
                <span
                  className="flex-1 w-px"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                />
              )}
            </span>
            <div
              className="flex-1 flex items-center justify-between rounded-[6px] px-[4%] py-[3.5%]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span className="text-[clamp(5px,1vw,11px)] text-[#EDF3ED] truncate">
                {e.text}
              </span>
              <span className="text-[clamp(4px,0.8vw,8px)] text-[rgba(232,239,233,0.4)] shrink-0 ml-[4%]">
                {e.t}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationsView() {
  const flows = [
    { name: "Missed-call text-back", state: "Running", c: "#7ea687" },
    { name: "Review request drip", state: "Running", c: "#7ea687" },
    { name: "Lead nurture sequence", state: "Paused", c: "#E89F1F" },
    { name: "Stripe payment webhook", state: "Healthy", c: "#7ea687" },
    { name: "No-show win-back", state: "Needs fix", c: "#C76B58" },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-[2.5%]">
      {flows.map((f, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-[6px] px-[4%] py-[3.5%]"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span className="flex items-center gap-[3%] min-w-0">
            <span
              className="inline-block rounded-full shrink-0"
              style={{ width: "0.5em", height: "0.5em", background: f.c }}
            />
            <span className="text-[clamp(5px,1vw,11px)] text-[#EDF3ED] truncate">
              {f.name}
            </span>
          </span>
          <span
            className="shrink-0 text-[clamp(4px,0.8vw,8px)] font-medium rounded-full px-[0.7em] py-[0.2em]"
            style={{ background: `${f.c}22`, color: f.c }}
          >
            {f.state}
          </span>
        </div>
      ))}
      <div className="mt-auto text-[clamp(4px,0.85vw,9px)] text-[rgba(232,239,233,0.5)]">
        12 workflows running · uptime 99.6% this week
      </div>
    </div>
  );
}
