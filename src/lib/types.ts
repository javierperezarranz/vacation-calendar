export type HolidayType = "national" | "company" | "pto" | "event";

export interface Holiday {
  id: number;
  date: string; // YYYY-MM-DD
  name: string;
  type: HolidayType;
  user_name: string | null;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
}

export interface CreateHolidayRequest {
  dates: string[]; // YYYY-MM-DD[]
  name: string;
  type: HolidayType;
  user_names: string[];
}

export interface UpdateHolidayGroupRequest {
  year: number;
  oldName: string;
  oldType: HolidayType;
  userName: string | null;
  newName: string;
  newType: HolidayType;
}

export type HolidayMap = Record<string, Holiday[]>;

export interface HolidaysResponse {
  holidays: Holiday[];
  ptoCounts: Record<string, number>;
}

// --- Layout types for week-row calendar rendering ---

/** A multi-day (or single-day) non-national event within a month */
export interface EventSpan {
  name: string;
  type: HolidayType;
  userName: string | null;
  /** 0-indexed day-of-month for start */
  startDay: number;
  /** 0-indexed day-of-month for end (inclusive) */
  endDay: number;
}

/** Portion of an EventSpan that fits within one week row */
export interface EventSegment {
  name: string;
  type: HolidayType;
  userName: string | null;
  /** Column index within the week row (0-6) */
  startCol: number;
  /** Number of columns this segment spans */
  colSpan: number;
  /** Vertical slot index within the week row */
  rowSlot: number;
  /** Whether this is the first segment of the parent span */
  isStart: boolean;
  /** Whether this is the last segment of the parent span */
  isEnd: boolean;
}

/** Data for a single day cell */
export interface DayCellData {
  day: number;
  dateStr: string;
  holidays: Holiday[];
  nationalHolidayName: string | null;
  isWeekend: boolean;
  isToday: boolean;
  /** Number of events beyond MAX_VISIBLE_SLOTS */
  overflowCount: number;
}

/** Layout for one week row */
export interface WeekRowLayout {
  cells: DayCellData[];
  segments: EventSegment[];
  /** Number of vertical slots used by segments in this row */
  slotCount: number;
}

/** Complete month layout */
export interface MonthLayout {
  weeks: WeekRowLayout[];
}
