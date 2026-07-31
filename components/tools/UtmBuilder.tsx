'use client'

import { TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  buildUtmUrl,
  parseUtmPrefs,
  UTM_FIELDS,
  type UtmFieldName,
} from '@/lib/tools/utm-builder/logic'

/**
 * UTM link builder — rebuilt on the shared workspace.
 * Research brief: docs/research/utm-builder.md
 *
 * The tagged URL is the product, so it gets the whole right pane at a readable
 * size with copy alongside it. Previously it was one row of a result list below
 * the form, which is the wrong emphasis for a tool whose entire output is a
 * single string you are about to paste somewhere.
 *
 * Source, medium and the casing rule persist to localStorage, because the value
 * of a UTM scheme is that the same person tags the next campaign the same way.
 * That is also the USP: GA4 compares dimension values byte-for-byte, so
 * `Spring Sale`, `spring sale` and `spring-sale` become three separate campaigns
 * in the report. Enforcing the convention at build time is the only place the
 * problem is cheap to fix.
 *
 * All URL assembly is in logic.ts and already tested.
 */

const PREFS_KEY = 'scult-tools:utm-builder:v1'

const EMPTY_VALUES: Record<UtmFieldName, string> = {
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
}

/** Seeded so the first paint shows a real tagged URL rather than an empty box. */
const SAMPLE_URL = 'https://scult.in/tools'
const SAMPLE_VALUES: Record<UtmFieldName, string> = {
  source: 'newsletter',
  medium: 'email',
  campaign: 'spring-launch',
  term: '',
  content: '',
}

export function UtmBuilder() {
  const [url, setUrl] = useState(SAMPLE_URL)
  const [values, setValues] = useState<Record<UtmFieldName, string>>(SAMPLE_VALUES)
  const [lowercase, setLowercase] = useState(true)
  const [savedAt, setSavedAt] = useState(0)

  // Read the preset after mount, never during render: the server has no
  // localStorage, and seeding state from it would make the first client render
  // disagree with the server HTML.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY)
      if (stored === null) return
      const prefs = parseUtmPrefs(JSON.parse(stored))
      if (!prefs) return
      setValues((prev) => ({ ...prev, source: prefs.source, medium: prefs.medium }))
      setLowercase(prefs.lowercase)
    } catch {
      // Blocked storage or corrupt JSON — start from the defaults instead.
    }
  }, [])

  useEffect(() => {
    if (savedAt === 0) return
    const t = setTimeout(() => setSavedAt(0), 2500)
    return () => clearTimeout(t)
  }, [savedAt])

  const result = useMemo(
    () => buildUtmUrl({ url, ...values, lowercase }),
    [url, values, lowercase],
  )

  const trimmedUrl = url.trim()
  const isEmpty = trimmedUrl === ''
  const showResult = !isEmpty && result.error === undefined

  function setField(name: UtmFieldName, text: string): void {
    setValues((prev) => ({ ...prev, [name]: text }))
  }

  function savePreset(): void {
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({ source: values.source, medium: values.medium, lowercase }),
      )
      setSavedAt(Date.now())
    } catch {
      // Best-effort: private mode blocks writes and there is nothing to fix.
    }
  }

  function clearAll(): void {
    setUrl('')
    setValues(EMPTY_VALUES)
  }

  return (
    <ToolWorkspace
      inputLabel="Campaign details"
      outputLabel="Your tagged URL"
      minHeight="min-h-[30rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <ToolbarAction onClick={savePreset}>
                {savedAt === 0 ? 'Save source & medium' : 'Saved'}
              </ToolbarAction>
              <ToolbarAction
                onClick={() => {
                  setUrl(SAMPLE_URL)
                  setValues(SAMPLE_VALUES)
                }}
              >
                Load sample
              </ToolbarAction>
              <ToolbarAction onClick={clearAll} disabled={isEmpty}>
                Clear
              </ToolbarAction>
            </>
          }
        >
          <ToolbarGroup label="Casing">
            <SegmentButton
              active={lowercase}
              onClick={() => setLowercase(true)}
              title="Lowercase every value and turn spaces into hyphens — underscores like paid_social are kept as typed"
            >
              Enforce lowercase
            </SegmentButton>
            <SegmentButton
              active={!lowercase}
              onClick={() => setLowercase(false)}
              title="Use the values exactly as typed"
            >
              Leave as typed
            </SegmentButton>
          </ToolbarGroup>
        </ToolToolbar>
      }
      input={
        <Pane title="Campaign details">
          <div className="flex flex-col gap-5">
            <div>
              <label className="label" htmlFor="utm-url">
                Destination URL
              </label>
              {/* No behaviour hint here: query-string/fragment preservation is
                  covered by the page's How-it-works prose, and repeating it under
                  the field was clutter on every visit after the first. */}
              <input
                id="utm-url"
                className="field"
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="https://example.com/landing"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {UTM_FIELDS.map((field) => (
              <div key={field.name}>
                <label className="label" htmlFor={`utm-${field.name}`}>
                  {field.label}
                  <span className="ml-1.5 font-mono font-normal text-[12px] text-ink-subtle">
                    {field.param}
                  </span>
                  {field.required ? null : (
                    <span className="ml-1.5 font-normal text-[13px] text-ink-subtle">
                      optional
                    </span>
                  )}
                </label>
                <input
                  id={`utm-${field.name}`}
                  className="field"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => setField(field.name, e.target.value)}
                  aria-describedby={`utm-${field.name}-hint`}
                />
                <p className="hint mt-1.5" id={`utm-${field.name}-hint`}>
                  {field.hint}
                </p>
              </div>
            ))}
          </div>
        </Pane>
      }
      output={
        <Pane
          title="Your tagged URL"
          actions={showResult ? <CopyButton text={result.url} label="Copy URL" /> : null}
        >
          {isEmpty ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="max-w-[36ch] text-center text-[14px] text-ink-subtle leading-6">
                Enter a destination URL on the left — the tagged link is assembled here as
                you type.
              </p>
            </div>
          ) : result.error !== undefined ? (
            <ErrorDetail message={result.error} />
          ) : (
            <div className="flex flex-col gap-5">
              <p className="break-all rounded-card border border-ink bg-tile-lavender p-4 font-mono text-[15px] text-ink leading-6">
                {result.url}
              </p>

              <div>
                <p className="label">Parameters applied</p>
                {result.params.length === 0 ? (
                  <p className="hint">
                    None yet — fill in at least the source and medium for the link to be
                    attributable.
                  </p>
                ) : (
                  <dl className="divide-y divide-line border-line border-t">
                    {result.params.map((param) => (
                      <div
                        key={param.param}
                        className="flex items-baseline justify-between gap-4 py-2.5"
                      >
                        <dt className="font-mono text-[13px] text-ink-muted">
                          {param.param}
                        </dt>
                        <dd className="break-all text-right font-medium text-[14px] text-ink">
                          {param.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {result.warnings.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {result.warnings.map((warning) => (
                    <li
                      key={warning}
                      className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5"
                    >
                      <TriangleAlert
                        className="mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* The "Why casing matters" explainer that used to sit here was
                  removed: it restated the meta howItWorks prose AND the
                  "Should UTMs be lowercase?" FAQ, both rendered further down
                  the same page. The parameters list above already shows the
                  normalised values, which is the evidence the paragraph was
                  narrating. Its one unique fact — underscores survive
                  normalisation — moved to the casing toggle's tooltip. */}
            </div>
          )}
        </Pane>
      }
      status={
        <StatusBar
          state={isEmpty ? 'neutral' : result.error !== undefined ? 'invalid' : 'valid'}
          message={
            isEmpty
              ? 'Waiting for a URL'
              : result.error !== undefined
                ? 'URL not usable yet'
                : 'Link ready to copy'
          }
          stats={[
            { label: 'parameters', value: String(result.params.length) },
            { label: 'casing', value: lowercase ? 'normalised' : 'as typed' },
            ...(showResult
              ? [{ label: 'characters', value: String(result.url.length) }]
              : []),
          ]}
          privacyNote="Assembled in your browser — the preset stays on this device"
        />
      }
    />
  )
}
