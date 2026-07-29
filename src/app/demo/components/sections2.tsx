"use client";

/**
 * /demo/[industry] template sections, part 2: Testimonials, FAQ,
 * Booking (live GHL form → AI callback), CTA band, Footer, and the
 * floating "Demo site by Erken Systems" badge.
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, MapPin, Mic, Phone, Star } from "lucide-react";
import type { DemoConfig } from "../config";
import { Reveal, SectionHeading } from "./primitives";
import { startDemoCall } from "./sections";

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export function TestimonialsSection({ config }: { config: DemoConfig }) {
  const t = config.testimonials;
  if (!t) return null;
  return (
    <section
      className="border-y"
      style={{ borderColor: "var(--d-border)", background: "var(--d-surface2)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
        <SectionHeading kicker={t.kicker} headline={t.headline} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <figure
                className="flex h-full flex-col rounded-2xl border p-8"
                style={{
                  background: "var(--d-surface)",
                  borderColor: "var(--d-border)",
                }}
              >
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4"
                      style={{ color: "var(--d-accent)", fill: "var(--d-accent)" }}
                    />
                  ))}
                </div>
                <blockquote
                  className="mt-5 flex-1 text-sm"
                  style={{ color: "var(--d-text)", lineHeight: 1.7 }}
                >
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {item.image ? (
                    <span
                      className="relative h-10 w-10 overflow-hidden rounded-full border"
                      style={{ borderColor: "var(--d-border)" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-medium"
                      style={{
                        background: "var(--d-accent-soft)",
                        color: "var(--d-accent)",
                      }}
                    >
                      {item.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--d-text)" }}
                    >
                      {item.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--d-text-dim)" }}>
                      {item.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl border"
      style={{ background: "var(--d-surface)", borderColor: "var(--d-border)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className="text-base font-semibold"
          style={{ color: "var(--d-text)", letterSpacing: "-0.01em" }}
        >
          {q}
        </span>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform duration-200"
          style={{
            color: "var(--d-text-dim)",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {open ? (
        <p
          className="px-6 pb-6 text-sm"
          style={{ color: "var(--d-text-muted)", lineHeight: 1.7 }}
        >
          {a}
        </p>
      ) : null}
    </div>
  );
}

export function FaqSection({ config }: { config: DemoConfig }) {
  const f = config.faq;
  if (!f) return null;
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-32">
      <SectionHeading kicker={f.kicker} headline={f.headline} center />
      <div className="mt-12 flex flex-col gap-4">
        {f.items.map((item) => (
          <Reveal key={item.q}>
            <FaqItem q={item.q} a={item.a} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Booking — GHL inline form → live AI callback workflow               */
/* ------------------------------------------------------------------ */

const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

export function BookingSection({ config }: { config: DemoConfig }) {
  const b = config.booking;
  const formId = b.formId;

  useEffect(() => {
    if (!formId) return;
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [formId]);

  return (
    <section
      id="demo-booking"
      className="border-t scroll-mt-20"
      style={{ borderColor: "var(--d-border)", background: "var(--d-surface2)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
        <SectionHeading kicker={b.kicker} headline={b.headline} sub={b.sub} center />
        <div
          className="mx-auto mt-12 max-w-xl rounded-2xl border p-4 md:p-6"
          style={{ background: "var(--d-surface)", borderColor: "var(--d-border)" }}
        >
          {formId ? (
            <iframe
              src={`https://api.leadconnectorhq.com/widget/form/${formId}`}
              style={{
                width: "100%",
                height: "560px",
                border: "none",
                borderRadius: "8px",
              }}
              id={`inline-${formId}`}
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Request a Call"
              data-height="527"
              data-layout-iframe-id={`inline-${formId}`}
              data-form-id={formId}
              title="Request a call"
            />
          ) : (
            <div className="px-6 py-16 text-center">
              <Phone
                className="mx-auto h-8 w-8"
                style={{ color: "var(--d-accent)" }}
              />
              <p
                className="mt-4 text-sm"
                style={{ color: "var(--d-text-muted)" }}
              >
                Booking calendar placeholder — your live scheduling embed goes
                here.
              </p>
            </div>
          )}
          {b.note ? (
            <p
              className="mt-3 text-center text-xs"
              style={{ color: "var(--d-text-dim)" }}
            >
              {b.note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA band (dark)                                                     */
/* ------------------------------------------------------------------ */

export function CtaSection({ config }: { config: DemoConfig }) {
  const c = config.cta;
  if (!c) return null;
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--d-dark)" }}>
      {c.image ? (
        <>
          <Image
            src={c.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--d-dark) 20%, transparent 80%)",
            }}
          />
        </>
      ) : null}
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
        <Reveal>
          <h2
            className="max-w-xl text-3xl font-bold md:text-[2.5rem]"
            style={{
              color: "var(--d-dark-text)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {c.headline}
          </h2>
          <p
            className="mt-4 max-w-lg text-base md:text-lg"
            style={{ color: "var(--d-dark-muted)", lineHeight: 1.6 }}
          >
            {c.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                document
                  .getElementById("demo-booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "var(--d-accent)" }}
            >
              {c.buttonLabel}
            </button>
            {config.voice.enabled ? (
              <button
                onClick={startDemoCall}
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors duration-200"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "var(--d-dark-text)",
                }}
              >
                <Mic className="h-4 w-4" />
                {config.voice.buttonLabel}
              </button>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function DemoFooter({ config }: { config: DemoConfig }) {
  return (
    <footer style={{ background: "var(--d-dark)" }}>
      <div
        className="mx-auto flex max-w-6xl flex-col gap-8 border-t px-6 py-12 md:flex-row md:items-start md:justify-between md:px-8"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-sm">
          <div
            className="text-base font-semibold"
            style={{ color: "var(--d-dark-text)", letterSpacing: "-0.02em" }}
          >
            {config.business.name}
          </div>
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--d-dark-muted)", lineHeight: 1.6 }}
          >
            {config.footer.blurb}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm" style={{ color: "var(--d-dark-muted)" }}>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {config.business.location}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {config.business.phoneDisplay}
          </span>
          <span>{config.business.hours}</span>
        </div>
      </div>
      <div
        className="border-t px-6 py-6 text-center font-mono text-xs"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          color: "var(--d-dark-muted)",
          letterSpacing: "0.05em",
        }}
      >
        {config.business.name} is a fictional business — demo website by{" "}
        <a
          href="https://erken.systems"
          className="underline underline-offset-2"
          style={{ color: "var(--d-dark-text)" }}
        >
          Erken Systems
        </a>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Floating Erken badge                                                */
/* ------------------------------------------------------------------ */

export function ErkenDemoBadge() {
  return (
    <a
      href="https://erken.systems"
      target="_blank"
      rel="noopener"
      className="fixed bottom-4 left-4 z-50 rounded-full border px-4 py-2 font-mono text-xs shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        background: "color-mix(in srgb, var(--d-dark) 92%, transparent)",
        borderColor: "rgba(255,255,255,0.15)",
        color: "var(--d-dark-text)",
        letterSpacing: "0.03em",
        backdropFilter: "blur(6px)",
      }}
    >
      Demo by Erken Systems — this could be your business →
    </a>
  );
}
