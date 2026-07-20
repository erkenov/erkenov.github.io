"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Phone, Calendar, Users, TrendingUp, Mic, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

type TabId = "calls" | "crm" | "leads";

/**
 * Big stylized laptop frame containing a multi-tab dashboard mockup.
 * The whole thing is HTML/CSS — no real product behind it yet.
 * Auto-rotates through tabs every 5 seconds to suggest the breadth of the
 * platform without requiring the user to click.
 */
export function LaptopDemo() {
  const [tab, setTab] = useState<TabId>("calls");

  useEffect(() => {
    const id = setInterval(() => {
      setTab((t) => (t === "calls" ? "crm" : t === "crm" ? "leads" : "calls"));
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mono-label inline-block">The whole system</div>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            One platform.
            <span className="block text-accent">Three jobs, done.</span>
          </h2>
          <p className="mt-6 text-lg text-text-muted md:text-xl">
            AI answers the calls. CRM tracks every customer. Lead gen feeds the
            funnel. You see it all on one screen.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="mt-16 flex justify-center"
        >
          <Laptop>
            <div className="flex items-center gap-1.5 border-b border-border bg-bg/80 px-4 py-2">
              <TabPill
                active={tab === "calls"}
                onClick={() => setTab("calls")}
                icon={<Phone className="h-3 w-3" />}
              >
                Calls
              </TabPill>
              <TabPill
                active={tab === "crm"}
                onClick={() => setTab("crm")}
                icon={<Users className="h-3 w-3" />}
              >
                CRM
              </TabPill>
              <TabPill
                active={tab === "leads"}
                onClick={() => setTab("leads")}
                icon={<TrendingUp className="h-3 w-3" />}
              >
                Leads
              </TabPill>
              <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-dim">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Live
              </div>
            </div>
            <div className="relative h-[420px] overflow-hidden bg-bg">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                className="absolute inset-0"
              >
                {tab === "calls" && <CallsView />}
                {tab === "crm" && <CrmView />}
                {tab === "leads" && <LeadsView />}
              </motion.div>
            </div>
          </Laptop>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================== */
/*  Laptop frame                                                   */
/* ============================================================== */

function Laptop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-5xl">
      {/* Screen */}
      <div className="relative overflow-hidden rounded-t-2xl border border-border-strong bg-surface shadow-2xl shadow-accent/5">
        {children}
      </div>
      {/* Hinge + base */}
      <div className="relative mx-auto h-3 w-[105%] -translate-x-[2.5%] rounded-b-2xl bg-gradient-to-b from-border to-bg" />
      <div className="mx-auto h-1 w-1/4 rounded-b-md bg-border/60" />
    </div>
  );
}

function TabPill({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-accent/15 text-accent"
          : "text-text-dim hover:bg-surface-2 hover:text-text",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ============================================================== */
/*  Calls view                                                     */
/* ============================================================== */

function CallsView() {
  return (
    <div className="grid h-full grid-cols-12 gap-px bg-border">
      {/* Sidebar: recent calls */}
      <div className="col-span-4 overflow-auto bg-surface p-4">
        <div className="mono-label">Today · 12 calls</div>
        <div className="mt-4 space-y-1">
          <CallRow time="9:42 AM" name="James M." vehicle="2019 Civic" status="booked" />
          <CallRow time="9:17 AM" name="Maria L." vehicle="2021 RAV4" status="quoted" />
          <CallRow time="8:51 AM" name="Tom K." vehicle="2017 F-150" status="booked" />
          <CallRow time="8:23 AM" name="Aisha R." vehicle="2020 Camry" status="callback" />
          <CallRow time="7:48 AM" name="Diego F." vehicle="2018 Silverado" status="booked" />
          <CallRow time="7:30 AM" name="Sara P." vehicle="2022 CX-5" status="quoted" />
          <CallRow time="6:55 AM" name="Marcus W." vehicle="2019 Accord" status="callback" />
          <CallRow time="6:10 AM" name="Elena C." vehicle="2016 Tundra" status="booked" />
        </div>
      </div>

      {/* Main pane: active call detail */}
      <div className="col-span-8 bg-surface-2 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mono-label">Active call · 1:42</div>
            <h3 className="mt-2 text-xl font-semibold">James Miller</h3>
            <div className="mt-1 text-sm text-text-muted">2019 Honda Civic LX · 64,200 mi</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            On call
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Tile label="Intent" value="Brake service" />
          <Tile label="Urgency" value="High" />
          <Tile label="Est. value" value="$420" highlight />
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <Bubble role="caller" text="My brakes are making a grinding noise." />
          <Bubble role="ai" text="Sounds urgent — that's not safe to drive on. What year and model is the car?" />
          <Bubble role="caller" text="2019 Honda Civic." />
          <Bubble role="ai" text="Got it. We can fit you in tomorrow at 8 a.m. or Thursday at 2 p.m. Which works?" />
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-text-dim">
          <Mic className="h-3 w-3" />
          <span>Sam (AI) · ElevenLabs Adam · 11.6 kHz</span>
        </div>
      </div>
    </div>
  );
}

function CallRow({
  time,
  name,
  vehicle,
  status,
}: {
  time: string;
  name: string;
  vehicle: string;
  status: "booked" | "quoted" | "callback";
}) {
  const tag = {
    booked: { label: "Booked", className: "bg-success/15 text-success" },
    quoted: { label: "Quoted", className: "bg-accent/15 text-accent" },
    callback: { label: "Callback", className: "bg-text-dim/15 text-text-muted" },
  }[status];
  return (
    <div className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-surface-2">
      <div className="min-w-0">
        <div className="truncate text-sm text-text">{name}</div>
        <div className="truncate text-xs text-text-dim">
          {time} · {vehicle}
        </div>
      </div>
      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", tag.className)}>
        {tag.label}
      </span>
    </div>
  );
}

function Tile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-bg/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-text-dim">{label}</div>
      <div className={cn("mt-1 text-base font-semibold", highlight ? "text-accent" : "text-text")}>
        {value}
      </div>
    </div>
  );
}

function Bubble({ role, text }: { role: "caller" | "ai"; text: string }) {
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "shrink-0 font-mono text-[10px] uppercase tracking-wider",
          role === "ai" ? "text-accent" : "text-text-dim",
        )}
        style={{ width: 44 }}
      >
        {role === "ai" ? "AI" : "Caller"}
      </div>
      <div className={role === "ai" ? "text-text" : "text-text-muted"}>{text}</div>
    </div>
  );
}

/* ============================================================== */
/*  CRM view                                                       */
/* ============================================================== */

function CrmView() {
  const rows = [
    { name: "James Miller", phone: "(555) 014-2233", source: "Phone", value: 420, stage: "Scheduled" },
    { name: "Maria Lopez", phone: "(555) 098-1102", source: "Phone", value: 280, stage: "Quoted" },
    { name: "Tom Kowalski", phone: "(555) 411-0095", source: "Phone", value: 1450, stage: "Scheduled" },
    { name: "Aisha Robinson", phone: "(555) 220-7710", source: "Phone", value: 95, stage: "Callback" },
    { name: "Diego Fuentes", phone: "(555) 376-8841", source: "Phone", value: 720, stage: "Won" },
    { name: "Sara Patel", phone: "(555) 612-3345", source: "Web", value: 380, stage: "Quoted" },
    { name: "Marcus Webb", phone: "(555) 887-2210", source: "Phone", value: 150, stage: "Callback" },
    { name: "Elena Carter", phone: "(555) 122-4456", source: "Phone", value: 980, stage: "Won" },
  ];
  return (
    <div className="flex h-full flex-col bg-surface-2">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <div className="mono-label">CRM · Pipeline</div>
          <div className="mt-0.5 text-lg font-semibold">Today&apos;s contacts</div>
        </div>
        <div className="flex items-center gap-6">
          <Stat label="New" value="8" />
          <Stat label="Booked" value="3" />
          <Stat label="Value" value="$4,475" highlight />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg/40">
            <tr className="text-left text-[10px] uppercase tracking-wider text-text-dim">
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3 text-right">Est. value</th>
              <th className="px-6 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.name}
                className={cn(
                  "border-t border-border/60",
                  i % 2 === 0 ? "bg-surface-2" : "bg-surface",
                )}
              >
                <td className="px-6 py-3 text-text">{r.name}</td>
                <td className="px-6 py-3 font-mono text-xs text-text-muted">{r.phone}</td>
                <td className="px-6 py-3 text-text-muted">{r.source}</td>
                <td className="px-6 py-3 text-right font-mono text-text">${r.value}</td>
                <td className="px-6 py-3">
                  <StageBadge stage={r.stage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-dim">{label}</div>
      <div className={cn("text-lg font-semibold", highlight ? "text-accent" : "text-text")}>
        {value}
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    Scheduled: "bg-accent/15 text-accent",
    Quoted: "bg-text-dim/20 text-text-muted",
    Callback: "bg-bg text-text-muted border border-border",
    Won: "bg-success/15 text-success",
  };
  return (
    <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", map[stage] || "")}>
      {stage}
    </span>
  );
}

/* ============================================================== */
/*  Leads view                                                     */
/* ============================================================== */

function LeadsView() {
  const shops = [
    { name: "Riverside Wellness Clinic", city: "London, UK", rating: 3.4, score: 92, status: "Drafting outreach" },
    { name: "Highway 7 Dental", city: "Manchester, UK", rating: 3.8, score: 86, status: "Drafting outreach" },
    { name: "PrecisionFit Birmingham", city: "Birmingham, UK", rating: 3.6, score: 81, status: "Email sent" },
    { name: "Easy Fix Motors", city: "Leeds, UK", rating: 4.1, score: 78, status: "Email sent" },
    { name: "Bay Area Coffee Roasters", city: "Bristol, UK", rating: 3.2, score: 74, status: "Replied" },
    { name: "Northside Mechanics", city: "Liverpool, UK", rating: 3.9, score: 71, status: "Email sent" },
  ];
  return (
    <div className="flex h-full flex-col bg-surface-2">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <div className="mono-label">Lead gen · matched to your ICP</div>
          <div className="mt-0.5 text-lg font-semibold">Prospects, scored & queued</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-text-muted">
            <Clock className="mr-1 inline h-3 w-3" />
            Last scrape · 14 min ago
          </div>
          <div className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-bg">
            142 new
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-2">
          {shops.map((s) => (
            <div
              key={s.name}
              className="grid grid-cols-12 items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <div className="col-span-5">
                <div className="text-sm font-medium text-text">{s.name}</div>
                <div className="text-xs text-text-dim">{s.city}</div>
              </div>
              <div className="col-span-2 text-sm text-text-muted">★ {s.rating}</div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-accent">{s.score}</span>
                </div>
              </div>
              <div className="col-span-3 text-right text-xs text-text-muted">
                {s.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border bg-bg/40 px-6 py-2 font-mono text-xs text-text-dim">
        Google Maps · Yelp · Erken platform · Cron 06:00 UTC daily
      </div>
    </div>
  );
}

/* ============================================================== */
/*  Calendar icon import — needed by tab pill — re-export here     */
/* ============================================================== */
export { Calendar };
