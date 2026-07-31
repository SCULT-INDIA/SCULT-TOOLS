import { describe, expect, it } from 'vitest'
import {
  AI_BOTS,
  analyzeBasics,
  bandFor,
  buildReport,
  computeScore,
  detectNoaiSignals,
  evaluateBot,
  extractJsonLd,
  formatReportText,
  isPrivateAddress,
  parseRobots,
  validateTargetUrl,
} from './logic'

describe('parseRobots', () => {
  it('groups consecutive user-agent lines and lowercases tokens', () => {
    const parsed = parseRobots(
      'User-agent: GPTBot\nUser-agent: ClaudeBot\nDisallow: /private\n\nUser-agent: *\nDisallow:',
    )
    expect(parsed.groups).toHaveLength(2)
    expect(parsed.groups[0]?.userAgents).toEqual(['gptbot', 'claudebot'])
    expect(parsed.groups[0]?.rules).toEqual([{ type: 'disallow', path: '/private' }])
    expect(parsed.groups[1]?.userAgents).toEqual(['*'])
  })

  it('strips comments and collects Sitemap directives', () => {
    const parsed = parseRobots(
      '# top comment\nUser-agent: * # inline\nDisallow: / # blocked\nSitemap: https://example.com/sitemap.xml',
    )
    expect(parsed.sitemaps).toEqual(['https://example.com/sitemap.xml'])
    expect(parsed.groups[0]?.rules).toEqual([{ type: 'disallow', path: '/' }])
  })
})

describe('evaluateBot', () => {
  it('missing robots.txt (empty text) allows everything by default', () => {
    const verdict = evaluateBot(parseRobots(''), 'GPTBot', '/')
    expect(verdict.allowed).toBe(true)
    expect(verdict.source).toBe('default')
  })

  it('Disallow: / under * blocks a bot with no specific group', () => {
    const robots = parseRobots('User-agent: *\nDisallow: /')
    const verdict = evaluateBot(robots, 'PerplexityBot', '/')
    expect(verdict.allowed).toBe(false)
    expect(verdict.source).toBe('wildcard')
  })

  it('an empty Disallow: line allows everything', () => {
    const robots = parseRobots('User-agent: *\nDisallow:')
    expect(evaluateBot(robots, 'GPTBot', '/').allowed).toBe(true)
  })

  it('a specific user-agent group overrides the * group entirely', () => {
    const robots = parseRobots(
      'User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nDisallow:',
    )
    const gpt = evaluateBot(robots, 'GPTBot', '/')
    expect(gpt.allowed).toBe(true)
    expect(gpt.source).toBe('specific')
    // ...and a bot without its own group still falls under *
    expect(evaluateBot(robots, 'ClaudeBot', '/').allowed).toBe(false)
  })

  it('matches user-agent tokens case-insensitively', () => {
    const robots = parseRobots('User-agent: gptbot\nDisallow: /')
    expect(evaluateBot(robots, 'GPTBot', '/').allowed).toBe(false)
  })

  it('longest matching path wins between Allow and Disallow', () => {
    const robots = parseRobots('User-agent: *\nDisallow: /\nAllow: /public')
    expect(evaluateBot(robots, 'GPTBot', '/public/page').allowed).toBe(true)
    expect(evaluateBot(robots, 'GPTBot', '/secret').allowed).toBe(false)
  })

  it('on an exact-length tie, Allow wins', () => {
    const robots = parseRobots('User-agent: *\nDisallow: /\nAllow: /')
    expect(evaluateBot(robots, 'GPTBot', '/').allowed).toBe(true)
  })

  it('supports * wildcards and $ anchors in paths', () => {
    const robots = parseRobots('User-agent: *\nDisallow: /*.pdf$')
    expect(evaluateBot(robots, 'GPTBot', '/docs/file.pdf').allowed).toBe(false)
    expect(evaluateBot(robots, 'GPTBot', '/docs/file.pdf.html').allowed).toBe(true)
  })

  it('a robots token acts as a prefix: "chatgpt" governs ChatGPT-User', () => {
    const robots = parseRobots('User-agent: ChatGPT\nDisallow: /')
    expect(evaluateBot(robots, 'ChatGPT-User', '/').allowed).toBe(false)
    expect(evaluateBot(robots, 'GPTBot', '/').allowed).toBe(true)
  })
})

describe('extractJsonLd', () => {
  it('extracts @type from a single JSON-LD object', () => {
    const html =
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization"}</script>'
    const result = extractJsonLd(html)
    expect(result.types).toEqual(['Organization'])
    expect(result.blockCount).toBe(1)
    expect(result.parsedCount).toBe(1)
  })

  it('handles a top-level array of entities', () => {
    const html =
      '<script type="application/ld+json">[{"@type":"WebSite"},{"@type":"Organization"}]</script>'
    expect(extractJsonLd(html).types).toEqual(['WebSite', 'Organization'])
  })

  it('walks into @graph containers', () => {
    const html =
      '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage"},{"@type":["FAQPage","CollectionPage"]}]}</script>'
    expect(extractJsonLd(html).types).toEqual(['WebPage', 'FAQPage', 'CollectionPage'])
  })

  it('skips a malformed block without losing the valid ones', () => {
    const html = [
      '<script type="application/ld+json">{not json at all</script>',
      '<script type="application/ld+json">{"@type":"Article"}</script>',
    ].join('\n')
    const result = extractJsonLd(html)
    expect(result.blockCount).toBe(2)
    expect(result.parsedCount).toBe(1)
    expect(result.types).toEqual(['Article'])
  })

  it('returns empty results for HTML with no JSON-LD', () => {
    const result = extractJsonLd('<html><body><p>hello</p></body></html>')
    expect(result.blockCount).toBe(0)
    expect(result.types).toEqual([])
  })
})

describe('analyzeBasics', () => {
  const fullHtml = `<!doctype html><html lang="en"><head>
    <title> Acme Widgets — Home </title>
    <meta content="We make widgets." name="description">
    </head><body><h1>Acme</h1><h2>Products</h2><h2>Pricing</h2></body></html>`

  it('extracts title, description, headings and lang', () => {
    const basics = analyzeBasics(fullHtml)
    expect(basics.title).toBe('Acme Widgets — Home')
    expect(basics.description).toBe('We make widgets.')
    expect(basics.h1Count).toBe(1)
    expect(basics.h2Count).toBe(2)
    expect(basics.lang).toBe('en')
    expect(basics.presentCount).toBe(5)
  })

  it('reports missing signals without throwing on sparse HTML', () => {
    const basics = analyzeBasics('<html><body>hi</body></html>')
    expect(basics.title).toBeUndefined()
    expect(basics.description).toBeUndefined()
    expect(basics.h1Count).toBe(0)
    expect(basics.lang).toBeUndefined()
    expect(basics.presentCount).toBe(0)
  })
})

describe('detectNoaiSignals', () => {
  it('finds noai in the meta robots tag and noimageai in X-Robots-Tag', () => {
    const html = '<meta name="robots" content="index, noai">'
    expect(detectNoaiSignals(html)).toEqual(['noai in meta robots tag'])
    expect(detectNoaiSignals('', 'noimageai')).toEqual([
      'noimageai in X-Robots-Tag header',
    ])
  })

  it('does not false-positive on plain index,follow', () => {
    expect(detectNoaiSignals('<meta name="robots" content="index, follow">')).toEqual([])
  })
})

describe('isPrivateAddress', () => {
  it('flags private and loopback IPv4 ranges', () => {
    expect(isPrivateAddress('127.0.0.1')).toBe(true)
    expect(isPrivateAddress('10.0.0.1')).toBe(true)
    expect(isPrivateAddress('172.16.0.1')).toBe(true)
    expect(isPrivateAddress('172.31.255.255')).toBe(true)
    expect(isPrivateAddress('192.168.1.1')).toBe(true)
    expect(isPrivateAddress('169.254.1.1')).toBe(true)
  })

  it('passes public IPv4 addresses, including 172.32.x just past the /12', () => {
    expect(isPrivateAddress('172.32.0.1')).toBe(false)
    expect(isPrivateAddress('8.8.8.8')).toBe(false)
  })

  it('flags IPv6 loopback, unique-local, link-local and mapped-private', () => {
    expect(isPrivateAddress('::1')).toBe(true)
    expect(isPrivateAddress('fc00::')).toBe(true)
    expect(isPrivateAddress('fe80::')).toBe(true)
    expect(isPrivateAddress('::ffff:10.0.0.1')).toBe(true)
  })

  it('passes a public IPv6 address and fails closed on garbage', () => {
    expect(isPrivateAddress('2606:4700:4700::1111')).toBe(false)
    expect(isPrivateAddress('not-an-ip')).toBe(true)
  })
})

describe('validateTargetUrl', () => {
  it('accepts a normal https URL and a bare domain (https assumed)', () => {
    expect(validateTargetUrl('https://example.com/page').url).toBe(
      'https://example.com/page',
    )
    const bare = validateTargetUrl('example.com')
    expect(bare.url).toBe('https://example.com/')
    expect(bare.hostname).toBe('example.com')
  })

  it('rejects non-http schemes, credentials, local hostnames and private IPs', () => {
    expect(validateTargetUrl('ftp://example.com').error).toBeDefined()
    expect(validateTargetUrl('https://user:pass@example.com').error).toBeDefined()
    expect(validateTargetUrl('http://localhost:3000').error).toBeDefined()
    expect(validateTargetUrl('https://nas.local').error).toBeDefined()
    expect(validateTargetUrl('https://db.internal').error).toBeDefined()
    expect(validateTargetUrl('http://192.168.1.1').error).toBeDefined()
    expect(validateTargetUrl('http://[::1]/').error).toBeDefined()
  })
})

describe('computeScore', () => {
  it('applies the 40/20/20/10/10 weighting', () => {
    expect(
      computeScore({
        crawlerFraction: 1,
        structuredData: 'pass',
        basicsFraction: 1,
        llmsTxt: 'pass',
        sitemap: 'pass',
      }).score,
    ).toBe(100)
    expect(
      computeScore({
        crawlerFraction: 0,
        structuredData: 'pass',
        basicsFraction: 1,
        llmsTxt: 'pass',
        sitemap: 'pass',
      }).score,
    ).toBe(60)
    expect(
      computeScore({
        crawlerFraction: 0.5,
        structuredData: 'fail',
        basicsFraction: 0.8, // 4 of 5 basics
        llmsTxt: 'warn',
        sitemap: 'fail',
      }).score,
    ).toBe(41) // 20 + 0 + 16 + 5 + 0
  })

  it('clamps out-of-range fractions instead of overflowing', () => {
    const { score } = computeScore({
      crawlerFraction: 5,
      structuredData: 'pass',
      basicsFraction: -2,
      llmsTxt: 'pass',
      sitemap: 'pass',
    })
    expect(score).toBe(80)
  })

  it('assigns bands at the documented boundaries', () => {
    expect(bandFor(80)).toBe('AI-visible')
    expect(bandFor(79)).toBe('Partially visible')
    expect(bandFor(50)).toBe('Partially visible')
    expect(bandFor(49)).toBe('Mostly invisible to AI')
  })
})

describe('buildReport', () => {
  const goodHtml = `<!doctype html><html lang="en"><head><title>Acme</title>
    <meta name="description" content="Widgets for everyone.">
    <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body><h1>Acme</h1><h2>A</h2><h2>B</h2></body></html>`

  it('missing robots.txt means every bot is allowed and the check says so', () => {
    const report = buildReport({ url: 'https://example.com/', html: goodHtml })
    expect(report.allowedBotCount).toBe(AI_BOTS.length)
    expect(report.bots.every((b) => b.source === 'default')).toBe(true)
    const crawlers = report.checks.find((c) => c.id === 'crawlers')
    expect(crawlers?.status).toBe('pass')
    expect(crawlers?.finding).toContain('No robots.txt')
  })

  it('a fully healthy site with llms.txt and sitemap scores 100', () => {
    const report = buildReport({
      url: 'https://example.com/',
      robotsText: 'User-agent: *\nDisallow:\nSitemap: https://example.com/sitemap.xml',
      llms: { status: 200, bytes: 2048 },
      html: goodHtml,
    })
    expect(report.score).toBe(100)
    expect(report.band).toBe('AI-visible')
    expect(report.jsonLdTypes).toEqual(['Organization'])
  })

  it('blocking some AI bots lowers the crawler fraction proportionally', () => {
    const report = buildReport({
      url: 'https://example.com/',
      robotsText:
        'User-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: *\nDisallow:\nSitemap: https://example.com/s.xml',
      llms: { status: 200, bytes: 100 },
      html: goodHtml,
    })
    expect(report.allowedBotCount).toBe(AI_BOTS.length - 2)
    const crawlers = report.checks.find((c) => c.id === 'crawlers')
    expect(crawlers?.status).toBe('warn')
    expect(crawlers?.finding).toContain('GPTBot')
    // 40 * 8/10 = 32, everything else full: 32 + 60 = 92
    expect(report.score).toBe(92)
  })

  it('an empty site with everything blocked lands in the bottom band', () => {
    const report = buildReport({
      url: 'https://example.com/',
      robotsText: 'User-agent: *\nDisallow: /',
      html: '<html><body></body></html>',
    })
    // crawler 0 + structured 0 + basics 0 + llms warn 5 + sitemap 0
    expect(report.score).toBe(5)
    expect(report.band).toBe('Mostly invisible to AI')
  })

  it('noai signals are reported but never change the score', () => {
    const base = buildReport({
      url: 'https://example.com/',
      robotsText: 'User-agent: *\nDisallow:\nSitemap: https://example.com/s.xml',
      llms: { status: 200, bytes: 10 },
      html: goodHtml,
    })
    const withNoai = buildReport({
      url: 'https://example.com/',
      robotsText: 'User-agent: *\nDisallow:\nSitemap: https://example.com/s.xml',
      llms: { status: 200, bytes: 10 },
      html: goodHtml.replace(
        '</head>',
        '<meta name="robots" content="noai, noimageai"></head>',
      ),
    })
    expect(withNoai.score).toBe(base.score)
    const noai = withNoai.checks.find((c) => c.id === 'noai')
    expect(noai?.status).toBe('warn')
    expect(noai?.scored).toBe(false)
    expect(noai?.finding).toContain('legitimate')
  })

  it('sitemap passes via probe when robots.txt declares none', () => {
    const report = buildReport({
      url: 'https://example.com/',
      robotsText: 'User-agent: *\nDisallow:',
      html: goodHtml,
      sitemapProbeStatus: 200,
    })
    const sitemap = report.checks.find((c) => c.id === 'sitemap')
    expect(sitemap?.status).toBe('pass')
    expect(sitemap?.finding).toContain('robots.txt does not declare it')
  })
})

describe('formatReportText', () => {
  const html = `<!doctype html><html lang="en"><head><title>Acme</title>
    <meta name="description" content="Widgets.">
    <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body><h1>Acme</h1><h2>A</h2><h2>B</h2></body></html>`

  it('leads with the URL, the score and the band', () => {
    const text = formatReportText(buildReport({ url: 'https://example.com/', html }))
    const lines = text.split('\n')
    expect(lines[0]).toBe('AI visibility report — https://example.com/')
    expect(lines[1]).toContain('/100 —')
    expect(lines[2]).toBe(`AI crawlers allowed: ${AI_BOTS.length} of ${AI_BOTS.length}`)
  })

  it('quotes the deciding rule verbatim and names the group that produced it', () => {
    const text = formatReportText(
      buildReport({
        url: 'https://example.com/',
        robotsText:
          'User-agent: GPTBot\nDisallow: /no-ai\nDisallow: /\n\nUser-agent: *\nDisallow:',
        html,
      }),
    )
    expect(text).toContain(
      '- GPTBot (OpenAI): BLOCKED — Disallow: / — from a group naming this bot',
    )
    // A bot with no group of its own falls to the wildcard group's rules.
    expect(text).toContain('- CCBot (Common Crawl): ALLOWED')
  })

  it('explains a default allow rather than leaving the rule column empty', () => {
    const text = formatReportText(buildReport({ url: 'https://example.com/', html }))
    expect(text).toContain(
      'robots.txt names no group for it, so it is allowed by default',
    )
    expect(text).not.toContain('undefined')
  })

  it('carries every check with its status, finding and fix', () => {
    const report = buildReport({ url: 'https://example.com/', html })
    const text = formatReportText(report)
    for (const check of report.checks) {
      expect(text).toContain(check.label)
      expect(text).toContain(`  Fix: ${check.fix}`)
    }
    expect(text).toContain('[PASS]')
  })

  it('marks the unscored check as informational', () => {
    const text = formatReportText(buildReport({ url: 'https://example.com/', html }))
    expect(text).toContain('noai signals (informational, not scored)')
  })

  it('reproduces a wildcard rule verbatim and credits the * group', () => {
    const text = formatReportText(
      buildReport({
        url: 'https://example.com/',
        robotsText: 'User-agent: *\nDisallow: /*',
        html,
      }),
    )
    expect(text).toContain('Disallow: /* — from the User-agent: * group')
    expect(text).toContain('- GPTBot (OpenAI): BLOCKED')
  })

  it('carries a pathologically long matching rule without truncating it', () => {
    // Only a prefix of "/" can win for path "/", so the longest hostile rule a
    // third-party robots.txt can actually put in this column is a run of
    // wildcards. The clipboard copy keeps it whole; the table clamps for display.
    const longPath = `/${'*'.repeat(300)}`
    const text = formatReportText(
      buildReport({
        url: 'https://example.com/',
        robotsText: `User-agent: *\nDisallow: ${longPath}`,
        html,
      }),
    )
    expect(text).toContain(`Disallow: ${longPath}`)
  })
})
