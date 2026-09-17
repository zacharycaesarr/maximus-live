# Session notes (current)

Updated 2026-09-14 (Overview + packages onboard).

## Done
- Tab Growth → Overview (`overview` id)
- SQL 007: packages, cycle_start/end, web_phase, web_launch_date, package_order
- `packagePresets.ts` + OverviewTab (collapsible ads/website/video)
- AdminOnboardPanel + roster package pills + metrics package editor
- `ADS-CONNECT-RESEARCH.md` (Meta system user + Google refresh path)

## Zachary leftover
1. **Must run SQL:** paste `v3/supabase/migrations/007_client_packages_onboard.sql` in Supabase → SQL Editor → Run
2. Test onboard: Admin → Onboard client → email of existing row OR new invite → packages + cycle dates → Save onboard
3. Open that client → View as client → Overview: sections match packages; ads ring shows cycle end when set
4. Edit packages / reorder / web phase → Save account → dashboard updates live
5. Prior pay leftovers (if not done): redeploy `create-payment-intent`, ACH test, footer Leva if needed
