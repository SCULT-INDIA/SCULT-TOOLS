import { ArrowLeft, ArrowUpRight, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SupportSections } from '@/components/tools/SupportContentBlocks'
import { ToolCard } from '@/components/ui/ToolCard'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { GUIDES } from '@/lib/guides/registry'
import { PROMPTS } from '@/lib/prompts/registry'
import { formatUpdatedDate } from '@/lib/site'
import { getCategory } from '@/lib/tools/categories'
import { getTool } from '@/lib/tools/registry'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { Tool } from '@/lib/tools/types'

/**
 * The dedicated "how it works" page shell — 2026-modern, calm, one column,
 * generous whitespace. Deliberately NOT the tool page's neo-brutalist
 * register (`.card-flat`/`.chip-tool`/hard shadows): that language exists
 * for interactive controls, and this page has none — it is read, not
 * operated — so it uses the same soft-elevation `.card-modern`/`.btn-primary`
 * primitives the landing page's 2026 section already established.
 *
 * Content is NOT rewritten here — `tool.howItWorks`/`howToUse`/`limitations`/
 * `faq` already exist on every tool (written for an earlier version of the
 * tool page, removed from there per the user's request to keep tool pages
 * to just the tool). This shell is what gives that already-substantive,
 * keyword-rich content a real page again, one step away from the tool
 * rather than competing with it for space.
 */
export function HowItWorksShell({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category)
  const related = tool.related
    .map((slug) => getTool(slug))
    .filter((t): t is Tool => Boolean(t))
  const service = resolveServiceLink(tool.serviceTarget, tool.slug)

  // Derived, not hand-kept — mirrors this codebase's existing rule for every
  // other cross-registry link (sitemap, llms.txt, changelog all compute from
  // a registry rather than duplicate it). Guide.relatedTools and
  // Prompt.relatedToolSlug already point FROM guides/prompts TO tools; there
  // was no link back the other way, so tools never surfaced the guides and
  // prompts written about them. Computed here rather than added as a new
  // field on Tool itself, since lib/prompts/registry.ts is deliberately never
  // imported by lib/tools/registry.ts (see that file's own docblock) — the
  // reverse lookup belongs at the component layer, not the registry layer.
  const relatedGuides = GUIDES.filter((g) => g.relatedTools.includes(tool.slug))
  const relatedPrompts = PROMPTS.filter((p) => p.relatedToolSlug === tool.slug)
  const relatedPosts = BLOG_POSTS.filter((p) => p.relatedTools.includes(tool.slug))

  return (
    <article className="container-site max-w-[46rem] pt-8 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-ink-subtle">
          <li>
            <Link href="/" className="hover:text-violet-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${tool.category}`} className="hover:text-violet-600">
              {category?.name ?? tool.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${tool.category}/${tool.slug}`}
              className="hover:text-violet-600"
            >
              {tool.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-muted">
            How it works
          </li>
        </ol>
      </nav>

      <header>
        <p className="eyebrow">How it works</p>
        <h1 className="mt-3 flex items-center gap-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]">
          <Image
            src={`/tool-icons/${tool.slug}.png`}
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            className="size-9 shrink-0 rounded-full ring-1 ring-line md:size-11"
          />
          How the {tool.title} works
        </h1>
        <p className="mt-4 max-w-[58ch] text-[17px] text-ink-muted leading-7 md:text-lead">
          {tool.description}
        </p>
        <p className="mt-2 text-[13px] text-ink-subtle">
          Last updated {formatUpdatedDate(tool.updatedAt)}
        </p>
        <Link
          href={`/${tool.category}/${tool.slug}`}
          className="btn-primary mt-6 inline-flex"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Try {tool.title} now
        </Link>
      </header>

      {/* The method — tool.howItWorks. The real, keyword-dense explanation:
          formula, algorithm or standard, written for E-E-A-T rather than
          padded for length. */}
      <section aria-labelledby="how-method" className="mt-12">
        <h2 id="how-method" className="text-[24px] tracking-[-0.5px] md:text-[28px]">
          The method
        </h2>
        <div className="card-modern mt-4 p-6 md:p-7">
          <p className="text-[16px] text-ink-body leading-7 md:text-[17px]">
            {tool.howItWorks}
          </p>
        </div>
      </section>

      {/* Step-by-step — tool.howToUse, as a numbered vertical list. A
          horizontal StepTimeline (built for scan-progress rows) is the
          wrong shape for a READ-in-order procedure; a plain numbered list
          says "these happen in this order" without borrowing a progress
          affordance this page has no progress to show. */}
      <section aria-labelledby="how-steps" className="mt-10">
        <h2 id="how-steps" className="text-[24px] tracking-[-0.5px] md:text-[28px]">
          Step by step
        </h2>
        <ol className="mt-4 flex flex-col gap-3">
          {tool.howToUse.map((step, i) => (
            <li key={step} className="card-modern flex gap-4 p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 font-display font-bold text-[15px] text-violet-700">
                {i + 1}
              </span>
              <p className="text-[15px] text-ink-body leading-6 md:text-[16px]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Limitations — stated plainly, per the registry's own contract for
          this field ("Honesty here is a ranking asset, not a liability."). */}
      {tool.limitations.length > 0 ? (
        <section aria-labelledby="how-limits" className="mt-10">
          <h2 id="how-limits" className="text-[24px] tracking-[-0.5px] md:text-[28px]">
            What it doesn't do
          </h2>
          <div className="mt-4 rounded-lg border border-line-grey bg-offwhite p-5">
            <ul className="flex flex-col gap-3">
              {tool.limitations.map((limitation) => (
                <li
                  key={limitation}
                  className="flex items-start gap-3 text-[15px] text-ink-muted leading-6"
                >
                  <TriangleAlert
                    className="mt-0.5 size-4 shrink-0 text-ink-subtle"
                    aria-hidden="true"
                  />
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Deeper support content — examples, formulas, cheat sheets,
          checklists, drawn from the 2026-08 content-handover integration.
          Sits after limitations and before FAQ, matching the content
          guide's own recommended order (how-to → result explanation →
          examples/templates → FAQ). Every tool with supportContent also has
          a matching screenshot at this fixed path (captured for all 15
          tools in the same handover pass) — shown once as the section's
          lead image rather than added as a data field, since it is exactly
          one image per tool, not a variable-count piece of content. */}
      {tool.supportContent && tool.supportContent.length > 0 ? (
        <>
          <div className="mt-10 overflow-hidden rounded-lg border border-line-grey">
            <Image
              src={`/tool-screenshots/${tool.slug}-viewport.png`}
              alt={`${tool.title} shown in the browser`}
              width={1440}
              height={900}
              className="h-auto w-full"
            />
          </div>
          <SupportSections sections={tool.supportContent} />
        </>
      ) : null}

      {/* FAQ — same content as the FAQPage JSON-LD this route emits (see the
          page file); rendering it here is what makes that markup honest
          rather than invisible structured data. Plain <details>, matching
          the disclosure pattern already used elsewhere in this codebase
          (e.g. InvoiceGenerator's collapsible sections) rather than a new
          accordion primitive for a one-page use. */}
      {tool.faq.length > 0 ? (
        <section aria-labelledby="how-faq" className="mt-10">
          <h2 id="how-faq" className="text-[24px] tracking-[-0.5px] md:text-[28px]">
            Frequently asked
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {tool.faq.map((item) => (
              <details key={item.q} className="card-modern group p-5">
                <summary className="cursor-pointer list-none font-semibold text-[16px] text-ink marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-3 text-[15px] text-ink-muted leading-6">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* Closing CTA — the paid-service handoff, tied to Task 3's pricing
          section via the same resolveServiceLink()/parentLink() convention. */}
      <section
        aria-labelledby="how-next"
        className="mt-14 rounded-panel border border-line bg-violet-900 p-7 text-center text-white md:p-9"
      >
        {/* text-white is required, not decorative: the global `h1,h2,h3,h4 {
            color: var(--color-ink) }` base rule is a direct declaration on
            this element, which wins over the section's inherited text-white
            — without this, the heading renders in --color-ink (near-black)
            against this section's own violet-900 fill, the same "identity
            color that must never adapt" background CategoryPlans/Footer's
            closing cards already rely on. */}
        <h2
          id="how-next"
          className="font-display font-semibold text-[24px] text-white tracking-normal md:text-[28px]"
        >
          Need this built into your business?
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[15px] text-white/75 leading-6">
          This tool is free because it's a small, solved problem. If what you actually
          need is bigger — {service.label}, built and maintained for you — that's Scult's
          day job.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href={service.href} className="btn-brutal btn-white">
            EXPLORE {service.label.toUpperCase()}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="how-related" className="mt-12">
          <h2
            id="how-related"
            className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
          >
            Also used with
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((relatedTool) => (
              <ToolCard key={relatedTool.slug} tool={relatedTool} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedGuides.length > 0 || relatedPrompts.length > 0 || relatedPosts.length > 0 ? (
        <section aria-labelledby="how-reading" className="mt-12">
          <h2
            id="how-reading"
            className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-subtle"
          >
            Read next
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="card-modern flex items-center justify-between gap-3 p-5"
              >
                <span className="text-[15px] text-ink-body">{guide.title}</span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-subtle"
                  aria-hidden="true"
                />
              </Link>
            ))}
            {relatedPrompts.map((prompt) => (
              <Link
                key={prompt.slug}
                href={`/prompts/${prompt.category}/${prompt.slug}`}
                className="card-modern flex items-center justify-between gap-3 p-5"
              >
                <span className="text-[15px] text-ink-body">{prompt.title}</span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-subtle"
                  aria-hidden="true"
                />
              </Link>
            ))}
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-modern flex items-center justify-between gap-3 p-5"
              >
                <span className="text-[15px] text-ink-body">{post.title}</span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-subtle"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
