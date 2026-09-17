import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { usePortalAuth } from '@/portal/auth/AuthContext'
import { getViewAsClient, setViewAsClient, type ViewAsClient } from '@/portal/lib/viewAs'
import { useLiveClientMetrics } from '@/portal/hooks/useLiveClientMetrics'
import { logPortalActivity } from '@/portal/lib/activityApi'
import { portalDisplayName } from '@/portal/lib/displayName'
import DashboardTabs, { type PortalTabId } from '@/portal/dashboard/DashboardTabs'
import OverviewTab from '@/portal/dashboard/tabs/OverviewTab'
import DeliverablesTab from '@/portal/dashboard/tabs/DeliverablesTab'
import HistoryTab from '@/portal/dashboard/tabs/HistoryTab'
import SupportTab from '@/portal/dashboard/tabs/SupportTab'
import BillingTab from '@/portal/dashboard/tabs/BillingTab'

const TAB_LABEL: Record<PortalTabId, string> = {
  overview: 'Viewed Overview',
  deliverables: 'Viewed Deliverables',
  history: 'Viewed History',
  support: 'Viewed Support',
  billing: 'Viewed Billing',
}

/** Client hub with live metrics + activity logging. */
export default function DashboardPage() {
  const { profile, user, isAdmin, refreshProfile } = usePortalAuth()
  const [viewAs, setViewAs] = useState<ViewAsClient | null>(() => getViewAsClient())
  const [tab, setTab] = useState<PortalTabId>('overview')

  useEffect(() => {
    const sync = () => setViewAs(getViewAsClient())
    window.addEventListener('mr-portal-view-as', sync)
    return () => window.removeEventListener('mr-portal-view-as', sync)
  }, [])

  const viewingAsClient = Boolean(isAdmin && viewAs)
  const effectiveId = viewingAsClient ? viewAs!.id : user?.id
  const actorId = user?.id
  const { metrics, loadErr, liveFlash } = useLiveClientMetrics(effectiveId)

  const displayName = portalDisplayName(
    viewingAsClient
      ? {
          fullName: viewAs!.full_name,
          companyName: null,
          email: viewAs!.email,
        }
      : {
          fullName: profile?.full_name,
          companyName: profile?.company_name,
          email: profile?.email ?? user?.email,
        },
  )

  const actionOn = Boolean(metrics?.action_required && metrics.action_required_text.trim())

  useEffect(() => {
    if (!actorId || viewingAsClient) return
    let cancelled = false
    void (async () => {
      await logPortalActivity({
        clientId: actorId,
        actionType: TAB_LABEL[tab],
        route: `/portal/dashboard#${tab}`,
      })
      if (!cancelled) await refreshProfile()
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, actorId, viewingAsClient])

  return (
    <div>
      {viewingAsClient ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
          <p className="m-0 font-nhg text-sm text-amber-100/90">
            Viewing as <span className="font-medium text-white">{viewAs!.full_name || viewAs!.email}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setViewAsClient(null)
              setViewAs(null)
            }}
            className="rounded-lg border border-amber-400/30 px-3 py-1.5 font-mono text-[11px] text-amber-100/90 hover:bg-amber-500/10"
          >
            Exit view-as
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            client portal
          </p>
          <h1 className="m-0 font-nhg text-3xl font-medium tracking-tight text-white md:text-4xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 max-w-xl font-nhg text-sm text-white/45">
            Overview, files, history, support, and billing in one place.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <AnimatePresence>
            {actionOn ? (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                className="max-w-xs rounded-xl border border-rose-400/50 bg-rose-500/15 px-3 py-2 shadow-[0_0_24px_rgba(244,63,94,0.25)]"
              >
                <p className="m-0 flex items-start gap-2 font-nhg text-sm text-rose-100">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-300" />
                  <span>{metrics!.action_required_text.trim()}</span>
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-400/90">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {viewingAsClient ? 'admin · view as client' : liveFlash ? 'just updated' : 'live'}
          </span>
        </div>
      </div>

      {loadErr ? <p className="mt-4 font-nhg text-sm text-red-300/90">{loadErr}</p> : null}

      <div className="mt-8">
        <DashboardTabs active={tab} onChange={setTab} />
      </div>

      <div className="mt-6 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === 'overview' ? (
              <OverviewTab
                metrics={metrics}
                lastAction={profile?.last_action ?? null}
                liveFlash={liveFlash}
              />
            ) : null}
            {tab === 'deliverables' ? (
              <DeliverablesTab clientId={effectiveId} logDownloads={!viewingAsClient} />
            ) : null}
            {tab === 'history' ? <HistoryTab clientId={effectiveId} /> : null}
            {tab === 'support' ? <SupportTab /> : null}
            {tab === 'billing' ? <BillingTab /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
