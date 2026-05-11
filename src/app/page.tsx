import { Header } from "@/components/Header";
import { PinnedHero } from "@/components/PinnedHero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { Capabilities } from "@/components/Capabilities";
import { Pricing } from "@/components/Pricing";
import { About } from "@/components/About";
import { Demo } from "@/components/Demo";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PinnedHero />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <Demo />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
