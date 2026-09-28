import { useRef } from 'react'
import DepthFlipText from '@/components/ui/depth-flip-text'
import ImageFanCarousel from '@/components/ui/image-fan-carousel'
import { FaqPro } from '@/components/ui/faq-pro'
import SectionFocus, { SectionParallax } from '@/components/sections/SectionFocus'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ServicesOverviewCards from '@/components/sections/ServicesOverviewCards'
import { useServicesOverviewTuner } from '@/context/ServicesOverviewTunerContext'
import WhyComparisonMatrix from '@/components/sections/WhyComparisonMatrix'
import MotionGetStarted from '@/components/sections/MotionGetStarted'
import DynamicWaveCanvas from '@/components/sections/DynamicWaveCanvas'
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

  return (
    <div
      id="page-sections"
      ref={rootRef}
      className="relative w-full overflow-x-clip"
      style={{ backgroundColor: 'var(--home-bg-dark)' }}
    >
      <PageScrollGradient settings={pageBg} targetRef={rootRef} />
      <ServicesStarField opacity={pageBg.starsOpacity} fadeEnd={pageBg.starsFadeEnd} />
      <ReachBeacon store={store} />

      <div className="relative z-10">
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
                <p className={cn('mb-2 text-left', eyebrowOnDark)}>01</p>
                <h2
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

        <SectionFocus align="right" idleScale={0.72} focusScale={1.05} idleOffsetX={56}>
          <SectionParallax strength={12}>
            <section
              id="work"
              className="relative w-full overflow-x-clip px-4 py-10 md:py-16"
              aria-label="Proof of work"
            >
              <p className={cn('mb-2 text-center', eyebrowOnDark)}>02 · Proof of work</p>
              {proof.enabled && (
                <>
                  <div className="relative mx-auto w-full max-w-4xl">
                    <BeaconAnchor id="work" className="left-[8%] top-1/2 -translate-y-1/2 md:left-[18%]" />
                    <NearMount minHeight={160}>
                      <DepthFlipText
                        phrases={[proof.flipPhraseA, proof.flipPhraseB]}
                        textColor={proof.flipColor === 'var(--home-text-dark)' ? 'var(--home-text-light)' : proof.flipColor}
                        backgroundColor="transparent"
                        fontClassName="font-nhg"
                        loop
                        compact
                      />
                    </NearMount>
                  </div>
                  <NearMount minHeight={420}>
                    <ImageFanCarousel />
                  </NearMount>
                </>
              )}
            </section>
          </SectionParallax>
        </SectionFocus>

        <SectionBreak />
        <div className="relative">
          <BeaconAnchor id="how-it-works" className="left-1/2 top-6 -translate-x-1/2" />
          <HowItWorksSection />
        </div>
        <SectionBreak />

        <SectionFocus align="right" idleScale={0.76} focusScale={1.04} idleOffsetX={56}>
          <SectionParallax>
            <section
              id="why-maximus"
              data-parallax-pause
              className="relative mx-auto w-full max-w-6xl overflow-x-clip px-5 py-10 md:py-16"
              aria-label="Why Maximus Reach"
            >
              <p className={cn('mb-1.5 text-right md:mb-2', eyebrowOnDark)}>04</p>
              <div className="relative mb-5 md:mb-10">
                <BeaconAnchor id="why-maximus" className="left-0 top-1/2 -translate-y-1/2 md:left-[8%]" />
                <h2
                  className={cn(
                    'm-0 text-right font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                    'text-home-on-light',
                  )}
                >
                  Why Maximus Reach?
                </h2>
              </div>
              <WhyComparisonMatrix />
            </section>
          </SectionParallax>
        </SectionFocus>

        <SectionBreak />

        <SectionFocus align="left" idleScale={0.76} focusScale={1.04} idleOffsetX={56}>
          <SectionParallax>
            <section
              id="faq"
              className="relative mx-auto w-full max-w-3xl overflow-x-clip px-5 py-10 md:py-16"
              aria-label="FAQ"
            >
              <p className={cn('mb-2 text-left', eyebrowOnDark)}>05</p>
              <div className="relative mb-8">
                <BeaconAnchor id="faq" className="right-0 top-1/2 -translate-y-1/2 md:right-[12%]" />
                <h2
                  className={cn(
                    'm-0 text-left font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                    'text-home-on-light',
                  )}
                >
                  FAQ
                </h2>
              </div>
              {faq.enabled && (
                <FaqPro
                  items={faq.items}
                  defaultOpenFirst={faq.defaultOpenFirst}
                  searchPlaceholder={faq.searchPlaceholder}
                />
              )}
            </section>
          </SectionParallax>
        </SectionFocus>

        <div className="relative">
          <BeaconAnchor id="get-started" className="left-1/2 top-10 -translate-x-1/2" />
          <DynamicWaveCanvas
            waveSpeed={pageBg.waveSpeed}
            waveStrength={pageBg.waveStrength}
            waveAcidAmount={pageBg.waveAcidAmount}
          />
          <MotionGetStarted />
        </div>
        <SiteFooter tone="onDark" />
      </div>
    </div>
  )
}
