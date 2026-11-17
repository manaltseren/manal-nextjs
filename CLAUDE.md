# next-manal — Personal Portfolio

RPG-themed personal portfolio for Manaltseren B. (Manalaa), a web developer. The site presents skills, tools, and work experience as an RPG character sheet — abilities, inventory, quests, and XP.

**Production URL:** https://manal.dev

## Tech Stack

- **Next.js 16** (App Router, **TypeScript** — `.tsx` / `.ts`)
- **React 19**
- **Tailwind CSS 4** with `@tailwindcss/postcss` (no `tailwind.config.js`)
- **Framer Motion** (`framer-motion`) for animations
- **Line Awesome** icon font — only on the `/invite` page (imported in `app/invite/layout.tsx`)
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
│   ├── Footer.tsx              # Copyright line, dynamic year (server)
│   ├── SynthwaveBackground.tsx # Global synthwave backdrop, scroll-reactive sun (client)
│   ├── TypingTitle.tsx         # Terminal-style typing heading (client)
│   ├── PixelReveal.tsx         # Stepped scroll-reveal wrapper + useRevealed() (client)
│   ├── pixel/
│   │   └── SocialIcon.tsx   # Hand-drawn pixel social icons
│   ├── hero/
│   │   ├── HeroAvatar.tsx   # Name, class/level, XP bar, contact button (client)
│   │   ├── HeroCharacter.tsx# CHARACTER window: equipment, attributes, bag, skill action bar (client)
│   │   ├── character/      # data.ts (skills, gear, attributes) + ui.tsx (slots, tooltips)
│   │   └── HeroQuests.tsx   # Work history as RPG quests w/ hover overlay (client)
│   └── portfolio/
│       └── ProjectShowcase.tsx # Portfolio cards w/ cover image + search/filter/pagination (client)
├── lib/
│   └── pixel.ts            # Shared helpers: pxVars, stepped, smooth, rand
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
3. **Pixel sun** — an SVG generated in `SynthwaveBackground.tsx` (32×32 grid, color bands, scanline gaps in the lower half) inside `.synthwave-bg__sunclip` (clipped at the horizon so the lower ~28% sinks behind it). Its "glow" is a pixel halo — a solid inner ring + a dithered (checkerboard) outer ring — whose opacity fades from 1 to 0 as it sets (driven by `night`, so it returns when scrolling back up). A ray/wave "sunshine" layer was tried and reverted — too much. The SVG is 150% of `.synthwave-bg__sun-wrap` (offset −25%) to make room for the halo. **The sun sinks on scroll:** Framer Motion `useScroll`/`useTransform` drives the wrapper's `y` (0→320px over the first 600px of scroll) so it "sets" behind the horizon as you scroll down. The `.synthwave-bg__sunclip` itself also rises with the horizon group (`gridY`) so its clip line stays glued to the (rising) horizon line — otherwise the sinking sun pokes through the gap between the risen horizon and a stale clip. The wrapper's horizontal centering (`x: -50%`) is also set by Framer — don't add `transform` to `.synthwave-bg__sun-wrap` in CSS.
4. **Neon grid floor** — `.synthwave-bg__grid`, CSS perspective grid scrolling toward the viewer (intentionally NOT pixel art — a pixel-canvas version was tried and reverted); a `mask-image` fades the far lines out to prevent horizon shimmer/aliasing (don't remove that mask). The grid, horizon line, and `.synthwave-bg__glow` rise slightly on scroll (Framer `y`, 0→−48px over 600px) as a counter-motion to the setting sun. The grid sits in a `.synthwave-bg__grid-wrap` translate-only wrapper (solid floor background) because its own `perspective()`+`rotateX()` transform can't be overwritten by Framer's translate.
5. **Pixel mountains** — `.synthwave-bg__mountains`, a 320×24 SVG heightmap (triangle-wave peaks, low in the middle so the sun stays visible) sitting on the horizon and rising with `gridY`. Height is `7.5vw` so its pixels stay square.

**Day/night cycle:** a `night` value (0→1 over the first 360px of scroll, i.e. until the sun is fully set) drives opacities: the dusk sky fades out (darker night sky), the stars go from faint (0.18) to full, and the grid / horizon / glow dim. Sun up = lighter sky + bright lines + faded stars.

**Scroll motion runs on all screen sizes** (it used to be desktop-only). To stop the mobile address bar from resizing the fixed layer mid-scroll (which drifted the %-positioned sun/glow), `.synthwave-bg` uses `top:0` + a fixed `height: 100lvh` instead of `inset: 0`.

To keep this visible, `main`, the page wrappers, and the cards are transparent/semi-transparent; `body` has a `#0b0a14` base.

## Pages

**Title-screen layout (both pages):** the first screen belongs to the background scene — the hero is vertically centered in the sky band (header → top of the sun, `min-h-[calc(67svh-170px)]`), and the section ends just under the horizon (`min-h-[calc(67svh+96px)]`) so the next content (first section heading) peeks in over the dark floor instead of leaving an empty screen. Content arrives as the sun sets, so it always lands on the dark night sky. Keep content out of the first viewport's lower half. The one exception is `PressStart` (`src/components/PressStart.tsx`): a blinking arcade-style "▶︎ PRESS START" prompt `position: fixed` at `top: 82%` (mid-floor; the horizon is at 67%), so it never depends on page layout or lands on the sun. It is desktop-only on the About (home) page, because the mobile avatar fills the floor. It shows only at the very top of the page, using the same 24px/4px thresholds as `PixelReveal`, so it's the inverse of the hidden sections. It never overlaps them: it appears only after their fade-out finishes (`HIDE_DURATION`), and they wait `SHOW_DELAY` before revealing so the prompt clears first. Click or Enter/Space smooth-scrolls to `#projects` / `#character`.

### Portfolio (`/portfolio`)

Title screen (MANAL.DEV / PORTFOLIO + one intro line), then `ProjectShowcase` (`#projects`) — the portfolio project grid, sitting over the global synthwave background. Each card leads with a **framed 16:10 cover image**: if the project has an `image` (path under `/public`, e.g. `/images/projects/foo.png`) the screenshot is shown via a plain `<img>` (object-cover, hover zoom); otherwise a **themed `CoverPlaceholder`** renders — the project's initials over a category-colored perspective grid. The cover has a scanline overlay, a CRT "boot-up" reveal on scroll-in (`useInView` per card: dim/desaturated → bright), category/status/year badges over the image, and a `VIEW PROJECT ▶︎` ribbon that slides up on hover.

Below the cover: title, description, inline feature chips, and a footer progress bar (`100%` / `WIP`). `Project` type: `title`, `category`, `year`, `description`, `features[]`, optional `link`, `shipped`, optional `image`. The grid has a live search box, auto-colored category filter chips (palette assigned by first appearance), pagination (`PAGE_SIZE = 6`), an empty/"NO RESULTS" state, and a results counter. The project data in `ProjectShowcase.tsx` is still **demo data** — replace with real projects; drop screenshots in `/public/images/projects/`.

### Home / About (`/`)

Title screen with `HeroAvatar` (desktop: title screen; mobile: normal stacked flow), then the stacked sections `HeroCharacter` (`#character`) → `HeroQuests`, with NO separators between them (just generous spacing — the user removed the dividers). Each is wrapped in `PixelReveal` — a smooth eased wipe (`clip-path` top→bottom + soft fade/rise) that waits for the user to scroll (sections peeking into the first screen stay hidden on load), wipes in as each section comes into view, and fades away again when scrolled back to the very top (two-way, with show/hide hysteresis at 24px/4px so it doesn't flicker); the portfolio page wraps `ProjectShowcase` in it too, and its cards gate their entrance on `useRevealed()`; entrance animations inside sections wait for it via `useRevealed()`. Skipped under reduced motion. (A tabbed version was tried and reverted — keep the sections stacked.) The page-level OpenGraph metadata (`fb:app_id`, etc.) lives here.

**Social/OG image is generated dynamically** by `src/app/opengraph-image.tsx` via `next/og` (a 1200×630 synthwave card — `manal.dev`, MANALAA in Press Start 2P, title, LVL badge, striped sun). `twitter-image.tsx` reuses it. The pixel font is loaded from the colocated `PressStart2P.ttf` via `readFileSync(new URL(...))` (Node's `fetch` can't read `file://`). `metadataBase` is set in `layout.tsx` so the image URL resolves absolutely. Note: satori (next/og) has limited CSS — no `perspective`/3D, `z-index` unsupported (layer via DOM order).

## Components

### HeroAvatar
Client component. Plain `<img>` (not `next/image`) at `/images/avatar-portrait-long.webp` (see Avatar look below) — the user's pixel-art bust portrait (glasses, dark purple hair, dark tee with cyan </> logo; transparent bg), a 384px WebP from their 1254px source. Hi-res, so NO `pixelated` rendering (a 64×64 true-pixel resample was tried, but 180px isn't an integer multiple of 64 → uneven pixels). `scale(1.06)` from the bottom so the shoulders meet the frame edge. **Layout: the "player card" structure WITHOUT a card on desktop** (the user tried a framed card, then a see-through one, and wanted no card so the scene shows): everything sits on the synthwave scene, aligned to the container edges. Top row: avatar (168px framed portrait + sparkles) | column with name + ONLINE + `.px-lvl` LVL badge (right end of the name row), bio (`max-w-xl`), and the full-width XP bar pinned to the bottom (`md:mt-auto`). Under it (`md:mt-8`): ▶ CURRENT QUEST + value on the left, CONTACT ME + raised violet Instagram `.px-btn` (pixel IG icon) on the right. Mobile: stacked and centred, also with NO backing card (the user removed it) — straight on the scene. Pixel social icons (`src/components/pixel/SocialIcon.tsx`: hand-drawn 12×12 Instagram in `currentColor`, 24px = 2×; the unused LinkedIn / Facebook ones were removed — get them from git history if needed). Shows name with an ONLINE badge beside it, level, bio + current quest, XP bar, and a "Contact me" button linking to `/vcard.vcf`.

### HeroCharacter
Client component (`src/components/hero/HeroCharacter.tsx`) — ONE game-accurate **CHARACTER window** that replaced the separate Skills and Inventory sections (they describe the same character). Data in `hero/character/data.ts`, building blocks (palettes, `Slot`, `EmptySlot`, `StatBar`, `RankPips`, item sprites, tooltips) in `hero/character/ui.tsx`. Structure:
- **No outer window/card:** the sub-panels (EQUIPMENT, SKILLS, ATTRIBUTES, BAG) are each their own bordered window (`px-panel`, purple `#7a5dff` border, `#0f0d26` bg) sitting directly on the scene under the CHARACTER heading — the user didn't want one big card around them.
- **EQUIPMENT (paper doll, left):** `grid-cols-[1fr_2.6fr_1fr]` — narrow slot columns HEAD/CHEST/BOOTS | wide full-body avatar frame (`aspect-3/4`, sets the row height; side slots `justify-between` to fill it) | AMULET/RING/TRINKET, with MAIN/OFF HAND centred under the avatar (`w-[calc((100%-24px)/4.6)]` = one side-slot width given the `gap-x-3` column gaps; `gap-3 mt-3` around the weapons). The avatar frame (`aspect-2/3`, dithered `#0d0b24` backdrop) shows **`CharacterSprite`** (`hero/character/CharacterSprite.tsx`) — the user's OWN character art (developer in glasses + dark tee, laptop with cyan </> logo, white sneakers), cleaned into a **true 43×111 pixel sprite**: resampled onto the art's real pixel grid (~9.6 px cells → median of each cell centre), background glow removed (border flood fill that only climbs the glow and stops at the darker outline; largest component kept), reduced to a 24-colour palette (whites + cyan logo kept exact), then the sneaker rows of `lower.png` were cleaned (glow-remnant mid tones + orphaned outline pixels removed — the purple haze between/around the shoes), and exported as transparent PNG layers in `public/images/character/` (`upper.png` head/torso/arms/laptop, `lower.png` legs/sneakers, `glint.png` brightened </> pixels). Rendered as stacked `<img>`s with `imageRendering: pixelated` (correct here — true pixel art at 1px per art pixel; the "never pixelated" rule is only for the 256px item PNGs), sized by height (`h-[82%]` + `mb-[13%]` so the sneakers stand on the pedestal, `-translate-x-[8%]` because the laptop makes the sprite asymmetric (feet are 14% right of the sprite centre; the user wanted it a bit right of fully feet-centred) — note margin % is relative to the frame WIDTH; `aspect-ratio 43/111`). Behind it, `StageBackdrop` (`hero/character/StageBackdrop.tsx`): a static 60×90 pixel "character select" stage — banded night sky, checkerboard-dithered floor edge, stepped pedestal (NO spotlight and NO stars — both removed at the user's request); hard-edged rects only. **Idle:** the upper layer dips 1 art-pixel (`100/111 %`) and back (0.9s hold frames) while legs stay planted; the </> glints on alternate 0.6s frames. Off under reduced motion. Hand-drawn attempts (realistic, chibi, fighter, relaxed) were all replaced — the user prefers their own art; to change the character, get new art (ideally a transparent pixel sprite / sprite sheet) and re-run the same cleanup.
- **Layout: a 2×2 grid** (`md:grid-cols-[1.15fr_1fr]`) so paired windows share a row height — row 1: paper doll | SKILLS, row 2: ATTRIBUTES | BAG (grid rows stretch both cells; SKILLS/BAG panels are `h-full`). Mobile: one column — doll, attributes (collapsed by default, title toggles), bag, skills (`order-*`). BAG has NO window either (`SubPanel bare`): title + slots straight on the scene; 5 slot columns that FILL the column width (`grid-cols-5`, 6–8px gaps), `BAG_SIZE` 10 (5×2) so the rows stay full.
- **Left side has NO card** (`SubPanel bare`): EQUIPMENT (paper doll) + ATTRIBUTES sit straight on the scene, like the top profile. Only SKILLS (top right) is a framed window.
- **ATTRIBUTES (left, below the doll):** a **Souls-like stat sheet** — plain open-ended numbers, NO progress bars (a bar out of 100 read as "fully mastered"). Values are **derived from the character level** (`attributesFor(level)` in data.ts): every stat starts at `BASE_STAT` 10, each level grants `POINTS_PER_LEVEL` 10 points split by `statWeights` (largest-remainder rounding, so points above base always = level × 10). They grow every year with the level (LV 13 → BACKEND 41, ARCHITECTURE 37, FRONTEND 36, DATABASES 35, LEADERSHIP 31). Header shows `LV {year − 2013}`. The level→points rule is NOT shown on the page (owner-only knowledge). To rebalance, edit the weights, not the numbers.
- **BAG (right, under SKILLS):** 5×2 = 10 slots (`BAG_SIZE`), `n / 10` counter, dithered empties. Consumables (`count`, hand-drawn `sprite`: `coffee` ×99, `duck`) show their stack count.
- **SKILLS (right, above BAG):** the 4 Q W E R skill slots (ICON ONLY — 48px sprite, no pips; NO bounce/hop on the selected icon (removed at the user's request); a skill with `image` (full-bleed art) fills the slot edge to edge (`Slot bleed`: art under a redrawn bevel, hotkey on a solid dark key-cap) and unselected art icons are dimmed (`brightness(.6)`); type-colour border, ★ for Ultimate; same 4-column grid as the bag) with the selected skill's info shown **inline right below** (`SkillInfo` in ui.tsx, structured, not flat — the user found a cluttered version messy AND a bare version boring: header = name with the rank pips on its RIGHT, a TYPE line, the `tagline` (NO icon — it would duplicate the selected slot's sprite); then bonuses as a list with type-coloured pixel bullets; No COST / COOLDOWN / RANGE block (removed at the user's request). No SCALES WITH bars (removed). Fills the Skills panel so it has no empty bottom. `effect`, `stack`, `scaling` are not shown). Hover / tap / focus / Q W E R changes the selected skill (instant swap + short smooth fade-in). **Fixed height:** all four `SkillInfo`s are rendered stacked in one grid cell (`col-start-1 row-start-1`), inactive ones `invisible` + `aria-hidden`, so the box is always as tall as the longest description and the panel never jumps when hovering between skills. No skill tooltip. No locked/empty filler slots (the user found them wasteful). Q/W/E/R toggle that skill's tooltip while the window is on screen.

All details are **tooltips anchored to the slot** (portal, `position: fixed`; right of the slot, else left, else below/above — measured in `useLayoutEffect`, `left/top` written directly). Mouse hover opens, touch tap toggles, keyboard focus-visible opens; scroll / resize / tapping outside closes. Only ITEMS use tooltips. Item tooltip: name in rarity colour (+ ×count), `kind`, rarity + ILVL, green stat lines, quoted flavor text, EQUIPPED / IN BAG; Epic/Legendary get stepped `Sparkle`s. `Skill` has `cost`, `range`, `scaling[]`; `Tool` has `kind`, `ilvl`, `stats[]`, optional `slot`, `icon` | `sprite`, `count`. Tool icons in `/public/images/xp/items/`; **Skill order (data.ts): Code Strike (Active, Q), Hyperlink (Active, W), True Sight (PASSIVE — no hotkey, no key label), Full-Stack Mode (ULTIMATE, R)**. Hotkeys come from `skillKeys` in data.ts, derived by type: Actives take Q, W, E in order, the Ultimate is always R, Passives get none — a combo: True Sight reveals the weakness → Code Strike hits it → Hyperlink connects the solution → Full-Stack Mode brings it together. In the notes below, "Q … face emerging from the dark" describes Full-Stack Mode (`fullstack.png`, now on R). Q Code Strike `strike.png` — a solid tapered cyan energy spear (white core, dark outline) striking diagonally from the top-left into a big red-hot weak point (white→pink→red diamond core + dithered red glow) at the centre of a faceted purple crystal (lit upper edges, chipped lower-right) cracked by fractures that glow red near the core; white-cyan impact star; purple chips + red/cyan sparks bursting out toward the bottom-right. The old Overdrive skill and its icon were removed. **Skill icons are full-bleed MOBA-style art, kept MINIMAL** (the user asked: one focal point per icon on a dark banded backdrop — no extra sparks, circuit trails, wave rings, afterimages or flying keys; Q is a face emerging FROM THE DARK, zoomed out to head + top of the shoulders (portrait crop 290px from (47,22), EYE-SHAPED glow at the measured eye positions (eye whites in the source at x≈163/222, y≈163), drawn on a finer 2px grid inside the lens rows: bigger white core → wider cyan almond → solid #1a8fb0 halo → dithered #14506e outer halo, longer tapered trail from each outer corner (strengthened slightly once it became the Ultimate), 3px cyan rim; three FAINT full-stack symbols in the dark background, dim violet #3b2d7a, kept clear of the hair — </> top-right (frontend), a database cylinder top-left (backend), { } right side (full stack) — subtle, not too many (the user asked); the glasses stay the DEFAULT avatar glasses — a glowing frame and full sunglasses-style glowing lenses were both tried and looked weird; only the EYES glow): near-black backdrop, face two-three bands darker, only the cyan rim + glowing eyes light it; W is the silhouette gripping glowing wire bundles; (the old Overdrive aura-silhouette icon was removed with the skill; lesson kept: never draw detailed whole hands — pixel hands read as puppet hands; silhouettes must be hand-built, not taken from the character sprite)). (`Skill.image`, required; 192px PNGs in `/public/images/xp/skills/`, a 48×48 art grid ×4 except Q; they fill the slot edge to edge via `Slot bleed`, hotkey and Ultimate ★ on solid dark key-caps; the old inline `PixelSprite` skill icons were deleted). Q `fullstack.png` — the owner's long-hair portrait in a tight face crop, gradient-mapped into 7 hard violet→cyan bands with a sculpting light, cyan rim light, banded backlight, energy strands, glowing cyan-white eyes with light trails, sparks (modelled on a League-like icon the user shared). W (Hyperlink, formerly System Sync) `sync.png` — the CHARACTER USING THE POWER (the user wants skill icons to show the character's power, not just an object): a dark upper-body silhouette (near-black fill, violet rim on the left half / cyan on the right, two glowing eye pixels, no inner detail) with arms stretched out nearly straight (rim light only on head/torso — NOT on the arms, the current traces them), each simple fist GRIPPING two smooth 2-cell glowing wire arcs — violet (backend) left, cyan (APIs) right — fanning out of frame, sparks at the grips, a white pulse on each wire, over a brighter violet core; to read as CONNECTING, a bold 2-cell current (light top edge, violet left / cyan right) runs from the left grip up the arm, across the shoulders into a bright white chest core (violet ring on its left, cyan on its right) and out the right arm to the right grip, with white pulses travelling inward. (Replaced: traces-into-a-core-orb; a plain chain-link object.) E (True Sight, formerly Deep Scan) `scan.png` — the anime "I noticed something" GLASSES GLINT: ONE lens only, filling the icon with EQUAL margins left and right (lens x 3–43 of 48; the flare stays inside the lens; a smaller ~2/3 lens and a lopsided right gap were tried and reverted), same shape as the avatar's glasses (wide rectangle, straight top, vertical sides, stepped-round bottom corners, black frame, violet rim light on top; temple arm / bridge run off the edges), ONE narrowed, focused eye DIMLY visible behind the dark violet lens in the avatar's eye style (thick flat upper lid with a small upward flick, big CYAN iris — `#4edbec` ring, `#1a8fb0` inner ring, dark teal core, white/pale-cyan catch light; red and pink were tried and replaced), a white-cyan diagonal shine across the lens, an anime lens-flare sparkle on the top-right of the glass, violet top + cyan right rim light on the frame, faint cyan reflection along the lens bottom, plain banded violet backdrop (a light-ray burst and bottom-corner energy wisps were tried and removed). No face/skin (the user asked). The user is a person, not a machine — avoid tech-gadget metaphors for this skill. (Dropped: close-up eyeball = creepy; glasses + scan beam = weird; radar = too machine-like.) All share the banded backdrop + checkerboard-dithered dark vignette. Generated by a sharp script (not in the repo).


**Avatar look (hairstyle):** the TOP avatar portrait is `long` (`/images/avatar-portrait-long.webp`); the `short` portrait file was deleted, so `look.ts` now only lists `long` (re-add the file + entry to switch back). Chosen by the owner-only config `AVATAR_LOOK` in `hero/character/look.ts` (currently `long`). No visitor-facing switch (the user explicitly doesn't want one). The full-body Character sprite is ALWAYS the short-hair one (`/images/character/`); a long-hair sprite was made and then deleted at the user's request.

### HeroQuests
Client component. Work positions as quests; cards reveal a "QUEST COMPLETE" reward overlay on hover (active CTO role uses `completed: false` → "IN PROGRESS"). Scroll-in via Framer Motion `useInView`. Shows 3 quests, expands to all.

### Header
Client component, pixel style: transparent over the scene at the top of the page; once scrolled (>8px) a solid dark bar with a hard bevelled bottom edge fades in (stepped, no blur), pixel `</>` code-sign logo, nav items as notched pixel chips with number keys (active = solid purple, hover = cyan border). Mobile: a MENU burger button styled as the same raised violet `.px-btn` as CONTACT ME / Instagram (`#c084fc`, stepped shadow, sinks on press, fills violet on hover; bars in `currentColor`, wiggle on hover) opens a **full-height right→left drawer** styled as a game "PAUSED" menu — HP hearts, close X + ESC button (same raised violet `.px-btn` as the MENU button; the X is a smooth stroked SVG, not pixel steps), "SELECT STAGE" items (text only — the item sprites were removed) and a bouncing yellow cursor (↑/↓ keys move it), and a yellow RESUME button (no socials — removed at the user's request). The drawer slide uses a **smooth** transform-only ease (`[0.22, 1, 0.36, 1]`, 0.38s) — not stepped, which read as lag on a large panel; small details (icons, cursor, hearts) stay stepped. Esc / backdrop / RESUME close it; page scroll is locked while open.

### Footer
Server component. A single copyright line with the dynamic year.

### TypingTitle
Client component. Types out a heading character-by-character with a blinking cursor; starts when `inView`.

## Styling Conventions

- **Tailwind v4** — use `@utility`, `@theme`, `@theme inline` in CSS; no `tailwind.config.js`.
- **Color palette**: `$primary-color: #7a5dff` (purple), `$secondary-color: #4edbec` (cyan).
- Shared helpers (`pxVars`, `stepped`, `smooth`, `rand`) live in `src/lib/pixel.ts` — import them, don't redefine per file.
- Font accent class: `font-press-start` (from `--font-press-start` set in `layout.tsx`).
- ReUI-style CSS variables (`--primary`, `--card`, `--border`, …) exist in `globals.css` with a `.dark` variant, though no ReUI components are in use yet.

## Client vs Server Components

- `"use client"` is required for: `usePathname`, `useState`, `useEffect`, `useRef`, Framer Motion.
- Server components: `layout.tsx`, `Footer.tsx`, `page.tsx` files.
- Client components: `Header.tsx`, `TypingTitle.tsx`, `SynthwaveBackground.tsx` (scroll-reactive sun), `PixelReveal.tsx`, `PressStart.tsx`, `HeroAvatar.tsx`, `HeroCharacter.tsx`, `HeroQuests.tsx`, `ProjectShowcase.tsx`.
- Import Framer Motion from `framer-motion`.

## Static Assets (`/public`)

```
public/
├── images/
│   ├── avatar-portrait-long.webp # Top avatar portrait
│   ├── character/              # Full-body sprite layers (upper, lower, glint, drink)
│   ├── projects/               # Portfolio screenshots
│   └── xp/
│       ├── skills/             # strike, sync, scan, fullstack .png — skill icons
│       └── items/              # 256px tool logos (originals) + pixel/ (shown in-game)
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
- **Sprites are inline SVG** with `shapeRendering="crispEdges"`, one `<rect>` per pixel (merge horizontal runs). Author them as text grids of palette keys (see the item sprites in `hero/character/ui.tsx`, the header `</>` logo). Every sprite gets a **1px dark outline** (`#0b0a14`/`#140e1f`) and 2–3 flat shades per material.
- **Don't fake pixel art by downscaling a photo/painting** — it reads as a blurry mosaic. Hand-author sprites, or use a proper pixel-art source.
- When exporting a raster sprite, scale by an **exact integer** with nearest-neighbour so every art pixel stays square.
- Item/tool icons are shown as **true pixel icons** from `/images/xp/items/pixel/` (26×26: logo downscaled to 24px, hard alpha, ≤6 flat colours, 1px dark outline; per-icon alpha/colour tuning for thin logos). **All 10 are the user's own pixel-art logos** from one sprite sheet (figma, mysql, git, postgre, laravel, react, vscode, postman, nodejs, wordpress — each snapped to its pixel grid, trimmed, centred on a transparent square, 26–35px); don't overwrite them with the auto-converter. Git uses the **Git** logo (`git.png`; the user uses Git, not GitHub). All are rendered with `imageRendering: "pixelated"` via `ItemIcon`. The 256px originals stay in `/images/xp/items/` — never put `pixelated` on those.

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
- Every page/section/header/footer uses `max-w-5xl mx-auto px-5` — no other max-widths.
- Title-screen first view (hero over the scene), sections stacked with generous spacing and revealed with `PixelReveal` (see Pages above).
- The grid floor of the background is intentionally **smooth (not pixelated)** — a pixel-canvas version was tried and reverted.
