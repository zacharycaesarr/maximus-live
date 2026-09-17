# Shared: Cal.com booking (portal + marketing site)

**Read this in the Website V3 hero chat** before placing booking on homepage or other pages.

## What exists
- Link: `zachary-maximus-ambrcs/booking` (`https://cal.com/zachary-maximus-ambrcs/booking`)
- Package: `@calcom/embed-react` (already in `v3/package.json`)
- Shared button: `src/components/BookCallButton.tsx` (popup with back-to-date)
- Constants: `src/portal/lib/calConfig.ts` (or move later if marketing prefers `src/lib/calConfig.ts`)
- Portal Support tab also has a full-width inline month embed

## How to use on homepage / another page
1. Import `BookCallButton` and drop it on any CTA (hero, contact, footer). Do **not** invent a second Cal link.
2. Prefer **popup button** on marketing pages (cleaner; date/time back nav works).
3. Inline embed only if a dedicated Booking page needs the full calendar in-page (use month view, ~720px height, no `overflow: hidden` parent that clips scroll).

## Example
```tsx
import BookCallButton from '@/components/BookCallButton'

<BookCallButton className="…your CTA styles…">
  Book a call
</BookCallButton>
```

## Do not
- Hardcode a different cal.com username
- Put Meta/Stripe secrets in marketing pages
- Force a homepage placement until Zachary picks the spot

## Status
Portal Phase 9 done. Marketing placement = when Zachary asks in the hero/site chat.
