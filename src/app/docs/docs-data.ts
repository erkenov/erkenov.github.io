/**
 * /docs content — the Erken Systems docs portal for flight schools.
 * PUBLIC since 2026-08-22 (Shamil: "docs.flightschoolcrm.com — this is how
 * my docs should look like" + "you did only the features I provide, not
 * the whole platform" → expanded to cover the whole platform).
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
 * them against a live account. (verify) notes must NEVER appear inside
 * rendered strings.
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
    | "messages"
    | "calendar-check"
    | "phone-missed"
    | "zap"
    | "users"
    | "star"
    | "megaphone"
    | "credit-card"
    | "bar-chart"
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
    id: "conversations",
    name: "Conversations",
    tagline: "One inbox for calls, texts, email, WhatsApp, and social DMs.",
    icon: "messages",
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
    id: "workflows-automations",
    name: "Workflows & automations",
    tagline: "The machine room: reminders, follow-ups, and no-show recovery.",
    icon: "zap",
  },
  {
    id: "contacts-crm-pipelines",
    name: "Contacts, CRM & pipelines",
    tagline: "Every lead and student, from first call to enrolled.",
    icon: "users",
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
    id: "payments-invoicing",
    name: "Payments & invoicing",
    tagline: "Invoice students, take deposits, sell gift certificates.",
    icon: "credit-card",
  },
  {
    id: "reporting",
    name: "Reporting",
    tagline: "Your school's numbers at a glance.",
    icon: "bar-chart",
  },
  {
    id: "account-billing",
    name: "Your account & billing",
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
  {
    slug: "what-the-receptionist-knows",
    category: "ai-receptionist",
    title: "What the Receptionist knows about your school",
    blurb:
      "Where its answers come from, what it never does, and how its knowledge grows.",
    videoLabel: "Inside the Receptionist's knowledge",
    intro:
      "The Receptionist isn't a generic phone bot reading a script — it's briefed on YOUR school before it answers its first call. Here's what it knows, where that knowledge comes from, and how to keep it current.",
    steps: [
      {
        title: "The setup brief",
        text: "At onboarding we load everything a good front-desk hire would need: your programs and prices, aircraft fleet, discovery-flight details, hours, location and parking, weather policy, what to bring, and the questions your prospects actually ask. That brief is the only source it answers from.",
      },
      {
        title: "It answers, collects, and books",
        // Grounded in KB: how-to-set-up-a-conversation-ai-bot (a conversation
        // AI bot collects lead details, answers common questions, supports
        // appointment booking, and works across channels).
        text: "Three jobs, in priority order: answer the caller's questions from the brief, capture their name and number, and offer to book a discovery flight into a real open slot. Everything else — small talk, patience, never rushing — is in service of those three.",
      },
      {
        title: "Same brain on every channel",
        text: "Phone calls, text messages, and website chat all draw on the same knowledge. A prospect who texts at midnight gets the same answers as one who calls at noon — and the same honest 'let me find out' when something isn't in the brief.",
      },
      {
        title: "What it never does",
        text: "It doesn't improvise prices, promise availability that isn't on the calendar, argue, or pretend to be human. If a caller asks whether they're talking to a person, it says what it is — and keeps helping.",
      },
      {
        title: "Keeping it current",
        text: "Prices change, a new aircraft joins the fleet, you start offering spin training — text us the update and it's live in the Receptionist's knowledge, usually the same day. Seasonal changes (summer hours, holiday gift certificates) are worth a message too.",
      },
      {
        title: "Test it whenever you like",
        text: "Call your own number any time and quiz it. Owners do this after every price change, and it's the fastest way to catch a stale answer before a prospect does.",
      },
    ],
  },

  /* ------------------------------ Conversations ----------------------- */
  {
    slug: "unified-inbox",
    category: "conversations",
    title: "One inbox for everything: calls, texts, email, and social messages",
    blurb:
      "Every channel a prospect can reach you on, in a single thread per person.",
    videoLabel: "The unified inbox",
    intro:
      "Prospects don't care which channel they use — they text, email, DM, and call, sometimes all in the same week. The platform merges all of it into one inbox, organized by person, so you never lose a thread again.",
    steps: [
      {
        title: "What lands here",
        text: "Phone calls (with recordings and transcripts), SMS threads, emails, website chats, WhatsApp messages, and Facebook/Instagram messages — each conversation attached to the contact it belongs to. One person, one history, no matter how many channels they used.",
      },
      {
        title: "Reply from one place",
        text: "Open any thread and reply in the same channel the person used — text back a texter, email back an emailer. No switching apps, no copying numbers into your phone.",
      },
      {
        title: "Your email can sync both ways",
        // Grounded in KB: how-to-set-up-two-way-email-sync-for (Gmail two-way
        // sync: inbound and outbound emails sync to the CRM, contacts and
        // conversations are created from Gmail).
        text: "If we connected your Gmail at onboarding, emails you send from your normal inbox also appear on the contact's record — and replies to platform emails land back in Gmail. Ask us if you'd like this switched on or checked.",
      },
      {
        title: "WhatsApp and social DMs",
        // Grounded in KB: how-to-set-up-whatsapp-for-a-sub-account (WhatsApp
        // Business integration) and how-to-use-the-all-in-one-chat-widget
        // (Live Chat, SMS/Email, WhatsApp, Facebook, Instagram channels).
        // (verify) which of these channels are enabled varies per school —
        // confirm what's connected on the account.
        text: "Schools that use WhatsApp or get Instagram/Facebook inquiries can have those wired into the same inbox. Not every school needs them — tell us where your prospects actually message you and we'll connect what matters.",
      },
      {
        title: "Loop in your team",
        // Grounded in KB: conversations-how-to-add-internal-comments-mention-users
        // (internal comments and @mentions inside a conversation).
        text: "Inside any thread you can add an internal note that the customer never sees, and @mention a team member — 'CFI wanted' — so the right person gets notified without forwarding screenshots around.",
      },
      {
        title: "Your morning ritual",
        text: "Most owners open Conversations once a day with coffee: scan what the Receptionist handled overnight, flag anything that needs a human, and get on with flying. Everything else can wait — the system already answered.",
      },
    ],
  },
  {
    slug: "website-chat",
    category: "conversations",
    title: "The website chat widget",
    blurb:
      "The little bubble on your site that turns browsers into booked discovery flights.",
    videoLabel: "Website chat, visitor to inbox",
    intro:
      "If we installed the chat widget on your website, visitors see a chat bubble in the corner. Behind it is the same Receptionist and the same inbox as everything else — here's what it does and where the chats go.",
    steps: [
      {
        title: "One widget, several ways to reach you",
        // Grounded in KB: how-to-use-the-all-in-one-chat-widget (one widget
        // offering Live Chat, SMS/Email, WhatsApp, Facebook, Instagram in a
        // single interface).
        text: "The widget can offer live chat, a text-message option, email, and WhatsApp from a single bubble — the visitor picks whichever they prefer. Which options show on your site is a configuration choice; tell us what you want offered.",
      },
      {
        title: "The Receptionist answers chats too",
        text: "Website chat isn't a separate system with separate answers — it draws on the same knowledge brief as the phone. A visitor asking 'how much to get a private license?' at 11 PM gets the real answer, and an offer to book a discovery flight.",
      },
      {
        title: "Every chat lands in Conversations",
        text: "The full chat thread appears in your inbox attached to a contact, exactly like a call or text. If the visitor gave their number, the conversation can continue by text after they leave your site — the lead doesn't evaporate when the tab closes.",
      },
      {
        title: "It captures contact details first",
        // (verify) exact fields collected before/at chat start depend on the
        // widget configuration on the account.
        text: "The widget asks for a name and a way to reach back before or during the chat, so even an abandoned conversation leaves you a lead to follow up — not an anonymous transcript.",
      },
      {
        title: "Not on your site yet?",
        text: "Adding the widget is a small embed on your website — send us your web person's email (or your site login) and we'll install it. If you'd rather not have chat on the site at all, that's fine too; say the word and it stays off.",
      },
    ],
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

  /* ----------------------- Workflows & automations -------------------- */
  {
    slug: "workflows-explained",
    category: "workflows-automations",
    title: "Workflows: the automations running your school",
    blurb:
      "What a workflow is, which ones are already running for you, and why we maintain them.",
    videoLabel: "Workflows, in plain English",
    intro:
      "Everything the platform does automatically — reminders, follow-ups, review requests, the missed-call text — is a workflow. You never have to build one, but you should know what they look like and which ones are working for you.",
    steps: [
      {
        title: "Trigger, then steps",
        text: "Every workflow reads the same way: a trigger at the top ('appointment booked', 'call missed', 'form submitted'), then the steps that follow — send this text, wait a day, send this email, notify the owner. Open Automation → Workflows and click any of them; they're readable in plain language.",
      },
      {
        title: "What's already running for you",
        // (verify) the exact set of live workflows depends on the account's
        // setup — the four listed are the standard build.
        text: "The standard build includes: appointment confirmations and reminders, the missed-call callback flow, post-flight review requests, and lead-nurture follow-ups. Some schools have more — winback campaigns, seasonal pushes — added on request.",
      },
      {
        title: "Some steps wait for a human",
        // Grounded in KB: how-to-set-up-a-manual-sms-action and
        // how-to-add-a-manual-call-action-to-a (workflows can pause for a
        // manually-sent SMS or a manual call task).
        text: "Not everything should be automatic. A workflow can pause and create a task for a person — 'call this lead yourself' or approve a text before it sends — when a human touch converts better than a robot. You'll see these as tasks on the contact.",
      },
      {
        title: "Check a workflow before you worry",
        text: "Wondering 'did the reminder go out?' Open the workflow and you can see which contacts are inside it and which step they're on. Thirty seconds of looking beats an hour of wondering.",
      },
      {
        title: "Don't edit — request",
        text: "Workflows interlock: the reminder flow assumes the booking flow tagged the contact, and so on. A well-meaning edit can silently break a chain. Text us the change you want — new wording, different timing, another step — and we'll make it safely.",
      },
    ],
  },
  {
    slug: "reminders-and-no-shows",
    category: "workflows-automations",
    title: "Appointment reminders and no-show recovery",
    blurb:
      "The automated cadence that fills your schedule and rescues the ones who don't show.",
    videoLabel: "Reminders and no-show recovery",
    intro:
      "An empty discovery-flight slot costs you twice: the lost intro revenue and the student who never started. Two automations protect you — the reminder cadence before the flight, and the recovery flow after a no-show.",
    steps: [
      {
        title: "Instant confirmation",
        text: "The moment a discovery flight is booked — by the Receptionist, by you, or through a booking link — the customer gets a confirmation text with the date, time, and where to go. No confirmation ever waits on a human remembering to send it.",
      },
      {
        title: "Reminders before the flight",
        // (verify) exact send times live in the account's reminder workflow
        // — commonly 24h and a few hours before; confirm the live cadence.
        text: "A reminder goes out ahead of the appointment — typically the day before and again a few hours prior, by text. Each one is a chance to reschedule instead of silently not showing, which is exactly what you want: a rescheduled slot can be refilled.",
      },
      {
        title: "The no-show flow",
        text: "When someone doesn't show, the recovery sequence reaches out with zero guilt-trip: hope everything's OK, weather and nerves happen, here's how to pick a new time. The tone is deliberate — a no-show who rebooks is still a future student.",
      },
      {
        title: "Weather cancels are different",
        text: "When YOU cancel for weather, say so in the reschedule message — it builds trust and flies the school's safety culture flag. The contact and their full history are already in the system, so rebooking takes one exchange, not a game of phone tag.",
      },
      {
        title: "Watch it work",
        text: "Every confirmation, reminder, and recovery message is visible in Conversations, and the cadence itself is in Automation → Workflows. If you want different timing or wording, that's a message to us, not an edit for you.",
      },
    ],
  },

  /* --------------------- Contacts, CRM & pipelines -------------------- */
  {
    slug: "contacts-smart-lists",
    category: "contacts-crm-pipelines",
    title: "Contacts, tags, and smart lists",
    blurb:
      "Every caller becomes a contact automatically — here's how to find, group, and clean them.",
    videoLabel: "Contacts and smart lists",
    intro:
      "Your contact list builds itself: every call the Receptionist answers, every text, every booking creates or updates a contact with the full history attached. This article is about finding people in that list and keeping it tidy.",
    steps: [
      {
        title: "What's on a contact",
        text: "Name, phone, email, every conversation they've had with you, their appointments, their pipeline card, and notes. Open any contact and you know everything the school has ever known about that person — no more 'remind me who this is?'",
      },
      {
        title: "Tags group people",
        // Grounded in KB: how-to-manage-categories-types-and-tags (tags used
        // to organize contacts).
        // (verify) the exact tag set on the account is configured at setup.
        text: "Tags are labels like 'discovery-flight', 'student', or 'gift-certificate' that mark what someone is to you. Automations apply most of them; you can add one by hand when someone mentions they're a renter or a CFI looking for time-building.",
      },
      {
        title: "Smart lists are saved searches that stay fresh",
        // Grounded in KB: how-to-create-manage-smart-lists (smart lists are
        // filter-based, auto-updating contact lists).
        text: "A smart list is a filter you save — 'everyone tagged discovery-flight who hasn't booked', 'all students' — and it updates itself as contacts change. This is how you answer 'who should get the spring newsletter?' in ten seconds.",
      },
      {
        title: "Merging duplicates",
        // Grounded in KB: how-to-manage-and-merge-duplicate-contacts (find
        // potential duplicates by email, phone, or name; choose the master
        // record; merge safely).
        text: "The same person sometimes calls from two numbers and ends up as two contacts. The duplicates tool finds likely matches by phone, email, or name; you pick the record to keep and merge — the full history ends up on one card.",
      },
      {
        title: "Respecting stop requests",
        text: "When someone texts STOP, the platform marks them do-not-disturb automatically and automations leave them alone. Don't clear that flag by hand — it's both rude and illegal to text someone who opted out.",
      },
    ],
  },
  {
    slug: "pipeline-stages",
    category: "contacts-crm-pipelines",
    title: "The pipeline: from first call to enrolled student",
    blurb:
      "A board view of every prospective student — and how cards move through it.",
    videoLabel: "The pipeline, stage by stage",
    intro:
      "Opportunities is your sales board: one card per prospective student, arranged in columns from 'just called' to 'enrolled'. It exists so that no lead ever depends on your memory.",
    steps: [
      {
        title: "Stages mirror how a student actually signs up",
        // Grounded in KB: step-by-step-guide-creating-pipelines (pipelines
        // track opportunities through defined stages).
        // (verify) stage names below are the typical setup; the account's
        // pipeline may differ.
        text: "A typical flight-school pipeline runs: New lead → Discovery booked → Flew, following up → Enrolled. We set the stages up with you at onboarding; the names matter less than the rule that every prospect sits in exactly one of them.",
      },
      {
        title: "Cards appear and move automatically",
        text: "When the Receptionist books a discovery flight, the caller's card slides into 'Discovery booked' without anyone touching it. Automations handle the routine moves; the board is always current because no human has to remember to update it.",
      },
      {
        title: "Drag cards for the human moments",
        text: "Student signs up at the front desk after their flight? Drag their card to 'Enrolled' — or click into the card and mark it won. Walk-in who's never called? Add a card by hand so they're in the system and get the same follow-up as everyone else.",
      },
      {
        title: "Filter the board",
        // Grounded in KB: how-to-filter-opportunities.
        text: "With filters you can slice the board — by stage, by who owns the lead, by when it was last touched. 'Show me everyone in follow-up untouched for a week' is the single most valuable view in the whole platform.",
      },
      {
        title: "Won, lost, and not-now",
        text: "Mark enrolled students won and genuinely-dead leads lost — but keep 'not right now' people in a follow-up stage instead. A lost card leaves the pipeline; a nurture-stage card keeps getting touched until the season or the budget changes.",
      },
      {
        title: "The Monday habit",
        text: "Five minutes, once a week: open Opportunities, scan the follow-up column, and personally call anyone who's been sitting too long. The system does the chasing; the owner's voice closes the ones worth closing.",
      },
    ],
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
  {
    slug: "manage-your-rating",
    category: "reviews-reputation",
    title: "Watching and defending your Google rating",
    blurb:
      "Replies, disputes for fake reviews, and the front-desk QR code that keeps five stars coming.",
    videoLabel: "Reputation defense",
    intro:
      "Your Google rating is the first thing a prospective student sees — often before your website. The platform watches it for you; this article covers what to do with what it shows you.",
    steps: [
      {
        title: "Every review lands in Reputation",
        text: "New reviews appear in the Reputation section as Google publishes them — no more checking your profile by hand. Turn on notifications and you'll know within minutes of one landing.",
      },
      {
        title: "Reply to all of them",
        text: "Five stars: two sentences of thanks, name the experience. Three stars: thank them, own what's fair, invite a direct conversation. Speed matters less than tone — future students are reading how you treat people, not just the score.",
      },
      {
        title: "Fake or rule-breaking review? Dispute it",
        // Grounded in KB: how-to-dispute-a-google-review-and-check-on
        // (flag as inappropriate; Google acts when the review violates its
        // guidelines; dispute status can be checked).
        text: "Google will remove reviews that break its rules — spam, fake accounts, conflicts of interest — but not reviews you merely disagree with. You can flag a review for policy violation and track the dispute status from the platform. Genuine-but-unfair reviews are answered, not disputed.",
      },
      {
        title: "The QR code at the front desk",
        // Grounded in KB: how-to-create-a-qr-code-linked-with-review
        // (QR codes linking directly to the review page, brandable).
        text: "The platform can generate a QR code that opens your Google review page directly. Print it small, tape it by the dispatch sheet or the checkout counter — when a student says 'that was the best lesson yet', pointing at the code is the whole ask.",
      },
      {
        title: "What never to do",
        text: "Never buy reviews, never offer discounts for five stars, never have staff review you. Google's filters catch patterns like that, and a flagged profile costs far more than a slow honest climb.",
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
  {
    slug: "one-off-announcements",
    category: "campaigns-nurture",
    title: "One-off announcements: newsletters, schedule changes, seasonal pushes",
    blurb:
      "When you need to say something to a whole list at once — and how to do it right.",
    videoLabel: "Sending an announcement",
    intro:
      "Sequences run on autopilot, but sometimes you have something to say right now: a new aircraft, a ground-school date, a holiday gift-certificate push. That's a one-off send — here's how to think about it.",
    steps: [
      {
        title: "Pick the audience first",
        text: "A good announcement goes to a slice, not everyone: current students for schedule changes, discovery-flight leads for a seasonal push, past students for a winback. Smart lists make the slice — 'all active students' is already a saved filter away.",
      },
      {
        title: "Text for urgent, email for rich",
        // (verify) bulk-send entry point label (Campaigns vs Email/SMS
        // marketing section) varies by account version.
        text: "Weather closure tomorrow? Text. Monthly newsletter with photos and a student spotlight? Email. Both send from the platform and both are tracked — you'll see opens and replies without guessing.",
      },
      {
        title: "Write like the owner, not a brand",
        text: "One short paragraph, one ask, your name at the bottom. 'New Champ is on the line — first five discovery flights in June are $99, reply to grab one' beats a designed newsletter every time. If you'd rather we draft it, send us the bullet points.",
      },
      {
        title: "Replies come back to Conversations",
        text: "Every reply to a blast lands in your inbox as a normal thread — where the Receptionist and your team can pick it up. An announcement isn't the end of a conversation; done right, it's the start of twenty.",
      },
      {
        title: "Mind the rules",
        text: "Marketing texts only go to people who opted in, and every message honors stop requests automatically. Keep sends occasional — a school that texts weekly gets muted; a school that texts when it matters gets read.",
      },
    ],
  },

  /* ------------------------- Payments & invoicing --------------------- */
  {
    slug: "invoicing-students",
    category: "payments-invoicing",
    title: "Invoicing students and renters",
    blurb:
      "Send a proper invoice in two minutes — deposits, payment plans, and monthly programs included.",
    videoLabel: "Invoices, end to end",
    intro:
      "Block time, ground-school packages, a renter's monthly tally — wherever money is owed, the platform can bill it with a real invoice instead of a Venmo request. Here's the flow.",
    steps: [
      {
        title: "Create it from the contact",
        // Grounded in KB: how-to-create-invoices-in-highlevel (create, edit,
        // discount, add taxes, send invoices from within the system).
        text: "Open the student's contact (or the Invoices section) and create an invoice: line items for what they're buying, taxes if applicable, a discount if you're feeling generous. Send it by text and email — they pay by card from the link, no terminal needed.",
      },
      {
        title: "Deposits and partial payments",
        // Grounded in KB: how-to-use-partial-payment-for-invoices (collect a
        // minimum percentage of the invoice up front) and
        // how-to-set-up-flexible-payment-plans-in-invoices.
        text: "For bigger tickets — a private-pilot package, a block of dual time — you don't have to bill it all at once. Set a deposit amount or split the invoice into scheduled partial payments, and the platform collects each piece on its date.",
      },
      {
        title: "Monthly programs on recurring invoices",
        // Grounded in KB: how-to-create-and-manage-recurring-invoices-in-highlevel
        // (invoices generated and sent automatically on a set schedule).
        text: "Flying clubs, monthly membership programs, financing-style pay-as-you-go — a recurring invoice generates and sends itself on schedule, and you track what's paid and what's outstanding from the invoice list.",
      },
      {
        title: "Everything reconciles in one place",
        text: "Paid, partial, overdue — the invoice list shows it, and each payment attaches to the contact's record. At tax time or when a student asks 'didn't I already pay that?', the answer is one search away.",
      },
      {
        title: "Getting paid needs a processor",
        // (verify) which payment processor is connected and its settings
        // location on the account.
        text: "Invoices and payment links charge cards through a connected payment processor, which we set up during onboarding. If a payment ever fails to go through, call us before re-sending — it's usually a processor setting, not the customer.",
      },
    ],
  },
  {
    slug: "payment-links-deposits",
    category: "payments-invoicing",
    title: "Payment links: discovery flights, gift certificates, deposits",
    blurb:
      "A link that takes money — in texts, emails, on your website, even on a gift certificate.",
    videoLabel: "Payment links",
    intro:
      "A payment link is a checkout page you can send anywhere: 'reply YES and pay here to lock your slot'. It's the fastest way to turn intent into committed money — and it's how you sell discovery flights and gift certificates while you sleep.",
    steps: [
      {
        title: "What a payment link is",
        // Grounded in KB: how-to-set-up-a-payment-link-for-multiple
        // (payment links bundling one-time and recurring products in one
        // checkout).
        text: "You create a product once — 'Discovery Flight — $129' — and the platform gives you a link that sells it. Links can bundle one-time and recurring items together (say, a first lesson plus a monthly ground-school membership) in a single checkout.",
      },
      {
        title: "Discovery flights that sell themselves",
        text: "Put the link in your nurture messages and on your website, and a prospect can buy the flight at 11 PM and book their slot from the confirmation — money before the first phone call. Prepaid discovery flights also no-show far less than free ones.",
      },
      {
        title: "Gift certificates",
        // (verify) whether gift purchases are handled as products, vouchers,
        // or manual fulfillment on the account.
        text: "A 'Gift a discovery flight' link is the easiest holiday revenue you'll ever make: share it in December, and every purchase is a new lead with cash already attached. We can set the link and the follow-up sequence for you before the season.",
      },
      {
        title: "Deposits that stop no-shows",
        text: "For high-demand slots — weekend discovery flights, checkride prep — ask for a deposit by payment link when booking. The link goes out by text, the slot is theirs when it clears, and 'I forgot my wallet' stops being a cancellation reason.",
      },
      {
        title: "Where the money shows up",
        text: "Every payment lands on the contact's record and in your payments reporting, alongside invoices — one place to see everything the school collected this month.",
      },
    ],
  },

  /* ------------------------------- Reporting -------------------------- */
  {
    slug: "your-dashboard",
    category: "reporting",
    title: "Your numbers at a glance: the dashboard",
    blurb:
      "Leads, bookings, pipeline value, and where your students actually come from.",
    videoLabel: "The dashboard",
    intro:
      "You shouldn't have to ask 'how are we doing?' — the dashboard answers it. It collects the numbers that matter to a flight school in one screen, and it's yours to arrange.",
    steps: [
      {
        title: "What it shows out of the box",
        // Grounded in KB: how-to-create-add-dashboard-widgets (dashboards
        // for tracking leads, appointments, and sales performance).
        text: "Leads captured, appointments booked, pipeline value, and message activity — the vital signs of the school's front office. Open it and thirty seconds later you know whether this week is beating last week.",
      },
      {
        title: "Widgets are the building blocks",
        // Grounded in KB: how-to-create-add-dashboard-widgets and
        // how-to-create-and-use-custom-metrics-for-dashboard.
        text: "Each chart or number on the dashboard is a widget. You can add, remove, and rearrange them — put 'discovery flights booked this month' big at the top and bury whatever you don't care about. Custom metrics exist for numbers the defaults don't cover.",
      },
      {
        title: "Multiple dashboards for multiple hats",
        // Grounded in KB: how-to-create-a-custom-dashboard (create and
        // manage multiple dashboards for different needs).
        text: "You can keep separate dashboards — one for marketing (leads, sources, campaigns), one for operations (bookings, no-shows). Most owners live in one and check the other monthly.",
      },
      {
        title: "Where students come from",
        // Grounded in KB: how-to-add-attribution-and-utm-parameters-as-filters
        // (attribution / UTM data available as dashboard filters).
        text: "Attribution data tells you which channel produced each lead — Google search, an ad, a referral link. Before you spend another dollar on marketing, filter the dashboard by source and see what actually books discovery flights.",
      },
      {
        title: "The Friday habit",
        text: "Once a week: open the dashboard, compare leads and bookings to last week, and ask why for any big move — up or down. The platform generates the numbers; reading them is still the owner's job.",
      },
    ],
  },

  /* ------------------------- Your account & billing ------------------- */
  {
    slug: "monthly-bill",
    category: "account-billing",
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
  {
    slug: "team-logins-notifications",
    category: "account-billing",
    title: "Team logins and notifications",
    blurb:
      "Who gets a login, what they can see, and how to make your phone buzz only for what matters.",
    videoLabel: "Team and notifications",
    intro:
      "The platform isn't just for you — your CFIs, your front desk, and your partner can each have their own login with their own notifications. Here's how to think about access and noise.",
    steps: [
      {
        title: "One login per person",
        text: "Everyone who touches leads or the schedule should have their own login — shared passwords make the activity history meaningless. Tell us who needs access and we'll set them up; there's no per-seat charge.",
      },
      {
        title: "Tune what reaches your phone",
        // Grounded in KB: how-to-set-up-custom-notifications-as-a-user
        // (per-user notification settings across email, desktop, and mobile
        // app; the point is reducing noise while not missing what matters).
        text: "Each user controls their own notifications — email, desktop, and mobile-app pushes, event by event. A CFI might want 'my appointment changed' and nothing else; you might want every new lead. Set it once per person and the noise stops.",
      },
      {
        title: "The mobile app",
        // (verify) the mobile app's display name in the app stores under the
        // white-label.
        text: "There's a companion mobile app that puts Conversations, Calendars, and Contacts in your pocket — most owners run the whole school from it between flights. Ask us for the install link if you don't have it yet.",
      },
      {
        title: "When someone leaves",
        text: "Staff changes happen — tell us and we'll disable the login the same day. Their conversation history and work stays in the account; only their access ends.",
      },
    ],
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
