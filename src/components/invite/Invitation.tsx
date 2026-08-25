'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from './Confetti';

/* ------------------------------------------------------------------ *
 *  ЭНД ЗАСНА УУ — бүх текст, огноо, утас энэ нэг объектод байна.
 * ------------------------------------------------------------------ */
export const INVITE = {
  eyebrow: 'Төрсөн өдрийн урилга',
  name: 'Л.Пүрэврэнцэн',
  ageLine: '70 насны ойн баяр',
  /** ISO огноо — тоолуур үүнээс тоолно */
  dateISO: '2026-08-30T16:00:00+08:00',
  dateText: '2026 оны 8 дүгээр сарын 30',
  weekday: 'Ням гараг',
  timeText: '16:00 цагт',
  venue: 'Grand Khaan Irish Pub',
  venueDetail: 'Чингис ВИП өрөө',
  /** Google Maps холбоос — Maps дээрх "Share" линкээ энд тавьж болно */
  mapUrl:
    'https://maps.app.goo.gl/kq5wKRhPMfB8DUU87',
  mapText: 'Газрын зураг дээр харах',
  message:
    'Миний амьдралын онцгой энэ өдрийг хамт өнгөрүүлж, баяр баясгаланг минь хуваалцахыг урьж байна.',
  host: 'Хүндэтгэсэн: Л.Пүрэврэнцэн',
  phone: '+97699334877',
  phoneText: '+976 9933 4877',
} as const;

/* ---------------------------- balloons ---------------------------- */

const BALLOONS = [
  { x: '6%', size: 62, dur: 26, delay: -2, c1: '#f6d365', c2: '#b6862a' },
  { x: '18%', size: 44, dur: 34, delay: -14, c1: '#d9a7c7', c2: '#8e4f72' },
  { x: '31%', size: 74, dur: 30, delay: -22, c1: '#a678d6', c2: '#54308c' },
  { x: '44%', size: 38, dur: 38, delay: -8, c1: '#fff3c4', c2: '#c9992f' },
  { x: '58%', size: 66, dur: 28, delay: -18, c1: '#f6d365', c2: '#9c6c1f' },
  { x: '70%', size: 48, dur: 36, delay: -5, c1: '#d9a7c7', c2: '#7d3f61' },
  { x: '82%', size: 70, dur: 32, delay: -26, c1: '#a678d6', c2: '#432a70' },
  { x: '93%', size: 40, dur: 40, delay: -11, c1: '#e6c98a', c2: '#8a6a24' },
];

/* Тогтмол одод — SSR ба client ижил гарна.
   Урт бутархайг браузер өөрөө богиносгодог тул (`5.721816…%` → `5.72182%`)
   hydration үед зөрөх шалтгаан болдог. Тиймээс браузерын хэвлэдэгтэй ижил
   богино хэлбэрт нь урьдчилж бөөрөнхийлнө — `toFixed` нь `0.000%` шиг
   арын тэгүүд үлдээдэг тул тохирохгүй. */
const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

const STARS = Array.from({ length: 46 }, (_, i) => {
  const h = Math.sin(i * 12.9898) * 43758.5453;
  const h2 = Math.sin(i * 78.233) * 12345.6789;
  return {
    left: `${round(Math.abs(h - Math.floor(h)) * 100)}%`,
    top: `${round(Math.abs(h2 - Math.floor(h2)) * 70)}%`,
    size: `${(i % 3) + 1}px`,
    delay: `${round((i % 7) * 0.6, 1)}s`,
  };
});

/* --------------------------- countdown ---------------------------- */

function useCountdown(target: string) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // hydration-safe: серверт null, mount хийсний дараа л тоо гарна
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
        .inv-root {
          background:
            radial-gradient(120% 90% at 50% -10%, #4a2a63 0%, rgba(74,42,99,0) 55%),
            radial-gradient(90% 70% at 80% 110%, #3a1c4d 0%, rgba(58,28,77,0) 60%),
            linear-gradient(180deg, #150c26 0%, #0d0719 55%, #08050f 100%);
        }
        .inv-serif { font-family: var(--font-playfair), 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .inv-gold {
          background: linear-gradient(180deg, #fff6d8 0%, #f3d383 38%, #c9992f 72%, #f0d391 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        /* ---- balloons ---- */
        .inv-balloon {
          position: absolute; bottom: -300px; will-change: transform;
          animation: inv-rise var(--dur) linear infinite;
          animation-delay: var(--delay);
        }
        .inv-balloon__sway { display: block; animation: inv-sway calc(var(--dur) / 7) ease-in-out infinite alternate; }
        .inv-balloon__body {
          display: block; position: relative;
          width: var(--size); height: calc(var(--size) * 1.24);
          border-radius: 50% 50% 50% 50% / 46% 46% 54% 54%;
          background:
            radial-gradient(circle at 32% 26%, rgba(255,255,255,.6), rgba(255,255,255,0) 40%),
            linear-gradient(155deg, var(--c1), var(--c2));
        }
        .inv-balloon__body::after {
          content: ''; position: absolute; left: 50%; bottom: -7px; transform: translateX(-50%);
          border-left: 5px solid transparent; border-right: 5px solid transparent;
          border-bottom: 9px solid var(--c2);
        }
        .inv-balloon__string {
          display: block; width: 1px; height: calc(var(--size) * 1.4); margin: 7px auto 0;
          background: linear-gradient(to bottom, rgba(255,255,255,.4), rgba(255,255,255,0));
        }
        @keyframes inv-rise { from { transform: translate3d(0,0,0); } to { transform: translate3d(0,-140vh,0); } }
        @keyframes inv-sway { from { transform: translateX(-16px) rotate(-5deg); } to { transform: translateX(16px) rotate(5deg); } }
        /* ---- stars ---- */
        .inv-star { position: absolute; border-radius: 9999px; background: #fff; animation: inv-twinkle 4s ease-in-out infinite; }
        @keyframes inv-twinkle { 0%, 100% { opacity: .12; } 50% { opacity: .7; } }
        @media (prefers-reduced-motion: reduce) {
          .inv-balloon, .inv-balloon__sway, .inv-star { animation: none !important; }
          .inv-balloon { bottom: auto; top: 28%; }
        }
      `}</style>

      {/* stars */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="inv-star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      {/* balloons */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        {BALLOONS.map((b, i) => (
          <span
            key={i}
            className="inv-balloon"
            style={
              {
                left: b.x,
                opacity: 0.8,
                '--size': `${b.size}px`,
                '--dur': `${b.dur}s`,
                '--delay': `${b.delay}s`,
                '--c1': b.c1,
                '--c2': b.c2,
              } as React.CSSProperties
            }
          >
            <span className="inv-balloon__sway">
              <span className="inv-balloon__body" />
              <span className="inv-balloon__string" />
            </span>
          </span>
        ))}
      </div>

      <Confetti burst={burst} />

      {/* card */}
      <div className="relative z-30 flex min-h-screen items-center justify-center px-4 py-14 sm:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="relative w-full max-w-[580px] rounded-[28px] border border-[#c9a24d]/35 bg-white/[0.045] px-6 py-12 text-center backdrop-blur-md sm:px-12 sm:py-14"
          style={{ boxShadow: '0 40px 90px -40px rgba(0,0,0,.95)' }}
        >
          {/* corner ornaments */}
          {[
            'left-4 top-4 border-l border-t rounded-tl-lg',
            'right-4 top-4 border-r border-t rounded-tr-lg',
            'left-4 bottom-4 border-l border-b rounded-bl-lg',
            'right-4 bottom-4 border-r border-b rounded-br-lg',
          ].map((cls) => (
            <span
              key={cls}
              aria-hidden="true"
              className={`pointer-events-none absolute h-8 w-8 border-[#c9a24d]/50 ${cls}`}
            />
          ))}

          <motion.p
            variants={fade}
            className="text-[10px] uppercase tracking-[0.42em] text-[#c9a24d] sm:text-[11px]"
          >
            {INVITE.eyebrow}
          </motion.p>

          <motion.h1
            variants={fade}
            className="inv-serif inv-gold mt-6 pb-[0.1em] text-[clamp(1.9rem,8.6vw,4rem)] leading-[1.18] font-semibold text-balance"
          >
            {INVITE.name}
          </motion.h1>

          <motion.p
            variants={fade}
            className="inv-serif mt-2 text-lg text-white/75 sm:text-xl"
          >
            {INVITE.ageLine}
          </motion.p>

          {/* ornament divider */}
          <motion.div
            variants={fade}
            className="mx-auto mt-7 flex w-full max-w-[240px] items-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a24d]/60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#c9a24d]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a24d]/60" />
          </motion.div>

          {/* date & time */}
          <motion.div variants={fade} className="mt-7 space-y-1.5">
            {/* Нэг мөрөнд багтаана: нарийн дэлгэц дээр үсгийн хэмжээ vw-ээр багасна */}
            <p className="inv-serif whitespace-nowrap text-[clamp(1.05rem,5.4vw,1.75rem)] text-white">
              {INVITE.dateText}
            </p>
            <p className="text-sm uppercase tracking-[0.18em] text-[#e6c98a]">
              {INVITE.weekday} · {INVITE.timeText}
            </p>
          </motion.div>

          {/* venue */}
          <motion.div variants={fade} className="mt-6">
            <p className="inv-serif text-lg text-white/90">{INVITE.venue}</p>
            <p className="mt-1 text-sm text-white/55">{INVITE.venueDetail}</p>
            <a
              href={INVITE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 border-b border-[#c9a24d]/40 pb-0.5 text-[13px] tracking-[0.06em] text-[#e6c98a] transition-colors duration-200 hover:border-[#c9a24d] hover:text-[#f3d383]"
            >
              <i className="las la-map-marker-alt text-base" aria-hidden="true" />
              {INVITE.mapText}
            </a>
          </motion.div>

          {/* countdown */}
          <motion.div
            variants={fade}
            className="mt-9 grid grid-cols-4 gap-2 sm:gap-3"
          >
            {[
              { v: left?.days, l: 'Өдөр' },
              { v: left?.hours, l: 'Цаг' },
              { v: left?.minutes, l: 'Минут' },
              { v: left?.seconds, l: 'Секунд' },
            ].map((c) => (
              <div
                key={c.l}
                className="rounded-xl border border-[#c9a24d]/25 bg-black/25 py-3"
              >
                <div className="inv-serif text-2xl tabular-nums text-[#f3d383] sm:text-3xl">
                  {left ? String(c.v).padStart(2, '0') : '--'}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {c.l}
                </div>
              </div>
            ))}
          </motion.div>

          {/* message */}
          <motion.p
            variants={fade}
            className="mx-auto mt-9 max-w-[420px] text-[15px] leading-relaxed text-white/65"
          >
            {INVITE.message}
          </motion.p>

          {/* actions */}
          <motion.div
            variants={fade}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href={`tel:${INVITE.phone}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#f6dfa0] to-[#c9992f] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#2a1a05] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
            >
              <i className="las la-phone text-lg" aria-hidden="true" />
              Утсаар холбогдох
            </a>
            <button
              type="button"
              onClick={() => setBurst((b) => b + 1)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#c9a24d]/45 px-7 py-3.5 text-sm text-[#e6c98a] transition-colors duration-200 hover:bg-[#c9a24d]/10 sm:w-auto"
            >
              🎉 Баяр хүргэе
            </button>
          </motion.div>

          <motion.p
            variants={fade}
            className="mt-6 text-xs tracking-[0.14em] text-white/40"
          >
            {INVITE.phoneText}
          </motion.p>

          <motion.p
            variants={fade}
            className="inv-serif mt-8 text-sm italic text-[#c9a24d]/85"
          >
            {INVITE.host}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
