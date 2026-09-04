export const DESIGN_TUNER_STORAGE_KEY = 'mr-design-tuner-v1'

export const designTunerDefaults = {
  scrollWindow: {
    stageHeight: 260,
    targetScale: 0.74,
    targetScaleMobile: 0.82,
    borderRadius: 22,
    windowTop: 0,
    shadowBlur: 48,
    shadowSpread: 120,
    mouseTilt: 1.5,
    mouseTiltWhenScaled: 0,
  },
  headline: {
    top: 88,
    topMobile: 72,
    fontSize: 34,
    opacity: 1,
    fadeStart: 0.38,
  },
  heroInWindow: {
    opacity: 1,
    paddingLeft: 0,
    paddingBottom: 96,
    parallaxX: 6,
    parallaxY: 4,
  },
  nav: {
    dockRight: 1,
    dockTop: 120,
    dockScale: 0.88,
    dockOpacity: 1,
    dockStart: 0.15,
  },
  dock: {
    bottom: 100,
    bottomMobile: 140,
  },
  panel: {
    bottom: 36,
    statSize: 44,
  },
  subline: {
    bottom: 8,
    opacity: 0.55,
  },
  scene3d: {
    clusterX: 1.2,
    mouseFollow: 0.22,
    floatSpeed: 1.4,
  },
}

export function flattenForLeva(defaults) {
  const flat = {}
  Object.entries(defaults).forEach(([group, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      flat[`${group}.${key}`] = value
    })
  })
  return flat
}

export function unflattenFromLeva(flat) {
  const nested = {}
  Object.entries(flat).forEach(([key, value]) => {
    const [group, prop] = key.split('.')
    if (!nested[group]) nested[group] = {}
    nested[group][prop] = value
  })
  return nested
}
