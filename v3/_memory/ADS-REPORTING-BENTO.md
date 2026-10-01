# Ads reporting bento (archived pattern)

Removed from Ad Management reporting section 2026-09-26 in favor of conversion funnel.
Keep this note so we can rebuild the tilt cards later.

## Where the code lives
- Wrapper card: `src/components/ui/animated-card.tsx` (`AnimatedCard`, `CardVisual`, `Visual1`, layers)
- Grid of Meta / Google / Retarget proof cards: `src/components/sections/ads/AdsProofCards.tsx`
- Tilt feel: `TiltSurface` (`src/components/ui/TiltSurface.tsx`) — pointer-driven rotate/shift on the card face; disables while flap open where used.

## How the hover / tilt worked
1. `AnimatedCard` wraps a visual stage + body (title / ROAS line).
2. `Visual1` is the Meta-style reporting mock (spend / calls / booked layers that stagger on hover).
3. `AdsProofCards` mapped platform cards (Ridge Meta, Northline Google, Summer Retarget) with status chips.
4. Homepage Proof still reuses `AnimatedCard` / `Visual1` for Brickwork — that path is untouched.

## Funnel replacement
- Component: `ui/funnel-chart.tsx` = real 21st `@bklitai/funnel-chart` (grid demo). Wrapper: `AdsConversionFunnel.tsx` (cream card + Decision bar). Brand colors via Leva.
- Leva: Ads page → Report folder (`mr-v3-ads-v8`).
