/**
 * Real Uneed directory listing (uneed.best/tool/scult-tool), shared by the
 * footer credibility bar and the homepage hero so the badge can't drift
 * between the two. The image is served straight from Uneed's own host — it's
 * their live artwork (updates on their end, e.g. once the listing goes from
 * "launching soon" to live), so it's a plain `<img>` rather than next/image:
 * optimizing/caching a badge we don't control would risk serving a stale
 * version of their own asset.
 */
const UNEED_HREF = 'https://www.uneed.best/tool/scult-tool'
const UNEED_SRC = 'https://www.uneed.best/EMBED3B.png'

/** The live badge's real source dimensions (582x152) — used only to derive an
 * intrinsic `width`/`height` pair per rendered size below, so the browser can
 * reserve the right box before the image loads (CSS still controls the
 * actual visual size; these attributes are what Lighthouse's CLS-safety
 * check wants, not a resize). */
const UNEED_ASPECT_RATIO = 582 / 152

export function UneedBadge({
  className = 'h-10 w-auto',
  heightPx = 40,
}: {
  className?: string
  /** Rendered height in px, matching `className`'s `h-*` value — used only
   * to compute the `width`/`height` attributes below. */
  heightPx?: number
}) {
  return (
    <a href={UNEED_HREF} rel="noopener noreferrer" target="_blank" className="inline-flex">
      {/** biome-ignore lint/performance/noImgElement: third-party live badge, see file docblock */}
      <img
        src={UNEED_SRC}
        alt="Uneed Embed Badge"
        width={Math.round(heightPx * UNEED_ASPECT_RATIO)}
        height={heightPx}
        className={className}
      />
    </a>
  )
}
