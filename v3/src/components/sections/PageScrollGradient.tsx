import { useLayoutEffect, type RefObject } from 'react'
import type { PageScrollBgTuner } from '@/lib/pageScrollBgDefaults'

type Props = {
  settings: PageScrollBgTuner
  targetRef?: RefObject<HTMLElement | null>
}

function layoutBox(content: HTMLElement, element: HTMLElement) {
  let segment: HTMLElement = element
  while (segment.parentElement && segment.parentElement !== content) segment = segment.parentElement
  return { top: segment.offsetTop, bottom: segment.offsetTop + segment.offsetHeight }
}

function grainTile(opacity: number) {
  const alpha = Math.max(0, Math.min(0.06, opacity / 100))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17"><g fill="#080909" fill-opacity="${alpha}"><circle cx="2" cy="3" r=".3"/><circle cx="12" cy="2" r=".25"/><circle cx="7" cy="9" r=".3"/><circle cx="15" cy="13" r=".25"/><circle cx="3" cy="15" r=".2"/></g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Static CSS paint; ResizeObserver only updates stops when section geometry changes. */
export default function PageScrollGradient({ settings, targetRef }: Props) {
  useLayoutEffect(() => {
    const page = targetRef?.current ?? document.getElementById('page-sections')
    if (!page) return undefined
    const services = page.querySelector<HTMLElement>('[data-services-band]')
    const why = page.querySelector<HTMLElement>('#why-maximus')
    const faq = page.querySelector<HTMLElement>('#faq')
    const cta = page.querySelector<HTMLElement>('#get-started')
    const content = services?.parentElement
    if (!services || !why || !faq || !cta || !content) return undefined

    const previousImage = page.style.backgroundImage
    const previousSize = page.style.backgroundSize
    const previousPosition = page.style.backgroundPosition
    const sync = () => {
      const vh = window.innerHeight / 100
      const servicesEnd = layoutBox(content, services).bottom
      const faqEnd = layoutBox(content, faq).bottom
      const whyTop = layoutBox(content, why).top
      const ctaTop = layoutBox(content, cta).top
      const lightStart = Math.max(0, servicesEnd + settings.lightTransitionStart * vh)
      const lightEnd = Math.max(lightStart + 120, servicesEnd + settings.lightTransitionEnd * vh)
      const darkStart = Math.max(lightEnd + 200, faqEnd + settings.darkReturnStart * vh)
      const darkEnd = Math.max(darkStart + 120, faqEnd + settings.darkReturnEnd * vh, ctaTop + 20)
      const creamAlpha = Math.max(0, Math.min(0.25, settings.creamLightStrength / 100))
      const speckleAlpha = Math.max(0, Math.min(0.12, settings.speckleOpacity / 100))
      const speckleSize = Math.max(24, 125 - settings.speckleDensity)

      page.style.backgroundImage = [
        grainTile(settings.grainOpacity),
        `radial-gradient(circle at 2px 4px, rgba(8,9,9,${speckleAlpha}) 0 0.45px, transparent 0.7px)`,
        `radial-gradient(circle at 13px 17px, rgba(8,9,9,${speckleAlpha * 0.65}) 0 0.35px, transparent 0.6px)`,
        `linear-gradient(to bottom, transparent 0px, transparent ${darkStart}px, var(--home-bg-dark) ${darkEnd}px, var(--home-bg-dark) 100%)`,
        `radial-gradient(ellipse 70% 680px at 25% ${whyTop}px, rgba(248,245,238,${creamAlpha}) 0%, transparent 75%)`,
        `radial-gradient(ellipse 65% 560px at 80% ${Math.round((whyTop + faqEnd) / 2)}px, rgba(235,230,220,${creamAlpha * 0.5}) 0%, transparent 76%)`,
        `linear-gradient(to bottom, var(--home-bg-dark) 0px, var(--home-bg-dark) ${lightStart}px, var(--home-bg-light) ${lightEnd}px, var(--home-bg-light) 100%)`,
      ].join(', ')
      page.style.backgroundSize = `17px 17px, ${speckleSize}px ${speckleSize + 13}px, ${speckleSize + 31}px ${speckleSize + 7}px, auto, auto, auto, auto`
      page.style.backgroundPosition = '0 0, 0 0, 19px 23px, 0 0, 0 0, 0 0, 0 0'
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(content)
    for (const element of [services, why, faq, cta]) observer.observe(element)
    window.addEventListener('resize', sync)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', sync)
      page.style.backgroundImage = previousImage
      page.style.backgroundSize = previousSize
      page.style.backgroundPosition = previousPosition
    }
  }, [settings, targetRef])

  return null
}
