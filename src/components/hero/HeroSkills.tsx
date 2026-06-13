"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Skill, SkillType } from "@/types";
import TypingTitle from "@/components/TypingTitle";

const skills: Skill[] = [
  {
    name: "Code Conjurer",
    level: 4,
    type: "Active",
    effect: "Generates clean, scalable, maintainable code on demand.",
    bonus: ["+40% readability", "+30% maintainability"],
    icon: "/images/xp/skills/skill2-style2.png",
  },
  {
    name: "API Weaver",
    level: 4,
    type: "Active",
    effect: "Weaves REST APIs into any project with ease.",
    bonus: ["+20% fetch speed", "-10% integration errors"],
    icon: "/images/xp/skills/skill3-style2.png",
  },
  {
    name: "Bug Slayer",
    level: 3,
    type: "Passive",
    effect: "Detects and exterminates bugs in record time.",
    bonus: ["+50% debug speed", "+15% stress resistance"],
    icon: "/images/xp/skills/skill1-style2.png",
  },
  {
    name: "Legacy Necromancy",
    level: 2,
    type: "Ultimate",
    effect: "Reboots dead codebases. The older the code, the bigger the combo.",
    bonus: ["+3 Legacy Code Resistance", "+60% refactor power"],
    icon: "/images/xp/skills/skill4-style2.png",
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

function PixelBar({
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
  const w = size === "lg" ? 24 : 18;
  const h = size === "lg" ? 16 : 12;
  return (
    <motion.div
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ delay, duration: 0.15, ease: "easeOut" }}
      style={{
        width: w,
        height: h,
        backgroundColor: filled ? color : "#1a1838",
        border: "1px solid rgba(0,0,0,0.65)",
        boxShadow: filled
          ? `inset 0 3px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.45), 0 0 6px ${color}80`
          : "inset 0 2px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.5)",
      }}
    />
  );
}

// ── Scanline overlay (reused on both card and modal) ──
function Scanlines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
      }}
    />
  );
}

// ── Pixel border wrapper (dark outer frame + colored inner border) ──
function PixelFrame({
  color,
  children,
  className = "",
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div style={{ padding: "3px", backgroundColor: "#07060e" }} className={className}>
      <div
        style={{ border: `2px solid ${color}`, backgroundColor: "#0f0d26" }}
        className="relative overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SKILL MODAL
// ═══════════════════════════════════════════
function SkillModal({
  skill,
  idx,
  onClose,
}: {
  skill: Skill;
  idx: number;
  onClose: () => void;
}) {
  const cfg = typeConfig[skill.type];

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      />

      {/* Modal panel — Terraria inventory-open animation */}
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, scaleY: 0.4, transformOrigin: "top" }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0.2 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0.1, 1] }}
      >
        <PixelFrame color={cfg.color}>
          <Scanlines />

          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${cfg.colorDim} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              opacity: 0.3,
            }}
          />

          {/* Ultimate top-edge flicker */}
          {skill.type === "Ultimate" && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-20"
              style={{ height: 2, backgroundColor: cfg.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}

          {/* Header */}
          <div
            style={{ backgroundColor: "#0d0b22", borderBottom: `2px solid ${cfg.color}` }}
            className="flex items-center justify-between px-4 py-3 relative z-10"
          >
            <div className="flex items-center gap-3">
              <span
                className="font-press-start text-[10px] px-2 py-1"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "#0a0920",
                }}
              >
                {slotKeys[idx]}
              </span>
              <span className="font-press-start text-[13px] text-white">
                {skill.name}
              </span>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="font-press-start text-[10px] px-2 py-1 cursor-pointer"
              style={{
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.15)",
                backgroundColor: "#0a0920",
                transition: "border-color 0.06s, color 0.06s",
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.color = "#fff";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.5)";
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 p-5 relative z-10">

            {/* Icon + type + level */}
            <div className="flex items-center gap-4">
              {/* Large icon slot */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#0a0920",
                  border: `2px solid ${cfg.color}`,
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={skill.icon}
                  alt={skill.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <span
                  className="absolute bottom-1 right-1 font-press-start text-[8px]"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {idx + 1}
                </span>
              </div>

              {/* Right: type badge + level + bars */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="font-press-start text-[9px] px-2 py-1"
                    style={{
                      color: cfg.color,
                      backgroundColor: cfg.colorFaint,
                      border: `1px solid ${cfg.colorDim}`,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    className="font-press-start text-[11px]"
                    style={{ color: cfg.color }}
                  >
                    LV.{skill.level}
                  </span>
                </div>

                {/* Pixel bars */}
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <PixelBar
                      key={i}
                      filled={i < skill.level}
                      color={cfg.color}
                      delay={i * 0.05}
                      inView={true}
                      size="lg"
                    />
                  ))}
                  <span
                    className="font-press-start text-[9px] ml-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {skill.level}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Dashed divider */}
            <div style={{ borderTop: "1px dashed rgba(255,255,255,0.12)" }} />

            {/* Description */}
            <div>
              <div
                className="font-press-start text-[9px] mb-2"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                DESCRIPTION
              </div>
              <p className="text-gray-200 text-sm leading-relaxed font-mono">
                {skill.effect}
              </p>
            </div>

            {/* Dashed divider */}
            <div style={{ borderTop: "1px dashed rgba(255,255,255,0.12)" }} />

            {/* Bonus effects */}
            <div>
              <div
                className="font-press-start text-[9px] mb-3"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                BONUS EFFECTS
              </div>
              <div className="space-y-2">
                {skill.bonus.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: cfg.colorFaint,
                      border: `1px solid ${cfg.colorDim}`,
                    }}
                    className="flex items-center px-3 py-2"
                  >
                    <span className="font-press-start text-[10px]" style={{ color: cfg.color }}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{ backgroundColor: "#0d0b22", borderTop: `1px solid ${cfg.colorDim}` }}
            className="flex items-center justify-between px-4 py-2 relative z-10"
          >
            <span className="font-press-start text-[9px] text-white/20">
              ESC TO CLOSE
            </span>
            <span className="font-press-start text-[9px]" style={{ color: cfg.color }}>
              ◀︎ ▶︎
            </span>
          </div>
        </PixelFrame>
      </motion.div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════
// COMPACT SKILL CARD (hotbar slot)
// ═══════════════════════════════════════════
function SkillCard({
  skill,
  idx,
  inView,
  onClick,
}: {
  skill: Skill;
  idx: number;
  inView: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const cfg = typeConfig[skill.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.12, duration: 0.4 }}
      className="cursor-pointer select-none"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Outer dark pixel frame */}
      <div
        style={{
          padding: "3px",
          backgroundColor: "#07060e",
        }}
      >
        {/* Inner colored border */}
        <div
          style={{
            border: `2px solid ${hovered ? cfg.color : cfg.colorDim}`,
            backgroundColor: hovered ? cfg.hoverBg : "#12102e",
            transition: "border-color 0.06s, background-color 0.06s",
          }}
          className="relative overflow-hidden"
        >
          <Scanlines />

          {/* Ultimate flicker */}
          {skill.type === "Ultimate" && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-20"
              style={{ height: 2, backgroundColor: cfg.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}

          {/* Header */}
          <div
            style={{ backgroundColor: "#0d0b22", borderBottom: `1px solid ${cfg.colorDim}` }}
            className="flex items-center justify-between px-3 py-2.5 relative z-10"
          >
            <span
              className="font-press-start text-[10px] px-1.5 py-0.5"
              style={{
                color: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.12)",
                backgroundColor: "#0a0920",
              }}
            >
              {slotKeys[idx]}
            </span>
            <span className="font-press-start text-[13px] text-white">
              {skill.name}
            </span>
            <span
              className="font-press-start text-[10px]"
              style={{ color: cfg.color }}
            >
              LV.{skill.level}
            </span>
          </div>

          {/* Body: icon slot + type + bars */}
          <div className="flex items-center gap-3 px-3 py-3 relative z-10">
            {/* Inventory slot */}
            <div
              style={{
                width: 76,
                height: 76,
                backgroundColor: "#0a0920",
                border: hovered
                  ? `2px solid ${cfg.color}`
                  : "2px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.06s",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={skill.icon}
                alt={skill.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <span
                className="absolute bottom-0.5 right-1 font-press-start text-[8px]"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {idx + 1}
              </span>
            </div>

            {/* Type badge + level bars */}
            <div className="flex flex-col gap-2.5">
              <span
                className="font-press-start text-[9px] px-2 py-1 self-start"
                style={{
                  color: cfg.color,
                  backgroundColor: cfg.colorFaint,
                  border: `1px solid ${cfg.colorDim}`,
                }}
              >
                {cfg.label}
              </span>

              <div className="flex gap-1 items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <PixelBar
                    key={i}
                    filled={i < skill.level}
                    color={cfg.color}
                    delay={idx * 0.12 + i * 0.06 + 0.3}
                    inView={inView}
                  />
                ))}
                <span
                  className="font-press-start text-[9px] ml-1"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {skill.level}/5
                </span>
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <div
            style={{ backgroundColor: "#0d0b22", borderTop: `1px solid ${cfg.colorDim}` }}
            className="flex items-center justify-between px-3 py-1.5 relative z-10"
          >
            <span
              className="font-press-start text-[9px]"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              CLICK FOR DETAILS
            </span>
            <motion.span
              className="font-press-start text-[9px]"
              style={{ color: cfg.color }}
              animate={{ opacity: hovered ? [0.5, 1, 0.5] : 0.35 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ▶︎
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN SECTION
// ═══════════════════════════════════════════
export default function HeroSkills() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => { setMounted(true); }, []);

  const activeSkill = activeIdx !== null ? skills[activeIdx] : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-5"
    >
      {/* Section heading */}
      <div className="mb-10 text-center">
        <h2 className="font-press-start text-white text-lg tracking-wider">
          <TypingTitle text="[ ABILITIES ]" inView={isInView} />
        </h2>
      </div>

      {/* 2×2 compact card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {skills.map((skill, idx) => (
          <SkillCard
            key={idx}
            skill={skill}
            idx={idx}
            inView={isInView}
            onClick={() => setActiveIdx(idx)}
          />
        ))}
      </div>

      {/* Modal — rendered via portal */}
      {mounted && (
        <AnimatePresence>
          {activeSkill !== null && activeIdx !== null && (
            <SkillModal
              key={activeIdx}
              skill={activeSkill}
              idx={activeIdx}
              onClose={() => setActiveIdx(null)}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
