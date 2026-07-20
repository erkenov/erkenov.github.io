"use client";

import { motion } from "framer-motion";
import { Phone, Users, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ============================================================== */
/*  Generic FeatureBlock — text + mock dashboard side by side      */
/* ============================================================== */

interface FeatureBlockProps {
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  mockup: ReactNode;
  reverse?: boolean;
  id?: string;
}

function FeatureBlock({
  kicker,
  title,
  description,
  bullets,
  mockup,
  reverse,
  id,
}: FeatureBlockProps) {
  return (
    <section
      id={id}
      className="border-b border-border/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div
          className={cn(
            "grid items-center gap-12 md:grid-cols-12 md:gap-16",
            reverse && "md:[&>*:first-child]:order-2",
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="md:col-span-5"
          >
            <div className="mono-label">{kicker}</div>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
            >
              {title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
              {description}
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-text">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="md:col-span-7"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-accent/5">
              {mockup}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================== */
/*  Feature 1 — AI Voice Receptionist                              */
/* ============================================================== */

export function FeatureVoice() {
  return (
    <FeatureBlock
      id="ai-voice"
      kicker="01 · AI VOICE RECEPTIONIST"
      title="Picks up every call. Sounds like your business."
      description="Answers in your business's name, asks the right qualifying questions, and books the customer into your calendar — 24/7, in English or Spanish. Trained on your services, your prices, and the way you actually talk."
      bullets={[
        "Trained on your service menu and pricing",
        "Handles after-hours, lunch breaks, and overflow",
        "Logs the call recording + a written transcript",
        "Escalates urgent or angry callers with a direct callback",
      ]}
      mockup={<MockCallTranscript />}
    />
  );
}

function MockCallTranscript() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border bg-bg/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Call · 2:14</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Recording
        </div>
      </div>
      <div className="space-y-3 p-5 text-sm">
        <Bubble who="ai" t="Thanks for calling — what can I help your business with today?" />
        <Bubble who="caller" t="I'm hoping to book an appointment for later this week." />
        <Bubble who="ai" t="Sure. What kind of service, and any preferred day?" />
        <Bubble who="caller" t="Just a general consultation. Thursday afternoon if possible." />
        <Bubble who="ai" t="I have Thursday at 2 p.m. open. Consultations are 30 minutes. Want me to book you in?" />
        <Bubble who="caller" t="That works. Maria Lopez." />
        <Bubble who="ai" t="Booked for Thursday at 2 p.m. for Maria. I'll text you a confirmation right now. Anything else?" />
      </div>
      <div className="flex items-center justify-between border-t border-border bg-bg/60 px-5 py-3 text-xs text-text-dim">
        <span>Intent: consultation · Urgency: standard · Est. value: $230</span>
        <span className="text-accent">→ Booked</span>
      </div>
    </div>
  );
}

/* ============================================================== */
/*  Feature 2 — CRM                                                */
/* ============================================================== */

export function FeatureCrm() {
  return (
    <FeatureBlock
      reverse
      id="crm"
      kicker="02 · CRM & CONTACT TIMELINE"
      title="Every caller becomes a contact, automatically."
      description="The system logs every call into a CRM under your brand. You get a full timeline per customer — calls, texts, bookings, no-shows, repeat visits. Nothing falls through the cracks."
      bullets={[
        "White-labelled CRM, branded as yours",
        "Auto-tagged by service type and urgency",
        "Texts the customer confirmations and reminders",
        "Marks no-shows and triggers a follow-up sequence",
      ]}
      mockup={<MockCrmDetail />}
    />
  );
}

function MockCrmDetail() {
  return (
    <div>
      <div className="border-b border-border bg-bg/60 px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">James Miller</div>
            <div className="font-mono text-xs text-text-dim">(555) 014-2233 · Customer since Apr 2026</div>
          </div>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
            Loyal · 4 visits
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        <div className="bg-surface p-4">
          <div className="text-[10px] uppercase tracking-wider text-text-dim">Lifetime value</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-accent">$2,340</div>
        </div>
        <div className="bg-surface p-4">
          <div className="text-[10px] uppercase tracking-wider text-text-dim">Source</div>
          <div className="mt-1 text-sm">Inbound call · website</div>
        </div>
        <div className="bg-surface p-4">
          <div className="text-[10px] uppercase tracking-wider text-text-dim">Next follow-up</div>
          <div className="mt-1 text-sm">Auto-scheduled · 3 wk</div>
        </div>
      </div>
      <div className="p-5">
        <div className="mono-label">Timeline</div>
        <div className="mt-4 space-y-3 text-sm">
          <TimelineRow date="Today, 9:42 AM" event="AI booked Thursday 2 p.m. — service consultation" />
          <TimelineRow date="May 4 · 11:20 AM" event="Follow-up call · paid $74" />
          <TimelineRow date="Apr 12 · 4:55 PM" event="Service appointment · paid $140" />
          <TimelineRow date="Apr 03 · 10:10 AM" event="First contact — initial consultation · paid $186" muted />
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ date, event, muted }: { date: string; event: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" style={{ opacity: muted ? 0.4 : 1 }} />
      <div className="min-w-0">
        <div className={cn("text-xs", muted ? "text-text-dim" : "text-text-muted")}>{date}</div>
        <div className={cn("text-sm", muted ? "text-text-muted" : "text-text")}>{event}</div>
      </div>
    </div>
  );
}

/* ============================================================== */
/*  Feature 3 — Lead Gen                                           */
/* ============================================================== */

export function FeatureLeadGen() {
  return (
    <FeatureBlock
      id="leadgen"
      kicker="03 · LEAD GENERATION"
      title="Finds new leads in your area. Every morning."
      description="A scraper monitors Google Maps, Yelp, and other public sources for businesses or prospects matching your ideal customer profile, scores them on fit, and queues them for outreach."
      bullets={[
        "Targets prospects matching YOUR ideal customer profile",
        "Scores by review count, ratings, digital signals",
        "Drafts personalized outreach per prospect",
        "Daily run at 6 a.m. — wake up to a fresh queue",
      ]}
      mockup={<MockLeadPipeline />}
    />
  );
}

function MockLeadPipeline() {
  const cols = [
    { name: "Discovered", count: 142, items: ["Westside Wellness", "Highway 7 Garage", "PrecisionTune Clinic"] },
    { name: "Scored ≥ 70", count: 38, items: ["Easy Fix Motors", "Bay Area Auto Care", "Northside Mechanics"] },
    { name: "Outreach sent", count: 12, items: ["Quick Lube Direct", "TopGear Service", "Auto Doctors Plus"] },
    { name: "Replied", count: 3, items: ["Westside Wellness", "TopGear Service"] },
  ];
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border bg-bg/60 px-5 py-3">
        <div className="text-sm font-medium">Lead pipeline</div>
        <div className="font-mono text-xs text-text-dim">Updated 14 min ago</div>
      </div>
      <div className="grid grid-cols-4 gap-px bg-border">
        {cols.map((c) => (
          <div key={c.name} className="bg-surface p-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-text-dim">{c.name}</div>
              <span className="font-mono text-xs text-accent">{c.count}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {c.items.map((it) => (
                <div
                  key={it}
                  className="truncate rounded border border-border bg-bg/60 px-2 py-1.5 text-xs text-text-muted"
                >
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border bg-bg/40 px-5 py-2 font-mono text-[10px] text-text-dim">
        Sources: Google Maps · Yelp · Yell.com · Trustpilot
      </div>
    </div>
  );
}

/* ============================================================== */
/*  Feature 4 — Reporting                                          */
/* ============================================================== */

export function FeatureReporting() {
  return (
    <FeatureBlock
      reverse
      id="reporting"
      kicker="04 · MONTHLY REPORTING"
      title="One report. Every number that matters."
      description="On the 1st of every month you get a 1-page summary — calls answered, calls missed, bookings, revenue captured, customer retention. Open it on your phone, screenshot it for the team."
      bullets={[
        "Auto-emailed PDF, 1 page",
        "Compared against your prior 30 days",
        "Flagged anomalies (e.g. 'callback rate up 12%')",
        "Optional weekly version if you want it",
      ]}
      mockup={<MockReport />}
    />
  );
}

function MockReport() {
  return (
    <div>
      <div className="border-b border-border bg-bg/60 px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="mono-label">May 2026 · Your Business</div>
            <div className="mt-0.5 text-sm font-medium">Monthly system report</div>
          </div>
          <BarChart3 className="h-4 w-4 text-accent" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <ReportTile label="Calls answered" value="318" delta="+12%" positive />
        <ReportTile label="Calls missed" value="4" delta="-71%" positive />
        <ReportTile label="Bookings made" value="184" delta="+27%" positive />
        <ReportTile label="Revenue captured" value="$48,720" delta="+22%" positive highlight />
      </div>
      <div className="p-5">
        <div className="mono-label">Anomalies</div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="rounded-lg border border-border bg-bg/40 p-3">
            <div className="text-xs text-text-dim">Mon, May 6</div>
            <div className="mt-1">Spike of 14 service calls — likely a local weather event.</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/40 p-3">
            <div className="text-xs text-text-dim">Wed, May 22</div>
            <div className="mt-1">Callback rate up 12% — agent misheard 3 ZIP codes; prompt updated.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportTile({
  label,
  value,
  delta,
  positive,
  highlight,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="bg-surface p-5">
      <div className="text-[10px] uppercase tracking-wider text-text-dim">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className={cn("font-mono text-2xl font-semibold", highlight ? "text-accent" : "text-text")}>
          {value}
        </div>
        <div className={cn("text-xs", positive ? "text-success" : "text-text-dim")}>
          {delta} vs last 30d
        </div>
      </div>
    </div>
  );
}

/* shared bubble used in MockCallTranscript */
function Bubble({ who, t }: { who: "caller" | "ai"; t: string }) {
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "shrink-0 font-mono text-[10px] uppercase tracking-wider",
          who === "ai" ? "text-accent" : "text-text-dim",
        )}
        style={{ width: 44 }}
      >
        {who === "ai" ? "AI" : "Caller"}
      </div>
      <div className={who === "ai" ? "text-text" : "text-text-muted"}>{t}</div>
    </div>
  );
}

/* unused icons re-exported to silence lint when tree-shaking */
export { Users, TrendingUp };
