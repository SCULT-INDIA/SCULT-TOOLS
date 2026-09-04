import { SITE } from '@/lib/site'

/**
 * Queues a gtag command in the ONE shape gtag.js will actually dispatch.
 *
 * gtag.js does not treat every `dataLayer` entry alike. Its own inline shim
 * is `function gtag(){dataLayer.push(arguments)}` — an **Arguments object**,
 * not an array — and that distinction is load-bearing. Pushing a plain
 * `['event', name, params]` array is accepted and parsed, but classified as
 * a generic data-layer command (the GTM shape) and never sent to GA4. Its
 * own debug output names the two cases separately:
 *
 *     Processing data layer command: ["event","x",{…}]   <- parsed, dropped
 *     Processing GTAG command:       ["event","y",{…}]   <- sent
 *
 * Verified in GA4 DebugView against production: the array form produced zero
 * events, the gtag form arrived. So the queue path has to construct a real
 * Arguments object, which is only possible by invoking a function.
 *
 * The parameters are declared but unused on purpose — they exist so this
 * type-checks at the call site and so `arguments` carries exactly the three
 * values gtag.js expects, in order.
 */
function queueGtagCommand(queue: unknown[]) {
  // A function expression, never an arrow: arrows have no `arguments` binding
  // of their own, and `arguments` is the whole point here.
  return function gtag(
    _command: 'event',
    _name: string,
    _params?: Record<string, string | number | boolean>,
  ): void {
    // The Arguments object IS the fix — see this function's doc comment.
    // Rest parameters would produce an array and reintroduce the exact bug.
    // biome-ignore lint/complexity/noArguments: gtag.js only dispatches Arguments objects, never arrays.
    queue.push(arguments)
  }
}

/**
 * The single entry point to GA4 custom events — every other tracker in
 * this file, and every call site across the codebase, funnels through this
 * rather than touching `window.gtag`/`dataLayer` directly.
 *
 * Always goes through `dataLayer`, and deliberately does NOT branch on
 * whether `window.gtag` exists yet. There is no state in which the two would
 * differ: the root layout's bootstrap defines `window.gtag` as nothing but
 * `function gtag(){dataLayer.push(arguments)}` and never replaces it, and
 * gtag.js patches `dataLayer.push` to process commands as they arrive. So
 * calling `gtag(...)` after load and pushing here after load both end up in
 * the same patched `push`, with the same Arguments object.
 *
 * That leaves one path that is correct in both states:
 *
 *   - BEFORE the layout's `afterInteractive` script has run, `window.gtag`
 *     genuinely does not exist — a fast-rendering route (the 404 boundary is
 *     the one that surfaced it) can mount an on-load tracking effect first.
 *     A `typeof gtag === 'function'` guard would drop such an event forever
 *     rather than delaying it. Creating `dataLayer` here and queueing onto it
 *     means gtag.js drains the event whenever it does arrive.
 *
 *   - AFTER it has loaded, the same push is processed immediately.
 *
 * The one thing that must not change is the SHAPE: an Arguments object, not
 * an array, or gtag.js parses the entry and silently discards it. See
 * `queueGtagCommand`.
 *
 * Safe no-op during SSR (no `window`). In jsdom nothing drains the queue, so
 * this only ever populates an array — it never throws.
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  const w = window as Window & {
    dataLayer?: unknown[]
    scult?: (name: string, props?: Record<string, unknown>) => void
  }
  w.dataLayer = w.dataLayer || []
  queueGtagCommand(w.dataLayer)('event', name, params)

  // Second sink: SCULT Studio. track.js v2 (loaded from studio.scult.in in
  // DeferredAnalyticsScripts) exposes window.scult(name, props) and owns the
  // batching, session id, visitor id, geo and transport — so mirroring every
  // GA4 event into Studio is one call here, and every existing AND future
  // call site feeds both systems with no per-site-code change. Deliberately
  // fire-and-forget and guarded: if track.js hasn't loaded yet (it's
  // deferred) the event still reaches GA4 above; Studio just misses that one
  // early event, never the site.
  try {
    w.scult?.(name, params as Record<string, unknown> | undefined)
  } catch {
    /* never let a tracking sink break the page */
  }
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

/** Same shape again, for the Skills Library — kept as its own event name
 * (`skill_action`) for the same reason `trackPromptEvent` is separate from
 * `trackToolEvent`: distinct GA4 reports without a secondary filter. */
export function trackSkillEvent(
  category: string,
  skillSlug: string,
  action: string,
  extra?: Record<string, string | number | boolean>,
): void {
  trackEvent('skill_action', { category, skill: skillSlug, action, ...extra })
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

type Oaiq = { (...args: unknown[]): void; q?: unknown[] }

/**
 * Installs OpenAI's own Ads Measurement Pixel queueing shim and fires `init`
 * the first time a conversion needs recording — byte-for-byte their vendor
 * snippet (from Saksham Gupta's 2026-09-03 onboarding email), not a
 * reimplementation, since a subtly different queue shape could silently
 * drop every event the way `trackEvent` above documents for gtag.js.
 *
 * Deliberately NOT dependent on `DeferredAnalyticsScripts` having mounted
 * yet, for the same reason `trackEvent` creates `dataLayer` itself rather
 * than checking `window.gtag`: a conversion click that happens before the
 * visitor has scrolled must not be lost just because the deferred
 * `oaiq.min.js` script hasn't loaded. Once it does load, it drains
 * `window.oaiq.q` itself — this only has to get the queue and the `init`
 * call in place before that happens.
 */
function ensureOaiq(): void {
  if (typeof window === 'undefined' || !SITE.openaiAdsPixelId) return
  const w = window as unknown as { oaiq?: Oaiq }
  if (w.oaiq) return
  // Anonymous, not a named function expression: naming it `oaiq` would shadow
  // the outer `const oaiq: Oaiq` with an inner binding typed only `() =>
  // void`, losing the `.q` property TS needs to see below. The closure over
  // the outer `oaiq` still works — it is only ever called after this
  // assignment completes.
  const oaiq: Oaiq = function () {
    oaiq.q = oaiq.q || []
    // biome-ignore lint/complexity/noArguments: OpenAI's own pixel shim queues Arguments objects verbatim — mirrored exactly from their onboarding snippet, not reimplemented.
    oaiq.q.push(arguments)
  }
  w.oaiq = oaiq
  oaiq('init', { pixelId: SITE.openaiAdsPixelId })
}

/**
 * Reports the "book a meeting" click as a lead conversion to OpenAI Ads —
 * the actual business goal Saksham's ad account needs to optimise toward.
 * Scoped to that one destination (see `trackCtaClick` below) rather than
 * every `parentLink()` click: firing this for plain scult.in navigation
 * links too would inflate reported conversions and corrupt ad-spend
 * optimisation toward an action nobody actually took.
 *
 * `event_id` is unique per click so a later server-side Conversions API
 * event (recommended by OpenAI for the same conversion, not yet wired up —
 * it needs a Conversions API key generated in Ads Manager first) can
 * dedupe against this one instead of double-counting.
 */
function trackAdsConversion(campaign: string): void {
  if (typeof window === 'undefined' || !SITE.openaiAdsPixelId) return
  ensureOaiq()
  const w = window as unknown as { oaiq?: Oaiq }
  try {
    w.oaiq?.(
      'measure',
      'lead',
      { type: 'contents' },
      { event_id: `${campaign}-${Date.now()}` },
    )
  } catch {
    /* never let a tracking sink break the page */
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

  const destination = extra?.destination
  if (typeof destination === 'string' && destination.includes('#book-meeting')) {
    trackAdsConversion(campaign)
  }
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
