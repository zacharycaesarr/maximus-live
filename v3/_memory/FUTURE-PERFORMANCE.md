# Priority: performance / speed

**Big priority:** Maximus Reach V3 must feel **very fast** — efficient load, no lag, great UX on mobile first.

As we add elements (Lottie, 3D surfers, Lenis, fonts):

1. Prefer local assets over huge CDNs where possible; lazy-load below-fold / hover-only media.
2. Keep Lottie vector/light; avoid 4K rasters inside JSON.
3. Code-split heavy UI (surfer, hand) with dynamic import when it grows.
4. One font family primary (NHG); extra faces (Druk) only when shown.
5. Measure: Lighthouse / Web Vitals on mid-tier phone before polish passes.
6. Do not stack full-page scroll hijacks that fight Lenis.

Do not sacrifice this for decorative density.

---

## Standing reminder: full deep optimization (later)

**Status:** Deferred until the whole site is content-complete and Zachary says we are done editing.
**Also see:** `FINAL-WRAPUP-BEFORE-LIVE.md` → Optimize before live → Zero mini-freezes.

**Do not skip this.** Even if chat context is gone, every future agent must see this before calling V3 “finished.”

When we unlock this pass:

1. Audit load lag on first paint (hero mesh, Lottie, Lenis, Leva, fonts).
2. Lazy-load below-fold sections and heavy media.
3. Kill unused imports / dead components / duplicate listeners.
4. Re-check Chrome vs Comet vs Safari for scroll, hover, and layout parity.
5. Phone-first Lighthouse / Web Vitals pass; fix anything that feels sticky or surprise-janky.
6. Confirm no horizontal overflow and no click-blocking overlays remain.
7. **Zero scroll hitching:** eliminate stacked permanent rAFs (mesh + grain + showcase + Lenis/GSAP), dual-mounted carousels/canvases, and scroll-linked blur filters. Target: no perceptible freezes on Web Dev or Ads while scrolling.

### Early wins already started (2026-09-22)

- Mesh motion default **off** on Web Dev.
- Ads grain default lowered (~45).
- Phone carousel: single mount (desktop OR mobile), dental start, before DOM lazy on peek, autoplay waits for in-view.
- Showcase strip rAF pauses offscreen; CTA slab glow no longer scroll-linked.

Until then: ship bricks cleanly, avoid new lag, but do not run the full optimization sweep early.
