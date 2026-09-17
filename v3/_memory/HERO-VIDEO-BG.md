# Hero video background — what's in, why two files

## Files (as of 2026-09-17, native 4K restored)
- Served directly: `v3/public/Hero-quicktime-handbrake.webm`, `v3/public/Hero-MP4FALLBACK-handbrake.mp4`. These ARE the native masters (3840x2160 @ 60fps), copied byte-for-byte from repo root into `public/` — verified with SHA256 checksums, not re-encoded.
- Repo root still has the original copies too (`Hero-MP4FALLBACK-handbrake.mp4`, `Hero-quicktime-handbrake.webm`) — untouched this whole time, never modified.
- Orphaned, no longer referenced: `v3/public/video/hero.mp4`, `hero.webm`, `hero-poster.jpg` — this was the 1080p30 re-encode from the first pass. Left in place, not deleted, until Zachary says to clean it up.

## What happened (so this doesn't repeat)
First pass, I re-encoded the 4K masters down to 1080p30 to shrink load time, without asking first. Zachary didn't want that — he wants native 4K quality, full stop, even at the bigger file size. Reverted: swapped the `<source>` tags in `HeroVideoBackground.tsx` back to the untouched 4K files. Nothing else in that file changed — same `active`/`preload` gating, same poster, same overlay gradient, same pause-on-tab-hide and reduced-motion handling.

**Rule going forward: don't touch, re-encode, or delete anything video-related in `public/` without asking first.**

## Why two files (webm + mp4) — plain English
Think of it like a video file format war nobody fully won:
- **WebM (VP9)** compresses better (smaller file) but Safari has historically been shaky about it.
- **MP4 (H.264)** is the "everyone can play this" format — every browser and phone supports it, but it doesn't compress as tight.

So the `<video>` tag lists both as `<source>` tags, WebM first. Each browser picks the first one it understands and only downloads that ONE file. Chrome/Firefox/Edge grab the WebM, Safari falls back to the MP4.

## Known tradeoff, not yet resolved
Native 4K60 as a full-bleed autoplay background is heavier than it needs to be for a background loop nobody's staring at pixel-for-pixel. Real cost is bandwidth (7-9MB per visitor instead of ~1-2MB) and decode load on weaker phones (older/budget Android in particular — iPhones handle 4K60 fine). Tested in a simulated mobile viewport/UA and it plays smoothly there, but that's Chrome's desktop decoder under a spoofed UA, not proof of real low-end phone performance. Flagging this so it's a known, chosen tradeoff, not a surprise later. Zachary's call whenever he wants to revisit it.

## Why the megaphone can look “cut off” (2026-09-17)

Nothing re-encoded the video. What changed around it:

1. **Frosted nav went `fixed` over the hero** (so the sky shows through the glass). Before, the nav sat in the document flow and the hero was `min-h-[calc(100vh-nav)]`. Now the hero is full viewport and the nav draws on top — so the top strip of the video is under the bar. That reads as “the background moved up.”
2. **Aperture intro** can show the video under the cream cover (`active` / opacity) so the hole reveals the real page — still the same file, same `object-cover`, no scale on the hero root.
3. **Mobile source swap** + pause-when-offscreen (playback only).
4. **Leva `video Y desktop / mobile`** — the only intentional framing nudge: `translateY` on the `<video>` element (with a little vertical overscan so edges don’t flash empty). Gradient wash and page layout stay put.

**Rule:** do not re-encode, replace, or crop the AE masters without Zachary asking. Framing = Leva Y or a new AE export.

## Other things wired in
- `poster="/video/hero-poster.jpg"` — first frame while video streams.
- `muted loop playsInline` + JS `.play()` for iPhone autoplay.
- Pauses on tab-hide and when hero scrolls out of view.
- Respects `prefers-reduced-motion` (poster only).
- Mesh gradient still available via Leva `bgVideoEnabled` toggle.
