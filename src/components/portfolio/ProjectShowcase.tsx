"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/types";
import TypingTitle from "@/components/TypingTitle";

// ── DEMO DATA — replace with real projects ──────────────────────────────
// Add `image: "/images/projects/your-shot.png"` to show a real screenshot.
// `featured: true` pins a project as the full-width hero banner.
const projects: Project[] = [
  {
    title: "Game Achievement tracking app",
    category: "WEB APP",
    year: "2026",
    description: "For completionist gamers, securing a platinum trophy or hitting 100% execution requires a lot of meticulous planning to avoid missable achievements. This platform solves that headache. By letting users sync their personal gaming accounts, the application scans their real-time progress and serves up curated guides and critical checklists exactly when they need them. This is the foundation for a larger, feature-rich ecosystem focused on deep video game analytics and community tools.",
    features: ["Sync with PSN/Steam", "Progress tracking", "AI guide", "E-commerce"],
    link: "#",
    image: "",
    shipped: false, featured: true, },
  {
    title: "Wave X Motion - LMS",
    category: "LMS",
    year: "2026",
    description: "This project is an online educational platform built for creators looking to master professional video production from scratch. Instead of scattered tutorials, the system organizes the entire filmmaking pipeline into comprehensive learning paths—taking students from pre-production (lighting and set prep) to shooting (cinematography) and post-production (editing and color grading).",
    features: ["Learning management system", "Online payments"],
    link: "https://wavexmotion.mn",
    shipped: true,  },
  {
    title: "Beauty Secrets - E-Commerce Platform",
    category: "E-COMMERCE",
    year: "2023",
    description: "This is a full-scale e-commerce platform built to handle the specific, nuanced needs of the beauty and skincare retail industry. Instead of relying on rigid, out-of-the-box solutions, I custom-developed several core business features from scratch. This includes an automated monthly recurring subscription model for skincare packages, and a dynamic loyalty ecosystem that automatically tiers users and applies member-specific privileges based on quarterly purchase tracking.",
    features: ["Subscription service",  "Online payments", "Loyalty/Membership system","Digital wallet", "Affiliate", "Giftcard", "Admin dashboard"],
    link: "https://beautysecrets.mn",
    shipped: true,
  },
  {
    title: "Payment Gateways for Woocommerce",
    category: "PLUGIN",
    year: "2023",
    description: "I built a custom WooCommerce plugin to bridge the gap between global e-commerce platforms and the Mongolian banking ecosystem. It provides local online merchants with a reliable, ready-to-use checkout experience by integrating the country’s major payment networks, including Khan Bank, Golomt Bank (along with SocialPay), TDB, QPay, and Storepay.",
    features: ["QPay", "SocialPay", "Storepay", "Bank cards"],
    link: "#",
    shipped: true,  },
  {
    title: "MUE E-commerce",
    category: "E-COMMERCE",
    year: "2026",
    description: "This is an e-commerce web application built for a retail clothing and apparel business. The project covers the essential pipeline of modern online retail: from an optimized, responsive user interface for browsing apparel collections to a secure checkout system.",
    features: ["Storefront & Cataloging", "Online payments"],
    link: "mue.mn",
    shipped: true,  }
];
// ────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

const palette = ["#4edbec", "#c084fc", "#60a5fa", "#4ade80", "#facc15", "#94a3b8"];

const dim   = (hex: string) => `${hex}73`; // ~45% alpha
const faint = (hex: string) => `${hex}14`; // ~8% alpha

const categories = [...new Set(projects.map((p) => p.category))];
const categoryColor: Record<string, string> = Object.fromEntries(
  categories.map((c, i) => [c, palette[i % palette.length]])
);

function Scanlines({ z = 10, opacity = 0.07 }: { z?: number; opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: z,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,${opacity}) 3px, rgba(0,0,0,${opacity}) 4px)`,
      }}
    />
  );
}

// Loot-drop entrance: top→bottom clip reveal of the card. Overscan insets so the
// final state never clips the hover offset-shadow.
const revealHidden  = "inset(-12px -12px 100% -12px)";
const revealShown   = "inset(-12px -12px -12px -12px)";

// Bright scan line that rides the reveal's leading edge, like a save-file load.
function SweepLine({ inView, delay = 0, duration = 0.55 }: { inView: boolean; delay?: number; duration?: number }) {
  return (
    <motion.div
      className="absolute inset-x-0 pointer-events-none"
      style={{
        zIndex: 50,
        height: 26,
        mixBlendMode: "screen",
        background: "linear-gradient(to bottom, transparent, rgba(140,232,255,0.22))",
        borderBottom: "2px solid rgba(228,255,255,0.95)",
      }}
      initial={{ top: "-26px", opacity: 0 }}
      animate={inView ? { top: ["-26px", "100%"], opacity: [0, 1, 1, 0] } : {}}
      transition={{ delay, duration, ease: "linear", times: [0, 0.1, 0.84, 1] }}
    />
  );
}

// Themed placeholder drawn from the project — used until a real screenshot is set.
function CoverPlaceholder({ project, color, idx }: { project: Project; color: string; idx: number }) {
  const initials = project.title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: `radial-gradient(circle at 50% 120%, ${color}40 0%, #0d0b22 60%), #0a0918` }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${dim(color)} 1px, transparent 1px), linear-gradient(90deg, ${dim(color)} 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
        }}
      />
      <span className="font-press-start text-white/15 select-none" style={{ fontSize: 42 }}>
        {initials}
      </span>
      <span className="absolute bottom-2 right-3 font-press-start text-[8px]" style={{ color: `${color}66` }}>
        #{String(idx + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

// Shared cover (image or placeholder) with a CRT power-on reveal + hover zoom.
// On scroll-in: brightness flash + horizontal jitter + RGB chromatic split that
// settles, plus a sync-roll bar sweeping down and a one-frame white flash.
function Cover({ project, idx, hovered, inView, delay }: {
  project: Project; idx: number; hovered: boolean; inView: boolean; delay: number;
}) {
  const catColor = categoryColor[project.category] ?? palette[palette.length - 1];
  return (
    <>
      {/* Picture layer — CRT boot-up glitch */}
      <motion.div
        className="absolute inset-0"
        style={{ height: "100%", width: "100%" }}
        initial={{ opacity: 0, x: 0, scale: 1.04 }}
        animate={inView ? {
          opacity: [0, 1, 1, 1, 1, 1],
          x: [0, -7, 5, -3, 1, 0],
          scale: [1.05, 1.04, 1.03, 1.03, 1.01, 1],
          filter: [
            "brightness(0.15) saturate(0.3) contrast(1.2)",
            "brightness(2.3) saturate(1.5) contrast(1.4) drop-shadow(3px 0 0 rgba(255,0,76,0.85)) drop-shadow(-3px 0 0 rgba(0,229,255,0.85))",
            "brightness(0.8) saturate(1)",
            "brightness(1.3) saturate(1) drop-shadow(2px 0 0 rgba(255,0,76,0.5)) drop-shadow(-2px 0 0 rgba(0,229,255,0.5))",
            "brightness(0.95) saturate(1)",
            "brightness(1) saturate(1)",
          ],
        } : {}}
        transition={{ delay, duration: 0.6, times: [0, 0.12, 0.3, 0.5, 0.75, 1], ease: "easeOut" }}
      >
        {project.image ? (
          project.imageFit === "contain" ? (
            <>
              {/* Blurred fill so a portrait/tall shot doesn't leave dead space in the wide slot */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "blur(18px) brightness(0.45)", transform: "scale(1.15)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-contain"
                style={{ transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.25s ease" }}
              />
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.25s ease" }}
            />
          )
        ) : (
          <CoverPlaceholder project={project} color={catColor} idx={idx} />
        )}
      </motion.div>

      {/* Sync-roll bar — bright band sweeping top → bottom, once */}
      <motion.div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          zIndex: 24,
          height: "20%",
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.22), transparent)",
          mixBlendMode: "screen",
        }}
        initial={{ top: "-22%", opacity: 0 }}
        animate={inView ? { top: ["-22%", "110%"], opacity: [0, 1, 1, 0] } : {}}
        transition={{ delay: delay + 0.04, duration: 0.5, ease: "linear" }}
      />

      {/* Power-on white flash */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-white"
        style={{ zIndex: 25 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 0.55, 0] } : {}}
        transition={{ delay, duration: 0.22, times: [0, 0.25, 1] }}
      />
    </>
  );
}

// Badges that sit over the cover (category / status / year).
function CoverBadges({ project }: { project: Project }) {
  const catColor = categoryColor[project.category] ?? palette[palette.length - 1];
  const inDev = !project.shipped;
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 z-20 pointer-events-none"
        style={{ height: "55%", background: "linear-gradient(to bottom, rgba(7,6,14,0.85), transparent)" }}
      />
      <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-2">
        <span className="font-press-start text-[8px] px-2 py-0.5"
          style={{ color: catColor, border: `1px solid ${dim(catColor)}`, backgroundColor: "rgba(7,6,14,0.7)" }}>
          {project.category}
        </span>
        {inDev ? (
          <motion.span className="font-press-start text-[8px] px-2 py-0.5"
            style={{ color: catColor, border: `1px solid ${dim(catColor)}`, backgroundColor: "rgba(7,6,14,0.7)" }}
            animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            ⚒︎ IN DEV
          </motion.span>
        ) : (
          <span className="font-press-start text-[8px] px-2 py-0.5"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(7,6,14,0.7)" }}>
            ✓ SHIPPED
          </span>
        )}
      </div>
      <span className="absolute top-2.5 right-2.5 z-30 font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.55)" }}>
        {project.year}
      </span>
    </>
  );
}

// ── Standard grid card ──────────────────────────────────────────────────
function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const color = categoryColor[project.category] ?? palette[palette.length - 1];
  const inDev = !project.shipped;
  const delay = (idx % PAGE_SIZE) * 0.06;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="select-none relative"
    >
      <motion.div
        initial={{ clipPath: revealHidden }}
        animate={inView ? { clipPath: revealShown } : {}}
        transition={{ delay: delay + 0.05, duration: 0.5, ease: "easeOut" }}
      >
      <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
        <div
          className="flex flex-col"
          style={{
            border: `2px solid ${hovered ? color : dim(color)}`,
            backgroundColor: hovered ? "#0f0d26" : "#12102e",
            boxShadow: hovered ? `4px 4px 0 #07060e` : "none",
            transition: "border-color 0.08s, background-color 0.08s, box-shadow 0.08s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {inDev && (
            <motion.div className="absolute top-0 left-0 right-0 z-30" style={{ height: 2, backgroundColor: color }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          )}

          {/* Cover */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10", borderBottom: `2px solid ${dim(color)}` }}>
            <Cover project={project} idx={idx} hovered={hovered} inView={inView} delay={delay + 0.15} />
            <Scanlines z={20} opacity={hovered ? 0.05 : 0.12} />
            <CoverBadges project={project} />
            {/* ribbon driven by card hover */}
            {project.link && (
              <motion.a
                href={project.link}
                target={project.link.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center font-press-start text-[9px] py-2.5 cursor-pointer"
                style={{ color: "#0f0d1b", backgroundColor: color }}
                initial={{ y: "100%" }}
                animate={{ y: hovered ? "0%" : "100%" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                VIEW PROJECT ▶︎
              </motion.a>
            )}
          </div>

          {/* Body */}
          <div className="p-5 relative flex-1 flex flex-col" style={{ zIndex: 5 }}>
            <Scanlines z={0} opacity={0.06} />
            <h3 className="relative font-press-start text-[12px] text-white mb-3 leading-relaxed" style={{ zIndex: 1 }}>
              {project.title}
            </h3>
            <p className="relative text-gray-400 text-sm font-mono leading-relaxed mb-4" style={{ zIndex: 1 }}>
              {project.description}
            </p>
            <ul className="relative flex flex-wrap gap-x-3 gap-y-1.5 mt-auto" style={{ zIndex: 1 }}>
              {project.features.map((f) => (
                <li key={f} className="text-[13px] font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <span style={{ color }}>⬥</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: "#0d0b22", borderTop: `1px solid ${dim(color)}` }}
            className="px-4 py-2 flex items-center justify-between relative">
            <span className="font-press-start text-[7px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              PROJECT #{String(idx + 1).padStart(2, "0")}
            </span>
            <span className="font-press-start text-[7px]" style={{ color: dim(color) }}>
              {project.shipped ? "▰▰▰▰ 100%" : "▰▰▱▱ WIP"}
            </span>
          </div>
        </div>
      </div>
      </motion.div>
      <SweepLine inView={inView} delay={delay + 0.05} />
    </motion.div>
  );
}

// ── Full-width featured hero banner ─────────────────────────────────────
function FeaturedCard({ project, idx }: { project: Project; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const color = categoryColor[project.category] ?? palette[palette.length - 1];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="select-none mb-8"
    >
      <div className="mb-2 flex items-center gap-2">
        <motion.span className="font-press-start text-[9px]" style={{ color }}
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          ★ FEATURED QUEST
        </motion.span>
        <span className="flex-1 h-px" style={{ backgroundColor: dim(color) }} />
      </div>

      <div className="relative">
      <motion.div
        initial={{ clipPath: revealHidden }}
        animate={inView ? { clipPath: revealShown } : {}}
        transition={{ delay: 0.05, duration: 0.55, ease: "easeOut" }}
      >
      <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
        <div
          className="flex flex-col md:flex-row"
          style={{
            border: `2px solid ${hovered ? color : dim(color)}`,
            backgroundColor: "#100e28",
            boxShadow: hovered ? `5px 5px 0 #07060e` : "3px 3px 0 #07060e",
            transition: "border-color 0.08s, box-shadow 0.1s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cover — left */}
          <div className="relative overflow-hidden md:w-1/2" style={{ aspectRatio: "16 / 10" }}>
            <Cover project={project} idx={idx} hovered={hovered} inView={inView} delay={0.15} />
            <Scanlines z={20} opacity={hovered ? 0.05 : 0.12} />
            <CoverBadges project={project} />
          </div>

          {/* Content — right */}
          <div className="relative flex-1 flex flex-col p-6 md:p-7" style={{ zIndex: 5 }}>
            <Scanlines z={0} opacity={0.06} />
            <h3 className="relative font-press-start text-[15px] md:text-[17px] text-white mb-4 leading-relaxed" style={{ zIndex: 1 }}>
              {project.title}
            </h3>
            <p className="relative text-gray-300 text-sm md:text-[15px] font-mono leading-relaxed mb-5" style={{ zIndex: 1 }}>
              {project.description}
            </p>
            <ul className="relative flex flex-wrap gap-x-4 gap-y-2 mb-6" style={{ zIndex: 1 }}>
              {project.features.map((f) => (
                <li key={f} className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <span style={{ color }}>⬥</span> {f}
                </li>
              ))}
            </ul>
            {project.link && (
              <motion.a
                href={project.link}
                target={project.link.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="relative font-press-start text-[10px] px-4 py-3 self-start cursor-pointer mt-auto"
                style={{
                  zIndex: 1,
                  color: hovered ? "#0f0d1b" : color,
                  backgroundColor: hovered ? color : faint(color),
                  border: `2px solid ${hovered ? color : dim(color)}`,
                  transition: "color 0.08s, background-color 0.08s, border-color 0.08s",
                }}
                whileTap={{ scale: 0.97 }}
              >
                VIEW PROJECT ▶︎
              </motion.a>
            )}
          </div>
        </div>
      </div>
      </motion.div>
      <SweepLine inView={inView} delay={0.05} duration={0.6} />
      </div>
    </motion.div>
  );
}

function PixelButton({ children, onClick, disabled, active }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = !disabled && (active || hovered);

  return (
    <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="font-press-start text-[9px] px-3 py-2.5"
        style={{
          backgroundColor: lit ? "#0d1220" : "#12102e",
          border: `2px solid ${lit ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.08)"}`,
          color: disabled ? "rgba(255,255,255,0.15)" : lit ? "#60a5fa" : "rgba(255,255,255,0.45)",
          cursor: disabled ? "default" : "pointer",
          transition: "border-color 0.06s, background-color 0.06s, color 0.06s",
        }}
      >
        {children}
      </button>
    </div>
  );
}

export default function ProjectShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [focused, setFocused] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = projects.filter((p) => {
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchesCategory = category === "ALL" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  // Featured banner only when browsing unfiltered (page 1, ALL, no query) —
  // otherwise the pinned project just lives in the grid like the rest.
  const featured = projects.find((p) => p.featured);
  const showFeatured = !!featured && category === "ALL" && !q;

  const gridSource = showFeatured ? filtered.filter((p) => p !== featured) : filtered;
  const totalPages = Math.max(1, Math.ceil(gridSource.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = gridSource.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const setCategoryFilter = (c: string) => {
    setCategory(c);
    setPage(1);
  };

  return (
    <div ref={ref} className="max-w-4xl mx-auto px-5 pb-20">
      <div className="mb-4 text-center">
        <h2 className="font-press-start text-white text-lg tracking-wider">
          <TypingTitle text="[ PROJECTS ]" inView={isInView} />
        </h2>
      </div>

      <motion.p
        className="text-center text-gray-400 text-sm font-mono mb-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        A quest log of things I&apos;ve built. Search or filter to explore.
      </motion.p>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-4"
      >
        <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
          <div
            className="flex items-center gap-3 px-4"
            style={{
              backgroundColor: focused ? "#0b1a1d" : "#12102e",
              border: `2px solid ${focused ? "#4edbec" : "rgba(255,255,255,0.08)"}`,
              transition: "border-color 0.06s, background-color 0.06s",
            }}
          >
            <span className="font-press-start text-[10px]" style={{ color: focused ? "#4edbec" : "rgba(255,255,255,0.3)" }}>
              &gt;
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="SEARCH PROJECTS..."
              className="w-full bg-transparent outline-none font-press-start text-[10px] py-3.5 text-white placeholder:text-white/25"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setPage(1); }}
                className="font-press-start text-[10px] cursor-pointer"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category filter chips */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <button
          onClick={() => setCategoryFilter("ALL")}
          className="font-press-start text-[9px] px-2 py-1 cursor-pointer"
          style={{
            color: category === "ALL" ? "#4edbec" : "rgba(255,255,255,0.4)",
            border: `1px solid ${category === "ALL" ? "rgba(78,219,236,0.5)" : "rgba(255,255,255,0.12)"}`,
            backgroundColor: category === "ALL" ? "rgba(78,219,236,0.08)" : "transparent",
          }}
        >
          ALL
        </button>
        {categories.map((c) => {
          const isOn = category === c;
          const color = categoryColor[c];
          return (
            <button
              key={c}
              onClick={() => setCategoryFilter(isOn ? "ALL" : c)}
              className="font-press-start text-[9px] px-2 py-1 cursor-pointer"
              style={{
                color: isOn ? color : "rgba(255,255,255,0.4)",
                border: `1px solid ${isOn ? dim(color) : "rgba(255,255,255,0.12)"}`,
                backgroundColor: isOn ? faint(color) : "transparent",
              }}
            >
              {c}
            </button>
          );
        })}
      </motion.div>

      {/* Featured banner */}
      {showFeatured && featured && (
        <FeaturedCard project={featured} idx={projects.indexOf(featured)} />
      )}

      {/* Masonry grid — CSS columns so cards size to their own content
          (variable description length) instead of stretching to match a row. */}
      {visible.length > 0 ? (
        <div className="columns-1 md:columns-2" style={{ columnGap: "1rem" }}>
          {visible.map((project) => {
            const globalIdx = projects.indexOf(project);
            return (
              <div key={`${currentPage}-${project.title}`} className="mb-4 break-inside-avoid">
                <ProjectCard project={project} idx={globalIdx} />
              </div>
            );
          })}
        </div>
      ) : !showFeatured ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ padding: "3px", backgroundColor: "#07060e" }}>
            <div
              className="flex flex-col items-center justify-center gap-4 py-16 px-6"
              style={{ border: "2px solid rgba(255,255,255,0.08)", backgroundColor: "#0d0b22" }}
            >
              <span className="font-press-start text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                ✕ NO RESULTS FOUND
              </span>
              <span className="font-mono text-sm text-gray-500 text-center">
                No projects match your search. Try a different keyword or category.
              </span>
              <button
                onClick={() => { setQuery(""); setCategoryFilter("ALL"); }}
                className="font-press-start text-[9px] px-3 py-2 cursor-pointer"
                style={{ color: "#4edbec", border: "1px solid rgba(78,219,236,0.5)", backgroundColor: "rgba(78,219,236,0.08)" }}
              >
                ↺ RESET FILTERS
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Pagination */}
      {gridSource.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <PixelButton onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>
            ◀︎ PREV
          </PixelButton>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PixelButton key={i} onClick={() => setPage(i + 1)} active={currentPage === i + 1}>
              {i + 1}
            </PixelButton>
          ))}
          <PixelButton onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>
            NEXT ▶︎
          </PixelButton>
        </div>
      )}

      {/* Results counter */}
      <div className="mt-4 text-center">
        <span className="font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          SHOWING {visible.length + (showFeatured ? 1 : 0)} / {filtered.length} PROJECTS
          {filtered.length !== projects.length && ` (${projects.length} TOTAL)`}
          {" "}— PAGE {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
}
