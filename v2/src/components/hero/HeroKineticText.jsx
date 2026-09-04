import { useEffect, useMemo, useState } from 'react'
import BlurOutWords from './BlurOutWords'
import ParallaxLayer from '../parallax/ParallaxLayer'
import { useParallaxTuner } from '../../context/ParallaxTunerContext'
import { parsePhrases } from './heroTextDefaults'
import './hero-kinetic.css'

export default function HeroKineticText({ settings, scrollActivated = false }) {
  const { settings: parallax } = useParallaxTuner()
  const stemFull = `${settings.stemText.trim()} `
  const phrases = useMemo(() => parsePhrases(settings.phrases), [settings.phrases])

  const [typed, setTyped] = useState('')
  const [stemDone, setStemDone] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    setTyped('')
    setStemDone(false)
    setPhraseIndex(0)
  }, [stemFull, settings.typeSpeed])

  useEffect(() => {
    if (stemDone) return undefined
    if (typed.length >= stemFull.length) {
      setStemDone(true)
      return undefined
    }
    const timer = window.setTimeout(() => {
      setTyped(stemFull.slice(0, typed.length + 1))
    }, settings.typeSpeed)
    return () => window.clearTimeout(timer)
  }, [typed, stemFull, stemDone, settings.typeSpeed])

  useEffect(() => {
    if (!stemDone || scrollActivated || settings.pauseCycle || phrases.length === 0) return undefined
    const timer = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length)
    }, settings.cycleSeconds * 1000)
    return () => window.clearInterval(timer)
  }, [stemDone, scrollActivated, settings.pauseCycle, settings.cycleSeconds, phrases.length])

  const phrase = scrollActivated ? settings.scrollPhrase : (phrases[phraseIndex] ?? '')
  const phraseKey = scrollActivated ? `scroll-${settings.scrollPhrase}` : `${phrase}-${phraseIndex}`
  const glow = `0 0 ${24 * settings.glowStrength}px ${settings.glowColor}`

  return (
    <div
      className="hero-kinetic"
      style={{
        left: `${settings.posX}%`,
        top: `${settings.posY}%`,
        fontSize: settings.fontSize,
        letterSpacing: settings.letterSpacing,
        lineHeight: settings.lineHeight,
      }}
    >
      <ParallaxLayer depth={parallax.textDepth}>
        <h1 className="hero-kinetic-line" aria-live="polite">
          <span
            className="hero-kinetic-stem"
            style={{ fontWeight: settings.stemWeight, color: settings.stemColor }}
          >
            {typed}
          </span>

          {stemDone && (
            <span className="hero-kinetic-phrase-slot">
              <BlurOutWords
                key={phraseKey}
                text={phrase}
                staggerDelay={settings.staggerDelay}
                speed={settings.blurSpeed}
                fps={settings.blurFps}
                durationInFrames={settings.blurDurationFrames}
                color={settings.phraseColor}
                fontWeight={settings.phraseWeight}
                textShadow={glow}
                className="hero-kinetic-phrase"
                hold={scrollActivated}
              />
            </span>
          )}

          {settings.showCursor && !stemDone && (
            <span className="hero-kinetic-cursor" aria-hidden="true" />
          )}
        </h1>
      </ParallaxLayer>
    </div>
  )
}
