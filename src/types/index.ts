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
  /** Key into the PixelSprite `sprites` map */
  sprite: 'forge' | 'blueprint' | 'banner' | 'skull';
}

export interface Tool {
  name: string;
  icon: string;
  rarity: Rarity;
  description: string;
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
