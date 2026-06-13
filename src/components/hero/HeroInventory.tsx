"use client";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import TypingTitle from "@/components/TypingTitle";
import type { Tool, Rarity } from "@/types";

const tools: Tool[] = [
  // Legendary
  { name: "Laravel",    icon: "/images/xp/items/laravel.png",    rarity: "Legendary", description: "Primary weapon. Elegant PHP framework mastered over 10+ years." },
  // Epic
  { name: "React",      icon: "/images/xp/items/react.png",      rarity: "Epic",      description: "Component sorcery. Builds reactive UIs with hooks and state magic." },
  { name: "Node.js",    icon: "/images/xp/items/nodejs.png",     rarity: "Epic",      description: "Server-side runtime. Runs JavaScript beyond the browser realm." },
  // Rare
  { name: "MySQL",      icon: "/images/xp/items/mysql.png",      rarity: "Rare",      description: "Database grimoire. Master of complex queries and data schemas." },
  { name: "PostgreSQL", icon: "/images/xp/items/postgre.png",    rarity: "Rare",      description: "Advanced database relic. Relational power with JSON sorcery." },
  { name: "Figma",      icon: "/images/xp/items/figma.png",      rarity: "Rare",      description: "Design artifact. +40% creativity, UI prototyping at light speed." },
  // Uncommon
  { name: "VS Code",    icon: "/images/xp/items/vscode.png",     rarity: "Uncommon",  description: "Legendary forge. +50% coding speed, +30% developer happiness." },
  // Common
  { name: "Git",        icon: "/images/xp/items/github.png",     rarity: "Common",    description: "Time manipulation scroll. Version control and GitFlow strategies." },
  { name: "WordPress",  icon: "/images/xp/items/wordpress.png",  rarity: "Common",    description: "CMS relic. Deep customization and theme enchanting skills." },
  { name: "Postman",    icon: "/images/xp/items/postman.png",    rarity: "Common",    description: "API testing tome. Debugs requests, validates endpoints." },
];

// Terraria rarity color palette
const rarityConfig: Record<Rarity, { color: string; colorDim: string; colorFaint: string; label: string; symbol: string }> = {
  Legendary: { color: "#facc15", colorDim: "rgba(250,204,21,0.45)", colorFaint: "rgba(250,204,21,0.08)", label: "LEGENDARY", symbol: "★" },
  Epic:      { color: "#c084fc", colorDim: "rgba(192,132,252,0.45)", colorFaint: "rgba(192,132,252,0.08)", label: "EPIC",      symbol: "◆" },
  Rare:      { color: "#60a5fa", colorDim: "rgba(96,165,250,0.45)",  colorFaint: "rgba(96,165,250,0.08)",  label: "RARE",      symbol: "▲︎" },
  Uncommon:  { color: "#4ade80", colorDim: "rgba(74,222,128,0.4)",   colorFaint: "rgba(74,222,128,0.07)",  label: "UNCOMMON",  symbol: "●" },
  Common:    { color: "#94a3b8", colorDim: "rgba(148,163,184,0.35)", colorFaint: "rgba(148,163,184,0.07)", label: "COMMON",    symbol: "○" },
};

function Scanlines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)" }}
    />
  );
}

// Deterministic pseudo-random in [0,1) — pure (no Math.random), so the sparkle
// positions stay stable across renders instead of jumping each frame.
const sparkleRand = (seed: number) => {
  const v = Math.sin(seed) * 43758.5453;
  return v - Math.floor(v);
};

// Pixel sparkle for Epic/Legendary tooltips. Position/speed derived from `seed`.
function Sparkle({ color, seed, delay }: { color: string; seed: number; delay: number }) {
  const x = 5 + sparkleRand(seed * 2.1 + 1) * 90;
  const y = 5 + sparkleRand(seed * 1.7 + 7) * 90;
  const duration = 1.8 + sparkleRand(seed * 3.3 + 2);
  return (
    <motion.div
      className="absolute w-1 h-1 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color, zIndex: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, -8, -14] }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

// Tooltip rendered via portal
function ItemTooltip({ tool, x, y }: { tool: Tool; x: number; y: number }) {
  const cfg = rarityConfig[tool.rarity];

  // Clamp to viewport
  const tx = Math.min(x + 16, window.innerWidth - 270);
  const ty = Math.min(y + 16, window.innerHeight - 220);

  return createPortal(
    <motion.div
      className="fixed z-9999 pointer-events-none"
      style={{ left: tx, top: ty, width: 250 }}
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 4 }}
      transition={{ duration: 0.12 }}
    >
      {/* Outer pixel frame */}
      <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
        <div style={{ border: `2px solid ${cfg.color}`, backgroundColor: "#0f0d26" }} className="relative overflow-hidden">
          <Scanlines />

          {/* Sparkles for Epic/Legendary */}
          {(tool.rarity === "Legendary" || tool.rarity === "Epic") && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <Sparkle key={i} color={cfg.color} seed={i} delay={i * 0.22} />
              ))}
            </>
          )}

          {/* Legendary pulsing top edge */}
          {tool.rarity === "Legendary" && (
            <motion.div className="absolute top-0 left-0 right-0 z-20" style={{ height: 2, backgroundColor: cfg.color }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          )}

          {/* Header */}
          <div style={{ backgroundColor: "#0d0b22", borderBottom: `1px solid ${cfg.colorDim}` }}
            className="flex items-center justify-between px-3 py-2 relative z-10"
          >
            <span className="font-press-start text-[9px] inline-flex items-center gap-1.5" style={{ color: cfg.color }}>
              <span style={{ lineHeight: 1 }}>{cfg.symbol}</span>{cfg.label}
            </span>
            <span className="font-press-start text-[9px] text-white">{tool.name}</span>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center gap-3 p-3 relative z-10">
            {/* Icon slot */}
            <div style={{
              width: 64, height: 64,
              backgroundColor: "#0a0920",
              border: `2px solid ${cfg.color}`,
              boxShadow: `0 0 16px ${cfg.colorDim}, inset 0 0 10px rgba(0,0,0,0.7)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={tool.icon} alt={tool.name}
                style={{ width: 40, height: 40, objectFit: "contain",
                  filter: `drop-shadow(0 0 6px ${cfg.color})` }} />
            </div>

            {/* Dashed separator */}
            <div className="w-full" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }} />

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed font-mono text-center">{tool.description}</p>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: "#0d0b22", borderTop: `1px solid ${cfg.colorDim}` }}
            className="px-3 py-1.5 flex justify-center relative z-10"
          >
            <span className="font-press-start text-[9px] inline-flex items-center gap-1.5" style={{ color: cfg.color }}>
              <span style={{ lineHeight: 1 }}>{cfg.symbol}</span>{cfg.label} ITEM
            </span>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}

// Individual inventory slot
function InventorySlot({ tool, idx, inView }: { tool: Tool; idx: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const cfg = rarityConfig[tool.rarity];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: idx * 0.06, duration: 0.35 }}
        className="cursor-pointer select-none"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => { setHovered(false); setMousePos(null); }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* Outer dark pixel frame */}
        <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
          <motion.div
            style={{
              border: `2px solid ${hovered ? cfg.color : cfg.colorDim}`,
              backgroundColor: hovered ? "#12102e" : "#0a0920",
              transition: "border-color 0.06s, background-color 0.06s",
            }}
            className="flex flex-col items-center gap-2 p-3 relative overflow-hidden"
          >
            <Scanlines />

            {/* Legendary top flicker */}
            {tool.rarity === "Legendary" && (
              <motion.div className="absolute top-0 left-0 right-0 z-20" style={{ height: 2, backgroundColor: cfg.color }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            )}

            {/* Icon */}
            <div className="relative z-10" style={{
              width: 48, height: 48,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={tool.icon} alt={tool.name}
                style={{
                  width: 36, height: 36, objectFit: "contain",
                  filter: hovered ? `drop-shadow(0 0 8px ${cfg.color})` : "none",
                  transition: "filter 0.06s",
                  transform: hovered ? "scale(1.12)" : "scale(1)",
                }}
              />
            </div>

            {/* Name */}
            <span className="font-press-start text-[9px] text-center leading-relaxed relative z-10"
              style={{ color: hovered ? cfg.color : "rgba(255,255,255,0.55)" }}>
              {tool.name}
            </span>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hovered && mousePos && <ItemTooltip tool={tool} x={mousePos.x} y={mousePos.y} />}
      </AnimatePresence>
    </>
  );
}

// Empty slot
function EmptySlot() {
  return (
    <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
      <div style={{ border: "2px solid rgba(255,255,255,0.04)", backgroundColor: "#080716", minHeight: 96 }}
        className="flex items-center justify-center p-3">
        <span className="font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.08)" }}>—</span>
      </div>
    </div>
  );
}

export default function HeroInventory() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const total = 12;
  const empties = Math.max(0, total - tools.length);

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
          <TypingTitle text="[ INVENTORY ]" inView={isInView} />
        </h2>
      </div>

      {/* Rarity legend */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {(Object.entries(rarityConfig) as [Rarity, typeof rarityConfig[Rarity]][]).map(([key, cfg]) => (
          <span key={key} className="font-press-start text-[9px] px-2 py-1 inline-flex items-center gap-1.5"
            style={{ color: cfg.color, border: `1px solid ${cfg.colorDim}`, backgroundColor: cfg.colorFaint }}>
            <span style={{ lineHeight: 1 }}>{cfg.symbol}</span>{cfg.label}
          </span>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full">
        {tools.map((tool, idx) => (
          <InventorySlot key={tool.name} tool={tool} idx={idx} inView={isInView} />
        ))}
        {Array.from({ length: empties }).map((_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </div>
    </motion.div>
  );
}
