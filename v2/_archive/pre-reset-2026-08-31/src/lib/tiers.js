const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile/i

function getGpuTier() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return 0

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : ''

    const blocklist = /swiftshader|llvmpipe|basic render/i
    if (blocklist.test(renderer)) return 1

    return 3
  } catch {
    return 0
  }
}

export function resolveQualityTier() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return 0

  const gpuTier = getGpuTier()
  if (gpuTier === 0) return 0

  const isMobile = MOBILE_UA.test(navigator.userAgent) || window.innerWidth < 768
  if (isMobile) return Math.min(gpuTier, 2)

  const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4
  if (isLowMemory) return 2

  return gpuTier
}

export function getDprForTier(tier) {
  const base = Math.min(window.devicePixelRatio || 1, tier >= 3 ? 1.5 : tier === 2 ? 1.25 : 1)
  return Math.max(1, base)
}

export const tierConfig = {
  0: {
    webgl: false,
    postfx: false,
    objectCount: 0,
    transmission: false,
    bloom: 0,
    grain: 0,
    vignette: 0,
  },
  1: {
    webgl: true,
    postfx: false,
    objectCount: 2,
    transmission: false,
    bloom: 0,
    grain: 0,
    vignette: 0.2,
  },
  2: {
    webgl: true,
    postfx: false,
    objectCount: 2,
    transmission: false,
    bloom: 0,
    grain: 0,
    vignette: 0,
  },
  3: {
    webgl: true,
    postfx: false,
    objectCount: 2,
    transmission: false,
    bloom: 0,
    grain: 0,
    vignette: 0,
  },
}

export function getTierSettings(tier) {
  return tierConfig[tier] ?? tierConfig[0]
}
