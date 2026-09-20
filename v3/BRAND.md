# Maximus Reach — brand sheet

One page. If a color or font isn't here, it shouldn't be on the site.

## Colors

| Name | Hex | Where |
|---|---|---|
| Cream | `#FCFAF2` | light text on dark, buttons |
| Paper | `#F6F4EF` | page background (with grain) |
| Warm cream | `#F5F0E6` / `#F3F1EC` | quiet section tints |
| Tan | `#D9C3B0` | soft accents |
| Gold | `#C4A574` | the accent. CTAs, highlights, sparingly |
| Mocha | `#8B6950` | secondary accent text |
| Espresso | `#2C2520` | main text, dark slabs |
| Studio black | `#141110` | Creative Studio page only |

## Fonts

- **Neue Haas Grotesk Display** (local) — body, UI, nav links, buttons. The workhorse.
- **Tiempos Headline** (local) — big serif statements and section headings.
- **Serotiva Medium / Bold** (local OTFs in `public/fonts/`) — subtext + Capabilities dropdown. Not Regular for UI.
- **Roboto Flex** (local TTF) — ONLY for stretched wordmark moments. wdth 25–151. Never body copy.

## The stretch

Per-letter width on Roboto Flex is a core brand move. REACH (or one statement word per page) gets wider letter by letter. Component: `src/components/ui/StretchText.tsx`. Tune in Leva → Headline stretch.

## Feel

Minimalist editorial agency. Cinematic but readable. Virginia business owners (including older ones) must still get it in five seconds. Quiet sections, one loud brand moment per page. Glass (blur + thin light border) on cards/buttons/nav only, never whole sections. Grain under 0.06. No em dashes in visitor copy. Corners around 11px, not 20+.

## Motion

Slow and smooth. Text fades up as it enters (`Reveal`). Ease `[0.22, 1, 0.36, 1]`, around 0.8s. Nothing bounces. Respect reduced motion.
