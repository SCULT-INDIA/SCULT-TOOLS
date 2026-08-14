import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GUIDES, getGuide } from '@/lib/guides/registry'
import { breadcrumbJsonLd, guideJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getTool } from '@/lib/tools/registry'

export function generateStaticParams(): { slug: string }[] {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  const path = `/guides/${guide.slug}`
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: absoluteUrl(path),
      title: guide.title,
      description: guide.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const relatedTools = guide.relatedTools
    .map((toolSlug) => getTool(toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />
      <JsonLd data={guideJsonLd(guide)} />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Guide · {guide.readingMinutes} min read</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          {guide.h1}
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          {guide.dek}
        </p>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 60)}
                className="mt-3 text-[16px] text-ink-muted leading-7"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
              Related tools
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.category}/${tool.slug}`}
                  className="chip-tool px-4 py-2 text-[14px]"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="mt-10">
          <Link
            href="/guides"
            className="text-[15px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            ← All guides
          </Link>
        </p>
      </article>
    </>
  )
}
