# About reference-motion replacement

October 4, 2026. No checkpoint created for this pass. The approved opening and portrait remain untouched. The page now ends after Creative Studio. The previous biography, wheel, neutral transition, parallax and final CTA implementation have been removed.

## 1. Files changed, created and removed

Modified under `src/components/about/`:
- `AboutContinuation.tsx`
- `AboutDisciplines.tsx`
- `AboutStorySection.tsx`
- `aboutStoryContent.ts`
- `aboutMotionConfig.ts`
- `aboutMotionRuntime.ts`
- `aboutStoryMotion.ts`
- `about-continuation.css`
- `README.md`

Created under `src/components/about/`:
- `AboutStoryVisual.tsx`
- `AboutServiceVisual.tsx`
- `aboutServiceSequence.ts`
- `aboutReadingResize.ts`

Removed under `src/components/about/`:
- `AboutCrumpleTransition.tsx`
- `AboutCTA.tsx`
- `AboutParallaxTransition.tsx`
- `aboutParallaxMotion.ts`
- `AboutDisciplineVisual.tsx`
- `aboutDisciplinesMotion.ts`
- `aboutViewportHandoff.ts`
- `splitting.d.ts`

Dependency manifests: `package.json`, `package-lock.json`.

QA-only artifacts in `docs/about-motion-reference-pass/`: this report, `scope-check.json`, `route-cleanup.json`, `lifecycle-test.html`, `reduced-test.html`, `desktop-story.jpg`, `desktop-services.jpg`, `mobile-story.jpg`, `mobile-story-393.jpg`, `mobile-services.jpg`. The HTML fixtures import the real application/About components, without changing production routes. They are not included in the production build. Source/public hashes were compared to a temporary pre-pass hash list, not a source backup.

## 2. Dependencies

None added or upgraded. Removed the previous About-only `splitting` dependency because GSAP SplitText now owns all new text splitting. All existing installed package versions remain unchanged.

## 3. GSAP version

3.15.0. Existing npm package includes ScrollTrigger, Observer and SplitText.

## 4. Existing Lenis

Lenis 1.3.26 was already installed and is reused.

## 5. Single Lenis instance

The unchanged `src/components/SmoothScroll.tsx` provider, already mounted by the unchanged `src/pages/AboutPage.tsx`, owns the one active About Lenis instance. It exposes `window.__lenis`, drives `lenis.raf(time * 1000)` from the GSAP ticker, forwards scroll to ScrollTrigger.update and removes the ticker on unmount. No second instance or separate animation-frame loop was added.

## 6. Story headline effects

One continuous existing cream `#F3F0E8` canvas and a consistent 69/31 editorial grid. Established Tiempos/Neue Haas typography. Three placeholder copy records live in `aboutStoryContent.ts`.

- Beat 01, effect17 technique: SplitText chars/words, perspective 1000px, randomized rotateX +/-100 degrees and Z +/-180px, opacity 0 to 1, resolving rotation/Z to zero; stagger .02, ease none.
- Beat 02, effect20 technique: chars/words, opacity 0, rotateX 90 degrees, baseline origin 50% 100%; resolves to zero/visible with random .03 stagger and power4.out.
- Beat 03, effect27 technique: words from randomized Z 450-850px, X +/-80%, Y +/-8%, rotateX +/-75 degrees and opacity 0; resolves to zero/visible with random .006 stagger and expo.out. Normal-flow adaptation, no nested Story pin.
- All three paragraphs use effect16-style opacity .1 to 1 with .05 word stagger and a 3 to 0 degree block rotation.
- Paper outlines, timeline playhead and convergence paths share their headline's scroll timeline. No idle loop.

Mechanics studied directly in [Codrops index2.js](https://github.com/codrops/OnScrollTypographyAnimations/blob/main/src/js/index2.js), with the user's requested values and Maximus branding.

## 7. Story ScrollTrigger ranges

- Headline 01: `top bottom` to `bottom top`.
- Headline 02: `center bottom` to `bottom top+=20%`.
- Headline 03: `top 85%` to `center 35%`, adapted to normal flow.
- Every paragraph block: `top bottom` to `top top`.
- Every paragraph's words: `top bottom-=20%` to `center top+=20%`.
- Numeric scrub: .15 throughout.
- Desktop moments: minimum 120svh each. Mobile: minimum 95svh each, expanding for content when necessary. No new Story pins.

## 8. Service Observer configuration

One Observer targets the active service viewport: `wheel,touch,pointer`, tolerance 10, wheelSpeed -1, preventDefault true, allowClicks true. Links and buttons are excluded from interception. onUp advances; onDown reverses. An animation lock plus a 250ms input quiet period prevents burst/double advancement. Pointer press rearms a new gesture. Observer is disabled outside the stage and killed on cleanup.

## 9. Wrapper values

Outer starts at +100 * direction, inner at -100 * direction; both resolve to yPercent 0. The entire visual/content environment enters from +15 * direction and exits toward -15 * direction. Headline characters enter from +150 * direction to zero.

## 10. Duration and easing

Wrapper/environment transition: 1.25 seconds, power1.inOut. Characters: 1 second, power2.out, beginning at .2 seconds. Character stagger may make the complete animation lock longer than the wrapper duration.

## 11. Service SplitText settings

`type: chars,words`, span tags, About-scoped character/word classes, automatic accessible labels. Characters reveal from autoAlpha 0 and yPercent 150 * direction to autoAlpha 1/yPercent 0; random .02 stagger. SplitText wrappers are reverted on teardown.

The opposing wrapper and headline mechanics follow [GreenSock XWzRraJ](https://codepen.io/GreenSock/pen/XWzRraJ). The infinite wrap was intentionally replaced by finite exits.

## 12. Finite exits

Entering from above starts WEB. Forward gestures produce ADS then CREATIVE; one additional gesture disables Observer and crosses the trigger end. Entering from below starts CREATIVE; reverse produces ADS then WEB; one additional gesture disables Observer and crosses above the trigger start. No index wrapping. A small pin boundary of max(80px, 15vh), plus a 2px end runway, provides reversible entry/release even though the page currently ends here.

## 13. Lenis ownership

Stage entry calls the existing Lenis.stop(). Observer controls gestures while active. Both finite exits, Escape and active-stage unmount call Lenis.start(). Neither the Observer controller nor Story destroys or creates Lenis. The existing provider still handles its own route lifecycle.

## 14. Mobile

Same three cream Story moments with the visuals below the copy. Z distance is reduced 35%; no long Story pins. Service slides remain full-screen with the same opposing wrappers and character motion, using simpler peripheral visuals. Forward/reverse pointer swipes and compact typography were checked at 393x852 and 430x932. Resize preserves the Story reading anchor and active service index. Mobile browser-height-only resizing avoids repositioning the reader.

## 15. Reduced motion and accessibility

Story uses unsplit text, opacity .7 to 1 and Y 12px to zero, over `top 90%` to `top 55%`. Services use normal vertical flow, no Observer, no new service pin or wrapper transition, with all three CTAs accessible. This was tested in an isolated fixture emulating the reduced-motion JS and CSS branches at mobile and desktop sizes.

Active services support ArrowDown/PageDown, ArrowUp/PageUp and Escape. Inactive slides are aria-hidden and inert, outgoing focus moves to the stage, CTA focus outlines are visible, and the current service is announced through a live status.

## 16. Build and verification

`npm run build` (TypeScript + Vite) passes. Scoped ESLint passes. Existing Lottie eval and large-chunk warnings remain.

Browser checks covered 1440x900, 1366x768, 393x852 and 430x932, slow wheel steps, fast repeated wheel bursts, reverse entry/exit, simulated trackpad-style bursts, forward/reverse pointer swipes, keyboard controls, resize, CTA navigation and route return. Production smoke checks pass with no captured console errors, no new canvas/video elements and no horizontal overflow. The final 393px first headline fits its 330px content width.

The route harness reports ten About continuation triggers, one Observer and one new pin on About; zero About triggers/Observers/wrappers/pins after visiting each service route. Returning rebuilds one set without duplication and restores Lenis ownership correctly. `route-cleanup.json` contains the captured runtime states.

Source/public hashing confirms only the intended About continuation files changed. AboutPage, approved opening/portrait assets and source, shared code, other pages and all public assets remain byte-identical. No shared route/component was removed. New service visuals are original lightweight SVG placeholders, not final graphics.

Input tests use browser-generated wheel events and pointer drags, not physical trackpad/phone hardware. GPU/FPS and low-end device performance were not profiled. The motion settings closely follow the references; perceived identity still requires the user's visual review.

## 17. Preview

[About preview](http://localhost:5175/about). Production build was also smoke-tested at http://127.0.0.1:4175/about.
