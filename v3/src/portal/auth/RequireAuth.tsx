import { Navigate, useLocation } from 'react-router-dom'
import { usePortalAuth } from '@/portal/auth/AuthContext'

function GateSpinner({ label }: { label: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[var(--portal-accent,#f97316)]" />
      <p className="font-mono text-[11px] tracking-wide text-white/40">{label}</p>
    </div>
  )
}

/** Blocks guests. Shows a short wait screen so the page does not flash private content. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, session, configured } = usePortalAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <div className="portal-card mx-auto max-w-md p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300/90">setup needed</p>
        <p className="mt-2 font-nhg text-sm text-white/60">
          Add your Supabase keys to `.env.local`, then restart the dev server.
        </p>
      </div>
    )
  }

  if (!ready) return <GateSpinner label="checking login…" />

  if (!session) {
    return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

/** Admin only. Regular clients get sent to their dashboard. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { ready, session, isAdmin, profile } = usePortalAuth()

  if (!ready) return <GateSpinner label="checking admin…" />
  if (!session) return <Navigate to="/portal/login" replace />
  if (!isAdmin) {
    return (
      <Navigate
        to="/portal/dashboard"
        replace
        state={{ deniedAdmin: true, role: profile?.role ?? 'client' }}
      />
    )
  }

  return <>{children}</>
}
