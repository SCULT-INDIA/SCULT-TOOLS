/**
 * Request classification for `proxy.ts`'s page-route rate limiter.
 *
 * Four tiers, checked in this order:
 *
 *   crawler  — search engines, AI/LLM crawlers, social-preview unfurlers:
 *              the automated traffic this site actively WANTS (see the AI
 *              Visibility Checker tool, llms.txt, robots.txt). Generous but
 *              finite ceiling.
 *   blocked  — self-declared automation on a PAGE route: curl, python
 *              requests, Go/Java HTTP clients, headless-browser markers,
 *              vulnerability scanners, or no User-Agent at all. No human
 *              browser ever sends these, so a tight cap costs no visitor
 *              anything. (The API/MCP/CLI tree is not behind this file —
 *              proxy.ts's matcher skips `api/` — so tooling keeps working.)
 *   suspect  — a request that is NOT a recognized crawler and either does
 *              not claim to be a browser at all, or claims to be one
 *              incoherently: a real browser always sends `Accept-Language`;
 *              Chromium ≥ 90 always sends `Sec-CH-UA` client hints and
 *              `Sec-Fetch-*`; and its `Sec-CH-UA-Platform` hint always agrees
 *              with the OS in its own User-Agent. A script that pastes a
 *              Chrome UA string onto a bare HTTP client fails the first two;
 *              a headless Chrome on a Linux box that overrode its UA to say
 *              "Macintosh" fails the third. Real Chrome/Edge/Brave/Opera,
 *              Firefox (which sends no client hints — only Accept-Language is
 *              required of it), and Safari all pass. Tight cap, both per IP
 *              AND globally — the global one is what defeats IP rotation.
 *   default  — a coherent browser claim. Ordinary visitors.
 *
 * 2026-09-18: `blocked` and `suspect` were added after local attack
 * simulation confirmed the earlier two-tier version let a rotating-IP
 * scraper through untouched (each fake IP got its own fresh per-IP budget).
 * The header-coherence checks are what let the limiter tell that scraper
 * apart from a human WITHOUT relying on IP at all, which is the only thing
 * that works against rotation.
 *
 * Still not a security boundary: a headless browser that keeps its real
 * platform hint, sends every header a real browser sends, and rotates IPs
 * looks identical to a human at the HTTP layer. That residual is exactly
 * what Vercel's Bot Protection (Firewall → Bot Management, set to Challenge)
 * catches at the edge via TLS/HTTP fingerprinting before a request reaches
 * this code — this file raises the floor under that layer; it doesn't
 * replace it.
 */

export type RequesterTier = 'blocked' | 'crawler' | 'suspect' | 'default'

/**
 * Search engines, AI/LLM crawlers, and social-preview unfurl bots.
 * Deliberately excludes SEO-scraper bots (Ahrefs, Semrush, MJ12, …): they
 * cost the same as any other crawler but don't feed this site's own indexing
 * or AI-answer visibility, so they fall through to `suspect` like anything
 * else unrecognized. Named individually rather than via a generic
 * "contains 'bot'" pattern, so a new crawler worth trusting is an explicit,
 * reviewed addition — one line here.
 */
const CRAWLER_USER_AGENT_SUBSTRINGS = [
  // Search engines
  'Googlebot',
  'bingbot',
  'Slurp', // Yahoo
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'Sogou',
  // AI / LLM crawlers
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'Applebot',
  // Social-preview unfurl bots
  'Twitterbot',
  'facebookexternalhit',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'WhatsApp',
  'TelegramBot',
] as const

/**
 * Lower-cased substrings that only ever appear in the UA of an HTTP library,
 * a headless-browser default, or a scanner — never in a human's browser.
 */
const AUTOMATION_USER_AGENT_SUBSTRINGS = [
  // HTTP libraries / CLIs
  'python-requests',
  'python-urllib',
  'aiohttp',
  'httpx/',
  'scrapy',
  'curl/',
  'wget/',
  'libwww-perl',
  'lwp-trivial',
  'go-http-client',
  'okhttp',
  'java/',
  'apache-httpclient',
  'axios/',
  'node-fetch',
  'undici',
  'got (https://github.com/sindresorhus/got)',
  'superagent',
  // Headless / automation defaults
  'headlesschrome',
  'phantomjs',
  'selenium',
  // Scanners
  'nikto',
  'sqlmap',
  'masscan',
  'zgrab',
  'nmap',
] as const

/** UA-only classification: `blocked`, `crawler`, or `default` (meaning
 * "decide from the other headers" — see `classifyRequest`). */
export function classifyRequester(userAgent: string): 'blocked' | 'crawler' | 'default' {
  const ua = userAgent.trim()
  if (ua === '') return 'blocked'
  if (CRAWLER_USER_AGENT_SUBSTRINGS.some((needle) => ua.includes(needle)))
    return 'crawler'
  const lower = ua.toLowerCase()
  if (AUTOMATION_USER_AGENT_SUBSTRINGS.some((needle) => lower.includes(needle)))
    return 'blocked'
  return 'default'
}

/** The OS a User-Agent string claims, as the set of `Sec-CH-UA-Platform`
 * values a real Chromium would send alongside it; null when unknown. Order
 * matters: Android UAs also contain "Linux", ChromeOS UAs contain "X11". */
function platformsClaimedByUserAgent(ua: string): readonly string[] | null {
  if (/Android/.test(ua)) return ['Android']
  if (/CrOS/.test(ua)) return ['Chrome OS', 'ChromeOS']
  if (/Windows/.test(ua)) return ['Windows']
  if (/Macintosh|Mac OS X/.test(ua)) return ['macOS']
  if (/Linux|X11/.test(ua)) return ['Linux']
  return null
}

/**
 * True when the request claims to be a browser but doesn't send what that
 * browser always sends. Only ever consulted for requests that are neither a
 * recognized crawler nor self-declared automation.
 */
function isIncoherentBrowserClaim(headers: Headers): boolean {
  const ua = headers.get('user-agent') ?? ''
  // Every real browser UA has started with this for two decades.
  if (!/^Mozilla\/5\.0/.test(ua)) return true
  // Every real browser sends Accept-Language on a navigation or fetch.
  if (!headers.get('accept-language')) return true

  // Chromium-family desktop/Android claims (Chrome, Edge, Brave, Opera,
  // Samsung Internet all carry a `Chrome/<major>` token). Chrome on iOS
  // (CriOS) is WebKit underneath and sends no client hints, so it's exempt.
  const chromium = /Chrome\/(\d+)/.exec(ua)
  if (chromium && !/CriOS|iPhone|iPad/.test(ua) && Number(chromium[1]) >= 90) {
    // Client hints have shipped in every Chromium since 89.
    if (!headers.get('sec-ch-ua')) return true
    // The platform hint is set by the browser itself, not from the UA
    // string — a UA overridden to say "Macintosh" on a Linux server still
    // reports "Linux" here unless the operator went out of their way.
    const platform = headers.get('sec-ch-ua-platform')?.replace(/"/g, '').trim()
    if (platform) {
      const expected = platformsClaimedByUserAgent(ua)
      if (expected && !expected.includes(platform)) return true
    }
    // Fetch metadata has shipped in every Chromium since 76.
    if (!headers.get('sec-fetch-mode')) return true
    return false
  }

  // Firefox has sent fetch metadata since 90; it sends no client hints.
  const firefox = /Firefox\/(\d+)/.exec(ua)
  if (firefox && Number(firefox[1]) >= 90 && !headers.get('sec-fetch-mode')) return true

  // Safari (and anything else): Accept-Language is the only thing required.
  // Safari only added Sec-Fetch-* in 16.4, and older iPhones are real
  // visitors, so it is deliberately NOT required here.
  return false
}

/** Full classification from the request's headers — what `proxy.ts` uses. */
export function classifyRequest(headers: Headers): RequesterTier {
  const byUserAgent = classifyRequester(headers.get('user-agent') ?? '')
  if (byUserAgent !== 'default') return byUserAgent
  return isIncoherentBrowserClaim(headers) ? 'suspect' : 'default'
}
