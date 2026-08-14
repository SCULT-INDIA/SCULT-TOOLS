import { describe, expect, it } from 'vitest'
import {
  AI_BOTS,
  analyzeAltText,
  analyzeBasics,
  analyzeSocialMeta,
  bandFor,
  buildReport,
  computeScore,
  countVisibleWords,
  detectNoaiSignals,
  detectNoindexSignals,
  evaluateBot,
  extractJsonLd,
  formatReportMarkdown,
  formatReportText,
  hasCanonicalLink,
  hasIdentitySchema,
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
    // 5 of the original signals present, plus alt-text coverage counted as
    // healthy vacuously (no <img> tags at all) — 6 of 9 overall. No Open
    // Graph, no canonical link, and its ~10 words of body text are nowhere
    // near the thin-content threshold.
    expect(basics.presentCount).toBe(6)
    expect(basics.social.ogTitle).toBe(false)
    expect(basics.hasCanonical).toBe(false)
    expect(basics.altText).toEqual({ imgCount: 0, withAlt: 0, coverage: 1 })
    expect(basics.wordCount).toBeLessThan(150)
  })

  it('reports missing signals without throwing on sparse HTML', () => {
    const basics = analyzeBasics('<html><body>hi</body></html>')
    expect(basics.title).toBeUndefined()
    expect(basics.description).toBeUndefined()
    expect(basics.h1Count).toBe(0)
    expect(basics.lang).toBeUndefined()
    // Only the vacuous alt-text pass (zero <img> tags) survives.
    expect(basics.presentCount).toBe(1)
  })

  it('gives full credit for a page with every basics signal covered', () => {
    const html = `<!doctype html><html lang="en"><head><title>Acme</title>
      <meta name="description" content="Widgets for everyone.">
      <link rel="canonical" href="https://example.com/">
      <meta property="og:title" content="Acme">
      <meta property="og:description" content="Widgets for everyone.">
      <meta property="og:image" content="https://example.com/og.png">
      </head><body><h1>Acme</h1><h2>A</h2><h2>B</h2>
      <img src="/logo.png" alt="Acme logo">
      <p>${'widget '.repeat(160)}</p>
      </body></html>`
    const basics = analyzeBasics(html)
    expect(basics.presentCount).toBe(9)
    expect(basics.social).toEqual({
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      twitterCard: false,
    })
    expect(basics.hasCanonical).toBe(true)
    expect(basics.altText).toEqual({ imgCount: 1, withAlt: 1, coverage: 1 })
    expect(basics.wordCount).toBeGreaterThanOrEqual(150)
  })
})

describe('analyzeSocialMeta', () => {
  it('finds Open Graph tags declared with property= and Twitter Card with name=', () => {
    const html =
      '<meta property="og:title" content="Acme"><meta property="og:description" content="Widgets"><meta property="og:image" content="/a.png"><meta name="twitter:card" content="summary">'
    expect(analyzeSocialMeta(html)).toEqual({
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      twitterCard: true,
    })
  })

  it('reports every field false when none are present', () => {
    expect(analyzeSocialMeta('<html><head></head></html>')).toEqual({
      ogTitle: false,
      ogDescription: false,
      ogImage: false,
      twitterCard: false,
    })
  })

  it('treats an empty content attribute as absent', () => {
    expect(analyzeSocialMeta('<meta property="og:title" content="">').ogTitle).toBe(false)
  })
})

describe('hasCanonicalLink', () => {
  it('finds a canonical link with a non-empty href, attribute order-independent', () => {
    expect(hasCanonicalLink('<link href="https://example.com/" rel="canonical">')).toBe(
      true,
    )
    expect(hasCanonicalLink('<link rel="canonical" href="https://example.com/">')).toBe(
      true,
    )
  })

  it('rejects a canonical link with an empty href and pages with no canonical at all', () => {
    expect(hasCanonicalLink('<link rel="canonical" href="">')).toBe(false)
    expect(hasCanonicalLink('<link rel="stylesheet" href="/a.css">')).toBe(false)
    expect(hasCanonicalLink('<html></html>')).toBe(false)
  })
})

describe('analyzeAltText', () => {
  it('gives full vacuous coverage when there are no images at all', () => {
    expect(analyzeAltText('<p>no images here</p>')).toEqual({
      imgCount: 0,
      withAlt: 0,
      coverage: 1,
    })
  })

  it('computes the fraction of images with a non-empty alt attribute', () => {
    const html = '<img src="a.png" alt="A"><img src="b.png" alt=""><img src="c.png">'
    expect(analyzeAltText(html)).toEqual({ imgCount: 3, withAlt: 1, coverage: 1 / 3 })
  })

  it('treats every image as covered when all have non-empty alt text', () => {
    const html = '<img src="a.png" alt="A"><img src="b.png" alt="B">'
    expect(analyzeAltText(html)).toEqual({ imgCount: 2, withAlt: 2, coverage: 1 })
  })

  it('treats an empty alt as covered when the image itself is aria-hidden', () => {
    const html = '<img src="a.png" alt="" aria-hidden="true">'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 1, coverage: 1 })
  })

  it('treats an empty alt inside an aria-hidden region as covered', () => {
    const html = '<div aria-hidden="true"><img src="a.png" alt=""></div>'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 1, coverage: 1 })
  })

  it('treats an empty alt inside a labelled link as covered', () => {
    const html = '<a href="/" aria-label="Go home"><img src="a.png" alt=""></a>'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 1, coverage: 1 })
  })

  it('treats an empty alt inside a labelled button the same way', () => {
    const html = '<button aria-label="Close"><img src="x.png" alt=""></button>'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 1, coverage: 1 })
  })

  it('does not credit an empty alt inside an unlabelled link', () => {
    const html = '<a href="/about"><img src="a.png" alt=""> Team</a>'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 0, coverage: 0 })
  })

  it('does not credit an empty alt with no aria-hidden/aria-label ancestor at all', () => {
    const html = '<div class="card"><img src="a.png" alt=""></div>'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 0, coverage: 0 })
  })

  it('only exempts images actually inside the aria-hidden region, not siblings after it closes', () => {
    const html =
      '<div aria-hidden="true"><img src="a.png" alt=""></div><img src="b.png" alt="">'
    expect(analyzeAltText(html)).toEqual({ imgCount: 2, withAlt: 1, coverage: 0.5 })
  })

  it('finds the nearest labelled ancestor, not a stale outer one', () => {
    // The inner button has no aria-label of its own, so the image inside it
    // should NOT inherit the outer link's label — the nearest interactive
    // ancestor is what matters, not any ancestor anywhere up the tree.
    const html =
      '<a href="/" aria-label="Outer"><button><img src="a.png" alt=""></button></a>'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 0, coverage: 0 })
  })

  it('is tolerant of an unmatched closing tag (a no-op, not a crash or a miscount)', () => {
    const html = '</section><img src="a.png" alt="">'
    expect(analyzeAltText(html)).toEqual({ imgCount: 1, withAlt: 0, coverage: 0 })
  })
})

describe('countVisibleWords', () => {
  it('strips tags, scripts and styles before counting words', () => {
    const html =
      '<html><head><style>.a{color:red}</style><script>var x=1;</script></head>' +
      '<body><h1>Hello world</h1><p>This is visible text.</p></body></html>'
    // "Hello world This is visible text." = 6 words.
    expect(countVisibleWords(html)).toBe(6)
  })

  it('returns 0 for HTML with no visible text', () => {
    expect(
      countVisibleWords('<html><head><title>Empty</title></head><body></body></html>'),
    )
      // "Empty" (the <title> text) is visible text a browser tab shows, and
      // this function has no notion of "not rendered in the body" — it is a
      // rough tripwire, not a layout engine.
      .toBe(1)
    expect(countVisibleWords('<html><body></body></html>')).toBe(0)
  })
})

describe('hasIdentitySchema', () => {
  it('recognizes the identity types case-insensitively', () => {
    expect(hasIdentitySchema(['Organization'])).toBe(true)
    expect(hasIdentitySchema(['website'])).toBe(true)
    expect(hasIdentitySchema(['LocalBusiness'])).toBe(true)
    expect(hasIdentitySchema(['Person'])).toBe(true)
  })

  it('returns false when only non-identity types are declared', () => {
    expect(hasIdentitySchema(['FAQPage', 'Article'])).toBe(false)
    expect(hasIdentitySchema([])).toBe(false)
  })
})

describe('detectNoindexSignals', () => {
  it('finds noindex in the meta robots tag and nofollow in X-Robots-Tag', () => {
    const html = '<meta name="robots" content="noindex, follow">'
    expect(detectNoindexSignals(html)).toEqual(['noindex in meta robots tag'])
    expect(detectNoindexSignals('', 'nofollow')).toEqual([
      'nofollow in X-Robots-Tag header',
    ])
  })

  it('does not false-positive on plain index,follow', () => {
    expect(detectNoindexSignals('<meta name="robots" content="index, follow">')).toEqual(
      [],
    )
  })

  it('is independent of noai — a page can carry one, both, or neither', () => {
    const html = '<meta name="robots" content="noindex, noai">'
    expect(detectNoindexSignals(html)).toEqual(['noindex in meta robots tag'])
    expect(detectNoaiSignals(html)).toEqual(['noai in meta robots tag'])
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
  // Covers all nine on-page basics signals (title, description, headings,
  // lang, a complete Open Graph trio, a canonical link, no images to flag
  // for alt-text, and 160 words of body text clearing the thin-content
  // threshold) plus an Organization type, so the "fully healthy site scores
  // 100" test below stays meaningful after the basics bucket grew from five
  // signals to nine.
  const goodHtml = `<!doctype html><html lang="en"><head><title>Acme</title>
    <meta name="description" content="Widgets for everyone.">
    <link rel="canonical" href="https://example.com/">
    <meta property="og:title" content="Acme">
    <meta property="og:description" content="Widgets for everyone.">
    <meta property="og:image" content="https://example.com/og.png">
    <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body><h1>Acme</h1><h2>A</h2><h2>B</h2><p>${'widget '.repeat(160)}</p></body></html>`

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
    // crawler 0 + structured 0 + basics 20*(1/9) [only the vacuous
    // no-images alt-text pass survives] ≈ 2.22 + llms warn 5 + sitemap 0
    // = 7.22, rounded to 7.
    expect(report.score).toBe(7)
    expect(report.band).toBe('Mostly invisible to AI')
  })

  it('flags a noindexed homepage as its own severe, unscored check', () => {
    const withNoindex = buildReport({
      url: 'https://example.com/',
      html: goodHtml.replace('</head>', '<meta name="robots" content="noindex"></head>'),
    })
    const withoutNoindex = buildReport({ url: 'https://example.com/', html: goodHtml })
    const noindexCheck = withNoindex.checks.find((c) => c.id === 'noindex')
    expect(noindexCheck?.status).toBe('fail')
    expect(noindexCheck?.scored).toBe(false)
    expect(noindexCheck?.finding).toContain('noindex in meta robots tag')
    // Score is untouched — noindex is reported, never scored.
    expect(withNoindex.score).toBe(withoutNoindex.score)
    expect(withoutNoindex.checks.find((c) => c.id === 'noindex')?.status).toBe('pass')
  })

  it('flags nofollow (without noindex) as a warning on the same check', () => {
    const report = buildReport({
      url: 'https://example.com/',
      html: goodHtml.replace('</head>', '<meta name="robots" content="nofollow"></head>'),
    })
    const noindexCheck = report.checks.find((c) => c.id === 'noindex')
    expect(noindexCheck?.status).toBe('warn')
    expect(noindexCheck?.finding).toContain('nofollow in meta robots tag')
  })

  it('reads noindex from the X-Robots-Tag header too', () => {
    const report = buildReport({
      url: 'https://example.com/',
      html: goodHtml,
      xRobotsTag: 'noindex',
    })
    expect(report.checks.find((c) => c.id === 'noindex')?.status).toBe('fail')
  })

  it('downgrades structured data to a warning when no schema names what the site is', () => {
    const html = goodHtml.replace('{"@type":"Organization"}', '{"@type":"FAQPage"}')
    const report = buildReport({ url: 'https://example.com/', html })
    const structured = report.checks.find((c) => c.id === 'structured-data')
    expect(structured?.status).toBe('warn')
    expect(structured?.finding).toContain('none of them identifies what the site even is')
    // The raw @type list is untouched — the identity check is a refinement, not a replacement.
    expect(report.jsonLdTypes).toEqual(['FAQPage'])
    // No robots.txt/llms.txt given, so crawlers (40) and basics (20) are
    // full and llms.txt is the standard unscored-absence warn (5); only
    // structured data drops from full (20) to half (10) for the missing
    // identity type: 40 + 10 + 20 + 5 + 0 (no sitemap) = 75.
    expect(report.score).toBe(75)
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

describe('formatReportMarkdown', () => {
  const html = `<!doctype html><html lang="en"><head><title>Acme</title>
    <meta name="description" content="Widgets.">
    <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body><h1>Acme</h1><h2>A</h2><h2>B</h2></body></html>`

  it('leads with an H1 naming the URL, then the score and band', () => {
    const md = formatReportMarkdown(
      buildReport({ url: 'https://example.com/', html }),
      'Aug 8, 2026, 3:00 PM',
    )
    const lines = md.split('\n')
    expect(lines[0]).toBe('# AI Visibility Report — https://example.com/')
    expect(md).toContain('**Score:**')
    expect(md).toContain(' — **')
    expect(md).toContain(
      `**AI crawlers allowed:** ${AI_BOTS.length} of ${AI_BOTS.length}`,
    )
  })

  it('renders a real Markdown table for the per-bot crawler access, not paragraphs', () => {
    const md = formatReportMarkdown(
      buildReport({
        url: 'https://example.com/',
        robotsText:
          'User-agent: GPTBot\nDisallow: /no-ai\nDisallow: /\n\nUser-agent: *\nDisallow:',
        html,
      }),
      '2026-08-08',
    )
    expect(md).toContain('| Crawler | Company | Verdict | Rule that decided |')
    expect(md).toContain('| --- | --- | --- | --- |')
    expect(md).toContain(
      '| GPTBot | OpenAI | Blocked | Disallow: / — from a group naming this bot |',
    )
    // A bot with no group of its own falls to the wildcard group's rules.
    expect(md).toContain('| CCBot | Common Crawl | Allowed |')
  })

  it('escapes a literal pipe inside an untrusted JSON-LD @type so it cannot fuse two table columns', () => {
    // @type is the target's own homepage content — untrusted — and this is
    // the one place in the report a raw `|` can actually appear (a matched
    // robots rule can't: it is only ever evaluated against the path "/",
    // which is too short to contain any literal character besides "/").
    const withPipeType = html.replace('{"@type":"Organization"}', '{"@type":"Foo|Bar"}')
    const md = formatReportMarkdown(
      buildReport({ url: 'https://example.com/', html: withPipeType }),
      '2026-08-08',
    )
    expect(md).toContain('- Foo\\|Bar')
  })

  it('collapses a literal newline inside an untrusted JSON-LD @type into a space', () => {
    // A JSON string value can carry an escaped "\n", which JSON.parse turns
    // into a real newline character — untrusted content the target's own
    // homepage controls. Left alone it would start a new, broken bullet line.
    const withNewlineType = html.replace(
      '{"@type":"Organization"}',
      '{"@type":"Foo\\nBar"}',
    )
    const md = formatReportMarkdown(
      buildReport({ url: 'https://example.com/', html: withNewlineType }),
      '2026-08-08',
    )
    expect(md).toContain('- Foo Bar')
    expect(md).not.toContain('Foo\nBar')
  })

  it('lists JSON-LD @type values as a bullet list when present', () => {
    const md = formatReportMarkdown(
      buildReport({ url: 'https://example.com/', html }),
      '2026-08-08',
    )
    expect(md).toContain('## Structured data (JSON-LD types found)')
    expect(md).toContain('- Organization')
  })

  it('states the absence of JSON-LD plainly instead of an empty section', () => {
    const md = formatReportMarkdown(
      buildReport({ url: 'https://example.com/', html: '<html><body>hi</body></html>' }),
      '2026-08-08',
    )
    expect(md).toContain('_No JSON-LD structured data found on the homepage._')
  })

  it('renders a real Markdown table for every check, scored and informational alike', () => {
    const report = buildReport({ url: 'https://example.com/', html })
    const md = formatReportMarkdown(report, '2026-08-08')
    expect(md).toContain('| Check | Status | Scored | Finding | Fix |')
    for (const check of report.checks) {
      const scoredCell = check.scored ? 'Yes' : 'No (informational)'
      expect(md).toContain(
        `| ${check.label} | ${check.status.toUpperCase()} | ${scoredCell} | ${check.finding} | ${check.fix} |`,
      )
    }
  })

  it('carries the caller-supplied timestamp and the tool link in the footer, calling no Date itself', () => {
    const md = formatReportMarkdown(
      buildReport({ url: 'https://example.com/', html }),
      'Aug 8, 2026, 3:00 PM',
    )
    expect(md).toContain('Generated Aug 8, 2026, 3:00 PM')
    expect(md).toContain('(https://tools.scult.in/geo/ai-visibility-checker)')
  })

  it('carries a pathologically long matching rule without truncating it', () => {
    const longPath = `/${'*'.repeat(300)}`
    const md = formatReportMarkdown(
      buildReport({
        url: 'https://example.com/',
        robotsText: `User-agent: *\nDisallow: ${longPath}`,
        html,
      }),
      '2026-08-08',
    )
    expect(md).toContain(`Disallow: ${longPath}`)
  })
})
