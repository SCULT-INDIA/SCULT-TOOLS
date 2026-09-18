import { describe, expect, it } from 'vitest'
import { classifyRequest, classifyRequester } from './bot-classify'

const CHROME_MAC_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

/** What a real desktop Chrome on macOS sends with a page navigation. */
function realChromeHeaders(overrides: Record<string, string> = {}): Headers {
  return new Headers({
    'user-agent': CHROME_MAC_UA,
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Chromium";v="128", "Google Chrome";v="128", "Not;A=Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'sec-fetch-site': 'none',
    ...overrides,
  })
}

describe('classifyRequester (User-Agent only)', () => {
  it('recognizes search engine crawlers', () => {
    expect(
      classifyRequester(
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      ),
    ).toBe('crawler')
    expect(
      classifyRequester(
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      ),
    ).toBe('crawler')
  })

  it("recognizes AI/LLM crawlers — the traffic this site's AI Visibility tool is built around", () => {
    expect(
      classifyRequester(
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2',
      ),
    ).toBe('crawler')
    expect(
      classifyRequester('ClaudeBot/1.0 (+https://www.anthropic.com/claudebot)'),
    ).toBe('crawler')
    expect(classifyRequester('Mozilla/5.0 (compatible; PerplexityBot/1.0)')).toBe(
      'crawler',
    )
  })

  it('recognizes social-preview unfurl bots', () => {
    expect(classifyRequester('Twitterbot/1.0')).toBe('crawler')
    expect(classifyRequester('facebookexternalhit/1.1')).toBe('crawler')
  })

  it('is a substring match, so real crawler UAs (with versions and URLs) still match', () => {
    expect(classifyRequester('SomePrefix GPTBot/1.0 SomeSuffix')).toBe('crawler')
  })

  it('blocks self-declared automation and empty UAs — no human browser ever sends these', () => {
    expect(classifyRequester('curl/8.4.0')).toBe('blocked')
    expect(classifyRequester('python-requests/2.31.0')).toBe('blocked')
    expect(classifyRequester('Go-http-client/2.0')).toBe('blocked')
    expect(
      classifyRequester(
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36',
      ),
    ).toBe('blocked')
    expect(classifyRequester('')).toBe('blocked')
    expect(classifyRequester('   ')).toBe('blocked')
  })

  it('a recognized crawler wins over an automation marker in the same UA', () => {
    expect(
      classifyRequester(
        'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots) okhttp',
      ),
    ).toBe('crawler')
  })

  it('returns default for anything else — meaning "decide from the other headers"', () => {
    expect(classifyRequester(CHROME_MAC_UA)).toBe('default')
    expect(
      classifyRequester(
        'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
      ),
    ).toBe('default')
  })
})

describe('classifyRequest (full headers)', () => {
  it('a real desktop Chrome navigation is default', () => {
    expect(classifyRequest(realChromeHeaders())).toBe('default')
  })

  it("a real Chrome client-side navigation (RSC fetch, Sec-Fetch-Mode: cors) is default — Next's own <Link> traffic must never be throttled as a bot", () => {
    expect(
      classifyRequest(
        realChromeHeaders({
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'sec-fetch-site': 'same-origin',
        }),
      ),
    ).toBe('default')
  })

  it('real Firefox (no client hints, but Accept-Language + Sec-Fetch) is default', () => {
    expect(
      classifyRequest(
        new Headers({
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
          'accept-language': 'en-GB,en;q=0.5',
          'sec-fetch-mode': 'navigate',
        }),
      ),
    ).toBe('default')
  })

  it('an older iPhone Safari (no Sec-Fetch, no client hints) is default — real visitors, deliberately lenient', () => {
    expect(
      classifyRequest(
        new Headers({
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
          'accept-language': 'hi-IN,hi;q=0.9,en;q=0.8',
        }),
      ),
    ).toBe('default')
  })

  it('Chrome on iOS (CriOS, WebKit underneath, no client hints) is default', () => {
    expect(
      classifyRequest(
        new Headers({
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.0.0 Mobile/15E148 Safari/604.1',
          'accept-language': 'en-IN,en;q=0.9',
        }),
      ),
    ).toBe('default')
  })

  it('real Android Chrome (platform hint "Android", UA contains "Linux; Android") is default', () => {
    expect(
      classifyRequest(
        realChromeHeaders({
          'user-agent':
            'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-ua-mobile': '?1',
        }),
      ),
    ).toBe('default')
  })

  it('an old Chrome (< 90) with Accept-Language but no client hints is default — hints only shipped in 89', () => {
    expect(
      classifyRequest(
        new Headers({
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9',
        }),
      ),
    ).toBe('default')
  })

  it('a Chrome UA pasted onto a bare HTTP client (no Accept-Language, no hints) is suspect — the rotating-IP scraper shape', () => {
    expect(classifyRequest(new Headers({ 'user-agent': CHROME_MAC_UA }))).toBe('suspect')
  })

  it('a Chrome UA with Accept-Language but no Sec-CH-UA client hints is suspect', () => {
    expect(
      classifyRequest(
        new Headers({ 'user-agent': CHROME_MAC_UA, 'accept-language': 'en-US,en;q=0.9' }),
      ),
    ).toBe('suspect')
  })

  it('a Chrome UA whose platform hint contradicts it (a Linux headless farm claiming to be a Mac) is suspect', () => {
    expect(classifyRequest(realChromeHeaders({ 'sec-ch-ua-platform': '"Linux"' }))).toBe(
      'suspect',
    )
  })

  it('a Chrome UA with hints but no Sec-Fetch metadata is suspect', () => {
    const h = realChromeHeaders()
    h.delete('sec-fetch-mode')
    expect(classifyRequest(h)).toBe('suspect')
  })

  it('a UA that does not claim to be a browser and is not a recognized crawler is suspect, not blocked (uptime monitors, feed readers land here at a trickle)', () => {
    expect(
      classifyRequest(
        new Headers({ 'user-agent': 'UptimeRobot/2.0', 'accept-language': 'en' }),
      ),
    ).toBe('suspect')
  })

  it("SEO-scraper bots are suspect — they add cost without serving this site's own visibility", () => {
    expect(
      classifyRequest(
        new Headers({
          'user-agent':
            'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
        }),
      ),
    ).toBe('suspect')
  })

  it('crawler and blocked verdicts come from the UA alone, before any coherence check', () => {
    expect(
      classifyRequest(
        new Headers({ 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }),
      ),
    ).toBe('crawler')
    expect(classifyRequest(new Headers({ 'user-agent': 'curl/8.4.0' }))).toBe('blocked')
    expect(classifyRequest(new Headers())).toBe('blocked')
  })
})
