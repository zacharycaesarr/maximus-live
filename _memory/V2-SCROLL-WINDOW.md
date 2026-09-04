# V2 scroll window plan

  Read `_memory/V2-SCROLL-STATUS.md` before any scroll window work.

## Load behavior

Scroll progress `0` = identical to pre-scroll hero. No chrome, no frame, full viewport cream hero.

## Scroll behavior

1. User scrolls → chrome grows, hero shrinks into window, dark bg fades in
2. **Hold zone** (`transitionEnd` → `holdEnd`): window + title + dock locked so user can read
3. Continue scroll → into Z-pattern section below
4. Scroll up → full reverse

## Leva folder: Scroll Window

- **Chrome bg top / bottom** — tune browser bar against dark page
- **Transition ends @ / Hold ends @** — timing of reveal and pause
- **OverheadTitle** — gradient, offset, text

## Still TODO

- Pixel-perfect Safari/Chrome SVG chrome (optional reference from Zachary)
- Mobile scroll window layout
- More Z-pattern blocks (right, left, right…)
- GSAP ScrollTrigger (optional upgrade from sticky + framer)
