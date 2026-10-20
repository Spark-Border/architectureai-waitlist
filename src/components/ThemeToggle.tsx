"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

const subscribe = () => () => {};

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const isLight = mounted && resolvedTheme === "light";
  const Icon = isLight ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="btn btn-ghost p-0 h-10 w-10 md:h-9 md:w-9"
    >
      {mounted && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
    </button>
  );
}
