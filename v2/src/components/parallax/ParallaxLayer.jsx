import { useParallax } from '../../context/ParallaxContext'

export default function ParallaxLayer({ depth = 0.5, className, style, children }) {
  const { tilt, settings } = useParallax()

  if (!settings.enabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const amount = depth * settings.intensity
  const rotateX = -tilt.y * amount * settings.maxRotate
  const rotateY = tilt.x * amount * settings.maxRotate
  const translateX = tilt.x * amount * settings.maxTranslate
  const translateY = tilt.y * amount * settings.maxTranslate

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
