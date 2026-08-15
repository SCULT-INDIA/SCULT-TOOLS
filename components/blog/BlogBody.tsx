import Link from 'next/link'
import type { BlogSection, Inline } from '@/lib/blog/types'

/**
 * Renders one paragraph's segments in order. A plain string prints as text;
 * a link segment renders as an internal next/link (relative href) or a plain
 * `<a>` for `external: true` (scult.in service pages, book-a-meeting — the
 * href is expected to already be built via `parentLink()` so UTM attribution
 * survives, same convention `ContactAndCta.tsx` and `HowItWorksShell.tsx` use).
 */
function Paragraph({ segments }: { segments: readonly Inline[] }) {
  return (
    <p className="mt-4 text-[16px] text-ink-muted leading-7">
      {segments.map((segment, i) => {
        if (typeof segment === 'string') {
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are static, ordered, never reordered
          return <span key={i}>{segment}</span>
        }
        const linkClass =
          'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'
        return segment.external ? (
          <a key={segment.href} href={segment.href} className={linkClass}>
            {segment.text}
          </a>
        ) : (
          <Link key={segment.href} href={segment.href} className={linkClass}>
            {segment.text}
          </Link>
        )
      })}
    </p>
  )
}

export function BlogBody({ sections }: { sections: readonly BlogSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            {section.heading}
          </h2>
          {section.body.map((paragraph, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are static and ordered
            <Paragraph key={i} segments={paragraph} />
          ))}
        </section>
      ))}
    </>
  )
}
