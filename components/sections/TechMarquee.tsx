/**
 * Reference: band 2 — a client-logo marquee ("Zipliens, Adsvisory, Aviso…")
 * with edge-fade masks, above a bold-counter caption.
 *
 * We have no client roster to display, so the marquee carries what is actually
 * true here: the real platforms our output is meant to slot into (WordPress,
 * Shopify, Webflow, Google Search Console, the GST portal). These are wordmarks,
 * not logos we're licensed to reproduce pixel-for-pixel, which keeps this
 * trademark-safe while preserving the "works with your stack" message.
 */
const PLATFORMS = [
  'WordPress',
  'Shopify',
  'Webflow',
  'Google Search Console',
  'Next.js',
  'Framer',
  'Notion',
  'Zapier',
]

export function TechMarquee() {
  const track = [...PLATFORMS, ...PLATFORMS]
  return (
    <section
      aria-label="Where the output goes"
      className="border-line border-y bg-offwhite py-10"
    >
      <p className="mb-6 text-center text-[13px] text-ink-subtle uppercase tracking-[0.12em]">
        Built to slot into what you already use
      </p>
      <div className="marquee-mask overflow-hidden">
        <div
          className="flex w-max animate-[marquee_28s_linear_infinite] gap-14 motion-reduce:animate-none"
          aria-hidden="true"
        >
          {track.map((name, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: a static, duplicated decorative track
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display font-semibold text-[20px] text-ink/35"
            >
              {name}
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
