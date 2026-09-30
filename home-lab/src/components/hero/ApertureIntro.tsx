import { useEffect, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useIntroTuner } from '@/context/IntroTunerContext'
import { clearIntroSeenThisSession } from '@/lib/introDefaults'

// Resets on hard refresh / new tab; survives HMR.
let introPlayedThisLoad = false

/**
 * Integrated Bio–style aperture.
 * Uses a rounded "hole" punched through a cream cover via box-shadow
 * (always rounded on mobile + desktop). Does NOT clip or transform the
 * hero / video / page shell — background is completely untouched.
 */
export default function ApertureIntro() {
  const intro = useIntroTuner()
  const reduce = useReducedMotion()
  const coverRef = useRef<HTMLDivElement>(null)
  const holeRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const finished = useRef(false)

  const forceIntro =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('forceIntro')

  const skip =
    intro.mode !== 'aperture' ||
    (!intro.enabled && !intro.preview) ||
    (!!reduce && !intro.preview) ||
    (!forceIntro && !intro.preview && introPlayedThisLoad && intro.runId === 0)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    introPlayedThisLoad = true
    intro.markDocked()
    intro.markReady()
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    const cover = coverRef.current
    if (cover) {
      cover.style.pointerEvents = 'none'
      cover.style.opacity = '0'
    }
  }

  useLayoutEffect(() => {
    if (intro.runId > 0) {
      introPlayedThisLoad = false
      clearIntroSeenThisSession()
      finished.current = false
    }
  }, [intro.runId])

  useLayoutEffect(() => {
    if (skip) finish()
  }, [skip])

  useEffect(() => {
    if (skip) return undefined

    finished.current = false

    const cover = coverRef.current
    const hole = holeRef.current
    const mark = markRef.current
    if (!cover || !hole) {
      finish()
      return undefined
    }

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const durMs = forceIntro ? 4000 : Number(intro.apertureMs) || 1400
    const dur = Number.isFinite(durMs) ? Math.max(1000, durMs) : 1400
    const hold = Math.max(0, Number(intro.holdMs) || 500)
    const cream = intro.bg || '#F8F7F4'

    let cancelled = false
    let docked = false
    let raf = 0
    let startTimer = 0

    // Start size as a small centered rounded card (viewport-relative)
    const startW = 96
    const startH = 64
    const startR = 28

    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const placeHole = (p: number) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // Expand to cover the full viewport with a little overshoot so edges clear
      const endW = vw + 80
      const endH = vh + 80
      const w = startW + (endW - startW) * p
      const h = startH + (endH - startH) * p
      // Keep corners visibly rounded until late so the aperture reads as a card, not a square
      const r = p < 0.72 ? startR : Math.max(0, startR * (1 - (p - 0.72) / 0.28))
      hole.style.width = `${w}px`
      hole.style.height = `${h}px`
      hole.style.borderRadius = `${r}px`
      hole.style.boxShadow = `0 0 0 100vmax ${cream}`
    }

    const begin = () => {
      if (cancelled) return
      const t0 = performance.now()

      cover.style.opacity = '1'
      cover.style.pointerEvents = 'auto'
      cover.style.background = 'transparent'
      placeHole(0)
      if (mark) {
        mark.style.opacity = '1'
        mark.style.transform = 'translate(-50%, -50%) scale(1)'
      }

      const tick = (now: number) => {
        if (cancelled) return
        const raw = Math.min(1, (now - t0) / dur)
        if (!Number.isFinite(raw)) {
          raf = window.requestAnimationFrame(tick)
          return
        }
        const p = easeInOut(raw)
        placeHole(p)

        // Mark fades as the hole grows past ~35%
        if (mark) {
          if (p > 0.28) {
            const mf = Math.min(1, (p - 0.28) / 0.22)
            mark.style.opacity = String(1 - mf)
            mark.style.transform = `translate(-50%, -50%) scale(${1 - 0.1 * mf})`
          } else {
            mark.style.opacity = '1'
          }
        }

        // Unlock chrome mid-open so hero typing / fades start while aperture finishes
        if (!docked && p >= 0.5) {
          docked = true
          intro.markDocked()
        }

        if (raw < 1) {
          raf = window.requestAnimationFrame(tick)
        } else {
          // Soft fade the cover residue then unlock
          cover.style.transition = 'opacity 180ms ease-out'
          cover.style.opacity = '0'
          window.setTimeout(() => {
            if (!cancelled) finish()
          }, 200)
        }
      }

      raf = window.requestAnimationFrame(tick)
    }

    // Hold logo on cream so fonts / first video frames can settle (Replay is already warm)
    startTimer = window.setTimeout(begin, hold)
    const fail = window.setTimeout(() => {
      if (!cancelled) finish()
    }, hold + dur + 3000)

    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      window.cancelAnimationFrame(raf)
      window.clearTimeout(fail)
    }
  }, [skip, intro.runId, intro.apertureMs, intro.holdMs, intro.preview, intro.bg, forceIntro])

  if (intro.mode !== 'aperture') return null
  if (!intro.enabled && !intro.preview) return null
  if (!forceIntro && introPlayedThisLoad && !intro.preview && intro.runId === 0) return null

  const cream = intro.bg || '#F8F7F4'

  return (
    <div
      ref={coverRef}
      className="fixed inset-0 z-[9999]"
      style={{ background: cream }}
      aria-hidden
      data-aperture-cover
    >
      {/* Expanding rounded hole — box-shadow paints cream around it */}
      <div
        ref={holeRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 96,
          height: 64,
          borderRadius: 28,
          background: 'transparent',
          boxShadow: `0 0 0 100vmax ${cream}`,
          willChange: 'width, height, border-radius',
        }}
      />
      <div
        ref={markRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 select-none text-center"
        style={{ color: intro.color || '#1a1612' }}
      >
        <img
          src="/assets/mm-logo.svg"
          alt=""
          className="mx-auto mb-3 brightness-0"
          width={40}
          height={40}
        />
        <p className="m-0 font-nhg text-[13px] font-semibold uppercase tracking-[0.22em]">
          Maximus Reach
        </p>
      </div>
    </div>
  )
}
