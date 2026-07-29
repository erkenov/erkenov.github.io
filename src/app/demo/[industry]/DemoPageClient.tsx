"use client";

/**
 * DemoPageClient — assembles a /demo/[industry] page from its DemoConfig:
 * sets the industry theme as scoped CSS custom properties (--d-*), then
 * renders the configured sections in the configured order, plus nav,
 * footer, the floating Erken badge, and the voice + chat widgets.
 */

import { useEffect } from "react";
import ErkenChatWidget from "@/components/ErkenChatWidget";
import type { DemoConfig, DemoSectionId } from "../config";
import DemoVoiceWidget from "../components/DemoVoiceWidget";
import {
  AboutSection,
  DemoNav,
  HeroSection,
  ServicesSection,
  StatsSection,
  StepsSection,
} from "../components/sections";
import {
  BookingSection,
  CtaSection,
  DemoFooter,
  ErkenDemoBadge,
  FaqSection,
  TestimonialsSection,
} from "../components/sections2";

declare global {
  interface Window {
    /**
     * Industry context for the chat channel. STUB: the GHL chat widget
     * has no public API for passing custom context into a conversation,
     * so demo pages publish it here for future wiring (e.g. a GHL custom
     * field set via workflow, or a widget swap per industry).
     */
    __erkenDemoContext?: { industry: string; business: string };
  }
}

const SECTION_COMPONENTS: Record<
  DemoSectionId,
  React.ComponentType<{ config: DemoConfig }>
> = {
  hero: HeroSection,
  stats: StatsSection,
  services: ServicesSection,
  about: AboutSection,
  steps: StepsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  booking: BookingSection,
  cta: CtaSection,
};

export default function DemoPageClient({ config }: { config: DemoConfig }) {
  const t = config.theme;

  useEffect(() => {
    window.__erkenDemoContext = {
      industry: config.industryLabel,
      business: config.business.name,
    };
    return () => {
      delete window.__erkenDemoContext;
    };
  }, [config]);

  return (
    <div
      className="min-h-screen"
      style={
        {
          background: t.bg,
          color: t.text,
          "--d-bg": t.bg,
          "--d-surface": t.surface,
          "--d-surface2": t.surface2,
          "--d-border": t.border,
          "--d-border-strong": t.borderStrong,
          "--d-text": t.text,
          "--d-text-muted": t.textMuted,
          "--d-text-dim": t.textDim,
          "--d-accent": t.accent,
          "--d-accent-hover": t.accentHover,
          "--d-accent-soft": t.accentSoft,
          "--d-dark": t.dark,
          "--d-dark-text": t.darkText,
          "--d-dark-muted": t.darkMuted,
        } as React.CSSProperties
      }
    >
      <DemoNav config={config} />
      <main>
        {config.sections.map((id) => {
          const Section = SECTION_COMPONENTS[id];
          return Section ? <Section key={id} config={config} /> : null;
        })}
      </main>
      <DemoFooter config={config} />
      <ErkenDemoBadge />
      {config.voice.enabled ? <DemoVoiceWidget config={config} /> : null}
      {config.chat.enabled ? <ErkenChatWidget /> : null}
    </div>
  );
}
