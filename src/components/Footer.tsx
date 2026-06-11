"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 border-t flex justify-center items-center gap-3 sm:gap-4 text-[0.78rem] text-center"
      style={{ borderColor: "var(--border-dim)", color: "var(--text-muted)" }}
    >
      <span>© 2026 ArchitectureAI</span>
      {/* <span className="flex gap-3">
        <a
          href="#"
          className="no-underline transition-colors hover:underline"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Privacy
        </a>
        <span>·</span>
        <a
          href="#"
          className="no-underline transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Terms
        </a>
        <span>·</span>
        <a
          href="#"
          className="no-underline transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          hello@architectureai.com
        </a>
      </span> */}
    </motion.footer>
  );
}