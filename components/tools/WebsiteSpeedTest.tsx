'use client'

import {
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  Download,
  Eye,
  FileJson,
  Globe,
  Image as ImageIcon,
  Layers,
  Monitor,
  MousePointerClick,
  Smartphone,
  Sparkles,
  Timer,
  TriangleAlert,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  DonutChart,
  type DonutSegment,
  ErrorDetail,
  ScoreRing,
  SegmentButton,
  StatCard,
  StatusBar,
  StepTimeline,
  type TimelineStep,
  ToolbarGroup,
  ToolToolbar,
} from '@/components/tools/workspace'
import {
  CORE_WEB_VITALS,
  categoryForScore,
  describeThresholds,
  formatReportText,
  formatSavings,
  labelForCategory,
  labelForScore,
  METRIC_LABELS,
  type MetricCategory,
  type MetricId,
  type MetricReading,
  parseApiError,
  parseSpeedTestPayload,
  parseStoredSpeedTest,
  type SpeedTestErrorCode,
  type SpeedTestPayload,
  type Strategy,
  scalePosition,
  selectVitals,
  summariseVerdict,
  validateTestUrl,
} from '@/lib/tools/website-speed-test/logic'

/**
 * Website speed test — single-column report, no left/right split.
 * Research brief: docs/research/website-speed-test.md
 *
 * The only tool on the site with a submit step, and the only one that is not
 * client-side: Google's Lighthouse has to load the page, so a run is 15-40
 * seconds of real Chrome on Google's infrastructure. That is why nothing here
 * computes as you type, and why three pieces of state management matter more than
 * the markup does:
 *
 *   1. **The wait is narrated.** Four stages on timers that roughly track what
 *      PSI is doing, rendered as a checklist with Done / Now / Waiting in words —
 *      not a spinner. The threshold reference stays on screen underneath, so the
 *      40 seconds has something to read rather than something to watch.
 *   2. **Cancel actually cancels.** One `AbortController` per run aborts the
 *      fetch; the stage timers are cleared in the same breath.
 *   3. **A slow run cannot corrupt a newer one.** `runIdRef` is a monotonic run
 *      id, and every continuation — the fetch resolution, the catch, the finally,
 *      each stage timer — checks it before touching state. A superseded response
 *      is dropped rather than overwriting the report you are reading.
 *
 * Layout: this tool dropped the two-pane `ToolWorkspace` for a single-column
 * stacked report (the redesign's "Group C" shape) — the form up top, the whole
 * report below it, because a speed report reads top-to-bottom like the PSI/GTmetrix
 * reports it is replacing, not side-by-side against an input form. It is also the
 * heaviest consumer of the shared `ScoreRing` / `StatCard` / `DonutChart` /
 * `StepTimeline` primitives, all of which render only figures this file already
 * computes from `SpeedTestPayload` — no field here is invented for the sake of
 * filling a tile (see the file-level deviations noted in the redesign report).
 *
 * Every classification, the verdict, the report text and the threshold bands come
 * from logic.ts and are unit-tested. This file is state, markup and the two things
 * that need a browser: `fetch` with an abort signal, and localStorage.
 */

const STORAGE_KEY = 'scult-tools:website-speed-test:v1'

/** Seeded so the first paint shows a runnable form rather than an empty box. */
const SAMPLE_URL = 'https://scult.in/'

const DEVICE_LABEL: Record<Strategy, string> = {
  mobile: 'Mobile',
  desktop: 'Desktop',
}

/** Staged loading copy — roughly tracks what PSI is actually doing. */
const STAGES: readonly { readonly at: number; readonly text: string }[] = [
  { at: 0, text: 'Queuing the test with Google' },
  { at: 4, text: 'Loading your page in Chrome' },
  { at: 12, text: 'Measuring Core Web Vitals' },
  { at: 28, text: 'Building the report' },
]

/** Specific next step per error code — never a bare "something went wrong". */
const ERROR_GUIDANCE: Record<SpeedTestErrorCode, string> = {
  'invalid-url':
    'Check the address for typos and make sure it is a public web page — password-protected and intranet pages cannot be tested.',
  'blocked-url':
    'Only pages reachable from the public internet can be tested — private and internal addresses are blocked.',
  unreachable:
    'Check the page loads in your own browser. If it does, its server may be blocking automated testing.',
  timeout:
    'The page did not respond within 60 seconds — check it loads in your own browser, then run the test again.',
  quota:
    'The free testing quota is briefly exhausted. Wait a minute, then run the test again.',
  upstream: "Google's PageSpeed service hiccuped. Running the test again usually works.",
}

const CATEGORY_TINT: Record<MetricCategory, string> = {
  good: 'bg-tile-green',
  'needs-improvement': 'bg-tile-yellow',
  poor: 'bg-peach',
}

/** Stroke/accent colour for the score ring and the metric-ratings donut. */
const CATEGORY_RING_TONE: Record<MetricCategory, string> = {
  good: 'text-green',
  'needs-improvement': 'text-cta-pure',
  poor: 'text-ink',
}

/** Icon backdrop for the five Core Web Vitals StatCards. */
const CATEGORY_STAT_TONE: Record<MetricCategory, 'green' | 'yellow' | 'lavender'> = {
  good: 'green',
  'needs-improvement': 'yellow',
  poor: 'lavender',
}

/** The five metrics this tool ever measures, in report order. */
const ALL_METRIC_IDS: readonly MetricId[] = ['LCP', 'FCP', 'CLS', 'INP', 'TBT']

const METRIC_ICON: Record<MetricId, typeof Zap> = {
  LCP: ImageIcon,
  FCP: Eye,
  CLS: Layers,
  INP: MousePointerClick,
  TBT: Clock,
}

type Phase = 'idle' | 'running' | 'done' | 'error'

interface TestError {
  readonly message: string
  readonly hint: string
}

/**
 * A rating, always as a word.
 *
 * This is a traffic-light UI, which is the classic WCAG 1.4.1 failure mode, so the
 * tint is the third signal here rather than the first: the word carries the
 * meaning, the icon shape distinguishes the three states without colour, and the
 * pastel fill only reinforces both. Text is `ink` on every tint — white on a
 * pastel would fail contrast outright.
 */
function RatingPill({ category }: { category: MetricCategory }) {
  const Glyph =
    category === 'good'
      ? CircleCheck
      : category === 'needs-improvement'
        ? TriangleAlert
        : CircleAlert
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-ink px-2.5 py-0.5 font-semibold text-[12px] text-ink ${CATEGORY_TINT[category]}`}
    >
      <Glyph className="size-3.5 shrink-0" aria-hidden="true" />
      {labelForCategory(category)}
    </span>
  )
}

/**
 * Where the reading sits between its Good and Poor boundaries.
 *
 * Entirely decorative — `aria-hidden`, and the figure, the rating word and all
 * three bands are rendered as text beside it. It exists because "3.2 s, Needs
 * improvement" does not tell you whether you are 200 ms or 4 seconds from Good.
 */
function ThresholdTrack({ id, value }: { id: MetricId; value: number }) {
  const position = scalePosition(id, value)
  return (
    <div aria-hidden="true" className="relative mt-2.5 h-2.5">
      <div className="flex h-full overflow-hidden rounded-pill border border-line-grey">
        <span className="flex-1 bg-tile-green" />
        <span className="flex-1 bg-tile-yellow" />
        <span className="flex-1 bg-peach" />
      </div>
      <span
        className="absolute top-[-3px] h-4 w-[3px] rounded-pill bg-ink"
        style={{ left: `${position * 100}%`, transform: 'translateX(-50%)' }}
      />
    </div>
  )
}

function SectionHeading({ heading, detail }: { heading: string; detail: string }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-[16px] text-ink">{heading}</h4>
      <p className="mt-1 text-[13px] text-ink-subtle leading-[18px]">{detail}</p>
    </div>
  )
}

/** One Core Web Vital as a StatCard, with its rating pill and threshold track. */
function VitalStatCard({
  id,
  reading,
}: {
  id: MetricId
  reading: MetricReading | undefined
}) {
  const Icon = METRIC_ICON[id]
  if (!reading) {
    return (
      <div className="flex flex-col gap-2">
        <StatCard
          icon={Icon}
          label={id}
          value="—"
          sublabel={`${METRIC_LABELS[id]} · not measured this run`}
          tone="lavender"
        />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <StatCard
        icon={Icon}
        label={id}
        value={reading.display}
        sublabel={reading.label}
        tone={CATEGORY_STAT_TONE[reading.category]}
      />
      <div className="flex items-center justify-between gap-2 px-1">
        <RatingPill category={reading.category} />
      </div>
      <div className="px-1">
        <ThresholdTrack id={id} value={reading.value} />
      </div>
    </div>
  )
}

/**
 * The report before a run — the thresholds the test will judge against,
 * generated from the same `METRIC_THRESHOLDS` the classifier uses.
 *
 * This is what keeps the page from being an empty box while idle. It is also
 * genuinely the reference someone might have come for, so it stays on screen
 * during the run and after an error rather than only filling dead time.
 */
function ThresholdReference({ lead }: { lead: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] text-ink-body leading-6">{lead}</p>

      <table className="w-full border-collapse text-left text-[13px]">
        <caption className="sr-only">
          Google’s Core Web Vitals thresholds, assessed at the 75th percentile
        </caption>
        <thead>
          <tr className="border-ink border-b">
            <th scope="col" className="pb-2 pr-3 font-semibold text-ink">
              Core Web Vital
            </th>
            <th scope="col" className="pb-2 pr-3 font-semibold text-ink">
              Good
            </th>
            <th scope="col" className="pb-2 pr-3 font-semibold text-ink">
              Needs improvement
            </th>
            <th scope="col" className="pb-2 font-semibold text-ink">
              Poor
            </th>
          </tr>
        </thead>
        <tbody>
          {CORE_WEB_VITALS.map((id) => {
            const bands = describeThresholds(id)
            return (
              <tr key={id} className="border-line border-b align-top">
                <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                  <span className="font-semibold text-ink">{id}</span>
                  <span className="block text-ink-subtle">{METRIC_LABELS[id]}</span>
                </th>
                <td className="py-2.5 pr-3 text-ink-body tabular-nums">{bands.good}</td>
                <td className="py-2.5 pr-3 text-ink-body tabular-nums">
                  {bands.needsImprovement}
                </td>
                <td className="py-2.5 text-ink-body tabular-nums">{bands.poor}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="rounded-card border border-line-grey bg-offwhite p-4">
        <p className="font-semibold text-[13px] text-ink">Also measured</p>
        <ul className="mt-2 flex flex-col gap-1.5 text-[13px] text-ink-body leading-5">
          <li>
            <span className="font-semibold">Performance score, 0–100</span> —{' '}
            {labelForScore(95)} at 90 and above, {labelForScore(70)} from 50 to 89,{' '}
            {labelForScore(30)} below 50. A weighted blend of the lab metrics, not a Core
            Web Vitals verdict.
          </li>
          <li>
            <span className="font-semibold">FCP and TBT</span> — lab diagnostics.{' '}
            {METRIC_LABELS.FCP} is Good {describeThresholds('FCP').good};{' '}
            {METRIC_LABELS.TBT} is Good {describeThresholds('TBT').good}.
          </li>
          <li>
            <span className="font-semibold">Up to five fixes</span> — the audits
            Lighthouse estimates would save the most time, largest first.
          </li>
        </ul>
      </div>
    </div>
  )
}

export function WebsiteSpeedTest() {
  const [url, setUrl] = useState(SAMPLE_URL)
  const [strategy, setStrategy] = useState<Strategy>('mobile')
  const [phase, setPhase] = useState<Phase>('idle')
  const [stageIndex, setStageIndex] = useState(0)
  const [result, setResult] = useState<SpeedTestPayload | null>(null)
  const [testedUrl, setTestedUrl] = useState('')
  const [testError, setTestError] = useState<TestError | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const [shareBase, setShareBase] = useState('')
  /** Wall-clock time the finished run took, measured client-side — real, not estimated. */
  const [durationMs, setDurationMs] = useState<number | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const timersRef = useRef<number[]>([])
  /** Monotonic run id. Every async continuation checks it before setting state. */
  const runIdRef = useRef(0)
  const startedAtRef = useRef(0)

  // Seed the form after mount, never during render: the server has neither
  // localStorage nor a query string, and reading either during render would make
  // the first client paint disagree with the server HTML.
  //
  // A shared ?url= link prefills but deliberately does NOT auto-run — otherwise a
  // link could make someone's browser fire a 40-second test just by being opened.
  useEffect(() => {
    setShareBase(`${window.location.origin}${window.location.pathname}`)

    const params = new URLSearchParams(window.location.search)
    const shared = params.get('url')
    if (shared !== null && validateTestUrl(shared).url !== undefined) {
      setUrl(shared)
      const sharedStrategy = params.get('strategy')
      if (sharedStrategy === 'mobile' || sharedStrategy === 'desktop') {
        setStrategy(sharedStrategy)
      }
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === null) return
      const last = parseStoredSpeedTest(JSON.parse(stored))
      if (!last) return
      setUrl(last.url)
      setStrategy(last.strategy)
    } catch {
      // Blocked storage or corrupt JSON — keep the sample instead.
    }
  }, [])

  // Abort the in-flight request and stop the stage timers if the visitor
  // navigates away mid-run.
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      for (const t of timersRef.current) window.clearTimeout(t)
    }
  }, [])

  const verdict = useMemo(
    () => (result === null ? null : summariseVerdict(result)),
    [result],
  )
  const vitals = useMemo(() => (result === null ? null : selectVitals(result)), [result])
  const reportText = useMemo(
    () => (result === null ? '' : formatReportText(result)),
    [result],
  )

  /** One reading per metric id, field data preferred — the same rule `selectVitals` uses. */
  const readingById = useMemo(() => {
    const map = new Map<MetricId, MetricReading>()
    if (result !== null) {
      for (const reading of result.lab) map.set(reading.id, reading)
      for (const reading of result.field) map.set(reading.id, reading)
    }
    return map
  }, [result])

  const running = phase === 'running'
  const stage = STAGES[stageIndex] ?? STAGES[0]
  const stageText = stage?.text ?? 'Running the test'

  function clearStageTimers(): void {
    for (const t of timersRef.current) window.clearTimeout(t)
    timersRef.current = []
  }

  async function runTest(): Promise<void> {
    // `running` is render state, so it is stale for anyone who reaches this in the
    // same task as a previous click — the re-render that disables the button has
    // not committed yet, and two clicks would each see `running === false` and
    // each fire a request. `abortRef` is assigned synchronously below, before the
    // first await, so it is the authoritative in-flight test. Both are checked:
    // the ref is correct, the state check documents the intent.
    if (running || abortRef.current !== null) return

    const validated = validateTestUrl(url)
    const target = validated.url
    if (target === undefined) {
      setUrlError(validated.error ?? 'Enter a valid URL.')
      return
    }

    // Claim a new run id. Bumping it is what makes every continuation of a
    // previous run — a late response, a stage timer, the finally block — a no-op.
    clearStageTimers()
    const runId = runIdRef.current + 1
    runIdRef.current = runId

    setUrlError(null)
    setTestError(null)
    setResult(null)
    setCancelled(false)
    setStageIndex(0)
    setDurationMs(null)
    setPhase('running')
    startedAtRef.current = Date.now()

    timersRef.current = STAGES.slice(1).map((entry, index) =>
      window.setTimeout(() => {
        if (runIdRef.current !== runId) return
        setStageIndex(index + 1)
      }, entry.at * 1000),
    )

    const controller = new AbortController()
    abortRef.current = controller
    const requested = strategy

    try {
      const res = await fetch(
        `/api/speed-test?url=${encodeURIComponent(target)}&strategy=${requested}`,
        { signal: controller.signal },
      )
      const body: unknown = await res.json().catch(() => undefined)
      if (runIdRef.current !== runId) return

      if (!res.ok) {
        const apiError = parseApiError(body)
        const code = apiError?.code ?? 'upstream'
        setTestError({
          message: apiError?.error ?? 'The test failed unexpectedly.',
          hint: ERROR_GUIDANCE[code],
        })
        setPhase('error')
        return
      }

      const payload = parseSpeedTestPayload(body)
      if (!payload) {
        setTestError({
          message: 'The test service returned something unreadable.',
          hint: 'Running the test again usually works.',
        })
        setPhase('error')
        return
      }

      setResult(payload)
      setTestedUrl(target)
      setDurationMs(Date.now() - startedAtRef.current)
      setPhase('done')
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ url: target, strategy: requested }),
        )
      } catch {
        // Private mode blocks writes — remembering the URL is best-effort.
      }
    } catch (err) {
      if (runIdRef.current !== runId) return
      if (err instanceof DOMException && err.name === 'AbortError') {
        setPhase('idle') // cancelled or navigated away — no error to show
        return
      }
      setTestError({
        message: 'Could not reach the test service.',
        hint: 'Check your own connection, then run the test again.',
      })
      setPhase('error')
    } finally {
      // Only the run that still owns the id may clean up — otherwise a superseded
      // run would clear the timers and controller belonging to the current one.
      if (runIdRef.current === runId) {
        clearStageTimers()
        abortRef.current = null
      }
    }
  }

  function cancelTest(): void {
    const controller = abortRef.current
    clearStageTimers()
    abortRef.current = null
    setCancelled(true)
    setStageIndex(0)
    setPhase('idle')
    controller?.abort()
  }

  function clearAll(): void {
    setUrl('')
    setResult(null)
    setTestedUrl('')
    setTestError(null)
    setUrlError(null)
    setCancelled(false)
    setDurationMs(null)
    setPhase('idle')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to remove if storage is blocked.
    }
  }

  function downloadJson(): void {
    if (result === null) return
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = 'website-speed-report.json'
    a.click()
    URL.revokeObjectURL(href)
  }

  const scoreCategory =
    result !== null && result.score !== null ? categoryForScore(result.score) : null

  const sourceDetail =
    result === null
      ? ''
      : result.fieldSource === 'page'
        ? 'What actual Chrome visitors experienced on this page over the last 28 days, at the 75th percentile. This is the data Google’s ranking systems assess.'
        : result.fieldSource === 'origin'
          ? 'Real-user data for this site as a whole (origin-level) — this specific page does not have enough Chrome traffic of its own yet.'
          : 'From this single simulated load. This page has too little Chrome traffic for Google’s real-user (CrUX) dataset, and INP cannot be measured without real users.'

  /** Set after mount, so it is empty during SSR and the button simply hides. */
  const shareLink =
    shareBase === '' || result === null
      ? ''
      : `${shareBase}?url=${encodeURIComponent(
          result.finalUrl === '' ? testedUrl : result.finalUrl,
        )}&strategy=${result.strategy}`

  const deviceMismatch = result !== null && result.strategy !== strategy

  const referenceLead = cancelled
    ? 'Test cancelled — nothing was measured, and no request is still running. Start another whenever you are ready; these are the thresholds every reading will be judged against.'
    : running
      ? 'While that runs: these are the thresholds each reading will be judged against.'
      : phase === 'error'
        ? 'Nothing was measured. These are the thresholds the run would have judged against.'
        : 'Nothing has run yet — this test does not start until you press the button. These are the exact thresholds each reading will be judged against, inclusive on the Good side, so an LCP of exactly 2.5 s passes.'

  const statusMessage = running
    ? `Step ${stageIndex + 1} of ${STAGES.length} — ${stageText}`
    : phase === 'error'
      ? 'Test could not complete'
      : phase === 'done' && verdict !== null
        ? `Report ready — ${verdict.headline}`
        : cancelled
          ? 'Test cancelled — nothing was measured'
          : 'Ready — nothing runs until you press the button'

  // Derived, report-only breakdowns for the three donuts below. Every figure here
  // is read straight off `result` / `vitals` — none of it is invented to fill a
  // tile. See the redesign report for why "resource/page-weight/request" donuts
  // from the wireframe were replaced: PSI's compact payload this tool parses
  // never carried byte-weight or request-count data, and logic.ts is out of scope
  // for this pass.
  const ratingCounts: Record<MetricCategory, number> = {
    good: 0,
    'needs-improvement': 0,
    poor: 0,
  }
  for (const id of ALL_METRIC_IDS) {
    const reading = readingById.get(id)
    if (reading) ratingCounts[reading.category] += 1
  }
  const ratingSegments: DonutSegment[] = (['good', 'needs-improvement', 'poor'] as const)
    .filter((category) => ratingCounts[category] > 0)
    .map((category) => ({
      label: labelForCategory(category),
      value: ratingCounts[category],
      colorClass: CATEGORY_RING_TONE[category],
    }))

  const savingsSegments: DonutSegment[] =
    result?.opportunities.map((o) => ({
      label: o.title,
      value: o.savingsMs,
    })) ?? []
  const totalSavingsMs =
    result?.opportunities.reduce((sum, o) => sum + o.savingsMs, 0) ?? 0

  const coverageSegments: DonutSegment[] =
    vitals === null
      ? []
      : [
          {
            label: 'Core Web Vitals',
            value: vitals.primary.length,
            colorClass: 'text-violet-700',
          },
          {
            label: 'Supporting metrics',
            value: vitals.supporting.length,
            colorClass: 'text-tile-blue',
          },
        ].filter((s) => s.value > 0)

  const timelineSteps: TimelineStep[] = ALL_METRIC_IDS.map((id) => {
    const reading = readingById.get(id)
    return {
      label: id,
      sublabel: reading ? reading.display : 'not measured',
      status: reading ? 'done' : 'pending',
    }
  })

  const topOpportunities = result?.opportunities.slice(0, 3) ?? []

  return (
    <div className="flex flex-col gap-6 rounded-panel border border-line bg-cream p-5 md:p-6">
      <ToolToolbar>
        <ToolbarGroup label="Device">
          <SegmentButton
            active={strategy === 'mobile'}
            onClick={() => setStrategy('mobile')}
            title="A mid-range phone on a throttled 4G connection — what Google ranks you on"
          >
            <span className="inline-flex items-center gap-1.5">
              <Smartphone className="size-4" aria-hidden="true" />
              Mobile
            </span>
          </SegmentButton>
          <SegmentButton
            active={strategy === 'desktop'}
            onClick={() => setStrategy('desktop')}
            title="Fast hardware on broadband — usually a much kinder score"
          >
            <span className="inline-flex items-center gap-1.5">
              <Monitor className="size-4" aria-hidden="true" />
              Desktop
            </span>
          </SegmentButton>
        </ToolbarGroup>
      </ToolToolbar>

      {/* A dedicated, evenly-spaced grid rather than a left-packed flex-wrap
          row — see Schema Markup Generator / FAQ Schema Generator for the
          identical fix. Every page-level action for this tool (load sample,
          clear, run/cancel the test, export) lives here now, instead of split
          across the toolbar, a form-adjacent button row and a bottom export
          bar. `Run test` is this tool's "the thing you came here to click",
          so it gets the default cta-yellow and a double-wide cell at the
          narrowest breakpoint; everything else is `btn-white`. `Cancel` only
          exists while a run is in flight, and Download PDF / Export JSON stay
          mounted but disabled with no report yet, rather than popping in and
          out of the grid. `Copy report` / `Share report` remain their own
          `CopyButton` component near the report itself (see below) — that
          component has no className hook to take on the brand button look,
          matching how both reference tools leave `CopyButton` untouched. */}
      <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => setUrl(SAMPLE_URL)}
          disabled={running}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={running || (url === '' && result === null)}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            void runTest()
          }}
          disabled={running}
          className="btn-brutal btn-brutal-sm w-full col-span-2 sm:col-span-1"
        >
          {running
            ? 'Testing…'
            : result === null
              ? `Run ${DEVICE_LABEL[strategy].toLowerCase()} test`
              : 'Run test again'}
        </button>
        {running ? (
          <button
            type="button"
            onClick={cancelTest}
            className="btn-brutal btn-brutal-sm btn-white w-full"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => window.print()}
          disabled={result === null}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          <Download className="size-4" aria-hidden="true" />
          Download PDF
        </button>
        <button
          type="button"
          onClick={downloadJson}
          disabled={result === null}
          className="btn-brutal btn-brutal-sm btn-white w-full"
        >
          <FileJson className="size-4" aria-hidden="true" />
          Export JSON
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="label" htmlFor="speed-url">
            Page URL
          </label>
          <input
            id="speed-url"
            className="field"
            type="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="https://example.com/pricing"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              if (urlError !== null) setUrlError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !running) {
                e.preventDefault()
                void runTest()
              }
            }}
            aria-describedby={urlError !== null ? 'speed-url-msg' : undefined}
            aria-invalid={urlError !== null || undefined}
          />
          {urlError !== null ? (
            <p
              className="mt-1.5 flex gap-1.5 font-medium text-[13px] text-ink leading-[18px]"
              id="speed-url-msg"
            >
              <TriangleAlert
                className="mt-0.5 size-3.5 shrink-0 text-violet-700"
                aria-hidden="true"
              />
              {urlError}
            </p>
          ) : null}
        </div>

        {deviceMismatch && result !== null ? (
          <p className="rounded-sm border border-ink bg-tile-yellow p-3 text-[13px] text-ink leading-5">
            <TriangleAlert
              className="mr-1.5 inline size-3.5 align-[-2px]"
              aria-hidden="true"
            />
            The report shown is the <strong>{DEVICE_LABEL[result.strategy]}</strong> run.
            You now have <strong>{DEVICE_LABEL[strategy]}</strong> selected — run the test
            again to measure it.
          </p>
        ) : null}
      </div>

      <div className="border-line border-t pt-6">
        {phase === 'running' ? (
          <div className="flex flex-col gap-6">
            <div>
              <div
                role="progressbar"
                aria-label="Speed test in progress"
                className="h-2 w-full overflow-hidden rounded-pill border border-line-grey bg-offwhite"
              >
                <div
                  data-decorative-motion
                  className="h-full w-full animate-pulse rounded-pill bg-violet-500"
                />
              </div>
              <ol className="mt-4 flex flex-col gap-2.5">
                {STAGES.map((entry, index) => {
                  const done = index < stageIndex
                  const now = index === stageIndex
                  return (
                    <li
                      key={entry.text}
                      className="flex items-center gap-2.5 text-[14px]"
                    >
                      {done ? (
                        <Check
                          className="size-4 shrink-0 text-violet-700"
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className={`size-3 shrink-0 rounded-pill border ${
                            now ? 'border-ink bg-violet-700' : 'border-line-grey'
                          }`}
                        />
                      )}
                      <span
                        className={
                          now
                            ? 'font-semibold text-ink'
                            : done
                              ? 'text-ink-muted'
                              : 'text-ink-subtle'
                        }
                      >
                        {entry.text}
                      </span>
                      {/* The state is a word, not just an icon or a weight. */}
                      <span className="ml-auto shrink-0 text-[12px] text-ink-subtle">
                        {done ? 'done' : now ? 'now' : 'waiting'}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="border-line border-t pt-5">
              <ThresholdReference lead={referenceLead} />
            </div>
          </div>
        ) : phase === 'error' && testError !== null ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <ErrorDetail message={testError.message} />
              <p className="text-[14px] text-ink-body leading-6">{testError.hint}</p>
            </div>
            <div className="border-line border-t pt-5">
              <ThresholdReference lead={referenceLead} />
            </div>
          </div>
        ) : phase === 'done' && result !== null && verdict !== null && vitals !== null ? (
          <div className="flex flex-col gap-8">
            {/* Score card */}
            <div className="flex flex-col items-center gap-5 rounded-panel border border-ink bg-offwhite p-6 shadow-brutal sm:flex-row sm:items-center">
              {result.score !== null ? (
                <ScoreRing
                  value={result.score}
                  label="Performance"
                  size="lg"
                  toneClass={
                    scoreCategory ? CATEGORY_RING_TONE[scoreCategory] : undefined
                  }
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="font-display font-bold text-[44px] text-ink-subtle leading-none">
                    —
                  </span>
                  <span className="text-[12px] text-ink-subtle">no score returned</span>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
                <div
                  className={`inline-flex w-fit items-center gap-2 self-center rounded-card border border-ink px-3 py-1.5 font-display font-semibold text-[16px] text-ink sm:self-start ${CATEGORY_TINT[verdict.category]}`}
                >
                  {verdict.category === 'good' ? (
                    <CircleCheck className="size-4.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <TriangleAlert className="size-4.5 shrink-0" aria-hidden="true" />
                  )}
                  {verdict.headline}
                </div>
                <p className="text-[14px] text-ink-body leading-5">{verdict.detail}</p>

                <dl className="mt-1 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                  <div>
                    <dt className="flex items-center gap-1 text-[11px] text-ink-subtle uppercase tracking-[0.06em]">
                      <Globe className="size-3" aria-hidden="true" /> Tested on
                    </dt>
                    <dd className="truncate text-[13px] text-ink" title={result.finalUrl}>
                      {result.finalUrl === '' ? '—' : result.finalUrl}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-[11px] text-ink-subtle uppercase tracking-[0.06em]">
                      <Timer className="size-3" aria-hidden="true" /> Test duration
                    </dt>
                    <dd className="text-[13px] text-ink tabular-nums">
                      {durationMs === null ? '—' : formatSavings(durationMs) || '<1 ms'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-ink-subtle uppercase tracking-[0.06em]">
                      Device
                    </dt>
                    <dd className="text-[13px] text-ink">
                      {DEVICE_LABEL[result.strategy]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-ink-subtle uppercase tracking-[0.06em]">
                      Data source
                    </dt>
                    <dd className="text-[13px] text-ink">
                      {vitals.usingField ? 'Real visitors' : 'Lab only'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Core Web Vitals StatCards */}
            <div>
              <SectionHeading
                heading={
                  vitals.usingField
                    ? 'Core Web Vitals — real visitors'
                    : 'Core Web Vitals — this lab run'
                }
                detail={sourceDetail}
              />
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {ALL_METRIC_IDS.map((id) => (
                  <VitalStatCard key={id} id={id} reading={readingById.get(id)} />
                ))}
              </div>
            </div>

            {/* AI performance summary */}
            <div className="flex flex-col gap-3 rounded-card border border-line-grey bg-violet-50 p-4">
              <h4 className="flex items-center gap-2 font-display font-semibold text-[16px] text-ink">
                <Sparkles className="size-4 text-violet-700" aria-hidden="true" />
                AI performance summary
              </h4>
              <p className="text-[14px] text-ink-body leading-6">
                {verdict.category === 'good'
                  ? `Nice work — ${result.finalUrl === '' ? 'this page' : 'this page'} passes Google's Core Web Vitals for ${vitals.usingField ? 'real visitors' : 'this lab run'}. Keep an eye on the fixes below to hold the score as the page grows.`
                  : `There is room to improve here — ${verdict.detail} Fixing the top opportunities below is the fastest way to move the needle.`}
              </p>
              {topOpportunities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topOpportunities.map((o) => (
                    <span
                      key={o.id}
                      className="chip-savings inline-flex items-center gap-1.5 rounded-pill border border-violet-700 bg-cream px-2.5 py-1 font-medium text-[12px] text-violet-700"
                    >
                      <Zap className="size-3" aria-hidden="true" />
                      {o.title}
                      {o.savingsDisplay !== '' ? (
                        <span className="text-ink-subtle">~{o.savingsDisplay}</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Top opportunities + page load timeline */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="flex items-center gap-2 font-display font-semibold text-[16px] text-ink">
                  <Zap className="size-4 text-violet-700" aria-hidden="true" />
                  Top opportunities
                </h4>
                {result.opportunities.length > 0 ? (
                  <>
                    <p className="hint mt-1">
                      Sorted by the time Lighthouse estimates each fix would save on this
                      load — largest first.
                    </p>
                    <ol className="mt-3 flex flex-col gap-3">
                      {result.opportunities.map((opportunity, index) => (
                        <li key={opportunity.id} className="flex gap-3">
                          <span
                            className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-violet-100 font-semibold text-[13px] text-violet-700"
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-[15px] text-ink leading-5">
                              {opportunity.title}
                              {opportunity.savingsDisplay !== '' ? (
                                <span className="ml-2 whitespace-nowrap font-semibold text-[13px] text-violet-700">
                                  saves ~{opportunity.savingsDisplay}
                                </span>
                              ) : null}
                            </p>
                            {opportunity.description !== '' ? (
                              <p className="mt-0.5 text-[13px] text-ink-subtle leading-[18px]">
                                {opportunity.description}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <p className="mt-3 rounded-sm border border-line-grey bg-tile-green p-3 text-[13px] text-ink leading-5">
                    Lighthouse found no audit with a measurable time saving on this page —
                    there is nothing obvious left to cut.
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-display font-semibold text-[16px] text-ink">
                  Metrics timeline
                </h4>
                <p className="hint mt-1">
                  Every metric this run measured, in report order, with its reading — the
                  network-stage breakdown (DNS/SSL/etc.) PSI's compact response does not
                  expose is not shown rather than guessed.
                </p>
                <div className="mt-3">
                  <StepTimeline steps={timelineSteps} />
                </div>
              </div>
            </div>

            {/* Breakdown donuts */}
            <div>
              <SectionHeading
                heading="Report breakdown"
                detail="Derived from this run's own readings — ratios of rating, estimated fix time and metric coverage."
              />
              <div className="mt-3 grid gap-6 sm:grid-cols-3">
                <div className="flex justify-center">
                  <DonutChart
                    segments={ratingSegments}
                    centerLabel="rated"
                    centerValue={String(
                      ALL_METRIC_IDS.filter((id) => readingById.has(id)).length,
                    )}
                  />
                </div>
                <div className="flex justify-center">
                  <DonutChart
                    segments={savingsSegments}
                    centerLabel="est. savings"
                    centerValue={
                      totalSavingsMs > 0 ? formatSavings(totalSavingsMs) : '0 ms'
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <DonutChart
                    segments={coverageSegments}
                    centerLabel="metrics shown"
                    centerValue={String(vitals.primary.length + vitals.supporting.length)}
                  />
                </div>
              </div>
              <div className="mt-2 grid gap-1 text-center text-[12px] text-ink-subtle sm:grid-cols-3">
                <span>Metric ratings</span>
                <span>Fix time by opportunity</span>
                <span>Core Web Vitals vs. supporting</span>
              </div>
            </div>

            {/* Export bar — Download PDF / Export JSON moved to the top
                action grid (see above); Copy report / Share report stay
                here as `CopyButton`, which has no className hook to take on
                the brand button look. */}
            <div className="flex flex-wrap items-center gap-2 border-line border-t pt-5">
              <CopyButton text={reportText} label="Copy report" />
              {shareLink === '' ? null : (
                <CopyButton
                  text={shareLink}
                  label="Share report"
                  ariaLabel={`Share report — copy link for ${result.finalUrl || testedUrl}`}
                />
              )}
            </div>
          </div>
        ) : (
          <ThresholdReference lead={referenceLead} />
        )}
      </div>

      <div className="border-line border-t pt-4">
        {/* A finished run whose vitals fail is not a "valid" state — it gets the
           alert glyph, so the icon never contradicts the headline beside it. */}
        <StatusBar
          state={
            phase === 'error'
              ? 'invalid'
              : phase !== 'done' || verdict === null
                ? 'neutral'
                : verdict.category === 'good'
                  ? 'valid'
                  : 'invalid'
          }
          message={statusMessage}
          stats={
            phase === 'done' && result !== null && vitals !== null
              ? [
                  {
                    label: 'score',
                    value: result.score === null ? '—' : `${result.score}/100`,
                  },
                  { label: 'device', value: DEVICE_LABEL[result.strategy] },
                  { label: 'data', value: vitals.usingField ? 'real users' : 'lab only' },
                  { label: 'fixes', value: String(result.opportunities.length) },
                ]
              : undefined
          }
          privacyNote="No signup, no stored history — the URL is sent to Google to run the test"
        />
      </div>
    </div>
  )
}
