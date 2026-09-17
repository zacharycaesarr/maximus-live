// Email Zachary when a client logs into the portal.
// Secret: RESEND_API_KEY
// Optional: ADMIN_ALERT_EMAIL (defaults to hello@maximusreach.com)
// Optional: LOGIN_ALERTS_ENABLED=true|false (default true)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return cors(new Response('ok', { status: 200 }))

  try {
    if ((Deno.env.get('LOGIN_ALERTS_ENABLED') || 'true').toLowerCase() === 'false') {
      return json({ ok: true, skipped: true })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) return json({ ok: false, error: 'RESEND_API_KEY missing' }, 500)

    const to = Deno.env.get('ADMIN_ALERT_EMAIL') || 'hello@maximusreach.com'
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !anonKey) return json({ error: 'Supabase env missing' }, 500)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Not signed in' }, 401)

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
    } = await userClient.auth.getUser()
    if (!user) return json({ error: 'Invalid session' }, 401)

    const body = (await req.json().catch(() => ({}))) as {
      email?: string
      fullName?: string
      company?: string
    }

    const who = body.fullName || body.email || user.email || 'A client'
    const company = body.company ? ` (${body.company})` : ''
    const when = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

    const mail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Maximus Portal <hello@maximusreach.com>',
        to: [to],
        subject: `Portal login · ${who}`,
        text: `${who}${company} signed into the client portal.\nTime: ${when}\nEmail: ${body.email || user.email || '—'}`,
      }),
    })

    if (!mail.ok) {
      const errText = await mail.text()
      return json({ error: 'Resend failed', detail: errText }, 502)
    }

    return json({ ok: true })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Alert failed' }, 500)
  }
})
