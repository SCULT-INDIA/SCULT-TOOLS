import { Search } from 'lucide-react'
import Link from 'next/link'
import { PROMPTS } from '@/lib/prompts/registry'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Reference: band 6 — an ice-blue split section: "Send Any Task Request to
 * your Team" copy + link on the left, a dashboard screenshot on the right.
 *
 * The dashboard screenshot is replaced with a browser-chrome-framed mock of the
 * site's own search — a real product surface, not a stock image, but rendered
 * as a static mock rather than a second live widget: the page's one working
 * search box (and its Ctrl+K binding) lives in the hero, and mounting a second
 * live instance here would fight it for that shortcut.
 */
export function SearchSpotlight() {
  return (
    <section aria-labelledby="search-spotlight" className="bg-ice py-16">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2
            id="search-spotlight"
            className="max-w-[14ch] text-[32px] leading-[1.15] tracking-[-1px] md:text-[42px]"
          >
            Find any tool or prompt in seconds
          </h2>
          <p className="mt-4 max-w-[46ch] text-[16px] text-ink-muted leading-7">
            Search by name or by what you're trying to do — "compress", "invoice",
            "schema" all work, and prompts show up alongside the tools. Results appear
            before you finish typing.
          </p>
          {/* text-ink-muted, not text-violet-700: violet-700 is unchanged
              across themes and measures ~2.14:1 on dark-mode `bg-ice`
              (#1c123a), an AA failure for 15px text. ink-muted is the
              token-backed swap already used one line up, so this line keeps
              reading as secondary copy in both themes. */}
          <p className="mt-3 text-[15px] text-ink-muted">
            Every tool is reachable in two clicks from any page on the site.
          </p>
        </div>

        {/* Browser-chrome frame around a real, working SearchBox — not a static
            screenshot. */}
        <div className="overflow-hidden rounded-panel border border-line bg-cream shadow-card-raised">
          <div className="flex items-center gap-1.5 border-line border-b bg-offwhite px-4 py-3">
            <span className="size-2.5 rounded-full bg-line-grey" />
            <span className="size-2.5 rounded-full bg-line-grey" />
            <span className="size-2.5 rounded-full bg-line-grey" />
            <span className="ml-3 flex items-center gap-1.5 rounded-sm bg-cream px-3 py-1 text-[12px] text-ink-subtle">
              <Search className="size-3" aria-hidden="true" />
              tools.scult.in
            </span>
          </div>
          <div className="p-8">
            <Link
              href="/all#top"
              className="field flex items-center gap-3 rounded-pill py-3.5 pl-5 text-[17px] text-ink-subtle no-underline"
            >
              <Search className="size-5 shrink-0" aria-hidden="true" />
              {/* Mirrors the real SearchBox's large placeholder ("Search N
                  free tools & N prompts…") — this mock claiming a
                  tools-only search while the live widget beside it in the
                  header searches both would be a visible contradiction. */}
              Search {TOOLS.length} free tools & {PROMPTS.length} prompts…
            </Link>
            <p className="hint mt-3">
              The real search box lives at the top of every page — press{' '}
              <kbd className="rounded border border-line-grey bg-cream px-1.5 py-0.5 font-sans text-[12px]">
                Ctrl K
              </kbd>{' '}
              anywhere to open it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
