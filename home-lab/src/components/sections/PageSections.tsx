import { useEffect, useLayoutEffect, useRef } from 'react'
import DepthFlipText from '@/components/ui/depth-flip-text'
import ImageFanCarousel from '@/components/ui/image-fan-carousel'
import { FaqPro } from '@/components/ui/faq-pro'
import SectionFocus, { SectionParallax } from '@/components/sections/SectionFocus'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ServicesOverviewCards from '@/components/sections/ServicesOverviewCards'
import { useServicesOverviewTuner } from '@/context/ServicesOverviewTunerContext'
import WhyComparisonMatrix from '@/components/sections/WhyComparisonMatrix'
import MotionGetStarted from '@/components/sections/MotionGetStarted'
import CreamNodeLayer from '@/components/sections/CreamNodeLayer'
import SiteFooter from '@/components/sections/SiteFooter'
import SectionBreak from '@/components/sections/SectionBreak'
import PageScrollGradient from '@/components/sections/PageScrollGradient'
import ReachBeacon from '@/components/sections/ReachBeacon'
import ServicesStarField from '@/components/sections/ServicesStarField'
import { useProofTuner } from '@/context/ProofTunerContext'
import { useFaqTuner } from '@/context/FaqTunerContext'
import { usePageScrollBgTuner } from '@/context/PageScrollBgTunerContext'
import { useHomeLevaStore } from '@/context/HomeLevaStoreContext'
import { NearMount } from '@/components/NearMount'
import { cn } from '@/lib/utils'
import './closing-scene.css'

/** Section titles on dark environment */
const titleOnDark = 'text-home-on-dark'
const eyebrowOnDark =
  'font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-home-muted'

/** Invisible layout anchor for Reach Beacon */
function BeaconAnchor({ id, className }: { id: string; className?: string }) {
  return (
    <span
      data-beacon-anchor={id}
      aria-hidden
      className={cn('pointer-events-none absolute h-px w-px', className)}
    />
  )
}

/** Tracks the painted horizon light through each image's cover crop. */
function CtaPaintedBeaconAnchor() {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const anchor = ref.current
    const scene = anchor?.closest<HTMLElement>('.mr-closing-scene')
    const picture = scene?.querySelector<HTMLElement>('.mr-closing-art')
    const image = picture?.querySelector('img')
    if (!anchor || !scene || !picture || !image) return undefined
    // Prepare only the picture-selected artwork before its first visible paint.
    void image.decode().catch(() => undefined)
    const measure = () => {
      if (!image.naturalWidth || !image.naturalHeight) return
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const painted = mobile ? { x: 2075, y: 2085 } : { x: 2062, y: 1155 }
      const scale = Math.max(picture.clientWidth / image.naturalWidth, picture.clientHeight / image.naturalHeight)
      const renderedWidth = image.naturalWidth * scale
      const renderedHeight = image.naturalHeight * scale
      const [positionX, positionY] = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100)
      const x = (picture.clientWidth - renderedWidth) * positionX + painted.x * scale
      const y = (picture.clientHeight - renderedHeight) * positionY + painted.y * scale
      anchor.style.left = `${Math.max(8, Math.min(scene.clientWidth - 8, x))}px`
      anchor.style.top = `${y}px`
      window.dispatchEvent(new Event('mr-beacon-anchor-change'))
    }
    measure()
    image.addEventListener('load', measure)
    const resize = new ResizeObserver(measure)
    resize.observe(scene)
    resize.observe(picture)
    window.addEventListener('resize', measure)
    return () => { image.removeEventListener('load', measure); resize.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  return <span ref={ref} data-beacon-anchor="get-started" className="pointer-events-none absolute z-[1] h-px w-px" aria-hidden />
}

/**
 * Page section map.
 * Layer: atmospheric BG → Beacon → content. (Reach Network removed.)
 */
export default function PageSections() {
  const proof = useProofTuner()
  const faq = useFaqTuner()
  const pageBg = usePageScrollBgTuner()
  const services = useServicesOverviewTuner()
  const store = useHomeLevaStore() ?? undefined
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        (entry.target as HTMLElement).dataset.homeVisible = '1'
        observer.unobserve(entry.target)
      })
    }, { threshold: .06, rootMargin: '0px 0px -7% 0px' })
    const observeReveals = (node: Node) => {
      if (!(node instanceof Element)) return
      if (node.matches('[data-home-reveal]')) observer.observe(node)
      node.querySelectorAll<HTMLElement>('[data-home-reveal]').forEach(element => observer.observe(element))
    }
    observeReveals(root)
    // Some sections mount their content only when near the viewport.
    const addedContent = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(observeReveals)))
    addedContent.observe(root, { childList: true, subtree: true })
    return () => { observer.disconnect(); addedContent.disconnect() }
  }, [])

  return (
    <div
      id="page-sections"
      ref={rootRef}
      className="relative w-full overflow-x-clip"
      style={{ backgroundColor: pageBg.creamBase }}
    >
      <PageScrollGradient settings={pageBg} targetRef={rootRef} />
      <ServicesStarField opacity={0.86} fadeEnd={100} />
      <CreamNodeLayer settings={pageBg} targetRef={rootRef} />
      <ReachBeacon store={store} />

      <div className="relative z-[3]">
        <div data-services-band>
        {/*
          Equal 3-up cards already fill max-w-6xl. Keep focusScale at 1 so the
          left-origin Z animation does not grow the row past overflow-x-clip
          and shear the right edge of card 3.
        */}
        <SectionFocus
          align="left"
          idleScale={0.76}
          focusScale={1}
          idleOffsetX={56}
          className="py-16 md:py-24"
        >
          <SectionParallax>
            <section
              id="services"
              data-parallax-pause
              className="relative w-full py-14 md:py-20"
              aria-label="Services overview"
            >
              <div className="relative z-[1] mx-auto w-full max-w-6xl px-5">
                <BeaconAnchor id="services" className="left-1/2 top-2 -translate-x-1/2" />
                <p data-home-reveal className={cn('mb-2 text-left', eyebrowOnDark)}>01</p>
                <h2
                  data-home-reveal
                  className={cn(
                    'm-0 mb-10 text-left font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                    titleOnDark,
                  )}
                >
                  {services.sectionTitle}
                </h2>
                <ServicesOverviewCards />
              </div>
            </section>
          </SectionParallax>
        </SectionFocus>
        </div>

        <SectionBreak />

        <SectionFocus align="right" idleScale={0.85} focusScale={1.05} idleOffsetX={40} className="home-focus-tight home-proof-focus">
          <SectionParallax strength={12}>
            <section
              id="work"
              className="relative w-full overflow-x-clip px-4 pb-4 pt-10 md:pb-4 md:pt-16"
              aria-label="Proof of work"
            >
              <p data-home-reveal className={cn('mb-2 text-center', eyebrowOnDark)}>02 · Proof of work</p>
              {proof.enabled && (
                <>
                  <div data-home-reveal className="relative mx-auto w-full max-w-4xl">
                    <BeaconAnchor id="work" className="left-[8%] top-1/2 -translate-y-1/2 md:left-[18%]" />
                    <NearMount minHeight={160}>
                      <DepthFlipText
                        phrases={[proof.flipPhraseA, proof.flipPhraseB]}
                        textColor={proof.flipColor === '#fcfaf2' || proof.flipColor === 'var(--home-text-dark)' ? 'var(--home-text-light)' : proof.flipColor}
                        backgroundColor="transparent"
                        fontClassName="font-nhg"
                        loop
                        compact
                      />
                    </NearMount>
                  </div>
                  <div data-home-reveal><NearMount minHeight={420}><ImageFanCarousel /></NearMount></div>
                </>
              )}
            </section>
          </SectionParallax>
        </SectionFocus>

        <div className="relative">
          <BeaconAnchor id="how-it-works" className="left-1/2 top-6 -translate-x-1/2" />
          <HowItWorksSection />
        </div>
        <div className="home-why-band"><WhyComparisonMatrix /></div>

        <SectionFocus align="left" idleScale={0.86} focusScale={1} idleOffsetX={28} className="home-focus-tight home-faq-focus">
          <SectionParallax>
            <section
              id="faq"
              className="relative mx-auto w-full max-w-3xl overflow-x-clip px-5 py-6 md:py-12"
              aria-label="FAQ"
            >
              <p data-home-reveal className={cn('mb-2 text-left', eyebrowOnDark)}>05</p>
              <div className="relative mb-8">
                <BeaconAnchor id="faq" className="right-0 top-1/2 -translate-y-1/2 md:right-[12%]" />
                <h2
                  data-home-reveal
                  className={cn(
                    'm-0 text-left font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                    'text-home-on-light',
                  )}
                >
                  FAQ
                </h2>
              </div>
              {faq.enabled && (
                <div data-home-reveal><FaqPro items={faq.items} defaultOpenFirst={faq.defaultOpenFirst} searchPlaceholder={faq.searchPlaceholder} /></div>
              )}
            </section>
          </SectionParallax>
        </SectionFocus>

        <div className="mr-closing-scene">
          <CtaPaintedBeaconAnchor />
          <picture className="mr-closing-art" aria-hidden="true">
            <source media="(max-width: 767px)" srcSet="/images/cta/maximus-cta-mobile.webp" type="image/webp" />
            <img src="/images/cta/maximus-cta-desktop.webp" alt="" decoding="async" />
          </picture>
          <MotionGetStarted />
          <SiteFooter tone="onLight" seamless />
        </div>
      </div>
    </div>
  )
}
