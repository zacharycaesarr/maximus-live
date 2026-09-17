import { useEffect, useState, type FormEvent } from 'react'
import { NotebookPen } from 'lucide-react'
import AdminSection from '@/portal/admin/AdminSection'
import {
  createHistoryNote,
  deleteHistoryNote,
  listHistoryForClient,
  updateHistoryNote,
} from '@/portal/lib/historyApi'
import type { HistoryEntryKind, InfoHistoryItem } from '@/portal/lib/mediaTypes'

type Props = {
  clientId: string
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-nhg text-sm text-white outline-none'

/** Admin: work log + longer notes for History tab. */
export default function AdminHistoryPanel({ clientId }: Props) {
  const [items, setItems] = useState<InfoHistoryItem[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [kind, setKind] = useState<HistoryEntryKind>('work')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function refresh() {
    const rows = await listHistoryForClient(clientId)
    setItems(rows)
  }

  useEffect(() => {
    void refresh().catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
    setEditingId(null)
    setTitle('')
    setBody('')
    setKind('work')
  }, [clientId])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setMsg('Add a title.')
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      if (editingId) {
        await updateHistoryNote(editingId, title, body, kind)
        setMsg('Updated. Client sees it in History.')
      } else {
        await createHistoryNote(clientId, title, body, kind)
        setMsg(kind === 'work' ? 'Work log item added.' : 'Note added.')
      }
      setEditingId(null)
      setTitle('')
      setBody('')
      setKind('work')
      await refresh()
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Save failed'
      setMsg(
        text.includes('entry_kind')
          ? `${text} — run SQL file 006_history_kinds_action_banner.sql in Supabase.`
          : text,
      )
    } finally {
      setBusy(false)
    }
  }

  function startEdit(item: InfoHistoryItem) {
    setEditingId(item.id)
    setTitle(item.title)
    setBody(item.body)
    setKind(item.entry_kind === 'work' ? 'work' : 'note')
    setMsg(null)
  }

  async function onDelete(item: InfoHistoryItem) {
    if (!window.confirm(`Delete "${item.title}"?`)) return
    setBusy(true)
    setMsg(null)
    try {
      await deleteHistoryNote(item.id)
      if (editingId === item.id) {
        setEditingId(null)
        setTitle('')
        setBody('')
      }
      await refresh()
      setMsg('Deleted.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminSection
      title="History · work log + notes"
      blurb="Work log = short dated line items (main History feed). Notes = longer recaps on the side."
      icon={NotebookPen}
      accent="#fbbf24"
    >
      <form onSubmit={onSave} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['work', 'Work log item'],
              ['note', 'Longer note'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setKind(id)}
              className={[
                'rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide',
                kind === id
                  ? 'border-amber-400/50 bg-amber-500/15 text-white'
                  : 'border-white/10 text-white/40 hover:text-white/70',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder={
              kind === 'work' ? 'Updated property ad headlines' : 'March recap'
            }
          />
        </label>
        <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          {kind === 'work' ? 'detail (optional)' : 'note'}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={kind === 'work' ? 2 : 4}
            className={inputClass}
            placeholder={
              kind === 'work'
                ? 'Optional extra detail…'
                : 'What happened this month / what they need to remember…'
            }
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
          >
            {busy ? 'Saving…' : editingId ? 'Update' : kind === 'work' ? 'Add work item' : 'Add note'}
          </button>
          {editingId ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setEditingId(null)
                setTitle('')
                setBody('')
                setKind('work')
              }}
              className="rounded-lg border border-white/15 px-3 py-2 font-mono text-[11px] text-white/55"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      {msg ? <p className="mt-3 font-nhg text-sm text-white/50">{msg}</p> : null}

      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="font-mono text-[11px] text-white/30">Nothing yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/[0.08] px-3 py-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wide text-white/35">
                    {item.entry_kind === 'work' ? 'work' : 'note'}
                  </span>
                  <p className="m-0 font-nhg text-sm text-white/85">{item.title}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => startEdit(item)}
                    className="font-mono text-[10px] text-white/45 hover:text-white/80"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onDelete(item)}
                    className="font-mono text-[10px] text-red-300/70 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {item.body ? (
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap font-nhg text-sm text-white/40">
                  {item.body}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </AdminSection>
  )
}
