import DepthFlipText from '@/components/ui/depth-flip-text'
import ImageFanCarousel from '@/components/ui/image-fan-carousel'
import { FaqPro } from '@/components/ui/faq-pro'
import SectionFocus, { SectionParallax } from '@/components/sections/SectionFocus'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import WhyMaximusBento from '@/components/sections/WhyMaximusBento'
import WhyComparisonMatrix from '@/components/sections/WhyComparisonMatrix'
import MotionGetStarted from '@/components/sections/MotionGetStarted'
import SiteFooter from '@/components/sections/SiteFooter'
import SectionBreak from '@/components/sections/SectionBreak'
import PageScrollGradient from '@/components/sections/PageScrollGradient'
import { useProofTuner } from '@/context/ProofTunerContext'
import { useFaqTuner } from '@/context/FaqTunerContext'
import { usePageScrollBgTuner } from '@/context/PageScrollBgTunerContext'
import { cn } from '@/lib/utils'

/** Titles for cream-top → warm-espresso page BG */
const titleGradient =
  'bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text text-transparent'

const eyebrow = 'font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/45'

/**
 * Page section map. Shared Axis Blend gradient behind everything below the hero.
 * Section identity = cards / spacing / numbers, not a new full-bleed color per block.
 */
export default function PageSections() {
  const proof = useProofTuner()
  const faq = useFaqTuner()
  const pageBg = usePageScrollBgTuner()

  return (
    <div id="page-sections" className="relative w-full">
      <PageScrollGradient settings={pageBg} />

      <div className="relative z-10">
        <SectionFocus align="left" idleScale={0.76} focusScale={1.04} idleOffsetX={56}>
          <SectionParallax>
            <section
              id="services"
              data-parallax-pause
              className="relative mx-auto w-full max-w-6xl overflow-x-clip px-5 py-10 md:py-16"
              aria-label="Services overview"
            >
              <p className={cn('mb-2 text-left', eyebrow)}>01</p>
              <h2
                className={cn(
                  'm-0 mb-10 text-left font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                  titleGradient,
                )}
              >
                Services overview
              </h2>
              <WhyMaximusBento />
            </section>
          </SectionParallax>
        </SectionFocus>

        <SectionBreak />

        <SectionFocus align="right" idleScale={0.72} focusScale={1.05} idleOffsetX={56}>
          <SectionParallax strength={12}>
            <section
              id="work"
              className="relative w-full overflow-x-clip px-4 py-10 md:py-16"
              aria-label="Proof of work"
            >
              <p className={cn('mb-2 text-center', eyebrow)}>02 · Proof of work</p>
              {proof.enabled && (
                <>
                  <DepthFlipText
                    phrases={[proof.flipPhraseA, proof.flipPhraseB]}
                    textColor={proof.flipColor}
                    backgroundColor="transparent"
                    fontClassName="font-nhg"
                    loop
                    compact
                  />
                  <ImageFanCarousel />
                </>
              )}
            </section>
          </SectionParallax>
        </SectionFocus>

        <SectionBreak />
        <HowItWorksSection />
        <SectionBreak />

        <SectionFocus align="right" idleScale={0.76} focusScale={1.04} idleOffsetX={56}>
          <SectionParallax>
            <section
              id="why-maximus"
              data-parallax-pause
              className="relative mx-auto w-full max-w-6xl overflow-x-clip px-5 py-10 md:py-16"
              aria-label="Why Maximus Reach"
            >
              <p className={cn('mb-2 text-right', eyebrow)}>04</p>
              <h2
                className={cn(
                  'm-0 mb-10 text-right font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                  titleGradient,
                )}
              >
                Why Maximus Reach?
              </h2>
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
              <p className={cn('mb-2 text-left', eyebrow)}>05</p>
              <h2
                className={cn(
                  'm-0 mb-8 text-left font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight',
                  titleGradient,
                )}
              >
                FAQ
              </h2>
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

        <MotionGetStarted />
        <SiteFooter tone="onDark" />
      </div>
    </div>
  )
}
