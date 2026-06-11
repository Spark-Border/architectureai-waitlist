"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark",   icon: Moon,    label: "Dark"   },
  { value: "light",  icon: Sun,     label: "Light"  },
];

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

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

  const active = themes.find((t) => t.value === theme) ?? themes[0];
  const ActiveIcon = resolvedTheme === "light" ? Sun : Moon;

  return (
    <div className="relative">
      <motion.button
        id="theme-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Toggle theme"
        className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer"
        style={{
          borderColor: open ? "var(--accent)" : "var(--border)",
          background: open ? "rgba(88,124,255,0.08)" : "transparent",
          color: open ? "var(--accent-lit)" : "var(--text-muted)",
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

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <button
              className="fixed inset-0 z-998 cursor-default border-none outline-none bg-transparent w-full h-full p-0 m-0"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter") setOpen(false);
              }}
              aria-label="Close menu"
            />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-12 z-999 w-36 rounded-xl border shadow-xl overflow-hidden"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border-dim)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
              }}
            >
              {themes.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => { setTheme(value); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer"
                  style={{
                    color: active.value === value ? "var(--accent-lit)" : "var(--text-muted)",
                    background: active.value === value ? "rgba(88,124,255,0.07)" : "transparent",
                  }}
                >
                  <Icon size={14} strokeWidth={1.8} />
                  {label}
                  {active.value === value && (
                    <motion.span
                      layoutId="theme-check"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
