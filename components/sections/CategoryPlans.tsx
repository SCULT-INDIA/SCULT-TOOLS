import Link from 'next/link'
import { ScultServiceTiers } from '@/components/sections/ScultServiceTiers'
import { parentLink } from '@/lib/site'

/**
 * The real next step once a visitor has outgrown what a free tool can do —
 * an actual website, app, or AI agent built by Scult's own team. The
 * free-tools-by-category grid this section used to open with was cut: the
 * homepage already spends several other sections making "every tool is
 * free" the point, and repeating a full catalogue grid here just before the
 * paid pricing diluted the one thing THIS section needs to say clearly.
 */
export function CategoryPlans() {
  return (
    <section aria-labelledby="pricing-heading" className="container-site py-16">
      <div className="mx-auto max-w-[46rem] text-center">
        {/* A badge, not a button-alike: the old span borrowed .btn-brutal,
            which promises clickability it never had. */}
        <span className="inline-flex items-center gap-2 rounded-pill border border-ink bg-cta px-4 py-1.5 font-bold text-[12px] text-black uppercase tracking-[0.12em]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-black" />
          Scult project pricing
        </span>
        <h2
          id="pricing-heading"
          className="mt-5 text-[36px] font-bold leading-[1.05] tracking-[-1px] md:text-[48px]"
        >
          Need more than a tool?
        </h2>
        <p className="mx-auto mt-5 max-w-[60ch] text-[18px] text-ink-muted leading-8 md:text-[20px]">
          When a free tool isn't enough — a real website, a mobile app, custom software,
          or an AI agent built specifically for your business — that's{' '}
          <a
            href={parentLink('/', 'pricing-section')}
            className="font-medium text-violet-700 underline decoration-1 underline-offset-4"
          >
            Scult's
          </a>{' '}
          day job, not this site's.
        </p>
        <p className="mx-auto mt-4 max-w-[60ch] text-[17px] text-ink-muted leading-8 md:text-[18px]">
          Every project starts with a free discovery call, so the scope and price are
          agreed before anything is billed — never by the hour. It ends with you owning
          every file and every line of code outright, not renting access to it. No
          subscription, no retainer quietly bundled into the fine print: just real project
          pricing, quoted honestly, the same figures published on scult.in.
        </p>
      </div>

      <div className="mt-10">
        <ScultServiceTiers showUniversalBenefits={false} />
      </div>

      <p className="mt-6 text-center text-[13px] text-ink-subtle">
        All prices are one-time project investments, quoted directly from{' '}
        <a
          href={parentLink('/#pricing', 'pricing-section-footnote')}
          className="underline decoration-1 underline-offset-4 hover:text-ink"
        >
          scult.in/#pricing
        </a>
        . See the full{' '}
        <Link
          href="/pricing"
          className="underline decoration-1 underline-offset-4 hover:text-ink"
        >
          plan comparison and FAQ
        </Link>
        , or need a custom scope?{' '}
        <a
          href={parentLink('/#book-meeting', 'pricing-custom-scope')}
          className="text-violet-700 underline decoration-1 underline-offset-4"
        >
          Book a free consultation
        </a>
        .
      </p>
    </section>
  )
}
