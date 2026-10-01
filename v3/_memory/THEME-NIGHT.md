# Theme direction — night lean (not live yet)

Zachary wants the **site overall** to lean night / darker, while keeping the **light Web Development** capability page looking premium.

## Brand swatches to keep in pocket
- `#FFEDD5` cream warm
- `#0B0D13` near-black night
- `#2A1B1A` deep mocha / brick shadow
- `#FFE6B9` soft gold highlight
- Services floor bridge: `#0F0E15` (hero → services blend)

## How to do night without nuking light pages
1. **Shell vs page.** Home shell (nav overlay on video, services night strip) can go dark. Capability pages keep their own cream/light systems.
2. **Tokens, not hard swaps.** Put night colors on CSS vars for home sections only. Web Dev page keeps its own local vars.
3. **Nav.** Dark mega-menu is fine over both; it already floats as a panel.
4. **Do not** global-invert. That would make Web Dev look worse overnight.

## Gravity Stars (21st @educalvolpz) — honest call
**Skip for homepage.** Full gravity + constellation + pointer well = continuous canvas work. Too heavy.

## StarFieldBackground (shipped then replaced 2026-09-26)
Old version painted solid `#020409` and merged into Services. Replaced by **ServicesStarField** (dots only, transparent, bottom fade mask). Do not re-add a solid fill under stars.

## Interactive demo canvas
Killed 2026-09-25. Old note deleted. Do not re-add without a real Lottie scene.

## Reach Network
Tried, looked bad, melted perf. Fully deleted 2026-09-26. Do not re-add.
