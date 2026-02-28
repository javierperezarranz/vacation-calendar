"use client";

import { EventSegment, HolidayType } from "@/lib/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const TYPE_COLORS: Record<HolidayType, string> = {
  national: "bg-gray-400",
  company: "bg-brand-400 text-white",
  pto: "bg-success-400 text-white",
  event: "bg-warning-400 text-white",
};

const DAY_HEADER_HEIGHT = 32; // px - space for day number + national holiday label
const SLOT_HEIGHT = 18; // px per event bar slot
const SLOT_GAP = 2; // px gap between slots

interface EventBarProps {
  segment: EventSegment;
  onEventClick?: (name: string, type: HolidayType, userName: string | null) => void;
}

export default function EventBar({ segment, onEventClick }: EventBarProps) {
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(segment.name, segment.type, segment.userName);
  };

  const bar = (
    <div
      className={`absolute z-[5] hover:z-20 text-[10px] leading-[16px] font-medium px-1 cursor-pointer ${colorClass} ${rounding} hover:brightness-110`}
      style={{
        left,
        width,
        top: `${top}px`,
        height: `${SLOT_HEIGHT}px`,
        marginLeft: segment.isStart ? "2px" : "0",
        marginRight: segment.isEnd ? "2px" : "0",
        ...(segment.isStart || segment.isEnd
          ? {
              width: `calc(${segment.colSpan * (100 / 7)}% - ${
                (segment.isStart ? 2 : 0) + (segment.isEnd ? 2 : 0)
              }px)`,
            }
          : {}),
      }}
      onClick={handleClick}
    >
      <span className="block truncate">{label}</span>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {bar}
      </TooltipTrigger>
      <TooltipContent>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export { DAY_HEADER_HEIGHT, SLOT_HEIGHT, SLOT_GAP };
