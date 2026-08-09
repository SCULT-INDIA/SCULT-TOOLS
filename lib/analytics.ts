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
 *
 * Safe everywhere: `window.gtag` only exists once the root layout's script
 * has actually loaded (strategy="afterInteractive", and only at all when
 * NEXT_PUBLIC_GA_ID is configured — see lib/site.ts), so this silently
 * no-ops rather than throwing during SSR, in tests (jsdom has no gtag), in
 * local dev without the env var set, or if an ad blocker strips the GA
 * script entirely.
 */
export function trackToolEvent(
  toolName: string,
  action: string,
  extra?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('event', 'tool_action', { tool_name: toolName, action, ...extra })
}
