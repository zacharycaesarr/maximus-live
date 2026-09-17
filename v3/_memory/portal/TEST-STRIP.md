# Test / temporary UI to strip before go-live

Keep adding rows whenever we ship placeholder, local-only, or "shell" copy.
Before launch, remove or rewrite everything listed here so the portal looks professional.

| Where | What | Why it exists | Strip when |
|---|---|---|---|
| Login page | Setup / keys missing warnings | Local env help | Live + keys on Vercel |
| Login page | "Prefer the email button?…" | Bridge copy | Soften for live |
| Dashboard header | Soft welcome blurb (no 21st.dev line) | Real | Keep |
| Overview empty packages | Calm empty state | Real UX | Keep |
| Overview video (ring off) | "When enabled, a progress ring…" | Hint until toggle on | Soften if clients find it odd |
| Deliverables / History | Empty-state copy when no files/notes | OK UX | Soften if needed |
| Admin media/history panels | Real features | — | Keep |
| Overview activity card | Shows last_action from profile | Real | Keep |
| Billing PayPal | Uses NCP page screenshot (not a true QR) | Temp visual | Clean QR later |
| Billing Stripe | Live via `.env.local` | Real | Keep |
| Support calendar | Live Cal.com embed (`zachary-maximus-ambrcs/booking`) | Real | Keep |
| QR images | Screenshot-style PNGs in public/portal | Temp until clean QR gen | Replace later |
| FUTURE-LEVA | Post-phase visual tuners | Planned | After phases |
| Leva Maximus · Portal | Dev tuners | DEV only | Never in prod |

## Rule for agents
When you add any temporary text, badge, sample row, or console hint, **add a row here in the same change**.

## 21st.dev swap slots (keep these ids)
`overview-ad-spend`, `overview-status`, `overview-leads`, `overview-cpl`, `overview-pipeline`, `overview-spend-mix`, `overview-activity`, `deliverables-grid`, `history-list`, `support-panel`, `support-form`, `support-calendar`, `billing-panel`
