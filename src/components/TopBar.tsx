"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              backgroundColor: "color-mix(in srgb, var(--ink) 80%, transparent)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid var(--border-dim)",
            }
          : {}
      }
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 sm:px-6 py-5">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2.5 font-bold text-2xl sm:text-[2.05rem] tracking-[-0.02em] no-underline whitespace-nowrap"
          style={{ color: "var(--text)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ArchitectureAI
        </motion.a>

        {/* Right side: CTA + theme toggle */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#signup"
            className="hidden sm:inline-flex px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-200 no-underline whitespace-nowrap"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-soft)",
            }}
            whileHover={{ scale: 1.03, borderColor: "var(--accent)", color: "var(--text)" }}
            whileTap={{ scale: 0.97 }}
          >
            Stay in the loop
          </motion.a>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
