"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, 847, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, count]);

  return (
    <div ref={ref} className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Architects already on the waitlist
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <motion.span
            className="text-5xl font-extrabold tracking-[-0.03em] tabular-nums"
            style={{ color: "var(--text)" }}
          >
            {rounded}
          </motion.span>
          <span className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
            +
          </span>
        </div>
        <p
          className="text-[0.82rem] mt-3"
          style={{ color: "var(--text-muted)" }}
        >
          from banking, fintech, insurance, and SaaS
        </p>
      </motion.div>
    </div>
  );
}