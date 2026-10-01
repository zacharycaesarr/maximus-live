import { useState } from 'react'

type Schema = Record<string, unknown>
type Input = { type?: string; schema?: Schema; value?: unknown; min?: number; max?: number; options?: unknown[] | Record<string, unknown>; onChange?: unknown; transient?: boolean }

/**
 * Production reads the same persisted schemas without mounting Leva's editor,
 * plugin registry, stores, subscriptions, or global panel. Vite selects this
 * module only for a build. Development still uses the real, fully editable Leva.
 * This deliberately supports only the scalar controls used by this homepage.
 */
export function folder(schema: Schema) { return { type: 'FOLDER', schema } }
export function button(_callback: unknown) { return { type: 'BUTTON' } }
export const LevaInputs = { STRING: 'STRING' }

function readSchema(schema: Schema, values: Record<string, unknown> = {}) {
  for (const [key, raw] of Object.entries(schema)) {
    if (raw && typeof raw === 'object') {
      const input = raw as Input
      if (input.type === 'FOLDER' && input.schema) { readSchema(input.schema, values); continue }
      if (input.type === 'BUTTON') continue
      // Match Leva's transient onChange inputs, including the beacon controls.
      if (input.onChange && input.transient !== false) continue
      let value = input.value
      if (typeof value === 'number') value = Math.max(input.min ?? -Infinity, Math.min(input.max ?? Infinity, value))
      if (input.options) {
        const options = Array.isArray(input.options) ? input.options : Object.values(input.options)
        if (!options.includes(value)) value = options[0]
      }
      values[key] = normalizeString(value)
    } else values[key] = normalizeString(raw)
  }
  return values
}

function normalizeString(value: unknown) {
  // Leva canonicalizes hex colors; several theme fallbacks compare these strings.
  return typeof value === 'string' && /^#[\da-f]{3,8}$/i.test(value) ? value.toLowerCase() : value
}

export function useControls(schemaOrName: Schema | string, schemaOrSettings?: Schema, _settings?: unknown) {
  // The existing homepage hooks register their schema once, with no deps.
  // Preserve that lifetime and return one stable object rather than subscribing.
  const [values] = useState(() => readSchema(typeof schemaOrName === 'string' ? schemaOrSettings! : schemaOrName))
  return values
}

const emptyStore = { getData: () => ({}), useStore: { subscribe: () => () => undefined } }
export const levaStore = emptyStore
export function useCreateStore() { return emptyStore }
export function LevaPanel() { return null }
