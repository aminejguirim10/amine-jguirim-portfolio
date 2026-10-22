"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleTheme } from "@/lib/theme";

export function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  return (
    <Button
      aria-label="Changer de thème"
      className={className}
      onClick={toggleTheme}
      size="icon"
      variant="outline"
    >
      <MoonIcon className="block dark:hidden" />
      <SunIcon className="hidden dark:block" />
      <span className="sr-only">Changer de thème</span>
    </Button>
  );
}