import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Home, Megaphone, Menu, Palette, User, X, type LucideIcon } from 'lucide-react'
import { BrandInline } from '@/components/brand/BrandInline'
import { PortalIcon } from '@/components/ui/icons-portal'
import { useNavTuner } from '@/context/NavTunerContext'
import { useIntroTuner } from '@/context/IntroTunerContext'
import { cn } from '@/lib/utils'

const CAPABILITIES = [
  {
    label: 'Web Development',
    href: '/capabilities/web-development',
    blurb: 'Sites that sell on phones first.',
    featured: true,
  },
  {
    label: 'Ad Management',
    href: '/capabilities/ad-management',
    blurb: 'Paid reach aimed at real leads.',
    featured: false,
  },
  {
    label: 'Creative Studio',
    href: '/capabilities/creative-studio',
    blurb: 'Brand, video, and campaign assets.',
    featured: false,
  },
] as const

/** Railway-style accordion section */
function MobileAccordion({
  title,
  children,
  defaultOpen = false,
  delay = 0,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  delay?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/10"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-nhg text-[1.55rem] font-medium tracking-tight text-white">{title}</span>
        <ChevronDown
          size={20}
          className={cn('text-white/50 transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 pb-5">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Menu card. graphicSlot:
 * - 'reserve' = empty clear box (Zach drops art later) — used for Web Dev + Home
 * - 'none' = no right box
 * - icon = Lucide in the soft box
 */
function MobileMenuCard({
  to,
  title,
  blurb,
  onNavigate,
  graphicSlot = 'none',
  Icon,
}: {
  to: string
  title: string
  blurb: string
  onNavigate: () => void
  graphicSlot?: 'reserve' | 'none' | 'icon'
  Icon?: LucideIcon | ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}) {
  const showSlot = graphicSlot === 'reserve' || graphicSlot === 'icon'
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="relative flex min-h-[76px] items-center overflow-hidden rounded-2xl bg-white/[0.06] px-4 py-3.5 no-underline ring-1 ring-white/10 transition hover:bg-white/[0.09]"
    >
      <div className={cn('relative z-[1] min-w-0 flex-1', showSlot && 'pr-16')}>
        <p className="m-0 font-nhg text-[16px] font-semibold tracking-tight text-white">{title}</p>
        <p className="m-0 mt-1 font-nhg text-[12px] leading-snug text-white/45">{blurb}</p>
      </div>
      {showSlot ? (
        <span
          className="pointer-events-none absolute right-3 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-xl bg-white/[0.04]"
          aria-hidden
        >
          {graphicSlot === 'icon' && Icon ? (
            <Icon size={22} strokeWidth={1.6} className="text-white/70" />
          ) : null}
        </span>
      ) : null}
    </Link>
  )
}

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
  const [forceHidden, setForceHidden] = useState(false)

  // Tell TubelightNav to animate out while the hamburger overlay is open
  useEffect(() => {
    document.documentElement.setAttribute('data-mobile-menu', open ? '1' : '0')
    return () => document.documentElement.removeAttribute('data-mobile-menu')
  }, [open])

  // Web builds lightbox (and similar overlays) hide the bar while open
  useEffect(() => {
    const sync = () =>
      setForceHidden(document.documentElement.dataset.mrHideNav === '1')
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mr-hide-nav'],
    })
    return () => mo.disconnect()
  }, [])
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
    const onScroll = () => {
      setScrolled(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
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
          'inline-flex items-center gap-1 font-nhg text-[13px] font-medium tracking-wide transition-opacity hover:opacity-70',
          capsActive ? 'opacity-100' : 'opacity-90',
          tone === 'dark' && 'text-home-on-light/80',
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
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-full z-50 w-[min(560px,92vw)] -translate-x-1/2 pt-5"
            role="menu"
          >
            <div className="overflow-hidden rounded-[18px] border border-home-line/25 bg-home-surface-dark/96 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* Big left feature — drop a transparent PNG in /public/nav later */}
                <Link
                  to={CAPABILITIES[0].href}
                  role="menuitem"
                  onClick={() => setCapsOpen(false)}
                  className={cn(
                    'relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[14px] border border-home-line/20 p-5 no-underline transition-[filter] hover:brightness-110',
                    pathname === CAPABILITIES[0].href && 'ring-1 ring-home-acid/35',
                  )}
                  style={{
                    background:
                      'linear-gradient(145deg, var(--home-bg-dark) 0%, var(--home-surface-dark) 55%, var(--home-bg-dark) 100%)',
                  }}
                >
                  <motion.div
                    key="caps-web-art"
                    aria-hidden
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute bottom-[-8%] right-[-6%] z-0 max-h-[90%] select-none"
                    style={{ width: `clamp(9rem, ${nav.capsWebArtW}%, 16rem)` }}
                  >
                    <img
                      src="/nav/caps-web-art.png?v=5"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="h-auto w-full object-contain object-right-bottom"
                      style={{
                        opacity: nav.capsWebArtOpacity,
                        transform: `translate(${nav.capsWebArtX}px, ${nav.capsWebArtY}px) scale(${nav.capsWebArtScale})`,
                        transformOrigin: 'right bottom',
                      }}
                    />
                  </motion.div>
                  <div className="relative z-[1]">
                    <p className="m-0 font-nhg text-[17px] font-semibold text-home-on-dark">
                      {CAPABILITIES[0].label}
                    </p>
                    <p className="mt-1.5 m-0 max-w-[22ch] font-nhg text-[13px] leading-snug text-home-muted">
                      {CAPABILITIES[0].blurb}
                    </p>
                  </div>
                  <span className="relative z-[1] font-switzer text-[10px] uppercase tracking-[0.14em] text-home-acid/70">
                    Open
                  </span>
                </Link>

                <div className="flex flex-col gap-2">
                  {CAPABILITIES.filter((c) => !c.featured).map((c) => (
                    <Link
                      key={c.href}
                      to={c.href}
                      role="menuitem"
                      onClick={() => setCapsOpen(false)}
                      className={cn(
                        'flex flex-1 flex-col justify-center rounded-[14px] border border-home-line/20 px-4 py-4 no-underline transition-[filter] hover:brightness-110',
                        pathname === c.href && 'ring-1 ring-home-acid/35',
                      )}
                      style={{
                        background:
                          'linear-gradient(145deg, var(--home-surface-dark) 0%, var(--home-bg-dark) 100%)',
                      }}
                    >
                      <p className="m-0 font-nhg text-[15px] font-semibold text-home-on-dark">{c.label}</p>
                      <p className="mt-1 m-0 font-nhg text-[12px] leading-snug text-home-muted">
                        {c.blurb}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const logoSrc =
    nav.logoStyle === 'smooth'
      ? brandTone === 'light'
        ? '/assets/mrlogo-smooth-white.png'
        : '/assets/mrlogo-smooth-black.png'
      : brandTone === 'light'
        ? '/assets/mrlogo-short-white.png'
        : '/assets/mrlogo-short-black.png'

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
          className="shrink-0 object-contain"
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
              ? 'border border-home-on-dark/25 bg-home-on-dark/10 text-home-on-dark'
              : 'border border-home-line/40 bg-home-surface-light/40 text-home-on-light',
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
          className="flex items-center justify-between gap-3 overflow-visible rounded-full border border-[#17251c]/45 px-4 py-2.5 shadow-[0_12px_32px_-15px_rgba(10,22,12,0.26)] backdrop-blur-[22px] md:px-5"
          style={
            {
              background: `color-mix(in srgb, #F3F0E8 ${Math.round(Math.max(0.9, nav.glassMenuOpacity ?? 0.92) * 100)}%, transparent)`,
            } as CSSProperties
          }
        >
          <Link to="/" className="shrink-0 no-underline">
            <BrandInline tone="dark" className="text-[14px]" />
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink
              link={links[0]}
              className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-home-on-light/80 no-underline transition-opacity hover:opacity-100"
            />
            <NavLink
              link={links[1]}
              className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-home-on-light/80 no-underline transition-opacity hover:opacity-100"
            />
            <div className="relative text-home-on-light/80">
              <CapsDropdown tone="dark" />
            </div>
            <NavLink
              link={links[2]}
              className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-home-on-light/80 no-underline transition-opacity hover:opacity-100"
            />
          </nav>
          <Link
            to="/start"
            className="inline-flex shrink-0 items-center gap-1 rounded-[8px] px-3.5 py-1.5 font-nhg text-[13px] font-medium no-underline"
            style={{ background: '#C8FF3D', color: '#080909' }}
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

  // Lightbox / full-screen overlays set data-mr-hide-nav — bar gone until they clear it
  if (forceHidden) return null

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
                ? 'border-b border-white/10 bg-[#080909]/55 backdrop-blur-xl'
                : 'bg-transparent',
          )}
          style={{ minHeight: nav.barHeight }}
        >
          {glassTop}
        </motion.header>

        <AnimatePresence>{scrolled && chromeVisible ? scrolledPill : null}</AnimatePresence>

        {/* Full-screen mobile overlay — Railway-style accordion cards */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mob-overlay"
              initial={{ opacity: 0, y: '-8%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-6%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] flex flex-col bg-[#0B0D13] md:hidden"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <Link to="/" className="no-underline" onClick={() => setOpen(false)}>
                  <BrandInline tone="light" stacked />
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col overflow-y-auto px-4 pb-8">
                {/* Product-style accordion: Capabilities */}
                <MobileAccordion
                  title="Capabilities"
                  defaultOpen
                  delay={0.06}
                >
                  {CAPABILITIES.map((c) => {
                    const isWeb = c.href.includes('web-development')
                    const isAds = c.href.includes('ad-management')
                    return (
                      <MobileMenuCard
                        key={c.href}
                        to={c.href}
                        title={c.label}
                        blurb={c.blurb}
                        onNavigate={() => setOpen(false)}
                        graphicSlot={isWeb ? 'reserve' : 'icon'}
                        Icon={isAds ? Megaphone : isWeb ? undefined : Palette}
                      />
                    )
                  })}
                </MobileAccordion>

                <MobileAccordion title="Explore" delay={0.12}>
                  <MobileMenuCard
                    to="/"
                    title="Home"
                    blurb="Back to the Maximus Reach homepage."
                    onNavigate={() => setOpen(false)}
                    graphicSlot="reserve"
                  />
                  <MobileMenuCard
                    to="/about"
                    title="About"
                    blurb="Who we are and how we ship."
                    onNavigate={() => setOpen(false)}
                    graphicSlot="icon"
                    Icon={User}
                  />
                  <MobileMenuCard
                    to="/portal"
                    title="Portal"
                    blurb="Client login and project hub."
                    onNavigate={() => setOpen(false)}
                    graphicSlot="icon"
                    Icon={PortalIcon}
                  />
                </MobileAccordion>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.32 }}
                  className="mt-auto flex gap-3 pt-8"
                >
                  <Link
                    to="/portal"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-xl border border-white/25 px-4 py-3.5 font-nhg text-[14px] font-medium text-white no-underline transition hover:border-white/45"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/start"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-xl px-4 py-3.5 font-nhg text-[14px] font-medium no-underline transition hover:opacity-90"
                    style={{ background: nav.ctaBg, color: nav.ctaText }}
                  >
                    {nav.ctaLabel}
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
