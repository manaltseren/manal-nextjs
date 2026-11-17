// Character-screen data: skills (action bar), gear (paper doll + bag) and
// attributes. Edit these to change what the CHARACTER window shows.
import type { Skill, Tool } from "@/types";

export const skills: Skill[] = [
  {
    name: "Code Strike",
    level: 4,
    type: "Active",
    tagline: "Targets complex challenges and delivers clean, high-impact solutions with pinpoint accuracy.",
    effect:
      "A precision attack: finds the exact point where a hard problem breaks and solves it there, cleanly, without collateral damage to the rest of the code.",
    bonus: ["+35% problem-solving efficiency", "+25% implementation accuracy", "+50% vs. complex logic"],
    stack: ["Debugging", "Algorithms", "Refactoring"],
    cooldown: "1 BUG",
    cost: "30 MP",
    range: "SINGLE TARGET",
    scaling: [
      { stat: "BACKEND", value: 90 },
      { stat: "ARCHITECTURE", value: 80 },
    ],
    image: "/images/xp/skills/strike.png",
  },
  {
    name: "Hyperlink",
    level: 4,
    type: "Active",
    tagline: "Connects applications, APIs, and services into one flow.",
    effect:
      "Wires separate systems together: REST APIs, third-party services and internal apps, so data moves between them in one reliable flow.",
    bonus: ["REST API + third-party integration", "+35% connectivity", "Unlocks Automated Workflows"],
    stack: ["REST APIs", "Webhooks", "Third-party services"],
    cooldown: "1 SPRINT",
    cost: "50 MP",
    range: "APP ↔ APP",
    scaling: [
      { stat: "BACKEND", value: 90 },
      { stat: "ARCHITECTURE", value: 80 },
    ],
    image: "/images/xp/skills/sync.png",
  },
  {
    name: "True Sight",
    level: 4,
    type: "Passive",
    tagline: "Spots structural weaknesses before they become problems.",
    effect:
      "Always on. Reads a system's structure and finds the weak points (slow queries, tight coupling, fragile code) before they turn into outages.",
    bonus: ["Detects hidden bottlenecks", "+35% scalability", "-25% technical debt"],
    stack: ["Code review", "Profiling", "Architecture"],
    cooldown: "ALWAYS ON",
    cost: "NONE",
    range: "WHOLE SYSTEM",
    scaling: [
      { stat: "ARCHITECTURE", value: 90 },
      { stat: "DATABASES", value: 85 },
    ],
    image: "/images/xp/skills/scan.png",
  },
  {
    name: "Full-Stack Mode",
    level: 5,
    type: "Ultimate",
    tagline: "Builds the whole feature, from database to button.",
    effect:
      "Forges complete features end to end: schema and migrations, Laravel or Node APIs, React front ends, and the deploy at the end. No hand-offs, no gaps between layers.",
    bonus: ["Front + back in one workflow", "+40% ship speed", "Empowers all other skills"],
    stack: ["Laravel", "React", "Node.js", "MySQL"],
    cooldown: "1 SPRINT",
    cost: "40 MP",
    range: "DB → UI",
    scaling: [
      { stat: "BACKEND", value: 95 },
      { stat: "FRONTEND", value: 75 },
    ],
    image: "/images/xp/skills/fullstack.png",
  },
];

// Hotkeys by type: Actives take Q, W, E in order, the Ultimate is always R,
// Passives have no hotkey (null).
export const skillKeys: (string | null)[] = (() => {
  const free = ["Q", "W", "E"];
  return skills.map((s) => (s.type === "Passive" ? null : s.type === "Ultimate" ? "R" : (free.shift() ?? null)));
})();

// Equipment slots on the paper doll. Layout (4 columns, WoW-style):
//   HEAD    | avatar | avatar | AMULET
//   CHEST   | avatar | avatar | RING
//   BOOTS   | avatar | avatar | TRINKET
//           | MAIN   | OFF    |
export const dollLeft = ["HEAD", "CHEST", "BOOTS"] as const;
export const dollRight = ["AMULET", "RING", "TRINKET"] as const;
export const dollWeapons = ["MAIN HAND", "OFF HAND"] as const;

// `slot` set = equipped on the paper doll; otherwise it's in the bag.
export const tools: Tool[] = [
  // ── Equipped ──
  { name: "Laravel", icon: "/images/xp/items/laravel.png", rarity: "Legendary", slot: "MAIN HAND", kind: "Weapon · PHP framework", ilvl: 10,
    stats: ["+10 Backend", "+8 API crafting", "+6 Ship speed"], description: "Primary weapon. Elegant PHP framework mastered over 10+ years." },
  { name: "React", icon: "/images/xp/items/react.png", rarity: "Epic", slot: "OFF HAND", kind: "Focus · UI library", ilvl: 8,
    stats: ["+9 UI", "+7 State control", "+5 Reusability"], description: "Component sorcery. Builds reactive UIs with hooks and state magic." },
  { name: "MySQL", icon: "/images/xp/items/mysql.png", rarity: "Rare", slot: "HEAD", kind: "Helm · Database", ilvl: 9,
    stats: ["+9 Data integrity", "+6 Query power"], description: "Database grimoire. Master of complex queries and data schemas." },
  { name: "Git", icon: "/images/xp/items/git.png", rarity: "Common", slot: "TRINKET", kind: "Trinket · Version control", ilvl: 9,
    stats: ["+9 Time travel", "+5 Teamwork"], description: "Time manipulation trinket. Version control and GitFlow strategies." },
  { name: "PostgreSQL", icon: "/images/xp/items/postgre.png", rarity: "Rare", slot: "AMULET", kind: "Amulet · Database", ilvl: 7,
    stats: ["+8 Relational power", "+5 JSON magic"], description: "Advanced database relic. Relational power with JSON sorcery." },
  { name: "Security", sprite: "hoodie", rarity: "Epic", slot: "CHEST", kind: "Hoodie · Security", ilvl: 8,
    stats: ["+8 Defense", "+6 Auth & access control"], description: "Woven from auth flows, input validation and least privilege. Exploits bounce off." },
  { name: "Node.js", icon: "/images/xp/items/nodejs.png", rarity: "Epic", slot: "RING", kind: "Ring · JS runtime", ilvl: 7,
    stats: ["+7 Backend", "+6 Real-time"], description: "Ring of the runtime. Runs JavaScript beyond the browser realm." },
  // ── Bag (no slot) ──
  { name: "Coffee", sprite: "coffee", count: 99, rarity: "Common", kind: "Consumable · Potion", ilvl: 1,
    stats: ["Restores 50 MP", "+10% Focus for 1 hr"], description: "Brewed fresh every morning. Somehow never runs out." },
  { name: "Rubber Duck", sprite: "duck", rarity: "Uncommon", kind: "Companion · Debugging", ilvl: 5,
    stats: ["+15 Debugging", "Bugs confess faster"], description: "Listens without judging. Explain the bug to it and the fix appears." },
  { name: "VS Code", icon: "/images/xp/items/vscode.png", rarity: "Uncommon", kind: "Tool · Editor", ilvl: 7,
    stats: ["+5 Coding speed", "+3 Happiness"], description: "Trusty forge. +50% coding speed, +30% developer happiness." },
  { name: "Postman", icon: "/images/xp/items/postman.png", rarity: "Common", kind: "Tome · API testing", ilvl: 5,
    stats: ["+5 Debugging", "+3 API insight"], description: "API testing tome. Debugs requests, validates endpoints." },
  { name: "WordPress", icon: "/images/xp/items/wordpress.png", rarity: "Common", kind: "Relic · CMS", ilvl: 6,
    stats: ["+6 Content", "+4 Plugins"], description: "CMS relic. Deep customization and theme enchanting skills." },
  { name: "Figma", icon: "/images/xp/items/figma.png", rarity: "Rare", kind: "Tool · Design", ilvl: 6,
    stats: ["+6 Prototyping", "+4 Creativity"], description: "Design artifact. +40% creativity, UI prototyping at light speed." },
];

export const BAG_SIZE = 10; // 5×2

// Core attributes shown on the ATTRIBUTES panel.
// Souls-like stats, DERIVED FROM THE CHARACTER LEVEL so they always add up:
// every stat starts at BASE_STAT, and each level grants POINTS_PER_LEVEL
// points, split by these weights (largest-remainder rounding, so the points
// above base always total exactly level × POINTS_PER_LEVEL). Open-ended — no
// max, no progress bar; they grow every year with the level.
export const BASE_STAT = 10;
export const POINTS_PER_LEVEL = 10;
const statWeights: { stat: string; weight: number }[] = [
  { stat: "BACKEND", weight: 30 },
  { stat: "ARCHITECTURE", weight: 26 },
  { stat: "FRONTEND", weight: 25 },
  { stat: "DATABASES", weight: 24 },
  { stat: "LEADERSHIP", weight: 20 },
];

/** Character level = years since 2013 (same as the top avatar). */
export const characterLevel = () => new Date().getFullYear() - 2013;

export function attributesFor(level: number) {
  const total = level * POINTS_PER_LEVEL;
  const sumW = statWeights.reduce((s, w) => s + w.weight, 0);
  const raw = statWeights.map((w) => (total * w.weight) / sumW);
  const pts = raw.map(Math.floor);
  // hand the leftover points to the largest fractional parts
  let left = total - pts.reduce((s, p) => s + p, 0);
  raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((x, y) => y.frac - x.frac)
    .forEach(({ i }) => { if (left > 0) { pts[i]++; left--; } });
  return statWeights.map((w, i) => ({ stat: w.stat, value: BASE_STAT + pts[i] }));
}
