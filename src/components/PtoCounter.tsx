"use client";

interface PtoCounterProps {
  users: string[];
  ptoCounts: Record<string, number>;
}

export default function PtoCounter({ users, ptoCounts }: PtoCounterProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
      {users.map((name) => (
        <span key={name}>
          {name}: <span className="font-semibold text-green-700">{ptoCounts[name] || 0}</span> PTO
        </span>
      ))}
    </div>
  );
}
