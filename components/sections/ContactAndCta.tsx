import { MessageCircle, Phone } from 'lucide-react'
import { parentLink } from '@/lib/site'

/**
 * Reference: band 14 — a two-column contact block (a form on the left,
 * "Prefer live chat? / Want to talk with our team?" links on the right).
 *
 * There is no functioning inbox behind this form yet, so rather than ship a
 * form that silently goes nowhere, every CTA here goes to the parent site's
 * real "Book a meeting" section (`/#book-meeting` — verified to exist in the
 * live DOM). Routed through `parentLink` rather than a plain mailto so the
 * UTM tags survive — a mailto: link can't carry query params the CRM reads.
 *
 * 2026 redesign: the right column's lone border-left divider becomes two
 * card-flat tiles — the same secondary-action idiom the privacy bento just
 * above this section established — so the whole row reads as one composed
 * band rather than copy with an orphaned rule beside it.
 *
 * The dual closing CTA cards that used to follow this block live in
 * `components/layout/Footer.tsx`, so they appear on every page.
 */
export function ContactAndCta() {
  const sideActions = [
    {
      icon: MessageCircle,
      title: 'Found a bug in a calculation?',
      label: 'Report it',
      href: parentLink('/#book-meeting', 'report-bug'),
    },
    {
      icon: Phone,
      title: 'Want to talk to the team?',
      label: 'Reach Scult',
      href: parentLink('/#book-meeting', 'talk-to-team'),
    },
  ]

  return (
    <section aria-labelledby="request-tool" className="container-site py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
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

        <div className="grid gap-4">
          {sideActions.map((action) => (
            <div
              key={action.title}
              className="card-flat flex items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-violet-500/10">
                <action.icon
                  className="size-5 text-[var(--color-violet-accent-text,var(--color-violet-700))]"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="font-display font-semibold text-[17px] tracking-normal">
                  {action.title}
                </p>
                {/* Rest state is text-ink, not text-violet-700: the
                    rest-ink/hover-violet-600 split is the one link pattern
                    already proven theme-safe across the site (Header,
                    ToolShell, CategoryPlans, …). */}
                <a
                  href={action.href}
                  className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-[15px] text-ink underline decoration-1 underline-offset-4 hover:text-violet-600"
                >
                  {action.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
