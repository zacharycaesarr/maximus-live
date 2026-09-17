import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

/** Browser Supabase client. Null until .env.local keys are set. */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
        // Stay signed in across visits; refresh token keeps the month-long feel.
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'mr-v3-portal-auth',
      },
    })
  : null

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local',
    )
  }
  return supabase
}

/** Where magic-link emails send people after they click. */
export function portalAuthCallbackUrl() {
  return `${window.location.origin}/portal/auth/callback`
}
