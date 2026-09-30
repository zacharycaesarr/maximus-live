import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, User, Layers, X } from 'lucide-react'
import { PortalIcon } from '@/components/ui/icons-portal'
import { cn } from '@/lib/utils'

const items = [
  { name: 'Home', url: '/', Icon: Home, match: (p: string) => p === '/' },
  { name: 'About', url: '/about', Icon: User, match: (p: string) => p.startsWith('/about') },
  {
    name: 'Work',
    url: '/capabilities/web-development',
    Icon: Layers,
    match: (p: string) => p.startsWith('/capabilities') || p.startsWith('/work'),
    sheet: true,
  },
  { name: 'Portal', url: '/portal', Icon: PortalIcon, match: (p: string) => p.startsWith('/portal') },
]

const WORK_LINKS = [
  { label: 'Web Development', href: '/capabilities/web-development' },
  { label: 'Ad Management', href: '/capabilities/ad-management' },
  { label: 'Creative Studio', href: '/capabilities/creative-studio' },
]

const ACID = '#C8FF3D'
const DARK_GLASS = 'rgba(8, 9, 9, 0.9)'

/**
 * Mobile bottom nav. Work opens an upward sheet.
 * Hides quickly when the hamburger overlay is open (data-mobile-menu).
 */
export default function TubelightNav() {
  const { pathname } = useLocation()
  const active = items.find((i) => i.match(pathname))?.name ?? items[0].name
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setReady(true), [])

  useEffect(() => {
    setWorkOpen(false)
  }, [pathname])

  useEffect(() => {
    const sync = () =>
      setMenuOpen(document.documentElement.getAttribute('data-mobile-menu') === '1')
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mobile-menu'],
    })
    return () => mo.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      setScrolled(y > window.innerHeight * 0.55)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const id = window.setInterval(onScroll, 400)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (!workOpen) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setWorkOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [workOpen])

  useEffect(() => {
    if (menuOpen) setWorkOpen(false)
  }, [menuOpen])

  return (
    <AnimatePresence>
      {!menuOpen ? (
        <motion.div
          key="tubelight"
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center px-4 pb-5 md:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence>
            {workOpen && (
              <>
                <motion.button
                  type="button"
                  aria-label="Close work menu"
                  className="fixed inset-0 z-[-1] bg-black/35"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setWorkOpen(false)}
                />
                <motion.div
                  role="menu"
                  aria-label="Work pages"
                  className="mb-3 w-full max-w-sm overflow-hidden rounded-[22px] border border-white/15 bg-[#11120E]/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="m-0 font-nhg text-[12px] font-medium uppercase tracking-[0.14em] text-white/55">
                      Work
                    </p>
                    <button
                      type="button"
                      aria-label="Close"
                      className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                      onClick={() => setWorkOpen(false)}
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  </div>
                  <ul className="m-0 list-none p-2">
                    {WORK_LINKS.map((link) => {
                      const on = pathname === link.href
                      return (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            role="menuitem"
                            onClick={() => setWorkOpen(false)}
                            className={cn(
                              'flex items-center rounded-[14px] px-3.5 py-3.5 font-nhg text-[15px] font-medium no-underline transition-colors',
                              on
                                ? 'bg-[#C8FF3D]/15 text-white'
                                : 'text-white/80 hover:bg-white/8 hover:text-white',
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <motion.div
            className="flex items-center gap-1 rounded-full border px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            initial={false}
            animate={{
              backgroundColor: scrolled ? DARK_GLASS : 'rgba(8, 9, 9, 0.55)',
              borderColor: scrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.22)',
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backdropFilter: scrolled ? 'blur(16px)' : 'blur(20px)',
              WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(20px)',
            }}
          >
            {items.map(({ name, url, Icon, sheet }) => {
              const isActive = active === name || (name === 'Work' && workOpen)
              if (sheet) {
                return (
                  <button
                    key={name}
                    type="button"
                    aria-expanded={workOpen}
                    aria-haspopup="menu"
                    onClick={() => setWorkOpen((o) => !o)}
                    className={cn(
                      'relative flex items-center gap-2 rounded-full px-4 py-2.5 font-nhg text-[13px] font-medium transition-colors',
                      isActive ? 'text-[#080909]' : 'text-white/55 hover:text-white/85',
                    )}
                  >
                    {isActive && ready && (
                      <motion.div
                        layoutId="tubelight-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: ACID }}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      >
                        <div
                          className="absolute -top-1.5 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full"
                          style={{ background: ACID }}
                        />
                      </motion.div>
                    )}
                    <Icon size={16} strokeWidth={2} className="relative z-[1] shrink-0" aria-hidden />
                    <span className="relative z-[1]">{name}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={name}
                  to={url}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-4 py-2.5 font-nhg text-[13px] font-medium no-underline transition-colors',
                    isActive ? 'text-[#080909]' : 'text-white/55 hover:text-white/85',
                  )}
                >
                  {isActive && ready && (
                    <motion.div
                      layoutId="tubelight-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: ACID }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    >
                      <div
                        className="absolute -top-1.5 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full"
                        style={{ background: ACID }}
                      />
                    </motion.div>
                  )}
                  <Icon size={16} strokeWidth={2} className="relative z-[1] shrink-0" aria-hidden />
                  <span className="relative z-[1]">{name}</span>
                </Link>
              )
            })}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
