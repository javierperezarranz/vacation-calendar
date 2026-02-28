"use client";

import { useState } from "react";
import { HolidayType, UpdateHolidayGroupRequest } from "@/lib/types";
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

interface EditEventModalProps {
  year: number;
  eventName: string;
  eventType: HolidayType;
  userName: string | null;
  onUpdate: (req: UpdateHolidayGroupRequest) => Promise<void>;
  onDelete: (name: string, type: string, userName: string | null) => Promise<void>;
  onClose: () => void;
}

export default function EditEventModal({
  year,
  eventName,
  eventType,
  userName,
  onUpdate,
  onDelete,
  onClose,
}: EditEventModalProps) {
  const [name, setName] = useState(eventName);
  const [type, setType] = useState<HolidayType>(eventType);
  const [submitting, setSubmitting] = useState(false);

  const hasChanges = name.trim() !== eventName || type !== eventType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hasChanges) return;

    setSubmitting(true);
    try {
      await onUpdate({
        year,
        oldName: eventName,
        oldType: eventType,
        userName,
        newName: name.trim(),
        newType: type,
      });
      onClose();
    } catch {
      alert("Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete all "${eventName}" entries${userName ? ` for ${userName}` : ""}?`)) return;

    setSubmitting(true);
    try {
      await onDelete(eventName, eventType, userName);
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
          <DialogTitle>Edit event</DialogTitle>
        </DialogHeader>

        {userName && (
          <p className="text-sm text-muted-foreground">
            User: <span className="font-medium text-foreground">{userName}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="mb-1">Event name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !name.trim() || !hasChanges}
              >
                {submitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
