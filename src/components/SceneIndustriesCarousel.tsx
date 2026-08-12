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
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { EverythingIncluded } from "@/components/EverythingIncluded";
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
            site widget. Get started stays the primary next step (→ /start). */}
        <p className="mt-4 text-sm font-medium text-text">
          Try it right here — talk to the AI receptionist or chat with it, no
          need to leave this page:
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="/start"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
          >
            Get started
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={() => window.__startDemoVoiceCall?.()}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
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
