import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import type { OverviewMetrics } from '@/portal/dashboard/tabs/OverviewTab'
import { isPackageId, type PackageId } from '@/portal/lib/packagePresets'

const FULL_SELECT =
  'ad_spend, leads_generated, cost_per_lead, pipeline_value, spend_breakdown, service_focus, packages, package_order, cycle_start, cycle_end, web_phase, web_launch_date, status_headline, progress_pct, dashboard_blurb, action_required, action_required_text, video_progress_visible, updated_at'

const PACKAGES_SELECT =
  'ad_spend, leads_generated, cost_per_lead, pipeline_value, spend_breakdown, service_focus, packages, package_order, cycle_start, cycle_end, web_phase, web_launch_date, status_headline, progress_pct, dashboard_blurb, action_required, action_required_text, updated_at'

const BASIC_SELECT =
  'ad_spend, leads_generated, cost_per_lead, pipeline_value, spend_breakdown, updated_at'

function parsePackages(raw: unknown): PackageId[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is PackageId => typeof v === 'string' && isPackageId(v))
}

function rowToMetrics(data: Record<string, unknown>): OverviewMetrics {
  return {
    ad_spend: Number(data.ad_spend) || 0,
    leads_generated: Number(data.leads_generated) || 0,
    cost_per_lead: Number(data.cost_per_lead) || 0,
    pipeline_value: Number(data.pipeline_value) || 0,
    spend_breakdown: (data.spend_breakdown ?? {}) as Record<string, number>,
    service_focus: (data.service_focus as OverviewMetrics['service_focus']) || 'mixed',
    packages: parsePackages(data.packages),
    package_order: parsePackages(data.package_order),
    cycle_start: data.cycle_start ? String(data.cycle_start) : null,
    cycle_end: data.cycle_end ? String(data.cycle_end) : null,
    web_phase: Math.min(4, Math.max(1, Number(data.web_phase) || 1)),
    web_launch_date: data.web_launch_date ? String(data.web_launch_date) : null,
    status_headline: String(data.status_headline ?? ''),
    progress_pct: Number(data.progress_pct) || 0,
    dashboard_blurb: String(data.dashboard_blurb ?? ''),
    action_required: Boolean(data.action_required),
    action_required_text: String(data.action_required_text ?? ''),
    video_progress_visible: Boolean(data.video_progress_visible),
    updated_at: data.updated_at ? String(data.updated_at) : null,
  }
}

/**
 * Loads one client's metrics and keeps them live.
 * When you hit Save in admin, this dashboard updates without refresh.
 */
export function useLiveClientMetrics(clientId: string | undefined) {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [liveFlash, setLiveFlash] = useState(false)

  useEffect(() => {
    if (!clientId) return
    let cancelled = false
    const client = getSupabase()

    async function load() {
      setLoadErr(null)
      try {
        let { data, error } = await client
          .from('client_metrics')
          .select(FULL_SELECT)
          .eq('client_id', clientId)
          .maybeSingle()

        if (error) {
          const mid = await client
            .from('client_metrics')
            .select(PACKAGES_SELECT)
            .eq('client_id', clientId)
            .maybeSingle()
          if (!mid.error) {
            if (cancelled) return
            setMetrics(mid.data ? rowToMetrics(mid.data as Record<string, unknown>) : null)
            return
          }
          const fallback = await client
            .from('client_metrics')
            .select(BASIC_SELECT)
            .eq('client_id', clientId)
            .maybeSingle()
          if (fallback.error) throw fallback.error
          if (cancelled) return
          setMetrics(fallback.data ? rowToMetrics(fallback.data as Record<string, unknown>) : null)
          return
        }

        if (cancelled) return
        setMetrics(data ? rowToMetrics(data as Record<string, unknown>) : null)
      } catch (e) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : 'Could not load metrics')
      }
    }

    void load()

    const channel = client
      .channel(`metrics:${clientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_metrics',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          if (cancelled) return
          if (payload.eventType === 'DELETE') {
            setMetrics(null)
            return
          }
          const row = payload.new as Record<string, unknown>
          setMetrics(rowToMetrics(row))
          setLiveFlash(true)
          window.setTimeout(() => setLiveFlash(false), 1600)
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      void client.removeChannel(channel)
    }
  }, [clientId])

  return { metrics, loadErr, liveFlash }
}
