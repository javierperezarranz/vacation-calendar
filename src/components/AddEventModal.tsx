"use client";

import { useState } from "react";
import { Holiday, HolidayType } from "@/lib/types";
import { getDateRange } from "@/lib/date-utils";

interface AddEventModalProps {
  dateStr: string;
  existingHolidays: Holiday[];
  users: string[];
  onAdd: (dates: string[], name: string, type: HolidayType, userNames: string[]) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClose: () => void;
}

export default function AddEventModal({
  dateStr,
  existingHolidays,
  users,
  onAdd,
  onDelete,
  onClose,
}: AddEventModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<HolidayType>("pto");
  const [endDate, setEndDate] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([...users]);
  const [submitting, setSubmitting] = useState(false);

  const toggleUser = (userName: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userName)
        ? prev.filter((u) => u !== userName)
        : [...prev, userName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedUsers.length === 0) return;

    setSubmitting(true);
    try {
      const dates =
        endDate && endDate > dateStr
          ? getDateRange(dateStr, endDate)
          : [dateStr];
      await onAdd(dates, name.trim(), type, selectedUsers);
      onClose();
    } catch {
      alert("Failed to add event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSubmitting(true);
    try {
      await onDelete(id);
      onClose();
    } catch {
      alert("Failed to delete event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">{dateStr}</h2>

        {existingHolidays.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Existing events
            </h3>
            <ul className="space-y-1">
              {existingHolidays.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5"
                >
                  <span>
                    {h.name}{" "}
                    <span className="text-gray-400">
                      ({h.type}
                      {h.user_name ? `, ${h.user_name}` : ""})
                    </span>
                  </span>
                  <button
                    onClick={() => handleDelete(h.id)}
                    disabled={submitting}
                    className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {users.length === 0 ? (
          <p className="text-sm text-amber-600 mb-4">
            Please add at least one user above to add events.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer vacation"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="flex gap-4">
                {(["national", "company", "pto", "event"] as HolidayType[]).map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={() => setType(t)}
                    />
                    {t === "pto"
                      ? "PTO"
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to
              </label>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {users.map((user) => (
                  <label key={user} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user)}
                      onChange={() => toggleUser(user)}
                    />
                    {user}
                  </label>
                ))}
              </div>
              {selectedUsers.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Select at least one user</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date (optional, for multi-day)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={dateStr}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !name.trim() || selectedUsers.length === 0}
                className="px-4 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Adding..." : "Add Event"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
