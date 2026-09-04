import { motion } from 'framer-motion'
import './service-gradient-card.css'

const imageVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 3 },
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ServiceGradientCard({ card, style, minHeight, width }) {
  const accentRgb = hexToRgb(card.accent)

  return (
    <motion.div
      className="service-gradient-card service-gradient-card--dark"
      style={{
        width,
        minHeight,
        background: `linear-gradient(145deg, ${style.cardBg} 0%, rgba(${accentRgb.join(',')},0.35) 100%)`,
        borderColor: style.borderColor,
        boxShadow: style.shadow,
      }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="hover"
    >
      <motion.img
        src={card.imageUrl}
        alt=""
        className="service-gradient-card-art"
        variants={imageVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      />

      <div className="service-gradient-card-body">
        <div
          className="service-gradient-card-badge"
          style={{ background: style.badgeBg, color: style.badgeColor }}
        >
          <span className="service-gradient-card-dot" style={{ background: card.badgeColor }} />
          {card.badgeText}
        </div>

        <div className="service-gradient-card-copy">
          <h3 className="service-gradient-card-title" style={{ color: style.titleColor }}>
            {card.title}
          </h3>
          <p className="service-gradient-card-desc" style={{ color: style.bodyColor }}>
            {card.description}
          </p>
        </div>

        <a
          href={card.ctaHref}
          className="service-gradient-card-cta"
          style={{ color: style.ctaColor }}
        >
          <span>{card.ctaText}</span>
          <ArrowIcon />
        </a>
      </div>
    </motion.div>
  )
}

function hexToRgb(hex) {
  const n = (hex || '#a78a68').replace('#', '')
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ]
}
