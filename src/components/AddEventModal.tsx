"use client";

import { useState } from "react";
import { Holiday, HolidayType } from "@/lib/types";
import { getDateRange } from "@/lib/date-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dateStr}</DialogTitle>
        </DialogHeader>

        {existingHolidays.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Existing events
            </h3>
            <ul className="space-y-1">
              {existingHolidays.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between text-sm bg-muted rounded px-3 py-1.5"
                >
                  <span>
                    {h.name}{" "}
                    <span className="text-muted-foreground">
                      ({h.type}
                      {h.user_name ? `, ${h.user_name}` : ""})
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDelete(h.id)}
                    disabled={submitting}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {users.length === 0 ? (
          <p className="text-sm text-warning-600">
            Please add at least one user above to add events.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="mb-1">Event name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer vacation"
                autoFocus
              />
            </div>

            <div>
              <Label className="mb-1">Type</Label>
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
              <Label className="mb-1">Assign to</Label>
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
                <p className="text-xs text-destructive mt-1">Select at least one user</p>
              )}
            </div>

            <div>
              <Label className="mb-1">End date (optional, for multi-day)</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={dateStr}
                className="w-auto"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !name.trim() || selectedUsers.length === 0}
              >
                {submitting ? "Adding..." : "Add event"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
