# Browser / window parity (standing)

## Why things looked different
1. **Click blocking:** Preloader `preview` left a full-screen overlay (worse in Comet).
2. **Hand:** Absolute coords relative to hero + parallax parents = wrong place on resize. Fix: fixed + body portal + button `getBoundingClientRect` every frame.
3. **Lenis on Chrome:** `overflow-x: hidden` on `html` + native `scroll-behavior` fought Lenis. Fix: `overflow-x: clip`, force `scroll-behavior: auto`, drive Lenis from `gsap.ticker` + `ScrollTrigger.update`.
4. **Section transforms:** `SectionFocus` x/scale can widen layout; keep offsets modest + overflow clip.
5. **Proof modal:** `position: fixed` inside a transformed ancestor was not viewport-fixed. Fix: portal to `document.body`.

## Rule
Same desktop layout across Chrome, Comet, Edge, Safari. Mobile is the only intentional layout fork. If something only works in Cursor’s browser, it is not done.
