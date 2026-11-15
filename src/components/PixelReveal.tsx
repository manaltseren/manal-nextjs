"use client";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * PixelReveal — stepped wipe for a section entering the viewport (no scanline).
 * The content is uncovered top→bottom in hard, stepped bands (clip-path with a
 * stepped easing). Once finished the
 * clip is removed entirely, so pixel-panel shadows / hover effects are never
 * clipped afterwards. Skipped under prefers-reduced-motion.
 */
const STEPS = 12;
const stepped = (t: number) => Math.min(1, Math.ceil(t * STEPS) / STEPS);

export default function PixelReveal({
  children,
  duration = 0.7,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={inView ? { clipPath: "inset(0 0 0% 0)" } : undefined}
        transition={{ duration, ease: stepped }}
        onAnimationComplete={() => setDone(true)}
        style={done ? { clipPath: "none" } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
