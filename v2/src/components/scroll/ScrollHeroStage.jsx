import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import BrowserChrome from './BrowserChrome'
import ScrollPillDock from './ScrollPillDock'
import ScrollConnector from './ScrollConnector'
import ScrollHint from './ScrollHint'
import HeroLogo from '../hero/HeroLogo'
import GlassNav from '../nav/GlassNav'
import BlurInLine from '../hero/BlurInLine'
import RealityDotPattern from './RealityDotPattern'
import WavesBackground from '../background/WavesBackground'
import { useWindowTilt } from '../../hooks/useWindowTilt'
import { useNavTuner } from '../../context/NavTunerContext'
import { useScrollTuner } from '../../context/ScrollTunerContext'
import { useWavesTuner } from '../../context/WavesTunerContext'
import '../hero/blur-in-line.css'
import './scroll-hero-stage.css'
import '../hero/hero-scene.css'

function holdKeys(transitionEnd, holdEnd, from, to) {
  return {
    input: [0, transitionEnd, holdEnd, 1],
    output: [from, to, to, to],
  }
}

export default function ScrollHeroStage({ children }) {
  const { settings: scroll } = useScrollTuner()
  const { settings: nav } = useNavTuner()
  const { hold: holdWaves } = useWavesTuner()
  const waveUniforms = holdWaves.uniforms
  const waves = holdWaves.settings
  const containerRef = useRef(null)
  const [titleActive, setTitleActive] = useState(false)
  const [inReality, setInReality] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const { transitionEnd, holdEnd } = scroll

  const scale = useTransform(
    scrollYProgress,
    [0, scroll.scaleStart, transitionEnd, holdEnd, 1],
    [1, 1, scroll.scaleMin, scroll.scaleMin, scroll.scaleMin],
  )

  const radius = useTransform(
    scrollYProgress,
    holdKeys(transitionEnd, holdEnd, 0, scroll.borderRadiusEnd).input,
    holdKeys(transitionEnd, holdEnd, 0, scroll.borderRadiusEnd).output,
  )

  const backdropOpacity = useTransform(
    scrollYProgress,
    [0, scroll.backdropFadeStart, scroll.backdropFadeEnd, holdEnd, 1],
    [0, 0, 1, 1, 1],
  )

  const chromeOpacity = useTransform(
    scrollYProgress,
    [0, scroll.chromeRevealStart, scroll.chromeRevealEnd, holdEnd, 1],
    [0, 0, 1, 1, 1],
  )

  const chromeY = useTransform(
    scrollYProgress,
    [0, scroll.chromeRevealStart, scroll.chromeRevealEnd, holdEnd, 1],
    [-scroll.chromeHeight, -scroll.chromeHeight, 0, 0, 0],
  )

  const frameStrength = useTransform(
    scrollYProgress,
    [0, scroll.chromeRevealStart, transitionEnd, holdEnd, 1],
    [0, 0, 1, 1, 1],
  )

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, scroll.chromeRevealEnd, transitionEnd, holdEnd, 1],
    [0, 0, 1, 1, 1],
  )

  const surroundingsOpacity = useTransform(
    scrollYProgress,
    [0, transitionEnd * 0.92, transitionEnd, holdEnd, 1],
    [0, 0, 1, 1, 1],
  )

  const glassNavOpacity = useTransform(
    scrollYProgress,
    [0, scroll.glassNavFadeStart, scroll.glassNavFadeEnd, holdEnd, 1],
    [1, 1, 0, 0, 0],
  )

  const hintOpacity = useTransform(
    scrollYProgress,
    [0, scroll.hintFadeEnd, transitionEnd, holdEnd, 1],
    [1, 0, 0, 0, 0],
  )

  const logoLightMix = useTransform(
    scrollYProgress,
    [0, scroll.logoLightEnd, holdEnd, 1],
    [0, 1, 1, 1],
  )

  const compositionY = useTransform(
    scrollYProgress,
    [0, transitionEnd, holdEnd, 1],
    [0, scroll.compositionShiftPx, scroll.compositionShiftPx, scroll.compositionShiftPx],
  )

  const titleTop = useTransform([scale, compositionY], ([s, compY]) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    const windowVisualTop = (vh * (1 - s)) / 2 + compY
    const titleBlockH = 48
    const clearance = 28
    const cappedTop = windowVisualTop - titleBlockH - clearance
    const tunedTop = windowVisualTop + scroll.titleGapPx
    return Math.min(tunedTop, cappedTop)
  })

  const dockTop = useTransform([scale, compositionY], ([s, compY]) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    const visualBottom = (vh * (1 + s)) / 2 + compY
    // Pill Dock + explore stack always sit below the browser window.
    // Do not clamp upward into the window (that caused the overlap).
    return visualBottom + scroll.dockGapPx
  })

  const spotlightFrame = useTransform([scale, compositionY], ([s, compY]) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
    const height = vh * s
    const width = vw * s
    return {
      top: (vh - height) / 2 + compY,
      left: (vw - width) / 2,
      width,
      height,
    }
  })

  const spotlightTop = useTransform(spotlightFrame, (f) => f.top)
  const spotlightLeft = useTransform(spotlightFrame, (f) => f.left)
  const spotlightWidth = useTransform(spotlightFrame, (f) => f.width)
  const spotlightHeight = useTransform(spotlightFrame, (f) => f.height)

  const shellBorderColor = useTransform(frameStrength, (v) => {
    const a = Math.max(0, Math.min(1, v)) * 0.14
    return `rgba(255, 255, 255,${a})`
  })

  const shellBorderWidth = useTransform(frameStrength, (v) => (v > 0.02 ? 1 : 0))

  const shellShadow = useTransform(frameStrength, (v) =>
    v > 0.02 ? scroll.shellShadow : 'none',
  )

  const spotlightOpacity = useTransform(scrollYProgress, (v) => {
    if (v < scroll.backdropFadeStart) return 0
    const base = v >= scroll.backdropFadeEnd
      ? 1
      : (v - scroll.backdropFadeStart) / (scroll.backdropFadeEnd - scroll.backdropFadeStart)

    let strength = scroll.spotlightStrength * base

    if (v >= transitionEnd && v <= holdEnd) {
      const holdMid = (transitionEnd + holdEnd) / 2
      const holdHalf = Math.max(0.001, (holdEnd - transitionEnd) / 2)
      const dist = Math.abs(v - holdMid) / holdHalf
      strength *= 1 + (1 - dist) * scroll.spotlightHoldBoost
    }

    return Math.min(3.2, strength)
  })

  const { wrapRef: windowTiltRef, style: windowTiltStyle } = useWindowTilt({
    enabled: inReality && scroll.windowTiltEnabled && scrollProgress < scroll.holdEnd,
    maxRotate: scroll.windowTiltMax,
    perspective: scroll.windowTiltPerspective,
    leavePad: scroll.windowTiltLeavePad,
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollProgress(v)
    setTitleActive(v >= scroll.chromeRevealEnd)
    setInReality(v >= transitionEnd * 0.85)
  })

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = scroll.backdropColor
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [scroll.backdropColor])

  const titleLineStyle = {
    backgroundImage: `linear-gradient(135deg, ${scroll.titleGradientStart} 0%, ${scroll.titleGradientEnd} 100%)`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(0 2px 18px rgba(0,0,0,0.5))',
  }

  const spotlightCore = scroll.spotlightColor || '#ffffff'
  const spotlightMid = scroll.spotlightMidColor || 'rgba(255, 255, 255, 0.35)'

  return (
    <section
      ref={containerRef}
      className="scroll-stage"
      style={{ height: `${scroll.stageHeightVh}vh` }}
      aria-label="Hero scroll transition"
    >
      <div className="scroll-stage-sticky">
        <motion.div
          className="scroll-backdrop"
          style={{
            opacity: backdropOpacity,
            background: scroll.backdropColor,
            WebkitMaskImage:
              waves.seamBlend > 0
                ? `linear-gradient(to bottom, #000 0%, #000 calc(100% - ${waves.seamBlend}px), transparent 100%)`
                : undefined,
            maskImage:
              waves.seamBlend > 0
                ? `linear-gradient(to bottom, #000 0%, #000 calc(100% - ${waves.seamBlend}px), transparent 100%)`
                : undefined,
          }}
        >
          {waves.enabled && (
            <div className="scroll-reality-waves">
              <WavesBackground uniforms={waveUniforms} className="scroll-reality-waves__canvas" />
            </div>
          )}
        </motion.div>

        <motion.div
          className="scroll-reality-dots-wrap"
          style={{
            opacity: backdropOpacity,
            WebkitMaskImage:
              waves.seamBlend > 0
                ? `linear-gradient(to bottom, #000 0%, #000 calc(100% - ${waves.seamBlend}px), transparent 100%)`
                : undefined,
            maskImage:
              waves.seamBlend > 0
                ? `linear-gradient(to bottom, #000 0%, #000 calc(100% - ${waves.seamBlend}px), transparent 100%)`
                : undefined,
          }}
        >
          <RealityDotPattern settings={scroll} scrollProgress={scrollProgress} />
        </motion.div>

        <motion.div
          className="scroll-reality-spotlight-outer"
          style={{
            opacity: spotlightOpacity,
            top: spotlightTop,
            left: spotlightLeft,
            width: spotlightWidth,
            height: spotlightHeight,
          }}
        >
          <div
            className="scroll-reality-spotlight__core"
            style={{
              background: `radial-gradient(ellipse 72% 64% at 50% 46%, ${spotlightCore} 0%, ${spotlightMid} 38%, transparent 72%)`,
            }}
          />
        </motion.div>

        {nav.showStandaloneLogo && (
          <HeroLogo
            settings={nav}
            lightMix={logoLightMix}
            outsideWindow
            parallaxFactor={inReality ? scroll.logoRealityParallax : 1}
          />
        )}

        <div className="scroll-scene-center">
          <motion.div
            className="scroll-overhead-wrap"
            style={{
              opacity: titleOpacity,
              top: titleTop,
              left: '50%',
              x: '-50%',
            }}
          >
            <BlurInLine
              text={scroll.overheadTitle}
              active={titleActive}
              className="scroll-overhead-title"
              lineStyle={titleLineStyle}
            />
          </motion.div>

          <motion.div className="scroll-composition" style={{ y: compositionY }}>
            <motion.div className="scroll-composition-scale" style={{ scale }}>
              <div ref={windowTiltRef} className="scroll-window-tilt" style={windowTiltStyle}>
                <motion.div
                  className="scroll-shell-radius"
                  style={{ borderRadius: radius }}
                >
                  <motion.div
                    className="browser-shell"
                    style={{
                      borderStyle: 'solid',
                      borderWidth: shellBorderWidth,
                      borderColor: shellBorderColor,
                      boxShadow: shellShadow,
                    }}
                  >
                    <motion.div
                      className="browser-chrome-layer"
                      style={{
                        height: scroll.chromeHeight + 2,
                        opacity: chromeOpacity,
                        y: chromeY,
                        background: `linear-gradient(180deg, ${scroll.chromeBgTop} 0%, ${scroll.chromeBgBottom} 100%)`,
                      }}
                    >
                      <BrowserChrome settings={scroll} />
                    </motion.div>

                    <div className="browser-viewport hero-scene">
                      {children}
                      <motion.div className="hero-scene-glass-nav" style={{ opacity: glassNavOpacity }}>
                        <GlassNav settings={nav} />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="scroll-dock-wrap"
            style={{
              opacity: surroundingsOpacity,
              top: dockTop,
              left: '50%',
              x: '-50%',
            }}
          >
            <ScrollPillDock settings={scroll} />
            <ScrollConnector settings={scroll} bottomPad={scroll.connectorBottomPx} />
            <ScrollHint style={{ opacity: hintOpacity }} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
