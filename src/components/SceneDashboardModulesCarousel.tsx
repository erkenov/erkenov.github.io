"use client";

/**
 * SceneDashboardModulesCarousel — Apple Cards under the MacBook hero,
 * showing the modules inside the Control Panel dashboard.
 *
 * NEW 2026-05-24 (Shamil). MacBook sells the FEELING; these cards sell
 * the INVENTORY. Each card opens to show what the module does + which
 * competitor tools it replaces. Borrows DashClicks' InstantReports framing.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

type ModuleCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

const MODULES: ModuleCard[] = [
  {
    category: "Reporting · live",
    title: "Real-time dashboard",
    src: ph("Real-time", "C76B58"),
    content: (
      <ModuleBody replaces={["Looker Studio basic boards", "manual spreadsheet reports"]}>
        <p>
          Calls, chats, forms, deals, appointments — all visible in one
          screen. Filter by source, by stage, by date. Drill into any number
          to see the underlying contacts.
        </p>
        <p>
          Updates live as your pipeline runs. You see exactly what&apos;s
          happening without asking anyone.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Reporting · monthly",
    title: "Auto-generated client reports",
    src: ph("Auto reports", "7ea687"),
    content: (
      <ModuleBody replaces={["DashClicks InstantReports", "manual monthly summaries"]}>
        <p>
          Branded monthly reports auto-generated and sent — &quot;here are
          your new leads, calls handled, appointments booked, revenue
          attributed.&quot; The numbers your clients ask for, delivered
          before they ask.
        </p>
        <p>
          Or for your own business: a monthly &quot;what&apos;s actually
          working&quot; snapshot in your inbox.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Reputation",
    title: "Reviews & reputation alerts",
    src: ph("Reviews", "E89F1F"),
    content: (
      <ModuleBody replaces={["Birdeye starter plans", "Podium starter plans"]}>
        <p>
          Auto-requests Google reviews after every completed appointment.
          Alerts you in real-time when a low-star review lands so you can
          respond before it sits.
        </p>
        <p>
          Aggregates ratings across Google, Yelp, Facebook into one panel
          — no more checking five tabs.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Inbox · unified",
    title: "All conversations, one inbox",
    src: ph("Unified inbox", "8B7BB8"),
    content: (
      <ModuleBody replaces={["Front", "Help Scout", "five separate apps"]}>
        <p>
          Voice transcripts, web chats, WhatsApp messages, Instagram DMs,
          SMS, emails — all land in one queue. Reply from any channel in one
          window.
        </p>
        <p>
          AI suggests responses. You approve or rewrite. Faster than typing
          from scratch, more personal than a templated reply.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Mobile",
    title: "Branded mobile app",
    src: ph("Mobile app", "5e8268"),
    content: (
      <ModuleBody replaces={["GoHighLevel mobile app", "Pipedrive mobile"]}>
        <p>
          Your operation in your pocket. Reply to leads, take calls, see the
          pipeline, mark deals — all under your brand on iOS and Android.
        </p>
        <p>
          Push notifications when a hot lead arrives. Never miss a reply
          window because you were off the laptop.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Analytics · pipeline",
    title: "Pipeline analytics",
    src: ph("Pipeline analytics", "A8B86C"),
    content: (
      <ModuleBody replaces={["HubSpot reporting upgrades", "manual conversion tracking"]}>
        <p>
          Where are deals getting stuck? What&apos;s your conversion rate
          per stage? Which lead source actually closes? Numbers, not vibes.
        </p>
        <p>
          Heat-mapped pipeline view shows the bottleneck at a glance.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Revenue",
    title: "Revenue dashboard",
    src: ph("Revenue", "D67B82"),
    content: (
      <ModuleBody replaces={["QuickBooks reporting", "spreadsheet revenue tracking"]}>
        <p>
          Tracks revenue per source, per service, per stylist or technician.
          Monthly recurring revenue calculated automatically for subscription
          services.
        </p>
        <p>
          Goal tracker: set a monthly revenue target, see live progress.
        </p>
      </ModuleBody>
    ),
  },
  {
    category: "Integrations",
    title: "Connect to anything",
    src: ph("Integrations", "F2C94C"),
    content: (
      <ModuleBody replaces={["Zapier Premium", "manual data entry"]}>
        <p>
          Native integrations with Stripe, QuickBooks, Calendly, Google
          Calendar, Outlook, Zoom, Twilio, Mailchimp, and a thousand more
          through Zapier and Make.
        </p>
        <p>
          Already using software you love? Keep it. We wire it into the
          pipeline.
        </p>
      </ModuleBody>
    ),
  },
];

function ModuleBody({
  children,
  replaces,
}: {
  children: React.ReactNode;
  replaces: string[];
}) {
  return (
    <div className="space-y-4 text-base text-text-muted leading-relaxed">
      {children}
      <div className="pt-2 border-t border-text-muted/15">
        <div className="mono-label text-text-dim text-xs mb-1">Replaces</div>
        <div className="text-sm text-text-muted/80">{replaces.join(" · ")}</div>
      </div>
    </div>
  );
}

export function SceneDashboardModulesCarousel() {
  const items = MODULES.map((c, i) => <Card key={c.title} card={c} index={i} />);
  return (
    <div className="w-full">
      <Carousel items={items} />
    </div>
  );
}
