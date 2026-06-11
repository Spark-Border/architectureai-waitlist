"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";

interface CardProps {
  icon: string;
  title: string;
  body: string;
  index: number;
}

function Card({ icon, title, body, index }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.07 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        background: "var(--surface)",
        borderColor: "var(--border-dim)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-7 rounded-2xl border cursor-default transition-shadow duration-300 hover:shadow-[0_24px_64px_rgba(0,0,0,0.15)] sm:col-span-1"
      whileHover={{ borderColor: "var(--border)" } as any}
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[1.15rem] mb-4"
        style={{
          background: "rgba(88,124,255,0.1)",
          color: "var(--accent-lit)",
          transform: "translateZ(20px)",
        }}
      >
        {icon}
      </div>
      <h3
        className="text-base font-semibold tracking-[-0.01em] mb-1.5"
        style={{ color: "var(--text)", transform: "translateZ(15px)" }}
      >
        {title}
      </h3>
      <p
        className="text-[0.84rem] leading-relaxed"
        style={{ color: "var(--text-muted)", transform: "translateZ(10px)" }}
      >
        {body}
      </p>
    </motion.div>
  );
}

const cards: CardProps[] = [
  {
    icon: "⚡",
    title: "AI Architecture Review Engine",
    body: "Upload diagrams and documents — our AI evaluates them against TOGAF, ArchiMate, AWS Well-Architected, and Azure CAF in under two minutes. Every finding includes observation, evidence, risk, recommendation, confidence score, and framework reference. No black boxes, ever.",
    index: 0,
  },
  {
    icon: "🛡️",
    title: "Governance Engine",
    body: "Define custom policies once. They're evaluated against every submission automatically — consistent, enforceable, auditable.",
    index: 1,
  },
  {
    icon: "🧠",
    title: "Explainability by default",
    body: "Every AI finding is traceable, evidence-backed, and framework-referenced. AI recommends — humans decide.",
    index: 2,
  },
  {
    icon: "📊",
    title: "Rich reports & exports",
    body: "Generate branded PDF and DOCX reports with executive summaries, risk registers, and compliance scorecards.",
    index: 3,
  },
  {
    icon: "🔒",
    title: "Enterprise-grade, day one",
    body: "RBAC, MFA, tenant isolation, AES-256 encryption, immutable audit logs, and GDPR-compliant data handling — all shipping with v1.",
    index: 4,
  },
  {
    icon: "🔗",
    title: "Architecture Knowledge Graph",
    body: "Every review enriches a living graph of your applications, services, APIs, databases, and capabilities. Over time, ArchitectureAI builds institutional memory that no competitor can replicate — enabling impact analysis, portfolio optimisation, and eventually a full enterprise digital twin.",
    index: 5,
  },
];

export default function FeaturesBento() {
  return (
    <section id="why">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] max-w-[1100px] mx-auto px-6 mb-5"
        style={{ color: "var(--accent-lit)" }}
      >
        What we&apos;re building
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="text-[clamp(1.7rem,3vw,2.1rem)] font-bold tracking-[-0.025em] leading-tight max-w-[1100px] mx-auto px-6 mb-12"
        style={{ color: "var(--text)" }}
      >
        An operating system for the
        <br />
        entire architecture lifecycle
      </motion.h2>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.index} {...card} />
        ))}
      </div>
    </section>
  );
}
