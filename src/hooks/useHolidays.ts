"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Holiday, HolidayMap, HolidaysResponse, CreateHolidayRequest } from "@/lib/types";

export function useHolidays(year: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [ptoCounts, setPtoCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/holidays?year=${year}`);
      const data: HolidaysResponse = await res.json();
      setHolidays(data.holidays);
      setPtoCounts(data.ptoCounts);
    } catch (err) {
      console.error("Failed to fetch holidays:", err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const holidayMap: HolidayMap = useMemo(() => {
    const map: HolidayMap = {};
    for (const h of holidays) {
      if (!map[h.date]) map[h.date] = [];
      map[h.date].push(h);
    }
    return map;
  }, [holidays]);

  const addHoliday = useCallback(
    async (req: CreateHolidayRequest) => {
      if (!req.user_names.length) throw new Error("No users selected");
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error("Failed to create holiday");
      await fetchHolidays();
    },
    [fetchHolidays]
  );

  const removeHoliday = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/holidays/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete holiday");
      await fetchHolidays();
    },
    [fetchHolidays]
  );

  return { holidays, holidayMap, ptoCounts, loading, addHoliday, removeHoliday };
}
