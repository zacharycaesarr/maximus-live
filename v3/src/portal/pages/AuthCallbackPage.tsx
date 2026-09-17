import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSupabase, supabaseConfigured } from '@/lib/supabase'
import { usePortalAuth } from '@/portal/auth/AuthContext'

function stripAuthParamsFromUrl() {
  const url = new URL(window.location.href)
  if (!url.search && !url.hash) return
  window.history.replaceState({}, document.title, url.pathname)
}

function isPkceNoise(message: string) {
  const m = message.toLowerCase()
  return m.includes('pkce') || m.includes('code verifier')
}

/**
 * Landing page after someone clicks the email magic link.
 * Session always wins: if you are already signed in, we never show a scary error.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { ready, session } = usePortalAuth()
  const [message, setMessage] = useState('Finishing sign-in…')
  const [failed, setFailed] = useState(false)
  const hasExchangedRef = useRef(false)

  // If auth already worked (or recovered), leave this page immediately.
  useEffect(() => {
    if (!ready || !session) return
    stripAuthParamsFromUrl()
    setFailed(false)
    setMessage('You are in. Opening your dashboard…')
    navigate('/portal/dashboard', { replace: true })
  }, [ready, session, navigate])

  useEffect(() => {
    if (!supabaseConfigured) {
      setFailed(true)
      setMessage('Supabase keys are missing.')
      return
    }

    if (hasExchangedRef.current) return
    hasExchangedRef.current = true

    let cancelled = false
    const client = getSupabase()

    async function finish() {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const err = url.searchParams.get('error_description') || url.searchParams.get('error')

        // Already signed in? Do not fight the URL.
        const existing = await client.auth.getSession()
        if (existing.data.session) {
          stripAuthParamsFromUrl()
          if (!cancelled) {
            setFailed(false)
            setMessage('You are in. Opening your dashboard…')
            navigate('/portal/dashboard', { replace: true })
          }
          return
        }

        if (err) {
          if (!cancelled) {
            setFailed(true)
            setMessage(err)
          }
          return
        }

        if (code) {
          const { error } = await client.auth.exchangeCodeForSession(code)
          if (error) {
            const again = await client.auth.getSession()
            if (again.data.session) {
              stripAuthParamsFromUrl()
              if (!cancelled) {
                setFailed(false)
                navigate('/portal/dashboard', { replace: true })
              }
              return
            }
            if (isPkceNoise(error.message)) {
              // Stale code / StrictMode double-run with no session left.
              if (!cancelled) {
                setFailed(true)
                setMessage(
                  'That email link was already used or expired. Go back to login and enter the 6-digit code from your email (or request a new one).',
                )
              }
              stripAuthParamsFromUrl()
              return
            }
            throw error
          }
          stripAuthParamsFromUrl()
        } else {
          await new Promise((r) => setTimeout(r, 350))
          const again = await client.auth.getSession()
          if (!again.data.session) {
            throw new Error('No session found. Use the 6-digit code on the login page, or request a new email.')
          }
          stripAuthParamsFromUrl()
        }

        if (!cancelled) {
          setFailed(false)
          setMessage('You are in. Opening your dashboard…')
          navigate('/portal/dashboard', { replace: true })
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sign-in failed.'
        const again = await client.auth.getSession()
        if (again.data.session) {
          stripAuthParamsFromUrl()
          if (!cancelled) {
            setFailed(false)
            navigate('/portal/dashboard', { replace: true })
          }
          return
        }
        if (!cancelled) {
          setFailed(true)
          setMessage(isPkceNoise(msg)
            ? 'That email link was already used or expired. Go back to login and enter the 6-digit code from your email.'
            : msg)
          stripAuthParamsFromUrl()
        }
      }
    }

    void finish()
    return () => {
      cancelled = true
    }
  }, [navigate])

  // Signed in wins over any error card.
  if (session) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="portal-card p-8">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[var(--portal-accent,#f97316)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">auth</p>
          <p className="mt-3 font-nhg text-base text-white/80">You are signed in. Opening your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <motion.div
        className="portal-card p-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {!failed ? (
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[var(--portal-accent,#f97316)]" />
        ) : null}
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">auth</p>
        <p className="mt-3 font-nhg text-base text-white/80">{message}</p>
        {failed ? (
          <Link
            to="/portal/login"
            className="mt-6 inline-flex rounded-lg bg-white/10 px-4 py-2 font-nhg text-sm text-white no-underline hover:bg-white/15"
          >
            Back to login
          </Link>
        ) : null}
      </motion.div>
    </div>
  )
}
