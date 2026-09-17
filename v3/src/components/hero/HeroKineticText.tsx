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

  const wrapRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<ArrowTrendingUpIconHandle>(null)
  const resumeTimer = useRef<number | null>(null)

  const longestPhrase = useMemo(() => {
    if (!phrases.length) return settings.scrollPhrase
    return phrases.reduce((a, b) => (a.length >= b.length ? a : b), phrases[0])
  }, [phrases, settings.scrollPhrase])

  const gapEm = typeof settings.spaceAfterTo === 'number' ? settings.spaceAfterTo : 0.05
  const phraseGap = gapEm > 0 ? `${gapEm}em` : undefined
  const useStack = stacked || !settings.singleLine
  const cyclePaused = settings.pauseCycle || phraseHovered
  const headlineFontClass = settings.headlineFont === 'tiempos' ? 'font-tiempos' : 'font-nhg'

  const glow =
    settings.glowStrength > 0
      ? `0 0 ${24 * settings.glowStrength}px ${settings.glowColor}`
      : undefined

  useEffect(() => {
    if (instantStem) {
      setTyped(stemFull)
      setStemDone(true)
      return
    }
    setTyped('')
    setStemDone(false)
    setPhraseIndex(0)
  }, [stemFull, settings.typeSpeed, instantStem])

  useEffect(() => {
    if (instantStem || stemDone) return undefined
    if (typed.length >= stemFull.length) {
      setStemDone(true)
      return undefined
    }
    const timer = window.setTimeout(() => {
      setTyped(stemFull.slice(0, typed.length + 1))
    }, settings.typeSpeed)
    return () => window.clearTimeout(timer)
  }, [typed, stemFull, stemDone, settings.typeSpeed, instantStem])

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
    }
  }, [])

  const phrase = scrollActivated ? settings.scrollPhrase : (phrases[phraseIndex] ?? '')
  const phraseKey = scrollActivated ? `scroll-${settings.scrollPhrase}` : `${phrase}-${phraseIndex}`
  const badgeMap = useMemo(() => parsePhraseBadges(settings.phraseBadges), [settings.phraseBadges])
  const badgeEmoji = emojiForPhrase(phrase || phrases[0] || '', badgeMap)

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current
      const probe = measureRef.current
      if (!wrap || !probe) return
      // Reserve room for arrow so hover never forces wrap / layout shift
      const arrowReserve = settings.phraseHoverEnabled
        ? settings.phraseArrowSize + settings.phraseArrowGap + 8
        : 0
      const available = Math.max(80, wrap.clientWidth - arrowReserve)
      const needed = probe.scrollWidth
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
    stemFull,
    longestPhrase,
  ])

  const fittedPx = Math.max(22, settings.fontSize * fitScale)
  const fontSize = useStack
    ? `clamp(2.25rem, 7vw, ${settings.fontSize}px)`
    : settings.singleLine
      ? `${fittedPx}px`
      : `clamp(1.75rem, 5.5vw, ${settings.fontSize}px)`

  const onPhraseEnter = () => {
    if (!settings.phraseHoverEnabled || scrollActivated) return
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
    setPhraseHovered(true)
    arrowRef.current?.startAnimation()
  }

  const onPhraseLeave = () => {
    setPhraseHovered(false)
    arrowRef.current?.stopAnimation()
    if (scrollActivated || settings.pauseCycle || phrases.length === 0) return
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length)
      resumeTimer.current = null
    }, Math.max(80, settings.phraseHoverResumeMs))
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
    const phrasePx = Math.max(22, settings.fontSize * fitScale)
    const slotH = Math.ceil(phrasePx * Math.max(settings.lineHeight, 1) + 4)
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
          {settings.badgeEnabled ? (
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
            className="block"
            style={{
              fontSize,
              fontWeight: settings.stemWeight,
              color: settings.stemColor,
            }}
          >
            {renderStem(typed)}
            {settings.showCursor && !stemDone && (
              <span className="hero-type-cursor" aria-hidden style={{ backgroundColor: settings.stemColor }} />
            )}
          </span>

          <div className="relative mt-1 w-full" style={{ height: slotH }}>
            {stemDone && (
              <motion.a
                href={href}
                className="absolute inset-0 flex items-center justify-center no-underline"
                style={{ color: settings.phraseColor }}
                initial={false}
                animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : 14 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
                onMouseEnter={onPhraseEnter}
                onMouseLeave={onPhraseLeave}
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
                <motion.span
                  className="inline-flex max-w-full items-center justify-center whitespace-nowrap"
                  animate={{
                    scale: phraseHovered ? settings.phraseHoverScale : 1,
                  }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontSize: `${phrasePx}px`,
                    fontWeight: settings.phraseWeight,
                    transformOrigin: 'center center',
                    gap: settings.phraseArrowGap,
                  }}
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
                    className="whitespace-nowrap"
                  />
                  <motion.span
                    className="inline-flex shrink-0 self-center"
                    initial={false}
                    animate={{
                      opacity: phraseHovered ? 1 : 0,
                      width: phraseHovered ? settings.phraseArrowSize : 0,
                      marginLeft: phraseHovered ? settings.phraseArrowGap : 0,
                    }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden', color: settings.phraseColor }}
                    aria-hidden={!phraseHovered}
                  >
                    <ArrowTrendingUpIcon ref={arrowRef} size={settings.phraseArrowSize} />
                  </motion.span>
                </motion.span>
              </motion.a>
            )}
          </div>
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
      <span
        ref={measureRef}
        aria-hidden
        className={cn('pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap', headlineFontClass)}
        style={{
          fontSize: settings.fontSize,
          letterSpacing: `${settings.letterSpacing}em`,
          fontWeight: settings.stemWeight,
        }}
      >
        {stemFull}
        <span style={{ marginLeft: phraseGap, fontWeight: settings.phraseWeight }}>{longestPhrase}</span>
      </span>

      <h1
        className={cn('m-0', headlineFontClass)}
        aria-live="polite"
        style={{
          fontSize,
          letterSpacing: `${settings.letterSpacing}em`,
          lineHeight: settings.lineHeight,
          fontWeight: settings.stemWeight,
          whiteSpace: settings.singleLine ? 'nowrap' : 'normal',
          overflow: 'visible',
        }}
      >
        <span style={{ fontWeight: settings.stemWeight, color: settings.stemColor }}>{typed}</span>

        {stemDone && (
          <span className="inline" style={{ marginLeft: phraseGap }}>
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
              hold={scrollActivated}
            />
          </span>
        )}

        {settings.showCursor && !stemDone && (
          <span className="hero-type-cursor" aria-hidden style={{ backgroundColor: settings.stemColor }} />
        )}
      </h1>
    </div>
  )
}
