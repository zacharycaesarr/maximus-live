import { useEffect } from 'react'
import { levaStore } from 'leva'

const STORAGE_KEY = 'mr-v3-services-lab-cards-v1'
const CARD_FOLDERS = ['01 · Web Development', '02 · Ad Management', '03 · Creative Studio']
type SavedValue = string | number | boolean
type SavedValues = Record<string, SavedValue>

function readSaved(): SavedValues {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as SavedValues : {}
  } catch {
    return {}
  }
}

const savedAtStartup = typeof window === 'undefined' ? {} : readSaved()

/** Apply saved values before Leva registers controls, so reload never flashes defaults. */
export function persistedSchema<T extends Record<string, unknown>>(folderName: string, schema: T): T {
  function visit(entries: Record<string, unknown>, path: string): Record<string, unknown> {
    return Object.fromEntries(Object.entries(entries).map(([key, input]) => {
      const fullPath = `${path}.${key}`
      if (input && typeof input === 'object' && !Array.isArray(input)) {
        const item = input as Record<string, unknown>
        if (item.type === 'FOLDER' && item.schema && typeof item.schema === 'object') {
          return [key, { ...item, schema: visit(item.schema as Record<string, unknown>, fullPath) }]
        }
        if ('value' in item) {
          const saved = savedAtStartup[fullPath]
          if (typeof saved === typeof item.value && ['string', 'number', 'boolean'].includes(typeof saved)) {
            return [key, { ...item, value: saved }]
          }
        }
      }
      return [key, input]
    }))
  }
  return visit(schema, folderName) as T
}

/** Keep every card's editable Leva values in this browser across reloads. */
export function usePersistTuners() {
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    let pending: number | undefined
    function save() {
      const next: SavedValues = {}
      for (const [path, input] of Object.entries(levaStore.getData())) {
        if (!CARD_FOLDERS.some(folder => path.startsWith(`${folder}.`))) continue
        if (!('value' in input)) continue
        const value = input.value
        if (typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) {
          next[path] = value
        }
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
    }
    function scheduleSave() {
      window.clearTimeout(pending)
      pending = window.setTimeout(save, 250)
    }
    function flush() {
      window.clearTimeout(pending)
      save()
    }
    const unsubscribe = levaStore.useStore.subscribe(scheduleSave)
    window.addEventListener('pagehide', flush)
    return () => {
      unsubscribe()
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [])
}
