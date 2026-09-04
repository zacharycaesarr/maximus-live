import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultScrollTuner,
  loadScrollTuner,
  SCROLL_TUNER_STORAGE_KEY,
  toFlatScrollTuner,
} from '../lib/scrollDefaults'

const ScrollTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function ScrollTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadScrollTuner(), [])
  const settingsRef = useRef(defaultScrollTuner)

  const tuner = useControls(
    'Scroll Window',
    {
      Stage: folder(
        {
          enabled: { value: initial.enabled, label: 'Scroll window on' },
          stageHeightVh: { value: initial.stageHeightVh, min: 280, max: 520, step: 10, label: 'Stage height (vh)' },
          transitionEnd: { value: initial.transitionEnd, min: 0.25, max: 0.6, step: 0.02, label: 'Shrink ends @' },
          holdEnd: { value: initial.holdEnd, min: 0.5, max: 0.92, step: 0.02, label: 'Hold ends @' },
          scaleStart: { value: initial.scaleStart, min: 0, max: 0.12, step: 0.01, label: 'Shrink starts @' },
          scaleMin: { value: initial.scaleMin, min: 0.55, max: 0.95, step: 0.01, label: 'Min scale' },
          borderRadiusEnd: { value: initial.borderRadiusEnd, min: 0, max: 40, step: 1, label: 'Corner radius' },
          compositionShiftPx: { value: initial.compositionShiftPx, min: -120, max: 0, step: 2, label: 'Group shift (px)' },
          titleGapPx: { value: initial.titleGapPx, min: -120, max: 20, step: 2, label: 'Title gap above window (px)' },
          dockGapPx: { value: initial.dockGapPx, min: -20, max: 80, step: 2, label: 'Dock gap below window (px)' },
          connectorBottomPx: { value: initial.connectorBottomPx, min: 8, max: 80, step: 2, label: 'Connector from bottom (px)' },
          connectorReservePx: { value: initial.connectorReservePx, min: 160, max: 320, step: 4, label: 'Connector reserve (px)' },
        },
        { collapsed: true },
      ),
      RealityBackdrop: folder(
        {
          backdropColor: { value: initial.backdropColor, label: 'Reality bg color' },
          backdropFadeStart: { value: initial.backdropFadeStart, min: 0, max: 0.2, step: 0.01, label: 'Fade start @' },
          backdropFadeEnd: { value: initial.backdropFadeEnd, min: 0.15, max: 0.6, step: 0.02, label: 'Fade end @' },
          spotlightColor: { value: initial.spotlightColor, label: 'Spotlight core' },
          spotlightMidColor: { value: initial.spotlightMidColor, label: 'Spotlight mid' },
          spotlightSize: { value: initial.spotlightSize, min: 400, max: 1400, step: 20, label: 'Spotlight size (px)' },
          spotlightStrength: { value: initial.spotlightStrength, min: 0, max: 4, step: 0.05, label: 'Spotlight strength' },
          spotlightHoldBoost: { value: initial.spotlightHoldBoost, min: 0, max: 3, step: 0.05, label: 'Hold pulse boost' },
          dotPatternEnabled: { value: initial.dotPatternEnabled, label: 'Dot pattern on' },
          dotPatternSpacing: { value: initial.dotPatternSpacing, min: 12, max: 48, step: 2, label: 'Dot spacing (21st width/height)' },
          dotPatternX: { value: initial.dotPatternX ?? 0, min: 0, max: 24, step: 0.5, label: 'Dot pattern x' },
          dotPatternY: { value: initial.dotPatternY ?? 0, min: 0, max: 24, step: 0.5, label: 'Dot pattern y' },
          dotPatternCx: { value: initial.dotPatternCx, min: 0, max: 12, step: 0.25, label: 'Dot cx (in cell)' },
          dotPatternCy: { value: initial.dotPatternCy, min: 0, max: 12, step: 0.25, label: 'Dot cy (in cell)' },
          dotPatternRadius: { value: initial.dotPatternRadius, min: 0.2, max: 2.5, step: 0.05, label: 'Dot radius (cr)' },
          dotPatternColor: { value: initial.dotPatternColor, label: 'Dot fill (21st slate-500/55)' },
          dotPatternOpacity: { value: initial.dotPatternOpacity, min: 0, max: 1, step: 0.02, label: 'Dot opacity' },
          dotPatternMaskSize: { value: initial.dotPatternMaskSize, min: 0, max: 1200, step: 20, label: 'Dot mask px (0=full)' },
          dotPatternMouseShift: { value: initial.dotPatternMouseShift, min: 0, max: 40, step: 1, label: 'Dot mouse shift' },
          dotPatternScrollShift: { value: initial.dotPatternScrollShift, min: 0, max: 60, step: 1, label: 'Dot scroll shift' },
        },
        { collapsed: true },
      ),
      WindowTilt: folder(
        {
          windowTiltEnabled: { value: initial.windowTiltEnabled, label: '3D tilt when tabbed' },
          windowTiltMax: { value: initial.windowTiltMax, min: 2, max: 18, step: 0.5, label: 'Tilt max (deg)' },
          windowTiltPerspective: { value: initial.windowTiltPerspective, min: 400, max: 1400, step: 50, label: 'Perspective' },
          windowTiltLeavePad: {
            value: initial.windowTiltLeavePad ?? 56,
            min: 0,
            max: 140,
            step: 2,
            label: 'Tilt follow radius (px)',
          },
        },
        { collapsed: true },
      ),
      Chrome: folder(
        {
          tabTitle: { value: initial.tabTitle, label: 'Tab title' },
          addressUrl: { value: initial.addressUrl, label: 'Address bar' },
          chromeRevealStart: { value: initial.chromeRevealStart, min: 0, max: 0.35, step: 0.02, label: 'Tab slide start @' },
          chromeRevealEnd: { value: initial.chromeRevealEnd, min: 0.15, max: 0.55, step: 0.02, label: 'Tab slide end @' },
          chromeHeight: { value: initial.chromeHeight, min: 64, max: 120, step: 2, label: 'Chrome height (px)' },
          chromeBgTop: { value: initial.chromeBgTop, label: 'Chrome bg top' },
          chromeBgBottom: { value: initial.chromeBgBottom, label: 'Chrome bg bottom' },
        },
        { collapsed: true },
      ),
      OverheadTitle: folder(
        {
          overheadTitle: { value: initial.overheadTitle, label: 'Title text', rows: 2 },
          titleGradientStart: { value: initial.titleGradientStart, label: 'Gradient start' },
          titleGradientEnd: { value: initial.titleGradientEnd, label: 'Gradient end' },
        },
        { collapsed: true },
      ),
      Dock: folder(
        {
          dockItems: {
            value: initial.dockItems ?? defaultScrollTuner.dockItems,
            label: 'Dock tabs (| separated)',
            rows: 2,
          },
          connectorLabel: { value: initial.connectorLabel, label: 'Explore label' },
          connectorLabelColor: { value: initial.connectorLabelColor, label: 'Explore label color' },
          connectorLineFrom: { value: initial.connectorLineFrom, label: 'Line above (top)' },
          connectorLineTo: { value: initial.connectorLineTo, label: 'Line above (bottom)' },
          connectorDividerVisible: {
            value: initial.connectorDividerVisible ?? true,
            label: 'Show seam divider',
          },
          connectorDividerTone: {
            value: initial.connectorDividerTone ?? 'black',
            options: ['black', 'white'],
            label: 'Divider tone',
          },
          connectorDividerThickness: {
            value: initial.connectorDividerThickness ?? 3,
            min: 1,
            max: 10,
            step: 0.5,
            label: 'Seam divider thickness',
          },
          connectorDividerOffsetY: {
            value: initial.connectorDividerOffsetY ?? 0,
            min: -80,
            max: 120,
            step: 1,
            label: 'Divider position (px)',
          },
          connectorDividerColor: { value: initial.connectorDividerColor, label: 'Custom divider color' },
        },
        { collapsed: true },
      ),
      Fades: folder(
        {
          glassNavFadeStart: { value: initial.glassNavFadeStart, min: 0, max: 0.4, step: 0.02 },
          glassNavFadeEnd: { value: initial.glassNavFadeEnd, min: 0.1, max: 0.6, step: 0.02 },
          hintFadeEnd: { value: initial.hintFadeEnd, min: 0.04, max: 0.3, step: 0.01 },
          logoLightEnd: { value: initial.logoLightEnd, min: 0.15, max: 0.7, step: 0.02, label: 'Logo white @' },
          logoRealityParallax: { value: initial.logoRealityParallax, min: 0, max: 1, step: 0.02, label: 'Logo parallax (reality)' },
        },
        { collapsed: true },
      ),
      ZPattern: folder(
        {
          zSectionTitle: { value: initial.zSectionTitle, label: 'First section title', rows: 2 },
          zSectionBody: { value: initial.zSectionBody, label: 'First section body', rows: 4 },
        },
        { collapsed: true },
      ),
      Actions: folder(
        {
          'Reset defaults': button(() => {
            localStorage.removeItem(SCROLL_TUNER_STORAGE_KEY)
            window.location.reload()
          }),
          'Copy JSON': button(() => {
            navigator.clipboard?.writeText(JSON.stringify(settingsRef.current, null, 2))
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatScrollTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(SCROLL_TUNER_STORAGE_KEY, JSON.stringify({ ...tuner, dockItems: tuner.dockItems }))
  }, [settings, tuner])

  return (
    <ScrollTunerContext.Provider value={{ settings }}>
      {children}
    </ScrollTunerContext.Provider>
  )
}

export function ScrollTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <ScrollTunerContext.Provider value={{ settings: defaultScrollTuner }}>
        {children}
      </ScrollTunerContext.Provider>
    )
  }

  return <ScrollTunerProviderInner store={store}>{children}</ScrollTunerProviderInner>
}

export function useScrollTuner() {
  const ctx = useContext(ScrollTunerContext)
  if (!ctx) return { settings: defaultScrollTuner }
  return ctx
}
