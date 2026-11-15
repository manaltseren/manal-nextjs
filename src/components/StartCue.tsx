"use client";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * "▼ PRESS START ▼" scroll cue that sits on the grid just below the horizon
 * (67% of the viewport — keep in sync with .synthwave-bg__horizon). Blinks in
 * hard on/off steps and fades away once the user starts scrolling. Clicking it
 * scrolls to `targetId`.
 */
export default function StartCue({ targetId, label }: { targetId: string; label: string }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 160], [1, 0], { clamp: true });

  return (
    <motion.button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
      className="absolute left-1/2 -translate-x-1/2 top-[calc(67svh+28px)] font-press-start text-[10px] tracking-widest text-[#4edbec] cursor-pointer px-3 py-2 whitespace-nowrap"
      style={{ opacity }}
      aria-label={label}
    >
      <motion.span
        className="inline-block"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.55, 0.56, 1] }}
      >
        ▼ PRESS START ▼
      </motion.span>
    </motion.button>
  );
}
