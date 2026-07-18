"use client";

/**
 * 7 · Final CTA + the form — the CRM engine of the page.
 * Field set mirrors the KPost intake skeleton; POSTs to /api/storm-lead,
 * which upserts a GoHighLevel contact (or no-ops in demo mode).
 * `propertyType` is pre-selected by the hero fork via the parent.
 */

import { useState } from "react";
import styles from "../storm.module.css";
import { Icon, Reveal, SectionHeading } from "./primitives";
import {
  HEARD_OPTIONS,
  HELP_OPTIONS,
  PHONE_DISPLAY,
  PHONE_TEL,
  type PropertyType,
} from "./data";

const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none transition-colors focus:border-accent";
const labelCls = "mb-1.5 block font-mono text-xs tracking-wider text-text-muted uppercase";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

export function LeadForm({ propertyType, onPropertyType }: {
  propertyType: PropertyType;
  onPropertyType: (t: PropertyType) => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const r = await fetch("/api/storm-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json().catch(() => ({}));
      setStatus(r.ok && d.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        {/* CTA copy column */}
        <div className="lg:pt-8">
          <SectionHeading
            kicker="Free inspection"
            title="Tell us what happened up there."
            sub="Fill this out and a roofer — not a sales rep — calls you back the same business day. Storm emergency? Skip the form:"
          />
          <Reveal delay={0.1}>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-6 inline-flex items-center gap-3 rounded-lg border border-border bg-surface px-6 py-4 text-lg font-semibold transition-colors hover:border-accent"
            >
              <Icon name="phone" className="h-5 w-5 text-accent" />
              {PHONE_DISPLAY}
            </a>
            <ul className="mt-10 grid gap-4">
              {[
                "Same-business-day callback from a working roofer",
                "Free roof inspection with photos you keep either way",
                "Straight answer — including “your roof is fine”",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-text-muted">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* The form */}
        <Reveal delay={0.12}>
          {status === "done" ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-border bg-surface p-10 text-center">
              <Icon name="check" className="h-10 w-10 text-success" />
              <h3 className="mt-4 text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                Got it. We&apos;re on it.
              </h3>
              <p className="mt-3 max-w-sm text-sm text-text-muted" style={{ lineHeight: 1.6 }}>
                Your request is in our system and a roofer will call you back
                the same business day. If water is coming in right now, call{" "}
                <a href={`tel:${PHONE_TEL}`} className="text-accent">{PHONE_DISPLAY}</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-8 md:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name *">
                    <input name="name" required autoComplete="name" placeholder="Jordan Walker" className={inputCls} />
                  </Field>
                </div>
                <Field label="Phone *">
                  <input name="phone" type="tel" required autoComplete="tel" placeholder="(214) 555-0148" className={inputCls} />
                </Field>
                <Field label="Email">
                  <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} />
                </Field>

                <Field label="New customer?">
                  <select name="newCustomer" defaultValue="yes" className={inputCls}>
                    <option value="yes">Yes — first time calling</option>
                    <option value="no">No — you&apos;ve worked on my roof</option>
                  </select>
                </Field>
                <Field label="What can we help with?">
                  <select name="helpWith" defaultValue={HELP_OPTIONS[2]} className={inputCls}>
                    {HELP_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <span className={labelCls}>Residential or commercial?</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(["residential", "commercial"] as const).map((t) => (
                      <label
                        key={t}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm capitalize transition-colors ${
                          propertyType === t
                            ? "border-accent bg-[var(--accent-soft)] font-semibold text-accent"
                            : "border-border bg-surface-2 font-medium text-text-muted hover:border-border-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name="propertyType"
                          value={t}
                          checked={propertyType === t}
                          onChange={() => onPropertyType(t)}
                          className="sr-only"
                        />
                        <Icon name={t === "residential" ? "house" : "warehouse"} className="h-4 w-4 text-accent" />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Address / job site">
                    <input name="address" autoComplete="street-address" placeholder="4127 Maple Hollow Dr" className={inputCls} />
                  </Field>
                </div>
                <Field label="City">
                  <input name="city" autoComplete="address-level2" placeholder="Richardson" className={inputCls} />
                </Field>
                <Field label="ZIP">
                  <input name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="75081" className={inputCls} />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="How did you hear about us?">
                    <select name="hearAbout" defaultValue={HEARD_OPTIONS[0]} className={inputCls}>
                      {HEARD_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className={`${styles.forkBtn} mt-8 w-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-accent-hover disabled:opacity-60`}
              >
                {status === "sending" ? "Sending…" : "Request my free inspection"}
              </button>
              {status === "error" && (
                <p className="mt-4 text-center text-sm text-text-muted">
                  Something glitched on our end. Call us instead —{" "}
                  <a href={`tel:${PHONE_TEL}`} className="text-accent">{PHONE_DISPLAY}</a>.
                </p>
              )}
              <p className="mt-4 text-center font-mono text-xs text-text-dim">
                No spam, no reselling your info. A roofer calls — that&apos;s it.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={`${styles.dark} border-t border-border`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center md:px-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Storm Roofing Heroes</span>
        </div>
        <p className="font-mono text-xs text-text-dim">
          Serving the Dallas–Fort Worth metroplex since 2016 · Licensed &amp; insured in Texas ·{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-text-muted hover:text-accent">{PHONE_DISPLAY}</a>
        </p>
        <p className="font-mono text-xs text-text-dim">
          © {new Date().getFullYear()} Storm Roofing Heroes. Demo site — all company details are placeholder data.
        </p>
      </div>
    </footer>
  );
}
