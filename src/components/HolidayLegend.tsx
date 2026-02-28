"use client";

const LEGEND_ITEMS = [
  { label: "National holiday", color: "bg-error-50 border border-error-200", isBar: false },
  { label: "Weekend", color: "bg-gray-50 border border-gray-200", isBar: false },
  { label: "Company holiday", color: "bg-brand-400", isBar: true },
  { label: "PTO", color: "bg-success-400", isBar: true },
  { label: "Event", color: "bg-warning-400", isBar: true },
  { label: "Today", color: "ring-2 ring-brand-600", isBar: false },
];

export default function HolidayLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className={`inline-block ${
              item.isBar ? "w-6 h-3 rounded" : "w-4 h-4 rounded"
            } ${item.color}`}
          />
          <span className="font-medium text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
