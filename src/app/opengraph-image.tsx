import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";

// Dynamic Open Graph / social-share image (1200×630). Rendered to a real PNG by
// next/og, on-brand with the synthwave theme. Next auto-wires og:image.
//
// satori (next/og) has limited CSS: no perspective/3D, no z-index, and the
// perspective grid floor breaks on render — so the retro vibe here is built
// from satori-safe primitives only (gradients, radial glow, solid divs,
// partial borders, pixel "stars"). Layers are ordered by DOM.
export const runtime = "nodejs";
export const alt = "Manalaa — Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CYAN = "#4edbec";
const PURPLE = "#c084fc";

// Deterministic scattered pixel stars (kept out of the dead-center text zone).
const STARS = [
  { x: 90, y: 70, s: 4 }, { x: 210, y: 150, s: 3 }, { x: 150, y: 470, s: 4 },
  { x: 300, y: 540, s: 3 }, { x: 80, y: 320, s: 3 }, { x: 1080, y: 90, s: 4 },
  { x: 980, y: 180, s: 3 }, { x: 1120, y: 470, s: 4 }, { x: 1010, y: 540, s: 3 },
  { x: 1140, y: 300, s: 3 }, { x: 540, y: 60, s: 3 }, { x: 700, y: 560, s: 4 },
  { x: 420, y: 90, s: 2 }, { x: 820, y: 70, s: 3 },
];

function Corner(style: React.CSSProperties) {
  return <div style={{ position: "absolute", width: 46, height: 46, ...style }} />;
}

export default async function Image() {
  const press = readFileSync(new URL("./PressStart2P.ttf", import.meta.url));
  const lvl = new Date().getFullYear() - 2013;

  const bracket = { borderColor: CYAN, borderStyle: "solid" } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "PressStart2P",
          color: "#ffffff",
          backgroundImage:
            "linear-gradient(150deg, #1b0e33 0%, #2a1450 42%, #3a1550 60%, #160a28 100%)",
        }}
      >
        {/* Centered radial glow for depth */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 90,
            width: 800,
            height: 450,
            borderRadius: 9999,
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(192,90,220,0.32) 0%, rgba(78,219,236,0.10) 45%, transparent 72%)",
          }}
        />

        {/* Pixel starfield */}
        {STARS.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              backgroundColor: i % 3 === 0 ? CYAN : "#ffffff",
              opacity: 0.7,
            }}
          />
        ))}

        {/* Inner neon screen frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "2px solid rgba(78,219,236,0.22)",
          }}
        />

        {/* HUD corner brackets */}
        <Corner top={40} left={40} borderTopWidth={4} borderLeftWidth={4} {...bracket} />
        <Corner top={40} right={40} borderTopWidth={4} borderRightWidth={4} {...bracket} />
        <Corner bottom={40} left={40} borderBottomWidth={4} borderLeftWidth={4} {...bracket} />
        <Corner bottom={40} right={40} borderBottomWidth={4} borderRightWidth={4} {...bracket} />

        {/* Centered text block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 18, color: CYAN, letterSpacing: 3, marginBottom: 26 }}>
            manal.dev
          </div>
          <div
            style={{
              fontSize: 80,
              color: "#ffffff",
              letterSpacing: 2,
              textShadow: "0 4px 0 #160a28",
              marginBottom: 26,
            }}
          >
            MANALAA
          </div>
          {/* Neon divider */}
          <div
            style={{
              width: 110,
              height: 4,
              marginBottom: 26,
              backgroundImage: `linear-gradient(90deg, ${CYAN}, #ff2d8f)`,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: 1,
              marginBottom: 30,
            }}
          >
            FULL-STACK WEB DEVELOPER
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 16,
              color: PURPLE,
              letterSpacing: 2,
              padding: "12px 22px",
              border: "2px solid rgba(192,132,252,0.55)",
              backgroundColor: "rgba(34,18,58,0.85)",
            }}
          >
            {`LVL ${lvl}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "PressStart2P", data: press, weight: 400, style: "normal" }],
    }
  );
}
