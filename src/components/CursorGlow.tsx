"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const onMove = (e: MouseEvent) => {
      glow.style.opacity = "1";
      glow.animate(
        { left: `${e.clientX - 120}px`, top: `${e.clientY - 120}px` },
        { duration: 600, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    };

    const onLeave = () => {
      glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] w-60 h-60 rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(circle, rgba(88,124,255,0.06) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}