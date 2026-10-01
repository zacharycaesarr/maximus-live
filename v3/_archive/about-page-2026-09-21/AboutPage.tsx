import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LevaPanel, useCreateStore } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll, { useLenisScroll } from '@/components/SmoothScroll'
import PortfolioHeroAbout from '@/components/about/PortfolioHeroAbout'
import SiteFooter from '@/components/sections/SiteFooter'
import { Reveal } from '@/components/ui/reveal'
import { TextBlockAnimation } from '@/components/ui/text-block-animation'
import { TextRoll } from '@/components/ui/text-roll'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { AboutTunerProvider, useAboutTuner } from '@/context/AboutTunerContext'
import { withBrandMentions } from '@/lib/withBrandMentions'
import { cn } from '@/lib/utils'
import { BarChart3, Clapperboard, Globe, MapPin } from 'lucide-react'

const titleGradient =
  'bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text text-transparent'

function AboutMain() {
  const t = useAboutTuner()
  const { scrollTo } = useLenisScroll()

  useEffect(() => {
    document.title = 'About · Maximus Reach'
  }, [])

  const services = [
    { icon: Globe, title: t.do1Title, body: t.do1Body },
    { icon: BarChart3, title: t.do2Title, body: t.do2Body },
    { icon: MapPin, title: t.do3Title, body: t.do3Body },
    { icon: Clapperboard, title: t.do4Title, body: t.do4Body },
  ]

  const steps = [
    { n: '01', title: t.step1Title, body: t.step1Body },
    { n: '02', title: t.step2Title, body: t.step2Body },
    { n: '03', title: t.step3Title, body: t.step3Body },
    { n: '04', title: t.step4Title, body: t.step4Body },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <DirectNav />
      <PortfolioHeroAbout
        eyebrow={t.heroEyebrow}
        line1={t.heroLine1}
        line2={t.heroLine2}
        tagline={t.heroTagline}
        onScrollDown={() => scrollTo('#about-story', { duration: 1.1 })}
      />

      <section id="about-story" className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Reveal duration={1.5}>
          <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
            {t.storyLabel}
          </p>
          <h2 className="m-0 font-nhg text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-[#2C2520]">
            <TextRoll
              className="text-[#2C2520]"
              duration={0.55}
              getEnterDelay={(i) => i * 0.045}
              getExitDelay={(i) => i * 0.045 + 0.18}
            >
              {t.storyTitle}
            </TextRoll>
          </h2>
        </Reveal>
        <div className="mt-5 space-y-4">
          <TextBlockAnimation
            delay={0.12}
            duration={0.75}
            wipeColor="#8B6950"
            accentColor="#c4a574"
            className="font-nhg text-base leading-relaxed text-espresso md:text-lg"
          >
            {withBrandMentions(t.storyP1)}
          </TextBlockAnimation>
          <TextBlockAnimation
            delay={0.28}
            duration={0.75}
            wipeColor="#c4a574"
            accentColor="#8B6950"
            className="font-nhg text-base leading-relaxed text-espresso md:text-lg"
          >
            {t.storyP2}
          </TextBlockAnimation>
        </div>
      </section>

      <div className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-espresso/12 to-transparent" aria-hidden />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal>
          <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
            {t.doLabel}
          </p>
          <h2 className={cn('m-0 max-w-xl font-nhg text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight', titleGradient)}>
            {t.doTitle}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={0.06 * i}>
              <article className="group rounded-2xl border border-espresso/8 bg-white/70 p-6 shadow-[0_8px_30px_rgba(44,37,32,0.06)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-espresso/15 hover:shadow-[0_18px_40px_rgba(44,37,32,0.1)]">
                <Icon
                  className="mb-4 text-[#8b6950] transition group-hover:text-[#c4a574]"
                  size={22}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="m-0 font-nhg text-lg font-semibold text-espresso">{title}</h3>
                <p className="mt-2 m-0 font-nhg text-sm leading-relaxed text-espresso/60">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-espresso/12 to-transparent" aria-hidden />

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <Reveal>
          <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
            {t.processLabel}
          </p>
          <h2 className={cn('m-0 font-nhg text-[clamp(2.1rem,5vw,3.1rem)] font-semibold tracking-tight', titleGradient)}>
            {t.processTitle}
          </h2>
        </Reveal>
        <ol className="mt-10 space-y-0 p-0">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={0.05 * i}>
              <li className="flex gap-5 border-b border-espresso/8 py-7 transition hover:bg-[#efeae2]/40">
                <span className="shrink-0 font-nhg text-base font-semibold tracking-wider text-[#c4a574]">{s.n}</span>
                <div>
                  <h3 className="m-0 font-nhg text-lg font-semibold text-espresso md:text-xl">{s.title}</h3>
                  <p className="mt-2 m-0 font-nhg text-[15px] leading-relaxed text-espresso/60 md:text-base">{s.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <Reveal>
        <section className="bg-[#0e0d0c] px-6 py-16 text-center md:py-20">
          <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-[#FCFAF2]/35">
            {t.ctaLabel}
          </p>
          <h2 className="m-0 font-nhg text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-[#FCFAF2]">
            {t.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-nhg text-sm text-[#FCFAF2]/55 md:text-base">{t.ctaSub}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${t.ctaEmail}`}
              className="inline-flex rounded-[10px] bg-[#efeae2] px-5 py-3 font-nhg text-sm font-medium text-espresso no-underline transition hover:bg-white hover:scale-[1.02]"
            >
              {t.ctaEmail}
            </a>
            <Link
              to="/start"
              className="inline-flex rounded-[10px] border border-[#FCFAF2]/20 px-5 py-3 font-nhg text-sm text-[#FCFAF2] no-underline transition hover:border-[#FCFAF2]/40 hover:scale-[1.02]"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>
      </Reveal>

      <SiteFooter />
    </div>
  )
}

export default function AboutPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <AboutTunerProvider store={store}>
            <SmoothScroll>
              <AboutMain />
            </SmoothScroll>
            {isDev && (
              <div data-lenis-prevent className="mr-v3-leva-host" onWheel={(e) => e.stopPropagation()}>
                <LevaPanel
                  key={mountKey}
                  store={store}
                  collapsed={{
                    collapsed,
                    onChange: (c) => {
                      setCollapsed(c)
                      if (!c) setMountKey((k) => k + 1)
                    },
                  }}
                  titleBar={{ title: 'Maximus · About', filter: false }}
                  oneLineLabels
                />
              </div>
            )}
          </AboutTunerProvider>
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
