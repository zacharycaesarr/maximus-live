export const PARTICLES_TUNER_STORAGE_KEY = 'mr-particles-tuner-v1'

export const defaultParticlesTuner = {
  enabled: true,
  count: 42,
  linkDistance: 130,
  linkOpacity: 0.35,
  dotOpacity: 0.55,
  mouseRadius: 180,
  mouseStrength: 4.5,
  color: '#3d342c',
}

export function loadParticlesTuner() {
  try {
    const raw = localStorage.getItem(PARTICLES_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultParticlesTuner }
    return { ...defaultParticlesTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultParticlesTuner }
  }
}

export function toFlatParticlesTuner(tuner) {
  return {
    enabled: tuner.enabled ?? defaultParticlesTuner.enabled,
    count: tuner.count ?? defaultParticlesTuner.count,
    linkDistance: tuner.linkDistance ?? defaultParticlesTuner.linkDistance,
    linkOpacity: tuner.linkOpacity ?? defaultParticlesTuner.linkOpacity,
    dotOpacity: tuner.dotOpacity ?? defaultParticlesTuner.dotOpacity,
    mouseRadius: tuner.mouseRadius ?? defaultParticlesTuner.mouseRadius,
    mouseStrength: tuner.mouseStrength ?? defaultParticlesTuner.mouseStrength,
    color: tuner.color ?? defaultParticlesTuner.color,
  }
}
