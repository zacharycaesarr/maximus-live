import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIntroTuner } from '@/home/context/IntroTunerContext'
import { useHeroTextTuner } from '@/context/HeroTextTunerContext'
import { cn } from '@/lib/utils'

/**
 * Preloader docks Maximus onto the stem word, then unmounts.
 * Hard failsafe: never leave a click-blocking overlay up.
 */
export default function BrandPreloader() {
  const intro = useIntroTuner()
  const heroText = useHeroTextTuner()
  const reduce = useReducedMotion()
  const wordRef = useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = useState<'hold' | 'dock' | 'fade' | 'done'>('hold')
  const [dock, setDock] = useState({ x: 0, y: 0, scale: 1 })
  const [readyToDock, setReadyToDock] = useState(false)
  const finishedRef = useRef(false)

  const fontClass = heroText.headlineFont === 'tiempos' ? 'font-tiempos' : 'font-nhg'
  const ease: [number, number, number, number] = [
    intro.easeX1,
    intro.easeY1,
    intro.easeX2,
    intro.easeY2,
  ]
  // preview must never block the live site permanently
  // Dock mode only — aperture intro is ApertureIntro.tsx (this file is archived path)
  const active = intro.mode === 'dock' && (intro.enabled && !intro.preview ? true : intro.preview)

  const finish = (docked: boolean) => {
    if (intro.mode !== 'dock') return
    if (finishedRef.current) return
    finishedRef.current = true
    if (docked) intro.markDocked()
    else {
      intro.markDocked()
    }
    intro.markReady()
    setPhase('done')
  }

  useEffect(() => {
    finishedRef.current = false
    if (!intro.enabled && !intro.preview) {
      finish(true)
      return
    }
    setPhase('hold')
    setDock({ x: 0, y: 0, scale: 1 })
    setReadyToDock(false)
  }, [intro.enabled, intro.preview, intro.runId])

  // Absolute failsafe — page always becomes clickable
  useEffect(() => {
    const maxMs = Math.max(2400, intro.holdMs + intro.dockMs + intro.fadeInMs + 600)
    const t = window.setTimeout(() => finish(true), maxMs)
    return () => window.clearTimeout(t)
  }, [intro.runId, intro.holdMs, intro.dockMs, intro.fadeInMs, intro.enabled, intro.preview])

  // If chrome already visible from parent failsafe, drop the overlay
  useEffect(() => {
    if (intro.showChrome && intro.ready && phase !== 'done') {
      finish(true)
    }
  }, [intro.showChrome, intro.ready])

  useEffect(() => {
    if (!active || phase !== 'hold') return undefined
    if (reduce) {
      finish(true)
      return undefined
    }

    let cancelled = false
    const run = async () => {
      await new Promise((r) => window.setTimeout(r, intro.holdMs))
      if (cancelled || finishedRef.current) return
      try {
        await document.fonts.ready
      } catch {
        /* ignore */
      }
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      if (cancelled || finishedRef.current) return

      const wordEl = wordRef.current
      const from = wordEl?.getBoundingClientRect()
      let to = (document.querySelector('[data-maximus-anchor]') as HTMLElement | null)?.getBoundingClientRect()
      if (!to || to.width < 4) {
        await new Promise((r) => window.setTimeout(r, 100))
        to = (document.querySelector('[data-maximus-anchor]') as HTMLElement | null)?.getBoundingClientRect()
      }
      if (!from) {
        setReadyToDock(true)
        setPhase('dock')
        return
      }
      const target =
        to && to.width > 4
          ? to
          : {
              left: window.innerWidth / 2 - from.width * 0.28,
              top: window.innerHeight * 0.26,
              width: from.width * 0.55,
              height: from.height * 0.55,
            }

      setDock({
        x: target.left + target.width / 2 - (from.left + from.width / 2),
        y: target.top + target.height / 2 - (from.top + from.height / 2),
        scale: Math.max(0.2, target.width / Math.max(1, from.width)),
      })
      setReadyToDock(true)
      setPhase('dock')
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [phase, intro.holdMs, reduce, active, intro.runId])

  if (intro.mode !== 'dock') return null
  if (phase === 'done') return null
  if (!intro.enabled && !intro.preview) return null

  // Never block clicks once chrome is up
  const blocking = (phase === 'hold' || phase === 'dock') && !intro.showChrome

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        background: intro.bg,
        pointerEvents: blocking ? 'auto' : 'none',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fade' ? 0 : 1 }}
      transition={{ duration: intro.fadeInMs / 1000, ease }}
      onAnimationComplete={() => {
        if (phase === 'fade') finish(true)
      }}
      aria-hidden={!blocking}
    >
      <motion.span
        ref={wordRef}
        className={cn('select-none tracking-tight', fontClass)}
        style={{
          color: heroText.stemColor || intro.color,
          fontWeight: heroText.stemWeight || intro.fontWeight,
          letterSpacing: `${heroText.letterSpacing ?? intro.letterSpacing}em`,
          fontSize: intro.startSize,
        }}
        initial={{ opacity: 0, scale: 0.96, x: 0, y: 0 }}
        animate={
          phase === 'hold' || !readyToDock
            ? { opacity: 1, scale: 1, x: 0, y: 0 }
            : phase === 'dock'
              ? { opacity: 1, scale: dock.scale, x: dock.x, y: dock.y }
              : { opacity: 0, scale: dock.scale, x: dock.x, y: dock.y }
        }
        transition={
          phase === 'dock' && readyToDock
            ? { duration: intro.dockMs / 1000, ease }
            : { duration: 0.4, ease }
        }
        onAnimationComplete={() => {
          if (phase === 'dock' && readyToDock && !finishedRef.current) {
            intro.markDocked()
            setPhase('fade')
          }
        }}
      >
        Maximus
      </motion.span>
    </motion.div>
  )
}
