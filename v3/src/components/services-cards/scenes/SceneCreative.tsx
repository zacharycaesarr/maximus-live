import type { CSSProperties, ReactNode } from 'react'
import * as m from 'framer-motion/m'
import { creativePose, creativeTransform, type CreativePose } from './creativeGeometry'
import { creativeEntrance, type CreativeMotionSettings } from './creativeMotion'
import '../styles/creative.css'

type CreativeValues = Record<string, number | string>

type PanelKind = 'video' | 'social' | 'brand'

function CreativePanel({ pose, kind, radius, children, settings }: { pose: CreativePose; kind: PanelKind; radius: number; children: ReactNode; settings?: CreativeMotionSettings }) {
  const panel = <div className={`creative-layer creative-layer--${kind}`}>
    <div className={`creative-panel creative-${kind}`} style={{ left: pose.x, top: pose.y, width: pose.width, height: pose.height, borderRadius: radius, transform: creativeTransform(pose) }}>
      <div className="creative-panel__back" />
      <div className="creative-panel__face">{children}</div>
    </div>
  </div>
  if (!settings?.enabled) return panel

  const order = { video: 1, social: 2, brand: 3 }[kind]
  const distance = settings.introDistance
  const offsetX = { video: -distance * .35, social: distance * .5, brand: -distance * .25 }[kind]
  const offsetY = { video: distance, social: distance * .8, brand: distance * .65 }[kind]
  const drift = { video: settings.idleVideo, social: settings.idleSocial, brand: settings.idleBrand }[kind]
  const period = { video: settings.idleVideoDuration, social: settings.idleSocialDuration, brand: settings.idleBrandDuration }[kind]
  const looping = settings.introComplete && settings.visible && drift > 0

  return <m.div className={`creative-motion-layer creative-motion-layer--${kind}`}
    initial="hidden" animate={settings.entered ? 'visible' : 'hidden'}
    variants={creativeEntrance(settings.introDuration, settings.introStagger * order, offsetY, offsetX)}
  >
    <m.div className="creative-motion-idle"
      animate={looping ? { y: [0, -drift, 0, drift * .38, 0], x: [0, kind === 'social' ? -drift * .28 : drift * .2, 0, kind === 'brand' ? -drift * .18 : drift * .12, 0] } : { x: 0, y: 0 }}
      transition={looping ? { duration: period, repeat: Infinity, ease: 'easeInOut' } : { duration: .35, ease: 'easeOut' }}
    >{panel}</m.div>
  </m.div>
}

function Detail({ children, settings, order }: { children: ReactNode; settings?: CreativeMotionSettings; order: number }) {
  if (!settings?.enabled) return children
  return <m.div className="creative-motion-detail" initial="hidden" animate={settings.entered ? 'visible' : 'hidden'} variants={creativeEntrance(settings.introDuration, settings.introStagger * order, 5)}>{children}</m.div>
}

function SocialActions() {
  return <div className="creative-social__actions">
    <svg viewBox="0 0 20 20" fill="none"><path d="M10 17 3 10C-2 4 6 0 10 6c4-6 12-2 7 4l-7 7Z" /></svg>
    <svg viewBox="0 0 20 20" fill="none"><path d="M17 9a7 7 0 1 0-11 6l-1 3 5-2a7 7 0 0 0 7-7Z" /></svg>
    <svg viewBox="0 0 20 20" fill="none"><path d="m2 3 16 5-7 3-3 7-2-9-4-6Zm4 6 12-1" /></svg>
    <svg className="creative-social__bookmark" viewBox="0 0 20 20" fill="none"><path d="M5 3h10v15l-5-4-5 4V3Z" /></svg>
  </div>
}

/** Independent cameras preserve the intended overlaps without intersecting 3D planes. */
export function SceneCreative({ values: t, motionSettings }: { values: CreativeValues; motionSettings?: CreativeMotionSettings }) {
  const n = (key: string) => Number(t[key])
  const vars = {
    '--creative-perspective': `${t.perspective}px`, '--creative-origin': `${t.originX}% ${t.originY}%`,
    '--creative-accent': t.accent, '--creative-depth': `${t.shellDepth}px`, '--creative-rim': t.rimOpacity,
    '--creative-shadow-opacity': t.shadowOpacity, '--creative-shadow-blur': `${t.shadowBlur}px`,
    '--creative-grid-opacity': t.gridOpacity, '--creative-cross-opacity': t.crossOpacity,
    '--creative-play-size': `${t.playSize}px`, '--creative-play-x': `${t.playX}%`, '--creative-play-y': `${t.playY}%`,
    '--creative-duration-size': `${t.durationSize}px`, '--creative-avatar-size': `${t.avatarSize}px`,
    '--creative-name-size': `${t.socialNameSize}px`, '--creative-social-padding': `${t.socialPadding}px`,
    '--creative-social-header': `${t.socialHeaderHeight}px`, '--creative-social-footer': `${t.socialFooterHeight}px`,
    '--creative-action-size': `${t.socialIconSize}px`, '--creative-brand-title-size': `${t.brandTitleSize}px`,
    '--creative-text-x': `${t.brandTextX}px`, '--creative-text-y': `${t.brandTextY}px`,
    '--creative-detail-size': `${t.brandDetailSize}px`, '--creative-detail-bottom': `${t.brandDetailBottom}px`,
  } as CSSProperties
  const media = (key: string) => <div className={`creative-media creative-media--${key}`} style={{ width: `${t[`${key}MediaWidth`]}%`, transform: `translate(${t[`${key}MediaX`]}%,${t[`${key}MediaY`]}%) scale(${t[`${key}MediaScale`]})` }}>
    {t[`${key}Image`] ? <img src={String(t[`${key}Image`])} style={{ objectFit: t[`${key}MediaFit`] as CSSProperties['objectFit'] }} alt="" draggable={false} /> : null}
  </div>

  return <div className="creative-scene" style={vars} aria-hidden="true">
    <div className="creative-stage" style={{ transform: `translate(${t.sceneX}px,${t.sceneY}px) scale(${t.sceneScale})` }}>
      <div className="creative-grid" />
      <div className="creative-glow" style={{ left: `${t.glowX}%`, top: `${t.glowY}%`, width: n('glowSize'), height: n('glowSize') * .7, opacity: n('glowOpacity') }} />
      <span className="creative-cross creative-cross--left" /><span className="creative-cross creative-cross--right" />
      <CreativePanel pose={creativePose(t, 'video')} kind="video" radius={n('videoRadius')} settings={motionSettings}>
        <Detail settings={motionSettings} order={2.2}><div className="creative-video__visual">{media('video')}</div></Detail>
        <Detail settings={motionSettings} order={3.4}><span className="creative-video__play"><svg viewBox="0 0 20 20"><path d="m7 3 11 7-11 7Z" /></svg></span></Detail>
        <Detail settings={motionSettings} order={4.1}><span className="creative-video__duration">{t.duration}</span></Detail>
      </CreativePanel>
      <CreativePanel pose={creativePose(t, 'social')} kind="social" radius={n('socialRadius')} settings={motionSettings}>
        <Detail settings={motionSettings} order={2.9}><div className="creative-social__header">
          <div className="creative-social__avatar">{media('avatar')}</div>
          <div className="creative-social__account"><strong>{t.socialName}</strong><span>{t.socialTime}</span></div>
          <span className="creative-social__more">···</span>
        </div></Detail>
        <Detail settings={motionSettings} order={3.7}><div className="creative-social__visual">{media('social')}</div></Detail>
        <Detail settings={motionSettings} order={4.7}><SocialActions /></Detail>
      </CreativePanel>
      <CreativePanel pose={creativePose(t, 'brand')} kind="brand" radius={n('brandRadius')} settings={motionSettings}>
        <Detail settings={motionSettings} order={3.8}><div className="creative-brand__visual">{media('brand')}</div></Detail>
        <Detail settings={motionSettings} order={4.5}><div className="creative-brand__title">{t.brandTitle}</div></Detail>
        <Detail settings={motionSettings} order={5.3}><div className="creative-brand__details">IDEAS<br />DESIGN<br />CONTENT<br />RESULTS</div></Detail>
      </CreativePanel>
    </div>
  </div>
}
