// Character-screen data: skills (action bar), gear (paper doll + bag) and
// attributes. Edit these to change what the CHARACTER window shows.
import type { Skill, Tool } from "@/types";

export const skills: Skill[] = [
  {
    name: "Full-Stack Forge",
    level: 5,
    type: "Active",
    tagline: "Builds the whole feature, from database to button.",
    effect:
      "Forges complete features end to end: schema and migrations, Laravel or Node APIs, React front ends, and the deploy at the end. No hand-offs, no gaps between layers.",
    bonus: ["Front + back in one cast", "+40% ship speed", "+10 yrs Laravel mastery"],
    stack: ["Laravel", "React", "Node.js", "MySQL"],
    cooldown: "1 SPRINT",
    cost: "40 MP",
    range: "DB → UI",
    scaling: [
      { stat: "BACKEND", value: 95 },
      { stat: "FRONTEND", value: 75 },
    ],
    sprite: "forge",
  },
  {
    name: "System Architect",
    level: 4,
    type: "Active",
    tagline: "Draws the map before the party moves.",
    effect:
      "Designs systems that hold up in production: splits monoliths into modular services, plans data models that age well, and keeps the infrastructure boring and stable.",
    bonus: ["+Uptime aura", "-Tech debt per sprint", "Scales without rewrites"],
    stack: ["Modular services", "REST APIs", "PostgreSQL"],
    cooldown: "1 QUARTER",
    cost: "60 MP",
    range: "WHOLE SYSTEM",
    scaling: [
      { stat: "ARCHITECTURE", value: 90 },
      { stat: "DATABASES", value: 85 },
    ],
    sprite: "blueprint",
  },
  {
    name: "Party Leader",
    level: 4,
    type: "Passive",
    tagline: "Allies nearby level up faster.",
    effect:
      "Always on. Leads the dev team as CTO and turns juniors into seniors through code review, pairing, and clear standards. The party ships more than the sum of its members.",
    bonus: ["+5 Leadership", "+4 Mentoring", "Team XP gain +25%"],
    stack: ["Code review", "Mentoring", "Planning"],
    cooldown: "ALWAYS ON",
    cost: "NONE",
    range: "WHOLE TEAM",
    scaling: [
      { stat: "LEADERSHIP", value: 85 },
      { stat: "MENTORING", value: 80 },
    ],
    sprite: "banner",
  },
  {
    name: "Legacy Resurrection",
    level: 4,
    type: "Ultimate",
    tagline: "Raises dead codebases while the shop stays open.",
    effect:
      "Brings aging codebases back to life without taking the business offline: untangles old code, adds tests where it hurts, and migrates in small, safe steps. The older the code, the bigger the combo.",
    bonus: ["+3 Legacy Code Resistance", "Zero-downtime migrations", "+60% refactor power"],
    stack: ["Refactoring", "Migrations", "PHP"],
    cooldown: "1 PER LEGACY APP",
    cost: "100 MP",
    range: "10+ YR OLD CODE",
    scaling: [
      { stat: "REFACTORING", value: 90 },
      { stat: "PATIENCE", value: 99 },
    ],
    sprite: "skull",
  },
];

export const skillKeys = ["Q", "W", "E", "R"] as const;

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
  { name: "Git", icon: "/images/xp/items/git.png", rarity: "Common", slot: "BOOTS", kind: "Boots · Version control", ilvl: 9,
    stats: ["+9 Time travel", "+5 Teamwork"], description: "Time manipulation boots. Version control and GitFlow strategies." },
  { name: "PostgreSQL", icon: "/images/xp/items/postgre.png", rarity: "Rare", slot: "AMULET", kind: "Amulet · Database", ilvl: 7,
    stats: ["+8 Relational power", "+5 JSON magic"], description: "Advanced database relic. Relational power with JSON sorcery." },
  { name: "Security", sprite: "armor", rarity: "Epic", slot: "CHEST", kind: "Armor · Security", ilvl: 8,
    stats: ["+8 Defense", "+6 Auth & access control"], description: "Forged from auth flows, input validation and least privilege. Exploits bounce off." },
  { name: "Coffee", sprite: "coffee", count: 99, rarity: "Common", kind: "Consumable · Potion", ilvl: 1,
    stats: ["Restores 50 MP", "+10% Focus for 1 hr"], description: "Brewed fresh every morning. Somehow never runs out." },
  { name: "Rubber Duck", sprite: "duck", rarity: "Uncommon", kind: "Companion · Debugging", ilvl: 5,
    stats: ["+15 Debugging", "Bugs confess faster"], description: "Listens without judging. Explain the bug to it and the fix appears." },
  { name: "VS Code", icon: "/images/xp/items/vscode.png", rarity: "Uncommon", kind: "Tool · Editor", ilvl: 7,
    stats: ["+5 Coding speed", "+3 Happiness"], description: "Trusty forge. +50% coding speed, +30% developer happiness." },
  { name: "Postman", icon: "/images/xp/items/postman.png", rarity: "Common", kind: "Tome · API testing", ilvl: 5,
    stats: ["+5 Debugging", "+3 API insight"], description: "API testing tome. Debugs requests, validates endpoints." },
  // ── Bag ──
  { name: "Node.js", icon: "/images/xp/items/nodejs.png", rarity: "Epic", slot: "RING", kind: "Ring · JS runtime", ilvl: 7,
    stats: ["+7 Backend", "+6 Real-time"], description: "Ring of the runtime. Runs JavaScript beyond the browser realm." },
  { name: "WordPress", icon: "/images/xp/items/wordpress.png", rarity: "Common", kind: "Relic · CMS", ilvl: 6,
    stats: ["+6 Content", "+4 Plugins"], description: "CMS relic. Deep customization and theme enchanting skills." },
  { name: "Figma", icon: "/images/xp/items/figma.png", rarity: "Rare", kind: "Tool · Design", ilvl: 6,
    stats: ["+6 Prototyping", "+4 Creativity"], description: "Design artifact. +40% creativity, UI prototyping at light speed." },
];

export const BAG_SIZE = 10; // 5×2

// Core attributes (0–100) shown on the stats panel.
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
