export const TYPOGRAPHY_STORAGE_KEY = 'mr-typography-tuner-v1'

export const DISPLAY_FONT_OPTIONS = {
  'Clash Display': '"Clash Display", "Inter", system-ui, sans-serif',
  'Familjen Grotesk': '"Familjen Grotesk", "Inter", system-ui, sans-serif',
  'Spline Sans': '"Spline Sans", "Inter", system-ui, sans-serif',
  Inter: '"Inter", system-ui, sans-serif',
}

export const BODY_FONT_OPTIONS = {
  Archivo: '"Archivo", "Inter", system-ui, sans-serif',
  'Spline Sans': '"Spline Sans", "Inter", system-ui, sans-serif',
  'Familjen Grotesk': '"Familjen Grotesk", "Inter", system-ui, sans-serif',
  Inter: '"Inter", system-ui, sans-serif',
}

export const defaultTypographyTuner = {
  displayFont: 'Clash Display',
  bodyFont: 'Archivo',
}

export function loadTypographyTuner() {
  try {
    const raw = localStorage.getItem(TYPOGRAPHY_STORAGE_KEY)
    if (!raw) return { ...defaultTypographyTuner }
    return { ...defaultTypographyTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultTypographyTuner }
  }
}

export function toFlatTypographyTuner(tuner) {
  return {
    displayFont: tuner.displayFont ?? defaultTypographyTuner.displayFont,
    bodyFont: tuner.bodyFont ?? defaultTypographyTuner.bodyFont,
  }
}

export function typographyToCssVars(settings) {
  const flat = toFlatTypographyTuner(settings)
  return {
    '--font-display': DISPLAY_FONT_OPTIONS[flat.displayFont] || DISPLAY_FONT_OPTIONS['Clash Display'],
    '--font-body': BODY_FONT_OPTIONS[flat.bodyFont] || BODY_FONT_OPTIONS.Archivo,
  }
}
