import { button, folder, LevaInputs, useControls } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import { CREATIVE_POSES, creativePose, type CreativePose } from '@/components/services-cards/scenes/creativeGeometry'
import { persistedSchema } from '@/components/services-cards/tuners/persistTuners'

function poseControls(prefix: string, p: CreativePose) {
  return {
    [`${prefix}X`]: { value: p.x, min: -60, max: 380, step: 1, label: 'Position X' },
    [`${prefix}Y`]: { value: p.y, min: -60, max: 340, step: 1, label: 'Position Y' },
    [`${prefix}Width`]: { value: p.width, min: 70, max: 280, step: 1, label: 'Width' },
    [`${prefix}Height`]: { value: p.height, min: 60, max: 250, step: 1, label: 'Height' },
    [`${prefix}Rx`]: { value: p.rx, min: -45, max: 45, step: .5, label: 'Tilt X' },
    [`${prefix}Ry`]: { value: p.ry, min: -45, max: 45, step: .5, label: 'Turn Y' },
    [`${prefix}Rz`]: { value: p.rz, min: -45, max: 45, step: .5, label: 'Rotation Z' },
    [`${prefix}Z`]: { value: p.z, min: -80, max: 140, step: 1, label: 'Depth' },
    [`${prefix}Scale`]: { value: p.scale, min: .5, max: 1.5, step: .01, label: 'Scale' },
    [`${prefix}Radius`]: { value: 5, min: 0, max: 20, step: .5, label: 'Corners' },
  }
}

function mediaControls(prefix: string, image: string, width = 100, x = 0) {
  return {
    [`${prefix}Image`]: { value: image, label: 'Image URL / path' },
    [`${prefix}MediaX`]: { value: x, min: -100, max: 100, step: 1, label: 'Image X' },
    [`${prefix}MediaY`]: { value: 0, min: -60, max: 60, step: 1, label: 'Image Y' },
    [`${prefix}MediaScale`]: { value: 1, min: .4, max: 2, step: .01, label: 'Image scale' },
    [`${prefix}MediaWidth`]: { value: width, min: 20, max: 150, step: 1, label: 'Image width (%)' },
    [`${prefix}MediaFit`]: { value: prefix === 'social' || prefix === 'avatar' ? 'contain' : 'cover', options: ['cover', 'contain'], label: 'Image fit' },
  }
}

export function useCreativeTuners(onReplayIntro: () => void = () => {}, store?: LevaStore) {
  return useControls('03 · Creative Studio', persistedSchema('03 · Creative Studio', {
    Camera: folder({
      perspective: { value: 1100, min: 650, max: 2000, step: 10 },
      originX: { value: 50, min: 0, max: 100, step: 1, label: 'Camera X' },
      originY: { value: 45, min: 0, max: 100, step: 1, label: 'Camera Y' },
      sceneX: { value: 0, min: -60, max: 60, step: 1, label: 'Scene X' },
      sceneY: { value: 0, min: -60, max: 60, step: 1, label: 'Scene Y' },
      sceneScale: { value: 1, min: .6, max: 1.4, step: .01, label: 'Scene scale' },
    }, { collapsed: true }),
    'Video frame': folder({
      ...poseControls('video', CREATIVE_POSES.video),
      Media: folder(mediaControls('video', '/products/camerarig.png'), { collapsed: true }),
      playSize: { value: 37, min: 20, max: 65, step: 1, label: 'Play diameter' },
      playX: { value: 50, min: 0, max: 100, step: 1, label: 'Play X (%)' },
      playY: { value: 50, min: 0, max: 100, step: 1, label: 'Play Y (%)' },
      duration: { type: LevaInputs.STRING, value: '0:24', label: 'Duration text' },
      durationSize: { value: 8, min: 5, max: 14, step: .5, label: 'Duration size' },
    }, { collapsed: true }),
    'Social post': folder({
      ...poseControls('social', CREATIVE_POSES.social),
      Media: folder(mediaControls('social', '/products/MR-headphones.png'), { collapsed: true }),
      socialName: { value: 'Maximus Reach', label: 'Account name' },
      socialTime: { value: '2h ago', label: 'Timestamp' },
      socialNameSize: { value: 7, min: 5, max: 11, step: .5, label: 'Name size' },
      avatarSize: { value: 19, min: 12, max: 30, step: 1, label: 'Avatar size' },
      'Profile image': folder(mediaControls('avatar', '/products/mrlogo-smooth-white.png'), { collapsed: true }),
      socialPadding: { value: 7, min: 3, max: 14, step: 1, label: 'Inner padding' },
      socialHeaderHeight: { value: 33, min: 23, max: 50, step: 1, label: 'Header height' },
      socialFooterHeight: { value: 22, min: 14, max: 35, step: 1, label: 'Actions height' },
      socialIconSize: { value: 11, min: 7, max: 17, step: 1, label: 'Action icons' },
    }, { collapsed: true }),
    'Brand card': folder({
      ...poseControls('brand', CREATIVE_POSES.brand),
      Media: folder(mediaControls('brand', '/products/gooey-mrsmooth.png', 62, 66), { collapsed: true }),
      brandTitle: { value: 'Brand\nin Motion', rows: 2, label: 'Headline' },
      brandTitleSize: { value: 19, min: 12, max: 30, step: .5, label: 'Headline size' },
      brandTextX: { value: 13, min: 3, max: 70, step: 1, label: 'Text X' },
      brandTextY: { value: 13, min: 3, max: 65, step: 1, label: 'Text Y' },
      brandDetailSize: { value: 5.5, min: 4, max: 10, step: .5, label: 'Detail size' },
      brandDetailBottom: { value: 14, min: 5, max: 40, step: 1, label: 'Detail bottom' },
    }, { collapsed: true }),
    'Lighting and surface': folder({
      accent: { value: '#cee64b', label: 'Accent' },
      shellDepth: { value: 2, min: 0, max: 10, step: .5, label: 'Shell depth' },
      rimOpacity: { value: .65, min: 0, max: 1, step: .01, label: 'Edge highlight' },
      shadowOpacity: { value: .4, min: 0, max: .9, step: .01, label: 'Shadow opacity' },
      shadowBlur: { value: 20, min: 0, max: 50, step: 1, label: 'Shadow blur' },
      glowX: { value: 41, min: 0, max: 100, step: 1, label: 'Glow X (%)' },
      glowY: { value: 36, min: 0, max: 100, step: 1, label: 'Glow Y (%)' },
      glowSize: { value: 240, min: 80, max: 400, step: 5, label: 'Glow size' },
      glowOpacity: { value: .18, min: 0, max: .8, step: .01, label: 'Glow opacity' },
      gridOpacity: { value: .25, min: 0, max: .8, step: .01, label: 'Grid opacity' },
      crossOpacity: { value: .35, min: 0, max: .8, step: .01, label: 'Crosshair opacity' },
    }, { collapsed: true }),
    Animation: folder({
      creativeAnimationsOn: { value: true, label: 'Animations ON/OFF' },
      'Replay Intro': button(onReplayIntro),
      creativeIntroDuration: { value: 1.6, min: .8, max: 3, step: .05, label: 'Intro finish (s)' },
      creativeIntroStagger: { value: .17, min: .05, max: .35, step: .01, label: 'Sequence gap (s)' },
      creativeIntroDistance: { value: 22, min: 0, max: 50, step: 1, label: 'Intro distance (px)' },
      creativeIdleVideo: { value: 15, min: 0, max: 28, step: .5, label: 'Video float (px)' },
      creativeIdleSocial: { value: 18, min: 0, max: 28, step: .5, label: 'Social float (px)' },
      creativeIdleBrand: { value: 16.5, min: 0, max: 28, step: .5, label: 'Brand float (px)' },
      creativeIdleVideoDuration: { value: 7.8, min: 5, max: 14, step: .1, label: 'Video period (s)' },
      creativeIdleSocialDuration: { value: 8.7, min: 5, max: 14, step: .1, label: 'Social period (s)' },
      creativeIdleBrandDuration: { value: 7.2, min: 5, max: 14, step: .1, label: 'Brand period (s)' },
    }, { collapsed: true }),
  }), { store }) as unknown as Record<string, number | string>
}

export type CreativeTunerValues = ReturnType<typeof useCreativeTuners>
export function creativeSceneValues(t: CreativeTunerValues) {
  return { video: creativePose(t, 'video'), social: creativePose(t, 'social'), brand: creativePose(t, 'brand'), controls: t }
}
