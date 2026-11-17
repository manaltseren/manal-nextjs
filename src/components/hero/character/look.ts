// Avatar "look" (hairstyle) for the TOP portrait (HeroAvatar) — a site
// CONFIG, set here by the owner only; there is no visitor-facing switch.
// The full-body sprite in the Character window is always the short-hair one.
// (The short-hair portrait, /images/avatar-portrait.webp, was removed — add it
// back here with its file if you want to switch again.)

export type Look = "long";

/** ← Set the hairstyle of the top avatar portrait. */
export const AVATAR_LOOK: Look = "long";

export const avatarPortraits: Record<Look, string> = {
  long: "/images/avatar-portrait-long.webp",
};
