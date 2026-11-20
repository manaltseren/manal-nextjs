'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import Confetti from './Confetti';

/* ------------------------------------------------------------------ *
 *  ЭНД ЗАСНА УУ — бүх текст, огноо, утас энэ нэг объектод байна.
 * ------------------------------------------------------------------ */
export const INVITE = {
  name: 'Н.Наранцацрал',
  /** Зураг — /public доторх зам */
  photo: '/images/invite/portrait.webp',
  /** ISO огноо — тоолуур үүнээс тоолно */
  dateISO: '2026-11-25T16:00:00+08:00',
  dateText: '2026.11.25',
  weekday: 'Лхагва',
  timeText: '16:00',
  venue: 'Байршил тодорхой болоогүй',
  venueDetail: 'Удахгүй мэдэгдэнэ',
  /** Google Maps холбоос — хоосон бол "газрын зураг" товч харагдахгүй */
  mapUrl: '',
  mapText: 'Газрын зураг дээр харах',
  message:
    'Миний амьдралын онцгой энэ өдрийг хамт өнгөрүүлж, баяр баясгаланг минь хуваалцахыг урьж байна.',
  host: 'Хүндэтгэсэн: Н.Наранцацрал',
} as const;

/* -------------------------- gold glitter -------------------------- */

/* Тогтмол (deterministic) тоосонцор — SSR ба client ижил гарна.
   Урт бутархайг браузер өөрөө богиносгодог тул hydration үед зөрөхгүйн
   тулд браузерын хэвлэдэгтэй ижил богино хэлбэрт урьдчилж бөөрөнхийлнө. */
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const hash = (i: number, seed: number) => {
  const h = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

const DUST_COLORS = ['#b8862b', '#d9a93f', '#8a6420', '#f0cf7a', '#6e4f18'];

/** Алтан шороон цацраг — зургийн зүүн дээд, баруун доод буланд */
const DUST = [
  { cx: 10, cy: 12, rx: 34, ry: 22, n: 420, seed: 1 },
  { cx: 90, cy: 76, rx: 34, ry: 30, n: 520, seed: 2 },
  { cx: 18, cy: 94, rx: 28, ry: 12, n: 200, seed: 3 },
].flatMap((c) =>
  Array.from({ length: c.n }, (_, i) => {
    // хоёр санамсаргүй тооны дундаж → төв рүүгээ шигүү үүл
    const a = hash(i, c.seed) * Math.PI * 2;
    const r = (hash(i, c.seed + 10) + hash(i, c.seed + 20)) / 2;
    const rr = Math.abs(r - 0.5) * 2;
    return {
      left: `${round(c.cx + Math.cos(a) * rr * c.rx)}%`,
      top: `${round(c.cy + Math.sin(a) * rr * c.ry)}%`,
      size: `${hash(i, c.seed + 30) > 0.7 ? 2 : 1}px`,
      color: DUST_COLORS[Math.floor(hash(i, c.seed + 40) * DUST_COLORS.length)],
      opacity: round(0.5 + hash(i, c.seed + 50) * 0.5),
    };
  }),
);

/** Том алтан бөөрөнхий цэгүүд — хажуугаар нь муруй мөр үүсгэнэ */
const DOTS = [
  // зүүн тал — доош муруйсан мөр
  ...Array.from({ length: 16 }, (_, i) => {
    const t = i / 15;
    return {
      left: `${round(3 + Math.sin(t * Math.PI) * 9 + (hash(i, 7) - 0.5) * 3)}%`,
      top: `${round(34 + t * 30 + (hash(i, 8) - 0.5) * 2)}%`,
      size: Math.round(3 + hash(i, 9) * 9),
      delay: `${round(hash(i, 11) * 4, 1)}s`,
    };
  }),
  // баруун дээд тал
  ...Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    return {
      left: `${round(84 + Math.sin(t * Math.PI * 1.2) * 8 + (hash(i, 12) - 0.5) * 3)}%`,
      top: `${round(5 + t * 28 + (hash(i, 13) - 0.5) * 2)}%`,
      size: Math.round(3 + hash(i, 14) * 9),
      delay: `${round(hash(i, 15) * 4, 1)}s`,
    };
  }),
];

/* --------------------------- countdown ---------------------------- */

// Одоогийн цаг (секундээр) — секунд бүр шинэчлэгдэнэ.
const subscribeClock = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const clockSnapshot = () => Math.floor(Date.now() / 1000) * 1000;
const serverClock = () => null;

function useCountdown(target: string) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  // hydration-safe: серверт null, mount хийсний дараа л тоо гарна
  const now = useSyncExternalStore(subscribeClock, clockSnapshot, serverClock);
  if (now === null) return null;

  const diff = Math.max(0, targetMs - now);
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/* ----------------------------- page ------------------------------- */

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Invitation() {
  const [burst, setBurst] = useState(0);
  const left = useCountdown(INVITE.dateISO);

  return (
    <div className="inv-root relative min-h-screen w-full overflow-hidden">
      <style>{`
        .inv-root { background: #050307; }
        .inv-serif { font-family: var(--font-playfair), 'Playfair Display', Georgia, serif; }
        .inv-vibes { font-family: var(--font-vibes), 'Great Vibes', cursive; }
        .inv-brush { font-family: var(--font-brush), 'Kaushan Script', cursive; }
        /* ягаан-нил → алтан өнгөт текст (урилгын загвараар) */
        .inv-grad, .inv-grad-d, .inv-gold {
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .inv-grad { background-image: linear-gradient(180deg, #9d3fd9 0%, #b468b8 42%, #e6a54a 78%, #f7d34a 100%); }
        .inv-grad-d { background-image: linear-gradient(100deg, #b05fd8 0%, #d48fa0 45%, #f2c35a 100%); }
        .inv-gold { background-image: linear-gradient(180deg, #fff3c4 0%, #f0cf7a 40%, #c9992f 75%, #f0d391 100%); }
        .inv-photo {
          border-radius: 26px;
          padding: 5px;
          background: linear-gradient(160deg, #a5743a, #6b4521 45%, #b8873f);
          box-shadow: 0 30px 70px -30px rgba(157, 63, 217, .45);
        }
        .inv-photo img { border-radius: 21px; }
        .inv-dot {
          position: absolute; border-radius: 9999px;
          background: radial-gradient(circle at 35% 30%, #fff1b8, #e3b64c 55%, #a77a22);
          animation: inv-shimmer 5s ease-in-out infinite;
        }
        .inv-dust { position: absolute; border-radius: 9999px; }
        @keyframes inv-shimmer { 0%, 100% { opacity: .95; } 50% { opacity: .5; } }
        @media (prefers-reduced-motion: reduce) { .inv-dot { animation: none !important; } }
      `}</style>

      {/* gold dust + dots */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {DUST.map((d, i) => (
          <span
            key={`d${i}`}
            className="inv-dust"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background: d.color,
              opacity: d.opacity,
            }}
          />
        ))}
        {DOTS.map((d, i) => (
          <span
            key={`o${i}`}
            className="inv-dot"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: d.delay,
            }}
          />
        ))}
      </div>

      <Confetti burst={burst} />

      {/* content */}
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
        className="relative z-30 mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center px-5 py-12 text-center sm:py-16"
      >
        <motion.h1
          variants={fade}
          className="inv-vibes inv-grad-d whitespace-nowrap px-2 pb-[0.15em] text-[clamp(2.3rem,10vw,4rem)] leading-[1.15]"
        >
          {INVITE.name}
        </motion.h1>

        {/* photo */}
        <motion.div
          variants={fade}
          className="inv-photo mt-4 w-[min(78vw,340px)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={INVITE.photo}
            alt={INVITE.name}
            width={382}
            height={528}
            className="block aspect-[382/528] w-full object-cover"
          />
        </motion.div>

        {/* Happy Birthday / Урилга */}
        <motion.div variants={fade} className="relative mt-3 select-none">
          <span className="inv-vibes inv-grad-d absolute left-[14%] top-[-0.05em] z-10 -rotate-6 text-[clamp(2.2rem,9vw,3.4rem)] leading-none">
            Happy
          </span>
          <span className="inv-brush inv-grad block pt-[0.55em] pb-[0.1em] text-[clamp(3.6rem,17vw,6.4rem)] leading-[1.05]">
            Birthday
          </span>
        </motion.div>
        <motion.p
          variants={fade}
          className="inv-serif inv-grad -mt-1 pb-[0.08em] text-[clamp(3rem,14vw,5.2rem)] leading-[1.05] font-medium"
        >
          Урилга
        </motion.p>
        <motion.p
          variants={fade}
          className="inv-serif inv-grad-d mt-1 text-[clamp(1.7rem,7.5vw,2.6rem)] leading-tight font-extrabold tabular-nums"
        >
          {INVITE.dateText}
        </motion.p>

        {/* message */}
        <motion.p
          variants={fade}
          className="inv-serif mx-auto mt-8 max-w-[430px] text-[clamp(1rem,4.4vw,1.2rem)] leading-[1.9] tracking-[0.015em] text-white/75 italic"
        >
          {INVITE.message}
        </motion.p>

        {/* weekday | time */}
        <motion.div
          variants={fade}
          className="mt-7 flex items-center justify-center gap-5 text-[13px] tracking-[0.22em] text-[#e6c98a] uppercase"
        >
          <span>{INVITE.weekday}</span>
          <span className="h-1.5 w-1.5 rotate-45 bg-[#b05fd8]" aria-hidden="true" />
          <span className="tabular-nums">{INVITE.timeText}</span>
        </motion.div>

        {/* venue */}
        <motion.div variants={fade} className="mt-6">
          <p className="inv-serif flex items-center justify-center gap-1.5 text-lg text-white/90">
            <i className="las la-map-marker-alt text-[#c98ae6]" aria-hidden="true" />
            {INVITE.venue}
          </p>
          {INVITE.venueDetail && (
            <p className="mt-1 text-sm text-white/55">{INVITE.venueDetail}</p>
          )}
          {INVITE.mapUrl && (
            <a
              href={INVITE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 border-b border-[#c9a24d]/40 pb-0.5 text-[13px] tracking-[0.06em] text-[#e6c98a] transition-colors duration-200 hover:border-[#c9a24d] hover:text-[#f3d383]"
            >
              <i className="las la-external-link-alt text-base" aria-hidden="true" />
              {INVITE.mapText}
            </a>
          )}
        </motion.div>

        {/* countdown */}
        <motion.div
          variants={fade}
          className="mt-9 grid w-full grid-cols-4 gap-2 sm:gap-3"
        >
          {[
            { v: left?.days, l: 'Өдөр' },
            { v: left?.hours, l: 'Цаг' },
            { v: left?.minutes, l: 'Минут' },
            { v: left?.seconds, l: 'Секунд' },
          ].map((c) => (
            <div
              key={c.l}
              className="rounded-2xl border border-[#9d3fd9]/35 bg-[#1a0d24]/70 py-3"
            >
              <div className="inv-serif inv-gold text-2xl tabular-nums sm:text-3xl">
                {left ? String(c.v).padStart(2, '0') : '--'}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
                {c.l}
              </div>
            </div>
          ))}
        </motion.div>

        {/* actions */}
        <motion.div
          variants={fade}
          className="mt-9 flex w-full justify-center"
        >
          <button
            type="button"
            onClick={() => setBurst((b) => b + 1)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8e3cc9] to-[#c58a3a] px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
          >
            🎉 Баяр хүргэе
          </button>
        </motion.div>

        <motion.p
          variants={fade}
          className="inv-serif mt-8 text-sm italic text-[#c9a24d]/85"
        >
          {INVITE.host}
        </motion.p>
      </motion.div>
    </div>
  );
}
