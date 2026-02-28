"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types";

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
        <label htmlFor="user-name" className="text-sm font-medium text-gray-600">
          Users:
        </label>
        <input
          id="user-name"
          type="text"
          list="user-list"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a name"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={addUser}
          disabled={!input.trim()}
          className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          Add
        </button>
        <datalist id="user-list">
          {suggestions.map((u) => (
            <option key={u.id} value={u.name} />
          ))}
        </datalist>
      </div>
      {users.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {users.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm px-2.5 py-0.5 rounded-full"
            >
              {name}
              <button
                type="button"
                onClick={() => removeUser(name)}
                className="text-indigo-500 hover:text-indigo-700 cursor-pointer leading-none"
                aria-label={`Remove ${name}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
