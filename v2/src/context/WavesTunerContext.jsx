import { createContext, useContext, useEffect, useMemo } from 'react'
import { useControls, button, folder } from 'leva'
import {
  HOLD_WAVES_STORAGE_KEY,
  EXPLORE_WAVES_STORAGE_KEY,
  defaultHoldWavesTuner,
  defaultExploreWavesTuner,
  loadWavesTuner,
  toFlatWavesTuner,
  wavesTunerToUniforms,
} from '../components/background/wavesDefaults'

const WavesTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function wavesControlsSchema(initial, defaults) {
  return {
    enabled: { value: initial.enabled, label: 'Waves on' },
    Colors: folder(
      {
        color1: { value: initial.color1, label: 'Low (bottom dark)' },
        color2: { value: initial.color2, label: 'Mid bronze' },
        color3: { value: initial.color3, label: 'High cream' },
        color4: { value: initial.color4, label: 'Peak light' },
      },
      { collapsed: true },
    ),
    Shape: folder(
      {
        colorReach: {
          value: initial.colorReach,
          min: 0.2,
          max: 1.8,
          step: 0.02,
          label: 'Color reach (higher climbs more)',
        },
        timeScale: { value: initial.timeScale, min: -2, max: 2, step: 0.01, label: 'Speed' },
        scale: { value: initial.scale, min: 0.4, max: 4, step: 0.01, label: 'Zoom' },
        intensity: { value: initial.intensity, min: 0, max: 1.5, step: 0.01 },
        warp: { value: initial.warp, min: 0, max: 0.2, step: 0.001 },
        detail: { value: initial.detail, min: 0.4, max: 3, step: 0.01 },
        rotate: { value: initial.rotate, min: 0, max: 6.28, step: 0.01 },
        drift: { value: initial.drift, min: 0, max: 1, step: 0.01 },
        offsetX: { value: initial.offsetX, min: -1, max: 1, step: 0.01 },
        offsetY: { value: initial.offsetY, min: -1, max: 1, step: 0.01 },
        seed: { value: initial.seed, min: 0, max: 9999, step: 1 },
      },
      { collapsed: true },
    ),
    Look: folder(
      {
        contrast: { value: initial.contrast, min: 0.5, max: 2, step: 0.01 },
        brightness: { value: initial.brightness, min: -0.3, max: 0.4, step: 0.01 },
        saturation: { value: initial.saturation, min: 0, max: 2.5, step: 0.01 },
        hue: {
          value: initial.hue,
          min: 0,
          max: 6.28,
          step: 0.01,
          label: 'Hue rotate (0 = true colors)',
        },
        vignette: { value: initial.vignette, min: 0, max: 1, step: 0.01 },
        blur: { value: initial.blur, min: 0, max: 0.08, step: 0.001 },
        grain: { value: initial.grain, min: 0, max: 0.6, step: 0.01 },
        oklab: { value: initial.oklab, label: 'OKLab mix' },
      },
      { collapsed: true },
    ),
    Seam: folder(
      {
        seamBlend: {
          value: initial.seamBlend ?? defaults.seamBlend ?? 18,
          min: 0,
          max: 80,
          step: 1,
          label: 'Bottom fade (px)',
        },
      },
      { collapsed: true },
    ),
    Cursor: folder(
      {
        cursorEnabled: { value: initial.cursorEnabled, label: 'React to mouse' },
        cursorStrength: { value: initial.cursorStrength, min: 0, max: 2, step: 0.01 },
        cursorRadius: { value: initial.cursorRadius, min: 0.1, max: 1.2, step: 0.01 },
      },
      { collapsed: true },
    ),
  }
}

function WavesTunerProviderInner({ children, store }) {
  const holdInitial = useMemo(
    () => loadWavesTuner(HOLD_WAVES_STORAGE_KEY, defaultHoldWavesTuner),
    [],
  )
  const exploreInitial = useMemo(
    () => loadWavesTuner(EXPLORE_WAVES_STORAGE_KEY, defaultExploreWavesTuner),
    [],
  )

  const holdTuner = useControls(
    'Reality Waves Background',
    {
      ...wavesControlsSchema(holdInitial, defaultHoldWavesTuner),
      Actions: folder(
        {
          'Reset hold waves': button(() => {
            localStorage.removeItem(HOLD_WAVES_STORAGE_KEY)
            localStorage.removeItem('mr-waves-tuner-v2')
            localStorage.removeItem('mr-waves-tuner-v1')
            window.location.reload()
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const exploreTuner = useControls(
    'Explore Waves Background',
    {
      ...wavesControlsSchema(exploreInitial, defaultExploreWavesTuner),
      Actions: folder(
        {
          'Reset explore waves': button(() => {
            localStorage.removeItem(EXPLORE_WAVES_STORAGE_KEY)
            window.location.reload()
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const hold = useMemo(
    () => toFlatWavesTuner(holdTuner, defaultHoldWavesTuner),
    [holdTuner],
  )
  const explore = useMemo(
    () => toFlatWavesTuner(exploreTuner, defaultExploreWavesTuner),
    [exploreTuner],
  )
  const holdUniforms = useMemo(
    () => wavesTunerToUniforms(hold, defaultHoldWavesTuner),
    [hold],
  )
  const exploreUniforms = useMemo(
    () => wavesTunerToUniforms(explore, defaultExploreWavesTuner),
    [explore],
  )

  useEffect(() => {
    localStorage.setItem(HOLD_WAVES_STORAGE_KEY, JSON.stringify(hold))
  }, [hold])

  useEffect(() => {
    localStorage.setItem(EXPLORE_WAVES_STORAGE_KEY, JSON.stringify(explore))
  }, [explore])

  const value = useMemo(
    () => ({
      hold: { settings: hold, uniforms: holdUniforms },
      explore: { settings: explore, uniforms: exploreUniforms },
      // back-compat for older callers expecting settings/uniforms
      settings: hold,
      uniforms: holdUniforms,
    }),
    [hold, explore, holdUniforms, exploreUniforms],
  )

  return <WavesTunerContext.Provider value={value}>{children}</WavesTunerContext.Provider>
}

export function WavesTunerProvider({ children, store }) {
  if (!isDev || !store) {
    const hold = defaultHoldWavesTuner
    const explore = defaultExploreWavesTuner
    return (
      <WavesTunerContext.Provider
        value={{
          hold: { settings: hold, uniforms: wavesTunerToUniforms(hold) },
          explore: { settings: explore, uniforms: wavesTunerToUniforms(explore, defaultExploreWavesTuner) },
          settings: hold,
          uniforms: wavesTunerToUniforms(hold),
        }}
      >
        {children}
      </WavesTunerContext.Provider>
    )
  }
  return <WavesTunerProviderInner store={store}>{children}</WavesTunerProviderInner>
}

export function useWavesTuner() {
  const ctx = useContext(WavesTunerContext)
  if (!ctx) {
    const hold = defaultHoldWavesTuner
    const explore = defaultExploreWavesTuner
    return {
      hold: { settings: hold, uniforms: wavesTunerToUniforms(hold) },
      explore: { settings: explore, uniforms: wavesTunerToUniforms(explore, defaultExploreWavesTuner) },
      settings: hold,
      uniforms: wavesTunerToUniforms(hold),
    }
  }
  return ctx
}
