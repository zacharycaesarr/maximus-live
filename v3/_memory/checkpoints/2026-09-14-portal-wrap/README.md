# Checkpoint — portal wrap-up (2026-09-14)

Overwrites older checkpoint `2026-09-10-footers-hiw-hand` as the standing save point.

## Snapshot
Portal is in “almost final” shape for showcase (not public live):

- Billing: controlled card fields → dots track every digit; ACH; PayPal on Fees; Venmo/Cash App no fees
- Overview: package-filtered sections + icons + cycle labels + optional video ring
- Onboard: roster-only, **no email sent**
- Light mode CTA remaps + grain background
- Stripe modal brand matches header (Maximus Reach × wordmark)
- Leva: Pay card glow pad / X / Y

## Must-run SQL
1. `supabase/migrations/007_client_packages_onboard.sql`
2. `supabase/migrations/008_video_progress_visible.sql`

## Key paths
- `src/portal/billing/StripePayPanel.tsx`
- `src/portal/billing/FlippableCreditCard.tsx`
- `src/portal/dashboard/tabs/OverviewTab.tsx`
- `src/portal/admin/AdminOnboardPanel.tsx`
- `src/portal/portal.css`

## Not live yet
Do not push until Zachary says so. Stripe Developers toolbar only appears with test keys.
