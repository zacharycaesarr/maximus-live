'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'

gsap.registerPlugin(ScrollTrigger)

const ANCHOR_IDS = ['services', 'work', 'how-it-works', 'why-maximus', 'faq', 'get-started'] as const
type Point = { x: number; y: number }

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const CTA_TUNING_KEY = 'home-lab:cta-beacon:'
const CTA_TUNING_FIELDS = ['ctaLeadMobile', 'ctaLeadDesktop', 'ctaLeadStart', 'ctaLeadEnd', 'ctaOffsetX', 'ctaOffsetY', 'ctaFadeBefore', 'ctaFadeLength'] as const
const savedCtaValue = (key: string, fallback: number) => {
  try {
    const saved = window.localStorage.getItem(CTA_TUNING_KEY + key)
    const value = Number(saved)
    return saved !== null && Number.isFinite(value) ? value : fallback
  } catch { return fallback }
}
const saveCtaValue = (key: string) => (value: number) => {
  try { window.localStorage.setItem(CTA_TUNING_KEY + key, String(value)) } catch { /* Private browsing may disable storage. */ }
}

export default function ReachBeacon({ store }: { store?: LevaStore }) {
  const beaconRef = useRef<HTMLDivElement>(null)
  const ctaBeaconRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<SVGPathElement>(null)
  const [ctaScene, setCtaScene] = useState<HTMLElement | null>(null)
  const isDev = import.meta.env.DEV
  const controls = useControls({
    'Reach Beacon': folder({
      enabled: true,
      markers: { value: false, label: 'ST markers (dev)' },
      scrub: { value: .7, min: .3, max: 1.2, step: .05 },
      glowOpacity: { value: .9, min: .2, max: 1, step: .05 },
      'CTA blend': folder({
        ctaLeadMobile: { value: savedCtaValue('ctaLeadMobile', 0), min: -160, max: 160, step: 1, label: 'Mobile timing adjust (px)', onChange: saveCtaValue('ctaLeadMobile') },
        ctaLeadDesktop: { value: savedCtaValue('ctaLeadDesktop', 0), min: 0, max: 360, step: 1, label: 'Desktop arrival lead (px)', onChange: saveCtaValue('ctaLeadDesktop') },
        ctaLeadStart: { value: savedCtaValue('ctaLeadStart', .96), min: .5, max: 1.2, step: .01, label: 'Lead starts (viewport)', onChange: saveCtaValue('ctaLeadStart') },
        ctaLeadEnd: { value: savedCtaValue('ctaLeadEnd', .34), min: .1, max: .5, step: .01, label: 'Lead fully on (viewport)', onChange: saveCtaValue('ctaLeadEnd') },
        ctaOffsetX: { value: savedCtaValue('ctaOffsetX', 0), min: -80, max: 80, step: 1, label: 'Beacon X alignment (px)', onChange: saveCtaValue('ctaOffsetX') },
        ctaOffsetY: { value: savedCtaValue('ctaOffsetY', 0), min: -80, max: 80, step: 1, label: 'Beacon Y alignment (px)', onChange: saveCtaValue('ctaOffsetY') },
        ctaFadeBefore: { value: savedCtaValue('ctaFadeBefore', 12), min: 0, max: 120, step: 1, label: 'Fade before target (px)', onChange: saveCtaValue('ctaFadeBefore') },
        ctaFadeLength: { value: savedCtaValue('ctaFadeLength', 50), min: 10, max: 200, step: 1, label: 'Fade distance (px)', onChange: saveCtaValue('ctaFadeLength') },
        resetCtaBlend: button(() => {
          CTA_TUNING_FIELDS.forEach(key => window.localStorage.removeItem(CTA_TUNING_KEY + key))
          window.location.reload()
        }),
      }, { collapsed: true }),
    }, { collapsed: true }),
  }, store ? { store } : undefined)
  const enabled = Boolean((controls as { enabled?: boolean }).enabled ?? true)
  const markers = Boolean((controls as { markers?: boolean }).markers) && isDev
  const scrub = Number((controls as { scrub?: number }).scrub ?? .7)
  const glowOpacity = Number((controls as { glowOpacity?: number }).glowOpacity ?? .9)
  const ctaLeadMobile = Number((controls as { ctaLeadMobile?: number }).ctaLeadMobile ?? 0)
  const ctaLeadDesktop = Number((controls as { ctaLeadDesktop?: number }).ctaLeadDesktop ?? 0)
  const ctaLeadStart = Number((controls as { ctaLeadStart?: number }).ctaLeadStart ?? .96)
  const ctaLeadEnd = Number((controls as { ctaLeadEnd?: number }).ctaLeadEnd ?? .34)
  const ctaOffsetX = Number((controls as { ctaOffsetX?: number }).ctaOffsetX ?? 0)
  const ctaOffsetY = Number((controls as { ctaOffsetY?: number }).ctaOffsetY ?? 0)
  const ctaFadeBefore = Number((controls as { ctaFadeBefore?: number }).ctaFadeBefore ?? 12)
  const ctaFadeLength = Number((controls as { ctaFadeLength?: number }).ctaFadeLength ?? 50)

  useEffect(() => {
    if (!isDev || !new URLSearchParams(window.location.search).has('beacon-tune')) return undefined
    document.documentElement.classList.add('mr-beacon-tuning')
    return () => document.documentElement.classList.remove('mr-beacon-tuning')
  }, [isDev])

  useEffect(() => {
    setCtaScene(document.querySelector<HTMLElement>('#page-sections .mr-closing-scene'))
  }, [])

  useEffect(() => {
    const page = document.getElementById('page-sections')
    const beacon = beaconRef.current
    if (!enabled || !page || !beacon) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = ANCHOR_IDS.map(id => page.querySelector<HTMLElement>(`#${id}`)).filter((el): el is HTMLElement => Boolean(el))
    let refreshTimer = 0
    let route: Point[] = []
    let pageTop = 0
    let sceneOffset: Point = { x: 0, y: 0 }
    let mobileArrivalLead = 240
    const moveX = gsap.quickTo(beacon, 'x', { duration: reduced ? 0 : Math.min(.38, scrub), ease: 'power2.out' })
    const moveY = gsap.quickTo(beacon, 'y', { duration: reduced ? 0 : Math.min(.38, scrub), ease: 'power2.out' })
    const fade = gsap.quickTo(beacon, 'opacity', { duration: reduced ? 0 : .25, ease: 'power2.out' })
    const localBeacon = ctaBeaconRef.current
    const localX = localBeacon && gsap.quickTo(localBeacon, 'x', { duration: reduced ? 0 : Math.min(.38, scrub), ease: 'power2.out' })
    const localY = localBeacon && gsap.quickTo(localBeacon, 'y', { duration: reduced ? 0 : Math.min(.38, scrub), ease: 'power2.out' })
    const localFade = localBeacon && gsap.quickTo(localBeacon, 'opacity', { duration: reduced ? 0 : .25, ease: 'power2.out' })

    const points = (): Point[] => {
      const pageRect = page.getBoundingClientRect()
      return ANCHOR_IDS.map(id => page.querySelector<HTMLElement>(`[data-beacon-anchor="${id}"]`))
        .filter((el): el is HTMLElement => Boolean(el))
        .map(el => {
          const rect = el.getBoundingClientRect()
          return { x: rect.left + rect.width / 2 - pageRect.left, y: rect.top + rect.height / 2 - pageRect.top }
        })
    }

    const measure = () => {
      route = points()
      if (route.length) {
        route[route.length - 1] = {
          x: route[route.length - 1].x + ctaOffsetX,
          y: route[route.length - 1].y + ctaOffsetY,
        }
      }
      pageTop = page.getBoundingClientRect().top + window.scrollY
      const title = ctaScene?.querySelector<HTMLElement>('.mr-closing-headline')
      if (title && route.length) {
        const titleRect = title.getBoundingClientRect()
        const pageRect = page.getBoundingClientRect()
        const titleCenter = titleRect.top + titleRect.height / 2 - pageRect.top
        // At the headline's viewport midpoint, the route reaches the painted light.
        mobileArrivalLead = route[route.length - 1].y - titleCenter + window.innerHeight * .05
      }
      if (ctaScene) {
        const pageRect = page.getBoundingClientRect()
        const sceneRect = ctaScene.getBoundingClientRect()
        sceneOffset = { x: sceneRect.left - pageRect.left, y: sceneRect.top - pageRect.top }
      }
      if (route.length < 2) return
      const commands = [`M ${route[0].x} ${route[0].y}`]
      for (let i = 0; i < route.length - 1; i++) {
        const from = route[i]
        const to = route[i + 1]
        const dy = to.y - from.y
        commands.push(`C ${from.x} ${from.y + dy * .35} ${to.x} ${to.y - dy * .35} ${to.x} ${to.y}`)
      }
      routeRef.current?.setAttribute('d', commands.join(' '))
    }

    const sync = () => {
      if (route.length < 2) return
      const mobile = window.innerWidth < 768
      const baseCursor = window.scrollY + window.innerHeight * (mobile ? .45 : .55) - pageTop
      const sceneViewportTop = sceneOffset.y + pageTop - window.scrollY
      const leadSpan = Math.max(.01, ctaLeadStart - ctaLeadEnd)
      const leadProgress = ctaScene ? clamp01((ctaLeadStart - sceneViewportTop / window.innerHeight) / leadSpan) : 0
      const easedLead = leadProgress * leadProgress * (3 - 2 * leadProgress)
      const cursor = baseCursor + (mobile ? mobileArrivalLead + ctaLeadMobile : ctaLeadDesktop) * easedLead
      let point = route[0]
      for (let i = 0; i < route.length - 1; i++) {
        const from = route[i]
        const to = route[i + 1]
        if (cursor < from.y) break
        const t = Math.max(0, Math.min(1, (cursor - from.y) / Math.max(1, to.y - from.y)))
        point = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
        if (cursor <= to.y) break
      }
      const final = route[route.length - 1]
      const arrival = clamp01((cursor - (final.y - ctaFadeBefore)) / ctaFadeLength)
      const opacity = glowOpacity * (1 - arrival)
      const localReveal = ctaScene ? Math.max(0, Math.min(1, (point.y - sceneOffset.y) / 28)) : 0
      moveX(point.x)
      moveY(point.y)
      fade(opacity * (1 - localReveal))
      localX?.(point.x - sceneOffset.x)
      localY?.(point.y - sceneOffset.y)
      localFade?.(opacity * localReveal)
    }

    const trigger = ScrollTrigger.create({
      id: 'home-reach-beacon', trigger: page, start: 'top bottom', end: 'bottom top',
      markers, onUpdate: sync, onRefresh: () => { measure(); sync() },
    })
    const refresh = () => {
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => { measure(); ScrollTrigger.refresh(); sync() }, 120)
    }
    const resize = new ResizeObserver(refresh)
    resize.observe(page)
    sections.forEach(section => resize.observe(section))
    window.addEventListener('resize', refresh)
    window.visualViewport?.addEventListener('resize', refresh)
    window.addEventListener('mr-beacon-anchor-change', refresh)
    document.fonts.addEventListener?.('loadingdone', refresh)
    document.fonts.ready.then(refresh).catch(() => undefined)
    measure()
    sync()
    return () => {
      window.clearTimeout(refreshTimer)
      resize.disconnect()
      window.removeEventListener('resize', refresh)
      window.visualViewport?.removeEventListener('resize', refresh)
      window.removeEventListener('mr-beacon-anchor-change', refresh)
      document.fonts.removeEventListener?.('loadingdone', refresh)
      trigger.kill()
      gsap.killTweensOf(beacon)
      if (localBeacon) gsap.killTweensOf(localBeacon)
    }
  }, [enabled, markers, scrub, glowOpacity, ctaScene, ctaLeadMobile, ctaLeadDesktop, ctaLeadStart, ctaLeadEnd, ctaOffsetX, ctaOffsetY, ctaFadeBefore, ctaFadeLength])

  if (!enabled) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" data-reach-beacon-root>
      <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true"><path ref={routeRef} stroke="rgba(53,77,47,.17)" strokeWidth="1" strokeDasharray="2 8" /></svg>
      <div ref={beaconRef} style={{ opacity: 0 }} className="pointer-events-none absolute left-0 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1d3219]/70 bg-[#C8FF3D] shadow-[0_0_0_3px_rgba(63,92,39,.17),0_0_10px_3px_rgba(200,255,61,.48)] will-change-transform" />
      {ctaScene && createPortal(<div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" data-reach-beacon-cta-layer>
        <div ref={ctaBeaconRef} style={{ opacity: 0 }} className="pointer-events-none absolute left-0 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1d3219]/70 bg-[#C8FF3D] shadow-[0_0_0_3px_rgba(63,92,39,.17),0_0_10px_3px_rgba(200,255,61,.48)] will-change-transform" />
      </div>, ctaScene)}
    </div>
  )
}
