"use client";

/**
 * Client composition root for /storm-v2. Owns the one piece of shared
 * state — the residential/commercial fork choice — which the hero buttons
 * set and the lead form's radio reflects.
 */

import { useCallback, useEffect, useState } from "react";
import styles from "../storm.module.css";
import { HeroFork, TopBar } from "./HeroFork";
import { Credibility, Services, StormDamage, Story, Territory } from "./Sections";
import { Footer, LeadForm } from "./LeadForm";
import type { PropertyType } from "./data";

export default function StormV2Client() {
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");

  // The root layout injects the sitewide Erken GHL chat widget (incl. its
  // "Hi there!" teaser). On this client-demo page it breaks the SRH
  // illusion — hide the whole <chat-widget> while this page is mounted.
  // Document-level style added/removed here so no shared file changes.
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "srh-v2-hide-chat-widget";
    style.textContent = "chat-widget{display:none !important;}";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const pickAndScroll = useCallback((t: PropertyType) => {
    setPropertyType(t);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={`${styles.theme} min-h-screen overflow-x-clip`}>
      <TopBar />
      <main>
        <HeroFork onPick={pickAndScroll} />
        <Credibility />
        <div className={styles.hairline} />
        <Services />
        <Territory />
        <Story />
        <StormDamage />
        <LeadForm propertyType={propertyType} onPropertyType={setPropertyType} />
      </main>
      <Footer />
    </div>
  );
}
