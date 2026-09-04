# Decisions — Maximus Reach

## 2026-09-03 — Home page as teasers + portal

- Home below the scroll window stays short “points” into fuller pages (Services bento first, then Process, Work, About, Portal, FAQ, Contact).
- Customer portal for accepting payments (send clients a link) is planned. Do not skip it in the page map.
- FAQ near the bottom; reuse V1 FAQ content when building.
- Dual wave backdrops: hold/reality vs explore, each with its own Leva folder.
- Seam between them stays intentional (divider + optional soft fade), not one endless wave.
- Pill Dock must clear the browser window.

## 2026-08-31 — Scroll window fixes + design tuner

- Real viewport shrink: `#scroll-window` wraps actual hero HTML, GSAP scale transform (not fake mockup).
- Removed hero text opacity fade on scroll (user did not want faded left column).
- Nav animates to vertical pill on right side during scroll to clear headline space.
- Window chrome: dark bezel box-shadow, macOS title bar with traffic lights.
- Leva design tuner added in dev mode. Saves to localStorage. Remove before live deploy.
- 21st.dev MCP connected. Use search for UI catalog, get_component for code (quota).
- 3D mouse follow damped during scroll to reduce glitch-to-center behavior.
- Contact + work sections restored below scroll section.

## 2026-08-30 — V2 polish pass

- Removed MeshTransmissionMaterial (was causing color glitching on hover)
- Removed arrow, cylinder, cone, chart bars. Only browser + phone in one cluster.
- Disabled post FX on hero. Softer lighting, lower exposure.
- Hero text: single line "Let's build" / "something great", smaller Koi proportions.
- Device zoom rebuilt: nav clearance, mouse tilt, glass dock tabs, shadow not clipped.
- Contact/work sections hidden until hero + device are locked.
- V2-ARCHITECTURE.md added. Premium quality rule in RULES.md.
- V3 idea: capabilities tab animation from local video reference.
- Rebrand open: .design style (tight sans, monochrome + one accent).

## 2026-08-30 — V2 scroll phase and references

- Inverted V2 to V1 cream palette. Glassmorphism on nav, badge, cards, and CTAs.
- V1 particle nodes and ambient blobs ported into V2 background.
- Hero headline: Let's build / something great (italic line 2), larger Koi style layout.
- Growth arrow 3D object points up right (positive growth), leads visual hierarchy.
- Device zoom scroll section after hero (Superpower reference): fullscreen to tablet mockup with tabbed panels.
- Contact section centered (Z pattern step 1). Work teaser right aligned (Z pattern step 2).
- Each future page gets its own reference animation. Log them in DECISIONS as they are chosen.

## 2026-08-30 — V2 hero rebuild

- V2 lives in `v2/` as a separate Vite + React app. V1 root files stay untouched.
- Hero layout follows Koi reference: floating pill nav, bottom left copy block.
- V1 copy and brand tokens carry over via `v2/src/content/siteContent.js` and `tokens.css`.
- 3D layer uses Three.js / R3F with glass service objects (browser, chart, phone, clapper).
- GSAP + Lenis wired on the same ticker. Scroll sections come later.
- GPU quality tiers: static fallback on low tier or reduced motion, lighter scene on mobile.
- Edit guide: `_memory/V2-EDIT-GUIDE.md`

## 2026-08-29 — FAQ interaction

- FAQ lives near the footer as plain visible text (“Frequently asked questions”)
- Theater boots on first click/tap only
- Clearer side profile SVG; speech bars pop with stagger when a question is clicked
- Head slides in from the side on open; thinking dots bob lightly
- Open scrolls until the full FAQ fits; close uses measured height to avoid jump
- Ask Me questions use stronger type contrast; question switching is snappy after intro
- Answers use contractions; no dashes
- `prefers-reduced-motion`: skip flourish; still usable

## 2026-08-29 — Site expansion layout

Future sections after the hero should follow a Z pattern (left, then right, then left) for a fuller marketing site feel. Mobile stacks in one column.
