/**
 * User-Agent classification for `proxy.ts`'s page-route rate limiter.
 *
 * Not a security boundary — a User-Agent string is just a claim, trivially
 * spoofed by anyone motivated enough. The point of this file is narrower:
 * give the small set of crawlers this site actually wants a generous
 * (but still finite) limit instead of throttling them at the same rate as
 * an anonymous scraper, without having to trust the claim unconditionally —
 * a spoofed "Googlebot" still hits a real ceiling, just a higher one. True
 * verification (reverse-DNS against the crawler's published IP ranges) is
 * what Google/Bing/OpenAI document for anyone who needs to be certain, and
 * is exactly what Vercel's own Bot Management / Attack Challenge Mode does
 * at the edge — worth enabling from the Vercel dashboard as a complementary,
 * stronger layer; this file only ever raises or lowers an in-app number.
 *
 * Deliberately short-lived by design: named individually rather than via a
 * generic "contains 'bot'" pattern, so a new crawler worth trusting is an
 * explicit, reviewed addition, not an accidental match.
 */

export type RequesterTier = 'crawler' | 'default'

/**
 * Search engines, AI/LLM crawlers, and social-preview unfurl bots — traffic
 * this site actively wants (see the AI Visibility Checker tool, the CSP's
 * own allowance for OpenAI/Anthropic/etc., and llms.txt). Deliberately
 * excludes SEO-scraper bots (Ahrefs, Semrush, MJ12, …): they cost the same
 * as any other crawler but don't feed this site's own indexing or AI-answer
 * visibility, so they get the default tier like anything else unrecognized.
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

export function classifyRequester(userAgent: string): RequesterTier {
  if (!userAgent) return 'default'
  return CRAWLER_USER_AGENT_SUBSTRINGS.some((needle) => userAgent.includes(needle))
    ? 'crawler'
    : 'default'
}
