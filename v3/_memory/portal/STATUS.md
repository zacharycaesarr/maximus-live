# Portal status (read every turn)

**Last updated:** 2026-09-14 (onboard silent + card settle)

## Standing
Checkpoint: `_memory/checkpoints/2026-09-14-portal-wrap/`

## Just shipped
- Card dots settle when leaving number field; CVV dots black
- Onboard: type email → silent create (no email). Roster picker removed.
- Edge fn `admin-create-client` (must deploy)
- Video ring toggle only when Video package is on
- First-person empty / preset copy

## Zachary next
1. Deploy: `npx supabase functions deploy admin-create-client` (from `v3/`)
2. Run SQL 007 + 008 if not done
3. Test onboard with a throwaway email you own (should appear in roster, no inbox mail)
4. Card: fill number → click expiry → last dot should drop flush
