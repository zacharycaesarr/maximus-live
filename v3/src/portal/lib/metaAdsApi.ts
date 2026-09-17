import { getSupabase } from '@/lib/supabase'

export type ClientAdAccount = {
  id: string
  client_id: string
  platform: 'meta' | 'google'
  account_id: string
  label: string | null
  sync_enabled: boolean
  last_synced_at: string | null
  last_sync_error: string | null
}

async function readFunctionError(error: unknown, data: unknown): Promise<string> {
  if (data && typeof data === 'object' && data !== null && 'error' in data) {
    const e = (data as { error?: unknown }).error
    if (e) return String(e)
  }
  const err = error as { message?: string; context?: Response }
  if (err?.context) {
    try {
      const body = await err.context.clone().json()
      if (body?.error) return String(body.error)
      if (typeof body === 'string') return body
    } catch {
      try {
        const text = await err.context.clone().text()
        if (text) return text.slice(0, 280)
      } catch {
        /* ignore */
      }
    }
  }
  return err?.message || 'Edge Function failed.'
}

export async function getMetaAdAccount(clientId: string) {
  const client = getSupabase()
  const { data, error } = await client
    .from('client_ad_accounts')
    .select('*')
    .eq('client_id', clientId)
    .eq('platform', 'meta')
    .maybeSingle()
  if (error) throw error
  return (data as ClientAdAccount | null) ?? null
}

export async function saveMetaAdAccount(clientId: string, accountId: string, label?: string) {
  const client = getSupabase()
  const cleaned = accountId.trim().replace(/^act_/i, '')
  const { data, error } = await client
    .from('client_ad_accounts')
    .upsert(
      {
        client_id: clientId,
        platform: 'meta',
        account_id: cleaned,
        label: label?.trim() || null,
        sync_enabled: true,
        last_sync_error: null,
      },
      { onConflict: 'client_id,platform' },
    )
    .select('*')
    .single()
  if (error) throw error
  return data as ClientAdAccount
}

export async function syncMetaAdsForClient(clientId: string) {
  const client = getSupabase()
  const { data, error } = await client.functions.invoke('sync-meta-ads', {
    body: { clientId },
  })
  if (error) throw new Error(await readFunctionError(error, data))
  if (data?.error) throw new Error(String(data.error))
  return data as {
    ok: boolean
    ad_spend: number
    leads_generated: number
    cost_per_lead: number
    synced_at: string
  }
}
