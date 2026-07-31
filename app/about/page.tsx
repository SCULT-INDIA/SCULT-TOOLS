import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { parentLink, SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'

export const metadata: Metadata = {
  title: 'About these tools',
  description:
    'Who builds Scult Tools and why they are free. Built by Scult, an AI-first digital agency in Noida, Delhi NCR — these are the utilities our own delivery team uses.',
  alternates: { canonical: '/about' },
}

/**
 * The named-author page that the tool pages' bylines point at.
 *
 * This exists for a reason beyond courtesy: E-E-A-T signals need a real,
 * attributable author, and a byline that links nowhere is worse than none.
 */
export default function AboutPage() {
  const clientSide = TOOLS.filter((t) => t.runsInBrowser).length

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Who builds these, and why they are free
        </h1>

        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          {SITE.name} is built and maintained by{' '}
          <a
            href={parentLink('/', 'about')}
            className="text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            {SITE.parentName}
          </a>
          , an AI-first digital agency based in Noida, Delhi NCR. We build websites, apps,
          custom software and AI agents for a living.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            These are our own tools
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every tool here started as something we needed on a client project — an
            invoice that had to reconcile to the paisa, schema markup that had to validate
            on the first try, a favicon set that did not need anyone's upload server. We
            built them properly, so we published them.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            That is also why they behave the way they do. There is no signup because we
            never wanted one. {clientSide} of {TOOLS.length} run entirely in your browser
            because uploading a file to process it was always the slower option. And every
            calculator shows its formula because we wanted to be able to check the numbers
            ourselves.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            The business model, stated plainly
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Most of these tools cost us nothing to run, so there is nothing to recover. We
            publish them because when you eventually need a team rather than a tool, we
            would like you to already know who we are. That is the whole arrangement — no
            trial that expires, no feature held back, no email wall in front of a result.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Corrections welcome
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every tool states its limitations on its own page, because a tool that
            pretends to be more certain than it is will eventually mislead someone. If you
            find a calculation we have got wrong, we would genuinely rather hear it — the
            contact details are on{' '}
            <a
              href={parentLink('/contact', 'about-corrections')}
              className="text-violet-700 underline decoration-1 underline-offset-4"
            >
              scult.in
            </a>
            .
          </p>
        </section>

        <p className="mt-10">
          <Link href="/all" className="btn-brutal">
            BROWSE ALL {TOOLS.length} TOOLS
          </Link>
        </p>
      </article>
    </>
  )
}
