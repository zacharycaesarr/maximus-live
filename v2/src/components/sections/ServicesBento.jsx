import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBentoTuner } from '../../context/BentoTunerContext'
import { bentoLayoutMetrics } from '../../lib/bentoDefaults'
import './services-bento.css'

function IdeVisual() {
  return (
    <div className="bento-asset bento-asset--ide" aria-hidden="true">
      <div className="bento-ide">
        <div className="bento-ide__bar">
          <span />
          <span />
          <span />
        </div>
        <pre>
          <code>
            <span className="tok-k">const</span> site = <span className="tok-f">build</span>({'{'}
            {'\n'}  <span className="tok-p">fast</span>: <span className="tok-b">true</span>,
            {'\n'}  <span className="tok-p">leads</span>: <span className="tok-s">'on'</span>
            {'\n'}{'}'})
          </code>
        </pre>
      </div>
      <span className="bento-badge">100% Core Web Vitals</span>
    </div>
  )
}

function AdsVisual() {
  const spend = [28, 42, 36, 58, 44, 70, 52]
  const ret = [40, 55, 48, 72, 60, 88, 68]
  return (
    <div className="bento-asset bento-asset--ads" aria-hidden="true">
      <div className="bento-chart">
        {spend.map((s, i) => (
          <span key={i} className="bento-chart-col">
            <i className="is-return" style={{ '--h': `${ret[i]}%` }} />
            <i className="is-spend" style={{ '--h': `${s}%` }} />
          </span>
        ))}
      </div>
      <div className="bento-chart-key">
        <span>Spend</span>
        <span>Return</span>
      </div>
    </div>
  )
}

function AutoVisual() {
  return (
    <div className="bento-asset bento-asset--auto" aria-hidden="true">
      <svg className="bento-flow" viewBox="0 0 240 88" fill="none">
        <path
          className="bento-flow__path"
          d="M28 44 C 80 44, 90 12, 140 12 S 180 44, 212 44"
          pathLength="1"
        />
        <circle className="bento-flow__dot" r="4" cx="28" cy="44">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M28 44 C 80 44, 90 12, 140 12 S 180 44, 212 44" />
        </circle>
      </svg>
      <span className="bento-pill bento-pill--left">Webhook</span>
      <span className="bento-pill bento-pill--right">Twilio SMS</span>
    </div>
  )
}

function CreativeVisual() {
  return (
    <div className="bento-asset bento-asset--creative" aria-hidden="true">
      <div className="bento-timeline">
        <div className="bento-timeline__times">
          <span>00:02</span>
          <span>00:08</span>
          <span>00:14</span>
        </div>
        <div className="bento-timeline__track">
          <i />
          <i />
          <i />
        </div>
        <div className="bento-wave">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} style={{ '--h': `${18 + ((i * 17) % 64)}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ElasticCard({
  id,
  flex,
  hoverFlex,
  layout,
  settings,
  title,
  body,
  children,
  onHover,
}) {
  return (
    <article
      className="elastic-card"
      tabIndex={0}
      style={{
        '--flex': flex,
        '--hover-flex': hoverFlex,
        '--card-h': `${layout.cardHeight}px`,
        '--card-radius': `${layout.radius}px`,
        '--card-pad': `${layout.padding}px`,
        '--card-bg': settings.cardBg,
        '--card-border': settings.borderColor,
        '--card-glow': settings.glowColor,
        '--card-wash': settings.washColor,
        '--title-color': settings.titleColor,
        '--body-color': settings.bodyColor,
        '--spring-ms': `${settings.springMs}ms`,
      }}
      onPointerEnter={() => onHover(id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
    >
      <div className="elastic-card__inner">
        {children}
        <div className="elastic-card__copy">
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      </div>
    </article>
  )
}

export default function ServicesBento() {
  const { settings } = useBentoTuner()
  const layout = bentoLayoutMetrics(settings)
  const [hoverId, setHoverId] = useState(null)

  const row1 = hoverId === 'web' || hoverId === 'ads'
  const row2 = hoverId === 'auto' || hoverId === 'creative'

  return (
    <motion.div
      className="elastic-bento"
      style={{
        maxWidth: layout.maxWidth,
        '--bento-gap': `${layout.gap}px`,
        gap: `${layout.gap}px`,
      }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      <div
        className={`elastic-bento-row${row1 ? ' is-elastic' : ''}`}
        style={{ gap: `${layout.gap}px` }}
        data-active={hoverId === 'web' ? 'left' : hoverId === 'ads' ? 'right' : ''}
      >
        <ElasticCard
          id="web"
          flex={settings.webFlex}
          hoverFlex={settings.hoverFlex}
          layout={layout}
          settings={settings}
          title={settings.webTitle}
          body={settings.webBody}
          onHover={setHoverId}
        >
          <IdeVisual />
        </ElasticCard>
        <ElasticCard
          id="ads"
          flex={settings.adsFlex}
          hoverFlex={settings.hoverFlex}
          layout={layout}
          settings={settings}
          title={settings.adsTitle}
          body={settings.adsBody}
          onHover={setHoverId}
        >
          <AdsVisual />
        </ElasticCard>
      </div>
      <div
        className={`elastic-bento-row${row2 ? ' is-elastic' : ''}`}
        style={{ gap: `${layout.gap}px` }}
        data-active={hoverId === 'auto' ? 'left' : hoverId === 'creative' ? 'right' : ''}
      >
        <ElasticCard
          id="auto"
          flex={settings.autoFlex}
          hoverFlex={settings.hoverFlex}
          layout={layout}
          settings={settings}
          title={settings.autoTitle}
          body={settings.autoBody}
          onHover={setHoverId}
        >
          <AutoVisual />
        </ElasticCard>
        <ElasticCard
          id="creative"
          flex={settings.creativeFlex}
          hoverFlex={settings.hoverFlex}
          layout={layout}
          settings={settings}
          title={settings.creativeTitle}
          body={settings.creativeBody}
          onHover={setHoverId}
        >
          <CreativeVisual />
        </ElasticCard>
      </div>
    </motion.div>
  )
}
