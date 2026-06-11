"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#587cff", "#7b98ff", "#a78bfa", "#34d399", "#8b5cf6", "#f59e0b"];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const arr: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        id: i,
        x: randomBetween(-120, 120),
        y: randomBetween(-180, -20),
        rotation: randomBetween(0, 360),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: randomBetween(4, 10),
      });
    }
    setParticles(arr);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{
            duration: randomBetween(0.6, 1.4),
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}