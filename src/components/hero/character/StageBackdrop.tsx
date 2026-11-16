// Pixel "character select" stage behind the full-body sprite. A 60×90 grid
// (2:3, same as the frame) drawn with hard-edged rects only — no gradients,
// no blur: banded night sky, a dithered sky→floor
// transition and a stepped pedestal the character stands on. (A spotlight
// beam and pixel stars were tried and removed at the user's request.)
// Static (decorative), so it needs no reduced-motion fallback.

const W = 60;
const H = 90;
const CX = W / 2;

// Sky bands, top → horizon (hard colour stops)
const sky: [number, number, string][] = [
  [0, 26, "#0a0919"],
  [26, 46, "#0d0b22"],
  [46, 62, "#110e2c"],
  [62, 76, "#161236"],
];

// Pedestal rows (y, width, colour) — light top face, darker sides
const pedestal: [number, number, string][] = [
  [79, 20, "#4a4190"],
  [80, 26, "#3a3275"],
  [81, 28, "#2a2458"],
  [82, 28, "#2a2458"],
  [83, 26, "#1f1a44"],
  [84, 22, "#16122f"],
];

export default function StageBackdrop() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {sky.map(([y0, y1, c]) => (
        <rect key={y0} x={0} y={y0} width={W} height={y1 - y0} fill={c} />
      ))}

      {/* Floor + 2-row checkerboard dither into it */}
      <rect x={0} y={76} width={W} height={H - 76} fill="#0b0a1c" />
      {Array.from({ length: W / 2 }, (_, i) => (
        <g key={i}>
          <rect x={i * 2} y={76} width={1} height={1} fill="#161236" />
          <rect x={i * 2 + 1} y={77} width={1} height={1} fill="#161236" />
        </g>
      ))}

      {pedestal.map(([y, w, c]) => (
        <rect key={y} x={CX - w / 2} y={y} width={w} height={1} fill={c} />
      ))}
    </svg>
  );
}
