# Final wrap-up notes (before live)

Standing checklist. Do these before push / go-live. Do not treat as optional.

## Strip old live-site bloat

- Remove root marketing leftovers that are NOT `v3/` once V3 is the only site:
  - `about.html`, `portfolio.html`, `index.html` (old), `style.css`, `script.js`, `counter.js`
  - old `assets/` at repo root if unused by V3
  - duplicate favicons / manifests if V3 public already has them
- Keep only what V3 needs under `v3/public/` and `v3/`.
- Goal: one app, no double site files in the GitHub deploy.

## Rename project folder (manual)

- Repo folder is still `mcclure-realty-overhaul`. Rename to something like `maximus-reach` when Cursor is closed so paths stay sane.
- Do not rename mid-session (breaks workspace). After rename, reopen the folder in Cursor.
- Portal code lives under `v3/src/portal/` (not a second v3). Root `v2/` is legacy.

## Optimize before live

- Mobile-first pass on every page (About, Work, Start, Home, Portal, Privacy, Terms).
- Deep performance pass: see `FUTURE-PERFORMANCE.md` (images, fonts, Lottie, Lenis, Leva stripped from prod).
- Remove unused Leva / preview flags from production builds.
- Confirm no secrets in client bundle (only `VITE_` public keys).
- Sitemap + robots for new routes: `/`, `/about`, `/work`, `/start`, `/privacy`, `/terms`, `/portal`.
- 404 page.
- Accessibility spot-check (focus, contrast, tap targets).

## Legal / business

- Privacy + Terms are live stubs aligned with Client Services Agreement themes (term, fees, IP on payment, confidentiality, liability cap, termination, VA law). Have a lawyer skim before real clients sign.
- CSA PDF still the source of truth for signed client work; site Terms point to SOW/CSA when they conflict.
- Missing from site vs CSA (optional later): refund language detail, ad platform policy disclaimer, portfolio opt-out, non-solicitation mention.

## Pages shipping in V3

| Route | Role |
|---|---|
| `/` | Home / marketing |
| `/about` | Story + services |
| `/work` | Case / proof viewer |
| `/start` | Cal.com + contact |
| `/privacy` `/terms` | Legal stubs |
| `/portal` | Client hub |
