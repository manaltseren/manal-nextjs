"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const nameChars = Array.from("MANALAA Bold");

const socials = [
  { href: "https://www.linkedin.com/in/manaltseren-b-5883b214b/", icon: "la-linkedin",        label: "LinkedIn",  hover: "hover:text-[#4edbec] hover:border-[#4edbec]/60" },
  { href: "https://www.instagram.com/manal.dev/",                 icon: "la-instagram",       label: "Instagram", hover: "hover:text-[#c084fc] hover:border-[#c084fc]/60" },
  { href: "https://www.facebook.com/noirmn",                      icon: "la-facebook-square", label: "Facebook",  hover: "hover:text-[#60a5fa] hover:border-[#60a5fa]/60" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const charVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

// Floating pixel sparkle dot
function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1"
      style={{ left: x, top: y, backgroundColor: "#7a5dff" }}
      animate={{ opacity: [0, 1, 0], y: [0, -12, -20], scale: [0.5, 1, 0.3] }}
      transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

function calcYearXP() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1).getTime();
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime();
  return Math.round(((now.getTime() - start) / (end - start)) * 10000);
}

export default function HeroAvatar() {
  const level = new Date().getFullYear() - 2013;
  const targetXP = calcYearXP();
  const xpPercent = Math.round(targetXP / 100);
  const [xpCount, setXpCount] = useState(0);
  const [btnHover, setBtnHover] = useState(false);

  // On mobile, open the Facebook app (deep link) and fall back to the web page
  // if it isn't installed. On desktop, let the normal link through.
  const openFacebook = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    if (!isAndroid && !isIOS) return; // desktop → default href

    const web = "https://www.facebook.com/noirmn";
    e.preventDefault();

    if (isAndroid) {
      // Chrome resolves browser_fallback_url automatically if the app is absent.
      window.location.href =
        "intent://www.facebook.com/noirmn#Intent;package=com.facebook.katana;scheme=https;" +
        "S.browser_fallback_url=" + encodeURIComponent(web) + ";end";
      return;
    }

    // iOS — open the URL inside the FB app; if nothing handles fb://, fall back.
    const start = Date.now();
    setTimeout(() => {
      if (Date.now() - start < 1500) window.location.href = web;
    }, 1000);
    window.location.href = "fb://facewebmodal/f?href=" + encodeURIComponent(web);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setXpCount((prev) => {
          const next = prev + Math.ceil((targetXP - prev) / 20);
          if (next >= targetXP) { clearInterval(interval); return targetXP; }
          return next;
        });
      }, 16);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(delay);
  }, [targetXP]);

  return (
    <div className="max-w-4xl mx-auto px-5">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">

        {/* ── Left: Avatar + quick stats ── */}
        <motion.div
          className="shrink-0 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar */}
          <div style={{ width: 180 }}>

            {/* Avatar — full width of container */}
            <motion.div
              className="relative"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {/* Pulsing glow ring */}
              <motion.div
                className="absolute -inset-2"
                style={{ border: "1px solid #7a5dff" }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <div
                style={{
                  width: 180,
                  height: 180,
                  position: "relative",
                  // Character-select backdrop behind the transparent avatar
                  background: "radial-gradient(circle at 50% 38%, rgba(38,27,82,0.55) 0%, rgba(22,18,58,0.4) 55%, rgba(10,9,32,0.3) 100%)",
                  overflow: "hidden",
                }}
              >
                {/* Faint pixel grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(122,93,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(122,93,255,0.09) 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />
                {/* Ground shadow under the character */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: "20%",
                    right: "20%",
                    bottom: 6,
                    height: 12,
                    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
                  }}
                />
                <img
                  src="/images/avatar-manal.png"
                  alt="Hero Avatar"
                  style={{
                    width: 180,
                    height: 180,
                    objectFit: "cover",
                    display: "block",
                    position: "relative",
                    // Slight zoom, pushed down so the character meets the bottom edge of the frame
                    transform: "translateY(8%) scale(1.15)",
                    transformOrigin: "center bottom",
                  }}
                />
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />
              </div>

              {/* LV badge — outside the overflow-hidden frame so it can hang below */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-press-start text-[9px] px-2 py-0.5"
                style={{
                  backgroundColor: "#0f0d1b",
                  border: "1px solid rgba(250,204,21,0.5)",
                  color: "#facc15",
                  whiteSpace: "nowrap",
                }}
              >
                LV.{level}
              </div>

              {/* Floating sparkles */}
              <Sparkle x={-8} y={20} delay={0} />
              <Sparkle x={182} y={10} delay={0.7} />
              <Sparkle x={175} y={100} delay={1.4} />
              <Sparkle x={-6} y={90} delay={0.4} />
            </motion.div>

          </div>
        </motion.div>

        {/* ── Right: Info panel ── */}
        <div className="flex flex-col gap-4 flex-1 text-center md:text-left">

          {/* Name */}
          <motion.h1
            className="font-press-start text-white text-xl leading-relaxed"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {nameChars.map((char, idx) => (
              <motion.span key={idx} variants={charVariants}>
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Class + online status */}
          <motion.div
            className="flex flex-wrap items-center gap-2 justify-center md:justify-start"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.35 }}
          >
            <span
              className="font-press-start text-[9px] px-2 py-1"
              style={{
                color: "#4edbec",
                border: "1px solid rgba(78,219,236,0.4)",
                backgroundColor: "rgba(78,219,236,0.08)",
              }}
            >
              ⚔︎ FULLSTACK DEV
            </span>

            {/* Blinking online dot */}
            <span
              className="font-press-start text-[9px] px-2 py-1 flex items-center gap-1.5"
              style={{
                color: "#4ade80",
                border: "1px solid rgba(74,222,128,0.3)",
                backgroundColor: "rgba(74,222,128,0.06)",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ●
              </motion.span>
              ONLINE
            </span>
          </motion.div>

          {/* Dashed divider */}
          <div style={{ borderTop: "1px dashed rgba(255,255,255,0.08)" }} />

          {/* XP bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-press-start text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                EXPERIENCE
              </span>
              <span className="font-press-start text-[9px]" style={{ color: "#facc15" }}>
                {xpCount.toLocaleString()} / 10,000
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#0a0920",
                border: "1px solid rgba(255,255,255,0.07)",
                height: 16,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  backgroundColor: "#facc15",
                  boxShadow:
                    "inset 0 4px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 8px rgba(250,204,21,0.4)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
              />
              {[25, 50, 75].map((pct) => (
                <div
                  key={pct}
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: `${pct}%`, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Contact button + social links */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.4 }}
            className="flex flex-wrap items-center gap-3 justify-center md:justify-start mt-4"
          >
            <motion.a
              href="/vcard.vcf"
              className="font-press-start text-[9px] px-6 py-3.5 inline-flex items-center gap-2 select-none"
              style={{
                backgroundColor: btnHover ? "#c084fc" : "#12102e",
                color: btnHover ? "#0f0d1b" : "#c084fc",
                border: "2px solid #c084fc",
                // Hard pixel shadow — raised, pressable
                boxShadow: "4px 4px 0 rgba(192,132,252,0.4)",
                letterSpacing: "0.08em",
                transition: "background-color 0.06s, color 0.06s",
              }}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0 rgba(192,132,252,0.4)" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Blinking cursor prefix */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ▶︎
              </motion.span>
              CONTACT ME
            </motion.a>

            {/* Social links — pixel-framed icon buttons */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  onClick={s.label === "Facebook" ? openFacebook : undefined}
                  className={`inline-flex items-center justify-center w-11 h-11 border-2 border-white/10 bg-[#12102e] text-gray-400 transition-colors ${s.hover}`}
                >
                  <i className={`lab ${s.icon} text-2xl`} />
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
