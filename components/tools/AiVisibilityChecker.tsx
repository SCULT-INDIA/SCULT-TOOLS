'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import {
  Building2,
  Calendar,
  CircleCheck,
  CircleX,
  Download,
  FileJson,
  FileText,
  HardDrive,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Link2,
  ListChecks,
  Mail,
  Minus,
  Phone,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  SegmentButton,
  StatCard,
  StatusBar,
  StepTimeline,
  type TimelineStep,
  ToolbarAction,
  ToolbarGroup,
  ToolToolbar,
  useDialogBehavior,
} from '@/components/tools/workspace'
import { BrandIcon, brandForCompany } from '@/components/ui/BrandIcon'
import { trackToolEvent } from '@/lib/analytics'
import { downloadTextFile, slugifyUrlForFilename } from '@/lib/download-file'
import { parentLink, SITE } from '@/lib/site'
import {
  AI_BOTS,
  type ApiError,
  type BandLabel,
  type BotAccess,
  type BotSpec,
  CHECK_WEIGHT,
  type CheckResult,
  type CheckStatus,
  formatBytes,
  formatReportMarkdown,
  formatReportText,
  isApiError,
  isVisibilityReport,
  type PageInsights,
  REPORT_CATEGORIES,
  type ReportCategory,
  type VisibilityReport,
  validateTargetUrl,
} from '@/lib/tools/ai-visibility-checker/logic'
import scultMark from '@/public/brand/scult-mark.png'

/**
 * AI visibility checker — single-column report, no left/right split.
 * Research brief: docs/research/ai-visibility-checker.md
 *
 * This is a submit-step tool — one of only two here that cannot compute in the
 * browser (the other is the website speed test). A browser cannot read another
 * origin's robots.txt, so every run is a real server-side fetch of somebody
 * else's site: four requests, once each. It must never run as you type.
 *
 * The centrepiece is the per-bot verdict. Competitors that produce a score never
 * show you a robots rule, and the robots validators that show you a rule never
 * score or audit — so every bot card carries the verdict, the rule that produced
 * it quoted verbatim, AND which User-agent group won. That last part is the USP:
 * robots precedence (a bot-specific group beating `*`, longest matching path
 * winning inside the group) is the single most misread thing in the file, and
 * showing which group decided is the difference between a verdict and an
 * explanation.
 *
 * Everything this file renders was computed by the pure functions in logic.ts,
 * which owns RFC 9309 precedence, JSON-LD extraction, scoring and the SSRF gate.
 * Nothing here re-derives a verdict.
 *
 * The 12 checks are grouped into 4 categories (crawler access, structured data
 * & content, discovery & indexing, technical & social) rather than one flat
 * list — a jump nav (same `chip-tool`/`scroll-mt-32` pattern as `/sitemap`)
 * lets a long report be skimmed instead of scrolled end to end. Two deliberate
 * departures from a literal "AI visibility" wireframe remain, because the
 * underlying tool checks robots.txt crawl access, not live answer-engine
 * mentions: the loading `StepTimeline` names the five real fetch/scoring
 * stages rather than named answer engines like "Gemini" or "Grok" (this tool
 * never queries those products), and every data point rendered is this
 * report's own — per-crawler robots.txt access, JSON-LD types actually found —
 * never a mention/citation/sentiment metric this tool has no way to produce.
 *
 * Two safety notes that are load-bearing:
 *   - Every quoted robots rule is untrusted third-party text. It is rendered as
 *     a JSX text child and clamped for length; no raw-HTML injection API is used
 *     anywhere in this file, so a grep for one finds nothing but this sentence.
 *   - Allowed/blocked is never colour alone. It is a word, plus glyphs that
 *     differ in shape, so it survives greyscale and forced-colours themes.
 */

const LAST_URL_KEY = 'scult-tools:ai-visibility-checker:v1'

/**
 * "Compare to your last checks" storage — a short per-origin history (up to
 * 5 most recent results, oldest first) so re-checking a domain can show an
 * honest trend: your own device's memory of your own past runs, not a
 * fabricated one. Keyed by `new URL(x).origin` rather than the full URL so
 * https://example.com/ and https://example.com/about share one history.
 * Versioned `:v2` because the stored shape changed from "one entry" to "an
 * array" — old `:v1` data is simply ignored rather than mis-parsed.
 */
const HISTORY_KEY = 'scult-tools:ai-visibility-checker:history:v2'
const MAX_HISTORY_PER_ORIGIN = 5

/** One remembered result — score plus when it was recorded. */
type HistoryEntry = { readonly score: number; readonly checkedAt: string }

/** The comparison rendered next to the score: how many points moved, and
 * when the prior check that set the baseline happened. */
type ScoreDelta = { readonly deltaPoints: number; readonly previousCheckedAt: string }

/** Best-effort read of one origin's remembered history, oldest first. Malformed
 * or missing storage is not an error — it just means no trend renders. */
function readHistory(origin: string): readonly HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return []
    const entries = (parsed as Record<string, unknown>)[origin]
    if (!Array.isArray(entries)) return []
    return entries.filter(
      (e): e is HistoryEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as HistoryEntry).score === 'number' &&
        typeof (e as HistoryEntry).checkedAt === 'string',
    )
  } catch {
    return []
  }
}

/** Overwrites one origin's remembered history with the full (already-capped)
 * list — the caller decides what to keep, this only persists it. */
function writeHistory(origin: string, entries: readonly HistoryEntry[]): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const all: Record<string, readonly HistoryEntry[]> =
      raw !== null ? (JSON.parse(raw) as Record<string, readonly HistoryEntry[]>) : {}
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ ...all, [origin]: entries }))
  } catch {
    // Private mode or storage full — history just won't persist for next time.
  }
}

/** "Aug 3", or "Aug 3, 2025" when the remembered check is from a different
 * calendar year — dropping the year for anything recent reads naturally,
 * but silently calling a year-old check "recent" would misrepresent it. */
function formatCheckedDate(iso: string): string {
  const then = new Date(iso)
  const now = new Date()
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (then.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return new Intl.DateTimeFormat('en-US', opts).format(then)
}

/** Seeded so the first paint has a real, checkable URL rather than an empty
 * box — the site's own subdomain, not the parent site, so the tool's first
 * impression is a self-audit rather than a check of a different host. */
const SAMPLE_URL = SITE.url

const LOADING_STAGES = [
  'Fetching the homepage…',
  'Fetching robots.txt…',
  'Checking /llms.txt and the sitemap…',
  'Reading structured data and headings…',
  'Applying robots precedence and scoring…',
] as const

/** Short labels for the step timeline dots — the same five stages, condensed to fit. */
const STAGE_STEP_LABELS = [
  'Homepage',
  'robots.txt',
  'llms.txt & sitemap',
  'Structured data',
  'Scoring',
] as const

const STATUS_LABEL: Record<CheckStatus, string> = {
  pass: 'Pass',
  warn: 'Check',
  fail: 'Fix',
}

/**
 * Hero styling — the report's one dominant panel. It is a solid violet-900
 * fill with white text, not another light pastel tile: the same
 * theme-invariant dark-block idiom the site footer already uses (see
 * `Footer.tsx`'s `bg-violet-900 text-white`), so it needs no dark-mode
 * override of its own and reads as a genuinely different KIND of surface
 * from every card-flat/card-modern box below it, not just a bigger one.
 *
 * The verdict badge sitting on top of that fill is a fixed-white pill —
 * literal `text-black`, never adaptive `text-ink`, same rule as every other
 * theme-fixed fill in this file. Only the border carries a per-band accent;
 * the band word itself still carries the verdict on its own.
 */
const BAND_ICON: Record<BandLabel, typeof CircleCheck> = {
  'AI-visible': CircleCheck,
  'Partially visible': TriangleAlert,
  'Mostly invisible to AI': CircleX,
}

const BAND_BADGE_BORDER: Record<BandLabel, string> = {
  'AI-visible': 'border-green',
  'Partially visible': 'border-cta-pure',
  'Mostly invisible to AI': 'border-violet-700',
}

/** Hero progress-bar fill — bright enough to read on the violet-900 panel. */
const HERO_BAR_TONE: Record<BandLabel, string> = {
  'AI-visible': 'bg-green',
  'Partially visible': 'bg-cta-pure',
  'Mostly invisible to AI': 'bg-white/70',
}

/**
 * The real company behind every crawler name, shown once per group instead
 * of repeated on every card — OpenAI alone ships three bots, and spelling
 * out "OpenAI" three times in a row is exactly the redundancy a clean layout
 * should remove. Grouping also means every AI company this tool checks gets
 * its official mark shown at least once, which a flat per-bot list would
 * bury in ten near-identical cards.
 *
 * Generic over `BotSpec`/`BotAccess` — the pre-run legend and loading state
 * only have the spec (no verdict yet); the finished report adds `allowed`.
 * Grouping the same way in both keeps the layout identical before and after
 * a run, so nothing has to be relearned once the report replaces the legend.
 */
function groupByCompany<T extends { readonly company: string }>(
  bots: readonly T[],
): { company: string; bots: T[] }[] {
  const groups: { company: string; bots: T[] }[] = []
  for (const bot of bots) {
    const existing = groups.find((g) => g.company === bot.company)
    if (existing) existing.bots.push(bot)
    else groups.push({ company: bot.company, bots: [bot] })
  }
  return groups
}

/** A company's mark on a white chip, or a neutral building glyph when no
 * official mark is available (Common Crawl has none in either icon set) —
 * a plain fallback beats guessing at a logo. */
function CompanyLogo({ company, size = 22 }: { company: string; size?: number }) {
  const brand = brandForCompany(company)
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[10px] border border-line-grey bg-white"
      style={{ width: size + 14, height: size + 14 }}
    >
      {brand ? (
        <BrandIcon brand={brand} size={size} />
      ) : (
        <Building2 className="size-4 text-ink-subtle" aria-hidden="true" />
      )}
    </span>
  )
}

/**
 * The full, verbose per-crawler legend — company mark, name and what each
 * bot feeds. Lives inside the collapsed "what each crawler does" disclosure
 * (see `PreRunLegend`) rather than always on screen; `CompactSpecGroup` below
 * is what's shown by default.
 */
function CompanySpecGroup({
  company,
  bots,
}: {
  company: string
  bots: readonly BotSpec[]
}) {
  return (
    <div className="card-modern p-4">
      <div className="flex items-center gap-3">
        <CompanyLogo company={company} />
        <div className="min-w-0">
          <p className="font-display font-semibold text-[15px] text-ink">{company}</p>
          <p className="text-[12px] text-ink-subtle">
            {bots.length === 1 ? '1 crawler' : `${bots.length} crawlers`}
          </p>
        </div>
      </div>
      <div className="mt-1">
        {bots.map((bot) => (
          <div
            key={bot.name}
            className="border-line-grey border-t px-1 py-2.5 first:border-t-0 first:pt-0"
          >
            <p className="font-mono font-medium text-[13px] text-ink">{bot.name}</p>
            <p className="text-[12px] text-ink-subtle">{bot.purpose}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Compact, always-visible stand-in for `CompanySpecGroup` — logo, name and a
 * crawler count only, no per-bot purpose text. Cuts the pre-run legend's
 * vertical footprint roughly in half; the full detail is one click away. */
function CompactSpecGroup({
  company,
  bots,
}: {
  company: string
  bots: readonly BotSpec[]
}) {
  return (
    <div className="flex items-center gap-2 rounded-card border border-line-grey bg-white p-2.5">
      <CompanyLogo company={company} size={16} />
      <div className="min-w-0">
        <p className="truncate font-display font-semibold text-[12.5px] text-ink">
          {company}
        </p>
        <p className="text-[11px] text-ink-subtle">
          {bots.length === 1 ? '1 crawler' : `${bots.length} crawlers`}
        </p>
      </div>
    </div>
  )
}

/**
 * What each check looks at and what it is worth. Lives inside the same
 * collapsed disclosure as `CompanySpecGroup` — pre-run education, not
 * always-on chrome.
 */
const CHECK_LEGEND: readonly { label: string; weight: string; meaning: string }[] = [
  {
    label: 'AI crawler access',
    weight: '40 pts',
    meaning: `The effective robots.txt rule for the path “/” for each of the ${AI_BOTS.length} crawlers above.`,
  },
  {
    label: 'Structured data (JSON-LD)',
    weight: '20 pts',
    meaning:
      'Every ld+json block on your homepage, and the @type values it declares — what you tell engines you are, instead of making them guess.',
  },
  {
    label: 'On-page basics',
    weight: '20 pts',
    meaning:
      'Nine signals answer engines quote: title, meta description, an h1, at least two h2s, a lang attribute, Open Graph tags, a canonical link, image alt-text coverage, and a minimum word count so a near-empty page cannot pass by accident.',
  },
  {
    label: 'llms.txt',
    weight: '10 pts',
    meaning: 'Whether /llms.txt exists — a curated markdown map for AI systems.',
  },
  {
    label: 'XML sitemap',
    weight: '10 pts',
    meaning: 'A Sitemap: line in robots.txt, or a /sitemap.xml that responds.',
  },
  {
    label: 'HTTPS, mobile viewport, rich schema, author & social signals',
    weight: 'not scored',
    meaning:
      'Seven further signals reported for context — HTTPS, a mobile viewport tag, FAQ/Article/HowTo-style schema, author/byline/publish-date signals, Twitter Card completeness, and noai/noindex directives. Not part of the 100-point score, but each has its own fix.',
  },
]

const MAX_RULE_CHARS = 120

/**
 * Robots rules come from a stranger's server. Only a prefix of “/” can win for
 * the path “/”, so the longest rule a site can push into this column is a run of
 * wildcards — cheap to abuse, and a 100 KB cell would destroy the layout. Clamp
 * for display; the clipboard copy keeps the rule whole.
 */
function clampRule(rule: string): { text: string; full?: string } {
  if (rule.length <= MAX_RULE_CHARS) return { text: rule }
  return { text: `${rule.slice(0, MAX_RULE_CHARS)}…`, full: rule.slice(0, 400) }
}

/** Pass / Check / Fix — icon shape plus a word, never colour on its own. */
function StatusBadge({ status }: { status: CheckStatus }) {
  const Glyph =
    status === 'pass' ? CircleCheck : status === 'warn' ? TriangleAlert : CircleX
  return (
    <span className="flex shrink-0 items-center gap-1.5 font-semibold text-[13px] text-ink uppercase tracking-wide">
      <Glyph
        className={`size-4 ${status === 'pass' ? 'text-green' : 'text-violet-700'}`}
        aria-hidden="true"
      />
      {STATUS_LABEL[status]}
    </span>
  )
}

/** The reading for one bot, so it carries a word AND a distinct shape. */
function AccessCell({ allowed }: { allowed: boolean }) {
  return (
    <span className="flex items-center gap-1.5 font-semibold text-[14px] text-ink">
      {allowed ? (
        <CircleCheck className="size-4 shrink-0 text-green" aria-hidden="true" />
      ) : (
        <CircleX className="size-4 shrink-0 text-violet-700" aria-hidden="true" />
      )}
      {allowed ? 'Allowed' : 'Blocked'}
    </span>
  )
}

/**
 * The detail nobody else ships: the rule that decided, quoted, and the group it
 * came from. `source` distinguishes a bot-specific group (which beats `*`
 * outright) from the wildcard group from robots.txt saying nothing at all.
 */
function RuleCell({ bot }: { bot: BotAccess }) {
  if (bot.matchedRule === undefined) {
    return (
      <>
        <span className="block text-[13px] text-ink-muted">
          {bot.source === 'default' ? 'No group names this bot' : 'No rule covers “/”'}
        </span>
        <span className="mt-0.5 block text-[12px] text-ink-subtle leading-4">
          {bot.source === 'default'
            ? 'robots.txt is silent about it, so it is allowed by default'
            : bot.source === 'wildcard'
              ? 'the User-agent: * group matched, but none of its rules apply'
              : 'a group names it, but none of its rules apply'}
        </span>
      </>
    )
  }

  const { text, full } = clampRule(bot.matchedRule)
  return (
    <>
      {/* Untrusted text from the target's robots.txt — rendered as text only. */}
      <code
        className="block break-all font-mono text-[12px] text-ink"
        {...(full !== undefined ? { title: full } : {})}
      >
        {text}
      </code>
      <span className="mt-0.5 block text-[12px] text-ink-subtle leading-4">
        from{' '}
        {bot.source === 'specific'
          ? 'a group naming this bot — it beats User-agent: *'
          : 'the User-agent: * group'}
      </span>
    </>
  )
}

/**
 * One crawler's verdict, nested inside its company's group card — the
 * company mark and name already sit in the group header above, so this row
 * carries only what's specific to this one bot: its own name, what it
 * feeds, and its own verdict and matched rule.
 */
function BotCard({ bot }: { bot: BotAccess }) {
  return (
    <div className="flex flex-col gap-1.5 border-line-grey border-t px-1 py-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <p className="font-mono font-medium text-[13px] text-ink" title={bot.name}>
            {bot.name}
          </p>
          <p className="text-[12px] text-ink-subtle">{bot.purpose}</p>
        </div>
        <AccessCell allowed={bot.allowed} />
      </div>
      <div className="text-[12px] leading-4">
        <RuleCell bot={bot} />
      </div>
    </div>
  )
}

/**
 * A company's crawler(s), grouped under one header carrying its official
 * mark, name, and an allowed/total summary — the summary alone tells you
 * whether to even open this group, without scanning individual rows.
 *
 * `bots` (every crawler this company runs) and `visible` (the subset the
 * "Blocked only" toolbar filter currently shows) are separate on purpose:
 * the badge always describes the whole company, even while the filter
 * hides its passing crawlers from the list below it.
 */
function CompanyBotGroup({
  company,
  bots,
  visible,
}: {
  company: string
  bots: readonly BotAccess[]
  visible: readonly BotAccess[]
}) {
  const allowedCount = bots.filter((b) => b.allowed).length
  return (
    <div className="card-modern p-4">
      <div className="flex items-center gap-3">
        <CompanyLogo company={company} />
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-[15px] text-ink">{company}</p>
          <p className="text-[12px] text-ink-subtle">
            {bots.length === 1 ? '1 crawler' : `${bots.length} crawlers`}
          </p>
        </div>
        {/* bg-tile-* and bg-peach are theme-fixed light pastels — text and
            border must be literal black, never adaptive ink (which flips
            near-white in dark mode and vanishes against the still-light
            fill). */}
        <span
          className={`shrink-0 rounded-pill border border-black px-2.5 py-1 font-semibold text-[12px] text-black ${
            allowedCount === bots.length
              ? 'bg-tile-green'
              : allowedCount === 0
                ? 'bg-peach'
                : 'bg-tile-yellow'
          }`}
        >
          {allowedCount}/{bots.length} allowed
        </span>
      </div>
      <div className="mt-1">
        {visible.map((bot) => (
          <BotCard key={bot.name} bot={bot} />
        ))}
      </div>
    </div>
  )
}

/**
 * Pure reference row, no card — used inside each category section's check
 * list, the single most passive content on the page (everything actionable
 * already surfaced in "What to fix").
 */
function CheckCard({ check }: { check: CheckResult }) {
  return (
    <div className="flex flex-col gap-1.5 py-3">
      <div className="flex items-start justify-between gap-3">
        <h5 className="font-display font-semibold text-[14px] text-ink">
          {check.label}
          {check.scored ? null : (
            <span className="ml-2 font-sans font-normal text-[12px] text-ink-subtle">
              informational — not scored
            </span>
          )}
        </h5>
        <StatusBadge status={check.status} />
      </div>
      <p className="text-[13px] text-ink-muted leading-5">{check.finding}</p>
      <p className="text-[13px] text-ink leading-5">
        <span className="font-semibold">Fix: </span>
        {check.fix}
      </p>
    </div>
  )
}

/**
 * One outstanding fix, ranked by how many points it's worth — the whole
 * point of this section is answering "what should I do first", and impact
 * order answers that better than the checks' fixed display order.
 */
function FixCard({ check, rank }: { check: CheckResult; rank: number }) {
  const weight = CHECK_WEIGHT[check.id]
  return (
    <div className="card-flat flex gap-3.5 p-4 transition-colors duration-150 hover:border-ink">
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ink bg-cta font-bold text-[13px] text-ink"
        aria-hidden="true"
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="font-display font-semibold text-[15px] text-ink">
            {check.label}
          </h5>
          {/* violet-700 is tuned for light surfaces; bg-cream is adaptive and
              goes near-black in dark mode, so both border and text use the
              dark-safe accent token (falls back to violet-700 in light mode,
              same idiom as .eyebrow/nav-link hover elsewhere on the site). */}
          <span className="shrink-0 rounded-pill border border-[var(--color-violet-accent-text,var(--color-violet-700))] bg-cream px-2.5 py-0.5 font-semibold text-[12px] text-[var(--color-violet-accent-text,var(--color-violet-700))]">
            Worth {weight} pts
          </span>
        </div>
        <p className="mt-1.5 text-[14px] text-ink-muted leading-5">{check.finding}</p>
        {/* bg-violet-50 is theme-fixed light (no dark-mode override exists
            for it — confirmed against globals.css) — text on it must be
            literal black, never adaptive ink-body, which flips near-white in
            dark mode and would go invisible against this still-light fill. */}
        <div className="mt-2.5 flex items-start gap-2 rounded-card bg-violet-50 p-3">
          <Sparkles
            className="mt-0.5 size-4 shrink-0 text-violet-700"
            aria-hidden="true"
          />
          <p className="text-[14px] text-black leading-5">{check.fix}</p>
        </div>
      </div>
    </div>
  )
}

const JUMP_SECTIONS: readonly { id: string; label: string }[] = [
  { id: 'report-overview', label: 'Overview' },
  { id: 'what-to-fix', label: 'What to fix' },
  { id: 'insights', label: 'Website insights' },
  ...REPORT_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
]

/** One text field (title or meta description) shown verbatim with its exact
 * character count against the length search/AI engines typically don't
 * truncate at — a "pro" insight because it's the real string, not a
 * pass/fail verdict about whether one merely exists. */
function TextPreviewCard({
  label,
  text,
  length,
  idealMin,
  idealMax,
  emptyHint,
}: {
  label: string
  text: string | undefined
  length: number
  idealMin: number
  idealMax: number
  emptyHint: string
}) {
  const inRange = length >= idealMin && length <= idealMax
  const lengthTone =
    text === undefined ? 'text-ink-subtle' : inRange ? 'text-green' : 'text-violet-700'
  return (
    <div className="rounded-card border border-line-grey bg-white p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display font-semibold text-[14px] text-ink">{label}</span>
        <span className={`shrink-0 text-[12px] font-semibold tabular-nums ${lengthTone}`}>
          {length} chars
        </span>
      </div>
      {text !== undefined ? (
        <p className="mt-1.5 text-[14px] text-ink-muted leading-5">{text}</p>
      ) : (
        <p className="mt-1.5 text-[14px] text-ink-subtle leading-5 italic">{emptyHint}</p>
      )}
      <p className="mt-1.5 text-[12px] text-ink-subtle">
        Ideal length: {idealMin}–{idealMax} characters
      </p>
    </div>
  )
}

/**
 * "Pro" insights panel — the exact numbers behind the on-page basics check
 * (real title/description text, not just present/missing) plus two figures
 * the API route measures around its own fetch (response time, page size).
 * Purely descriptive, no pass/fail here — that's what the category sections
 * below are for.
 */
function WebsiteInsightsSection({ insights }: { insights: PageInsights }) {
  const responseTone =
    insights.homepageResponseMs === undefined
      ? 'lavender'
      : insights.homepageResponseMs < 1000
        ? 'green'
        : insights.homepageResponseMs < 3000
          ? 'yellow'
          : 'lavender'
  const sizeTone =
    insights.homepageSizeBytes === undefined
      ? 'lavender'
      : insights.homepageSizeBytes < 500_000
        ? 'green'
        : insights.homepageSizeBytes < 2_000_000
          ? 'yellow'
          : 'lavender'

  return (
    <section id="insights" aria-labelledby="insights-heading" className="scroll-mt-32">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4
          id="insights-heading"
          className="font-display font-semibold text-[19px] text-ink"
        >
          Website insights
        </h4>
        <span className="shrink-0 rounded-pill border border-[var(--color-violet-accent-text,var(--color-violet-700))] bg-cream px-2.5 py-0.5 font-semibold text-[12px] text-[var(--color-violet-accent-text,var(--color-violet-700))]">
          Pro
        </span>
      </div>
      <p className="mt-1 text-[14px] text-ink-muted leading-5">
        The exact numbers behind the on-page basics check, plus how fast your homepage
        responded.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextPreviewCard
          label="Title tag"
          text={insights.title}
          length={insights.titleLength}
          idealMin={30}
          idealMax={60}
          emptyHint="No <title> tag found."
        />
        <TextPreviewCard
          label="Meta description"
          text={insights.metaDescription}
          length={insights.metaDescriptionLength}
          idealMin={70}
          idealMax={160}
          emptyHint="No meta description found."
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          compact
          icon={FileText}
          label="Visible words"
          value={insights.wordCount}
          tone={insights.wordCount >= 150 ? 'green' : 'yellow'}
        />
        <StatCard
          compact
          icon={Heading1}
          label="H1 headings"
          value={insights.h1Count}
          tone={insights.h1Count === 1 ? 'green' : 'yellow'}
        />
        <StatCard
          compact
          icon={Heading2}
          label="H2 headings"
          value={insights.h2Count}
          tone={insights.h2Count >= 2 ? 'green' : 'yellow'}
        />
        <StatCard
          compact
          icon={ImageIcon}
          label="Alt-text coverage"
          value={`${insights.altTextCoveragePct}%`}
          tone={insights.altTextCoveragePct >= 80 ? 'green' : 'yellow'}
        />
        <StatCard
          compact
          icon={Timer}
          label="Response time"
          value={
            insights.homepageResponseMs !== undefined
              ? `${insights.homepageResponseMs}ms`
              : '—'
          }
          tone={responseTone}
        />
        <StatCard
          compact
          icon={HardDrive}
          label="Page size"
          value={
            insights.homepageSizeBytes !== undefined
              ? formatBytes(insights.homepageSizeBytes)
              : '—'
          }
          tone={sizeTone}
        />
      </div>
    </section>
  )
}

type CompanyBotGroupData = { company: string; bots: BotAccess[]; visible: BotAccess[] }

/**
 * One category's section: a pass/total + points chip, then whatever content
 * fits that category — the crawler matrix for crawler access, the JSON-LD
 * type chips for structured data, and a plain check-row list for the rest
 * (crawler access skips the row list entirely since the matrix above it
 * already carries that check's finding — repeating it as a row would be
 * pure duplication).
 */
function CategorySection({
  category,
  checks,
  botGroups,
  crawlerFinding,
  jsonLdTypes,
  totalBots,
}: {
  category: ReportCategory
  checks: readonly CheckResult[]
  botGroups: readonly CompanyBotGroupData[]
  crawlerFinding: string | undefined
  jsonLdTypes: readonly string[]
  totalBots: number
}) {
  const catChecks = category.checkIds
    .map((id) => checks.find((c) => c.id === id))
    .filter((c): c is CheckResult => c !== undefined)
  const passed = catChecks.filter((c) => c.status === 'pass').length
  const weight = category.checkIds.reduce((sum, id) => sum + CHECK_WEIGHT[id], 0)

  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
      className="scroll-mt-32"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4
          id={`${category.id}-heading`}
          className="font-display font-semibold text-[19px] text-ink"
        >
          {category.label}
        </h4>
        <span className="shrink-0 rounded-pill border border-[var(--color-violet-accent-text,var(--color-violet-700))] bg-cream px-2.5 py-0.5 font-semibold text-[12px] text-[var(--color-violet-accent-text,var(--color-violet-700))]">
          {passed}/{catChecks.length} pass{weight > 0 ? ` · ${weight} pts` : ''}
        </span>
      </div>

      {category.id === 'crawler-access' ? (
        <div className="mt-3">
          {crawlerFinding !== undefined ? (
            <p className="text-[14px] text-ink-muted leading-5">{crawlerFinding}</p>
          ) : null}
          {botGroups.length === 0 ? (
            <p className="mt-3 rounded-card border border-line-grey bg-tile-green p-3 text-[14px] text-black leading-5">
              Nothing is blocked — all {totalBots} crawlers are allowed.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {botGroups.map((group) => (
                <CompanyBotGroup
                  key={group.company}
                  company={group.company}
                  bots={group.bots}
                  visible={group.visible}
                />
              ))}
            </div>
          )}
          <p className="hint mt-2">
            A group naming the bot beats <span className="font-mono">User-agent: *</span>{' '}
            entirely — each card quotes whichever group won.
          </p>
        </div>
      ) : null}

      {category.id === 'structured-data' && jsonLdTypes.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {jsonLdTypes.map((type) => (
            <li
              key={type}
              className="rounded-pill border border-[var(--color-violet-accent-text,var(--color-violet-700))] bg-cream px-2.5 py-1 font-medium text-[13px] text-[var(--color-violet-accent-text,var(--color-violet-700))]"
            >
              {type}
            </li>
          ))}
        </ul>
      ) : null}

      {category.id !== 'crawler-access' ? (
        <div className="mt-3 divide-y divide-line border-line border-t">
          {catChecks.map((check) => (
            <CheckCard key={check.id} check={check} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

/** Hand-rolled inline sparkline (no charting library exists in this repo) —
 * renders only once ≥2 remembered checks exist for this origin. White on the
 * hero's violet-900 fill, decorative (`aria-hidden`): the text delta line
 * beside it already states the real number in words. */
function ScoreSparkline({ history }: { history: readonly HistoryEntry[] }) {
  const width = 110
  const height = 30
  const points = history.map((h, i) => ({
    x: history.length === 1 ? width : (i / (history.length - 1)) * width,
    y: height - (h.score / 100) * height,
  }))
  const pointsAttr = points.map((p) => `${p.x},${p.y}`).join(' ')
  return (
    <div className="flex flex-col items-end gap-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <polyline
          points={pointsAttr}
          fill="none"
          stroke="white"
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          // x positions are evenly spaced and unique per point, so the
          // coordinate IS the identity — unlike a bare array index, it stays
          // stable if the history array is ever reordered.
          <circle
            key={p.x}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 3 : 1.5}
            fill="white"
            fillOpacity={i === points.length - 1 ? 1 : 0.5}
          />
        ))}
      </svg>
      <span className="text-[11px] text-white/50">Last {history.length} checks</span>
    </div>
  )
}

/**
 * The Markdown download action, styled as `CopyButton`'s sibling (same
 * shell, same 44px/36px touch-target step-down, same idle-border-deepens-
 * on-hover language) rather than reusing that component directly — the
 * shared `CopyButton` owns clipboard-specific copied/failed state that a
 * file download has no equivalent for, so a lookalike button with its own
 * `onClick` is less code than bending a shared component to a second job.
 *
 * `Date.now()` here runs inside the click handler, not at render — the
 * project-wide ban on `Date`/`Date.now()` in render-time code (it breaks
 * static generation) does not reach an event handler that only runs when a
 * visitor clicks. `formatReportMarkdown` itself still takes the timestamp as
 * a plain string argument and calls `Date` nowhere, so the pure function
 * stays exactly reproducible in a test.
 */
function DownloadMarkdownButton({ report }: { report: VisibilityReport }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackToolEvent('ai-visibility-checker', 'download_report', { format: 'markdown' })
        const generatedAt = new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
        downloadTextFile(
          `${slugifyUrlForFilename(report.url)}-ai-visibility-report.md`,
          formatReportMarkdown(report, generatedAt),
        )
      }}
      className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink sm:min-h-9"
    >
      <Download className="size-4" aria-hidden="true" />
      Download Markdown
    </button>
  )
}

/**
 * Renders the report as a real PDF client-side (`@react-pdf/renderer`) and
 * saves it directly — one click, no new tab, no manual Ctrl+P. Both
 * react-pdf and the document tree in `pdf-document.tsx` are dynamically
 * imported inside the click handler so their weight never loads for a
 * visitor who doesn't use this button.
 */
function DownloadPdfButton({ report }: { report: VisibilityReport }) {
  const [generating, setGenerating] = useState(false)
  return (
    <button
      type="button"
      disabled={generating}
      onClick={async () => {
        setGenerating(true)
        trackToolEvent('ai-visibility-checker', 'download_report', { format: 'pdf' })
        try {
          const [{ pdf }, { AiVisibilityPdfDocument }] = await Promise.all([
            import('@react-pdf/renderer'),
            import('@/lib/tools/ai-visibility-checker/pdf-document'),
          ])
          const generatedAt = new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
          const blob = await pdf(
            <AiVisibilityPdfDocument report={report} generatedAt={generatedAt} />,
          ).toBlob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${slugifyUrlForFilename(report.url)}-ai-visibility-report.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch {
          // Best-effort — generation failing leaves the on-screen report
          // untouched; nothing here is destructive.
        } finally {
          setGenerating(false)
        }
      }}
      className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-9"
    >
      <Download className="size-4" aria-hidden="true" />
      {generating ? 'Generating PDF…' : 'Download PDF'}
    </button>
  )
}

/** A small shareable Markdown snippet — real shareability for near-zero
 * cost, via the same `CopyButton` already used for "Copy report". */
function buildScoreBadgeMarkdown(report: VisibilityReport): string {
  return `**AI Visibility Score: ${report.score}/100** — ${report.band} · checked with [Scult Tools](${SITE.url}/geo/ai-visibility-checker)`
}

/** `Copy shareable link`, restyled to match its new home in the report's
 * export row (previously a standalone brutal button above the form, where
 * it rendered disabled until a report existed). */
function CopyLinkButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink sm:min-h-9"
    >
      <Link2 className="size-4" aria-hidden="true" />
      {copied ? 'Link copied' : 'Copy shareable link'}
    </button>
  )
}

// Built through parentLink() so it carries the utm_source/campaign that
// CtaClickTracker keys on — that ONE delegated listener then records the
// cta_click (to GA4 and, via the multi-sink, to Studio) for every booking
// link here. No per-link onClick tracking, so a click can never be
// mis-recorded as a dismissal (the bug this replaced).
const SCULT_BOOKING_URL = parentLink('/#book-meeting', 'ai-visibility-checker')
const SCULT_PHONE = '7007288376'
const SCULT_EMAIL = 'connect@scult.in'

/** Phone + email, shared between the CTA modal and the inline CTA banner —
 * always Scult India's real contact details, never the tools.scult.in
 * product name in this context. */
function ScultContactLines({ tone }: { tone: 'dark' | 'light' }) {
  const linkClass =
    tone === 'dark' ? 'text-white/85 hover:text-white' : 'text-ink-muted hover:text-ink'
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
      <a
        href={`tel:${SCULT_PHONE}`}
        className={`flex items-center gap-1.5 font-medium ${linkClass}`}
      >
        <Phone className="size-3.5 shrink-0" aria-hidden="true" />
        {SCULT_PHONE}
      </a>
      <a
        href={`mailto:${SCULT_EMAIL}`}
        className={`flex items-center gap-1.5 font-medium ${linkClass}`}
      >
        <Mail className="size-3.5 shrink-0" aria-hidden="true" />
        {SCULT_EMAIL}
      </a>
    </div>
  )
}

const CTA_DISMISSED_KEY = 'scult-tools:aiv-cta-dismissed:v1'

/**
 * Modal CTA — shown 1.5 s after a report loads. Dismissed in localStorage so
 * "Don't show again" survives page reloads. Never shown during loading or on
 * the pre-run legend; only visible when a real result exists.
 *
 * `useDialogBehavior` (shared with the Schema Markup / FAQ Schema generators'
 * drawers) owns focus-trap, Escape-to-close and scroll-lock — `open` is fixed
 * `true` here because the parent only mounts this component while it should
 * be open; React still runs the hook's cleanup on unmount, so closing behaves
 * identically to the hook's own `open → false` path. There is no natural
 * "trigger" element (the modal opens on a timer, not a click), so
 * `triggerRef` stays unattached — focus simply doesn't move on close, which
 * is no worse than before this modal existed.
 */
function ScultCtaModal({
  onDismiss,
  onConvert,
}: {
  onDismiss: () => void
  onConvert: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  useDialogBehavior(true, () => onDismiss(), panelRef, triggerRef)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scult-cta-heading"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onDismiss}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-md overflow-hidden rounded-panel border border-ink bg-white shadow-brutal"
      >
        <div className="bg-violet-900 px-6 py-5 text-white">
          <p className="font-bold text-[11px] uppercase tracking-widest text-cta-pure">
            Scult India — AI-First Digital Agency
          </p>
          <h2
            id="scult-cta-heading"
            className="mt-1 font-display font-bold text-[20px] text-white"
          >
            Not sure how to make your site AI-ready?
          </h2>
        </div>
        <div className="p-6">
          <p className="text-[14px] text-ink-muted leading-6">
            We implement every fix in reports like this one — structured data, robots.txt
            audit, llms.txt, and content strategy that gets your pages cited by ChatGPT,
            Perplexity, and Claude.
          </p>
          <a
            href={SCULT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal btn-violet btn-brutal-sm mt-5 w-full text-center"
            onClick={onConvert}
          >
            <Calendar className="size-4" aria-hidden="true" />
            Book a free AI readiness call →
          </a>
          <div className="mt-3 flex justify-center">
            <ScultContactLines tone="light" />
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="btn-brutal btn-brutal-sm btn-white mt-3 w-full"
          >
            Close
          </button>
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-[13px] text-ink-subtle">
            <input
              type="checkbox"
              className="size-3.5"
              onChange={(e) => {
                if (e.target.checked) {
                  try {
                    localStorage.setItem(CTA_DISMISSED_KEY, '1')
                  } catch {
                    // Private mode — dismiss works for the session anyway.
                  }
                }
              }}
            />
            Don&apos;t show again
          </label>
        </div>
      </div>
    </div>
  )
}

/**
 * Shared pre-run content — the compact crawler grid plus one collapsed
 * disclosure holding the verbose per-bot detail and the scoring legend.
 * Used identically by the loading state and the empty (never-run) state, so
 * the two don't hand-maintain their own near-duplicate copies of the same
 * legend.
 */
function PreRunLegend() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="font-display font-semibold text-[17px] text-ink">
          The {AI_BOTS.length} crawlers we evaluate
        </h4>
        <p className="mt-1 text-[14px] text-ink-muted leading-5">
          Each one gets its own robots.txt verdict, because they are separate user-agents
          with separate rules. OpenAI alone ships three: you can allow ChatGPT search
          while opting out of training.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {SPEC_GROUPS.map((group) => (
            <CompactSpecGroup
              key={group.company}
              company={group.company}
              bots={group.bots}
            />
          ))}
        </div>
      </div>

      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between font-display font-medium text-[15px] text-ink-muted transition-colors duration-150 marker:content-none hover:text-[var(--color-violet-accent-text,var(--color-violet-700))] [&::-webkit-details-marker]:hidden">
          What each crawler is for, and how the 100-point score works
          <span
            aria-hidden="true"
            className="text-[13px] text-ink-subtle transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="mt-3 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SPEC_GROUPS.map((group) => (
              <CompanySpecGroup
                key={group.company}
                company={group.company}
                bots={group.bots}
              />
            ))}
          </div>
          <div>
            <h5 className="font-display font-semibold text-[15px] text-ink">
              What the score is made of
            </h5>
            <dl className="mt-3 divide-y divide-line border-line border-t">
              {CHECK_LEGEND.map((item) => (
                <div key={item.label} className="py-2.5">
                  <dt className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-[14px] text-ink">
                      {item.label}
                    </span>
                    <span className="shrink-0 font-medium text-[13px] text-ink-subtle tabular-nums">
                      {item.weight}
                    </span>
                  </dt>
                  <dd className="mt-0.5 text-[13px] text-ink-muted leading-5">
                    {item.meaning}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="hint mt-3">
              100/100 means AI engines <em>can</em> read and parse you — not that they
              will cite you.
            </p>
          </div>
        </div>
      </details>
    </div>
  )
}

/** AI_BOTS never changes at runtime, so this groups once at module load
 * rather than on every render of the pre-run legend and loading state. */
const SPEC_GROUPS = groupByCompany(AI_BOTS)

export function AiVisibilityChecker() {
  const [url, setUrl] = useState(SAMPLE_URL)
  const [inputError, setInputError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [report, setReport] = useState<VisibilityReport | undefined>(undefined)
  const [scoreDelta, setScoreDelta] = useState<ScoreDelta | undefined>(undefined)
  const [scoreHistory, setScoreHistory] = useState<readonly HistoryEntry[]>([])
  const [apiError, setApiError] = useState<ApiError | undefined>(undefined)
  const [blockedOnly, setBlockedOnly] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [ctaDismissed, setCtaDismissed] = useState(false)
  const abortRef = useRef<AbortController | undefined>(undefined)
  const bootedRef = useRef(false)

  /**
   * One run against one URL. Takes the target as an argument rather than reading
   * state so a shared `?url=` link can invoke it during mount, before any render
   * has committed the field value.
   */
  const runCheckFor = useCallback(async (raw: string): Promise<void> => {
    const validation = validateTargetUrl(raw)
    if (validation.url === undefined) {
      setInputError(validation.error ?? 'Enter a valid URL.')
      return
    }
    const target = raw.trim()
    setInputError(undefined)
    setApiError(undefined)
    setReport(undefined)
    setScoreDelta(undefined)
    setScoreHistory([])
    setStage(0)
    setLoading(true)

    try {
      localStorage.setItem(LAST_URL_KEY, target)
    } catch {
      // Best-effort convenience only; private mode blocks writes.
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`/api/ai-visibility?url=${encodeURIComponent(target)}`, {
        signal: controller.signal,
      })
      const data: unknown = await res.json()
      if (res.ok && isVisibilityReport(data)) {
        // "Compare to your last checks" — look up this origin's remembered
        // history BEFORE appending to it, so the delta compares against the
        // most recent prior run, then persist the extended (capped) history
        // for next time. Origin, not full URL, so a re-check of a different
        // path on the same site still finds its history.
        let delta: ScoreDelta | undefined
        let updatedHistory: readonly HistoryEntry[] = []
        try {
          const origin = new URL(data.url).origin
          const previous = readHistory(origin)
          const lastPrevious = previous[previous.length - 1]
          if (lastPrevious !== undefined) {
            delta = {
              deltaPoints: data.score - lastPrevious.score,
              previousCheckedAt: lastPrevious.checkedAt,
            }
          }
          updatedHistory = [
            ...previous,
            { score: data.score, checkedAt: new Date().toISOString() },
          ].slice(-MAX_HISTORY_PER_ORIGIN)
          writeHistory(origin, updatedHistory)
        } catch {
          // Malformed URL — no comparison/sparkline this run, report still stands.
        }
        setScoreDelta(delta)
        setScoreHistory(updatedHistory)
        setReport(data)
        setLinkCopied(false)
        // Make the result addressable so it can be sent to whoever owns the
        // server. replaceState, not push: the back button should leave the tool,
        // not walk through every domain you tried.
        try {
          window.history.replaceState(
            null,
            '',
            `${window.location.pathname}?url=${encodeURIComponent(target)}`,
          )
        } catch {
          // A sandboxed frame can forbid history writes; the report still stands.
        }
      } else if (isApiError(data)) {
        setApiError(data)
      } else {
        setApiError({
          error: 'The checker returned an unexpected response.',
          code: 'unreachable',
        })
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setApiError({
        error: 'Could not reach the checker. Check your connection and try again.',
        code: 'unreachable',
      })
    } finally {
      if (abortRef.current === controller) setLoading(false)
    }
  }, [])

  // Boot once, after mount: the server has no localStorage and no location, so
  // seeding either during render would make the first client paint disagree with
  // the server HTML. A `?url=` link wins over the remembered value and runs
  // immediately — a link to a result that makes you retype the domain is not a
  // shareable result.
  useEffect(() => {
    // Released on every teardown — a plain guard is not enough on its own. If the
    // component is torn down and remounted (StrictMode's dev double-invoke, a
    // Fast Refresh remount), the abort effect below cancels the boot request
    // while a sticky guard would make the second pass skip it as "already
    // booted", stranding a shared ?url= link on the pre-run legend. Returned from
    // every branch rather than only the last one, which is the mistake that makes
    // this kind of guard look correct while doing nothing on the path that needs
    // it.
    const release = (): void => {
      bootedRef.current = false
    }
    if (bootedRef.current) return release
    bootedRef.current = true

    let shared: string | undefined
    try {
      const param = new URLSearchParams(window.location.search).get('url')
      if (param !== null && param.trim() !== '' && param.length <= 2000) {
        shared = param.trim()
      }
    } catch {
      // Malformed query string — fall through to the remembered value.
    }

    if (shared !== undefined) {
      setUrl(shared)
      void runCheckFor(shared)
      return release
    }

    try {
      const stored = localStorage.getItem(LAST_URL_KEY)
      if (typeof stored === 'string' && stored.length > 0 && stored.length <= 2000) {
        setUrl(stored)
      }
    } catch {
      // Storage blocked — keep the seeded sample.
    }

    return release
  }, [runCheckFor])

  // Advance the staged progress text while a check is running, so the wait
  // reports what is happening rather than spinning.
  useEffect(() => {
    if (!loading) return
    const timer = setInterval(() => {
      setStage((s) => Math.min(s + 1, LOADING_STAGES.length - 1))
    }, 1400)
    return () => clearInterval(timer)
  }, [loading])

  useEffect(() => {
    if (!linkCopied) return
    const t = setTimeout(() => setLinkCopied(false), 2000)
    return () => clearTimeout(t)
  }, [linkCopied])

  // Show the Scult India CTA 1.5 s after a report lands. Skipped when the
  // user has clicked "Don't show again" (persisted in localStorage).
  useEffect(() => {
    if (report === undefined || ctaDismissed) return
    try {
      if (localStorage.getItem(CTA_DISMISSED_KEY) === '1') {
        setCtaDismissed(true)
        return
      }
    } catch {
      // Private mode — proceed.
    }
    const t = setTimeout(() => setCtaVisible(true), 1500)
    return () => clearTimeout(t)
  }, [report, ctaDismissed])

  // Drop an in-flight check when the component goes away, so a resolved fetch
  // never writes to state nobody is reading. Declared AFTER the boot effect so
  // its cleanup runs after the boot guard has been released.
  useEffect(() => () => abortRef.current?.abort(), [])

  async function copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      trackToolEvent('ai-visibility-checker', 'copy_link')
    } catch {
      // Clipboard can be blocked by permissions policy or an insecure origin.
      setLinkCopied(false)
    }
  }

  function startOver(): void {
    abortRef.current?.abort()
    setReport(undefined)
    setScoreDelta(undefined)
    setScoreHistory([])
    setApiError(undefined)
    setInputError(undefined)
    setLoading(false)
    setUrl('')
    try {
      window.history.replaceState(null, '', window.location.pathname)
    } catch {
      // Nothing to recover from — the form is already cleared.
    }
  }

  // Housekeeping only — closes the modal, records nothing. Used when the
  // booking link is followed (that click is a conversion, tracked by
  // CtaClickTracker via the parentLink href, NOT a dismissal).
  function closeCta(): void {
    setCtaVisible(false)
    setCtaDismissed(true)
  }

  // A real dismissal — the ✕, backdrop, Close button, Escape. This is the
  // only path that records cta_dismiss, so "walked away" and "booked a
  // call" can never be confused again.
  function dismissCta(): void {
    closeCta()
    trackToolEvent('ai-visibility-checker', 'cta_dismiss')
  }

  const stageLabel =
    LOADING_STAGES[Math.min(stage, LOADING_STAGES.length - 1)] ?? 'Checking…'
  const blockedCount =
    report === undefined ? 0 : report.bots.length - report.allowedBotCount
  const crawlerFinding = report?.checks.find((c) => c.id === 'crawlers')?.finding
  /** The bare hostname stands in for "the site's name" in the hero's
   * identity row — real page titles are often longer marketing copy
   * ("Free tools that... | Scult Tools"), while the hostname is always a
   * short, honest label for whichever site was actually checked. */
  const reportHostname = (() => {
    if (report === undefined) return undefined
    try {
      return new URL(report.url).hostname
    } catch {
      return report.url
    }
  })()
  /** Icon for the hero's verdict badge — undefined pre-run, same guard shape
   * as `crawlerFinding` above. */
  const BandGlyph = report === undefined ? undefined : BAND_ICON[report.band]
  /** Grouped from the FULL bot list — a company's allowed/total badge
   * should describe the company, not the current filter, even while
   * "Blocked only" hides its passing crawlers below. */
  const botGroups: readonly CompanyBotGroupData[] =
    report === undefined
      ? []
      : groupByCompany(report.bots)
          .map((g) => ({
            ...g,
            visible: blockedOnly ? g.bots.filter((b) => !b.allowed) : g.bots,
          }))
          .filter((g) => g.visible.length > 0)
  const scoredChecks = report?.checks.filter((c) => c.scored) ?? []
  const checksPassed = scoredChecks.filter((c) => c.status === 'pass').length
  /** Every check with points still on the table, ranked by how many —
   * pass always means full credit (see CHECK_WEIGHT's docblock), so this
   * doubles as "what to do, in priority order". */
  const outstandingFixes = scoredChecks
    .filter((c) => c.status !== 'pass')
    .slice()
    .sort((a, b) => CHECK_WEIGHT[b.id] - CHECK_WEIGHT[a.id])
  const pointsAvailable = outstandingFixes.reduce((sum, c) => sum + CHECK_WEIGHT[c.id], 0)

  const timelineSteps: TimelineStep[] = STAGE_STEP_LABELS.map((label, i) => ({
    label,
    status: i < stage ? 'done' : i === stage ? 'active' : 'pending',
  }))
  const progressPercent = Math.round(((stage + 1) / LOADING_STAGES.length) * 100)

  return (
    <div className="flex flex-col gap-6 rounded-panel border border-ink bg-cream p-5 shadow-brutal md:p-6">
      {ctaVisible && !ctaDismissed ? (
        <ScultCtaModal onDismiss={dismissCta} onConvert={closeCta} />
      ) : null}

      <ToolToolbar
        actions={
          <>
            <ToolbarAction
              onClick={() => {
                setUrl(SAMPLE_URL)
                setInputError(undefined)
                trackToolEvent('ai-visibility-checker', 'load_sample')
              }}
            >
              Load example
            </ToolbarAction>
            <ToolbarAction
              onClick={startOver}
              disabled={url === '' && report === undefined && apiError === undefined}
            >
              Start over
            </ToolbarAction>
          </>
        }
      >
        {report !== undefined ? (
          <ToolbarGroup label="Crawler breakdown">
            <SegmentButton
              active={!blockedOnly}
              onClick={() => setBlockedOnly(false)}
              title="Show every crawler we evaluate"
            >
              All {AI_BOTS.length} crawlers
            </SegmentButton>
            <SegmentButton
              active={blockedOnly}
              onClick={() => setBlockedOnly(true)}
              title="Show only the crawlers that robots.txt blocks"
            >
              Blocked only
            </SegmentButton>
          </ToolbarGroup>
        ) : null}
      </ToolToolbar>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!loading) {
            trackToolEvent('ai-visibility-checker', 'check_visibility')
            void runCheckFor(url)
          }
        }}
      >
        <div>
          <label className="label" htmlFor="aiv-url">
            Website URL
          </label>
          <input
            id="aiv-url"
            className="field"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://yourdomain.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              if (inputError !== undefined) setInputError(undefined)
            }}
            aria-describedby={inputError !== undefined ? 'aiv-url-error' : 'aiv-url-hint'}
            aria-invalid={inputError !== undefined}
          />
          {inputError !== undefined ? (
            <p
              className="mt-1.5 font-medium text-[14px] text-violet-700"
              id="aiv-url-error"
            >
              {inputError}
            </p>
          ) : (
            <p className="hint mt-1.5" id="aiv-url-hint">
              Any http or https address. Private and internal hosts are refused.
            </p>
          )}
          <button
            type="submit"
            className="btn-brutal btn-violet btn-brutal-sm mt-4 w-full sm:w-auto"
            disabled={loading}
          >
            <Radar className="size-4" aria-hidden="true" />
            {loading ? 'Checking…' : 'Check visibility'}
          </button>
        </div>

        {/* Collapsed by default — the transparency commitment (what leaves our
            server, no signup, nothing stored) stays available on demand
            instead of permanently occupying space every visitor pays for. */}
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between font-display font-medium text-[15px] text-ink-muted transition-colors duration-150 marker:content-none hover:text-[var(--color-violet-accent-text,var(--color-violet-700))] [&::-webkit-details-marker]:hidden">
            Exactly what happens when you click Check visibility
            <span
              aria-hidden="true"
              className="text-[13px] text-ink-subtle transition-transform group-open:rotate-180"
            >
              ▾
            </span>
          </summary>
          <div className="mt-2 rounded-card border border-line-grey bg-offwhite p-4">
            <p className="text-[14px] text-ink-muted leading-5">
              Our server makes four requests to your domain, once each — no account, no
              email:
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] text-ink">
              <li>/</li>
              <li>/robots.txt</li>
              <li>/llms.txt</li>
              <li>/sitemap.xml</li>
            </ul>
            <p className="mt-3 text-[14px] text-ink-muted leading-5">
              It identifies itself as{' '}
              <span className="font-mono text-[13px] text-ink">ScultToolsBot/1.0</span>,
              gives up after 10 seconds, and follows at most three redirects. If your WAF
              blocks unfamiliar crawlers, allow that user-agent before you run this —
              otherwise you are measuring your firewall, not your robots.txt.
            </p>
          </div>
        </details>
      </form>

      <div className="border-line border-t pt-6">
        {loading ? (
          <div className="flex flex-col gap-6">
            <div>
              <div
                role="progressbar"
                aria-label="Visibility check in progress"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full overflow-hidden rounded-pill border border-line-grey bg-cream"
              >
                <div
                  data-decorative-motion
                  className="h-full rounded-pill bg-violet-500 transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-4">
                <StepTimeline steps={timelineSteps} />
              </div>
              <p className="mt-2 text-[13px] text-ink-subtle">
                {stageLabel} Step {Math.min(stage + 1, LOADING_STAGES.length)} of{' '}
                {LOADING_STAGES.length}.
              </p>
            </div>

            <div className="border-line border-t pt-5">
              <PreRunLegend />
            </div>
          </div>
        ) : apiError !== undefined ? (
          <div className="flex flex-col gap-3">
            <ErrorDetail
              message={
                apiError.code === 'blocked'
                  ? `The site blocked our checker — ${apiError.error}`
                  : apiError.error
              }
            />
            {apiError.code === 'blocked' ? (
              <p className="text-[14px] text-ink-muted leading-5">
                To be fair to your site: blocking ScultToolsBot does not mean AI bots are
                blocked. Plenty of firewalls reject unfamiliar crawlers while letting
                GPTBot or ClaudeBot through. Allow the user-agent listed above, or read
                your robots.txt and WAF allowlist directly.
              </p>
            ) : null}
            {apiError.code === 'unreachable' ? (
              <p className="text-[14px] text-ink-muted leading-5">
                Check the site is live and publicly reachable, then try again. Very slow
                sites exceed our 10-second limit, and more than three redirects is treated
                as a loop.
              </p>
            ) : null}
            {apiError.code === 'private-address' || apiError.code === 'invalid-url' ? (
              <p className="text-[14px] text-ink-muted leading-5">
                Only public http and https addresses can be checked. Staging behind a VPN,
                localhost and private IP ranges are refused on purpose — this endpoint
                fetches whatever you give it, so it must not be usable to probe an
                internal network.
              </p>
            ) : null}
          </div>
        ) : report !== undefined ? (
          <div className="flex flex-col gap-10">
            {/* Jump nav + export row — same chip-tool/scroll-mt-32 anchor-nav
                convention as /sitemap, so a long report is skimmable. */}
            <div id="report-overview" className="scroll-mt-32 flex flex-col gap-4">
              <nav aria-label="Jump to section" className="flex flex-wrap gap-2">
                {JUMP_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="chip-tool px-4 py-2 text-[14px]"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="eyebrow">Your report</span>
                <div className="flex flex-wrap items-center gap-2">
                  <CopyButton
                    text={formatReportText(report)}
                    label="Copy report"
                    onCopy={() => trackToolEvent('ai-visibility-checker', 'copy_report')}
                  />
                  <CopyButton
                    text={buildScoreBadgeMarkdown(report)}
                    label="Copy score badge"
                    ariaLabel='Copy "Score badge" as Markdown'
                    onCopy={() => trackToolEvent('ai-visibility-checker', 'copy_badge')}
                  />
                  <DownloadMarkdownButton report={report} />
                  <DownloadPdfButton report={report} />
                  <CopyLinkButton copied={linkCopied} onCopy={() => void copyLink()} />
                </div>
              </div>
            </div>

            {/* HERO — the one thing on this page that must be unmissable.
                A solid violet-900 panel, the same theme-invariant dark-block
                idiom the site footer already uses, rather than another
                light pastel tile: a different KIND of surface, not just a
                bigger one. The score is set far larger than any other
                number on the page on purpose — this is the only place that
                gets to be this big. */}
            <div className="overflow-hidden rounded-panel border border-ink bg-violet-900 text-white shadow-brutal">
              <div className="p-6 sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="block size-6 shrink-0 overflow-hidden rounded-full border border-white/40">
                      <Image
                        src={scultMark}
                        alt=""
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    </span>
                    <span className="font-bold text-[13px] text-cta-pure uppercase tracking-wide">
                      AI Visibility Score
                    </span>
                  </div>
                  {/* Fixed-white pill on a fixed-dark panel — literal
                      text-black, never adaptive text-ink, same rule as every
                      other theme-fixed fill in this file. The border alone
                      carries the per-band accent; the word already carries
                      the verdict. */}
                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-pill border-2 bg-white px-3 py-1.5 font-semibold text-[13px] text-black ${BAND_BADGE_BORDER[report.band]}`}
                  >
                    {BandGlyph ? (
                      <BandGlyph className="size-4 shrink-0" aria-hidden="true" />
                    ) : null}
                    {report.band}
                  </span>
                </div>

                {/* Identity row — who this report is about. The checked
                    site's own og:image as a small, contained circular
                    avatar (never stretched to fill/cover the panel — that
                    read as a smeared watermark once a site's og:image
                    turned out to just be their own logo blown up) plus its
                    hostname and full URL. Falls back to a plain globe-style
                    initial when no og:image was fetched, so the row's
                    layout never shifts based on whether one exists. */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-violet-700">
                    {report.pageInsights.heroImageUrl !== undefined ? (
                      // biome-ignore lint/performance/noImgElement: a runtime data: URI from the just-fetched report, not a static/optimizable asset next/image can handle.
                      <img
                        src={report.pageInsights.heroImageUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="font-display font-bold text-[16px] text-white">
                        {(reportHostname ?? '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold text-[16px] text-white">
                      {reportHostname}
                    </p>
                    <p className="truncate font-mono text-[12px] text-white/60">
                      {report.url}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="font-display font-bold text-[92px] text-white leading-[0.85] tabular-nums sm:text-[128px]">
                      {report.score}
                    </span>
                    <span className="pb-2 font-display font-semibold text-[24px] text-white/50 sm:pb-4 sm:text-[30px]">
                      /100
                    </span>
                  </div>
                  {scoreHistory.length >= 2 ? (
                    <ScoreSparkline history={scoreHistory} />
                  ) : null}
                </div>

                <div
                  role="progressbar"
                  aria-label="Visibility score"
                  aria-valuenow={report.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-4 h-2.5 w-full max-w-md overflow-hidden rounded-pill bg-white/15"
                >
                  <div
                    className={`h-full rounded-pill ${HERO_BAR_TONE[report.band]}`}
                    style={{ width: `${report.score}%` }}
                  />
                </div>

                <p className="mt-5 text-[15px] text-white/85 leading-6">
                  <strong className="text-white">
                    {report.allowedBotCount} of {report.bots.length}
                  </strong>{' '}
                  AI crawlers can fetch this page
                </p>

                {/* Honest, not a hype metric: this is the visitor's own
                    device remembering their own past runs of this same
                    origin — no account, no server storage. Absence of this
                    line means there was no prior check, which needs no
                    separate "first time!" message to say so. */}
                {scoreDelta !== undefined ? (
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-white/70">
                    {scoreDelta.deltaPoints > 0 ? (
                      <TrendingUp className="size-3.5 shrink-0" aria-hidden="true" />
                    ) : scoreDelta.deltaPoints < 0 ? (
                      <TrendingDown className="size-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Minus className="size-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {scoreDelta.deltaPoints === 0
                      ? `Same score as your last check on ${formatCheckedDate(scoreDelta.previousCheckedAt)}`
                      : `${scoreDelta.deltaPoints > 0 ? '+' : ''}${scoreDelta.deltaPoints} pts since your last check on ${formatCheckedDate(scoreDelta.previousCheckedAt)}`}
                  </p>
                ) : null}
              </div>
            </div>

            {/* What to fix — moved directly under the hero (it used to sit
                third, after a full recap of the same stats). This is the
                direct answer to "what do I do about that number", so it
                earns the very next slot. It keeps the assertive card-flat +
                shadow-brutal treatment on purpose — the one list on the page
                that should still fight for attention — and the heading is
                now the second-largest text on the page after the score
                itself, anchoring it as the report's other focal point. */}
            <div id="what-to-fix" className="scroll-mt-32">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display font-bold text-[26px] text-ink leading-tight sm:text-[30px]">
                  What to fix
                </h4>
                {outstandingFixes.length > 0 ? (
                  <p className="text-[13px] text-ink-subtle">
                    Up to <strong className="text-ink">{pointsAvailable} pts</strong>{' '}
                    available
                  </p>
                ) : null}
              </div>

              {/* bg-tile-green is theme-fixed — border/icon/text stay literal
                  black, never adaptive ink. */}
              {outstandingFixes.length === 0 ? (
                <div className="mt-4 flex items-center gap-3 rounded-panel border border-black bg-tile-green p-4 shadow-brutal-sm">
                  <CircleCheck
                    className="size-6 shrink-0 text-black"
                    aria-hidden="true"
                  />
                  <p className="text-[14px] text-black leading-5">
                    <strong>Nothing left to fix</strong> — every scored check passes.
                    {report.score < 100
                      ? ' Your score reflects a noai signal or partial crawler access above; see the sections below.'
                      : ''}
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {outstandingFixes.map((check, i) => (
                    <FixCard key={check.id} check={check} rank={i + 1} />
                  ))}
                </div>
              )}
            </div>

            {/* Scult India CTA — always shown when there's a report.
                A fixed dark panel that mirrors the hero's violet-900 idiom
                so it reads as branded, not as a random interstitial. */}
            <div className="overflow-hidden rounded-panel border border-ink bg-violet-900 text-white shadow-brutal-sm">
              <div className="p-5 sm:p-6">
                <p className="font-bold text-[11px] uppercase tracking-widest text-cta-pure">
                  Scult India — AI-First Digital Agency
                </p>
                <h3 className="mt-1.5 font-display font-bold text-[18px] text-white">
                  Not sure how to implement these fixes?
                </h3>
                <p className="mt-2 text-[14px] text-white/80 leading-5">
                  We handle structured data, robots.txt audits, llms.txt setup, and
                  content strategy that gets your pages cited by ChatGPT, Perplexity, and
                  Claude — typically in one sprint.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {/* No onClick tracker: the parentLink href carries the
                      UTMs CtaClickTracker keys on, so it records this
                      cta_click once (GA4 + Studio). A manual call here would
                      double-count. */}
                  <a
                    href={SCULT_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-pill border-2 border-white px-4 py-2 font-semibold text-[14px] text-white transition-colors hover:bg-white hover:text-violet-900"
                  >
                    <Calendar className="size-4" aria-hidden="true" />
                    Book a free AI readiness call →
                  </a>
                  <ScultContactLines tone="dark" />
                </div>
              </div>
            </div>

            {/* At a glance — the numbers behind the score, restated. An
                eyebrow label instead of a section heading on purpose: this
                is a recap of what the hero and the fix list already said,
                not a third headline competing with them. Two tones only
                (green/yellow/lavender), each earned: green for a genuinely
                good count, yellow only when a crawler is actually blocked. */}
            <div>
              <span className="eyebrow">At a glance</span>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  icon={ShieldCheck}
                  label="Crawlers allowed"
                  value={report.allowedBotCount}
                  sublabel={`of ${report.bots.length}`}
                  tone="green"
                />
                <StatCard
                  icon={ShieldAlert}
                  label="Crawlers blocked"
                  value={blockedCount}
                  sublabel={`of ${report.bots.length}`}
                  tone={blockedCount > 0 ? 'yellow' : 'lavender'}
                />
                <StatCard
                  icon={FileJson}
                  label="Schema types found"
                  value={report.jsonLdTypes.length}
                  sublabel="JSON-LD @type values"
                  tone="lavender"
                />
                <StatCard
                  icon={ListChecks}
                  label="Checks passed"
                  value={`${checksPassed}/${scoredChecks.length}`}
                  sublabel="scored checks"
                  tone={checksPassed === scoredChecks.length ? 'green' : 'lavender'}
                />
              </div>
            </div>

            <WebsiteInsightsSection insights={report.pageInsights} />

            {/* The 12 checks, grouped into 4 categories that mean something
                on their own — replaces the old flat "All checks" dump. */}
            {REPORT_CATEGORIES.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                checks={report.checks}
                botGroups={botGroups}
                crawlerFinding={crawlerFinding}
                jsonLdTypes={report.jsonLdTypes}
                totalBots={report.bots.length}
              />
            ))}
          </div>
        ) : (
          <PreRunLegend />
        )}
      </div>

      <div className="border-line border-t pt-4">
        <StatusBar
          // 'valid' is reserved for a genuinely good verdict. A green tick beside
          // "5/100, Mostly invisible to AI" would assert the opposite of the
          // report, so a successful run with a weak score stays neutral.
          state={
            report !== undefined
              ? report.band === 'AI-visible'
                ? 'valid'
                : 'neutral'
              : apiError !== undefined || inputError !== undefined
                ? 'invalid'
                : 'neutral'
          }
          message={
            loading
              ? stageLabel
              : report !== undefined
                ? `Report ready — ${report.score}/100, ${report.band}`
                : apiError !== undefined
                  ? 'That site could not be checked'
                  : inputError !== undefined
                    ? inputError
                    : 'Enter a URL and press Check visibility'
          }
          stats={
            report !== undefined
              ? [
                  { label: 'crawlers allowed', value: `${report.allowedBotCount}` },
                  { label: 'blocked', value: `${blockedCount}` },
                  { label: 'schema types', value: `${report.jsonLdTypes.length}` },
                ]
              : [{ label: 'crawlers checked', value: `${AI_BOTS.length}` }]
          }
          privacyNote="Four requests to your domain, once — no email, nothing stored"
        />
      </div>
    </div>
  )
}
