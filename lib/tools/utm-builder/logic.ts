/**
 * UTM campaign URL construction.
 *
 * Purpose
 *   Attach utm_* parameters to a destination URL the way GA4 expects to read
 *   them back, and flag the input mistakes that quietly fragment a campaign
 *   across several rows in a report.
 *
 * Inputs   a destination URL plus the five UTM values as free text, and a flag
 *          for the lowercase/hyphenate convention.
 * Outputs  a UtmResult carrying the tagged URL, the parameters actually
 *          applied, and a list of advisory warnings.
 * Failure  a URL that cannot be parsed (or is not http/https) returns an
 *          `error` string and an empty url — never a throw, because the caller
 *          re-renders on every keystroke and `htt` is a normal intermediate
 *          state, not an exception.
 *
 * No React, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export type UtmFieldName =
  | 'source'
  | 'medium'
  | 'campaign'
  | 'campaignId'
  | 'term'
  | 'content'

export interface UtmFieldSpec {
  readonly name: UtmFieldName
  /** The query parameter GA4 reads, e.g. `utm_source`. */
  readonly param: string
  readonly label: string
  readonly required: boolean
  readonly hint: string
  readonly placeholder: string
  /** Rendered under "Advanced options" rather than in the main field list. */
  readonly advanced?: boolean
}

/**
 * Field order is the GA4 convention (source, medium, campaign, term, content),
 * and it is also the order the parameters are appended in, so two URLs built
 * from the same inputs are byte-identical.
 */
export const UTM_FIELDS: readonly UtmFieldSpec[] = [
  {
    name: 'source',
    param: 'utm_source',
    label: 'Campaign source',
    required: true,
    hint: 'Where the click comes from: google, newsletter, instagram.',
    placeholder: 'newsletter',
  },
  {
    name: 'medium',
    param: 'utm_medium',
    label: 'Campaign medium',
    required: true,
    hint: 'The channel type: cpc, email, social, referral.',
    placeholder: 'email',
  },
  {
    name: 'campaign',
    param: 'utm_campaign',
    label: 'Campaign name',
    required: true,
    hint: 'The campaign this link belongs to: spring-sale, launch-q3.',
    placeholder: 'spring-sale',
  },
  {
    name: 'campaignId',
    param: 'utm_id',
    label: 'Campaign ID',
    required: false,
    hint: 'Optional. Matches this link to a Google Ads campaign ID for cross-platform reporting.',
    placeholder: '7891011',
    advanced: true,
  },
  {
    name: 'term',
    param: 'utm_term',
    label: 'Campaign term',
    required: false,
    hint: 'Optional. The paid-search keyword you bid on.',
    placeholder: 'crm software',
  },
  {
    name: 'content',
    param: 'utm_content',
    label: 'Campaign content',
    required: false,
    hint: 'Optional. Separates two links in the same email or ad: hero-cta, footer-link.',
    placeholder: 'hero-cta',
  },
]

export interface UtmInput {
  readonly url: string
  readonly source?: string
  readonly medium?: string
  readonly campaign?: string
  readonly campaignId?: string
  readonly term?: string
  readonly content?: string
  /** Lowercase and hyphenate every value before applying it. Defaults to true. */
  readonly lowercase?: boolean
}

export interface AppliedParam {
  readonly param: string
  readonly value: string
}

export interface UtmResult {
  /** The tagged URL, or '' when `error` is set. */
  readonly url: string
  readonly params: readonly AppliedParam[]
  readonly warnings: readonly string[]
  readonly error?: string
}

/** A destination longer than this is either a mistake or already untaggable. */
const MAX_URL_LENGTH = 2000

/** Matches a real scheme prefix (`https://`, `ftp://`), not a bare `host:port`. */
const HAS_SCHEME = /^[a-z][a-z\d+\-.]*:\/\//i

/**
 * Applies the house convention: lowercase, and whitespace runs become single
 * hyphens.
 *
 * GA4 dimension values are compared byte-for-byte, so `Spring Sale`,
 * `spring sale` and `spring-sale` are three separate campaigns in the report.
 * Repeated and edge hyphens are collapsed too — `spring--sale-` and
 * `spring-sale` would otherwise be two more rows.
 *
 * Underscores survive deliberately: `paid_social` is an established value and
 * rewriting it would silently break an existing report.
 */
export function normalizeUtmValue(value: string, lowercase: boolean): string {
  const trimmed = value.trim()
  if (!lowercase) return trimmed
  return trimmed
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** True when a value would fragment reports if left as typed. */
function isInconsistent(value: string): boolean {
  return /\s/.test(value) || value !== value.toLowerCase()
}

interface ResolvedUrl {
  readonly parsed?: URL
  readonly error?: string
  readonly assumedScheme: boolean
}

function resolveUrl(raw: string): ResolvedUrl {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return { error: 'Enter the destination URL you want to tag.', assumedScheme: false }
  }
  if (trimmed.length > MAX_URL_LENGTH) {
    return {
      error: `That URL is over ${MAX_URL_LENGTH} characters — check you pasted a URL and not a page.`,
      assumedScheme: false,
    }
  }

  const hasScheme = HAS_SCHEME.test(trimmed)
  // `//example.com/x` is protocol-relative: it already has the authority
  // delimiter, so it needs a scheme and nothing else.
  const candidate = hasScheme
    ? trimmed
    : trimmed.startsWith('//')
      ? `https:${trimmed}`
      : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return { error: 'That does not look like a valid URL.', assumedScheme: false }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      error: 'Only http and https URLs can carry UTM parameters.',
      assumedScheme: false,
    }
  }
  // `https://mailto:me@example.com` parses cleanly as user `mailto`, password
  // `me`, host `example.com`. Refuse rather than hand back a link with
  // credentials in it.
  if (parsed.username !== '' || parsed.password !== '') {
    return {
      error: 'Remove the credentials (user:password@) from the URL.',
      assumedScheme: false,
    }
  }

  return { parsed, assumedScheme: !hasScheme }
}

/**
 * Builds the tagged URL.
 *
 * Parameters are applied through `URLSearchParams`, never string
 * concatenation: that is what makes `?a=b` keep its existing pair instead of
 * gaining a second `?`, puts the parameters before a `#fragment` rather than
 * inside it, and percent-encodes a value containing `&` so it cannot inject an
 * extra parameter.
 */
export function buildUtmUrl(input: UtmInput): UtmResult {
  const lowercase = input.lowercase ?? true
  const { parsed, error, assumedScheme } = resolveUrl(input.url)
  if (!parsed) {
    return { url: '', params: [], warnings: [], error: error ?? 'Invalid URL.' }
  }

  const warnings: string[] = []
  if (assumedScheme) {
    warnings.push('No protocol on the URL, so https:// was assumed.')
  }

  const raw: Record<UtmFieldName, string> = {
    source: (input.source ?? '').trim(),
    medium: (input.medium ?? '').trim(),
    campaign: (input.campaign ?? '').trim(),
    campaignId: (input.campaignId ?? '').trim(),
    term: (input.term ?? '').trim(),
    content: (input.content ?? '').trim(),
  }

  const missing: string[] = []
  const inconsistent: string[] = []
  const params: AppliedParam[] = []
  let replacedExisting = false

  for (const field of UTM_FIELDS) {
    const value = normalizeUtmValue(raw[field.name], lowercase)
    if (value === '') {
      // An empty optional parameter is omitted entirely — `&utm_term=` is a
      // real dimension value in GA4 (the empty string), not an absent one.
      if (field.required) missing.push(field.param)
      continue
    }
    if (!lowercase && isInconsistent(value)) inconsistent.push(field.param)
    if (parsed.searchParams.has(field.param)) replacedExisting = true
    parsed.searchParams.set(field.param, value)
    params.push({ param: field.param, value })
  }

  if (missing.length > 0) {
    warnings.push(
      `Still missing ${missing.join(', ')}. GA4 needs source, medium and campaign to attribute the visit.`,
    )
  }
  if (inconsistent.length > 0) {
    warnings.push(
      `Spaces or capitals in ${inconsistent.join(', ')}. GA4 is case-sensitive, so these become separate rows in your report — turn on lowercase to normalise them.`,
    )
  }
  if (replacedExisting) {
    warnings.push('The destination already had UTM parameters. They were replaced.')
  }

  const url = parsed.toString()
  if (url.length > MAX_URL_LENGTH) {
    warnings.push(
      `The tagged URL is ${url.length} characters. Email clients and some ad platforms truncate links this long.`,
    )
  }

  return { url, params, warnings }
}

export interface QualityCheck {
  readonly id: string
  readonly label: string
  readonly pass: boolean
}

export interface QualityScore {
  readonly score: number
  readonly checks: readonly QualityCheck[]
}

const REQUIRED_PARAMS = UTM_FIELDS.filter((field) => field.required).map(
  (field) => field.param,
)

/**
 * Scores a built link against the checks that keep a UTM scheme usable in
 * GA4: every required dimension present, no casing/whitespace that would
 * fragment a campaign into duplicate rows, and no other advisory warning
 * left unresolved.
 *
 * Pure function over the `UtmResult` `buildUtmUrl` already produced — no
 * re-parsing, so the score can never disagree with the warnings shown
 * beside it.
 */
export function computeQualityScore(result: UtmResult): QualityScore {
  const appliedParams = new Set(result.params.map((param) => param.param))
  const hasAllRequired = REQUIRED_PARAMS.every((param) => appliedParams.has(param))
  const hasCasingIssue = result.warnings.some((w) => w.includes('case-sensitive'))
  const hasOtherIssue = result.warnings.some(
    (w) => w.includes('already had UTM parameters') || w.includes('characters'),
  )

  const checks: QualityCheck[] = [
    {
      id: 'required',
      label: 'All required parameters are set',
      pass: result.error === undefined && hasAllRequired,
    },
    {
      id: 'casing',
      label: 'No spaces or uppercase letters',
      pass: !hasCasingIssue,
    },
    {
      id: 'best-practices',
      label: 'GA4 best practices followed',
      pass:
        result.error === undefined && hasAllRequired && !hasCasingIssue && !hasOtherIssue,
    },
  ]

  const score =
    result.error !== undefined
      ? 0
      : Math.round((checks.filter((check) => check.pass).length / checks.length) * 100)

  return { score, checks }
}

export interface UtmPrefs {
  readonly source: string
  readonly medium: string
  readonly lowercase: boolean
}

/**
 * Validates a previously saved preset.
 *
 * localStorage is user-writable and survives across deploys, so its contents
 * are untrusted input: anything unexpected returns undefined rather than
 * poisoning the form with a non-string value.
 */
export function parseUtmPrefs(raw: unknown): UtmPrefs | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined
  if (!('source' in raw) || !('medium' in raw) || !('lowercase' in raw)) return undefined
  const { source, medium, lowercase } = raw
  if (typeof source !== 'string' || typeof medium !== 'string') return undefined
  if (typeof lowercase !== 'boolean') return undefined
  if (source.length > 200 || medium.length > 200) return undefined
  return { source, medium, lowercase }
}
