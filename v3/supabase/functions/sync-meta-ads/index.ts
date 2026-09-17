// Supabase Edge Function: sync Meta Ads insights → client_metrics
// Deploy: supabase functions deploy sync-meta-ads
// Secret: META_ACCESS_TOKEN (System User token with ads_read)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const GRAPH = 'https://graph.facebook.com/v21.0'

type Body = { clientId?: string }

function cors(res: Response) {
  const h = new Headers(res.headers)
  h.set('Access-Control-Allow-Origin', '*')
  h.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type')
  return new Response(res.body, { status: res.status, headers: h })
}

function json(data: unknown, status = 200) {
  return cors(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

function normalizeAccountId(raw: string) {
  const t = raw.trim()
  if (t.startsWith('act_')) return t.slice(4)
  return t.replace(/\D/g, '') || t
}

function leadCount(actions: { action_type: string; value: string }[] | undefined) {
  if (!actions?.length) return 0
  // Prefer the canonical "lead" row. Do NOT sum every *lead* action (Meta repeats the same count).
  const exact = actions.find((a) => a.action_type === 'lead')
  if (exact) return Math.round(Number(exact.value) || 0)
  const grouped = actions.find((a) => a.action_type === 'onsite_conversion.lead_grouped')
  if (grouped) return Math.round(Number(grouped.value) || 0)
  return 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return cors(new Response('ok', { status: 200 }))
  }

  try {
    const metaToken = Deno.env.get('META_ACCESS_TOKEN')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!metaToken || !supabaseUrl || !serviceKey || !anonKey) {
      return json({ error: 'Server missing META_ACCESS_TOKEN or Supabase env.' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Not signed in.' }, 401)

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Invalid session.' }, 401)

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.role !== 'admin') return json({ error: 'Admins only.' }, 403)

    const body = (await req.json().catch(() => ({}))) as Body
    const clientId = body.clientId?.trim()
    if (!clientId) return json({ error: 'clientId required.' }, 400)

    const { data: link, error: linkErr } = await admin
      .from('client_ad_accounts')
      .select('*')
      .eq('client_id', clientId)
      .eq('platform', 'meta')
      .maybeSingle()

    if (linkErr) return json({ error: linkErr.message }, 500)
    if (!link?.account_id) {
      return json({ error: 'No Meta ad account linked for this client. Save an account ID first.' }, 400)
    }
    if (!link.sync_enabled) {
      return json({ error: 'Sync is turned off for this client.' }, 400)
    }

    const act = normalizeAccountId(link.account_id)
    const url = new URL(`${GRAPH}/act_${act}/insights`)
    url.searchParams.set('fields', 'spend,actions,cost_per_action_type')
    url.searchParams.set('date_preset', 'last_30d')
    url.searchParams.set('level', 'account')
    url.searchParams.set('access_token', metaToken)

    const metaRes = await fetch(url.toString())
    const metaJson = await metaRes.json()
    if (!metaRes.ok) {
      const errMsg =
        metaJson?.error?.message || metaJson?.error?.error_user_msg || 'Meta API error'
      await admin
        .from('client_ad_accounts')
        .update({ last_sync_error: errMsg })
        .eq('id', link.id)
      return json({ error: errMsg, meta: metaJson?.error }, 502)
    }

    const row = metaJson?.data?.[0] || {}
    const spend = Number(row.spend) || 0
    const leads = leadCount(row.actions)
    let cpl = leads > 0 ? spend / leads : 0
    const cplFromMeta = (row.cost_per_action_type as { action_type: string; value: string }[] | undefined)
      ?.find((c) => c.action_type === 'lead' || c.action_type?.includes('lead'))
    if (cplFromMeta) cpl = Number(cplFromMeta.value) || cpl

    const now = new Date().toISOString()
    const basePayload = {
      client_id: clientId,
      ad_spend: Math.round(spend * 100) / 100,
      leads_generated: leads,
      cost_per_lead: Math.round(cpl * 100) / 100,
      updated_at: now,
    }

    let { error: upErr } = await admin.from('client_metrics').upsert(
      {
        ...basePayload,
        metrics_source: 'meta',
        meta_synced_at: now,
      },
      { onConflict: 'client_id' },
    )
    // Older DBs without metrics_source / meta_synced_at columns
    if (upErr && (upErr.message.includes('metrics_source') || upErr.message.includes('meta_synced_at') || upErr.message.includes('column'))) {
      const retry = await admin.from('client_metrics').upsert(basePayload, { onConflict: 'client_id' })
      upErr = retry.error
    }
    if (upErr) return json({ error: upErr.message }, 500)

    await admin
      .from('client_ad_accounts')
      .update({ last_synced_at: now, last_sync_error: null })
      .eq('id', link.id)

    return json({
      ok: true,
      ad_spend: spend,
      leads_generated: leads,
      cost_per_lead: cpl,
      synced_at: now,
      date_preset: 'last_30d',
    })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Sync failed.' }, 500)
  }
})
