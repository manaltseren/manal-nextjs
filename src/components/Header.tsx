"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const currentLevel = new Date().getFullYear() - 2013;

const navItems = [
  { href: "/",          label: "Home",      slot: "01", key: "Q", desc: "Character overview" },
  { href: "/portfolio", label: "Portfolio", slot: "02", key: "W", desc: "Completed quests" },
];

function Scanlines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.09) 3px, rgba(0,0,0,0.09) 4px)",
      }}
    />
  );
}

const Header = () => {
  const currentPath = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full backdrop-blur-sm bg-black/40 border-b border-white/10 z-50">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-5 py-3">

          {/* Logo */}
          <Link
            href="/"
            className="font-press-start text-purple-400 text-[10px] hover:text-purple-300 transition-colors"
          >
            manal.dev
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 font-press-start text-[9px] transition-colors ${
                  currentPath === item.href ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {currentPath === item.href && (
                  <span className="text-cyan-400 mr-1">▶</span>
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="font-press-start text-[9px] text-yellow-400 border border-yellow-400/50 px-2 py-1">
              LVL {currentLevel}
            </span>

            {/* Burger */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-7 h-7 cursor-pointer"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="block h-px w-5 bg-white origin-center"
                animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.18 }}
              />
              <motion.span
                className="block h-px w-5 bg-white"
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.12 }}
              />
              <motion.span
                className="block h-px w-5 bg-white origin-center"
                animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.18 }}
              />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: "rgba(5,4,18,0.92)", backdropFilter: "blur(6px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel — slides in from right */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 md:hidden flex flex-col"
              style={{
                width: "78vw",
                maxWidth: 320,
                backgroundColor: "#07060f",
                borderLeft: "2px solid rgba(122,93,255,0.5)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: [0.25, 0, 0.1, 1] }}
            >
              <Scanlines />

              {/* Purple top accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 z-10"
                style={{ height: 2, backgroundColor: "#7a5dff" }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />

              {/* Panel header */}
              <div
                className="relative z-10 flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(122,93,255,0.25)" }}
              >
                <div className="flex items-center gap-2.5">
                  <motion.span
                    className="font-press-start text-[8px]"
                    style={{ color: "#4edbec" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ▶
                  </motion.span>
                  <span className="font-press-start text-[10px] text-white">MENU</span>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="font-press-start text-[10px] px-2 py-1 cursor-pointer transition-colors"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "#0a0920",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Nav items */}
              <nav className="relative z-10 flex flex-col flex-1 py-4">
                {navItems.map((item, idx) => {
                  const active = currentPath === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + idx * 0.07, duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-4 px-5 py-4 transition-colors"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          backgroundColor: active ? "rgba(122,93,255,0.1)" : "transparent",
                        }}
                      >
                        {/* Slot number */}
                        <span
                          className="font-press-start text-[9px] w-6 shrink-0"
                          style={{ color: active ? "#4edbec" : "rgba(255,255,255,0.2)" }}
                        >
                          {item.slot}
                        </span>

                        {/* Active bar */}
                        <div
                          className="w-0.5 self-stretch shrink-0"
                          style={{ backgroundColor: active ? "#7a5dff" : "rgba(255,255,255,0.07)" }}
                        />

                        {/* Label + desc */}
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className="font-press-start text-[11px]"
                            style={{ color: active ? "#fff" : "rgba(255,255,255,0.6)" }}
                          >
                            {active && <span className="text-cyan-400 mr-1.5">▶</span>}
                            {item.label}
                          </span>
                          <span
                            className="font-press-start text-[8px]"
                            style={{ color: active ? "rgba(78,219,236,0.7)" : "rgba(255,255,255,0.2)" }}
                          >
                            {item.desc}
                          </span>
                        </div>

                        {/* Key hint */}
                        <span
                          className="font-press-start text-[8px] px-1.5 py-0.5 shrink-0"
                          style={{
                            color: active ? "#7a5dff" : "rgba(255,255,255,0.15)",
                            border: `1px solid ${active ? "rgba(122,93,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                            backgroundColor: "#0a0920",
                          }}
                        >
                          {item.key}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Panel footer */}
              <motion.div
                className="relative z-10 flex items-center justify-between px-5 py-4"
                style={{ borderTop: "1px solid rgba(122,93,255,0.2)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <span className="font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  manal.dev
                </span>
                <span className="font-press-start text-[9px] text-yellow-400 border border-yellow-400/40 px-2 py-0.5">
                  LVL {currentLevel}
                </span>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
