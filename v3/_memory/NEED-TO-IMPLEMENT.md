# Need to implement (standing queue)

Do not start these until Zachary asks.

## Capabilities / Web Development (ACTIVE)

Page order right now:
1. Hero (Tiempos + StretchText trial on "Development" + Maximus **Reach**)
2. Mobile-first + phones
3. Before/after showcase
4. Sticky process (brief → structure → polish) — media left, text right
5. Testimonials (horizontal rail + featured) + submit form → Supabase
6. CTA

### StretchText
- Per-letter wdth (Roboto Flex default, Mona Sans option). NHG cannot stretch for real.
- Leva folder "Headline stretch" on Web Dev page only. Do not use on homepage yet.
- See `SESSION-2026-09-19.md`.

### Ads + Creative pages (built 2026-09-19, first pass)
- Swap Unsplash placeholders for real work.
- Wire "Plan my campaign" / "Start a piece" to /start with a preselected service later.

### Testimonials submit
- Migration `009_testimonial_submissions.sql` — run in Supabase
- Portal admin: Testimonial inbox panel
- Form asks: name (req), company (opt), quote (req), email (opt)

### Magnetic cursor
- Outline hover (not filled square). Elements do not translate (no text shift).
- `data-magnetic` on label spans only in accordion

### Perf
- Showcase RAF pauses when off-screen
- Phone rise uses opacity/y only (no CSS blur filter)
- Magnetic pullElements=false

### Creative Studio later
- scroll-morph-hero

### Homepage bugs (do not touch homepage in this pass)
- grain, scroll BG colors, hard hero blend

---

## Start page — After Effects loops (REMEMBER)

Zachary needs to make in Adobe After Effects:

**Quick ~5 second looping animations** for the Start page (top + middle):

1. Phone ringing icon animates in
2. Two heads talking
3. Hands shaking
4. Chart / graph going up
5. Then loops

Each beat should feel smooth. Export for web (Lottie or short MP4/WebM — decide at wrap-up). Put on Start page hero area and mid-page.

---

## Open bugs (homepage — fix later, not now)
1. Grain still not visible on homepage scroll BG
2. Page scroll BG colors may not apply (sticky localStorage / Leva)
3. Hard line hero → sections — blend experiments reverted; redo without touching hero video

## Other components to wire later

| Item | Link | Where |
|---|---|---|
| Safari browser frame | https://21st.dev/@dillionverma/components/safari | FAQ hover / mock frames |
| Image hover reveal | https://21st.dev/@saurabh-2607/components/great-ui-image-hover-reveal | Web showcase (already wired) |
| Scroll morph hero | https://21st.dev/@prashantsom75/components/scroll-morph-hero | **Creative Studio page** |
| Magnetic cursor | https://21st.dev/@jahed/components/magnetic-cursor | Web Dev page (wired) |
| Phone mockups | https://21st.dev/@solaceui/components/phone-mockups-1 | Web Dev mobile-first (adapted) |
| Compare slider | https://21st.dev/@diceui/components/compare-slider | Backup before/after |

## FAQ idea
- Hover FAQ words → Safari browser window preview (`dillionverma/safari`).

## Hero / AE (still)
- Remake mobile hero AE if uneven
- Final AE with 3D objects animating up after intro
- Never re-encode hero video without asking
- **Start page AE icon loop** (phone → talk → handshake → chart) — see above
