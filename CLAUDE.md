# next-manal — Personal Portfolio

RPG-themed personal portfolio for Manaltseren B. (Manalaa), a web developer. The site presents skills, tools, and work experience as an RPG character sheet — abilities, inventory, quests, and XP.

**Production URL:** https://manal.dev

## Tech Stack

- **Next.js 16** (App Router, **TypeScript** — `.tsx` / `.ts`)
- **React 19**
- **Tailwind CSS 4** with `@tailwindcss/postcss` (no `tailwind.config.js`)
- **Framer Motion** (`framer-motion`) for animations
- **SCSS** (`sass`) for a few component styles (`main.scss`)
- **Line Awesome** icon font (HTML class-based, e.g. `la la-envelope`)
- **ESLint 9** flat config (`eslint.config.mjs`) extending `eslint-config-next`

> Note: `radix-ui`, `@base-ui-components/react`, and `tw-animate-css` are installed as ReUI peer deps but are **not currently used** — kept for when ReUI components are added. There is no `cn` helper / `clsx` / `tailwind-merge` (removed as unused; re-add if you adopt ReUI).

## Commands

```bash
npm run dev      # dev server on localhost:3000
npm run build    # production build
npm run start    # start production server
npm run lint     # eslint .
```

> Turbopack occasionally serves **stale CSS** after editing `globals.css` (hot-reload misses the change). If a CSS edit doesn't show, hard-refresh (Ctrl+Shift+R) or restart `npm run dev`.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, SynthwaveBackground, Header, Footer
│   ├── page.tsx            # Home (/) — 4 hero sections + OpenGraph metadata
│   ├── globals.css         # Tailwind imports, CSS variables, synthwave background styles
│   └── portfolio/
│       └── page.tsx        # /portfolio — project grid
├── components/
│   ├── Header.tsx              # Fixed nav + animated mobile menu (client)
│   ├── Footer.tsx              # Social links, dynamic year (server)
│   ├── SynthwaveBackground.tsx # Global synthwave backdrop, scroll-reactive sun (client)
│   ├── SectionDivider.tsx      # Decorative divider between sections
│   ├── TypingTitle.tsx         # Terminal-style typing heading (client)
│   ├── hero/
│   │   ├── HeroAvatar.tsx   # Name, class/level, XP bar, contact button (server)
│   │   ├── HeroSkills.tsx   # Abilities — 4 skill cards + detail modal (client)
│   │   ├── HeroInventory.tsx# Tool inventory grid w/ rarity borders + tooltip (client)
│   │   └── HeroQuests.tsx   # Work history as RPG quests w/ hover overlay (client)
│   └── portfolio/
│       └── ProjectGrid.tsx # Portfolio project cards + category filter (client)
├── styles/
│   ├── variables.scss      # $primary-color, $secondary-color, --bg-custom-dark
│   └── main.scss           # A few component styles (social links, float anim, etc.)
└── types/
    └── index.ts            # Shared types: Rarity, SkillType, Skill, Tool, Quest, Project
```

## Path Alias

`@/` maps to `src/` (configured in `tsconfig.json` → `compilerOptions.paths`).

```ts
import type { Quest } from '@/types';
import TypingTitle from '@/components/TypingTitle';
```

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Home — 4 hero sections over the synthwave background |
| `/portfolio` | `src/app/portfolio/page.tsx` | Project grid |

Header nav has two items: **Home** and **Portfolio**.

## Background — SynthwaveBackground

The global animated backdrop (replaces the old Three.js + Vanta fog). A pure-CSS synthwave scene, mounted once in `layout.tsx`, `position: fixed`, `z-index: -10`. Styles live in `globals.css` under `.synthwave-bg*`. Layers, back to front:

1. **Gradient sky** — background on `.synthwave-bg`. Kept dark by the horizon so the scroll-rise doesn't expose a bright band; the purple horizon glow lives in `.synthwave-bg__glow`, which scrolls WITH the grid group (same `gridY`) so it stays attached to the horizon.
2. **Twinkling starfield** — `.synthwave-bg__stars`; star positions are deterministic (a `Math.sin` hash, not `Math.random`) so SSR and client agree.
3. **Retro sun** — `.synthwave-bg__sun` inside `.synthwave-bg__sunclip` (clipped at the horizon so the lower ~28% sinks behind it). Warm yellow→magenta gradient, scanline gaps in the lower half. The glow is a `drop-shadow` `filter` on the `.synthwave-bg__sun-wrap` wrapper (not on the masked sun — `filter` runs before `mask`, so a glow on the sun itself gets clipped away). The glow is scroll-driven (Framer `useTransform` builds the `drop-shadow` string): strong at rest, easing down but staying strong (floor ~0.7) the whole way down so the sun keeps a clear glow as it sets. It's clipped away with the sun once fully behind the horizon, and stays tied to the sun so there's never a detached/floating glow. **The sun sinks on scroll:** Framer Motion `useScroll`/`useTransform` drives the wrapper's `y` (0→320px over the first 600px of scroll) so it "sets" behind the horizon as you scroll down. The `.synthwave-bg__sunclip` itself also rises with the horizon group (`gridY`) so its clip line stays glued to the (rising) horizon line — otherwise the sinking sun pokes through the gap between the risen horizon and a stale clip. The wrapper's horizontal centering (`x: -50%`) is also set by Framer — don't add `transform` to `.synthwave-bg__sun-wrap` in CSS.
4. **Neon grid floor** — `.synthwave-bg__grid`, perspective grid scrolling toward the viewer; a `mask-image` fades the far lines out to prevent horizon shimmer/aliasing (don't remove that mask). The grid, horizon line, and `.synthwave-bg__glow` rise slightly on scroll (Framer `y`, 0→−48px over 600px) as a counter-motion to the setting sun. The grid sits in a `.synthwave-bg__grid-wrap` translate-only wrapper because its own `perspective()`+`rotateX()` transform can't be overwritten by Framer's translate.

**Scroll motion is desktop-only** (`min-width: 768px`, via a `matchMedia` flag in the component). On mobile the address bar resizing the viewport mid-scroll desyncs scroll-linked transforms on the fixed layer (sun/glow drift), so small screens get a static scene — sun resting on the horizon with full glow.

To keep this visible, `main`, the page wrappers, and the cards are transparent/semi-transparent; `body` has a `#0b0a14` base.

## Pages

### Home (`/`)

Four stacked hero sections (`HeroAvatar`, `HeroSkills`, `HeroInventory`, `HeroQuests`) separated by `SectionDivider`, sitting over the global synthwave background. Full OpenGraph metadata (og:image at `https://manal.dev/images/social_thumbnail.jpg`, `fb:app_id`).

### Portfolio (`/portfolio`)

`ProjectGrid` — project cards with a category filter, over the synthwave background.

## Components

### HeroAvatar
Server component. Plain `<img>` (not `next/image`) at `/images/avatar-manal.png`. Shows name, class (FullStack Dev), level, XP bar, and a "Contact me" button linking to `/vcard.vcf`.

### HeroSkills
Client component. 4 ability cards from a static `skills` array (level dots, type, effect, bonuses); clicking a card opens a detail modal via a React portal (gated behind a `mounted` flag for SSR safety). Skill icons in `/public/images/xp/skills/skill{1–4}-new.png`.

### HeroInventory
Client component. Tool grid; each `Tool` has a `rarity` mapped to border/colors via `rarityConfig` (Legendary / Epic / Rare / Uncommon / Common). On hover, a fixed-position tooltip follows the mouse (rendered via portal). Epic/Legendary tooltips get `Sparkle` particles — positions/speeds are derived deterministically from a `seed` (pure, no `Math.random`). Tool icons in `/public/images/xp/items/`.

### HeroQuests
Client component. Work positions as quests; cards reveal a "QUEST COMPLETE" reward overlay on hover (active CTO role uses `completed: false` → "IN PROGRESS"). Scroll-in via Framer Motion `useInView`. Shows 3 quests, expands to all.

### Header
Client component. `usePathname()` for active styling; desktop nav + an animated full-screen mobile menu (Framer Motion). Shows a `LVL` badge derived from `new Date().getFullYear() - 2013`.

### Footer
Server component. Social links (Line Awesome icons), dynamic copyright year.

### TypingTitle
Client component. Types out a heading character-by-character with a blinking cursor; starts when `inView`.

## Styling Conventions

- **Tailwind v4** — use `@utility`, `@theme`, `@theme inline` in CSS; no `tailwind.config.js`.
- **SCSS** (`main.scss`) uses `@use "variables" as *` — never `@import` (deprecated in Dart Sass 3).
- **Color palette**: `$primary-color: #7a5dff` (purple), `$secondary-color: #4edbec` (cyan).
- **`--bg-custom-dark: rgba(25, 25, 31, 0.75)`** — semi-transparent dark for card backgrounds; inline `style={{ backgroundColor: 'var(--bg-custom-dark)' }}` is the intentional pattern.
- Font accent class: `font-press-start` (from `--font-press-start` set in `layout.tsx`).
- ReUI-style CSS variables (`--primary`, `--card`, `--border`, …) exist in `globals.css` with a `.dark` variant, though no ReUI components are in use yet.

## Client vs Server Components

- `"use client"` is required for: `usePathname`, `useState`, `useEffect`, `useRef`, Framer Motion.
- Server components: `layout.tsx`, `Footer.tsx`, `HeroAvatar.tsx`, `page.tsx` files.
- Client components: `Header.tsx`, `TypingTitle.tsx`, `SynthwaveBackground.tsx` (scroll-reactive sun), `HeroSkills.tsx`, `HeroInventory.tsx`, `HeroQuests.tsx`, `ProjectGrid.tsx`.
- Import Framer Motion from `framer-motion`.

## Static Assets (`/public`)

```
public/
├── images/
│   ├── avatar-manal.png        # Hero avatar
│   ├── social_thumbnail.jpg    # OpenGraph preview image (1200×630)
│   └── xp/
│       ├── skills/             # skill1-style2 … skill4-style2 .png — ability icons
│       └── items/              # laravel, react, nodejs, mysql, postgre, figma,
│                               #   vscode, github, wordpress, postman .png
└── vcard.vcf                   # Downloadable contact card
```

## Design Theme

Dark-only (`data-theme="dark"` on `<html>`, `body` base `#0b0a14`). The `.dark` class variant is **not** auto-activated — add `class="dark"` to `<html>` if a ReUI component needs it.

The RPG/gaming metaphor:

| Real concept | RPG label |
|---|---|
| Tech skills | Abilities |
| Tools & frameworks | Inventory (rarity tiers: Legendary → Common) |
| Work history | Quests |
| Years of experience | XP / Level |
| Current job (not completed) | Active quest |

Fonts: Roboto (body) + Press Start 2P (pixel-font accent via `font-press-start` class).
