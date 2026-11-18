"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { smooth } from "@/lib/pixel";

/**
 * PixelReveal — smooth top→bottom wipe for a section entering the viewport.
 * The content is uncovered with an eased clip-path plus a short fade/rise.
 * Once finished the clip is removed entirely, so pixel-panel shadows / hover
 * effects are never clipped afterwards.
 *
 * It waits for the user to SCROLL: a section that merely peeks into the first
 * screen stays hidden on load (the title screen shows only the hero over the
 * scene) and wipes in once scrolling starts. Scrolling back to the very top
 * fades it away again (two-way). Reveal/hide use separate thresholds
 * (hysteresis) so small scrolls near the top don't make it flicker.
 * The hidden state is part of the SSR markup, so nothing flashes before
 * hydration. If the page loads already scrolled, it reveals immediately.
 * Skipped under prefers-reduced-motion.
 */
export const SHOW_AT = 24; // px of scroll before anything reveals
export const HIDE_AT = 4;  // back (almost) at the very top → hide again
export const HIDE_DURATION = 0.25; // fade-out time when hiding (s)
export const SHOW_DELAY = 0.15;    // wait before revealing, so the PRESS START prompt clears first (s)

// Overscan so pixel-panel borders/drop shadows aren't cut during the wipe.
const CLIP_HIDDEN = "inset(-16px -16px 100% -16px)";
const CLIP_SHOWN = "inset(-16px -16px -16px -16px)";

// Lets wrapped sections hold their own entrance animations until the wipe
// starts. Defaults to true, so components work unchanged outside a PixelReveal.
const RevealContext = createContext(true);
export const useRevealed = () => useContext(RevealContext);

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

  // Has the user scrolled yet? Always starts false: reading window.scrollY
  // during render would see the PREVIOUS page's scroll on a client-side
  // navigation (Next resets it to the top only after this renders), which
  // revealed the section on the title screen. The real position is checked
  // after mount instead (one frame later, once Next's scroll reset has run),
  // which still covers a page restored mid-scroll.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.scrollY > SHOW_AT) setScrolled(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    if (!scrolled && y > SHOW_AT) setScrolled(true);
    else if (scrolled && y <= HIDE_AT) setScrolled(false);
  });

  const show = inView && scrolled;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div
        variants={{
          // Hide: a quick fade + slight sink; the clip snaps closed only once
          // it's invisible, so there's no reverse-wipe while scrolling up.
          hidden: {
            opacity: 0,
            y: 16,
            clipPath: CLIP_HIDDEN,
            transition: {
              opacity: { duration: HIDE_DURATION, ease: "easeIn" },
              y: { duration: HIDE_DURATION, ease: "easeIn" },
              clipPath: { delay: HIDE_DURATION, duration: 0 },
            },
          },
          // Show: eased top→bottom wipe with a soft fade/rise alongside it.
          visible: {
            opacity: 1,
            y: 0,
            clipPath: CLIP_SHOWN,
            transition: {
              clipPath: { delay: SHOW_DELAY, duration, ease: smooth },
              opacity: { delay: SHOW_DELAY, duration: duration * 0.6, ease: "easeOut" },
              y: { delay: SHOW_DELAY, duration, ease: smooth },
            },
          },
        }}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        onAnimationStart={() => setDone(false)}
        onAnimationComplete={(def) => setDone(def === "visible")}
        // Drop the clip entirely once fully shown (so panel shadows/hover
        // effects are never cut off); restored as soon as it starts hiding.
        style={done && show ? { clipPath: "none" } : undefined}
      >
        <RevealContext.Provider value={show}>{children}</RevealContext.Provider>
      </motion.div>
    </div>
  );
}
