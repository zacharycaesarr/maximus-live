import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState, type CSSProperties } from 'react'
import { LevaPanel, useCreateStore, useControls, folder, button } from 'leva'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { usePortalAuth } from '@/portal/auth/AuthContext'
import '@/portal/portal.css'

const THEME_KEY = 'mr-v3-portal-theme'
const ACCENT_KEY = 'mr-v3-portal-accent'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors',
    isActive ? 'bg-white/10 text-[var(--portal-fg)]' : 'text-[var(--portal-muted)] hover:text-[var(--portal-fg)]',
  ].join(' ')

function readTheme(): 'dark' | 'light' {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function readAccent() {
  try {
    return localStorage.getItem(ACCENT_KEY) || '#f97316'
  } catch {
    return '#f97316'
  }
}

/** Dark shell for every /portal page. Homepage never mounts this. */
export default function PortalLayout() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => readTheme())
  const { ready, session, profile, isAdmin, configured, signOut } = usePortalAuth()

  const { accent, cardRadius, labelOpacity, glowPad, glowNudgeX, glowNudgeY } = useControls(
    {
      Portal: folder(
        {
          accent: { value: readAccent(), label: 'accent' },
          cardRadius: { value: 12, min: 4, max: 24, step: 1, label: 'card radius' },
          labelOpacity: { value: 0.7, min: 0.35, max: 1, step: 0.05, label: 'label pop' },
          remember: button(() => {
            try {
              localStorage.setItem(ACCENT_KEY, accent)
              localStorage.setItem('mr-v3-portal-card-radius', String(cardRadius))
              localStorage.setItem('mr-v3-portal-label-opacity', String(labelOpacity))
              localStorage.setItem('mr-v3-portal-glow-pad', String(glowPad))
              localStorage.setItem('mr-v3-portal-glow-x', String(glowNudgeX))
              localStorage.setItem('mr-v3-portal-glow-y', String(glowNudgeY))
            } catch {
              /* ignore */
            }
          }),
          revert: button(() => {
            try {
              localStorage.removeItem(ACCENT_KEY)
              localStorage.removeItem('mr-v3-portal-card-radius')
              localStorage.removeItem('mr-v3-portal-label-opacity')
              localStorage.removeItem('mr-v3-portal-glow-pad')
              localStorage.removeItem('mr-v3-portal-glow-x')
              localStorage.removeItem('mr-v3-portal-glow-y')
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
        },
        { collapsed: false },
      ),
      'Pay card glow': folder(
        {
          glowPad: {
            value: Number(localStorage.getItem('mr-v3-portal-glow-pad') || 6),
            min: 0,
            max: 18,
            step: 1,
            label: 'outline pad',
          },
          glowNudgeX: {
            value: Number(localStorage.getItem('mr-v3-portal-glow-x') || 0),
            min: -12,
            max: 12,
            step: 1,
            label: 'outline X',
          },
          glowNudgeY: {
            value: Number(localStorage.getItem('mr-v3-portal-glow-y') || 0),
            min: -12,
            max: 12,
            step: 1,
            label: 'outline Y',
          },
        },
        { collapsed: true },
      ),
    },
    { store },
  )

  useEffect(() => {
    document.title = 'Portal · Maximus Reach'
    document.documentElement.dataset.portal = '1'
    document.documentElement.dataset.portalTheme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
    return () => {
      delete document.documentElement.dataset.portal
      delete document.documentElement.dataset.portalTheme
    }
  }, [theme])

  const statusLabel = !configured
    ? 'add VITE_ keys in .env.local'
    : !ready
      ? 'checking login…'
      : session
        ? isAdmin
          ? `signed in · admin · ${profile?.email ?? ''}`
          : `signed in · ${profile?.email ?? session.user.email ?? ''}`
        : 'supabase connected · signed out'

  return (
    <div
      className="portal-root min-h-screen"
      style={
        {
          ['--portal-accent' as string]: accent,
          ['--portal-card-radius' as string]: `${cardRadius}px`,
          ['--portal-label-opacity' as string]: String(labelOpacity),
          ['--pay-glow-pad' as string]: `${glowPad}px`,
          ['--pay-glow-x' as string]: `${glowNudgeX}px`,
          ['--pay-glow-y' as string]: `${glowNudgeY}px`,
        } as CSSProperties
      }
    >
      <header className="portal-header sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="font-nhg text-sm font-medium tracking-tight text-[var(--portal-fg)] no-underline hover:opacity-80"
            >
              Maximus Reach
            </Link>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--portal-muted)] sm:inline">
              client portal
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {!session ? (
              <NavLink to="/portal/login" className={navLinkClass}>
                login
              </NavLink>
            ) : null}
            <NavLink to="/portal/dashboard" className={navLinkClass}>
              dashboard
            </NavLink>
            {isAdmin ? (
              <NavLink to="/portal/admin" className={navLinkClass}>
                admin
              </NavLink>
            ) : null}
            {session ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-md px-3 py-1.5 font-mono text-[11px] text-[var(--portal-muted)] transition-colors hover:text-[var(--portal-fg)]"
              >
                sign out
              </button>
            ) : null}
            <button
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="relative ml-1 flex h-8 w-14 items-center rounded-full border border-white/15 bg-white/5 px-1"
            >
              <motion.span
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0c0c0d]"
                animate={{ x: theme === 'dark' ? 0 : 22 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              >
                {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
              </motion.span>
            </button>
            <NavLink
              to="/"
              className="ml-1 rounded-md px-3 py-1.5 font-mono text-[11px] text-[var(--portal-muted)] transition-colors hover:text-[var(--portal-fg)]"
            >
              site
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-3 md:px-6">
        <p
          className={`inline-flex max-w-full items-center gap-2 truncate rounded-full border px-2.5 py-1 font-mono text-[10px] ${
            configured && session
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300/90'
              : configured
                ? 'border-white/10 bg-white/[0.03] text-[var(--portal-muted)]'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-200/90'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              configured && session ? 'bg-emerald-400' : configured ? 'bg-white/40' : 'bg-amber-400'
            }`}
          />
          {statusLabel}
        </p>
      </div>

      <motion.main
        className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Outlet />
      </motion.main>

      {isDev && (
        <div data-lenis-prevent className="mr-v3-leva-host" onWheel={(e) => e.stopPropagation()}>
          <LevaPanel
            key={mountKey}
            store={store}
            collapsed={{
              collapsed,
              onChange: (c) => {
                setCollapsed(c)
                if (!c) setMountKey((k) => k + 1)
              },
            }}
            titleBar={{ title: 'Maximus · Portal', filter: false }}
            oneLineLabels
          />
        </div>
      )}
    </div>
  )
}
