import { getSupabase } from '@/lib/supabase'
import { PORTAL_BUCKET, type MediaAsset } from '@/portal/lib/mediaTypes'

function normalizeRow(row: Record<string, unknown>): MediaAsset {
  return {
    id: String(row.id),
    client_id: String(row.client_id),
    title: String(row.title),
    file_url: String(row.file_url),
    storage_path: row.storage_path ? String(row.storage_path) : String(row.file_url),
    file_name: row.file_name ? String(row.file_name) : null,
    tag: row.tag ? String(row.tag) : 'file',
    status: String(row.status ?? 'ready'),
    created_at: String(row.created_at),
  }
}

export async function listMediaForClient(clientId: string): Promise<MediaAsset[]> {
  const client = getSupabase()
  const full =
    'id, client_id, title, file_url, storage_path, file_name, tag, status, created_at'
  const res = await client
    .from('media_assets')
    .select(full)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (res.error) {
    const fallback = await client
      .from('media_assets')
      .select('id, client_id, title, file_url, status, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (fallback.error) throw fallback.error
    return ((fallback.data ?? []) as Record<string, unknown>[]).map(normalizeRow)
  }

  return ((res.data ?? []) as Record<string, unknown>[]).map(normalizeRow)
}

function triggerBlobDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

/**
 * Force a real file download (does not open PDFs in a browser tab).
 * Uses a signed URL, then saves the bytes as a file on their computer.
 */
export async function downloadMediaAsset(asset: MediaAsset) {
  const client = getSupabase()
  const path = asset.storage_path || asset.file_url
  if (!path) throw new Error('Missing file path')

  const fileName = asset.file_name || asset.title || 'download'

  let fileUrl = path
  if (!/^https?:\/\//i.test(path)) {
    const { data, error } = await client.storage.from(PORTAL_BUCKET).createSignedUrl(path, 120, {
      download: fileName,
    })
    if (error) throw error
    if (!data?.signedUrl) throw new Error('Could not create download link')
    fileUrl = data.signedUrl
  }

  const res = await fetch(fileUrl)
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  triggerBlobDownload(blob, fileName)
}

export async function uploadMediaForClient(opts: {
  clientId: string
  file: File
  title: string
  tag: string
}) {
  const client = getSupabase()
  const safeName = opts.file.name.replace(/[^\w.\-]+/g, '_')
  const storagePath = `${opts.clientId}/${crypto.randomUUID()}-${safeName}`

  const { error: upErr } = await client.storage.from(PORTAL_BUCKET).upload(storagePath, opts.file, {
    upsert: false,
    contentType: opts.file.type || undefined,
  })
  if (upErr) throw upErr

  const { data, error } = await client
    .from('media_assets')
    .insert({
      client_id: opts.clientId,
      title: opts.title.trim() || opts.file.name,
      file_url: storagePath,
      storage_path: storagePath,
      file_name: opts.file.name,
      tag: opts.tag || 'file',
      status: 'ready',
    })
    .select('id, client_id, title, file_url, storage_path, file_name, tag, status, created_at')
    .single()

  if (error) {
    await client.storage.from(PORTAL_BUCKET).remove([storagePath])
    throw error
  }

  return normalizeRow(data as Record<string, unknown>)
}

export async function deleteMediaAsset(asset: MediaAsset) {
  const client = getSupabase()
  const path = asset.storage_path || asset.file_url
  if (path && !/^https?:\/\//i.test(path)) {
    await client.storage.from(PORTAL_BUCKET).remove([path])
  }
  const { error } = await client.from('media_assets').delete().eq('id', asset.id)
  if (error) throw error
}
