"use client";
// Building blocks for the CHARACTER window: palette configs, pixel helpers,
// a hover/tap slot button, and the slot-anchored tooltip with its item and
// skill variants.
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { Rarity, Skill, SkillType, Tool } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────
// CSS custom properties aren't in React.CSSProperties.
export const pxVars = (vars: Record<string, string>) => vars as React.CSSProperties;

// Stepped easing — motion moves in whole frames, like a sprite.
export const stepped = (steps: number) => (t: number) => Math.min(1, Math.ceil(t * steps) / steps);

export const smooth = [0.22, 1, 0.36, 1] as const;

// ── Palettes ─────────────────────────────────────────────────────────────────
export const rarityConfig: Record<Rarity, { color: string; colorDim: string; colorFaint: string; label: string; symbol: string }> = {
  Legendary: { color: "#facc15", colorDim: "rgba(250,204,21,0.45)", colorFaint: "rgba(250,204,21,0.08)", label: "LEGENDARY", symbol: "★" },
  Epic:      { color: "#c084fc", colorDim: "rgba(192,132,252,0.45)", colorFaint: "rgba(192,132,252,0.08)", label: "EPIC",      symbol: "◆" },
  Rare:      { color: "#60a5fa", colorDim: "rgba(96,165,250,0.45)",  colorFaint: "rgba(96,165,250,0.08)",  label: "RARE",      symbol: "▲︎" },
  Uncommon:  { color: "#4ade80", colorDim: "rgba(74,222,128,0.4)",   colorFaint: "rgba(74,222,128,0.07)",  label: "UNCOMMON",  symbol: "●" },
  Common:    { color: "#94a3b8", colorDim: "rgba(148,163,184,0.35)", colorFaint: "rgba(148,163,184,0.07)", label: "COMMON",    symbol: "○" },
};

// Approved palette: Active = cyan, Passive = slate, Ultimate = violet
export const typeConfig: Record<SkillType, { color: string; colorDim: string; colorFaint: string; label: string }> = {
  Active:   { color: "#4edbec", colorDim: "rgba(78,219,236,0.45)",  colorFaint: "rgba(78,219,236,0.08)",  label: "ACTIVE" },
  Passive:  { color: "#94a3b8", colorDim: "rgba(148,163,184,0.4)",  colorFaint: "rgba(148,163,184,0.07)", label: "PASSIVE" },
  Ultimate: { color: "#c084fc", colorDim: "rgba(192,132,252,0.45)", colorFaint: "rgba(192,132,252,0.08)", label: "★ ULTIMATE" },
};

// ── Hand-drawn item sprites (one char = one pixel, "." = empty) ──────────────
const itemSprites = {
  coffee: {
    palette: { o: "#0b0a14", w: "#e5e7eb", s: "#9ca3af", c: "#78350f", t: "#94a3b8" },
    rows: ["..t..t....", "...t..t...", "oooooooo..", "occcccco..", "owwwwwwoo.", "owwwwwwo.o", "owwwwwwoo.", "oswwwwso..", ".osssso...", "..oooo...."],
  },
  // Security item: purple chest armour (breastplate) with gold pauldrons +
  // belt and a keyhole emblem (16×16)
  armor: {
    palette: { o: "#0b0a14", y: "#facc15", h: "#c4b5ff", b: "#7a5dff", B: "#5a3fd6", k: "#0b0a14" },
    rows: [
      "..oooo....oooo..",
      ".oyyyyo..oyyyyo.",
      "oyhhbbo..obbBByo",
      "oyhbbbboobbbbByo",
      "oooyhbbbbbbByooo",
      "..oyhbbkkbbByo..",
      "..oyhbkkkkbByo..",
      "..oyhbbkkbbByo..",
      "..oyhbbkkbbByo..",
      "..oyhbbbbbbByo..",
      "..oyyyyyyyyyyo..",
      "...ohbbbbbbBo...",
      "...oBBbbbbBBo...",
      "....oooooooo....",
    ],
  },
  duck: {
    palette: { o: "#0b0a14", y: "#facc15", d: "#ca8a04", b: "#f97316", e: "#0b0a14" },
    rows: ["..oooo....", ".oyyyyo...", ".oyeyyo...", ".oyyyybbo.", "..oyyyoo..", ".oyyyyyyo.", "oyyyyyyyyo", "oyyddyyyyo", ".oyyyyyyo.", "..oooooo.."],
  },
} as const;

// Scales to its box (className) like the PNG logos, so hand-drawn sprites and
// logo icons appear the same size in slots and tooltips.
function GridSprite({ name, className }: { name: keyof typeof itemSprites; className: string }) {
  const { palette, rows } = itemSprites[name];
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      if (c !== ".") rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[c as keyof typeof palette]} />);
      x += run;
    }
  });
  return (
    <svg className={className} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  );
}

/** Item icon: a hand-drawn sprite, or the PIXEL version of the tool PNG —
 *  /images/xp/items/pixel/<name>.png (26×26: logo downscaled to 24px, hard
 *  alpha, ≤6 flat colours, 1px dark outline; originals kept in /items/).
 *  Scaled with nearest-neighbour so each art pixel stays a hard square. */
export function ItemIcon({ tool, className }: { tool: Tool; className: string }) {
  if (tool.sprite) return <GridSprite name={tool.sprite} className={className} />;
  const src = tool.icon?.replace("/images/xp/items/", "/images/xp/items/pixel/");
  return <img src={src} alt="" className={`${className} object-contain`} style={{ imageRendering: "pixelated" }} />;
}

// ── Small bits ───────────────────────────────────────────────────────────────
export function RankPips({ level, color, size = "sm" }: { level: number; color: string; size?: "sm" | "lg" }) {
  const w = size === "lg" ? 14 : 6;
  const h = size === "lg" ? 8 : 4;
  return (
    <span className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: w,
            height: h,
            backgroundColor: i < level ? color : "#1a1838",
            boxShadow: i < level ? "inset 0 2px 0 rgba(255,255,255,0.3), 0 0 0 2px #07060e" : "0 0 0 2px #07060e",
          }}
        />
      ))}
    </span>
  );
}

export function Chip({ children, color, faint }: { children: React.ReactNode; color: string; faint: string }) {
  return (
    <span className="px-chip font-press-start text-[8px] px-2 py-1 leading-none" style={pxVars({ "--px-border": color, "--px-bg": faint, color })}>
      {children}
    </span>
  );
}

/** Segmented 10-block stat bar with label and value. */
export function StatBar({ stat, value, color, labelWidth = "w-24" }: { stat: string; value: number; color: string; labelWidth?: string }) {
  const filled = Math.round(value / 10);
  return (
    <div className="flex items-center gap-3">
      <span className={`font-press-start text-[8px] leading-none text-white/55 ${labelWidth} shrink-0`}>{stat}</span>
      <span className="flex gap-0.75 flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 flex-1"
            style={{ backgroundColor: i < filled ? color : "#1a1838", boxShadow: i < filled ? "inset 0 2px 0 rgba(255,255,255,0.25)" : "none" }}
          />
        ))}
      </span>
      <span className="font-press-start text-[8px] leading-none w-6 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

/** Section title inside the Character area, e.g. "BAG   6 / 8". */
export function PanelLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    // Real title: no "▸" prefix (it broke the left alignment), 10px bright
    // white; the optional right-side info stays small and muted.
    <div className="flex items-baseline justify-between gap-3 mb-4 px-1">
      <span className="font-press-start text-[10px] leading-none text-white">{children}</span>
      {right && <span className="font-press-start text-[8px] leading-none text-white/40">{right}</span>}
    </div>
  );
}

// ── Slot button ──────────────────────────────────────────────────────────────
// Mouse: hover opens the tooltip. Touch: tap toggles it. Keyboard: focus.
export function Slot({
  open,
  label,
  borderColor,
  openColor,
  idx,
  inView,
  reduce,
  ariaLabel,
  describedBy,
  onOpen,
  onClose,
  btnRef,
  children,
}: {
  open: boolean;
  label?: string;
  borderColor: string;
  openColor: string;
  idx: number;
  inView: boolean;
  reduce: boolean;
  ariaLabel: string;
  /** Set for selector slots (skills) whose info is shown inline elsewhere */
  describedBy?: string;
  onOpen: (rect: DOMRect) => void;
  onClose: () => void;
  btnRef?: (el: HTMLButtonElement | null) => void;
  children: React.ReactNode;
}) {
  const pointer = useRef<string>("mouse");
  const rectOf = (el: Element) => el.getBoundingClientRect();
  return (
    <motion.button
      ref={btnRef}
      type="button"
      data-char-slot
      aria-expanded={describedBy ? undefined : open}
      aria-pressed={describedBy ? open : undefined}
      aria-describedby={describedBy ?? (open ? "char-tooltip" : undefined)}
      aria-label={ariaLabel}
      className="px-outer block w-full cursor-pointer select-none focus-visible:outline-none"
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: idx * 0.035, duration: 0.2, ease: stepped(3) }}
      onPointerDown={(e) => {
        pointer.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onOpen(rectOf(e.currentTarget));
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onClose();
      }}
      onFocus={(e) => {
        // keyboard focus only — a tap also focuses, and onClick handles that
        if (e.currentTarget.matches(":focus-visible")) onOpen(rectOf(e.currentTarget));
      }}
      onBlur={() => {
        if (open) onClose();
      }}
      onClick={(e) => {
        if (pointer.current === "mouse") return; // hover already handles mouse
        if (open) onClose();
        else onOpen(rectOf(e.currentTarget));
      }}
    >
      <div
        className="px-panel aspect-square flex items-center justify-center"
        style={pxVars({ "--px": "3px", "--px-border": open ? openColor : borderColor, "--px-bg": open ? "#1a1640" : "#0a0920" })}
      >
        {label && (
          <span className="absolute top-1.5 left-1.5 font-press-start text-[6px] md:text-[7px] leading-none text-white/35">{label}</span>
        )}
        <span className="flex items-center justify-center w-full h-full">
          {children}
        </span>
      </div>
    </motion.button>
  );
}

/** Empty slot: dithered, optional faint label (e.g. empty action-bar key). */
export function EmptySlot({ label }: { label?: string }) {
  return (
    <div className="px-outer" aria-hidden="true">
      <div
        className="px-panel px-dither aspect-square"
        style={pxVars({ "--px": "3px", "--px-border": "rgba(255,255,255,0.05)", "--px-bg": "#080716" })}
      >
        {label && <span className="absolute top-1.5 left-1.5 font-press-start text-[7px] leading-none text-white/15">{label}</span>}
      </div>
    </div>
  );
}

// ── Anchored tooltip ─────────────────────────────────────────────────────────
// Placed right of the slot if there's room, else left, else below/above.
// Measures itself in a layout effect and writes left/top straight to the
// style (no extra render).
function AnchoredTooltip({ rect, tipKey, border, reduce, children }: { rect: DOMRect; tipKey: string; border: string; reduce: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = 12;
    const gap = 8;
    let left: number;
    let top: number;
    if (rect.right + gap + w <= vw - m) {
      left = rect.right + gap;
      top = rect.top;
    } else if (rect.left - gap - w >= m) {
      left = rect.left - gap - w;
      top = rect.top;
    } else {
      left = rect.left + rect.width / 2 - w / 2;
      top = rect.bottom + gap;
      if (top + h > vh - m) top = rect.top - gap - h;
    }
    el.style.left = `${Math.min(Math.max(left, m), vw - w - m)}px`;
    el.style.top = `${Math.min(Math.max(top, m), vh - h - m)}px`;
    el.style.visibility = "visible";
  }, [rect, tipKey]);

  return createPortal(
    <div
      ref={ref}
      id="char-tooltip"
      role="tooltip"
      className="fixed z-9999 pointer-events-none w-[min(320px,calc(100vw-24px))]"
      style={{ left: 0, top: 0, visibility: "hidden" }}
    >
      <motion.div
        key={tipKey}
        className="px-outer"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12, ease: smooth }}
      >
        <div className="px-panel overflow-hidden" style={pxVars({ "--px-border": border, "--px-bg": "#0f0d26" })}>
          {children}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// Deterministic pseudo-random in [0,1) — pure (no Math.random).
const rand = (seed: number) => {
  const v = Math.sin(seed) * 43758.5453;
  return v - Math.floor(v);
};

function Sparkle({ color, seed, delay }: { color: string; seed: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 pointer-events-none"
      style={{ left: `${5 + rand(seed * 2.1 + 1) * 90}%`, top: `${5 + rand(seed * 1.7 + 7) * 90}%`, backgroundColor: color }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, -6, -10, -14] }}
      transition={{ duration: 1.8 + rand(seed * 3.3 + 2), repeat: Infinity, delay, ease: stepped(4) }}
    />
  );
}

export function ItemTooltip({ tool, rect, reduce }: { tool: Tool; rect: DOMRect; reduce: boolean }) {
  const cfg = rarityConfig[tool.rarity];
  const shiny = !reduce && (tool.rarity === "Legendary" || tool.rarity === "Epic");
  return (
    <AnchoredTooltip rect={rect} tipKey={`item-${tool.name}`} border={cfg.color} reduce={reduce}>
      {shiny && Array.from({ length: 6 }).map((_, i) => <Sparkle key={i} color={cfg.color} seed={i} delay={i * 0.22} />)}
      <div className="relative flex items-center gap-3 px-3 py-3" style={{ backgroundColor: cfg.colorFaint }}>
        <div className="px-chip justify-center shrink-0 w-12 h-12" style={pxVars({ "--px-bg": "#0a0920", "--px-border": cfg.color })}>
          <ItemIcon tool={tool} className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="font-press-start text-[11px] leading-snug" style={{ color: cfg.color }}>
            {tool.name}
            {tool.count ? <span className="text-white/50"> ×{tool.count}</span> : null}
          </span>
          <span className="font-pixel text-[18px] leading-none text-white/60">{tool.kind}</span>
        </div>
      </div>
      <div className="relative flex items-center justify-between px-3 pt-3">
        <span className="font-press-start text-[8px] leading-none" style={{ color: cfg.color }}>
          {cfg.symbol} {cfg.label}
        </span>
        <span className="font-press-start text-[8px] leading-none text-white/45">ILVL {tool.ilvl}</span>
      </div>
      <div className="relative flex flex-col gap-3 px-3 py-3">
        <ul className="space-y-1">
          {tool.stats.map((s) => (
            <li key={s} className="font-pixel text-[19px] leading-none text-[#4ade80]">
              {s}
            </li>
          ))}
        </ul>
        <p className="font-pixel text-[18px] leading-[1.15]" style={{ color: "rgba(250,204,21,0.75)" }}>
          &ldquo;{tool.description}&rdquo;
        </p>
      </div>
      <div className="relative px-3 py-2" style={{ backgroundColor: "#0a0920" }}>
        <span className="font-press-start text-[7px]" style={{ color: tool.slot ? "#4edbec" : "rgba(255,255,255,0.35)" }}>
          {tool.slot ? `■ EQUIPPED · ${tool.slot}` : tool.count ? `IN BAG · STACK OF ${tool.count}` : "IN BAG"}
        </span>
      </div>
    </AnchoredTooltip>
  );
}

/** Inline skill info under the skill slots (no tooltip). Structured so it
 *  reads cleanly but isn't flat:
 *    NAME
 *    TYPE
 *    tagline
 *    ▪ bonus lines              (type-coloured pixel bullets)
 *  Re-keyed per skill so it swaps instantly with a short smooth fade-in. */
export function SkillInfo({ skill, active, reduce }: { skill: Skill; active: boolean; reduce: boolean }) {
  const cfg = typeConfig[skill.type];
  return (
    // All four are rendered stacked in one grid cell (see HeroCharacter) so the
    // box keeps the tallest one's height; inactive ones are `invisible`.
    <motion.div
      id={active ? "skill-info" : undefined}
      aria-hidden={!active}
      className={`col-start-1 row-start-1 flex flex-col gap-4 ${active ? "" : "invisible"}`}
      initial={false}
      animate={active || reduce ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 3 }}
      transition={active && !reduce ? { duration: 0.18, ease: smooth } : { duration: 0 }}
    >
      {/* Header: name, type, tagline (icon + rank pips are already on the selected slot above) */}
      <div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="font-press-start text-[10px] leading-snug text-white">{skill.name}</span>
            <RankPips level={skill.level} color={cfg.color} />
          </div>
          <span className="font-press-start text-[7px] leading-none" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          <p className="font-pixel text-[18px] leading-[1.1] text-white/70">{skill.tagline}</p>
        </div>
      </div>

      {/* Bonuses */}
      <ul className="flex flex-col gap-1.5">
        {skill.bonus.map((b) => (
          <li key={b} className="flex items-center gap-2.5 font-pixel text-[18px] leading-none text-white/85">
            <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: cfg.color }} />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
