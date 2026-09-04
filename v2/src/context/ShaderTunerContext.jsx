import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultShaderTuner,
  loadShaderTuner,
  shaderTunerToExportPayload,
  SHADER_TUNER_STORAGE_KEY,
  tunerToUniforms,
} from '../components/background/shaderDefaults'

const ShaderTunerContext = createContext(null)
const isDev = import.meta.env.DEV

/** Leva returns flat keys (color1, grain, etc.), not folder-prefixed paths */
function toFlatTuner(tuner) {
  return {
    color1: tuner.color1 ?? tuner['Colors.color1'] ?? defaultShaderTuner.color1,
    color2: tuner.color2 ?? tuner['Colors.color2'] ?? defaultShaderTuner.color2,
    color3: tuner.color3 ?? tuner['Colors.color3'] ?? defaultShaderTuner.color3,
    color4: tuner.color4 ?? tuner['Colors.color4'] ?? defaultShaderTuner.color4,
    timeScale: tuner.timeScale ?? tuner['Motion.timeScale'] ?? defaultShaderTuner.timeScale,
    drift: tuner.drift ?? tuner['Motion.drift'] ?? defaultShaderTuner.drift,
    scale: tuner.scale ?? tuner['Motion.scale'] ?? defaultShaderTuner.scale,
    rotate: tuner.rotate ?? tuner['Motion.rotate'] ?? defaultShaderTuner.rotate,
    offsetX: tuner.offsetX ?? tuner['Motion.offsetX'] ?? defaultShaderTuner.offsetX,
    offsetY: tuner.offsetY ?? tuner['Motion.offsetY'] ?? defaultShaderTuner.offsetY,
    seed: tuner.seed ?? tuner['Motion.seed'] ?? defaultShaderTuner.seed,
    grain: tuner.grain ?? tuner['Look.grain'] ?? defaultShaderTuner.grain,
    vignette: tuner.vignette ?? tuner['Look.vignette'] ?? defaultShaderTuner.vignette,
    blur: tuner.blur ?? tuner['Look.blur'] ?? defaultShaderTuner.blur,
    contrast: tuner.contrast ?? tuner['Look.contrast'] ?? defaultShaderTuner.contrast,
    intensity: tuner.intensity ?? tuner['Look.intensity'] ?? defaultShaderTuner.intensity,
    warp: tuner.warp ?? tuner['Look.warp'] ?? defaultShaderTuner.warp,
    detail: tuner.detail ?? tuner['Look.detail'] ?? defaultShaderTuner.detail,
    brightness: tuner.brightness ?? tuner['Look.brightness'] ?? defaultShaderTuner.brightness,
    saturation: tuner.saturation ?? tuner['Look.saturation'] ?? defaultShaderTuner.saturation,
    cursorEnabled: tuner.cursorEnabled ?? tuner['Cursor.cursorEnabled'] ?? defaultShaderTuner.cursorEnabled,
    cursorEffect: tuner.cursorEffect ?? tuner['Cursor.cursorEffect'] ?? defaultShaderTuner.cursorEffect,
    cursorStrength: tuner.cursorStrength ?? tuner['Cursor.cursorStrength'] ?? defaultShaderTuner.cursorStrength,
    cursorRadius: tuner.cursorRadius ?? tuner['Cursor.cursorRadius'] ?? defaultShaderTuner.cursorRadius,
  }
}

function ShaderTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadShaderTuner(), [])
  const flatRef = useRef(defaultShaderTuner)

  const tuner = useControls(
    'Shader Background',
    {
    Colors: folder({
      color1: { value: initial.color1, label: 'Deep base' },
      color2: { value: initial.color2, label: 'Teal' },
      color3: { value: initial.color3, label: 'Mint' },
      color4: { value: initial.color4, label: 'Cream' },
    }),
    Motion: folder({
      timeScale: { value: initial.timeScale, min: -2, max: 2, step: 0.01, label: 'Speed' },
      drift: { value: initial.drift, min: 0, max: 0.5, step: 0.001 },
      scale: { value: initial.scale, min: 0.5, max: 4, step: 0.01 },
      rotate: { value: initial.rotate, min: 0, max: 6.28, step: 0.01 },
      offsetX: { value: initial.offsetX, min: -1, max: 1, step: 0.01 },
      offsetY: { value: initial.offsetY, min: -1, max: 1, step: 0.01 },
      seed: { value: initial.seed, min: 0, max: 9999, step: 1 },
    }),
    Look: folder({
      grain: { value: initial.grain, min: 0, max: 0.3, step: 0.001, label: 'Film grain' },
      vignette: { value: initial.vignette, min: 0, max: 1, step: 0.01 },
      blur: { value: initial.blur, min: 0, max: 0.02, step: 0.0001 },
      contrast: { value: initial.contrast, min: 0.5, max: 2, step: 0.01 },
      intensity: { value: initial.intensity, min: 0, max: 1.5, step: 0.01, label: 'Orb glow' },
      warp: { value: initial.warp, min: 0, max: 0.2, step: 0.001 },
      detail: { value: initial.detail, min: 0.5, max: 3, step: 0.01 },
      brightness: { value: initial.brightness, min: -0.3, max: 0.3, step: 0.01 },
      saturation: { value: initial.saturation, min: 0, max: 2, step: 0.01 },
    }),
    Cursor: folder({
      cursorEnabled: { value: initial.cursorEnabled, label: 'React to mouse' },
      cursorEffect: {
        value: initial.cursorEffect,
        min: 0,
        max: 4,
        step: 1,
        label: '0 push 1 repel 2 rotate 3 ripple 4 spotlight',
      },
      cursorStrength: { value: initial.cursorStrength, min: 0, max: 1.5, step: 0.01 },
      cursorRadius: { value: initial.cursorRadius, min: 0.1, max: 1.5, step: 0.01 },
    }),
    Actions: folder({
      'Reset to 21st defaults': button(() => {
        localStorage.removeItem(SHADER_TUNER_STORAGE_KEY)
        window.location.reload()
      }),
      'Copy JSON': button(() => {
        const payload = shaderTunerToExportPayload(flatRef.current)
        navigator.clipboard?.writeText(JSON.stringify(payload, null, 2))
      }),
    }),
    },
    { collapsed: true },
    { store },
  )

  const flatTuner = useMemo(() => toFlatTuner(tuner), [tuner])
  flatRef.current = flatTuner

  useEffect(() => {
    localStorage.setItem(SHADER_TUNER_STORAGE_KEY, JSON.stringify(flatTuner))
  }, [flatTuner])

  const uniforms = useMemo(() => tunerToUniforms(flatTuner), [flatTuner])

  return (
    <ShaderTunerContext.Provider value={{ tuner: flatTuner, uniforms }}>
      {children}
    </ShaderTunerContext.Provider>
  )
}

export function ShaderTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <ShaderTunerContext.Provider
        value={{ tuner: defaultShaderTuner, uniforms: tunerToUniforms(defaultShaderTuner) }}
      >
        {children}
      </ShaderTunerContext.Provider>
    )
  }

  return <ShaderTunerProviderInner store={store}>{children}</ShaderTunerProviderInner>
}

export function useShaderTuner() {
  const ctx = useContext(ShaderTunerContext)
  if (!ctx) {
    return {
      tuner: defaultShaderTuner,
      uniforms: tunerToUniforms(defaultShaderTuner),
    }
  }
  return ctx
}
