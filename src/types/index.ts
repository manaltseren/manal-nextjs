export type Rarity = 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common';
export type SkillType = 'Active' | 'Passive' | 'Ultimate';

export interface Skill {
  name: string;
  level: number;
  type: SkillType;
  effect: string;
  bonus: string[];
  icon: string;
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
}
