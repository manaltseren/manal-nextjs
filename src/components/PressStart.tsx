"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { HIDE_AT, HIDE_DURATION, SHOW_AT, SHOW_DELAY } from "@/components/PixelReveal";

/**
 * PressStart — game title-screen prompt. Blinks "PRESS START" while the page
 * is at the very top (when the PixelReveal sections are hidden) and disappears
 * as soon as scrolling reveals the content — the inverse of PixelReveal, using
 * the same thresholds. Click / tap, or Enter / Space, scrolls to `target`.
 */
export default function PressStart({ target, className }: { target: string; className?: string }) {
  // SSR renders it visible (title screen); a page restored mid-scroll fires a
  // scroll event on load, which the listener below picks up and hides it.
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    if (atTop && y > SHOW_AT) setAtTop(false);
    else if (!atTop && y <= HIDE_AT) setAtTop(true);
  });

  const start = () =>
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Enter / Space starts the "game" — only on the title screen, and never
  // while the user is typing or has focus on another control.
  useEffect(() => {
    if (!atTop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = document.activeElement;
      if (el && el !== document.body) return;
      e.preventDefault();
      start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atTop, target]);

  // Pinned to the viewport, centered in the floor band (horizon is at 67% of the
  // fixed background, so 82% sits mid-floor) — independent of page layout, so
  // it never lands on the sun. Fixed is fine: it only exists at scroll ≈ 0.
  return (
    <div
      className={`fixed inset-x-0 z-10 px-5 -translate-y-1/2 pointer-events-none ${className ?? ""}`}
      style={{ top: "82%" }}
    >
      <AnimatePresence>
        {atTop && (
          <motion.button
            type="button"
            onClick={start}
            aria-label="Press start — scroll to content"
            className="group pointer-events-auto mx-auto flex flex-col items-center gap-3 cursor-pointer select-none font-press-start"
            initial={{ opacity: 0, y: 8 }}
            // Appear only after the sections have fully faded out…
            animate={{ opacity: 1, y: 0, transition: { delay: HIDE_DURATION + 0.1, duration: 0.25, ease: "easeOut" } }}
            // …and leave before they start revealing.
            exit={{ opacity: 0, y: 8, transition: { duration: SHOW_DELAY * 0.8, ease: "easeIn" } }}
          >
            <span className="press-start-blink text-[11px] md:text-[13px] tracking-[0.2em] text-[#facc15] group-hover:text-white">
              <span className="text-[#4edbec] mr-2">▶︎</span>PRESS START
            </span>
            <span className="text-[7px] tracking-[0.25em] text-white/35 group-hover:text-white/60">
              ENTER / SCROLL ▼︎
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
