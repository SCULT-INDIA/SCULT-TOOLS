import Image from 'next/image'

/**
 * Real Uneed directory listing (uneed.best/tool/scult-tool), shared by the
 * footer credibility bar and the homepage hero so the badge can't drift
 * between the two.
 *
 * Routed through next/image rather than a plain `<img>`: the source PNG is
 * 582x152, far larger than the 236x62/122x32 it's ever displayed at (PSI
 * flagged this — "Improve image delivery" — plus the origin's own
 * Cache-Control on it is short, flagged separately as "efficient cache
 * lifetimes"). Next's image optimizer resizes/re-encodes to the actual
 * displayed size and serves it under its own long-lived cache headers,
 * fixing both. This does trade away "always byte-identical to Uneed's own
 * asset" — the optimizer re-fetches from origin on its own cache schedule
 * (`images.minimumCacheTTL`, left at Next's default), not on every request —
 * but that's a short, bounded staleness window against a badge that changes
 * rarely (e.g. "launching soon" → live), not the indefinite staleness a
 * hand-rolled resize/cache step would risk.
 */
const UNEED_HREF = 'https://www.uneed.best/tool/scult-tool'
const UNEED_SRC = 'https://www.uneed.best/EMBED3B.png'

/** The live badge's real source dimensions (582x152) — used to derive the
 * `width`/`height` next/image requires per rendered size below. */
const UNEED_ASPECT_RATIO = 582 / 152

export function UneedBadge({
  className = 'h-10 w-auto',
  heightPx = 40,
}: {
  className?: string
  /** Rendered height in px, matching `className`'s `h-*` value. */
  heightPx?: number
}) {
  return (
    <a
      href={UNEED_HREF}
      rel="noopener noreferrer"
      target="_blank"
      className="inline-flex"
    >
      <Image
        src={UNEED_SRC}
        alt="Uneed Embed Badge"
        width={Math.round(heightPx * UNEED_ASPECT_RATIO)}
        height={heightPx}
        className={className}
      />
    </a>
  )
}
