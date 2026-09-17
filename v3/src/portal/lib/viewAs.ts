const VIEW_AS_KEY = 'mr-v3-portal-view-as'

export type ViewAsClient = {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
}

export function getViewAsClient(): ViewAsClient | null {
  try {
    const raw = sessionStorage.getItem(VIEW_AS_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ViewAsClient
  } catch {
    return null
  }
}

export function setViewAsClient(client: ViewAsClient | null) {
  try {
    if (!client) sessionStorage.removeItem(VIEW_AS_KEY)
    else sessionStorage.setItem(VIEW_AS_KEY, JSON.stringify(client))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('mr-portal-view-as'))
}
