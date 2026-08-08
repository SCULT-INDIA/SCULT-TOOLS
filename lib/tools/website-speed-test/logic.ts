/**
 * Website speed test — pure domain logic.
 *
 * Purpose
 *   Everything the speed test computes that is not I/O: URL validation with
 *   SSRF guards, classification of metrics against Google's published Core Web
 *   Vitals thresholds, trimming Google's multi-megabyte PageSpeed Insights v5
 *   response down to the compact payload the client actually renders, and the
 *   ms/s formatting rules.
 *
 * Inputs   untrusted strings (user URLs, localStorage), untrusted JSON (the
 *          PSI response, our own API's response re-read on the client).
 * Outputs  typed result objects. Invalid input NEVER throws — every parser
 *          returns `undefined` or an `error` string instead, because half-typed
 *          input and malformed upstream JSON are normal cases, not exceptions.
 * Failure  surfaced as `error` strings written for end users, or `undefined`
 *          from the narrowing parsers.
 *
 * No React, no DOM, no fetch — unit-tested in logic.test.ts.
 */

export type Strategy = 'mobile' | 'desktop'

export type MetricId = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TBT'

export type MetricCategory = 'good' | 'needs-improvement' | 'poor'

/** Where the primary Core Web Vitals numbers came from. */
export type FieldSource = 'page' | 'origin' | 'none'

export interface MetricReading {
  readonly id: MetricId
  readonly label: string
  /** ms for time metrics, unitless for CLS. */
  readonly value: number
  readonly display: string
  readonly category: MetricCategory
}

export interface Opportunity {
  readonly id: string
  readonly title: string
  readonly savingsMs: number
  readonly savingsDisplay: string
  readonly description: string
}

/**
 * One third party's cost on this load — Lighthouse's `third-parties-insight`
 * audit, trimmed to the one figure worth ranking on. See `extractThirdParty`
 * for why that figure is main-thread time, and for the audit's former id.
 */
export interface ThirdPartyEntry {
  readonly name: string
  readonly mainThreadMs: number
  readonly mainThreadDisplay: string
  readonly transferSize: number
  readonly transferDisplay: string
}

/**
 * One resource-type row from Lighthouse's `resource-summary` audit (Script,
 * Image, Stylesheet, Font, Document, Other — never the `third-party`/`total`
 * aggregate rows, which are overlaps of the others, not distinct categories).
 */
export interface ResourceBreakdownEntry {
  readonly resourceType: string
  readonly label: string
  readonly requestCount: number
  readonly transferSize: number
  readonly transferDisplay: string
}

/** The compact payload our Route Handler ships to the client. */
export interface SpeedTestPayload {
  readonly finalUrl: string
  readonly strategy: Strategy
  /** Lighthouse performance score 0-100, or null when the run produced none. */
  readonly score: number | null
  readonly lab: readonly MetricReading[]
  /** CrUX real-user readings; empty when the page has too little traffic. */
  readonly field: readonly MetricReading[]
  readonly fieldSource: FieldSource
  readonly opportunities: readonly Opportunity[]
  /** Top third parties by main-thread cost; empty when none had measurable cost. */
  readonly thirdParty: readonly ThirdPartyEntry[]
  /** Transfer size per resource type; empty when the audit did not run. */
  readonly resourceBreakdown: readonly ResourceBreakdownEntry[]
  /** Backend time-to-first-byte in ms — a diagnostic, not a Core Web Vital. */
  readonly serverResponseMs: number | null
}

export type SpeedTestErrorCode =
  | 'invalid-url'
  | 'blocked-url'
  | 'unreachable'
  | 'quota'
  | 'timeout'
  | 'upstream'
  | 'rate-limited'

export interface SpeedTestApiError {
  readonly code: SpeedTestErrorCode
  readonly error: string
}

// ---------------------------------------------------------------------------
// Metric classification — Google's published thresholds, boundary-inclusive.
// ---------------------------------------------------------------------------

export interface MetricThresholds {
  /** Values <= good are "good" (Google's boundaries are inclusive: 2.5s LCP passes). */
  readonly good: number
  /** Values <= poor (but > good) are "needs improvement"; above is "poor". */
  readonly poor: number
}

/**
 * LCP/INP/CLS are the three Core Web Vitals thresholds Google assesses at the
 * 75th percentile. FCP and TBT are lab-diagnostic thresholds from Lighthouse.
 * Time metrics are in milliseconds; CLS is unitless.
 */
export const METRIC_THRESHOLDS: Record<MetricId, MetricThresholds> = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TBT: { good: 200, poor: 600 },
}

export const METRIC_LABELS: Record<MetricId, string> = {
  LCP: 'Largest Contentful Paint',
  INP: 'Interaction to Next Paint',
  CLS: 'Cumulative Layout Shift',
  FCP: 'First Contentful Paint',
  TBT: 'Total Blocking Time',
}

/**
 * Classifies a metric value against Google's thresholds. Boundary-inclusive on
 * the good side, exactly as Google documents it: an LCP of exactly 2.5s is
 * Good, exactly 4.0s is Needs improvement, and 4.001s is Poor.
 */
export function classifyMetric(id: MetricId, value: number): MetricCategory {
  // A non-finite value should have been filtered by the parser; classify it as
  // poor rather than throwing so a bug upstream degrades instead of crashing.
  if (!Number.isFinite(value)) return 'poor'
  const t = METRIC_THRESHOLDS[id]
  if (value <= t.good) return 'good'
  if (value <= t.poor) return 'needs-improvement'
  return 'poor'
}

/** Lighthouse's own score bands: >=90 Good, 50-89 Needs improvement, <50 Poor. */
export function categoryForScore(score: number): MetricCategory {
  if (score >= 90) return 'good'
  if (score >= 50) return 'needs-improvement'
  return 'poor'
}

export function labelForCategory(category: MetricCategory): string {
  if (category === 'good') return 'Good'
  if (category === 'needs-improvement') return 'Needs improvement'
  return 'Poor'
}

export function labelForScore(score: number): string {
  return labelForCategory(categoryForScore(score))
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Paint metrics read naturally in seconds ("2.4 s"), blocking/interaction
 * metrics in whole milliseconds ("240 ms"), and CLS is a unitless score with
 * two decimals (three below 0.01 so a small-but-real shift is not shown as 0).
 */
export function formatMetricValue(id: MetricId, value: number): string {
  if (!Number.isFinite(value) || value < 0) return '—'
  if (id === 'CLS') {
    if (value === 0) return '0'
    return value < 0.01 ? value.toFixed(3) : value.toFixed(2)
  }
  if (id === 'LCP' || id === 'FCP') return `${(value / 1000).toFixed(1)} s`
  return `${Math.round(value)} ms`
}

/** Estimated-savings figures: sub-second in ms, otherwise seconds to 1 decimal. */
export function formatSavings(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return ''
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`
}

/**
 * Byte counts (third-party transfer size, resource-summary rows) as whole KB.
 * PSI reports these in bytes; nobody reads "45000 B" as a page-weight figure.
 */
export function formatTransferSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'
  return `${Math.round(bytes / 1024)} KB`
}

/**
 * Server response time (TTFB), ms below a second and seconds above — the same
 * ms/s convention `formatMetricValue` uses for TBT/INP-style readings. Kept
 * separate rather than folded into `formatMetricValue` because TTFB is not a
 * `MetricId`: it has no Google-published Good/Poor band, so it never goes
 * through `classifyMetric`, and 0 ms is a real (excellent) reading rather than
 * "nothing to show" — unlike `formatSavings`, which treats 0 as absent.
 */
export function formatServerResponseTime(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`
}

function buildReading(id: MetricId, value: number): MetricReading {
  return {
    id,
    label: METRIC_LABELS[id],
    value,
    display: formatMetricValue(id, value),
    category: classifyMetric(id, value),
  }
}

// ---------------------------------------------------------------------------
// URL validation + SSRF guards
// ---------------------------------------------------------------------------

export interface UrlValidation {
  /** The normalised URL to test, absent when `error` is set. */
  readonly url?: string
  readonly error?: string
}

const MAX_URL_LENGTH = 2000

/** Matches a real scheme prefix (`https://`), not a bare `host:port`. */
const HAS_SCHEME = /^[a-z][a-z\d+\-.]*:\/\//i

/** Hostname suffixes that are never publicly resolvable. */
const BLOCKED_HOST_SUFFIXES = ['.localhost', '.local', '.internal', '.home.arpa']

const PRIVATE_NETWORK_ERROR =
  'That address is on a private network. Only pages reachable from the public internet can be tested.'

function parseIpv4(host: string): readonly [number, number, number, number] | undefined {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host)
  if (!m) return undefined
  const a = Number(m[1])
  const b = Number(m[2])
  const c = Number(m[3])
  const d = Number(m[4])
  if (a > 255 || b > 255 || c > 255 || d > 255) return undefined
  return [a, b, c, d]
}

function isPrivateIpv4(parts: readonly [number, number, number, number]): boolean {
  const [a, b] = parts
  if (a === 0 || a === 10 || a === 127) return true // "this" network, RFC1918, loopback
  if (a === 100 && b >= 64 && b <= 127) return true // CGNAT 100.64/10
  if (a === 169 && b === 254) return true // link-local
  if (a === 172 && b >= 16 && b <= 31) return true // RFC1918 172.16/12
  if (a === 192 && b === 168) return true // RFC1918
  if (a >= 224) return true // multicast, reserved, broadcast
  return false
}

function isPrivateIpv6(address: string): boolean {
  const ip = address.split('%')[0] ?? address
  if (ip === '::' || ip === '::1') return true // unspecified, loopback
  if (ip.startsWith('fc') || ip.startsWith('fd')) return true // ULA fc00::/7
  if (/^fe[89ab]/.test(ip)) return true // link-local fe80::/10
  // IPv4-mapped/translated addresses embed a v4 address — judge that instead.
  const mapped = /(\d{1,3}(?:\.\d{1,3}){3})$/.exec(ip)
  const dotted = mapped?.[1]
  if (dotted !== undefined) {
    const parts = parseIpv4(dotted)
    return parts ? isPrivateIpv4(parts) : true
  }
  // Hex-form mapped v4 (::ffff:7f00:1) — refuse rather than decode.
  if (ip.startsWith('::ffff:')) return true
  return false
}

/**
 * True when an IP address string (IPv4 dotted or IPv6, brackets tolerated)
 * points into loopback, private, link-local, CGNAT, ULA or reserved space.
 * Anything unparseable is treated as private — refuse rather than guess.
 */
export function isPrivateAddress(address: string): boolean {
  const addr = address
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, '')
  if (addr === '') return true
  if (addr.includes(':')) return isPrivateIpv6(addr)
  const parts = parseIpv4(addr)
  return parts ? isPrivateIpv4(parts) : true
}

/** True when a URL hostname is an IP literal rather than a DNS name. */
export function isIpLiteralHost(host: string): boolean {
  return host.startsWith('[') || parseIpv4(host) !== undefined
}

/**
 * Validates and normalises a user-entered URL for testing.
 *
 * PSI does the actual page fetch, but this endpoint still refuses to proxy
 * garbage: only http/https, no embedded credentials, no localhost/.local/
 * .internal names, no private/link-local IP literals. The WHATWG URL parser
 * canonicalises exotic IPv4 spellings (decimal `2130706433`, hex, octal) to
 * dotted-quad before the check, so those cannot sneak past it.
 */
export function validateTestUrl(raw: string): UrlValidation {
  const trimmed = raw.trim()
  if (trimmed === '') return { error: 'Enter the URL of the page you want to test.' }
  if (trimmed.length > MAX_URL_LENGTH) {
    return { error: 'That URL is over 2000 characters — paste just the page address.' }
  }

  const candidate = HAS_SCHEME.test(trimmed)
    ? trimmed
    : trimmed.startsWith('//')
      ? `https:${trimmed}`
      : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return { error: 'That does not look like a valid URL.' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: 'Only public http and https pages can be tested.' }
  }
  if (parsed.username !== '' || parsed.password !== '') {
    return { error: 'Remove the credentials (user:password@) from the URL.' }
  }

  const host = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (host === '') return { error: 'That does not look like a valid URL.' }
  if (host === 'localhost' || BLOCKED_HOST_SUFFIXES.some((s) => host.endsWith(s))) {
    return { error: PRIVATE_NETWORK_ERROR }
  }
  if (isIpLiteralHost(host)) {
    if (isPrivateAddress(host)) return { error: PRIVATE_NETWORK_ERROR }
  } else if (!host.includes('.')) {
    return { error: 'Use the full public domain, like example.com/pricing.' }
  }

  return { url: parsed.toString() }
}

// ---------------------------------------------------------------------------
// Narrowing helpers for untrusted JSON
// ---------------------------------------------------------------------------

type UnknownRecord = Record<string, unknown>

function asRecord(v: unknown): UnknownRecord | undefined {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
    ? (v as UnknownRecord)
    : undefined
}

function asFiniteNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v !== '' ? v : undefined
}

// ---------------------------------------------------------------------------
// PSI response -> compact payload
// ---------------------------------------------------------------------------

export interface ParsedSpeedTest {
  readonly payload?: SpeedTestPayload
  readonly error?: string
}

/** Lab audits, in the order they are shown (verdict-relevant first). */
const LAB_AUDITS: readonly { readonly audit: string; readonly id: MetricId }[] = [
  { audit: 'largest-contentful-paint', id: 'LCP' },
  { audit: 'cumulative-layout-shift', id: 'CLS' },
  { audit: 'first-contentful-paint', id: 'FCP' },
  { audit: 'total-blocking-time', id: 'TBT' },
]

/** CrUX field metrics. CLS percentile arrives multiplied by 100 (`5` = 0.05). */
const FIELD_METRICS: readonly {
  readonly key: string
  readonly id: MetricId
  readonly scale: number
}[] = [
  { key: 'LARGEST_CONTENTFUL_PAINT_MS', id: 'LCP', scale: 1 },
  { key: 'INTERACTION_TO_NEXT_PAINT', id: 'INP', scale: 1 },
  { key: 'CUMULATIVE_LAYOUT_SHIFT_SCORE', id: 'CLS', scale: 0.01 },
  { key: 'FIRST_CONTENTFUL_PAINT_MS', id: 'FCP', scale: 1 },
]

/**
 * Lighthouse audit descriptions are markdown with a trailing "[Learn ...](url)"
 * link. Strip the learn-more sentence and flatten remaining links/backticks so
 * the client renders plain language, not raw markdown.
 */
export function stripAuditMarkdown(text: string): string {
  return text
    .replace(/\[Learn[^\]]*\]\([^)]*\)\.?/gi, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Pulls audits that carry an estimated saving. Lighthouse has shipped two
 * shapes over time — `details.overallSavingsMs` (classic opportunities) and
 * `metricSavings` per metric (Lighthouse 12+) — so both are read, and audits
 * that already pass (score >= 0.9) or are informative are skipped.
 */
function extractOpportunities(audits: UnknownRecord): Opportunity[] {
  const out: Opportunity[] = []
  for (const key of Object.keys(audits)) {
    const audit = asRecord(audits[key])
    if (!audit) continue
    const mode = asString(audit.scoreDisplayMode)
    if (
      mode === 'informative' ||
      mode === 'notApplicable' ||
      mode === 'manual' ||
      mode === 'error'
    ) {
      continue
    }
    const score = asFiniteNumber(audit.score)
    if (score !== undefined && score >= 0.9) continue

    const details = asRecord(audit.details)
    let savings = asFiniteNumber(details?.overallSavingsMs) ?? 0
    if (savings <= 0) {
      const metricSavings = asRecord(audit.metricSavings)
      if (metricSavings) {
        for (const v of Object.values(metricSavings)) {
          const n = asFiniteNumber(v)
          if (n !== undefined && n > savings) savings = n
        }
      }
    }
    if (savings <= 0) continue

    const title = asString(audit.title)
    if (!title) continue
    out.push({
      id: key,
      title,
      savingsMs: Math.round(savings),
      savingsDisplay: formatSavings(savings),
      description: stripAuditMarkdown(asString(audit.description) ?? ''),
    })
  }
  return out.sort((a, b) => b.savingsMs - a.savingsMs).slice(0, 5)
}

/** Aggregate rows in `resource-summary` that are not a distinct resource type. */
const RESOURCE_SUMMARY_AGGREGATES = new Set(['third-party', 'total'])

/**
 * Third-party cost — audit id `third-parties-insight`.
 *
 * Lighthouse renamed and reshaped this audit as part of Google's "Insights"
 * rollout: the classic `third-party-summary` id (and its `blockingTime`
 * field) is gone from current PSI v5 responses, confirmed against a live run
 * while building this — `entity` now arrives as a plain string rather than
 * `{ text: string }`. Both entity shapes are read below so a future rename
 * back, or a response from an older Lighthouse version, degrades instead of
 * silently dropping every entity.
 *
 * Ranked by `mainThreadTime` — the entity's total measured main-thread cost
 * (parse + compile + execute + layout) — because it is the only per-entity
 * cost figure this audit reports; there is no separate blocking-time field to
 * choose over it. Capped at five, same as `extractOpportunities`, and
 * entities with no measurable cost (seen live: trackers whose only activity
 * was a fire-and-forget beacon request) are dropped rather than shown as 0.
 */
function extractThirdParty(audits: UnknownRecord): ThirdPartyEntry[] {
  const items = asRecord(asRecord(audits['third-parties-insight'])?.details)?.items
  if (!Array.isArray(items)) return []
  const out: ThirdPartyEntry[] = []
  for (const item of items) {
    const row = asRecord(item)
    if (!row) continue
    const name = asString(row.entity) ?? asString(asRecord(row.entity)?.text)
    const mainThreadMs = asFiniteNumber(row.mainThreadTime)
    if (!name || mainThreadMs === undefined || mainThreadMs <= 0) continue
    const transferSize = asFiniteNumber(row.transferSize) ?? 0
    out.push({
      name,
      mainThreadMs: Math.round(mainThreadMs),
      mainThreadDisplay: formatSavings(mainThreadMs),
      transferSize: Math.round(transferSize),
      transferDisplay: formatTransferSize(transferSize),
    })
  }
  return out.sort((a, b) => b.mainThreadMs - a.mainThreadMs).slice(0, 5)
}

/**
 * Resource breakdown by type — audit id `resource-summary`. The `third-party`
 * and `total` rows are aggregates that overlap the others (a third-party
 * script is also counted under `script`), not a distinct category, so they
 * are excluded rather than shown as extra rows. Rows with zero requests
 * (a resource type the page simply does not use) are dropped so the list
 * only shows categories that actually apply — no empty "Fonts: 0 KB" line.
 * Sorted by transfer size, largest first, so the heaviest category leads.
 */
function extractResourceBreakdown(audits: UnknownRecord): ResourceBreakdownEntry[] {
  const items = asRecord(asRecord(audits['resource-summary'])?.details)?.items
  if (!Array.isArray(items)) return []
  const out: ResourceBreakdownEntry[] = []
  for (const item of items) {
    const row = asRecord(item)
    if (!row) continue
    const resourceType = asString(row.resourceType)
    const label = asString(row.label)
    if (!resourceType || !label || RESOURCE_SUMMARY_AGGREGATES.has(resourceType)) continue
    const requestCount = asFiniteNumber(row.requestCount) ?? 0
    if (requestCount <= 0) continue
    const transferSize = asFiniteNumber(row.transferSize) ?? 0
    out.push({
      resourceType,
      label,
      requestCount: Math.round(requestCount),
      transferSize: Math.round(transferSize),
      transferDisplay: formatTransferSize(transferSize),
    })
  }
  return out.sort((a, b) => b.transferSize - a.transferSize)
}

/**
 * Server response time (TTFB) — audit id `server-response-time`, a single
 * `numericValue` in ms. Not a `MetricId`: it has no Core Web Vital threshold,
 * it measures backend latency rather than anything Lighthouse renders, so it
 * is surfaced as one more diagnostic reading rather than folded into the
 * classified metric set.
 */
function extractServerResponseTime(audits: UnknownRecord): number | null {
  const value = asFiniteNumber(asRecord(audits['server-response-time'])?.numericValue)
  return value !== undefined && value >= 0 ? Math.round(value) : null
}

/**
 * Trims a raw PSI v5 response (often 2-6 MB of Lighthouse JSON) to the compact
 * payload the client renders. Every read is defensive: a missing or malformed
 * section is skipped, and only a response with no score, no lab metrics AND no
 * field data at all is reported as an error.
 */
export function parsePsiResponse(raw: unknown, strategy: Strategy): ParsedSpeedTest {
  const root = asRecord(raw)
  if (!root) {
    return { error: 'PageSpeed returned a response this tool could not read.' }
  }

  const lighthouse = asRecord(root.lighthouseResult)
  const audits = asRecord(lighthouse?.audits)

  let score: number | null = null
  const perf = asRecord(asRecord(lighthouse?.categories)?.performance)
  const rawScore = asFiniteNumber(perf?.score)
  if (rawScore !== undefined && rawScore >= 0 && rawScore <= 1) {
    score = Math.round(rawScore * 100)
  }

  const lab: MetricReading[] = []
  if (audits) {
    for (const { audit, id } of LAB_AUDITS) {
      const value = asFiniteNumber(asRecord(audits[audit])?.numericValue)
      if (value !== undefined && value >= 0) lab.push(buildReading(id, value))
    }
  }

  const loadingExperience = asRecord(root.loadingExperience)
  const fieldMetrics = asRecord(loadingExperience?.metrics)
  const field: MetricReading[] = []
  if (fieldMetrics) {
    for (const spec of FIELD_METRICS) {
      const percentile = asFiniteNumber(asRecord(fieldMetrics[spec.key])?.percentile)
      if (percentile !== undefined && percentile >= 0) {
        field.push(buildReading(spec.id, percentile * spec.scale))
      }
    }
  }
  const fieldSource: FieldSource =
    field.length === 0
      ? 'none'
      : loadingExperience?.origin_fallback === true
        ? 'origin'
        : 'page'

  if (score === null && lab.length === 0 && field.length === 0) {
    return { error: 'PageSpeed returned a response this tool could not read.' }
  }

  const finalUrl =
    asString(lighthouse?.finalDisplayedUrl) ??
    asString(lighthouse?.finalUrl) ??
    asString(root.id) ??
    ''

  return {
    payload: {
      finalUrl,
      strategy,
      score,
      lab,
      field,
      fieldSource,
      opportunities: audits ? extractOpportunities(audits) : [],
      thirdParty: audits ? extractThirdParty(audits) : [],
      resourceBreakdown: audits ? extractResourceBreakdown(audits) : [],
      serverResponseMs: audits ? extractServerResponseTime(audits) : null,
    },
  }
}

// ---------------------------------------------------------------------------
// Client-side parsers for our own API's JSON and localStorage
// ---------------------------------------------------------------------------

const METRIC_IDS: readonly MetricId[] = ['LCP', 'INP', 'CLS', 'FCP', 'TBT']
const CATEGORIES: readonly MetricCategory[] = ['good', 'needs-improvement', 'poor']
const ERROR_CODES: readonly SpeedTestErrorCode[] = [
  'invalid-url',
  'blocked-url',
  'unreachable',
  'quota',
  'timeout',
  'upstream',
  'rate-limited',
]

function isMetricId(v: unknown): v is MetricId {
  return typeof v === 'string' && (METRIC_IDS as readonly string[]).includes(v)
}

function parseReading(raw: unknown): MetricReading | undefined {
  const r = asRecord(raw)
  if (!r) return undefined
  if (!isMetricId(r.id)) return undefined
  const value = asFiniteNumber(r.value)
  const label = asString(r.label)
  const display = asString(r.display)
  const category = r.category
  if (value === undefined || !label || !display) return undefined
  if (typeof category !== 'string') return undefined
  if (!(CATEGORIES as readonly string[]).includes(category)) return undefined
  return { id: r.id, label, value, display, category: category as MetricCategory }
}

function parseReadings(raw: unknown): MetricReading[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out: MetricReading[] = []
  for (const item of raw) {
    const reading = parseReading(item)
    if (!reading) return undefined
    out.push(reading)
  }
  return out
}

function parseThirdPartyEntry(raw: unknown): ThirdPartyEntry | undefined {
  const r = asRecord(raw)
  if (!r) return undefined
  const name = asString(r.name)
  const mainThreadMs = asFiniteNumber(r.mainThreadMs)
  const mainThreadDisplay = asString(r.mainThreadDisplay)
  const transferSize = asFiniteNumber(r.transferSize)
  const transferDisplay = asString(r.transferDisplay)
  if (
    !name ||
    mainThreadMs === undefined ||
    !mainThreadDisplay ||
    transferSize === undefined ||
    !transferDisplay
  ) {
    return undefined
  }
  return { name, mainThreadMs, mainThreadDisplay, transferSize, transferDisplay }
}

function parseThirdPartyEntries(raw: unknown): ThirdPartyEntry[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out: ThirdPartyEntry[] = []
  for (const item of raw) {
    const entry = parseThirdPartyEntry(item)
    if (!entry) return undefined
    out.push(entry)
  }
  return out
}

function parseResourceBreakdownEntry(raw: unknown): ResourceBreakdownEntry | undefined {
  const r = asRecord(raw)
  if (!r) return undefined
  const resourceType = asString(r.resourceType)
  const label = asString(r.label)
  const requestCount = asFiniteNumber(r.requestCount)
  const transferSize = asFiniteNumber(r.transferSize)
  const transferDisplay = asString(r.transferDisplay)
  if (
    !resourceType ||
    !label ||
    requestCount === undefined ||
    transferSize === undefined ||
    !transferDisplay
  ) {
    return undefined
  }
  return { resourceType, label, requestCount, transferSize, transferDisplay }
}

function parseResourceBreakdownEntries(
  raw: unknown,
): ResourceBreakdownEntry[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out: ResourceBreakdownEntry[] = []
  for (const item of raw) {
    const entry = parseResourceBreakdownEntry(item)
    if (!entry) return undefined
    out.push(entry)
  }
  return out
}

/**
 * Validates the payload our Route Handler produced after it crossed the wire.
 * The client never assumes its own API is well-formed — a CDN error page or a
 * half-cached body must degrade to a readable error, not a render crash.
 */
export function parseSpeedTestPayload(raw: unknown): SpeedTestPayload | undefined {
  const r = asRecord(raw)
  if (!r) return undefined
  if (r.strategy !== 'mobile' && r.strategy !== 'desktop') return undefined
  const score = r.score === null ? null : asFiniteNumber(r.score)
  if (score === undefined || (score !== null && (score < 0 || score > 100))) {
    return undefined
  }
  const lab = parseReadings(r.lab)
  const field = parseReadings(r.field)
  if (!lab || !field) return undefined
  const fieldSource = r.fieldSource
  if (fieldSource !== 'page' && fieldSource !== 'origin' && fieldSource !== 'none') {
    return undefined
  }
  if (!Array.isArray(r.opportunities)) return undefined
  const opportunities: Opportunity[] = []
  for (const item of r.opportunities) {
    const o = asRecord(item)
    if (!o) return undefined
    const id = asString(o.id)
    const title = asString(o.title)
    const savingsMs = asFiniteNumber(o.savingsMs)
    if (!id || !title || savingsMs === undefined) return undefined
    opportunities.push({
      id,
      title,
      savingsMs,
      savingsDisplay: typeof o.savingsDisplay === 'string' ? o.savingsDisplay : '',
      description: typeof o.description === 'string' ? o.description : '',
    })
  }

  // The three fields below are newer than the other ones above them, and this
  // API's responses are CDN- and data-cached for up to 6 hours (see the route
  // handler) — a client can load this file right after a deploy and still get
  // served a response body cached from before it, one that predates these
  // keys entirely. An absent key defaults to empty/null exactly as a real
  // "nothing to report" run would; only a key that is *present but malformed*
  // invalidates the whole payload, same as every other field above.
  const thirdParty =
    r.thirdParty === undefined ? [] : parseThirdPartyEntries(r.thirdParty)
  if (!thirdParty) return undefined
  const resourceBreakdown =
    r.resourceBreakdown === undefined
      ? []
      : parseResourceBreakdownEntries(r.resourceBreakdown)
  if (!resourceBreakdown) return undefined
  const serverResponseMs =
    r.serverResponseMs === undefined || r.serverResponseMs === null
      ? null
      : asFiniteNumber(r.serverResponseMs)
  if (serverResponseMs === undefined) return undefined

  return {
    finalUrl: typeof r.finalUrl === 'string' ? r.finalUrl : '',
    strategy: r.strategy,
    score,
    lab,
    field,
    fieldSource,
    opportunities,
    thirdParty,
    resourceBreakdown,
    serverResponseMs,
  }
}

/** Narrows an error body from our API. */
export function parseApiError(raw: unknown): SpeedTestApiError | undefined {
  const r = asRecord(raw)
  if (!r) return undefined
  const error = asString(r.error)
  const code = r.code
  if (!error || typeof code !== 'string') return undefined
  if (!(ERROR_CODES as readonly string[]).includes(code)) return undefined
  return { code: code as SpeedTestErrorCode, error }
}

// ---------------------------------------------------------------------------
// Verdict + presentation helpers.
//
// This is the block that makes the tool's USP something the code actually does
// rather than a claim in a brief: every competitor hands back a dashboard to
// explore, and the question a visitor arrived with is "is this page fast enough,
// and what do I fix first?". Answering that is a pure reduction over the payload,
// so it lives here with tests instead of being derived inline in the component.
// ---------------------------------------------------------------------------

/** The three metrics Google assesses. FCP and TBT are diagnostics, not vitals. */
export const CORE_WEB_VITALS: readonly MetricId[] = ['LCP', 'INP', 'CLS']

function isCoreWebVital(id: MetricId): boolean {
  return id === 'LCP' || id === 'INP' || id === 'CLS'
}

export interface VitalsSelection {
  /** The Core Web Vitals to headline — field readings when they exist. */
  readonly primary: readonly MetricReading[]
  /** Everything else worth showing, listed after. */
  readonly supporting: readonly MetricReading[]
  /** True when `primary` came from CrUX rather than this lab run. */
  readonly usingField: boolean
}

/**
 * Splits a payload into the readings to headline and the ones to list after.
 *
 * Field data wins when it has at least one Core Web Vital, because that is what
 * Google's ranking systems assess. A payload with field data for FCP only (which
 * CrUX does return for low-traffic pages) falls back to lab rather than
 * headlining an empty set.
 */
export function selectVitals(payload: SpeedTestPayload): VitalsSelection {
  const fieldPrimary = payload.field.filter((m) => isCoreWebVital(m.id))
  if (fieldPrimary.length > 0) {
    return { primary: fieldPrimary, supporting: payload.lab, usingField: true }
  }
  return {
    primary: payload.lab.filter((m) => isCoreWebVital(m.id)),
    supporting: payload.lab.filter((m) => !isCoreWebVital(m.id)),
    usingField: false,
  }
}

const CATEGORY_RANK: Record<MetricCategory, number> = {
  good: 0,
  'needs-improvement': 1,
  poor: 2,
}

/**
 * The reading most worth naming: worst category first, and within a category the
 * one furthest past its own Good boundary — so a 5x-over LCP outranks a
 * marginally-over CLS instead of losing to whichever was listed first.
 */
function worstReading(readings: readonly MetricReading[]): MetricReading | undefined {
  let worst: MetricReading | undefined
  let worstOvershoot = -1
  for (const reading of readings) {
    const overshoot = reading.value / METRIC_THRESHOLDS[reading.id].good
    if (worst === undefined) {
      worst = reading
      worstOvershoot = overshoot
      continue
    }
    const rank = CATEGORY_RANK[reading.category] - CATEGORY_RANK[worst.category]
    if (rank > 0 || (rank === 0 && overshoot > worstOvershoot)) {
      worst = reading
      worstOvershoot = overshoot
    }
  }
  return worst
}

/** "LCP", "LCP and CLS", "LCP, INP and CLS" — never a bare comma list. */
function listMetrics(ids: readonly MetricId[]): string {
  if (ids.length === 0) return ''
  if (ids.length === 1) return ids[0] ?? ''
  const head = ids.slice(0, -1).join(', ')
  const tail = ids[ids.length - 1] ?? ''
  return `${head} and ${tail}`
}

export interface SpeedVerdict {
  /** Worst category across the assessed Core Web Vitals. */
  readonly category: MetricCategory
  /** One line, always naming the state in words. */
  readonly headline: string
  /** One sentence of specifics — a figure and the boundary it missed. */
  readonly detail: string
  /** Core Web Vitals that are not Good, in report order. */
  readonly failing: readonly MetricId[]
  readonly usingField: boolean
}

/**
 * Reduces a whole report to a sentence.
 *
 * Never returns colour, only words and figures: the component renders the
 * category as a tinted pill, but the pill's text and this headline both carry the
 * state, so the verdict survives greyscale, a screen reader and a plain-text copy.
 */
export function summariseVerdict(payload: SpeedTestPayload): SpeedVerdict {
  const { primary, usingField } = selectVitals(payload)
  const source = usingField ? 'real visitors' : 'this lab run'

  if (primary.length === 0) {
    return {
      category: 'needs-improvement',
      headline: 'No Core Web Vitals to judge',
      detail:
        // Position-neutral wording: this sentence appears above the score in the
        // UI and below it in the copied text report.
        'This run returned no LCP, INP or CLS reading, so there is nothing to assess against Google’s thresholds. The performance score is still a useful summary.',
      failing: [],
      usingField,
    }
  }

  const failing = primary.filter((m) => m.category !== 'good').map((m) => m.id)

  if (failing.length === 0) {
    return {
      category: 'good',
      headline: 'Core Web Vitals: passing',
      detail: `${listMetrics(primary.map((m) => m.id))} are all inside Google’s Good range for ${source}.`,
      failing: [],
      usingField,
    }
  }

  const worst = worstReading(primary)
  const category: MetricCategory = primary.some((m) => m.category === 'poor')
    ? 'poor'
    : 'needs-improvement'
  const headline =
    failing.length === 1
      ? `Core Web Vitals: ${listMetrics(failing)} needs work`
      : `Core Web Vitals: ${listMetrics(failing)} need work`
  const detail =
    worst === undefined
      ? `Measured against Google’s thresholds for ${source}.`
      : `${worst.label} (${worst.id}) is ${worst.display} for ${source} — Google’s Good range ends at ${formatMetricValue(worst.id, METRIC_THRESHOLDS[worst.id].good)}.`

  return { category, headline, detail, failing, usingField }
}

export interface ThresholdBands {
  readonly good: string
  readonly needsImprovement: string
  readonly poor: string
}

/**
 * The three bands for a metric, formatted for display.
 *
 * Derived from `METRIC_THRESHOLDS` rather than written out in the component, so
 * the reference the visitor reads before a run cannot drift from the boundaries
 * `classifyMetric` actually applies after it.
 */
export function describeThresholds(id: MetricId): ThresholdBands {
  const t = METRIC_THRESHOLDS[id]
  const good = formatMetricValue(id, t.good)
  const poor = formatMetricValue(id, t.poor)
  return {
    good: `≤ ${good}`,
    needsImprovement: `${good} – ${poor}`,
    poor: `> ${poor}`,
  }
}

/**
 * Where a value sits on a 0-1 track whose Good and Poor boundaries are pinned at
 * 1/3 and 2/3. Purely presentational — it drives a decorative marker, and the
 * figure and rating word are always rendered as text beside it.
 *
 * Values past the Poor boundary compress towards 1 rather than running off the
 * end, so a 30-second LCP still renders inside the track.
 */
export function scalePosition(id: MetricId, value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  const t = METRIC_THRESHOLDS[id]
  const third = 1 / 3
  if (value <= t.good) return (value / t.good) * third
  if (value <= t.poor) return third + ((value - t.good) / (t.poor - t.good)) * third
  const over = Math.min(1, (value - t.poor) / t.poor)
  return 2 * third + over * third
}

function reportLine(reading: MetricReading): string {
  const bands = describeThresholds(reading.id)
  return `  ${reading.id.padEnd(4)} ${reading.display.padEnd(8)} ${labelForCategory(
    reading.category,
  ).padEnd(18)} (Good ${bands.good})`
}

/**
 * The whole report as plain text, for the clipboard.
 *
 * This is the "shareable result" competitors implement with a hosted permanent
 * URL. A stored public report needs a database and a retention policy; a block of
 * text pastes into Slack, a ticket or an email and needs neither. Deliberately
 * carries no timestamp so the output is deterministic and testable — the person
 * pasting it knows when they ran it.
 */
export function formatReportText(payload: SpeedTestPayload): string {
  const verdict = summariseVerdict(payload)
  const { primary, supporting, usingField } = selectVitals(payload)
  const lines: string[] = [
    `Website speed test — ${payload.finalUrl === '' ? '(url unknown)' : payload.finalUrl}`,
    `Device: ${payload.strategy}`,
    payload.score === null
      ? 'Performance score: not returned'
      : `Performance score: ${payload.score} / 100 — ${labelForScore(payload.score)}`,
    `Verdict: ${verdict.headline}`,
    verdict.detail,
  ]

  if (primary.length > 0) {
    lines.push(
      '',
      usingField
        ? 'Core Web Vitals — real-user data (Chrome UX Report, 28 days, 75th percentile)'
        : 'Core Web Vitals — lab data from this run (INP needs real users, so it is absent)',
      ...primary.map(reportLine),
    )
  }

  if (supporting.length > 0) {
    lines.push('', 'Supporting lab metrics — this run', ...supporting.map(reportLine))
  }

  if (payload.opportunities.length > 0) {
    lines.push('', 'Fix these first (largest estimated saving first)')
    payload.opportunities.forEach((o, i) => {
      const saving = o.savingsDisplay === '' ? '' : ` — saves ~${o.savingsDisplay}`
      lines.push(`  ${i + 1}. ${o.title}${saving}`)
    })
  }

  lines.push(
    '',
    'Measured with Google Lighthouse via the PageSpeed Insights API.',
    'Run your own: https://tools.scult.in/seo/website-speed-test',
  )
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Markdown export
// ---------------------------------------------------------------------------

/** A markdown table header a literal pipe or newline in upstream data (an
 * audit title, a third-party entity name) would otherwise corrupt. */
function escapeMarkdownCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

const METRIC_TABLE_HEADER =
  '| Metric | Reading | Rating | Good threshold |\n| --- | --- | --- | --- |'

function markdownMetricRow(reading: MetricReading): string {
  return `| ${reading.id} — ${escapeMarkdownCell(reading.label)} | ${reading.display} | ${labelForCategory(
    reading.category,
  )} | ${describeThresholds(reading.id).good} |`
}

/**
 * The whole report as clean, valid Markdown — a distinct sibling to
 * `formatReportText`, not that function wrapped in a code fence. Every
 * metric list becomes a real table (Metric / Reading / Rating / Good
 * threshold), and this version additionally covers the three readings
 * `formatReportText` leaves out for brevity (TTFB, third-party cost,
 * resource breakdown) — markdown's tables make room for them where a
 * clipboard-friendly plain-text block did not.
 *
 * `generatedAt`, when given, is a caller-supplied display string — e.g. from
 * `new Date().toLocaleString()` read at the moment of the download click.
 * This function never calls `Date.now()`/`new Date()` itself, so it stays a
 * pure, deterministic reduction over `payload` like every other formatter
 * here; omit the argument entirely for a footer with no timestamp at all.
 */
export function formatReportMarkdown(
  payload: SpeedTestPayload,
  generatedAt?: string,
): string {
  const verdict = summariseVerdict(payload)
  const { primary, supporting, usingField } = selectVitals(payload)
  const lines: string[] = [
    '# Website speed test report',
    '',
    `**URL:** ${payload.finalUrl === '' ? '(url unknown)' : payload.finalUrl}`,
    `**Device:** ${payload.strategy === 'mobile' ? 'Mobile' : 'Desktop'}`,
    payload.score === null
      ? '**Performance score:** not returned'
      : `**Performance score:** ${payload.score} / 100 — ${labelForScore(payload.score)}`,
    '',
    '## Verdict',
    '',
    `**${verdict.headline}**`,
    '',
    verdict.detail,
  ]

  if (primary.length > 0) {
    lines.push(
      '',
      usingField
        ? '## Core Web Vitals — real-user data (Chrome UX Report, 28 days, 75th percentile)'
        : '## Core Web Vitals — lab data from this run (INP needs real users, so it is absent)',
      '',
      METRIC_TABLE_HEADER,
      ...primary.map(markdownMetricRow),
    )
  }

  if (supporting.length > 0) {
    lines.push(
      '',
      '## Supporting lab metrics — this run',
      '',
      METRIC_TABLE_HEADER,
      ...supporting.map(markdownMetricRow),
    )
  }

  if (payload.opportunities.length > 0) {
    lines.push(
      '',
      '## Fix these first',
      '',
      'Sorted by estimated time saved, largest first.',
      '',
    )
    for (const [index, o] of payload.opportunities.entries()) {
      const saving = o.savingsDisplay === '' ? '' : ` — saves ~${o.savingsDisplay}`
      lines.push(`${index + 1}. **${escapeMarkdownCell(o.title)}**${saving}`)
      if (o.description !== '') lines.push(`   ${escapeMarkdownCell(o.description)}`)
    }
  }

  const hasBeyond =
    payload.serverResponseMs !== null ||
    payload.thirdParty.length > 0 ||
    payload.resourceBreakdown.length > 0
  if (hasBeyond) {
    lines.push('', '## Beyond the Core Web Vitals')
    if (payload.serverResponseMs !== null) {
      lines.push(
        '',
        `**Server response time (TTFB):** ${formatServerResponseTime(payload.serverResponseMs)}`,
      )
    }
    if (payload.thirdParty.length > 0) {
      lines.push(
        '',
        '### Third-party cost',
        '',
        '| Third party | Main-thread time | Transfer size |',
        '| --- | --- | --- |',
        ...payload.thirdParty.map(
          (t) =>
            `| ${escapeMarkdownCell(t.name)} | ${t.mainThreadDisplay} | ${t.transferDisplay} |`,
        ),
      )
    }
    if (payload.resourceBreakdown.length > 0) {
      lines.push(
        '',
        '### Resource breakdown',
        '',
        '| Resource type | Transfer size | Requests |',
        '| --- | --- | --- |',
        ...payload.resourceBreakdown.map(
          (r) =>
            `| ${escapeMarkdownCell(r.label)} | ${r.transferDisplay} | ${r.requestCount} |`,
        ),
      )
    }
  }

  lines.push(
    '',
    '---',
    '',
    generatedAt === undefined
      ? 'Generated by the [Website Speed Test](https://tools.scult.in/seo/website-speed-test) tool at tools.scult.in — measured with Google Lighthouse via the PageSpeed Insights API.'
      : `Generated ${generatedAt} by the [Website Speed Test](https://tools.scult.in/seo/website-speed-test) tool at tools.scult.in — measured with Google Lighthouse via the PageSpeed Insights API.`,
  )
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// localStorage
// ---------------------------------------------------------------------------

export interface StoredSpeedTest {
  readonly url: string
  readonly strategy: Strategy
}

/**
 * Validates the remembered last test from localStorage. Storage is
 * user-writable and survives deploys, so it is untrusted input: anything
 * unexpected returns undefined rather than poisoning the form.
 */
export function parseStoredSpeedTest(raw: unknown): StoredSpeedTest | undefined {
  const r = asRecord(raw)
  if (!r) return undefined
  const url = asString(r.url)
  if (!url || url.length > MAX_URL_LENGTH) return undefined
  if (r.strategy !== 'mobile' && r.strategy !== 'desktop') return undefined
  if (validateTestUrl(url).error !== undefined) return undefined
  return { url, strategy: r.strategy }
}
