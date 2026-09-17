// Silent client create for admin onboard. No invite email. No OTP email.
// Deploy: npx supabase functions deploy admin-create-client
// Needs SUPABASE_SERVICE_ROLE_KEY (auto on hosted).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json({ error: 'Supabase env missing on server.' }, 500)
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
    const { data: caller } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (caller?.role !== 'admin') return json({ error: 'Admins only.' }, 403)

    const body = (await req.json().catch(() => ({}))) as {
      email?: string
      fullName?: string
      companyName?: string
    }

    const email = (body.email || '').trim().toLowerCase()
    if (!email || !email.includes('@')) return json({ error: 'Valid email required.' }, 400)

    const fullName = (body.fullName || '').trim()
    const companyName = (body.companyName || '').trim()

    const { data: existing } = await admin
      .from('profiles')
      .select('id, email, full_name, company_name')
      .eq('email', email)
      .maybeSingle()

    if (existing?.id) {
      if (fullName || companyName) {
        await admin
          .from('profiles')
          .update({
            full_name: fullName || existing.full_name,
            company_name: companyName || existing.company_name,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      }
      return json({
        id: existing.id,
        email: existing.email,
        created: false,
      })
    }

    // Creates auth user + profile trigger. Does not email them.
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || undefined,
        company_name: companyName || undefined,
      },
    })
    if (createErr || !created.user) {
      return json({ error: createErr?.message || 'Could not create client.' }, 400)
    }

    // Trigger usually inserts profile; patch name/company if needed.
    await admin.from('profiles').upsert(
      {
        id: created.user.id,
        email,
        full_name: fullName || null,
        company_name: companyName || null,
        role: 'client',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )

    return json({
      id: created.user.id,
      email,
      created: true,
    })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Create failed.' }, 500)
  }
})
