import { button, folder, useControls } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import { ADS_POSES, adsPanelPose, type PanelPose } from '../scenes/adsGeometry'
import { persistedSchema } from './persistTuners'

function poseControls(prefix: string, p: PanelPose) {
  return {
    [`${prefix}X`]: { value: p.x, min: -40, max: 380, step: 1, label: 'Position X' },
    [`${prefix}Y`]: { value: p.y, min: -30, max: 290, step: 1, label: 'Position Y' },
    [`${prefix}Width`]: { value: p.width, min: 45, max: 170, step: 1, label: 'Width' },
    [`${prefix}Height`]: { value: p.height, min: 70, max: 240, step: 1, label: 'Height' },
    [`${prefix}Rx`]: { value: p.rx, min: -45, max: 45, step: .5, label: 'Tilt X' },
    [`${prefix}Ry`]: { value: p.ry, min: -50, max: 50, step: .5, label: 'Turn Y' },
    [`${prefix}Rz`]: { value: p.rz, min: -30, max: 30, step: .5, label: 'Rotation Z' },
    [`${prefix}Z`]: { value: p.z, min: -70, max: 120, step: 1, label: 'Depth' },
    [`${prefix}Scale`]: { value: p.scale, min: .5, max: 1.6, step: .01, label: 'Scale' },
  }
}

function labelControls(prefix: string, x: number, y: number) {
  return {
    [`${prefix}LabelX`]: { value: x, min: 0, max: 370, step: 1, label: 'Label X' },
    [`${prefix}LabelY`]: { value: y, min: 100, max: 310, step: 1, label: 'Label Y' },
    [`${prefix}LabelScale`]: { value: 1, min: .6, max: 1.5, step: .01, label: 'Label scale' },
    [`${prefix}LabelRotation`]: { value: 12, min: -20, max: 25, step: .5, label: 'Label rotation' },
  }
}

/** The Ads card owns its controls. No shared Web settings are modified. */
export function useAdsTuners(onReplayIntro: () => void = () => {}, store?: LevaStore) {
  return useControls('02 · Ad Management', persistedSchema('02 · Ad Management', {
    Camera: folder({
      perspective: { value: 1100, min: 650, max: 2000, step: 10 },
      originX: { value: 50, min: 0, max: 100, step: 1, label: 'Camera X' },
      originY: { value: 44, min: 0, max: 100, step: 1, label: 'Camera Y' },
      sceneScale: { value: 1, min: .7, max: 1.3, step: .01, label: 'Scene scale' },
      sceneX: { value: 0, min: -60, max: 60, step: 1, label: 'Scene X' },
      sceneY: { value: 0, min: -60, max: 60, step: 1, label: 'Scene Y' },
    }, { collapsed: true }),
    'Ad panel': folder({ ...poseControls('ad', ADS_POSES.ad),
      adMediaScale: { value: 1, min: .5, max: 1.5, step: .01, label: 'Media scale' },
      adMediaX: { value: 0, min: -20, max: 20, step: 1, label: 'Media X' },
      adMediaY: { value: 0, min: -20, max: 20, step: 1, label: 'Media Y' },
      adImageColor: { value: '#a4bd48', label: 'Photo backdrop' },
    }, { collapsed: true }),
    'Landing page': folder({ ...poseControls('landing', ADS_POSES.landing),
      landingMediaScale: { value: 1, min: .5, max: 1.5, step: .01, label: 'Media scale' },
      landingMediaX: { value: 0, min: -30, max: 30, step: 1, label: 'Media X' },
      landingMediaY: { value: 0, min: -30, max: 30, step: 1, label: 'Media Y' },
      headlineSize: { value: 9, min: 6, max: 15, step: .5, label: 'Headline size' },
      buttonWidth: { value: 37, min: 25, max: 70, step: 1, label: 'Button width' },
    }, { collapsed: true }),
    'Lead panel': folder({ ...poseControls('lead', ADS_POSES.lead),
      avatarSize: { value: 44, min: 24, max: 62, step: 1, label: 'Avatar size' },
      badgeSize: { value: 17, min: 10, max: 28, step: 1, label: 'Check size' },
      badgeX: { value: 47, min: 10, max: 85, step: 1, label: 'Check X' },
      badgeY: { value: 44, min: 15, max: 85, step: 1, label: 'Check Y' },
    }, { collapsed: true }),
    Labels: folder({
      'Ad caption': folder(labelControls('ad', 26, 209), { collapsed: true }),
      'Page caption': folder(labelControls('landing', 147, 219), { collapsed: true }),
      'Lead caption': folder(labelControls('lead', 299, 231), { collapsed: true }),
      labelSize: { value: 12, min: 8, max: 16, step: .5, label: 'Font size' },
    }, { collapsed: true }),
    'Connecting path': folder({
      accent: { value: '#c8ef4b', label: 'Accent color' },
      lineWidth: { value: .9, min: .4, max: 2.5, step: .1, label: 'Stroke width' },
      lineGlow: { value: .3, min: 0, max: 1, step: .01, label: 'Glow strength' },
      dotSize: { value: 2.1, min: 1, max: 4, step: .1, label: 'Dot radius' },
      firstBend: { value: -9, min: -35, max: 35, step: 1, label: 'Ad to page bend' },
      secondBend: { value: 19, min: -35, max: 35, step: 1, label: 'Page to lead bend' },
    }, { collapsed: true }),
    Surfaces: folder({
      radius: { value: 6, min: 2, max: 16, step: .5, label: 'Panel corners' },
      shellDepth: { value: 3, min: 0, max: 10, step: .5, label: 'Shell thickness' },
      rimOpacity: { value: .65, min: 0, max: 1, step: .01, label: 'Edge light' },
      shadowOpacity: { value: .4, min: 0, max: .9, step: .01, label: 'Shadow opacity' },
      shadowBlur: { value: 18, min: 0, max: 50, step: 1, label: 'Shadow blur' },
      gridOpacity: { value: .24, min: 0, max: .7, step: .01, label: 'Grid opacity' },
      ambientOpacity: { value: .2, min: 0, max: .7, step: .01, label: 'Ambient glow' },
    }, { collapsed: true }),
    Animation: folder({
      adsAnimationsOn: { value: true, label: 'Animations ON/OFF' },
      'Replay Intro': button(onReplayIntro),
      adsIntroDuration: { value: .8, min: .25, max: 1.6, step: .01, label: 'Intro duration (s)' },
      adsIntroDistance: { value: 15, min: 0, max: 50, step: 1, label: 'Intro distance (px)' },
      adsIntroStagger: { value: .14, min: 0, max: .5, step: .01, label: 'Detail stagger (s)' },
      adsIdleAd: { value: 4.4, min: 0, max: 14, step: .1, label: 'Ad base drift (px)' },
      adsIdleLanding: { value: 5.2, min: 0, max: 14, step: .1, label: 'Landing base drift (px)' },
      adsIdleLead: { value: 4, min: 0, max: 14, step: .1, label: 'Lead base drift (px)' },
      adsIdleBoost: { value: 1.9, min: .5, max: 3, step: .05, label: 'Overall float' },
      adsIdleSway: { value: .24, min: 0, max: .5, step: .01, label: 'Sideways sway' },
      adsIdleLabel: { value: 3.6, min: 0, max: 8, step: .1, label: 'Labels and icons (px)' },
      adsIdleAdDuration: { value: 7.6, min: 6, max: 12, step: .1, label: 'Ad period (s)' },
      adsIdleLandingDuration: { value: 8.5, min: 6, max: 12, step: .1, label: 'Landing period (s)' },
      adsIdleLeadDuration: { value: 6.8, min: 6, max: 12, step: .1, label: 'Lead period (s)' },
    }, { collapsed: true }),
  }), { store }) as Record<string, number | string>
}

export type AdsTunerValues = ReturnType<typeof useAdsTuners>

export function adsSceneValues(t: AdsTunerValues) {
  return { camera: { perspective: t.perspective, originX: t.originX, originY: t.originY },
    ad: adsPanelPose(t, 'ad'), landing: adsPanelPose(t, 'landing'), lead: adsPanelPose(t, 'lead'),
    controls: t }
}
