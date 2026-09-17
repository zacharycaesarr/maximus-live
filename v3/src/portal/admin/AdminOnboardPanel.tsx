import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { saveMetaAdAccount } from '@/portal/lib/metaAdsApi'
import {
  ALL_PACKAGES,
  focusFromPackages,
  mergePresets,
  PACKAGE_LABELS,
  type PackageId,
} from '@/portal/lib/packagePresets'

type ClientLite = {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
}

type Props = {
  clients: ClientLite[]
  selectedId: string | null
  onDone: () => void
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-nhg text-sm text-white outline-none'

async function upsertOnboardMetrics(opts: {
  clientId: string
  packages: PackageId[]
  cycleStart: string
  cycleEnd: string
  videoProgressVisible: boolean
}) {
  const preset = mergePresets(opts.packages)
  const showVideoRing = opts.packages.includes('video') ? opts.videoProgressVisible : false
  const client = getSupabase()
  const { error } = await client.from('client_metrics').upsert(
    {
      client_id: opts.clientId,
      packages: opts.packages,
      package_order: opts.packages,
      service_focus: focusFromPackages(opts.packages),
      cycle_start: opts.cycleStart || null,
      cycle_end: opts.cycleEnd || null,
      web_phase: 1,
      status_headline: preset.status_headline,
      dashboard_blurb: preset.dashboard_blurb,
      progress_pct: preset.progress_pct,
      video_progress_visible: showVideoRing,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'client_id' },
  )
  if (error) throw error
}

/**
 * Type email + packages. Creates the client quietly if they are new.
 * Never sends email or OTP. Use Send invite later when you want them notified.
 */
export default function AdminOnboardPanel({ clients, selectedId, onDone }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [packages, setPackages] = useState<PackageId[]>(['ads'])
  const [cycleStart, setCycleStart] = useState('')
  const [cycleEnd, setCycleEnd] = useState('')
  const [metaAdAccountId, setMetaAdAccountId] = useState('')
  const [videoProgressVisible, setVideoProgressVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const row = selectedId ? clients.find((c) => c.id === selectedId) : null
    if (row) {
      setEmail(row.email)
      setName(row.full_name ?? '')
      setCompany(row.company_name ?? '')
    }
  }, [open, selectedId, clients])

  useEffect(() => {
    if (!packages.includes('video') && videoProgressVisible) {
      setVideoProgressVisible(false)
    }
  }, [packages, videoProgressVisible])

  function togglePkg(id: PackageId) {
    setPackages((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((p) => p !== id)
        return next.length === 0 ? prev : next
      }
      return [...prev, id]
    })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    const cleaned = email.trim().toLowerCase()
    if (!cleaned) {
      setMsg('Drop their email in first.')
      return
    }
    if (packages.length === 0) {
      setMsg('Pick at least one package.')
      return
    }

    setBusy(true)
    try {
      const client = getSupabase()

      const { data: created, error: createErr } = await client.functions.invoke(
        'admin-create-client',
        {
          body: {
            email: cleaned,
            fullName: name.trim(),
            companyName: company.trim(),
          },
        },
      )

      if (createErr) throw createErr
      const payload = created as { id?: string; error?: string; created?: boolean } | null
      if (payload?.error) throw new Error(payload.error)
      const clientId = payload?.id
      if (!clientId) throw new Error('Could not create or find that client.')

      await upsertOnboardMetrics({
        clientId,
        packages,
        cycleStart,
        cycleEnd,
        videoProgressVisible,
      })

      if (metaAdAccountId.trim() && packages.includes('ads')) {
        await saveMetaAdAccount(clientId, metaAdAccountId, company.trim() || undefined)
      }

      setMsg(
        payload?.created
          ? `Saved ${cleaned}. They are in the roster. No email went out.`
          : `Updated ${cleaned}. Still no email from me.`,
      )
      onDone()
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Onboard failed.'
      setMsg(
        text.includes('Failed to send') || text.includes('functions')
          ? `${text} Deploy the admin-create-client function in Supabase if you have not yet.`
          : text.includes('packages') || text.includes('column') || text.includes('video_progress')
            ? `${text} Run SQL 007 and/or 008 in Supabase.`
            : text,
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            onboarding
          </p>
          <p className="mt-1 font-nhg text-sm text-white/55">
            Add someone by email and set their packages. I do not email them from here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMsg(null)
            setOpen(true)
          }}
          className="rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d]"
        >
          Onboard client
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setOpen(false)}
          >
            <motion.form
              onSubmit={onSubmit}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#121214] p-4 shadow-2xl sm:p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="m-0 font-nhg text-lg text-white">Onboard client</h2>
                  <p className="mt-1 font-nhg text-sm text-white/45">
                    Type their email and packages. No login code goes out unless you use Send invite
                    later.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white/70"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-3">
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                  email
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className={inputClass}
                    placeholder="client@company.com"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    name
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="Client first name"
                    />
                  </label>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    company
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={inputClass}
                      placeholder="Acme Co"
                    />
                  </label>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    packages
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_PACKAGES.map((id) => {
                      const on = packages.includes(id)
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => togglePkg(id)}
                          className={[
                            'rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide',
                            on
                              ? 'border-[var(--portal-accent,#f97316)]/50 bg-[var(--portal-accent,#f97316)]/15 text-white'
                              : 'border-white/10 text-white/40 hover:text-white/70',
                          ].join(' ')}
                        >
                          {PACKAGE_LABELS[id]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    cycle start
                    <input
                      type="date"
                      value={cycleStart}
                      onChange={(e) => setCycleStart(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    cycle end
                    <input
                      type="date"
                      value={cycleEnd}
                      onChange={(e) => setCycleEnd(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                {packages.includes('video') ? (
                  <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    <input
                      type="checkbox"
                      checked={videoProgressVisible}
                      onChange={(e) => setVideoProgressVisible(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    Show video progress ring
                  </label>
                ) : null}

                {packages.includes('ads') ? (
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                    meta ad account id (optional)
                    <input
                      value={metaAdAccountId}
                      onChange={(e) => setMetaAdAccountId(e.target.value)}
                      className={inputClass}
                      placeholder="2924124977850038"
                    />
                  </label>
                ) : null}
              </div>

              {msg ? <p className="mt-3 font-nhg text-sm text-white/60">{msg}</p> : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={busy || !email.trim()}
                  className="rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
                >
                  {busy ? 'Working…' : 'Save onboard'}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/15 px-4 py-2 font-mono text-[11px] text-white/60 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
