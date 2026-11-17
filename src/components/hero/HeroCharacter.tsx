"use client";
// CHARACTER window — one game-style screen combining equipment, attributes,
// bag and the skill action bar (replaces the separate Skills + Inventory
// sections). Data lives in ./character/data.ts, building blocks in
// ./character/ui.tsx.
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import TypingTitle from "@/components/TypingTitle";
import { useRevealed } from "@/components/PixelReveal";
import CharacterSprite from "./character/CharacterSprite";
import StageBackdrop from "./character/StageBackdrop";
import type { Tool } from "@/types";
import { attributesFor, BAG_SIZE, characterLevel, dollLeft, dollRight, dollWeapons, skillKeys, skills, tools } from "./character/data";
import {
  EmptySlot,
  ItemIcon,
  ItemTooltip,
  PanelLabel,
  SkillInfo,
  Slot,
  rarityConfig,
  typeConfig,
} from "./character/ui";
import { pxVars } from "@/lib/pixel";

type Tip = { id: string; rect: DOMRect } | null; // open item tooltip

const equippedBySlot = new Map(tools.filter((t) => t.slot).map((t) => [t.slot as string, t]));
const bag = tools.filter((t) => !t.slot);
// Character level (years since 2013) and the stats derived from it
const level = characterLevel();
const attributes = attributesFor(level);

// Sub-panel: its own bordered window, or `bare` (no window, on the scene)
function SubPanel({ children, className = "", bare = false }: { children: React.ReactNode; className?: string; bare?: boolean }) {
  // bare = no window: content sits straight on the scene (the Equipment side)
  if (bare) return <div className={className}>{children}</div>;
  return (
    <div className={`px-outer ${className}`}>
      {/* Each panel is its own bordered window (notched purple pixel border,
          bevel, stepped drop shadow) sitting directly on the scene. */}
      <div className="px-panel h-full p-3 md:p-4 flex flex-col" style={pxVars({ "--px-border": "#7a5dff", "--px-bg": "#0f0d26" })}>
        {children}
      </div>
    </div>
  );
}

export default function HeroCharacter() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  // Also wait for the parent PixelReveal (if any) so entrance animations play
  // when the section is actually uncovered, not hidden behind the wipe.
  const revealed = useRevealed();
  const isInView = useInView(ref, { once: true, margin: "-80px" }) && revealed;
  // Q/W/E/R hotkeys only while the window is on screen
  const onScreen = useInView(ref, { margin: "-25% 0px -25% 0px" });

  const [tip, setTip] = useState<Tip>(null);
  // Skill shown in the inline info under the skill slots
  const [activeSkill, setActiveSkill] = useState(0);
  // Bumped on every Coffee click — the character plays the drink animation once
  const [drinkKey, setDrinkKey] = useState(0);
  // Coffee stack: starts at the data's count, −1 per sip (per page visit)
  const [coffeeLeft, setCoffeeLeft] = useState(() => tools.find((t) => t.sprite === "coffee")?.count ?? 0);
  // Tool with its live stack count (the coffee one changes as it's drunk)
  const live = (t: Tool): Tool => (t.sprite === "coffee" ? { ...t, count: coffeeLeft } : t);
  // Mobile only: ATTRIBUTES list starts collapsed (always open on desktop)
  const [attrOpen, setAttrOpen] = useState(false);

  // While a tooltip is open: scroll / resize / tapping outside a slot closes it
  // (the slot rect it is anchored to would otherwise go stale).
  useEffect(() => {
    if (!tip) return;
    const close = () => setTip(null);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest("[data-char-slot]")) close();
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [tip]);

  // A skill's hotkey selects it (shown in the inline info); Passives have none
  useEffect(() => {
    if (!onScreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const i = skillKeys.indexOf(e.key.toUpperCase());
      if (i >= 0) setActiveSkill(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onScreen]);

  const open = (id: string) => (rect: DOMRect) => setTip({ id, rect });
  const close = (id: string) => () => setTip((cur) => (cur?.id === id ? null : cur));
  const isOpen = (id: string) => tip?.id === id;

  let slotIdx = 0; // stagger order for the entrance

  const itemSlot = (item: Tool | undefined, label?: string) => {
    const idx = slotIdx++;
    if (!item) return <EmptySlot key={`empty-${label ?? idx}`} label={label} />;
    const t = live(item);
    const cfg = rarityConfig[t.rarity];
    const isCoffee = t.sprite === "coffee";
    const usable = isCoffee && coffeeLeft > 0; // clicking plays the drink animation
    return (
      <Slot
        key={t.name}
        label={label}
        idx={idx}
        open={isOpen(t.name)}
        borderColor={cfg.colorDim}
        openColor={cfg.color}
        inView={isInView}
        reduce={reduce}
        ariaLabel={`${t.name}, ${cfg.label}${t.slot ? `, equipped: ${t.slot}` : ""}${t.count ? `, ${t.count} in stack` : ""}${usable ? ", usable: click to take a sip" : ""}`}
        onOpen={open(t.name)}
        onClose={close(t.name)}
        onActivate={
          usable
            ? () => {
                setCoffeeLeft((n) => Math.max(0, n - 1));
                setDrinkKey((k) => k + 1);
              }
            : undefined
        }
      >
        <ItemIcon tool={t} className="w-[52%] h-[52%]" />
        {/* Usable item: blinking "USE" tag so the slot reads as clickable
            (hard on/off blink; steady under reduced motion) */}
        {usable && (
          <motion.span
            aria-hidden="true"
            className="absolute top-1.5 left-1.5 font-press-start text-[6px] md:text-[7px] leading-none text-[#4edbec]"
            animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.6, 0.61, 1], ease: "linear" }}
          >
            USE
          </motion.span>
        )}
        <span className="absolute bottom-1 right-1.5 font-press-start text-[7px] leading-none" style={{ color: cfg.color }}>
          {isCoffee ? (
            // live stack count; empty stack = dim 0
            <span className={coffeeLeft > 0 ? "text-white" : "text-white/35"}>{coffeeLeft}</span>
          ) : t.count ? (
            <span className="text-white">{t.count}</span>
          ) : (
            cfg.symbol
          )}
        </span>
      </Slot>
    );
  };

  const tipFound = tip ? tools.find((t) => t.name === tip.id) : undefined;
  const tipItem = tipFound ? live(tipFound) : undefined;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-5"
    >
      <div className="mb-10 text-center">
        <h2 className="font-press-start text-white text-lg tracking-wider">
          <TypingTitle text="CHARACTER" inView={isInView} />
        </h2>
      </div>

      {/* ── Panels sit directly on the scene — no outer window/card ── */}
          {/* 2×2 grid so paired windows share a row height:
                row 1: paper doll | SKILLS
                row 2: ATTRIBUTES | BAG
              Grid rows stretch both cells to the taller one. Mobile: one
              column — doll, attributes (collapsible), bag, skills (via order). */}
          <div className="grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-x-12 md:gap-y-10">
            {/* ── Row 1 left: paper doll, NO window (sits on the scene) ── */}
            <SubPanel className="md:col-start-1 md:row-start-1" bare>
                {/* Narrow slot columns, wide avatar: slots are 1/4.6 of the
                    width each, the avatar 2.6/4.6. The avatar is a 3:4 portrait
                    and sets the row height; the side slots spread to fill it. */}
                <div className="grid grid-cols-[1fr_2.6fr_1fr] gap-x-3">
                  <div className="flex flex-col justify-between">{dollLeft.map((s) => itemSlot(equippedBySlot.get(s), s))}</div>
                  {/* Full-body avatar: the user's pixel sprite standing on a
                      pixel "character select" stage (StageBackdrop: banded sky,
                      dithered floor, pedestal). The frame is 2:3, same as the
                      stage grid. */}
                  <div className="px-outer">
                    <div
                      className="px-panel aspect-2/3 overflow-hidden flex items-end justify-center"
                      style={pxVars({ "--px": "3px", "--px-border": "rgba(122,93,255,0.35)", "--px-bg": "#0a0919" })}
                    >
                      <StageBackdrop />
                      <CharacterSprite reduce={reduce} drinkKey={drinkKey} className="h-[82%] w-auto mb-[13%] -translate-x-[8%] select-none" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">{dollRight.map((s) => itemSlot(equippedBySlot.get(s), s))}</div>
                </div>
                {/* Weapons centred under the avatar, same width as a side slot */}
                <div className="flex justify-center gap-3 mt-3">
                  {dollWeapons.map((s) => (
                    <div key={s} className="w-[calc((100%-24px)/4.6)]">
                      {itemSlot(equippedBySlot.get(s), s === "MAIN HAND" ? "MAIN" : "OFF")}
                    </div>
                  ))}
                </div>
            </SubPanel>

            {/* ── Row 2 left: attributes, NO window ── */}
            <SubPanel className="md:col-start-1 md:row-start-2" bare>
              {/* Mobile: collapsed by default — the title is a toggle.
                  Desktop: always open, plain title. */}
              <button
                type="button"
                className="md:hidden block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4edbec]"
                aria-expanded={attrOpen}
                aria-controls="char-attributes"
                onClick={() => setAttrOpen((o) => !o)}
              >
                <PanelLabel
                  right={
                    <>
                      LV {level} <span className="text-[#4edbec] ml-2">{attrOpen ? "[-]" : "[+]"}</span>
                    </>
                  }
                >
                  ATTRIBUTES
                </PanelLabel>
              </button>
              <div className="hidden md:block">
                <PanelLabel right={`LV ${level}`}>ATTRIBUTES</PanelLabel>
              </div>
              {/* Souls-style stat sheet: name + open-ended number, no bars */}
              <div id="char-attributes" className={`${attrOpen ? "flex" : "hidden"} md:flex flex-col gap-2.5 px-1`}>
                {attributes.map((a) => (
                  <div key={a.stat} className="flex items-center justify-between gap-3">
                    <span className="font-press-start text-[8px] leading-none text-white/55">{a.stat}</span>
                    <span className="font-pixel text-[24px] leading-none text-white tabular-nums">{a.value}</span>
                  </div>
                ))}
              </div>
            </SubPanel>

            {/* ── Row 1 right: SKILLS (stretches to the doll's height) ── */}
            <SubPanel className="h-full order-4 md:order-0 md:col-start-2 md:row-start-1">
              <PanelLabel>SKILLS</PanelLabel>
              {/* Hover / tap / focus / hotkey selects a skill; its info shows
                  right below (inline, no tooltip). */}
              <div className="grid grid-cols-4 gap-x-1">
                {skills.map((s, i) => {
                  const cfg = typeConfig[s.type];
                  return (
                    <Slot
                      key={s.name}
                      label={skillKeys[i] ?? undefined}
                      idx={slotIdx++}
                      open={activeSkill === i}
                      borderColor={cfg.colorDim}
                      openColor={cfg.color}
                      inView={isInView}
                      reduce={reduce}
                      ariaLabel={`${s.name}, ${cfg.label} skill, rank ${s.level} of 5${skillKeys[i] ? `, hotkey ${skillKeys[i]}` : ""}`}
                      describedBy="skill-info"
                      bleed
                      onOpen={() => setActiveSkill(i)}
                      onClose={() => {}}
                    >
                      {/* Icon only (bigger); the rank shows beside the name below */}
                      {/* Full-bleed art icon: no hop (a moving square reads as a
                          loose box) — selected = full brightness, others
                          dimmed, stepped */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          filter: activeSkill === i ? "none" : "brightness(.6) saturate(.7)",
                          transition: reduce ? "none" : "filter .2s steps(3)",
                        }}
                      />
                      {s.type === "Ultimate" && (
                        // solid key-cap like the hotkey, so it reads over the art
                        <span className="absolute top-0 right-0 z-1 bg-[#0b0a14] px-1 py-0.75 font-press-start text-[7px] leading-none" style={{ color: cfg.color }}>
                          ★
                        </span>
                      )}
                    </Slot>
                  );
                })}
              </div>
              {/* All descriptions share one grid cell → the box is always as
                  tall as the longest one, so hovering between skills never
                  changes the panel height. Only the active one is visible. */}
              <div className="grid mt-5 px-1" aria-live="polite">
                {skills.map((s, i) => (
                  <SkillInfo key={s.name} skill={s} active={activeSkill === i} reduce={reduce} />
                ))}
              </div>
            </SubPanel>

            {/* ── Row 2 right: BAG — NO window (sits on the scene); slots fill the column width ── */}
            <SubPanel className="order-3 md:order-0 md:col-start-2 md:row-start-2" bare>
              <PanelLabel right={`${bag.length} / ${BAG_SIZE}`}>BAG</PanelLabel>
              {/* No window: title + slots straight on the scene, left-aligned
                  under the BAG title (like the attributes on the left) */}
              <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                {bag.map((t) => itemSlot(t))}
                {Array.from({ length: BAG_SIZE - bag.length }).map((_, i) => (
                  <EmptySlot key={`bag-empty-${i}`} />
                ))}
              </div>
            </SubPanel>
          </div>

      {tipItem && tip && <ItemTooltip tool={tipItem} rect={tip.rect} reduce={reduce} />}
    </motion.div>
  );
}
