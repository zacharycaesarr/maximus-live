export const SUBHEAD_TUNER_STORAGE_KEY = 'mr-subhead-tuner-v1'

export const defaultSubheadTuner = {
  text: 'Maximus Reach builds better websites, runs smarter ads, and puts simple systems in place so your business can keep growing.',
  brandLabel: 'Maximus Reach',
  posX: 3,
  posY: 58,
  maxWidth: 520,
  fontSize: 17,
  fontWeight: 400,
  color: '#4f433b',
  brandWeight: 700,
  brandColor: '#2a231c',
  lineHeight: 1.55,
  letterSpacing: 0.01,
  animDelay: 1.4,
  animDuration: 0.9,
  backdropEnabled: true,
  backdropColor: '#ebe1ca',
  backdropOpacity: 0.78,
  backdropBlur: 8,
  backdropPadding: 14,
  backdropRadius: 10,
}

export function loadSubheadTuner() {
  try {
    const raw = localStorage.getItem(SUBHEAD_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultSubheadTuner }
    return { ...defaultSubheadTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSubheadTuner }
  }
}

export function toFlatSubheadTuner(tuner) {
  return {
    text: tuner.text ?? defaultSubheadTuner.text,
    brandLabel: tuner.brandLabel ?? defaultSubheadTuner.brandLabel,
    posX: tuner.posX ?? defaultSubheadTuner.posX,
    posY: tuner.posY ?? defaultSubheadTuner.posY,
    maxWidth: tuner.maxWidth ?? defaultSubheadTuner.maxWidth,
    fontSize: tuner.fontSize ?? defaultSubheadTuner.fontSize,
    fontWeight: tuner.fontWeight ?? defaultSubheadTuner.fontWeight,
    color: tuner.color ?? defaultSubheadTuner.color,
    brandWeight: tuner.brandWeight ?? defaultSubheadTuner.brandWeight,
    brandColor: tuner.brandColor ?? defaultSubheadTuner.brandColor,
    lineHeight: tuner.lineHeight ?? defaultSubheadTuner.lineHeight,
    letterSpacing: tuner.letterSpacing ?? defaultSubheadTuner.letterSpacing,
    animDelay: tuner.animDelay ?? defaultSubheadTuner.animDelay,
    animDuration: tuner.animDuration ?? defaultSubheadTuner.animDuration,
    backdropEnabled: tuner.backdropEnabled ?? defaultSubheadTuner.backdropEnabled,
    backdropColor: tuner.backdropColor ?? defaultSubheadTuner.backdropColor,
    backdropOpacity: tuner.backdropOpacity ?? defaultSubheadTuner.backdropOpacity,
    backdropBlur: tuner.backdropBlur ?? defaultSubheadTuner.backdropBlur,
    backdropPadding: tuner.backdropPadding ?? defaultSubheadTuner.backdropPadding,
    backdropRadius: tuner.backdropRadius ?? defaultSubheadTuner.backdropRadius,
  }
}

export function splitBrandText(text, brandLabel) {
  if (!brandLabel || !text.includes(brandLabel)) {
    return [{ type: 'text', value: text }]
  }
  const parts = text.split(brandLabel)
  const segments = []
  parts.forEach((part, index) => {
    if (part) segments.push({ type: 'text', value: part })
    if (index < parts.length - 1) segments.push({ type: 'brand', value: brandLabel })
  })
  return segments
}
