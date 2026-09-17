import { getSupabase } from '@/lib/supabase'

export type AuditLog = {
  id: string
  client_id: string
  action_type: string
  route: string | null
  created_at: string
}

/**
 * Writes an activity line + updates the client's "last action" on their profile.
 * That last action shows on the admin roster.
 */
export async function logPortalActivity(opts: {
  clientId: string
  actionType: string
  route?: string
}) {
  const client = getSupabase()
  const now = new Date().toISOString()
  const action = opts.actionType.slice(0, 180)

  const { error: logErr } = await client.from('audit_logs').insert({
    client_id: opts.clientId,
    action_type: action,
    route: opts.route ?? null,
  })
  if (logErr) {
    console.warn('[portal] audit log failed', logErr.message)
    return
  }

  const { error: profileErr } = await client
    .from('profiles')
    .update({
      last_action: action,
      last_action_at: now,
    })
    .eq('id', opts.clientId)

  if (profileErr) {
    console.warn('[portal] last_action update failed', profileErr.message)
  }
}

export async function listRecentActivity(clientId: string, limit = 12): Promise<AuditLog[]> {
  const client = getSupabase()
  const { data, error } = await client
    .from('audit_logs')
    .select('id, client_id, action_type, route, created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as AuditLog[]) ?? []
}
