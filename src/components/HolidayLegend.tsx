"use client";

const LEGEND_ITEMS = [
  { label: "National Holiday", color: "bg-red-50 border border-red-200", textColor: "text-red-700", isBar: false },
  { label: "Weekend", color: "bg-gray-50 border border-gray-200", textColor: "text-gray-400", isBar: false },
  { label: "Company Holiday", color: "bg-blue-400", textColor: "", isBar: true },
  { label: "PTO", color: "bg-green-400", textColor: "", isBar: true },
  { label: "Event", color: "bg-purple-400", textColor: "", isBar: true },
  { label: "Today", color: "ring-2 ring-indigo-600", textColor: "", isBar: false },
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
          <span className="text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
