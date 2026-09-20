import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, User, Layers } from 'lucide-react'
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
  },
  { name: 'Portal', url: '/portal', Icon: PortalIcon, match: (p: string) => p.startsWith('/portal') },
]

const GOLD = '#c4a574'
/** Brown idle after scroll (previous look) */
const BROWN = 'rgba(44, 37, 32, 0.9)'

export default function TubelightNav() {
  const { pathname } = useLocation()
  const active = items.find((i) => i.match(pathname))?.name ?? items[0].name
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setReady(true), [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      // Past ~hero fold → brown. On hero → sky frost.
      setScrolled(y > window.innerHeight * 0.55)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const id = window.setInterval(onScroll, 140)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-5 md:hidden">
      <motion.div
        className="flex items-center gap-1 rounded-full border px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        initial={false}
        animate={{
          backgroundColor: scrolled ? BROWN : 'rgba(15, 33, 48, 0.55)',
          borderColor: scrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.22)',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          // Extra frost when on hero so sky video peeks through
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(20px)',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(20px)',
        }}
      >
        {items.map(({ name, url, Icon }) => {
          const isActive = active === name
          return (
            <Link
              key={name}
              to={url}
              className={cn(
                'relative flex items-center gap-2 rounded-full px-4 py-2.5 font-nhg text-[13px] font-medium no-underline transition-colors',
                isActive ? 'text-espresso' : 'text-white/55 hover:text-white/85',
              )}
            >
              {isActive && ready && (
                <motion.div
                  layoutId="tubelight-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: GOLD }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                >
                  <div
                    className="absolute -top-1.5 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full"
                    style={{ background: GOLD }}
                  >
                    <div
                      className="absolute -left-2 -top-2 h-5 w-12 rounded-full blur-md"
                      style={{ background: `${GOLD}55` }}
                    />
                    <div
                      className="absolute -top-1 left-0 h-4 w-8 rounded-full blur-sm"
                      style={{ background: `${GOLD}44` }}
                    />
                  </div>
                </motion.div>
              )}
              <Icon size={16} strokeWidth={2} className="relative z-[1] shrink-0" aria-hidden />
              <span className="relative z-[1]">{name}</span>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
