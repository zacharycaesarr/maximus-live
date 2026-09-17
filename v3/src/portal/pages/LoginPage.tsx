import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getSupabase, portalAuthCallbackUrl, supabaseConfigured } from '@/lib/supabase'
import { usePortalAuth } from '@/portal/auth/AuthContext'

function friendlyLoginError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err || '')
  const lower = msg.toLowerCase()
  if (
    lower.includes('signups not allowed') ||
    lower.includes('signup is disabled') ||
    lower.includes('user not found') ||
    lower.includes('unable to validate email') ||
    lower.includes('email not confirmed')
  ) {
    return 'Email not found. Reach out if you think this might be an issue.'
  }
  return msg || 'Could not send login email.'
}

/** Invite-only passwordless login. Code is primary. */
export default function LoginPage() {
  const { ready, session, configured } = usePortalAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  if (ready && session) {
    return <Navigate to={from && from.startsWith('/portal') ? from : '/portal/dashboard'} replace />
  }

  async function requestCode() {
    setError(null)
    setInfo(null)
    if (!supabaseConfigured) {
      setError('Supabase keys are missing. Check .env.local and restart the server.')
      return
    }
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Enter your email address.')
      return
    }

    setBusy(true)
    try {
      const client = getSupabase()
      const { error: otpError } = await client.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: portalAuthCallbackUrl(),
          // Invite-only: do not create random public signups
          shouldCreateUser: false,
        },
      })
      if (otpError) throw otpError
      setSent(true)
      setInfo('We emailed you a login code. Type it below.')
    } catch (err) {
      setError(friendlyLoginError(err))
      setSent(false)
    } finally {
      setBusy(false)
    }
  }

  async function sendCode(e: FormEvent) {
    e.preventDefault()
    await requestCode()
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!supabaseConfigured) return
    const trimmed = email.trim()
    const token = otp.trim().replace(/\s+/g, '')
    if (!trimmed || !token) {
      setError('Enter your email and the code from the email.')
      return
    }

    setBusy(true)
    try {
      const client = getSupabase()
      const { error: verifyError } = await client.auth.verifyOtp({
        email: trimmed,
        token,
        type: 'email',
      })
      if (verifyError) throw verifyError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code did not work.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
        client portal
      </p>
      <h1 className="m-0 font-nhg text-3xl font-medium tracking-tight text-white md:text-4xl">
        Sign in
      </h1>
      <p className="mt-3 font-nhg text-sm leading-relaxed text-white/50">
        Invite only. If Maximus set up your account, enter that email and we will send a login code.
      </p>

      {!configured ? (
        <div className="portal-card mt-6 border-amber-500/20 p-4 font-nhg text-sm text-amber-100/80">
          Keys are not loaded. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`, then
          restart the site.
        </div>
      ) : null}

      <motion.form
        onSubmit={sent ? verifyCode : sendCode}
        className="portal-card mt-8 p-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
          email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-nhg text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </label>

        <AnimatePresence initial={false}>
          {sent ? (
            <motion.div
              key="otp"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <label className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                login code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-nhg text-sm tracking-[0.2em] text-white outline-none placeholder:text-white/25 focus:border-white/25"
                />
              </label>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {error ? <p className="mt-3 font-nhg text-sm text-red-300/90">{error}</p> : null}
        {info ? <p className="mt-3 font-nhg text-sm text-emerald-300/80">{info}</p> : null}

        <button
          type="submit"
          disabled={busy || !configured}
          className="mt-4 w-full rounded-lg bg-white py-2.5 font-nhg text-sm font-medium text-[#0c0c0d] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Working…' : sent ? 'Verify code' : 'Email me a code'}
        </button>

        {sent ? (
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void requestCode()}
              className="w-full rounded-lg border border-white/10 py-2 font-mono text-[11px] text-white/45 hover:text-white/70"
            >
              Resend code
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setSent(false)
                setOtp('')
                setInfo(null)
                setError(null)
              }}
              className="w-full rounded-lg border border-transparent py-2 font-mono text-[11px] text-white/30 hover:text-white/55"
            >
              Use a different email
            </button>
          </div>
        ) : null}
      </motion.form>

      <p className="mt-8 font-mono text-[11px] text-white/30">
        Need access? Book a call on the main site first.{' '}
        <Link to="/" className="text-white/45 hover:text-white">
          Back to site
        </Link>
      </p>
    </div>
  )
}
