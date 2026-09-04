import ParallaxLayer from '../parallax/ParallaxLayer'
import { useParallaxTuner } from '../../context/ParallaxTunerContext'
import { motion } from 'framer-motion'
import './hero-logo.css'

const LOGO_ICON = '/images/logo-mr-icon.png'

export default function HeroLogo({
  settings,
  lightMix,
  outsideWindow = false,
  parallaxFactor = 1,
}) {
  const { settings: parallax } = useParallaxTuner()
  const showBlack = settings.logoVariant === 'black' || settings.logoVariant === 'both'
  const showIcon = settings.logoVariant === 'icon' || settings.logoVariant === 'both'

  const clusterClass = outsideWindow
    ? 'hero-logo-cluster hero-logo-cluster--outside'
    : 'hero-logo-cluster'

  const positionStyle = {
    top: settings.logoTop,
    left: settings.logoLeft,
  }

  const colorStyle = lightMix ? { '--logo-light': lightMix } : { '--logo-light': 0 }
  const depth = (parallax.logoDepth ?? 0.6) * parallaxFactor

  return (
    <ParallaxLayer depth={depth} className={clusterClass} style={positionStyle}>
      <motion.div className="hero-logo-inner" style={colorStyle}>
        {showBlack && (
          <figure className="hero-logo-item">
            <span
              className="hero-logo-mark hero-logo-mark--black"
              style={{ width: settings.logoSize, height: settings.logoSize }}
              role="img"
              aria-label="Maximus Reach logo"
            />
            {settings.logoVariant === 'both' && <figcaption>Black mark</figcaption>}
          </figure>
        )}
        {showIcon && (
          <figure className="hero-logo-item">
            <img
              src={LOGO_ICON}
              alt="Maximus Reach icon"
              className="hero-logo-icon"
              style={{ width: settings.logoSize, height: settings.logoSize }}
            />
            {settings.logoVariant === 'both' && <figcaption>Brown icon</figcaption>}
          </figure>
        )}
      </motion.div>
    </ParallaxLayer>
  )
}
