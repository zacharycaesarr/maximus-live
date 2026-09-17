export const DEMO_CANVAS_STORAGE_KEY = 'mr-v3-demo-canvas-v1'

export const defaultDemoCanvasTuner = {
  enabled: true,
  /** How much of the stage peeks into the hero fold (px) */
  peekHeight: 350,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  /** Wait after intro finishes before slide-up starts (ms) */
  delayAfterIntroMs: 1400,
  /** Slide-up animation length (ms) */
  slideUpMs: 1600,
  label: 'Interactive demo canvas',
  hint: 'Placeholder for After Effects Lottie scenes.',
}

export type DemoCanvasTuner = typeof defaultDemoCanvasTuner

export function loadDemoCanvasTuner(): DemoCanvasTuner {
  try {
    const raw = localStorage.getItem(DEMO_CANVAS_STORAGE_KEY)
    if (!raw) return { ...defaultDemoCanvasTuner }
    return { ...defaultDemoCanvasTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultDemoCanvasTuner }
  }
}
