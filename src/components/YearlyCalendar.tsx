"use client";

import { Holiday, HolidayMap } from "@/lib/types";
import MonthGrid from "./MonthGrid";

interface YearlyCalendarProps {
  year: number;
  holidayMap: HolidayMap;
  today: string;
  onDayClick: (dateStr: string, holidays: Holiday[]) => void;
}

export default function YearlyCalendar({
  year,
  holidayMap,
  today,
  onDayClick,
}: YearlyCalendarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, month) => (
        <MonthGrid
          key={month}
          year={year}
          month={month}
          holidayMap={holidayMap}
          today={today}
          onDayClick={onDayClick}
        />
      ))}
    </div>
  );
}
