import React from "react";

const TICKER_ITEMS = [
  { label: "Total Delivered Value", value: "₹1,500+ Crores" },
  { label: "Built-up Area Constructed", value: "16.5 Lakh+ sq.ft" },
  { label: "Homes & Units Delivered", value: "1,600+ Units" },
  { label: "Landmark Projects", value: "16 Completed" },
  { label: "Structural Integrity", value: "100% ISO Compliant" },
  { label: "Vaastu Compliant", value: "All Projects" },
  { label: "Operating Since", value: "Est. 2008" },
  { label: "Primary Region", value: "Telangana, India" },
  { label: "Seismic Safety", value: "Zone II & III Certified" },
  { label: "Flagship Project", value: "Beccun Life Style — ₹492 Cr" },
  { label: "Contact", value: "+91 95428 26610" },
];

function TickerItem({ label, value }: { label: string; value: string; key?: number }) {
  return (
    <div className="flex items-center gap-3 px-8 shrink-0 select-none">
      <span className="text-amber-400/60 text-[11px] font-mono uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <span className="w-1 h-1 rounded-full bg-amber-500/50 shrink-0" />
      <span className="text-white text-[13px] font-semibold tracking-tight whitespace-nowrap">
        {value}
      </span>
      <span className="ml-6 text-slate-700 font-bold text-xs">◆</span>
    </div>
  );
}

export default function TickerBar() {
  // Duplicate for seamless loop
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      id="ticker-bar"
      className="w-full bg-slate-900 dark:bg-slate-950 border-y border-slate-800 overflow-hidden py-3"
      aria-label="Company statistics ticker"
    >
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <TickerItem key={i} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}
