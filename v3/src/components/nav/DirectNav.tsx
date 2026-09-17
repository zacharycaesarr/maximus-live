import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Briefcase, Menu, Rocket, User, X } from 'lucide-react'
import { BrandInline } from '@/components/brand/BrandInline'
import { useNavTuner } from '@/context/NavTunerContext'
import { useIntroTuner } from '@/context/IntroTunerContext'
import { cn } from '@/lib/utils'

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

export default function DirectNav() {
  const nav = useNavTuner()
  const intro = useIntroTuner()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isNotch = nav.barShape === 'notch'
  const isGlass = nav.barShape === 'glass'
  const chromeVisible = intro.showChrome || (!intro.enabled && !intro.preview)
  const fadeSec = Math.max(0.2, intro.fadeInMs / 1000)

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
    { label: 'About', href: '/about', Icon: User, route: true },
    { label: 'Work', href: '/work', Icon: Briefcase, route: true },
    { label: 'Start', href: '/start', Icon: Rocket, route: true },
  ]

  const brandTone = isGlass && !scrolled ? 'dark' : 'light'

  const brand = (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center no-underline"
      style={{ gap: nav.logoGap }}
      aria-label="Maximus Reach home"
    >
      {nav.showLogo && (
        <img
          src="/assets/mm-logo.svg"
          alt=""
          className={cn('shrink-0', brandTone === 'dark' ? 'brightness-0' : 'brightness-0 invert')}
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
      style={{ color: nav.linkColor, minHeight: nav.barHeight }}
    >
      {brand}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
        {links.map((link) => (
          <NavLink
            key={link.href}
            link={link}
            className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
            style={{ color: nav.linkColor }}
          />
        ))}
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-espresso/15 bg-white/40 text-espresso backdrop-blur-sm md:hidden"
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
          className="flex items-center justify-between gap-3 rounded-full border border-espresso/10 px-4 py-2.5 shadow-[0_12px_40px_rgba(44,37,32,0.12)] backdrop-blur-xl md:px-5"
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
            {links.map((link) => (
              <NavLink
                key={`pill-${link.href}`}
                link={link}
                className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium text-espresso/80 no-underline transition-opacity hover:opacity-100"
              />
            ))}
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
        {links.map((link) => (
          <NavLink
            key={link.href}
            link={link}
            className="inline-flex items-center gap-1.5 font-nhg text-[13px] font-medium tracking-wide no-underline transition-opacity hover:opacity-70"
            style={{ color: nav.linkColor }}
          />
        ))}
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
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: chromeVisible ? 0 : -8, opacity: chromeVisible && !scrolled ? 1 : 0 }}
          transition={{ duration: fadeSec, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative z-40 w-full transition-colors duration-300',
            scrolled || !chromeVisible ? 'pointer-events-none' : 'bg-transparent',
          )}
          style={{ minHeight: nav.barHeight }}
        >
          {glassTop}
          <AnimatePresence>
            {open && !scrolled && chromeVisible && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 right-0 top-full border-t border-espresso/10 bg-cream/95 px-4 py-4 backdrop-blur-md md:hidden"
              >
                <div className="flex flex-col gap-3">
                  {links.map((link) => (
                    <NavLink
                      key={link.href}
                      link={link}
                      className="inline-flex items-center gap-2 font-nhg text-base text-espresso no-underline"
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
        <AnimatePresence>{scrolled && chromeVisible ? scrolledPill : null}</AnimatePresence>
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
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  link={link}
                  className="inline-flex items-center gap-2 font-nhg text-base text-white no-underline"
                  onClick={() => setOpen(false)}
                />
              ))}
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
