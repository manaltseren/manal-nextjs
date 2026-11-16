// Avatar "look" (hairstyle) for the TOP portrait (HeroAvatar) — a site
// CONFIG, set here by the owner only; there is no visitor-facing switch.
// The full-body sprite in the Character window is always the short-hair one.

export type Look = "short" | "long";

/** ← Set the hairstyle of the top avatar portrait. */
export const AVATAR_LOOK: Look = "long";

export const avatarPortraits: Record<Look, string> = {
  short: "/images/avatar-portrait.webp",
  long: "/images/avatar-portrait-long.webp",
};
