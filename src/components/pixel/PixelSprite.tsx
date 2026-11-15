// Hand-drawn 16×16 pixel sprites rendered as crisp inline SVG.
// Each sprite is a grid of palette keys ('.' = transparent). One <rect> per
// pixel, merged horizontally into runs to keep the DOM small.

type Sprite = { palette: Record<string, string>; rows: string[] };

const OUTLINE = "#0b0a14";

export const sprites = {
  // Full-Stack Forge: hammer striking an anvil, sparks flying
  forge: {
    palette: {
      K: OUTLINE,
      H: "#dbe4f0", // hammer head light
      h: "#8796ab", // hammer head shade
      w: "#a0673a", // handle
      a: "#9aa3b8", // anvil top
      A: "#5b6478", // anvil body
      S: "#4edbec", // spark cyan
      Y: "#ffffff", // spark white
    },
    rows: [
      "....KKK.........",
      "....KwK....Y....",
      "....KwK...S.S...",
      "..KKKwKKK..Y....",
      "..KHHHHHK.......",
      "..KhhhhhK.S.....",
      "..KKKKKKK...S...",
      "..S.......S.....",
      "KKKKKKKKKKKKKKK.",
      "KaaaaaaaaaaaaaK.",
      ".KKAAAAAAAAAAAK.",
      "....KAAAAAAK....",
      "....KAAAAAAK....",
      "...KAAAAAAAAK...",
      "..KAAAAAAAAAAK..",
      "..KKKKKKKKKKKK..",
    ],
  },

  // System Architect: blueprint of three connected service blocks
  blueprint: {
    palette: {
      K: OUTLINE,
      B: "#1e4fa8", // blueprint paper
      b: "#3a74d6", // grid dots
      L: "#e6f6ff", // drawn lines
      C: "#4edbec", // service fill
    },
    rows: [
      "................",
      ".KKKKKKKKKKKKKK.",
      ".KBBBbBBBBbBBBK.",
      ".KBLLLLBBLLLLBK.",
      ".KBLCCLLLLCCLBK.",
      ".KBLCCLBBLCCLBK.",
      ".KBLLLLBBLLLLBK.",
      ".KBBbLBBBBLbBBK.",
      ".KBBBLLLLLLBBBK.",
      ".KBBBBBLLBBBBBK.",
      ".KBbBBLLLLBBbBK.",
      ".KBBBBLCCLBBBBK.",
      ".KBBBBLLLLBBBBK.",
      ".KBbBBBbBBBbBBK.",
      ".KKKKKKKKKKKKKK.",
      "................",
    ],
  },

  // Party Leader: guild banner with a star emblem
  banner: {
    palette: {
      K: OUTLINE,
      G: "#facc15", // gold
      P: "#c9a46a", // pole
      p: "#8a6a3a", // pole shade
      F: "#7a5dff", // flag
      f: "#5a3fd6", // flag shade
      W: "#e2e8f0", // aura sparkle
    },
    rows: [
      "..KGK...........",
      "..KGKKKKKKKKKK..",
      "..KPKFFFFFFFFK..",
      "..KPKFFFGFFFFK..",
      "..KPKFGGGGGFFK..",
      "..KPKFFGGGFFFK..",
      "..KPKFFGFGFFFK..",
      "..KPKffffffffK..",
      "..KPKKKKKKKKKK..",
      "..KPK...........",
      "..KPK..W........",
      "..KpK......W....",
      "..KpK.....WWW...",
      ".KKKKK.....W....",
      "KGGGGGK.........",
      "KKKKKKK.........",
    ],
  },

  // Legacy Resurrection: skull wreathed in violet flame
  skull: {
    palette: {
      K: OUTLINE,
      W: "#ece8f5", // bone
      w: "#a8a0c0", // bone shade
      V: "#c084fc", // flame / eye light
      v: "#7a5dff", // flame core
    },
    rows: [
      ".......V........",
      "......VvV...V...",
      "...V..VvV..VvV..",
      "..VvKKKKKKKKvV..",
      "...KWWWWWWWWK...",
      "..KWWWWWWWWWWK..",
      "..KWWWWWWWWWwK..",
      "..KWKKKWWKKKwK..",
      "..KWKVKWWKVKwK..",
      "..KWKKKWWKKKwK..",
      "..KWWWWKKWWWwK..",
      "...KWWWWWWWWK...",
      "....KWKWWKWK....",
      ".....KKKKKK.....",
      "................",
      "................",
    ],
  },
} satisfies Record<string, Sprite>;

export type SpriteName = keyof typeof sprites;

export default function PixelSprite({
  name,
  size = 64,
  className,
  title,
}: {
  name: SpriteName;
  size?: number;
  className?: string;
  title?: string;
}) {
  const { palette, rows } = sprites[name] as Sprite;
  const rects: React.ReactElement[] = [];

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === key) run++;
      if (key !== "." && palette[key]) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[key]} />);
      }
      x += run;
    }
  });

  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects}
    </svg>
  );
}
