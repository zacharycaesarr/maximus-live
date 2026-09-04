export const SCROLL_TUNER_STORAGE_KEY = 'mr-scroll-tuner-v1'

export const defaultScrollTuner = {
  enabled: true,
  stageHeightVh: 400,
  transitionEnd: 0.48,
  holdEnd: 0.76,
  scaleStart: 0.03,
  scaleMin: 0.62,
  borderRadiusEnd: 22,
  compositionShiftPx: -64,
  titleGapPx: -88,
  dockGapPx: 36,
  connectorBottomPx: 28,
  connectorReservePx: 220,
  connectorLabel: 'EXPLORE MAXIMUS REACH',
  connectorLabelColor: '#0a0c10',
  connectorLineFrom: 'rgba(10, 12, 16, 0.9)',
  connectorLineTo: 'rgba(10, 12, 16, 0.25)',
  connectorDividerColor: 'rgba(10, 12, 16, 0.92)',
  connectorDividerThickness: 3,
  connectorDividerOffsetY: 0,
  connectorDividerVisible: true,
  connectorDividerTone: 'black',
  backdropColor: '#050608',
  backdropFadeStart: 0.04,
  backdropFadeEnd: 0.42,
  spotlightColor: '#ffffff',
  spotlightMidColor: 'rgba(255, 255, 255, 0.28)',
  spotlightSize: 900,
  spotlightStrength: 2.2,
  spotlightHoldBoost: 1.6,
  windowTiltEnabled: true,
  windowTiltMax: 8,
  windowTiltPerspective: 900,
  windowTiltLeavePad: 56,
  /* Full-field dots (no center mask). Center mask hid dots behind the window. */
  dotPatternEnabled: true,
  dotPatternSpacing: 22,
  dotPatternX: 0,
  dotPatternY: 0,
  dotPatternCx: 1,
  dotPatternCy: 1,
  dotPatternRadius: 1.25,
  dotPatternColor: 'rgba(255, 255, 255, 0.14)',
  dotPatternOpacity: 1,
  dotPatternMaskSize: 0,
  dotPatternMouseShift: 8,
  dotPatternScrollShift: 14,
  chromeRevealStart: 0.1,
  chromeRevealEnd: 0.46,
  chromeHeight: 88,
  chromeBgTop: '#2b3038',
  chromeBgBottom: '#1e2229',
  overheadTitle: 'Digital growth at your fingertips',
  titleGradientStart: '#ffffff',
  titleGradientEnd: '#c4b8a8',
  glassNavFadeStart: 0.12,
  glassNavFadeEnd: 0.4,
  hintFadeEnd: 0.14,
  logoLightEnd: 0.4,
  logoRealityParallax: 0.32,
  addressUrl: 'maximusreach.com',
  tabTitle: 'Maximus Reach',
  dockItems: 'Web Platforms|Ad Engines|CRM Pipelines|Video',
  dockActiveIndex: 0,
  shellShadow: '0 28px 80px rgba(0,0,0,0.65)',
  zSectionTitle: 'Built for businesses that want to grow',
  zSectionBody:
    'Websites, ads, automation, and video. One partner for the digital work that actually moves the needle.',
  zSectionAlign: 'left',
}

export function loadScrollTuner() {
  try {
    const raw = localStorage.getItem(SCROLL_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultScrollTuner }
    const parsed = { ...defaultScrollTuner, ...JSON.parse(raw) }
    if (parsed.scaleMin > 0.66) parsed.scaleMin = 0.62
    if (parsed.titleGapPx > -40) parsed.titleGapPx = -88
    if (parsed.spotlightColor === '#e8d4b8' || parsed.spotlightColor?.includes('d4b8')) {
      parsed.spotlightColor = defaultScrollTuner.spotlightColor
      parsed.spotlightMidColor = defaultScrollTuner.spotlightMidColor
    }
    /*
      Dot migrations:
      - Old cx/cy 0 clipped dots in the pattern tile
      - Center radial masks (e.g. 520) put dots behind the opaque window → letterbox looked empty
      Always promote to full-field visible defaults when those bad states are detected.
    */
    const badDotLayout =
      parsed.dotPatternCx === 0 ||
      parsed.dotPatternCy === 0 ||
      parsed.dotPatternX === undefined ||
      (parsed.dotPatternMaskSize != null && parsed.dotPatternMaskSize > 0 && parsed.dotPatternMaskSize <= 700) ||
      parsed.dotPatternColor === 'rgba(148, 163, 184, 0.55)' ||
      parsed.dotPatternColor === 'rgba(255, 255, 255, 0.22)' ||
      parsed.dotPatternColor === 'rgba(255, 255, 255, 0.38)' ||
      parsed.dotPatternColor === 'rgba(255, 255, 255, 0.42)'

    if (badDotLayout) {
      parsed.dotPatternSpacing = defaultScrollTuner.dotPatternSpacing
      parsed.dotPatternX = defaultScrollTuner.dotPatternX
      parsed.dotPatternY = defaultScrollTuner.dotPatternY
      parsed.dotPatternCx = defaultScrollTuner.dotPatternCx
      parsed.dotPatternCy = defaultScrollTuner.dotPatternCy
      parsed.dotPatternRadius = defaultScrollTuner.dotPatternRadius
      parsed.dotPatternColor = defaultScrollTuner.dotPatternColor
      parsed.dotPatternOpacity = defaultScrollTuner.dotPatternOpacity
      parsed.dotPatternMaskSize = defaultScrollTuner.dotPatternMaskSize
      parsed.dotPatternMouseShift = defaultScrollTuner.dotPatternMouseShift
      parsed.dotPatternScrollShift = defaultScrollTuner.dotPatternScrollShift
      parsed.dotPatternEnabled = true
    }
    if (parsed.dockGapPx !== undefined && parsed.dockGapPx < 24) {
      parsed.dockGapPx = defaultScrollTuner.dockGapPx
    }
    if (parsed.windowTiltLeavePad !== undefined && parsed.windowTiltLeavePad < 40) {
      parsed.windowTiltLeavePad = defaultScrollTuner.windowTiltLeavePad
    }
    if (parsed.connectorReservePx === undefined || parsed.connectorReservePx > 240) {
      parsed.connectorReservePx = defaultScrollTuner.connectorReservePx
    }
    if (parsed.connectorBottomPx === undefined) {
      parsed.connectorBottomPx = defaultScrollTuner.connectorBottomPx
    }
    if (parsed.connectorDividerThickness === undefined) {
      parsed.connectorDividerThickness = defaultScrollTuner.connectorDividerThickness
    }
    try {
      localStorage.setItem(SCROLL_TUNER_STORAGE_KEY, JSON.stringify(parsed))
    } catch {
      /* ignore quota */
    }
    return parsed
  } catch {
    return { ...defaultScrollTuner }
  }
}

export function parseDockItems(raw) {
  if (!raw || typeof raw !== 'string') {
    return defaultScrollTuner.dockItems.split('|')
  }
  return raw.split('|').map((s) => s.trim()).filter(Boolean)
}

export function toFlatScrollTuner(tuner) {
  return {
    enabled: tuner.enabled ?? defaultScrollTuner.enabled,
    stageHeightVh: tuner.stageHeightVh ?? defaultScrollTuner.stageHeightVh,
    transitionEnd: tuner.transitionEnd ?? defaultScrollTuner.transitionEnd,
    holdEnd: tuner.holdEnd ?? defaultScrollTuner.holdEnd,
    scaleStart: tuner.scaleStart ?? defaultScrollTuner.scaleStart,
    scaleMin: tuner.scaleMin ?? defaultScrollTuner.scaleMin,
    borderRadiusEnd: tuner.borderRadiusEnd ?? defaultScrollTuner.borderRadiusEnd,
    compositionShiftPx: tuner.compositionShiftPx ?? defaultScrollTuner.compositionShiftPx,
    titleGapPx: tuner.titleGapPx ?? defaultScrollTuner.titleGapPx,
    dockGapPx: tuner.dockGapPx ?? defaultScrollTuner.dockGapPx,
    connectorReservePx: tuner.connectorReservePx ?? defaultScrollTuner.connectorReservePx,
    connectorBottomPx: tuner.connectorBottomPx ?? defaultScrollTuner.connectorBottomPx,
    connectorLabel: tuner.connectorLabel ?? defaultScrollTuner.connectorLabel,
    connectorLabelColor: tuner.connectorLabelColor ?? defaultScrollTuner.connectorLabelColor,
    connectorLineFrom: tuner.connectorLineFrom ?? defaultScrollTuner.connectorLineFrom,
    connectorLineTo: tuner.connectorLineTo ?? defaultScrollTuner.connectorLineTo,
    connectorDividerColor: tuner.connectorDividerColor ?? defaultScrollTuner.connectorDividerColor,
    connectorDividerThickness:
      tuner.connectorDividerThickness ?? defaultScrollTuner.connectorDividerThickness,
    connectorDividerOffsetY:
      tuner.connectorDividerOffsetY ?? defaultScrollTuner.connectorDividerOffsetY,
    connectorDividerVisible:
      tuner.connectorDividerVisible ?? defaultScrollTuner.connectorDividerVisible,
    connectorDividerTone: tuner.connectorDividerTone ?? defaultScrollTuner.connectorDividerTone,
    backdropColor: tuner.backdropColor ?? defaultScrollTuner.backdropColor,
    backdropFadeStart: tuner.backdropFadeStart ?? defaultScrollTuner.backdropFadeStart,
    backdropFadeEnd: tuner.backdropFadeEnd ?? defaultScrollTuner.backdropFadeEnd,
    spotlightColor: tuner.spotlightColor ?? defaultScrollTuner.spotlightColor,
    spotlightMidColor: tuner.spotlightMidColor ?? defaultScrollTuner.spotlightMidColor,
    spotlightSize: tuner.spotlightSize ?? defaultScrollTuner.spotlightSize,
    spotlightStrength: tuner.spotlightStrength ?? defaultScrollTuner.spotlightStrength,
    spotlightHoldBoost: tuner.spotlightHoldBoost ?? defaultScrollTuner.spotlightHoldBoost,
    windowTiltEnabled: tuner.windowTiltEnabled ?? defaultScrollTuner.windowTiltEnabled,
    windowTiltMax: tuner.windowTiltMax ?? defaultScrollTuner.windowTiltMax,
    windowTiltPerspective: tuner.windowTiltPerspective ?? defaultScrollTuner.windowTiltPerspective,
    windowTiltLeavePad: tuner.windowTiltLeavePad ?? defaultScrollTuner.windowTiltLeavePad,
    dotPatternEnabled: tuner.dotPatternEnabled ?? defaultScrollTuner.dotPatternEnabled,
    dotPatternSpacing: tuner.dotPatternSpacing ?? defaultScrollTuner.dotPatternSpacing,
    dotPatternX: tuner.dotPatternX ?? defaultScrollTuner.dotPatternX,
    dotPatternY: tuner.dotPatternY ?? defaultScrollTuner.dotPatternY,
    dotPatternRadius: tuner.dotPatternRadius ?? defaultScrollTuner.dotPatternRadius,
    dotPatternCx: tuner.dotPatternCx ?? defaultScrollTuner.dotPatternCx,
    dotPatternCy: tuner.dotPatternCy ?? defaultScrollTuner.dotPatternCy,
    dotPatternColor: tuner.dotPatternColor ?? defaultScrollTuner.dotPatternColor,
    dotPatternOpacity: tuner.dotPatternOpacity ?? defaultScrollTuner.dotPatternOpacity,
    dotPatternMaskSize: tuner.dotPatternMaskSize ?? defaultScrollTuner.dotPatternMaskSize,
    dotPatternMouseShift: tuner.dotPatternMouseShift ?? defaultScrollTuner.dotPatternMouseShift,
    dotPatternScrollShift: tuner.dotPatternScrollShift ?? defaultScrollTuner.dotPatternScrollShift,
    chromeRevealStart: tuner.chromeRevealStart ?? defaultScrollTuner.chromeRevealStart,
    chromeRevealEnd: tuner.chromeRevealEnd ?? defaultScrollTuner.chromeRevealEnd,
    chromeHeight: tuner.chromeHeight ?? defaultScrollTuner.chromeHeight,
    chromeBgTop: tuner.chromeBgTop ?? defaultScrollTuner.chromeBgTop,
    chromeBgBottom: tuner.chromeBgBottom ?? defaultScrollTuner.chromeBgBottom,
    overheadTitle: tuner.overheadTitle ?? defaultScrollTuner.overheadTitle,
    titleGradientStart: tuner.titleGradientStart ?? defaultScrollTuner.titleGradientStart,
    titleGradientEnd: tuner.titleGradientEnd ?? defaultScrollTuner.titleGradientEnd,
    glassNavFadeStart: tuner.glassNavFadeStart ?? defaultScrollTuner.glassNavFadeStart,
    glassNavFadeEnd: tuner.glassNavFadeEnd ?? defaultScrollTuner.glassNavFadeEnd,
    hintFadeEnd: tuner.hintFadeEnd ?? defaultScrollTuner.hintFadeEnd,
    logoLightEnd: tuner.logoLightEnd ?? defaultScrollTuner.logoLightEnd,
    logoRealityParallax: tuner.logoRealityParallax ?? defaultScrollTuner.logoRealityParallax,
    addressUrl: tuner.addressUrl ?? defaultScrollTuner.addressUrl,
    tabTitle: tuner.tabTitle ?? defaultScrollTuner.tabTitle,
    dockItems: parseDockItems(tuner.dockItems),
    dockActiveIndex: tuner.dockActiveIndex ?? defaultScrollTuner.dockActiveIndex,
    shellShadow: tuner.shellShadow ?? defaultScrollTuner.shellShadow,
    zSectionTitle: tuner.zSectionTitle ?? defaultScrollTuner.zSectionTitle,
    zSectionBody: tuner.zSectionBody ?? defaultScrollTuner.zSectionBody,
    zSectionAlign: tuner.zSectionAlign ?? defaultScrollTuner.zSectionAlign,
  }
}
