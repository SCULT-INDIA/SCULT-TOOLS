/**
 * AI visibility analysis — the pure core of the AI visibility checker.
 *
 * Purpose
 *   Given the raw artefacts fetched from a site (robots.txt text, llms.txt
 *   status, homepage HTML, response headers), decide how visible the site is
 *   to AI search engines: which crawlers may fetch it, whether it exposes
 *   structured data and the basic on-page signals answer engines rely on, and
 *   a weighted 0–100 score with a plain-language band.
 *
 * Inputs   raw text only — robots.txt content, HTML, header strings. No URLs
 *          are fetched here.
 * Outputs  typed verdicts: per-bot access, per-check pass/warn/fail with a
 *          finding and a fix, and the composite score.
 * Failure  nothing in this module throws on bad input. Malformed robots
 *          lines are skipped, malformed JSON-LD blocks are skipped without
 *          killing their siblings, and an unparseable IP is treated as
 *          private (fail closed) because it is only ever consulted as a
 *          security gate.
 *
 * No React, no DOM, no I/O — the Route Handler does the fetching and this
 * module does all of the thinking, which is what makes the verdicts testable.
 */

export type CheckStatus = 'pass' | 'warn' | 'fail'

export type BandLabel = 'AI-visible' | 'Partially visible' | 'Mostly invisible to AI'

// ---------------------------------------------------------------------------
// The AI crawler roster
// ---------------------------------------------------------------------------

export interface BotSpec {
  /** The product token the crawler sends and robots.txt matches against. */
  readonly name: string
  readonly company: string
  /** One line on what the bot feeds, shown in the access table. */
  readonly purpose: string
}

/**
 * The crawlers that decide whether AI products can see a site. Order is the
 * display order: user-facing answer engines first, then training crawlers.
 */
export const AI_BOTS: readonly BotSpec[] = [
  { name: 'GPTBot', company: 'OpenAI', purpose: 'Model training' },
  { name: 'OAI-SearchBot', company: 'OpenAI', purpose: 'ChatGPT search index' },
  { name: 'ChatGPT-User', company: 'OpenAI', purpose: 'Live ChatGPT browsing' },
  { name: 'ClaudeBot', company: 'Anthropic', purpose: 'Model training' },
  { name: 'anthropic-ai', company: 'Anthropic', purpose: 'Legacy Anthropic crawler' },
  { name: 'PerplexityBot', company: 'Perplexity', purpose: 'Perplexity search index' },
  { name: 'Google-Extended', company: 'Google', purpose: 'Gemini training & grounding' },
  {
    name: 'CCBot',
    company: 'Common Crawl',
    purpose: 'Open dataset many models train on',
  },
  { name: 'Bytespider', company: 'ByteDance', purpose: 'Model training' },
  { name: 'meta-externalagent', company: 'Meta', purpose: 'Llama training' },
]

// ---------------------------------------------------------------------------
// robots.txt parsing and evaluation
// ---------------------------------------------------------------------------

export interface RobotsRule {
  readonly type: 'allow' | 'disallow'
  readonly path: string
}

export interface RobotsGroup {
  /** Lowercased user-agent tokens this group applies to. */
  readonly userAgents: readonly string[]
  readonly rules: readonly RobotsRule[]
}

export interface ParsedRobots {
  readonly groups: readonly RobotsGroup[]
  readonly sitemaps: readonly string[]
}

/**
 * Parses robots.txt into user-agent groups per RFC 9309 line semantics:
 * comments start at `#`, keys are case-insensitive, and consecutive
 * `User-agent` lines share one rule group. `Sitemap` is a non-group directive
 * and is collected wherever it appears.
 */
export function parseRobots(text: string): ParsedRobots {
  const groups: { userAgents: string[]; rules: RobotsRule[] }[] = []
  const sitemaps: string[] = []
  let current: { userAgents: string[]; rules: RobotsRule[] } | undefined
  let lastLineWasUserAgent = false

  for (const rawLine of text.split(/\r?\n/)) {
    const line = (rawLine.split('#')[0] ?? '').trim()
    if (line === '') continue
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim().toLowerCase()
    const value = line.slice(colon + 1).trim()

    if (key === 'user-agent') {
      if (!lastLineWasUserAgent || current === undefined) {
        current = { userAgents: [], rules: [] }
        groups.push(current)
      }
      if (value !== '') current.userAgents.push(value.toLowerCase())
      lastLineWasUserAgent = true
      continue
    }

    lastLineWasUserAgent = false
    if (key === 'allow' || key === 'disallow') {
      // Rules before any User-agent line have no group and are ignored.
      current?.rules.push({ type: key, path: value })
    } else if (key === 'sitemap' && value !== '') {
      sitemaps.push(value)
    }
  }

  return { groups, sitemaps }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * True when a robots path pattern matches the given path. Supports the two
 * widely implemented extensions: `*` matches any run of characters and a
 * trailing `$` anchors the end. An empty pattern matches nothing — which is
 * exactly why a bare `Disallow:` line allows everything.
 */
function ruleMatches(pattern: string, path: string): boolean {
  if (pattern === '') return false
  let body = pattern
  let anchored = false
  if (body.endsWith('$')) {
    anchored = true
    body = body.slice(0, -1)
  }
  const source = body.split('*').map(escapeRegExp).join('.*')
  return new RegExp(`^${source}${anchored ? '$' : ''}`).test(path)
}

export interface BotVerdict {
  readonly allowed: boolean
  /**
   * Which rule group decided: a group naming this bot, the `*` group, or no
   * group at all (robots.txt silent on it — allowed by default).
   */
  readonly source: 'specific' | 'wildcard' | 'default'
  /** The winning rule line, when one matched, for the finding text. */
  readonly matchedRule?: string
}

/**
 * Evaluates whether a crawler may fetch `path` under the parsed robots.txt.
 *
 * Precedence implemented (matching Google's documented behaviour and
 * RFC 9309):
 *   1. Group selection — the most specific matching `User-agent` wins over
 *      `*`. Matching is case-insensitive; a token matches when it is a prefix
 *      of the crawler's product token (so `User-agent: ChatGPT` governs
 *      `ChatGPT-User`). Only if no specific group matches does `*` apply.
 *   2. Rule selection within the group — the rule with the longest matching
 *      path wins, regardless of order in the file. On an exact tie between an
 *      Allow and a Disallow, Allow wins.
 *   3. An empty `Disallow:` matches nothing, i.e. it allows everything.
 *   4. No matching rule at all means allowed.
 */
export function evaluateBot(
  robots: ParsedRobots,
  botName: string,
  path = '/',
): BotVerdict {
  const bot = botName.toLowerCase()

  // Group selection: longest specific token that prefixes the bot name.
  let bestToken = ''
  for (const group of robots.groups) {
    for (const ua of group.userAgents) {
      if (ua === '*' || ua === '') continue
      if (bot.startsWith(ua) && ua.length > bestToken.length) bestToken = ua
    }
  }

  const wantWildcard = bestToken === ''
  const rules: RobotsRule[] = []
  let sawGroup = false
  for (const group of robots.groups) {
    const matches = wantWildcard
      ? group.userAgents.includes('*')
      : group.userAgents.includes(bestToken)
    if (!matches) continue
    sawGroup = true
    rules.push(...group.rules)
  }

  if (!sawGroup) return { allowed: true, source: 'default' }
  const source = wantWildcard ? 'wildcard' : 'specific'

  let winner: RobotsRule | undefined
  for (const rule of rules) {
    if (!ruleMatches(rule.path, path)) continue
    if (
      winner === undefined ||
      rule.path.length > winner.path.length ||
      (rule.path.length === winner.path.length &&
        rule.type === 'allow' &&
        winner.type === 'disallow')
    ) {
      winner = rule
    }
  }

  if (winner === undefined) return { allowed: true, source }
  return {
    allowed: winner.type === 'allow',
    source,
    matchedRule: `${winner.type === 'allow' ? 'Allow' : 'Disallow'}: ${winner.path}`,
  }
}

// ---------------------------------------------------------------------------
// JSON-LD extraction
// ---------------------------------------------------------------------------

export interface JsonLdResult {
  /** How many <script type="application/ld+json"> blocks were found. */
  readonly blockCount: number
  /** How many of those parsed as JSON. */
  readonly parsedCount: number
  /** Deduplicated @type values, including those nested inside @graph. */
  readonly types: readonly string[]
}

function collectTypes(node: unknown, out: string[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, out)
    return
  }
  if (typeof node !== 'object' || node === null) return
  const record = node as Record<string, unknown>
  const type = record['@type']
  if (typeof type === 'string') out.push(type)
  else if (Array.isArray(type)) {
    for (const t of type) if (typeof t === 'string') out.push(t)
  }
  if ('@graph' in record) collectTypes(record['@graph'], out)
}

/**
 * Pulls every JSON-LD block out of raw HTML with a regex (no DOM available
 * server-side) and parses each one independently, so one malformed block
 * never hides the valid ones next to it. Arrays and `@graph` containers are
 * walked; `@type` values are collected and deduplicated.
 */
export function extractJsonLd(html: string): JsonLdResult {
  const scriptRe =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const types: string[] = []
  let blockCount = 0
  let parsedCount = 0

  for (const match of html.matchAll(scriptRe)) {
    blockCount += 1
    const body = match[1]
    if (body === undefined) continue
    let data: unknown
    try {
      data = JSON.parse(body.trim())
    } catch {
      continue // one broken block must not kill the rest
    }
    parsedCount += 1
    collectTypes(data, types)
  }

  return { blockCount, parsedCount, types: [...new Set(types)] }
}

// ---------------------------------------------------------------------------
// On-page basics AI answers rely on
// ---------------------------------------------------------------------------

export interface BasicsResult {
  readonly title: string | undefined
  readonly description: string | undefined
  readonly h1Count: number
  readonly h2Count: number
  readonly lang: string | undefined
  /** How many of the five signals are present (title, description, one h1, ≥2 h2s, lang). */
  readonly presentCount: number
}

/** Finds the content attribute of the first <meta name="..."> tag, attribute order-independent. */
function findMetaContent(html: string, name: string): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  const nameRe = new RegExp(`name\\s*=\\s*["']?${escapeRegExp(name)}["'\\s/>]`, 'i')
  for (const tag of tags) {
    if (!nameRe.test(tag)) continue
    const content = /content\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag)
    if (content === null) continue
    return (content[1] ?? content[2] ?? '').trim()
  }
  return undefined
}

/**
 * Extracts the plain-HTML signals answer engines read before anything else:
 * title, meta description, a single h1, h2 section headings, and the lang
 * attribute. Regex-based by design — this runs server-side on raw fetched
 * HTML with no DOM, and these five signals are all detectable at the tag
 * level without building a tree.
 */
export function analyzeBasics(html: string): BasicsResult {
  const titleMatch = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)
  const rawTitle = titleMatch?.[1]?.replace(/\s+/g, ' ').trim()
  const title = rawTitle !== undefined && rawTitle !== '' ? rawTitle : undefined

  const rawDescription = findMetaContent(html, 'description')
  const description =
    rawDescription !== undefined && rawDescription !== '' ? rawDescription : undefined

  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length
  const h2Count = (html.match(/<h2[\s>]/gi) ?? []).length

  const langMatch = /<html\b[^>]*\blang\s*=\s*["']?([a-zA-Z-]+)["'\s>]/i.exec(html)
  const lang = langMatch?.[1]

  const presentCount =
    (title !== undefined ? 1 : 0) +
    (description !== undefined ? 1 : 0) +
    (h1Count >= 1 ? 1 : 0) +
    (h2Count >= 2 ? 1 : 0) +
    (lang !== undefined ? 1 : 0)

  return { title, description, h1Count, h2Count, lang, presentCount }
}

// ---------------------------------------------------------------------------
// noai signals
// ---------------------------------------------------------------------------

/**
 * Detects `noai` / `noimageai` opt-out signals in the meta robots tag or the
 * X-Robots-Tag header. Reported neutrally: opting out of AI use is a
 * legitimate business decision, so this check informs, it does not judge.
 */
export function detectNoaiSignals(html: string, xRobotsTag?: string): readonly string[] {
  const signals: string[] = []
  const sources: { label: string; value: string | undefined }[] = [
    { label: 'meta robots tag', value: findMetaContent(html, 'robots') },
    { label: 'X-Robots-Tag header', value: xRobotsTag },
  ]
  for (const { label, value } of sources) {
    if (value === undefined) continue
    const tokens = value.toLowerCase().split(/[\s,]+/)
    if (tokens.includes('noai')) signals.push(`noai in ${label}`)
    if (tokens.includes('noimageai')) signals.push(`noimageai in ${label}`)
  }
  return signals
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export interface ScoreInput {
  /** Fraction of the AI bot roster allowed to crawl `/`, 0–1. */
  readonly crawlerFraction: number
  readonly structuredData: CheckStatus
  /** Fraction of the five on-page basics present, 0–1. */
  readonly basicsFraction: number
  readonly llmsTxt: CheckStatus
  readonly sitemap: CheckStatus
}

function statusFraction(status: CheckStatus): number {
  if (status === 'pass') return 1
  if (status === 'warn') return 0.5
  return 0
}

export function bandFor(score: number): BandLabel {
  if (score >= 80) return 'AI-visible'
  if (score >= 50) return 'Partially visible'
  return 'Mostly invisible to AI'
}

/**
 * Weighted composite: crawler access 40, structured data 20, on-page basics
 * 20, llms.txt 10, sitemap 10. Crawler access dominates deliberately — a
 * blocked crawler makes every other signal moot for that engine. Fractional
 * inputs are clamped so a caller bug can never produce a score outside 0–100.
 */
export function computeScore(input: ScoreInput): { score: number; band: BandLabel } {
  const clamp = (n: number): number =>
    Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0
  const score = Math.round(
    40 * clamp(input.crawlerFraction) +
      20 * statusFraction(input.structuredData) +
      20 * clamp(input.basicsFraction) +
      10 * statusFraction(input.llmsTxt) +
      10 * statusFraction(input.sitemap),
  )
  return { score, band: bandFor(score) }
}

// ---------------------------------------------------------------------------
// SSRF gate — URL validation and private-address detection
// ---------------------------------------------------------------------------

export interface UrlValidation {
  /** Normalized absolute URL, present only when valid. */
  readonly url?: string
  /** Lowercased hostname without brackets or trailing dot. */
  readonly hostname?: string
  readonly error?: string
}

const HAS_SCHEME = /^[a-z][a-z\d+\-.]*:\/\//i

/**
 * Validates a user-supplied target URL before any network activity:
 * http/https only, no embedded credentials, and no hostnames that only make
 * sense inside a private network (localhost, *.local, *.internal, literal
 * private IPs). DNS resolution is the caller's job — this function is pure.
 */
export function validateTargetUrl(raw: string): UrlValidation {
  const trimmed = raw.trim()
  if (trimmed === '') return { error: 'Enter a URL to check.' }
  if (trimmed.length > 2000)
    return { error: 'That URL is too long to be a real page address.' }

  const candidate = HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`
  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return { error: 'That does not look like a valid URL.' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: 'Only http and https URLs can be checked.' }
  }
  if (parsed.username !== '' || parsed.password !== '') {
    return { error: 'Remove the credentials (user:password@) from the URL.' }
  }

  let hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (hostname.startsWith('[') && hostname.endsWith(']')) hostname = hostname.slice(1, -1)
  if (hostname === '') return { error: 'That URL has no hostname.' }
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return { error: 'That hostname is not reachable from the public internet.' }
  }
  if (isIpLiteral(hostname) && isPrivateAddress(hostname)) {
    return { error: 'Private and internal IP addresses cannot be checked.' }
  }
  if (!hostname.includes('.') && !hostname.includes(':')) {
    return { error: 'Enter a full domain name, like example.com.' }
  }

  return { url: parsed.toString(), hostname }
}

/** True when the string is an IPv4 or IPv6 literal rather than a domain name. */
export function isIpLiteral(host: string): boolean {
  return host.includes(':') || parseIpv4(host) !== undefined
}

function parseIpv4(ip: string): number[] | undefined {
  const parts = ip.split('.')
  if (parts.length !== 4) return undefined
  const octets: number[] = []
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return undefined
    const n = Number(part)
    if (n > 255) return undefined
    octets.push(n)
  }
  return octets
}

function isPrivateIpv4(octets: readonly number[]): boolean {
  const a = octets[0] ?? 0
  const b = octets[1] ?? 0
  if (a === 0) return true // "this network"
  if (a === 10) return true // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true // 100.64.0.0/10 CGNAT
  if (a === 127) return true // loopback
  if (a === 169 && b === 254) return true // link-local
  if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12
  if (a === 192 && b === 168) return true // 192.168.0.0/16
  return false
}

/** Expands an IPv6 literal (including embedded IPv4 tails) into 8 hextets. */
function parseIpv6(ip: string): number[] | undefined {
  let s = ip
  // Rewrite an embedded IPv4 tail (::ffff:10.0.0.1) as two hex groups.
  if (s.includes('.')) {
    const lastColon = s.lastIndexOf(':')
    if (lastColon === -1) return undefined
    const v4 = parseIpv4(s.slice(lastColon + 1))
    if (v4 === undefined) return undefined
    const a = v4[0] ?? 0
    const b = v4[1] ?? 0
    const c = v4[2] ?? 0
    const d = v4[3] ?? 0
    const g6 = ((a << 8) | b).toString(16)
    const g7 = ((c << 8) | d).toString(16)
    s = `${s.slice(0, lastColon + 1)}${g6}:${g7}`
  }

  const halves = s.split('::')
  if (halves.length > 2) return undefined
  const splitGroups = (part: string | undefined): string[] =>
    part === undefined || part === '' ? [] : part.split(':')
  const left = splitGroups(halves[0])
  const right = halves.length === 2 ? splitGroups(halves[1]) : []

  let groupStrings: string[]
  if (halves.length === 1) {
    if (left.length !== 8) return undefined
    groupStrings = left
  } else {
    if (left.length + right.length > 7) return undefined
    const fill = new Array<string>(8 - left.length - right.length).fill('0')
    groupStrings = [...left, ...fill, ...right]
  }

  const groups: number[] = []
  for (const g of groupStrings) {
    if (!/^[0-9a-f]{1,4}$/i.test(g)) return undefined
    groups.push(Number.parseInt(g, 16))
  }
  return groups
}

/**
 * True when an IP belongs to a range that must never be fetched server-side:
 * IPv4 loopback/private/link-local/CGNAT ranges, IPv6 loopback (::1),
 * unspecified (::), unique-local (fc00::/7), link-local (fe80::/10), and
 * IPv4-mapped or -compatible addresses whose embedded IPv4 is private.
 * Anything that fails to parse is treated as private — this is a security
 * gate and it fails closed.
 */
export function isPrivateAddress(ip: string): boolean {
  const cleaned = ip.trim().toLowerCase().replace(/%.*$/, '')
  if (cleaned === '') return true

  if (!cleaned.includes(':')) {
    const octets = parseIpv4(cleaned)
    if (octets === undefined) return true
    return isPrivateIpv4(octets)
  }

  const groups = parseIpv6(cleaned)
  if (groups === undefined) return true
  const g0 = groups[0] ?? 0
  const g5 = groups[5] ?? 0
  const g6 = groups[6] ?? 0
  const g7 = groups[7] ?? 0

  const firstSixZero = groups.slice(0, 6).every((g) => g === 0)
  if (firstSixZero && g6 === 0 && g7 === 0) return true // :: unspecified
  if (firstSixZero && g6 === 0 && g7 === 1) return true // ::1 loopback
  if ((g0 & 0xfe00) === 0xfc00) return true // fc00::/7 unique local
  if ((g0 & 0xffc0) === 0xfe80) return true // fe80::/10 link local

  const firstFiveZero = groups.slice(0, 5).every((g) => g === 0)
  if (firstFiveZero && (g5 === 0xffff || g5 === 0)) {
    // IPv4-mapped (::ffff:a.b.c.d) or deprecated IPv4-compatible (::a.b.c.d)
    const embedded = [g6 >> 8, g6 & 0xff, g7 >> 8, g7 & 0xff]
    return isPrivateIpv4(embedded)
  }

  return false
}

// ---------------------------------------------------------------------------
// Report assembly
// ---------------------------------------------------------------------------

export interface BotAccess {
  readonly name: string
  readonly company: string
  readonly purpose: string
  readonly allowed: boolean
  readonly source: BotVerdict['source']
  readonly matchedRule?: string
}

export type CheckId =
  | 'crawlers'
  | 'structured-data'
  | 'basics'
  | 'llms-txt'
  | 'sitemap'
  | 'noai'

export interface CheckResult {
  readonly id: CheckId
  readonly label: string
  readonly status: CheckStatus
  readonly finding: string
  readonly fix: string
  /** noai is informational and excluded from the score. */
  readonly scored: boolean
}

export interface ReportInput {
  /** The URL that was actually analyzed after redirects. */
  readonly url: string
  /** robots.txt body when it returned 200; undefined when missing/unfetchable. */
  readonly robotsText?: string
  /** llms.txt outcome; undefined when the request itself failed. */
  readonly llms?: { readonly status: number; readonly bytes: number }
  readonly html: string
  readonly xRobotsTag?: string
  /** Status of GET /sitemap.xml, probed only when robots.txt declares none. */
  readonly sitemapProbeStatus?: number
}

export interface VisibilityReport {
  readonly url: string
  readonly score: number
  readonly band: BandLabel
  readonly bots: readonly BotAccess[]
  readonly allowedBotCount: number
  readonly checks: readonly CheckResult[]
  readonly jsonLdTypes: readonly string[]
}

/**
 * Runs every check against pre-fetched raw material and assembles the final
 * report. Pure and synchronous — the whole verdict pipeline is testable with
 * string fixtures.
 */
export function buildReport(input: ReportInput): VisibilityReport {
  const robotsMissing = input.robotsText === undefined
  const robots = parseRobots(input.robotsText ?? '')

  const bots: BotAccess[] = AI_BOTS.map((spec) => {
    const verdict = robotsMissing
      ? ({ allowed: true, source: 'default' } as const)
      : evaluateBot(robots, spec.name, '/')
    return {
      name: spec.name,
      company: spec.company,
      purpose: spec.purpose,
      allowed: verdict.allowed,
      source: verdict.source,
      ...(verdict.matchedRule !== undefined ? { matchedRule: verdict.matchedRule } : {}),
    }
  })
  const allowedBotCount = bots.filter((b) => b.allowed).length
  const crawlerFraction = AI_BOTS.length === 0 ? 0 : allowedBotCount / AI_BOTS.length

  const checks: CheckResult[] = []

  // 1. Crawler access — weight 40
  const blockedNames = bots.filter((b) => !b.allowed).map((b) => b.name)
  const crawlerStatus: CheckStatus =
    blockedNames.length === 0
      ? 'pass'
      : blockedNames.length === bots.length
        ? 'fail'
        : 'warn'
  checks.push({
    id: 'crawlers',
    label: 'AI crawler access',
    status: crawlerStatus,
    finding: robotsMissing
      ? 'No robots.txt was found, so every crawler — AI or otherwise — is allowed by default.'
      : blockedNames.length === 0
        ? `robots.txt allows all ${bots.length} AI crawlers we check to fetch your homepage.`
        : `robots.txt blocks ${blockedNames.length} of ${bots.length} AI crawlers: ${blockedNames.join(', ')}.`,
    fix:
      blockedNames.length === 0
        ? 'Nothing to fix. If you ever want to opt out of AI training, add per-bot Disallow groups rather than blocking everything.'
        : 'If the blocking is unintentional, remove the Disallow rules for those user-agents (or add explicit Allow groups). If it is deliberate, no change needed — see the noai check below for the finer-grained option.',
    scored: true,
  })

  // 2. Structured data — weight 20
  const jsonLd = extractJsonLd(input.html)
  const structuredStatus: CheckStatus = jsonLd.types.length > 0 ? 'pass' : 'fail'
  checks.push({
    id: 'structured-data',
    label: 'Structured data (JSON-LD)',
    status: structuredStatus,
    finding:
      jsonLd.types.length > 0
        ? `Found ${jsonLd.parsedCount} JSON-LD block${jsonLd.parsedCount === 1 ? '' : 's'} declaring: ${jsonLd.types.join(', ')}.`
        : jsonLd.blockCount > 0
          ? `Found ${jsonLd.blockCount} JSON-LD block${jsonLd.blockCount === 1 ? '' : 's'} but none parsed as valid JSON.`
          : 'No JSON-LD structured data on the homepage — AI engines have to infer what your site is instead of being told.',
    fix:
      jsonLd.types.length > 0
        ? 'Nothing to fix. Consider adding FAQPage or Article schema on content pages too.'
        : 'Add a <script type="application/ld+json"> block with at least Organization or WebSite schema. Our Schema Markup Generator builds it for you.',
    scored: true,
  })

  // 3. On-page basics — weight 20
  const basics = analyzeBasics(input.html)
  const basicsMissing: string[] = []
  if (basics.title === undefined) basicsMissing.push('title tag')
  if (basics.description === undefined) basicsMissing.push('meta description')
  if (basics.h1Count === 0) basicsMissing.push('h1 heading')
  if (basics.h2Count < 2) basicsMissing.push('h2 section headings')
  if (basics.lang === undefined) basicsMissing.push('lang attribute')
  const basicsStatus: CheckStatus =
    basicsMissing.length === 0 ? 'pass' : basicsMissing.length <= 2 ? 'warn' : 'fail'
  checks.push({
    id: 'basics',
    label: 'On-page basics AI answers rely on',
    status: basicsStatus,
    finding:
      basicsMissing.length === 0
        ? `All five basics present: title, meta description, ${basics.h1Count} h1, ${basics.h2Count} h2 headings, lang="${basics.lang ?? ''}".`
        : `Missing or weak: ${basicsMissing.join(', ')}.`,
    fix:
      basicsMissing.length === 0
        ? 'Nothing to fix. Keep headings descriptive — engines quote them as answer anchors.'
        : 'Add the missing elements. Answer engines lean on the title, description and heading outline to decide what a page answers.',
    scored: true,
  })

  // 4. llms.txt — weight 10
  const llmsPresent = input.llms !== undefined && input.llms.status === 200
  checks.push({
    id: 'llms-txt',
    label: 'llms.txt',
    status: llmsPresent ? 'pass' : 'warn',
    finding: llmsPresent
      ? `/llms.txt is present (${formatBytes(input.llms?.bytes ?? 0)}) — a curated map for AI systems.`
      : 'No /llms.txt found. It is an emerging standard, so this is normal — and an easy win.',
    fix: llmsPresent
      ? 'Nothing to fix. Keep it updated when your key pages change.'
      : 'Publish a plain-markdown /llms.txt listing your most important pages with one-line summaries. It takes ten minutes.',
    scored: true,
  })

  // 5. Sitemap — weight 10
  const sitemapDeclared = robots.sitemaps.length > 0
  const sitemapResponds = input.sitemapProbeStatus === 200
  const sitemapStatus: CheckStatus = sitemapDeclared || sitemapResponds ? 'pass' : 'fail'
  checks.push({
    id: 'sitemap',
    label: 'XML sitemap',
    status: sitemapStatus,
    finding: sitemapDeclared
      ? `robots.txt declares ${robots.sitemaps.length} sitemap${robots.sitemaps.length === 1 ? '' : 's'}.`
      : sitemapResponds
        ? '/sitemap.xml responds, but robots.txt does not declare it.'
        : 'No sitemap declared in robots.txt and /sitemap.xml did not respond.',
    fix: sitemapDeclared
      ? 'Nothing to fix.'
      : sitemapResponds
        ? 'Add a "Sitemap: https://…/sitemap.xml" line to robots.txt so crawlers find it without guessing.'
        : 'Generate an XML sitemap and declare it in robots.txt — it is how crawlers discover pages beyond your homepage.',
    scored: true,
  })

  // 6. noai signals — informational, not scored
  const noaiSignals = detectNoaiSignals(input.html, input.xRobotsTag)
  checks.push({
    id: 'noai',
    label: 'noai signals',
    status: noaiSignals.length > 0 ? 'warn' : 'pass',
    finding:
      noaiSignals.length > 0
        ? `Found: ${noaiSignals.join('; ')}. This asks AI systems not to use your content — a legitimate choice.`
        : 'No noai or noimageai directives found in the meta robots tag or X-Robots-Tag header.',
    fix:
      noaiSignals.length > 0
        ? 'No fix needed if this is intentional. If it is a leftover from a plugin or theme, remove it to allow AI use of your content.'
        : 'Nothing to do. If you want to opt out of AI use without blocking crawlers, add "noai" to your meta robots tag.',
    scored: false,
  })

  const { score, band } = computeScore({
    crawlerFraction,
    structuredData: structuredStatus,
    basicsFraction: basics.presentCount / 5,
    llmsTxt: llmsPresent ? 'pass' : 'warn',
    sitemap: sitemapStatus,
  })

  return {
    url: input.url,
    score,
    band,
    bots,
    allowedBotCount,
    checks,
    jsonLdTypes: jsonLd.types,
  }
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

// ---------------------------------------------------------------------------
// API response types shared with the component
// ---------------------------------------------------------------------------

export type ApiErrorCode = 'invalid-url' | 'private-address' | 'unreachable' | 'blocked'

export interface ApiError {
  readonly error: string
  readonly code: ApiErrorCode
  readonly httpStatus?: number
}

/** Type guard for the error payload the Route Handler returns on failure. */
export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.error === 'string' && typeof record.code === 'string'
}

// ---------------------------------------------------------------------------
// Shareable plain-text rendering
// ---------------------------------------------------------------------------

/**
 * Renders a finished report as plain text for the clipboard.
 *
 * Purpose  the audience for this verdict is usually not the person who ran it —
 *          it is whoever owns the server. A pasteable block that carries the
 *          per-bot verdicts *and the rule that produced each one* is what makes
 *          the report actionable in a ticket or a Slack thread.
 * Inputs   a `VisibilityReport` as returned by `buildReport`.
 * Outputs  newline-joined plain text. No markup, no escaping concerns — the
 *          quoted robots rules are third-party content and stay inert text.
 * Failure  none; every field it reads is non-optional on the report contract
 *          except `matchedRule`, which is explicitly branched on.
 *
 * Lives here rather than in the component because it is pure string assembly
 * over the report contract, and a contract change should break a test rather
 * than silently truncate what someone pastes to their developer.
 */
export function formatReportText(report: VisibilityReport): string {
  const lines: string[] = [
    `AI visibility report — ${report.url}`,
    `Score: ${report.score}/100 — ${report.band}`,
    `AI crawlers allowed: ${report.allowedBotCount} of ${report.bots.length}`,
    '',
    'Per-bot robots.txt verdicts (rule that decided, verbatim)',
  ]

  for (const bot of report.bots) {
    const reason =
      bot.matchedRule !== undefined
        ? `${bot.matchedRule} — from ${
            bot.source === 'specific'
              ? 'a group naming this bot'
              : 'the User-agent: * group'
          }`
        : bot.source === 'default'
          ? 'robots.txt names no group for it, so it is allowed by default'
          : 'a group matched but no rule applies to /'
    lines.push(
      `- ${bot.name} (${bot.company}): ${bot.allowed ? 'ALLOWED' : 'BLOCKED'} — ${reason}`,
    )
  }

  lines.push('', 'Checks')
  for (const check of report.checks) {
    lines.push(
      `- [${check.status.toUpperCase()}] ${check.label}${
        check.scored ? '' : ' (informational, not scored)'
      }`,
      `  Finding: ${check.finding}`,
      `  Fix: ${check.fix}`,
    )
  }

  lines.push('', 'Checked with tools.scult.in/geo/ai-visibility-checker')
  return lines.join('\n')
}

/** Type guard for a successful report payload. */
export function isVisibilityReport(value: unknown): value is VisibilityReport {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.score === 'number' &&
    typeof record.band === 'string' &&
    Array.isArray(record.bots) &&
    Array.isArray(record.checks)
  )
}
