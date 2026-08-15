import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FeedbackButton } from '@/components/tools/FeedbackButton'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { formatUpdatedDate } from '@/lib/site'
import { getCategory } from '@/lib/tools/categories'
import type { Tool } from '@/lib/tools/types'

/**
 * The tool page anatomy — THE TOOL IS THE PAGE. Breadcrumb + a centred H1/
 * tagline for orientation and SEO, then the tool, then nothing — no
 * how-to-use, how-it-works, limitations, FAQ, or related-tools prose inline
 * on this page. That content previously lived below the tool; removed at
 * the user's explicit request so every tool page is just its heading and
 * the tool itself (the site header and footer remain, from
 * `app/layout.tsx`). It now lives one click away instead of nowhere — see
 * the "How it works" link below the tagline, pointing at
 * `/[category]/[slug]/how-it-works` (components/tools/HowItWorksShell.tsx).
 *
 * No page-level brand mark here (removed at the user's explicit request,
 * along with the 3-column logo/title/spacer grid that existed only to keep
 * the title truly centred beside it) — the header/footer already carry the
 * Scult identity on every route.
 */
export function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const category = getCategory(tool.category)

  return (
    <article className="container-site pt-5 pb-16">
      <div className="mx-auto max-w-[60rem] text-center">
        {/* 1. Breadcrumb — kept for orientation and its BreadcrumbList
               JSON-LD. */}
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

        {/* 2. Header — the target keyword, big and bold, then one line of
               what it does. The "Nothing is uploaded"/"Free · No signup"
               badge row that used to sit here was removed at the user's
               request — it duplicated claims tool components already
               make themselves (e.g. StatusBar's privacyNote) and read as
               clutter. */}
        <header className="mt-1">
          {/* The tool's own mark sits INSIDE the H1's first line box, not
              above it. Two failed shapes preceded this one, both measured
              rather than eyeballed:
                - an 88px tile stacked over the title pushed the workspace
                  ~100px further down — the exact anti-pattern this
                  shell's docblock exists to prevent;
                - a flex row (icon + title as separate flex items) looked
                  right in theory, but a flex item's break-point is its
                  MAX-content width, so the long unwrapped title never
                  "fit" beside the icon and flex-wrap dropped the icon
                  onto its own row above the text — the stacked layout
                  again, just 40px tall instead of 88.
              `inline-block` puts the image in the text flow itself: it
              occupies the start of line one and the title wraps around
              normally. The icon is sized under every breakpoint's line
              box (32px inside the ~37px mobile line, 44px inside the
              ~52-58px md/lg line), so the H1's height is exactly what it
              was with no icon at all.

              The image is the white-disc composite from
              scripts/make-tool-favicons.mjs — identical to this route's
              browser-tab favicon, so tab and page agree on what
              represents this tool. The disc is baked in, so no tile is
              needed; the faint ring only makes the disc's edge read
              against the page's own white. */}
          <h1 className="font-bold text-[34px] leading-[1.08] tracking-[-1px] md:text-[48px] lg:text-[54px]">
            <Image
              src={`/tool-icons/${tool.slug}.png`}
              alt=""
              aria-hidden="true"
              width={44}
              height={44}
              priority
              className="tool-h1-icon mr-2.5 inline-block size-8 rounded-full align-[-0.12em] ring-1 ring-line md:mr-3 md:size-11"
            />
            {tool.h1}
          </h1>
          <p className="mx-auto mt-3 max-w-[58ch] text-[16px] text-ink-muted leading-6 md:text-[18px] md:leading-7">
            {tool.tagline}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${tool.category}/${tool.slug}/how-it-works`}
              className="inline-flex items-center gap-1 font-medium text-[14px] text-violet-700 hover:underline"
            >
              How it works
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            {/* Makes /faq's "each tool carries a real last-reviewed date on
                its own page" claim true — see lib/site.ts's formatUpdatedDate
                docblock. */}
            <span className="text-[13px] text-ink-subtle">
              &middot; Last updated {formatUpdatedDate(tool.updatedAt)}
            </span>
          </div>
        </header>
      </div>

      {/* Fixed corners: Bookmark keeps top-right, the one FloatingActions'
          WhatsApp/Scult pair (bottom-left/bottom-right) doesn't claim.
          Feedback takes the last open corner, top-left — independent of
          DOM position since both are fixed, placed here rather than inside
          the centred header div above so neither inherits that div's
          text-align/flex context by accident. */}
      <BookmarkButton />
      <FeedbackButton toolSlug={tool.slug} toolTitle={tool.h1} />

      {/* 3. THE TOOL — the page's centre of gravity, immediately after the
             header. Measured at 1366x768: the workspace now starts ~350px down
             (was ~449px) and fills ~55-60% of the first viewport. The user's
             70% target is not literally reachable there without shrinking the
             sticky site header or the headline they asked to be big — the two
             things consuming the rest — so this is the honest maximum, and the
             tool remains the overwhelming majority of the page's interactive
             area. */}
      <div className="mt-5">{children}</div>
    </article>
  )
}
