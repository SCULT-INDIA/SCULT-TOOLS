import { MessageCircle, Phone } from 'lucide-react'
import { parentLink } from '@/lib/site'

/**
 * Reference: band 14 — a two-column contact block (a form on the left,
 * "Prefer live chat? / Want to talk with our team?" links on the right).
 *
 * There is no functioning inbox behind this form yet, so rather than ship a
 * form that silently goes nowhere, every CTA here goes to the parent site's
 * real "Book a meeting" section (`/#book-meeting` — verified to exist in the
 * live DOM; `/contact`, which these previously pointed at, does not exist on
 * scult.in and 404s). Routed through `parentLink` rather than a plain mailto
 * so the UTM tags survive — a mailto: link can't carry query params the CRM
 * reads, which would silently break the attribution `parentLink`'s own
 * docblock says is the only thing deciding this subdomain's funding.
 *
 * The dual closing CTA cards that used to follow this block now live in
 * `components/layout/Footer.tsx`, so they appear on every page rather than only
 * on the homepage.
 */
export function ContactAndCta() {
  return (
    <section aria-labelledby="request-tool" className="container-site py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Missing something?</p>
          <h2
            id="request-tool"
            className="mt-3 max-w-[16ch] text-[30px] leading-[1.15] tracking-[-1px] md:text-[38px]"
          >
            Need a tool we don't have?
          </h2>
          <p className="mt-4 max-w-[46ch] text-[16px] text-ink-muted leading-7">
            Tell us what you're trying to do. We read every request, and it is how this
            catalogue grows — deliberately, not by inflating a number.
          </p>
          <a
            className="btn-brutal mt-7"
            href={parentLink('/#book-meeting', 'request-a-tool')}
          >
            REQUEST A TOOL
          </a>
        </div>

        <div className="flex flex-col justify-center gap-6 border-line lg:border-l lg:pl-10">
          <div>
            <p className="font-display font-semibold text-[18px] tracking-normal">
              Found a bug in a calculation?
            </p>
            {/* Rest state is text-ink, not text-violet-700: violet-700 on
                dark-mode `bg-offwhite` measures ~2.38:1, an AA failure, and
                globals.css's dark-mode fix for the `hover:text-violet-600`
                utility only repairs the HOVER state, never a resting
                violet-700. text-ink is the same rest/hover split already used
                for every other nav-style link in this codebase (Header,
                ToolShell, CategoryPlans, ...) and needs no new fix — it is
                already theme-safe. */}
            <a
              href={parentLink('/#book-meeting', 'report-bug')}
              className="mt-1 inline-flex items-center gap-2 text-[15px] text-ink hover:text-violet-600"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Report it
            </a>
          </div>
          <div className="border-line border-t pt-6">
            <p className="font-display font-semibold text-[18px] tracking-normal">
              Want to talk to the team?
            </p>
            {/* Same rest/hover fix as "Report it" above — see that comment. */}
            <a
              href={parentLink('/#book-meeting', 'talk-to-team')}
              className="mt-1 inline-flex items-center gap-2 text-[15px] text-ink hover:text-violet-600"
            >
              <Phone className="size-4" aria-hidden="true" />
              Reach Scult
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
