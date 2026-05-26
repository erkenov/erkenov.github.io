"use client";

/**
 * SceneIndustriesCarousel — "Built for your industry" Apple Cards.
 *
 * NEW scene 2026-05-24 (Shamil). Pattern borrowed and improved from
 * SuiteDash's vertical-tile section. The big win for cold non-technical
 * prospects: they don't know what a CRM is, but they DO know they're a
 * dental practice or a lawyer or a fitness coach. Each card shows the
 * pipeline pre-configured for THAT industry — pre-built voice scripts,
 * intake forms, pipeline stages, automations.
 *
 * 16+ industries to match SuiteDash's breadth.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

type IndustryCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

const INDUSTRIES: IndustryCard[] = [
  {
    category: "Healthcare · HIPAA",
    title: "Dental practices",
    src: ph("Dental", "C76B58"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent trained on dental front-desk scripts (new patient, hygiene recall, emergency)",
          "Intake form pre-built for insurance, last cleaning, medical history",
          "Pipeline stages: New lead → Insurance verified → Booked → Showed → Treatment plan",
          "Recall automation: six-month hygiene reminder per patient",
          "HIPAA-compliant data handling included",
        ]}
        outcome="A typical clinic recovers two to four missed-call patients per week — about three thousand dollars per month in net new revenue."
      />
    ),
  },
  {
    category: "Healthcare",
    title: "Chiropractic clinics",
    src: ph("Chiropractic", "7ea687"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent answers pain-condition questions, books first consult",
          "Intake form: pain level, location, prior treatment history",
          "Pipeline stages: New lead → Consult booked → Plan presented → Package sold → Reactivated",
          "Treatment-plan follow-up: auto-text after each session, rebook prompt",
          "Lapsed-patient win-back campaign monthly",
        ]}
        outcome="Reactivation campaigns alone typically bring back ten to twenty inactive patients per month."
      />
    ),
  },
  {
    category: "Trades · automotive",
    title: "Auto repair shops",
    src: ph("Auto repair", "E89F1F"),
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A customer calls — even at midnight, even when you're busy",
            description:
              "When someone calls your shop, your AI receptionist picks up immediately. It speaks like a friendly front-desk person, asks what's wrong with the car, the year and model, and offers to book a drop-off time. No more missed calls going to voicemail. Works around the clock.",
            image: ph("Step 1 — Call answered", "E89F1F"),
            imageAlt: "AI receptionist answering a phone call",
          },
          {
            title: "Their information lands in one place — automatically",
            description:
              "Everything the customer said — name, phone, vehicle, the problem they described — drops into your shop's contact list. No clipboard. No paper. No re-typing later. You see it on your computer or phone the moment the call ends.",
            image: ph("Step 2 — Lead saved", "C76B58"),
            imageAlt: "Customer details auto-populated in the dashboard",
          },
          {
            title: "You see exactly where every customer is in your shop's flow",
            description:
              "Each customer moves through stages you can see at a glance: Quote requested → Estimate sent → Vehicle dropped → Work approved → Picked up → Review left. You always know who's where. Nothing falls through the cracks.",
            image: ph("Step 3 — Pipeline view", "7ea687"),
            imageAlt: "Pipeline kanban view with customer cards in each stage",
          },
          {
            title: "The customer gets the right text at the right time — automatically",
            description:
              "When their car is ready, they get a text. After they pick up, they get a friendly review request. A few months later, when their oil change is due, they get a reminder. All automatic. All in your shop's voice.",
            image: ph("Step 4 — Auto messages", "5e8268"),
            imageAlt: "Sequence of automated SMS messages sent to the customer",
          },
          {
            title: "You see the numbers that actually matter, every Monday morning",
            description:
              "How many quote requests came in last week? How many became paying jobs? Which marketing channel brings the best customers? A simple weekly summary lands every Monday in plain English — no spreadsheet needed.",
            image: ph("Step 5 — Weekly report", "A8B86C"),
            imageAlt: "Weekly performance summary report",
          },
        ]}
        outcome="Shops typically capture twenty to thirty percent more after-hours quote requests they were losing to voicemail, and book ten to fifteen extra service appointments per month."
      />
    ),
  },
  {
    category: "Beauty · personal care",
    title: "Beauty salons & barbers",
    src: ph("Salon · barber", "8B7BB8"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent books haircuts, color appointments, treatments — knows your service menu and stylist schedules",
          "Online booking widget for direct self-serve appointments",
          "Pipeline stages: New client → First visit → Rebooked → Loyalty → VIP",
          "Auto-text appointment reminders, post-visit review request",
          "Rebook nudge two weeks before usual cadence (six weeks for cuts, eight for color)",
        ]}
        outcome="Salons typically see a fifteen to twenty-five percent reduction in no-shows once SMS reminders are live."
      />
    ),
  },
  {
    category: "Health · premium",
    title: "Med spas",
    src: ph("Med spa", "D67B82"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent qualifies inquiries by treatment type (Botox, fillers, laser, IV)",
          "Intake form: treatment interest, prior procedures, photos",
          "Pipeline stages: Inquiry → Consult booked → Treatment plan → First session → Loyalty",
          "Pre-treatment instructions auto-sent, post-treatment care auto-sent",
          "Membership program automation for monthly clients",
        ]}
        outcome="Med spas with strong follow-up convert thirty to forty percent more inquiries to first sessions than industry average."
      />
    ),
  },
  {
    category: "Professional · legal",
    title: "Law firms",
    src: ph("Law firm", "5e8268"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent screens for case type and jurisdiction before connecting",
          "Intake form: case details, urgency, prior counsel",
          "Pipeline stages: Inquiry → Conflict-checked → Consult booked → Retainer signed → Active matter",
          "Auto-confirm consultation, auto-send intake docs before meeting",
          "Engagement letter and retainer collection automated",
        ]}
        outcome="High-value practice areas (PI, family, immigration) see ROI on the first signed retainer — typically two to fifteen thousand dollars per matter."
      />
    ),
  },
  {
    category: "Trades · HVAC",
    title: "HVAC contractors",
    src: ph("HVAC", "F2C94C"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent qualifies emergency vs scheduled, books service window",
          "Lead form: system type, age, problem, address",
          "Pipeline stages: Service requested → Diagnostic scheduled → Quote sent → Job approved → Completed → Maintenance plan",
          "Maintenance plan auto-renewal reminders",
          "Seasonal tune-up campaigns (spring AC, fall heating)",
        ]}
        outcome="HVAC shops adding 24/7 voice coverage typically see fifteen to twenty-five percent more booked jobs in their first quarter."
      />
    ),
  },
  {
    category: "Trades · plumbing",
    title: "Plumbing services",
    src: ph("Plumbing", "4A90A8"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent triages emergency vs scheduled, dispatches accordingly",
          "Service request form with photos and address",
          "Pipeline stages: Call received → Technician dispatched → On site → Quoted → Approved → Completed → Reviewed",
          "Automatic review request after job completion",
          "Recurring customer follow-up for water heater / system age",
        ]}
        outcome="Emergency-response plumbers recover two to four after-hours calls per week that would have gone to a competitor."
      />
    ),
  },
  {
    category: "Trades · roofing",
    title: "Roofing contractors",
    src: ph("Roofing", "B8786A"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent qualifies storm damage vs scheduled replacement, books inspection",
          "Intake form: roof age, damage type, insurance status",
          "Pipeline stages: Inquiry → Inspection booked → Estimate sent → Insurance coordination → Job scheduled → Completed",
          "Insurance claim coordination workflow templates",
          "Referral request automation after job completion",
        ]}
        outcome="Roofers competing for storm-damage jobs win significantly more bids with same-day inspection booking."
      />
    ),
  },
  {
    category: "Real estate",
    title: "Real estate agents",
    src: ph("Real estate", "9B8A6A"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent qualifies buyer vs seller, budget, timeline before booking showing",
          "Lead form: property type, area, budget, financing status",
          "Pipeline stages: New lead → Pre-qualified → Showing scheduled → Offer made → Under contract → Closed",
          "Drip campaign for cold leads, hot-lead alert to phone",
          "Past-client referral and home-anniversary campaigns",
        ]}
        outcome="Agents see ten to twenty percent more contact-to-showing conversion when leads get instant response."
      />
    ),
  },
  {
    category: "Fitness · wellness",
    title: "Personal trainers & coaches",
    src: ph("Personal trainer", "A8B86C"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent books trial sessions, answers package and pricing questions",
          "Lead form: goals, experience level, schedule preferences",
          "Pipeline stages: Inquiry → Trial booked → Trial completed → Package sold → Renewal",
          "Workout reminder automation, milestone celebrations",
          "Package renewal nudges before expiration",
        ]}
        outcome="Trainers converting from in-person-only to digital intake see twenty to forty percent more leads booked per month."
      />
    ),
  },
  {
    category: "Professional · accounting",
    title: "Accountants & CPAs",
    src: ph("CPA · accounting", "7B8FB2"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent qualifies service type (tax, bookkeeping, advisory), books consult",
          "Intake form: business type, revenue, current setup, services needed",
          "Pipeline stages: Inquiry → Consult booked → Proposal sent → Engagement signed → Onboarded → Recurring client",
          "Tax-season reminder campaigns",
          "Document request workflows automated",
        ]}
        outcome="CPAs typically convert one in four qualified inquiries to engaged clients — automation makes the funnel scalable beyond word-of-mouth."
      />
    ),
  },
  {
    category: "Services · cleaning",
    title: "Cleaning services",
    src: ph("Cleaning", "98C5A5"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent quotes residential vs commercial, books first cleaning",
          "Quote form: square footage, frequency, special requests",
          "Pipeline stages: Quote → Booked → Recurring → Lapsed",
          "Pre-clean reminders, post-clean review requests",
          "Recurring schedule management",
        ]}
        outcome="Cleaning services see thirty to forty percent of bookings happen outside business hours — voice agent captures all of them."
      />
    ),
  },
  {
    category: "Services · pets",
    title: "Veterinary clinics",
    src: ph("Veterinary", "C9A87B"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent triages emergency vs scheduled, books appointments",
          "New-patient form: species, age, medical history",
          "Pipeline stages: New patient → First visit → Recurring care → Wellness program",
          "Vaccine and check-up reminder automation",
          "Prescription refill workflow",
        ]}
        outcome="Vet clinics adding after-hours triage reduce emergency-room referrals by twenty percent and capture more recurring care."
      />
    ),
  },
  {
    category: "Services · pets",
    title: "Pet grooming & boarding",
    src: ph("Pet grooming", "D4B59A"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent books grooming, boarding, daycare slots",
          "Intake form: pet type, breed, special handling",
          "Pipeline stages: New client → First visit → Recurring → Loyalty",
          "Six-to-eight week rebook reminders per pet",
          "Holiday boarding waitlist management",
        ]}
        outcome="Grooming businesses lose significant bookings to voicemail — voice coverage typically adds three to five appointments per week."
      />
    ),
  },
  {
    category: "Services · custom",
    title: "Photographers & creatives",
    src: ph("Photography", "8E7B9E"),
    content: (
      <IndustryBody
        pipeline={[
          "Voice agent qualifies session type (wedding, portrait, commercial), books consult",
          "Lead form: date, location, budget, style preferences",
          "Pipeline stages: Inquiry → Consult booked → Proposal sent → Booked → Shoot → Delivered → Reviewed",
          "Pre-shoot prep automation, post-shoot delivery workflow",
          "Anniversary campaign for past clients",
        ]}
        outcome="Photographers booking high-ticket events benefit from instant response on wedding inquiries — couples often book the first photographer who replies."
      />
    ),
  },
];

/**
 * Step-by-step body — plain-language walkthrough of how the system
 * works for one industry, with a placeholder image per step. New format
 * introduced 2026-05-26 for non-technical SMB prospects who need to
 * SEE the journey to understand it. No animations (page is already
 * heavy with WebGL). Real screenshots swap in over time.
 */
function IndustryBodySteps({
  steps,
  outcome,
}: {
  steps: { title: string; description: string; image?: string; imageAlt?: string }[];
  outcome: string;
}) {
  return (
    <div className="space-y-8 text-base text-text-muted leading-relaxed">
      <div>
        <div className="mono-label text-text-dim text-xs mb-3">How it works for your shop</div>
        <ol className="space-y-7">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Image column — placeholder for now, real screenshots later */}
              {step.image && (
                <div className="md:w-1/3 shrink-0">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-text-muted/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.imageAlt ?? step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
              {/* Text column — big numbered step + plain-language body */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-2xl md:text-3xl font-bold text-accent tabular-nums"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4
                    className="text-lg md:text-xl font-semibold text-text leading-snug"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {step.title}
                  </h4>
                </div>
                <p className="mt-2 text-[15px] md:text-base text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="pt-5 border-t border-text-muted/15">
        <div className="mono-label text-text-dim text-xs mb-1">Real-world outcome</div>
        <p className="text-[15px] md:text-base">{outcome}</p>
      </div>
    </div>
  );
}

function IndustryBody({ pipeline, outcome }: { pipeline: string[]; outcome: string }) {
  return (
    <div className="space-y-5 text-base text-text-muted leading-relaxed">
      <div>
        <div className="mono-label text-text-dim text-xs mb-2">Pre-configured for you</div>
        <ul className="space-y-1.5">
          {pipeline.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span className="text-[15px]">{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-3 border-t border-text-muted/15">
        <div className="mono-label text-text-dim text-xs mb-1">Real-world outcome</div>
        <p className="text-[15px]">{outcome}</p>
      </div>
    </div>
  );
}

export function SceneIndustriesCarousel() {
  const items = INDUSTRIES.map((c, i) => <Card key={c.title} card={c} index={i} />);
  return (
    <div className="w-full">
      <Carousel items={items} />
    </div>
  );
}
