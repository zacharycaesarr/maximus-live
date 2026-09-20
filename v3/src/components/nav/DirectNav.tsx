import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Home, Menu, User, X } from 'lucide-react'
import { BrandInline } from '@/components/brand/BrandInline'
import { PortalIcon } from '@/components/ui/icons-portal'
import { useNavTuner } from '@/context/NavTunerContext'
import { useIntroTuner } from '@/context/IntroTunerContext'
import { cn } from '@/lib/utils'

const CAPABILITIES = [
  { label: 'Web Development', href: '/capabilities/web-development' },
  { label: 'Ad Management', href: '/capabilities/ad-management' },
  { label: 'Creative Studio', href: '/capabilities/creative-studio' },
]

function NotchEar({ side, color }: { side: 'left' | 'right'; color: string }) {
  const d =
    side === 'left'
      ? 'M16 0v16C16 7.163 8.837 0 0 0h16z'
      : 'M0 0v16C0 7.163 7.163 0 16 0H0z'
  return (
    <span
      className={`pointer-events-none absolute top-0 ${side === 'left' ? '-left-4' : '-right-4'}`}
      aria-hidden
      style={{ color, width: 16, height: 16 }}
    >
      <svg viewBox="0 0 16 16" width="16" height="16">
        <path d={d} fill="currentColor" />
      </svg>
    </span>
  )
}

export default function DirectNav({ overlay = false }: { overlay?: boolean }) {
  const nav = useNavTuner()
  const intro = useIntroTuner()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [capsOpen, setCapsOpen] = useState(false)
  // grace period so the dropdown doesn't vanish the moment the mouse slips off
  const capsCloseTimer = useRef<number | undefined>(undefined)
  const openCaps = () => {
    window.clearTimeout(capsCloseTimer.current)
    setCapsOpen(true)
  }
  const closeCapsSoon = () => {
    window.clearTimeout(capsCloseTimer.current)
    capsCloseTimer.current = window.setTimeout(() => setCapsOpen(false), 1600)
  }
  useEffect(() => () => window.clearTimeout(capsCloseTimer.current), [])
  const [scrolled, setScrolled] = useState(false)
  const isNotch = nav.barShape === 'notch'
  const isGlass = nav.barShape === 'glass'
  const chromeVisible = intro.showChrome || (!intro.enabled && !intro.preview)
  const fadeSec = Math.max(0.2, intro.fadeInMs / 1000)
  const capsActive = pathname.startsWith('/capabilities')

  useEffect(() => {
    const threshold = nav.scrollSolidAt ?? 48
    const readY = () =>
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0

    const onScroll = () => {
      setScrolled(readY() > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // Lenis / smooth scroll can skip some native events — light poll keeps pill in sync
    const id = window.setInterval(onScroll, 120)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(id)
    }
  }, [nav.scrollSolidAt])

  const links = [
    { label: 'Home', href: '/', Icon: Home, route: true },
    { label: 'About', href: '/about', Icon: User, route: true },
    { label: 'Portal', href: '/portal', Icon: PortalIcon, route: true },
  ]

  const brandTone = overlay && !scrolled ? 'light' : isGlass && !scrolled ? 'dark' : 'light'
  const linkColorOverride = overlay && !scrolled ? '#ffffff' : nav.linkColor

  const CapsDropdown = ({ tone }: { tone: 'light' | 'dark' }) => (
    <div
      className="relative"
      onMouseEnter={openCaps}
      onMouseLeave={closeCapsSoon}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 font-serotiva text-[13px] font-medium tracking-wide transition-opacity hover:opacity-70',
          capsActive ? 'opacity-100' : 'opacity-90',
          tone === 'dark' && 'text-espresso/80',
        )}
        style={{ color: tone === 'light' ? linkColorOverride : undefined }}
        aria-expanded={capsOpen}
        aria-haspopup="menu"
        onClick={() => setCapsOpen((v) => !v)}
      >
        Capabilities
        <ChevronDown
          size={13}
          className={cn('transition-transform duration-200', capsOpen && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {capsOpen && (
          /* pt-3 keeps a hover bridge so the gap doesn't close the menu before you click */
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 w-[240px] -translate-x-1/2 pt-5"
            role="menu"
          >
            <div className="overflow-hidden rounded-[11px] border border-white/55 bg-[#f7f7f5]/92 py-1.5 shadow-[0_16px_40px_rgba(26,22,18,0.14)] backdrop-blur-[8px]">
              {CAPABILITIES.map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  role="menuitem"
                  onClick={() => setCapsOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 font-serotiva text-[13px] font-medium no-underline transition-colors',
                    pathname === c.href
                      ? 'bg-espresso/[0.06] text-espresso'
                      : 'text-espresso/70 hover:bg-espresso/[0.04] hover:text-espresso',
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const logoSrc =
    nav.logoStyle === 'smooth' ? '/assets/mm-logo.svg' : '/assets/mrlogo-short.jpg'

  const brand = (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center no-underline"
      style={{ gap: nav.logoGap }}
      aria-label="Reach Further home"
    >
      {nav.showLogo && (
        <img
          src={logoSrc}
          alt=""
          className={cn('shrink-0 object-contain', brandTone === 'dark' ? 'brightness-0' : 'brightness-0 invert')}
          width={nav.logoSize}
          height={nav.logoSize}
          style={{
            width: nav.logoSize,
            height: nav.logoSize,
            transform: `translate(${nav.logoOffsetX}px, ${nav.logoOffsetY}px)`,
          }}
        />
      )}
      <BrandInline tone={brandTone} stacked />
    </Link>
  )

  const NavLink = ({
    link,
    className,
    style,
    onClick,
  }: {
    link: (typeof links)[number]
    className?: string
    style?: CSSProperties
    onClick?: () => void
  }) =>
    link.route ? (
      <Link to={link.href} className={className} style={style} onClick={onClick}>
        <link.Icon size={14} aria-hidden />
        {link.label}
      </Link>
    ) : (
      <a href={link.href} className={className} style={style} onClick={onClick}>
        <link.Icon size={14} aria-hidden />
        {link.label}
      </a>
    )

  const glassTop = (
    <div
      className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-8"
      style={{ color: linkColorOverride, minHeight: nav.barHeight }}
    >
      {brand}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
        <NavLink
          link={links[0]}
          className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
          style={{ color: linkColorOverride }}
        />
        <NavLink
          link={links[1]}
          className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
          style={{ color: linkColorOverride }}
        />
        <CapsDropdown tone="light" />
        <NavLink
          link={links[2]}
          className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
          style={{ color: linkColorOverride }}
        />
      </nav>
      <div className="flex items-center gap-2">
        <Link
          to="/start"
          className="hidden items-center gap-1.5 rounded-[8px] px-4 py-2 font-nhg text-[13px] font-medium no-underline transition-transform hover:scale-[1.02] md:inline-flex"
          style={{ background: nav.ctaBg, color: nav.ctaText }}
        >
          {nav.ctaLabel}
          {nav.showCtaArrow && <ArrowUpRight size={14} strokeWidth={2.25} />}
        </Link>
        <button
          type="button"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md backdrop-blur-sm md:hidden',
            overlay && !scrolled
              ? 'border border-white/25 bg-white/10 text-white'
              : 'border border-espresso/15 bg-white/40 text-espresso',
          )}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </div>
  )

  const scrolledPill = (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl"
      >
        <div
          className="flex items-center justify-between gap-3 overflow-visible rounded-full border border-espresso/10 px-4 py-2.5 shadow-[0_12px_40px_rgba(44,37,32,0.12)] backdrop-blur-xl md:px-5"
          style={
            {
              background: `color-mix(in srgb, ${nav.glassMenuBg} ${Math.round((nav.glassMenuOpacity ?? 0.92) * 100)}%, transparent)`,
            } as CSSProperties
          }
        >
          <Link to="/" className="shrink-0 no-underline">
            <BrandInline tone="dark" className="text-[14px]" />
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink
              link={links[0]}
              className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-espresso/80 no-underline transition-opacity hover:opacity-100"
            />
            <NavLink
              link={links[1]}
              className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-espresso/80 no-underline transition-opacity hover:opacity-100"
            />
            <div className="relative text-espresso/80">
              <CapsDropdown tone="dark" />
            </div>
            <NavLink
              link={links[2]}
              className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-espresso/80 no-underline transition-opacity hover:opacity-100"
            />
          </nav>
          <Link
            to="/start"
            className="inline-flex shrink-0 items-center gap-1 rounded-[8px] px-3.5 py-1.5 font-nhg text-[13px] font-medium no-underline"
            style={{ background: nav.ctaBg, color: nav.ctaText }}
          >
            {nav.ctaLabel}
            {nav.showCtaArrow && <ArrowUpRight size={14} strokeWidth={2.25} />}
          </Link>
        </div>
      </motion.div>
    </div>
  )

  const classicInner = (
    <div
      className={`mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-8 ${
        isNotch ? 'relative w-full max-w-[920px]' : ''
      }`}
      style={{ color: nav.linkColor, minHeight: nav.barHeight }}
    >
      {brand}
      <nav
        className={`${
          isNotch
            ? 'ml-auto hidden items-center gap-5 md:flex'
            : 'absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex'
        }`}
      >
        <NavLink
          link={links[0]}
          className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
          style={{ color: nav.linkColor }}
        />
        <NavLink
          link={links[1]}
          className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
          style={{ color: nav.linkColor }}
        />
        <CapsDropdown tone="light" />
        <NavLink
          link={links[2]}
          className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
          style={{ color: nav.linkColor }}
        />
      </nav>
      <div className="flex items-center gap-2">
        <Link
          to="/start"
          className="hidden items-center gap-1.5 rounded-[8px] px-4 py-2 font-nhg text-[13px] font-medium no-underline transition-transform hover:scale-[1.02] md:inline-flex"
          style={{ background: nav.ctaBg, color: nav.ctaText }}
        >
          {nav.ctaLabel}
          {nav.showCtaArrow && <ArrowUpRight size={14} strokeWidth={2.25} />}
        </Link>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-black md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </div>
  )

  if (isGlass) {
    return (
      <>
        <motion.header
          initial={{ y: -36, opacity: 0 }}
          animate={{ y: chromeVisible ? 0 : -16, opacity: chromeVisible && !scrolled ? 1 : 0 }}
          transition={{ duration: Math.max(0.35, fadeSec), ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'z-40 w-full transition-colors duration-300',
            overlay ? 'fixed inset-x-0 top-0' : 'relative',
            scrolled || !chromeVisible
              ? 'pointer-events-none'
              : overlay
                ? 'border-b border-white/10 bg-white/10 backdrop-blur-md'
                : 'bg-transparent',
          )}
          style={{ minHeight: nav.barHeight }}
        >
          {glassTop}
        </motion.header>

        <AnimatePresence>{scrolled && chromeVisible ? scrolledPill : null}</AnimatePresence>

        {/* Full-screen mobile overlay — lives outside motion.header so fixed stacking isn't broken by transform */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mob-overlay"
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] flex flex-col bg-espresso/[0.97] backdrop-blur-2xl md:hidden"
            >
              {/* top bar */}
              <div className="flex items-center justify-between px-5 py-5">
                <Link to="/" className="no-underline" onClick={() => setOpen(false)}>
                  <BrandInline tone="light" stacked />
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* nav items */}
              <nav className="flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-24">
                {[links[0], links[1]].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/10"
                  >
                    <Link
                      to={link.href}
                      className="flex w-full items-center gap-4 py-6 font-nhg text-[1.7rem] font-light text-white/70 no-underline transition-colors hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      <link.Icon size={22} aria-hidden />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/10"
                >
                  <p className="pt-6 font-nhg text-[11px] uppercase tracking-[0.18em] text-white/30">
                    Capabilities
                  </p>
                  {CAPABILITIES.map((c) => (
                    <Link
                      key={c.href}
                      to={c.href}
                      className="block py-3.5 font-nhg text-[1.35rem] font-light text-white/70 no-underline transition-colors hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.36, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/10"
                >
                  <Link
                    to={links[2].href}
                    className="flex w-full items-center gap-4 py-6 font-nhg text-[1.7rem] font-light text-white/70 no-underline transition-colors hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    <PortalIcon size={22} aria-hidden />
                    Portal
                  </Link>
                </motion.div>

                {/* CTA at bottom of overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                  className="mt-8"
                >
                  <Link
                    to="/start"
                    className="flex items-center justify-center gap-2 rounded-full px-6 py-4 font-nhg text-base font-medium no-underline transition-opacity hover:opacity-80"
                    style={{ background: nav.ctaBg, color: nav.ctaText }}
                    onClick={() => setOpen(false)}
                  >
                    {nav.ctaLabel}
                    {nav.showCtaArrow && <ArrowUpRight size={16} strokeWidth={2.25} />}
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: chromeVisible ? 0 : -8, opacity: chromeVisible ? 1 : 0 }}
      transition={{ duration: fadeSec, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-40 w-full overflow-visible ${isNotch ? 'flex justify-center bg-transparent' : ''}`}
      style={
        isNotch
          ? { height: 'auto', paddingTop: 0, pointerEvents: chromeVisible ? 'auto' : 'none' }
          : {
              background: nav.barColor,
              minHeight: nav.barHeight,
              height: 'auto',
              pointerEvents: chromeVisible ? 'auto' : 'none',
            }
      }
    >
      {isNotch ? (
        <div
          className="relative mt-0 w-[min(920px,calc(100vw-24px))] border border-t-0 border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          style={{
            background: nav.barColor,
            borderRadius: `0 0 ${nav.notchRadius}px ${nav.notchRadius}px`,
            minHeight: nav.barHeight,
          }}
        >
          <NotchEar side="left" color={nav.barColor} />
          <NotchEar side="right" color={nav.barColor} />
          {classicInner}
        </div>
      ) : (
        classicInner
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full border-t border-white/10 bg-black px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.slice(0, 2).map((link) => (
                <NavLink
                  key={link.href}
                  link={link}
                  className="inline-flex items-center gap-2 font-nhg text-base text-white no-underline"
                  onClick={() => setOpen(false)}
                />
              ))}
              <p className="mt-1 font-nhg text-[10px] uppercase tracking-[0.16em] text-white/35">
                Capabilities
              </p>
              {CAPABILITIES.map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  className="font-nhg text-base text-white/85 no-underline"
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
              <NavLink
                link={links[2]}
                className="mt-1 inline-flex items-center gap-2 font-nhg text-base text-white no-underline"
                onClick={() => setOpen(false)}
              />
              <Link
                to="/start"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-[8px] px-4 py-3 font-nhg text-sm font-medium no-underline"
                style={{ background: nav.ctaBg, color: nav.ctaText }}
                onClick={() => setOpen(false)}
              >
                {nav.ctaLabel}
                {nav.showCtaArrow && <ArrowUpRight size={14} />}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
