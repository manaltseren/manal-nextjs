"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

const navItems = [
  { href: "/", label: "ABOUT ME", key: "1", desc: "Character overview", sprite: "hero" as const },
  { href: "/portfolio", label: "PORTFOLIO", key: "2", desc: "Completed quests", sprite: "chest" as const },
];

const socials = [
  { href: "https://www.linkedin.com/in/manaltseren-b-5883b214b/", icon: "la-linkedin", label: "LinkedIn" },
  { href: "https://www.instagram.com/manal.dev/", icon: "la-instagram", label: "Instagram" },
  { href: "https://www.facebook.com/noirmn", icon: "la-facebook-square", label: "Facebook" },
];

// CSS custom properties aren't in React.CSSProperties.
const pxVars = (vars: Record<string, string>) => vars as React.CSSProperties;

// Stepped easing — motion moves in whole frames, like a sprite.
const stepped = (steps: number) => (t: number) => Math.min(1, Math.ceil(t * steps) / steps);

// Smooth ease-out for the drawer (a stepped slide over a big panel reads as lag).
const smooth = [0.22, 1, 0.36, 1] as const;

// ── Pixel sprites (crisp SVG) ────────────────────────────────────────────────
// Pixel </> code sign: cyan angle brackets, purple slash (11×7 grid, 2px pixels)
function LogoCode() {
  const C = "#4edbec";
  const P = "#9d85ff";
  const px: [number, number, string][] = [
    // <
    [2, 1, C], [1, 2, C], [0, 3, C], [1, 4, C], [2, 5, C],
    // /
    [6, 0, P], [6, 1, P], [5, 2, P], [5, 3, P], [5, 4, P], [4, 5, P], [4, 6, P],
    // >
    [8, 1, C], [9, 2, C], [10, 3, C], [9, 4, C], [8, 5, C],
  ];
  return (
    <svg width="22" height="14" viewBox="0 0 11 7" shapeRendering="crispEdges" aria-hidden="true">
      {px.map(([x, y, c]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />
      ))}
    </svg>
  );
}

// Tiny grid sprites for the menu (one char = one pixel, "." = empty)
const gridSprites = {
  chest: {
    palette: { o: "#0b0a14", b: "#b45309", d: "#78350f", y: "#facc15" },
    rows: [".oooooo.", "obbbbbbo", "obbbbbbo", "oooyyooo", "odddyddo", "oddddddo", "oddddddo", "oooooooo"],
  },
  hero: {
    palette: { o: "#0b0a14", h: "#7a5dff", s: "#f5c9a0", e: "#0b0a14" },
    rows: [".oooooo.", "ohhhhhho", "ohssssho", "osesseso", "osssssso", "osseesso", ".osssso.", "..oooo.."],
  },
} as const;

function GridSprite({ name, size }: { name: keyof typeof gridSprites; size: number }) {
  const { palette, rows } = gridSprites[name];
  const w = rows[0].length;
  const h = rows.length;
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    // merge horizontal runs of the same colour into one rect
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      if (c !== ".") {
        rects.push(
          <rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[c as keyof typeof palette]} />
        );
      }
      x += run;
    }
  });
  return (
    <svg width={(size * w) / h} height={size} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  );
}

// Pixel burger icon (the drawer has its own CloseIcon).
function BurgerIcon({ wiggle, idle = false }: { wiggle: boolean; idle?: boolean }) {
  // Three coloured bars (cyan / purple / yellow), each with a dark drop pixel.
  // Idle: every few seconds a stepped wave runs through them (works on touch,
  // where there's no hover). Hover / press: equalizer-style width wiggle.
  const bars = [
    { y: 0, c: "#4edbec", w: [7, 4, 6, 7] },
    { y: 3, c: "#c4b5ff", w: [5, 7, 3, 5] },
    { y: 6, c: "#facc15", w: [6, 3, 7, 6] },
  ];
  return (
    <svg width="18" height="16" viewBox="0 0 9 8" shapeRendering="crispEdges" aria-hidden="true" overflow="visible">
      {bars.map((b, i) => (
        <motion.g
          key={b.y}
          initial={false}
          animate={idle && !wiggle ? { x: [0, 0, 1, 0, 0] } : { x: 0 }}
          transition={
            idle && !wiggle
              ? { duration: 0.5, times: [0, 0.01, 0.4, 0.8, 1], ease: stepped(3), repeat: Infinity, repeatDelay: 6, delay: 2 + i * 0.12 }
              : { duration: 0 }
          }
        >
          <motion.rect
            x={0}
            y={b.y + 1}
            height={1}
            fill="#05040b"
            initial={false}
            animate={{ width: wiggle ? b.w : b.w[0] }}
            transition={wiggle ? { duration: 0.6, repeat: Infinity, ease: stepped(4) } : { duration: 0 }}
          />
          <motion.rect
            x={0}
            y={b.y}
            height={1}
            fill={b.c}
            initial={false}
            animate={{ width: wiggle ? b.w : b.w[0] }}
            transition={wiggle ? { duration: 0.6, repeat: Infinity, ease: stepped(4) } : { duration: 0 }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

// Purple pixel X for the drawer's close button: highlight + body + dark drop
// pixels. Just pops in when the drawer opens — kept calm on purpose.
function CloseIcon() {
  const X = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [6, 0], [5, 1], [4, 2], [2, 4], [1, 5], [0, 6]];
  return (
    <motion.span
      className="flex"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2, ease: stepped(3) }}
    >
      <svg width="16" height="16" viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
        {X.map(([x, y]) => <rect key={`s${x}-${y}`} x={x + 1} y={y + 1} width={1} height={1} fill="#05040b" />)}
        {X.map(([x, y]) => <rect key={`b${x}-${y}`} x={x} y={y} width={1} height={1} fill="#c4b5ff" />)}
        <rect x={0} y={0} width={1} height={1} fill="#ffffff" />
        <rect x={6} y={0} width={1} height={1} fill="#ffffff" />
      </svg>
    </motion.span>
  );
}

// Bouncing pixel cursor (5×7 ▶)
function PixelCursor({ animate }: { animate: boolean }) {
  return (
    <motion.svg
      width="8" height="12" viewBox="0 0 4 6" shapeRendering="crispEdges" aria-hidden="true"
      animate={animate ? { x: [0, 3, 0] } : undefined}
      transition={{ duration: 0.6, repeat: Infinity, ease: stepped(2) }}
    >
      <rect x={0} y={0} width={1} height={6} fill="#facc15" />
      <rect x={1} y={1} width={1} height={4} fill="#facc15" />
      <rect x={2} y={2} width={1} height={2} fill="#facc15" />
    </motion.svg>
  );
}

const Header = () => {
  const currentPath = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [burgerHover, setBurgerHover] = useState(false);
  const activeIdx = Math.max(0, navItems.findIndex((i) => i.href === currentPath));
  const [selected, setSelected] = useState(activeIdx);

  // Transparent at the top; solid bar once the page is scrolled
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const past = y > 8;
    if (past !== scrolled) setScrolled(past);
  });

  const openMenu = () => {
    setSelected(activeIdx);
    setOpen(true);
  };

  // Esc closes, ↑/↓ moves the cursor; lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") setSelected((s) => (s + 1) % navItems.length);
      if (e.key === "ArrowUp") setSelected((s) => (s - 1 + navItems.length) % navItems.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* ── Bar: transparent over the scene at the top of the page; once
          scrolled, a solid dark bar with a hard bevelled bottom edge fades in
          (in stepped frames — no blur, no glow). ── */}
      <header className="fixed top-0 left-0 w-full z-50">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            backgroundColor: "rgba(11,10,20,0.92)",
            boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.06), 0 2px 0 #05040b",
          }}
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.2, ease: stepped(4) }}
        />
        <div className="flex justify-between items-center max-w-4xl mx-auto px-5 py-5">
          {/* Logo */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 font-press-start text-[10px] leading-none text-[#c4b5ff] hover:text-white"
          >
            <span className="inline-flex transition-transform group-hover:-translate-y-0.5">
              <LogoCode />
            </span>
            manal.dev
          </Link>

          {/* Right: desktop nav + mobile burger */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-3" aria-label="Main">
              {navItems.map((item) => {
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-chip font-press-start text-[9px] leading-none px-3 py-2 gap-2 ${
                      active
                        ? ""
                        : // border lives in classes (not inline) so the hover can override it
                          "text-white/60 hover:text-white [--px-border:rgba(255,255,255,0.14)] hover:[--px-border:#4edbec]"
                    }`}
                    style={pxVars({
                      ...(active ? { "--px-border": "#7a5dff" } : {}),
                      "--px-bg": active ? "#7a5dff" : "#12102e",
                      ...(active ? { color: "#ffffff" } : {}),
                      ...(active ? { boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.3), 0 -2px 0 0 #7a5dff, 0 2px 0 0 #7a5dff, -2px 0 0 0 #7a5dff, 2px 0 0 0 #7a5dff" } : {}),
                    })}
                  >
                    <span className={active ? "text-white/60" : "text-white/30"}>{item.key}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Burger (mobile) — an arcade "MENU" button: coloured bars that
                do a small 1px wave now and then, equalizer wiggle on
                hover/press, sinks 2px on tap. (Toned down — no spark, no squash.) */}
            <motion.button
              className="md:hidden relative px-chip gap-2.5 h-10 pl-3 pr-3.5 cursor-pointer text-white/85 hover:text-white [--px-border:rgba(255,255,255,0.18)] hover:[--px-border:#4edbec]"
              style={pxVars({
                "--px-bg": "#12102e",
                boxShadow:
                  "inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.35), 0 -2px 0 0 var(--px-border), 0 2px 0 0 var(--px-border), -2px 0 0 0 var(--px-border), 2px 0 0 0 var(--px-border), 4px 4px 0 0 #05040b",
              } as Record<string, string>)}
              whileTap={reduce ? undefined : { y: 2 }}
              transition={{ duration: 0.12, ease: stepped(2) }}
              onHoverStart={() => setBurgerHover(true)}
              onHoverEnd={() => setBurgerHover(false)}
              onTapStart={() => setBurgerHover(true)}
              onTapCancel={() => setBurgerHover(false)}
              onClick={() => {
                setBurgerHover(false);
                openMenu();
              }}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <BurgerIcon wiggle={burgerHover && !reduce} idle={!reduce} />
              <span className="font-press-start text-[8px] leading-none">MENU</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu: full-height drawer, right → left ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — flat dark, no blur */}
            <motion.div
              className="fixed inset-0 z-60 md:hidden"
              style={{ backgroundColor: "rgba(5,4,11,0.8)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer — transform-only slide (GPU), smooth ease-out */}
            <motion.aside
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed top-0 right-0 z-70 md:hidden h-dvh w-[min(86vw,340px)] flex flex-col"
              style={{
                backgroundColor: "#0f0d26",
                // hard pixel edge on the left: purple border + bevel, no blur
                boxShadow: "-4px 0 0 0 #7a5dff, -8px 0 0 0 #05040b, inset 3px 0 0 rgba(255,255,255,0.06)",
                willChange: "transform",
              }}
              initial={{ x: "105%" }}
              animate={{ x: 0 }}
              exit={{ x: "105%" }}
              transition={reduce ? { duration: 0 } : { duration: 0.38, ease: smooth }}
            >
              {/* Title bar — "PAUSED" game menu + close */}
              <div className="flex items-center justify-between px-5 py-5" style={{ backgroundColor: "#16123a" }}>
                <div className="flex items-center gap-3">
                  <motion.span
                    className="flex gap-0.75"
                    aria-hidden="true"
                    animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 0.51, 1] }}
                  >
                    <span className="block w-1 h-3 bg-[#facc15]" />
                    <span className="block w-1 h-3 bg-[#facc15]" />
                  </motion.span>
                  <span className="font-press-start text-[11px] leading-none text-white">PAUSED</span>
                </div>
                  {/* Close — matching arcade button: purple pixel X that pops in,
                      sinks on tap */}
                  <motion.button
                    className="relative px-chip gap-2 h-10 pl-3 pr-3 cursor-pointer text-white [--px-border:#7a5dff] hover:[--px-border:#4edbec]"
                    style={pxVars({
                      "--px-bg": "#12102e",
                      boxShadow:
                        "inset 0 2px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.35), 0 -2px 0 0 var(--px-border), 0 2px 0 0 var(--px-border), -2px 0 0 0 var(--px-border), 2px 0 0 0 var(--px-border), 4px 4px 0 0 #05040b",
                    })}
                    whileTap={reduce ? undefined : { y: 2 }}
                    transition={{ duration: 0.12, ease: stepped(2) }}
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <CloseIcon />
                    <span className="font-press-start text-[8px] leading-none text-[#c4b5ff]">ESC</span>
                  </motion.button>
              </div>

              {/* Items — drop in one by one, cursor bounces on the selected one */}
              <nav className="flex flex-col gap-4 px-5 pt-7" aria-label="Main">
                <span className="font-press-start text-[8px] text-white/35 mb-1">SELECT STAGE</span>
                {navItems.map((item, idx) => {
                  const active = currentPath === item.href;
                  const isSel = selected === idx;
                  return (
                    <motion.div
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + idx * 0.07, duration: 0.35, ease: smooth }}
                      className="px-outer flex items-center gap-2 -ml-1"
                    >
                      <span className="w-3 flex justify-center shrink-0">
                        {isSel && <PixelCursor animate={!reduce} />}
                      </span>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setSelected(idx)}
                        onFocus={() => setSelected(idx)}
                        aria-current={active ? "page" : undefined}
                        className="px-panel flex-1 flex items-center gap-3 px-3 py-3 active:translate-y-0.5"
                        style={pxVars({
                          "--px-border": active ? "#7a5dff" : isSel ? "#4edbec" : "rgba(255,255,255,0.14)",
                          "--px-bg": active ? "#7a5dff" : "#12102e",
                        })}
                      >
                        <span
                          className="px-chip justify-center w-9 h-9 shrink-0"
                          style={pxVars({ "--px-bg": "#0a0920", "--px-border": active ? "#0a0920" : "rgba(255,255,255,0.2)" })}
                        >
                          <GridSprite name={item.sprite} size={20} />
                        </span>
                        <span className="flex flex-col gap-1.5 min-w-0">
                          <span className={`font-press-start text-[10px] leading-none ${active ? "text-white" : "text-white/80"}`}>
                            {item.label}
                          </span>
                          <span className={`font-pixel text-[18px] leading-none ${active ? "text-white/80" : "text-white/45"}`}>
                            {item.desc}
                          </span>
                        </span>
                        <span
                          className={`ml-auto font-press-start text-[8px] leading-none ${active ? "text-white/70" : "text-white/30"}`}
                        >
                          {active ? "HERE" : item.key}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom: socials + resume */}
              <motion.div
                className="mt-auto px-5 pb-8 flex flex-col gap-5"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35, ease: smooth }}
              >
                <div className="flex items-center gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="px-chip justify-center w-11 h-11 text-white/60 hover:text-[#4edbec] [--px-border:rgba(255,255,255,0.14)] hover:[--px-border:#4edbec]"
                      style={pxVars({ "--px-bg": "#12102e" })}
                    >
                      <i className={`lab ${s.icon} text-2xl`} />
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="px-btn font-press-start text-[10px] py-4 w-[calc(100%-12px)] cursor-pointer inline-flex items-center justify-center gap-2 text-[#0f0d1b]"
                  style={pxVars({ "--px-bg": "#facc15", "--px-border": "#facc15", "--px-shadow": "#a16207" })}
                >
                  ▶︎ RESUME
                </button>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
