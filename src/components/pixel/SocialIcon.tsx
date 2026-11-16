// Hand-drawn 12×12 pixel social icons (replace the Line Awesome font icons).
// "#" = filled pixel in `currentColor` (so hover colour classes still work),
// "." = transparent (letters/lens are cut-outs). Render at an exact integer
// multiple (24px = 2×) so every art pixel stays a crisp square.

const icons = {
  linkedin: [
    ".##########.",
    "############",
    "##..########",
    "############",
    "##..#....###",
    "##..#..#..##",
    "##..#..#..##",
    "##..#..#..##",
    "##..#..#..##",
    "##..#..#..##",
    "############",
    ".##########.",
  ],
  instagram: [
    ".##########.",
    "#..........#",
    "#........#.#",
    "#...####...#",
    "#..#....#..#",
    "#..#....#..#",
    "#..#....#..#",
    "#..#....#..#",
    "#...####...#",
    "#..........#",
    "#..........#",
    ".##########.",
  ],
  facebook: [
    ".##########.",
    "############",
    "#######...##",
    "######..####",
    "######..####",
    "####......##",
    "######..####",
    "######..####",
    "######..####",
    "######..####",
    "######..####",
    ".#####..###.",
  ],
} as const;

export type SocialName = keyof typeof icons;

export default function SocialIcon({ name, size = 24 }: { name: SocialName; size?: number }) {
  const rows = icons[name];
  const rects: React.ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== "#") {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === "#") run++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} />);
      x += run;
    }
  });
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
      {rects}
    </svg>
  );
}
