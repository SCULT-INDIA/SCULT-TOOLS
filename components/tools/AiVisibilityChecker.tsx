'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import {
  Building2,
  CircleCheck,
  CircleX,
  Download,
  FileJson,
  ListChecks,
  Minus,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  ErrorDetail,
  SegmentButton,
  StatCard,
  StatusBar,
  StepTimeline,
  type TimelineStep,
  ToolbarGroup,
  ToolToolbar,
} from '@/components/tools/workspace'
import { BrandIcon, brandForCompany } from '@/components/ui/BrandIcon'
import { trackToolEvent } from '@/lib/analytics'
import { downloadTextFile, slugifyUrlForFilename } from '@/lib/download-file'
import { SITE } from '@/lib/site'
import { generatePdfHtml } from '@/lib/tools/ai-visibility-checker/pdf-template'
import {
  AI_BOTS,
  type ApiError,
  type BandLabel,
  type BotAccess,
  type BotSpec,
  type CheckId,
  type CheckResult,
  type CheckStatus,
  formatReportMarkdown,
  formatReportText,
  isApiError,
  isVisibilityReport,
  type VisibilityReport,
  validateTargetUrl,
} from '@/lib/tools/ai-visibility-checker/logic'

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
 * Layout: this tool dropped the two-pane `ToolWorkspace` for a single-column
 * stacked report (the redesign's "Group C" shape) — the form up top, the whole
 * report below it. `ScoreRing`/`StatCard`/`StepTimeline` render only figures
 * this file already computes from `VisibilityReport` — no field here is
 * invented for the sake of filling a tile. Two deliberate departures from the
 * wireframe this was rebuilt against, because the underlying tool checks
 * robots.txt crawl access, not live answer-engine mentions:
 *   - The step timeline names the five real fetch/scoring stages this run goes
 *     through (homepage, robots.txt, llms.txt/sitemap, structured data,
 *     scoring) rather than named answer engines like "Gemini" or "Grok" — this
 *     tool never queries those products, so labelling a step with their name
 *     would claim a check that never happened. There is likewise no reliable
 *     run duration to promise, so progress is a step count, not a countdown.
 *   - The "breakdown" and "sources" sections below use this report's own
 *     data — per-crawler robots.txt access, and the JSON-LD types actually
 *     found on the page — rather than mention/citation/sentiment metrics this
 *     tool has no way to produce.
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
 * "Compare to your last check" storage — deliberately separate from
 * LAST_URL_KEY, which only ever remembers the one most recent URL typed.
 * This is a small per-origin history (one entry per origin, last result
 * only, never a full timeline) so re-checking a domain you've checked
 * before can show an honest delta: your own device's memory of your own
 * past run, not a fabricated trend. Keyed by `new URL(x).origin` rather
 * than the full URL so https://example.com/ and https://example.com/about
 * count as the same site sharing one score history.
 */
const HISTORY_KEY = 'scult-tools:ai-visibility-checker:history:v1'

/** One origin's remembered result — score plus when it was recorded. */
type HistoryEntry = { readonly score: number; readonly checkedAt: string }

/** The comparison rendered next to the score: how many points moved, and
 * when the prior check that set the baseline happened. */
type ScoreDelta = { readonly deltaPoints: number; readonly previousCheckedAt: string }

/** Best-effort read of one origin's remembered result. Malformed or missing
 * storage is not an error here — it just means no comparison renders. */
function readHistoryEntry(origin: string): HistoryEntry | undefined {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw === null) return undefined
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return undefined
    const entry = (parsed as Record<string, unknown>)[origin]
    if (
      typeof entry === 'object' &&
      entry !== null &&
      typeof (entry as HistoryEntry).score === 'number' &&
      typeof (entry as HistoryEntry).checkedAt === 'string'
    ) {
      return entry as HistoryEntry
    }
    return undefined
  } catch {
    return undefined
  }
}

/** Overwrites one origin's entry with the latest result. Only the last
 * result per origin is kept — this is "last time", not a history feature. */
function writeHistoryEntry(origin: string, entry: HistoryEntry): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const all: Record<string, HistoryEntry> =
      raw !== null ? (JSON.parse(raw) as Record<string, HistoryEntry>) : {}
    all[origin] = entry
    localStorage.setItem(HISTORY_KEY, JSON.stringify(all))
  } catch {
    // Private mode or storage full — the comparison just won't be there
    // next time. Never breaks the run itself.
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
 * The same grouped-by-company layout as `CompanyBotGroup`, for before a
 * verdict exists — the pre-run legend and the in-progress state. Sharing the
 * shape means the report that eventually replaces this literally slots in
 * where this was, instead of the page re-flowing into an unfamiliar layout.
 */
function CompanySpecGroup({
  company,
  bots,
}: {
  company: string
  bots: readonly BotSpec[]
}) {
  return (
    // .card-modern — the calm alternative to .card-flat — carries its own
    // border, radius and hover lift already, so no extra hover utility is
    // layered on top of it here. This is reference material (the legend for
    // a report that doesn't exist yet), not an action item, so it uses the
    // same quieter tier as `CompanyBotGroup` below rather than the assertive
    // card-flat + shadow-brutal treatment reserved for "What to fix".
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

/**
 * What each check looks at and what it is worth. This is why the output pane is
 * not a second empty state: before a run it is the legend for the report that
 * will replace it, so you learn to read the result before you have one.
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
    label: 'noai signals',
    weight: 'not scored',
    meaning:
      'noai / noimageai in your meta robots tag or X-Robots-Tag header. Reported, never judged — opting out is a legitimate choice.',
  },
  {
    label: 'noindex / nofollow',
    weight: 'not scored',
    meaning:
      'The same meta robots tag and X-Robots-Tag header, checked for a noindex or nofollow directive instead — flagged prominently because either one can keep AI engines from citing the page regardless of every other check passing.',
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

/** One crawler's verdict as a card — the "AI engines breakdown" for this tool's real data. */
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
    // card-modern (Tier 3 — see the credit-scale comment above the report
    // body below): reference material to verify, not a fix to act on, so it
    // reads calmer than the assertive card-flat + shadow-brutal FixCard list.
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
 * Tier 4 — pure reference, no card at all. This only ever renders inside the
 * "All checks" disclosure, the single most passive section on the page
 * (collapsed by default; everything actionable already surfaced in "What to
 * fix" above), so it recedes as a bare divided row rather than competing for
 * attention with a border and a shadow the way it used to.
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

/** Point value per check — mirrors `computeScore`'s 40/20/20/10/10 weights
 * (`lib/tools/ai-visibility-checker/logic.ts`). `pass` always means the full
 * weight was earned for every scored check (each is graded pass only when
 * every sub-condition it covers is met), so "not yet passing" and "has
 * points left on the table" are the same thing — safe to build a fix list
 * from status alone. */
const CHECK_WEIGHT: Record<CheckId, number> = {
  crawlers: 40,
  noindex: 0,
  'structured-data': 20,
  basics: 20,
  'llms-txt': 10,
  sitemap: 10,
  noai: 0,
  https: 0,
  'mobile-viewport': 0,
  'schema-richness': 0,
  'author-signals': 0,
  'twitter-card': 0,
}

/**
 * One outstanding fix, ranked by how many points it's worth — the whole
 * point of this section is answering "what should I do first", and impact
 * order answers that better than the checks' fixed display order.
 */
function FixCard({ check, rank }: { check: CheckResult; rank: number }) {
  const weight = CHECK_WEIGHT[check.id]
  return (
    // See CompanySpecGroup above for why `border` is dropped and the hover
    // treatment is added.
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
 * Opens the professional A4 PDF report in a new browser tab.
 * The user presses Ctrl+P (or the "Save as PDF" button injected by the
 * template) to produce a file — no new npm dependency, no server round-trip,
 * and the result is a proper document layout (not a webpage screenshot).
 */
function DownloadPdfButton({ report }: { report: VisibilityReport }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackToolEvent('ai-visibility-checker', 'download_report', { format: 'pdf' })
        const generatedAt = new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
        const html = generatePdfHtml(report, generatedAt)
        const win = window.open('', '_blank')
        if (win !== null) {
          win.document.write(html)
          win.document.close()
        }
      }}
      className="flex min-h-11 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors hover:border-ink sm:min-h-9"
    >
      <Download className="size-4" aria-hidden="true" />
      Download PDF
    </button>
  )
}

const CTA_DISMISSED_KEY = 'scult-tools:aiv-cta-dismissed:v1'

/**
 * Modal CTA — shown 1.5 s after a report loads. Dismissed in localStorage so
 * "Don't show again" survives page reloads. Never shown during loading or on
 * the pre-run legend; only visible when a real result exists.
 */
function ScultCtaModal({ onDismiss }: { onDismiss: () => void }) {
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
      <div className="relative w-full max-w-md overflow-hidden rounded-panel border border-ink bg-white shadow-brutal">
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
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://scult.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal btn-violet btn-brutal-sm w-full text-center"
              onClick={onDismiss}
            >
              Book a free AI readiness call →
            </a>
            <button
              type="button"
              onClick={onDismiss}
              className="btn-brutal btn-brutal-sm btn-white w-full"
            >
              Close
            </button>
          </div>
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
        // "Compare to your last check" — look up this origin's remembered
        // result BEFORE overwriting it, so the delta compares against the
        // prior run, then store the new one for next time. Origin, not full
        // URL, so a re-check of a different path on the same site still
        // finds its history.
        let delta: ScoreDelta | undefined
        try {
          const origin = new URL(data.url).origin
          const previous = readHistoryEntry(origin)
          if (previous !== undefined) {
            delta = {
              deltaPoints: data.score - previous.score,
              previousCheckedAt: previous.checkedAt,
            }
          }
          writeHistoryEntry(origin, {
            score: data.score,
            checkedAt: new Date().toISOString(),
          })
        } catch {
          // Malformed URL — no comparison this run, report still stands.
        }
        setScoreDelta(delta)
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

  const stageLabel =
    LOADING_STAGES[Math.min(stage, LOADING_STAGES.length - 1)] ?? 'Checking…'
  const blockedCount =
    report === undefined ? 0 : report.bots.length - report.allowedBotCount
  const crawlerFinding = report?.checks.find((c) => c.id === 'crawlers')?.finding
  /** Icon for the hero's verdict badge — undefined pre-run, same guard shape
   * as `crawlerFinding` above. */
  const BandGlyph = report === undefined ? undefined : BAND_ICON[report.band]
  /** Grouped from the FULL bot list — a company's allowed/total badge
   * should describe the company, not the current filter, even while
   * "Blocked only" hides its passing crawlers below. */
  const botGroups =
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

  function dismissCta(): void {
    setCtaVisible(false)
    setCtaDismissed(true)
    trackToolEvent('ai-visibility-checker', 'cta_dismiss')
  }

  return (
    <div className="flex flex-col gap-6 rounded-panel border border-ink bg-cream p-5 shadow-brutal md:p-6">
      {ctaVisible && !ctaDismissed ? <ScultCtaModal onDismiss={dismissCta} /> : null}
      <ToolToolbar>
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
      </ToolToolbar>

      {/* Brand-button grid, positioned at the top, matching the convention
          established across the other tools. "Check visibility" itself
          stays where it is, below the URL field — it is a `type="submit"`
          button tied to the form's `onSubmit` (which drives the
          abort-controller/fetch logic), and it already carries the primary
          `.btn-violet` treatment; moving it out of the `<form>` risks losing
          Enter-to-submit for a purely cosmetic gain. */}
      <div className="grid grid-cols-2 gap-2 rounded-card border border-line-grey bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4">
        <button
          type="button"
          onClick={() => void copyLink()}
          disabled={report === undefined}
          className="btn-brutal btn-brutal-sm btn-violet w-full"
        >
          {linkCopied ? 'Link copied' : 'Copy shareable link'}
        </button>
        <button
          type="button"
          onClick={() => {
            setUrl(SAMPLE_URL)
            setInputError(undefined)
            trackToolEvent('ai-visibility-checker', 'load_sample')
          }}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Load example
        </button>
        <button
          type="button"
          onClick={startOver}
          disabled={url === '' && report === undefined && apiError === undefined}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Start over
        </button>
      </div>

      <form
        className="flex flex-col gap-5"
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
      </form>

      {/* The plain statement of what leaves our server, no signup, nothing stored —
          secure, no-login, and exactly how long it takes. Deliberately request-level:
          the legend for the *report* lives further down, so no sentence repeats. */}
      <div className="rounded-card border border-line-grey bg-offwhite p-4">
        <h4 className="font-display font-semibold text-[15px] text-ink">
          Exactly what this does
        </h4>
        <p className="mt-2 text-[14px] text-ink-muted leading-5">
          Our server makes four requests to your domain, once each — no account, no email:
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] text-ink">
          <li>/</li>
          <li>/robots.txt</li>
          <li>/llms.txt</li>
          <li>/sitemap.xml</li>
        </ul>
        <p className="mt-3 text-[14px] text-ink-muted leading-5">
          It identifies itself as{' '}
          <span className="font-mono text-[13px] text-ink">ScultToolsBot/1.0</span>, gives
          up after 10 seconds, and follows at most three redirects. If your WAF blocks
          unfamiliar crawlers, allow that user-agent before you run this — otherwise you
          are measuring your firewall, not your robots.txt.
        </p>
      </div>

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
              <h4 className="font-display font-semibold text-[17px] text-ink">
                The {AI_BOTS.length} crawlers we evaluate
              </h4>
              <p className="mt-1 text-[14px] text-ink-muted leading-5">
                While that runs: each crawler gets its own robots.txt verdict, because
                they are separate user-agents with separate rules.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SPEC_GROUPS.map((group) => (
                  <CompanySpecGroup
                    key={group.company}
                    company={group.company}
                    bots={group.bots}
                  />
                ))}
              </div>
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
            {/* Report header — a quiet utility row, not a headline in its
                own right. The hero right below already announces the
                result; this is only where the export actions live.
                flex-wrap: two action buttons plus a label is tight at 375px
                (see the mobile responsive pass) — wrapping beats letting
                either button's label clip. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow">Your report</span>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton
                  text={formatReportText(report)}
                  label="Copy report"
                  onCopy={() => trackToolEvent('ai-visibility-checker', 'copy_report')}
                />
                <DownloadMarkdownButton report={report} />
                <DownloadPdfButton report={report} />
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
                  <span className="font-bold text-[13px] text-cta-pure uppercase tracking-wide">
                    AI Visibility Score
                  </span>
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

                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <span className="font-display font-bold text-[92px] text-white leading-[0.85] tabular-nums sm:text-[128px]">
                    {report.score}
                  </span>
                  <span className="pb-2 font-display font-semibold text-[24px] text-white/50 sm:pb-4 sm:text-[30px]">
                    /100
                  </span>
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
                  AI crawlers can fetch{' '}
                  <span className="break-all font-mono text-[13px] text-white/70">
                    {report.url}
                  </span>
                </p>

                {/* Honest, not a hype metric: this is the visitor's own
                    device remembering their own last run of this same
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
            <div>
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
                <a
                  href="https://scult.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-pill border-2 border-white px-4 py-2 font-semibold text-[14px] text-white transition-colors hover:bg-white hover:text-violet-900"
                  onClick={() =>
                    trackToolEvent('ai-visibility-checker', 'cta_click', { source: 'inline' })
                  }
                >
                  Book a free AI readiness call →
                </a>
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

            {/* AI crawler access breakdown — reference material to verify,
                not an action item: everything actionable already surfaced
                in "What to fix" above. card-modern (the calm alternative to
                card-flat) instead of another hard-shadowed box, so this
                recedes rather than competing with the hero and the fix list
                for attention. */}
            <div>
              <h4 className="font-display font-semibold text-[17px] text-ink">
                AI crawler access breakdown
              </h4>
              {crawlerFinding !== undefined ? (
                <p className="mt-1 text-[14px] text-ink-muted leading-5">
                  {crawlerFinding}
                </p>
              ) : null}

              {botGroups.length === 0 ? (
                <p className="mt-3 rounded-card border border-line-grey bg-tile-green p-3 text-[14px] text-black leading-5">
                  Nothing is blocked — all {report.bots.length} crawlers are allowed.
                  Switch the toolbar back to “All {AI_BOTS.length} crawlers” to see the
                  rule behind each verdict.
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
                A group naming the bot beats{' '}
                <span className="font-mono">User-agent: *</span> entirely — each card
                quotes whichever group won.
              </p>
            </div>

            {/* Structured data alongside the full checklist — pure
                reference, so both sides drop the card treatment entirely
                and sit bare on the page background: nothing here is an
                action item, everything actionable already surfaced in
                "What to fix" above. Headings step down to the quietest tier
                on the page (15px medium, muted colour) to match. */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h4 className="font-display font-medium text-[15px] text-ink-muted">
                  Structured data found
                </h4>
                <p className="mt-1 text-[13px] text-ink-subtle leading-5">
                  The @type values declared in ld+json blocks on your homepage.
                </p>
                {report.jsonLdTypes.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {report.jsonLdTypes.map((type) => (
                      <li
                        key={type}
                        className="rounded-pill border border-[var(--color-violet-accent-text,var(--color-violet-700))] bg-cream px-2.5 py-1 font-medium text-[13px] text-[var(--color-violet-accent-text,var(--color-violet-700))]"
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[14px] text-ink-muted leading-5">
                    No JSON-LD structured data on the homepage — AI engines have to infer
                    what your site is instead of being told.
                  </p>
                )}
              </div>

              <details className="group">
                {/* violet-accent-text is the dark-safe idiom this file
                    already uses for "Worth N pts" below — plain violet-700
                    drops to ~2.3:1 on the dark surface this sits on, per
                    globals.css's own note. */}
                <summary className="flex cursor-pointer list-none items-center justify-between font-display font-medium text-[15px] text-ink-muted transition-colors duration-150 marker:content-none hover:text-[var(--color-violet-accent-text,var(--color-violet-700))] [&::-webkit-details-marker]:hidden">
                  All {report.checks.length} checks, including passing ones
                  <span
                    aria-hidden="true"
                    className="text-[13px] text-ink-subtle transition-transform group-open:rotate-180"
                  >
                    ▾
                  </span>
                </summary>
                {/* Bare divided list, not a grid of cards — the single most
                    passive section on the page (collapsed by default). */}
                <div className="mt-2 divide-y divide-line border-line border-t">
                  {report.checks.map((check) => (
                    <CheckCard key={check.id} check={check} />
                  ))}
                </div>
              </details>
            </div>
          </div>
        ) : (
          /* Not an empty state — the legend for the report that replaces it. */
          <div className="flex flex-col gap-5">
            <div>
              <h4 className="font-display font-semibold text-[17px] text-ink">
                The {AI_BOTS.length} crawlers we evaluate
              </h4>
              <p className="mt-1 text-[14px] text-ink-muted leading-5">
                Each one gets its own robots.txt verdict, because they are separate
                user-agents with separate rules. OpenAI alone ships three: you can allow
                ChatGPT search while opting out of training.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SPEC_GROUPS.map((group) => (
                  <CompanySpecGroup
                    key={group.company}
                    company={group.company}
                    bots={group.bots}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold text-[17px] text-ink">
                What the score is made of
              </h4>
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
              {/* Kept at the score because the score is where over-reading happens;
                  trimmed to one line since the FAQ elsewhere answers "what does 80+
                  mean" in full. */}
              <p className="hint mt-3">
                100/100 means AI engines <em>can</em> read and parse you — not that they
                will cite you.
              </p>
            </div>
          </div>
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
