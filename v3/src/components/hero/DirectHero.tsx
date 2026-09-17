import { motion, type Variants } from 'framer-motion'
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
import { useDemoCanvasTuner } from '@/context/DemoCanvasTunerContext'
import { useLenisScroll } from '@/components/SmoothScroll'
import { splitSubhead } from '@/lib/heroLayoutDefaults'

/**
 * Centered hero. Mesh + content parallax. Soft blend lives BELOW the fold cutoff.
 * Demo canvas peeks under CTAs after the cinematic intro.
 */
export default function DirectHero() {
  const text = useHeroTextTuner()
  const layout = useHeroLayoutTuner()
  const bg = useBgTuner()
  const intro = useIntroTuner()
  const demo = useDemoCanvasTuner()
  const { scrollTo } = useLenisScroll()
  const lines = splitSubhead(layout.subhead)

  const chromeVisible = intro.showChrome || (!intro.enabled && !intro.preview)
  // Aperture must reveal the real page (incl. video) under the cream cover — not a blank hero.
  // Does not change video files, sources, or layout — only when opacity hits 1.
  const pageUnderAperture = intro.mode === 'aperture' && intro.enabled
  const bgVisible = chromeVisible || pageUnderAperture
  const fadeSec = Math.max(0.2, intro.fadeInMs / 1000)
  const stagger = Math.max(0, intro.fadeInStaggerMs / 1000)
  const chromeDelay = Math.max(0, (intro.chromeDelayMs ?? 0) / 1000)
  // Aperture: type after chrome unlocks. Dock (archived): instant stem for dock target.
  const instantStem = intro.enabled && intro.mode === 'dock'

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: chromeDelay },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: fadeSec, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // Soft CTA row: stagger the two buttons, light spring (premium, not busy)
  const ctaRowVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: fadeSec * 0.9,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: Math.max(0.08, stagger * 0.85),
        delayChildren: 0.04,
      },
    },
  }

  const ctaItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 28, mass: 0.85 },
    },
  }

  const go = (href: string) => {
    if (href.startsWith('#')) scrollTo(href, { duration: 1.05 })
  }

  const left = layout.heroAlign === 'left'
  const onDark = left && layout.bgVideoEnabled

  return (
    <>
      <section
        data-hero-root
        className="relative flex min-h-screen w-full flex-col overflow-hidden"
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

        {chromeVisible ? <HandReachLottie /> : null}

        <HeroContentParallax className="relative z-[4] flex flex-1 flex-col">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={chromeVisible ? 'visible' : 'hidden'}
            className={cn(
              'flex flex-1 flex-col justify-start px-5 pb-8 pt-28 sm:px-8 md:px-10 md:pt-24 lg:pt-28',
              // Mobile: center copy. Desktop left layout stays left-aligned (md+).
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
                  ? 'max-w-[760px] items-center md:items-start'
                  : 'max-w-4xl items-center',
              )}
              style={{
                transform: `translate3d(${text.copyOffsetX}px, ${text.copyOffsetY}px, 0)`,
              }}
            >
              {layout.showEyebrow && layout.eyebrow.trim() ? (
                <motion.p
                  variants={itemVariants}
                  className={cn(
                    'mb-5 font-nhg text-[11px] font-medium uppercase tracking-[0.14em] md:text-[12px]',
                    onDark ? 'text-white/70' : 'text-espresso/70',
                  )}
                >
                  {layout.eyebrow}
                </motion.p>
              ) : null}

              {/* Headline handles its own fade; Maximus stays solid after dock */}
              <div
                className="mb-6 w-full"
                style={onDark ? { filter: 'drop-shadow(0 3px 22px rgba(0,0,0,0.5))' } : undefined}
              >
                <HeroKineticText
                  settings={{ ...text, maxWidth: left ? text.maxWidth : Math.min(text.maxWidth, 920) }}
                  stacked={!left}
                  instantStem={instantStem}
                  chromeVisible={chromeVisible}
                  onPhraseNavigate={go}
                  className={left ? 'mx-auto md:mx-0' : 'mx-auto'}
                />
              </div>

              <motion.div
                variants={itemVariants}
                className={cn(
                  'mb-8 flex max-w-2xl flex-col gap-2',
                  left && 'max-w-md items-center md:items-start',
                )}
              >
                {lines.map((line, i) => (
                  <p
                    key={line}
                    className={cn(
                      'm-0 font-nhg text-[16px] font-medium leading-relaxed md:text-[18px]',
                      onDark ? 'text-white/75' : 'text-espresso/70',
                      i > 0 && 'hidden md:block',
                    )}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>

              {layout.showCtas && (
                <motion.div
                  variants={ctaRowVariants}
                  className={cn(
                    'relative z-[10] flex flex-row flex-wrap items-center gap-3',
                    left ? 'justify-center md:justify-start' : 'justify-center',
                  )}
                >
                  <motion.div variants={ctaItemVariants}>
                    <FlowButton
                      text={layout.ctaPortal}
                      href="/portal"
                      variant="outline"
                      icon={<PortalIcon size={15} />}
                      className={onDark ? 'border-white/40 text-white hover:border-transparent' : undefined}
                    />
                  </motion.div>
                  <motion.div variants={ctaItemVariants}>
                    <FlowButton
                      text={layout.ctaGetStarted}
                      href="#get-started"
                      variant="filled"
                      icon={<Rocket size={15} strokeWidth={2} aria-hidden />}
                      getStartedTrigger
                      onNavigate={go}
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Demo canvas peeks into the hero fold under CTAs — desktop only */}
            {demo.enabled && (
              <motion.div
                className="relative z-[3] mt-10 hidden w-full max-w-4xl overflow-hidden md:block"
                style={{
                  height: demo.peekHeight,
                  transformOrigin: 'top center',
                }}
                initial={{ y: demo.peekHeight + 40, opacity: 0, scale: demo.scale * 0.96 }}
                animate={
                  intro.ready
                    ? {
                        y: demo.offsetY,
                        x: demo.offsetX,
                        opacity: 1,
                        scale: demo.scale,
                      }
                    : { y: demo.peekHeight + 40, opacity: 0, scale: demo.scale * 0.96 }
                }
                transition={{
                  delay: intro.ready ? demo.delayAfterIntroMs / 1000 : 0,
                  duration: demo.slideUpMs / 1000,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-label={demo.label}
              >
                <div className="mx-auto flex h-full w-full flex-col items-center justify-start rounded-t-[20px] border border-b-0 border-espresso/10 bg-gradient-to-b from-white/80 to-[#efeae2]/75 px-5 pt-8 shadow-[0_-12px_40px_rgba(44,37,32,0.08)] backdrop-blur-sm">
                  <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
                    Live scene
                  </p>
                  <h2 className="m-0 text-center font-nhg text-[clamp(1.25rem,3vw,1.85rem)] font-semibold tracking-tight text-espresso">
                    {demo.label}
                  </h2>
                  <p className="mt-2 max-w-md text-center font-nhg text-sm text-espresso/45">{demo.hint}</p>
                  <div className="mt-6 flex w-full flex-1 items-center justify-center rounded-[14px] border border-dashed border-espresso/15 bg-white/40 font-nhg text-sm text-espresso/30">
                    Canvas ready
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </HeroContentParallax>

        <motion.a
          href="#services"
          className="absolute bottom-5 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-1 no-underline"
          aria-label="Scroll to next section"
          initial={false}
          animate={{ opacity: chromeVisible ? 1 : 0 }}
          transition={{ duration: fadeSec, delay: chromeVisible ? stagger * 4 : 0 }}
          onClick={(e) => {
            e.preventDefault()
            go('#services')
          }}
        >
          <span
            className={cn(
              'font-nhg text-[11px] font-medium uppercase tracking-[0.18em]',
              onDark ? 'text-white/55' : 'text-espresso/40',
            )}
          >
            scroll
          </span>
          <motion.span
            className={onDark ? 'text-white/55' : 'text-espresso/40'}
            animate={{ y: [0, 5, 0], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            <ChevronDown size={16} strokeWidth={2} />
          </motion.span>
        </motion.a>
      </section>

      {/* Soft blend ONLY below / at the fold cutoff — overlaps hero bottom edge, not content */}
      <div
        className="pointer-events-none relative z-[2] -mt-12 h-12 w-full md:-mt-16 md:h-16"
        style={{
          background: onDark
            ? 'linear-gradient(to bottom, rgba(10,9,8,0) 0%, #f7f7f5 100%)'
            : 'linear-gradient(to bottom, rgba(247,247,245,0) 0%, #f7f7f5 100%)',
        }}
        aria-hidden
      />

      {/* Mobile: demo canvas below hero fold — desktop version lives inside the hero above */}
      {demo.enabled && (
        <div className="mx-5 mb-8 mt-0 overflow-hidden rounded-[20px] border border-espresso/10 bg-gradient-to-b from-white/80 to-[#efeae2]/75 shadow-[0_8px_32px_rgba(44,37,32,0.08)] backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center px-5 py-8">
            <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
              Live scene
            </p>
            <h2 className="m-0 text-center font-nhg text-[1.4rem] font-semibold tracking-tight text-espresso">
              {demo.label}
            </h2>
            <p className="mt-2 max-w-sm text-center font-nhg text-sm text-espresso/45">{demo.hint}</p>
            <div className="mt-6 flex h-32 w-full items-center justify-center rounded-[14px] border border-dashed border-espresso/15 bg-white/40 font-nhg text-sm text-espresso/30">
              Canvas ready
            </div>
          </div>
        </div>
      )}
    </>
  )
}
