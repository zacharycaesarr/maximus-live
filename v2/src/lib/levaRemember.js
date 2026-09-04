/** Snapshot helpers for Leva "remember / revert" actions. */
export function makeRememberActions({
  storageKey,
  getFlat,
  label = 'values',
}) {
  const rememberKey = `${storageKey}:remember`
  return {
    [`Remember ${label}`]: () => {
      try {
        localStorage.setItem(rememberKey, JSON.stringify(getFlat()))
      } catch {
        /* ignore */
      }
    },
    [`Revert to remembered`]: () => {
      try {
        const raw = localStorage.getItem(rememberKey)
        if (!raw) return
        localStorage.setItem(storageKey, raw)
        window.location.reload()
      } catch {
        /* ignore */
      }
    },
  }
}
