# Checkpoint 18 — SAVE POINT: scroll window locked (2026-09-03)

**Status: KEEP.** Everything in the scroll window hold zone is working visually (title, chrome, window, spotlight, dock, EXPLORE label, horizontal divider, tilt). Dot pattern was the only remaining miss and is fixed in this same pass to match 21st.dev.

Zachary will now Leva-tune and paste lock-in JSON. Do **not** casually restructure ScrollHeroStage after this checkpoint unless he asks.

---

## What we did differently this time (remember this)

Earlier attempts kept failing because we treated "can't see it" as a **styling** problem (brighter, bigger, more opacity). That was wrong.

**This time we diagnosed structure first, then verified in the browser before claiming fixed.**

| Element | Old (failed) approach | What actually worked |
|---------|----------------------|----------------------|
| Spotlight | Bumped strength / color while glow was **behind opaque cream shell** | Place spotlight as sibling **outside** the window, sized to the scaled window frame (`spotlightFrame` motion values) so glow shows in the dark letterbox |
| EXPLORE + horizontal divider | Tweaked CSS while connector was **clipped off-viewport** or detached from dock | Put connector **inside** `scroll-dock-wrap` under the dock; use `connectorReservePx` to cap `dockTop` so the whole stack fits in 100vh |
| Cream flash | Blamed WebGL only; brightness hacks | `body` was still cream `#ebe1ca` under fading backdrop → set body to `backdropColor` while scroll stage is mounted |
| Dot pattern | Opacity/radius tweaks with `cx/cy = 0` (dots clipped at cell corner) + wrong fill model | Rebuild from official 21st `designali-in/dot-pattern`: fill on SVG, `cx/cy/cr = 1`, radial mask like the demo |

### Process rules that made results stick

1. **Visibility ≠ brightness.** If it's not in the viewport stack (or is behind opaque layers), no slider will help.
2. **Inspect computed rects / elementFromPoint** before claiming fixed.
3. **Screenshot / browser verify at hold zone (~0.5–0.7 scroll progress)** before telling Zachary it's done.
4. **Chrome edge:** leave alone (approved).
5. **localStorage migration** matters — old Leva values can silently undo defaults.

---

## Architecture at this save point

```
scroll-stage-sticky (100vh)
  scroll-backdrop (z0, opacity fade) + RealityDotPattern inside
  scroll-reality-spotlight-outer (z2, tracks scaled window)
  scroll-scene-center (z3)
    overhead title
    composition → scale → window tilt → shell → chrome + viewport
    dock-wrap → pill dock → ScrollConnector (line + label + divider) → hint
```

Key files:
- `v2/src/components/scroll/ScrollHeroStage.jsx`
- `v2/src/components/scroll/scroll-hero-stage.css`
- `v2/src/components/scroll/RealityDotPattern.jsx` (21st port)
- `v2/src/lib/scrollDefaults.js`
- `v2/src/context/ScrollTunerContext.jsx`

---

## Dot pattern (21st) — visibility fix after Checkpoint 18

**Why Zachary saw no change:**
1. Center radial mask (~520px) put dots behind the opaque window → letterbox looked empty
2. Dots only lived in sticky scroll stage → Z section after scroll was solid black
3. localStorage kept the bad mask until migration
4. Leva `connectorReservePx` max was 240, clipping the full-width divider off the bottom of the sticky viewport

**Fix:** full-field dots (mask 0), stronger white fill, dots layer sibling to backdrop, same pattern on Z section, reserve raised to 260 (Leva max 320). Scroll shrink/chrome/spotlight animation untouched.

**Verified in browser at localhost:5174:** dots visible in hold zone + Z section; EXPLORE + full-width divider in viewport.

---

## Next bricks (planned, not built yet)

- Zachary Leva lock-in JSON
- Z-section bento under "Built for businesses..."
- Sticky/floating site navbar after scroll window
- Footer (solaceui footer-section-1 direction)
