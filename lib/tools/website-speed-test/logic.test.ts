import { describe, expect, it } from 'vitest'
import {
  CORE_WEB_VITALS,
  categoryForScore,
  classifyMetric,
  describeThresholds,
  formatMetricValue,
  formatReportMarkdown,
  formatReportText,
  formatSavings,
  formatServerResponseTime,
  formatTransferSize,
  isPrivateAddress,
  labelForScore,
  METRIC_LABELS,
  type MetricId,
  type MetricReading,
  parseApiError,
  parsePsiResponse,
  parseSpeedTestPayload,
  parseStoredSpeedTest,
  type SpeedTestPayload,
  scalePosition,
  selectVitals,
  stripAuditMarkdown,
  summariseVerdict,
  validateTestUrl,
} from './logic'

// ---------------------------------------------------------------------------
// Metric classification — every threshold boundary, both sides.
// Google's boundaries are inclusive on the good side: exactly 2.5s LCP is Good.
// ---------------------------------------------------------------------------

describe('classifyMetric — LCP (2.5s / 4.0s)', () => {
  it('treats exactly 2500ms as Good (boundary-inclusive)', () => {
    expect(classifyMetric('LCP', 2500)).toBe('good')
  })
  it('treats 2501ms as Needs improvement', () => {
    expect(classifyMetric('LCP', 2501)).toBe('needs-improvement')
  })
  it('treats exactly 4000ms as Needs improvement', () => {
    expect(classifyMetric('LCP', 4000)).toBe('needs-improvement')
  })
  it('treats 4001ms as Poor', () => {
    expect(classifyMetric('LCP', 4001)).toBe('poor')
  })
})

describe('classifyMetric — INP (200ms / 500ms)', () => {
  it('is Good at exactly 200ms and Needs improvement at 201ms', () => {
    expect(classifyMetric('INP', 200)).toBe('good')
    expect(classifyMetric('INP', 201)).toBe('needs-improvement')
  })
  it('is Needs improvement at exactly 500ms and Poor at 501ms', () => {
    expect(classifyMetric('INP', 500)).toBe('needs-improvement')
    expect(classifyMetric('INP', 501)).toBe('poor')
  })
})

describe('classifyMetric — CLS (0.10 / 0.25)', () => {
  it('is Good at exactly 0.10 and Needs improvement at 0.11', () => {
    expect(classifyMetric('CLS', 0.1)).toBe('good')
    expect(classifyMetric('CLS', 0.11)).toBe('needs-improvement')
  })
  it('is Needs improvement at exactly 0.25 and Poor at 0.26', () => {
    expect(classifyMetric('CLS', 0.25)).toBe('needs-improvement')
    expect(classifyMetric('CLS', 0.26)).toBe('poor')
  })
})

describe('classifyMetric — FCP (1.8s / 3.0s) and TBT (200ms / 600ms)', () => {
  it('classifies FCP on both sides of both boundaries', () => {
    expect(classifyMetric('FCP', 1800)).toBe('good')
    expect(classifyMetric('FCP', 1801)).toBe('needs-improvement')
    expect(classifyMetric('FCP', 3000)).toBe('needs-improvement')
    expect(classifyMetric('FCP', 3001)).toBe('poor')
  })
  it('classifies TBT on both sides of both boundaries', () => {
    expect(classifyMetric('TBT', 200)).toBe('good')
    expect(classifyMetric('TBT', 201)).toBe('needs-improvement')
    expect(classifyMetric('TBT', 600)).toBe('needs-improvement')
    expect(classifyMetric('TBT', 601)).toBe('poor')
  })
  it('degrades a non-finite value to poor instead of throwing', () => {
    expect(classifyMetric('LCP', Number.NaN)).toBe('poor')
  })
})

// ---------------------------------------------------------------------------
// Score labelling — Good >=90 / Needs improvement 50-89 / Poor <50
// ---------------------------------------------------------------------------

describe('labelForScore / categoryForScore', () => {
  it('labels 90 and 100 as Good', () => {
    expect(labelForScore(90)).toBe('Good')
    expect(labelForScore(100)).toBe('Good')
  })
  it('labels 89 and 50 as Needs improvement', () => {
    expect(labelForScore(89)).toBe('Needs improvement')
    expect(labelForScore(50)).toBe('Needs improvement')
  })
  it('labels 49 and 0 as Poor', () => {
    expect(labelForScore(49)).toBe('Poor')
    expect(labelForScore(0)).toBe('Poor')
    expect(categoryForScore(49)).toBe('poor')
  })
})

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

describe('formatMetricValue', () => {
  it('shows paint metrics in seconds with one decimal', () => {
    expect(formatMetricValue('LCP', 2140)).toBe('2.1 s')
    expect(formatMetricValue('FCP', 900)).toBe('0.9 s')
  })
  it('shows TBT and INP in whole milliseconds', () => {
    expect(formatMetricValue('TBT', 184.6)).toBe('185 ms')
    expect(formatMetricValue('INP', 250)).toBe('250 ms')
  })
  it('shows CLS unitless, with extra precision only below 0.01', () => {
    expect(formatMetricValue('CLS', 0.104)).toBe('0.10')
    expect(formatMetricValue('CLS', 0.004)).toBe('0.004')
    expect(formatMetricValue('CLS', 0)).toBe('0')
  })
  it('renders a dash for garbage instead of NaN', () => {
    expect(formatMetricValue('LCP', Number.NaN)).toBe('—')
    expect(formatMetricValue('LCP', -5)).toBe('—')
  })
})

describe('formatSavings', () => {
  it('uses ms below one second and seconds above', () => {
    expect(formatSavings(450)).toBe('450 ms')
    expect(formatSavings(1240)).toBe('1.2 s')
  })
  it('returns an empty string for zero or invalid savings', () => {
    expect(formatSavings(0)).toBe('')
    expect(formatSavings(Number.NaN)).toBe('')
  })
})

describe('formatTransferSize', () => {
  it('rounds bytes to whole KB', () => {
    expect(formatTransferSize(45_000)).toBe('44 KB')
    expect(formatTransferSize(1024)).toBe('1 KB')
  })
  it('floors to 0 KB for zero, negative or non-finite input', () => {
    expect(formatTransferSize(0)).toBe('0 KB')
    expect(formatTransferSize(-5)).toBe('0 KB')
    expect(formatTransferSize(Number.NaN)).toBe('0 KB')
  })
})

describe('formatServerResponseTime', () => {
  it('uses ms below one second and seconds above, same convention as formatMetricValue', () => {
    expect(formatServerResponseTime(420)).toBe('420 ms')
    expect(formatServerResponseTime(1200)).toBe('1.2 s')
  })
  it('shows 0 ms rather than a dash — unlike formatSavings, 0 is a real reading here', () => {
    expect(formatServerResponseTime(0)).toBe('0 ms')
  })
  it('renders a dash for negative or non-finite input', () => {
    expect(formatServerResponseTime(Number.NaN)).toBe('—')
    expect(formatServerResponseTime(-5)).toBe('—')
  })
})

// ---------------------------------------------------------------------------
// URL validation — SSRF list
// ---------------------------------------------------------------------------

describe('validateTestUrl — accepts real public URLs', () => {
  it('accepts a full https URL unchanged', () => {
    expect(validateTestUrl('https://example.com/pricing').url).toBe(
      'https://example.com/pricing',
    )
  })
  it('assumes https for a bare domain', () => {
    expect(validateTestUrl('example.com/pricing').url).toBe('https://example.com/pricing')
  })
  it('never throws on partial input while typing', () => {
    for (const p of ['h', 'ht', 'http', 'https:', 'https:/', 'https://']) {
      expect(() => validateTestUrl(p)).not.toThrow()
    }
    expect(validateTestUrl('https://').error).toBeDefined()
  })
})

describe('validateTestUrl — SSRF guard list', () => {
  const blocked = [
    'http://localhost:3000/admin',
    'https://foo.localhost/x',
    'http://127.0.0.1/',
    'http://127.8.9.1/',
    'http://10.0.0.5/panel',
    'http://172.16.0.1/',
    'http://172.31.255.255/',
    'http://192.168.1.1/router',
    'http://169.254.169.254/latest/meta-data',
    'http://0.0.0.0/',
    'http://100.64.1.2/',
    'http://[::1]/',
    'http://[fd00::1]/',
    'http://[fe80::1]/',
    'http://[::ffff:127.0.0.1]/',
    'http://printer.local/',
    'http://api.internal/health',
    'http://intranet.home.arpa/',
    // WHATWG canonicalises decimal IPv4 to 127.0.0.1 before our check runs
    'http://2130706433/',
  ]
  for (const url of blocked) {
    it(`blocks ${url}`, () => {
      const r = validateTestUrl(url)
      expect(r.error).toBeDefined()
      expect(r.url).toBeUndefined()
    })
  }

  it('does NOT block public edges of the private ranges', () => {
    expect(validateTestUrl('http://172.15.0.1/').error).toBeUndefined()
    expect(validateTestUrl('http://172.32.0.1/').error).toBeUndefined()
    expect(validateTestUrl('http://9.9.9.9/').error).toBeUndefined()
  })

  it('rejects credentials, non-http schemes, dotless hosts and empty input', () => {
    expect(validateTestUrl('https://user:pass@example.com/').error).toBeDefined()
    expect(validateTestUrl('ftp://example.com/file').error).toBeDefined()
    expect(validateTestUrl('javascript://x/%0aalert(1)').error).toBeDefined()
    expect(validateTestUrl('http://intranet/').error).toBeDefined()
    expect(validateTestUrl('   ').error).toBeDefined()
    expect(validateTestUrl(`https://example.com/${'a'.repeat(2100)}`).error).toBeDefined()
  })
})

describe('isPrivateAddress — used on DNS lookup results in the route', () => {
  it('flags loopback, RFC1918, link-local, CGNAT and IPv6 private space', () => {
    for (const ip of [
      '127.0.0.1',
      '10.1.2.3',
      '172.16.5.5',
      '192.168.0.10',
      '169.254.0.1',
      '100.64.0.1',
      '0.0.0.0',
      '224.0.0.1',
      '::1',
      '::',
      'fd12:3456::1',
      'fe80::abcd',
      '::ffff:192.168.0.1',
    ]) {
      expect(isPrivateAddress(ip), ip).toBe(true)
    }
  })
  it('passes public addresses', () => {
    expect(isPrivateAddress('93.184.216.34')).toBe(false)
    expect(isPrivateAddress('2606:4700::6810:1')).toBe(false)
  })
  it('treats unparseable input as private (refuse rather than guess)', () => {
    expect(isPrivateAddress('not-an-ip')).toBe(true)
    expect(isPrivateAddress('999.1.1.1')).toBe(true)
    expect(isPrivateAddress('')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// PSI response parsing — trimmed fixture mirroring the real v5 shape
// ---------------------------------------------------------------------------

const PSI_FIXTURE = {
  id: 'https://example.com/',
  loadingExperience: {
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2200, category: 'FAST' },
      INTERACTION_TO_NEXT_PAINT: { percentile: 250, category: 'AVERAGE' },
      CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 5, category: 'FAST' },
      FIRST_CONTENTFUL_PAINT_MS: { percentile: 1600, category: 'FAST' },
    },
  },
  lighthouseResult: {
    finalDisplayedUrl: 'https://example.com/',
    categories: { performance: { score: 0.87 } },
    audits: {
      'largest-contentful-paint': { numericValue: 3100 },
      'cumulative-layout-shift': { numericValue: 0.02 },
      'first-contentful-paint': { numericValue: 1900 },
      'total-blocking-time': { numericValue: 240 },
      'render-blocking-resources': {
        title: 'Eliminate render-blocking resources',
        description:
          'Resources are blocking the first paint. [Learn how to defer resources](https://web.dev/x/).',
        score: 0.4,
        scoreDisplayMode: 'metricSavings',
        details: { type: 'opportunity', overallSavingsMs: 1240 },
      },
      'unused-javascript': {
        title: 'Reduce unused JavaScript',
        description: 'Trim bundles.',
        score: 0.5,
        scoreDisplayMode: 'metricSavings',
        metricSavings: { LCP: 450, FCP: 100 },
      },
      'uses-http2': { title: 'Use HTTP/2', score: 1, details: { overallSavingsMs: 0 } },
      'passing-audit': {
        title: 'Already fast',
        score: 0.95,
        details: { overallSavingsMs: 800 },
      },
      'some-diagnostic': {
        title: 'Informative only',
        score: null,
        scoreDisplayMode: 'informative',
        details: { overallSavingsMs: 5000 },
      },
      // Current PSI v5 shape: `entity` is a plain string, and there is no
      // `blockingTime` field. The first item deliberately uses the classic
      // `{ text: string }` entity shape too, to exercise the fallback that
      // covers an older Lighthouse version or a reintroduced legacy audit.
      'third-parties-insight': {
        details: {
          type: 'table',
          isEntityGrouped: true,
          items: [
            {
              entity: { text: 'Google Analytics' },
              mainThreadTime: 320.4,
              transferSize: 45_000,
            },
            { entity: 'Google Tag Manager', mainThreadTime: 210.1, transferSize: 30_000 },
            { entity: 'Facebook', mainThreadTime: 150.9, transferSize: 60_000 },
            { entity: 'Hotjar', mainThreadTime: 90, transferSize: 20_000 },
            { entity: 'Intercom', mainThreadTime: 60, transferSize: 15_000 },
            { entity: 'Zero-cost widget', mainThreadTime: 0, transferSize: 500 },
          ],
        },
      },
      'resource-summary': {
        details: {
          type: 'table',
          items: [
            {
              resourceType: 'document',
              label: 'Document',
              requestCount: 1,
              transferSize: 12_000,
            },
            {
              resourceType: 'script',
              label: 'Script',
              requestCount: 8,
              transferSize: 250_000,
            },
            {
              resourceType: 'stylesheet',
              label: 'Stylesheet',
              requestCount: 2,
              transferSize: 40_000,
            },
            {
              resourceType: 'image',
              label: 'Image',
              requestCount: 5,
              transferSize: 180_000,
            },
            {
              resourceType: 'font',
              label: 'Font',
              requestCount: 1,
              transferSize: 30_000,
            },
            {
              resourceType: 'other',
              label: 'Other',
              requestCount: 3,
              transferSize: 5_000,
            },
            {
              resourceType: 'third-party',
              label: 'Third-party',
              requestCount: 6,
              transferSize: 170_000,
            },
            {
              resourceType: 'total',
              label: 'Total',
              requestCount: 20,
              transferSize: 517_000,
            },
          ],
        },
      },
      'server-response-time': { numericValue: 420 },
    },
  },
}

/** A minimally valid response — enough to pass parsePsiResponse's overall
 * validity check (needs a score, lab metric or field metric) while carrying
 * no audits at all, for "the audit is missing entirely" cases below. */
const MINIMAL_VALID_RESPONSE = {
  lighthouseResult: { categories: { performance: { score: 0.5 } }, audits: {} },
}

describe('parsePsiResponse — happy path', () => {
  const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')

  it('converts the 0-1 Lighthouse score to a 0-100 integer', () => {
    expect(parsed.error).toBeUndefined()
    expect(parsed.payload?.score).toBe(87)
  })

  it('extracts and classifies lab metrics against the real thresholds', () => {
    const lab = parsed.payload?.lab ?? []
    const lcp = lab.find((m) => m.id === 'LCP')
    expect(lcp?.value).toBe(3100)
    expect(lcp?.category).toBe('needs-improvement')
    expect(lcp?.display).toBe('3.1 s')
    expect(lab.find((m) => m.id === 'CLS')?.category).toBe('good')
    expect(lab.find((m) => m.id === 'TBT')?.category).toBe('needs-improvement')
    expect(lab.find((m) => m.id === 'FCP')?.category).toBe('needs-improvement')
  })

  it('extracts field data, rescaling the CrUX CLS percentile by 1/100', () => {
    const field = parsed.payload?.field ?? []
    expect(parsed.payload?.fieldSource).toBe('page')
    expect(field.find((m) => m.id === 'CLS')?.value).toBeCloseTo(0.05)
    expect(field.find((m) => m.id === 'CLS')?.category).toBe('good')
    expect(field.find((m) => m.id === 'INP')?.category).toBe('needs-improvement')
    expect(field.find((m) => m.id === 'LCP')?.category).toBe('good')
  })

  it('sorts opportunities by estimated savings and skips passing/informative audits', () => {
    const opps = parsed.payload?.opportunities ?? []
    expect(opps.map((o) => o.id)).toEqual([
      'render-blocking-resources',
      'unused-javascript',
    ])
    expect(opps[0]?.savingsMs).toBe(1240)
    expect(opps[0]?.savingsDisplay).toBe('1.2 s')
    expect(opps[1]?.savingsMs).toBe(450)
  })

  it('strips markdown and learn-more links from audit descriptions', () => {
    const first = parsed.payload?.opportunities[0]
    expect(first?.description).toBe('Resources are blocking the first paint.')
    expect(first?.description).not.toContain('](')
  })

  it('marks origin-level CrUX data as the origin fallback', () => {
    const withFallback = {
      ...PSI_FIXTURE,
      loadingExperience: { ...PSI_FIXTURE.loadingExperience, origin_fallback: true },
    }
    expect(parsePsiResponse(withFallback, 'desktop').payload?.fieldSource).toBe('origin')
  })
})

describe('parsePsiResponse — malformed payloads degrade gracefully', () => {
  it('reports unreadable roots as an error, never throws', () => {
    expect(parsePsiResponse(null, 'mobile').error).toBeDefined()
    expect(parsePsiResponse('nope', 'mobile').error).toBeDefined()
    expect(parsePsiResponse({}, 'mobile').error).toBeDefined()
    expect(parsePsiResponse([], 'mobile').error).toBeDefined()
  })

  it('skips non-numeric and negative metric values instead of rendering NaN', () => {
    const parsed = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: {
            'largest-contentful-paint': { numericValue: 'fast' },
            'cumulative-layout-shift': { numericValue: -1 },
            'total-blocking-time': { numericValue: 240 },
          },
        },
      },
      'mobile',
    )
    expect(parsed.payload?.lab.map((m) => m.id)).toEqual(['TBT'])
  })

  it('returns a payload with a null score when the score is missing or out of range', () => {
    const parsed = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 2 } },
          audits: { 'largest-contentful-paint': { numericValue: 1200 } },
        },
      },
      'desktop',
    )
    expect(parsed.error).toBeUndefined()
    expect(parsed.payload?.score).toBeNull()
    expect(parsed.payload?.fieldSource).toBe('none')
  })
})

describe('parsePsiResponse — third-party cost (third-parties-insight audit)', () => {
  it('ranks entities by main-thread time, largest first, capped at five', () => {
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    const thirdParty = parsed.payload?.thirdParty ?? []
    expect(thirdParty.map((t) => t.name)).toEqual([
      'Google Analytics',
      'Google Tag Manager',
      'Facebook',
      'Hotjar',
      'Intercom',
    ])
  })

  it('formats main-thread time and transfer size for the top entity', () => {
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    const top = parsed.payload?.thirdParty[0]
    expect(top?.mainThreadMs).toBe(320)
    expect(top?.mainThreadDisplay).toBe('320 ms')
    expect(top?.transferSize).toBe(45_000)
    expect(top?.transferDisplay).toBe('44 KB')
  })

  it('reads the classic `{ text: string }` entity shape as well as the current plain string', () => {
    // PSI_FIXTURE's top entity ("Google Analytics") uses the old shape, every
    // other entity uses the current one — both must parse.
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    const names = (parsed.payload?.thirdParty ?? []).map((t) => t.name)
    expect(names).toContain('Google Analytics')
    expect(names).toContain('Google Tag Manager')
  })

  it('excludes an entity with zero measurable main-thread cost', () => {
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    const names = (parsed.payload?.thirdParty ?? []).map((t) => t.name)
    expect(names).not.toContain('Zero-cost widget')
  })

  it('returns an empty array — never throws — when the audit is missing entirely', () => {
    const parsed = parsePsiResponse(MINIMAL_VALID_RESPONSE, 'mobile')
    expect(parsed.payload?.thirdParty).toEqual([])
  })

  it('returns an empty array when details.items is missing or not an array', () => {
    const parsed = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: { 'third-parties-insight': { details: {} } },
        },
      },
      'mobile',
    )
    expect(parsed.payload?.thirdParty).toEqual([])
  })

  it('skips malformed entries instead of throwing (no entity name, non-numeric time)', () => {
    const parsed = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: {
            'third-parties-insight': {
              details: {
                items: [
                  { entity: {}, mainThreadTime: 100 },
                  { entity: 'Broken', mainThreadTime: 'lots' },
                  { entity: 'Legit', mainThreadTime: 50, transferSize: 1000 },
                ],
              },
            },
          },
        },
      },
      'mobile',
    )
    expect(parsed.payload?.thirdParty.map((t) => t.name)).toEqual(['Legit'])
  })

  it('treats a missing transfer size as 0 rather than dropping the entity', () => {
    const parsed = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: {
            'third-parties-insight': {
              details: { items: [{ entity: 'No size', mainThreadTime: 40 }] },
            },
          },
        },
      },
      'mobile',
    )
    expect(parsed.payload?.thirdParty[0]).toMatchObject({
      name: 'No size',
      transferSize: 0,
      transferDisplay: '0 KB',
    })
  })
})

describe('parsePsiResponse — resource breakdown (resource-summary audit)', () => {
  it('excludes the third-party and total aggregate rows', () => {
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    const types = (parsed.payload?.resourceBreakdown ?? []).map((r) => r.resourceType)
    expect(types).not.toContain('third-party')
    expect(types).not.toContain('total')
    expect(types).toEqual(['script', 'image', 'stylesheet', 'font', 'document', 'other'])
  })

  it('formats transfer size in whole KB and keeps the request count', () => {
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    const script = parsed.payload?.resourceBreakdown.find(
      (r) => r.resourceType === 'script',
    )
    expect(script).toMatchObject({
      label: 'Script',
      requestCount: 8,
      transferSize: 250_000,
      transferDisplay: '244 KB',
    })
  })

  it('returns an empty array — never throws — when the audit is missing entirely', () => {
    const parsed = parsePsiResponse(MINIMAL_VALID_RESPONSE, 'mobile')
    expect(parsed.payload?.resourceBreakdown).toEqual([])
  })

  it('drops rows with zero requests and rows missing a type or label', () => {
    const parsed = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: {
            'resource-summary': {
              details: {
                items: [
                  {
                    resourceType: 'font',
                    label: 'Font',
                    requestCount: 0,
                    transferSize: 0,
                  },
                  { resourceType: 'image', requestCount: 3, transferSize: 1000 },
                  { label: 'Weird', requestCount: 2, transferSize: 500 },
                  {
                    resourceType: 'other',
                    label: 'Other',
                    requestCount: 2,
                    transferSize: 900,
                  },
                ],
              },
            },
          },
        },
      },
      'mobile',
    )
    expect(parsed.payload?.resourceBreakdown.map((r) => r.resourceType)).toEqual([
      'other',
    ])
  })
})

describe('parsePsiResponse — server response time (server-response-time audit)', () => {
  it('extracts the numericValue in ms', () => {
    const parsed = parsePsiResponse(PSI_FIXTURE, 'mobile')
    expect(parsed.payload?.serverResponseMs).toBe(420)
  })

  it('is null when the audit is missing entirely', () => {
    const parsed = parsePsiResponse(MINIMAL_VALID_RESPONSE, 'mobile')
    expect(parsed.payload?.serverResponseMs).toBeNull()
  })

  it('is null rather than NaN when numericValue is non-numeric or negative', () => {
    const nonNumeric = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: { 'server-response-time': { numericValue: 'slow' } },
        },
      },
      'mobile',
    )
    expect(nonNumeric.payload?.serverResponseMs).toBeNull()

    const negative = parsePsiResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 } },
          audits: { 'server-response-time': { numericValue: -10 } },
        },
      },
      'mobile',
    )
    expect(negative.payload?.serverResponseMs).toBeNull()
  })
})

describe('stripAuditMarkdown', () => {
  it('flattens links and backticks', () => {
    expect(stripAuditMarkdown('Use [preload](https://x.dev) for `hero.jpg`.')).toBe(
      'Use preload for hero.jpg.',
    )
  })
})

// ---------------------------------------------------------------------------
// Client-side parsers
// ---------------------------------------------------------------------------

describe('parseSpeedTestPayload', () => {
  it('round-trips a payload produced by parsePsiResponse', () => {
    const payload = parsePsiResponse(PSI_FIXTURE, 'mobile').payload
    const roundTripped = parseSpeedTestPayload(JSON.parse(JSON.stringify(payload)))
    expect(roundTripped).toEqual(payload)
  })
  it('rejects wrong shapes without throwing', () => {
    expect(parseSpeedTestPayload(null)).toBeUndefined()
    expect(parseSpeedTestPayload({ strategy: 'mobile' })).toBeUndefined()
    expect(
      parseSpeedTestPayload({
        strategy: 'tablet',
        score: 50,
        lab: [],
        field: [],
        fieldSource: 'none',
        opportunities: [],
      }),
    ).toBeUndefined()
  })
})

describe('parseSpeedTestPayload — third-party / resource breakdown / TTFB', () => {
  const base = {
    finalUrl: 'https://example.com/',
    strategy: 'mobile' as const,
    score: 80,
    lab: [],
    field: [],
    fieldSource: 'none' as const,
    opportunities: [],
  }

  it('defaults all three to empty/null when absent — a response cached from before this field existed', () => {
    const parsed = parseSpeedTestPayload(base)
    expect(parsed).toBeDefined()
    expect(parsed?.thirdParty).toEqual([])
    expect(parsed?.resourceBreakdown).toEqual([])
    expect(parsed?.serverResponseMs).toBeNull()
  })

  it('accepts a well-formed set of all three fields', () => {
    const parsed = parseSpeedTestPayload({
      ...base,
      thirdParty: [
        {
          name: 'Google Analytics',
          mainThreadMs: 320,
          mainThreadDisplay: '320 ms',
          transferSize: 45_000,
          transferDisplay: '44 KB',
        },
      ],
      resourceBreakdown: [
        {
          resourceType: 'script',
          label: 'Script',
          requestCount: 8,
          transferSize: 250_000,
          transferDisplay: '244 KB',
        },
      ],
      serverResponseMs: 420,
    })
    expect(parsed?.thirdParty).toHaveLength(1)
    expect(parsed?.resourceBreakdown).toHaveLength(1)
    expect(parsed?.serverResponseMs).toBe(420)
  })

  it('accepts an explicit null serverResponseMs', () => {
    expect(
      parseSpeedTestPayload({ ...base, serverResponseMs: null })?.serverResponseMs,
    ).toBeNull()
  })

  it('rejects the whole payload when thirdParty is present but not an array', () => {
    expect(parseSpeedTestPayload({ ...base, thirdParty: 'nope' })).toBeUndefined()
  })

  it('rejects the whole payload when a thirdParty entry is missing required fields', () => {
    expect(
      parseSpeedTestPayload({ ...base, thirdParty: [{ name: 'X' }] }),
    ).toBeUndefined()
  })

  it('rejects the whole payload when resourceBreakdown is present but not an array', () => {
    expect(parseSpeedTestPayload({ ...base, resourceBreakdown: 'nope' })).toBeUndefined()
  })

  it('rejects the whole payload when a resourceBreakdown entry is missing required fields', () => {
    expect(
      parseSpeedTestPayload({ ...base, resourceBreakdown: [{ resourceType: 'script' }] }),
    ).toBeUndefined()
  })

  it('rejects the whole payload when serverResponseMs is present but not a number', () => {
    expect(parseSpeedTestPayload({ ...base, serverResponseMs: 'slow' })).toBeUndefined()
  })
})

describe('parseApiError', () => {
  it('accepts a known error shape and rejects unknown codes', () => {
    expect(parseApiError({ code: 'quota', error: 'Too many tests.' })).toEqual({
      code: 'quota',
      error: 'Too many tests.',
    })
    expect(parseApiError({ code: 'weird', error: 'x' })).toBeUndefined()
    expect(parseApiError('<html>gateway error</html>')).toBeUndefined()
  })
})

describe('parseStoredSpeedTest', () => {
  it('accepts a valid remembered test', () => {
    expect(
      parseStoredSpeedTest({ url: 'https://example.com/', strategy: 'desktop' }),
    ).toEqual({ url: 'https://example.com/', strategy: 'desktop' })
  })
  it('rejects bad shapes and URLs that no longer pass validation', () => {
    expect(parseStoredSpeedTest(null)).toBeUndefined()
    expect(parseStoredSpeedTest({ url: 'https://example.com/' })).toBeUndefined()
    expect(
      parseStoredSpeedTest({ url: 'http://127.0.0.1/', strategy: 'mobile' }),
    ).toBeUndefined()
    expect(parseStoredSpeedTest({ url: 42, strategy: 'mobile' })).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Verdict + presentation helpers.
// ---------------------------------------------------------------------------

/** Builds a reading the same way the parser does, so categories are real. */
function reading(id: MetricId, value: number): MetricReading {
  return {
    id,
    label: METRIC_LABELS[id],
    value,
    display: formatMetricValue(id, value),
    category: classifyMetric(id, value),
  }
}

function payload(over: Partial<SpeedTestPayload> = {}): SpeedTestPayload {
  return {
    finalUrl: 'https://example.com/pricing',
    strategy: 'mobile',
    score: 62,
    lab: [
      reading('LCP', 3200),
      reading('CLS', 0.04),
      reading('FCP', 1900),
      reading('TBT', 310),
    ],
    field: [],
    fieldSource: 'none',
    opportunities: [],
    thirdParty: [],
    resourceBreakdown: [],
    serverResponseMs: null,
    ...over,
  }
}

describe('selectVitals', () => {
  it('headlines CrUX readings when the page has field data', () => {
    const result = selectVitals(
      payload({
        field: [reading('LCP', 2100), reading('INP', 180), reading('CLS', 0.05)],
        fieldSource: 'page',
      }),
    )
    expect(result.usingField).toBe(true)
    expect(result.primary.map((m) => m.id)).toEqual(['LCP', 'INP', 'CLS'])
    // Every lab reading is kept as supporting detail, including lab LCP/CLS.
    expect(result.supporting.map((m) => m.id)).toEqual(['LCP', 'CLS', 'FCP', 'TBT'])
  })

  it('falls back to lab vitals when there is no field data at all', () => {
    const result = selectVitals(payload())
    expect(result.usingField).toBe(false)
    expect(result.primary.map((m) => m.id)).toEqual(['LCP', 'CLS'])
    expect(result.supporting.map((m) => m.id)).toEqual(['FCP', 'TBT'])
  })

  it('falls back to lab when CrUX returned only non-vital metrics', () => {
    // A low-traffic page can get field FCP with no LCP/INP/CLS. Headlining an
    // empty set would leave the report with no vitals section at all.
    const result = selectVitals(
      payload({ field: [reading('FCP', 1500)], fieldSource: 'origin' }),
    )
    expect(result.usingField).toBe(false)
    expect(result.primary.map((m) => m.id)).toEqual(['LCP', 'CLS'])
  })
})

describe('summariseVerdict', () => {
  it('reports passing when every assessed vital is Good', () => {
    const verdict = summariseVerdict(
      payload({
        field: [reading('LCP', 2000), reading('INP', 120), reading('CLS', 0.02)],
        fieldSource: 'page',
      }),
    )
    expect(verdict.category).toBe('good')
    expect(verdict.headline).toBe('Core Web Vitals: passing')
    expect(verdict.failing).toEqual([])
    expect(verdict.detail).toContain('LCP, INP and CLS')
    expect(verdict.detail).toContain('real visitors')
  })

  it('names the single failing vital and uses the singular verb', () => {
    const verdict = summariseVerdict(
      payload({
        field: [reading('LCP', 5200), reading('INP', 150), reading('CLS', 0.03)],
        fieldSource: 'page',
      }),
    )
    expect(verdict.headline).toBe('Core Web Vitals: LCP needs work')
    expect(verdict.category).toBe('poor')
    expect(verdict.failing).toEqual(['LCP'])
    expect(verdict.detail).toContain('5.2 s')
    // The boundary it missed is stated, not just the reading.
    expect(verdict.detail).toContain('2.5 s')
  })

  it('lists two failing vitals with "and" and the plural verb', () => {
    const verdict = summariseVerdict(
      payload({
        field: [reading('LCP', 3000), reading('INP', 150), reading('CLS', 0.4)],
        fieldSource: 'page',
      }),
    )
    expect(verdict.headline).toBe('Core Web Vitals: LCP and CLS need work')
    expect(verdict.failing).toEqual(['LCP', 'CLS'])
  })

  it('is "needs-improvement" overall when nothing is outright Poor', () => {
    const verdict = summariseVerdict(
      payload({
        field: [reading('LCP', 3000), reading('CLS', 0.15)],
        fieldSource: 'page',
      }),
    )
    expect(verdict.category).toBe('needs-improvement')
  })

  it('names the metric furthest past its own boundary, not the first listed', () => {
    // CLS at 0.4 is 4x its 0.10 boundary; LCP at 4.1s is only 1.64x its 2.5s one.
    // Both are Poor, so the tie-break has to be relative overshoot.
    const verdict = summariseVerdict(
      payload({
        field: [reading('LCP', 4100), reading('CLS', 0.4)],
        fieldSource: 'page',
      }),
    )
    expect(verdict.detail).toContain('Cumulative Layout Shift (CLS)')
  })

  it('degrades honestly when no vital was measured', () => {
    const verdict = summariseVerdict(payload({ lab: [reading('TBT', 300)] }))
    expect(verdict.headline).toBe('No Core Web Vitals to judge')
    expect(verdict.failing).toEqual([])
  })
})

describe('describeThresholds', () => {
  it('formats every Core Web Vital band from the shared thresholds', () => {
    expect(describeThresholds('LCP')).toEqual({
      good: '≤ 2.5 s',
      needsImprovement: '2.5 s – 4.0 s',
      poor: '> 4.0 s',
    })
    expect(describeThresholds('INP')).toEqual({
      good: '≤ 200 ms',
      needsImprovement: '200 ms – 500 ms',
      poor: '> 500 ms',
    })
    expect(describeThresholds('CLS')).toEqual({
      good: '≤ 0.10',
      needsImprovement: '0.10 – 0.25',
      poor: '> 0.25',
    })
  })

  it('covers the lab diagnostics too', () => {
    expect(describeThresholds('FCP').good).toBe('≤ 1.8 s')
    expect(describeThresholds('TBT').poor).toBe('> 600 ms')
  })

  it('agrees with classifyMetric at every Good boundary', () => {
    for (const id of CORE_WEB_VITALS) {
      const good = describeThresholds(id).good.replace('≤ ', '')
      expect(good).toBe(
        formatMetricValue(id, id === 'CLS' ? 0.1 : id === 'LCP' ? 2500 : 200),
      )
    }
  })
})

describe('scalePosition', () => {
  it('pins the Good and Poor boundaries at one and two thirds', () => {
    expect(scalePosition('LCP', 2500)).toBeCloseTo(1 / 3, 6)
    expect(scalePosition('LCP', 4000)).toBeCloseTo(2 / 3, 6)
    expect(scalePosition('CLS', 0.1)).toBeCloseTo(1 / 3, 6)
  })
  it('clamps a catastrophic value inside the track instead of overflowing', () => {
    expect(scalePosition('LCP', 30_000)).toBe(1)
    expect(scalePosition('LCP', 30_000)).toBeLessThanOrEqual(1)
  })
  it('returns 0 for zero and for a non-finite value', () => {
    expect(scalePosition('CLS', 0)).toBe(0)
    expect(scalePosition('LCP', Number.NaN)).toBe(0)
  })
})

describe('formatReportText', () => {
  it('leads with the URL, score band and verdict', () => {
    const text = formatReportText(
      payload({
        field: [reading('LCP', 5200), reading('INP', 150), reading('CLS', 0.03)],
        fieldSource: 'page',
        opportunities: [
          {
            id: 'unused-javascript',
            title: 'Reduce unused JavaScript',
            savingsMs: 1200,
            savingsDisplay: '1.2 s',
            description: 'Ship less script.',
          },
        ],
      }),
    )
    expect(text).toContain('https://example.com/pricing')
    expect(text).toContain('Performance score: 62 / 100 — Needs improvement')
    expect(text).toContain('Core Web Vitals: LCP needs work')
    expect(text).toContain('1. Reduce unused JavaScript — saves ~1.2 s')
    // Every metric line carries its rating as a word, not just a number.
    expect(text).toContain('Good')
    expect(text).toContain('Poor')
  })

  it('says so plainly when there is no score and no opportunities', () => {
    const text = formatReportText(payload({ score: null, opportunities: [] }))
    expect(text).toContain('Performance score: not returned')
    expect(text).not.toContain('Fix these first')
  })

  it('labels lab-only reports as lab, and field reports as CrUX', () => {
    expect(formatReportText(payload())).toContain('Core Web Vitals — lab data')
    expect(
      formatReportText(payload({ field: [reading('LCP', 2000)], fieldSource: 'page' })),
    ).toContain('Chrome UX Report')
  })
})

// ---------------------------------------------------------------------------
// formatReportMarkdown — the markdown-specific sibling of formatReportText.
// ---------------------------------------------------------------------------

describe('formatReportMarkdown', () => {
  it('leads with a top-level heading, the URL, score and verdict', () => {
    const text = formatReportMarkdown(
      payload({
        field: [reading('LCP', 5200), reading('INP', 150), reading('CLS', 0.03)],
        fieldSource: 'page',
      }),
    )
    expect(text).toContain('# Website speed test report')
    expect(text).toContain('**URL:** https://example.com/pricing')
    expect(text).toContain('**Performance score:** 62 / 100 — Needs improvement')
    expect(text).toContain('## Verdict')
    expect(text).toContain('**Core Web Vitals: LCP needs work**')
  })

  it('renders the Core Web Vitals as a real markdown table, not a padded plain-text block', () => {
    const text = formatReportMarkdown(
      payload({
        field: [reading('LCP', 2000), reading('INP', 120), reading('CLS', 0.02)],
        fieldSource: 'page',
      }),
    )
    expect(text).toContain(
      '## Core Web Vitals — real-user data (Chrome UX Report, 28 days, 75th percentile)',
    )
    expect(text).toContain('| Metric | Reading | Rating | Good threshold |')
    expect(text).toContain('| --- | --- | --- | --- |')
    expect(text).toContain('| LCP — Largest Contentful Paint | 2.0 s | Good | ≤ 2.5 s |')
    // Not just formatReportText re-labelled: no hand-padded plain-text lines.
    expect(text).not.toMatch(/^ {2}LCP {2}/m)
  })

  it('renders supporting lab metrics as their own table', () => {
    const text = formatReportMarkdown(payload())
    expect(text).toContain('## Supporting lab metrics — this run')
    expect(text).toContain('| FCP — First Contentful Paint |')
  })

  it('numbers opportunities as a real markdown list with bold titles and descriptions', () => {
    const text = formatReportMarkdown(
      payload({
        opportunities: [
          {
            id: 'unused-javascript',
            title: 'Reduce unused JavaScript',
            savingsMs: 1200,
            savingsDisplay: '1.2 s',
            description: 'Ship less script.',
          },
        ],
      }),
    )
    expect(text).toContain('## Fix these first')
    expect(text).toContain('1. **Reduce unused JavaScript** — saves ~1.2 s')
    expect(text).toContain('   Ship less script.')
  })

  it('omits the Fix these first section entirely when there are no opportunities', () => {
    expect(formatReportMarkdown(payload({ opportunities: [] }))).not.toContain(
      'Fix these first',
    )
  })

  it('says so plainly when there is no score at all', () => {
    expect(formatReportMarkdown(payload({ score: null }))).toContain(
      '**Performance score:** not returned',
    )
  })

  it('covers TTFB, third-party cost and resource breakdown — data formatReportText omits', () => {
    const text = formatReportMarkdown(
      payload({
        serverResponseMs: 420,
        thirdParty: [
          {
            name: 'Google Analytics',
            mainThreadMs: 320,
            mainThreadDisplay: '320 ms',
            transferSize: 45_000,
            transferDisplay: '44 KB',
          },
        ],
        resourceBreakdown: [
          {
            resourceType: 'script',
            label: 'Script',
            requestCount: 8,
            transferSize: 250_000,
            transferDisplay: '244 KB',
          },
        ],
      }),
    )
    expect(text).toContain('## Beyond the Core Web Vitals')
    expect(text).toContain('**Server response time (TTFB):** 420 ms')
    expect(text).toContain('### Third-party cost')
    expect(text).toContain('| Google Analytics | 320 ms | 44 KB |')
    expect(text).toContain('### Resource breakdown')
    expect(text).toContain('| Script | 244 KB | 8 |')
  })

  it('omits the Beyond the Core Web Vitals section entirely when none of the three are present', () => {
    const text = formatReportMarkdown(
      payload({ serverResponseMs: null, thirdParty: [], resourceBreakdown: [] }),
    )
    expect(text).not.toContain('Beyond the Core Web Vitals')
  })

  it('escapes a literal pipe in an audit title or third-party name so the table cannot break', () => {
    const text = formatReportMarkdown(
      payload({
        thirdParty: [
          {
            name: 'A | B',
            mainThreadMs: 10,
            mainThreadDisplay: '10 ms',
            transferSize: 0,
            transferDisplay: '0 KB',
          },
        ],
      }),
    )
    expect(text).toContain('| A \\| B | 10 ms | 0 KB |')
  })

  it('includes a generated-at line only when the caller supplies one', () => {
    const withoutDate = formatReportMarkdown(payload())
    expect(withoutDate).toContain('Generated by the [Website Speed Test]')
    expect(withoutDate).not.toContain('Generated Aug')

    const withDate = formatReportMarkdown(payload(), 'Aug 8, 2026, 3:45 PM')
    expect(withDate).toContain(
      'Generated Aug 8, 2026, 3:45 PM by the [Website Speed Test]',
    )
  })

  it('never calls Date.now() or reads the system clock — deterministic for the same payload', () => {
    const a = formatReportMarkdown(payload())
    const b = formatReportMarkdown(payload())
    expect(a).toBe(b)
  })
})
