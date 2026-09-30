import type { CSSProperties, ReactNode } from 'react'
import * as m from 'framer-motion/m'
import { ADS_ARTBOARD, adsPanelPose, connectorPath, panelTransform, projectSocket, type PanelPose } from './adsGeometry'
import type { AdsMotionSettings } from './AdsAnimatedCard'
import '../styles/ads.css'

type AdsValues = Record<string, number | string>

function PersonIcon() {
  return <svg viewBox="0 0 32 36" fill="none"><circle cx="16" cy="10" r="5.5" /><path d="M6 31v-5c0-5 4-8 10-8s10 3 10 8v5" /></svg>
}

function StepIcon({ type, settings, index }: { type: 'ad' | 'landing' | 'lead'; settings?: AdsMotionSettings; index: number }) {
  const contents = <>
    <path d="M5 1.5h10l6 5v18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-20a3 3 0 0 1 3-3Z" />
    {type === 'ad' ? <><path d="m7 11 5-3 5 3-5 8-5-8Zm3 2 2 2 3-4" /><path d="m16 5 2 2" /></> : null}
    {type === 'landing' ? <><path d="M7 8h3v3H7zM14 8h3M14 11h3M7 15h3v3H7zM14 15h3M14 18h3M9 21h8" /></> : null}
    {type === 'lead' ? <><circle cx="12" cy="12" r="2" /><path d="M8 21v-3c0-4 8-4 8 0v3H8Zm2-16 2-2 2 2" /></> : null}
  </>
  const looping = settings?.enabled && settings.introComplete && settings.visible
  return settings?.enabled
    ? <m.svg viewBox="0 0 24 28" fill="none" initial={{ opacity: 0 }} animate={looping ? { opacity: 1, y: [0, -settings.idleLabel * (1 + index * .12), 0], x: [0, (index === 1 ? -1 : 1) * settings.idleLabel * .35, 0] } : { opacity: settings.introComplete ? 1 : 0, x: 0, y: 0 }} transition={looping ? { opacity: { duration: .4, delay: index * settings.introStagger }, x: { duration: 6.5 + index * .8, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 6.5 + index * .8, repeat: Infinity, ease: 'easeInOut' } } : { duration: .25 }}>{contents}</m.svg>
    : <svg viewBox="0 0 24 28" fill="none">{contents}</svg>
}

function Panel({ pose, className, children }: { pose: PanelPose; className: string; children: ReactNode }) {
  return <div className={`ads-panel ${className}`} style={{ left: pose.x, top: pose.y, width: pose.width, height: pose.height, transform: panelTransform(pose) }}>
    <div className="ads-panel__back" />
    <div className="ads-panel__face">{children}</div>
  </div>
}

function FloatingPanel({ pose, className, children, settings, kind }: { pose: PanelPose; className: string; children: ReactNode; settings?: AdsMotionSettings; kind: 'ad' | 'landing' | 'lead' }) {
  const panel = <Panel pose={pose} className={className}>{children}</Panel>
  if (!settings?.enabled) return panel
  const drift = { ad: settings.idleAd, landing: settings.idleLanding, lead: settings.idleLead }[kind] * settings.idleBoost
  const period = { ad: settings.idleAdDuration, landing: settings.idleLandingDuration, lead: settings.idleLeadDuration }[kind]
  const sway = drift * settings.idleSway * (kind === 'landing' ? -1 : 1)
  const looping = settings.introComplete && settings.visible && drift > 0
  return <m.div className={`ads-motion-object ads-motion-object--${kind}`}
    animate={looping ? { y: [0, -drift, 0, drift * .35, 0], x: [0, sway, 0, -sway * .6, 0] } : { x: 0, y: 0 }}
    transition={looping ? { duration: period, repeat: Infinity, ease: 'easeInOut' } : { duration: .3, ease: 'easeOut' }}
  >{panel}</m.div>
}

/** Native interface with the user-supplied product photograph in its media slots. */
export function SceneAds({ values: t, motionSettings }: { values: AdsValues; motionSettings?: AdsMotionSettings }) {
  const n = (key: string) => Number(t[key])
  const ad = adsPanelPose(t, 'ad'), landing = adsPanelPose(t, 'landing'), lead = adsPanelPose(t, 'lead')
  const socket = (p: PanelPose, side: 'left' | 'right') => projectSocket(p, side, n('perspective'), n('originX'), n('originY'))
  const endpoints = [socket(ad, 'right'), socket(landing, 'left'), socket(landing, 'right'), socket(lead, 'left')]
  const wires = [connectorPath(endpoints[0], endpoints[1], n('firstBend')), connectorPath(endpoints[2], endpoints[3], n('secondBend'))]
  const vars = {
    '--ads-accent': t.accent, '--ads-radius': `${t.radius}px`, '--ads-depth': `${t.shellDepth}px`,
    '--ads-rim': t.rimOpacity, '--ads-shadow-opacity': t.shadowOpacity, '--ads-shadow-blur': `${t.shadowBlur}px`,
    '--ads-grid-opacity': t.gridOpacity, '--ads-ambient-opacity': t.ambientOpacity,
    '--ads-headline-size': `${t.headlineSize}px`, '--ads-button-width': `${t.buttonWidth}px`,
    '--ads-avatar-size': `${t.avatarSize}px`, '--ads-badge-size': `${t.badgeSize}px`,
    '--ads-badge-x': `${t.badgeX}px`, '--ads-badge-y': `${t.badgeY}px`, '--ads-image-color': t.adImageColor,
  } as CSSProperties
  const mediaStyle = (prefix: string): CSSProperties => ({ transform: `translate(${t[`${prefix}MediaX`]}px,${t[`${prefix}MediaY`]}px) scale(${t[`${prefix}MediaScale`]})` })

  return <div className="ads-scene" style={vars} aria-hidden="true">
    <div className="ads-stage" style={{ transform: `translate(${t.sceneX}px,${t.sceneY}px) scale(${t.sceneScale})` }}>
      <div className="ads-grid" />
      <div className="ads-ambient" />
      <svg className="ads-connections" viewBox={`0 0 ${ADS_ARTBOARD.width} ${ADS_ARTBOARD.height}`} fill="none">
        {wires.map((wire, i) => <g key={i}>
          {motionSettings?.enabled
            ? <><m.path d={wire.d} className="ads-wire-halo" initial={{ opacity: 0 }} animate={{ opacity: motionSettings.introComplete ? n('lineGlow') : 0 }} transition={{ duration: .55, delay: i * motionSettings.introStagger }} /><m.path d={wire.d} className="ads-wire" strokeWidth={n('lineWidth')} initial={{ pathLength: 0 }} animate={{ pathLength: motionSettings.introComplete ? 1 : 0 }} transition={{ duration: .75, delay: i * motionSettings.introStagger, ease: 'easeOut' }} /></>
            : <><path d={wire.d} className="ads-wire-halo" style={{ opacity: n('lineGlow') }} /><path d={wire.d} className="ads-wire" strokeWidth={n('lineWidth')} /></>}
          {[endpoints[i * 2], wire.middle, endpoints[i * 2 + 1]].map((p, j) => <g key={j}>
            {motionSettings?.enabled
              ? <m.circle cx={p.x} cy={p.y} r={n('dotSize') * 3.2} className="ads-dot-halo" initial={{ opacity: 0 }} animate={{ opacity: motionSettings.introComplete ? n('lineGlow') : 0 }} transition={{ duration: .4, delay: (i + j * .3) * motionSettings.introStagger }} />
              : <circle cx={p.x} cy={p.y} r={n('dotSize') * 3.2} className="ads-dot-halo" style={{ opacity: n('lineGlow') }} />}
            {motionSettings?.enabled
              ? <m.circle cx={p.x} cy={p.y} r={n('dotSize')} className="ads-dot" initial={{ opacity: 0 }} animate={{ opacity: motionSettings.introComplete ? 1 : 0 }} transition={{ duration: .3, delay: (i + j * .3) * motionSettings.introStagger }} />
              : <circle cx={p.x} cy={p.y} r={n('dotSize')} className="ads-dot" />}
          </g>)}
        </g>)}
      </svg>
      <div className="ads-camera" style={{ perspective: n('perspective'), perspectiveOrigin: `${t.originX}% ${t.originY}%` }}>
        <div className="ads-world">
          <FloatingPanel pose={ad} className="ads-ad" settings={motionSettings} kind="ad">
            <div className="ads-ad__header"><span>Ad</span><div className="ads-skeleton"><i /><i /></div><b /></div>
            <div className="ads-ad__body">
              <div className="ads-ad__avatar"><PersonIcon /></div>
              <div className="ads-ad__media" style={mediaStyle('ad')}>
                <img className="ads-ad__product" src="/products/MR-headphones.png" alt="" draggable={false} />
              </div>
              <div className="ads-ad__meta"><span /><div className="ads-skeleton"><i /><i /></div></div>
            </div>
          </FloatingPanel>
          <FloatingPanel pose={landing} className="ads-landing" settings={motionSettings} kind="landing">
            <div className="ads-landing__chrome"><i /><i /><i /><span /><b /></div>
            <div className="ads-landing__content">
              <div className="ads-landing__media" style={mediaStyle('landing')}>
                <img className="ads-landing__product" src="/products/MR-headphones.png" alt="" draggable={false} />
              </div>
              <div className="ads-landing__copy"><span>Better<br />Performance</span><div className="ads-skeleton"><i /><i /><i /></div></div>
              <div className="ads-landing__button"><span /></div>
            </div>
          </FloatingPanel>
          <FloatingPanel pose={lead} className="ads-lead" settings={motionSettings} kind="lead">
            <div className="ads-lead__avatar"><PersonIcon /></div>
            <span className="ads-lead__check"><svg viewBox="0 0 16 16" fill="none"><path d="m4.5 8 2.5 2.5 4.5-5" /></svg></span>
            <div className="ads-lead__name">New Lead</div>
            <div className="ads-skeleton"><i /><i /></div>
          </FloatingPanel>
        </div>
      </div>
      {(['ad', 'landing', 'lead'] as const).map((key, index) => <div className={`ads-step ads-step--${key}`} key={key} style={{
        left: n(`${key}LabelX`), top: n(`${key}LabelY`), fontSize: n('labelSize'),
        transform: `rotate(${t[`${key}LabelRotation`]}deg) scale(${t[`${key}LabelScale`]})`,
      }}><StepIcon type={key} settings={motionSettings} index={index} />{motionSettings?.enabled
        ? <m.span initial={{ opacity: 0 }} animate={motionSettings.introComplete && motionSettings.visible ? { opacity: 1, y: [0, -motionSettings.idleLabel * (.8 + index * .1), 0] } : { opacity: motionSettings.introComplete ? 1 : 0, y: 0 }} transition={motionSettings.introComplete && motionSettings.visible ? { opacity: { duration: .4, delay: index * motionSettings.introStagger + .08 }, y: { duration: 7.2 + index * .9, repeat: Infinity, ease: 'easeInOut' } } : { duration: .25 }}>{['Ad', 'Landing Page', 'Lead'][index]}</m.span>
        : <span>{['Ad', 'Landing Page', 'Lead'][index]}</span>}</div>)}
    </div>
  </div>
}
