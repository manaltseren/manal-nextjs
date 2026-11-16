"use client";
// Top-of-home profile: the "player card" STRUCTURE, without the card on desktop.
//
//   ┌──────────────────────────────────────────────────────────┐
//   │ [avatar]  MANALAA Bold  ● ONLINE                [LVL 13] │
//   │           bio …                                          │
//   │           EXPERIENCE ███████████░░░░░░    8,750 / 10,000 │
//   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
//   │ ▶ CURRENT QUEST  SEEKING NEW ADVENTURE   [▶ CONTACT ME][IG]│
//   └──────────────────────────────────────────────────────────┘
//
// Desktop: no frame/fill — everything sits on the scene, aligned to the
// container edges; the quest + buttons row sits under the main row. Mobile: a
// solid backing card (stacked, centred) so text stays readable over the sun.
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SocialIcon from "@/components/pixel/SocialIcon";
import { AVATAR_LOOK, avatarPortraits } from "@/components/hero/character/look";

const nameChars = Array.from("MANALAA Bold");
const AVATAR = 168;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const charVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const pxVars = (vars: Record<string, string>) => vars as React.CSSProperties;

// Floating pixel sparkle around the avatar
function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1"
      style={{ left: x, top: y, backgroundColor: "#7a5dff" }}
      animate={{ opacity: [0, 1, 0], y: [0, -12, -20], scale: [0.5, 1, 0.3] }}
      transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

function calcYearXP() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1).getTime();
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime();
  return Math.round(((now.getTime() - start) / (end - start)) * 10000);
}

export default function HeroAvatar() {
  const level = new Date().getFullYear() - 2013;
  const targetXP = calcYearXP();
  const xpPercent = Math.round(targetXP / 100);
  const [xpCount, setXpCount] = useState(0);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setXpCount((prev) => {
          const next = prev + Math.ceil((targetXP - prev) / 20);
          if (next >= targetXP) { clearInterval(interval); return targetXP; }
          return next;
        });
      }, 16);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(delay);
  }, [targetXP]);

  return (
    <div className="max-w-5xl mx-auto px-5">
      <motion.div
        className="px-outer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* No card on desktop — the elements sit straight on the synthwave
            scene, aligned to the container edges. Mobile keeps a solid backing
            panel (the static sun sits right behind the text there). */}
        <div className="relative isolate">
          <div
            aria-hidden
            className="px-panel md:hidden absolute inset-0 -z-10"
            style={pxVars({ "--px": "2px", "--px-border": "rgba(122,93,255,0.55)", "--px-bg": "rgba(15,13,38,0.9)" })}
          />
          {/* ── Main: avatar | name, bio, XP ── */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-8 p-5 md:p-0">
            {/* Avatar */}
            <motion.div
              className="relative shrink-0"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div
                className="px-panel px-dither"
                style={pxVars({
                  width: `${AVATAR}px`,
                  height: `${AVATAR}px`,
                  overflow: "hidden",
                  "--px-border": "#7a5dff",
                  "--px-bg": "#16123a",
                })}
              >
                {/* Pixel-art bust portrait (the user's own art, transparent bg,
                    384px WebP from a 1254px source — hi-res, so NO pixelated
                    rendering). Slight zoom from the bottom so the shoulders
                    meet the frame's bottom edge. */}
                <img
                  src={avatarPortraits[AVATAR_LOOK]}
                  alt="Manalaa — pixel-art portrait with glasses"
                  width={AVATAR}
                  height={AVATAR}
                  style={{
                    width: AVATAR,
                    height: AVATAR,
                    objectFit: "cover",
                    display: "block",
                    position: "relative",
                    transform: "scale(1.06)",
                    transformOrigin: "center bottom",
                  }}
                />
              </div>
              <Sparkle x={-8} y={20} delay={0} />
              <Sparkle x={AVATAR + 2} y={10} delay={0.7} />
              <Sparkle x={AVATAR - 5} y={100} delay={1.4} />
              <Sparkle x={-6} y={90} delay={0.4} />
            </motion.div>

            {/* Name, bio, XP — XP pinned to the bottom so it lines up with the
                avatar's bottom edge */}
            <div className="flex flex-col gap-4 flex-1 min-w-0 w-full text-center md:text-left">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center md:justify-start">
                <motion.h1
                  className="font-press-start text-white text-xl leading-relaxed"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {nameChars.map((char, idx) => (
                    <motion.span key={idx} variants={charVariants}>
                      {char === " " ? " " : char}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Blinking online dot */}
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.35 }}
                  className="px-chip font-press-start text-[9px] leading-none px-2 py-1.5 gap-2"
                  style={pxVars({
                    color: "#4ade80",
                    "--px-border": "rgba(74,222,128,0.5)",
                    "--px-bg": "rgba(74,222,128,0.06)",
                  })}
                >
                  <motion.span
                    className="flex shrink-0"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 0.51, 1] }}
                  >
                    <span className="block w-1.5 h-1.5 bg-current" />
                  </motion.span>
                  <span className="block leading-none">ONLINE</span>
                </motion.span>

                {/* Level — right end of the name row on desktop */}
                <span className="px-lvl font-press-start text-[9px] px-2.5 py-1.5 md:ml-auto">LVL {level}</span>
              </div>

              <motion.p
                className="font-pixel text-[21px] leading-[1.15] text-white/75 max-w-xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.35 }}
              >
                Developer with 10+ years of experience in backend architecture and e-commerce platforms.
              </motion.p>

              {/* XP bar — full width of the column, at the bottom */}
              <motion.div
                className="w-full md:mt-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-press-start text-[8px] text-white/35">EXPERIENCE</span>
                  <span className="font-press-start text-[9px] text-[#facc15]">{xpCount.toLocaleString()} / 10,000</span>
                </div>
                {/* Slim bar: 2px notched pixel border (px-chip), no drop shadow */}
                <div
                  className="px-chip relative"
                  style={pxVars({
                    display: "block",
                    height: "10px",
                    overflow: "hidden",
                    "--px-bg": "#0a0920",
                    "--px-border": "rgba(255,255,255,0.18)",
                  })}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      backgroundColor: "#facc15",
                      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1.6, ease: (t: number) => Math.floor(t * 20) / 20, delay: 0.5 }}
                  />
                  {/* Segment gaps — the bar fills block by block */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: "linear-gradient(90deg, transparent calc(100% - 2px), #0a0920 calc(100% - 2px))",
                      backgroundSize: "5% 100%",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Status bar: current quest | actions ── */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-4 md:justify-between px-5 py-4 md:p-0 md:mt-8 bg-[#0a0920] md:bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
              <span className="font-press-start text-[8px] leading-none text-white/40">▶ CURRENT QUEST</span>
              <span className="font-press-start text-[9px] leading-relaxed text-[#4edbec]">SEEKING NEW ADVENTURE</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/vcard.vcf"
                download="Manalaa.vcf"
                className="px-btn font-press-start text-[9px] px-5 py-3.5 inline-flex shrink-0 whitespace-nowrap items-center justify-center gap-2 select-none"
                style={pxVars({
                  "--px-bg": btnHover ? "#c084fc" : "#12102e",
                  color: btnHover ? "#0f0d1b" : "#c084fc",
                  letterSpacing: "0.08em",
                })}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  ▶︎
                </motion.span>
                CONTACT ME
              </a>

              {/* Instagram — raised violet pixel button; hover fills it.
                  Colours in classes so the hover can override them. */}
              <a
                href="https://www.instagram.com/manal.dev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="px-btn inline-flex items-center justify-center shrink-0 w-11 h-11 text-[#c084fc] [--px-border:#c084fc] [--px-shadow:rgba(192,132,252,0.3)] hover:[--px-bg:#c084fc] hover:text-[#0f0d1b]"
              >
                <SocialIcon name="instagram" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
