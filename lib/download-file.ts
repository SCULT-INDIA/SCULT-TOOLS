/**
 * Triggers a browser download of a text file — no server round-trip, since
 * every report this site generates (speed test, AI visibility) is already
 * sitting in client state by the time someone wants to export it.
 *
 * A Blob + object URL + a synthetic `<a download>` click is the standard,
 * dependency-free way to do this; the URL is revoked immediately after the
 * click so it doesn't linger in memory.
 */
export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/markdown;charset=utf-8',
): void {
  downloadBlob(filename, new Blob([content], { type: mimeType }))
}

/** Same mechanism as `downloadTextFile`, for binary content (a generated
 * .zip) — the Blob constructor accepts a `BlobPart`, so a `Uint8Array` works
 * identically to a string, just with a binary MIME type. */
export function downloadBinaryFile(
  filename: string,
  bytes: Uint8Array<ArrayBuffer>,
  mimeType: string,
): void {
  downloadBlob(filename, new Blob([bytes], { type: mimeType }))
}

function downloadBlob(filename: string, blob: Blob): void {
  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // A browser blocking programmatic downloads is rare and unrecoverable
    // from here — the report is still fully visible and copyable on screen.
  }
}

/** A safe, readable filename fragment from an arbitrary URL — strips the
 * scheme, trailing slash, and anything that isn't filename-safe. */
export function slugifyUrlForFilename(url: string): string {
  const stripped = url.replace(/^https?:\/\//i, '').replace(/\/+$/, '')
  const safe = stripped.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-')
  return safe.length > 0 ? safe : 'report'
}
