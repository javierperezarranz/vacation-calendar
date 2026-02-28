"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface UserSelectorProps {
  users: string[];
  onUsersChange: (users: string[]) => void;
}

export default function UserSelector({
  users,
  onUsersChange,
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="user-name" className="text-gray-600">
          Users:
        </Label>
        <Input
          id="user-name"
          type="text"
          list="user-list"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a name"
          className="h-8 w-auto"
        />
        <Button
          type="button"
          size="sm"
          onClick={addUser}
          disabled={!input.trim()}
        >
          Add
        </Button>
        <datalist id="user-list">
          {suggestions.map((u) => (
            <option key={u.id} value={u.name} />
          ))}
        </datalist>
      </div>
      {users.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {users.map((name) => (
            <Badge
              key={name}
              variant="secondary"
              className="gap-1"
            >
              {name}
              <button
                type="button"
                onClick={() => removeUser(name)}
                className="text-muted-foreground hover:text-foreground cursor-pointer leading-none"
                aria-label={`Remove ${name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
