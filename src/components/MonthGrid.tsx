"use client";

import { useMemo } from "react";
import { MONTH_NAMES, DAY_LABELS } from "@/lib/date-utils";
import { Holiday, HolidayMap, HolidayType } from "@/lib/types";
import { computeMonthLayout } from "@/lib/event-layout";
import WeekRow from "./WeekRow";

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  holidayMap: HolidayMap;
  today: string;
  onDayClick: (dateStr: string, holidays: Holiday[]) => void;
  onEventClick: (name: string, type: HolidayType, userName: string | null) => void;
}

export default function MonthGrid({
  year,
  month,
  holidayMap,
  today,
  onDayClick,
  onEventClick,
}: MonthGridProps) {
  const layout = useMemo(
    () => computeMonthLayout(year, month, holidayMap, today),
    [year, month, holidayMap, today]
  );

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      <h3 className="text-sm font-semibold text-center mb-2">
        {MONTH_NAMES[month]}
      </h3>
      {/* Day-of-week header */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-[10px] text-gray-400 dark:text-gray-500 text-center font-medium pb-1"
          >
            {label}
          </div>
        ))}
      </div>
      {/* Week rows */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {layout.weeks.map((week, i) => (
          <div key={i} className="border-b border-gray-100 dark:border-gray-800">
            <WeekRow week={week} onDayClick={onDayClick} onEventClick={onEventClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
