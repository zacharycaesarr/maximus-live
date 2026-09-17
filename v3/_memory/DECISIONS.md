# Decisions — V3

## 2026-09-10 — Portal stack locked (Vite, not Next)

- Client portal lives under `/portal` inside the existing Vite + React Router V3 app.
- Admin at `/portal/admin` (not a separate `/admin` root).
- Supabase for auth/DB/realtime. Env: `VITE_SUPABASE_*` via `import.meta.env`.
- No Next.js migration. Auth via React AuthProvider (Phase 2), not middleware.
- Stripe + Cal.com deferred. Homepage must stay untouched while portal builds.

## 2026-09-07 — Fonts + nav prep + proof fan

- **Headline** (stem + rotating): Tiempos Headline by default (Leva can switch back to NHG).
- **Everything else** (nav, subtext, buttons, sections): Neue Haas Grotesk Display with real weight files (100–900).
- Navbar: current glass → pill is temporary; next pass will replace. Do not over-invest in notch/glass variants until Zachary picks the new nav.
- Proof of work: image-fan carousel (not Collection Surfer). Max 4 clients. Need real screenshots + titles + bullets from Zachary.
- How it works: big cards + AE Lottie on hover/tap (later). Reference: mockup.live-style dark cards.

## 2026-09-07 — Display font trial

- Default remains **Neue Haas Grotesk Display** for UI chrome.
- Tiempos is headline-only unless Zachary locks a full switch.

## 2026-09-06 — Root-cause fix (clipping + invisible gradient)

### Why things looked “fixed” to the agent but broken to Zachary

1. **Rotating phrase invisible:** `white-space: nowrap` + `overflow: hidden` + narrow column. Live DOM: scrollWidth 690 > clientWidth 608 → phrase clipped. Agent read `innerText` (includes clipped text) and thought it worked.
2. **Gradient invisible:** Radial existed on a `-z-10` layer under an opaque `bg-cream` on `<section>`. Painted behind the fill. Agent checked child `backgroundImage` and missed stacking.
3. **Leva folders open on refresh:** Second `useControls` on the same folder path re-opened groups; `collapsed: true` alone was unreliable. Fix: one `useControls` per folder + force `setSettingsAtPath(..., { collapsed: true })` after mount.
4. **Fonts felt wrong:** Defaults had been changed to 42px / weight 400. Restored NHG Medium 500 / 72px scale; stem stays lighter.

### Kept from polish pass

Nav icons, FlowButtons, blink cursor, no eyebrow, Maximus above REACH (gap editable, default 0).

### Lottie

See `HERO-LOTTIE-SPECS.md` — export **720×1280** (or 1080×1920 @2x).

- Wordmark: Maximus (small) over stretched REACH, left-aligned, NHG.
- Hero CTAs: 21st FlowButton animation, rounded-rect, filled + outline pair.
- Gradient: accent-at-origin fade (visible mocha wash).
- Future (not built): client portal with payment + new/existing toggle; FAQ; booking. See `FUTURE-PORTAL-FAQ.md`.

## 2026-09-05 — Brick 1 foundation

- Clone **wearedirect.co** hero + top nav visually in React (not Webflow export).
- Kinetic headline code copied from V2 (logic only); restyled with Neue Haas Grotesk Medium (500).
- Nav logo: stretched **REACH** (new V3 component; idea from V2 stretch, not a code copy).
- Background: 21st `@ibelick/tailwind-css-background-snippet` remapped cream → pale mocha (not purple/black).
- Subhead: "Let's build something great".
- Side visual: animated placeholder until Zachary supplies art (Leva image URL).
- Stack: Vite + React + TS + Tailwind + Leva + Framer Motion. Dev server port **5175**.
