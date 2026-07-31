'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import { CircleCheck, CircleX, Radar, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  AI_BOTS,
  type ApiError,
  type BandLabel,
  type BotAccess,
  type CheckResult,
  type CheckStatus,
  formatReportText,
  isApiError,
  isVisibilityReport,
  type VisibilityReport,
  validateTargetUrl,
} from '@/lib/tools/ai-visibility-checker/logic'

/**
 * AI visibility checker — rebuilt on the shared workspace.
 * Research brief: docs/research/ai-visibility-checker.md
 *
 * This is a submit-step tool — one of only two here that cannot compute in the
 * browser (the other is the website speed test). A browser cannot read another
 * origin's robots.txt, so every run is a real server-side fetch of somebody
 * else's site: four requests, once each. It must never run as you type.
 *
 * The centrepiece is the per-bot table. Competitors that produce a score never
 * show you a robots rule, and the robots validators that show you a rule never
 * score or audit — so the table carries the verdict, the rule that produced it
 * quoted verbatim, AND which User-agent group won. That last column is the USP:
 * robots precedence (a bot-specific group beating `*`, longest matching path
 * winning inside the group) is the single most misread thing in the file, and
 * showing which group decided is the difference between a verdict and an
 * explanation.
 *
 * Everything this file renders was computed by the pure functions in logic.ts,
 * which owns RFC 9309 precedence, JSON-LD extraction, scoring and the SSRF gate.
 * Nothing here re-derives a verdict.
 *
 * Two safety notes that are load-bearing:
 *   - Every quoted robots rule is untrusted third-party text. It is rendered as
 *     a JSX text child and clamped for length; no raw-HTML injection API is used
 *     anywhere in this file, so a grep for one finds nothing but this sentence.
 *   - Allowed/blocked is never colour alone. It is a word, plus glyphs that
 *     differ in shape, so it survives greyscale and forced-colours themes.
 */

const LAST_URL_KEY = 'scult-tools:ai-visibility-checker:v1'

/** Seeded so the first paint has a real, checkable URL rather than an empty box. */
const SAMPLE_URL = 'https://scult.in'

const LOADING_STAGES = [
  'Fetching the homepage…',
  'Fetching robots.txt…',
  'Checking /llms.txt and the sitemap…',
  'Reading structured data and headings…',
  'Applying robots precedence and scoring…',
] as const

const STATUS_LABEL: Record<CheckStatus, string> = {
  pass: 'Pass',
  warn: 'Check',
  fail: 'Fix',
}

/**
 * Band tiles are light pastels carrying black text — never the reverse. The
 * band word is always present, so the tile is reinforcement, not the signal.
 */
const BAND_TILE: Record<BandLabel, string> = {
  'AI-visible': 'bg-tile-green',
  'Partially visible': 'bg-tile-yellow',
  'Mostly invisible to AI': 'bg-peach',
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
      'Title, meta description, an h1, at least two h2s, and a lang attribute — the five signals answer engines quote.',
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
]

const MAX_RULE_CHARS = 120

/**
 * Robots rules come from a stranger's server. Only a prefix of “/” can win for
 * the path “/”, so the longest rule a site can push into this column is a run of
 * wildcards — cheap to abuse, and a 100 KB cell would destroy the table. Clamp
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

/** The reading of the whole table, so it carries a word AND a distinct shape. */
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
 * The column nobody else ships: the rule that decided, quoted, and the group it
 * came from. `source` distinguishes a bot-specific group (which beats `*`
 * outright) from the wildcard group from robots.txt saying nothing at all.
 */
function RuleCell({ bot }: { bot: BotAccess }) {
  if (bot.matchedRule === undefined) {
    return (
      <>
        <span className="block text-[14px] text-ink-muted">
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
        className="block break-all font-mono text-[13px] text-ink"
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

function CheckCard({ check }: { check: CheckResult }) {
  return (
    <div className="card-flat border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h5 className="font-display font-semibold text-[15px] text-ink">
          {check.label}
          {check.scored ? null : (
            <span className="ml-2 font-sans font-normal text-[12px] text-ink-subtle">
              informational — not scored
            </span>
          )}
        </h5>
        <StatusBadge status={check.status} />
      </div>
      <p className="mt-2 text-[14px] text-ink-muted leading-5">{check.finding}</p>
      <p className="mt-2 text-[14px] text-ink leading-5">
        <span className="font-semibold">Fix: </span>
        {check.fix}
      </p>
    </div>
  )
}

const TH =
  'px-3 py-2 font-sans font-bold text-[12px] text-ink uppercase tracking-[0.06em]'

export function AiVisibilityChecker() {
  const [url, setUrl] = useState(SAMPLE_URL)
  const [inputError, setInputError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [report, setReport] = useState<VisibilityReport | undefined>(undefined)
  const [apiError, setApiError] = useState<ApiError | undefined>(undefined)
  const [blockedOnly, setBlockedOnly] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
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

  // Drop an in-flight check when the component goes away, so a resolved fetch
  // never writes to state nobody is reading. Declared AFTER the boot effect so
  // its cleanup runs after the boot guard has been released.
  useEffect(() => () => abortRef.current?.abort(), [])

  async function copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
    } catch {
      // Clipboard can be blocked by permissions policy or an insecure origin.
      setLinkCopied(false)
    }
  }

  function startOver(): void {
    abortRef.current?.abort()
    setReport(undefined)
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
  const visibleBots =
    report === undefined
      ? []
      : blockedOnly
        ? report.bots.filter((b) => !b.allowed)
        : report.bots

  return (
    <ToolWorkspace
      inputLabel="Site to check"
      outputLabel="Visibility report"
      minHeight="min-h-[32rem]"
      toolbar={
        <ToolToolbar
          actions={
            <>
              <ToolbarAction
                onClick={() => void copyLink()}
                disabled={report === undefined}
              >
                {linkCopied ? 'Link copied' : 'Copy shareable link'}
              </ToolbarAction>
              <ToolbarAction
                onClick={() => {
                  setUrl(SAMPLE_URL)
                  setInputError(undefined)
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
          <ToolbarGroup label="Crawler table">
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
      }
      input={
        <Pane title="Site to check">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (!loading) void runCheckFor(url)
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
                aria-describedby={
                  inputError !== undefined ? 'aiv-url-error' : 'aiv-url-hint'
                }
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

            {/* The plain statement of what leaves our server. Deliberately
                request-level: the legend for the *report* lives in the output
                pane, so no sentence is duplicated across the two panes. */}
            <div className="rounded-card border border-line-grey bg-offwhite p-4">
              <h4 className="font-display font-semibold text-[15px] text-ink">
                Exactly what this does
              </h4>
              <p className="mt-2 text-[14px] text-ink-muted leading-5">
                Our server makes four requests to your domain, once each:
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
                gives up after 10 seconds, and follows at most three redirects. If your
                WAF blocks unfamiliar crawlers, allow that user-agent before you run this
                — otherwise you are measuring your firewall, not your robots.txt.
              </p>
            </div>
          </form>
        </Pane>
      }
      output={
        <Pane
          title="Visibility report"
          actions={
            report !== undefined ? (
              <CopyButton text={formatReportText(report)} label="Copy report" />
            ) : null
          }
        >
          {report !== undefined ? (
            <div className="flex flex-col gap-5">
              <div
                className={`rounded-card border border-ink ${BAND_TILE[report.band]} p-4`}
              >
                <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
                  <p className="font-display font-bold text-[44px] text-ink leading-none tabular-nums">
                    {report.score}
                    <span className="ml-1 font-normal text-[18px] text-ink-muted">
                      /100
                    </span>
                  </p>
                  <p className="font-display font-semibold text-[20px] text-ink">
                    {report.band}
                  </p>
                </div>
                <p className="mt-3 text-[14px] text-ink leading-5">
                  <strong>
                    {report.allowedBotCount} of {report.bots.length}
                  </strong>{' '}
                  AI crawlers can fetch{' '}
                  <span className="break-all font-mono text-[13px]">{report.url}</span>
                </p>
              </div>

              <div>
                <h4 className="font-display font-semibold text-[17px] text-ink">
                  Which AI crawlers can reach you — and the rule that decided
                </h4>
                {crawlerFinding !== undefined ? (
                  <p className="mt-1 text-[14px] text-ink-muted leading-5">
                    {crawlerFinding}
                  </p>
                ) : null}

                {visibleBots.length === 0 ? (
                  <p className="mt-3 rounded-card border border-line-grey bg-tile-green p-3 text-[14px] text-ink leading-5">
                    Nothing is blocked — all {report.bots.length} crawlers are allowed.
                    Switch the toolbar back to “All {AI_BOTS.length} crawlers” to see the
                    rule behind each verdict.
                  </p>
                ) : (
                  <div className="mt-3 overflow-x-auto rounded-card border border-line">
                    <table className="w-full min-w-[30rem] border-collapse bg-white text-left">
                      <caption className="sr-only">
                        Crawl access to “/” for each AI crawler, with the robots.txt rule
                        and the User-agent group that produced each verdict
                      </caption>
                      <thead>
                        <tr className="border-line border-b bg-cream">
                          <th scope="col" className={TH}>
                            Crawler
                          </th>
                          <th scope="col" className={TH}>
                            Run by
                          </th>
                          <th scope="col" className={TH}>
                            Access to /
                          </th>
                          <th scope="col" className={TH}>
                            Rule that decided
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleBots.map((bot) => (
                          <tr
                            key={bot.name}
                            className="border-line border-b align-top last:border-b-0"
                          >
                            <th
                              scope="row"
                              className="px-3 py-2.5 font-mono font-normal text-[13px] text-ink"
                            >
                              {bot.name}
                              <span className="mt-0.5 block font-sans text-[12px] text-ink-subtle leading-4">
                                {bot.purpose}
                              </span>
                            </th>
                            <td className="px-3 py-2.5 text-[14px] text-ink-muted">
                              {bot.company}
                            </td>
                            <td className="px-3 py-2.5">
                              <AccessCell allowed={bot.allowed} />
                            </td>
                            <td className="px-3 py-2.5">
                              <RuleCell bot={bot} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* One-line reading key for the rule column. The full precedence
                    rules (longest path, empty Disallow, Allow ties) are spelled
                    out in howItWorks below — repeating them here clause-for-clause
                    was clutter under an already self-explaining table. */}
                <p className="hint mt-2">
                  A group naming the bot beats{' '}
                  <span className="font-mono">User-agent: *</span> entirely — the rule
                  column quotes whichever group won.
                </p>
              </div>

              <div>
                <h4 className="font-display font-semibold text-[17px] text-ink">
                  The {report.checks.length} checks
                </h4>
                <div className="mt-3 grid gap-3">
                  {report.checks.map((check) => (
                    <CheckCard key={check.id} check={check} />
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
                  To be fair to your site: blocking ScultToolsBot does not mean AI bots
                  are blocked. Plenty of firewalls reject unfamiliar crawlers while
                  letting GPTBot or ClaudeBot through. Allow the user-agent listed on the
                  left, or read your robots.txt and WAF allowlist directly.
                </p>
              ) : null}
              {apiError.code === 'unreachable' ? (
                <p className="text-[14px] text-ink-muted leading-5">
                  Check the site is live and publicly reachable, then try again. Very slow
                  sites exceed our 10-second limit, and more than three redirects is
                  treated as a loop.
                </p>
              ) : null}
              {apiError.code === 'private-address' || apiError.code === 'invalid-url' ? (
                <p className="text-[14px] text-ink-muted leading-5">
                  Only public http and https addresses can be checked. Staging behind a
                  VPN, localhost and private IP ranges are refused on purpose — this
                  endpoint fetches whatever you give it, so it must not be usable to probe
                  an internal network.
                </p>
              ) : null}
            </div>
          ) : loading ? (
            <div className="flex h-full items-center justify-center p-6">
              <div className="text-center">
                {/* data-decorative-motion so globals.css stops the pulse under
                    prefers-reduced-motion; the stage text carries the state. */}
                <Radar
                  className="mx-auto size-6 animate-pulse text-violet-700"
                  aria-hidden="true"
                  data-decorative-motion
                />
                <p className="mt-3 font-medium text-[15px] text-ink">{stageLabel}</p>
                <p className="mt-1 text-[13px] text-ink-subtle">
                  Step {Math.min(stage + 1, LOADING_STAGES.length)} of{' '}
                  {LOADING_STAGES.length}
                </p>
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
                <div className="mt-3 overflow-x-auto rounded-card border border-line">
                  <table className="w-full min-w-[26rem] border-collapse bg-white text-left">
                    <caption className="sr-only">
                      The AI crawlers this tool evaluates, the company behind each and
                      what it feeds
                    </caption>
                    <thead>
                      <tr className="border-line border-b bg-cream">
                        <th scope="col" className={TH}>
                          Crawler
                        </th>
                        <th scope="col" className={TH}>
                          Run by
                        </th>
                        <th scope="col" className={TH}>
                          What it feeds
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {AI_BOTS.map((bot) => (
                        <tr
                          key={bot.name}
                          className="border-line border-b last:border-b-0"
                        >
                          <th
                            scope="row"
                            className="px-3 py-2 font-mono font-normal text-[13px] text-ink"
                          >
                            {bot.name}
                          </th>
                          <td className="px-3 py-2 text-[14px] text-ink-muted">
                            {bot.company}
                          </td>
                          <td className="px-3 py-2 text-[14px] text-ink-muted">
                            {bot.purpose}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                {/* Kept at the score because the score is where over-reading
                    happens; trimmed to one line since the FAQ below answers
                    "what does 80+ mean" in full. */}
                <p className="hint mt-3">
                  100/100 means AI engines <em>can</em> read and parse you — not that they
                  will cite you.
                </p>
              </div>
            </div>
          )}
        </Pane>
      }
      status={
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
                  {
                    label: 'schema types',
                    value: `${report.jsonLdTypes.length}`,
                  },
                ]
              : [{ label: 'crawlers checked', value: `${AI_BOTS.length}` }]
          }
          privacyNote="Four requests to your domain, once — no email, nothing stored"
        />
      }
    />
  )
}
