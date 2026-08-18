'use client'

import { Check, Copy, SlidersHorizontal } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { trackPromptEvent } from '@/lib/analytics'
import type { PromptVariable } from '@/lib/prompts/types'

/**
 * The prompt itself, styled as a dark editor card so it reads as "this is
 * the artifact you came for" — fixed near-black surface with a violet cast,
 * identical in light and dark themes (same convention as the site's other
 * dark panels and brand elements, which never adapt per theme).
 *
 * Variables ship PRE-FILLED with each variable's example value — the visitor
 * sees a complete, copyable prompt immediately instead of a form standing
 * between them and the content. Substituted values are highlighted in the
 * brand yellow so it's obvious what to personalize. The "Customize" panel
 * beside it lets them swap in their own details, live-updating both the
 * highlights and what the copy button copies.
 *
 * This renders inside a full-bleed section in `PromptDetailShell` (not the
 * article's normal ~50rem reading column) — a split-pane editor+form needs
 * real width, unlike the surrounding prose, so that breakout is the parent's
 * job and this component just fills whatever width it's given.
 *
 * Copy feedback is an inline label flip ("Copy" → "Copied!" for ~2s), plus
 * an `aria-live="polite"` announcement — a label-only change is silent to
 * screen readers.
 *
 * Layout: prompt on the left, customize fields on the right, from `lg` up —
 * a fixed-width side panel next to flexible content, per the site's
 * side-panel convention for "edit details while keeping the main content
 * visible" (see the equivalent card layout on `/security`, `/privacy`).
 * Below `lg` the same two blocks simply stack (source order already puts
 * the prompt first), which is deliberately NOT a collapsed disclosure any
 * more: on a "copy this and go" utility scanned across many prompts, an
 * always-visible panel is one glance instead of one extra tap, and the
 * variable count here is small enough (typically 1-5 fields) that it never
 * costs the scroll depth a long form would. A prompt with zero variables
 * renders no panel at all rather than an empty one.
 *
 * The panel is `sticky` on `lg` so it stays reachable while a long prompt
 * scrolls inside its own `<pre>` — offset by `top-28` (7rem), the same
 * clearance `app/layout.tsx` already uses site-wide to clear the sticky
 * header, not a value invented for this component. `self-start` stops the
 * grid from stretching it to match the editor's height, which would
 * otherwise cancel the sticky positioning by making both columns equally
 * tall.
 */

/** promptText split into literal text and variable slots, in order. */
type Segment = { kind: 'text'; text: string } | { kind: 'var'; name: string }

function segment(promptText: string, variables: readonly PromptVariable[]): Segment[] {
  if (variables.length === 0) return [{ kind: 'text', text: promptText }]
  const names = variables.map((v) => v.name).join('|')
  const pattern = new RegExp(`\\{\\{(${names})\\}\\}`, 'g')
  const segments: Segment[] = []
  let last = 0
  for (const match of promptText.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) segments.push({ kind: 'text', text: promptText.slice(last, index) })
    const name = match[1]
    if (name) segments.push({ kind: 'var', name })
    last = index + match[0].length
  }
  if (last < promptText.length)
    segments.push({ kind: 'text', text: promptText.slice(last) })
  return segments
}

export function PromptCopyBlock({
  category,
  promptSlug,
  promptText,
  variables,
}: {
  category: string
  promptSlug: string
  promptText: string
  variables: readonly PromptVariable[]
}) {
  // Defaults are the example values — the prompt is complete on first paint.
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(variables.map((v) => [v.name, v.example])),
  )
  const [copied, setCopied] = useState(false)

  const segments = useMemo(() => segment(promptText, variables), [promptText, variables])

  const resolved = (name: string) => {
    const value = values[name]?.trim()
    if (value) return value
    const example = variables.find((v) => v.name === name)?.example
    return example ?? `{{${name}}}`
  }

  // Deliberately not memoized: it's a handful of string concatenations per
  // keystroke, and memoizing it correctly would mean threading `resolved`
  // through dependency arrays for zero measurable win.
  const filledText = segments
    .map((s) => (s.kind === 'text' ? s.text : resolved(s.name)))
    .join('')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(filledText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      // `customized`, not the actual values — never send what someone typed
      // into a variable field, only whether they changed anything from the
      // pre-filled example.
      const customized = variables.some(
        (v) => (values[v.name]?.trim() || v.example) !== v.example,
      )
      trackPromptEvent(category, promptSlug, 'copy_prompt', { customized })
    } catch {
      // Clipboard API can fail (permissions, insecure context) — the text
      // is still fully selectable/visible below, so nothing is truly lost.
    }
  }

  const hasFields = variables.length > 0

  return (
    <div
      className={
        hasFields
          ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8'
          : undefined
      }
    >
      {/* Editor card — fixed dark surface, identical in both themes. */}
      <div className="overflow-hidden rounded-panel border border-ink shadow-brutal-sm">
        <div className="flex items-center justify-between gap-3 border-[#2c2743] border-b bg-[#191527] px-4 py-2.5">
          <span className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-cta" />
            <span className="size-2.5 rounded-full bg-green" />
            <span className="ml-2 font-bold font-mono text-[11px] text-white/50 uppercase tracking-[0.18em]">
              Prompt
            </span>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex min-h-[36px] items-center gap-1.5 rounded-pill border border-ink bg-cta px-4 py-1 font-medium text-[13px] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-white hover:shadow-none"
          >
            {copied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? 'Copied!' : 'Copy prompt'}
          </button>
        </div>

        <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap bg-[#131020] p-6 font-mono text-[14px] text-[#e8e5f5] leading-[1.8]">
          {segments.map((s, i) =>
            s.kind === 'text' ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: static segmentation, order never changes
              <Fragment key={i}>{s.text}</Fragment>
            ) : (
              <mark
                // biome-ignore lint/suspicious/noArrayIndexKey: static segmentation, order never changes
                key={i}
                className="rounded-[4px] bg-[#fac44b1f] px-1 py-0.5 font-medium text-cta"
              >
                {resolved(s.name)}
              </mark>
            ),
          )}
        </pre>
      </div>

      {hasFields ? (
        <div className="mt-6 overflow-hidden rounded-panel border border-line-grey bg-offwhite lg:sticky lg:top-28 lg:mt-0 lg:self-start">
          {/* Violet header strip — same icon-badge language as "Why this
              works" below, so this reads as part of the same design system
              rather than a bolted-on form. */}
          <div className="border-line-grey border-b bg-violet-50 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-violet-700">
                <SlidersHorizontal className="size-4 text-white" aria-hidden="true" />
              </span>
              <h3 className="font-display font-semibold text-[16px] text-black tracking-normal">
                Customize the{' '}
                <span className="underline decoration-[3px] decoration-cta underline-offset-2">
                  highlighted
                </span>{' '}
                details
              </h3>
            </div>
            <p className="mt-2 pl-11 text-[12.5px] text-black/70 leading-5">
              Optional — the prompt already works with the examples shown.
            </p>
          </div>
          <div className="flex flex-col gap-5 p-6">
            {variables.map((variable) => (
              <div key={variable.name}>
                <label className="label" htmlFor={`var-${variable.name}`}>
                  {variable.description}
                  {variable.required ? null : (
                    <span className="font-normal text-[13px] text-ink-subtle">
                      {' '}
                      · optional
                    </span>
                  )}
                </label>
                <input
                  id={`var-${variable.name}`}
                  type="text"
                  className="field"
                  placeholder={variable.example}
                  value={values[variable.name] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [variable.name]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {copied ? 'Prompt copied to clipboard' : ''}
      </p>
    </div>
  )
}
