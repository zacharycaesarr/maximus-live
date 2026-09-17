import { Navigate } from 'react-router-dom'
import { usePortalAuth } from '@/portal/auth/AuthContext'

/** /portal → dashboard if logged in, otherwise login. */
export default function PortalIndex() {
  const { ready, session } = usePortalAuth()

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[var(--portal-accent,#f97316)]" />
      </div>
    )
  }

  return <Navigate to={session ? '/portal/dashboard' : '/portal/login'} replace />
}
