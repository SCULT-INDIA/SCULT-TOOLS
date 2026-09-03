import type { Metadata } from 'next'
import Image from 'next/image'
import { PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, parentLink, SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'
import scultLogoBlue from '@/public/brand/scult-tools-blue.png'
import scultLogoWhite from '@/public/brand/scult-tools-white.png'

const TITLE = 'Brand & Press Kit'
const DESCRIPTION =
  'Logos, boilerplate copy and company facts for Scult Tools, for press and partners who want to cite or link to the site correctly.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/brand' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/brand'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

/** The same social links as the footer, kept as plain text/URL pairs here —
 * this page has no need for the footer's icon-disc treatment, just a
 * checkable list of where the company actually has a presence. */
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/scult-india/' },
  { label: 'Instagram', href: 'https://www.instagram.com/scult.in/' },
  { label: 'X', href: 'https://x.com/scult_india' },
]

const CONTACT_EMAIL = 'connect@scult.in'

/**
 * Brand & Press Kit — the page journalists, partners and directory
 * maintainers land on when they want to cite this site correctly instead of
 * guessing at a description or scraping a logo out of a screenshot.
 *
 * The boilerplate paragraph interpolates TOOLS.length and PROMPTS.length
 * rather than stating them, so it can never drift out of sync with the
 * catalogue as tools and prompts are added.
 */
export default function BrandPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Brand', path: '/brand' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Brand</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Brand &amp; press kit
        </h1>
        <p className="mt-5 text-[18px] text-ink-muted leading-8 md:text-lead">
          Logos, a citation-ready boilerplate and the company facts a journalist, partner
          or directory would need to describe {SITE.name} correctly.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Boilerplate</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Use this paragraph verbatim for press mentions, directory listings or any
            citation that needs a short, accurate description.
          </p>
          <blockquote className="card-flat mt-4 border-l-4 border-l-violet-500 p-6 text-[16px] text-ink-body leading-7">
            {SITE.name} is a free hub of {TOOLS.length} browser-based tools for SEO,
            business, developer, productivity, design and AI-visibility work, plus a
            library of {PROMPTS.length} free AI prompts, built and maintained by{' '}
            {SITE.parentName}, an AI-first digital agency based in Noida, Delhi NCR.
          </blockquote>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Logo</h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Two versions of the wordmark: the blue mark for light backgrounds, and the
            white mark for dark backgrounds.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="card-flat p-8">
              <Image
                src={scultLogoBlue}
                alt="Scult Tools logo, blue"
                width={71}
                height={40}
                className="h-10 w-auto"
              />
              <p className="mt-4 text-[14px] text-ink-subtle">On light backgrounds</p>
            </div>
            <div className="rounded-lg bg-violet-900 p-8">
              <Image
                src={scultLogoWhite}
                alt="Scult Tools logo, white"
                width={71}
                height={40}
                className="h-10 w-auto"
              />
              <p className="mt-4 text-[14px] text-white/70">On dark backgrounds</p>
            </div>
          </div>

          <p className="mt-6 text-[16px] text-ink-muted leading-7">
            Usage notes: do not distort, recolor or crop the mark. Keep clear space around
            it roughly equal to the height of the wordmark itself. Use the blue version on
            light surfaces and the white version on dark surfaces — do not place either
            version on a background it was not designed for.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">Company facts</h2>
          <dl className="mt-4 space-y-3 text-[16px] leading-7">
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-ink">Name</dt>
              <dd className="text-ink-muted">{SITE.name}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-ink">Parent company</dt>
              <dd className="text-ink-muted">
                {SITE.parentName} (
                {/* Plain link on this dl's ambient page background, not a
                    tile/violet-50/100 fill — text-violet-700 alone measures
                    well under AA in dark mode. --color-violet-accent-text is
                    this codebase's existing dark-mode-only token for
                    standalone accent text; the fallback keeps light mode's
                    violet-700 unchanged. */}
                <a
                  href={parentLink('/', 'brand')}
                  className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                >
                  scult.in
                </a>
                )
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-ink">Address</dt>
              <dd className="text-ink-muted">{SITE.addressLine}, India</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-ink">Phone</dt>
              <dd className="text-ink-muted">
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                >
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-ink">Tools published</dt>
              <dd className="text-ink-muted">{TOOLS.length}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-ink">Prompts published</dt>
              <dd className="text-ink-muted">{PROMPTS.length}</dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <dt className="font-medium text-ink">Social</dt>
              <dd className="text-ink-muted">
                {SOCIALS.map((social, i) => (
                  <span key={social.label}>
                    {i > 0 ? ', ' : ''}
                    <a
                      href={social.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
                    >
                      {social.label}
                    </a>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Media inquiries
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            For anything not covered here — interviews, data requests, or a fact you want
            confirmed before publishing — write to{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </>
  )
}
