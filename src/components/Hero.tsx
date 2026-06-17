"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.1 },
  }),
};

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden flex flex-col items-center pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6"
    >
      {/* Background ambient glow behind the text */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-b from-(--accent) to-transparent opacity-10 blur-[120px] pointer-events-none rounded-full" />

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Kicker badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[0.68rem] uppercase tracking-wider mb-6 sm:mb-8 transition-colors hover:bg-white/5"
          style={{
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
            color: "var(--accent-lit)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-[pulseDot_2s_ease-in-out_infinite]"
            style={{ background: "var(--accent-lit)", boxShadow: "0 0 10px var(--accent-lit)" }}
          />
          {" "}Something big is coming
        </motion.div>

        {/* H1 */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter leading-[1.05] mb-8"
          style={{ color: "var(--text)" }}
        >
          Enterprise Architecture,
          <br className="hidden sm:block" />
          rebuilt with{" "}
          <span className="bg-linear-to-r from-[#7b98ff] via-[#a78bfa] to-[#ff8bf0] bg-clip-text text-transparent">
            AI-native
          </span>{" "}
          Intelligence.
        </motion.h1>

        {/* Description */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
          style={{ color: "var(--text-muted)" }}
        >
          The first operating system for enterprise architecture. Automate reviews, 
          enforce governance, and build a continuously learning knowledge graph across 
          your entire technology landscape.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-0"
        >
          <motion.a
            href="#signup"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold text-[1rem] no-underline transition-all duration-300"
            style={{ background: "var(--text)", color: "var(--ink)", boxShadow: "0 0 30px color-mix(in srgb, var(--text) 25%, transparent)" }}
            whileHover={{ y: -2, boxShadow: "0 15px 40px color-mix(in srgb, var(--text) 40%, transparent)", scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.98 }}
          >
            Join the waitlist
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>

          <motion.a
            href="#why"
            className="w-full sm:w-auto group inline-flex justify-center items-center gap-2 px-6 py-3.5 sm:py-4 rounded-full text-[1rem] font-medium no-underline transition-all duration-200 border"
            style={{ 
              color: "var(--text-soft)",
              borderColor: "var(--border)",
              background: "color-mix(in srgb, var(--surface) 40%, transparent)"
            }}
            whileHover={{ color: "var(--text)", background: "color-mix(in srgb, var(--surface) 80%, transparent)", borderColor: "var(--accent)" }}
          >
            See what we&apos;re building
          </motion.a>
        </motion.div>
      </div>

      {/* Illustration below text */}
      {/* <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ y: illustrationY, opacity: illustrationOpacity }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="relative z-10 w-full max-w-[1200px] mt-16 sm:mt-24"
      >
        <div className="relative w-full rounded-2xl sm:rounded-4xl overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          {/* Glass overlay effect *
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-(--ink) opacity-60 z-10" />
          
          <motion.img
            src="/hero-illustration.png"
            alt="Architecture Graph"
            className="w-full h-auto object-cover relative z-0"
            style={{ 
              filter: "drop-shadow(0 -20px 40px color-mix(in srgb, var(--accent) 30%, transparent))" 
            }}
          />
        </div>
      </motion.div> */}
    </section>
  );
}
