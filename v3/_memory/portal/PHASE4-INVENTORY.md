# Phase 4 inventory (dashboard visuals shell)

Shipped under `src/portal/dashboard/`:

| Piece | Role |
|---|---|
| `DashboardTabs.tsx` | Growth / Deliverables / History / Support / Billing + animated underline |
| `BentoCard.tsx` | Shared dark card + hover lift + `data-portal-slot` |
| `Sparkline.tsx` | Orange area chart stand-in |
| `StatusRing.tsx` | Green circular progress |
| `tabs/GrowthTab.tsx` | Main analytics bento (ads + website/video progress) |
| `tabs/DeliverablesTab.tsx` | Media shelf placeholders → Phase 6 |
| `tabs/HistoryTab.tsx` | Saved info placeholders → Phase 6 |
| `tabs/SupportTab.tsx` | Request form + calendar slot → Phase 9 |
| `tabs/BillingTab.tsx` | Stripe placeholder → Phase 8 |

Orchestrator: `src/portal/pages/DashboardPage.tsx`

21st.dev swap ids listed in `TEST-STRIP.md`.
