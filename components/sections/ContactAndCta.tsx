import { MessageCircle, Phone } from 'lucide-react'
import { parentLink } from '@/lib/site'

/**
 * Reference: band 14 — a two-column contact block. There is no functioning
 * inbox behind a form yet, so every CTA goes to the parent site's real
 * "Book a meeting" section, routed through `parentLink` so UTM attribution
 * survives (a mailto: can't carry the query params the CRM reads).
 *
 * Styled as a peach neo-brutal panel (fixed pastel → literal black text)
 * with the two secondary actions as white sticker cards — the same
 * vocabulary as every other panel on the page.
 *
 * The dual closing CTA cards that follow this block live in
 * `components/layout/Footer.tsx` (LOCKED), on every page.
 */
export function ContactAndCta() {
  const sideActions = [
    {
      icon: MessageCircle,
      title: 'Found a bug in a calculation?',
      label: 'Report it',
      href: parentLink('/#book-meeting', 'report-bug'),
      tilt: 'rotate-1',
    },
    {
      icon: Phone,
      title: 'Want to talk to the team?',
      label: 'Reach Scult',
      href: parentLink('/#book-meeting', 'talk-to-team'),
      tilt: '-rotate-1',
    },
  ] as const

  return (
    <section aria-labelledby="request-tool" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-peach p-7 shadow-brutal md:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-violet-700">Missing something?</p>
            <h2
              id="request-tool"
              className="mt-3 max-w-[16ch] text-[30px] text-black leading-[1.15] tracking-[-1px] md:text-[38px]"
            >
              Need a tool we don't have?
            </h2>
            <p className="mt-4 max-w-[46ch] text-[16px] text-black/70 leading-7">
              Tell us what you're trying to do. We read every request, and it is how this
              catalogue grows — deliberately, not by inflating a number.
            </p>
            <a
              className="btn-brutal mt-7 border-black text-black hover:border-ink hover:text-ink"
              href={parentLink('/#book-meeting', 'request-a-tool')}
            >
              REQUEST A TOOL
            </a>
          </div>

          <div className="grid gap-4">
            {sideActions.map((action) => (
              <div
                key={action.title}
                className={`flex items-center gap-4 rounded-lg border border-ink bg-white p-5 shadow-brutal-sm transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${action.tilt}`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-[10px] border border-ink/15 bg-tile-yellow">
                  <action.icon className="size-5 text-violet-700" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-semibold text-[17px] text-black tracking-normal">
                    {action.title}
                  </p>
                  <a
                    href={action.href}
                    className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-[15px] text-black underline decoration-2 decoration-cta underline-offset-4 hover:text-violet-700"
                  >
                    {action.label}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
