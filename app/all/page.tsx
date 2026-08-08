import type { Metadata } from 'next'
import Link from 'next/link'
import { ToolCard } from '@/components/ui/ToolCard'
import { PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'

export const metadata: Metadata = {
  title: `All ${TOOLS.length} Free Online Tools — A to Z`,
  description: `Every free tool on Scult Tools, grouped by category. ${TOOLS.length} tools for SEO, business, developers, writing, design and AI visibility. No signup.`,
  alternates: { canonical: '/all' },
}

/**
 * The complete directory.
 *
 * This does the completeness job that dumping every link into the sitewide footer
 * would do badly: it is one hop from anywhere, so no tool is ever more than two
 * clicks from any page, without diluting every page with 80 boilerplate links.
 */
export default function AllToolsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'All tools', path: '/all' },
        ])}
      />

      <section className="container-site pt-10 pb-6">
        <p className="eyebrow">Complete directory</p>
        <h1 className="mt-3 text-[38px] leading-[1.05] tracking-[-1px] md:text-[52px] md:leading-[56px]">
          All {TOOLS.length} free tools
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] text-ink-muted leading-7 md:text-lead">
          Everything on the site, grouped by category. No signup on any of them.
        </p>
        <p className="mt-3 text-[15px] text-ink-muted">
          Looking for prompts instead?{' '}
          {/* Same ambient-page/standalone-link pairing as the "Category
              page →" links below — see that comment. */}
          <Link
            href="/prompts"
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            The prompt library
          </Link>{' '}
          has {PROMPTS.length} of those, also free.
        </p>

        <nav aria-label="Jump to category" className="mt-7 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="chip-tool px-4 py-2 text-[14px]"
            >
              {c.name}
            </a>
          ))}
        </nav>
      </section>

      {CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.slug)
        if (tools.length === 0) return null
        return (
          <section
            key={category.slug}
            id={category.slug}
            aria-labelledby={`${category.slug}-heading`}
            className="container-site scroll-mt-32 py-8"
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2
                id={`${category.slug}-heading`}
                className="text-[26px] tracking-[-0.5px] md:text-[30px]"
              >
                {category.name}
              </h2>
              {/* Plain link on this page's ambient offwhite background, not a
                  tile/violet-50/100 fill — text-violet-700 alone measures
                  well under AA in dark mode. --color-violet-accent-text is
                  this codebase's existing dark-mode-only token for standalone
                  accent text (see .eyebrow / nav-link hover); the fallback
                  keeps light mode's violet-700 unchanged. hover:text-violet-600
                  already has its own dark-mode override in globals.css. */}
              <Link
                href={`/${category.slug}`}
                className="font-medium text-[15px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
              >
                Category page →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
