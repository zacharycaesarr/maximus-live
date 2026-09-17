import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import AdminSection from '@/portal/admin/AdminSection'
import {
  getMetaAdAccount,
  saveMetaAdAccount,
  syncMetaAdsForClient,
} from '@/portal/lib/metaAdsApi'

type Props = {
  clientId: string
  onSynced?: (nums: { ad_spend: number; leads_generated: number; cost_per_lead: number }) => void
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-nhg text-sm text-white outline-none'

/** Link Meta ad account + pull last-30-day spend/leads into Overview. */
export default function AdminMetaSyncPanel({ clientId, onSynced }: Props) {
  const [accountId, setAccountId] = useState('')
  const [label, setLabel] = useState('')
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setMsg(null)
      try {
        const row = await getMetaAdAccount(clientId)
        if (cancelled) return
        setAccountId(row?.account_id ?? '')
        setLabel(row?.label ?? '')
        setLastSynced(row?.last_synced_at ?? null)
        setLastError(row?.last_sync_error ?? null)
      } catch (e) {
        if (!cancelled) {
          setMsg(
            e instanceof Error
              ? e.message.includes('client_ad_accounts')
                ? 'Run SQL file 005_meta_ad_sync.sql in Supabase first.'
                : e.message
              : 'Could not load Meta link.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId])

  async function onSaveLink() {
    setBusy(true)
    setMsg(null)
    try {
      const row = await saveMetaAdAccount(clientId, accountId, label)
      setAccountId(row.account_id)
      setMsg('Meta account saved. Click Sync to pull numbers.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function onSync() {
    setBusy(true)
    setMsg(null)
    try {
      if (accountId.trim()) {
        await saveMetaAdAccount(clientId, accountId, label)
      }
      const result = await syncMetaAdsForClient(clientId)
      setLastSynced(result.synced_at)
      setLastError(null)
      setMsg(
        `Synced last 30 days: $${result.ad_spend.toFixed(0)} spend, ${result.leads_generated} leads, $${result.cost_per_lead.toFixed(2)} CPL.`,
      )
      onSynced?.({
        ad_spend: result.ad_spend,
        leads_generated: result.leads_generated,
        cost_per_lead: result.cost_per_lead,
      })
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Sync failed.'
      setLastError(text)
      setMsg(text)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminSection
      title="Meta ads sync"
      blurb="Paste the client Meta ad account ID. Sync pulls the last 30 days into Overview. The Meta token stays on the server, never in the browser."
      icon={RefreshCw}
      accent="#38bdf8"
    >
      {loading ? (
        <p className="m-0 font-mono text-[11px] text-white/35">Loading…</p>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
              Meta ad account ID
              <input
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className={inputClass}
                placeholder="1234567890 or act_1234567890"
              />
            </label>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
              label (optional)
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className={inputClass}
                placeholder="Client / company label"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !accountId.trim()}
              onClick={() => void onSaveLink()}
              className="rounded-lg border border-white/15 px-4 py-2 font-nhg text-sm text-white disabled:opacity-40"
            >
              Save link
            </button>
            <button
              type="button"
              disabled={busy || !accountId.trim()}
              onClick={() => void onSync()}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
            >
              <RefreshCw size={14} strokeWidth={1.75} />
              {busy ? 'Working…' : 'Sync Meta ads'}
            </button>
          </div>

          {lastSynced ? (
            <p className="m-0 font-mono text-[10px] text-white/35">
              Last sync: {new Date(lastSynced).toLocaleString()}
            </p>
          ) : null}
          {lastError ? (
            <p className="m-0 font-nhg text-sm text-rose-300/80">{lastError}</p>
          ) : null}
          {msg ? <p className="m-0 font-nhg text-sm text-white/50">{msg}</p> : null}
        </div>
      )}
    </AdminSection>
  )
}
