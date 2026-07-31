import { Check, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { parentLink } from '@/lib/site'
import { getCategory } from '@/lib/tools/categories'
import { getTool } from '@/lib/tools/registry'
import type { Tool } from '@/lib/tools/types'

/**
 * The tool page anatomy — redesigned at the user's request around one rule:
 * THE TOOL IS THE PAGE. The heading is centred, big and bold; everything
 * between it and the first input has been cut to a single line of badges; and
 * the SEO prose (how-to, how it works, limitations, FAQ) sits below the
 * workspace in a tighter, quieter column.
 *
 * Why the header is so spare: on a 1366x768 laptop the old left-aligned block
 * (breadcrumb + h1 + tagline + badge row) consumed ~410px before the tool
 * appeared. This version spends ~230px, which is what lets the workspace fill
 * roughly 70% of the first viewport — the user's stated target. The h1 and
 * tagline survive because they are the page's search snippet; the second
 * badge row and the breadcrumb's visual weight did not.
 *
 * The load-bearing ordering rule is unchanged: nothing explanatory goes above
 * the tool. The strongest ranking signal a tool page has is people
 * successfully using it, so anything between the H1 and the first input works
 * against the page.
 */
export function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const category = getCategory(tool.category)
  const related = tool.related
    .map((slug) => getTool(slug))
    .filter((t): t is Tool => Boolean(t))

  return (
    <article className="container-site pt-4 pb-16">
      {/* 1. Breadcrumb — kept for orientation and its BreadcrumbList JSON-LD,
             but visually minimal and centred with the rest of the header. */}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-ink-subtle">
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
          <li aria-current="page" className="text-ink-muted">
            {tool.title}
          </li>
        </ol>
      </nav>

      {/* 2. Centred header — the target keyword, big and bold, then one line
             of what it does and one compact row of true badges. */}
      <header className="mx-auto mt-4 max-w-[60rem] text-center">
        {/* The tool's own mark sits INSIDE the H1's first line box, not above
            it. Two failed shapes preceded this one, both measured rather than
            eyeballed:
              - an 88px tile stacked over the title pushed the workspace
                ~100px further down — the exact anti-pattern this shell's
                docblock exists to prevent;
              - a flex row (icon + title as separate flex items) looked right
                in theory, but a flex item's break-point is its MAX-content
                width, so the long unwrapped title never "fit" beside the icon
                and flex-wrap dropped the icon onto its own row above the text
                — the stacked layout again, just 40px tall instead of 88.
            `inline-block` puts the image in the text flow itself: it occupies
            the start of line one and the title wraps around normally. The
            icon is sized under every breakpoint's line box (32px inside the
            ~37px mobile line, 44px inside the ~52-58px md/lg line), so the
            H1's height is exactly what it was with no icon at all.

            The image is the white-disc composite from
            scripts/make-tool-favicons.mjs — identical to this route's
            browser-tab favicon, so tab and page agree on what represents this
            tool. The disc is baked in, so no tile is needed; the faint ring
            only makes the disc's edge read against the page's own white. */}
        <h1 className="font-bold text-[34px] leading-[1.08] tracking-[-1px] md:text-[48px] lg:text-[54px]">
          <Image
            src={`/tool-icons/${tool.slug}.png`}
            alt=""
            width={44}
            height={44}
            priority
            className="mr-2.5 inline-block size-8 rounded-full align-[-0.12em] ring-1 ring-line md:mr-3 md:size-11"
          />
          {tool.h1}
        </h1>
        <p className="mx-auto mt-3 max-w-[58ch] text-[16px] text-ink-muted leading-6 md:text-[18px] md:leading-7">
          {tool.tagline}
        </p>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-ink-subtle">
          {tool.runsInBrowser ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-green bg-tile-green px-3 py-1 font-medium text-ink">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Nothing is uploaded
            </span>
          ) : null}
          {tool.indiaOnly ? (
            <span className="inline-flex items-center rounded-pill border border-line bg-tile-yellow px-3 py-1 font-medium text-ink">
              Built for India
            </span>
          ) : null}
          <span>Free · No signup</span>
        </p>
      </header>

      {/* 3. THE TOOL — the page's centre of gravity, immediately after the
             header. Measured at 1366x768: the workspace now starts ~350px down
             (was ~449px) and fills ~55-60% of the first viewport. The user's
             70% target is not literally reachable there without shrinking the
             sticky site header or the headline they asked to be big — the two
             things consuming the rest — so this is the honest maximum, and the
             tool remains the overwhelming majority of the page's interactive
             area. */}
      <div className="mt-5">{children}</div>

      {/* 4. Conversion band — one line, not a panel. The old three-line panel
             with its own h2 competed with the tool for attention. */}
      {tool.serviceTarget ? (
        <aside className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-panel border border-line bg-violet-50 px-6 py-4 text-center">
          <p className="text-[15px] text-ink-muted">
            Rather hand this work to a team? Scult does it as a service, with a fixed
            quote up front.
          </p>
          <a
            className="btn-brutal btn-brutal-sm"
            href={parentLink(`/services/${tool.serviceTarget}`, tool.slug)}
          >
            SEE WHAT IT COSTS
          </a>
        </aside>
      ) : null}

      {/* 5. The SEO prose, below the fold where it belongs — same content,
             quieter presentation: smaller headings, tighter rhythm. */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="max-w-[46rem]">
          <section aria-labelledby="how-to-use">
            <h2 id="how-to-use" className="text-[22px] tracking-[-0.5px] md:text-[25px]">
              How to use it
            </h2>
            <ol className="mt-4 space-y-2.5">
              {tool.howToUse.map((step, i) => (
                <li key={step} className="flex gap-3 text-[15px] leading-6">
                  <span className="mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-pill bg-violet-700 font-bold text-[12px] text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="how-it-works" className="mt-10">
            <h2
              id="how-it-works"
              className="text-[22px] tracking-[-0.5px] md:text-[25px]"
            >
              How it works
            </h2>
            <p className="mt-3 text-[15px] text-ink-muted leading-6">{tool.howItWorks}</p>
          </section>

          <section aria-labelledby="limitations" className="mt-10">
            <h2 id="limitations" className="text-[22px] tracking-[-0.5px] md:text-[25px]">
              Limitations
            </h2>
            <ul className="mt-3 space-y-2.5">
              {tool.limitations.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-6">
                  <Check
                    className="mt-1 size-4 shrink-0 text-violet-700"
                    aria-hidden="true"
                  />
                  <span className="text-ink-muted">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq" className="mt-10">
            <h2 id="faq" className="text-[22px] tracking-[-0.5px] md:text-[25px]">
              Frequently asked questions
            </h2>
            <div className="mt-3 divide-y divide-line border-line border-t">
              {tool.faq.map((item) => (
                <details key={item.q} className="group py-3.5">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 font-medium text-[16px] text-ink marker:content-none">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-violet-700 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 max-w-[62ch] text-[15px] text-ink-muted leading-6">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Related tools — the sibling rail, the site's highest-value
            internal-linking surface. Unchanged in substance. */}
        <aside aria-labelledby="related" className="lg:sticky lg:top-32 lg:self-start">
          <h2
            id="related"
            className="font-sans font-bold text-[13px] uppercase tracking-[0.1em]"
          >
            Related tools
          </h2>
          <ul className="mt-4 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/${r.category}/${r.slug}`} className="chip-tool">
                  <Image
                    src={`/tool-icons/${r.slug}.png`}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-full ring-1 ring-line"
                  />
                  <span className="text-[15px] leading-5">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Both values are real, from the registry. */}
          <dl className="mt-8 space-y-1 text-[13px] text-ink-subtle">
            <div className="flex gap-2">
              <dt>Last reviewed:</dt>
              <dd>
                <time dateTime={tool.updatedAt}>{tool.updatedAt}</time>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt>Maintained by:</dt>
              <dd>{tool.owner}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  )
}
