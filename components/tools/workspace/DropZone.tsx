'use client'

import { Upload } from 'lucide-react'
import { useId, useRef, useState } from 'react'

/**
 * Unified file input — plan §3. Shared by the favicon generator, the invoice
 * logo picker, and any future tool that takes a file.
 *
 * Keyboard and pointer paths are equivalent: the whole zone is a <label> tied to
 * a real <input type="file">, so Tab reaches it, Space/Enter opens the picker,
 * and drag-and-drop is an enhancement rather than the only way in. A div with an
 * onDrop handler and no input would be unusable without a mouse.
 *
 * Size limits are enforced here rather than in each caller, because "the file
 * silently did nothing" is the worst failure mode for a drop target.
 */
export function DropZone({
  accept,
  maxBytes,
  onFile,
  label = 'Drop a file, or choose one',
  hint,
  title,
  action,
  preview,
}: {
  accept: string
  maxBytes: number
  onFile: (file: File) => void
  label?: string
  hint?: string
  /**
   * Upload-hero variant: a bold display-face headline with the icon raised
   * onto a soft plate. When absent the zone renders exactly as it always has —
   * the invoice logo picker depends on that.
   */
  title?: string
  /** Violet call-to-action line under the hint, e.g. "Drag & drop or click to upload". */
  action?: string
  /**
   * Once a file is loaded, collapsing the full hero down to this compact row
   * keeps the drop target (and the ability to drag a replacement straight in)
   * without it dominating the page — the large "upload something" pitch has
   * nothing left to say once something is already uploaded. Takes over
   * `title`/`action`/`label` rendering entirely while present.
   */
  preview?: {
    /** Object/blob URL for the thumbnail — the caller owns its lifecycle. */
    src: string
    name: string
    meta?: string
  }
}) {
  const inputId = useId()
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function accepted(file: File): boolean {
    if (file.size > maxBytes) {
      setError(
        `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)} — try a smaller one.`,
      )
      return false
    }
    setError(null)
    return true
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    if (accepted(file)) onFile(file)
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer rounded-card border-2 border-dashed transition-colors ${
          preview
            ? 'flex-row items-center gap-3 px-3 py-2.5 text-left'
            : 'flex-col items-center justify-center gap-2 px-6 py-10 text-center'
        } ${
          dragging
            ? 'border-ink bg-violet-50'
            : 'border-line-grey bg-offwhite hover:border-ink'
        }`}
      >
        {preview ? (
          <>
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line-grey bg-cream">
              {/* biome-ignore lint/performance/noImgElement: a runtime object/blob URL thumbnail, which next/image cannot optimise. */}
              <img src={preview.src} alt="" className="size-full object-contain" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium text-[13px] text-ink">
                {preview.name}
              </span>
              {preview.meta ? <span className="hint">{preview.meta}</span> : null}
            </span>
            <span className="dropzone-accent-text flex shrink-0 items-center gap-1 font-medium text-[12px] text-violet-700">
              <Upload className="size-3.5" aria-hidden="true" />
              Change
            </span>
          </>
        ) : title ? (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-violet-50">
              <Upload className="size-6 text-violet-700" aria-hidden="true" />
            </span>
            <span className="font-display font-semibold text-[18px] text-ink">
              {title}
            </span>
            {hint ? <span className="hint">{hint}</span> : null}
            {action ? (
              <span className="dropzone-accent-text font-medium text-[14px] text-violet-700">
                {action}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <Upload
              className="dropzone-accent-text size-6 text-violet-700"
              aria-hidden="true"
            />
            <span className="font-medium text-[15px] text-ink">{label}</span>
            {hint ? <span className="hint">{hint}</span> : null}
          </>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          // The wrapping <label htmlFor> should already name this, but an
          // accessibility-tree read reported the input as unnamed — plausibly a
          // reader artefact of the sr-only input, plausibly not. An explicit
          // aria-label costs nothing and removes the ambiguity either way.
          aria-label={
            preview
              ? `Change uploaded file — currently ${preview.name}`
              : (title ?? label)
          }
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            handleFiles(e.target.files)
            // Reset so re-picking the same file still fires a change event.
            e.target.value = ''
          }}
        />
      </label>
      {error ? (
        <p id={errorId} className="mt-2 font-medium text-[13px] text-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}
