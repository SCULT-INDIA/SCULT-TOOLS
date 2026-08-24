import { Check } from 'lucide-react'
import Image from 'next/image'
import { PROMPTS } from '@/lib/prompts/registry'
import { APPROVED_TOOL_COUNT, TOOLS } from '@/lib/tools/registry'

/**
 * Reference: the "Every feature you need." band — a narrow tinted card listing
 * what one subscription gets you, beside a wide violet card of ticked benefits
 * in three columns.
 *
 * Same anatomy, our content. The left card is driven off the registry rather than
 * a hand-kept list, so it cannot drift from the tools that actually exist; the
 * right card is the cross-cutting engineering guarantees, not invented plan perks.
 * Every line below is either checkable in the repo or a plain statement of how the
 * site works.
 */

/**
 * Registry titles carry search qualifiers — a parenthetical ("QR Code Generator
 * (with UPI)") or a dashed suffix ("Word Counter — Words, Characters & Reading
 * Time"). Both are right on a tool page and far too long for a 340px column: left
 * unstripped they wrapped to two and three lines and pushed this card hundreds of
 * pixels taller than the one beside it.
 *
 * Stripped here rather than adding a second name field to all fifteen meta files.
 * The en/em dash split is intentional and the ampersand is left alone — "JSON
 * Formatter & Validator" is one name, not a name plus a tagline.
 */
function shortName(title: string): string {
  return title
    .replace(/\s*\(.*?\)\s*$/, '')
    .replace(/\s*[—–]\s.*$/, '')
    .trim()
}

const GUARANTEES: readonly string[] = [
  `${APPROVED_TOOL_COUNT} tools, all free`,
  `${PROMPTS.length.toLocaleString('en-US')} verified AI prompts`,
  'Real agent skills, synced daily',
  'MCP server for AI agents',
  'No signup or account',
  'No ads, anywhere',
  'Most run entirely in your browser',
  'No file uploads',
  'Nothing stored on our side',
  'No tracking or scan counters',
  'Unlimited use',
  'No rate limits',
  'No watermark on output',
  'Results as you type',
  'Copy or download at once',
  'Every calculation unit-tested',
  'The full working shown',
  'Limitations stated plainly',
  'WCAG 2.2 AA contrast',
  'Keyboard operable end to end',
  'Works in any modern browser',
  'Built for India — GST & UPI',
  'No contracts, nothing recurs',
  'Nothing to install',
  'Six categories covered',
  'No queue or delivery time',
  'No trial to expire',
  'Every result reproducible',
  'The method documented per tool',
  'Nothing collected, nothing sold',
]

export function UniversalIncludes() {
  return (
    <section aria-labelledby="universal-includes" className="bg-offwhite py-20 md:py-28">
      <div className="container-site">
        <h2
          id="universal-includes"
          className="text-center text-[40px] leading-[1.05] tracking-[-1px] md:text-[60px] lg:text-[72px]"
        >
          Every tool you need.
        </h2>
        {/* text-ink-muted, not text-violet-500: violet-500 is unchanged
            across themes and measures ~3.23:1 on dark-mode `bg-offwhite` —
            clears the 3:1 large-text bar at the md: 26px breakpoint but fails
            the 4.5:1 normal-text bar at the base 22px size below 768px.
            ink-muted is the token-backed swap that clears AA at every
            viewport. */}
        <p className="mt-4 text-center font-display text-[22px] text-ink-muted md:text-[26px]">
          All of it free — tools, prompts and skills alike.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          {/* Left: what one bookmark gets you. Gradient runs cream → ice → cyan
              (cream/ice are surface tokens, so both re-anchor to a dark elevation
              in dark mode; cyan is a pastel accent, unchanged by design). Text is
              `text-ink` rather than the fixed violet-900 the reference comment
              used to specify — violet-900 is a "dark section" fill colour, not a
              themed text token, so it would sit dark-on-dark once this card's own
              background goes dark. `text-ink` still reads as near-black on the
              light-mode cream/ice/cyan wash (visually equivalent to violet-900
              there) and flips to near-white against the dark-mode version of the
              same gradient. */}
          <div className="rounded-panel bg-gradient-to-br from-cream via-ice to-cyan/50 p-7 md:p-8">
            <h3 className="font-display text-[26px] leading-tight tracking-[-0.5px]">
              <span className="font-bold">One bookmark</span>{' '}
              <span className="font-normal">gets you:</span>
            </h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {TOOLS.map((tool) => (
                <li
                  key={tool.slug}
                  className="flex items-center gap-2.5 font-medium text-[16px] text-ink leading-6"
                >
                  {/* Each tool's own mark replaces the reference's dash bullet
                      — the same white-disc file its page and browser tab use.
                      The disc reads cleanly against the ice/cyan gradient with
                      no ring needed. alt="" for the same reason the dash was
                      aria-hidden: the name beside it carries the meaning, and
                      fifteen announced images would be pure noise. */}
                  <Image
                    src={`/tool-icons/${tool.slug}.png`}
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={24}
                    className="size-6 shrink-0 rounded-full"
                  />
                  {shortName(tool.title)}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: the guarantees. White on violet-500 is 6.06:1 — AA for the
              17px text used here. */}
          <div className="flex flex-col rounded-panel bg-violet-500 p-7 md:p-9">
            {/* `flex-1` + `content-between` makes the rows distribute over
                whatever height the taller card sets, so the panel can never end
                up with a block of dead space at the bottom. Doing it this way
                rather than by tuning the item count means it stays filled if a
                tool is ever added or a label rewrapped. */}
            <ul className="grid flex-1 content-between gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {GUARANTEES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* Yellow disc, and the check in the panel's own violet rather
                      than white. That is a measured improvement, not just a style
                      choice: violet-500 on cta is 3.77:1 where white on cta is
                      1.61:1, so the glyph now clears the 3:1 non-text bar instead
                      of relying on 1.4.11's decorative exemption. */}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-cta"
                  >
                    <Check className="size-3.5 text-violet-500" strokeWidth={3.5} />
                  </span>
                  <span className="font-semibold text-[17px] text-white leading-[1.35]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
