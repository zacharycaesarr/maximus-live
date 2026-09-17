# Final wrap-up notes (before live)

Standing checklist. Do these before push / go-live. Do not treat as optional.

## Strip old live-site bloat

- Remove root marketing leftovers that are NOT `v3/` once V3 is the only site:
  - `about.html`, `portfolio.html`, `index.html` (old), `style.css`, `script.js`, `counter.js`
  - old `assets/` at repo root if unused by V3
  - duplicate favicons / manifests if V3 public already has them
- Keep only what V3 needs under `v3/public/` and `v3/`.
- Goal: one app, no double site files in the GitHub deploy.
- Delete the stray empty `v3/v3/_memory/tmp-hiw-frames/` folder (debug crops from HIW fillet work, leftover nested `v3/v3` dir).
- Hero video masters live in two places right now: repo root (`Hero-MP4FALLBACK-handbrake.mp4`, `Hero-quicktime-handbrake.webm` — outside `v3/`, won't ship) and `v3/public/` (same files, copied byte-for-byte, this is what the live `<video>` tag actually points at, so this copy DOES ship). Before going live, decide if 4K60 at ~8MB each is the final call for production bandwidth, or if a lighter pass makes sense — Zachary's call, don't touch without asking (see `HERO-VIDEO-BG.md`).

## Pending: Zachary is re-cutting the hero After Effects file

- Zachary is going back into After Effects to tweak the hero background composition (the floating megaphone/phone/laptop scene) before going live. When he hands over the new export, the swap is: drop the new files at repo root with the same two names, copy them into `v3/public/` (same names), verify checksums match, done — `HeroVideoBackground.tsx` already points at the right filenames so no code change needed unless he renames the files. Don't re-encode/compress the new export either, same rule as before.
- **Mobile:** may remake / re-render a cleaner `heromobile-4k-…` pass later to fix uneven framing (Leva Y nudge is a stopgap).
- **Later polish (remind next prompt):** final hero AE renders where the 3D objects **animate up into view** after the site intro / chrome finishes — not in the current static loop. Queue until after intro motion feels locked.

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
