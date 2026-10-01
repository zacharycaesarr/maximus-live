# Home-lab performance pass

Completed against the approved homepage checkpoint, October 1, 2026. Only home-lab was edited. V3 was not changed or migrated. The optimization changes remain uncommitted for review.

This pass reduces measured startup and scrolling work while retaining the approved presentation. It does not certify zero lag on every device. The slower-CPU test still exposes stalls, and mobile LCP still exceeds the requested target because of the approved headline reveal.

## 1. Recovery checkpoint

`890313b19a245648dd3a9f1c6eac9a7f883ee10e`

Message: `checkpoint: approved homepage before final ultra optimization`.

This is the state before this pass. The frozen production build is retained at [baseline-dist](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/_perf/baseline-dist). Restore only home-lab paths from the checkpoint if reverting; do not reset the parent repository, which contains unrelated work.

## 2. Initial production JavaScript

Entry module before: **965,751 bytes**, **313,477 bytes gzip**.

Entry module after: **764,710 bytes**, **246,263 bytes gzip**.

Reduction: **20.8% raw**, **21.4% gzip**. These are actual file sizes and Python gzip measurements with the same compression settings, rather than rounded Vite display sizes. The main entry still exceeds Vite's 500 kB warning threshold.

The existing deferred Proof, modal showcase, mesh background and Lottie chunks remain split. The 12,259-byte hand JSON is now included in its already-lazy hand module, eliminating another request each time the player remounts. It is not added to the entry module or loaded by the mobile hand-disabled branch.

## 3. Ranked measured bottlenecks

1. **Initial React mount, Leva registration and synchronous layout.** Baseline desktop initial React task: 412 ms normally and 2,895 ms at 4× CPU. Production previously initialized the full tuner runtime even though the panel was hidden. Its production replacement is the largest startup and entry-size improvement.
2. **Continuous hidden work.** Proof's GSAP word flip and fan autoplay, the hero arrow and headline cycle, Services stars and the hand's continuous geometry tracking continued to consume work when irrelevant. A five-second 4× CPU recording at the CTA measured 715.5 ms of style work before, versus 27.0 ms after the hidden hero work was held. Layout work fell from 40.4 ms to 0.6 ms in that focused recording.
3. **Repeated measurements and responsive systems.** Navbar polling, duplicate Beacon refresh measurements and unused mobile desktop scroll subscriptions added work. The idle desktop hand went from 375 button rectangle reads over six seconds to zero.
4. **Oversized service illustration downloads.** Three PNGs totaled 3,441,500 bytes. Full-resolution lossless WebP equivalents total 2,243,798 bytes, saving 1,197,702 bytes, or 34.8%.
5. **Remaining visible animation/layout work on a slower CPU.** Motion frame processing still forces style/layout during active choreography. The initial mount still contains significant synchronous layout. No individual glass, grain or shadow effect was established as the sole cause, so none was visually reduced.

## 4. Responsible components

The startup editor cost came from Leva's initialization and the homepage tuner providers. Continuous work came from the Proof flip/fan, hero phrase/arrow, hand geometry and Services star animation. Navigation had timer-based scroll polling. Why constructed desktop Motion scroll state on mobile and retained unused progress transforms. Beacon created an initial trigger before its portal target existed, then rebuilt it and measured twice per refresh.

The exact changed files are listed in item 16.

## 5. Meaningful optimizations retained

- Build-only Leva replacement reads the existing scalar schemas and persisted values without the editor, plugin registry, subscriptions or panel. It preserves number clamping, select fallback, hex normalization and transient control behavior. Development retains real Leva. The production schema reader deliberately supports this homepage's current scalar controls; new complex tuner types require reviewing it.
- Production no longer subscribes to the service tuner persistence editor store or overwrites saved cards with an empty production store.
- Proof's existing GSAP timeline pauses and resumes without reconstruction when offscreen or hidden. Fan autoplay only runs when relevant, with its visible 2.8-second interval retained.
- Hero arrow playback holds its phase offscreen and when hidden. Its keyframes, 1.6-second duration and easing are retained. Hero typing, phrase cycling and CSS word effects pause when hidden or offscreen, with visible timing retained.
- The hand tracks geometry during interaction and a short settling window, and wakes on relevant geometry changes. It no longer measures every idle frame. Its exact JSON is reused from the lazy module instead of repeatedly fetched.
- Navigation uses passive scroll events instead of periodic polling. The mobile dock is actually absent on desktop.
- Why's desktop child owns the reel subscription. Mobile does not construct the hidden desktop system. Five unused progress transforms and panel-offset calculations were removed. Both visible desktop tracks still share one x value; React updates only at meaningful panel boundaries.
- Mobile How It Works returns its accordion before constructing desktop scroll/spring hooks. Mobile detection is resolved at initial render in the affected components.
- Services stars pause offscreen and when hidden. Height reads occur before style writes rather than between them.
- Beacon waits for its CTA portal target, avoids duplicate initial construction and lets its refresh callback perform one measurement pass. Geometry stays cached during scroll. Pending font callbacks and observers have disposal guards.
- Proof's lazy boundaries reserve the real responsive heading/fan geometry instead of guessed heights. Settled section dimensions, padding and spacing match the checkpoint.
- Three service illustrations use full-resolution, pixel-identical RGBA WebP files. Custom tuner image URLs retain their existing behavior. Original PNG sources remain available for regeneration; the homepage does not request them and a build-only packaging hook omits these replaced masters from generated output.

No animation library was swapped. No broad memoization, CSS rewrite or speculative containment was introduced.

## 6. Production before/after measurements

- **Desktop 1440 × 900:** largest startup task 412 → 213 ms. Across three wheel journeys: scripting 4908 → 3793 ms (22.7% lower); style 3069 → 1771 ms (42.3% lower); layout 253 → 192 ms (23.9% lower). Scroll tasks over 50 ms: 0 → 0. p95 frame interval 13.9 → 7.1 ms. Frame gaps over 50 ms: 18 → 16.
- **Mobile 393 × 852:** largest startup task 330 → 229 ms. Across three wheel journeys: scripting 2938 → 2225 ms (24.3% lower); style 1817 → 1172 ms (35.5% lower); layout 85 → 56 ms (34.1% lower). Scroll tasks over 50 ms: 0 → 0. p95 frame interval 13.9 → 13.8 ms. Frame gaps over 50 ms: 8 → 7.
- **Mobile 430 × 932:** largest startup task 299 → 215 ms. Across three wheel journeys: scripting 2833 → 2095 ms (26.1% lower); style 1803 → 1109 ms (38.5% lower); layout 79 → 50 ms (36.1% lower). Scroll tasks over 50 ms: 0 → 0. p95 frame interval 7.1 → 7.1 ms. Frame gaps over 50 ms: 5 → 9.
- **Desktop 1440 × 900, 4× CPU:** largest startup task 2895 → 1411 ms. Across three wheel journeys: scripting 12032 → 8013 ms (33.4% lower); style 5819 → 3348 ms (42.5% lower); layout 971 → 587 ms (39.6% lower). Scroll tasks over 50 ms: 150 → 35. p95 frame interval 118.1 → 62.4 ms. Frame gaps over 50 ms: 212 → 89.
  Largest scroll task 553 → 238 ms. This stress result still misses the smooth-frame target.

All normal-scroll tests measured zero tasks over 50 ms both before and after; this was not a baseline long-task problem on the unthrottled host. The improvement is lower work and better frame timing, not removal of a previously measured normal-scroll long task.

Occasional frame gaps remain. A good p95 frame interval does not prove that every frame stayed within budget, nor does a headless local run certify physical-device 60 fps.

## 7. Hero and preloader

The approved preloader/aperture and hero reveal were retained. No reveal delay, phrase duration, easing, typography, video crop or video quality was changed. Initial mobile detection avoids a temporary desktop setup on mobile.

The hand hover check matches the original dock position within subpixel measurement tolerance: 220 × 123.75 px, visible opacity 0.92, and opacity zero after leaving. Idle button geometry reads are zero. The arrow's native opacity keyframes and playback timing match the baseline, and its playback time stops while offscreen then resumes on re-entry.

Lottie remains a deferred dependency. Hero video uses the appropriate source at each breakpoint, is not duplicated, and is paused at the CTA. The full-quality source video and poster were retained. Mobile video transfer in the baseline load-attribution test took about 228 ms on localhost; the much later headline LCP was not primarily a media download stall.

## 8. Services

The Web, Ads and Creative card artwork, geometry, shadows, outlines, glass, embossed surfaces, hover motion and animation settings were preserved. All three cards were checked on desktop and reached through the native mobile horizontal row at both requested sizes.

Card visibility and document-hidden gating already existed and was retained. The star layer now follows the same lifecycle. A focused five-second 4× CPU Services recording measured scripting 807 → 376 ms and style work 785 → 511 ms; the final focused recording had no long task over 50 ms. Continuous visible card motion still has real rendering cost.

The hidden-document check used a synthetic visibility-state change in isolated test contexts. After settling, the final Proof subtree recorded zero mutations versus thousands in the baseline at each viewport. This verifies the handlers, rather than a physical browser-tab or operating-system backgrounding test.

Each converted WebP was decoded and compared against its PNG source: identical dimensions and identical RGBA bytes, including transparent pixels. This is lossless encoding, not lower-resolution artwork. The homepage network records request the WebPs, not those three PNGs.

## 9. Why Maximus and testimonials

Desktop still uses the same sticky outer section, two horizontal belts, five panels, 9.5% opening hold, narrow visual edge mask and reverse scrub. Hold fractions 0, .04, .094 and .096 and forward/reverse progress were compared against the checkpoint. Track transforms match.

All five desktop and mobile states were captured. Mobile controls/swiping still work and there is no mobile desktop reel subscription. Reduced-motion uses the existing alternate presentation.

Testimonials remain gated by panel 05 activation, viewport relevance, reduced-motion settings and document visibility. No autonomous startup carousel was introduced. Desktop and mobile branches remain mutually exclusive through repeated breakpoint changes.

## 10. Reach Beacon and final CTA

No Beacon appearance, coordinates, timing, blend settings or image destination was changed. Four CTA arrival positions were compared at each tested viewport. Marker transforms and opacity match; route coordinate differences were below 0.002 px, a floating-point tolerance.

Scroll only interpolates cached route geometry. Layout/font/resize/anchor changes schedule measurements. Repeated scroll and breakpoint tests maintained exactly two GSAP triggers: the CTA reveal and `home-reach-beacon`. Why uses Motion plus CSS sticky, rather than a GSAP trigger.

CTA art direction still fetches one image per viewport: desktop 164,482 transferred bytes, mobile 98,946. Desktop did not fetch mobile artwork, nor mobile desktop artwork. Live CTA/footer content, cream fade, rounded composition and image crop match the baseline.

## 11. Mobile and interactions

Tested at **393 × 852** and **430 × 932** in isolated Chromium mobile contexts. Services scrolling, all five Why controls, FAQ expansion/collapse, CTA artwork and navigation were exercised. The Proof showcase opens, Escape closes it, and Lenis resumes normally. Repeated desktop/mobile swaps do not leave both Why/How branches mounted.

There were no page JavaScript errors in the production profiles or development Leva check. Static styles and settled section geometry matched the checkpoint at all three viewports. Proof comparison was repeated after lazy loading and with the same selected project; its styles match too. Dynamic animations were compared by settings and relevant states, rather than demanding pixel equality at different playback moments.

Development Leva renders 864 inputs. A real Web card title control was edited and restored in an isolated browser context, verifying that the editor updates live content. The user's browser settings were not modified.

## 12. Vitals and test method

- **Desktop 1440 × 900:** LCP 0.860 → 0.608 seconds; CLS 0.000013 → 0.000296.
- **Mobile 393 × 852:** LCP 6.360 → 6.240 seconds; CLS 0.006150 → 0.004310.
- **Mobile 430 × 932:** LCP 6.312 → 6.168 seconds; CLS 0.003281 → 0.003311.
- **Desktop 1440 × 900, 4× CPU:** LCP 4.276 → 2.392 seconds; CLS 0.135263 → 0.000042.

Normal desktop meets the local LCP target. Both mobile LCP measurements remain above 2.5 seconds. All final CLS values are below 0.1. Load attribution showed mobile LCP moving from the preloader to the typing stem, then ‘Maximus’, then the larger rotating word at about 6.4 seconds. That is approved reveal choreography; shortening it was outside the visual freeze.

Maximum tested interaction event duration was 56 ms with an interaction ID. This is a local Event Timing observation, not a field INP result. No Lighthouse score or field Core Web Vitals result was obtained.

Baseline and final tests use Vite production previews, isolated Chrome contexts, fresh page loads and three real wheel-input top/bottom/reverse journeys. The frozen baseline was recorded before editing. Final source was built with `npm run build` and measured at [production preview](http://127.0.0.1:4173/), not localhost:5176. CPU stress uses Chromium's 4× throttle, not a physical low-end phone or network throttle.

Chrome DevTools Protocol recorded Performance traces, long tasks, long animation frames, layout/style, paint/raster/decode/commit events, network and memory. Automatic native Computer Use stopped because the Windows helper could not confidently determine the browser URL. Native UI automation was stopped. The separate, local automated Chromium test suite continued; manual Rendering-panel paint-flashing and physical-device/Safari checks were not completed.

## 13. Memory and lifecycle

Twenty-four repeated journeys at each viewport kept listener counts stable: 728 desktop and 599 mobile during the final-source hero lifecycle test, then one fewer after parking. DOM count stayed at 1,927 after initial settlement. Observer instances/targets were stable through six separate repetition rounds. Trigger count was always two through twelve journeys and six breakpoint swaps.

An extended 80-journey desktop check was run because the GC'd heap rose during warm-up. From journey 12 to 80, most growth in the heap snapshots was V8 compiled-code storage: approximately 628 kB of instruction streams, 173 kB of trusted byte arrays and 79 kB of protected fixed arrays. Browser timing, accessibility and debug resource records also grew. This did not show an accumulating DOM/listener/trigger leak. It also exposed one JSON request on every hero return, which was removed.

After the hand-data fix, a fresh 32-journey desktop check recorded **0 hand JSON XHR requests**. After initial lazy-content settlement, listener counts ranged 728–728 during the journeys and 727 after parking; DOM ranged 1927–1929 nodes. GC'd heap was 8.83 MB after the first journey and 11.38 MB after warm-up/parking. The original load remains a deferred hand-module import, with the exact artwork data embedded in it.

The performance recorder intentionally retains frame and trace arrays; its heap series is not used as proof of an application leak. The separate memory test has no growing browser probe arrays. Some engine warm-up/cache growth remains; this is not a claim of perfectly flat heap usage or proof against every possible long-duration leak.

## 14. Audits and remaining costs

- **Paint/compositing and glass:** actual trace events were collected for Services, Why and CTA. No conclusive redundant backdrop layer with guaranteed identical output was identified. Shadows, masks, glass and gradients remain unchanged. Trace paint/raster/commit durations are separate categories, not additive GPU time or a physical-device compositor guarantee.
- **Paint/decode results:** in the normal desktop journey trace, paint was 1,189 → 1,141 ms and raster 492 → 488 ms, modest changes. Commit was 2,098 → 2,189 ms and image decode 129 → 172 ms; those did not improve in this capture. The lossless images reduce transfer bytes, not a demonstrated decode-time improvement. Non-composited border-color and SVG stroke-dashoffset events remain because their approved color/drawing effects are retained.
- **CSS selectors:** a separate selector-stat trace captured 731 events. Matching time totaled 14.6 ms across the diagnostic sequence. Highest matching totals were ordinary pseudo-element rules at roughly 1.2–1.5 ms each. There was no evidence for a valuable broad selector rewrite; that instrumentation was excluded from timed benchmarks because it adds overhead.
- **Grain/nodes:** grain is the existing static tiled SVG texture, with no JS noise generator or per-frame texture generation. Existing cream nodes already use visibility/hidden/reduced-motion gating and cached resize geometry. Density, speed, opacity and artwork were retained.
- **Will-change:** declarations were audited. The two active Why belts, Beacon and existing parallax hints remain appropriate to their motion. No blanket hints were added, and no stacking contexts were altered solely for a speculative gain.
- **React/contexts:** production removes editor subscriptions; dead scrub state and redundant responsive setup were removed. Scroll-driven transforms remain Motion values. No evidence justified rewriting the entire provider tree or adding memoization everywhere. The remaining initial React mount and forced layout still matter under throttling.
- **Mounting/containment:** Proof remains safely deferred with corrected responsive placeholders. Other below-fold sections were not aggressively delayed where a late mount could cause a new first-scroll stall or compromise measured anchors. No `content-visibility` was applied to sticky, scroll-measured or Beacon anchor containers.
- **Fonts/media:** the full variable Roboto Flex TTF and existing approved font faces remain. The small older WOFF2 file was not proven equivalent across glyphs/axes, so it was not substituted. Exact video quality was retained. Proof dimensions, CTA picture sources, crop and reserve geometry were checked.
- **Remaining targets:** normal tests have occasional long frame gaps; 4× CPU still has startup/scroll stalls; mobile LCP remains late. Further work needs physical-device and deployment-network measurements, then a narrowly isolated remaining cost. No individual visual effect has been conclusively identified as the sole remaining bottleneck.

## 15. Visual quality deliberately retained

No glass strength, blur, shadow, glow, grain, node/star density, Why mask, service illustration, font, image crop, hero video resolution or animation timing was lowered to improve a score. Approved visible word-filter and scene reveal effects remain even where they cannot be fully composited. Any future visual tradeoff should be assessed separately from this pass.

## 16. Files changed and evidence

- [src/components/NearMount.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/NearMount.tsx)
- [src/components/hero/DirectHero.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/hero/DirectHero.tsx)
- [src/components/hero/HandReachLottie.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/hero/HandReachLottie.tsx)
- [src/components/hero/HeroKineticText.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/hero/HeroKineticText.tsx)
- [src/components/nav/DirectNav.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/nav/DirectNav.tsx)
- [src/components/nav/TubelightNav.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/nav/TubelightNav.tsx)
- [src/components/sections/HowItWorksSection.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/HowItWorksSection.tsx)
- [src/components/sections/PageSections.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/PageSections.tsx)
- [src/components/sections/ReachBeacon.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/ReachBeacon.tsx)
- [src/components/sections/SectionFocus.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/SectionFocus.tsx)
- [src/components/sections/ServicesStarField.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/ServicesStarField.tsx)
- [src/components/sections/WhyComparisonMatrix.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/WhyComparisonMatrix.tsx)
- [src/components/sections/WhyFeatureStage.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/sections/WhyFeatureStage.tsx)
- [src/components/services-cards/scenes/SceneAds.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/services-cards/scenes/SceneAds.tsx)
- [src/components/services-cards/scenes/SceneCreative.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/services-cards/scenes/SceneCreative.tsx)
- [src/components/services-cards/tuners/persistTuners.ts](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/services-cards/tuners/persistTuners.ts)
- [src/components/ui/depth-flip-text.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/ui/depth-flip-text.tsx)
- [src/components/ui/image-fan-carousel.tsx](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/components/ui/image-fan-carousel.tsx)
- [vite.config.ts](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/vite.config.ts)
- [.gitignore](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/.gitignore)
- [public/products/MR-headphones.lossless.webp](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/public/products/MR-headphones.lossless.webp)
- [public/products/camerarig.lossless.webp](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/public/products/camerarig.lossless.webp)
- [public/products/gooey-mrsmooth.lossless.webp](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/public/products/gooey-mrsmooth.lossless.webp)
- [scripts/encode-service-images.py](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/scripts/encode-service-images.py)
- [src/lib/productionTuners.ts](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/lib/productionTuners.ts)
- [src/lib/serviceImages.ts](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/src/lib/serviceImages.ts)
- [PERFORMANCE-PASS.md](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/PERFORMANCE-PASS.md)

The lossless encoder uses Pillow and verifies decoded pixel identity. It is a regeneration helper, not a runtime dependency. PNG originals remain editable in public; the build hook excludes these three replaced masters from generated output. `_perf` and old checkpoints are ignored to keep generated diagnostics and recovery artifacts out of source commits.

Local test helpers, frozen build, screenshots, traces and JSON evidence are retained under [the performance directory](C:/Users/hitso/Projects/mcclure-realty-overhaul/home-lab/_perf). They are ignored by Git and are not deployed application code. This pass did not add production debug exports or browser measurement loops.

Reproduction commands from home-lab: `npm run build`; `npm run preview -- --host 127.0.0.1 --port 4173`; `node _perf/profile.cjs final 1440 900 1`; repeat at `393 852 1`, `430 932 1`, and `1440 900 4`; `node _perf/summarize.cjs`. Chrome and Playwright paths in the local helpers are specific to this workstation.

Engineering references used: [Motion visibility gating](https://motion.dev/docs/react-use-in-view), [layout batching and forced layout](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing), [GSAP lifecycle documentation](https://gsap.com/docs/v3/), and [Chromium's selector-stat tracing implementation](https://chromium.googlesource.com/devtools/devtools-frontend/+/refs/heads/main/front_end/panels/timeline/TimelineController.ts).

No deployment or migration into V3 was performed.
