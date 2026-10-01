# Hero video background

## Desktop
- File: `v3/public/Hero-zachsitting-handbrake.mp4` (4K60 HandBrake, byte-copied, never re-encode)
- Poster: `v3/public/video/Hero-zachsitting-poster.jpg` (frame 1)
- Served as `/Hero-zachsitting-handbrake.mp4`

## Mobile (phones only, max-width 767)
- File: `v3/public/video/Hero-mobile-handbrake.mp4` (byte-copied from Zach HandBrake export `Hero_Mobile_convertedhandbrake.mp4`)
- Poster: `v3/public/video/Hero-mobile-poster.jpg` (frame 1)
- Served as `/video/Hero-mobile-handbrake.mp4`
- Crop: `object-position: center top` so the black sky holds copy; laptops/iPhone sit lower

## Behavior (both)
- Poster paints instantly (no black flash while decoding)
- MatchMedia swaps src; only one file loads for the current viewport
- Pause when hero scrolls mostly off-screen (IntersectionObserver ~15%)
- Pause when tab is hidden
- Reduced-motion: poster only, no play
- Leva: `heroVideoOffsetYDesktop` / `heroVideoOffsetYMobile` / overlay

## Do not
- Re-encode these HandBrake files unless Zachary asks
- Push video to GitHub unless he says so
