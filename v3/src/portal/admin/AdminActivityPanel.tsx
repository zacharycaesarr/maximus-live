import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import AdminSection from '@/portal/admin/AdminSection'
import { listRecentActivity, type AuditLog } from '@/portal/lib/activityApi'

type Props = {
  clientId: string
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return '—'
  }
}

/** Recent client actions for the admin account editor. */
export default function AdminActivityPanel({ clientId }: Props) {
  const [items, setItems] = useState<AuditLog[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setError(null)
      try {
        const rows = await listRecentActivity(clientId)
        if (!cancelled) setItems(rows)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load activity')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId])

  return (
    <AdminSection
      title="Recent activity"
      blurb="What this client did in the portal (logins, tabs, downloads). Also drives the roster last action column."
      icon={Activity}
      accent="#34d399"
    >
      {error ? <p className="font-nhg text-sm text-red-300/90">{error}</p> : null}

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="font-mono text-[11px] text-white/30">No activity logged yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-white/[0.08] px-3 py-2"
            >
              <p className="m-0 font-nhg text-sm text-white/80">{item.action_type}</p>
              <span className="font-mono text-[10px] text-white/30">{formatWhen(item.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </AdminSection>
  )
}
