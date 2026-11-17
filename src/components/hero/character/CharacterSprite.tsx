"use client";
// The user's full-body pixel character (developer in glasses + dark tee,
// holding a laptop with a cyan </> logo, white sneakers, short hair). Source:
// the user's own art, cleaned into a TRUE pixel sprite (43×111):
//   • resampled onto its real pixel grid (median of each cell's centre),
//   • background glow removed (flood fill that only "climbs" the glow and
//     stops at the darker outline; pure-black specks seeded as background),
//   • reduced to a 24-colour palette (whites / the cyan logo kept exact),
//   • sneaker rows cleaned of glow remnants,
//   • split into transparent PNG layers (upper / lower / glint).
//
// Idle animation (sprite-style hold frames, no tweening):
//   • upper.png (head, torso, arms, laptop) dips 1 art-pixel and back while
//     lower.png (legs, sneakers) stays planted;
//   • glint.png brightens the laptop's </> on alternate frames.
// Both are off under reduced motion. Layers are scaled with
// `image-rendering: pixelated` so every art pixel stays a hard square.
// Plain <img> on purpose: true pixel-art layers need image-rendering: pixelated
// at exact sizes, which next/image optimisation would resample.
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Hold a frame, then jump — no tweening.
const hold = (t: number) => (t > 0 ? 1 : 0);

const layer = "absolute inset-0 w-full h-full select-none pointer-events-none";
const crisp: React.CSSProperties = { imageRendering: "pixelated" };

const dir = "/images/character/";
const W = 43;
const H = 111;
const onePx = `${100 / H}%`; // one art pixel, as % of the sprite height

// Coffee "use" animation: drink.png is an 8-frame horizontal strip of 47×111
// frames (the user's own GIF, resampled onto the same 111px pixel grid; its
// head/feet line up with the idle layers at the same left edge). Played once
// per bag click, 220ms per frame like the source GIF.
const DRINK_W = 47;
const DRINK_FRAMES = 8;
const DRINK_MS = 220;

export default function CharacterSprite({
  reduce,
  drinkKey = 0,
  className = "",
}: {
  reduce: boolean;
  /** Increment to play the drink animation once (restarts if already playing) */
  drinkKey?: number;
  className?: string;
}) {
  const [frame, setFrame] = useState(-1); // -1 = idle

  useEffect(() => {
    if (!drinkKey || reduce) return;
    let f = -1;
    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      f += 1;
      if (f >= DRINK_FRAMES) {
        clearInterval(id);
        setFrame(-1);
      } else setFrame(f);
    };
    const start = setTimeout(() => {
      tick();
      id = setInterval(tick, DRINK_MS);
    }, 0);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [drinkKey, reduce]);

  const drinking = frame >= 0;

  return (
    <div
      role="img"
      aria-label="Manalaa as a pixel character in glasses and a dark tee, holding a laptop"
      className={`relative ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <img src={`${dir}lower.png`} alt="" draggable={false} className={layer} style={{ ...crisp, visibility: drinking ? "hidden" : undefined }} />
      <motion.div
        className="absolute inset-0"
        style={{ visibility: drinking ? "hidden" : undefined }}
        animate={reduce ? undefined : { y: ["0%", onePx] }}
        transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse", ease: hold }}
      >
        <img src={`${dir}upper.png`} alt="" draggable={false} className={layer} style={crisp} />
        {!reduce && (
          <motion.img
            src={`${dir}glint.png`}
            alt=""
            draggable={false}
            className={layer}
            style={crisp}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: hold }}
          />
        )}
      </motion.div>
      {/* Drink strip: a window one frame wide (47/43 of the idle width, same
          left edge), the 8-frame strip shifted by whole frames. Preloaded
          (hidden) so the first click doesn't flash. */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${(DRINK_W / W) * 100}%`, visibility: drinking ? "visible" : "hidden" }}
      >
        <img
          src={`${dir}drink.png`}
          alt=""
          draggable={false}
          className="absolute top-0 left-0 h-full max-w-none select-none"
          style={{ ...crisp, width: `${DRINK_FRAMES * 100}%`, transform: `translateX(-${(Math.max(frame, 0) * 100) / DRINK_FRAMES}%)` }}
        />
      </div>
    </div>
  );
}
