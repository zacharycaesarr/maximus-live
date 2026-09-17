import { useEffect, useState, type FormEvent } from 'react'
import { FolderOpen } from 'lucide-react'
import AdminSection from '@/portal/admin/AdminSection'
import {
  deleteMediaAsset,
  listMediaForClient,
  uploadMediaForClient,
} from '@/portal/lib/mediaApi'
import { MEDIA_TAGS, type MediaAsset } from '@/portal/lib/mediaTypes'

type Props = {
  clientId: string
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-nhg text-sm text-white outline-none'

/** Admin: upload / remove deliverables for the selected client. */
export default function AdminMediaPanel({ clientId }: Props) {
  const [items, setItems] = useState<MediaAsset[]>([])
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('file')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function refresh() {
    const rows = await listMediaForClient(clientId)
    setItems(rows)
  }

  useEffect(() => {
    void refresh().catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
  }, [clientId])

  async function onUpload(e: FormEvent) {
    e.preventDefault()
    if (!file) {
      setMsg('Pick a file first.')
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      await uploadMediaForClient({
        clientId,
        file,
        title: title || file.name,
        tag,
      })
      setTitle('')
      setFile(null)
      setMsg('Uploaded. Client can download it in Deliverables.')
      await refresh()
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Upload failed'
      setMsg(
        text.includes('Bucket') || text.includes('not found')
          ? `${text} — run SQL 004_media_storage.sql in Supabase.`
          : text,
      )
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(asset: MediaAsset) {
    if (!window.confirm(`Remove "${asset.title}"?`)) return
    setBusy(true)
    setMsg(null)
    try {
      await deleteMediaAsset(asset)
      await refresh()
      setMsg('Removed.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminSection
      title="Media vault"
      blurb="Upload videos, PDFs, brand kits, site zips. They show on the client Deliverables tab."
      icon={FolderOpen}
      accent="#38bdf8"
    >
      <form onSubmit={onUpload} className="grid gap-3 sm:grid-cols-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Final video cut"
          />
        </label>
        <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          tag
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className={inputClass}
          >
            {MEDIA_TAGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 sm:col-span-2">
          file
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1.5 block w-full font-nhg text-sm text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40 sm:col-span-2 sm:w-fit"
        >
          {busy ? 'Working…' : 'Upload file'}
        </button>
      </form>

      {msg ? <p className="mt-3 font-nhg text-sm text-white/50">{msg}</p> : null}

      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="font-mono text-[11px] text-white/30">No files for this client yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.08] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="m-0 truncate font-nhg text-sm text-white/85">{item.title}</p>
                <p className="m-0 font-mono text-[10px] text-white/35">
                  {item.tag} · {item.file_name || item.storage_path || 'file'}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => void onDelete(item)}
                className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-red-300/80 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </AdminSection>
  )
}
