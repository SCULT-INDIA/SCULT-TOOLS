/**
 * Reads the anonymous visitor id SCULT Studio's tracking snippet
 * (`https://studio.scult.in/track.js`, loaded in
 * `components/layout/DeferredAnalyticsScripts.tsx`) exposes on
 * `window.__scultVisitorId` once it has loaded — a `localStorage`-backed id,
 * no cookies, no PII. Feedback/request submissions pass it along so Studio
 * can associate a visitor's activity across multiple submissions.
 *
 * Deliberately tolerant: the script is deferred until first interaction (or
 * a ~4s fallback), so a visitor submitting a form in that window has no
 * visitor id yet. That's fine — every field downstream treats it as
 * optional, never as something a submission depends on.
 */
export function getVisitorId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const id = (window as unknown as { __scultVisitorId?: unknown }).__scultVisitorId
  return typeof id === 'string' && id.length > 0 ? id : undefined
}
