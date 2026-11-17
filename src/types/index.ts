export type Rarity = 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common';
export type SkillType = 'Active' | 'Passive' | 'Ultimate';

export interface Skill {
  name: string;
  level: number;
  type: SkillType;
  /** One-line flavor shown on the card */
  tagline: string;
  /** Full description shown in the detail modal */
  effect: string;
  bonus: string[];
  /** Real tech this ability is built on */
  stack: string[];
  cooldown: string;
  /** Spell-sheet stats shown in the info pane */
  cost: string;
  range: string;
  /** "Scales with" bars, value 0–100 */
  scaling: { stat: string; value: number }[];
  /** Full-bleed skill icon (path under /public; 192px PNG filling the slot) */
  image: string;
}

export interface Tool {
  name: string;
  /** PNG icon under /public — or use `sprite` for a hand-drawn pixel sprite */
  icon?: string;
  /** Key into the character `itemSprites` map (consumables etc.) */
  sprite?: 'coffee' | 'duck' | 'hoodie';
  /** Stack size shown in the slot corner (consumables) */
  count?: number;
  rarity: Rarity;
  /** Flavor text, shown in quotes on the item card */
  description: string;
  /** Item type line, e.g. "Weapon · PHP framework" */
  kind: string;
  /** Item level 1–10 (how deep the proficiency goes) */
  ilvl: number;
  /** Stat lines, e.g. "+10 Backend" */
  stats: string[];
  /** Equipment slot label — set = equipped, unset = in the bag */
  slot?: string;
}

export interface Quest {
  title: string;
  company: string;
  years: string;
  description: string;
  reward: string[];
  completed: boolean;
}

export interface Project {
  title: string;
  category: string;
  year: string;
  description: string;
  features: string[];
  link?: string;
  shipped: boolean;
  /** Screenshot/cover. Path under /public (e.g. /images/projects/foo.png). Falls back to a themed placeholder when omitted. */
  image?: string;
  /** How the screenshot fills the 16:10 cover slot. "cover" (default) crops to fill; "contain" shows the whole image (use for portrait/tall shots) over a blurred fill. */
  imageFit?: 'cover' | 'contain';
  /** Pin one project as the full-width hero banner above the grid. */
  featured?: boolean;
}
