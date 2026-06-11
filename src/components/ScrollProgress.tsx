"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 inset-x-0 z-[9998] h-[2px] origin-left bg-gradient-to-r from-[#587cff] to-[#a78bfa]"
      style={{ scaleX }}
    />
  );
}