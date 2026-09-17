import { useEffect, useState } from 'react'
import BentoCard from '@/portal/dashboard/BentoCard'
import { listHistoryForClient } from '@/portal/lib/historyApi'
import type { InfoHistoryItem } from '@/portal/lib/mediaTypes'

type Props = {
  clientId: string | undefined
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

/** Work log timeline + longer notes. */
export default function HistoryTab({ clientId }: Props) {
  const [items, setItems] = useState<InfoHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const rows = await listHistoryForClient(clientId)
        if (!cancelled) setItems(rows)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load history')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId])

  const work = items.filter((i) => i.entry_kind === 'work')
  const notes = items.filter((i) => i.entry_kind !== 'work')

  return (
    <div data-portal-slot="history-list" className="space-y-4">
      <p className="m-0 max-w-lg font-nhg text-sm text-white/45">
        A running list of work completed on your project, plus any longer notes or recaps.
      </p>

      {error ? <p className="font-nhg text-sm text-red-300/90">{error}</p> : null}

      {loading ? (
        <p className="font-mono text-[11px] text-white/35">Loading history…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <p className="m-0 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-amber-200/90">
              Work log
            </p>
            {work.length === 0 ? (
              <BentoCard label="timeline" delay={0.04}>
                <p className="m-0 font-nhg text-sm text-white/45">
                  Project updates will show here as a dated list (ads, site fixes, video cuts, and
                  more).
                </p>
              </BentoCard>
            ) : (
              <div className="relative space-y-0 pl-3">
                <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
                {work.map((item, i) => (
                  <div key={item.id} className="relative pb-5 pl-5">
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border border-amber-300/60 bg-amber-400/80" />
                    <BentoCard label={formatDate(item.created_at)} delay={0.03 * i} slot={`work-${item.id}`}>
                      <p className="m-0 font-nhg text-base text-white">{item.title}</p>
                      {item.body.trim() ? (
                        <p className="mt-1.5 whitespace-pre-wrap font-nhg text-sm leading-relaxed text-white/50">
                          {item.body}
                        </p>
                      ) : null}
                    </BentoCard>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="m-0 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sky-200/90">
              Notes
            </p>
            {notes.length === 0 ? (
              <BentoCard label="notes" delay={0.06}>
                <p className="m-0 font-nhg text-sm text-white/45">
                  Longer notes and monthly recaps land here.
                </p>
              </BentoCard>
            ) : (
              notes.map((item, i) => (
                <BentoCard key={item.id} label="note" delay={0.04 * i} slot={`history-${item.id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="m-0 font-nhg text-base text-white">{item.title}</p>
                    <span className="font-mono text-[10px] text-white/30">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap font-nhg text-sm leading-relaxed text-white/50">
                    {item.body}
                  </p>
                </BentoCard>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
