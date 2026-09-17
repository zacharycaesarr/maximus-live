import { getSupabase } from '@/lib/supabase'
import type { HistoryEntryKind, InfoHistoryItem } from '@/portal/lib/mediaTypes'

export async function listHistoryForClient(clientId: string): Promise<InfoHistoryItem[]> {
  const client = getSupabase()
  const { data, error } = await client
    .from('info_history')
    .select('id, client_id, title, body, entry_kind, created_at, updated_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    // Older DB without entry_kind
    const fallback = await client
      .from('info_history')
      .select('id, client_id, title, body, created_at, updated_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (fallback.error) throw fallback.error
    return ((fallback.data as InfoHistoryItem[]) ?? []).map((r) => ({
      ...r,
      entry_kind: 'note' as const,
    }))
  }
  return ((data as InfoHistoryItem[]) ?? []).map((r) => ({
    ...r,
    entry_kind: r.entry_kind === 'work' ? 'work' : 'note',
  }))
}

export async function createHistoryNote(
  clientId: string,
  title: string,
  body: string,
  entryKind: HistoryEntryKind = 'note',
) {
  const client = getSupabase()
  const { data, error } = await client
    .from('info_history')
    .insert({
      client_id: clientId,
      title: title.trim(),
      body: body.trim(),
      entry_kind: entryKind,
    })
    .select('id, client_id, title, body, entry_kind, created_at, updated_at')
    .single()
  if (error) throw error
  return data as InfoHistoryItem
}

export async function updateHistoryNote(
  id: string,
  title: string,
  body: string,
  entryKind?: HistoryEntryKind,
) {
  const client = getSupabase()
  const payload: Record<string, string> = {
    title: title.trim(),
    body: body.trim(),
    updated_at: new Date().toISOString(),
  }
  if (entryKind) payload.entry_kind = entryKind
  const { data, error } = await client
    .from('info_history')
    .update(payload)
    .eq('id', id)
    .select('id, client_id, title, body, entry_kind, created_at, updated_at')
    .single()
  if (error) throw error
  return data as InfoHistoryItem
}

export async function deleteHistoryNote(id: string) {
  const client = getSupabase()
  const { error } = await client.from('info_history').delete().eq('id', id)
  if (error) throw error
}
