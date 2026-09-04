import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ParallaxLayer from '../parallax/ParallaxLayer'
import { useParallaxTuner } from '../../context/ParallaxTunerContext'
import ServiceGradientCard from './ServiceGradientCard'
import './service-card-stack.css'

function cardTarget(index, dealtCount, spreadPinned, settings) {
  if (index >= dealtCount) {
    return { x: 0, y: 160, rotate: 0, scale: 0.92, opacity: 0 }
  }

  if (spreadPinned) {
    const offsets = [-settings.spreadGap, 0, settings.spreadGap]
    return {
      x: offsets[index],
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
    }
  }

  return {
    x: index * settings.stackOffsetX,
    y: -index * settings.stackOffsetY,
    rotate: (index - 1) * settings.stackRotate,
    scale: 1,
    opacity: 1,
  }
}

export default function ServiceCardStack({ settings }) {
  const { settings: parallax } = useParallaxTuner()
  const stackRef = useRef(null)
  const [dealtCount, setDealtCount] = useState(0)
  const [spreadPinned, setSpreadPinned] = useState(false)

  useEffect(() => {
    setDealtCount(0)
    setSpreadPinned(false)
    const timers = [0, 1, 2].map((i) =>
      window.setTimeout(
        () => setDealtCount(i + 1),
        (settings.dealStartDelay + i * settings.dealStagger) * 1000,
      ),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [settings.dealStartDelay, settings.dealStagger])

  useEffect(() => {
    if (!spreadPinned) return undefined

    const onPointerDown = (e) => {
      if (stackRef.current?.contains(e.target)) return
      setSpreadPinned(false)
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSpreadPinned(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [spreadPinned])

  const dealSpring = useMemo(
    () => ({
      type: 'spring',
      stiffness: settings.springStiffness,
      damping: settings.springDamping,
      mass: 0.85,
    }),
    [settings.springStiffness, settings.springDamping],
  )

  const spreadSpring = useMemo(
    () => ({
      type: 'spring',
      stiffness: settings.spreadStiffness,
      damping: settings.spreadDamping,
      mass: 1,
    }),
    [settings.spreadStiffness, settings.spreadDamping],
  )

  const cardStyle = {
    cardBg: settings.cardBg,
    titleColor: settings.titleColor,
    bodyColor: settings.bodyColor,
    ctaColor: settings.ctaColor,
    badgeBg: settings.badgeBg,
    badgeColor: settings.badgeColor,
    borderColor: settings.borderColor,
    shadow: settings.cardShadow,
  }

  const stackReady = dealtCount >= 3

  const openSpread = () => {
    if (stackReady) setSpreadPinned(true)
  }

  const toggleSpread = (e) => {
    if (!stackReady || e.target.closest('a')) return
    setSpreadPinned((v) => !v)
  }

  return (
    <ParallaxLayer
      depth={parallax.cardsDepth ?? 0.65}
      className="service-card-stack-wrap"
      style={{
        right: `${settings.rightPercent}%`,
        bottom: `${settings.bottomPercent}%`,
      }}
    >
      <div
        ref={stackRef}
        className={`service-card-stack${spreadPinned ? ' service-card-stack--spread' : ''}`}
        onPointerEnter={openSpread}
        onClick={toggleSpread}
        role="group"
        aria-label="Service cards"
        aria-expanded={spreadPinned}
      >
        {settings.cards.map((card, index) => {
          const target = cardTarget(index, dealtCount, spreadPinned, settings)
          const isDealing = index < dealtCount && !spreadPinned
          return (
            <motion.div
              key={card.title}
              className="service-card-stack-item"
              style={{
                zIndex: index + 1,
                width: settings.cardWidth,
                marginLeft: -settings.cardWidth / 2,
              }}
              initial={false}
              animate={target}
              transition={isDealing ? dealSpring : spreadSpring}
            >
              <ServiceGradientCard
                card={card}
                style={cardStyle}
                width={settings.cardWidth}
                minHeight={settings.cardMinHeight}
              />
            </motion.div>
          )
        })}
      </div>
    </ParallaxLayer>
  )
}
