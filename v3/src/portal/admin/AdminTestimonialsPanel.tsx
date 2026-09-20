import { useEffect, useState } from 'react'
import { MessageCircleHeart } from 'lucide-react'
import AdminSection from '@/portal/admin/AdminSection'
import { getSupabase } from '@/lib/supabase'

type Row = {
  id: string
  name: string
  company: string | null
  quote: string
  email: string | null
  source_page: string
  status: string
  created_at: string
}

/** Pending public testimonial notes from the web-dev page form. */
export default function AdminTestimonialsPanel() {
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const client = getSupabase()
      const { data, error: qErr } = await client
        .from('testimonial_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40)
      if (qErr) throw qErr
      setRows((data as Row[]) ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const setStatus = async (id: string, status: 'approved' | 'dismissed' | 'pending') => {
    try {
      const client = getSupabase()
      const { error: uErr } = await client
        .from('testimonial_submissions')
        .update({ status })
        .eq('id', id)
      if (uErr) throw uErr
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const pending = rows.filter((r) => r.status === 'pending').length

  return (
    <AdminSection
      title="Testimonial inbox"
      blurb="Notes people sent from the Web Development page. Approve or dismiss here."
      icon={MessageCircleHeart}
      accent="#c4a574"
    >
      {pending > 0 && (
        <p className="mb-3 rounded-lg border border-[#c4a574]/30 bg-[#c4a574]/10 px-3 py-2 font-nhg text-sm text-[#c4a574]">
          {pending} waiting for review
        </p>
      )}
      {error ? <p className="font-nhg text-sm text-red-300/90">{error}</p> : null}
      {loading ? (
        <p className="font-mono text-[11px] text-white/30">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-[11px] text-white/30">
          No submissions yet. Run migration 009 if the table is missing.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-white/[0.08] px-3 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="m-0 font-nhg text-sm text-white/85">
                  {r.name}
                  {r.company ? ` · ${r.company}` : ''}
                </p>
                <span className="font-mono text-[10px] uppercase text-white/30">{r.status}</span>
              </div>
              <p className="mt-2 m-0 font-nhg text-[13px] leading-relaxed text-white/60">
                “{r.quote}”
              </p>
              {r.email && (
                <p className="mt-1 m-0 font-mono text-[10px] text-white/25">{r.email}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void setStatus(r.id, 'approved')}
                  className="rounded-md border border-white/15 px-2.5 py-1 font-nhg text-[11px] text-white/70 hover:bg-white/5"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => void setStatus(r.id, 'dismissed')}
                  className="rounded-md border border-white/15 px-2.5 py-1 font-nhg text-[11px] text-white/70 hover:bg-white/5"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  )
}
