# About: Signal opening and portrait handoff

## October 5 Shaders on Scroll experiment (current)

Restore checkpoint: `98596499b07c6b79424bfea79c22576d0a0c623b`. The approved opening/portrait and service transition engine are unchanged. The former Story/bridge components, SplitText effects, SVG studies and their CSS were removed. The middle now uses `AboutShaderStory.tsx`, a scoped source-faithful port of Faboolea's Shaders on Scroll. Both original GLSL files are byte-identical; geometry remains `IcosahedronGeometry(1, 64)`, with the original camera, additive wireframe material, uniforms, colors, font kit and three-stage layout.

Three.js 0.186.1 was added with TypeScript declarations; existing GSAP 3.15.0 and Lenis are retained. One section-local .05 interpolation moves only the new content and its shader progress. No second global scroll engine/body-height override exists. The brief's continuous direct uniform interpolation replaces the source's rounded progress and 6.6-second uniform tweens. Renderer work pauses offscreen/when hidden, and all resources dispose on unmount. Static fallback is provided for reduced motion or unavailable WebGL.

Production build and scoped ESLint pass. Desktop/live-reference comparison, mobile scale, source shader checksums, service entry/finite exit, mobile forward/reverse swipes, route cleanup and fallback checks are documented in [the shader experiment report](../../../docs/about-shader-source-pass/report.md). This is the uncustomized reference experiment; stop here for visual review.

## October 5 original Codrops Set 2 source port (superseded)

No checkpoint was created. The supplied `Downloads/OnScrollTypographyAnimations-main` repository was inspected directly (`src/index2.html`, `src/js/index2.js`, `src/css/base.css`). The previous custom Story animation module and its configuration were removed. Story now uses actual effect17, effect20 and effect27; paragraphs use effect16. The new short Section 04 bridge uses effect28's original character-distance calculation. Section 05 retains the approved Web / Ads / Creative transition engine and replaceable placeholder visuals.

Desktop preserves source perspective, random ranges, easing, stagger, scrub and scroll ranges. Mobile scales effect17/effect27 Z depth to 65% and shortens effect27 pin travel to 75% of the viewport. SplitText supplies the source's word/character grouping using existing dependencies. Scoped contexts restore DOM and release pins/triggers on route exit. One setup frame runs after the existing route scroll reset; there is no new animation clock or smoother.

Opening, portrait, page entry, shared source, other routes, public assets and dependency manifests remain byte-identical. The approved `aboutServiceSequence.ts` engine is unchanged. Production build and scoped ESLint pass. Runtime checks cover 1440x900, 1366x768, 393x852, 430x932, reduced motion, responsive reading position, route teardown/re-entry, service keyboard/wheel input, forward/reverse pointer swipes and finite exits. See [the source-port report](../../../docs/about-codrops-source-pass/report.md) for the exact source values, file manifest, adaptations and evidence.

## October 4 Codrops / Observer replacement (superseded Story mechanics)

The remainder build documented below is superseded. No checkpoint was created for this pass, as requested. Only the post-portrait continuation was replaced: three normal-flow Story moments on one continuous cream canvas, then the finite WEB / ADS / CREATIVE Observer sequence. Opening, portrait, navigation, shared source and public assets are byte-identical to the start of this pass. No final CTA, crumple or parallax transition is mounted.

GSAP 3.15.0 and Lenis 1.3.26 are reused. The unused Splitting dependency was removed; no dependency was added or upgraded. About continues using the unchanged SmoothScroll provider and its single GSAP-ticker-driven Lenis instance. SplitText, Observer and ScrollTrigger are registered by the About runtime; all continuation resources revert on route exit.

The complete 17-item implementation report, file manifest and testing limits are in [the reference-pass report](../../../docs/about-motion-reference-pass/report.md). Browser QA covers the four requested dimensions, wheel bursts, forward/reverse pointer swipes, keyboard controls, finite exits, resize preservation, route cleanup and reduced motion. TypeScript/Vite production build and scoped ESLint pass. These checks do not claim physical trackpad or phone hardware profiling.

## October 4 remainder build

Recovery checkpoint: `_archive/about-page-2026-10-04-before-remainder-build/`. It includes the pre-build About source/assets, dependency manifests, supplied brief, and source/public hashes. The approved opening and portrait now hand off into the authorized continuation. Their images, type, masks, beacon, stat values/design, side icons and layout remain unchanged. Twelve before/after opening/card/portrait comparisons across 1440x900, 1366x768, 393x852 and 430x932 pass. The portrait icon SVGs were extracted into `AboutDisciplineIcon.tsx` without changing their geometry or root attributes, so the new service wheel uses the exact approved icons.

### Runtime and scope

GSAP 3.15, Lenis 1.3.26 and existing Framer Motion were already installed. Only `splitting@1.1.0` was added; existing dependency versions were not upgraded. About mounts the existing, unchanged `src/components/SmoothScroll.tsx` provider. Its ONE active Lenis instance belongs to the About route, not a new app-wide provider. It calls `lenis.raf(time * 1000)` from the existing GSAP ticker, forwards Lenis scroll events to `ScrollTrigger.update`, uses `lagSmoothing(0)` and removes its ticker/destroys Lenis on route exit. No second smoother or independent RAF loop was added. Shared provider source and unrelated routes remain untouched.

`AboutContinuation.tsx` waits for fonts once, splits only the new biography's `[data-splitting]` nodes, then owns `gsap.context()` and `gsap.matchMedia()` cleanup. It restores the original unsplit DOM on unmount. Desktop has three new ScrollTriggers: biography, parallax and services, with only biography/services pinned. Mobile has nine lightweight triggers and no new pins. `aboutViewportHandoff.ts` preserves the nearest reading moment across resizing and breakpoint changes, using cached section spans, a passive numeric scroll listener and one bounded resize task. Layout is measured on refresh/resize, never every scrub frame. Its listeners/task are removed on unmount.

### Story and typography

The new cream uses the existing brand value #F3F0E8, with established Tiempos / Neue Haas typography. Copy is centralized in `aboutStoryContent.ts`; motion tuning is in `aboutMotionConfig.ts`. One continuous story canvas contains the opening title, intro and three desktop story beats. A single master timeline starts at `top top`, ends at `+=innerHeight * 3.5` (350vh of pin travel), scrubs at .8 and pins only the staging wrapper. Persistent title, ghosted prior lines, rules, registration marks and original line art tie the changing reading zone together.

The Ideas title uses controlled character depth: perspective 1200px, rotateX up to +/-48deg, Z up to +/-110px, opacity resolve and .018 stagger (effect17 technique). Beat 01 uses readable word opacity .16 to 1, with a 1.5deg to 0 block rotation and .012 stagger (effect16). Beat 02 builds headline characters from scaleY 0 to 1 at the baseline with center staggering, plus opposing +/-20% reveal wrappers (effect25/26 and continuous-reveal techniques). Beat 03 converges words from Z 180-380px, X +/-28%, Y +/-6%, rotateX +/-20deg and opacity 0 to settled readable type (effect27). It stays in the same master timeline, with no nested pin, Observer interception or slide-navigation gestures.

### Parallax and disciplines

Four original editorial layers share one linear parallax timeline. Desktop yPercent ranges are 48 to -12, 33 to -26, 19 to -24 and 7 to -112. The cream plane leaves to reveal existing green #142117. The section is 240svh with a 100svh CSS-sticky stage, start `top top`, end `bottom bottom` (140vh of travel), scrub .8. The end keeps the viewport on the stage through the entire transition. Mobile is a normal-flow 65svh transition with only +20 to -20px layer movement and .35 scrub. No copied Osmo assets, video, canvas or WebGL.

Creative / Web / Ads share one vertical 3D wheel timeline, start `top top`, end `+=innerHeight * 3` (300vh), scrub .8, perspective 1200px. Responsive radius is `clamp(420, innerHeight * .62, 650)`: 558px at 1440x900 and 476.16px at 1366x768. Seats use rotateX angles 0/120/240 with translateZ-equivalent coordinates; the parent resolves through 0/-120/-240 so each discipline centers once. At timeline unit 8.2 the wheel gives way to three editorial recap columns, settled by the .94 threshold. Only nested content transforms; the pinned wrapper stays still. Original service SVG studies are explicitly marked as placeholders in source. They are not finished project imagery.

### Mobile, accessibility and future media

Desktop begins at 769px. At 768px and below the story uses two condensed normal-flow moments (first and last), restrained character/word reveals and 28px Y movement. Services become a simple vertical reading sequence; no rotating wheel, heavy depth field or long pin. Crossing the breakpoint reverts the old context, initializes the correct one and refreshes dimensions while preserving the reading anchor. Reduced motion initializes no new animation triggers, keeps all text readable in normal flow, removes depth/pinning and provides static services plus reachable CTA.

`AboutCrumpleTransition.tsx` is an isolated neutral 12svh desktop / 7svh mobile handoff. No actual crumple or fake paper physics exists. Its discriminated media contract accepts video, image sequence or a custom renderer, with an optional adapter and scroll-distance override; a future renderer owns media loading, scrubbing and teardown independently of biography. Placeholder intro, biography/service copy and original service SVG visuals still need editorial/client replacement. The final CTA uses established type/palette/button patterns, links to `/start` and the unchanged existing booking URL; it does not preload the booking widget.

### Changed files and verification

Modified: `src/pages/AboutPage.tsx`, `src/components/about/PortraitDisciplineMarks.tsx`, this README, `package.json`, `package-lock.json`.

Added under `src/components/about/`: `AboutContinuation.tsx`, `AboutCrumpleTransition.tsx`, `AboutStorySection.tsx`, `AboutParallaxTransition.tsx`, `AboutDisciplines.tsx`, `AboutDisciplineIcon.tsx`, `AboutDisciplineVisual.tsx`, `AboutCTA.tsx`, `aboutStoryContent.ts`, `aboutMotionConfig.ts`, `aboutMotionRuntime.ts`, `aboutStoryMotion.ts`, `aboutParallaxMotion.ts`, `aboutDisciplinesMotion.ts`, `aboutViewportHandoff.ts`, `about-continuation.css`, `splitting.d.ts`. Checkpoint-only scripts, screenshots, reports and hashes are recovery/verification artifacts, not production content.

Verified four requested viewports, typography transforms/readability, service centers/recap, reverse story/parallax/wheel scrolling, no horizontal overflow, responsive context/pin cleanup, preserved resize anchors, route exit/re-entry without abandoned or duplicate triggers, reduced motion, actual wheel scrolling/Lenis synchronization, CTA links and absent new media requests. Protected source and all public assets are byte-identical; source changes outside About are zero. Scoped lint and TypeScript/Vite production build pass. Evidence is in the checkpoint JSON/PNG reports. Animations primarily use transform/opacity; only the parallax ink tone and SVG stroke reveal use small paint changes. No new permanent idle loop, animated blur, per-frame React state or new media dependency. Device-specific GPU/FPS has not been profiled on lower-end hardware; existing app bundle-size/Lottie build warnings remain.

## October 4 final locked portrait state

Recovery checkpoint: `_archive/about-page-2026-10-04-before-final-portrait-lock/`, saved before source changes. The portrait is now the locked endpoint for screenshots and the next paper-crumple transition build. No transition or later section is mounted. Preserve the center portrait, layered title artwork, crop, masks, frame, beacon, card design and desktop geometry during future work unless explicitly authorized.

Desktop right marks now use the three exact supplied 24x24 custom SVGs, including their original path geometry, white strokes, opacity values and acid-green details. Their CSS boxes are 44x44px, with 10px labels WEB DEV / CREATIVE STUDIO / AD MANAGE, an 8px icon-to-label gap and 48px between groups. Original SVG stroke scaling is retained; no additional artwork, panels or glows were added. The existing right column, reveal timing and centered stack placement remain intact. Left ZACHARY and its supporting type are unchanged.

Only the three desktop SVGs idle-animate: WEB moves up to 1.5px vertically over 13s, CREATIVE rotates -1 to +1 degrees over 19s, and AD MANAGE opacity changes .85 to 1 over 15s. Negative delays of 3/9/13 seconds keep them independent. Existing portrait-rest, intersection and document-visibility state pauses the animations, and reduced motion disables them.

The About-only wordmark explicitly uses the existing local `Neue Haas Grotesk Display` family: MAXIMUS keeps Medium 500 (`NeueHaasDisplayMediu.ttf`), REACH keeps Light 300 (`NeueHaasDisplayLight.ttf`). Its size, tracking and weight contrast are preserved. This makes the existing inherited family explicit rather than adding or substituting a font.

Mobile changes only the settled portrait rail: offset moves from -32px to -48px, lifting the complete rail another 16px. Existing .61 to .88 transform timing, entrance stage, footprint, values, labels, typography, portrait and beacon remain intact. The desktop offset remains zero.

Validation: 1440x900, 1366x768, 393x852 and 430x932; twelve opening/card/portrait baseline comparisons; exact SVG attribute comparison against the supplied prompt; local wordmark font and 500/300 weights; offscreen pause; reduced motion; no horizontal overflow, runtime errors, abandoned content or scroll space after the portrait. Scoped ESLint and TypeScript/Vite build pass. Frozen full-viewport PNGs are saved as `portrait-locked-1440x900.png`, `portrait-locked-1366x768.png`, `portrait-locked-393x852.png` and `portrait-locked-430x932.png` in the checkpoint.

Changed About files: `PortraitDisciplineMarks.tsx`, `SignalIntro.tsx`, `signal-intro.css` and this README. All public assets, AboutPage, PortraitHandoff, layout/settings, other pages and shared source remain unchanged from the checkpoint.

## October 3 desktop side refinement

Checkpoint: `_archive/about-page-2026-10-03-before-desktop-disciplines/`. This pass changes only the desktop side areas in Section 02. Center portrait, artwork, crop, layers, beacon, cards, frame geometry, opening, navigation, page endpoint and all mobile rendering remain unchanged.

ZACHARY uses locally hosted Instrument Sans Regular 400, scoped through the unique `About Instrument Sans` font family to `.ab-person-info strong`. The unmodified official variable WOFF2 and SIL Open Font License are in `public/about/fonts/`, downloaded from https://github.com/Instrument/instrument-sans. No production font CDN or dependency was added. Sizing is `clamp(3rem, 3.7vw, 4.8rem)`, line-height .95 and tracking -.035em: 53.28px at 1440x900 and 50.542px at 1366x768. Founder / Maximus Reach and Virginia retain the existing small, muted Neue Haas typography and stay still.

The former next-chapter copy is replaced by `PortraitDisciplineMarks.tsx`, rendering the supplied WEB, CREATIVE and ADS inline SVG geometry. All outlines use currentColor cream and non-scaling 1.5px strokes. Only the tiny browser indicator and creative center dot use acid green. Three 10px tracked labels sit below the marks. Icon boxes use `clamp(72px, 6.1vw, 96px)`, measuring 87.84px and 83.326px at the tested desktop widths, with 32px between each icon/label group. The stack is centered vertically within the existing right side column, without boxes, shadows or backgrounds. Existing desktop side reveal timing is retained.

Only SVG parts idle-animate: WEB moves up to 2px vertically over 13s, its graph moves 1 SVG unit horizontally over 17s, CREATIVE rays rotate from -2 to +2 degrees over 19s while the center stays anchored, and ADS arcs change opacity .65 to 1 over 15s while the megaphone stays still. Negative delays of 3/7/9/13 seconds stagger these alternating CSS animations. Existing portrait-rest, intersection and document-visibility handling controls their play state; reduced motion disables them. No animated blur, animation clock or new visibility hook was added.

Verified desktop at 1440x900 and 1366x768, mobile at 393x852 and 430x932. Twelve baseline comparisons preserve approved center/card geometry and design, opening and mobile states. Separate production checks confirm local font loading, no horizontal overflow or name/portrait collision, anchored icon centers, offscreen pause, reduced motion and absent desktop elements/font requests on mobile. Scoped lint and TypeScript/Vite build pass. Screenshots, comparison data and scope hashes are in the checkpoint.

Changed production files: `SignalIntro.tsx`, `signal-intro.css`, new `PortraitDisciplineMarks.tsx`, the two About-only font/license assets, and this README. All pre-existing source and public assets outside these About files remain byte-for-byte unchanged.

## October 3 final portrait lockdown

Checkpoint: `_archive/about-page-2026-10-03-before-portrait-lockdown/`, created before this pass. The page still ends at the approved portrait. Nothing was built for the planned paper-crumple transition or later sections.

Desktop-only side copy is now ZACHARY / FOUNDER / MAXIMUS REACH / VIRGINIA on the left, and 03 / NEXT / IDEAS DON'T CREATE THEMSELVES / ITERATE / REFINE / TRY AGAIN on the right. ZACHARY uses the existing Neue Haas Grotesk Display Roman 400 face at `clamp(3.2rem, 4vw, 5.2rem)` (57.6px at 1440x900), with -.045em tracking. The right title uses the same face at `clamp(28px, 2.1vw, 38px)` (30.24px at 1440x900), weight 400. Existing side reveal timing and positions remain intact; column widths derive from the available space outside the approved portrait frame.

Only supporting lines idle-animate: Founder rises up to 3px over 13s, Virginia falls up to 2px over 17s, 03 / NEXT rises up to 3px over 15s, and the iteration line falls up to 2px over 19s. Each alternates slowly back to zero. The name and next-section title remain stable. CSS animation runs only after portrait progress exceeds .96, pauses when the existing intersection/document-visibility handling reports the stage inactive, and is disabled for reduced motion. React state tracks only this discrete resting boundary.

All tiny 01/02/03/04 card indices are removed, including their unused opacity hook/style. The acid-green dots remain. Mobile otherwise stays approved: its existing -32px final rail offset is retained with no additional lift, and its images, type, dimensions, colors, layout and animation remain unchanged. Desktop cards and the centerpiece are unchanged.

Changed production source: `SignalIntro.tsx` and `signal-intro.css`, plus this README. AboutPage, PortraitHandoff, layout/settings, public assets, the hand JSON and every other page remain byte-for-byte unchanged from the new checkpoint.

Verified 1440x900, 393x852 and 430x932, including nine opening/card/portrait before-and-after comparisons, normal document ending, no horizontal overflow, reverse scrolling, a fully settled resting state, paused offscreen side motion, reduced motion, scoped lint and the production build. Normal captures contain no developer controls or abandoned content.

Clean source PNGs are in the checkpoint: `portrait-lockdown-1440x900.png`, `portrait-lockdown-393x852.png`, and `portrait-lockdown-430x932.png`. The desktop export is the full 1440x900 viewport, captured after the final state settles and with idle animation temporarily frozen by the screenshot tool. No screenshot or new visual asset was added to the live page. JSON reports and comparison screenshots are alongside the exports.

## October 3 cleanup: approved portrait endpoint

The active About page now ends at Section 02. After Hours, the three biography chapters, optional Creative/Web/Ads explorer, Ideas section, temporary CTA and their portrait-exit/hand transition were removed. Their complete source remains recoverable in `_archive/about-page-2026-10-03-before-portrait-reset/`, saved before cleanup.

The approved Section 01/02 source was restored from `_archive/about-page-2026-10-02-before-after-hours/` without changing portrait assets, typography, masks, beacon, desktop geometry or card design. Original 560svh desktop / 480svh mobile scroll budgets and spring/entrance timing are restored. There is no extra transition scroll height or mounted content after the portrait.

Mobile-only rail adjustment: **-32px**, integrated into the final `cardsY` transform target using the existing .61→.88 timing. The opening card stage stays unchanged; the entire portrait rail finishes 32px higher. Card dimensions, gaps, numbers, labels, fonts, colors and all desktop values are unchanged.

Changed source: `src/pages/AboutPage.tsx`, `src/components/about/SignalIntro.tsx`, `PortraitHandoff.tsx`, this README. Removed About-only files: `AboutHandPlayer.tsx`, `AfterHours.tsx`, `IdeasAndCta.tsx`, `PortraitExit.tsx`, `ServiceExplorer.tsx`, `StoryTuner.tsx`, `aboutStoryConfig.ts`, `usePortraitExit.ts`, `useStoryViewport.ts`, `after-hours.css`. The shared `public/lottie/hand-sketch-reach.json`, hero implementation, existing Lottie dependency and booking helper remain intact. No shared asset/component was removed.

Verification captures and reports are stored in the cleanup checkpoint. Compare the approved opening/card/portrait phases at 1440x900, 393x852 and 430x932. The desktop and opening phases should match, with only a -32px Y delta for the final mobile rail. The document end is the original portrait stage, with no spacer or abandoned sequence.

## Earlier approved refinement notes

Current refinement: October 2, 2026. Desktop keeps the approved portrait/frame geometry and uses the cleaner zcme-transbg-v2.png. Full SVG back artwork and selective complete foreground letters repair the E/C overlap. Desktop card markers are removed and labels use clean UI weight 500. Mobile changes only the title opacity curve. Homepage/shared source, Section 01, beacon behavior and Section 03 are unchanged.

## Recovery and assets

Current checkpoint: `_archive/about-page-2026-10-02-before-title-layering/`. It contains the complete pre-edit About components, page wrapper and About assets, plus hashes of every pre-existing src/public file. The earlier card/SVG checkpoint remains in `_archive/about-page-2026-10-02-before-brutal-svg/`.

`public/about/maximus-reach-title.svg` matches the user's Downloads artwork byte-for-byte (SHA256 EDB8A2A442C0FA48C4151EF4F28AFDE9ECCDC3B12811F6AC94A430DCA61F1DEE). Desktop loads that exact file through SVG image elements; it renders no live MAXIMUS/REACH text. Desktop now uses `public/about/zcme-transbg-v2.png`, copied byte-for-byte from the supplied cleaner image (SHA256 DC510B9E93502E8051492D15E5C32CA40960011C96A312008E015D8FCCD521D3). The superseded desktop PNG is preserved in the checkpoint and removed from production assets. Mobile retains its existing darker portrait and live Tiempos title, masks, blend and movement.

## Brutal Numerals

Values: 120+ Projects completed, 11 Years building, 43 Clients served and 14 Systems launched. The existing development client-count tuner remains available, with 43 as the default.

The four cells retain the original grid, widths/heights, rail position, gaps, entrance/count timing and spring response. Surfaces remain #080909, with a 1px rgba(243,240,232,.16) border and 1px radius. There is no image, gradient, body glow or animated blur. The existing single static grain layer serves the entire portrait and all four cells. Acid green is limited to tiny indicators and the plus.

Numbers use the existing local Neue Haas Grotesk Display Black 900 face. Live SVG text remains editable and uses the normal integer counter. SVG ink bounds are measured after fonts load: a 94%-of-cell nominal type size and a .72 height multiplier make numeral ink 67.68% of each cell's visual height. A separate horizontal transform fits the longer metrics without enlarging cells or shrinking numeral height. Desktop labels now use brand UI Medium 500 without horizontal compression, visibly distinct from the numbers. Mobile labels retain their existing Bold 700 face and fitting. Fluid label sizes and bottom anchoring remain unchanged. Measurement occurs only on mount/font readiness and resize, never on every scroll frame; canvas only measures font ink, with no canvas graphics rendered. Tiny 01/02/03/04 markers are removed on desktop; mobile cards are preserved because this pass limits mobile to opacity only.

At 1440x900, entry cells remain about 290x232px and portrait rail cells about 131x98px. At 393x852, they remain about 79x128px and 79x109px respectively. Final nominal type sizes are about 92px desktop and 103px at this phone size; width fitting is separate. The approximate sizes preceding the Brutal Numerals pass were 87px/90px desktop and 53px/75px mobile (120+ / two-digit values). That pass increased entry nominal type from about 174px to 218px desktop and 53px/75px to 120px mobile, and labels from 12.6px to 13.95px desktop and 11.99px to 12.969px on that phone. The current pass preserves those sizes, uses Medium 500 for desktop labels and retains Bold 700 phone labels.

## Desktop reference composition

The frame remains centered and slightly larger: min(78% of stage width, 88% of available panel height), about 676x768px at 1440x900 compared with 607x768px previously. Card geometry is independent of frame width and remains unchanged.

The supplied SVG retains its exact 1600:910 proportions. A 108%-wide container offset -4% compensates for the artwork's intrinsic side margins, making actual title ink approximately 97.9% of the frame width. Its container begins 7.5% down the frame. No font substitution, path edits or independent horizontal/vertical stretching is used for the desktop title.

The portrait is centered optically at 47.5%, starts 6.5% down the frame and renders at 120% of frame width with its native image aspect ratio. At the main desktop size it grows from about 675px to 811px wide, roughly 20%. The head and curls intersect the title; the face remains detailed. Desktop-only black masks and tonal gradients dissolve the lower neck/shirt. The existing static alpha-edge filter feathers only the original outline, not facial detail.

The back layer renders the complete supplied SVG without holes. The middle layer is the v2 portrait. The front layer selects complete R/E and C/H shapes and intersects them with the portrait PNG's alpha silhouette, so no duplicate front artwork appears outside the portrait. The old foreground crop ended at SVG x=560 and cut through E's arms. The new x=635 boundary lies after the complete E and before A starts; C is restored in front over the right curls/edge. The alpha mask follows the existing portrait/title movement and scale, with its foreground opacity resolving from .80 to .92 of scroll progress. This prevents detached foreground fragments while the layers converge. Both title passes use the exact same cached SVG asset, preserving proportions and placement.

Mobile title opacity now rises monotonically across scroll progress [.63, .73, .84, .94] with values [0, .14, .40, .68]. Its strongest presence occurs after settling behind the portrait, rather than appearing at opacity 1 early and darkening to .24. Reduced motion uses the final .68 value. Mobile asset, title position/scale, portrait blending, cards and layout are unchanged.

Desktop side information adds Zachary, Founder / Maximus Reach and Staunton, Virginia on the left. The right retains 03 / The hours / Next chapter with Process / Obsession / The work behind the work. These remain small and appear only with sufficient side space. The existing 02 / The person chapter label is retained. This remains a continuation cue, not a new Section 03 implementation.

## Validation

TypeScript/Vite build and scoped About ESLint pass. Production preview checks cover 1440x900, 1366x650, 820x1180, 393x852, 430x932 and 320x568, plus a 2560x1440 portrait check. Card dimensions/positions match the pre-edit baseline at entrance and final portrait phases. The desktop portrait phase preserves the completed card typography and surfaces. Numbers/labels fit, there is no horizontal page overflow and no About runtime error is reported.

The current refinement comparison covers 1440x900, 1366x650, 820x1180, 393x852 and 320x568. Desktop portrait geometry, beacon, opening headline, card dimensions and numeral sizing compare unchanged. Mobile checks at .70, .76, .84 and .94 verify increasing title opacity; all other measured mobile styles, geometry, assets and card data match. Generated SVG IDs and development/production URL origins are normalized during comparison. Screenshots and JSON reports live in the current checkpoint directory. Earlier wide-screen/reduced-motion/card checks remain documented in the preceding checkpoint.

The current refinement changes PortraitHandoff.tsx, SignalIntro.tsx, signal-intro.css, this README, and replaces the desktop portrait asset. The page wrapper, shared fonts, SVG artwork, mobile PNG, other source/assets and global motion settings remain unchanged. Nothing was deployed.
