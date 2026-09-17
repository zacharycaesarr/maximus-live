# Preloader / first-load experience

**When Zachary says “preloader” or “preloading,” he means the cinematic intro brick**, not a generic spinner.

## Live now (v2) — Aperture reveal (Integrated Bio style)

- Cream cover with a **rounded expanding hole** (box-shadow punch — always rounded on mobile/Safari; does **not** clip `#top` or touch the hero video).
- Hole is **viewport-centered** (not mid-document), so it opens from the middle of what you see.
- **Logo hold (~holdMs, default 500)** before the hole expands — first load needs settle time; Leva Replay is already warm so it felt smoother.
- Chrome (typing, nav, CTAs) unlocks mid-aperture; tiny `chromeDelayMs` then slower fades + CTA stagger.
- Session / load gate: module flag + Leva Replay / `?forceIntro=1`.
- Video files and sources are never modified.

Tune: Leva → Preloader (hold ms, fade-in, chrome delay, Replay). Mode is aperture by default.

### Why first load can feel choppy (research note, 2026-09-17)
Replay is smooth because fonts, JS, and the 4K decode are already warm. Cold load fights: video first-frame decode, font swap, main-thread layout, and chrome motion all at once. Industry pattern: poster-first, hold cover until settle (or until `canplay` / first painted frame), then animate. We shipped the half-second logo hold. Optional next if still choppy: unlock chrome only after video reports a frame (requestVideoFrameCallback / canplay), still without touching the AE files.

## ARCHIVED — White Maximus dock intro (v1)

**Status: archived 2026-09-17. Do not mount as the live intro unless Zachary asks to restore.**

### What it was
1. Blank light screen → **MAXIMUS** animates in (center).
2. Short hold (~0.5s, Leva).
3. Smooth scale/position dock into the hero stem “Maximus” (`[data-maximus-anchor]`).
4. Overlay fades; navbar, “I want … to”, buttons, mesh, eyebrow fade in.
5. Demo canvas slides up under CTAs after a Leva delay.

### Code still on disk (do not delete)
- `v3/src/components/hero/BrandPreloader.tsx` — full dock implementation
- Old Leva fields in `introDefaults` (holdMs, dockMs, word, bg, etc.) kept for restore
- Intro mode flag: `introDefaults.mode` — set to `'dock'` to bring it back (see below)

### How to restore later (tell the agent exactly this)
Say: **"Restore the archived white Maximus dock intro from FUTURE-LOADING.md"**

The agent should:
1. Set `defaultIntroTuner.mode` to `'dock'` (or Leva Preloader → mode: dock).
2. Mount `<BrandPreloader />` again in `App.tsx` instead of / beside aperture.
3. Unmount or disable `ApertureIntro` for the homepage.
4. Confirm `data-maximus-anchor` exists on the left-layout Maximus word in `HeroKineticText` (dock needs it).
5. Hard refresh and Replay intro in Leva.

### Known issues when archived (why we moved on)
- Left hero layout had no reliable `data-maximus-anchor`, so dock missed the real word.
- White overlay fade felt laggy over the 4K video.
- Zachary wanted Integrated Bio–style aperture instead.

## Still later
- Optional: residual rounded viewport outline that clears on first scroll (Integrated Bio frame).
- Richer cover art behind the aperture mark.
- Perceived speed: keep hold short; never block longer than necessary.

## Related
- Demo canvas: `FUTURE-DEMO-CANVAS.md`
- Performance: `FUTURE-PERFORMANCE.md`
- Verify: `VERIFY-LOOP.md`
- Mobile-only mode: `WORKING-MODE-MOBILE.md`
