import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BentoCard from '@/portal/dashboard/BentoCard'
import { downloadMediaAsset, listMediaForClient } from '@/portal/lib/mediaApi'
import { logPortalActivity } from '@/portal/lib/activityApi'
import type { MediaAsset } from '@/portal/lib/mediaTypes'
import { usePortalAuth } from '@/portal/auth/AuthContext'

type Props = {
  clientId: string | undefined
  /** When false (admin view-as), skip writing activity logs. */
  logDownloads?: boolean
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return '—'
  }
}

/** Media vault: files Maximus uploaded for this client. */
export default function DeliverablesTab({ clientId, logDownloads = true }: Props) {
  const { user, refreshProfile } = usePortalAuth()
  const [items, setItems] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const rows = await listMediaForClient(clientId)
        if (!cancelled) setItems(rows)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load files')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId])

  async function onDownload(asset: MediaAsset) {
    setBusyId(asset.id)
    setError(null)
    try {
      await downloadMediaAsset(asset)
      if (logDownloads && user?.id) {
        await logPortalActivity({
          clientId: user.id,
          actionType: `Downloaded: ${asset.title}`,
          route: '/portal/dashboard#deliverables',
        })
        await refreshProfile()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div data-portal-slot="deliverables-grid" className="space-y-4">
      <p className="m-0 max-w-lg font-nhg text-sm text-white/45">
        Videos, invoice PDFs, brand kits, and site files live here for download.
      </p>

      {error ? <p className="font-nhg text-sm text-red-300/90">{error}</p> : null}

      {loading ? (
        <p className="font-mono text-[11px] text-white/35">Loading files…</p>
      ) : items.length === 0 ? (
        <BentoCard label="vault" delay={0.04}>
          <p className="m-0 font-nhg text-sm text-white/45">
            Nothing here yet. Videos, PDFs, and site files will show up in this grid when uploaded.
          </p>
        </BentoCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <BentoCard key={item.id} label={item.tag || 'file'} delay={0.04 * i} slot={`deliverable-${item.id}`}>
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <p className="m-0 font-nhg text-lg text-white">{item.title}</p>
                  <p className="mt-1 font-mono text-[10px] text-white/35">
                    {formatDate(item.created_at)}
                    {item.file_name ? ` · ${item.file_name}` : ''}
                  </p>
                </div>
                <motion.button
                  type="button"
                  disabled={busyId === item.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void onDownload(item)}
                  className="w-fit rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-white/80 hover:bg-white/10 disabled:opacity-40"
                >
                  {busyId === item.id ? 'Preparing…' : 'Download'}
                </motion.button>
              </div>
            </BentoCard>
          ))}
        </div>
      )}
    </div>
  )
}
