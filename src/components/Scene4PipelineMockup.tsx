"use client";

/**
 * Scene4PipelineMockup — fake GoHighLevel-style kanban "Opportunities"
 * pipeline used inside the Scene 4 Lead Management carousel.
 *
 * The same component renders BOTH the GoHighLevel tier card AND the
 * Erken Systems tier card — only the brand mark in the top-left
 * differs. Pass `brand="ghl"` or `brand="erken"`.
 *
 * Stages match a real lead-management pipeline: New Leads → Contacted →
 * Qualified → Quoted → Booked. Five active deal cards spread across the
 * stages so the view "screams success" instead of looking sparse.
 */

type Brand = "ghl" | "erken";

const STAGES = [
  { name: "New Leads", count: 2 },
  { name: "Contacted", count: 1 },
  { name: "Qualified", count: 1 },
  { name: "Quoted", count: 1 },
  { name: "Booked", count: 1 },
] as const;

type DealCard = {
  name: string;
  value: string;
  source: string;
  age: string;
  initials: string;
  initialsColor: string;
  stage: typeof STAGES[number]["name"];
};

const DEALS: DealCard[] = [
  { name: "Yusuf Kaya", value: "$2,400", source: "Voice agent", age: "Just now", initials: "YK", initialsColor: "#C76B58", stage: "New Leads" },
  { name: "Anna Weiss", value: "$1,800", source: "Forms", age: "4h", initials: "AW", initialsColor: "#7ea687", stage: "New Leads" },
  { name: "Lara Aydın", source: "Instagram DM", value: "$3,200", age: "3d", initials: "LA", initialsColor: "#E89F1F", stage: "Contacted" },
  { name: "Tom O'Connor", value: "$5,400", source: "Google Maps", age: "2d", initials: "TO", initialsColor: "#8B7BB8", stage: "Qualified" },
  { name: "Maya Chen", value: "$2,950", source: "Web chat", age: "1d", initials: "MC", initialsColor: "#25D366", stage: "Quoted" },
  { name: "Daniel Petrov", value: "$4,800", source: "Voice agent", age: "Today", initials: "DP", initialsColor: "#C76B58", stage: "Booked" },
];

export function Scene4PipelineMockup({ brand }: { brand: Brand }) {
  return (
    <div className="w-full max-w-[36rem] rounded-xl overflow-hidden shadow-xl border border-black/10 bg-[#F5F6F8] text-[#1f2937]">
      {/* Top chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10 bg-white">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
        </div>
        <div className="ml-3 flex items-center gap-2">
          {brand === "erken" ? <ErkenMark /> : <GhlMark />}
          <span className="text-[13px] font-semibold tracking-tight">
            {brand === "erken" ? "Erken Systems" : "HighLevel"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-[#5f6368]">
          <span>Opportunities</span>
          <span>·</span>
          <span>Pipeline view</span>
        </div>
      </div>

      {/* Body: sidebar + kanban */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-[110px] shrink-0 border-r border-black/10 bg-white py-2 text-[11px] text-[#475569]">
          <SidebarItem label="Dashboard" />
          <SidebarItem label="Conversations" />
          <SidebarItem label="Opportunities" active />
          <SidebarItem label="Calendars" />
          <SidebarItem label="Contacts" />
          <SidebarItem label="Marketing" />
          <SidebarItem label="Automation" />
          <SidebarItem label="Sites" />
          <SidebarItem label="Reputation" />
          <SidebarItem label="Reporting" />
        </div>

        {/* Kanban */}
        <div className="grow p-2.5 overflow-hidden">
          <div className="grid grid-cols-5 gap-2">
            {STAGES.map((stage) => {
              const cards = DEALS.filter((d) => d.stage === stage.name);
              return (
                <div key={stage.name} className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between px-1 pb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569] truncate">
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">{cards.length}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 min-h-[200px] bg-black/[0.025] rounded-md p-1.5">
                    {cards.map((c) => (
                      <DealCardView key={c.name} card={c} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`px-3 py-1.5 ${
        active ? "bg-[#EEF4FF] text-[#1d4ed8] font-medium border-l-2 border-[#1d4ed8]" : "text-[#475569]"
      }`}
    >
      {label}
    </div>
  );
}

function DealCardView({ card }: { card: DealCard }) {
  return (
    <div className="bg-white rounded-md border border-black/[0.06] shadow-sm p-2">
      <div className="flex items-center gap-1.5">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
          style={{ backgroundColor: card.initialsColor }}
        >
          {card.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-semibold text-[#0f172a] truncate">{card.name}</div>
        </div>
      </div>
      <div className="mt-1.5 text-[10px] font-bold text-[#137333]">{card.value}</div>
      <div className="mt-0.5 flex items-center justify-between text-[9px] text-[#64748b]">
        <span className="truncate">{card.source}</span>
        <span>{card.age}</span>
      </div>
    </div>
  );
}

/** GoHighLevel logomark — stylized version. Not the official mark, but
 *  recognizable enough at small carousel-card scale. */
function GhlMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#1d4ed8" />
      <path
        d="M7 16 V8 H10 V12 H14 V8 H17 V16 H14 V14 H10 V16 Z"
        fill="white"
      />
    </svg>
  );
}

/** Erken Systems mark — sage circle + terracotta dot. */
function ErkenMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#7ea687" />
      <circle cx="12" cy="12" r="3" fill="#C76B58" />
    </svg>
  );
}
