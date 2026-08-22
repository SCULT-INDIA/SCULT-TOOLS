import { describe, expect, it } from 'vitest'
import { AI_BOTS } from './tools/ai-visibility-checker/logic'
import { isLikelyBotUserAgent } from './bot-detection'

const REAL_BROWSER_UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
]

describe('isLikelyBotUserAgent — real browsers pass through', () => {
  it('never flags an ordinary desktop/mobile browser User-Agent', () => {
    for (const ua of REAL_BROWSER_UAS) {
      expect(isLikelyBotUserAgent(ua)).toBe(false)
    }
  })

  it('returns false for a missing or empty User-Agent (not a signal worth acting on)', () => {
    expect(isLikelyBotUserAgent(null)).toBe(false)
    expect(isLikelyBotUserAgent(undefined)).toBe(false)
    expect(isLikelyBotUserAgent('')).toBe(false)
  })
})

describe('isLikelyBotUserAgent — every AI_BOTS entry is caught', () => {
  it('flags every crawler this site itself allows in robots.txt', () => {
    for (const bot of AI_BOTS) {
      expect(isLikelyBotUserAgent(`Mozilla/5.0 (compatible; ${bot.name}/1.0)`)).toBe(true)
    }
  })
})

describe('isLikelyBotUserAgent — GoogleOther (2026-08-22 confirmed gap)', () => {
  it('flags GoogleOther in every form actually observed in production traffic', () => {
    // Real UAs pulled from SCULT Studio's raw_user_agent logs for the day
    // this module was first added — GoogleOther's product name contains
    // none of "bot"/"crawler"/"spider"/etc., so both the named list and
    // the generic fallback missed it entirely until this test was added.
    const realGoogleOtherUAs = [
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.137 Mobile Safari/537.36 (compatible; GoogleOther)',
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GoogleOther) Chrome/151.0.7922.137 Safari/537.36',
    ]
    for (const ua of realGoogleOtherUAs) {
      expect(isLikelyBotUserAgent(ua)).toBe(true)
    }
  })

  it('flags GoogleOther\'s sibling products the same way', () => {
    expect(isLikelyBotUserAgent('Mozilla/5.0 (compatible; GoogleOther-Image/1.0)')).toBe(true)
    expect(isLikelyBotUserAgent('Mozilla/5.0 (compatible; Google-Extended/1.0)')).toBe(true)
    expect(
      isLikelyBotUserAgent('Storebot-Google/1.0 (+http://www.google.com/bot.html)'),
    ).toBe(true)
  })
})

describe('isLikelyBotUserAgent — common named crawlers/monitors', () => {
  const namedBots = [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    'AhrefsBot/7.0 (+http://ahrefs.com/robot/)',
    'facebookexternalhit/1.1',
    'Slackbot-LinkExpanding 1.0',
    'Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)',
    'Pingdom.com_bot_version_1.4_(http://www.pingdom.com/)',
  ]

  it('flags each one', () => {
    for (const ua of namedBots) {
      expect(isLikelyBotUserAgent(ua)).toBe(true)
    }
  })
})

describe('isLikelyBotUserAgent — headless/scripted clients', () => {
  it('flags common browser-automation and non-browser HTTP client signatures', () => {
    const uas = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36',
      'Mozilla/5.0 (compatible; Playwright)',
      'python-requests/2.31.0',
      'curl/8.4.0',
    ]
    for (const ua of uas) {
      expect(isLikelyBotUserAgent(ua)).toBe(true)
    }
  })
})

describe('isLikelyBotUserAgent — generic fallback', () => {
  it('flags a self-identifying crawler not on the named list', () => {
    expect(isLikelyBotUserAgent('SomeRandomNewCrawler/1.0 (+http://example.com/bot)')).toBe(
      true,
    )
    expect(isLikelyBotUserAgent('ia_archiver (+http://www.alexa.com/site/help/webmasters)')).toBe(
      true,
    )
  })
})
