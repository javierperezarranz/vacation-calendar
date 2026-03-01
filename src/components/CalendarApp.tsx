"use client";

import { useState, useEffect } from "react";
import { Holiday, HolidayType, UpdateHolidayGroupRequest } from "@/lib/types";
import { formatDate } from "@/lib/date-utils";
import { useHolidays } from "@/hooks/useHolidays";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import YearNavigation from "./YearNavigation";
import ThemeToggle from "./ThemeToggle";
import UserSelector from "./UserSelector";
import HolidayLegend from "./HolidayLegend";
import YearlyCalendar from "./YearlyCalendar";
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal";

export default function CalendarApp() {
  const now = new Date();
  const todayStr = formatDate(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, setYear] = useState(now.getFullYear());
  const [users, setUsers] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("vacation-calendar-users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("vacation-calendar-users", JSON.stringify(users));
  }, [users]);
  const [modalState, setModalState] = useState<{
    dateStr: string;
    holidays: Holiday[];
  } | null>(null);

  const [editModalState, setEditModalState] = useState<{
    name: string;
    type: HolidayType;
    userName: string | null;
  } | null>(null);

  const { holidayMap, ptoCounts, loading, addHoliday, removeHoliday, updateHolidayGroup, removeHolidayGroup } =
    useHolidays(year);

  const handleDayClick = (dateStr: string, holidays: Holiday[]) => {
    setModalState({ dateStr, holidays });
  };

  const handleEventClick = (name: string, type: HolidayType, userName: string | null) => {
    setEditModalState({ name, type, userName });
  };

  const handleAdd = async (
    dates: string[],
    name: string,
    type: HolidayType,
    userNames: string[]
  ) => {
    await addHoliday({ dates, name, type, user_names: userNames });
  };

  const handleDelete = async (id: number) => {
    await removeHoliday(id);
  };

  const handleUpdate = async (req: UpdateHolidayGroupRequest) => {
    await updateHolidayGroup(req);
  };

  const handleDeleteGroup = async (name: string, type: string, userName: string | null) => {
    await removeHolidayGroup(name, type, userName);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <YearNavigation year={year} onYearChange={setYear} />
            <ThemeToggle />
          </div>
          <UserSelector users={users} onUsersChange={setUsers} ptoCounts={ptoCounts} />
        </div>

        <div className="mb-4">
          <HolidayLegend />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8 text-brand-600" />
          </div>
        ) : (
          <YearlyCalendar
            year={year}
            holidayMap={holidayMap}
            today={todayStr}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        )}

        {modalState && (
          <AddEventModal
            dateStr={modalState.dateStr}
            existingHolidays={modalState.holidays}
            users={users}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onClose={() => setModalState(null)}
          />
        )}

        {editModalState && (
          <EditEventModal
            year={year}
            eventName={editModalState.name}
            eventType={editModalState.type}
            userName={editModalState.userName}
            onUpdate={handleUpdate}
            onDelete={handleDeleteGroup}
            onClose={() => setEditModalState(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
