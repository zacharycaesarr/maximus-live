# Checkpoint 20 — Reality Waves + Elastic Bento + Chrome

Date: 2026-09-03

## Done
1. **Window tilt reset** — `useWindowTilt` only tilts when pointer is inside the window (+ leave pad). Disables past `holdEnd` so it flattens into Explore; returns if you scroll back up.
2. **Reality Waves** — 21st Homlu Waves shader (`wavesFrag.js`) behind scroll reality + Z section. Colors climb from the **bottom**. Leva folder **Reality Waves** (reach, speed, zoom, grain, colors, hue, etc.). Storage key `mr-waves-tuner-v2`.
3. **Elastic flex bento** — two flex rows, spring `flexGrow` on hover/tap, `h=340`, width tied to title via `maxWidth` (default 560). Visuals: IDE + Core Web Vitals, spend/return bars, webhook→Twilio path, timeline. Leva **Services Bento**. Glow wash on `::before` so it does not hard-cut mid-card.
4. **Site chrome** — real logo `/images/logo-mr-icon.png` in nav/footer (`BrandMark`). SVG social icons. Leva **Site Chrome**.
5. Providers wired in `App.jsx`; Copy ALL JSON includes waves / bento / chrome.

## Tune notes
- Default **hue = 0** so bronze/slate reads true. The 21st prompt used hue ~130° which turns the same hexes blue. Dial **Reality Waves → Hue** if you want that look.
- Bento + intro share `z-pattern-stack` width from **Services Bento → Bento width**.

## Do not casually break
- Scroll shrink / hold chrome (Checkpoint 18 save point).
