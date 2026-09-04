export const PANEL_POS_STORAGE_KEY = 'mr-leva-panel-positions-v2'

/** Single unified dev panel (replaces v1 multi-panel stack) */
export const defaultPanelPositions = {
  dev: { x: -10, y: 60 },
}

export function loadPanelPositions() {
  try {
    const raw = localStorage.getItem(PANEL_POS_STORAGE_KEY)
    if (!raw) {
      // migrate from v1 if present
      const legacy = localStorage.getItem('mr-leva-panel-positions-v1')
      if (legacy) {
        const parsed = JSON.parse(legacy)
        if (parsed.shader) return { dev: parsed.shader }
      }
      return { ...defaultPanelPositions }
    }
    const parsed = JSON.parse(raw)
    return {
      dev: { ...defaultPanelPositions.dev, ...parsed.dev },
    }
  } catch {
    return { ...defaultPanelPositions }
  }
}

export function savePanelPosition(key, pos) {
  const current = loadPanelPositions()
  current[key] = pos
  localStorage.setItem(PANEL_POS_STORAGE_KEY, JSON.stringify(current))
}
