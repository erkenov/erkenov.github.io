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
import { IconDental, IconHome, IconArrowUpRight } from "@tabler/icons-react";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";

/* ============================================================
   A/B/C/D/E card-visual experiment (Shamil 2026-05-26 afternoon).
   Five different treatments for the CLOSED card visual to find
   what feels right for the brand: minimalist but informative.
   Applied to five different industry cards so they can be compared
   side-by-side on the live site without changing layout.
   ============================================================ */

// Style 1 — outlined icon centered on the existing brand-color background.
// Applied to: Dental practices. Clinical / trustworthy fit.
function CardStyle1IconOnColor({ bg, Icon }: { bg: string; Icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }> }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `#${bg}` }}>
      <Icon size={220} stroke={1.2} className="text-[#F5F1E8] opacity-25" />
    </div>
  );
}

// Style 2 — full-bleed photographic image. Pure photo, no overlay.
// Applied to: Veterinary clinics. Maximum emotional pull.
function CardStyle2Photo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      draggable={false}
    />
  );
}

// Style 3 — photo + semi-transparent brand-color tint on top, so the
// card's color identity survives even with a real photo underneath.
// Applied to: Beauty salons & barbers.
function CardStyle3PhotoTinted({ src, tint }: { src: string; tint: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: `#${tint}`, opacity: 0.55 }}
      />
    </>
  );
}

// Style 4 — abstract gradient illustration, full-bleed. No literal
// representation of the industry, just brand-aligned shapes and motion.
// Applied to: Personal trainers & coaches.
function CardStyle4Abstract({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      draggable={false}
    />
  );
}

// Style 5 — large emoji-style icon on the existing brand-color background.
// Simpler than the outlined icon — single character glyph. Applied to:
// Real estate agents.
function CardStyle5EmojiOnColor({ bg, Icon }: { bg: string; Icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }> }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `#${bg}` }}>
      <Icon size={180} stroke={2.5} className="text-[#F5F1E8]" />
    </div>
  );
}

type IndustryCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  /** Optional ReactNode rendered as the CLOSED-card visual (overlay).
   *  When provided, replaces the default colored BlurImage background.
   *  Used for the A/B/C/D/E card-visual experiment. */
  visual?: React.ReactNode;
  /** Live demo subdomain for this industry. When set, the popup's video
   *  showcase renders the primary "Try the live demo" CTA. When absent,
   *  the showcase says the demo is coming and links to the roofing one. */
  demoUrl?: string;
  /** Optional per-industry override for the showcase headline/sub. */
  demoHeadline?: string;
  demoSub?: string;
};

/** The one live demo that exists today — linked from no-demo cards too. */
const ROOFING_DEMO_URL = "https://stormroofingheroes.erken.systems";

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

// Shared OpenAI-generated illustrations used across all 16 industry cards
// (Shamil 2026-05-26 "go full throttle"). Industry-specific imagery is a
// future iteration — for now the same five visuals work for any vertical
// because the content text below differs.
const IMG = {
  step1: "/industries/shared-step1-call.png",
  step2: "/industries/shared-step2-customer-saved.png",
  step3: "/industries/shared-step3-pipeline-view.png",
  step4: "/industries/shared-step4-auto-messages.png",
  step5: "/industries/shared-step5-weekly-report.png",
} as const;

const INDUSTRIES: IndustryCard[] = [
  // 0. Roofing contractors — FIRST card (the flagship: only industry with a
  // LIVE demo subdomain + the new video-first popup treatment, 2026-07-14).
  {
    category: "Trades · roofing",
    title: "Roofing contractors",
    src: ph("Roofing", "B8786A"),
    visual: <CardStyle2Photo src="/industries/card-roofing-photo.jpg" />,
    demoUrl: ROOFING_DEMO_URL,
    demoHeadline: "A real roofing setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete roofing company system — website, online booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a test inspection and watch what your customers would experience.",
    content: (
      <>
        <IndustryBodySteps
          steps={[
            {
              title: "Capture — every call, chat, and form gets answered",
              description:
                "Your AI receptionist picks up on the first ring, day or night. Web chat, contact forms, and an online booking calendar catch everyone else. A homeowner asking about their roof gets qualified — roof age, damage type, insurance status — and booked into an open inspection slot on the spot. Nothing missed, no lead lost.",
              image: IMG.step1,
              imageAlt: "AI receptionist booking a roof inspection",
            },
            {
              title: "Organized — every inquiry lands in one place automatically",
              description:
                "Name, address, roof details, insurance carrier, what they need — all dropped into one organized job list the moment they reach out. Nothing to type up, nothing on a sticky note. Your crew sees the full picture before they leave the yard.",
              image: IMG.step2,
              imageAlt: "Roof inspection details saved automatically",
            },
            {
              title: "Automatic — follow-ups, updates, and reminders run themselves",
              description:
                "Booking confirmation, estimate delivery, appointment reminders, install-date updates, and a post-job review request — all sent automatically in your company's voice. The customer stays in the loop at every step without you lifting a finger.",
              image: IMG.step4,
              imageAlt: "Automated roofing customer messages",
            },
            {
              title: "Visible — every job trackable from first call to final install",
              description:
                "Inquiry → inspection booked → estimate sent → scheduled → completed. One clear board shows exactly what's moving, what's stuck, and what closed — so you always know where every job stands and where to push.",
              image: IMG.step3,
              imageAlt: "Roofing job pipeline view",
            },
          ]}
          outcome="The same system runs behind every job — leads get answered, details get captured, follow-ups run themselves, and you see the whole operation at a glance."
        />
      </>
    ),
  },
  // 1. Dental practices — visual STYLE 2 (full-bleed real photo, like vet)
  {
    category: "Healthcare · HIPAA",
    title: "Dental practices",
    src: ph("Dental", "C76B58"),
    visual: <CardStyle2Photo src="/industries/card-dental-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A patient calls — even after hours, even when reception's busy",
            description:
              "When someone calls your practice, your AI receptionist picks up immediately. It sounds like a friendly front-desk person tailored to how YOU want it to sound — new-patient screening, hygiene recall, or emergency triage. It collects insurance and medical history, checks your live calendar, and books the appointment right there on the call. HIPAA-compliant from the first ring.",
            image: IMG.step1,
            imageAlt: "AI receptionist answering a dental practice call",
          },
          {
            title: "Their information lands in one place — automatically",
            description:
              "Everything the patient said — name, insurance, last cleaning, what's hurting — drops into your patient list. No paper forms. No re-typing. You see it on your computer or phone the moment the call ends, ready for verification before the appointment.",
            image: IMG.step2,
            imageAlt: "Patient details auto-populated in the dashboard",
          },
          {
            title: "Every patient is visible in your treatment pipeline",
            description:
              "Each patient moves through stages you can see at a glance: New lead → Insurance verified → Booked → Showed → Treatment plan presented. You always know who's where. Nothing falls through the cracks.",
            image: IMG.step3,
            imageAlt: "Patient pipeline board",
          },
          {
            title: "Patients get the right reminder at the right time — automatically",
            description:
              "Appointment confirmation goes out the moment they book. Two-day reminder before. Same-day final reminder. Post-visit thank-you with a review request. Six-month recall when they're due for hygiene. All automatic, all in your practice's voice.",
            image: IMG.step4,
            imageAlt: "Automated reminder sequence for dental patients",
          },
          {
            title: "Monday morning, you see what actually moved last week",
            description:
              "How many new patient calls came in? How many showed? How many accepted their treatment plan? Which marketing source produced the highest-value patients? A simple summary every Monday — no spreadsheets, no consultant required.",
            image: IMG.step5,
            imageAlt: "Weekly performance summary for dental practice",
          },
        ]}
        outcome="A typical clinic recovers two to four missed-call patients per week — about three thousand dollars per month in net new revenue."
      />
    ),
  },
  // 2. Chiropractic clinics
  {
    category: "Healthcare",
    title: "Chiropractic clinics",
    src: ph("Chiropractic", "7ea687"),
    visual: <CardStyle2Photo src="/industries/card-chiropractic-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A patient calls in pain — they get help, not a voicemail",
            description:
              "When someone calls your clinic, your AI receptionist picks up immediately and sounds like a friendly front-desk person tailored to how YOU want — calm, listening, asking about pain level and location. It books their first consult on the spot from your live calendar. Works around the clock.",
            image: IMG.step1,
            imageAlt: "AI receptionist answering a chiropractic call",
          },
          {
            title: "Their pain history lands in one place — automatically",
            description:
              "Everything they shared — name, phone, pain location, level, prior treatment — drops into your patient list. Ready for your review before the consult. No clipboard. No retyping.",
            image: IMG.step2,
            imageAlt: "Patient pain history saved automatically",
          },
          {
            title: "Every patient is visible across the treatment journey",
            description:
              "Each patient moves through stages: New lead → Consult booked → Care plan presented → Package sold → Reactivated. You see who's where, who needs a nudge, who's about to lapse.",
            image: IMG.step3,
            imageAlt: "Chiropractic care pipeline view",
          },
          {
            title: "Follow-ups happen between visits — automatically",
            description:
              "Pre-visit reminders. Post-adjustment check-in text. Rebook nudge before the next session is due. Win-back campaigns for patients who haven't been in for a few weeks. All automatic, all in your clinic's voice.",
            image: IMG.step4,
            imageAlt: "Automated chiropractic follow-up sequence",
          },
          {
            title: "Monday morning, you see your practice's heartbeat",
            description:
              "New patient calls. Show rate. Package conversion. Reactivation count. Lapsed-patient bookings. A clean weekly summary so you can adjust faster than your competitors.",
            image: IMG.step5,
            imageAlt: "Weekly chiropractic performance summary",
          },
        ]}
        outcome="Reactivation campaigns alone typically bring back ten to twenty inactive patients per month."
      />
    ),
  },
  // 3. Auto repair shops — visual STYLE 2 (full-bleed real photo)
  {
    category: "Trades · automotive",
    title: "Auto repair shops",
    src: ph("Auto repair", "E89F1F"),
    visual: <CardStyle2Photo src="/industries/card-auto-repair-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A customer calls — even at midnight, even when you're busy",
            description:
              "When someone calls your shop, your AI receptionist picks up immediately. It sounds like a friendly front-desk person tailored to how YOU want it to sound — what to ask, what to offer, when to hand off to a human. It diagnoses the issue, checks your live booking calendar, and books a drop-off slot right there on the call. No more missed calls going to voicemail. Works around the clock.",
            image: IMG.step1,
            imageAlt: "AI receptionist answering a shop call",
          },
          {
            title: "Their information lands in one place — automatically",
            description:
              "Everything the customer said — name, phone, vehicle, the problem they described — drops into your shop's contact list. No clipboard. No paper. No re-typing later. You see it on your computer or phone the moment the call ends.",
            image: "/industries/auto-repair-step2-lead-saved.png",
            imageAlt: "Customer details auto-populated in the dashboard",
          },
          {
            title: "You see exactly where every customer is in your shop's flow",
            description:
              "Each customer moves through stages: Quote requested → Estimate sent → Vehicle dropped → Work approved → Picked up → Review left. You always know who's where. Nothing falls through the cracks.",
            image: IMG.step3,
            imageAlt: "Pipeline kanban view with customer cards",
          },
          {
            title: "The customer gets the right text at the right time — automatically",
            description:
              "When their car is ready, they get a text. After pickup, a friendly review request. A few months later, when their oil change is due, they get a reminder. All automatic, all in your shop's voice.",
            image: IMG.step4,
            imageAlt: "Automated SMS sequence to the customer",
          },
          {
            title: "Monday morning, you see the numbers that actually matter",
            description:
              "How many quote requests came in last week? How many became paying jobs? Which marketing channel brings the best customers? A simple weekly summary in plain English — no spreadsheet needed.",
            image: IMG.step5,
            imageAlt: "Weekly performance summary",
          },
        ]}
        outcome="Shops typically capture twenty to thirty percent more after-hours quote requests they were losing to voicemail, and book ten to fifteen extra service appointments per month."
      />
    ),
  },
  // 4. Beauty salons & barbers
  {
    category: "Beauty · personal care",
    title: "Beauty salons & barbers",
    src: ph("Salon · barber", "8B7BB8"),
    visual: <CardStyle2Photo src="/industries/card-salon-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A client calls to book — and books, even when chairs are full",
            description:
              "Your AI receptionist picks up immediately, sounds like a friendly front-desk person tailored to your salon's vibe. It knows your service menu and each stylist's schedule. Books a haircut, color, or treatment directly on the call. No more callback-voicemails losing clients to the salon next door.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a salon appointment",
          },
          {
            title: "Their info lands in one place — automatically",
            description:
              "Name, phone, preferred stylist, service requested, last visit — all dropped into your client list the moment they hang up. Ready for your team's morning prep. No paper book. No retyping.",
            image: IMG.step2,
            imageAlt: "Salon client details saved automatically",
          },
          {
            title: "Every client is visible in your loyalty pipeline",
            description:
              "New client → First visit → Rebooked → Loyalty → VIP. You see at a glance who's a first-timer who needs a follow-up, who's overdue for their next color, who's about to lapse.",
            image: IMG.step3,
            imageAlt: "Salon loyalty pipeline board",
          },
          {
            title: "Clients get the right reminder at the right time — automatically",
            description:
              "Appointment confirmation when they book. Day-before reminder. Post-visit review request. Six-week rebook nudge for cuts, eight weeks for color. All automatic, all in your salon's voice.",
            image: IMG.step4,
            imageAlt: "Automated salon reminder sequence",
          },
          {
            title: "Monday morning, you see what filled chairs last week",
            description:
              "Bookings by stylist. No-show rate. Rebook rate. Which marketing source brought the highest-value clients. A clean weekly summary so you know which lever to pull next.",
            image: IMG.step5,
            imageAlt: "Weekly salon performance summary",
          },
        ]}
        outcome="Salons typically see a fifteen to twenty-five percent reduction in no-shows once SMS reminders are live."
      />
    ),
  },
  // 5. Med spas
  {
    category: "Health · premium",
    title: "Med spas",
    src: ph("Med spa", "D67B82"),
    visual: <CardStyle2Photo src="/industries/card-medspa-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A new inquiry calls — they get qualified, not lost",
            description:
              "Your AI receptionist picks up immediately. It sounds polished and tailored to your med spa's brand. It qualifies the inquiry by treatment type — Botox, fillers, laser, IV — answers basic pricing questions, and books a paid consult right on the call. Filters out tire-kickers before they reach your team.",
            image: IMG.step1,
            imageAlt: "AI receptionist qualifying a med spa inquiry",
          },
          {
            title: "Their treatment interest lands in one place — automatically",
            description:
              "Name, contact, treatment interest, prior procedures, even photos if they shared them — all dropped into your patient list. Ready for your nurse or provider to review before the consult.",
            image: IMG.step2,
            imageAlt: "Med spa patient interest auto-populated",
          },
          {
            title: "Every patient is visible in your treatment journey",
            description:
              "Inquiry → Consult booked → Treatment plan presented → First session → Loyalty member. You see who's where, who needs a follow-up call, who's about to convert.",
            image: IMG.step3,
            imageAlt: "Med spa patient journey pipeline",
          },
          {
            title: "Patients get the right care touch at the right time — automatically",
            description:
              "Pre-treatment instructions before each session. Post-treatment aftercare. Touch-up reminder when their treatment is due. Membership renewal nudges. All automatic, all in your med spa's voice.",
            image: IMG.step4,
            imageAlt: "Automated med spa patient care sequence",
          },
          {
            title: "Monday morning, you see what actually drove revenue",
            description:
              "Inquiries by treatment type. Consult-to-treatment conversion. Average ticket. Returning vs new patient ratio. A clean weekly summary so you know which treatments and channels to push.",
            image: IMG.step5,
            imageAlt: "Weekly med spa performance summary",
          },
        ]}
        outcome="Med spas with strong follow-up convert thirty to forty percent more inquiries to first sessions than industry average."
      />
    ),
  },
  // 6. Law firms
  {
    category: "Professional · legal",
    title: "Law firms",
    src: ph("Law firm", "5e8268"),
    visual: <CardStyle2Photo src="/industries/card-law-firm-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A potential client calls — they get pre-screened, not bounced",
            description:
              "Your AI intake assistant picks up immediately. It sounds professional, tailored to your firm's voice. It screens for case type, jurisdiction, and urgency before taking up a partner's time. Books a paid or free consult on the call. Filters out conflicts and tire-kickers before anyone in your office reads the file.",
            image: IMG.step1,
            imageAlt: "AI intake assistant screening a legal call",
          },
          {
            title: "Their case details land in one place — automatically",
            description:
              "Name, case type, key facts, urgency, prior counsel — all dropped into your matter intake list. Ready for conflict check and partner review before the first consult.",
            image: IMG.step2,
            imageAlt: "Legal intake details saved automatically",
          },
          {
            title: "Every matter is visible in your engagement pipeline",
            description:
              "Inquiry → Conflict-checked → Consult booked → Retainer signed → Active matter. You see at a glance which inquiries are stuck and which are about to convert.",
            image: IMG.step3,
            imageAlt: "Law firm matter pipeline",
          },
          {
            title: "Clients get the right touchpoint at the right time — automatically",
            description:
              "Consult confirmation. Intake document request. Engagement letter delivery. Retainer collection link. Status updates between hearings. All automatic, all in your firm's voice.",
            image: IMG.step4,
            imageAlt: "Automated legal client communication sequence",
          },
          {
            title: "Monday morning, you see what fed the firm last week",
            description:
              "Inquiries by practice area. Conversion to retainer. Average matter value. Referral sources. A clean weekly summary so you can shift marketing toward the highest-value practice areas.",
            image: IMG.step5,
            imageAlt: "Weekly law firm performance summary",
          },
        ]}
        outcome="High-value practice areas (PI, family, immigration) see ROI on the first signed retainer — typically two to fifteen thousand dollars per matter."
      />
    ),
  },
  // 7. HVAC contractors
  {
    category: "Trades · HVAC",
    title: "HVAC contractors",
    src: ph("HVAC", "F2C94C"),
    visual: <CardStyle2Photo src="/industries/card-hvac-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A homeowner calls in 95° heat — they get help, not a busy signal",
            description:
              "Your AI dispatcher picks up immediately, sounds like a friendly front-desk person tailored to YOUR shop. It qualifies emergency vs scheduled, asks about system type, age, and problem, and books a service window directly on your live dispatch calendar. Captures the after-hours and overflow calls your team can't reach.",
            image: IMG.step1,
            imageAlt: "AI dispatcher answering HVAC service call",
          },
          {
            title: "Their service info lands in one place — automatically",
            description:
              "Name, address, system type, age, urgency, problem description — all dropped into your job list. Ready for dispatch the moment the call ends. No paper job tickets.",
            image: IMG.step2,
            imageAlt: "HVAC service request saved automatically",
          },
          {
            title: "Every job is visible from request to maintenance plan",
            description:
              "Service requested → Diagnostic scheduled → Quote sent → Job approved → Completed → Maintenance plan. You see who's where, who's quoted but not approved, who needs a nudge.",
            image: IMG.step3,
            imageAlt: "HVAC job pipeline view",
          },
          {
            title: "Customers get the right text at the right time — automatically",
            description:
              "Tech-en-route notification. Quote follow-up. Job-complete confirmation with review request. Maintenance plan renewal reminders. Seasonal tune-up campaigns — spring AC, fall heating. All automatic.",
            image: IMG.step4,
            imageAlt: "Automated HVAC customer messages",
          },
          {
            title: "Monday morning, you see what produced revenue last week",
            description:
              "Service calls by type. Quote-to-job conversion. Average ticket. Maintenance plan growth. A clean weekly summary so you can spot trends and react before the season turns.",
            image: IMG.step5,
            imageAlt: "Weekly HVAC performance summary",
          },
        ]}
        outcome="HVAC shops adding 24/7 voice coverage typically see fifteen to twenty-five percent more booked jobs in their first quarter."
      />
    ),
  },
  // 8. Plumbing services
  {
    category: "Trades · plumbing",
    title: "Plumbing services",
    src: ph("Plumbing", "4A90A8"),
    visual: <CardStyle2Photo src="/industries/card-plumbing-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A pipe bursts at 2 AM — your phone rings, and gets answered",
            description:
              "Your AI dispatcher picks up immediately. It sounds calm and professional, tailored to your shop. It triages emergency vs scheduled work, captures the address, problem, and urgency, and either dispatches a tech right then or books a next-day appointment. Captures every after-hours call your competitors are missing.",
            image: IMG.step1,
            imageAlt: "AI dispatcher answering plumbing emergency call",
          },
          {
            title: "Their job info lands in one place — automatically",
            description:
              "Name, address, problem description, photos if shared, urgency tag — all dropped into your job list. Your dispatcher or tech sees it on their phone the moment the call ends.",
            image: IMG.step2,
            imageAlt: "Plumbing job details saved automatically",
          },
          {
            title: "Every job is visible from call to review",
            description:
              "Call received → Technician dispatched → On site → Quoted → Approved → Completed → Reviewed. You see who's where, which jobs are stuck on approval, which need follow-up.",
            image: IMG.step3,
            imageAlt: "Plumbing job pipeline view",
          },
          {
            title: "Customers get the right touch at the right time — automatically",
            description:
              "ETA text when tech is en route. Job-complete confirmation. Review request after pickup. Water-heater age reminder a few years out. All automatic, all in your shop's voice.",
            image: IMG.step4,
            imageAlt: "Automated plumbing customer messages",
          },
          {
            title: "Monday morning, you see what kept the trucks rolling",
            description:
              "Emergency vs scheduled split. Job-to-quote conversion. Average ticket. Which neighborhoods produce the most jobs. A clean weekly summary so you can plan ad spend and dispatch coverage.",
            image: IMG.step5,
            imageAlt: "Weekly plumbing performance summary",
          },
        ]}
        outcome="Emergency-response plumbers recover two to four after-hours calls per week that would have gone to a competitor."
      />
    ),
  },
  // 10. Real estate agents
  {
    category: "Real estate",
    title: "Real estate agents",
    src: ph("Real estate", "9B8A6A"),
    visual: <CardStyle2Photo src="/industries/card-real-estate-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A lead inquires at 9 PM — they hear back in seconds",
            description:
              "Your AI assistant picks up the call or web inquiry immediately. It sounds polished and tailored to your brand. It qualifies buyer vs seller, asks budget, timeline, and financing status, then books a showing or listing consult right on the spot. Cold leads don't have time to email three other agents — you're already booked.",
            image: IMG.step1,
            imageAlt: "AI assistant qualifying a real estate lead",
          },
          {
            title: "Their property interest lands in one place — automatically",
            description:
              "Name, contact, property type, area, budget, financing status — all dropped into your lead list. Hot leads ping your phone. Cold leads go straight into the nurture sequence.",
            image: IMG.step2,
            imageAlt: "Real estate lead saved automatically",
          },
          {
            title: "Every lead is visible from inquiry to closing",
            description:
              "New lead → Pre-qualified → Showing scheduled → Offer made → Under contract → Closed. You see who's hot, who's cold, who needs a check-in.",
            image: IMG.step3,
            imageAlt: "Real estate lead pipeline view",
          },
          {
            title: "Leads stay warm without you babysitting them — automatically",
            description:
              "Listing alerts for buyers. Market update drips for sellers. Showing-confirmation texts. Anniversary-of-closing nudges to past clients with referral asks. All automatic, all in your voice.",
            image: IMG.step4,
            imageAlt: "Automated real estate lead nurture messages",
          },
          {
            title: "Monday morning, you see what moved the needle last week",
            description:
              "New leads by source. Contact-to-showing rate. Showing-to-offer rate. Days on market. A clean weekly summary so you can shift ad spend and lead-gen focus before the market moves.",
            image: IMG.step5,
            imageAlt: "Weekly real estate performance summary",
          },
        ]}
        outcome="Agents see ten to twenty percent more contact-to-showing conversion when leads get instant response."
      />
    ),
  },
  // 11. Personal trainers & coaches
  {
    category: "Fitness · wellness",
    title: "Personal trainers & coaches",
    src: ph("Personal trainer", "A8B86C"),
    visual: <CardStyle2Photo src="/industries/card-trainer-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A new lead inquires — they get booked, not ghosted",
            description:
              "Your AI assistant picks up calls and form submissions immediately. It sounds friendly and tailored to your coaching voice. It asks about goals, experience level, and schedule, answers basic pricing, and books a trial session on the spot. The motivated leads who'd otherwise lose momentum overnight stay engaged.",
            image: IMG.step1,
            imageAlt: "AI assistant booking a personal training trial",
          },
          {
            title: "Their fitness goals land in one place — automatically",
            description:
              "Name, contact, goals, experience level, schedule preferences — all dropped into your client list. Ready for your prep before the first session. No DM scroll-back to remember what they said.",
            image: IMG.step2,
            imageAlt: "Training lead profile saved automatically",
          },
          {
            title: "Every client is visible from inquiry to renewal",
            description:
              "Inquiry → Trial booked → Trial completed → Package sold → Renewal. You see who's about to lapse, who's ready for an upsell, who needs a check-in.",
            image: IMG.step3,
            imageAlt: "Personal training client pipeline",
          },
          {
            title: "Clients get the right nudge between sessions — automatically",
            description:
              "Pre-session reminders. Workout-of-the-day texts. Milestone celebrations (first 10 sessions, body comp wins). Package renewal nudges before expiration. All automatic, all in your voice.",
            image: IMG.step4,
            imageAlt: "Automated client engagement sequence",
          },
          {
            title: "Monday morning, you see what filled your calendar",
            description:
              "New inquiries. Trial-to-paid conversion. Average client lifetime. Which lead source delivers the highest retention. A clean weekly summary so you know where to focus next.",
            image: IMG.step5,
            imageAlt: "Weekly trainer performance summary",
          },
        ]}
        outcome="Trainers converting from in-person-only to digital intake see twenty to forty percent more leads booked per month."
      />
    ),
  },
  // 12. Accountants & CPAs
  {
    category: "Professional · accounting",
    title: "Accountants & CPAs",
    src: ph("CPA · accounting", "7B8FB2"),
    visual: <CardStyle2Photo src="/industries/card-cpa-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A business owner calls — they get screened, not sent to voicemail",
            description:
              "Your AI intake assistant picks up immediately. It sounds professional and tailored to your firm. It qualifies by service type (tax, bookkeeping, advisory), business type, and revenue range, and books a consult on your live calendar. Filters out the wrong-fit inquiries before a partner spends an hour on the call.",
            image: IMG.step1,
            imageAlt: "AI assistant screening a CPA inquiry",
          },
          {
            title: "Their business profile lands in one place — automatically",
            description:
              "Business name, entity type, revenue range, current accounting setup, services needed — all dropped into your prospect list. Ready for your engagement quote before the consult.",
            image: IMG.step2,
            imageAlt: "Business profile auto-saved",
          },
          {
            title: "Every prospect is visible from inquiry to recurring client",
            description:
              "Inquiry → Consult booked → Proposal sent → Engagement signed → Onboarded → Recurring client. You see which proposals are stuck and which prospects are about to sign.",
            image: IMG.step3,
            imageAlt: "CPA engagement pipeline",
          },
          {
            title: "Clients get the right document request at the right time — automatically",
            description:
              "Engagement letter delivery. Document request workflows. Tax-season reminder campaigns. Quarterly check-in messages for advisory clients. Annual renewal nudges. All automatic, all in your firm's voice.",
            image: IMG.step4,
            imageAlt: "Automated CPA client communication",
          },
          {
            title: "Monday morning, you see your firm's revenue trajectory",
            description:
              "New inquiries by service type. Proposal-to-engagement conversion. Average engagement value. Recurring vs one-time mix. A clean weekly summary so you can shift focus toward higher-value services.",
            image: IMG.step5,
            imageAlt: "Weekly CPA performance summary",
          },
        ]}
        outcome="CPAs typically convert one in four qualified inquiries to engaged clients — automation makes the funnel scalable beyond word-of-mouth."
      />
    ),
  },
  // 13. Cleaning services
  {
    category: "Services · cleaning",
    title: "Cleaning services",
    src: ph("Cleaning", "98C5A5"),
    visual: <CardStyle2Photo src="/industries/card-cleaning-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A homeowner books a clean — at lunch, late, or weekend",
            description:
              "Your AI receptionist picks up immediately, sounds friendly and tailored to your service. It asks residential vs commercial, square footage, frequency, special requests, and books the first cleaning on your live calendar. Captures the thirty to forty percent of bookings that happen outside your office hours.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a cleaning service",
          },
          {
            title: "Their cleaning details land in one place — automatically",
            description:
              "Name, address, square footage, frequency, special requests (pets, allergies, eco-only products) — all dropped into your job list. Ready for the crew's morning route briefing.",
            image: IMG.step2,
            imageAlt: "Cleaning service details saved automatically",
          },
          {
            title: "Every client is visible from quote to recurring",
            description:
              "Quote → Booked → Recurring → Lapsed. You see who's a first-timer who needs follow-up, who's about to lapse on their recurring schedule.",
            image: IMG.step3,
            imageAlt: "Cleaning client pipeline view",
          },
          {
            title: "Clients get the right reminder at the right time — automatically",
            description:
              "Pre-clean confirmation the day before. Post-clean review request. Recurring schedule reminders. Lapsed-client win-back nudges. All automatic, all in your service's voice.",
            image: IMG.step4,
            imageAlt: "Automated cleaning client messages",
          },
          {
            title: "Monday morning, you see what kept the crews busy",
            description:
              "New bookings vs recurring. Crew utilization. Average ticket. Lapsed-client recovery. A clean weekly summary so you know whether to hire, raise prices, or push referrals.",
            image: IMG.step5,
            imageAlt: "Weekly cleaning service performance summary",
          },
        ]}
        outcome="Cleaning services see thirty to forty percent of bookings happen outside business hours — voice agent captures all of them."
      />
    ),
  },
  // 14. Veterinary clinics — visual STYLE 2 (full-bleed real photo)
  {
    category: "Services · pets",
    title: "Veterinary clinics",
    src: ph("Veterinary", "C9A87B"),
    visual: <CardStyle2Photo src="/industries/card-vet-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A worried pet owner calls — they get triage, not voicemail",
            description:
              "Your AI receptionist picks up immediately. It sounds calm and tailored to your clinic. It triages emergency vs scheduled care, asks about species, age, and what's wrong, and either escalates urgent cases or books a same-day appointment. Reduces emergency-room referrals because pets get seen by YOU first.",
            image: IMG.step1,
            imageAlt: "AI receptionist triaging a vet call",
          },
          {
            title: "The pet's profile lands in one place — automatically",
            description:
              "Owner name, pet name, species, age, presenting issue, prior medical notes — all dropped into your patient list. Ready for your vet's morning prep.",
            image: IMG.step2,
            imageAlt: "Pet patient details saved automatically",
          },
          {
            title: "Every patient is visible from first visit to wellness plan",
            description:
              "New patient → First visit → Recurring care → Wellness program member. You see who's overdue for a check-up, who's about to lapse on their care plan.",
            image: IMG.step3,
            imageAlt: "Vet patient pipeline view",
          },
          {
            title: "Pet owners get the right reminder at the right time — automatically",
            description:
              "Appointment confirmation. Vaccine due reminders. Wellness check-up nudges. Prescription refill workflow. Post-visit follow-up to make sure pets are recovering. All automatic, all in your clinic's voice.",
            image: IMG.step4,
            imageAlt: "Automated vet client messages",
          },
          {
            title: "Monday morning, you see what kept the clinic full",
            description:
              "New patients. No-show rate. Wellness plan conversions. Prescription revenue. A clean weekly summary so you can spot trends and adjust staffing or marketing.",
            image: IMG.step5,
            imageAlt: "Weekly vet clinic performance summary",
          },
        ]}
        outcome="Vet clinics adding after-hours triage reduce emergency-room referrals by twenty percent and capture more recurring care."
      />
    ),
  },
  // 15. Pet grooming & boarding
  {
    category: "Services · pets",
    title: "Pet grooming & boarding",
    src: ph("Pet grooming", "D4B59A"),
    visual: <CardStyle2Photo src="/industries/card-pet-grooming-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A pet owner books a groom or stay — even outside business hours",
            description:
              "Your AI receptionist picks up immediately, sounds warm and tailored to your business. It asks about pet type, breed, any special handling, and books grooming, boarding, or daycare slots on your live calendar. Captures the after-hours bookings that used to go to your competitor down the street.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a grooming slot",
          },
          {
            title: "The pet's profile lands in one place — automatically",
            description:
              "Owner name, pet name, breed, size, any special handling notes (anxious, senior, medical) — all dropped into your client list. Ready for your groomer's morning prep.",
            image: IMG.step2,
            imageAlt: "Pet profile saved automatically",
          },
          {
            title: "Every client is visible from first visit to loyalty member",
            description:
              "New client → First visit → Recurring → Loyalty. You see who's overdue for a regroom, who's a new client who needs a follow-up, who's about to lapse.",
            image: IMG.step3,
            imageAlt: "Pet grooming client pipeline",
          },
          {
            title: "Owners get the right reminder at the right time — automatically",
            description:
              "Appointment confirmation. Six-to-eight week rebook reminders per pet. Holiday-boarding waitlist alerts. Birthday discounts. Post-visit photo + review request. All automatic, all in your shop's voice.",
            image: IMG.step4,
            imageAlt: "Automated pet grooming client messages",
          },
          {
            title: "Monday morning, you see what kept the chairs full",
            description:
              "New clients. Rebook rate. Average ticket. Holiday boarding utilization. A clean weekly summary so you know when to hire, raise prices, or push a promotion.",
            image: IMG.step5,
            imageAlt: "Weekly pet grooming performance summary",
          },
        ]}
        outcome="Grooming businesses lose significant bookings to voicemail — voice coverage typically adds three to five appointments per week."
      />
    ),
  },
  // 16. Photographers & creatives
  {
    category: "Services · custom",
    title: "Photographers & creatives",
    src: ph("Photography", "8E7B9E"),
    visual: <CardStyle2Photo src="/industries/card-photographer-photo.jpg" />,
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "A wedding couple inquires at midnight — they get a reply, not silence",
            description:
              "Your AI assistant picks up calls and form inquiries immediately. It sounds warm and tailored to your creative voice. It qualifies the session type — wedding, portrait, commercial — asks date, location, budget, and style, and books a discovery consult. Wedding couples often book the first photographer who replies. That's you now.",
            image: IMG.step1,
            imageAlt: "AI assistant qualifying a photography inquiry",
          },
          {
            title: "Their session details land in one place — automatically",
            description:
              "Name, contact, session type, date, location, budget, style references — all dropped into your client list. Ready for your proposal before the consult.",
            image: IMG.step2,
            imageAlt: "Photography session details saved automatically",
          },
          {
            title: "Every project is visible from inquiry to delivered gallery",
            description:
              "Inquiry → Consult booked → Proposal sent → Booked → Shoot → Delivered → Reviewed. You see which proposals are stuck and which shoots need post-production attention.",
            image: IMG.step3,
            imageAlt: "Photography project pipeline view",
          },
          {
            title: "Clients get the right touch at the right time — automatically",
            description:
              "Pre-shoot prep with location, outfit, and timing details. Day-before reminder. Post-shoot delivery notification. Anniversary-of-shoot campaign with rebook offer. All automatic, all in your voice.",
            image: IMG.step4,
            imageAlt: "Automated photography client messages",
          },
          {
            title: "Monday morning, you see what filled the calendar",
            description:
              "New inquiries by session type. Inquiry-to-booking conversion. Average package value. Referral rate. A clean weekly summary so you can shift marketing toward the most profitable session types.",
            image: IMG.step5,
            imageAlt: "Weekly photographer performance summary",
          },
        ]}
        outcome="Photographers booking high-ticket events benefit from instant response on wedding inquiries — couples often book the first photographer who replies."
      />
    ),
  },
];

/**
 * IndustryDemoShowcase — video-first header for an industry card popup
 * (Shamil 2026-07-14: "as many videos and clickable things as possible").
 * Horizontal 16:9 demo video on top (placeholder = the main-page intro clip
 * for now; per-industry streamer-style demo videos swap in later), pitch +
 * "try the live demo" CTA below it, the step-by-step breakdown stays under
 * that. Rolled out on the roofing card first; other industries follow once
 * the treatment is approved and each has a live demo subdomain.
 */
function IndustryDemoShowcase({
  demoUrl,
  headline,
  sub,
}: {
  demoUrl?: string;
  headline: string;
  sub: string;
}) {
  return (
    // Horizontal 16:9 demo video ON TOP (streamer-style: full screen + cam in
    // the corner), pitch + CTA below (2026-07-20: was a narrow vertical clip
    // beside the text). Same video source; the frame is now landscape and the
    // text sits under the wide player where it reads naturally.
    <div className="mb-12 flex flex-col gap-6">
      {/* Horizontal 16:9 demo video — placeholder: the main-page intro clip */}
      <div className="mx-auto w-full max-w-2xl">
        <Scene1IntroVideo orientation="landscape" />
      </div>
      {/* Pitch + CTA */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="mono-label text-accent text-xs mb-3">See it working</div>
        <h4
          className="text-xl md:text-2xl font-semibold text-text leading-snug"
          style={{ letterSpacing: "-0.02em" }}
        >
          {headline}
        </h4>
        <p className="mt-3 text-[15px] md:text-base text-text-muted leading-relaxed">
          {sub}
        </p>
        {/* Try for free is the primary next step (→ /start); the live-demo
            link sits beside it as the industry-specific proof. */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/start"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
          >
            Try for free
            <span aria-hidden>→</span>
          </a>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-text transition-colors hover:border-border-strong hover:bg-surface"
            >
              Try the live demo
              <IconArrowUpRight size={18} stroke={2} />
            </a>
          )}
        </div>
        {!demoUrl && (
          <p className="mt-4 text-[15px] text-text-dim">
            A live demo for this industry is on the way. Meanwhile,{" "}
            <a
              href={ROOFING_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-4"
            >
              click through the live roofing demo
            </a>{" "}
            to see the platform running for a real business.
          </p>
        )}
      </div>
    </div>
  );
}

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
  steps: {
    title: string;
    description: string;
    /** Image source. String → rendered as <img src>. ReactNode → rendered as-is
     *  (e.g. inline JSX SVG for hand-coded illustrations). */
    image?: string | React.ReactNode;
    imageAlt?: string;
  }[];
  outcome: string;
}) {
  return (
    <div className="space-y-8 text-base text-text-muted leading-relaxed">
      <div>
        <div className="mono-label text-text-dim text-xs mb-3">How it works</div>
        <ol className="space-y-7">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Image column — accepts string URL or inline JSX (SVG). */}
              {step.image && (
                <div className="md:w-1/3 shrink-0">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-text-muted/10">
                    {typeof step.image === "string" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={step.image}
                        alt={step.imageAlt ?? step.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        role="img"
                        aria-label={step.imageAlt ?? step.title}
                      >
                        {step.image}
                      </div>
                    )}
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

/**
 * Step1CallSvg — option B (hand-coded inline SVG) for the A/B/C image
 * style comparison test on the auto-repair card. Phone with incoming
 * call screen + Erken AI agent badge + sound waves on each side. Pure
 * brand palette (sage, terracotta, sun gold, cream).
 */
function Step1CallSvg() {
  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="400" height="300" rx="0" fill="#F5F1E8" />
      {/* sound waves left */}
      <g
        stroke="#E89F1F"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      >
        <path d="M 110 110 Q 92 150 110 190" />
        <path d="M 85 95 Q 60 150 85 205" />
        <path d="M 60 80 Q 28 150 60 220" />
      </g>
      {/* sound waves right */}
      <g
        stroke="#E89F1F"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      >
        <path d="M 290 110 Q 308 150 290 190" />
        <path d="M 315 95 Q 340 150 315 205" />
        <path d="M 340 80 Q 372 150 340 220" />
      </g>
      {/* phone body */}
      <g transform="translate(155, 50)">
        <rect
          x="0"
          y="0"
          width="90"
          height="200"
          rx="14"
          fill="#FFFFFF"
          stroke="#2a2722"
          strokeWidth="1.5"
        />
        {/* screen */}
        <rect x="6" y="18" width="78" height="166" rx="6" fill="#1A1A1A" />
        {/* notch */}
        <rect x="36" y="22" width="18" height="4" rx="2" fill="#0A0A0A" />
        {/* incoming-call label */}
        <text
          x="45"
          y="55"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="8"
          fill="#7ea687"
          fontWeight="700"
          letterSpacing="0.5"
        >
          INCOMING CALL
        </text>
        <text
          x="45"
          y="75"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="10"
          fill="#FFFFFF"
          fontWeight="600"
        >
          Customer
        </text>
        <text
          x="45"
          y="89"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="7"
          fill="#888888"
        >
          +1 (512) 555-0142
        </text>
        {/* Erken AI badge */}
        <g transform="translate(13, 110)">
          <rect width="64" height="22" rx="11" fill="#7ea687" />
          <circle cx="11" cy="11" r="4" fill="#F5F1E8" />
          <circle cx="11" cy="11" r="1.5" fill="#C76B58" />
          <text
            x="36"
            y="15"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="8"
            fill="#F5F1E8"
            fontWeight="700"
          >
            Erken · AI
          </text>
        </g>
        {/* answer button hint */}
        <circle cx="45" cy="158" r="14" fill="#7ea687" opacity="0.9" />
        <path
          d="M 39 155 Q 42 150 48 153 L 50 156 Q 47 159 49 162 Q 50 164 47 165 Q 39 165 39 155 Z"
          fill="#F5F1E8"
        />
        {/* home indicator */}
        <rect x="32" y="188" width="26" height="2.5" rx="1.25" fill="#444" />
      </g>
    </svg>
  );
}

export function SceneIndustriesCarousel({
  arrowsPosition,
  arrowsTrailing,
}: {
  /** Forwarded to the underlying Carousel. Opt-in; omit for the live
   *  (left-arrows) behavior. */
  arrowsPosition?: "left" | "right" | "center";
  arrowsTrailing?: React.ReactNode;
} = {}) {
  // Every popup opens with the video showcase (2026-07-14: "every piece of
  // info on the site has a video twin"). Cards with a live demo get the
  // primary CTA; the rest point at the roofing demo until theirs exists.
  const items = INDUSTRIES.map((c, i) => {
    const card: IndustryCard = {
      ...c,
      content: (
        <>
          <IndustryDemoShowcase
            demoUrl={c.demoUrl}
            headline={c.demoHeadline ?? "See the system working before you buy it"}
            sub={
              c.demoSub ??
              `The same platform, pre-configured for ${c.title.toLowerCase()} — AI receptionist, online booking, automated follow-ups, and a pipeline you can actually read.`
            }
          />
          {c.content}
        </>
      ),
    };
    return <Card key={c.title} card={card} index={i} />;
  });
  return (
    <div className="w-full">
      <Carousel items={items} arrowsPosition={arrowsPosition} arrowsTrailing={arrowsTrailing} />
    </div>
  );
}
