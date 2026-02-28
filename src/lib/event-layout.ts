import { getDaysInMonth, getFirstDayOfWeek, formatDate } from "./date-utils";
import {
  Holiday,
  HolidayMap,
  EventSpan,
  EventSegment,
  DayCellData,
  WeekRowLayout,
  MonthLayout,
} from "./types";

export const MAX_VISIBLE_SLOTS = 3;

/**
 * Stage 1: Group non-national holidays into spans of consecutive days
 * with the same (name, type, userName).
 */
function groupIntoSpans(
  year: number,
  month: number,
  holidayMap: HolidayMap
): EventSpan[] {
  const daysInMonth = getDaysInMonth(year, month);
  // Collect all non-national holidays keyed by (name, type, userName)
  const spanMap = new Map<string, { days: number[]; holiday: Holiday }>();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(year, month, d);
    const holidays = holidayMap[dateStr] || [];
    for (const h of holidays) {
      if (h.type === "national") continue;
      const key = `${h.name}|${h.type}|${h.user_name ?? ""}`;
      if (!spanMap.has(key)) {
        spanMap.set(key, { days: [], holiday: h });
      }
      spanMap.get(key)!.days.push(d);
    }
  }

  const spans: EventSpan[] = [];
  for (const { days, holiday } of spanMap.values()) {
    days.sort((a, b) => a - b);
    // Group consecutive days into separate spans
    let start = days[0];
    let prev = days[0];
    for (let i = 1; i <= days.length; i++) {
      if (i < days.length && days[i] === prev + 1) {
        prev = days[i];
      } else {
        spans.push({
          name: holiday.name,
          type: holiday.type,
          userName: holiday.user_name,
          startDay: start,
          endDay: prev,
        });
        if (i < days.length) {
          start = days[i];
          prev = days[i];
        }
      }
    }
  }

  // Sort spans: longer spans first (for better slot assignment), then by start day
  spans.sort((a, b) => {
    const lenA = a.endDay - a.startDay;
    const lenB = b.endDay - b.startDay;
    if (lenB !== lenA) return lenB - lenA;
    return a.startDay - b.startDay;
  });

  return spans;
}

/**
 * Stage 2: Split spans into week-row segments.
 * Each segment fits within a single week row.
 */
function splitIntoSegments(
  spans: EventSpan[],
  firstDayOffset: number,
  daysInMonth: number
): { segments: EventSegment[][]; weekCount: number } {
  // Calculate total cells (offset + days) to determine week count
  const totalCells = firstDayOffset + daysInMonth;
  const weekCount = Math.ceil(totalCells / 7);

  // For each span, produce segments per week row
  // segments[weekIdx] = list of segments in that week (without rowSlot yet)
  const segmentsByWeek: Omit<EventSegment, "rowSlot">[][] = Array.from(
    { length: weekCount },
    () => []
  );

  for (const span of spans) {
    // Convert day-of-month to cell index (0-based within the grid)
    const startCell = firstDayOffset + span.startDay - 1;
    const endCell = firstDayOffset + span.endDay - 1;

    const startWeek = Math.floor(startCell / 7);
    const endWeek = Math.floor(endCell / 7);

    for (let w = startWeek; w <= endWeek; w++) {
      const weekStart = w * 7;
      const weekEnd = weekStart + 6;

      const segStart = Math.max(startCell, weekStart);
      const segEnd = Math.min(endCell, weekEnd);

      segmentsByWeek[w].push({
        name: span.name,
        type: span.type,
        userName: span.userName,
        startCol: segStart - weekStart,
        colSpan: segEnd - segStart + 1,
        isStart: w === startWeek,
        isEnd: w === endWeek,
      });
    }
  }

  // Stage 3: Assign vertical slots using greedy interval scheduling
  const result: EventSegment[][] = segmentsByWeek.map((weekSegs) => {
    // Sort by colSpan descending (longer gets priority for lower slots), then startCol
    const sorted = [...weekSegs].sort((a, b) => {
      if (b.colSpan !== a.colSpan) return b.colSpan - a.colSpan;
      return a.startCol - b.startCol;
    });

    const assigned: EventSegment[] = [];
    // Track which slot each column is occupied up to
    // slotOccupancy[col] = set of occupied slot indices
    const colSlots: Set<number>[] = Array.from({ length: 7 }, () => new Set());

    for (const seg of sorted) {
      // Find the lowest slot that is free for all columns in this segment's range
      let slot = 0;
      while (true) {
        let free = true;
        for (
          let c = seg.startCol;
          c < seg.startCol + seg.colSpan;
          c++
        ) {
          if (colSlots[c].has(slot)) {
            free = false;
            break;
          }
        }
        if (free) break;
        slot++;
      }

      // Mark columns as occupied at this slot
      for (let c = seg.startCol; c < seg.startCol + seg.colSpan; c++) {
        colSlots[c].add(slot);
      }

      assigned.push({ ...seg, rowSlot: slot });
    }

    return assigned;
  });

  return { segments: result, weekCount };
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

/**
 * Main entry point: compute the complete month layout.
 */
export function computeMonthLayout(
  year: number,
  month: number,
  holidayMap: HolidayMap,
  today: string
): MonthLayout {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);
  const spans = groupIntoSpans(year, month, holidayMap);
  const { segments, weekCount } = splitIntoSegments(
    spans,
    firstDayOffset,
    daysInMonth
  );

  const weeks: WeekRowLayout[] = [];

  for (let w = 0; w < weekCount; w++) {
    const cells: DayCellData[] = [];
    const weekStart = w * 7;

    for (let col = 0; col < 7; col++) {
      const cellIdx = weekStart + col;
      const dayOfMonth = cellIdx - firstDayOffset + 1;

      if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
        // Empty cell (before first day or after last day)
        cells.push({
          day: 0,
          dateStr: "",
          holidays: [],
          nationalHolidayName: null,
          isWeekend: false,
          isToday: false,
          overflowCount: 0,
        });
        continue;
      }

      const dateStr = formatDate(year, month, dayOfMonth);
      const holidays = holidayMap[dateStr] || [];
      const nationalHoliday = holidays.find((h) => h.type === "national");
      const nonNationalCount = holidays.filter(
        (h) => h.type !== "national"
      ).length;

      // Count how many segments occupy this column
      const segmentsAtCol = segments[w].filter(
        (s) => col >= s.startCol && col < s.startCol + s.colSpan
      );
      const maxSlotAtCol =
        segmentsAtCol.length > 0
          ? Math.max(...segmentsAtCol.map((s) => s.rowSlot))
          : -1;

      const visibleCount = Math.min(
        segmentsAtCol.length,
        MAX_VISIBLE_SLOTS
      );
      const overflow = nonNationalCount > MAX_VISIBLE_SLOTS
        ? nonNationalCount - MAX_VISIBLE_SLOTS
        : 0;

      cells.push({
        day: dayOfMonth,
        dateStr,
        holidays,
        nationalHolidayName: nationalHoliday?.name ?? null,
        isWeekend: isWeekend(dateStr),
        isToday: dateStr === today,
        overflowCount: overflow,
      });
    }

    // Only include segments with rowSlot < MAX_VISIBLE_SLOTS for rendering
    const visibleSegments = segments[w].filter(
      (s) => s.rowSlot < MAX_VISIBLE_SLOTS
    );
    const slotCount = Math.min(
      segments[w].length > 0
        ? Math.max(...segments[w].map((s) => s.rowSlot)) + 1
        : 0,
      MAX_VISIBLE_SLOTS
    );

    weeks.push({
      cells,
      segments: visibleSegments,
      slotCount,
    });
  }

  return { weeks };
}
