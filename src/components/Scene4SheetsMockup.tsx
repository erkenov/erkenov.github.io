"use client";

/**
 * Scene4SheetsMockup — fake Google Sheets pipeline used inside the
 * Scene 4 Lead Management carousel ("Google Sheets" tier card).
 *
 * Pure styled markup; no real Google Sheets connection. Purpose is to
 * communicate "lean lead pipeline in a spreadsheet" at a glance.
 */

const ROWS: Array<{
  name: string;
  source: string;
  status: "New" | "Contacted" | "Qualified" | "Quoted" | "Booked";
  lastContact: string;
  nextStep: string;
}> = [
  { name: "Daniel Petrov", source: "Voice agent", status: "Booked", lastContact: "Today", nextStep: "Consult — Fri 10:00" },
  { name: "Maya Chen", source: "Web chat", status: "Quoted", lastContact: "Yesterday", nextStep: "Send revised quote" },
  { name: "Tom O'Connor", source: "Google Maps", status: "Qualified", lastContact: "2 days", nextStep: "Discovery call" },
  { name: "Lara Aydın", source: "Instagram DM", status: "Contacted", lastContact: "3 days", nextStep: "Follow-up #2" },
  { name: "Yusuf Kaya", source: "Forms", status: "New", lastContact: "Just now", nextStep: "Auto-reply sent" },
  { name: "Anna Weiss", source: "Cold email", status: "Contacted", lastContact: "4 days", nextStep: "Wait reply" },
];

const STATUS_STYLES: Record<typeof ROWS[number]["status"], string> = {
  New: "bg-[#E8F0FE] text-[#1967D2]",
  Contacted: "bg-[#FEF7E0] text-[#B26A00]",
  Qualified: "bg-[#E6F4EA] text-[#137333]",
  Quoted: "bg-[#FCE8E6] text-[#C5221F]",
  Booked: "bg-[#1E8E3E] text-white",
};

export function Scene4SheetsMockup() {
  return (
    <div className="w-full max-w-[34rem] rounded-lg overflow-hidden shadow-xl border border-black/10 bg-white text-[#202124]">
      {/* Top chrome — fake Google Sheets header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10 bg-white">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
        </div>
        <div className="ml-3 flex items-center gap-2 text-[13px] font-medium">
          <SheetsIcon />
          <span>Erken Pipeline · 2026</span>
        </div>
        <div className="ml-auto text-[11px] text-[#5f6368]">Shared</div>
      </div>

      {/* Cell A1 reference + toolbar */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-black/10 text-[11px] text-[#5f6368] bg-[#F8F9FA]">
        <span className="font-mono">A2</span>
        <span className="ml-2 text-[12px] text-[#202124]">Daniel Petrov</span>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-[1.6fr_1.2fr_1fr_0.9fr_1.4fr] text-[12px]">
        <Cell header>Lead</Cell>
        <Cell header>Source</Cell>
        <Cell header>Status</Cell>
        <Cell header>Last contact</Cell>
        <Cell header>Next step</Cell>

        {ROWS.map((r, i) => (
          <RowFragment key={r.name} row={r} zebra={i % 2 === 1} />
        ))}
      </div>

      {/* Footer — sheet tabs */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-t border-black/10 bg-[#F8F9FA] text-[11px] text-[#5f6368]">
        <span className="px-2 py-0.5 rounded-t bg-white border border-b-0 border-black/10 text-[#1E8E3E] font-medium">Pipeline</span>
        <span className="px-2 py-0.5">Sources</span>
        <span className="px-2 py-0.5">Follow-ups</span>
        <span className="ml-auto">6 rows · synced</span>
      </div>
    </div>
  );
}

function Cell({ children, header }: { children: React.ReactNode; header?: boolean }) {
  return (
    <div
      className={`px-3 py-2 border-b border-black/[0.06] ${
        header
          ? "bg-[#F1F3F4] text-[#5f6368] font-medium text-[11px] uppercase tracking-wider"
          : "text-[#202124]"
      }`}
    >
      {children}
    </div>
  );
}

function RowFragment({ row, zebra }: { row: typeof ROWS[number]; zebra: boolean }) {
  const bg = zebra ? "bg-[#FAFBFC]" : "bg-white";
  return (
    <>
      <div className={`${bg} px-3 py-2 border-b border-black/[0.06] font-medium`}>{row.name}</div>
      <div className={`${bg} px-3 py-2 border-b border-black/[0.06] text-[#5f6368]`}>{row.source}</div>
      <div className={`${bg} px-3 py-2 border-b border-black/[0.06]`}>
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLES[row.status]}`}>
          {row.status}
        </span>
      </div>
      <div className={`${bg} px-3 py-2 border-b border-black/[0.06] text-[#5f6368] text-[11px]`}>{row.lastContact}</div>
      <div className={`${bg} px-3 py-2 border-b border-black/[0.06] text-[#202124] text-[11px]`}>{row.nextStep}</div>
    </>
  );
}

function SheetsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="14" height="18" rx="1.5" fill="#1E8E3E" />
      <path d="M17 3 L21 7 L17 7 Z" fill="#0F6427" />
      <rect x="6" y="9" width="11" height="2" fill="white" opacity="0.95" />
      <rect x="6" y="13" width="11" height="2" fill="white" opacity="0.85" />
      <rect x="6" y="17" width="11" height="2" fill="white" opacity="0.75" />
    </svg>
  );
}
