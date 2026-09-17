import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { AlertTriangle, ChartColumn, ChevronDown, ChevronUp, UserRound } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import type { PortalProfile } from '@/portal/auth/types'
import { setViewAsClient } from '@/portal/lib/viewAs'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminSection from '@/portal/admin/AdminSection'
import AdminMediaPanel from '@/portal/admin/AdminMediaPanel'
import AdminHistoryPanel from '@/portal/admin/AdminHistoryPanel'
import AdminActivityPanel from '@/portal/admin/AdminActivityPanel'
import AdminMetaSyncPanel from '@/portal/admin/AdminMetaSyncPanel'
import AdminOnboardPanel from '@/portal/admin/AdminOnboardPanel'
import {
  ALL_PACKAGES,
  focusFromPackages,
  isPackageId,
  PACKAGE_LABELS,
  packagesFromFocus,
  type PackageId,
  type ServiceFocus,
} from '@/portal/lib/packagePresets'

type MetricsDraft = {
  ad_spend: string
  leads_generated: string
  cost_per_lead: string
  pipeline_value: string
  ads_pct: string
  web_pct: string
  other_pct: string
  packages: PackageId[]
  package_order: PackageId[]
  cycle_start: string
  cycle_end: string
  web_phase: string
  web_launch_date: string
  service_focus: ServiceFocus
  status_headline: string
  progress_pct: string
  dashboard_blurb: string
  action_required: boolean
  action_required_text: string
  video_progress_visible: boolean
}

type ProfileDraft = {
  full_name: string
  company_name: string
}

const emptyDraft = (): MetricsDraft => ({
  ad_spend: '0',
  leads_generated: '0',
  cost_per_lead: '0',
  pipeline_value: '0',
  ads_pct: '60',
  web_pct: '30',
  other_pct: '10',
  packages: [],
  package_order: [],
  cycle_start: '',
  cycle_end: '',
  web_phase: '1',
  web_launch_date: '',
  service_focus: 'mixed',
  status_headline: '',
  progress_pct: '0',
  dashboard_blurb: '',
  action_required: false,
  action_required_text: '',
  video_progress_visible: false,
})

function formatWhen(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return '—'
  }
}

function parsePkgs(raw: unknown): PackageId[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is PackageId => typeof v === 'string' && isPackageId(v))
}

function shortPkg(id: PackageId) {
  if (id === 'ads') return 'ads'
  if (id === 'website') return 'web'
  return 'video'
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-nhg text-sm text-white outline-none'

/** Admin back office: roster, onboard, account edit, metrics, view-as. */
export default function AdminPage() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<PortalProfile[]>([])
  const [pkgByClient, setPkgByClient] = useState<Record<string, PackageId[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<MetricsDraft>(emptyDraft)
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({ full_name: '', company_name: '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [bannerMsg, setBannerMsg] = useState<string | null>(null)
  const [bannerSaving, setBannerSaving] = useState(false)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteCompany, setInviteCompany] = useState('')
  const [inviteBusy, setInviteBusy] = useState(false)
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)

  const selected = clients.find((c) => c.id === selectedId) ?? null

  const loadClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const client = getSupabase()
      const { data, error: qErr } = await client
        .from('profiles')
        .select(
          'id, email, role, full_name, company_name, last_login_at, last_action, last_action_at',
        )
        .order('created_at', { ascending: false })

      if (qErr) throw qErr
      const rows = (data as PortalProfile[]) ?? []
      setClients(rows)

      if (rows.length > 0) {
        const { data: metricsRows } = await client
          .from('client_metrics')
          .select('client_id, packages, service_focus')
          .in(
            'client_id',
            rows.map((r) => r.id),
          )
        const map: Record<string, PackageId[]> = {}
        for (const m of metricsRows ?? []) {
          const pkgs = parsePkgs((m as { packages?: unknown }).packages)
          const focus = (m as { service_focus?: string }).service_focus
          map[(m as { client_id: string }).client_id] =
            pkgs.length > 0 ? pkgs : packagesFromFocus(focus)
        }
        setPkgByClient(map)
      } else {
        setPkgByClient({})
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load clients.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadClients()
  }, [loadClients])

  useEffect(() => {
    if (!selectedId) {
      setDraft(emptyDraft())
      setProfileDraft({ full_name: '', company_name: '' })
      return
    }
    setSaveMsg(null)
    setBannerMsg(null)

    const row = clients.find((c) => c.id === selectedId)
    if (row) {
      setProfileDraft({
        full_name: row.full_name ?? '',
        company_name: row.company_name ?? '',
      })
    }

    let cancelled = false
    ;(async () => {
      try {
        const client = getSupabase()
        let data: Record<string, unknown> | null = null
        const full = await client
          .from('client_metrics')
          .select(
            'ad_spend, leads_generated, cost_per_lead, pipeline_value, spend_breakdown, service_focus, packages, package_order, cycle_start, cycle_end, web_phase, web_launch_date, status_headline, progress_pct, dashboard_blurb, action_required, action_required_text, video_progress_visible',
          )
          .eq('client_id', selectedId)
          .maybeSingle()

        if (full.error) {
          const mid = await client
            .from('client_metrics')
            .select(
              'ad_spend, leads_generated, cost_per_lead, pipeline_value, spend_breakdown, service_focus, packages, package_order, cycle_start, cycle_end, web_phase, web_launch_date, status_headline, progress_pct, dashboard_blurb, action_required, action_required_text',
            )
            .eq('client_id', selectedId)
            .maybeSingle()
          data = (mid.data as Record<string, unknown> | null) ?? null
        } else {
          data = (full.data as Record<string, unknown> | null) ?? null
        }

        if (cancelled) return
        if (!data) {
          setDraft(emptyDraft())
          return
        }
        const breakdown = (data.spend_breakdown ?? {}) as Record<string, number>
        const pkgs = parsePkgs(data.packages)
        const order = parsePkgs(data.package_order)
        const focus = (data.service_focus as ServiceFocus) || 'mixed'
        const resolved = pkgs.length > 0 ? pkgs : packagesFromFocus(focus)
        setDraft({
          ad_spend: String(data.ad_spend ?? 0),
          leads_generated: String(data.leads_generated ?? 0),
          cost_per_lead: String(data.cost_per_lead ?? 0),
          pipeline_value: String(data.pipeline_value ?? 0),
          ads_pct: String(breakdown.ads ?? 60),
          web_pct: String(breakdown.web ?? 30),
          other_pct: String(breakdown.other ?? 10),
          packages: resolved,
          package_order: order.length > 0 ? order : resolved,
          cycle_start: data.cycle_start ? String(data.cycle_start).slice(0, 10) : '',
          cycle_end: data.cycle_end ? String(data.cycle_end).slice(0, 10) : '',
          web_phase: String(data.web_phase ?? 1),
          web_launch_date: data.web_launch_date
            ? String(data.web_launch_date).slice(0, 10)
            : '',
          service_focus: focus,
          status_headline: String(data.status_headline ?? ''),
          progress_pct: String(data.progress_pct ?? 0),
          dashboard_blurb: String(data.dashboard_blurb ?? ''),
          action_required: Boolean(data.action_required),
          action_required_text: String(data.action_required_text ?? ''),
          video_progress_visible: Boolean(data.video_progress_visible),
        })
      } catch {
        if (!cancelled) setDraft(emptyDraft())
      }
    })()
    return () => {
      cancelled = true
    }
  }, [selectedId, clients])

  function togglePackage(id: PackageId) {
    setDraft((d) => {
      const has = d.packages.includes(id)
      let packages = has ? d.packages.filter((p) => p !== id) : [...d.packages, id]
      if (packages.length === 0) packages = [id]
      let package_order = d.package_order.filter((p) => packages.includes(p))
      for (const p of packages) {
        if (!package_order.includes(p)) package_order.push(p)
      }
      return {
        ...d,
        packages,
        package_order,
        service_focus: focusFromPackages(packages),
        video_progress_visible: packages.includes('video') ? d.video_progress_visible : false,
      }
    })
  }

  function movePackage(id: PackageId, dir: -1 | 1) {
    setDraft((d) => {
      const list = [...d.package_order]
      const i = list.indexOf(id)
      if (i < 0) return d
      const j = i + dir
      if (j < 0 || j >= list.length) return d
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...d, package_order: list }
    })
  }

  async function saveAccount() {
    if (!selectedId) return
    setSaving(true)
    setSaveMsg(null)
    setBannerMsg(null)
    try {
      const client = getSupabase()

      const { error: profileErr } = await client
        .from('profiles')
        .update({
          full_name: profileDraft.full_name.trim(),
          company_name: profileDraft.company_name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedId)
      if (profileErr) throw profileErr

      const pkgs = draft.packages
      const order =
        draft.package_order.filter((p) => pkgs.includes(p)).length > 0
          ? draft.package_order.filter((p) => pkgs.includes(p))
          : pkgs

      const payload = {
        client_id: selectedId,
        ad_spend: Number(draft.ad_spend) || 0,
        leads_generated: Math.round(Number(draft.leads_generated) || 0),
        cost_per_lead: Number(draft.cost_per_lead) || 0,
        pipeline_value: Number(draft.pipeline_value) || 0,
        spend_breakdown: {
          ads: Number(draft.ads_pct) || 0,
          web: Number(draft.web_pct) || 0,
          other: Number(draft.other_pct) || 0,
        },
        packages: pkgs,
        package_order: order,
        service_focus: focusFromPackages(pkgs),
        cycle_start: draft.cycle_start || null,
        cycle_end: draft.cycle_end || null,
        web_phase: Math.min(4, Math.max(1, Math.round(Number(draft.web_phase) || 1))),
        web_launch_date: draft.web_launch_date || null,
        status_headline: draft.status_headline.trim(),
        progress_pct: Number(draft.progress_pct) || 0,
        dashboard_blurb: draft.dashboard_blurb.trim(),
        action_required: draft.action_required,
        action_required_text: draft.action_required_text.trim(),
        video_progress_visible: pkgs.includes('video') ? draft.video_progress_visible : false,
        updated_at: new Date().toISOString(),
      }

      const { error: upErr } = await client.from('client_metrics').upsert(payload, {
        onConflict: 'client_id',
      })
      if (upErr) throw upErr

      setSaveMsg('Account saved.')
      await loadClients()
      setSelectedId(selectedId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed.'
      setSaveMsg(
        msg.includes('packages') ||
          msg.includes('service_focus') ||
          msg.includes('column') ||
          msg.includes('action_required') ||
          msg.includes('video_progress')
          ? `${msg} Run the latest SQL migrations in Supabase (003, 006, 007, and/or 008).`
          : msg,
      )
    } finally {
      setSaving(false)
    }
  }

  async function saveBannerOnly() {
    if (!selectedId) return
    setBannerSaving(true)
    setBannerMsg(null)
    setSaveMsg(null)
    try {
      const client = getSupabase()
      const { error: upErr } = await client.from('client_metrics').upsert(
        {
          client_id: selectedId,
          action_required: draft.action_required,
          action_required_text: draft.action_required_text.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'client_id' },
      )
      if (upErr) throw upErr
      setBannerMsg(
        draft.action_required
          ? 'Banner saved. It will show on their dashboard.'
          : 'Banner off. Nothing shows on their dashboard.',
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Banner save failed.'
      setBannerMsg(
        msg.includes('action_required') || msg.includes('column')
          ? `${msg} Run SQL 006_history_kinds_action_banner.sql in Supabase.`
          : msg,
      )
    } finally {
      setBannerSaving(false)
    }
  }

  async function inviteClient(e: FormEvent) {
    e.preventDefault()
    setInviteMsg(null)
    const email = inviteEmail.trim().toLowerCase()
    if (!email) {
      setInviteMsg('Enter a client email.')
      return
    }
    setInviteBusy(true)
    try {
      const client = getSupabase()
      const { error: otpErr } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/portal/auth/callback`,
          data: {
            full_name: inviteName.trim() || undefined,
            company_name: inviteCompany.trim() || undefined,
          },
        },
      })
      if (otpErr) throw otpErr
      setInviteMsg(`Invite emailed to ${email}. They appear in this list after they sign in once.`)
      setInviteEmail('')
      setInviteName('')
      setInviteCompany('')
      setTimeout(() => void loadClients(), 2000)
    } catch (err) {
      setInviteMsg(err instanceof Error ? err.message : 'Invite failed.')
    } finally {
      setInviteBusy(false)
    }
  }

  function viewAsSelected() {
    if (!selected) return
    setViewAsClient({
      id: selected.id,
      email: selected.email,
      full_name: profileDraft.full_name || selected.full_name,
      company_name: profileDraft.company_name || selected.company_name,
    })
    navigate('/portal/dashboard')
  }

  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
        maximus.reach / admin
      </p>
      <h1 className="m-0 font-nhg text-3xl font-medium tracking-tight text-white md:text-4xl">
        Client roster
      </h1>
      <p className="mt-2 max-w-xl font-nhg text-sm text-white/45">
        Edit a client like it is your own account: name, packages (ads, website, video), progress,
        and overview numbers. Their dashboard updates live. Onboard never emails them. Send invite
        is the only button that emails a login code.
      </p>

      <AdminOnboardPanel
        clients={clients}
        selectedId={selectedId}
        onDone={() => void loadClients()}
      />

      <motion.form
        onSubmit={inviteClient}
        className="portal-card mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 sm:col-span-2 lg:col-span-1">
          quick invite email
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            type="email"
            required
            className={inputClass}
            placeholder="client@company.com"
          />
        </label>
        <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          name
          <input
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            className={inputClass}
            placeholder="Client first name"
          />
        </label>
        <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          company
          <input
            value={inviteCompany}
            onChange={(e) => setInviteCompany(e.target.value)}
            className={inputClass}
            placeholder="Acme Co"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={inviteBusy}
            className="w-full rounded-lg border border-white/15 py-2 font-nhg text-sm text-white/80 hover:bg-white/5 disabled:opacity-40"
          >
            {inviteBusy ? 'Sending…' : 'Send invite only'}
          </button>
        </div>
        {inviteMsg ? (
          <p className="font-nhg text-sm text-white/55 sm:col-span-2 lg:col-span-4">{inviteMsg}</p>
        ) : null}
      </motion.form>

      <motion.div
        className="portal-card mt-6 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="hidden grid-cols-5 gap-2 border-b border-white/[0.08] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 md:grid">
          <span>client</span>
          <span>email</span>
          <span>role</span>
          <span>last login</span>
          <span>last action</span>
        </div>
        {loading ? (
          <p className="px-4 py-6 font-mono text-[11px] text-white/35">Loading clients…</p>
        ) : error ? (
          <p className="px-4 py-6 font-nhg text-sm text-red-300/90">{error}</p>
        ) : clients.length === 0 ? (
          <p className="px-4 py-6 font-mono text-[11px] text-white/35">
            No profiles yet. Sign in once yourself, or onboard / invite above.
          </p>
        ) : (
          clients.map((row) => {
            const active = row.id === selectedId
            const pkgs = pkgByClient[row.id] ?? []
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelectedId(row.id)}
                className={`grid w-full grid-cols-1 gap-1 border-b border-white/[0.04] px-4 py-3 text-left transition-colors md:grid-cols-5 md:gap-2 ${
                  active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <span className="font-nhg text-sm text-white/85">
                  <span className="inline-flex flex-wrap items-center gap-1.5">
                    {row.full_name || row.company_name || '—'}
                    {pkgs.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-white/40"
                      >
                        {shortPkg(p)}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="truncate font-nhg text-sm text-white/45">{row.email}</span>
                <span className="font-mono text-[11px] text-white/40">{row.role}</span>
                <span className="font-mono text-[11px] text-white/35">{formatWhen(row.last_login_at)}</span>
                <span className="truncate font-mono text-[11px] text-white/35" title={row.last_action_at || ''}>
                  {row.last_action || '—'}
                </span>
              </button>
            )
          })
        )}
      </motion.div>

      {selected ? (
        <motion.div
          className="portal-card mt-6 overflow-hidden p-4 md:p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-violet-400/20 pb-4">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-violet-300/90">
                live account editor
              </p>
              <h2 className="m-0 mt-1 font-nhg text-xl text-white md:text-2xl">{selected.email}</h2>
            </div>
            <button
              type="button"
              onClick={viewAsSelected}
              className="rounded-lg border border-white/15 px-3 py-2 font-mono text-[11px] text-white/70 hover:bg-white/5"
            >
              View as client
            </button>
          </div>

          <AdminSection
            title="Profile"
            blurb="Name and company drive the Welcome greeting (first name preferred)."
            icon={UserRound}
            accent="#c4b5fd"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                full name
                <input
                  value={profileDraft.full_name}
                  onChange={(e) => setProfileDraft((p) => ({ ...p, full_name: e.target.value }))}
                  className={inputClass}
                  placeholder="Full name"
                />
              </label>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                company
                <input
                  value={profileDraft.company_name}
                  onChange={(e) => setProfileDraft((p) => ({ ...p, company_name: e.target.value }))}
                  className={inputClass}
                  placeholder="McClure Realty"
                />
              </label>
            </div>
          </AdminSection>

          <AdminSection
            title="Packages + overview"
            blurb="Pick packages, cycle dates, and website stage. Save sets service focus from packages."
            icon={ChartColumn}
            accent="#fb923c"
          >
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
              packages
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_PACKAGES.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePackage(id)}
                  className={[
                    'rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide',
                    draft.packages.includes(id)
                      ? 'border-[var(--portal-accent,#f97316)]/50 bg-[var(--portal-accent,#f97316)]/15 text-white'
                      : 'border-white/10 text-white/40 hover:text-white/70',
                  ].join(' ')}
                >
                  {PACKAGE_LABELS[id]}
                </button>
              ))}
            </div>

            {draft.package_order.length > 1 ? (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                  overview section order
                </p>
                <ul className="mt-2 space-y-1.5">
                  {draft.package_order.map((id, i) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.08] px-3 py-2"
                    >
                      <span className="font-nhg text-sm text-white/80">{PACKAGE_LABELS[id]}</span>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => movePackage(id, -1)}
                          className="rounded border border-white/10 p-1 text-white/50 hover:bg-white/5 disabled:opacity-25"
                          aria-label="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={i === draft.package_order.length - 1}
                          onClick={() => movePackage(id, 1)}
                          className="rounded border border-white/10 p-1 text-white/50 hover:bg-white/5 disabled:opacity-25"
                          aria-label="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                cycle start
                <input
                  type="date"
                  value={draft.cycle_start}
                  onChange={(e) => setDraft((d) => ({ ...d, cycle_start: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                cycle end
                <input
                  type="date"
                  value={draft.cycle_end}
                  onChange={(e) => setDraft((d) => ({ ...d, cycle_end: e.target.value }))}
                  className={inputClass}
                />
              </label>
              {draft.packages.includes('website') ? (
                <>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                    website phase (1-4)
                    <input
                      value={draft.web_phase}
                      onChange={(e) => setDraft((d) => ({ ...d, web_phase: e.target.value }))}
                      className={inputClass}
                      placeholder="1"
                    />
                  </label>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                    web launch date
                    <input
                      type="date"
                      value={draft.web_launch_date}
                      onChange={(e) => setDraft((d) => ({ ...d, web_launch_date: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                </>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 sm:col-span-2">
                status headline (shows on their dashboard)
                <input
                  value={draft.status_headline}
                  onChange={(e) => setDraft((d) => ({ ...d, status_headline: e.target.value }))}
                  className={inputClass}
                  placeholder="Homepage redesign in review"
                />
              </label>
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                progress %
                <input
                  value={draft.progress_pct}
                  onChange={(e) => setDraft((d) => ({ ...d, progress_pct: e.target.value }))}
                  className={inputClass}
                  placeholder="65"
                />
              </label>
              {draft.packages.includes('video') ? (
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={draft.video_progress_visible}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, video_progress_visible: e.target.checked }))
                    }
                    className="rounded border-white/20"
                  />
                  Show video progress ring
                </label>
              ) : null}
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 sm:col-span-2">
                short note for client
                <textarea
                  value={draft.dashboard_blurb}
                  onChange={(e) => setDraft((d) => ({ ...d, dashboard_blurb: e.target.value }))}
                  rows={2}
                  className={inputClass}
                  placeholder="Final video cut landing Friday."
                />
              </label>
            </div>

            {draft.packages.includes('ads') || draft.packages.length === 0 ? (
              <>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                  ads / overview numbers
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      ['ad_spend', 'Ad spend ($)'],
                      ['leads_generated', 'Leads'],
                      ['cost_per_lead', 'Cost / lead ($)'],
                      ['pipeline_value', 'Pipeline ($)'],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50"
                    >
                      {label}
                      <input
                        value={draft[key]}
                        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                  ))}
                </div>

                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                  effort mix %
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ['ads_pct', 'Ads %'],
                      ['web_pct', 'Web %'],
                      ['other_pct', 'Video / other %'],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50"
                    >
                      {label}
                      <input
                        value={draft[key]}
                        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                  ))}
                </div>
              </>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveAccount()}
                className="rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save account'}
              </button>
              {saveMsg ? (
                <p
                  className={`font-nhg text-sm ${
                    saveMsg.toLowerCase().includes('fail') || saveMsg.toLowerCase().includes('run')
                      ? 'text-rose-300/90'
                      : 'text-emerald-300/80'
                  }`}
                >
                  {saveMsg}
                </p>
              ) : null}
            </div>
          </AdminSection>

          <AdminSection
            title="Action required"
            blurb="When on, a red callout appears near Live on their dashboard. Leave off and nothing shows."
            icon={AlertTriangle}
            accent="#fb7185"
          >
            <label className="flex cursor-pointer items-center gap-3 font-nhg text-sm text-white/70">
              <input
                type="checkbox"
                checked={draft.action_required}
                onChange={(e) => setDraft((d) => ({ ...d, action_required: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20"
              />
              Show action banner
            </label>
            {draft.action_required ? (
              <label className="mt-3 block font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                banner message
                <input
                  value={draft.action_required_text}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, action_required_text: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Need logo files by Friday to stay on schedule."
                />
              </label>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={bannerSaving}
                onClick={() => void saveBannerOnly()}
                className="rounded-lg border border-rose-400/30 px-3 py-2 font-mono text-[11px] text-rose-100/90 hover:bg-rose-500/10 disabled:opacity-40"
              >
                {bannerSaving ? 'Saving banner…' : 'Save banner setting'}
              </button>
              {bannerMsg ? (
                <p
                  className={`font-nhg text-sm ${
                    bannerMsg.toLowerCase().includes('fail') ||
                    bannerMsg.toLowerCase().includes('run sql')
                      ? 'text-rose-300/90'
                      : 'text-emerald-300/80'
                  }`}
                >
                  {bannerMsg}
                </p>
              ) : null}
            </div>
          </AdminSection>

          <AdminMetaSyncPanel
            clientId={selected.id}
            onSynced={(nums) => {
              setDraft((d) => ({
                ...d,
                ad_spend: String(Math.round(nums.ad_spend * 100) / 100),
                leads_generated: String(nums.leads_generated),
                cost_per_lead: String(Math.round(nums.cost_per_lead * 100) / 100),
              }))
            }}
          />

          <AdminMediaPanel clientId={selected.id} />
          <AdminHistoryPanel clientId={selected.id} />
          <AdminActivityPanel clientId={selected.id} />
        </motion.div>
      ) : (
        <p className="mt-6 font-mono text-[11px] text-white/30">Select a client row to edit.</p>
      )}
    </div>
  )
}
