"use client";

import { motion } from "framer-motion";

const items = [
  "TOGAF", "ArchiMate", "AWS Well-Architected", "Azure CAF",
  "Custom Frameworks", "GDPR-Ready", "Explainable AI", "Human-in-the-Loop",
  "RBAC", "AES-256", "Audit Logging", "MFA",
];

export default function TrustMarquee() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-y overflow-hidden select-none my-20"
      style={{ borderColor: "var(--border-dim)" }}
    >
      <div className="flex gap-14 py-4 animate-[marquee_30s_linear_infinite] w-max">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-14">
            <span
              className="text-[0.82rem] font-medium tracking-[0.03em] whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}
            >
              {item}
            </span>
            <span className="text-[0.82rem] font-medium tracking-[0.03em]" style={{ color: "var(--text-muted)" }}>
              ·
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
