"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YearNavigationProps {
  year: number;
  onYearChange: (year: number) => void;
}

export default function YearNavigation({
  year,
  onYearChange,
}: YearNavigationProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onYearChange(year - 1)}
        aria-label="Previous year"
      >
        <ChevronLeft className="size-5" />
      </Button>
      <span className="font-reckless font-light tracking-tight text-3xl tabular-nums min-w-[5ch] text-center">
        {year}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onYearChange(year + 1)}
        aria-label="Next year"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
