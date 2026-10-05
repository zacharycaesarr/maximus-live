export type AboutMetric = { value: number | null; suffix: string; label: string }

export function getAboutMetrics(clientCount: string): AboutMetric[] {
  const count = /^\d+$/.test(clientCount.trim()) ? Number(clientCount) : null
  return [
    { value: 120, suffix: '+', label: 'Projects completed' },
    { value: 11, suffix: '', label: 'Years building' },
    { value: count !== null && Number.isSafeInteger(count) ? count : null, suffix: '', label: 'Clients served' },
    { value: 14, suffix: '', label: 'Systems launched' },
  ]
}
