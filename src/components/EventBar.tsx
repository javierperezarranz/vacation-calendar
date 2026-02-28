"use client";

import { EventSegment, HolidayType } from "@/lib/types";

const TYPE_COLORS: Record<HolidayType, string> = {
  national: "bg-gray-400",
  company: "bg-blue-400 text-white",
  pto: "bg-green-400 text-white",
  event: "bg-purple-400 text-white",
};

const DAY_HEADER_HEIGHT = 32; // px - space for day number + national holiday label
const SLOT_HEIGHT = 18; // px per event bar slot
const SLOT_GAP = 2; // px gap between slots

interface EventBarProps {
  segment: EventSegment;
}

export default function EventBar({ segment }: EventBarProps) {
  const left = `${segment.startCol * (100 / 7)}%`;
  const width = `${segment.colSpan * (100 / 7)}%`;
  const top = DAY_HEADER_HEIGHT + segment.rowSlot * (SLOT_HEIGHT + SLOT_GAP);

  const rounding = [
    segment.isStart ? "rounded-l" : "",
    segment.isEnd ? "rounded-r" : "",
  ].join(" ");

  const colorClass = TYPE_COLORS[segment.type] || TYPE_COLORS.pto;

  const label =
    segment.userName
      ? `${segment.name} (${segment.userName})`
      : segment.name;

  return (
    <div
      className={`group/bar absolute overflow-hidden text-[10px] leading-[16px] font-medium truncate px-1 ${colorClass} ${rounding}`}
      style={{
        left,
        width,
        top: `${top}px`,
        height: `${SLOT_HEIGHT}px`,
        // Slight horizontal margin for visual polish on start/end
        marginLeft: segment.isStart ? "2px" : "0",
        marginRight: segment.isEnd ? "2px" : "0",
        // Adjust width to account for margins
        ...(segment.isStart || segment.isEnd
          ? {
              width: `calc(${segment.colSpan * (100 / 7)}% - ${
                (segment.isStart ? 2 : 0) + (segment.isEnd ? 2 : 0)
              }px)`,
            }
          : {}),
        zIndex: 1,
      }}
    >
      {label}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/bar:block z-50">
        <div className="whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] text-white shadow-lg">
          {label}
        </div>
      </div>
    </div>
  );
}

export { DAY_HEADER_HEIGHT, SLOT_HEIGHT, SLOT_GAP };
