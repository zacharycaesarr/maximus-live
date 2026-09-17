# Payments research (before Phase 8)

**Question:** Can portal payments work with **$0 fees** like Venmo personal does today?

## Short answer
**Inside the portal with automatic invoices/links, true $0 card payments basically do not exist.** Card networks (Visa/Mastercard) always take a cut, so Stripe/Square/PayPal always charge you.

You *can* keep **$0 fee** collection by staying bank-to-bank (like Venmo/Zelle/ACH), including some tools that give payment links with free ACH.

## Options ranked for Maximus Reach

### 1) Keep Venmo / Zelle outside the portal (what you do now)
- **Fee:** $0 for typical person-to-person / many small-business uses (confirm Venmo business rules if you ever switch to a Business profile).
- **Portal fit:** Billing tab can say “Pay via Venmo @YourHandle” + paste instructions. No Stripe needed.
- **Pros:** Zero fee, clients already know it.
- **Cons:** Manual tracking; not automatic invoices; weaker paper trail unless you log payments yourself.

### 2) Nickel free ACH (best “portal-like” zero-fee path found)
- Site: https://www.nickel.com/free-ach
- **Fee:** Claims **$0 ACH** on free Core plan (send payment link; client enters bank routing/account).
- **Cap:** Free plan ~$25k per transaction.
- **Pros:** Payment links + invoices without percentage fees; closer to “portal billing” than Venmo.
- **Cons:** Client must be okay paying by bank (not a card). Not built into our code yet. Verify terms yourself before relying on it.
- **Portal fit (Phase 8 variant):** Billing tab opens Nickel payment link / shows “Pay by bank” instead of Stripe Customer Portal.

### 3) Zelle
- **Fee:** Usually $0 bank-to-bank.
- **Portal fit:** Instructions + your Zelle email/phone on Billing tab.
- **Cons:** No good universal payment-link API for embedding; limits vary by bank.

### 4) Stripe / card processors
- **Fee:** ~2.9% + $0.30 (cards). ACH on Stripe still usually has a fee (small % or flat), not free like Venmo.
- **Pros:** Automatic retainers, receipts, customer portal.
- **Cons:** Conflicts with your “no fees like Venmo” requirement.

### 5) “Pass fees to client”
- Technically possible with some processors, but clients feel it. You said you won’t move them off Venmo if a free option exists — so this is a last resort.

## Recommendation for Phase 8
**Do not force Stripe if fee-free is non-negotiable.**

Phase 8 should be a **Billing tab that supports fee-free collection**:
1. **Primary:** Venmo (and/or Zelle) instructions + “I paid” note / admin marks paid.
2. **Upgrade path:** Nickel (or similar) free ACH payment links when you want link-based bank payments.
3. **Optional later:** Stripe only if a client *wants* to pay by card and accepts the fee.

## Decision needed from Zachary (next prompt)
When starting Phase 8, pick one:
- **A)** Venmo/Zelle instructions only (true $0, simplest)
- **B)** Nickel free ACH links (still $0 ACH, more “product”)
- **C)** Stripe anyway (fees OK for some clients)
- **D)** Hybrid: Venmo default + optional Stripe for card clients
