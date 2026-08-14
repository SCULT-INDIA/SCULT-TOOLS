import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

const TITLE = 'Changelog'
const DESCRIPTION =
  'What changed on Scult Tools and when — site-wide updates plus a per-tool last-updated list generated straight from the tool registry, not hand-typed.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/changelog' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/changelog'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

/**
 * The tool half of this page is generated, never hand-typed.
 *
 * Each row comes straight off `TOOLS[].updatedAt`, sorted newest first, so it
 * cannot drift from the registry the way a hand-maintained list eventually
 * would. Ties (several tools reviewed the same day) break on title so the
 * order is stable across builds.
 */
const toolUpdates = TOOLS.map((tool) => ({
  date: tool.updatedAt,
  slug: tool.slug,
  title: tool.title,
  category: tool.category,
})).sort((a, b) => {
  if (a.date === b.date) return a.title.localeCompare(b.title)
  return a.date > b.date ? -1 : 1
})

export default function ChangelogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Changelog', path: '/changelog' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Changelog</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          What changed, and when
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          Two lists: site-wide updates we write by hand, and a per-tool last-updated table
          generated from the same registry that drives the sitemap. If a tool's date
          moves, it is because something on that page actually changed.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Site</h2>
          <ul className="mt-4 space-y-4 text-[16px] text-ink-muted leading-7">
            <li className="flex gap-4">
              <span className="w-[100px] shrink-0 font-medium text-ink-subtle">
                2026-08-09
              </span>
              <span>
                Published{' '}
                <Link
                  href="/llms.txt"
                  className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                >
                  /llms.txt
                </Link>
                , an AI-crawler-aware robots.txt, and a set of new trust and reference
                pages (terms, FAQ, security, accessibility, glossary and more).
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Tools, by last update
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every tool on the site, newest review first. This is the same date each tool's
            own page and the XML sitemap use — it only moves when we actually revisit the
            tool.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">Tools sorted by last-updated date</caption>
              <thead>
                <tr className="border-ink border-b">
                  <th scope="col" className="py-2.5 pr-4 font-bold">
                    Date
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-bold">
                    Tool
                  </th>
                  <th scope="col" className="py-2.5 font-bold">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {toolUpdates.map((update) => (
                  <tr key={update.slug} className="border-line border-b">
                    <td className="py-2.5 pr-4 text-ink-subtle">{update.date}</td>
                    <td className="py-2.5 pr-4">
                      {/* Plain link on the table's ambient page background, not
                          a tile/violet-50/100 fill — text-violet-700 alone
                          measures well under AA in dark mode.
                          --color-violet-accent-text is this codebase's
                          existing dark-mode-only token for standalone accent
                          text (see .eyebrow / nav-link hover); the fallback
                          keeps light mode's violet-700 unchanged.
                          hover:text-violet-600 already has its own dark-mode
                          override in globals.css. */}
                      <Link
                        href={`/${update.category}/${update.slug}`}
                        className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                      >
                        {update.title}
                      </Link>
                    </td>
                    <td className="py-2.5 text-ink-subtle">
                      {CATEGORIES.find((c) => c.slug === update.category)?.name ??
                        update.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-12 text-[15px] text-ink-subtle leading-7">
          The{' '}
          {/* Same ambient-page/standalone-link pairing as the table links
              above — see that comment. */}
          <Link
            href="/prompts"
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            prompt library
          </Link>{' '}
          is not on this list — each prompt carries its own "last verified against" date
          on its page instead, since a prompt goes stale on a different clock than a tool
          does.
        </p>
      </article>
    </>
  )
}
