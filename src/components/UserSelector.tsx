"use client";

import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserSelectorProps {
  users: string[];
  onUsersChange: (users: string[]) => void;
  ptoCounts: Record<string, number>;
}

export default function UserSelector({
  users,
  onUsersChange,
  ptoCounts,
}: UserSelectorProps) {
  const [knownUsers, setKnownUsers] = useState<User[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setKnownUsers(data.users))
      .catch(() => {});
  }, []);

  const addUser = () => {
    const name = input.trim();
    if (!name) return;
    if (users.some((u) => u.toLowerCase() === name.toLowerCase())) {
      setInput("");
      return;
    }
    onUsersChange([...users, name]);
    setInput("");
  };

  const removeUser = (name: string) => {
    onUsersChange(users.filter((u) => u !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUser();
    }
  };

  // Filter suggestions to users not already added
  const suggestions = knownUsers.filter(
    (u) => !users.some((added) => added.toLowerCase() === u.name.toLowerCase())
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {users.map((name) => (
        <Badge
          key={name}
          variant="secondary"
          className="gap-1.5 py-1 pl-2.5 pr-1.5"
        >
          <span>{name}</span>
          <span className="font-bold text-success-700 tabular-nums">
            {ptoCounts[name] || 0} PTO
          </span>
          <button
            type="button"
            onClick={() => removeUser(name)}
            className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-gray-200 hover:text-foreground cursor-pointer transition-colors"
            aria-label={`Remove ${name}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <div className="flex items-center gap-1.5">
        <Input
          id="user-name"
          type="text"
          list="user-list"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add person…"
          className="h-7 w-32 text-sm"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={addUser}
          disabled={!input.trim()}
          aria-label="Add user"
        >
          <UserPlus className="size-3.5" />
        </Button>
        <datalist id="user-list">
          {suggestions.map((u) => (
            <option key={u.id} value={u.name} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
