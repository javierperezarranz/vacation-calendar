"use client";

import { WeekRowLayout, Holiday, HolidayType, DayCellData } from "@/lib/types";
import DayCell from "./DayCell";
import EventBar, { DAY_HEADER_HEIGHT, SLOT_HEIGHT, SLOT_GAP } from "./EventBar";

function dayNumberColor(cell: DayCellData): string {
  if (cell.isToday) return "text-indigo-600";
  if (cell.nationalHolidayName) return "text-red-700";
  if (cell.isWeekend) return "text-gray-400";
  return "text-gray-700";
}

interface WeekRowProps {
  week: WeekRowLayout;
  onDayClick: (dateStr: string, holidays: Holiday[]) => void;
  onEventClick: (name: string, type: HolidayType, userName: string | null) => void;
}

export default function WeekRow({ week, onDayClick, onEventClick }: WeekRowProps) {
  const eventAreaHeight =
    week.slotCount > 0
      ? week.slotCount * (SLOT_HEIGHT + SLOT_GAP)
      : 0;
  const totalHeight = DAY_HEADER_HEIGHT + eventAreaHeight;

  return (
    <div className="relative" style={{ height: `${totalHeight}px` }}>
      {/* Day cells grid */}
      <div className="grid grid-cols-7 h-full">
        {week.cells.map((cell, i) => (
          <DayCell key={i} cell={cell} onClick={onDayClick} />
        ))}
      </div>
      {/* Event bar overlay */}
      {week.segments.map((segment, i) => (
        <EventBar key={i} segment={segment} onEventClick={onEventClick} />
      ))}
      {/* Day number labels - always visible above events */}
      <div className="absolute inset-x-0 top-0 grid grid-cols-7 pointer-events-none z-10">
        {week.cells.map((cell, i) =>
          cell.day === 0 ? (
            <div key={i} />
          ) : (
            <div key={i} className="px-1 pt-0.5">
              <span
                className={`text-[11px] leading-tight font-medium ${dayNumberColor(cell)}`}
              >
                {cell.day}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
