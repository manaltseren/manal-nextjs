'use client';

import { useEffect, useRef } from 'react';

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  wob: number;
  vwob: number;
  color: string;
  ribbon: boolean;
};

const COLORS = [
  '#f6d365',
  '#e8b64c',
  '#c9992f',
  '#fff3c4',
  '#e6c98a',
  '#d9a7c7',
  '#a678d6',
  '#ffffff',
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makePiece(x: number, y: number, spread: boolean): Piece {
  const angle = spread ? rand(-Math.PI, 0) : Math.PI / 2;
  const speed = spread ? rand(6, 15) : rand(0.6, 1.6);
  return {
    x,
    y,
    vx: spread ? Math.cos(angle) * speed : rand(-0.6, 0.6),
    vy: spread ? Math.sin(angle) * speed : speed,
    w: rand(6, 11),
    h: rand(9, 16),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.18, 0.18),
    wob: rand(0, Math.PI * 2),
    vwob: rand(0.05, 0.12),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    ribbon: Math.random() < 0.3,
  };
}

/**
 * Canvas confetti — a gentle ambient fall plus a burst whenever `burst` changes.
 * No dependencies; disabled entirely for reduced-motion users.
 */
export default function Confetti({ burst = 0 }: { burst?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<Piece[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const enabledRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      enabledRef.current = false;
      return;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Opening burst from the middle of the screen
    const { w, h } = sizeRef.current;
    for (let i = 0; i < 110; i++) {
      piecesRef.current.push(makePiece(w / 2 + rand(-60, 60), h * 0.42, true));
    }

    let raf = 0;
    let lastSpawn = 0;

    const frame = (t: number) => {
      const { w: cw, h: ch } = sizeRef.current;
      ctx.clearRect(0, 0, cw, ch);

      // Ambient snow of confetti drifting down from above the fold
      if (t - lastSpawn > 220 && piecesRef.current.length < 150) {
        lastSpawn = t;
        piecesRef.current.push(makePiece(rand(0, cw), -20, false));
      }

      const next: Piece[] = [];
      for (const p of piecesRef.current) {
        p.vy += 0.085;
        p.vy = Math.min(p.vy, 4.2);
        p.vx *= 0.985;
        p.wob += p.vwob;
        p.x += p.vx + Math.sin(p.wob) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;

        if (p.y > ch + 40 || p.x < -60 || p.x > cw + 60) continue;
        next.push(p);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.wob) * 0.8 + 0.2); // fake 3D flip
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        if (p.ribbon) {
          ctx.fillRect(-p.w / 4, -p.h / 2, p.w / 2, p.h * 1.4);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      piecesRef.current = next;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Burst on demand (button press)
  useEffect(() => {
    if (!burst || !enabledRef.current) return;
    const { w, h } = sizeRef.current;
    for (let i = 0; i < 130; i++) {
      piecesRef.current.push(makePiece(w / 2 + rand(-40, 40), h * 0.6, true));
    }
  }, [burst]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20"
    />
  );
}
