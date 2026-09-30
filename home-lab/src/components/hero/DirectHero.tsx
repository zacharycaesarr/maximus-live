import { motion, type Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronDown, Rocket } from 'lucide-react'
import HeroKineticText from './HeroKineticText'
import HandReachLottie from './HandReachLottie'
import HeroBgParallax from './HeroBgParallax'
import HeroContentParallax from './HeroContentParallax'
import HeroVideoBackground from './HeroVideoBackground'
import { FlowButton } from '@/components/ui/flow-button'
import { PortalIcon } from '@/components/ui/icons-portal'
import { MeshWaveBackground } from '@/components/ui/mesh-wave-background'
import { cn } from '@/lib/utils'
import { useHeroTextTuner } from '@/context/HeroTextTunerContext'
import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'
import { useBgTuner } from '@/context/BgTunerContext'
import { useIntroTuner } from '@/context/IntroTunerContext'
import { useLenisScroll } from '@/components/SmoothScroll'
import { splitSubhead } from '@/lib/heroLayoutDefaults'
import WordSlideUp from './WordSlideUp'

/**
 * Left copy over desk-loop video. Breathe delay before chrome so the room reads first.
 * Whole copy block scale + offset live in Leva (hero text + hero layout).
 */
export default function DirectHero() {
  const text = useHeroTextTuner()
  const layout = useHeroLayoutTuner()
  const bg = useBgTuner()
  const intro = useIntroTuner()
  const { scrollTo } = useLenisScroll()
  const lines = splitSubhead(layout.subhead)

  const chromeVisible = intro.showChrome || (!intro.enabled && !intro.preview)
  const pageUnderAperture = intro.mode === 'aperture' && intro.enabled
  const bgVisible = chromeVisible || pageUnderAperture
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Mobile: snappier entrance after preloader (desktop timing untouched)
  const fadeSec = Math.max(0.28, (intro.fadeInMs / 1000) * (isMobile ? 0.62 : 1))
  const stagger = Math.max(0, (intro.fadeInStaggerMs / 1000) * (isMobile ? 0.7 : 1))
  const chromeDelay = Math.max(0, ((intro.chromeDelayMs ?? 0) / 1000) * (isMobile ? 0.7 : 1))
  const breath = Math.max(0, ((layout.copyBreathMs ?? 0) / 1000) * (isMobile ? 0.55 : 1))
  const subLag = Math.max(0, ((layout.subheadLagMs ?? 0) / 1000) * (isMobile ? 0.55 : 1))
  const copyDelay = chromeDelay + breath
  const instantStem = intro.enabled && intro.mode === 'dock'

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: copyDelay },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: fadeSec, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const ctaRowVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: fadeSec * 0.95,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: Math.max(0.1, stagger * 0.9),
        delayChildren: 0.06,
      },
    },
  }

  const ctaItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 },
    },
  }

  const go = (href: string) => {
    if (href.startsWith('#')) scrollTo(href, { duration: 1.05 })
  }

  const left = layout.heroAlign === 'left'
  const onDark = left && layout.bgVideoEnabled
  const blockScale = layout.copyScale ?? 1
  const btnScale = layout.ctaScale ?? 1
  // Mobile: ignore desktop Leva copy offsets so everything stays centered near the top
  const copyX = isMobile ? 0 : (layout.copyOffsetX ?? 0)
  const copyY = isMobile ? Math.min(layout.copyOffsetY ?? 0, 24) : (layout.copyOffsetY ?? 0)

  // Gate headline/type until breathe finishes (Leva: copyBreathMs + chrome delay)
  const [copyReady, setCopyReady] = useState(() => !intro.enabled)
  const [ctaArmed, setCtaArmed] = useState(() => !intro.enabled)
  useEffect(() => {
    if (!chromeVisible) {
      setCopyReady(false)
      setCtaArmed(false)
      return undefined
    }
    const wait = Math.max(0, (intro.chromeDelayMs ?? 0) + (layout.copyBreathMs ?? 0))
    const id = window.setTimeout(() => setCopyReady(true), wait)
    return () => window.clearTimeout(id)
  }, [chromeVisible, intro.chromeDelayMs, layout.copyBreathMs, intro.enabled])

  // Hand + hover hit-test only after Get Started finishes its entrance
  useEffect(() => {
    if (!chromeVisible || !copyReady || !layout.showCtas) {
      setCtaArmed(false)
      return undefined
    }
    const ms = Math.max(200, (fadeSec + stagger * 3 + 0.35) * 1000)
    const id = window.setTimeout(() => setCtaArmed(true), ms)
    return () => window.clearTimeout(id)
  }, [chromeVisible, copyReady, layout.showCtas, fadeSec, stagger])

  return (
    <section
      data-hero-root
      data-cta-armed={ctaArmed ? '1' : '0'}
      className="relative flex min-h-screen w-full flex-col overflow-hidden pb-24 md:pb-32"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: fadeSec * 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {layout.bgVideoEnabled ? (
          <HeroVideoBackground
            active={bgVisible}
            overlayOpacity={layout.heroVideoOverlay}
            offsetYDesktop={layout.heroVideoOffsetYDesktop}
            offsetYMobile={layout.heroVideoOffsetYMobile}
          />
        ) : (
          <HeroBgParallax className="absolute inset-[-4%] h-[108%] w-[108%]">
            <MeshWaveBackground
              settings={{
                color0: bg.color0,
                color1: bg.color1,
                color2: bg.color2,
                color3: bg.color3,
                color4: bg.color4,
                speed: bg.speed,
                wireOpacity: bg.wireOpacity,
                vignetteStrength: bg.vignetteStrength,
              }}
            />
          </HeroBgParallax>
        )}
      </motion.div>

      {chromeVisible && ctaArmed ? <HandReachLottie /> : null}

      <HeroContentParallax className="relative z-[4] flex flex-1 flex-col">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={chromeVisible ? 'visible' : 'hidden'}
          className={cn(
            'flex flex-1 flex-col justify-start px-5 pb-8 pt-28 sm:px-8 md:px-10 md:pt-24 lg:pt-28',
            left
              ? 'items-center text-center md:items-start md:text-left lg:pl-16'
              : 'items-center text-center',
          )}
          style={{
            pointerEvents: chromeVisible ? 'auto' : 'none',
            visibility: 'visible',
          }}
        >
          <div
            data-copy-block
            className={cn(
              'flex w-full flex-col',
              left
                ? 'max-w-[820px] items-center md:items-start'
                : 'max-w-4xl items-center',
            )}
            style={{
              transform: `translate3d(${copyX}px, ${copyY}px, 0) scale(${blockScale})`,
              transformOrigin: left && !isMobile ? 'left top' : 'center top',
            }}
          >
            {layout.showEyebrow && layout.eyebrow.trim() ? (
              <motion.p
                variants={itemVariants}
                className={cn(
                  'mb-5 font-nhg text-[12px] font-medium uppercase tracking-[0.14em] md:text-[13px]',
                  onDark ? 'text-home-on-dark/70' : 'text-home-on-light/70',
                )}
                style={{
                  transform: `scale(${layout.eyebrowScale ?? 0.85})`,
                  transformOrigin: left ? 'left center' : 'center',
                }}
              >
                {layout.eyebrow}
              </motion.p>
            ) : null}

            <div
              className={cn(
                'w-full',
                isMobile ? 'mb-3' : 'mb-7',
              )}
              style={onDark ? { filter: 'drop-shadow(0 3px 22px rgba(0,0,0,0.5))' } : undefined}
            >
              <HeroKineticText
                settings={{
                  ...text,
                  maxWidth: left && !isMobile ? text.maxWidth : Math.min(text.maxWidth, 920),
                }}
                stacked={!left || isMobile}
                instantStem={instantStem}
                chromeVisible={copyReady}
                onPhraseNavigate={go}
                className={left && !isMobile ? 'mx-auto md:mx-0' : 'mx-auto'}
              />
            </div>

            <div
              className={cn(
                'mb-9 flex flex-col gap-2',
                isMobile
                  ? 'mx-auto w-full max-w-[18.5rem] items-center text-center'
                  : cn('max-w-2xl', left && 'max-w-xl items-center md:items-start'),
              )}
            >
              {lines.map((line, i) => (
                <WordSlideUp
                  key={line}
                  text={line}
                  active={copyReady}
                  delay={fadeSec * 0.45 + subLag + i * 0.12}
                  stagger={0.06}
                  duration={isMobile ? 0.42 : 0.58}
                  className={cn(
                    'font-nhg font-medium leading-relaxed md:text-[19px]',
                    isMobile ? 'w-full text-center text-[13.5px] leading-snug' : 'text-[17px]',
                    onDark ? 'text-home-on-dark/75' : 'text-home-on-light/70',
                    !isMobile && left && 'text-center md:text-left',
                    i > 0 && 'hidden md:block',
                  )}
                />
              ))}
            </div>

            {layout.showCtas && (
              <motion.div
                variants={ctaRowVariants}
                className={cn(
                  'relative z-[10] flex flex-row flex-wrap items-center gap-3.5',
                  left ? 'justify-center md:justify-start' : 'justify-center',
                )}
                style={{ transform: `scale(${btnScale})`, transformOrigin: left ? 'left center' : 'center' }}
              >
                <motion.div variants={ctaItemVariants}>
                  <FlowButton
                    text={layout.ctaPortal}
                    href="/portal"
                    variant="outline"
                    icon={<PortalIcon size={16} />}
                    className={cn(
                      'min-h-[48px] px-6 text-[15px]',
                      onDark ? 'border-home-on-dark/40 text-home-on-dark hover:border-transparent' : undefined,
                    )}
                  />
                </motion.div>
                <motion.div variants={ctaItemVariants}>
                  <FlowButton
                    text={layout.ctaGetStarted}
                    href="/start"
                    variant="filled"
                    icon={<Rocket size={16} strokeWidth={2} aria-hidden />}
                    getStartedTrigger
                    className="min-h-[48px] px-6 text-[15px]"
                    ctaArmed={ctaArmed}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </HeroContentParallax>

      <motion.a
        href="#services"
        className="absolute bottom-20 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-1 no-underline md:bottom-24"
        aria-label="Scroll to next section"
        initial={false}
        animate={{ opacity: chromeVisible ? 1 : 0 }}
        transition={{ duration: fadeSec, delay: chromeVisible ? copyDelay + stagger * 4 : 0 }}
        onClick={(e) => {
          e.preventDefault()
          go('#services')
        }}
      >
        <span
          className={cn(
            'font-nhg text-[11px] font-medium uppercase tracking-[0.18em]',
            onDark ? 'text-home-muted' : 'text-home-muted',
          )}
        >
          scroll
        </span>
        <motion.span
          className="text-home-muted"
          animate={{ y: [0, 5, 0], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <ChevronDown size={16} strokeWidth={2} />
        </motion.span>
      </motion.a>
    </section>
  )
}
