import { AI_BOTS } from '@/lib/tools/ai-visibility-checker/logic'

/**
 * A heuristic "is this a bot" check for ANALYTICS purposes only — never for
 * access control. This site's whole GEO/AEO angle is built around welcoming
 * crawlers (see `app/robots.ts`, which explicitly `Allow`s every bot in
 * `AI_BOTS` by name); this module never feeds a block/deny decision, only a
 * "don't count this visit" one for SCULT Studio's tracking
 * (`components/layout/DeferredAnalyticsScripts.tsx`) and its feedback/request
 * submission routes (`app/api/feedback/route.ts`, `app/api/request/route.ts`).
 *
 * `AI_BOTS` is reused rather than re-typed so this list and the AI Visibility
 * Checker's own roster (and robots.txt's) can't drift apart.
 *
 * Honest limitation, worth stating rather than hiding: this only catches
 * bots that IDENTIFY themselves via User-Agent — true of essentially every
 * legitimate crawler (search engines, AI crawlers, uptime monitors, SEO
 * tools, link-preview bots) because they WANT to be recognized. It does not
 * catch a bot that deliberately spoofs a normal browser's User-Agent and
 * clears `navigator.webdriver` to evade detection (ad-fraud, scraping
 * operations built to evade exactly this). Filtering those reliably needs
 * IP-reputation and cross-session behavioral signals that only the
 * analytics backend (Studio) can see — this module is the client/edge-side
 * first pass, not a complete answer.
 */

const KNOWN_BOT_UA_SUBSTRINGS: readonly string[] = [
  ...AI_BOTS.map((bot) => bot.name),
  // General search-engine crawlers.
  'Googlebot',
  // Confirmed gap (2026-08-22 audit): "GoogleOther" is a real, distinct
  // Google crawler product — its name contains none of "bot"/"crawler"/
  // "spider"/etc., so it fell through both this list and the generic
  // fallback pattern below undetected. It was responsible for the large
  // majority of the pageview inflation this whole bot-detection module was
  // added to fix in the first place (confirmed via SCULT Studio's raw
  // User-Agent logs for the same day this file was first added).
  'GoogleOther',
  'Google-Extended',
  'Storebot-Google',
  'AdsBot-Google',
  'Google-InspectionTool',
  'Mediapartners-Google',
  'Bingbot',
  'BingPreview',
  'DuckDuckBot',
  'YandexBot',
  'Baiduspider',
  'Applebot',
  // SEO/backlink crawlers.
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'BLEXBot',
  // Link-unfurl / chat-app preview bots.
  'facebookexternalhit',
  'Facebot',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
  'WhatsApp',
  'LinkedInBot',
  'Twitterbot',
  // Uptime/synthetic monitors.
  'UptimeRobot',
  'Pingdom',
  'StatusCake',
  'Site24x7',
  // Headless-browser / scripted-HTTP-client automation.
  'HeadlessChrome',
  'PhantomJS',
  'Puppeteer',
  'Playwright',
  'Selenium',
  'python-requests',
  'axios/',
  'node-fetch',
  'curl/',
  'Wget',
] as const

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Generic catch-all for anything self-identifying as a bot that isn't
 * already named above — most legitimate crawlers do this in their UA. */
const GENERIC_BOT_PATTERN = 'bot|crawler|spider|slurp|archiver|scraper'

const BOT_UA_PATTERN = new RegExp(
  `${KNOWN_BOT_UA_SUBSTRINGS.map(escapeForRegExp).join('|')}|${GENERIC_BOT_PATTERN}`,
  'i',
)

/** True for a User-Agent that self-identifies as a crawler/bot/monitor —
 * never true for a missing/empty User-Agent, which is a weak, easily
 * false-positive signal (privacy tools strip it too) not worth acting on. */
export function isLikelyBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  return BOT_UA_PATTERN.test(userAgent)
}

/** `navigator.webdriver` is set by every mainstream browser-automation
 * framework (Selenium, Puppeteer, Playwright) unless a script goes out of
 * its way to clear it — catches automated sessions a User-Agent string
 * alone wouldn't (an automation script that otherwise looks like normal
 * Chrome). Client-only; there is no server-side equivalent. */
export function isLikelyAutomatedBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  return navigator.webdriver === true
}
