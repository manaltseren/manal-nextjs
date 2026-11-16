"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * SynthwaveBackground — global pixel-art backdrop.
 *
 * Back to front:
 *   - banded night sky (CSS on .synthwave-bg) + a lighter banded DUSK sky on top
 *   - pixel starfield (square + cross stars, stepped twinkle)
 *   - horizon glow band
 *   - pixel sun (SVG, crispEdges) with a dithered pixel halo, clipped at the
 *     horizon — it SINKS as the page scrolls (sunset)
 *   - pixel mountain silhouettes on the horizon
 *   - neon perspective grid floor + horizon line
 *
 * Day/night cycle (scroll-linked, `night` 0→1 over the sunset):
 *   sun up   → dusk sky visible, grid/horizon bright, stars faint
 *   sun down → dusk sky fades to the dark night sky, grid dims, stars bright
 *
 * The scroll-driven motion runs on ALL screen sizes. The layer has a fixed
 * 100lvh height (not `inset: 0`) so the mobile address bar showing/hiding
 * mid-scroll can't resize it and desync the %-positioned horizon/sun.
 */

// Deterministic pseudo-random in [0,1). Stable across SSR/CSR — values are
// rounded so tiny float differences can't cause a hydration mismatch.
const rand = (seed: number) => {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
};
const pct = (seed: number) => +(rand(seed) * 100).toFixed(2);

const STARS = Array.from({ length: 72 }, (_, i) => {
  const r = rand(i * 2.11 + 7);
  return {
    left: pct(i + 1),
    top: pct(i * 1.37 + 41),
    // Pixel sizes only: mostly 2px, some 3px, a few 2px "cross" stars
    size: r < 0.7 ? 2 : 3,
    cross: r > 0.92,
    delay: +(rand(i * 3.71 + 13) * 4).toFixed(2),
    duration: +(2 + rand(i * 1.93 + 23) * 3).toFixed(2),
  };
});

// ── Pixel sun ────────────────────────────────────────────────────────────────
// 32×32 grid, radius 16. Hard color bands top→bottom, scanline gaps (growing
// thicker toward the bottom) in the lower half. Rows are merged into one rect.
const SUN_N = 32;
const SUN_R = 16;
const SUN_BANDS: [number, string][] = [
  [6, "#fff3a8"],
  [11, "#ffd86b"],
  [15, "#ffab6b"],
  [19, "#ff7f9a"],
  [24, "#ff5fa6"],
  [32, "#ff2d8f"],
];
const SUN_GAPS = new Set([17, 20, 21, 23, 24, 26, 27, 28, 30, 31]);

const SUN_ROWS = Array.from({ length: SUN_N }, (_, y) => {
  if (SUN_GAPS.has(y)) return null;
  const dy = y + 0.5 - SUN_R;
  const half = Math.sqrt(Math.max(0, SUN_R * SUN_R - dy * dy));
  const x0 = Math.round(SUN_R - half);
  const x1 = Math.round(SUN_R + half);
  if (x1 <= x0) return null;
  const color = SUN_BANDS.find(([max]) => y < max)![1];
  return { y, x: x0, w: x1 - x0, color };
}).filter(Boolean) as { y: number; x: number; w: number; color: string }[];

// Halo: an inner solid ring + an outer DITHERED ring (checkerboard pixels) —
// the classic pixel-art way to fake a glow without blur.
const HALO: { x: number; y: number; w: number; outer: boolean }[] = [];
for (let y = -8; y < SUN_N + 8; y++) {
  let runStart: number | null = null; // current inner-ring run
  for (let x = -8; x <= SUN_N + 8; x++) {
    const d = Math.hypot(x + 0.5 - SUN_R, y + 0.5 - SUN_R);
    const inner = x < SUN_N + 8 && d > SUN_R && d <= SUN_R + 2.5;
    const outer = x < SUN_N + 8 && d > SUN_R + 2.5 && d <= SUN_R + 6 && (x + y) % 2 === 0;
    if (inner) {
      if (runStart === null) runStart = x;
      continue;
    }
    if (runStart !== null) {
      HALO.push({ x: runStart, y, w: x - runStart, outer: false });
      runStart = null;
    }
    if (outer) HALO.push({ x, y, w: 1, outer: true });
  }
}

function PixelSun({ haloOpacity }: { haloOpacity: number | MotionValue<number> }) {
  return (
    <svg
      className="synthwave-bg__sun"
      viewBox="-8 -8 48 48"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <motion.g style={{ opacity: haloOpacity }}>
        {HALO.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={p.w}
            height={1}
            fill={p.outer ? "rgba(255,95,166,0.35)" : "rgba(255,120,150,0.45)"}
          />
        ))}
      </motion.g>
      {SUN_ROWS.map((r) => (
        <rect key={r.y} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
      ))}
      {/* tiny specular highlight */}
      <rect x={9} y={4} width={3} height={1} fill="#fffbe0" />
      <rect x={7} y={5} width={2} height={1} fill="#fffbe0" />
    </svg>
  );
}

// ── Pixel mountains ──────────────────────────────────────────────────────────
// Heightmaps on a 320×24 grid (rendered at 100vw × 7.5vw, so pixels stay
// square). Low in the middle so the sun stays visible.
const MW = 320;
const MH = 24;
function heightmap(fn: (x: number, d: number) => number) {
  return Array.from({ length: MW }, (_, x) => {
    const d = Math.abs(x - MW / 2) / (MW / 2);
    return Math.max(1, Math.min(MH - 1, Math.round(fn(x, d))));
  });
}
// Triangle wave 0→1→0 — gives sharp, pointy peaks instead of round hills.
const tri = (t: number) => 1 - 2 * Math.abs(t - Math.floor(t) - 0.5);
const FAR = heightmap((x, d) => 2 + d ** 1.3 * 9 + 7 * d * tri(x / 41 + 0.2) + 3 * d * tri(x / 13));
const NEAR = heightmap((x, d) => 1 + d ** 2 * 5 + 6 * d ** 1.4 * tri(x / 27 + 0.55) + 1.5 * d * tri(x / 9));

function runs(h: number[]) {
  const out: { x: number; w: number; h: number }[] = [];
  let x = 0;
  while (x < h.length) {
    let w = 1;
    while (x + w < h.length && h[x + w] === h[x]) w++;
    out.push({ x, w, h: h[x] });
    x += w;
  }
  return out;
}
const FAR_RUNS = runs(FAR);
const NEAR_RUNS = runs(NEAR);

function PixelMountains() {
  return (
    <svg viewBox={`0 0 ${MW} ${MH}`} preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
      {FAR_RUNS.map((r) => (
        <g key={`f${r.x}`}>
          <rect x={r.x} y={MH - r.h} width={r.w} height={r.h} fill="#1d1340" />
          <rect x={r.x} y={MH - r.h} width={r.w} height={1} fill="#3b2a78" />
        </g>
      ))}
      {NEAR_RUNS.map((r) => (
        <g key={`n${r.x}`}>
          <rect x={r.x} y={MH - r.h} width={r.w} height={r.h} fill="#0e0a20" />
          <rect x={r.x} y={MH - r.h} width={r.w} height={1} fill="#5b3fb0" />
        </g>
      ))}
    </svg>
  );
}

export default function SynthwaveBackground() {
  const { scrollY } = useScroll();
  // Sun sinks 320px over the first 600px of scroll (sets behind the horizon).
  const sunY = useTransform(scrollY, [0, 600], [0, 320], { clamp: true });
  // Counter-motion: the horizon group drifts up slightly.
  const gridY = useTransform(scrollY, [0, 600], [0, -48], { clamp: true });
  // Night amount: 0 with the sun up → 1 once the sun is fully below the
  // horizon (~360px of scroll, when its top edge passes the clip line).
  const night = useTransform(scrollY, [0, 360], [0, 1], { clamp: true });

  const duskOpacity = useTransform(night, [0, 1], [1, 0]);
  const starsOpacity = useTransform(night, [0, 1], [0.18, 1]);
  const gridOpacity = useTransform(night, [0, 1], [1, 0.5]);
  const horizonOpacity = useTransform(night, [0, 1], [1, 0.45]);
  const glowOpacity = useTransform(night, [0, 1], [1, 0.25]);
  // Sun light (halo) fades with the sun: full when up, gone once it has set,
  // and back again when scrolling up.
  const haloOpacity = useTransform(night, [0, 1], [1, 0]);

  return (
    <div className="synthwave-bg" aria-hidden="true">
      <motion.div className="synthwave-bg__dusk" style={{ opacity: duskOpacity }} />
      <motion.div className="synthwave-bg__stars" style={{ opacity: starsOpacity }}>
        {STARS.map((s, i) => (
          <span
            key={i}
            className={`synthwave-bg__star${s.cross ? " synthwave-bg__star--cross" : ""}`}
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
      </motion.div>
      <motion.div className="synthwave-bg__glow" style={{ y: gridY, opacity: glowOpacity }} />
      {/* The clip rises with the horizon (gridY) so its cut line stays glued to
          the horizon line; the sun inside also sinks (sunY) on top of that. */}
      <motion.div className="synthwave-bg__sunclip" style={{ y: gridY }}>
        <motion.div className="synthwave-bg__sun-wrap" style={{ x: "-50%", y: sunY }}>
          <PixelSun haloOpacity={haloOpacity} />
        </motion.div>
      </motion.div>
      <motion.div className="synthwave-bg__mountains" style={{ y: gridY }}>
        <PixelMountains />
      </motion.div>
      <motion.div className="synthwave-bg__grid-wrap" style={{ y: gridY }}>
        <motion.div className="synthwave-bg__grid" style={{ opacity: gridOpacity }} />
      </motion.div>
      <motion.div className="synthwave-bg__horizon" style={{ y: gridY, opacity: horizonOpacity }} />
    </div>
  );
}
