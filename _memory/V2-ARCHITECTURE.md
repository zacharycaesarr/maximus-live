# V2 Architecture — Maximus Reach

Read this file whenever working on the `v2/` folder. Pair with `RULES.md`, `DECISIONS.md`, and `CHANGELOG.md`.

## What V2 is

A separate React app in `v2/` built with Vite. V1 (root HTML/CSS/JS) is untouched and still deploys to maxmarket.live.

## Stack

| Tool | Role |
|------|------|
| Vite 5 + React | App shell and dev server |
| Three.js + R3F + drei | Hero 3D objects only |
| GSAP + ScrollTrigger | Intro animations, scroll pin, device zoom |
| Lenis | Smooth scroll, synced to GSAP ticker |
| Plain CSS | All styling (no Tailwind) |

## Folder map

```
v2/src/
  content/siteContent.js     ← visitor copy (edit here)
  styles/                    ← tokens, hero, glass, device-zoom, sections
  components/
    Background/              ← ParticleField, AmbientBlobs (from V1)
    Cursor/                  ← custom cursor
    Nav/PillNav.jsx          ← floating glass nav
    Hero/HeroSection.jsx     ← bottom-left copy
    Hero/HeroScene.jsx       ← fixed WebGL canvas
    Sections/DeviceZoomSection.jsx  ← Superpower-style scroll
  scene/
    ServiceObjects.jsx       ← browser + phone only
    Lighting.jsx             ← soft studio lighting
    PostFX.jsx               ← disabled (was causing artifacts)
  lib/
    lenis.js                 ← Lenis + GSAP sync
    motion.js                ← hero intro + parallax
    tiers.js                 ← GPU quality tiers
  context/
    QualityContext.jsx
    MouseContext.jsx
```

## Layer order (bottom to top)

1. Ambient blobs (fixed, z-index 0)
2. Particle canvas (fixed, z-index 1)
3. WebGL hero scene (fixed, z-index 2, fades on scroll)
4. Page content: nav, hero text, device section (z-index 3)

## 3D rules (learned the hard way)

- Do NOT use MeshTransmissionMaterial. It caused black/red/yellow glitching and pixelated reflections on mouse hover.
- Use meshPhysicalMaterial with clearcoat for glossy sheen.
- Keep object count low (browser + phone in one cluster, right side).
- No post-processing on hero until materials are stable.
- Exposure ~0.92, apartment HDRI at low intensity.

## Hero text rules

- Line 1: "Let's build" on ONE horizontal line (white-space: nowrap on desktop)
- Line 2: "something great" italic Playfair on ONE line below
- Max width ~640px. Do not use narrow ch units that force word stacking.
- Koi reference: prominent but not full viewport width.

## Device zoom section

- Placed immediately after hero (no contact/work until hero is locked).
- ScrollTrigger pins viewport, scrubs scale from 1 to 0.7.
- Bezel padding animates in for device frame weight.
- Headline sits below nav (108px top padding so it is not hidden).
- Glass dock tabs below device (Superpower reference).
- Mouse tilt on device via rotateX/rotateY.
- Shadow uses separate element below bezel (overflow: visible, not clipped).

## Quality bar

Everything must feel premium. If it looks glitchy, busy, or cheap, simplify before adding more effects.

## Future ideas logged elsewhere

- V3 capabilities section: see DECISIONS.md (video reference)
- Rebrand exploration: monochrome + tight sans (.design reference)
- Per-page unique scroll references: DECISIONS.md table

## Preview

```
cd v2
npm install
npm run dev
```

Port 5174 by default.
