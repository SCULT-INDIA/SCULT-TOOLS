import Script from 'next/script'

/**
 * Real SourceForge listing (sourceforge.net/projects/scult-tools), footer-only
 * per the user's explicit split: the hero keeps its existing two badges
 * (Uneed, SaaSHub — see `Hero.tsx`), the footer shows all three.
 *
 * Unlike `UneedBadge`/`SaashubBadge` (a fixed PNG this site can route through
 * `next/image`), SourceForge's own embed is script-rendered: their
 * `badge_js` script scans the page for `.sf-root[data-id]` and injects the
 * actual badge artwork into it client-side. `next/script` (not a raw
 * `<script>` tag) so Next dedupes it if this component ever rendered more
 * than once per page, and `strategy="lazyOnload"` so a non-critical trust
 * badge never competes with real page content for bandwidth. The visible
 * "SCULT-TOOLS" link inside `.sf-root` is SourceForge's own fallback markup —
 * kept as-is so the link stays real and accessible even if the script fails
 * to load.
 */
const SF_ID = '4130347'
const SF_BADGE_VARIANT = 'oss-users-love-us-white'
const SF_PROJECT_URL = 'https://sourceforge.net/projects/scult-tools/'

export function SourceForgeBadge() {
  return (
    <>
      <div
        className="sf-root"
        data-id={SF_ID}
        data-badge={SF_BADGE_VARIANT}
        style={{ width: 80 }}
      >
        <a href={SF_PROJECT_URL} target="_blank" rel="noopener noreferrer">
          SCULT-TOOLS
        </a>
      </div>
      <Script
        src={`https://b.sf-syn.com/badge_js?sf_id=${SF_ID}`}
        strategy="lazyOnload"
      />
    </>
  )
}
