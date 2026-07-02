"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Quest } from "@/types";
import TypingTitle from "@/components/TypingTitle";

const quests: Quest[] = [
  {
    title: "Chief Technology Officer",
    company: "Beauty Secrets LLC",
    years: "Jan 2022 - Present",
    description: "Running the tech side of an eCommerce company. Rebuilt the platform into modular services, keep the infrastructure boring and stable, and spend a lot of time helping the dev team level up.",
    reward: ["+8000 XP", "+5 Leadership", "Legendary drop pending..."],
    completed: true,
  },
  {
    title: "Senior Web Developer",
    company: "Datacom LLC",
    years: "Nov 2018 - Nov 2023",
    description: "Stepped up to bigger, messier projects. Mentored junior devs and owned the tricky parts of large enterprise systems — the kind where one bad migration ruins your whole week.",
    reward: ["+6000 XP", "Title unlocked: Senior", "+4 Mentoring"],
    completed: true,
  },
  {
    title: "Web Developer",
    company: "Datacom LLC",
    years: "Feb 2018 - Nov 2018",
    description: "First time building custom systems with a proper team — code reviews, deadlines, how software actually ships. Short run, but learned more in nine months than the years before it.",
    reward: ["+3000 XP", "+2 Teamwork", "Learned: Code Review"],
    completed: true,
  },
  {
    title: "Fullstack Developer",
    company: "Beauty Secrets LLC",
    years: "Jan 2018 - Dec 2021",
    description: "Inherited an aging eCommerce codebase and slowly nursed it back to health. Built loyalty points, payment gateway integrations, and whatever the shop needed next.",
    reward: ["+5000 XP", "+3 Legacy Code Resistance", "Payment Gateway Rune"],
    completed: true,
  },
  {
    title: "Web Developer",
    company: "Hi-Fi Media Group",
    years: "Jun 2015 - Jan 2018",
    description: "Built and redesigned an online music store — sales features, promo campaigns, the works. Occasional side quests into online radio and streaming.",
    reward: ["+4000 XP", "+2 Audio Affinity", "Side quest bonus"],
    completed: true,
  },
  {
    title: "Web Developer",
    company: "Visualised Development LLC",
    years: "Jun 2013",
    description: "The tutorial level. First commercial websites, mostly hotel reservation systems. Broke things, fixed them, got hooked.",
    reward: ["+2000 XP", "Class unlocked: Web Developer"],
    completed: true,
  },
];

function Scanlines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)" }}
    />
  );
}

function QuestCard({ quest, idx, inView, delay }: { quest: Quest; idx: number; inView: boolean; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const isActive = !quest.completed;

  const color    = isActive ? "#4edbec" : "#60a5fa";
  const colorDim = isActive ? "rgba(78,219,236,0.35)"  : "rgba(96,165,250,0.3)";
  const colorFaint = isActive ? "rgba(78,219,236,0.07)" : "rgba(96,165,250,0.06)";
  const hoverBg  = isActive ? "#0b1a1d" : "#0d1220";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay ?? idx * 0.13, duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="select-none"
    >
      {/* Outer dark pixel frame */}
      <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
        <div
          style={{
            border: `2px solid ${hovered ? color : colorDim}`,
            backgroundColor: hovered ? hoverBg : "#12102e",
            transition: "border-color 0.06s, background-color 0.06s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Scanlines />

          {/* Active quest — animated top edge */}
          {isActive && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-20"
              style={{ height: 2, backgroundColor: color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}

          {/* Header strip */}
          <div
            style={{ backgroundColor: "#0d0b22", borderBottom: `1px solid ${colorDim}` }}
            className="flex items-center justify-between px-4 py-2.5 relative z-10 flex-wrap gap-2"
          >
            <div className="flex items-center gap-2">
              {isActive ? (
                <motion.span
                  className="font-press-start text-[9px] px-2 py-0.5"
                  style={{ color, border: `1px solid ${colorDim}`, backgroundColor: colorFaint }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ⚔︎ IN PROGRESS
                </motion.span>
              ) : (
                <span className="font-press-start text-[9px] px-2 py-0.5"
                  style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  ✓ DONE
                </span>
              )}
              <span className="font-press-start text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {quest.company}
              </span>
            </div>
            <span className="font-press-start text-[9px]" style={{ color: "rgba(255,255,255,0.28)" }}>
              {quest.years}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 relative z-10">
            {/* Content — dims on hover */}
            <motion.div
              animate={{ opacity: hovered ? 0.12 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-press-start text-[13px] text-white mb-3 leading-relaxed">
                {quest.title}
              </h3>
              <p className="text-gray-400 text-sm font-mono leading-relaxed">
                {quest.description}
              </p>
            </motion.div>

            {/* ── Hover overlay: COMPLETED quests ── */}
            <AnimatePresence>
              {hovered && quest.completed && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <motion.div
                    className="font-press-start text-[15px] text-yellow-400 text-center"
                    initial={{ scale: 0.75, y: 12 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  >
                    ✓ QUEST COMPLETE
                  </motion.div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quest.reward.map((r, i) => (
                      <motion.span
                        key={i}
                        className="font-press-start text-[9px] px-2 py-1"
                        style={{ color: "#facc15", border: "1px solid rgba(250,204,21,0.4)", backgroundColor: "rgba(250,204,21,0.08)" }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        ⬥ {r}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Hover overlay: ACTIVE quest ── */}
            <AnimatePresence>
              {hovered && isActive && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <motion.div
                    className="font-press-start text-[13px] text-center"
                    style={{ color }}
                    initial={{ scale: 0.75, y: 12 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  >
                    ⚔︎ IN PROGRESS
                  </motion.div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quest.reward.map((r, i) => (
                      <motion.span
                        key={i}
                        className="font-press-start text-[9px] px-2 py-1"
                        style={{ color, border: `1px solid ${colorDim}`, backgroundColor: colorFaint }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        ⬥ {r}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div
            style={{ backgroundColor: "#0d0b22", borderTop: `1px solid ${colorDim}` }}
            className="px-4 py-1.5 flex items-center justify-between relative z-10"
          >
            <span className="font-press-start text-[7px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              {isActive ? "ACTIVE QUEST" : `QUEST #${String(quests.length - idx).padStart(2, "0")}`}
            </span>
            <span className="font-press-start text-[8px]" style={{ color }}>
              {isActive ? "▶︎" : "✓"}
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

const INITIAL_SHOW = 3;

export default function HeroQuests() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? quests : quests.slice(0, INITIAL_SHOW);
  const hidden = quests.length - INITIAL_SHOW;

  return (
    <div ref={ref} className="max-w-4xl mx-auto px-5 pb-20">
      <div className="mb-10 text-center">
        <h2 className="font-press-start text-white text-lg tracking-wider">
          <TypingTitle text="[ QUESTS ]" inView={isInView} />
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((quest, idx) => (
          <QuestCard
            key={idx}
            quest={quest}
            idx={idx}
            inView={isInView}
            delay={idx >= INITIAL_SHOW ? (idx - INITIAL_SHOW) * 0.08 : undefined}
          />
        ))}
      </div>

      {/* Toggle button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: INITIAL_SHOW * 0.13 + 0.2, duration: 0.4 }}
        className="mt-4"
      >
        <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer font-press-start text-[9px] group"
            style={{
              backgroundColor: "#12102e",
              border: "2px solid rgba(255,255,255,0.08)",
              transition: "border-color 0.06s, background-color 0.06s",
              color: "rgba(255,255,255,0.45)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(96,165,250,0.5)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0d1220";
              (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#12102e";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
            }}
          >
            <span>
              {expanded ? "▲︎ HIDE QUESTS" : `▼︎ SHOW ${hidden} MORE QUESTS`}
            </span>
            <span className="font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              {expanded ? `${quests.length} / ${quests.length}` : `${INITIAL_SHOW} / ${quests.length}`}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
