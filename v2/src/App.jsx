import { useState } from 'react'
import { useScrollPhraseActive } from './hooks/useScrollPhraseActive'
import { useCreateStore, Leva } from 'leva'
import ShaderBackground from './components/background/ShaderBackground'
import AetherParticles from './components/background/AetherParticles'
import HeroKineticText from './components/hero/HeroKineticText'
import HeroSubhead from './components/hero/HeroSubhead'
import ServiceCardStack from './components/cards/ServiceCardStack'
import ScrollHeroStage from './components/scroll/ScrollHeroStage'
import ZPatternSection from './components/scroll/ZPatternSection'
import SiteNavbar from './components/nav/SiteNavbar'
import SiteFooter from './components/sections/SiteFooter'
import HeroLogo from './components/hero/HeroLogo'
import GlassNav from './components/nav/GlassNav'
import ParallaxLayer from './components/parallax/ParallaxLayer'
import { CardsTunerProvider, useCardsTuner } from './context/CardsTunerContext'
import { HeroTextTunerProvider, useHeroTextTuner } from './context/HeroTextTunerContext'
import { NavTunerProvider, useNavTuner } from './context/NavTunerContext'
import { ParallaxTunerProvider, useParallaxTuner } from './context/ParallaxTunerContext'
import { ParticlesTunerProvider, useParticlesTuner } from './context/ParticlesTunerContext'
import { ScrollTunerProvider, useScrollTuner } from './context/ScrollTunerContext'
import { ShaderTunerProvider, useShaderTuner } from './context/ShaderTunerContext'
import { SubheadTunerProvider, useSubheadTuner } from './context/SubheadTunerContext'
import { WavesTunerProvider } from './context/WavesTunerContext'
import { BentoTunerProvider } from './context/BentoTunerContext'
import { SiteChromeProvider } from './context/SiteChromeContext'
import { TypographyProvider } from './context/TypographyContext'
import { copyAllTunersToClipboard } from './lib/exportAllTuners'
import { loadPanelPositions, savePanelPosition } from './lib/panelPositions'
import './App.css'

const isDev = import.meta.env.DEV

/** Set false to roll back to full-screen hero only (pre scroll-window). */
export const SCROLL_WINDOW_ENABLED = true

function HeroLayer({ scrollActivated }) {
  const { uniforms } = useShaderTuner()
  const { settings } = useHeroTextTuner()
  const { settings: subhead } = useSubheadTuner()
  const { settings: particles } = useParticlesTuner()
  const { settings: cards } = useCardsTuner()
  const { settings: parallax } = useParallaxTuner()

  const overscan = parallax.bgOverscan / 100
  const overscanOffset = `${((1 - overscan) / 2) * 100}%`

  return (
    <>
      <section className="hero-bg" aria-label="Hero background">
        <ParallaxLayer
          depth={parallax.bgDepth}
          className="hero-bg-parallax"
          style={{
            inset: overscanOffset,
            width: `${overscan * 100}%`,
            height: `${overscan * 100}%`,
          }}
        >
          <ShaderBackground uniforms={uniforms} className="hero-bg-canvas" />
        </ParallaxLayer>
      </section>
      <AetherParticles settings={particles} />
      <HeroKineticText settings={settings} scrollActivated={scrollActivated} />
      <HeroSubhead settings={subhead} />
      <ServiceCardStack settings={cards} />
    </>
  )
}

function HeroShell({ scrollActivated }) {
  const { settings: scroll } = useScrollTuner()
  const { settings: nav } = useNavTuner()
  const useScrollWindow = SCROLL_WINDOW_ENABLED && scroll.enabled

  if (!useScrollWindow) {
    return (
      <>
        {nav.showStandaloneLogo && <HeroLogo settings={nav} />}
        <GlassNav settings={nav} />
        <HeroLayer scrollActivated={scrollActivated} />
        <div className="scroll-spacer" aria-hidden="true" />
      </>
    )
  }

  return (
    <>
      <div id="top" />
      <SiteNavbar />
      <ScrollHeroStage>
        <HeroLayer scrollActivated={scrollActivated} />
      </ScrollHeroStage>
      <ZPatternSection />
      <SiteFooter />
    </>
  )
}

export default function App() {
  const devStore = useCreateStore()
  const [panelPos, setPanelPos] = useState(loadPanelPositions)
  const scrollActivated = useScrollPhraseActive(48)

  const handlePanelDragEnd = (pos) => {
    savePanelPosition('dev', pos)
    setPanelPos((prev) => ({ ...prev, dev: pos }))
  }

  return (
    <ShaderTunerProvider store={devStore}>
      <ParallaxTunerProvider store={devStore}>
        <ParticlesTunerProvider store={devStore}>
          <HeroTextTunerProvider store={devStore}>
            <SubheadTunerProvider store={devStore}>
              <NavTunerProvider store={devStore}>
                <CardsTunerProvider store={devStore}>
                  <ScrollTunerProvider store={devStore}>
                    <WavesTunerProvider store={devStore}>
                      <BentoTunerProvider store={devStore}>
                        <SiteChromeProvider store={devStore}>
                          <TypographyProvider store={devStore}>
                          {isDev && (
                            <>
                              <Leva
                                collapsed
                                store={devStore}
                                theme={{
                                  sizes: {
                                    rootWidth: '380px',
                                    controlWidth: '168px',
                                    numberInputMinWidth: '56px',
                                  },
                                }}
                                titleBar={{
                                  title: 'Maximus · Dev',
                                  drag: true,
                                  position: panelPos.dev,
                                  onDragEnd: handlePanelDragEnd,
                                }}
                              />
                              <button
                                type="button"
                                className="dev-export-all"
                                onClick={() => copyAllTunersToClipboard()}
                              >
                                Copy ALL JSON
                              </button>
                            </>
                          )}
                          <HeroShell scrollActivated={scrollActivated} />
                          </TypographyProvider>
                        </SiteChromeProvider>
                      </BentoTunerProvider>
                    </WavesTunerProvider>
                  </ScrollTunerProvider>
                </CardsTunerProvider>
              </NavTunerProvider>
            </SubheadTunerProvider>
          </HeroTextTunerProvider>
        </ParticlesTunerProvider>
      </ParallaxTunerProvider>
    </ShaderTunerProvider>
  )
}
