/**
 * /docs content — the Flight School CRM docs portal (LOCAL-ONLY review
 * draft, 2026-08-22, ordered by Shamil after docs.flightschoolcrm.com).
 *
 * Audience: FLIGHT SCHOOL OWNERS running The Receptionist (the
 * white-labeled platform). Never name the underlying vendor in article
 * copy — generic UI names (Conversations, Calendars, Workflows,
 * Reputation) are fine, the white-label keeps them.
 *
 * Click-paths are grounded in the scraped help-center KB that backs the
 * site's guide bot (src/app/api/guide/kb-index-q.json — raw text lives
 * in its `meta` array). Steps we could not ground in the KB carry a
 * `// (verify) ...` code comment directly above the string — re-check
 * them against a live account before this portal goes public. (verify)
 * notes must NEVER appear inside rendered strings.
 */

export type DocStep = {
  title: string;
  text: string;
};

export type DocArticle = {
  slug: string;
  category: string; // DocCategory id
  title: string;
  blurb: string;
  videoLabel: string;
  intro: string;
  steps: DocStep[];
  outro?: string;
};

export type DocCategory = {
  id: string;
  name: string;
  tagline: string;
  icon:
    | "compass"
    | "phone-call"
    | "calendar-check"
    | "phone-missed"
    | "star"
    | "megaphone"
    | "receipt";
};

export const DOC_CATEGORIES: DocCategory[] = [
  {
    id: "getting-started",
    name: "Getting started",
    tagline: "Your first days with the platform, from login to first booking.",
    icon: "compass",
  },
  {
    id: "ai-receptionist",
    name: "Your AI receptionist",
    tagline: "What it says, what it knows, and what happens when it doesn't.",
    icon: "phone-call",
  },
  {
    id: "bookings-calendar",
    name: "Bookings & calendar",
    tagline: "Discovery flights, student lessons, and CFI schedules.",
    icon: "calendar-check",
  },
  {
    id: "missed-calls",
    name: "Missed calls & callbacks",
    tagline: "The 1-minute callback and 5-minute text, explained.",
    icon: "phone-missed",
  },
  {
    id: "reviews-reputation",
    name: "Reviews & reputation",
    tagline: "Turn happy discovery-flight passengers into five-star reviews.",
    icon: "star",
  },
  {
    id: "campaigns-nurture",
    name: "Campaigns & nurture",
    tagline: "Keep leads warm until they book — automatically.",
    icon: "megaphone",
  },
  {
    id: "billing",
    name: "Billing & your account",
    tagline: "$97 flat, voice minutes at cost, no contract. The details.",
    icon: "receipt",
  },
];

export const DOC_ARTICLES: DocArticle[] = [
  /* ------------------------------ Getting started --------------------- */
  {
    slug: "first-week",
    category: "getting-started",
    title: "Your first week with the Receptionist",
    blurb:
      "Day-by-day: what to check, what to test, and what 'good' looks like by Friday.",
    videoLabel: "Your first week walkthrough",
    intro:
      "Setup is done for you before you ever log in — number forwarded, calendar connected, the Receptionist briefed on your school. Your first week isn't about building anything. It's about watching the system work and learning where everything lives. Here's the week, day by day.",
    steps: [
      {
        title: "Day 1 — Log in and look around",
        text: "Open the platform link from your welcome email and sign in. The left sidebar is your map: Conversations, Calendars, Contacts, Opportunities, Reputation, and Automation (Workflows). Don't change anything today — just click through each one so the names stop being unfamiliar.",
      },
      {
        title: "Day 2 — Call your own school",
        text: "From a phone that isn't the school line, call your school number and let it ring past your staff (or call after hours). The Receptionist should answer within a few rings. Ask it the questions your prospects actually ask: 'How much is a discovery flight?', 'Do I need any experience?', 'How do I start?' Listen to how it answers.",
      },
      {
        title: "Day 2 — Check the conversation landed",
        text: "Open Conversations in the sidebar. Your test call is there — recording, transcript, and the contact it created. This inbox is where every call, text, and website chat lands from now on.",
      },
      {
        title: "Day 3 — Book a test discovery flight",
        text: "Call or text again and this time say you want to book a discovery flight. The Receptionist offers real open slots from your calendar and books one. Open Calendars and confirm the appointment appeared, with the caller's name and phone number attached. Then open Contacts and find the new lead.",
      },
      {
        title: "Day 4 — Watch the pipeline",
        // (verify) exact pipeline stage names depend on how the pipeline was
        // configured at setup — check a live account before publishing.
        text: "Open Opportunities. Your test booking sits in the pipeline as a card — typically starting in a 'New lead' or 'Discovery booked' stage. This is how you'll see every prospective student at a glance.",
      },
      {
        title: "Day 5 — Try to stump it",
        text: "Call once more and ask something it can't possibly know — 'Can my dog ride along on the discovery flight?' It should say honestly that it doesn't know, take your details, and promise a call back. Check your phone: you got a summary text. That behavior is deliberate — see 'What the Receptionist does when it doesn't know an answer'.",
      },
      {
        title: "From here — let it run",
        text: "The system handles the routine from day one. Your job in week one is just to build trust in it: glance at Conversations each morning, and call us if anything an answer gave you pause. Tweaks are ours to make, not yours.",
      },
    ],
    outro:
      "By the end of the week you should have seen the full loop once: call answered, flight booked, lead logged, you notified. That's the whole product.",
  },
  {
    slug: "platform-tour",
    category: "getting-started",
    title: "Finding your way around the platform",
    blurb:
      "The six sidebar sections you'll actually use, and what each one is for.",
    videoLabel: "Platform tour",
    intro:
      "The platform is deep — it can run your whole school's marketing. In practice, you'll live in six places. This tour tells you what each one does and when you'll open it.",
    steps: [
      {
        title: "Conversations — your one inbox",
        text: "Every call recording, transcript, text thread, and website chat, in one list. When you want to know 'what did it say to that person?', the answer is always here.",
      },
      {
        title: "Calendars — where bookings live",
        // (verify) list-view label — 'Appointments' vs 'List view' — varies
        // by account version (KB: how-to-manage-appointments-with-appointment-list-view).
        text: "Your discovery-flight calendar (and lesson calendars, if we set them up) with real availability. Appointments the Receptionist books appear here instantly. Use the list view to see upcoming appointments as a table instead of a grid.",
      },
      {
        title: "Contacts — every lead and student",
        text: "Anyone who's ever called, texted, or booked. The Receptionist creates and updates these automatically; you'll rarely edit one by hand, but this is where you look up 'did that guy from Tuesday ever book?'",
      },
      {
        title: "Opportunities — the pipeline",
        text: "A board view of your prospective students, from first call to booked discovery flight to enrolled. Cards move automatically as the system works; you can also drag a card yourself when a student signs up in person.",
      },
      {
        title: "Reputation — reviews",
        text: "Incoming Google reviews and the outgoing review requests the system sends after flights. You'll open this to reply to reviews and to watch your rating climb.",
      },
      {
        title: "Automation (Workflows) — the machine room",
        text: "The sequences that send reminders, follow-ups, and review requests. These are built and maintained by us. You're welcome to look — everything is readable — but call us before changing one; a paused workflow silently stops reminders.",
      },
      {
        title: "Settings — rarely, and mostly not yours",
        text: "Bottom of the sidebar. Integrations (your calendar connection), phone numbers, and billing live here. Most owners open Settings only to check their calendar is still connected.",
      },
    ],
  },

  /* --------------------------- Your AI receptionist ------------------- */
  {
    slug: "when-it-doesnt-know",
    category: "ai-receptionist",
    title: "What the Receptionist does when it doesn't know an answer",
    blurb:
      "It never bluffs. Here's the exact escalation flow — and how to teach it something new.",
    videoLabel: "The honest-answer flow",
    intro:
      "A prospect asks: 'Do you do tailwheel endorsements?' — and nobody told the Receptionist. The worst thing a phone system can do is invent an answer. Yours never does. Here's exactly what happens instead.",
    steps: [
      {
        title: "It says it doesn't know — out loud",
        text: "The Receptionist answers honestly, in its own words: that's a question for the school, and it will get the caller an answer. No guessing, no vague corporate deflection. Callers consistently rate an honest 'let me find out' higher than a confident wrong answer.",
      },
      {
        title: "It captures the caller and the question",
        text: "Before the call ends it makes sure it has the caller's name, number, and the exact question, and promises a callback. That promise matters — it's what keeps the lead alive.",
      },
      {
        title: "You get a summary, immediately",
        text: "A text lands on your phone with who called and what they asked. The full transcript is in Conversations. Reply by calling the lead back when you have a minute — most owners answer between flights.",
      },
      {
        title: "It becomes a contact and an open opportunity",
        text: "The caller is now in Contacts with the question attached, and sits in your pipeline as a lead to follow up. Nothing about the interaction is lost.",
      },
      {
        title: "Tell us the answer once — it knows it forever",
        text: "Text us the real answer ('Yes, tailwheel — $240/hr dual in the Champ') and we add it to the Receptionist's knowledge. Next caller who asks gets the answer on the spot. The system gets smarter every week this way.",
      },
    ],
    outro:
      "Rule of thumb: if a caller asks it twice, we should know about it once. One text to us turns an 'I don't know' into a selling point.",
  },

  /* --------------------------- Bookings & calendar -------------------- */
  {
    slug: "discovery-flight-booking",
    category: "bookings-calendar",
    title: "How discovery-flight booking works",
    blurb:
      "From 'I'd like to try a flight' to a confirmed slot on your calendar — with reminders.",
    videoLabel: "Discovery-flight booking, end to end",
    intro:
      "The discovery flight is your school's front door, and this is the flow the whole system is built around. Here's what happens from the caller's side and yours.",
    steps: [
      {
        title: "The caller asks to book",
        text: "By phone, text, or website chat — it doesn't matter. The Receptionist knows a discovery flight is an intro lesson: first-time flyer, no experience needed, typically 30–60 minutes with a CFI. It answers the obvious pre-booking questions (price, what to bring, weather policy) from the knowledge we loaded at setup.",
      },
      {
        title: "It offers real openings",
        text: "The Receptionist reads your discovery-flight calendar and offers times that are actually free — respecting your availability windows, buffers between flights, and any time you blocked in your own connected calendar. It never double-books.",
      },
      {
        title: "The booking lands in Calendars",
        text: "Open Calendars and the appointment is there with the caller's name, phone, and email. A matching contact exists in Contacts, and a card appears in Opportunities so you can see every prospective student in the pipeline.",
      },
      {
        title: "Confirmations and reminders go out automatically",
        // (verify) exact reminder cadence configured in the account's
        // appointment-reminder workflow.
        text: "A workflow sends the caller a confirmation text right away and reminders before the flight — the single biggest no-show killer. You can see the exact cadence in Automation → Workflows.",
      },
      {
        title: "Weather cancel? It handles the rebook",
        text: "When you scrub a flight for weather, the contact is already in the system with full context — a quick rebooking conversation replaces the usual phone tag. Move the appointment in Calendars (or tell us), and the follow-up sequence keeps the lead warm.",
      },
      {
        title: "Watch it once, then trust it",
        text: "Do one test booking yourself (call your number, say you want a discovery flight) and watch each piece appear: Conversations entry, calendar appointment, contact, pipeline card, confirmation text. Once you've seen the loop, you can stop checking.",
      },
    ],
  },
  {
    slug: "connecting-your-calendar",
    category: "bookings-calendar",
    title: "Connecting your calendar",
    blurb:
      "Google or iCloud — the two-way sync that keeps your real schedule bookable.",
    videoLabel: "Connecting your calendar",
    intro:
      "We connect your calendar during onboarding, so this is usually already done. You'll need this article if the connection ever drops (Google sometimes expires permissions) or if you want a second instructor's calendar synced.",
    steps: [
      {
        title: "Check the connection status first",
        text: "Go to Settings → Integrations → Google. If you see a missing-permissions or reconnect warning, that's why bookings stopped syncing — proceed to step 2. If it shows connected and healthy, the problem is elsewhere; call us before changing anything.",
      },
      {
        title: "Reconnect Google",
        // Grounded in KB: how-to-re-integrate-google-calendar-for-a-user
        // (Settings → Integrations → Google → Reconnect; must be done by the
        // Google account owner; missed upcoming appointments auto-sync after).
        text: "From Settings → Integrations → Google, click Connect / Reconnect and sign in with the Google account that owns the calendar. Grant the permissions it asks for. Important: the person who owns the Google account must do this themselves — nobody can do it on your behalf.",
      },
      {
        title: "Let it catch up",
        text: "After reconnecting, upcoming appointments that were created while the integration was down sync automatically — you don't need to edit each one to push it through.",
      },
      {
        title: "Using iCloud instead?",
        // (verify) the iCloud menu label inside Settings → Integrations
        // (KB: icloud-how-to-integrate-icloud-with-highlevel-calendars
        // confirms the app-specific-password flow, not the exact menu label).
        text: "iCloud calendars connect the same way but need an app-specific password from your Apple account first (appleid.apple.com → Sign-In and Security → App-Specific Passwords), then Settings → Integrations → iCloud.",
      },
      {
        title: "Link the calendar to bookings",
        // (verify) 'Connections' vs 'Conflicts' tab naming in calendar
        // settings.
        text: "Open Calendars, select your discovery-flight calendar, and confirm your personal calendar is checked as a conflict/connected calendar — that's what stops the Receptionist offering slots when you're actually flying.",
      },
      {
        title: "Verify with a test",
        text: "Block an hour in your Google or Apple calendar, then try to book that slot through the Receptionist (or look at the booking link). The blocked time should be unofferable. Unblock it and you're done.",
      },
    ],
  },

  /* ------------------------- Missed calls & callbacks ----------------- */
  {
    slug: "forwarding-your-number",
    category: "missed-calls",
    title: "Forwarding your school number: after-hours vs always",
    blurb:
      "Keep your number. Choose when the Receptionist picks up — only when you can't, or every call.",
    videoLabel: "Number forwarding setup",
    intro:
      "You keep your existing school number — the one on your website, your Google profile, your signs. Call forwarding decides when calls to it reach the Receptionist. There are two sane configurations, and most schools use the first.",
    steps: [
      {
        title: "Option A — Conditional forwarding (recommended)",
        text: "Calls ring your normal phone first. Only when nobody answers, the line is busy, or the phone is off does the call roll over to the Receptionist. Your staff keeps the day shift; nothing that would have been missed gets missed. This is the 'after-hours and overflow' setup.",
      },
      {
        title: "Option B — Forward everything",
        text: "Every call goes straight to the Receptionist, 24/7. Choose this if nobody at the school answers the phone reliably anyway, or during a season when you're on the flight line all day. You can switch back and forth — it's a carrier setting, not a commitment.",
      },
      {
        title: "Set it up with your carrier",
        // (verify) do not publish generic star codes here — they vary by
        // carrier and line type; onboarding call covers the real ones.
        text: "Conditional forwarding is a feature of your phone carrier, set with star codes from the school's phone or from your carrier's app or account page. The codes differ by carrier — Verizon, AT&T, T-Mobile, and landline/VoIP providers each have their own — so we set this up together on your onboarding call.",
      },
      {
        title: "After-hours schedules",
        // (verify) per-provider schedule capability.
        text: "If your carrier or VoIP provider supports schedules, forwarding can follow your opening hours — after-hours calls go to the Receptionist, business-hours calls ring the desk first. VoIP providers (the kind most modern schools have) usually support this in their web portal; cell carriers usually don't.",
      },
      {
        title: "Test both directions",
        text: "Call your school number and answer it — normal behavior, nothing forwarded. Then call and don't answer: within a few rings the Receptionist should pick up. If either side misbehaves, call us — it's almost always a carrier code entered with the wrong ring count.",
      },
      {
        title: "Your caller ID stays honest",
        text: "Callers see your school's number, always. Forwarding is invisible to them — as far as a prospect knows, your school simply answers its phone now, every time.",
      },
    ],
  },
  {
    slug: "missed-call-callback-flow",
    category: "missed-calls",
    title: "The missed-call callback flow (1-minute callback, 5-minute text)",
    blurb:
      "What actually happens in the minutes after a call your school couldn't take.",
    videoLabel: "The callback flow, minute by minute",
    intro:
      "This is the core leak-plug. When a call to your school goes unanswered, the system doesn't just log it — it acts, on a clock. Here's the timeline we configure for you.",
    steps: [
      {
        title: "Minute 0 — the call rings out",
        text: "A prospect calls while everyone's flying. Your phone rings, nobody picks up — exactly the moment schools lose students to the next school on the list.",
      },
      {
        title: "Within ~1 minute — the Receptionist calls back",
        text: "The system calls the prospect back directly. To the caller it feels like the school returning their missed call almost immediately — because that's what it is. If they pick up, it's a normal Receptionist conversation: questions answered, discovery flight offered, booking made.",
      },
      {
        title: "Minute 5 — the follow-up text",
        text: "If the callback wasn't answered (or to reinforce one that was), a text goes out: sorry we missed you, can we help, want to book a discovery flight? Texts get read. A surprising share of 'lost' callers reply to this message and convert in the thread.",
      },
      {
        title: "You get notified either way",
        text: "Booked, messaged, or just called — you get a summary, and the full thread (recording, transcript, texts) is in Conversations. If the caller asked something the Receptionist didn't know, the summary flags it as needing your callback.",
      },
      {
        title: "Everything lands in the pipeline",
        text: "The caller is in Contacts, with an open opportunity if they showed buying intent. Next time they call, the Receptionist already knows who they are and picks up the conversation where it left off.",
      },
      {
        title: "Watch or adjust the timing",
        text: "The 1-minute / 5-minute timings live in Automation → Workflows (the missed-call flow we built for you). You can look, but call us before editing — and if you want different timings (say, 2 minutes and 10), that's a two-minute change on our side.",
      },
    ],
    outro:
      "The math behind it: a prospect comparing three schools books with the first one that responds like a human. This flow makes that you, even at 9 PM on a Sunday.",
  },

  /* ------------------------- Reviews & reputation --------------------- */
  {
    slug: "reviews-after-discovery-flight",
    category: "reviews-reputation",
    title: "Getting reviews after a discovery flight",
    blurb:
      "The automatic ask that turns 'that was amazing!' into public five-star proof.",
    videoLabel: "Post-flight review requests",
    intro:
      "Nobody is more likely to review your school than someone who just stepped off their first flight, grinning. The system asks at exactly that moment — automatically, every time. Here's the flow and how to tune the message.",
    steps: [
      {
        title: "The trigger: the flight happened",
        // (verify) exact send delay configured in the account's review
        // workflow.
        text: "After a discovery-flight appointment completes, a workflow sends the customer a review request by text (and email, if configured). Timing is set to catch them while the glow is fresh — typically a couple of hours after the flight.",
      },
      {
        title: "What the message says",
        text: "A short, human thank-you with your review link — one tap to your Google review page. The wording is customized per school; see the next step to change it.",
      },
      {
        title: "Customize the request",
        // Grounded in KB: how-to-customize-the-review-request-messages-sms-email
        // (Reputation settings: SMS/email templates, live & retry sequence,
        // review link).
        text: "Open Reputation in the sidebar, then the review-request settings. You can edit the SMS and email templates, set how many reminder retries go out and how far apart, and confirm the review link points at your Google profile. Or just tell us your preferred wording and we'll set it.",
      },
      {
        title: "Reviews come in — respond to them",
        text: "New Google reviews appear in Reputation as they land. Reply to every one — future students read owner responses as much as the reviews themselves. A two-sentence thank-you naming the aircraft or the maneuver they loved goes a long way.",
      },
      {
        title: "A bad review?",
        // Grounded in KB: how-to-address-negative-reviews-and-manage-reputation-with.
        text: "Stay calm, respond once, professionally, and take it offline ('call me directly — ask for the owner'). Never argue in the reply. One thoughtful owner response under a 3-star review impresses readers more than ten 5-stars above it.",
      },
      {
        title: "Watch the compound effect",
        text: "Discovery flights are your review engine: high delight, low volume, every participant online. Schools on this system typically see a steady monthly trickle of new reviews without a single awkward in-person ask.",
      },
    ],
  },

  /* --------------------------- Campaigns & nurture -------------------- */
  {
    slug: "nurture-campaigns",
    category: "campaigns-nurture",
    title: "Keeping discovery-flight leads warm until they book",
    blurb:
      "The automated follow-up that rescues 'I'll think about it' — and what to never touch.",
    videoLabel: "Nurture sequences",
    intro:
      "Most people who ask about a discovery flight don't book on the first contact. The difference between schools that convert them and schools that don't is follow-up — and yours is automatic. Here's what's running and how to think about it.",
    steps: [
      {
        title: "Every lead enters a sequence",
        text: "When someone calls, texts, or chats but doesn't book, they're already in Contacts with full context. A workflow follows up: a friendly nudge, an answer to the question everyone asks ('is it safe?'), a seasonal reason to book. Texts and emails, spaced over days, not minutes.",
      },
      {
        title: "No-shows get a rebooking path",
        text: "Someone booked and didn't show (weather, nerves, life)? They get a no-hard-feelings message with an easy way to rebook. A recovered no-show is one of the cheapest students you'll ever enroll — they already said yes once.",
      },
      {
        title: "Past students get winback touches",
        text: "The student who soloed and vanished, the gift-certificate holder who never redeemed — the platform can run winback campaigns to these lists. Ask us to switch one on when you have instructor capacity to fill.",
      },
      {
        title: "See what's running",
        text: "Open Automation → Workflows to see every sequence, live. Each one is readable in plain steps: trigger at the top, messages and waits below. You never have to guess 'is something going out to my leads?' — you can look.",
      },
      {
        title: "Don't hand-edit — request changes",
        text: "Workflows are ours to maintain. If a message reads wrong for your school ('we don't do aerobatics, stop offering it'), text us the correction. Pausing or editing a workflow yourself can silently stop reminders across every future booking.",
      },
      {
        title: "Seasonal campaigns on request",
        text: "Father's Day discovery-flight gift push, spring 'learn to fly' drive, holiday gift certificates — these are one-off campaigns we build on top of the same engine. Budget one message to us, a week before you want it live.",
      },
    ],
  },

  /* ------------------------- Billing & your account ------------------- */
  {
    slug: "monthly-bill",
    category: "billing",
    title: "Your monthly bill explained ($97, voice minutes at cost)",
    blurb: "What the $97 covers, what it doesn't, and why there's no surprise line item.",
    videoLabel: "Your bill, line by line",
    intro:
      "Your bill is deliberately boring: $97 a month, flat, plus the voice minutes the Receptionist actually used — passed through at cost, no markup. Here's the whole thing, line by line.",
    steps: [
      {
        title: "The $97 — the platform, run for you",
        text: "The flat monthly fee covers everything: the platform itself, the Receptionist answering 24/7, the booking calendar, the pipelines, the review requests, the nurture sequences, and — the part you'd pay an agency thousands for — us monitoring and improving your setup continuously. No setup fee, no contract, cancel anytime.",
      },
      {
        title: "Voice minutes — at cost",
        // (verify) current per-minute / per-SMS pass-through rates at time
        // of publishing.
        text: "Phone calls and text messages have real carrier costs (cents per minute, fractions of a cent per message). Those pass through to you at cost — we don't mark them up. A typical flight school month of answered calls adds a small single-digit-to-low-double-digit dollar amount.",
      },
      {
        title: "What you will never see",
        text: "No per-seat fees, no 'premium feature' unlocks, no setup fee if we rebuild something, no charge for the 'text us a fix' support loop, no cancellation fee. The pricing is designed to be cheap enough never to resent.",
      },
      {
        title: "Where to see usage",
        // (verify) exact label — 'Billing' vs 'Company Billing' vs 'Usage' —
        // depends on account version.
        text: "Call and message volume is visible in the platform under Settings → Billing. If anything on a bill surprises you, call and we'll walk the numbers with you.",
      },
      {
        title: "Canceling",
        text: "One message, no retention script, no hostage-taking. Your data exports if you want it. We'd rather earn the next month than lock you into it.",
      },
    ],
    outro:
      "If the bill ever stops being boring, that's a bug — call us.",
  },
];

export function getArticle(slug: string): DocArticle | undefined {
  return DOC_ARTICLES.find((a) => a.slug === slug);
}

export function getCategory(id: string): DocCategory | undefined {
  return DOC_CATEGORIES.find((c) => c.id === id);
}

export function articlesInCategory(id: string): DocArticle[] {
  return DOC_ARTICLES.filter((a) => a.category === id);
}
