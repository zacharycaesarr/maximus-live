# V2 reset — 2026-08-31

## What happened

Previous V2 attempt archived to `v2/_archive/pre-reset-2026-08-31/`. Fresh `v2/src/` is a blank shell.

V1 at repo root is **untouched**.

## New direction

- Build **brick by brick**, starting with hero background only.
- Combine multiple inspirations across different pages (not one clone).
- Open to a **completely new visual identity** (not locked to V1 cream theme).
- Use **21st.dev** for component reference and code.
- Use **Leva** GUI so Zachary can tune sliders himself (remove before live).

## Checkpoint 1: Shader background ✅ (2026-08-31)

Locked defaults (Zachary session):
- Warm cream/brown palette (#ebe1ca, #a78a68, #4f433b, #83765b)
- Cursor spotlight on, strength 0.23, radius 0.36
- grain 0.18, warp 0.14, timeScale 1.54

## Checkpoint 2: Hero kinetic text ✅ (2026-08-31)

- Typewriter stem: "I want Maximus to"
- Rotating phrases with word-by-word blur in/out (21st framecn blur-out-up, adapted)
- `white-space: nowrap` on full line (no stacking)
- Separate Leva panel: `Hero · Text`
- Copy JSON + Copy ALL JSON buttons
- Panel drag positions persist in localStorage

## Checkpoint 3: Hero parallax + nav ✅ (2026-08-31 evening)

**Parallax (3D tilt on all hero elements):**
- `ParallaxContext` + `ParallaxLayer` wrapper
- Mouse move (desktop), touch drag (mobile), device gyro (phone tilt)
- Per-element depth sliders in `Hero · Parallax` panel
- Applied to: shader background, kinetic text, logo, glass nav

**Logo:**
- Assets: `v2/public/images/logo-mr-black.png`, `logo-mr-icon.png`
- Corner comparison view (black mark + brown icon) via Leva `logoVariant`
- Black mark uses CSS mask for clean silhouette on cream bg

**Glass nav pill:**
- Logo + work + contact links
- Frosted glass (backdrop blur)
- `Hero · Nav` Leva panel

**Scroll phrase:** Now enabled for dev testing (reversible). Full browser window scroll comes next.

## Checkpoint 4: Subhead + particles + Leva merge ✅ (2026-09-01)

**Aether particles fix:**
- Rewrote closer to 21st original (connection logic, mouse push)
- Higher default opacity so nodes show on cream shader
- Tune in `Aether Particles` folder

**Subtext Paragraph:**
- "Maximus Reach" bold italic + constant pulse animation
- Readability scrim (backdrop blur/padding) tunable in `Readability` folder
- Parallax on outer wrapper (matches headline movement)
- Renamed Leva folder from Subhead

**Leva UX:**
- All root folders start **collapsed** (open only what you need)
- Renamed: Shader Background, Main (I want Max To..) Text, Subtext Paragraph, Aether Particles, Glass Menu, 3D Parallax
- Panel title stays `Maximus · Dev`

**Live deploy rule:** `_memory/LIVE-DEPLOY-CHECKLIST.md` (no AI fingerprints, ever)

## Checkpoint 5: Service cards (initial) ✅ (2026-09-01)

Glass stack, deal-in animation, hover spread. Superseded by Checkpoint 7 dark card refresh.

## Checkpoint 6: Service card stack ✅ (2026-09-01)

**Right-side service cards (21st gradient-card adapted):**
- 3 **dark** cards (flipped colors: dark bg, light text), dealer stack deal-in from bottom
- Hover or tap to fan out smoothly from stack position (no container width jump)
- Per-card corner image spring scale/rotate on hover/tap (21st gradient-card pattern)
- Parallax wrapped, full Leva folder: `Service Cards` (Style folder replaces old Glass)
- framer-motion

## Checkpoint 7: Scroll phrase + card polish ✅ (2026-09-02)

**Scroll phrase (reversible):**
- Body scroll enabled (`overflow-y: auto`)
- `useScrollPhraseActive` — phrase switches to "do it all" on scroll, reverts at top
- `BlurOutWords` `hold` prop prevents exit blur when scroll phrase is locked

**Card visual refresh:**
- Dropped glassmorphism → solid dark cards with light typography
- Softer spread spring (`spreadStiffness` / `spreadDamping` in Leva)
- Fixed pop/jump: fixed stack container size, no expanded width class

## Checkpoint 8: Scroll window (v1) ✅ (2026-09-02)

First pass: shrink into browser, pill dock, connector, Z stub. See issues fixed in Checkpoint 9.

## Checkpoint 9: Scroll window fundamentals ✅ (2026-09-02)

First pass + v2 fixes: full-bleed hero at load, shader inside viewport, hold zone, dark page bg.

## Checkpoint 10: Scroll window layout fixes ✅ (2026-09-02)

Shader overlay bug, full-bleed load, title/dock fixes.

## Checkpoint 11: Shrink-only morph + reality fade ✅ (2026-09-02)

- **Shrink only:** viewport fixed at `100vh`; shell uses `scale()` only (no width squeeze / CRT effect)
- **Chrome:** slides down via `translateY` while shell shrinks
- **Hero centered** on load (title/dock out of document flow until visible)
- **Reality backdrop** smooth opacity fade (removed instant `body` color snap)
- **Spotlight** pulses brighter during hold zone
- **Memory:** `_memory/V2-SCROLL-STATUS.md` documents mistakes + fixes
- **Load state:** column animates `100vw` / zero padding so hero matches pre-scroll full bleed
- **Overhead title:** gradient on inner blur line, separate opacity track, blur-in on scroll
- **Window lift:** `windowLiftPx` Leva slider raises window when scrolled
- **Dock:** clickable tabs with active state
- **Connector:** subtle line pulse + horizontal divider into next section
- No browser chrome, border, or frame at scroll 0
- Chrome height animates from 0; viewport stays full 100vh until scroll starts

**Scroll curve with hold:**
- Transition completes by `transitionEnd` (~42% of stage)
- **Hold zone** through `holdEnd` (~74%): scale, chrome, dock, title, backdrop all locked
- Scrolling back up reverses everything keyframe by keyframe

**Visual fixes:**
- Page background transitions cream → dark (`#0a0c10`) on scroll, matches Z section
- Overhead title lower, gradient + drop shadow, blur-in line animation (`BlurInLine`, 21st-style)
- Pill dock + connector stay visible after reveal (no fade-out)
- Browser chrome stays at full opacity once revealed
- Chrome colors editable in Leva: `Chrome bg top` / `Chrome bg bottom`
- Scroll hint line moved **below** the window (not inside browser)

**Cards:**
- Spread pins open until click outside, Escape, or click stack to toggle
- Removed mouse-leave collapse (was causing glitch)

**Leva:** `Scroll Window` reorganized (Stage, Backdrop, Chrome, OverheadTitle, Dock, Fades, ZPattern)

**Checkpoint:** `_memory/checkpoints/scroll-window-v2-2026-09-02.json`

## Brick rule (permanent)

Every new V2 brick gets its own Leva tuner panel (or subfolder in `Maximus · Dev`). Every visible hero element must use `<ParallaxLayer>`. Remove all tuners before live deploy.

## Zachary workflow preferences

- Not a coder. Plain language, step by step.
- Wants to edit positioning/colors himself via GUI, then paste JSON to lock values in.
- Brick by brick prompts, not whole site in one shot.
- **Copy ALL JSON** (bottom left) dumps every tuner at once when a section is done.

## Libraries in v2

gsap, lenis, leva, three, @react-three/fiber, @react-three/drei, postprocessing, framer-motion (installed but hero blur uses CSS keyframes now)

Add when needed: split-type, tailwind (only if a 21st component requires it; adapt to plain CSS when possible)

## New project starter kit

See `_memory/V2-STARTER-KIT.md` for reusable foundation to copy into client projects.

## Remove before live deploy

- Leva tuner panels
- Copy ALL JSON button
- Scroll spacer (replace with real sections)
- Corner logo comparison (pick one variant)
