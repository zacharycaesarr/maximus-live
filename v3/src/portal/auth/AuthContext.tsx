import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, supabase, supabaseConfigured } from '@/lib/supabase'
import type { PortalProfile } from '@/portal/auth/types'

type AuthState = {
  ready: boolean
  session: Session | null
  user: User | null
  profile: PortalProfile | null
  isAdmin: boolean
  configured: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

async function fetchProfile(userId: string): Promise<PortalProfile | null> {
  const client = getSupabase()
  const { data, error } = await client
    .from('profiles')
    .select(
      'id, email, role, full_name, company_name, last_login_at, last_action, last_action_at',
    )
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.warn('[portal] profile fetch failed', error.message)
    return null
  }
  return data as PortalProfile | null
}

async function touchLastLogin(userId: string) {
  const client = getSupabase()
  const now = new Date().toISOString()
  await client
    .from('profiles')
    .update({
      last_login_at: now,
      last_action: 'Logged in',
      last_action_at: now,
    })
    .eq('id', userId)

  await client.from('audit_logs').insert({
    client_id: userId,
    action_type: 'Logged in',
    route: '/portal/login',
  })

  // Best-effort email to Zachary (needs RESEND_API_KEY on the function). Never blocks login.
  try {
    const { data: prof } = await client
      .from('profiles')
      .select('email, full_name, company_name, role')
      .eq('id', userId)
      .maybeSingle()
    if (prof?.role === 'admin') return
    void client.functions.invoke('notify-portal-login', {
      body: {
        email: prof?.email,
        fullName: prof?.full_name,
        company: prof?.company_name,
      },
    })
  } catch {
    /* ignore */
  }
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<PortalProfile | null>(null)

  const loadProfile = useCallback(async (userId: string, markLogin: boolean) => {
    if (markLogin) {
      try {
        await touchLastLogin(userId)
      } catch (err) {
        console.warn('[portal] last_login update failed', err)
      }
    }
    const next = await fetchProfile(userId)
    setProfile(next)
  }, [])

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setReady(true)
      return
    }

    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session)
      if (data.session?.user) {
        void loadProfile(data.session.user.id, false).finally(() => {
          if (!cancelled) setReady(true)
        })
      } else {
        setReady(true)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      if (nextSession?.user) {
        const markLogin = event === 'SIGNED_IN'
        void loadProfile(nextSession.user.id, markLogin)
      } else {
        setProfile(null)
      }
    })

    if (import.meta.env.DEV) {
      console.info(
        [
          '[Maximus Portal] To test the admin panel:',
          '1) Sign in with magic link once.',
          '2) In Supabase → Table Editor → profiles, set your role to admin',
          '   or run: update public.profiles set role = \'admin\' where email = \'YOUR_EMAIL\';',
          '3) Refresh /portal/admin',
        ].join('\n'),
      )
    }

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return
    await loadProfile(session.user.id, false)
  }, [loadProfile, session?.user])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      ready,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin: profile?.role === 'admin',
      configured: supabaseConfigured,
      refreshProfile,
      signOut,
    }),
    [ready, session, profile, refreshProfile, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function usePortalAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('usePortalAuth must be used inside PortalAuthProvider')
  }
  return ctx
}
