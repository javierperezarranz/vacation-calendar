"use client";

import { DayCellData, Holiday } from "@/lib/types";

interface DayCellProps {
  cell: DayCellData;
  onClick: (dateStr: string, holidays: Holiday[]) => void;
}

export default function DayCell({ cell, onClick }: DayCellProps) {
  if (cell.day === 0) {
    return <div className="min-h-[32px]" />;
  }

  const bgColor = cell.nationalHolidayName
    ? "bg-red-50"
    : cell.isWeekend
      ? "bg-gray-50"
      : "bg-white";

  return (
    <button
      onClick={() => onClick(cell.dateStr, cell.holidays)}
      className={`
        relative w-full text-left px-1 pt-0.5 min-h-[32px]
        transition-colors cursor-pointer
        hover:bg-gray-100
        ${bgColor}
        ${cell.isToday ? "ring-2 ring-inset ring-indigo-600" : ""}
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
        <div
          className="text-[8px] leading-tight text-red-600 truncate"
          title={cell.nationalHolidayName}
        >
          {cell.nationalHolidayName}
        </div>
      )}
      {cell.overflowCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] text-gray-500 font-medium">
          +{cell.overflowCount} more
        </div>
      )}
    </button>
  );
}
