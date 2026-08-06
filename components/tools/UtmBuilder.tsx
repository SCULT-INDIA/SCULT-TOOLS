'use client'

import { Check, Lightbulb, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  Pane,
  ScoreRing,
  SegmentButton,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  buildUtmUrl,
  computeQualityScore,
  parseUtmPrefs,
  UTM_FIELDS,
  type UtmFieldName,
  type UtmFieldSpec,
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
  campaignId: '',
  term: '',
  content: '',
}

/** Seeded so the first paint shows a real tagged URL rather than an empty box. */
const SAMPLE_URL = 'https://scult.in/tools'
const SAMPLE_VALUES: Record<UtmFieldName, string> = {
  source: 'newsletter',
  medium: 'email',
  campaign: 'spring-launch',
  campaignId: '',
  term: '',
  content: '',
}

const MAIN_FIELDS = UTM_FIELDS.filter((field) => !field.advanced)
const ADVANCED_FIELDS = UTM_FIELDS.filter((field) => field.advanced)

/** Short chip labels for the GA4 preview — the field list's own labels ("Campaign
 * source") are written for the form, not a compact dimension-value readout. */
const GA4_PREVIEW_LABEL: Record<UtmFieldName, string> = {
  source: 'Source',
  medium: 'Medium',
  campaign: 'Campaign',
  campaignId: 'Campaign ID',
  term: 'Term',
  content: 'Content',
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
  const quality = useMemo(() => computeQualityScore(result), [result])

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
    <div className="flex flex-col gap-4">
      <ToolWorkspace
        inputLabel="Campaign details"
        outputLabel="Your tagged URL"
        minHeight="min-h-[30rem]"
        toolbar={
          <>
            <ToolToolbar>
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

            {/* Every page-level action button (Load sample, Clear, the two
                Quick-actions placeholders, and the save-preset action) lives
                in one evenly-spaced grid here, directly under the toolbar —
                see SchemaMarkupGenerator.tsx/FaqSchemaGenerator.tsx for the
                identical idiom. The old bottom action bar's "Reset" and
                "Save Template" buttons called the exact same handlers as
                "Clear" and "Save source & medium" here, so those were
                duplicates and were removed rather than kept twice. "Save
                source & medium" is the tool's actual USP (see the file
                docblock — a UTM scheme is only useful if the same person
                tags every campaign the same way), so it gets the primary
                cta-yellow treatment and the trailing span so a 5-button grid
                doesn't leave a lonely half-empty row on mobile. */}
            <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-5">
              <button
                type="button"
                onClick={() => {
                  setUrl(SAMPLE_URL)
                  setValues(SAMPLE_VALUES)
                }}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                Load sample
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={isEmpty}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  /* No QR generation exists yet — this is a placeholder affordance. */
                }}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                QR Code
              </button>
              <button
                type="button"
                onClick={() => {
                  /* No link-shortening service exists yet — this is a placeholder affordance. */
                }}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                Short Link
              </button>
              <button
                type="button"
                onClick={savePreset}
                className="btn-brutal btn-brutal-sm col-span-2 w-full sm:col-span-1"
              >
                {savedAt === 0 ? 'Save source & medium' : 'Saved'}
              </button>
            </div>
          </>
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

              {MAIN_FIELDS.map((field) => (
                <UtmFieldInput
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  onChange={(text) => setField(field.name, text)}
                />
              ))}

              {/* Native <details>: keyboard-operable with no ARIA of its own,
                  matching the "Show the maths" pattern used elsewhere on the
                  site for optional, rarely-needed detail. */}
              <details className="rounded-card border border-line-grey bg-offwhite p-4">
                <summary className="cursor-pointer font-display font-semibold text-[16px] text-ink">
                  Advanced options
                </summary>
                <div className="mt-4 flex flex-col gap-5">
                  {ADVANCED_FIELDS.map((field) => (
                    <UtmFieldInput
                      key={field.name}
                      field={field}
                      value={values[field.name]}
                      onChange={(text) => setField(field.name, text)}
                    />
                  ))}
                </div>
              </details>
            </div>
          </Pane>
        }
        output={
          <Pane
            title="Your tagged URL"
            actions={
              showResult ? <CopyButton text={result.url} label="Copy URL" /> : null
            }
          >
            {isEmpty ? (
              <div className="flex h-full items-center justify-center p-6">
                <p className="max-w-[36ch] text-center text-[14px] text-ink-subtle leading-6">
                  Enter a destination URL on the left — the tagged link is assembled here
                  as you type.
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

                <div>
                  <p className="label">GA4 preview</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {MAIN_FIELDS.map((field) => {
                      const applied = result.params.find((p) => p.param === field.param)
                      return (
                        <div
                          key={field.name}
                          className="rounded-sm border border-line-grey bg-cream p-2.5"
                        >
                          <p className="font-medium text-[11px] text-ink-subtle uppercase tracking-[0.06em]">
                            {GA4_PREVIEW_LABEL[field.name]}
                          </p>
                          <p
                            className={`truncate font-mono text-[13px] ${applied ? 'text-ink' : 'text-ink-subtle italic'}`}
                          >
                            {applied?.value ?? '(not set)'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-card border border-line-grey bg-cream p-4">
                  <p className="label">Quality score</p>
                  <div className="mt-2 flex flex-wrap items-center gap-5">
                    <ScoreRing value={quality.score} label="out of 100" />
                    <ul className="flex flex-1 flex-col gap-2">
                      {quality.checks.map((check) => (
                        <li key={check.id} className="flex items-start gap-2 text-[13px]">
                          {check.pass ? (
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-green"
                              aria-hidden="true"
                            />
                          ) : (
                            <TriangleAlert
                              className="mt-0.5 size-4 shrink-0 text-ink"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={
                              check.pass ? 'text-ink-muted' : 'font-medium text-ink'
                            }
                          >
                            {check.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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

      {/* The old bottom bar's "Reset" and "Save Template" buttons duplicated
          "Clear" and "Save source & medium" in the top grid and were removed
          with it (see the toolbar's comment above); only this informational
          tip — not an action button — belongs here. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <div className="flex items-start gap-2 bg-tile-yellow p-4 text-[13px] text-ink-body leading-5">
          <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">Pro tip:</span> save your source and medium as
            a template so every campaign link follows the same GA4 naming convention.
          </p>
        </div>
      </div>
    </div>
  )
}

function UtmFieldInput({
  field,
  value,
  onChange,
}: {
  field: UtmFieldSpec
  value: string
  onChange: (text: string) => void
}) {
  return (
    <div>
      <label className="label" htmlFor={`utm-${field.name}`}>
        {field.label}
        <span className="ml-1.5 font-mono font-normal text-[12px] text-ink-subtle">
          {field.param}
        </span>
        {field.required ? null : (
          <span className="ml-1.5 font-normal text-[13px] text-ink-subtle">optional</span>
        )}
      </label>
      <input
        id={`utm-${field.name}`}
        className="field"
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`utm-${field.name}-hint`}
      />
      <p className="hint mt-1.5" id={`utm-${field.name}-hint`}>
        {field.hint}
      </p>
    </div>
  )
}
