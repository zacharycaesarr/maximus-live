// Supabase Edge Function: create Stripe PaymentIntent → return clientSecret
// Deploy: npx supabase functions deploy create-payment-intent --no-verify-jwt
// Secret: STRIPE_SECRET_KEY (sk_test_… or sk_live_…)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno'

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
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!stripeKey) return json({ error: 'STRIPE_SECRET_KEY missing on server.' }, 500)
    if (!supabaseUrl || !anonKey) return json({ error: 'Supabase env missing.' }, 500)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Not signed in.' }, 401)

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Invalid session. Sign in again.' }, 401)

    const body = (await req.json().catch(() => ({}))) as {
      amountCents?: number
      description?: string
      clientId?: string
      method?: 'card' | 'us_bank_account'
    }

    const amountCents = Math.round(Number(body.amountCents) || 0)
    if (!amountCents || amountCents < 50) {
      return json({ error: 'Enter at least $0.50.' }, 400)
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const method = body.method === 'us_bank_account' ? 'us_bank_account' : 'card'

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      ...(method === 'us_bank_account'
        ? {
            payment_method_types: ['us_bank_account'],
            payment_method_options: {
              us_bank_account: {
                financial_connections: { permissions: ['payment_method'] },
                verification_method: 'automatic',
              },
            },
          }
        : {
            payment_method_types: ['card'],
          }),
      description: body.description?.trim() || 'Client portal payment',
      receipt_email: user.email || undefined,
      metadata: {
        portal_user_id: user.id,
        client_id: body.clientId || user.id,
        client_email: user.email || '',
        pay_method: method,
      },
    })

    return json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Payment setup failed.'
    return json({ error: msg }, 400)
  }
})
