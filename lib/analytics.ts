import { SITE } from '@/lib/site'

/**
 * The single entry point to GA4 custom events — every other tracker in
 * this file, and every call site across the codebase, funnels through this
 * rather than touching `window.gtag`/`dataLayer` directly.
 *
 * Pushes straight onto `window.dataLayer` rather than calling
 * `window.gtag(...)` — a real, confirmed race, not a hypothetical one: the
 * root layout's GA script tag uses `strategy="afterInteractive"`, which
 * only runs once the page has hydrated, and a fast-rendering route (the
 * 404 boundary was the one that surfaced this) can mount an on-load
 * tracking effect BEFORE that script has executed, at which point
 * `window.gtag` genuinely does not exist yet — a `typeof gtag === 'function'`
 * guard would silently drop that event forever, not just delay it.
 * `dataLayer` is a plain array gtag.js itself reads on load and drains for
 * any entries queued before it arrived (this is the exact mechanism the
 * root layout's own inline bootstrap script relies on — its local `gtag()`
 * shim is nothing but `dataLayer.push(arguments)`), so pushing the same
 * `['event', name, params]` shape directly is queue-safe however early it
 * runs, and creating `dataLayer` here if it doesn't exist yet (rather than
 * requiring the bootstrap script to have run first) closes the race
 * completely rather than narrowing it.
 *
 * Still a safe no-op during SSR (no `window`) and in tests (jsdom has no
 * reason to process a dataLayer that nothing reads) — this only ever
 * populates an array, never throws.
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(['event', name, params])
}

/**
 * Fires a GA4 custom event, tagged with which tool it came from.
 *
 * The gtag.js snippet in the root layout (app/layout.tsx) already covers
 * pageviews, scrolls, and outbound clicks via GA4's own Enhanced
 * Measurement — but that only tells you someone LANDED on a tool page, not
 * whether they did anything with it. This is that missing signal.
 *
 * One event name (`tool_action`) with a `tool_name`/`action` parameter
 * pair, not a bespoke event per tool: GA4's Explore/Funnel reports pivot on
 * event PARAMETERS far more easily than on fifteen differently-named
 * events, so every tool reports through the same shape and "which tools get
 * used, for what" is one consistent report instead of fifteen. `tool_name`
 * is always the tool's route slug (e.g. "word-counter"), matching the
 * identifier already used for its icon/URL elsewhere in the codebase.
 */
export function trackToolEvent(
  toolName: string,
  action: string,
  extra?: Record<string, string | number | boolean>,
): void {
  trackEvent('tool_action', { tool_name: toolName, action, ...extra })
}

/**
 * Same shape as `trackToolEvent`, for the prompt library instead of the
 * tools — kept as a separate event name (`prompt_action`, not `tool_action`
 * with a different tool_name) so "which prompts get copied" and "which
 * tools get used" stay two distinct GA4 reports rather than one that needs
 * a secondary filter to tell prompts and tools apart.
 */
export function trackPromptEvent(
  category: string,
  promptSlug: string,
  action: string,
  extra?: Record<string, string | number | boolean>,
): void {
  trackEvent('prompt_action', { category, prompt: promptSlug, action, ...extra })
}

/**
 * What a click on an outbound link to the parent site is worth recording.
 * `campaign` is the `utm_campaign` value `parentLink()` already stamped on
 * the URL — the tool slug, or a hand-written placement name like
 * `pricing-section` — so it doubles as the CTA's identity without any call
 * site having to name itself twice.
 */
export type ParentCtaLink = {
  campaign: string
  destination: string
}

/**
 * Decides whether an href is one of our own outbound conversion links, and
 * pulls the campaign out of it if so. Pure and side-effect free precisely so
 * it can be tested without a DOM — the listener that calls it (see
 * `components/layout/CtaClickTracker.tsx`) cannot be.
 *
 * The match is deliberately narrow: parent host AND our own `utm_source`.
 * Host alone would also catch the plain prose links to scult.in scattered
 * through the copy, which are not CTAs and would inflate the conversion
 * count. Requiring the `utm_source` this codebase stamps in `parentLink()`
 * means only links built by that helper — i.e. actual conversion links —
 * ever qualify.
 *
 * Returns null for anything else, including unparseable hrefs (`#`,
 * `mailto:`, a malformed value from hand-written markup) — a tracker must
 * never be the thing that throws inside a click handler.
 */
export function parseParentCtaHref(href: string, base: string): ParentCtaLink | null {
  let url: URL
  let parent: URL
  try {
    url = new URL(href, base)
    parent = new URL(SITE.parentUrl)
  } catch {
    return null
  }
  if (url.host !== parent.host) return null
  if (url.searchParams.get('utm_source') !== SITE.host) return null
  return {
    campaign: url.searchParams.get('utm_campaign') || 'unknown',
    // Path + hash, not the full href: the UTM query is already captured in
    // `campaign`, and keeping it would make every destination look unique in
    // GA4 rather than grouping "everyone who went to /#book-meeting".
    destination: `${url.pathname}${url.hash}`,
  }
}

/**
 * The conversion event. `parentLink()` in lib/site.ts exists so the CRM can
 * answer "which tool produced this client" — but UTM tags alone only tell
 * that story from scult.in's side, once someone has already arrived. This is
 * the other half: the click itself, recorded on the tools side, so the funnel
 * "used a tool -> clicked through to the agency" is one query instead of two
 * properties that have to be reconciled by hand.
 *
 * Not redundant with GA4's Enhanced Measurement outbound-click tracking: that
 * fires an untyped `click` for EVERY external link — GitHub, Instagram, the
 * Clarity docs — carries no campaign, and is therefore useless as a key
 * event. This one fires only for conversion links and can be marked as a key
 * event without poisoning the conversion count.
 */
export function trackCtaClick(
  campaign: string,
  extra?: Record<string, string | number | boolean>,
): void {
  trackEvent('cta_click', { cta_location: campaign, ...extra })
}

/**
 * GA4's own recommended `search` event (exact name and `search_term` param
 * per Google's recommended-events spec), fired only when a search actually
 * resolves to something — a result picked, or confirmed empty — never on
 * every keystroke. Using the recommended name/shape (rather than a custom
 * one) is deliberate: GA4 treats recommended events as first-class in some
 * of its own built-in reports and integrations, which a made-up event name
 * would not get for free.
 */
export function trackSearch(
  searchTerm: string,
  extra?: Record<string, string | number | boolean>,
): void {
  trackEvent('search', { search_term: searchTerm, ...extra })
}
