export type MediaAsset = {
  id: string
  client_id: string
  title: string
  file_url: string
  storage_path: string | null
  file_name: string | null
  tag: string
  status: string
  created_at: string
}

export type HistoryEntryKind = 'note' | 'work'

export type InfoHistoryItem = {
  id: string
  client_id: string
  title: string
  body: string
  entry_kind?: HistoryEntryKind
  created_at: string
  updated_at?: string
}

export const MEDIA_TAGS = [
  { id: 'video', label: 'Video' },
  { id: 'pdf', label: 'PDF' },
  { id: 'brand', label: 'Brand' },
  { id: 'website', label: 'Website' },
  { id: 'file', label: 'File' },
] as const

export const PORTAL_BUCKET = 'portal-assets'
