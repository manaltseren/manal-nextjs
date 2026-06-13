"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * SynthwaveBackground — global animated backdrop.
 *
 * A full synthwave scene (back to front):
 *   - gradient sky (CSS background on .synthwave-bg)
 *   - twinkling pixel starfield in the upper sky
 *   - a retro sun on the horizon that SINKS as the page scrolls (sunset),
 *     disappearing behind the horizon clip
 *   - a neon perspective grid floor scrolling toward the viewer
 *   - horizon fade + crisp horizon line
 *
 * The scene is fixed to the viewport; only the sun reacts to scroll. Hard edges
 * only — no soft glow (except the sun's own drop-shadow halo).
 */

// Deterministic pseudo-random in [0,1). Stable across SSR/CSR — values are
// rounded so tiny float differences between server and client can't cause a
// hydration mismatch. (Plain `i % n` arithmetic lays stars on diagonal lines,
// so we hash instead for a scattered, natural distribution.)
const rand = (seed: number) => {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
};
const pct = (seed: number) => +(rand(seed) * 100).toFixed(2);

const STARS = Array.from({ length: 64 }, (_, i) => ({
  left: pct(i + 1), // vw %
  top: pct(i * 1.37 + 41), // % of the star band (upper sky)
  size: 1 + Math.floor(rand(i * 2.11 + 7) * 3), // 1–3 px
  delay: +(rand(i * 3.71 + 13) * 4).toFixed(2),
  duration: +(2 + rand(i * 1.93 + 23) * 3).toFixed(2),
}));

export default function SynthwaveBackground() {
  // Sink the sun as the page scrolls: over the first ~600px of scroll the sun
  // drops by 320px, pushing it down behind the horizon clip (it "sets").
  const { scrollY } = useScroll();
  const sunY = useTransform(scrollY, [0, 600], [0, 320], { clamp: true });
  // Counter-motion: the horizon (grid floor + line + fade) drifts up slightly,
  // so as the sun sets the ground rises a touch — subtle parallax depth.
  const gridY = useTransform(scrollY, [0, 600], [0, -48], { clamp: true });
  // Sun's halo (follows the masked stripes): strong at rest, easing down a bit
  // but staying strong (floor 0.7) the whole way down — so the sun keeps a
  // clear glow as it sinks/hides. It's clipped with the sun once fully behind
  // the horizon, and stays tied to the sun so there's no detached glow.
  const sunGlow = useTransform(scrollY, (y) => {
    const t = Math.max(0.7, 1 - y / 350);
    return `drop-shadow(0 0 ${(10 * t).toFixed(2)}px rgba(255,95,166,${(0.8 * t).toFixed(3)})) drop-shadow(0 0 ${(28 * t).toFixed(2)}px rgba(255,140,95,${(0.5 * t).toFixed(3)}))`;
  });

  return (
    <div className="synthwave-bg" aria-hidden="true">
      <div className="synthwave-bg__stars">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="synthwave-bg__star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <motion.div className="synthwave-bg__glow" style={{ y: gridY }} />
      {/* The clip rises with the horizon (gridY) so its cut line stays glued to
          the horizon line; the sun inside also sinks (sunY) on top of that. */}
      <motion.div className="synthwave-bg__sunclip" style={{ y: gridY }}>
        <motion.div className="synthwave-bg__sun-wrap" style={{ x: "-50%", y: sunY, filter: sunGlow }}>
          <div className="synthwave-bg__sun" />
        </motion.div>
      </motion.div>
      <motion.div className="synthwave-bg__grid-wrap" style={{ y: gridY }}>
        <div className="synthwave-bg__grid" />
      </motion.div>
      <motion.div className="synthwave-bg__horizon" style={{ y: gridY }} />
    </div>
  );
}
