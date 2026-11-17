// Shared helpers for the pixel-art UI.

// CSS custom properties aren't in React.CSSProperties.
export const pxVars = (vars: Record<string, string>) => vars as React.CSSProperties;

// Stepped easing — motion moves in whole frames, like a sprite.
export const stepped = (steps: number) => (t: number) => Math.min(1, Math.ceil(t * steps) / steps);

// Smooth ease-out for large moves (a stepped slide over a big panel reads as lag).
export const smooth = [0.22, 1, 0.36, 1] as const;

// Deterministic pseudo-random in [0,1) — pure (no Math.random), so SSR and
// client render the same values.
export const rand = (seed: number) => {
  const v = Math.sin(seed) * 43758.5453;
  return v - Math.floor(v);
};
