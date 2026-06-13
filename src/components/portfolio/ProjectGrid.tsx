"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "@/types";
import TypingTitle from "@/components/TypingTitle";

// ── DEMO DATA — replace with real projects ──────────────────────────────
const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    category: "E-COMMERCE",
    year: "2024",
    description: "Demo project. A complete online store with cart, checkout, subscriptions and an admin dashboard. Replace this text with your real project description.",
    features: ["Online payments", "Subscription service", "Admin dashboard"],
    link: "#",
    shipped: false,
  },
  {
    title: "Payment Gateway Plugin",
    category: "PLUGIN",
    year: "2023",
    description: "Demo project. Drop-in payment solution for WordPress + WooCommerce stores supporting multiple local payment providers.",
    features: ["QPay", "SocialPay", "Bank cards", "Corporate gateway"],
    link: "#",
    shipped: true,
  },
  {
    title: "Sports Federation Portal",
    category: "WEB APP",
    year: "2022",
    description: "Demo project. Tournament registration, live results, athlete profiles and ranking calculations for a sports federation.",
    features: ["Athlete profiles", "Tournament registry", "Rankings"],
    link: "#",
    shipped: true,
  },
  {
    title: "Online Music Store",
    category: "E-COMMERCE",
    year: "2020",
    description: "Demo project. Digital + physical music sales with artist catalogs, streaming previews and sales reporting.",
    features: ["Digital downloads", "Online radio", "Sales reports"],
    link: "#",
    shipped: true,
  },
  {
    title: "Hotel Booking System",
    category: "WEB APP",
    year: "2018",
    description: "Demo project. Room availability, reservations and payment flow for a chain of hotels.",
    features: ["Room calendar", "Reservations", "Payments"],
    link: "#",
    shipped: true,
  },
  {
    title: "Delivery Tracking App",
    category: "MOBILE",
    year: "2021",
    description: "Demo project. Real-time courier tracking with driver assignment and customer notifications.",
    features: ["Live map", "Driver assignment", "Push notifications"],
    link: "#",
    shipped: true,
  },
  {
    title: "Learning Management System",
    category: "WEB APP",
    year: "2021",
    description: "Demo project. Online courses with video lessons, quizzes, certificates and student progress tracking.",
    features: ["Video lessons", "Quizzes", "Certificates"],
    link: "#",
    shipped: true,
  },
  {
    title: "Restaurant POS Dashboard",
    category: "DASHBOARD",
    year: "2019",
    description: "Demo project. Order management, table reservations and daily sales analytics for restaurants.",
    features: ["Order management", "Reservations", "Sales analytics"],
    link: "#",
    shipped: true,
  },
  {
    title: "News & Magazine Site",
    category: "WEBSITE",
    year: "2017",
    description: "Demo project. High-traffic news portal with categories, tags, editor workflow and ad placements.",
    features: ["Editor workflow", "Ad placements", "SEO"],
    link: "#",
    shipped: true,
  },
  {
    title: "Company Landing Page",
    category: "WEBSITE",
    year: "2016",
    description: "Demo project. Fast, simple marketing site with a CMS so the client can edit content themselves.",
    features: ["CMS editing", "SEO basics", "Contact form"],
    link: "#",
    shipped: true,
  },
];
// ────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

// Category colors are assigned automatically from this palette, in order
// of first appearance in the data — new categories just work.
const palette = ["#4edbec", "#c084fc", "#60a5fa", "#4ade80", "#facc15", "#94a3b8"];

const dim   = (hex: string) => `${hex}73`; // ~45% alpha
const faint = (hex: string) => `${hex}14`; // ~8% alpha

const categories = [...new Set(projects.map((p) => p.category))];
const categoryColor: Record<string, string> = Object.fromEntries(
  categories.map((c, i) => [c, palette[i % palette.length]])
);

function Scanlines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)" }}
    />
  );
}

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const color = categoryColor[project.category] ?? palette[palette.length - 1];
  const inDev = !project.shipped;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="select-none"
    >
      {/* Outer dark pixel frame */}
      <div style={{ padding: "3px", backgroundColor: "#07060e" }} className="h-full">
        <div
          className="h-full flex flex-col"
          style={{
            border: `2px solid ${hovered ? color : dim(color)}`,
            backgroundColor: hovered ? "#0f0d26" : "#12102e",
            transition: "border-color 0.06s, background-color 0.06s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Scanlines />

          {/* In-dev — animated top edge */}
          {inDev && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-20"
              style={{ height: 2, backgroundColor: color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}

          {/* Header strip */}
          <div
            style={{ backgroundColor: "#0d0b22", borderBottom: `1px solid ${dim(color)}` }}
            className="flex items-center justify-between px-4 py-2.5 relative z-10 flex-wrap gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-press-start text-[9px] px-2 py-0.5"
                style={{ color, border: `1px solid ${dim(color)}`, backgroundColor: faint(color) }}>
                {project.category}
              </span>
              {inDev ? (
                <motion.span
                  className="font-press-start text-[9px] px-2 py-0.5"
                  style={{ color, border: `1px solid ${dim(color)}`, backgroundColor: faint(color) }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ⚒︎ IN DEV
                </motion.span>
              ) : (
                <span className="font-press-start text-[9px] px-2 py-0.5"
                  style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  ✓ SHIPPED
                </span>
              )}
            </div>
            <span className="font-press-start text-[9px]" style={{ color: "rgba(255,255,255,0.28)" }}>
              {project.year}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 relative z-10 flex-1 flex flex-col">
            <h3 className="font-press-start text-[13px] text-white mb-3 leading-relaxed">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm font-mono leading-relaxed mb-4">
              {project.description}
            </p>
            <ul className="flex flex-col gap-1.5">
              {project.features.map((f) => (
                <li key={f} className="text-sm font-mono leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <span style={{ color }}>⬥</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div
            style={{ backgroundColor: "#0d0b22", borderTop: `1px solid ${dim(color)}` }}
            className="px-4 py-2 flex items-center justify-between relative z-10"
          >
            <span className="font-press-start text-[7px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              PROJECT #{String(idx + 1).padStart(2, "0")}
            </span>
            {project.link && (
              <motion.a
                href={project.link}
                target={project.link.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="font-press-start text-[8px] px-2.5 py-1.5 cursor-pointer"
                style={{
                  color: hovered ? "#0f0d1b" : color,
                  backgroundColor: hovered ? color : faint(color),
                  border: `1px solid ${hovered ? color : dim(color)}`,
                  boxShadow: hovered ? `0 0 12px ${dim(color)}` : "none",
                  transition: "color 0.06s, background-color 0.06s, border-color 0.06s, box-shadow 0.06s",
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
  );
}

// Pixel-framed pagination button
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

export default function ProjectGrid() {
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {visible.map((project) => {
            const globalIdx = projects.indexOf(project);
            return <ProjectCard key={`${currentPage}-${project.title}`} project={project} idx={globalIdx} />;
          })}
        </div>
      ) : (
        /* Empty state */
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
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
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
          SHOWING {visible.length} / {filtered.length} PROJECTS
          {filtered.length !== projects.length && ` (${projects.length} TOTAL)`}
          {" "}— PAGE {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
}
