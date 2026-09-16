import { describe, expect, it } from 'vitest'
import { classifyRequester } from './bot-classify'

describe('classifyRequester', () => {
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

  it("treats SEO-scraper bots as default, not crawler — they add cost without serving this site's own visibility", () => {
    expect(
      classifyRequester(
        'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
      ),
    ).toBe('default')
    expect(
      classifyRequester(
        'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)',
      ),
    ).toBe('default')
  })

  it('treats ordinary browsers and unrecognized/empty user agents as default', () => {
    expect(
      classifyRequester(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ),
    ).toBe('default')
    expect(classifyRequester('curl/8.4.0')).toBe('default')
    expect(classifyRequester('')).toBe('default')
  })

  it('is a substring match, not an exact one, so real crawler UA strings (which carry versions and URLs) still match', () => {
    expect(classifyRequester('SomePrefix GPTBot/1.0 SomeSuffix')).toBe('crawler')
  })
})
