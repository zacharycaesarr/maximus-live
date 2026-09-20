## 2026-09-20 — Web Dev stretch fix + Safari chrome + cap pages cleanup

- Checkpoint: branch `checkpoint/2026-09-20-caps-pages` @ `0e43737`.
- StretchText is React/Leva driven (no GSAP fighting sliders). Full Roboto Flex TTF. Headline stretch folder. Storage `mr-v3-web-dev-v5`.
- How we build: real 21st.dev Safari chrome, URL `yourwebsite.com`, step 4 grows taller.
- CTA calm, grain, testimonial glass ~11px, footer flicker gone, caps dropdown 1.6s stay-open.
- Ads: lead-quality deck gone, spinning ring gone, stretch kept. Creative: stretch kept, tickers off.
- Brand sheet: `v3/BRAND.md`. Hero video still locked.

## 2026-09-18 — Capabilities split + Web Development page rebuild

- Replaced single Work page with **Capabilities** nav dropdown: Web Development, Ad Management, Creative Studio (last).
- Routes: `/capabilities/web-development`, `/ad-management`, `/creative-studio`. `/work` redirects to web-dev.
- Web page: Uproute-style hero (Tiempos), mobile-first accordion + phone mockups (rise from blur desktop; scroll shrink + flash mobile), magnetic cursor on interactive bits, kept WebDevShowcase under "Selected builds."
- Ads + Creative are stubs. Creative later = scroll-morph-hero. Start page AE 5s loop noted in NEED-TO-IMPLEMENT + FINAL-WRAPUP.

## 2026-09-17 — Reach Further nav + one-line hero + page scroll BG trial

- Nav stacked lockup: Reach / Further (logo unchanged). Hero `singleLine` default on; Leva “one sentence” off restores wrap. `scrollbar-gutter: stable` for intro scroll jump. Shared Axis Blend gradient under homepage sections (mocha trial; 21st blue archived). Hero video untouched. See `PAGE-SCROLL-BG.md`, `PROMPT-REMINDERS.md`.

## 2026-09-17 — Mobile pass + aperture intro (dock archived)

- **WORKING-MODE-MOBILE.md ACTIVE** until Zachary says switch to desktop.
- Mobile: center hero copy; touch press-drag parallax; SectionFocus keeps enter, no exit shrink; HIW shell title opacity earlier.
- Intro: white Maximus dock archived (`BrandPreloader` + FUTURE-LOADING.md). Live intro = GSAP aperture (`ApertureIntro`). Restore phrase documented there.
- Desktop exception: Home icon on both navbars; aperture intro; video files untouched (CSS scale only on hero root).


- Zachary caught two things from the prior entry below: (1) he did NOT want the 4K masters re-encoded down to 1080p, wanted native quality kept, and (2) he was worried it got pushed to GitHub. Confirmed the second one is a non-issue: `git log` shows the v3 checkpoint commits are 2 commits ahead of `origin/main` and were never pushed, `origin/main` is still sitting on the old pre-V3 rebrand commit — everything's been local the whole time.
- Copied the native masters (`Hero-quicktime-handbrake.webm` 8.8MB, `Hero-MP4FALLBACK-handbrake.mp4` 7.6MB) straight from repo root into `v3/public/` — checked SHA256 before/after, byte-identical, zero re-encode. Swapped the two `<source>` paths in `HeroVideoBackground.tsx` to point at them. Nothing else in that file touched.
- Old 1080p re-encode (`v3/public/video/hero.mp4`/`.webm`/`hero-poster.jpg`) left on disk, just unreferenced now — not deleting anything without asking first per the new rule.
- Verified in a fresh mobile-viewport + iPhone-UA load: video decodes fine (readyState 4, plays through), layout holds at 390px wide, left-aligned copy still readable. Noted honestly in `HERO-VIDEO-BG.md`: that's Chrome's decoder under a spoofed UA, not a guarantee for real low-end Android hardware at 4K60 — flagged as a known tradeoff, not fixed unilaterally.
- New standing rule written into `HERO-VIDEO-BG.md`: don't touch/re-encode/delete anything video-related in `public/` without asking first.

## 2026-09-17 — Checkpoint + hero left layout + video bg trial

- **Checkpoint commit `ee734dd`** = whole v3 folder as it stood right before this. `git checkout ee734dd -- v3` fully reverts if the hero trial below doesn't land. (v3 had never been committed before — this is its first commit, so it's the earliest revert point period.)
- HIW fillets: baked the Leva-approved numbers into the defaults (size 48, left/right X ±47, Y 46, rotate -180 both) so a fresh browser matches what Zachary tuned. Screenshotted both corners zoomed in — mirror and smooth, no gap/seam.
- Nav: removed the redundant "Start" text link (the "Get started" pill already goes to `/start`). Added a "Portal" link (About / Work / Portal) using the same door icon as the hero CTA.
- "Let's get started" glow: bumped opacity slightly per request (still subtle).
- **Hero layout trial** (Leva: Hero layout & copy → Layout trial): copy is now left-aligned with CTAs below, capped at 560px wide so it doesn't run into the right side. Rotating line now reads as one flowing sentence ("I want Maximus to build my website") instead of stem-then-phrase stacked — turned out `HeroKineticText`'s branch picker had `stacked || !singleLine` instead of just `stacked`, which is why it kept centering; fixed that one line.
- **Hero video bg**: swapped the mesh-gradient bg for Zachary's After Effects loop (`/public/video/hero.mp4` + `.webm`, native `<video>`, muted/loop/playsInline, poster frame). Mesh gradient is NOT deleted — Leva toggle "video bg (vs mesh)" flips back to it instantly, no rebuild needed. Full research + the "why two video files" explainer: `HERO-VIDEO-BG.md`.
- Text color/size for the new left layout only: white/cream stem+phrase (was espresso), fontSize default dropped 72→52 (a 72px sentence doesn't fit a 560px left column). Old center-hero look is one Leva flip away (`heroAlign: center`) — colors/size are shared fields though, so flipping back means re-tuning those two by hand if we ever fully revert (or just `git checkout` the commit above).
- Fixed two latent TS errors from last session (unrelated to this ask, found while type-checking): `AboutTunerContext.tsx` importing a `StoreType` that leva doesn't export, and `StartPage.tsx`'s `loadStart()` losing its return type — both were harmless at runtime (Vite doesn't type-check) but broke `tsc`/CI builds.
- Deferred: "section identity" (making each scroll section feel distinct) — flagged by Zachary as next-up, not started this pass.

## 2026-09-15 — HIW fillet Leva + stacked brands + Cal embed

- How it works fillets: Leva size/X/Y/rotate left+right. About words stacked (not letters). Process text bigger.
- Nav brand stacked (main only). Start: inline Cal embed, tighter spacing. Work blur fades with overlay.
- Footer Explore includes Privacy/Terms (footer-v3). ScrollToTop on nav (flag in ScrollToTop.tsx).

## 2026-09-15 — Pages wave + HIW fillet + FAQ portal

- AE logo fixed; FAQ preview portals; About/Start/Work/legal pages.

## 2026-09-10 — Portal Phase 7 activity + download fix

- Force-download files; audit trail for login/tabs/downloads.

## 2026-09-10 — Portal Phase 6 media + history

- File vault (`portal-assets`) + saved history notes for clients.

## 2026-09-10 — Portal Phase 5 live metrics

- Realtime dashboard updates; richer admin account editor (ads/website/video). FUTURE-LEVA noted.

## 2026-09-10 — Portal Phase 4 dashboard shell

- Tabbed client hub + Growth bento. 21st.dev swap slots documented in portal TEST-STRIP.

## 2026-09-10 — Portal auth fix + Phase 3 admin

- PKCE error card fixed (session-first callback). Code-first login. Admin roster/editor/view-as.
- Portal memory: STATUS every turn + TEST-STRIP before go-live.

## 2026-09-10 — Portal Phase 2 auth

- Magic link / OTP login, auth callback, locked dashboard + admin role gate.
- Portal memory bank at `_memory/portal/` (HOW-TO-TALK: explain for non-coder).

## 2026-09-10 — Portal Phase 1 foundation

- `/portal` shells: login, dashboard (bento stub), admin roster stub. Dark Railway-style layout only under portal.
- Supabase client (`VITE_` env), SQL migration `supabase/migrations/001_portal_schema.sql`, `vercel.json` SPA rewrite.
- Homepage / marketing untouched. Specs updated to Vite (not Next.js).

## 2026-09-10 — Footers / HIW fillets / comparison / hand portal / Lenis Chrome

- Memory: deep optimization deferred until site is done (`FUTURE-PERFORMANCE.md`).
- Hand: fixed + body portal + live button rect (survives resize/parallax). CTAs swapped; Get Started idle mocha / hover black.
- Proof showcase: Previous/Next swaps content in place (no close/reopen).
- Lenis: gsap.ticker + ScrollTrigger sync; html overflow-x clip (Chrome smooth scroll).
- How it works: full-width black band + inverted SVG fillets + rounded-b card well.
- FAQ: height tween only (no spring + y jitter on open/search).
- Services 01: bento moved here. Why Maximus 04: comparison matrix placeholder.
- Get started 06: motion CTA (Let's get started + magnetic pills). Site footer under it (flicker wordmark + link columns). Leva **Footer**.
- Checkpoint: `checkpoints/2026-09-10-footers-hiw-hand/` (replaced prior checkpoint).

## 2026-09-10 — Click unblock / h-scroll / HIW canopy / proof showcase / nav merge

- Preloader: never persist `preview`; failsafe unblocks clicks (Comet/Chrome); overlay drops when chrome is ready.
- Horizontal scroll: overflow-x clip, softer SectionFocus X offsets, no `100vw` breakout.
- Hand: docks beside Get Started with gap; hides under ~760px or when it would cover the button.
- How it works: full-width dark canopy + tall cream cards + hover lift (no color stripes, no dual card layers).
- Scrolled pill nav: same About / How it works / FAQ (+ Start) as top nav.
- Why Maximus: Ads that Reach rings no longer flash a big opaque ring.
- Proof click: dark case-study showcase (portal to body so it stays on screen); Leva **Edit client** / open preview.
- Depth flip: always 3D path (SplitText or whole-line fallback) across browsers.
- Client Portal CTA → `/start`.

## 2026-09-10 — Hand dock / preloader match / HIW canopy / routes / Why bento

- Forever rule: human-coded look (`.cursor/rules/human-coded.mdc` + RULES #12).
- Hand anchors to Get Started button; hides when too narrow to avoid covering CTA.
- Preloader uses stem font (Tiempos) + Maximus casing; measure-then-dock for Chrome; fade all but Maximus.
- Parallax: window pointer (cross-browser); soft pause via `data-parallax-pause`.
- How it works: single canopy shell (no glitched fillet SVGs).
- Routes: `/about`, `/start` placeholders with their own Leva stores. Portal later.
- Why Maximus Reach: 21st bento-grid-01 adapted (cream/mocha copy).

## 2026-09-08 — How it works canopy / FAQ Pro / Z-focus / phrase badges


- Checkpoint: `checkpoints/2026-09-08-pre-how-it-works/` (old pre-intro-canvas removed).
- How it works: 3 sand cards, approach left → Dessn-style dark canopy (SVG fillets, no color stripes); Leva **How it works**.
- FAQ: 21st FAQ Pro adapted; Leva **FAQ** (editable Q&A via `id||Q||A |||`).
- Section focus: sharper enter/exit so Proof returns small-right; Why Maximus Reach?
- Hero: phrase micro-badges (Apple emoji CDN) + Leva **Phrase badges** map.

## 2026-09-08 — Cinematic preloader / in-hero canvas / gyro / section idle


- Checkpoint: `checkpoints/2026-09-08-pre-intro-canvas/` (old pre-section-focus removed).
- Preloader: MAXIMUS center → dock into stem; Leva **Preloader**; then chrome fade. “Preloader” = this brick forever.
- Demo canvas peeks under Get Started inside hero fold; Leva **Demo canvas (hero)** (peek/delay/slide).
- Hero blend only below fold cutoff; bg oversized + overflow clip (no white edges); gyro on mobile; `?edit=mobile` / Device edit for separate phone vs desktop tuning.
- Section focus: start small left/right → grow to big center → return idle. Eyebrow middots. Lenis smooth scroll on phrase/CTA.

## 2026-09-07 — Section focus / parallax+hover / depth-flip fix


- Checkpoint: `checkpoints/2026-09-07-pre-section-focus/` (old pre-reuno removed).
- Hero: content + bg parallax on; Get Started hover uses live hit-test so tilt does not break hand.
- Depth flip: `forwardRef` fix (React 18) so GSAP SplitText actually animates.
- Sections: scroll-focus grow/shrink + light parallax; soft hero→page blend; hand `retract peek ms` ~145.
- Portal vision + layman Cursor rule added.

## 2026-09-07 — Page map / fan proof / hover fix / fonts

- Page Z-map shells: Services, Proof, How it works, Why Maximus, FAQ, Get started.
- Removed Collection Surfer; Proof uses 21st image-fan + depth-flip title + Leva `Proof of work`.
- Hover glitch: parallax no longer tilts interactive hero UI (bg-only; default off).
- Headline = Tiempos; body/nav = NHG weights. Phrase slot fixed height; faster hover resume; arrow gap Leva.
- Hand: `retract peek ms` so reverse shows before fade. Scroll cue: "scroll" + pulsing chevron.
- Navbar: glass/pill temporary; prepare for next nav pass (see DECISIONS).

## 2026-09-07 — Hand preview / phrase hover / Tiempos / glass nav / parallax

- Hand: Leva `preview (force show)`; slide in/out from page edge with reverse; leave delay default 0 (no static linger).
- Phrase: fixed slot height (longest phrase); hover scale + pause + trending-up arrow (Leva).
- Fonts: Tiempos Headline installed; Leva `site display font` NHG ↔ Tiempos (reverts via switch). `font-nhg` uses `--ff-display`.
- Hero parallax tilt Leva folder.
- Nav default `glass`: see-through top → 21st navbar-menu pill on scroll.
- Memory: `FUTURE-LOADING.md` — quick load screen; intros after load (not built yet).

## 2026-09-06 — Centered top hero (moumensoliman layout)

- Hero layout = centered stack from 21st `@moumensoliman/hero-section-shadcnui` (no stats).
- Stem above rotating phrase; subtext + CTAs under; mesh bg kept.
- Surfer moved to below-fold `#work` section (scroll to see).
- App localStorage wipe no longer deletes current tuner keys.

## 2026-09-06 — Verify-loop fixes (hand / Leva / surfer)

- Memory: `VERIFY-LOOP.md` + RULES #11 — must screenshot/test before calling UI done.
- Copy Leva offsets: moved off framer-motion node (transform was overwritten); offsets at flat Main Text level.
- Hand: flip origin fixed so right-side hand stays on-screen; hover activate restored (fine pointer).
- Surfer: inset from right edge (`left: 44%`) so cards are not clipped off-screen.

## 2026-09-06 — Reuno layout trial + checkpoint

- Checkpoint: `checkpoints/2026-09-06-pre-reuno-layout/`
- Layout trial: left copy + CTAs (reuno structure), mesh wave near-white bg + vignette, side column off.
- Surfer as right-field background visual; Leva Surfer folder (pos/scale/opacity); mobile stacks below CTAs.
- Hand flipped to right by default; faster post-retract fade (`handFadeOutMs` / `handFadeEarly`).

## 2026-09-06 — Hand left / surfer / memory

- Hand: far-left section anchor, larger defaults; outro = Lottie reverse (retract) then same fade/slide path (no 3D flip-down).
- Mobile Get Started: first tap holds hand; second navigates; no hover-leave kill on coarse pointers.
- Temp Collection Surfer (5 cards) in hero blank → `#work`; drag/wheel surf (embedded, no page hijack).
- Leva: copy block offset X/Y under Main (I want Max To..) Text → Position.
- Watermark removed from hero (off by default).
- Memory: proof of work (max 4), booking at end, performance-first (`FUTURE-PERFORMANCE.md`).

## 2026-09-06 — Hand Lottie / Leva scroll / Druk / notch

- Lenis no longer steals Leva wheel scroll (`prevent` + `data-lenis-prevent`).
- Hand sketch Lottie on Get Started hover (reverse on leave); Leva Hand controls; mobile first-tap hold.
- Door01Icon for Client Portal.
- Druk Condensed watermark test (opacity/position); nav wordmark font option NHG/Druk.
- Optional V2 Mac-notch bar shape (curved ears only).
- HERO-LOTTIE-SPECS updated for AE export + Direct-style scaling.


- Restored V2 soft glow (`0 0 ${24*strength}px`, strength 0.04) — removed hard multi-layer clip blob.
- Stem + phrase black (`#1a1612`); gap after "to" tightened (`0.12em`, Leva).
- overflow visible so long phrases (e.g. automatically) and glow are not clipped.
- Nav logo: size / gap / offset X/Y in Leva (default 22px).
- Maximus letter-stretch option added (off by default) under Nav · REACH.
- Portal icon back to log-in door arrow (not lock).
- Subhead back to NHG medium / snug leading.


- **Stem no longer resizes on rotate:** fit uses font-size (not `transform:scale`), locked to longest phrase. Scale+overflow was shrinking the whole sentence each cycle.
- Phrase gap after "to" bumped (`0.55em`); soft multi-layer glow restored on rotating text.
- Background = exact 21st `@jatin-yadav05/dark-gradient-background` structure (gradient + noise + grid + diagonal), near-white/mocha stops, Leva-tunable. Storage `mr-v3-bg-tuner-v5`.
- Leva categories: panel remounts on open so folders re-init from `{ collapsed: true }` (Leva ignores post-mount setSettings for folders).
- Client Portal icon → 21st animated lock/unlock (hover shackle lift).
- Portrait placeholder is height-driven 9:16 only (no width stretch on resize).
- Lenis inertial scroll + Leva; FUTURE-LOADING.md noted for first-load polish.
- White logo beside Maximus/REACH (unchanged, confirmed).

## 2026-09-06 — Scale / gradient / Lenis pass

- Headline scale locked to longest phrase (stem no longer resizes per rotation).
- Glow shadow restored; phrase gap after "to".
- Background = 21st dark-gradient-background structure, near-white/mocha remap, Leva stops + overlays.
- Lenis inertial scroll with Leva (`Smooth scroll (Lenis)`).
- Portal icon = animated door/arrow (21st log-out motion idea).
- White logo mark beside Maximus/REACH.
- Portrait 9:16 placeholder (no horizontal stretch on resize).
- Memory: FUTURE-LOADING.md for later first-load polish.

- Restored NHG Medium 72px type; stem lighter; one-sentence fit via scale (no clip).
- Gradient visible (was behind section `bg-cream` at z-index -10).
- Placeholder = plain tall rectangle only.
- Maximus above REACH with editable gap (default 0).
- Leva: single useControls per folder + force-collapse on mount; panel starts collapsed.
- Lottie export size documented in HERO-LOTTIE-SPECS.md.

- Fixed REACH stretch (left-origin, no glyph crash); added small **Maximus** stacked above.
- Nav link icons; FlowButtons under subhead (Get Started filled, Client Portal outline).
- Stem color lighter than rotating phrase; single-line + `maxWidth` Leva control; blink cursor.
- Eyebrow off by default; mocha radial gradient remapped so it is actually visible.
- Leva folders start collapsed; panel starts collapsed.
- Memory: `FUTURE-PORTAL-FAQ.md` for later portal / FAQ / payment tabs.

