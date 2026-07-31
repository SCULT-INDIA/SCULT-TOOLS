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
}: {
  accept: string
  maxBytes: number
  onFile: (file: File) => void
  label?: string
  hint?: string
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
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? 'border-ink bg-violet-50'
            : 'border-line-grey bg-offwhite hover:border-ink'
        }`}
      >
        <Upload className="size-6 text-violet-700" aria-hidden="true" />
        <span className="font-medium text-[15px] text-ink">{label}</span>
        {hint ? <span className="hint">{hint}</span> : null}
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
          aria-label={label}
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
