import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenisTuner } from '@/context/LenisTunerContext'

gsap.registerPlugin(ScrollTrigger)

type LenisCtx = {
  scrollTo: (target: string | HTMLElement | number, opts?: { offset?: number; duration?: number }) => void
}

const Ctx = createContext<LenisCtx>({
  scrollTo: (target) => {
    if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  },
})

/**
 * Lenis + ScrollTrigger sync. Chrome needs this ticker path;
 * plain rAF alone often feels like native scroll only.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const settings = useLenisTuner()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (!settings.enabled) {
      lenisRef.current?.destroy()
      lenisRef.current = null
      return undefined
    }

    // Chrome: native smooth + Lenis fight. Force off while Lenis owns scroll.
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    const lenis = new Lenis({
      duration: settings.duration,
      lerp: settings.lerp,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: settings.wheelMultiplier,
      touchMultiplier: settings.touchMultiplier,
      infinite: false,
      autoResize: true,
      prevent: (node) => {
        if (!(node instanceof HTMLElement)) return false
        return Boolean(
          node.closest('[data-lenis-prevent]') ||
            node.closest('.leva-c-kWgxhW') ||
            node.closest('[class*="leva-"]') ||
            node.closest('[role="dialog"]'),
        )
      },
    })

    lenisRef.current = lenis
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      html.style.scrollBehavior = prevBehavior
      ScrollTrigger.refresh()
    }
  }, [
    settings.enabled,
    settings.duration,
    settings.lerp,
    settings.wheelMultiplier,
    settings.touchMultiplier,
  ])

  const api = useMemo<LenisCtx>(
    () => ({
      scrollTo: (target, opts) => {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(target, {
            offset: opts?.offset ?? 0,
            duration: opts?.duration ?? Math.max(0.7, settings.duration * 0.85),
          })
          return
        }
        if (typeof target === 'string') {
          document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      },
    }),
    [settings.duration],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useLenisScroll() {
  return useContext(Ctx)
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>
}
