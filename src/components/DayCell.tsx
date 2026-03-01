"use client";

import { DayCellData, Holiday } from "@/lib/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface DayCellProps {
  cell: DayCellData;
  onClick: (dateStr: string, holidays: Holiday[]) => void;
}

export default function DayCell({ cell, onClick }: DayCellProps) {
  if (cell.day === 0) {
    return <div className="min-h-[32px]" />;
  }

  const bgColor = cell.nationalHolidayName
    ? "bg-red-50 dark:bg-red-950/40"
    : cell.isWeekend
      ? "bg-gray-50 dark:bg-gray-800/50"
      : "bg-white dark:bg-gray-900";

  return (
    <button
      onClick={() => onClick(cell.dateStr, cell.holidays)}
      className={`
        relative w-full text-left px-1 pt-0.5 min-h-[32px]
        transition-colors cursor-pointer
        hover:bg-gray-100 dark:hover:bg-gray-700
        ${bgColor}
        ${cell.isToday ? "ring-2 ring-inset ring-indigo-600 dark:ring-indigo-400" : ""}
      `}
      title={
        cell.holidays.length
          ? cell.holidays.map((h) => `${h.name} (${h.type})`).join(", ")
          : cell.dateStr
      }
    >
      {/* Invisible spacer — visible day number is rendered in WeekRow overlay */}
      <span className="text-[11px] leading-tight font-medium invisible">
        {cell.day}
      </span>
      {cell.nationalHolidayName && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="text-[8px] leading-tight text-red-600 dark:text-red-400 truncate"
            >
              {cell.nationalHolidayName}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-400 text-white border-gray-400">
            {cell.nationalHolidayName}
          </TooltipContent>
        </Tooltip>
      )}
      {cell.overflowCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] text-gray-500 dark:text-gray-400 font-medium">
          +{cell.overflowCount} more
        </div>
      )}
    </button>
  );
}
