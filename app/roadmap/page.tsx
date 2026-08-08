import type { Metadata } from 'next'
import Link from 'next/link'
import { PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { SITE } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'What is live on Scult Tools today, the directions we are weighing next, and how we decide when a tool gets retired instead of left to rot.',
  alternates: { canonical: '/roadmap' },
}

/**
 * The roadmap page.
 *
 * Every count here is computed from the registries rather than typed by
 * hand, so the page cannot drift out of sync with the catalogue the way a
 * hardcoded "15 tools" sentence eventually would. The forward-looking
 * section is deliberately written as directions under consideration, not a
 * shipped feature list with dates — see the closing section for why.
 */
export default function RoadmapPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Roadmap', path: '/roadmap' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Roadmap</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          What is live, and what we are weighing next
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          No ship dates on this page. Everything below is either already live, or a
          direction we are considering — labelled honestly as one or the other.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            What is shipped today
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            {TOOLS.length} tools across {CATEGORIES.length} categories — SEO, business,
            developer, productivity, design and GEO/AEO — plus a prompt library of{' '}
            {PROMPTS.length} prompts covering AI models, development, marketing, design,
            business, content, education, image generation and video/audio. All of it is
            live now, not a preview.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            You can browse the current catalogue on{' '}
            <Link
              href="/all"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              the all-tools page
            </Link>{' '}
            and the full prompt list on{' '}
            <Link
              href="/prompts"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              the prompt library
            </Link>
            . Both pages reflect exactly what exists, because both are generated from the
            same registry this page reads its counts from.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Directions under consideration
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            These are themes we are actively thinking about, not commitments. No committed
            dates, and no promise that any of them ships in the form described here.
          </p>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <strong className="text-ink">
                More AI-visibility and GEO diagnostics.
              </strong>{' '}
              The AI Visibility Checker is our first tool in this space. Whether it grows
              a sibling or two, and what they would check, is still open.
            </li>
            <li>
              <strong className="text-ink">
                Deeper India-specific business tooling.
              </strong>{' '}
              The invoice generator already handles GST line items. Whether that pattern
              extends to other India-specific paperwork is something we are weighing, not
              building yet.
            </li>
            <li>
              <strong className="text-ink">
                Continued growth of the newer prompt categories.
              </strong>{' '}
              Some categories in the library are younger and thinner than others. We
              expect to keep adding to them, but on no fixed schedule.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            How a tool gets retired
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            A tool nobody uses eventually gets pruned rather than left to rot on the site
            with stale copy and an unmaintained edge case. That is also why every tool
            here has a named internal owner: retiring something is a decision someone is
            accountable for, not a thing that quietly happens by neglect.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Why there are no dates on this page
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            {SITE.name} is a free hub, not a paid product. A feature that ships late here
            costs nobody money — there is no subscription that was sold against a promise,
            no renewal riding on a date. Given that, we would rather under-promise and say
            "we are considering this" than publish a date we might miss.
          </p>
        </section>

        <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/all"
            className="btn-brutal text-black border-black hover:text-ink hover:border-ink"
          >
            BROWSE ALL {TOOLS.length} TOOLS
          </Link>
          <Link
            href="/prompts"
            className="text-[15px] text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            Or the {PROMPTS.length} prompts →
          </Link>
        </p>
      </article>
    </>
  )
}
