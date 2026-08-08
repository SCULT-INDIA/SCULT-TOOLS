import { BrandIcon } from '@/components/ui/BrandIcon'

/**
 * Reference: band 2 — a client-logo marquee ("Zipliens, Adsvisory, Aviso…")
 * with edge-fade masks, above a bold-counter caption.
 *
 * We have no client roster to display, so the marquee carries what is
 * actually true here: the real platforms our output is meant to slot into.
 *
 * Originally rendered as plain wordmarks — no logo graphics at all — on the
 * (correct, still-true) reasoning that reproducing a brand's mark needed a
 * license. That's overly cautious: nominative fair use for an honest
 * "integrates with" context is exactly what BrandIcon's two source libraries
 * (@lobehub/icons, simple-icons) exist for, and this site already leans on
 * that everywhere else (PromptLibrarySpotlight's brand wall, prompt cards).
 * Real logos here now, matching that established precedent instead of being
 * the one inconsistent section that opted out of it.
 *
 * Each mark sits in a small white chip rather than bare on this section's
 * adaptive bg-offwhite: several of these official marks (GitHub, Vercel,
 * Notion) are near-black monochrome, which would go invisible on
 * bg-offwhite's dark-mode value (#000000, confirmed in globals.css) if
 * placed directly on it. White chips are the same convention
 * PromptLibrarySpotlight already uses for its own logo wall, for the same
 * reason.
 */
const PLATFORMS = [
  { brand: 'wordpress', name: 'WordPress' },
  { brand: 'shopify', name: 'Shopify' },
  { brand: 'webflow', name: 'Webflow' },
  { brand: 'google-search-console', name: 'Google Search Console' },
  { brand: 'nextjs', name: 'Next.js' },
  { brand: 'framer', name: 'Framer' },
  { brand: 'notion', name: 'Notion' },
  { brand: 'zapier', name: 'Zapier' },
  { brand: 'squarespace', name: 'Squarespace' },
  { brand: 'github', name: 'GitHub' },
  { brand: 'vercel', name: 'Vercel' },
  { brand: 'google-analytics', name: 'Google Analytics' },
  { brand: 'hubspot', name: 'HubSpot' },
  { brand: 'airtable', name: 'Airtable' },
  { brand: 'trello', name: 'Trello' },
  { brand: 'woocommerce', name: 'WooCommerce' },
] as const

export function TechMarquee() {
  const track = [...PLATFORMS, ...PLATFORMS]
  return (
    <section
      aria-label="Where the output goes"
      className="border-line border-y bg-offwhite py-10"
    >
      <p className="mb-7 text-center text-[13px] text-ink-subtle uppercase tracking-[0.12em]">
        Built to slot into what you already use
      </p>
      <div className="marquee-mask overflow-hidden">
        <div
          className="flex w-max animate-[marquee_36s_linear_infinite] gap-10 motion-reduce:animate-none"
          aria-hidden="true"
        >
          {track.map((platform, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: a static, duplicated decorative track
              key={`${platform.brand}-${i}`}
              className="flex shrink-0 items-center gap-3"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-white shadow-[0_2px_10px_rgb(0_0_0/0.06)]">
                <BrandIcon brand={platform.brand} size={26} />
              </span>
              <span className="whitespace-nowrap font-display font-semibold text-[19px] text-ink/70">
                {platform.name}
              </span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
