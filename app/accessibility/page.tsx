import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'

const TITLE = 'Accessibility'
const DESCRIPTION =
  'What Scult Tools does for keyboard, screen-reader and low-vision users, the one audit we have not done yet, and how to report an accessibility issue.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/accessibility' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/accessibility'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const CONTACT_EMAIL = 'connect@scult.in'

/**
 * Every claim on this page has to be true of the actual codebase, not the
 * intent behind it — an accessibility statement that overstates itself is
 * worse than no statement at all. Each bullet in "What is implemented" below
 * maps to a specific, checkable thing: `:focus-visible` in globals.css,
 * `.skip-link` in app/layout.tsx, `htmlFor` on tool inputs, `aria-live` on
 * ResultPanel. None of it is described as an audit or a certification,
 * because no third party has reviewed it yet — see the section below that
 * says so plainly.
 */
export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Accessibility', path: '/accessibility' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Accessibility</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Built to work without a mouse, a screen, or perfect vision
        </h1>
        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          We build every page and every tool against WCAG 2.2 Level AA. The footer badge
          reading "WCAG 2.2 AA contrast verified" is a specific claim, not a slogan: every
          text and UI colour pairing on the site has been checked against that ratio.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            What is implemented
          </h2>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <strong className="text-ink">Full keyboard operability.</strong> Every
              interactive element — links, buttons, form fields, tool controls — can be
              reached and used with a keyboard alone.
            </li>
            <li>
              <strong className="text-ink">A visible focus ring, always.</strong> Every
              focused element gets a two-tone outline (a coloured ring plus a white
              inset), because a single colour cannot clear a 3:1 contrast ratio against
              every background this site uses. It does not disappear on dark surfaces.
            </li>
            <li>
              <strong className="text-ink">A skip-to-content link.</strong> The first tab
              stop on every page jumps straight past the header to the main content, for
              anyone who does not want to tab through navigation on every single page
              load.
            </li>
            <li>
              <strong className="text-ink">Real form labels.</strong> Every input on every
              tool has a semantic <code>label</code> tied to it with <code>htmlFor</code>,
              not a placeholder standing in for one. Placeholders disappear the moment you
              start typing; labels do not.
            </li>
            <li>
              <strong className="text-ink">Live-region announcements.</strong> When a tool
              finishes computing a result, that result sits in a region marked{' '}
              <code>aria-live="polite"</code>, so a screen-reader user is told the answer
              is ready without needing to go looking for it.
            </li>
            <li>
              <strong className="text-ink">Colour is never the only signal.</strong> Pass
              and fail states, valid and invalid fields, "sent" and "not sent" — every one
              of these pairs its colour with an actual word. Colour blindness should never
              cost you the meaning.
            </li>
            <li>
              <strong className="text-ink">Dark mode does not degrade contrast.</strong>{' '}
              Switching themes keeps the same contrast ratios rather than trading them
              away for a darker palette. A pairing that clears AA in light mode clears it
              in dark mode too.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            What we have not done yet
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            This has not been audited by a third-party accessibility specialist.
            Everything above is true of the code as we understand it, but we have not paid
            an outside expert to try to break it, and we are not claiming a certification
            we do not have. If you use assistive technology and something on this site
            does not work the way it should, that is exactly the kind of gap self-testing
            misses — and we would rather know about it than not.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Accessibility as a legal requirement
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            WCAG is also the standard referenced by accessibility law in a growing number of
            places — the EU's European Accessibility Act and the ADA in the United States
            among them. How that fits alongside this site's other data-protection
            commitments is on the{' '}
            <Link
              href="/compliance"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              compliance page
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Report an accessibility issue
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Email{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              {CONTACT_EMAIL}
            </a>{' '}
            with the page, the tool, and what happened — which screen reader or browser
            you were using helps too, but is not required. We read every one of these and
            fix what we can verify.
          </p>
        </section>
      </article>
    </>
  )
}
