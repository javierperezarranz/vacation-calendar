"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const LEGEND_ITEMS = [
  { label: "National holiday", color: "bg-error-50 border border-error-200" },
  { label: "Weekend", color: "bg-gray-50 border border-gray-200" },
  { label: "Company holiday", color: "bg-success-400 opacity-75" },
  { label: "PTO", color: "bg-brand-400 opacity-75" },
  { label: "Event", color: "bg-warning-400 opacity-75" },
  { label: "Today", color: "ring-2 ring-indigo-600 dark:ring-indigo-400" },
];

export default function HolidayLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className={`inline-block size-3 rounded-sm ${item.color}`}
          />
          <span className="font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
          {item.label === "PTO" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-gray-400 dark:text-gray-500 text-xs leading-none">
                  &#9432;
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>PTO days that fall on weekends, national holidays, or company holidays are not counted</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
}
