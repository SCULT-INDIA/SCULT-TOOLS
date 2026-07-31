import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'

/**
 * Reference: bands 10-12 — a video-testimonial strip followed by a 3-column
 * masonry of 5-star review cards with a highlighted phrase in each.
 *
 * We deliberately do not clone this section's content model: placeholder
 * reviews attributed to invented people are fabricated social proof, which the
 * build plan (docs/PLAN.md) explicitly rules out. What survives is the visual
 * grammar — a card grid with one phrase highlighted per card — filled with
 * real, checkable claims about how a specific tool works, each linked to that
 * tool instead of credited to a fictional reviewer.
 */
const PRINCIPLES: {
  title: string
  body: string
  highlight: string
  href: string
  source: string
}[] = [
  {
    title: 'The GST split reconciles to the paisa',
    body: 'CGST and SGST are computed by halving the tax in integer paise and giving any leftover paisa to one side, so ',
    highlight: 'the two halves always sum exactly to the total — never a paisa short.',
    href: '/business/invoice-generator',
    source: 'Invoice Generator · logic.ts',
  },
  {
    title: 'Contrast math, not a guess',
    body: 'Every colour claim on this site is computed with the actual WCAG relative-luminance formula, so ',
    highlight: 'a "passes AA" badge means the ratio was calculated, not eyeballed.',
    href: '/design/color-palette-generator',
    source: 'Colour Palette Generator',
  },
  {
    title: 'Robots.txt, read the way crawlers read it',
    body: 'Bot access is evaluated with the real specificity rules search engines use, so ',
    highlight:
      'the most specific matching user-agent group wins over a wildcard, correctly.',
    href: '/geo/ai-visibility-checker',
    source: 'AI Visibility Checker',
  },
  {
    title: 'Nothing is uploaded to check it',
    body: 'Favicon generation runs entirely on a canvas in your tab, so ',
    highlight: 'you can disconnect from the network mid-task and it keeps working.',
    href: '/dev/favicon-generator',
    source: 'Favicon Generator',
  },
  {
    title: 'The schema is validated before you copy it',
    body: 'Every JSON-LD field is checked against what Google actually requires per type, so ',
    highlight:
      'a missing required field is flagged by name, not discovered later in Search Console.',
    href: '/seo/schema-markup-generator',
    source: 'Schema Markup Generator',
  },
  {
    title: 'A "good" ROAS can still be a loss',
    body: 'The ROI calculator separates return on ad spend from actual margin, so ',
    highlight: 'a 3x ROAS at 25% margin is correctly reported as losing money.',
    href: '/seo/marketing-roi-calculator',
    source: 'Marketing ROI Calculator',
  },
]

export function PrincipleWall() {
  return (
    <section aria-labelledby="principles" className="container-site py-16">
      <div className="mb-10 text-center">
        <p className="eyebrow">Not marketing copy — verifiable</p>
        <h2
          id="principles"
          className="mt-3 text-[32px] leading-[1.1] tracking-[-1px] md:text-[42px]"
        >
          How we know these tools are right
        </h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-[16px] text-ink-muted leading-7">
          Every claim below traces back to a real tool's tested logic — click through and
          read the actual implementation, not a summary of it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((p) => (
          // flex column so the source attribution pins to the bottom — the
          // claims differ in length, and without it "— Favicon Generator" and
          // "— Schema Markup Generator" sit at different heights across a row.
          <Link
            key={p.title}
            href={p.href}
            className="card-flat flex flex-col p-5 hover:border-ink"
          >
            {/* violet-700 (8.20:1), not brand `green`. Green is a BACKGROUND
                colour — #23CA87 as 13px text on this white card lands near 2:1
                and fails 1.4.3. The wording carries the meaning regardless. */}
            <span className="inline-flex items-center gap-1.5 font-medium text-[13px] text-violet-700">
              <BadgeCheck className="size-4" aria-hidden="true" />
              Verified in code
            </span>
            <h3 className="mt-3 font-display font-semibold text-[18px] tracking-normal">
              {p.title}
            </h3>
            <p className="mt-2 text-[14px] text-ink-muted leading-6">
              {p.body}
              <span className="bg-tile-yellow px-1 text-ink">{p.highlight}</span>
            </p>
            <p className="mt-auto pt-4 text-[13px] text-ink-subtle">— {p.source}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
