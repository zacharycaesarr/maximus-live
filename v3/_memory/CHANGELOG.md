## 2026-09-28 — homepage color architecture (routing fix)

- **Homepage Colors:** 9 semantic roles on `#home-page` only (Light/Dark BG + Surface, Text on Light/Dark, Muted, Line, Acid). Leva: Test Color Routing + Reset.
- **Page scroll BG:** behavior only. Color stops read `--home-bg-dark` → `--home-bg-light`. No mocha/brown palette of its own.
- **Remap:** sections + proof overlay + FAQ + footer + nav glass inherit home vars. How it works dropped independent canopy/card color pickers. Service-card artwork untouched.
- **Tailwind:** home colors use RGB channel vars so `/40` opacity utilities actually paint.

## 2026-09-27 — how art swap + proof fan fixes

- **How art:** swapped to new wide line-art PNGs (`step-*-art.png?v=5`), same Railway placement + Leva.
- **Proof fan:** arrows/autoplay direction corrected. Build-case thumbs use contain (full homepage in the box). Brickwork cockpit bars taller.
- **Caps Leva:** `Maximus · V3` → `Nav` → `Caps dropdown` (opened by default now).

## 2026-09-27 — transparent card art (Railway style)

- **Why black boxes:** the chat PNGs were RGB with baked-in black (0% alpha). CSS cannot invent transparency. Told Zach; keyed black→RGBA into `/how/step-*-art.png` + `/nav/caps-web-art.png`.
- **Placement:** absolute `<img>` inside `overflow:hidden` cards. No black wrappers, no blend modes, no art pockets. Cream/mocha card bg shows through. Caps web art lower-right, clipped.
- **Leva:** scale / X / Y / opacity — `mr-v3-how-it-works-v12`, `mr-v3-nav-tuner-v12`.

## 2026-09-27 — phrase hover fix + how/caps art swap

- **Hero phrase hover (desktop):** pause cycle + arrow stays reliable. Parallax freezes on hover, leave is debounced, blur hold no longer restarts CSS animation, no scale nudge.
- **How + Caps art:** chat PNGs into `/how/step-*-*.png` and `/nav/caps-web-visual.png`. How cards get a dark bottom pocket so black PNG bg blends (no cream black-box). Leva keys `mr-v3-how-it-works-v8`, `mr-v3-nav-tuner-v9`.

## 2026-09-26 late3 — how PNGs, caps art, proof fan fill

- **How it works (desktop):** step emojis → local PNGs (`/how/step-*`), Leva Art folder (`mr-v3-how-it-works-v7`). Tags `1.` / `2.` / `3.`. Mobile accordion stays text-only.
- **Caps dropdown:** Web Dev tile solid mocha gradient + positioned PNG (`/nav/caps-web-visual.png`), Leva `mr-v3-nav-tuner-v8`. Ads/Creative side tiles solid night gradients (no transparent wash).
- **Proof fan:** build-case thumbs ResizeObserver cover-fill (no corner gaps). Brickwork fan = CSS mini ads cockpit (Meta/Google + 47 CALLS / 4.2x ROAS), not stock thumb.

## 2026-09-26 night2 — mobile layout pass + funnel + /start

- **Reach Beacon:** off on mobile (no GSAP/ST cost on phones). Desktop unchanged.
- **Services:** mobile = horizontal snap swipe (one card); desktop 3-up kept.
- **Hero mobile:** smaller subtext (~13.5px); fixed 2-line phrase slot (no jump); closer gap under phrase; phrases centered (no arrow reserve on phone); snappier entrance after preloader.
- **Get Started:** hero CTA → `/start` (not bottom of page).
- **Why Maximus:** swipe between Maximus / Traditional on phone; title→pill gap tightened (`mb-5`).
- **How it works:** mobile accordion (01/02/03, one open, light sweep); desktop cards untouched.
- **MoneyFlow:** Meta/Google/TikTok chips smaller on mobile.
- **Funnel:** darker mocha→gold colors (`mr-v3-ads-v9`); taller chart + thicker band so stage 1 is visible.

## 2026-09-26 night — stars BG, hand gate, real 21st funnel, mobile hero

- **Stars:** `ServicesStarField` sits on `#page-sections` (absolute band via `[data-services-band]`). Not inside Services / SectionFocus, so card scale no longer drags the dots.
- **Hero phrase hover (desktop):** pause on current phrase + up arrow; leave resumes same phrase (no jump). Arrow width reserved so layout does not flicker the hit box.
- **Hand:** only mounts / hit-tests after Get Started finishes animating in (`data-cta-armed` + `ctaArmed` timing).
- **Ads funnel:** real 21st `@bklitai/funnel-chart` at `ui/funnel-chart.tsx` (framer-motion port, grid demo). Custom trapezoids removed. Brand cream/mocha colors stay in Leva. Decision bar kept.
- **Mobile hero video:** byte-copied `Hero_Mobile_convertedhandbrake.mp4` → `/video/Hero-mobile-handbrake.mp4` (~6.6MB) + poster frame 1. Desktop unchanged. Pause off-screen / tab hide. `object-position: center top` so copy sits in the black sky above devices.

## 2026-09-26 evening — stars redo, perf, ads funnel, nav polish

- **ServicesStarField:** dots-only SVG layers inside Services (no `#020409` fill merge). Bottom CSS mask fades before Proof. Delete one mount to remove. Old `StarFieldBackground` deleted.
- **Get started hard line:** caused by `overflow-hidden` clipping the gold blur. Reverted to `overflow-visible`.
- **Perf (no visual redesign):** PageScrollGradient was repainting full multi-layer BG every rAF (~60fps, even pre-unlock) → ~800MB thrash feel. Now throttled ~12fps, paint-deduped, paused when tab hidden / motionAmount 0. ReachBeacon wrapped in `gsap.context`. Hand Lottie rAF skipped on mobile. Tubelight scroll poll 140→400ms.
- **Hero:** hand off on mobile; emoji badge default off + never on mobile; desktop phrase hover arrow + click on left layout.
- **Ads:** TikTok logo box nudged up; reporting bento removed (see `ADS-REPORTING-BENTO.md`); conversion funnel + Decision bar + Leva (`mr-v3-ads-v8`).
- **Mobile nav:** hamburger icons (Ads/Creative/About/Portal); Web Dev + Home keep empty reserve slots; Tubelight animates out while hamburger open.

## 2026-09-26 late — kill Network, stars, polish pass

- **Reach Network gone:** deleted `ReachNetworkLayer.tsx` + `HomepageGrain.tsx` + all mounts/Leva. No canvas network, no extra rAF from it. Site motion back to normal browser ~60fps (Beacon/GSAP/Lenis only). Card pixel stars still ~12fps on card faces only.
- **StarFieldBackground:** SVG-only night sky on Services band (`#020409`, ~57 warm dots, 3 CSS opacity groups 7/10/13s). Delete one mount to remove. Reduced-motion = static.
- **Hero phrase:** rotating line wraps/stacks when squished; stem stays one line. Mobile: copy centered near top, Leva X/Y offsets zeroed.
- **Footer void:** cream body was showing past dark footer. `data-home=1` paints body/`#root` `#0a0908`; dark footer solid `#0a0908` + mobile bottom pad; Get Started blur clipped.
- **Why Maximus:** 5 → 3 rows (Ownership / Speed / Clarity). Research: first 3–5 comparison rows carry most attention (NN/g + SaaS pricing audits).
- **Ads MoneyFlow:** Meta/Google/TikTok → soft boxes with `/brand/*.svg` + name under logo.
- **Tubelight Work:** upward sheet → Web Dev / Ads / Creative.
- **Caps dropdown + section titles:** white (not peach `#FFEDD5`).
- **Page scroll BG Leva:** tint top/bottom labels + **Reset night→mocha (current)**. Main look = stepped radial mocha ramp (hardcoded stops). Soft wash = your Leva colors.
- **iPhone casing (not swapped yet):** CSS frame is **220×~477** mobile / **260×~563** desktop (`aspect-ratio: 9/19.5`), bezel pad 10px, outer radius ~2.4rem, island 78×22.

## 2026-09-26 am — perf cut on Beacon + Network

- Beacon: killed refreshInit rebuild loop (was remounting GSAP on every ST refresh → RAM spike / lag / hero video stall). Rebuild only on debounced resize.
- Network: fixed viewport canvas (~20fps), fewer points, pauses off-page, brighter so you can actually see it. Leva toggle to disable. Does not paint over hero. **(Removed later same day.)**

## 2026-09-26 — hero lock, Railway mobile menu, Reach Beacon + Network

- Hero layout v23: locked copy block (X43 Y145 scale 1.14) + hand (left, offsetX 279). Eyebrow scale Leva (default 0.85). Stem text size stays stable on narrow windows (phrase-only fit).
- Mobile menu: Railway-style accordion + card rows with graphic slot (`/public/nav/mob-*.png` later).
- Reach Beacon (GSAP MotionPath + ScrollTrigger) on homepage post-hero anchors. Leva: Reach Beacon.
- ReachNetworkLayer canvas (seeded points, scroll-melted states) + independent HomepageGrain. Removable as single components.

## 2026-09-25 late2 — tilt strength, night BG paint, proof build-cases

- Hero tilt back to real values (`parallaxMaxTilt` 14 / strength 22). Key `mr-v3-hero-layout-v22`.
- Page BG: Zach night/mocha grain CSS painted ON `#page-sections` (replaces cream). Key `mr-v3-page-scroll-bg-v7`. Brand stops `#0B0D13` `#2A1B1A` `#FFE6B9`.
- Learn more: compact panel slides down from top with bullet stagger. Stays above card title.
- Proof v7: Augusta + Shenandoah use Web Dev `BuildCase` after-homepages for fan + modal; logos beside titles. Brickwork Ads card = "Brickwork - Meta" / 3.8x ROAS (hover layer Spent $7K - 74 calls - 22 booked).

## 2026-09-25 late — bg replace, tilt back, proof clients, learn-more

- Hero content tilt restored (rotate + shift).
- Services: removed white plate. Page BG after hero is the real mocha/night grain ramp (Zach CSS + brand swatches), not a cream layer with white on top. Extra grain overlay removed.
- Learn more: small panel drops from top with motion; no longer covers bottom title.
- Proof v5: Augusta Dental Arts + Shenandoah Craft Built thumbs/logos; Brickwork uses Ads Reporting `AnimatedCard`/`Visual1` as "Brickwork - Meta" / Spent $7K · 74 calls · 22 booked / 3.8x ROAS.

- Services: solid white full-bleed (covers grain). No night gradients / fade stacks. Creative Studio card (was Systems). Learn more flap slides up *inside* the card. Pixel stars on card faces (denser). Leva `mr-v3-services-overview-v3`.
- Hero copy block: position X/Y + scale + timing under **Hero layout · Copy block** with Reset. Dead Surfer / Watermark / side-column Leva removed. Hand Lottie inverted white. Content parallax = soft shift only (no rotate blur).
- Proof: Client Two → Brickwork + logo in white box; new stats; Ridge Plumbing · Meta interactive visual; #1/#4 stock website scrolls; mobile CTA smaller. Key `mr-v3-proof-fan-v4`.

- Hero left copy: slower fade + breathe delay (`copyBreathMs` / `subheadLagMs` in Hero layout). Whole-block `copyScale` + `ctaScale`. Bigger default headline. Subtext word-slide waits after “I want Maximus to”. Replay via Preloader → Replay intro.
- Interactive demo canvas fully removed (provider, defaults, FUTURE-DEMO-CANVAS.md, hero mounts).
- Services: night floor `#0F0E15` blending from hero; soft fade into next section. Card pixel-star layer from 21st `@uicapsule/background-pixel-stars` (card-scoped, 12fps, pause offscreen). Systems flap: harder squish + row nudge left so bullets stay visible (timing unchanged).
- Capabilities dropdown: dark mega panel — Web Development feature tile (drop PNG at `/public/nav/caps-web-visual.png`), Ad Management + Creative Studio stacked. No fourth tile.
- Gravity Stars: researched, **not shipped** (too heavy for home). Notes in `THEME-NIGHT.md`. Brand night swatches recorded there.
- Memory: deleted obsolete `FUTURE-DEMO-CANVAS.md`; added `THEME-NIGHT.md`.

## 2026-09-25 — hero desk loop + services tall cards + word slide + phone swipe

- Hero desktop bg: `Hero-zachsitting-handbrake.mp4` (4K60 HandBrake, byte-copied). Poster frame 1 at `/video/Hero-zachsitting-poster.jpg`. Same pause-on-scroll + tab-hide pattern. Old floating-objects WebM/MP4 archived at `_archive/hero-floating-objects-2026-09-25/` with restore README.
- Hero subtext: Motion-style word-by-word slide-up (`WordSlideUp`) for "Maximus Reach helps ambitious businesses…". Layout key `mr-v3-hero-layout-v19`.
- Services cards: taller Designjoy height, no tag/status pills, symbol right of title, per-card color + ink in Leva (`mr-v3-services-overview-v2`). Flap slides out behind the card (width/opacity only — no letter anim glitch); other cards squish.
- Phone carousel: dual-buffer CSS swipe back (current + incoming both painted) so next mock shows immediately with no black flash.

## 2026-09-24 night — phone swap, showcase scroll lock, services cards redo

- Phone arrows: instant swap (no CSS wipe / black flash).
- Selected Builds overlay: Lenis `stop()` while open; wheel/touch blocked on page; only `[data-showcase-scroll]` rails scroll.
- Services overview: removed laggy 21st fold bento. New cards use same `TiltSurface` method as Ads reporting proof cards (taller/bigger). Flip-out flap kept (CSS, tilt off while open). Leva folder `Services overview` (`mr-v3-services-overview-v1`).

## 2026-09-24 — phone lag fix + full web mocks + services fold

- Phone carousel: removed Framer `AnimatePresence`/`popLayout` (was remounting two full mock trees + 8 springs per arrow click). CSS translate slide; one reveal host; before still lazy on peek.
- Selected Builds: full homepage before/after stages (nav/hero/body/stats) for Rounds HVAC, Augusta Dental Arts, Shenandoah Craft Built. Browse strip + focus cards show after by default, before on hover. Expanded stage fills the browser frame (no black void).
- Safari pill: mocha `#c4a574` again, label `REQUEST` (no parentheses), same late pop-in.
- How-we-build stock: hero house kept; media + two cards swapped to house/living/kitchen Unsplash.
- Home services: old bento removed; `ServicesFoldBento` (tilt + fade shine, fold-out flap, click scale, tilt settles when open). Mobile stack + tap flap.

## 2026-09-22 — phone fill final + builds cases + lag cuts

- Phone HVAC/Plumbing: filled remaining empty area. Desktop = review/jobs + cut-off next section. Mobile = tiny “next section” peek. HVAC rethemed ember/charcoal (not blue). Dental starts first; autoplay waits until phone is on screen.
- Befores: stronger ugly colors (no plain white). Precise before footer: Canva Website Builder.
- Perf: mesh motion default off; ads grain ~45; one phone carousel mount; before mock lazy; CTA glow static; showcase rAF pauses offscreen.
- Safari step 4: cream pill pops “(REQUEST)” after cursor press (late in timeline).
- Selected Builds expanded: coded before/after case stages (Rounds HVAC, Augusta Dental Arts, Shenandoah Craft Built) + problem/change/result copy. Browse strip logistics unchanged.
- Memory: zero mini-freeze requirement + attack plan in FINAL-WRAPUP + FUTURE-PERFORMANCE.

## 2026-09-21 mid — phone polish + name playground v2

- Phone labels: SMILEDESIGN / Rounds HVAC / Precise Plumbing. Logos in after navs (`logo-smile`, `logo-rounds`, `logo-precise`).
- HVAC + plumbing after: divider line + real lower half (chips, hours, service area, review). No empty navy void.
- Befores intentionally worse (uncropped photos, tables, yellow banners, old fonts). Unique backgrounds per mock.
- Mock-only Google fonts (Libre Baskerville/DM Sans, Oswald/Barlow, Rubik) — not site NHG.
- Name playground v2 (`mr-v3-about-name-play-v2`): comma in lockup, zoomed scale entrance, comma fades on rearrange, bigger default size, expo ease.

## 2026-09-21 morning — real phone mocks + About GSAP playground

- Safari URL: `youramazingwebsite.com`.
- Phone mocks rebuilt from scratch with Zachary's photos only (`/public/phone-mocks/`). Real text (no gray bars). Before = outdated-but-real local mobile site; After = same business, premium redesign. No empty voids; content under Dynamic Island.
- GSAP already in project (`gsap` + `@gsap/react`). About page: live NameSwapPlayground (MAXIMUS → ZACHARY letter slide-up, then word swap). Leva: duration, stagger, ease, swap arc, type size, Replay / Remember / Revert (`mr-v3-about-name-play-v1`).
- About still clean-slate; old page in `_archive/about-page-2026-09-21/`.

## 2026-09-21 dawn — phone mock rebuild, about clean slate, hero gap removed

- Removed the thick hero→mobile design bridge on Web Dev.
- Safari address: `Your amazing Website.com`.
- Hero mesh Leva clearer: on/off, how far, how fast (storage `mr-v3-web-dev-v9`). Grain contrast bumped a tad (still Leva-editable).
- Phone mocks rebuilt from refs: gray-line filler, short real hero + buttons, smiling arches (dental), HVAC photo card, fleshed before states. Content padded under Dynamic Island.
- About: old page archived to `v3/_archive/about-page-2026-09-21/`. Live `/about` is clean slate with section copy buttons.

## 2026-09-21 night2 — phone homepages, CTA slide, Start Lottie, safari lights

- Phone mocks rebuilt as real mobile *homepages* (nav + hero + CTA) before/after for Ridge / Northline / Summit. Old filler layouts removed.
- Ready when you are: slower + taller slide-up (y ~48–56px, ~3s).
- Selected builds: text + card strip get scroll intros (lightbox still portals-free / not wrapped in transform).
- Start: After Effects Lottie at `/lottie/start-middleanimation.json` above "Start here".
- Safari traffic lights: tiny (6–7px), icons inset so they don't overlap; stage widens to 98% on trust/finish.
- Hero → Mobile-first: soft mocha wash bridge (no copy).

## 2026-09-21 night — phone mocks, safari reviews, lightbox, mesh drift

- Safari How-we-build: reviews sit under "Built to be trusted" (cards can't cover them). Short gray lines in the mid gap. Traffic lights are real HTML circles (not stretched SVG ovals).
- Phone section: 3 React phone-only before/after mocks (Ridge / Northline / Summit). Mouse-track peek. Control buttons centered under the phone.
- Web builds lightbox: top nav hides while open; wheel over left text panel scrolls the right rail.
- Grain: full Leva (amount / size / contrast / brightness) on Web Dev. Storage `mr-v3-web-dev-v8`.
- CTA "Ready when you are": slower Reveal (~2.4–2.55s). Hero intro also slowed a bit.
- Hero mesh: darker wash drifts horizontally. Leva: animate on/off, amount, speed. Remember / Revert still works.

## 2026-09-21 late — home blend, grain, safari polish, phone reveal, ads trim

- Home hero: fade lives INSIDE the hero (tall, delayed so laptop isn't eaten). External grey seam strip removed. Page sections match color0. Video/copy untouched.
- Grain: dedicated overlay + contrast/brightness + Leva (Ads grain amount/contrast/brightness).
- Safari How-we-build: real traffic lights; LIVE lines under badge; body text bars animate on step 4.
- Web builds lightbox: z-200 over nav, Escape closes, body scroll lock, X stopPropagation.
- Phone: 3 before/after slides with 21st mouse-track slot (hover desktop / hold-drag mobile); slides slide not fade.
- Ads: removed SignalField, cursor hint, BudgetDial. Kept title + stretch + blurb + flow/report/CTA.

- Hard lines: caused by separate solid section backgrounds. Ads now one continuous page gradient (dial/flow have no fill). Home seam fades into cream page BG + overlap, not grey `#f7f7f5`.
- Grain: exact 21st SVG (0.9 / 2 octaves / overlay / 120px). Ads + Start + home Leva grain 0–100.
- How we build: removed overflow-clip (it broke pin + shadow). Pin ends at Talk through CTA. Shadow padding restored.
- Testimonials: triple-set rail, measure set width, while-loop reset (no blank gap).
- Start: animated Bloom Field mesh (cream/mocha, not blue) + visible grain. Leva under Background.
- Home hero video/copy untouched. Only the soft seam strip below the fold was recolored.
- How we build: overflow clip + earlier unpin so the Safari window stops before testimonials (no hang past Talk through a build).
- Subtext: body copy near-black (espresso). Accent lines like "Then everything else" stay muted.
- About: "Hey, I'm Zachary" solid espresso (TextRoll was invisible under bg-clip gradient). Wipe starts with text hidden (no pre-flash).
- Start: full-page light cream/mocha gradient; Cal lazy-mount; BreathingText removed (main lag).
- Ads: Leva-tunable warm gradient + grain bg (user CSS). HeroBottomBlend softens hard hero cuts on Web/Ads/Mobile-first.
- Creative: hero overflow-hidden + reel top padding so "Scroll to scrub" is not cut by CREATIVE type.
- About hero restored to blur. Text-block wipe + text-roll on story ("Hey, I'm Zachary") not hero.
- Logos: attached short/smooth black+white transparent PNGs in nav/footer (no invert hacks).
- Testimonials featured panel fixed height, absolute crossfade (no layout shift).
- Reveal default ~1.45–1.55s. Web Dev mesh cream/mocha bg. Desktop How-we-build stage larger.
- Real badtzx0 AnimatedCard on Ads reporting. Start contact uses same 3D tilt; Ads cards tap on mobile.
- Cal embed: data-lenis-prevent + overflow fix. Serotiva removed from Tailwind.

## 2026-09-21 — Caps polish pass (Switzer, stretch, logos, interactive Ads/Creative)

- Switzer replaces Serotiva sitewide on caps/subtext. Stretch hover glitch fixed; bigger stretch defaults + hoverBoost Leva. Reach Further nav stretches.
- Logo: transparent short PNG + Leva smooth alt. Safari window shadow no longer clipped. Testimonials horizontal rail restored (glass look kept). Grain opacity + size sliders.
- Ads: interactive sections restored + proof tilt cards with real sample metrics. Creative: mesh gradient hero (Leva colors) + ReelStrip + new blurb.
- Start: slower Reveal + preview replay; Book a call weight-breath. About hero: text block wipe. Caps dropdown ~90% solid; Capabilities font matches nav.
- Memory: INDEX trimmed; SESSION-2026-09-20 is the live snapshot.

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

