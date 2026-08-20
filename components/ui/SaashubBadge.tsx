import Image from 'next/image'

/**
 * Real SaaSHub directory listing (saashub.com/scult-tools), shared by the
 * footer credibility bar and the homepage hero — same reasoning and pattern
 * as `UneedBadge`, so the two real third-party badges can't drift apart.
 *
 * Routed through next/image rather than a plain `<img>`, same fix as
 * `UneedBadge`: the source PNG is 300x100, larger than the ~150x50/120x40
 * it's ever displayed at, so the un-optimized `<img>` from SaaSHub's own
 * embed snippet would ship more bytes than needed and inherit their origin's
 * cache headers instead of Next's long-lived ones.
 */
const SAASHUB_HREF =
  'https://www.saashub.com/scult-tools?utm_source=badge&utm_campaign=badge&utm_content=scult-tools&badge_variant=color&badge_kind=approved'
const SAASHUB_SRC = 'https://cdn-b.saashub.com/img/badges/approved-color.png?v=1'

/** The live badge's real source dimensions (300x100) — used to derive the
 * `width`/`height` next/image requires per rendered size below. */
const SAASHUB_ASPECT_RATIO = 300 / 100

export function SaashubBadge({
  className = 'h-10 w-auto',
  heightPx = 40,
}: {
  className?: string
  /** Rendered height in px, matching `className`'s `h-*` value. */
  heightPx?: number
}) {
  return (
    <a
      href={SAASHUB_HREF}
      rel="noopener noreferrer"
      target="_blank"
      className="inline-flex"
    >
      <Image
        src={SAASHUB_SRC}
        alt="Scult Tools badge"
        width={Math.round(heightPx * SAASHUB_ASPECT_RATIO)}
        height={heightPx}
        className={className}
      />
    </a>
  )
}
