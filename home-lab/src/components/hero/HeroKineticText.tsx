import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import BlurOutWords from './BlurOutWords'
import PhraseServiceBadge from './PhraseServiceBadge'
import {
  parsePhrases,
  parsePhraseBadges,
  emojiForPhrase,
  type HeroTextTuner,
} from './heroTextDefaults'
import {
  ArrowTrendingUpIcon,
  type ArrowTrendingUpIconHandle,
} from '@/components/ui/arrow-trending-up-icon'
import { cn } from '@/lib/utils'

type Props = {
  settings: HeroTextTuner
  scrollActivated?: boolean
  className?: string
  /** Stem on its own line, rotating phrase below (centered hero). */
  stacked?: boolean
  /** Show full stem immediately (for cinematic intro dock target). */
  instantStem?: boolean
  /** Smooth-scroll handler for phrase click */
  onPhraseNavigate?: (href: string) => void
  /** After preloader docks: fade everything except the Maximus word */
  chromeVisible?: boolean
}

/**
 * Fit by reducing font-size (not transform:scale), locked to longest phrase.
 * Phrase slot is a fixed absolute-height band so rotation/hover never pushes subtext.
 */
export default function HeroKineticText({
  settings,
  scrollActivated = false,
  className,
  stacked = false,
  instantStem = false,
  onPhraseNavigate,
  chromeVisible = true,
}: Props) {
  const stemFull = `${settings.stemText.trim()} `
  const phrases = useMemo(() => parsePhrases(settings.phrases), [settings.phrases])

  const [typed, setTyped] = useState(instantStem ? stemFull : '')
  const [stemDone, setStemDone] = useState(instantStem)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [fitScale, setFitScale] = useState(1)
  const [phraseHovered, setPhraseHovered] = useState(false)
  const [phraseArmed, setPhraseArmed] = useState(false)
  const [phraseMinW, setPhraseMinW] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<ArrowTrendingUpIconHandle>(null)
  const resumeTimer = useRef<number | null>(null)
  const phraseHoveredRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const longestPhrase = useMemo(() => {
    if (!phrases.length) return settings.scrollPhrase
    return phrases.reduce((a, b) => (a.length >= b.length ? a : b), phrases[0])
  }, [phrases, settings.scrollPhrase])

  const gapEm = typeof settings.spaceAfterTo === 'number' ? settings.spaceAfterTo : 0.05
  const phraseGap = gapEm > 0 ? `${gapEm}em` : undefined
  // Stacked = centered hero (stem line, rotating phrase below). Left layout
  // wants the plain wrap-like-a-sentence branch, so this now follows the prop only.
  const useStack = stacked
  const cyclePaused = settings.pauseCycle || phraseHovered
  const headlineFontClass = settings.headlineFont === 'tiempos' ? 'font-tiempos' : 'font-nhg'

  const glow =
    settings.glowStrength > 0
      ? `0 0 ${24 * settings.glowStrength}px ${settings.glowColor}`
      : undefined

  useEffect(() => {
    // Wait for aperture / chrome to unlock before typing — otherwise it finishes while hidden
    if (!chromeVisible) {
      if (!instantStem) {
        setTyped('')
        setStemDone(false)
        setPhraseIndex(0)
      }
      return
    }
    if (instantStem) {
      setTyped(stemFull)
      setStemDone(true)
      return
    }
    setTyped('')
    setStemDone(false)
    setPhraseIndex(0)
  }, [stemFull, settings.typeSpeed, instantStem, chromeVisible])

  useEffect(() => {
    if (!chromeVisible || instantStem || stemDone) return undefined
    if (typed.length >= stemFull.length) {
      setStemDone(true)
      return undefined
    }
    const timer = window.setTimeout(() => {
      setTyped(stemFull.slice(0, typed.length + 1))
    }, settings.typeSpeed)
    return () => window.clearTimeout(timer)
  }, [typed, stemFull, stemDone, settings.typeSpeed, instantStem, chromeVisible])

  useEffect(() => {
    if (!stemDone || scrollActivated || cyclePaused || phrases.length === 0) return undefined
    const timer = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length)
    }, settings.cycleSeconds * 1000)
    return () => window.clearInterval(timer)
  }, [stemDone, scrollActivated, cyclePaused, settings.cycleSeconds, phrases.length])

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
      delete document.documentElement.dataset.mrPhraseHover
    }
  }, [])

  const phrase = scrollActivated ? settings.scrollPhrase : (phrases[phraseIndex] ?? '')
  const phraseKey = scrollActivated ? `scroll-${settings.scrollPhrase}` : `${phrase}-${phraseIndex}`
  const badgeMap = useMemo(() => parsePhraseBadges(settings.phraseBadges), [settings.phraseBadges])
  const badgeEmoji = emojiForPhrase(phrase || phrases[0] || '', badgeMap)

  // Arm hover only after the new phrase has drawn in (avoids blank-slot pause).
  useEffect(() => {
    setPhraseArmed(false)
    if (phraseHoveredRef.current) {
      if (resumeTimer.current) {
        window.clearTimeout(resumeTimer.current)
        resumeTimer.current = null
      }
      phraseHoveredRef.current = false
      delete document.documentElement.dataset.mrPhraseHover
      setPhraseHovered(false)
      arrowRef.current?.stopAnimation()
    }
    if (!phrase || scrollActivated) {
      setPhraseArmed(Boolean(phrase))
      return undefined
    }
    const words = phrase.split(' ').filter(Boolean).length
    const frameMs = 1000 / Math.max(1, settings.blurFps)
    const enterMs = (17 * frameMs) / Math.max(0.01, settings.blurSpeed)
    const staggerMs = (settings.staggerDelay * frameMs) / Math.max(0.01, settings.blurSpeed)
    const armAt = enterMs + Math.max(0, words - 1) * staggerMs * 0.4 + 70
    const t = window.setTimeout(() => setPhraseArmed(true), armAt)
    return () => window.clearTimeout(t)
  }, [
    phraseKey,
    phrase,
    scrollActivated,
    settings.blurFps,
    settings.blurSpeed,
    settings.staggerDelay,
  ])

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current
      const probe = measureRef.current
      if (!wrap || !probe) return
      // Stem stays fixed size. Only the rotating phrase may shrink to fit.
      const arrowReserve =
        settings.phraseHoverEnabled && !isMobile
          ? settings.phraseArrowSize + settings.phraseArrowGap + 8
          : 0
      // Mobile: leave a little side breathing room so long phrases stay inside the screen
      const sidePad = isMobile ? 12 : 0
      const available = Math.max(60, wrap.clientWidth - arrowReserve - sidePad)
      const needed = probe.scrollWidth
      setPhraseMinW(needed + arrowReserve)
      if (available <= 0 || needed <= 0) return
      const next = Math.min(1, available / needed)
      setFitScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    const el = wrapRef.current
    if (el) ro.observe(el)
    return () => ro.disconnect()
  }, [
    useStack,
    settings.singleLine,
    settings.fontSize,
    settings.maxWidth,
    settings.letterSpacing,
    settings.phraseWeight,
    settings.phraseHoverEnabled,
    settings.phraseArrowSize,
    settings.phraseArrowGap,
    settings.headlineFont,
    gapEm,
    longestPhrase,
    isMobile,
  ])

  // Stem size is stable across viewport width — only the phrase uses fitScale / wrap.
  const stemPx = settings.fontSize
  const stemFontSize = useStack
    ? `clamp(2.25rem, 7vw, ${stemPx}px)`
    : `clamp(1.75rem, 5.5vw, ${stemPx}px)`
  // Below ~0.88 fit, stop shrinking and let the rotating phrase wrap onto new lines.
  const phraseWraps = fitScale < 0.88
  const phraseFittedPx = Math.max(18, stemPx * (phraseWraps ? Math.max(fitScale, 0.72) : fitScale))
  const phraseFontSize = useStack
    ? phraseWraps
      ? `clamp(1.35rem, 5.5vw, ${stemPx}px)`
      : stemFontSize
    : settings.singleLine && !phraseWraps
      ? `${phraseFittedPx}px`
      : stemFontSize

  const onPhraseEnter = () => {
    if (!settings.phraseHoverEnabled || scrollActivated || isMobile) return
    if (!phraseArmed) return
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
    phraseHoveredRef.current = true
    document.documentElement.dataset.mrPhraseHover = '1'
    setPhraseHovered(true)
    arrowRef.current?.startAnimation()
  }

  const onPhraseLeave = () => {
    if (!phraseHoveredRef.current && !resumeTimer.current) return
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    // Debounce leave so parallax / arrow / blur kids do not flicker the hover off.
    resumeTimer.current = window.setTimeout(() => {
      resumeTimer.current = null
      phraseHoveredRef.current = false
      delete document.documentElement.dataset.mrPhraseHover
      setPhraseHovered(false)
      arrowRef.current?.stopAnimation()
    }, Math.max(0, settings.phraseHoverResumeMs || 180))
  }

  const renderStem = (text: string) => {
    const m = text.match(/^(.*?)(Maximus)(.*)$/i)
    if (!m) return text
    return (
      <>
        <motion.span
          initial={false}
          animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : 10 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {m[1]}
        </motion.span>
        <span
          data-maximus-anchor
          className="inline-block"
          style={{ opacity: chromeVisible ? 1 : 0 }}
        >
          {m[2]}
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : 10 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
        >
          {m[3]}
        </motion.span>
      </>
    )
  }

  if (useStack) {
    // Mobile: slightly lower floor so long rotating phrases (e.g. "improve my SEO") stay on-screen
    const phraseFloor = isMobile ? 18 : 22
    const phrasePx = phraseWraps
      ? Math.max(phraseFloor, Math.min(settings.fontSize, settings.fontSize * Math.max(fitScale, isMobile ? 0.62 : 0.72)))
      : Math.max(phraseFloor, settings.fontSize * fitScale)
    const lineH = Math.max(settings.lineHeight, 1.05)
    // Always reserve 2 lines so rotating phrases never shove subtext/buttons
    const slotH = Math.ceil(phrasePx * lineH * 2.15 + 8)
    const href = settings.phraseHref || '#get-started'

    return (
      <div
        ref={wrapRef}
        className={className}
        style={{
          maxWidth: settings.maxWidth,
          width: '100%',
          overflow: 'visible',
          textAlign: 'center',
        }}
      >
        <span
          ref={measureRef}
          aria-hidden
          className={cn('pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap', headlineFontClass)}
          style={{
            fontSize: settings.fontSize,
            letterSpacing: `${settings.letterSpacing}em`,
            fontWeight: settings.phraseWeight,
          }}
        >
          {longestPhrase}
        </span>

        <h1
          className={cn('m-0 flex flex-col items-center', headlineFontClass)}
          aria-live="polite"
          style={{
            letterSpacing: `${settings.letterSpacing}em`,
            lineHeight: settings.lineHeight,
          }}
        >
          {settings.badgeEnabled && !isMobile ? (
            <motion.div
              className="flex w-full justify-center"
              style={{ marginBottom: settings.badgeGapBelow }}
              initial={false}
              animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : 12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <PhraseServiceBadge
                emoji={badgeEmoji}
                size={settings.badgeSize}
                radius={settings.badgeRadius}
                bg={settings.badgeBg}
                border={settings.badgeBorder}
                slideMs={settings.badgeSlideMs}
              />
            </motion.div>
          ) : null}

          <span
            className="block whitespace-nowrap"
            style={{
              fontSize: stemFontSize,
              fontWeight: settings.stemWeight,
              color: settings.stemColor,
            }}
          >
            {renderStem(typed)}
            {settings.showCursor && !stemDone && (
              <span className="hero-type-cursor" aria-hidden style={{ backgroundColor: settings.stemColor }} />
            )}
          </span>

          <div
            className="relative mt-1 w-full"
            style={{ height: slotH, minHeight: slotH }}
          >
            {stemDone && (
              <motion.a
                href={href}
                className="absolute inset-0 flex w-full items-center justify-center no-underline"
                style={{ color: settings.phraseColor, pointerEvents: phraseArmed ? 'auto' : 'none' }}
                initial={false}
                animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : 14 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
                onPointerEnter={onPhraseEnter}
                onPointerLeave={onPhraseLeave}
                onFocus={onPhraseEnter}
                onBlur={onPhraseLeave}
                onClick={(e) => {
                  if (!onPhraseNavigate) return
                  if (href.startsWith('#')) {
                    e.preventDefault()
                    onPhraseNavigate(href)
                  }
                }}
              >
                <span
                  className="pointer-events-none inline-flex w-full max-w-full items-center justify-center"
                  style={{
                    fontSize: `${phrasePx}px`,
                    fontWeight: settings.phraseWeight,
                    gap: !isMobile && settings.phraseHoverEnabled ? settings.phraseArrowGap : 0,
                    textAlign: 'center',
                    // Desktop keeps minWidth for hover/arrow layout. Mobile: never force a
                    // wider box than the screen (that was shoving long phrases off the left).
                    minWidth:
                      !isMobile && phraseMinW > 0
                        ? Math.min(phraseMinW, wrapRef.current?.clientWidth || phraseMinW)
                        : undefined,
                  }}
                >
                  <span
                    className="block w-full text-center"
                    style={{ maxWidth: isMobile ? '100%' : 'min(100%, 34ch)' }}
                  >
                    <BlurOutWords
                      key={phraseKey}
                      text={phrase}
                      staggerDelay={settings.staggerDelay}
                      speed={settings.blurSpeed}
                      fps={settings.blurFps}
                      durationInFrames={settings.blurDurationFrames}
                      color={settings.phraseColor}
                      fontWeight={settings.phraseWeight}
                      textShadow={glow}
                      hold={scrollActivated || phraseHovered}
                      className="text-center"
                    />
                  </span>
                  {settings.phraseHoverEnabled && !scrollActivated && !isMobile ? (
                    <motion.span
                      className="inline-flex shrink-0 self-center"
                      initial={false}
                      animate={{
                        opacity: phraseHovered ? 1 : 0,
                      }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: settings.phraseArrowSize,
                        marginLeft: settings.phraseArrowGap,
                        color: settings.phraseColor,
                      }}
                      aria-hidden
                    >
                      <ArrowTrendingUpIcon ref={arrowRef} size={settings.phraseArrowSize} />
                    </motion.span>
                  ) : null}
                </span>
              </motion.a>
            )}
          </div>
        </h1>
      </div>
    )
  }

  // Left layout: when phrase cannot fit, drop it under the stem and wrap.
  if (phraseWraps) {
    const href = settings.phraseHref || '#get-started'
    return (
      <div
        ref={wrapRef}
        className={className}
        style={{
          maxWidth: settings.maxWidth,
          width: '100%',
          overflow: 'visible',
        }}
      >
        <span
          ref={measureRef}
          aria-hidden
          className={cn('pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap', headlineFontClass)}
          style={{
            fontSize: settings.fontSize,
            letterSpacing: `${settings.letterSpacing}em`,
            fontWeight: settings.phraseWeight,
          }}
        >
          {longestPhrase}
        </span>
        <h1
          className={cn('m-0 flex flex-col', headlineFontClass)}
          aria-live="polite"
          style={{
            letterSpacing: `${settings.letterSpacing}em`,
            lineHeight: settings.lineHeight,
          }}
        >
          <span
            className="block whitespace-nowrap"
            style={{
              fontSize: stemFontSize,
              fontWeight: settings.stemWeight,
              color: settings.stemColor,
            }}
          >
            {renderStem(typed)}
            {settings.showCursor && !stemDone && (
              <span className="hero-type-cursor" aria-hidden style={{ backgroundColor: settings.stemColor }} />
            )}
          </span>
          {stemDone && (
            <a
              href={href}
              className="mt-1 block max-w-full no-underline"
              style={{
                fontSize: phraseFontSize,
                fontWeight: settings.phraseWeight,
                color: settings.phraseColor,
                minWidth: phraseMinW > 0 ? phraseMinW : undefined,
                pointerEvents: phraseArmed ? 'auto' : 'none',
              }}
              onPointerEnter={onPhraseEnter}
              onPointerLeave={onPhraseLeave}
              onFocus={onPhraseEnter}
              onBlur={onPhraseLeave}
              onClick={(e) => {
                if (!onPhraseNavigate) return
                if (href.startsWith('#')) {
                  e.preventDefault()
                  onPhraseNavigate(href)
                }
              }}
            >
              <span className="pointer-events-none inline-flex max-w-full flex-wrap items-center gap-1">
                <BlurOutWords
                  key={phraseKey}
                  text={phrase}
                  staggerDelay={settings.staggerDelay}
                  speed={settings.blurSpeed}
                  fps={settings.blurFps}
                  durationInFrames={settings.blurDurationFrames}
                  color={settings.phraseColor}
                  fontWeight={settings.phraseWeight}
                  textShadow={glow}
                  hold={scrollActivated || phraseHovered}
                  className="whitespace-normal"
                />
                {settings.phraseHoverEnabled && !scrollActivated ? (
                  <motion.span
                    className="inline-flex shrink-0"
                    initial={false}
                    animate={{ opacity: phraseHovered ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: settings.phraseArrowSize,
                      color: settings.phraseColor,
                    }}
                    aria-hidden
                  >
                    <ArrowTrendingUpIcon ref={arrowRef} size={settings.phraseArrowSize} />
                  </motion.span>
                ) : null}
              </span>
            </a>
          )}
        </h1>
      </div>
    )
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        maxWidth: settings.maxWidth,
        width: '100%',
        overflow: 'visible',
      }}
    >
      {/* Measure phrase only — stem stays a fixed clamp size so it never jumps on resize */}
      <span
        ref={measureRef}
        aria-hidden
        className={cn('pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap', headlineFontClass)}
        style={{
          fontSize: settings.fontSize,
          letterSpacing: `${settings.letterSpacing}em`,
          fontWeight: settings.phraseWeight,
        }}
      >
        {longestPhrase}
      </span>

      <h1
        className={cn('relative m-0', headlineFontClass)}
        aria-live="polite"
        style={{
          fontSize: stemFontSize,
          letterSpacing: `${settings.letterSpacing}em`,
          lineHeight: settings.lineHeight,
          fontWeight: settings.stemWeight,
          whiteSpace: settings.singleLine ? 'nowrap' : 'normal',
          overflow: 'visible',
        }}
      >
        {/* Invisible full line locks height so type-in / first phrase never shove subtext */}
        <span aria-hidden className="invisible block" style={{ pointerEvents: 'none' }}>
          {stemFull}
          <span
            style={{
              marginLeft: phraseGap,
              fontWeight: settings.phraseWeight,
              fontSize: phraseFontSize,
            }}
          >
            {longestPhrase}
          </span>
        </span>

        <span className="absolute left-0 top-0 w-full">
          <span style={{ fontWeight: settings.stemWeight, color: settings.stemColor, fontSize: stemFontSize }}>
            {typed}
          </span>

          {stemDone && (
            <motion.a
              href={settings.phraseHref || '#get-started'}
              className="inline-flex items-center no-underline"
              style={{
                marginLeft: phraseGap,
                fontSize: phraseFontSize,
                color: settings.phraseColor,
                fontWeight: settings.phraseWeight,
                gap: settings.phraseArrowGap,
                minWidth: phraseMinW > 0 ? phraseMinW : undefined,
                pointerEvents: phraseArmed ? 'auto' : 'none',
              }}
              onPointerEnter={onPhraseEnter}
              onPointerLeave={onPhraseLeave}
              onFocus={onPhraseEnter}
              onBlur={onPhraseLeave}
              onClick={(e) => {
                const href = settings.phraseHref || '#get-started'
                if (!onPhraseNavigate) return
                if (href.startsWith('#')) {
                  e.preventDefault()
                  onPhraseNavigate(href)
                }
              }}
            >
              <span className="pointer-events-none inline-flex items-center" style={{ gap: settings.phraseArrowGap }}>
                <BlurOutWords
                  key={phraseKey}
                  text={phrase}
                  staggerDelay={settings.staggerDelay}
                  speed={settings.blurSpeed}
                  fps={settings.blurFps}
                  durationInFrames={settings.blurDurationFrames}
                  color={settings.phraseColor}
                  fontWeight={settings.phraseWeight}
                  textShadow={glow}
                  hold={scrollActivated || phraseHovered}
                />
                {settings.phraseHoverEnabled && !scrollActivated ? (
                  <motion.span
                    className="inline-flex shrink-0 self-center"
                    initial={false}
                    animate={{
                      opacity: phraseHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: settings.phraseArrowSize,
                      marginLeft: settings.phraseArrowGap,
                      color: settings.phraseColor,
                    }}
                    aria-hidden
                  >
                    <ArrowTrendingUpIcon ref={arrowRef} size={settings.phraseArrowSize} />
                  </motion.span>
                ) : null}
              </span>
            </motion.a>
          )}

          {settings.showCursor && !stemDone && (
            <span className="hero-type-cursor" aria-hidden style={{ backgroundColor: settings.stemColor }} />
          )}
        </span>
      </h1>
    </div>
  )
}
