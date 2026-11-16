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
import { motion } from "framer-motion";

// Hold a frame, then jump — no tweening.
const hold = (t: number) => (t > 0 ? 1 : 0);

const layer = "absolute inset-0 w-full h-full select-none pointer-events-none";
const crisp: React.CSSProperties = { imageRendering: "pixelated" };

const dir = "/images/character/";
const W = 43;
const H = 111;
const onePx = `${100 / H}%`; // one art pixel, as % of the sprite height

export default function CharacterSprite({ reduce, className = "" }: { reduce: boolean; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Manalaa as a pixel character in glasses and a dark tee, holding a laptop"
      className={`relative ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <img src={`${dir}lower.png`} alt="" draggable={false} className={layer} style={crisp} />
      <motion.div
        className="absolute inset-0"
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
    </div>
  );
}
