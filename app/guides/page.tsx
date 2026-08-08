import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/lib/guides/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'

export const metadata: Metadata = {
  title: 'Guides',
  description: `${GUIDES.length} in-depth guides on AI search visibility, structured data and invoicing — each one tied to the real tools it references.`,
  alternates: { canonical: '/guides' },
}

/**
 * The editorial layer: longer explanations than a tool's own FAQ can carry,
 * without duplicating it. Every guide here derives from `lib/guides/registry.ts`,
 * so a new guide surfaces here automatically — nothing on this page is hand-kept.
 */
export default function GuidesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ])}
      />

      <section className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Guides</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Longer explanations, for when a tool's FAQ isn't enough
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          {GUIDES.length} guides that go deeper than any single tool page — each one
          written against the real tool it references, so nothing here can drift from what
          that tool actually does.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="card-flat block p-5"
            >
              <h2 className="text-[20px] leading-tight">{guide.h1}</h2>
              <p className="mt-2 text-[15px] text-ink-muted leading-6">
                {guide.description}
              </p>
              <p className="mt-3 text-[13px] text-ink-subtle">
                {guide.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
