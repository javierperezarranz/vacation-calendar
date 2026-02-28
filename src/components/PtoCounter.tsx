"use client";

import { Badge } from "@/components/ui/badge";

interface PtoCounterProps {
  users: string[];
  ptoCounts: Record<string, number>;
}

export default function PtoCounter({ users, ptoCounts }: PtoCounterProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {users.map((name) => (
        <Badge key={name} variant="outline" className="gap-1 text-gray-600">
          {name}: <span className="font-bold text-success-700">{ptoCounts[name] || 0}</span> PTO
        </Badge>
      ))}
    </div>
  );
}
