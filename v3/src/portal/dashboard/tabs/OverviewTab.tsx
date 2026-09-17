import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Globe, Megaphone, Video } from 'lucide-react'
import type { ReactNode } from 'react'
import BentoCard from '@/portal/dashboard/BentoCard'
import Sparkline from '@/portal/dashboard/Sparkline'
import StatusRing from '@/portal/dashboard/StatusRing'
import {
  formatCycleDate,
  PACKAGE_LABELS,
  packagesFromFocus,
  resolvePackageOrder,
  type PackageId,
  type ServiceFocus,
} from '@/portal/lib/packagePresets'

export type OverviewMetrics = {
  ad_spend: number
  leads_generated: number
  cost_per_lead: number
  pipeline_value: number
  spend_breakdown: Record<string, number>
  service_focus: ServiceFocus
  packages: PackageId[]
  package_order: PackageId[]
  cycle_start: string | null
  cycle_end: string | null
  web_phase: number
  web_launch_date: string | null
  status_headline: string
  progress_pct: number
  dashboard_blurb: string
  action_required: boolean
  action_required_text: string
  video_progress_visible: boolean
  updated_at: string | null
}

/** @deprecated use OverviewMetrics */
export type GrowthMetrics = OverviewMetrics

type Props = {
  metrics: OverviewMetrics | null
  lastAction: string | null
  liveFlash?: boolean
}

function money(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function sparkFromSpend(spend: number) {
  const base = Math.max(spend, 100)
  return [0.55, 0.62, 0.58, 0.7, 0.68, 0.82, 0.79, 0.91, 0.88, 1].map((t) => base * t)
}

function activePackages(metrics: OverviewMetrics | null): PackageId[] {
  if (!metrics) return []
  if (metrics.packages.length > 0) return metrics.packages
  return packagesFromFocus(metrics.service_focus)
}

function overviewLabel(ordered: PackageId[]): string {
  if (ordered.length === 0) return 'Your active work'
  if (ordered.length === 1) return `Your ${PACKAGE_LABELS[ordered[0]].toLowerCase()} package`
  return 'Your active work'
}

const WEB_STEPS = ['Discovery', 'Design', 'Build', 'Launch'] as const

const PKG_ICON: Record<PackageId, LucideIcon> = {
  ads: Megaphone,
  website: Globe,
  video: Video,
}

function PackageSection({
  title,
  icon: Icon,
  defaultOpen,
  children,
}: {
  title: string
  icon: LucideIcon
  defaultOpen: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.03]"
    >
      <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex w-full items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2">
            <Icon size={14} strokeWidth={1.75} className="shrink-0 text-white/45" aria-hidden />
            <span>{title}</span>
          </span>
          <span className="font-mono text-[10px] text-white/30 group-open:hidden">show</span>
          <span className="hidden font-mono text-[10px] text-white/30 group-open:inline">hide</span>
        </span>
      </summary>
      <div className="border-t border-white/[0.06] px-3 pb-4 pt-3 sm:px-4">{children}</div>
    </details>
  )
}

function AdsBlock({
  metrics,
  showMix,
  liveFlash,
}: {
  metrics: OverviewMetrics | null
  showMix: boolean
  liveFlash?: boolean
}) {
  const breakdown = metrics?.spend_breakdown ?? {}
  const ads = Number(breakdown.ads) || 0
  const web = Number(breakdown.web) || 0
  const other = Number(breakdown.other) || 0
  const totalMix = Math.max(ads + web + other, 1)
  const ringPct = metrics
    ? metrics.progress_pct > 0
      ? Math.min(100, metrics.progress_pct)
      : Math.min(99.8, 70 + Math.min(metrics.leads_generated, 40) * 0.6)
    : 0
  const cycleLabel = formatCycleDate(metrics?.cycle_end)
  const ringLabel = cycleLabel ? `On track for ${cycleLabel}` : metrics ? 'On track' : 'Awaiting'

  const mixRows = [
    { key: 'ads', label: 'ads', pct: ads, color: 'var(--portal-accent, #f97316)' },
    { key: 'web', label: 'web', pct: web, color: 'rgba(255,255,255,0.75)' },
    { key: 'other', label: 'video / other', pct: other, color: 'rgba(255,255,255,0.35)' },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <BentoCard
        label="ad spend"
        slot="overview-ad-spend"
        className="sm:col-span-2 lg:row-span-2 min-h-[180px]"
        delay={0.02}
      >
        <div className="flex h-full flex-col justify-between gap-3">
          <div>
            <motion.p
              key={`spend-${metrics?.ad_spend ?? 'x'}-${metrics?.updated_at ?? ''}`}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="m-0 font-nhg text-3xl font-medium tracking-tight text-white md:text-4xl"
            >
              {metrics ? money(metrics.ad_spend) : '—'}
            </motion.p>
            <p className="mt-1 font-mono text-[11px] text-[var(--portal-accent,#f97316)]">
              {liveFlash ? 'just updated' : metrics ? 'live from your campaigns' : 'numbers show once synced'}
            </p>
          </div>
          <div className="h-14 w-full md:h-16">
            <Sparkline values={sparkFromSpend(metrics?.ad_spend ?? 0)} />
          </div>
        </div>
      </BentoCard>

      <BentoCard label="progress" slot="overview-status" delay={0.06}>
        <StatusRing percent={ringPct} label={ringLabel} />
      </BentoCard>

      <BentoCard label="leads" slot="overview-leads" delay={0.08}>
        <motion.p
          key={`leads-${metrics?.leads_generated ?? 'x'}`}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-0 font-nhg text-3xl font-medium text-white"
        >
          {metrics ? metrics.leads_generated : '—'}
        </motion.p>
        <p className="mt-2 font-mono text-[10px] text-white/30">generated</p>
      </BentoCard>

      <BentoCard label="cost / lead" slot="overview-cpl" delay={0.1}>
        <p className="m-0 font-nhg text-2xl font-medium text-white md:text-3xl">
          {metrics ? money(metrics.cost_per_lead) : '—'}
        </p>
      </BentoCard>

      {metrics && metrics.pipeline_value > 0 ? (
        <BentoCard label="pipeline" slot="overview-pipeline" delay={0.12}>
          <p className="m-0 font-nhg text-2xl font-medium text-white md:text-3xl">
            {money(metrics.pipeline_value)}
          </p>
        </BentoCard>
      ) : null}

      {showMix ? (
        <BentoCard
          label="spend mix"
          slot="overview-spend-mix"
          delay={0.14}
          className="sm:col-span-2"
          hint="where effort goes"
        >
          <div className="space-y-3 pt-1">
            {mixRows.map((row) => {
              const width = metrics ? (row.pct / totalMix) * 100 : 0
              return (
                <div key={row.key}>
                  <div className="mb-1 flex justify-between font-mono text-[10px] text-white/45">
                    <span>{row.label}</span>
                    <span>{metrics ? `${row.pct}%` : '—'}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${width}%`, background: row.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </BentoCard>
      ) : null}
    </div>
  )
}

function WebsiteBlock({ metrics }: { metrics: OverviewMetrics | null }) {
  const phase = Math.min(4, Math.max(1, metrics?.web_phase ?? 1))
  const launch = formatCycleDate(metrics?.web_launch_date)
  const actionText =
    metrics?.action_required && metrics.action_required_text.trim()
      ? metrics.action_required_text.trim()
      : null

  return (
    <div className="space-y-4">
      <BentoCard label="project stage" slot="overview-web-stage" delay={0.04}>
        <div className="flex items-start justify-between gap-2">
          {WEB_STEPS.map((step, i) => {
            const n = i + 1
            const on = n <= phase
            const current = n === phase
            return (
              <div key={step} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  {i > 0 ? (
                    <div
                      className={`h-px flex-1 ${on ? 'bg-[var(--portal-accent,#f97316)]/60' : 'bg-white/10'}`}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}
                  <span
                    className={[
                      'mx-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px]',
                      current
                        ? 'bg-[var(--portal-accent,#f97316)] text-[#0c0c0d]'
                        : on
                          ? 'border border-[var(--portal-accent,#f97316)]/50 text-white'
                          : 'border border-white/15 text-white/30',
                    ].join(' ')}
                  >
                    {n}
                  </span>
                  {i < WEB_STEPS.length - 1 ? (
                    <div
                      className={`h-px flex-1 ${n < phase ? 'bg-[var(--portal-accent,#f97316)]/60' : 'bg-white/10'}`}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
                <span
                  className={[
                    'text-center font-mono text-[9px] uppercase tracking-wide',
                    current ? 'text-white/80' : 'text-white/35',
                  ].join(' ')}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
        {launch ? (
          <p className="mt-4 font-nhg text-sm text-white/55">
            Target this cycle: <span className="text-white">{launch}</span>
          </p>
        ) : (
          <p className="mt-4 font-mono text-[11px] text-white/30">
            I lock dates once scope settles. Month-to-month work is fine.
          </p>
        )}
      </BentoCard>

      {actionText ? (
        <BentoCard label="action items" slot="overview-web-actions" delay={0.08}>
          <p className="m-0 font-nhg text-sm leading-relaxed text-white/70">{actionText}</p>
        </BentoCard>
      ) : null}
    </div>
  )
}

function VideoBlock({ metrics }: { metrics: OverviewMetrics | null }) {
  const showRing = Boolean(metrics?.video_progress_visible)
  const ringPct = Math.min(100, Math.max(0, metrics?.progress_pct ?? 0))
  const cycleLabel = formatCycleDate(metrics?.cycle_end)
  const ringLabel = cycleLabel ? `On track for ${cycleLabel}` : 'This cycle'

  return (
    <BentoCard label="video status" slot="overview-video" delay={0.04}>
      <p className="m-0 font-nhg text-lg text-white md:text-xl">
        {metrics?.status_headline || 'Ongoing video production'}
      </p>
      <p className="mt-2 font-nhg text-sm leading-relaxed text-white/50">
        {metrics?.dashboard_blurb ||
          'I drop cuts and finals in History and Deliverables.'}
      </p>

      {showRing ? (
        <div className="mt-4 max-w-[160px]">
          <StatusRing percent={ringPct} label={ringLabel} />
        </div>
      ) : (
        <p className="mt-4 font-mono text-[11px] text-white/35">
          I will turn on a progress ring here once the cut is moving so you can see how far along we
          are.
        </p>
      )}

      <p className="mt-4 font-mono text-[11px] text-white/35">
        History and Deliverables hold the files I send you.
      </p>
    </BentoCard>
  )
}

/**
 * Overview tab: package sections (ads / website / video).
 * Falls back to service_focus when packages is empty.
 */
export default function OverviewTab({ metrics, lastAction, liveFlash }: Props) {
  const pkgs = activePackages(metrics)
  const ordered = resolvePackageOrder(pkgs, metrics?.package_order)
  const multi = ordered.length > 1
  const single = ordered.length === 1

  const cycleStart = formatCycleDate(metrics?.cycle_start)
  const cycleEnd = formatCycleDate(metrics?.cycle_end)
  const cycleLine =
    cycleStart && cycleEnd
      ? `Cycle · ${cycleStart} – ${cycleEnd}`
      : cycleStart
        ? `Cycle · from ${cycleStart}`
        : cycleEnd
          ? `Cycle · through ${cycleEnd}`
          : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
          {overviewLabel(ordered)}
        </p>
        {cycleLine ? (
          <span className="font-mono text-[10px] text-white/30">{cycleLine}</span>
        ) : null}
        {liveFlash ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-emerald-300"
          >
            updated live
          </motion.span>
        ) : null}
      </div>

      {metrics?.status_headline || metrics?.dashboard_blurb ? (
        <BentoCard label="project status" slot="overview-status-copy" delay={0}>
          {metrics.status_headline ? (
            <p className="m-0 font-nhg text-xl text-white md:text-2xl">{metrics.status_headline}</p>
          ) : null}
          {metrics.dashboard_blurb ? (
            <p className="mt-2 font-nhg text-sm leading-relaxed text-white/50">{metrics.dashboard_blurb}</p>
          ) : null}
        </BentoCard>
      ) : null}

      <div className="space-y-3" data-portal-slot="overview-packages">
        {ordered.length === 0 ? (
          <BentoCard label="packages" slot="overview-empty" delay={0.02}>
            <p className="m-0 font-nhg text-base text-white/70">No active packages yet.</p>
            <p className="mt-2 font-nhg text-sm leading-relaxed text-white/45">
              I will set your work for this cycle shortly and it will show up here.
            </p>
          </BentoCard>
        ) : (
          ordered.map((pkg, i) => {
            const title = PACKAGE_LABELS[pkg]
            const openByDefault = single || i === 0
            const Icon = PKG_ICON[pkg]
            if (pkg === 'ads') {
              return (
                <PackageSection key={pkg} title={title} icon={Icon} defaultOpen={openByDefault}>
                  <AdsBlock metrics={metrics} showMix={multi} liveFlash={liveFlash} />
                </PackageSection>
              )
            }
            if (pkg === 'website') {
              return (
                <PackageSection key={pkg} title={title} icon={Icon} defaultOpen={openByDefault}>
                  <WebsiteBlock metrics={metrics} />
                </PackageSection>
              )
            }
            return (
              <PackageSection key={pkg} title={title} icon={Icon} defaultOpen={openByDefault}>
                <VideoBlock metrics={metrics} />
              </PackageSection>
            )
          })
        )}
      </div>

      <BentoCard label="activity" slot="overview-activity" delay={0.16}>
        <p className="m-0 font-mono text-[12px] leading-relaxed text-white/70">
          {lastAction ? (
            <>
              <span className="text-white/35">last · </span>
              {lastAction}
            </>
          ) : (
            <span className="text-white/35">No recent actions logged yet.</span>
          )}
        </p>
        <p className="mt-3 font-mono text-[10px] text-white/25">
          Updates when you open tabs or download files
        </p>
      </BentoCard>
    </div>
  )
}
