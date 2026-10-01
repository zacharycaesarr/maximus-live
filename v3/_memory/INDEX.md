# Memory bank index (V3)

Read `RULES.md` first, then open only what the task needs.

| Working on | Open |
|---|---|
| Standing rules / brand | `RULES.md`, `BUSINESS.md`, `DECISIONS.md` |
| Architecture overview | `V3-ARCHITECTURE.md` |
| What shipped recently | `CHANGELOG.md` |
| Night theme direction + brand swatches | `THEME-NIGHT.md` |
| Services night stars (SVG page BG) | `ServicesStarField.tsx` on `#page-sections` via `[data-services-band]` |
| Ads reporting bento (archived) | `ADS-REPORTING-BENTO.md` |
| Hero video bg (desk + mobile) | `HERO-VIDEO-BG.md`, `HeroVideoBackground.tsx` |
| Home services tall cards + pixel stars | `ServicesOverviewCards.tsx`, `CardPixelStars.tsx`, Leva `mr-v3-services-overview-v2` |
| Portal (`/portal`) | `portal/RULES.md` + `portal/INDEX.md` |
| Cal.com booking | `SHARED-CAL-BOOKING.md` |
| Capabilities pages (Web / Ads / Creative) | `SESSION-2026-09-20.md` + `CHANGELOG.md` |
| About redesign (clean slate + name playground) | `CHANGELOG.md`, archive `_archive/about-page-2026-09-21/` |
| Phone before/after mocks (Web Dev) | `CHANGELOG.md` (2026-09-21 mid), `src/components/ui/phone-mocks.tsx` |
| Name lockup motion (MAXIMUS, ZACHARY) | About `NameSwapPlayground.tsx`, storage `mr-v3-about-name-play-v2` |
| Mobile-only editing mode | `WORKING-MODE-MOBILE.md` |
| Before go-live | `FINAL-WRAPUP-BEFORE-LIVE.md` |
| Performance later | `FUTURE-PERFORMANCE.md` |
| Portal / FAQ / payments later | `FUTURE-PORTAL-FAQ.md` |

## Checkpoints

| Checkpoint | Path |
|---|---|
| Capability pages before 2026-09-20 pass | branch `checkpoint/2026-09-20-caps-pages`, commit `0e43737` |
| 2026-09-20 night stretch+mobile+redesign | commit `7a4588e` on same branch |
| Pre services-lab cards migrate | branch `checkpoint/2026-09-28-pre-services-lab-cards` |
| Pre home colors architecture rewrite | `checkpoints/2026-09-28-pre-home-colors-architecture/`, branch + tag `checkpoint/2026-09-28-pre-home-colors-architecture*` |

Only create `checkpoints/` files when Zachary asks for a save point.

## Trimmed

Old one-off session notes and stale prompt files were cleaned 2026-09-21. Keep `SESSION-2026-09-20.md` as the current capabilities snapshot.
