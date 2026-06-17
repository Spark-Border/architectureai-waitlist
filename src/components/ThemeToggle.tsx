"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border bg-transparent animate-pulse"
           style={{ borderColor: "var(--border)" }} />
    );
  }

  const isLight = resolvedTheme === "light";
  const ActiveIcon = isLight ? Moon : Sun;

  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05, color: "var(--text)", borderColor: "var(--accent-lit)", background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
      whileTap={{ scale: 0.94 }}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer"
      style={{
        borderColor: "var(--border)",
        background: "transparent",
        color: "var(--text-soft)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolvedTheme}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex"
        >
          <ActiveIcon size={16} strokeWidth={1.8} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
