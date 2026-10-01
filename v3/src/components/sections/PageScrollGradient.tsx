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

function rgb(hex: string) {
  const parts = hex.match(/[0-9a-f]{2}/gi)
  return parts && parts.length === 3 ? parts.map((part) => parseInt(part, 16)).join(',') : '243,240,232'
}

/** One shared CSS paint for Services, the cream sections, and the dark return. */
export default function PageScrollGradient({ settings, targetRef }: Props) {
  useLayoutEffect(() => {
    const page = targetRef?.current ?? document.getElementById('page-sections')
    if (!page) return undefined
    const services = page.querySelector<HTMLElement>('[data-services-band]')
    const proof = page.querySelector<HTMLElement>('#work')
    const why = page.querySelector<HTMLElement>('#why-maximus')
    const faq = page.querySelector<HTMLElement>('#faq')
    const cta = page.querySelector<HTMLElement>('#get-started')
    const content = services?.parentElement
    if (!services || !proof || !why || !faq || !cta || !content) return undefined

    const previous = {
      backgroundImage: page.style.backgroundImage,
      backgroundSize: page.style.backgroundSize,
      backgroundPosition: page.style.backgroundPosition,
      backgroundRepeat: page.style.backgroundRepeat,
      grainOpacity: page.style.getPropertyValue('--home-cream-grain-opacity'),
      grainSize: page.style.getPropertyValue('--home-cream-grain-size'),
      grainStart: page.style.getPropertyValue('--home-cream-grain-start'),
      grainEnd: page.style.getPropertyValue('--home-cream-grain-end'),
    }
    const sync = () => {
      const vh = window.innerHeight / 100
      const servicesEnd = layoutBox(content, services).bottom
      const proofTop = layoutBox(content, proof).top
      const whyTop = layoutBox(content, why).top
      const faqEnd = layoutBox(content, faq).bottom
      const ctaBottom = layoutBox(content, cta).bottom

      const fadeLength = settings.servicesFadeLength * vh
      const fadeStart = Math.max(0, servicesEnd - fadeLength * 0.38)
      const fadeEnd = fadeStart + fadeLength
      const curve = settings.servicesFadeCurve / 100
      const darkHold = fadeStart + fadeLength * (0.25 + curve * 0.18)
      const creamEntry = fadeStart + fadeLength * (0.68 + curve * 0.1)
      const fadePct = (at: number) => `${(100 * at / fadeEnd).toFixed(2)}%`
      const tone = Math.min(0.3, settings.creamTonalStrength / 100)
      page.style.setProperty('--home-cream-grain-opacity', String(settings.creamTextureOpacity / 100))
      page.style.setProperty('--home-cream-grain-size', `${Math.round(64 * settings.creamTextureScale)}px`)
      page.style.setProperty('--home-cream-grain-start', `${Math.round(fadeEnd - 120)}px`)
      page.style.setProperty('--home-cream-grain-end', `${Math.round(ctaBottom)}px`)

      const shade = rgb(settings.creamToneShade)
      const light = rgb(settings.creamToneLight)
      page.style.backgroundImage = [
        `radial-gradient(ellipse 250% ${Math.max(fadeEnd, 1)}px at 50% 0px, #080909 0%, #080909 ${fadePct(fadeStart)}, #11120E ${fadePct(darkHold)}, #F3F0E8 ${fadePct(creamEntry)}, rgba(243,240,232,0) 100%)`,
        `radial-gradient(ellipse 85% 940px at 16% ${proofTop + 340}px, rgba(${light},${tone}) 0%, transparent 78%)`,
        `radial-gradient(ellipse 82% 1060px at 88% ${whyTop + 180}px, rgba(${shade},${tone * 0.8}) 0%, transparent 82%)`,
        `radial-gradient(ellipse 90% 960px at 20% ${faqEnd - 150}px, rgba(${light},${tone * 0.7}) 0%, transparent 82%)`,
      ].join(', ')
      page.style.backgroundSize = 'auto'
      page.style.backgroundPosition = '0 0'
      page.style.backgroundRepeat = 'no-repeat'
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(content)
    for (const element of [services, proof, why, faq, cta]) observer.observe(element)
    window.addEventListener('resize', sync)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', sync)
      page.style.backgroundImage = previous.backgroundImage
      page.style.backgroundSize = previous.backgroundSize
      page.style.backgroundPosition = previous.backgroundPosition
      page.style.backgroundRepeat = previous.backgroundRepeat
      if (previous.grainOpacity) page.style.setProperty('--home-cream-grain-opacity', previous.grainOpacity)
      else page.style.removeProperty('--home-cream-grain-opacity')
      if (previous.grainSize) page.style.setProperty('--home-cream-grain-size', previous.grainSize)
      else page.style.removeProperty('--home-cream-grain-size')
      if (previous.grainStart) page.style.setProperty('--home-cream-grain-start', previous.grainStart)
      else page.style.removeProperty('--home-cream-grain-start')
      if (previous.grainEnd) page.style.setProperty('--home-cream-grain-end', previous.grainEnd)
      else page.style.removeProperty('--home-cream-grain-end')
    }
  }, [settings, targetRef])

  return null
}
