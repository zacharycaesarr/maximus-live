# Final home-lab homepage migration into v3

The approved home-lab homepage is now the sole v3 home route. The migration uses source, styles, configuration, and required assets, not a copied dist folder. The approved design was preserved. Other v3 pages retain their existing implementations and ongoing Web Development work.

## Checkpoints and local addresses

- Final approved home-lab checkpoint: `fa08225`, `checkpoint: final approved optimized homepage before v3 migration`.
- Pre-migration v3 checkpoint: `8883c6c`, `checkpoint: v3 before final homepage replacement`.
- Final v3 checkpoint is created after this report with message `checkpoint: v3 with final optimized homepage`. Obtain its hash with `git log -1 --format=%h -- v3` from the repository root, or use the completion message in this chat.
- Approved unchanged reference: http://127.0.0.1:4173/.
- Verified normal v3 development address: http://localhost:5175/.
- Verified final v3 production preview: http://127.0.0.1:4175/.

No home-lab files were changed after its final checkpoint. No existing checkpoint was rewritten. The final v3 checkpoint snapshots the current v3 state, including preserved work from the other session. No live hosting deployment was performed by this migration.

## Homepage implementation

`src/pages/HomePage.tsx` contains the approved home provider tree and homepage. `src/App.tsx` has one `/` route; its former inline homepage was removed. The route URLs for service pages, About, Start, legal pages, work mockups, and Portal are preserved. The new navigation links lead to real v3 routes.

Migrated components include the Hero and intro, Services cards and stars, Proof and lazy showcase, Dog Guard media/logo, dark-green How It Works, all five Why panels and mobile controls, testimonials, static-bold FAQ, Reach Beacon, responsive CTA artwork, footer, cream nodes, grain, and reveals.

The Dog Guard logo remains in the same white client-logo container, with the approved 44px sizing, 6px padding, and 12px radius. FAQ hover previews remain removed, and the emphasized words retain their original bold treatment and accordion behavior.

How It Works retains the approved `#142117` dark stage and unchanged cream cards. Beacon timing retains mobile lead 80, desktop lead 360, lead end 0.44, start 0.96, fade-before 12, and fade length 50. Destination coordinates, offsets, appearance, and artwork are unchanged from the final approved lab.

## Shared files merged and shared implementations isolated

The routing file, global stylesheet, HTML entry, Vite config, and ignore file were merged for v3 rather than replacing v3 with the lab app. Existing favicon, title, viewport, route URLs, and dependency versions are preserved. The existing remote font stylesheet is loaded when a non-home route opens, keeping it out of the homepage critical path. Approved homepage fonts remain local.

Homepage tuner imports use `@home-leva`, mapped to the approved production stub in builds and real Leva in development. Other pages continue using their existing real Leva implementation in deferred route chunks. Non-home navigation and Portal were wrapped in deferred route modules without replacing their content or authentication components.

The following shared modules retain their original v3 implementations for other pages. Their approved homepage versions live below `src/home/`, and homepage imports point there:

- `src/components/SmoothScroll.tsx`
- `src/components/brand/BrandInline.tsx`
- `src/components/nav/DirectNav.tsx`
- `src/components/nav/TubelightNav.tsx`
- `src/components/sections/SiteFooter.tsx`
- `src/components/ui/StretchText.tsx`
- `src/context/FooterTunerContext.tsx`
- `src/context/IntroTunerContext.tsx`
- `src/context/LenisTunerContext.tsx`
- `src/context/NavTunerContext.tsx`
- `src/context/ReachTunerContext.tsx`
- `src/lib/footerDefaults.ts`
- `src/lib/introDefaults.ts`
- `src/lib/lenisDefaults.ts`
- `src/lib/levaStore.ts`
- `src/lib/navDefaults.ts`
- `src/lib/reachDefaults.ts`
- `src/work-mockups/build-case-stages.tsx`

Four existing TypeScript errors required minimal shared repairs:

- `src/components/nav/DirectNav.tsx`: accept the Lucide icon type already supplied to the icon prop.
- `src/components/ui/StretchText.tsx`: export the existing props type consumed by WebDevCtaSlab; no runtime change.
- `src/components/ui/magnetic-cursor.tsx`: derive the vector type from the installed vecteur API and use GSAP's valid `overwrite: true` equivalent for the existing overwrite behavior.
- `src/context/WebDevTunerContext.tsx`: read the same legacy `grainOpacity` key through the raw object helper instead of treating it as a current typed field. Same fallback behavior.

No service-page content was replaced to solve build problems.

## Preserved concurrent Web Development work

The migration did not overwrite the other session's ongoing edits to WebDevelopmentPage, WebDevCaseStudies, its CSS, phone mocks, selected-work controls/settings, work mockups, mock metadata, or build-case copy. Homepage Proof's build-case stage uses its isolated approved copy, leaving the service-page version free to change. The service-page hero was compared against the pre-migration build, and current Selected Work edits remained present.

## Production behavior preserved

The approved lazy Proof/showcase and Hand/Lottie loading, production tuner stub, offscreen/document-hidden animation gating, responsive branch separation, Services star lifecycle, lossless service artwork, cached Beacon geometry, passive navigation scroll behavior, desktop-only Why subscriptions, and mobile How branch were migrated from the final lab source. No new polling loop or performance sweep was introduced.

The homepage does not load service route modules, Portal, Supabase, or real Leva at startup. Editable service PNG masters are retained in source; the approved production plugin excludes only their replaced generated copies from dist and ships the lossless WebPs. Required existing identical assets were reused. Only the 11 missing homepage assets listed below were added, at original quality.

## Builds and verification

`npm run build` passed, including TypeScript and the final Vite production build. Existing Lottie eval and large-chunk warnings remain warnings, not errors. The final homepage entry is 752.38kB raw / 243.97kB gzip, compared with 760.57kB raw / 246.48kB gzip in the approved lab. V3's shared CSS is larger because the website also retains its other routes.

Production comparison used isolated Chrome contexts against 4173 and 4175 at desktop 1440x900, mobile 393x852, and mobile 430x932. Section dimensions, spacing, heading typography, card styles, How stage, CTA art direction, Beacon destination, and merge timing matched the approved reference. The preloader, Hero, navigation, all homepage sections, Proof modal, Dog Guard logo, five Why states, FAQ hover/accordion, CTA, Beacon, and footer were checked. No application exceptions or missing local resources were recorded.

Actual mobile touch gestures verified Services swiping and Why swiping at both mobile sizes. Why's number controls were also checked. Mobile Work navigation opened/closed correctly. Resizing to desktop and back removed the inactive Why/How branches rather than running both.

The normal localhost:5175 development homepage rendered the new implementation. A real homepage-to-Start navigation and browser-back round trip returned to exactly one homepage. All observed homepage links target real routes or intended contact/section destinations.

Non-home production route checks passed for Web Development, Ad Management, Creative Studio, About, Start, Privacy, Terms, Portal, Portal login, the unauthenticated dashboard redirect, and a before/after work mockup route. Service hero copy and typography matched the pre-migration baseline. Start form fields were checked without submitting anything. Signed-in Portal transactions/admin interactions were not exercised.

## Short performance comparison against 4173

Production scroll checks at Services, Why, and CTA recorded zero tasks over 50ms in either build at all three sizes. Startup results were close:

- 1440px: largest startup task 212ms in home-lab and 219ms in v3.
- 393px: largest startup task 196ms in home-lab and 203ms in v3.
- 430px: largest startup task 224ms in home-lab and 226ms in v3.

Some measured scripting time increased in the multi-page build, while layout costs remained small and observed frame gaps were generally similar or fewer. This short comparison found approximately preserved scrolling behavior, so no further optimization sweep was undertaken. These are local Chrome results, not a promise of zero lag on every physical device.

Verification evidence, screenshots, route results, source map, and cleanup provenance are retained locally in ignored `.migration/`. The final rebuild also includes the latest preserved Web Development changes. No remaining migration blocker was found. The live site is not published by this local migration; that remains a separate deployment action.

## Migration files added (55)

Paths below are relative to v3. This includes the report, new homepage source, route wrappers, isolated shared modules, and 11 missing assets. Existing identical assets/components are reused and not counted as additions.

- `HOMEPAGE-MIGRATION.md`
- `public/assets/mrlogo-smooth-black-01.svg`
- `public/images/cta/maximus-cta-desktop.webp`
- `public/images/cta/maximus-cta-mobile.webp`
- `public/products/MR-headphones.lossless.webp`
- `public/products/camerarig.lossless.webp`
- `public/products/gooey-mrsmooth.lossless.webp`
- `public/proof/dogguard-after.mp4`
- `public/proof/dogguard-before.mp4`
- `public/proof/dogguard-cover.webp`
- `public/proof/dogguard-logo.png`
- `public/proof/dogguard-poster.webp`
- `src/components/NonHomeNavigation.tsx`
- `src/components/sections/WhyFeatureStage.tsx`
- `src/components/sections/WhyFloatLayer.tsx`
- `src/components/sections/WhyTestimonialsVisual.tsx`
- `src/components/sections/WhyVisualTuner.tsx`
- `src/components/sections/closing-scene.css`
- `src/components/sections/why-feature-stage.css`
- `src/components/sections/why-motion-fix.css`
- `src/components/sections/why-premium.css`
- `src/components/sections/why-workspace.css`
- `src/components/ui/brickwork-dashboard.css`
- `src/components/ui/brickwork-dashboard.tsx`
- `src/components/ui/brickwork-preview.css`
- `src/components/ui/brickwork-preview.tsx`
- `src/components/ui/brickwork-symbols.tsx`
- `src/components/ui/dogguard-comparison.css`
- `src/components/ui/dogguard-comparison.tsx`
- `src/components/ui/premiere-pro-mark.tsx`
- `src/home-leva.d.ts`
- `src/home/components/SmoothScroll.tsx`
- `src/home/components/brand/BrandInline.tsx`
- `src/home/components/nav/DirectNav.tsx`
- `src/home/components/nav/TubelightNav.tsx`
- `src/home/components/sections/SiteFooter.tsx`
- `src/home/components/ui/StretchText.tsx`
- `src/home/context/FooterTunerContext.tsx`
- `src/home/context/IntroTunerContext.tsx`
- `src/home/context/LenisTunerContext.tsx`
- `src/home/context/NavTunerContext.tsx`
- `src/home/context/ReachTunerContext.tsx`
- `src/home/lib/footerDefaults.ts`
- `src/home/lib/introDefaults.ts`
- `src/home/lib/lenisDefaults.ts`
- `src/home/lib/levaStore.ts`
- `src/home/lib/navDefaults.ts`
- `src/home/lib/reachDefaults.ts`
- `src/home/work-mockups/build-case-stages.tsx`
- `src/lib/brickworkProof.ts`
- `src/lib/productionTuners.ts`
- `src/lib/serviceImages.ts`
- `src/lib/whyTestimonial.ts`
- `src/pages/HomePage.tsx`
- `src/portal/PortalRoutes.tsx`

## Migration files replaced or merged (61)

These are existing files changed by this migration, including the four minimal build repairs. Files changed only by the concurrent service-page session are intentionally excluded from this inventory.

- `.gitignore`
- `index.html`
- `src/App.tsx`
- `src/components/NearMount.tsx`
- `src/components/hero/ApertureIntro.tsx`
- `src/components/hero/BrandPreloader.tsx`
- `src/components/hero/DirectHero.tsx`
- `src/components/hero/HandReachLottie.tsx`
- `src/components/hero/HeroKineticText.tsx`
- `src/components/hero/HeroVideoBackground.tsx`
- `src/components/nav/DirectNav.tsx`
- `src/components/sections/CreamNodeLayer.tsx`
- `src/components/sections/HowItWorksSection.tsx`
- `src/components/sections/MotionGetStarted.tsx`
- `src/components/sections/PageScrollGradient.tsx`
- `src/components/sections/PageSections.tsx`
- `src/components/sections/ReachBeacon.tsx`
- `src/components/sections/SectionFocus.tsx`
- `src/components/sections/ServicesOverviewCards.tsx`
- `src/components/sections/ServicesStarField.tsx`
- `src/components/sections/WhyComparisonMatrix.tsx`
- `src/components/services-cards/ServiceCard.tsx`
- `src/components/services-cards/parts/MiniAnalytics.tsx`
- `src/components/services-cards/parts/MiniBrowser.tsx`
- `src/components/services-cards/parts/ToolRail.tsx`
- `src/components/services-cards/scenes/AdsAnimatedCard.tsx`
- `src/components/services-cards/scenes/CreativeAnimatedCard.tsx`
- `src/components/services-cards/scenes/SceneAds.tsx`
- `src/components/services-cards/scenes/SceneCreative.tsx`
- `src/components/services-cards/scenes/SceneWeb.tsx`
- `src/components/services-cards/scenes/WebAnimatedCard.tsx`
- `src/components/services-cards/styles/layout.css`
- `src/components/services-cards/tuners/AdsTuners.tsx`
- `src/components/services-cards/tuners/CreativeTuners.tsx`
- `src/components/services-cards/tuners/LabTuners.tsx`
- `src/components/services-cards/tuners/WebDetailControls.ts`
- `src/components/services-cards/tuners/persistTuners.ts`
- `src/components/ui/StretchText.tsx`
- `src/components/ui/depth-flip-text.tsx`
- `src/components/ui/image-fan-carousel.tsx`
- `src/components/ui/magnetic-cursor.tsx`
- `src/components/ui/proof-showcase-modal.tsx`
- `src/components/ui/tech-stack-pill.tsx`
- `src/context/BgTunerContext.tsx`
- `src/context/FaqTunerContext.tsx`
- `src/context/HeroLayoutTunerContext.tsx`
- `src/context/HeroTextTunerContext.tsx`
- `src/context/HomeColorsTunerContext.tsx`
- `src/context/HomeLevaStoreContext.tsx`
- `src/context/HowItWorksTunerContext.tsx`
- `src/context/LayoutModeContext.tsx`
- `src/context/PageScrollBgTunerContext.tsx`
- `src/context/ProofTunerContext.tsx`
- `src/context/ServicesOverviewTunerContext.tsx`
- `src/context/WebDevTunerContext.tsx`
- `src/index.css`
- `src/lib/faqRichAnswers.tsx`
- `src/lib/homeColorsDefaults.ts`
- `src/lib/pageScrollBgDefaults.ts`
- `src/lib/proofDefaults.ts`
- `vite.config.ts`

## Proven unused former homepage files removed (5)

The original home dependency graph was compared with the new route graph, then all source imports were scanned to ensure these files had no remaining consumers. Shared/service components were retained.

- `src/components/hero/SideVisualPlaceholder.tsx`
- `src/components/sections/CtaAtmosphere.tsx`
- `src/components/ui/animated-card.tsx`
- `src/components/ui/faq-hover-previews.tsx`
- `src/components/ui/link-preview.tsx`

The former inline homepage in App was also removed. There is one active homepage source of truth.
