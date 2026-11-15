"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Skill, SkillType } from "@/types";
import TypingTitle from "@/components/TypingTitle";
import { useRevealed } from "@/components/PixelReveal";
import PixelSprite from "@/components/pixel/PixelSprite";

const skills: Skill[] = [
  {
    name: "Full-Stack Forge",
    level: 5,
    type: "Active",
    tagline: "Builds the whole feature, from database to button.",
    effect:
      "Forges complete features end to end: schema and migrations, Laravel or Node APIs, React front ends, and the deploy at the end. No hand-offs, no gaps between layers.",
    bonus: ["Front + back in one cast", "+40% ship speed", "+10 yrs Laravel mastery"],
    stack: ["Laravel", "React", "Node.js", "MySQL"],
    cooldown: "1 SPRINT",
    sprite: "forge",
  },
  {
    name: "System Architect",
    level: 4,
    type: "Active",
    tagline: "Draws the map before the party moves.",
    effect:
      "Designs systems that hold up in production: splits monoliths into modular services, plans data models that age well, and keeps the infrastructure boring and stable.",
    bonus: ["+Uptime aura", "-Tech debt per sprint", "Scales without rewrites"],
    stack: ["Modular services", "REST APIs", "PostgreSQL"],
    cooldown: "1 QUARTER",
    sprite: "blueprint",
  },
  {
    name: "Party Leader",
    level: 4,
    type: "Passive",
    tagline: "Allies nearby level up faster.",
    effect:
      "Always on. Leads the dev team as CTO and turns juniors into seniors through code review, pairing, and clear standards. The party ships more than the sum of its members.",
    bonus: ["+5 Leadership", "+4 Mentoring", "Team XP gain +25%"],
    stack: ["Code review", "Mentoring", "Planning"],
    cooldown: "ALWAYS ON",
    sprite: "banner",
  },
  {
    name: "Legacy Resurrection",
    level: 4,
    type: "Ultimate",
    tagline: "Raises dead codebases while the shop stays open.",
    effect:
      "Brings aging codebases back to life without taking the business offline: untangles old code, adds tests where it hurts, and migrates in small, safe steps. The older the code, the bigger the combo.",
    bonus: ["+3 Legacy Code Resistance", "Zero-downtime migrations", "+60% refactor power"],
    stack: ["Refactoring", "Migrations", "PHP"],
    cooldown: "1 PER LEGACY APP",
    sprite: "skull",
  },
];

const slotKeys = ["Q", "W", "E", "R"] as const;

interface TypeConfig {
  color: string;
  colorDim: string;
  colorFaint: string;
  hoverBg: string;
  label: string;
}

// Approved palette: Active = cyan, Passive = slate, Ultimate = violet
const typeConfig: Record<SkillType, TypeConfig> = {
  Active: {
    color: "#4edbec",
    colorDim: "rgba(78,219,236,0.4)",
    colorFaint: "rgba(78,219,236,0.08)",
    hoverBg: "#0b1a1d",
    label: "ACTIVE",
  },
  Passive: {
    color: "#94a3b8",
    colorDim: "rgba(148,163,184,0.35)",
    colorFaint: "rgba(148,163,184,0.07)",
    hoverBg: "#131519",
    label: "PASSIVE",
  },
  Ultimate: {
    color: "#c084fc",
    colorDim: "rgba(192,132,252,0.4)",
    colorFaint: "rgba(192,132,252,0.08)",
    hoverBg: "#150f1e",
    label: "★ ULTIMATE",
  },
};

// CSS custom properties aren't in React.CSSProperties — small helper to type them.
const pxVars = (vars: Record<string, string>) => vars as React.CSSProperties;

// Stepped easing — motion jumps in whole frames like sprite animation.
const stepEase = (steps: number) => (t: number) => Math.floor(t * steps) / steps;

// ── Level pip: chunky block with hard bevel, no glow ──
function LevelPip({
  filled,
  color,
  delay,
  inView,
  size = "sm",
}: {
  filled: boolean;
  color: string;
  delay: number;
  inView: boolean;
  size?: "sm" | "lg";
}) {
  const w = size === "lg" ? 20 : 14;
  const h = size === "lg" ? 14 : 10;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0 }}
      style={{
        width: w,
        height: h,
        backgroundColor: filled ? color : "#1a1838",
        boxShadow: filled
          ? "inset 0 3px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.35), 0 0 0 2px #07060e"
          : "inset 0 -2px 0 rgba(0,0,0,0.5), 0 0 0 2px #07060e",
      }}
    />
  );
}

function LevelBar({ skill, color, inView, baseDelay, size }: { skill: Skill; color: string; inView: boolean; baseDelay: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex gap-1.5 items-center pl-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LevelPip key={i} filled={i < skill.level} color={color} delay={baseDelay + i * 0.08} inView={inView} size={size} />
      ))}
      <span className="font-press-start text-[8px] ml-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
        LV.{skill.level}
      </span>
    </div>
  );
}

// ── Icon slot: dithered inventory cell holding the sprite ──
function SpriteSlot({ skill, color, size, active, idx }: { skill: Skill; color: string; size: number; active: boolean; idx: number }) {
  return (
    <div
      className="px-panel px-dither shrink-0 flex items-center justify-center"
      style={pxVars({
        "--px": "3px",
        "--px-bg": "#0a0920",
        "--px-border": active ? color : "rgba(255,255,255,0.12)",
        width: `${size + 16}px`,
        height: `${size + 16}px`,
        margin: "3px 9px 9px 3px",
      })}
    >
      <motion.div
        animate={active ? { y: [0, -3, 0] } : { y: 0 }}
        transition={active ? { duration: 0.6, repeat: Infinity, ease: stepEase(3) } : { duration: 0 }}
      >
        <PixelSprite name={skill.sprite} size={size} title={skill.name} />
      </motion.div>
      <span className="absolute bottom-1 right-1.5 font-press-start text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>
        {idx + 1}
      </span>
    </div>
  );
}

function Chip({ children, color, faint }: { children: React.ReactNode; color: string; faint: string }) {
  return (
    <span
      className="px-chip font-press-start text-[8px] px-2 py-1 leading-none"
      style={pxVars({ "--px-border": color, "--px-bg": faint, color })}
    >
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════
// SKILL MODAL
// ═══════════════════════════════════════════
function SkillModal({ skill, idx, onClose }: { skill: Skill; idx: number; onClose: () => void }) {
  const cfg = typeConfig[skill.type];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(5,4,11,0.85)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      />

      {/* Panel — window "opens" in stepped frames */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={skill.name}
        className="relative z-10 w-full max-w-md px-outer"
        initial={{ opacity: 0, scaleY: 0.2 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0.2 }}
        transition={{ duration: 0.18, ease: "linear" }}
      >
        <div className="px-panel overflow-hidden" style={pxVars({ "--px-border": cfg.color, "--px-bg": "#0f0d26" })}>
          {/* Title bar */}
          <div
            style={{ backgroundColor: cfg.colorFaint, borderBottom: `4px solid ${cfg.color}` }}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Chip color="rgba(255,255,255,0.3)" faint="#0a0920">{slotKeys[idx]}</Chip>
              <span className="font-press-start text-[12px] text-white">{skill.name}</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="px-chip font-press-start text-[9px] px-2 py-1.5 cursor-pointer text-white/50 hover:text-white hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-5 p-5">
            {/* Sprite + meta */}
            <div className="flex items-center gap-4">
              <SpriteSlot skill={skill} color={cfg.color} size={80} active idx={idx} />
              <div className="flex flex-col gap-3 min-w-0">
                <div>
                  <Chip color={cfg.color} faint={cfg.colorFaint}>{cfg.label}</Chip>
                </div>
                <LevelBar skill={skill} color={cfg.color} inView baseDelay={0.1} size="lg" />
                <span className="font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  CD: <span style={{ color: cfg.color }}>{skill.cooldown}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="font-press-start text-[8px] mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                ▸ DESCRIPTION
              </div>
              <p className="font-pixel text-[20px] leading-[1.15] text-gray-200">{skill.effect}</p>
            </div>

            {/* Bonuses */}
            <div>
              <div className="font-press-start text-[8px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                ▸ BONUS EFFECTS
              </div>
              <ul className="space-y-1.5">
                {skill.bonus.map((b, i) => (
                  <motion.li
                    key={b}
                    className="font-pixel text-[19px] leading-none flex items-center gap-2"
                    style={{ color: cfg.color }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0 }}
                  >
                    <span className="inline-block w-2 h-2 shrink-0" style={{ backgroundColor: cfg.color }} />
                    {b}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div>
              <div className="font-press-start text-[8px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                ▸ POWERED BY
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.stack.map((t) => (
                  <Chip key={t} color="rgba(255,255,255,0.25)" faint="rgba(255,255,255,0.03)">
                    <span className="text-white/70">{t}</span>
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{ backgroundColor: "#0a0920", borderTop: "2px solid rgba(255,255,255,0.06)" }}
            className="flex items-center justify-between px-4 py-2"
          >
            <span className="font-press-start text-[8px] text-white/25">ESC TO CLOSE</span>
            <span className="font-press-start text-[8px]" style={{ color: cfg.color }}>
              {slotKeys[idx]} · {cfg.label}
            </span>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════
// SKILL CARD (hotbar slot)
// ═══════════════════════════════════════════
function SkillCard({ skill, idx, inView, onClick }: { skill: Skill; idx: number; inView: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const cfg = typeConfig[skill.type];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.12, duration: 0.35 }}
      className="px-outer text-left cursor-pointer select-none w-full focus-visible:outline-none"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={onClick}
      aria-label={`${skill.name}, ${cfg.label} ability, level ${skill.level}. Open details`}
    >
      <div
        className="px-panel overflow-hidden h-full flex flex-col"
        style={pxVars({
          "--px-border": hovered ? cfg.color : cfg.colorDim,
          "--px-bg": hovered ? cfg.hoverBg : "#12102e",
        })}
      >
        {/* Header */}
        <div
          style={{ backgroundColor: "#0d0b22", borderBottom: `2px solid ${cfg.colorDim}` }}
          className="flex items-center gap-3 px-3 py-2.5"
        >
          <Chip color="rgba(255,255,255,0.25)" faint="#0a0920">
            <span className="text-white/50">{slotKeys[idx]}</span>
          </Chip>
          <span className="font-press-start text-[11px] text-white flex-1 leading-relaxed">{skill.name}</span>
        </div>

        {/* Body */}
        <div className="flex items-center gap-3 px-3 pt-4 pb-3 flex-1">
          <SpriteSlot skill={skill} color={cfg.color} size={64} active={hovered} idx={idx} />
          <div className="flex flex-col gap-2.5 min-w-0">
            <div>
              <Chip color={cfg.color} faint={cfg.colorFaint}>{cfg.label}</Chip>
            </div>
            <p className="font-pixel text-[19px] leading-[1.1] text-gray-300">{skill.tagline}</p>
            <LevelBar skill={skill} color={cfg.color} inView={inView} baseDelay={idx * 0.12 + 0.3} />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{ backgroundColor: "#0d0b22", borderTop: "2px solid rgba(255,255,255,0.05)" }}
          className="flex items-center justify-between px-3 py-1.5"
        >
          <span className="font-press-start text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            CD: {skill.cooldown}
          </span>
          <span className="font-press-start text-[7px]" style={{ color: hovered ? cfg.color : "rgba(255,255,255,0.3)" }}>
            {hovered ? "▶ DETAILS" : "DETAILS"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════
// MAIN SECTION
// ═══════════════════════════════════════════
export default function HeroSkills() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Also wait for the parent PixelReveal (if any) so entrance animations play
  // when the section is actually uncovered, not hidden behind the wipe.
  const revealed = useRevealed();
  const isInView = useInView(ref, { once: true, margin: "-80px" }) && revealed;

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSkill = activeIdx !== null ? skills[activeIdx] : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-5"
    >
      <div className="mb-10 text-center">
        <h2 className="font-press-start text-white text-lg tracking-wider">
          <TypingTitle text="[ ABILITIES ]" inView={isInView} />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {skills.map((skill, idx) => (
          <SkillCard key={skill.name} skill={skill} idx={idx} inView={isInView} onClick={() => setActiveIdx(idx)} />
        ))}
      </div>

      {mounted && (
        <AnimatePresence>
          {activeSkill !== null && activeIdx !== null && (
            <SkillModal key={activeIdx} skill={activeSkill} idx={activeIdx} onClose={() => setActiveIdx(null)} />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
