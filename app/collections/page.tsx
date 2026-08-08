import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { getTool, TOOLS } from '@/lib/tools/registry'
import type { Tool } from '@/lib/tools/types'

export const metadata: Metadata = {
  title: 'Tool Collections',
  description:
    'Curated bundles of Scult Tools grouped by what you are actually trying to do — GEO/AEO, SEO, freelance paperwork, developer utilities, and design and writing.',
  alternates: { canonical: '/collections' },
}

interface Collection {
  readonly name: string
  readonly rationale: string
  readonly slugs: readonly string[]
}

/**
 * Curated groupings of the existing catalogue.
 *
 * This page adds no new tools and no new claims — it is an internal-linking
 * page that resolves each slug through `getTool()` so a renamed or removed
 * tool fails safely (the entry is skipped) rather than producing a dead link.
 */
const COLLECTIONS: readonly Collection[] = [
  {
    name: 'GEO/AEO starter kit',
    rationale:
      'Check whether AI search engines can read your site, then give them the structured data to quote from it.',
    slugs: ['ai-visibility-checker', 'schema-markup-generator', 'faq-schema-generator'],
  },
  {
    name: 'SEO toolkit',
    rationale:
      'The tools you reach for between writing a page and shipping it — structured data, tracked links, a budget check and a speed verdict.',
    slugs: [
      'schema-markup-generator',
      'faq-schema-generator',
      'utm-builder',
      'marketing-roi-calculator',
      'website-speed-test',
    ],
  },
  {
    name: 'Freelancer & small business essentials',
    rationale:
      'The paperwork and identity basics a new business needs before its first client.',
    slugs: [
      'invoice-generator',
      'business-name-generator',
      'slogan-generator',
      'email-signature-generator',
    ],
  },
  {
    name: 'Developer utilities',
    rationale: 'Small, local utilities for the things you do twenty times a day.',
    slugs: ['json-formatter', 'qr-code-generator', 'favicon-generator'],
  },
  {
    name: 'Design & writing',
    rationale:
      'Colour and copy checks that run as you work, not after you submit a file.',
    slugs: ['color-palette-generator', 'word-counter'],
  },
]

export default function CollectionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Collections', path: '/collections' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Collections</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Tool collections
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          {TOOLS.length} tools, grouped by the job you are actually trying to finish. Each
          collection below is a shortlist, not a new tool — every link goes to the same
          free tool pages listed across the rest of the site.
        </p>

        {COLLECTIONS.map((collection) => {
          const tools = collection.slugs
            .map((slug) => getTool(slug))
            .filter((tool): tool is Tool => tool !== undefined)

          return (
            <section key={collection.name} className="mt-12">
              <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
                {collection.name}
              </h2>
              <p className="mt-3 text-[16px] text-ink-muted leading-7">
                {collection.rationale}
              </p>

              <ul className="mt-4 space-y-3">
                {tools.map((tool) => (
                  <li key={tool.slug} className="card-flat p-4">
                    {/* Sits on .card-flat's ambient cream, not a
                        tile/violet-50/100 fill — .card-flat's own dark-mode
                        fix only re-themes the surface, not this accent text,
                        which measures well under AA in dark mode.
                        --color-violet-accent-text is this codebase's existing
                        dark-mode-only token for standalone accent text (see
                        .eyebrow / nav-link hover); the fallback keeps light
                        mode's violet-700 unchanged. */}
                    <Link
                      href={`/${tool.category}/${tool.slug}`}
                      className="font-medium text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                    >
                      {tool.title}
                    </Link>
                    <p className="mt-1 text-[15px] text-ink-muted">{tool.tagline}</p>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <p className="mt-12 text-[15px] text-ink-subtle leading-7">
          Looking for something not listed here? Browse{' '}
          <Link
            href="/all"
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            all {TOOLS.length} tools
          </Link>{' '}
          or the{' '}
          <Link
            href="/prompts"
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            prompt library
          </Link>
          .
        </p>
      </article>
    </>
  )
}
