import { Header } from "@/components/Header";
import { PinnedHero } from "@/components/PinnedHero";
import { Problem } from "@/components/Problem";
import { LaptopDemo } from "@/components/LaptopDemo";
import { MetricBlock } from "@/components/MetricBlock";
import {
  FeatureVoice,
  FeatureCrm,
  FeatureLeadGen,
  FeatureReporting,
} from "@/components/FeatureBlocks";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Cinematic scroll-pinned hero — 3 scenes */}
        <PinnedHero />

        {/* Pain framing — 3 stats */}
        <Problem />

        {/* The big product mockup — Calls / CRM / Leads tab carousel in a laptop */}
        <LaptopDemo />

        {/* What the system produces — 3 brokerpilot-style metric cards */}
        <MetricBlock />

        {/* Four feature sections, each with its own mock dashboard panel */}
        <FeatureVoice />
        <FeatureCrm />
        <FeatureLeadGen />
        <FeatureReporting />

        {/* Existing supporting sections */}
        <HowItWorks />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
