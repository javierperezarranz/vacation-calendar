"use client";

interface YearNavigationProps {
  year: number;
  onYearChange: (year: number) => void;
}

export default function YearNavigation({
  year,
  onYearChange,
}: YearNavigationProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onYearChange(year - 1)}
        className="px-3 py-1 text-lg rounded hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Previous year"
      >
        &lt;
      </button>
      <span className="text-2xl font-bold tabular-nums min-w-[5ch] text-center">
        {year}
      </span>
      <button
        onClick={() => onYearChange(year + 1)}
        className="px-3 py-1 text-lg rounded hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Next year"
      >
        &gt;
      </button>
    </div>
  );
}
