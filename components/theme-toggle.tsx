"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label="Toggle theme (press D)"
      title="Toggle theme (press D)"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-3.5 scale-100 transition-transform dark:scale-0" />
      <Moon className="absolute size-3.5 scale-0 transition-transform dark:scale-100" />
    </Button>
  );
}
