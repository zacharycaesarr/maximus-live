# Preloader / first-load experience

**When Zachary says “preloader” or “preloading,” he means the cinematic intro brick** (`BrandPreloader` + Leva **Preloader**), not a generic spinner.

## Live now (v1)

1. Blank light screen → **MAXIMUS** animates in (center).
2. Short hold (~0.5s, Leva).
3. Smooth scale/position dock into the hero stem “Maximus” (`[data-maximus-anchor]`).
4. Overlay fades; navbar, “I want … to”, buttons, mesh, eyebrow fade in.
5. Demo canvas slides up under CTAs after a Leva delay.

Tune in Leva → **Preloader** (word, font, sizes, hold/dock/fade, ease, Replay). Background art can replace flat `#fafafa` later.

## Still later

- Richer preloader background (art / shader) when Zachary asks.
- Keep intros gated behind preloader finish (already: chrome waits for dock).
- Perceived speed: keep hold short; never block longer than necessary.

## Related

- Demo canvas in-hero: `FUTURE-DEMO-CANVAS.md`
- Standing priority: `FUTURE-PERFORMANCE.md`
- Verify: `VERIFY-LOOP.md`
