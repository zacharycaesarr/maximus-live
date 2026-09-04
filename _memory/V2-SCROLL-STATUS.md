# V2 Scroll Window — status & lessons (do not repeat mistakes)

Last updated: 2026-09-03 (Checkpoint 20 — Waves + elastic bento)

**Latest checkpoint:** `_memory/checkpoints/CHECKPOINT-20-WAVES-ELASTIC-BENTO.md`  
**Scroll save point (do not casually break):** `_memory/checkpoints/CHECKPOINT-18-SCROLL-SAVE-POINT.md`  
**Visibility root causes:** `_memory/checkpoints/CHECKPOINT-17-VISIBILITY-ROOT-CAUSE.md`  
**Full composition writeup:** `_memory/checkpoints/CHECKPOINT-12-SCROLL-COMPOSITION.md`

## Terminology (Zachary)

- **Hero / preview** = cream shader section (the site preview)
- **Window** = browser frame containing hero after scroll
- **Reality** = everything outside the window (dark bg, title, dock, logo, spotlight, dots)

## Intended behavior

1. **Load (scroll 0):** Hero identical to pre-scroll build. Full viewport, **flush to top**, cream shader, no chrome, no frame, no reality UI.
2. **Scroll:** Entire hero **uniformly scales down** via `scale()` only. Never switch shell dimensions mid-scroll.
3. **Chrome:** Tab bar **slides down** (`translateY`) as shell shrinks. Edge look is approved — do not retouch casually.
4. **Reality backdrop:** Waves WebGL (bottom-up warm palette) + dots. Fade in with scroll. Body bg set to reality color while stage mounted (prevents cream flash).
5. **Hold zone:** Window + title + dock + connector + divider + spotlight + dots locked. Window tilt only while pointer is over the window; resets past hold / Explore.
6. **Reversible:** Scroll up restores everything keyframe by keyframe.

## What made Checkpoint 18 work (critical lesson)

**Do not treat "invisible" as "needs brighter CSS."**

Failed loops: bumping opacity/strength/size while elements were clipped, off-screen, or behind the opaque browser shell.

Working loop:
1. Ask: is this element in the correct stacking context / viewport?
2. Measure DOM rects at hold-zone scroll.
3. Fix structure (parent, z-index, clip, opaque cover).
4. Only then tune brightness/size in Leva.
5. Screenshot-verify before claiming fixed.

### Structural fixes that actually landed

| Element | Root cause | Fix that stuck |
|---------|------------|----------------|
| Spotlight | Behind opaque shell inside scale | Outer sibling; frame tracks scaled window |
| EXPLORE + divider | Clipped / detached from dock | Inside `scroll-dock-wrap`; reserve px caps dock top |
| Cream flash | Body still `#ebe1ca` under fade | Body = `backdropColor` while stage mounted |
| Dots | `cx/cy=0` clipped dots + non-21st fill | Official 21st DotPattern port + mask + slate fill |

## Mistakes we made (avoid)

| Mistake | Symptom | Fix |
|---------|---------|-----|
| `scroll-transform-stack--reality` switching shell dimensions | Instant ~40% jump | Only `scale()` |
| Brightness-only "fixes" for invisible UI | Claiming fixed while screenshot empty | Structure-first diagnosis |
| Spotlight inside opaque window | No glow in letterbox | Outer spotlight frame |
| Connector below dock without viewport reserve | Label/divider clipped | `connectorReservePx` + dock wrap |
| `body` cream under backdrop fade | Cream flash on scroll | Sync body to reality color |
| Dot `cx/cy = 0` | Dots clipped at pattern cell corner | `cx/cy/cr = 1` like 21st demo |
| `max-width: 1280px` / CRT viewport height anim | Boxed or squeezing hero | Shell always full vh/vw; scale only |
| Framer `y` + CSS `translateX(-50%)` | Title/dock drift | Motion `left: 50%`, `x: '-50%'` |
| Hero bricks `position: fixed` inside window | Don't shrink with shell | `.hero-scene` forces absolute |

## What works (keep) — SAVE POINT

- Scale-only shrink + chrome slide-down
- White spotlight outside window
- Pill dock + connector line + EXPLORE label + full-width divider
- Window 3D tilt when tabbed
- Reality DotPattern (21st designali-in) with Leva + light mouse/scroll
- BlurInLine overhead title
- `SCROLL_WINDOW_ENABLED` rollback in `App.jsx`
- Leva starts **collapsed**

## Key files

- `v2/src/components/scroll/ScrollHeroStage.jsx`
- `v2/src/components/scroll/scroll-hero-stage.css`
- `v2/src/components/scroll/RealityDotPattern.jsx`
- `v2/src/lib/scrollDefaults.js`
- `v2/src/context/ScrollTunerContext.jsx`
- `v2/src/components/hero/hero-scene.css`

## Leva — RealityBackdrop dots (21st)

Tune under **Scroll Window → RealityBackdrop**:
- Dot spacing / x / y / cx / cy / radius (cr)
- Dot fill color (default slate-500-ish like 21st)
- Mask size (demo-style radial; 0 = full field)
- Mouse + scroll shift (very light)

## Still TODO (post save point)

- Zachary Leva lock-in JSON for scroll
- Polish bento / navbar / footer (Checkpoint 19 first build is live)
- More case study content for Work
- Mobile layout pass
## Checkpoints

- `CHECKPOINT-12` … `CHECKPOINT-17` (history)
- **`CHECKPOINT-18-SCROLL-SAVE-POINT.md` ← current keep**
