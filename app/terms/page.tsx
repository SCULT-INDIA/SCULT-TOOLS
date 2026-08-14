import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, parentLink, SITE } from '@/lib/site'

const TITLE = 'Terms of Service'
const DESCRIPTION =
  'The terms for using Scult Tools: no accounts, you own what you generate, tools are provided as-is, and calculators are aids — not legal, tax or financial advice.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/terms' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/terms'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

/**
 * The standing terms for the whole tools hub.
 *
 * There is no account flow to gate behind a "you agreed" checkbox, so these
 * terms take effect the moment the site is used rather than the moment
 * something is signed — that is stated explicitly rather than implied.
 */
export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Terms', path: '/terms' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Terms</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          The rules for using these tools, in plain English
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          There is no contract to sign here — using {SITE.name} means you accept the terms
          below. They are short on purpose: this is a free hub of utilities, not a service
          with a legal team behind every clause.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            No accounts, no signing
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            You do not create an account to use any tool here, so there is no separate
            agreement to click through. Loading a page and using a tool is what "accepting
            these terms" means in practice.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            You own what you generate
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            An invoice you build, a QR code you download, a colour palette or favicon set
            you export — that output is yours. The tools are aids that assemble it; we do
            not claim any ownership over what you produce with them, and you do not need
            our permission to use it commercially.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Provided as-is, no warranty
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every tool is offered as-is, without a warranty of any kind. Calculators and
            generators are aids, not professional advice — the GST/VAT figures produced by
            the{' '}
            <Link
              href="/business/invoice-generator"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              Invoice Generator
            </Link>{' '}
            and the projections from the{' '}
            <Link
              href="/seo/marketing-roi-calculator"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              Marketing ROI Calculator
            </Link>{' '}
            are no substitute for a qualified accountant, tax adviser or financial
            professional. Verify any figure that matters before you rely on it. Each tool
            also states its own specific limitations on its own page — that notice
            supplements this one, it does not replace it.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Tools can change or be retired
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            This is a free hub, not a paid service with an uptime guarantee. We may change
            how a tool works, adjust its limits, or retire it entirely. There is no
            service level agreement behind any of this.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Acceptable use</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Most tools run entirely in your browser, so there is little to abuse. The two
            that call our server —{' '}
            <Link
              href="/seo/website-speed-test"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              Website Speed Test
            </Link>{' '}
            and{' '}
            <Link
              href="/geo/ai-visibility-checker"
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              AI Visibility Checker
            </Link>{' '}
            — are for checking individual sites by hand. Don't script them, hit them at
            high volume, or otherwise automate requests against them. We can block traffic
            that does this.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Intellectual property
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            {SITE.parentName} owns this site, its code and its brand. What you type into a
            tool, and what that tool produces for you, stays yours — see "You own what you
            generate" above.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Governing law</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            These terms are governed by the laws of India. {SITE.parentName} is based in
            Noida, in the Delhi NCR region, and that is where any dispute would be
            handled.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Changes to these terms
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            When we change these terms, the change takes effect from the date it is made —
            it is never applied retroactively to something you have already generated
            using an earlier version of a tool.
          </p>
        </section>

        <p className="mt-12 text-[15px] text-ink-subtle leading-7">
          Anything not covered here falls back to the general terms on{' '}
          {/* Plain link on this closing paragraph's ambient page background —
              same fix as the standalone links in the sections above. */}
          <a
            href={parentLink('/', 'terms')}
            className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            scult.in
          </a>
          .
        </p>
      </article>
    </>
  )
}
