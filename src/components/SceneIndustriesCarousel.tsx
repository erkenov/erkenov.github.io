"use client";

/**
 * SceneIndustriesCarousel — "Built for your industry" Apple Cards.
 *
 * NEW scene 2026-05-24 (Shamil). Pattern borrowed and improved from
 * SuiteDash's vertical-tile section. The big win for cold non-technical
 * prospects: they don't know what a CRM is, but they DO know they're a
 * dropzone or a BJJ academy or a boutique hotel. Each card shows the
 * pipeline pre-configured for THAT industry — pre-built voice scripts,
 * intake forms, pipeline stages, automations.
 *
 * REPOSITIONED 2026-08-01 (Shamil): swapped the original 16 generic
 * local-service-business cards (dental, HVAC, law firms, etc.) for 15
 * passion industries — experience businesses Shamil actually lives in
 * himself (flying, riding, diving, sailing, training). Flight schools
 * stays the flagship card: it's the only one with a live demo subdomain.
 * The unifying story across every card: someone calls or messages to book
 * a high-emotion experience while the owner is out flying, riding,
 * coaching, or on the water — the same booking-chaos, no-follow-up,
 * seasonal-swing pattern every time. See
 * vault/03-research/2026-08-01-passion-industries-positioning.md for the
 * full per-industry money map this copy is grounded in.
 *
 * 2026-09-03 (Shamil): the 15 generic cards are BACK alongside the passion
 * set ("bring back the industries cards, all of them") — full 27-card set,
 * restored verbatim from archive/generic-industry-cards-removed-2026-08-09.txt.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { EverythingIncluded } from "@/components/EverythingIncluded";
import { WhatYouGetCompact } from "@/components/ProductSections";
import DemoVoiceWidget from "@/app/demo/components/DemoVoiceWidget";
import { getDemoConfig, type DemoConfig } from "@/app/demo/config";
import { openErkenChat } from "@/components/ErkenChatWidget";

declare global {
  interface Window {
    __startDemoVoiceCall?: () => void;
  }
}

/** Card demoUrl hostname prefix → demo config slug, where the subdomain
 *  shortname differs from the registry slug (fly.erken.systems →
 *  "flight-schools", etc.). Prefixes not listed here match their slug
 *  directly (bjj, gym, yacht, horse, farm, tennis, surf). */
const DEMO_SUBDOMAIN_TO_SLUG: Record<string, string> = {
  fly: "flight-schools",
  auto: "automotive",
  moto: "motorcycle",
  sky: "skydiving",
  climb: "climbing",
};

/** Card → DemoConfig for the popup's inline voice demo. Derives the
 *  registry slug from the card's demoUrl hostname; cards without a
 *  demoUrl (or with an unmatched one) fall back to the flight-school
 *  config — same fallback the old FLIGHT_DEMO_URL link used. */
function demoConfigForCard(demoUrl?: string): DemoConfig {
  const fallback = getDemoConfig("flight-schools")!;
  if (!demoUrl) return fallback;
  let prefix = "";
  try {
    prefix = new URL(demoUrl).hostname.split(".")[0];
  } catch {
    return fallback;
  }
  return getDemoConfig(DEMO_SUBDOMAIN_TO_SLUG[prefix] ?? prefix) ?? fallback;
}

// Style 2 — full-bleed photographic image. Pure photo, no overlay.
// The only closed-card visual treatment still in use (2026-08-01): the
// flight-school flagship card. The A/B/C/D/E experiment this used to sit
// inside (Shamil 2026-05-26) is retired along with the 16 generic-industry
// cards it was tested on; styles 1/3/4/5 and their icon imports are gone.
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

type IndustryCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  /** Optional ReactNode rendered as the CLOSED-card visual (overlay).
   *  When provided, replaces the default colored BlurImage background.
   *  Used for the A/B/C/D/E card-visual experiment. */
  visual?: React.ReactNode;
  /** Live demo subdomain for this industry (e.g. https://fly.erken.systems).
   *  2026-08-12: no longer linked out to — the popup mounts an INLINE voice
   *  demo whose DemoConfig is derived from this URL's hostname (see
   *  demoConfigForCard). When absent, the flight-school config is used. */
  demoUrl?: string;
  /** Optional per-industry override for the showcase headline/sub. */
  demoHeadline?: string;
  demoSub?: string;
};

/** The one live demo that exists today — linked from no-demo cards too.
 *  2026-07-28: the demo sub-account was converted roofing → flight school
 *  (Sonoran Skyline Flight Academy), so the card and URL moved with it.
 *  fly.erken.systems serves the same funnel; roofing.erken.systems stays
 *  attached so previously shared links keep working. */
const FLIGHT_DEMO_URL = "https://fly.erken.systems";

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
  // 0. Flight schools — FIRST card (the flagship: only industry with a
  // LIVE demo subdomain + the video-first popup treatment; converted from
  // the roofing card 2026-07-28 when the demo sub-account became a flight
  // school).
  {
    category: "Aviation · flight training",
    title: "Flight schools",
    src: ph("Flight school", "5E7E9B"),
    visual: <CardStyle2Photo src="/industries/card-flightschool-photo.jpg" />,
    demoUrl: FLIGHT_DEMO_URL,
    demoHeadline: "A real flight-school setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete flight school system — website, online booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a test discovery flight and watch what your students would experience.",
    content: (
      <>
        <IndustryBodySteps
          steps={[
            {
              title: "Capture — every call, chat, and form gets answered",
              description:
                "Your AI receptionist picks up on the first ring, day or night. Web chat, contact forms, and an online booking calendar catch everyone else. Someone asking about lessons gets qualified — goal, prior hours, medical status, availability — and booked into an open discovery-flight slot on the spot. Nothing missed, no student lost.",
              image: IMG.step1,
              imageAlt: "AI receptionist booking a discovery flight",
            },
            {
              title: "Organized — every inquiry lands in one place automatically",
              description:
                "Name, training goal, prior experience, preferred schedule — all dropped into one organized student list the moment they reach out. Nothing to type up, nothing on a sticky note. Your instructors see the full picture before the first lesson.",
              image: IMG.step2,
              imageAlt: "Student details saved automatically",
            },
            {
              title: "Automatic — follow-ups, updates, and reminders run themselves",
              description:
                "Booking confirmation, discovery-flight reminder, enrollment steps, lesson reminders, and a post-flight review request — all sent automatically in your school's voice. The student stays in the loop at every step without your front desk lifting a finger.",
              image: IMG.step4,
              imageAlt: "Automated student messages",
            },
            {
              title: "Visible — every student trackable from first call to checkride",
              description:
                "Inquiry → discovery flight booked → enrolled → training → checkride. One clear board shows exactly who's moving, who's stalled, and who finished — so you always know where every student stands and where to push.",
              image: IMG.step3,
              imageAlt: "Student pipeline view",
            },
          ]}
          outcome="The same system runs behind every student — inquiries get answered, details get captured, follow-ups run themselves, and you see the whole school at a glance."
        />
      </>
    ),
  },
  // 1. Jiu Jitsu — BJJ academies. Shamil's explicit call: separate card
  // from Gyms.
  {
    category: "Martial arts · Jiu Jitsu",
    title: "Jiu Jitsu academies",
    src: ph("Jiu Jitsu", "5F8368"),
    visual: <CardStyle2Photo src="/industries/card-bjj-photo.jpg" />,
    demoUrl: "https://bjj.erken.systems",
    demoHeadline: "A real BJJ academy setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete Jiu-Jitsu academy system — website, trial-class booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a trial class and watch what your members would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every trial-class inquiry gets booked, not ignored",
            description:
              "Your AI receptionist answers while you're rolling or running a kids' class. It books a trial class straight off the ad or the DM, and sends a show-up reminder so trials that would've no-showed actually walk through the door.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a BJJ trial class",
          },
          {
            title: "Organized — every member's info lands in one place automatically",
            description:
              "Belt level, goals, trial status, billing — all dropped into one organized list. No more trying to remember who signed the trial waiver last Tuesday.",
            image: IMG.step2,
            imageAlt: "Member details saved automatically",
          },
          {
            title: "Automatic — win-backs and billing hygiene run themselves",
            description:
              "Lapsed members get a win-back message before they quietly disappear for good. Kids-program follow-ups go straight to the parent who's actually paying. Failed-card and billing reminders go out automatically instead of an awkward mat-side conversation.",
            image: IMG.step4,
            imageAlt: "Automated lapsed-member win-back and billing reminders",
          },
          {
            title: "Visible — every member trackable from trial to active",
            description:
              "Trial booked → showed → signed up → active → at risk of lapsing. One board shows exactly who needs a check-in before they drift off the mat.",
            image: IMG.step3,
            imageAlt: "BJJ academy member pipeline view",
          },
        ]}
        outcome="Academies running trial-show reminders typically convert more first-timers into signed members without the owner ever picking up the phone between classes."
      />
    ),
  },
  // 2. Gyms — boutique gyms & boxes. Merge candidate with Jiu Jitsu per the
  // money map, but Shamil's explicit call keeps them as two cards.
  {
    category: "Fitness · boutique gyms",
    title: "Gyms & boxes",
    src: ph("Gyms", "8A9A5B"),
    visual: <CardStyle2Photo src="/industries/card-gym-photo.jpg" />,
    demoUrl: "https://gym.erken.systems",
    demoHeadline: "A real gym setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete boutique gym system — website, class booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book an intro class and watch what your members would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every trial and class inquiry gets booked",
            description:
              "Your AI receptionist answers while you're coaching a class or running a WOD. It books an intro class or session right off the website or a walk-by scan, and confirms it the same day.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a gym trial",
          },
          {
            title: "Organized — every member's info lands in one place automatically",
            description:
              "Goals, trial status, class preferences, membership plan — all dropped into one organized list. Your coaches see who's new before the first rep.",
            image: IMG.step2,
            imageAlt: "Gym member details saved automatically",
          },
          {
            title: "Automatic — no-show reduction and win-backs run themselves",
            description:
              "Trial and class reminders cut no-shows before they happen. Members who haven't checked in for two weeks get a win-back message automatically, and referral asks go out after a good streak — no staff member chasing anyone down.",
            image: IMG.step4,
            imageAlt: "Automated no-show reminders and member win-back",
          },
          {
            title: "Visible — every member trackable from trial to renewal",
            description:
              "Trial → joined → active → at risk → lapsed. One board shows exactly who's about to fall off before it happens, not after the next billing cycle fails.",
            image: IMG.step3,
            imageAlt: "Gym member pipeline view",
          },
        ]}
        outcome="Boxes running automated win-back sequences typically reactivate a meaningful slice of lapsed members every month without a staff member making a single call."
      />
    ),
  },
  // 3. Yachting — charter operators & sailing schools. High ticket,
  // speed-to-reply decides who wins the booking.
  {
    category: "Yachting · charters & schools",
    title: "Yacht charters & sailing schools",
    src: ph("Yachting", "3F6E8C"),
    visual: <CardStyle2Photo src="/industries/card-yachting-photo.jpg" />,
    demoUrl: "https://yacht.erken.systems",
    demoHeadline: "A real charter company setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete yacht charter system — website, instant quotes, AI assistant, automated follow-ups — built on our platform and open for you to click through. Get a quote and watch what your clients would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every charter inquiry gets an instant quote",
            description:
              "Your AI assistant answers a midnight charter inquiry with an instant quote and live availability, before the client books a competitor's boat while you're asleep or out on the water.",
            image: IMG.step1,
            imageAlt: "AI assistant quoting a yacht charter inquiry",
          },
          {
            title: "Organized — every inquiry's info lands in one place automatically",
            description:
              "Charter dates, guest count, budget, course interest — all dropped into one organized list. Your crew sees the full picture before the first call back.",
            image: IMG.step2,
            imageAlt: "Charter inquiry details saved automatically",
          },
          {
            title: "Automatic — deposits and reactivation run themselves",
            description:
              "Deposit collection goes out the moment a charter or course is confirmed. Past charter guests get a seasonal reactivation message when the sailing season opens, and boat-club membership offers go out automatically to warm leads.",
            image: IMG.step4,
            imageAlt: "Automated deposit collection and seasonal reactivation",
          },
          {
            title: "Visible — every client trackable from inquiry to repeat charter",
            description:
              "Inquiry → quoted → deposit paid → chartered → reactivated. One board shows which high-value clients are due for a call before another operator reaches them first.",
            image: IMG.step3,
            imageAlt: "Yacht charter client pipeline view",
          },
        ]}
        outcome="Charter operators answering inquiries within minutes typically win the booking over operators who are still checking messages the next morning."
      />
    ),
  },
  // 6. Automotive — repair shops, performance & tuning, rentals, dealerships.
  // Shamil's explicit call: NOT detailing/tint/wrap.
  {
    category: "Automotive · repair & performance",
    title: "Automotive shops",
    src: ph("Automotive", "9C7454"),
    visual: <CardStyle2Photo src="/industries/card-automotive-photo.jpg" />,
    demoUrl: "https://auto.erken.systems",
    demoHeadline: "A real auto shop setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete auto repair shop system — website, online booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a drop-off and watch what your customers would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every call gets answered, even with the bay full",
            description:
              "Your AI receptionist picks up while your techs are elbow-deep in an engine or mid-dyno-run on a tune. It diagnoses the issue or qualifies the build request, checks your live booking calendar, and books a drop-off slot right there on the call.",
            image: IMG.step1,
            imageAlt: "AI receptionist answering a shop call",
          },
          {
            title: "Organized — every vehicle and customer lands in one place automatically",
            description:
              "Make, model, mileage, the issue or the mod request — all dropped into your job list the moment they hang up. No clipboard, no whiteboard, no re-typing later.",
            image: IMG.step2,
            imageAlt: "Vehicle and customer details saved automatically",
          },
          {
            title: "Automatic — quote follow-up and maintenance reminders run themselves",
            description:
              "A quote that goes quiet gets a follow-up instead of dying. Oil-change, tune-up, and seasonal-tire reminders go out automatically when a vehicle is due, and a review request lands after every pickup.",
            image: IMG.step4,
            imageAlt: "Automated quote follow-up and maintenance reminders",
          },
          {
            title: "Visible — every job trackable from quote to pickup",
            description:
              "Quote requested → approved → in the bay → ready → picked up → reviewed. One clear board shows what's stuck on approval and what's about to close.",
            image: IMG.step3,
            imageAlt: "Automotive job pipeline view",
          },
        ]}
        outcome="Shops running quote follow-up typically close a meaningfully higher share of the quotes that would have gone cold after the first callback."
      />
    ),
  },
  // 8. Horse riding — riding schools & trail-ride operators. Among the
  // least digitized industries on the list.
  {
    category: "Equestrian · riding schools",
    title: "Horse riding schools",
    src: ph("Horse riding", "8B5E3C"),
    visual: <CardStyle2Photo src="/industries/card-horseriding-photo.jpg" />,
    demoUrl: "https://horse.erken.systems",
    demoHeadline: "A real riding stable setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete riding stable system — website, lesson and trail-ride booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a ride and watch what your riders would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every lesson and trail-ride inquiry gets answered",
            description:
              "Your AI receptionist answers while you're in the barn or leading a trail ride, replacing the paper booking book and the Facebook DMs that used to sit unread for days. It qualifies experience level and books the slot on the spot.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a horse riding lesson",
          },
          {
            title: "Organized — every rider's info lands in one place automatically",
            description:
              "Experience level, lesson schedule, trail-ride date, waiver status — all dropped into one organized list. No more flipping through a paper book to find who's booked for Saturday.",
            image: IMG.step2,
            imageAlt: "Rider details saved automatically",
          },
          {
            title: "Automatic — billing and waivers run themselves",
            description:
              "Recurring lesson billing goes out without a manual invoice. Waiver signatures get collected automatically before a rider ever shows up, and boarding inquiries flow into a real pipeline instead of a text thread.",
            image: IMG.step4,
            imageAlt: "Automated lesson billing and waiver collection",
          },
          {
            title: "Visible — every rider trackable from inquiry to recurring student",
            description:
              "Inquiry → booked → lesson or ride completed → recurring student. One board shows who's a regular now and who needs a follow-up to come back.",
            image: IMG.step3,
            imageAlt: "Horse riding school rider pipeline view",
          },
        ]}
        outcome="Barns moving off paper books typically see waivers signed and lessons billed automatically instead of chasing both by hand every single week."
      />
    ),
  },
  // 9. Motorcycle — riding schools, moto tours, rentals, repair/custom
  // shops. Shamil's explicit call: separate from Automotive.
  {
    category: "Motorcycle · riding & rentals",
    title: "Motorcycle shops",
    src: ph("Motorcycle", "A85C3B"),
    visual: <CardStyle2Photo src="/industries/card-motorcycle-photo.jpg" />,
    demoUrl: "https://moto.erken.systems",
    demoHeadline: "A real moto shop setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete motorcycle tour and rental system — website, online booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a tour and watch what your riders would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — course, tour, and rental inquiries all get answered",
            description:
              "Your AI receptionist picks up for riding-course enrollment calls and for tourists messaging about a guided tour or a rental at odd hours in a different time zone. It qualifies license class or tour dates and books the slot on the spot.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a riding course or tour",
          },
          {
            title: "Organized — every rider's info lands in one place automatically",
            description:
              "License class, course level, tour dates, deposit status — all dropped into one organized list. Your instructors and tour lead see the full picture before the rider shows up.",
            image: IMG.step2,
            imageAlt: "Rider details saved automatically",
          },
          {
            title: "Automatic — deposits and win-backs run themselves",
            description:
              "Deposit collection links go out the moment a tour or rental is confirmed. Past riders and renters get a seasonal win-back message when the riding season opens back up, without anyone digging through last year's spreadsheet.",
            image: IMG.step4,
            imageAlt: "Automated deposit collection and seasonal win-back",
          },
          {
            title: "Visible — every rider trackable from inquiry to repeat business",
            description:
              "Inquiry → course enrolled or tour booked → deposit paid → completed → reactivated. You always know who's confirmed and who's still on the fence.",
            image: IMG.step3,
            imageAlt: "Motorcycle rider pipeline view",
          },
        ]}
        outcome="Shops answering tour and rental inquiries around the clock typically book the traveler who messages at 2am before a competitor even sees the message."
      />
    ),
  },
  // 10. Farming — agritourism, CSA, and greenhouse operations, the
  // consumer-facing edge of farming (not commodity row-crop).
  {
    category: "Agritourism · farming",
    title: "Farms & agritourism",
    src: ph("Farms", "9C8B4E"),
    visual: <CardStyle2Photo src="/industries/card-farming-photo.jpg" />,
    demoUrl: "https://farm.erken.systems",
    demoHeadline: "A real farm setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete farm and CSA system — website, tour booking, AI assistant, automated follow-ups — built on our platform and open for you to click through. Book a visit and watch what your customers would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every tour and box inquiry gets answered from the field",
            description:
              "Your AI assistant answers farm-stay, tour, and pick-your-own inquiries while you're out in the greenhouse or the field with no signal on you. It books the slot or starts the CSA sign-up right there.",
            image: IMG.step1,
            imageAlt: "AI assistant booking a farm tour or CSA box",
          },
          {
            title: "Organized — every visitor and subscriber lands in one place automatically",
            description:
              "Tour date, group size, CSA box preferences and pickup location — all dropped into one organized list. No sticky notes on the farmhouse fridge.",
            image: IMG.step2,
            imageAlt: "Farm visitor and CSA subscriber details saved automatically",
          },
          {
            title: "Automatic — seasonal campaigns and weekly comms run themselves",
            description:
              "CSA members get their weekly box update without you writing it by hand every Sunday night. Harvest-week and u-pick-opening announcements go out automatically to your list the moment a new window opens.",
            image: IMG.step4,
            imageAlt: "Automated seasonal campaigns and CSA weekly updates",
          },
          {
            title: "Visible — every visitor and subscriber trackable across the season",
            description:
              "Inquiry → booked or subscribed → visited or delivered → repeat. One board shows which CSA members are about to lapse and which wholesale buyers haven't reordered.",
            image: IMG.step3,
            imageAlt: "Farm visitor and subscriber pipeline view",
          },
        ]}
        outcome="Farms running seasonal campaign automation typically fill u-pick and harvest-event slots without the owner posting the same reminder by hand every week."
      />
    ),
  },
  // 11. Skydiving — dropzones & wind tunnels. Same anatomy as flight
  // schools (discovery experience → course → license path); weather-cancel
  // auto-rebooking is the #1 operational pain here.
  {
    category: "Adventure · skydiving",
    title: "Skydiving",
    src: ph("Skydiving", "5B84A6"),
    visual: <CardStyle2Photo src="/industries/card-skydiving-photo.jpg" />,
    demoUrl: "https://sky.erken.systems",
    demoHeadline: "A real dropzone setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete skydiving dropzone system — website, online booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a tandem jump and watch what your jumpers would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every call and jump inquiry gets answered",
            description:
              "Your AI receptionist picks up when the load is grounded and the phone won't stop, or when you're up in the plane and can't reach it at all. It qualifies tandem vs AFF course interest, checks weight and age requirements, and books an open slot on the load calendar on the spot.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a tandem jump slot",
          },
          {
            title: "Organized — every jumper's info lands in one place automatically",
            description:
              "Name, jump type, weight, any prior jumps, waiver status — all dropped into one organized list the moment they reach out. Your manifest desk sees the full picture before the jumper shows up.",
            image: IMG.step2,
            imageAlt: "Jumper details saved automatically",
          },
          {
            title: "Automatic — weather-cancel auto-rebooking runs itself",
            description:
              "When a load gets scrubbed for weather, every affected jumper gets an instant text with the next available slot instead of your desk fielding the same call twenty times. Confirmations, reminders, and post-jump review requests go out automatically too.",
            image: IMG.step4,
            imageAlt: "Automated weather-cancel rebooking messages",
          },
          {
            title: "Visible — every jumper trackable from inquiry to license",
            description:
              "Inquiry → tandem booked → jumped → AFF course offered → licensed. One clear board shows who's ready for the next step and who needs a nudge back in.",
            image: IMG.step3,
            imageAlt: "Jumper pipeline view",
          },
        ]}
        outcome="Dropzones running weather-cancel auto-rebooking typically recover most of a scrubbed day's bookings within 48 hours instead of losing them to whichever dropzone answers the phone first."
      />
    ),
  },
  // 12. Tennis — clubs & academies. Junior programs are the real money;
  // parents are the buyers.
  {
    category: "Racquet sports · tennis",
    title: "Tennis clubs & academies",
    src: ph("Tennis", "7FA06B"),
    visual: <CardStyle2Photo src="/industries/card-tennis-photo.jpg" />,
    demoUrl: "https://tennis.erken.systems",
    demoHeadline: "A real tennis academy setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete tennis academy system — website, trial-lesson booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book a trial lesson and watch what your members would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every parent call gets answered, even mid-lesson",
            description:
              "Your AI receptionist answers when a parent calls about the junior program while your pro is on court and the front desk is unstaffed. It qualifies age and level and books a trial lesson on the spot.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a junior tennis trial lesson",
          },
          {
            title: "Organized — every student's info lands in one place automatically",
            description:
              "Age, level, parent contact, lesson schedule — all dropped into one organized list. Your pros see the full roster before the first lesson.",
            image: IMG.step2,
            imageAlt: "Tennis student details saved automatically",
          },
          {
            title: "Automatic — billing and renewals run themselves",
            description:
              "Recurring lesson billing runs without a monthly invoice chase. Court-utilization campaigns fill the dead 2pm hour, and renewal reminders go out before a membership quietly lapses at season's end.",
            image: IMG.step4,
            imageAlt: "Automated recurring billing and renewal reminders",
          },
          {
            title: "Visible — every student trackable from trial to renewal",
            description:
              "Inquiry → trial lesson → enrolled → renewed → lapsed. One board shows which juniors are due for the next level up and which memberships need a renewal push.",
            image: IMG.step3,
            imageAlt: "Tennis academy student pipeline view",
          },
        ]}
        outcome="Academies running renewal automation typically catch memberships before they quietly lapse at the end of a season instead of finding out after the court's already empty."
      />
    ),
  },
  // 16. Climbing — climbing gyms & small guiding outfits.
  {
    category: "Adventure · climbing",
    title: "Climbing gyms & guides",
    src: ph("Climbing", "7C8A99"),
    visual: <CardStyle2Photo src="/industries/card-climbing-photo.jpg" />,
    demoUrl: "https://climb.erken.systems",
    demoHeadline: "A real climbing gym setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete climbing gym system — website, class booking, AI receptionist, automated follow-ups — built on our platform and open for you to click through. Book an intro class and watch what your members would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every intro-class and party inquiry gets answered",
            description:
              "Your AI receptionist answers while your staff are on the wall belaying an intro class. It books intro-to-climbing sessions and birthday-party slots, and qualifies guide-trip inquiries by experience level and dates.",
            image: IMG.step1,
            imageAlt: "AI receptionist booking a climbing intro class",
          },
          {
            title: "Organized — every visitor's info lands in one place automatically",
            description:
              "Intro-class date, party headcount, waiver status, guide-trip experience level — all dropped into one organized list. Your team sees who's coming before they check in.",
            image: IMG.step2,
            imageAlt: "Climbing visitor details saved automatically",
          },
          {
            title: "Automatic — the membership funnel and trip logistics run themselves",
            description:
              "Intro-class attendees get a membership offer automatically the next day, while it's still fresh. Guide-trip inquiries get weather-and-waiver logistics handled without a back-and-forth email chain.",
            image: IMG.step4,
            imageAlt: "Automated membership offer and guide-trip logistics",
          },
          {
            title: "Visible — every visitor trackable from intro class to member",
            description:
              "Intro class → membership offered → joined → renewed. One board shows exactly which first-timers are still on the fence about signing up.",
            image: IMG.step3,
            imageAlt: "Climbing gym visitor pipeline view",
          },
        ]}
        outcome="Gyms running the intro-to-membership funnel typically convert more first-time climbers into members instead of letting them stay a one-and-done visit."
      />
    ),
  },
  // 17. Surfing — surf schools & camps. International, multilingual,
  // WhatsApp-heavy clientele messaging while the owner is in the water.
  {
    category: "Adventure · surfing",
    title: "Surf schools & camps",
    src: ph("Surfing", "5B93A0"),
    visual: <CardStyle2Photo src="/industries/card-surfing-photo.jpg" />,
    demoUrl: "https://surf.erken.systems",
    demoHeadline: "A real surf camp setup, running live right now",
    demoSub:
      "This isn't a mockup. It's a complete surf camp system — website, lesson booking, AI assistant, automated follow-ups — built on our platform and open for you to click through. Book a lesson and watch what your guests would experience.",
    content: (
      <IndustryBodySteps
        steps={[
          {
            title: "Capture — every message gets answered, day or night",
            description:
              "Your AI assistant answers WhatsApp, web chat, and calls around the clock for international guests messaging from a different time zone while you're out on the water. It qualifies package interest and books the slot on the spot.",
            image: IMG.step1,
            imageAlt: "AI assistant answering a surf camp inquiry",
          },
          {
            title: "Organized — every guest's info lands in one place automatically",
            description:
              "Package interest, dates, language, deposit status — all dropped into one organized list. Your team sees who's confirmed before the guest lands.",
            image: IMG.step2,
            imageAlt: "Surf camp guest details saved automatically",
          },
          {
            title: "Automatic — the pre-arrival journey runs itself",
            description:
              "Deposit links go out the moment a package is confirmed. A pre-arrival sequence covers what to bring, airport transfers, and gear upsells, so guests show up prepped instead of your front desk explaining it all on day one.",
            image: IMG.step4,
            imageAlt: "Automated pre-arrival guest journey",
          },
          {
            title: "Visible — every guest trackable from inquiry to repeat booking",
            description:
              "Inquiry → deposit paid → arrived → week completed → reviewed → reactivated next season. One board shows who's ready for a win-back message when the season turns.",
            image: IMG.step3,
            imageAlt: "Surf camp guest pipeline view",
          },
        ]}
        outcome="Camps running a pre-arrival journey typically see more guests show up ready to book extra sessions or gear instead of figuring it out on arrival."
      />
    ),
  },
  // ---- Restored generic-industry cards (2026-08-04) -----------------
  // The 15 generic verticals removed in e76296c, brought back verbatim
  // alongside the passion cards (Shamil: "bring them back, don't remove
  // the current ones"). "Auto repair shops" from the old set was left
  // out as a functional duplicate of the current "Automotive shops".
  // sub-account was converted to the flight-school demo, so no demoUrl here
  // anymore; the showcase falls back to the flight-school demo like every
  // other no-demo card). Content restored verbatim from before the conversion.
  {
    category: "Trades · roofing",
    title: "Roofing contractors",
    src: ph("Roofing", "B8786A"),
    visual: <CardStyle2Photo src="/industries/card-roofing-photo.jpg" />,
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
  // 2. Dental practices — visual STYLE 2 (full-bleed real photo, like vet)
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
 * CTAs below it, the step-by-step breakdown stays under that.
 *
 * 2026-08-12 (owner ruling): the "Try the live demo" button — which
 * navigated away to the demo subdomain — is REPLACED by an inline demo:
 * "Talk to the AI receptionist" starts a Retell web call right inside the
 * popup (DemoVoiceWidget mounted below, configured per industry from the
 * card's demoUrl hostname) and "Chat with it" opens the shared site chat
 * widget. No navigation. DemoVoiceWidget unmounts with the popup (the
 * carousel renders card.content only while open), and its effect cleanup
 * stops any live call.
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
  const demoConfig = demoConfigForCard(demoUrl);
  return (
    // Horizontal 16:9 demo video ON TOP (streamer-style: full screen + cam in
    // the corner), pitch + CTA below (2026-07-20: was a narrow vertical clip
    // beside the text). Same video source; the frame is now landscape and the
    // text sits under the wide player where it reads naturally.
    // --d-accent: DemoVoiceWidget's fallback panel reads var(--d-accent) for
    // its Send button (demo pages set the whole --d-* palette per industry);
    // the popup just maps it to the site's own accent.
    <div
      className="mb-12 flex flex-col gap-6"
      style={{ "--d-accent": "var(--accent)" } as React.CSSProperties}
    >
      {/* Horizontal 16:9 demo video — placeholder: the main-page intro clip */}
      <div className="mx-auto w-full max-w-2xl">
        <Scene1IntroVideo orientation="landscape" />
      </div>
      {/* Pitch + CTAs */}
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
        {/* Inline demo (2026-08-12): test the AI receptionist by voice or
            chat WITHOUT leaving this page — the voice call runs in-browser
            via the DemoVoiceWidget mounted below; the chat opens the shared
            site widget. Get started → #pricing (2026-08-16: /start trial
            funnel retired — buyers go through the pricing cards). */}
        <p className="mt-4 text-sm font-medium text-text">
          Try it right here — talk to the AI receptionist or chat with it, no
          need to leave this page:
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-6 py-3 font-medium text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
          >
            Get started
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={() => window.__startDemoVoiceCall?.()}
            className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-6 py-3 font-medium text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
          >
            Talk to the AI receptionist
          </button>
          <button
            type="button"
            onClick={() => openErkenChat()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-text transition-colors hover:border-border-strong hover:bg-surface"
          >
            Chat with it
          </button>
        </div>
      </div>
      {/* Mounted inside the popup content, so exactly ONE instance exists
          (only while a card is open) and closing the popup unmounts it —
          the widget's cleanup ends any live call and removes the
          window.__startDemoVoiceCall global. */}
      <DemoVoiceWidget config={demoConfig} />
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
  // info on the site has a video twin"). The demo is INLINE (2026-08-12):
  // each popup mounts a DemoVoiceWidget whose DemoConfig comes from the
  // card's demoUrl hostname (flight-school config as fallback), and "Chat
  // with it" opens the shared site chat widget — no navigation away.
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
          {/* What-you-get listing + stacked video slots inside every opened
              card (Shamil 2026-09-03) — shared data from ProductSections,
              so it can't drift from the homepage run. */}
          <WhatYouGetCompact />
          <EverythingIncluded />
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
