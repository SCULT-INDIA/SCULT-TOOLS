import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { SITE } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

export const metadata: Metadata = {
  title: 'Privacy — which tools touch the network, and which do not',
  description:
    'A plain-English table of exactly which Scult Tools send data over the network and which run entirely in your browser. No accounts, no file uploads, no dark patterns.',
  alternates: { canonical: '/privacy' },
}

/**
 * Privacy matters more than usual on this site, so it gets a real page rather
 * than boilerplate.
 *
 * The table is generated from the registry's `runtime` field, which means it
 * cannot drift from reality: if a tool's runtime changes, this page changes with
 * it. That is the difference between a privacy claim and a privacy policy.
 */
export default function PrivacyPage() {
  const clientSide = TOOLS.filter((t) => t.runtime === 'client')
  const networked = TOOLS.filter((t) => t.runtime !== 'client')

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          What happens to your data
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          Short version: {clientSide.length} of our {TOOLS.length} tools never send
          anything anywhere. Your files, text and numbers are processed inside your own
          browser tab and are gone when you close it.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Tools that run entirely in your browser
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            These use your browser's own capabilities — Canvas for images, native parsers
            for text. There is no upload step, which is both faster and more private. You
            can verify this yourself: open your browser's network panel and watch it stay
            empty while you work.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[15px]">
              <caption className="sr-only">
                Tools that process data entirely on your device
              </caption>
              <thead>
                <tr className="border-ink border-b">
                  <th scope="col" className="py-2.5 pr-4 font-bold">
                    Tool
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-bold">
                    Category
                  </th>
                  <th scope="col" className="py-2.5 font-bold">
                    Data leaves your device?
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientSide.map((tool) => (
                  <tr key={tool.slug} className="border-line border-b">
                    <td className="py-2.5 pr-4">
                      {/* Plain link on the table's ambient page background,
                          not a tile/violet-50/100 fill — text-violet-700
                          alone measures well under AA in dark mode.
                          --color-violet-accent-text is this codebase's
                          existing dark-mode-only token for standalone accent
                          text (see .eyebrow / nav-link hover); the fallback
                          keeps light mode's violet-700 unchanged.
                          hover:text-violet-600 already has its own dark-mode
                          override in globals.css. */}
                      <Link
                        href={`/${tool.category}/${tool.slug}`}
                        className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                      >
                        {tool.title}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 text-ink-subtle">
                      {CATEGORIES.find((c) => c.slug === tool.category)?.name}
                    </td>
                    <td className="py-2.5 font-medium">No</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Tools that use the network
          </h2>
          {networked.length === 0 ? (
            <p className="mt-3 text-[16px] text-ink-muted leading-7">
              Right now, none. Every tool on the site processes your data locally. When we
              add tools that need a server — a live site audit, for example — they will be
              listed here with what they send and why, before they ship.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {networked.map((tool) => (
                <li key={tool.slug} className="card-flat p-4">
                  {/* Sits on .card-flat's ambient cream, not a
                      tile/violet-50/100 fill — .card-flat's own dark-mode fix
                      only re-themes the surface, not this accent text, which
                      measures well under AA in dark mode.
                      --color-violet-accent-text is this codebase's existing
                      dark-mode-only token for standalone accent text (see
                      .eyebrow / nav-link hover); the fallback keeps light
                      mode's violet-700 unchanged. */}
                  <Link
                    href={`/${tool.category}/${tool.slug}`}
                    className="font-medium text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4"
                  >
                    {tool.title}
                  </Link>
                  <p className="mt-1 text-[15px] text-ink-muted">
                    {tool.runtime === 'external-api'
                      ? 'Sends only the URL you enter to a measurement API (Google PageSpeed Insights). Your own files and text are never involved.'
                      : 'Our server fetches the public URL you enter — robots.txt, llms.txt and the homepage — and nothing else.'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            The prompt library
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Prompt pages are static content with a copy button. Anything you type into a
            prompt's customize fields stays on the page and is never sent to us, and
            copying uses your browser's own clipboard — the library needs no data from you
            at all.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            What we do collect
          </h2>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <strong className="text-ink">Analytics.</strong> We use Google Analytics 4
              to count page views and understand which tools people find useful. It loads
              after the page is interactive, so it never slows anything down.
            </li>
            <li>
              <strong className="text-ink">Local preferences.</strong> A dismissed
              announcement bar is remembered in your browser's own localStorage. That
              never leaves your device and we cannot read it.
            </li>
            <li>
              <strong className="text-ink">No accounts.</strong> There is nothing to sign
              up for, so we hold no passwords and no profiles.
            </li>
            <li>
              <strong className="text-ink">No result gating.</strong> We never require an
              email address to show you an answer. If we offer to email you a result, the
              result is already on screen first.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            A note on the favicon generator
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Images you turn into favicons are re-encoded through a canvas in your own tab,
            which discards their metadata — including EXIF GPS coordinates. The icons come
            out without the location data the source photo went in with.
          </p>
        </section>

        <p className="mt-12 text-[15px] text-ink-subtle leading-7">
          Questions about any of this? {SITE.parentName} is a real company in Noida, Delhi
          NCR — the contact details are on{' '}
          {/* Plain link on this closing paragraph's ambient page background —
              same fix as the table links above. */}
          <a
            href={SITE.parentUrl}
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4"
          >
            scult.in
          </a>
          .
        </p>
      </article>
    </>
  )
}
