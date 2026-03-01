"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODES = [
  { value: "light", icon: Sun, label: "Light mode" },
  { value: "dark", icon: Moon, label: "Dark mode" },
  { value: "system", icon: Monitor, label: "System mode" },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-8" />;
  }

  return (
    <div className="flex items-center rounded-lg border border-border p-0.5 gap-0.5">
      {MODES.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          className={`size-7 ${theme === value ? "bg-accent" : ""}`}
          onClick={() => setTheme(value)}
          aria-label={label}
        >
          <Icon className="size-3.5" />
        </Button>
      ))}
    </div>
  );
}
