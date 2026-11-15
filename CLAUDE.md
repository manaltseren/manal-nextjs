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
│   ├── page.tsx            # Home (/) — About: 4 hero sections (RPG character sheet) + OpenGraph metadata
│   ├── globals.css         # Tailwind imports, CSS variables, synthwave background styles
│   └── portfolio/
│       └── page.tsx        # /portfolio — project grid (portfolio showcase)
├── components/
│   ├── Header.tsx              # Fixed nav + animated mobile menu (client)
│   ├── Footer.tsx              # Social links, dynamic year (server)
│   ├── SynthwaveBackground.tsx # Global synthwave backdrop, scroll-reactive sun (client)
│   ├── TypingTitle.tsx         # Terminal-style typing heading (client)
│   ├── PixelReveal.tsx         # Stepped scroll-reveal wrapper + useRevealed() (client)
│   ├── pixel/
│   │   └── PixelSprite.tsx  # Hand-drawn 16×16 SVG sprites (ability icons)
│   ├── hero/
│   │   ├── HeroAvatar.tsx   # Name, class/level, XP bar, contact button (server)
│   │   ├── HeroSkills.tsx   # Abilities — 4 skill cards + detail modal (client)
│   │   ├── HeroInventory.tsx# Tool inventory grid w/ rarity borders + tooltip (client)
│   │   └── HeroQuests.tsx   # Work history as RPG quests w/ hover overlay (client)
│   └── portfolio/
│       └── ProjectShowcase.tsx # Portfolio cards w/ cover image + search/filter/pagination (client)
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
| `/` | `src/app/page.tsx` | Home — the About / RPG character sheet (4 hero sections) |
| `/portfolio` | `src/app/portfolio/page.tsx` | The portfolio project grid over the synthwave background |

`/about` permanently redirects to `/` (`next.config.mjs` → `redirects()`).

Header nav has two items: **About me** (`/`, key 1) and **Portfolio** (`/portfolio`, key 2).

## Background — SynthwaveBackground

The global animated backdrop (replaces the old Three.js + Vanta fog). A pure-CSS synthwave scene, mounted once in `layout.tsx`, `position: fixed`, `z-index: -10`. Styles live in `globals.css` under `.synthwave-bg*`. Layers, back to front:

The whole scene is **pixel art**: hard color bands instead of smooth gradients, `shapeRendering="crispEdges"` SVGs, dithering instead of blur.

1. **Banded sky** — night sky bands on `.synthwave-bg`, plus a lighter **dusk** sky (`.synthwave-bg__dusk`) on top. The stepped horizon glow lives in `.synthwave-bg__glow`, which scrolls WITH the grid group (same `gridY`) so it stays attached to the horizon. `.synthwave-bg__grid-wrap` has a solid floor background so the dusk sky never shows below the horizon.
2. **Pixel starfield** — `.synthwave-bg__stars`; 2–3px square stars plus a few `--cross` stars, stepped (`steps()`) twinkle. Positions are deterministic (a `Math.sin` hash, not `Math.random`) so SSR and client agree.
3. **Pixel sun** — an SVG generated in `SynthwaveBackground.tsx` (32×32 grid, color bands, scanline gaps in the lower half) inside `.synthwave-bg__sunclip` (clipped at the horizon so the lower ~28% sinks behind it). Its "glow" is a pixel halo — a solid inner ring + a dithered (checkerboard) outer ring — whose opacity eases from 1 to 0.7 while it sets. The SVG is 150% of `.synthwave-bg__sun-wrap` (offset −25%) to make room for the halo. **The sun sinks on scroll:** Framer Motion `useScroll`/`useTransform` drives the wrapper's `y` (0→320px over the first 600px of scroll) so it "sets" behind the horizon as you scroll down. The `.synthwave-bg__sunclip` itself also rises with the horizon group (`gridY`) so its clip line stays glued to the (rising) horizon line — otherwise the sinking sun pokes through the gap between the risen horizon and a stale clip. The wrapper's horizontal centering (`x: -50%`) is also set by Framer — don't add `transform` to `.synthwave-bg__sun-wrap` in CSS.
4. **Neon grid floor** — `.synthwave-bg__grid`, CSS perspective grid scrolling toward the viewer (intentionally NOT pixel art — a pixel-canvas version was tried and reverted); a `mask-image` fades the far lines out to prevent horizon shimmer/aliasing (don't remove that mask). The grid, horizon line, and `.synthwave-bg__glow` rise slightly on scroll (Framer `y`, 0→−48px over 600px) as a counter-motion to the setting sun. The grid sits in a `.synthwave-bg__grid-wrap` translate-only wrapper (solid floor background) because its own `perspective()`+`rotateX()` transform can't be overwritten by Framer's translate.
5. **Pixel mountains** — `.synthwave-bg__mountains`, a 320×24 SVG heightmap (triangle-wave peaks, low in the middle so the sun stays visible) sitting on the horizon and rising with `gridY`. Height is `7.5vw` so its pixels stay square.

**Day/night cycle:** a `night` value (0→1 over the first 360px of scroll, i.e. until the sun is fully set) drives opacities: the dusk sky fades out (darker night sky), the stars go from faint (0.18) to full, and the grid / horizon / glow dim. Sun up = lighter sky + bright lines + faded stars.

**Scroll motion is desktop-only** (`min-width: 768px`, via a `matchMedia` flag in the component). On mobile the address bar resizing the viewport mid-scroll desyncs scroll-linked transforms on the fixed layer (sun/glow drift), so small screens get a static scene — the "sun up" state (sun on the horizon, dusk sky, faint stars).

To keep this visible, `main`, the page wrappers, and the cards are transparent/semi-transparent; `body` has a `#0b0a14` base.

## Pages

**Title-screen layout (both pages):** the first screen belongs to the background scene — the hero is vertically centered in the sky band (header → top of the sun, `min-h-[calc(67svh-170px)]`), and the section ends just under the horizon (`min-h-[calc(67svh+96px)]`) so the next content (first section heading) peeks in over the dark floor instead of leaving an empty screen. Content arrives as the sun sets, so it always lands on the dark night sky. Keep content out of the first viewport's lower half. The one exception is `PressStart` (`src/components/PressStart.tsx`): a blinking arcade-style "▶︎ PRESS START" prompt `position: fixed` at `top: 82%` (mid-floor; the horizon is at 67%), so it never depends on page layout or lands on the sun. It is desktop-only on the About (home) page, because the mobile avatar fills the floor. It shows only at the very top of the page, using the same 24px/4px thresholds as `PixelReveal`, so it's the inverse of the hidden sections. It never overlaps them: it appears only after their fade-out finishes (`HIDE_DURATION`), and they wait `SHOW_DELAY` before revealing so the prompt clears first. Click or Enter/Space smooth-scrolls to `#projects` / `#abilities`.

### Portfolio (`/portfolio`)

Title screen (MANAL.DEV / PORTFOLIO + one intro line), then `ProjectShowcase` (`#projects`) — the portfolio project grid, sitting over the global synthwave background. Each card leads with a **framed 16:10 cover image**: if the project has an `image` (path under `/public`, e.g. `/images/projects/foo.png`) the screenshot is shown via a plain `<img>` (object-cover, hover zoom); otherwise a **themed `CoverPlaceholder`** renders — the project's initials over a category-colored perspective grid. The cover has a scanline overlay, a CRT "boot-up" reveal on scroll-in (`useInView` per card: dim/desaturated → bright), category/status/year badges over the image, and a `VIEW PROJECT ▶︎` ribbon that slides up on hover.

Below the cover: title, description, inline feature chips, and a footer progress bar (`100%` / `WIP`). `Project` type: `title`, `category`, `year`, `description`, `features[]`, optional `link`, `shipped`, optional `image`. The grid has a live search box, auto-colored category filter chips (palette assigned by first appearance), pagination (`PAGE_SIZE = 6`), an empty/"NO RESULTS" state, and a results counter. The project data in `ProjectShowcase.tsx` is still **demo data** — replace with real projects; drop screenshots in `/public/images/projects/`.

### Home / About (`/`)

Title screen with `HeroAvatar` (desktop: title screen; mobile: normal stacked flow), then the stacked sections `HeroSkills` (`#abilities`) → `HeroInventory` → `HeroQuests`, with NO separators between them (just generous spacing — the user removed the dividers). Each is wrapped in `PixelReveal` — a smooth eased wipe (`clip-path` top→bottom + soft fade/rise) that waits for the user to scroll (sections peeking into the first screen stay hidden on load), wipes in as each section comes into view, and fades away again when scrolled back to the very top (two-way, with show/hide hysteresis at 24px/4px so it doesn't flicker); the portfolio page wraps `ProjectShowcase` in it too, and its cards gate their entrance on `useRevealed()`; entrance animations inside sections wait for it via `useRevealed()`. Skipped under reduced motion. (A tabbed version was tried and reverted — keep the sections stacked.) The page-level OpenGraph metadata (`fb:app_id`, etc.) lives here.

**Social/OG image is generated dynamically** by `src/app/opengraph-image.tsx` via `next/og` (a 1200×630 synthwave card — `manal.dev`, MANALAA in Press Start 2P, title, LVL badge, striped sun). `twitter-image.tsx` reuses it. The pixel font is loaded from the colocated `PressStart2P.ttf` via `readFileSync(new URL(...))` (Node's `fetch` can't read `file://`). `metadataBase` is set in `layout.tsx` so the image URL resolves absolutely. Note: satori (next/og) has limited CSS — no `perspective`/3D, `z-index` unsupported (layer via DOM order). The old static `public/images/social_thumbnail.jpg` is now unused.

## Components

### HeroAvatar
Server component. Plain `<img>` (not `next/image`) at `/images/avatar-manal.png`. Shows name with an ONLINE badge beside it, level, bio + current quest, XP bar, and a "Contact me" button linking to `/vcard.vcf`.

### HeroSkills
Client component. 4 ability cards from a static `skills` array (Full-Stack Forge, System Architect, Party Leader, Legacy Resurrection — each with tagline, effect, bonuses, `stack`, `cooldown`); clicking a card opens a detail modal via a React portal (gated behind a `mounted` flag for SSR safety). Icons are hand-drawn 16×16 sprites rendered by `PixelSprite` (`src/components/pixel/PixelSprite.tsx`: `forge`, `blueprint`, `banner`, `skull`) — the old `skill*.png` images are unused.

### HeroInventory
Client component. Tool grid; each `Tool` has a `rarity` mapped to border/colors via `rarityConfig` (Legendary / Epic / Rare / Uncommon / Common). On hover, a fixed-position tooltip follows the mouse (rendered via portal). Epic/Legendary tooltips get `Sparkle` particles — positions/speeds are derived deterministically from a `seed` (pure, no `Math.random`). Tool icons in `/public/images/xp/items/`.

### HeroQuests
Client component. Work positions as quests; cards reveal a "QUEST COMPLETE" reward overlay on hover (active CTO role uses `completed: false` → "IN PROGRESS"). Scroll-in via Framer Motion `useInView`. Shows 3 quests, expands to all.

### Header
Client component, pixel style: transparent over the scene at the top of the page; once scrolled (>8px) a solid dark bar with a hard bevelled bottom edge fades in (stepped, no blur), pixel `</>` code-sign logo, nav items as notched pixel chips with number keys (active = solid purple, hover = cyan border). Mobile: pixel burger (bars wiggle on hover) opens a **full-height right→left drawer** styled as a game "PAUSED" menu — HP hearts, close X, "SELECT STAGE" items with pixel sprites and a bouncing yellow cursor (↑/↓ keys move it), socials, and a yellow RESUME button. The drawer slide uses a **smooth** transform-only ease (`[0.22, 1, 0.36, 1]`, 0.38s) — not stepped, which read as lag on a large panel; small details (icons, cursor, hearts) stay stepped. Esc / backdrop / RESUME close it; page scroll is locked while open.

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

Fonts: Roboto (body) + Press Start 2P (pixel-font accent via `font-press-start` class) + VT323 (readable pixel font for descriptions/body copy via `font-pixel`, set up as `--font-pixel` in `layout.tsx`).

## Pixel Style Guide

The whole site is styled as **pixel art**. Follow these rules for any new or changed UI.

### Core rules
- **Hard edges only.** No `border-radius`, no `blur`, no `backdrop-filter`, no soft glows (`box-shadow` with blur, `drop-shadow` halos). Depth comes from **hard bevels** (light inset top, dark inset bottom) and **stepped hard shadows**.
- **No decorative lines.** The user dislikes thin lines/rules: no scanline sweeps, no section separators/dividers, no 1px hairline borders as decoration. Separate things with spacing or solid fills instead.
- **Banded colour, not gradients.** Use hard colour stops (`linear-gradient(... #a 0 20%, #b 20% 40%)`) for skies/bars, and **dithering** (checkerboard) instead of transparency fades where a fade is needed.
- **Stepped motion.** Animate in whole frames: `steps()` in CSS, or a stepped easing fn in Framer (`t => Math.ceil(t * n) / n`). Blinks are hard on/off (`times: [0, .5, .51, 1]`), not fades.
- **Respect `prefers-reduced-motion`** — every new animation needs a still fallback.

### Building blocks (`globals.css`, `@layer components`)
| Class | Use |
|---|---|
| `.px-panel` | Cards/windows: notched (stepped) corners from 4 box-shadows, inner bevel, stepped drop shadow. Theme with CSS vars `--px-border`, `--px-bg`, `--px-shadow`, `--px` (size). |
| `.px-outer` | Wrapper that reserves room for a `.px-panel`'s outer border + shadow (`padding: 4px 8px 8px 4px`) so panels don't overlap in grids. |
| `.px-chip` | Small notched badge/tag/icon-button (2px border, no shadow). Vars `--px-border`, `--px-bg`. |
| `.px-btn` | Pressable button: raised by a stepped shadow, sinks 4px on `:active`. |
| `.px-lvl` | The yellow level badge (solid `#facc15`, dark text, bevel, dark notched outline). |
| `.px-dither` | 2px checkerboard texture for slots/empty cells. |

Set the vars inline: `style={{ ["--px-border" as string]: color }}` (or a small `pxVars()` cast helper). For a **hover** colour change, put the default var in a class, not inline — e.g. `[--px-border:rgba(255,255,255,.14)] hover:[--px-border:#4edbec]` — because inline styles beat hover classes.

### Pixel art assets
- **Sprites are inline SVG** with `shapeRendering="crispEdges"`, one `<rect>` per pixel (merge horizontal runs). Author them as text grids of palette keys (see `PixelSprite.tsx`, the header `</>` logo). Every sprite gets a **1px dark outline** (`#0b0a14`/`#140e1f`) and 2–3 flat shades per material.
- **Don't fake pixel art by downscaling a photo/painting** — it reads as a blurry mosaic. Hand-author sprites, or use a proper pixel-art source.
- When exporting a raster sprite, scale by an **exact integer** with nearest-neighbour so every art pixel stays square.
- Never use `imageRendering: "pixelated"` on the 256px item/tool PNGs (they're hi-res; the browser default looks better).

### Palette
| Role | Colour |
|---|---|
| Base / outline | `#0b0a14` (body), panel bg `#12102e` / `#0f0d26` / `#0a0920` |
| Primary (purple) | `#7a5dff` (light `#c4b5ff`, `#9d85ff`; dark `#5a3fd6`) |
| Secondary (cyan) | `#4edbec` |
| Level / XP | yellow `#facc15` |
| Skill types | Active = cyan `#4edbec`, Passive = slate `#94a3b8`, Ultimate = violet `#c084fc` (never green/orange for these) |
| Status ONLINE | green `#4ade80` |

### Type
- `font-press-start` (Press Start 2P) for labels, headings, badges, buttons — small sizes (8–13px), `leading-none` when centring next to icons.
- `font-pixel` (VT323) for any sentence-length text (taglines, descriptions, bios) at ~18–22px. Never set paragraphs in Press Start 2P.

### Layout
- Every page/section/header/footer uses `max-w-4xl mx-auto px-5` — no other max-widths.
- Title-screen first view (hero over the scene), sections stacked with generous spacing and revealed with `PixelReveal` (see Pages above).
- The grid floor of the background is intentionally **smooth (not pixelated)** — a pixel-canvas version was tried and reverted.
