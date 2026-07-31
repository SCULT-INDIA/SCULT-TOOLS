import { Heart, ShieldCheck, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import scultMark from '@/app/icon.png'
import { parentLink, SITE } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'
import { LiveUptime } from './LiveUptime'

/**
 * The reference's closing footer, reproduced as ONE atomic unit:
 *
 *   1. Dual CTA cards  — yellow + green, floating on the arc
 *   2. Dome            — a pale arc behind a dark indigo one
 *   3. Credibility bar — wordmark left · live counter centre · badges right
 *   4. Link grid       — four flat columns, social row under column one
 *   5. "Made with ❤️" pill
 *   6. Legal bar       — single centred copyright line, over a bottom glow
 *
 * All six live here, and `Footer` is rendered once in `app/layout.tsx`, so every
 * page gets a byte-identical closing sequence. Previously the cards and the dome
 * sat in `app/page.tsx` while only the dark bar was global — so the homepage had
 * a curved footer with cards on it and every tool page had a flat-edged one. That
 * is the whole reason this is a single component now: a footer that differs per
 * page is not a footer, it is two designs.
 *
 * Content substitutions, not structural ones. The reference's badges are real
 * third-party endorsements it earned (Microsoft for Startups, SaaSHub, Uneed) and
 * its green card carries "Trusted by 1200+ · ★★★★★ · 4.8 out of 5". We have no
 * review platform, no customer count and no such partnerships, so inventing
 * equivalents would be fabricated credentials. Those slots carry claims that are
 * true and checkable about this site instead — same shape, same visual weight.
 */

/** Verifiable claims, standing in for the reference's third-party badges. */
const BADGES = [
  { Icon: ShieldCheck, title: 'WCAG 2.2 AA', sub: 'contrast verified' },
  // Count verified by `npx vitest run` after the tool redesign (19 files).
  // Update it when the suite grows — a stale number here is a checkable claim
  // that has quietly become false.
  { Icon: Sparkles, title: '628 tests', sub: 'passing in CI' },
]

const SOCIALS = [
  { label: 'X', href: 'https://x.com/scult' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/scult' },
  { label: 'GitHub', href: 'https://github.com/scult' },
]

/**
 * The two-arc transition from the white body into the indigo footer.
 *
 * The reference has a pale periwinkle arc sitting a few pixels above the dark
 * one, which reads as a soft rim following the curve — easy to miss and the
 * detail that makes the transition look drawn rather than clipped. Both arcs are
 * the same path; the pale one is simply translated up, so the rim stays a uniform
 * thickness across the full width instead of pinching at the centre.
 *
 * A later pass replaced this with two separate ellipses plus a radial halo on the
 * dark dome — a broader crescent, closer to the reference at the edges. It was
 * reverted on request. If it is revisited, the thing to keep in mind is that a
 * translated copy gives a uniform rim while two distinct ellipses give a crescent
 * that opens out toward the left and right edges; the reference is the latter, but
 * the former is far simpler and reads cleanly at every width.
 *
 * The negative top margin is what lets the arc rise *behind* the CTA cards. The
 * cards carry `relative z-10` for the same reason — without a stacking context
 * the arc paints over their lower halves instead of under them. `-mb-px` closes
 * the sub-pixel seam against the footer body, which is the same violet-900.
 */
function Dome() {
  return (
    <div aria-hidden="true" className="-mt-24 -mb-px relative h-32 md:-mt-32 md:h-44">
      <svg
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <path
          d="M0,180 C420,25 1020,25 1440,180 Z"
          fill="var(--color-violet-100)"
          transform="translate(0,-16)"
        />
        <path d="M0,180 C420,25 1020,25 1440,180 Z" fill="var(--color-violet-900)" />
      </svg>
    </div>
  )
}

export function Footer() {
  const clientSideCount = TOOLS.filter((t) => t.runsInBrowser).length

  // Columns 2-4: two categories each, with their tools flattened underneath —
  // a flat link list per column, as in the reference.
  const linkColumns = [
    CATEGORIES.slice(0, 2),
    CATEGORIES.slice(2, 4),
    CATEGORIES.slice(4, 6),
  ]

  return (
    <>
      {/* 1. Dual closing CTA cards. `relative z-10` is load-bearing — see Dome. */}
      <section aria-label="Get started" className="container-site relative z-10 pt-16">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-panel bg-cta px-8 py-12 text-center md:px-10 md:py-14">
            <h2 className="mx-auto max-w-[13ch] text-[34px] leading-[1.05] tracking-[-1px] md:text-[44px]">
              Check your AI visibility
            </h2>
            <p className="mx-auto mt-4 max-w-[34ch] text-[15px] text-ink/75 leading-6">
              One URL in, a 0–100 score and the exact fixes out.
            </p>
            <Link href="/geo/ai-visibility-checker" className="btn-brutal btn-white mt-7">
              RUN THE CHECK
            </Link>
          </div>

          <div className="rounded-panel bg-green px-8 py-12 text-center md:px-10 md:py-14">
            <h2 className="mx-auto max-w-[13ch] text-[34px] leading-[1.05] tracking-[-1px] md:text-[44px]">
              Browse all the tools
            </h2>
            <p className="mt-4 text-[15px] text-ink/75 leading-6">
              {TOOLS.length} tools across six categories
              <br />
              {clientSideCount} of them never send your data anywhere
            </p>
            <p className="mt-3 font-medium text-[14px] text-ink/70">
              Free · No signup · No trial clock
            </p>
            <Link href="/all" className="btn-brutal mt-7">
              SEE THE DIRECTORY
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Dome */}
      <Dome />

      {/* 3-6. The dark body. `isolate` scopes the glow's -z-10 to this element so
              it cannot slide behind the page background. */}
      <footer className="relative isolate overflow-hidden bg-violet-900 text-white">
        {/* The reference footer is not flat: it brightens markedly toward the
            bottom centre, which is what stops a tall dark block reading as a dead
            panel.

            The peak is held at 0.8 deliberately — the legal line sits directly on
            the brightest part, and a stronger glow starts eating its contrast.
            Measured: white/75 on that peak is 4.95:1; at the original white/55 it
            would have been 3.23:1, a failure the glow would have introduced
            silently. */}
        <div
          aria-hidden="true"
          className="-z-10 pointer-events-none absolute inset-x-0 bottom-0 h-[560px]"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 100%, rgb(99 26 255 / 0.80) 0%, rgb(70 20 200 / 0.42) 38%, rgb(22 1 142 / 0) 72%)',
          }}
        />

        {/* 3. Credibility bar */}
        <div className="container-site grid items-center gap-8 py-14 md:grid-cols-3">
          <div className="text-center md:text-left">
            {/* Same PNG as the Header's mark and the browser-tab favicon — one
                asset. The mark's white disc reads as a small badge against
                violet-900, which is the intended shape rather than a stray box:
                verified transparent outside the disc (corner alpha 0). */}
            <p className="inline-flex items-center justify-center gap-2.5 font-display font-bold text-[38px] text-white leading-none md:justify-start">
              <Image src={scultMark} alt="" width={40} height={40} className="size-9" />
              Scult<span className="text-cta">Tools</span>
            </p>
            <p className="mt-3 text-[14px] text-white/70">
              {clientSideCount} of {TOOLS.length} tools run entirely in your browser.
            </p>
          </div>

          <LiveUptime />

          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
            {BADGES.map(({ Icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-2 rounded-sm bg-white px-3.5 py-2.5 text-ink"
              >
                <Icon className="size-5 shrink-0 text-violet-700" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block font-bold text-[12px]">{title}</span>
                  <span className="block text-[11px] text-ink-subtle">{sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Link grid — four flat columns */}
        <div className="container-site grid gap-x-8 gap-y-10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Site">
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/all', label: 'All tools' },
                { href: '/about', label: 'About' },
                { href: '/privacy', label: 'Privacy' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-white/85 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social row, directly under column one as in the reference. Text
                labels rather than glyphs: this lucide build ships only the `X`
                mark (the rest were removed upstream for trademark reasons), and
                one icon beside two words reads as a broken row. */}
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {SOCIALS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-[14px] text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {linkColumns.map((group) => (
            <nav
              key={group.map((c) => c.slug).join('-')}
              aria-label={group.map((c) => c.name).join(' and ')}
            >
              <ul className="space-y-3">
                {group.flatMap((category) => [
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-[15px] text-white/85 hover:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>,
                  ...getToolsByCategory(category.slug)
                    .slice(0, 2)
                    .map((tool) => (
                      <li key={tool.slug}>
                        {/* Tool links carry the tool's own mark; category
                            links above them stay text-only, which is also
                            what visually separates the two levels of this
                            flat list. The baked-in white disc is what keeps
                            the mark legible on the indigo field. */}
                        <Link
                          href={`/${tool.category}/${tool.slug}`}
                          className="inline-flex items-center gap-2 text-[15px] text-white/85 hover:text-white"
                        >
                          <Image
                            src={`/tool-icons/${tool.slug}.png`}
                            alt=""
                            width={18}
                            height={18}
                            className="size-4.5 shrink-0 rounded-full"
                          />
                          {tool.title}
                        </Link>
                      </li>
                    )),
                ])}
              </ul>
            </nav>
          ))}
        </div>

        {/* 5. "Made with ❤️" pill */}
        <div className="container-site flex justify-center pb-10">
          <a
            href={parentLink('/', 'footer-byline')}
            className="inline-flex items-center gap-2 rounded-pill bg-white px-8 py-4 text-[15px] text-ink transition-transform hover:scale-[1.02]"
          >
            <span className="underline decoration-1 underline-offset-4">
              Made with{' '}
              <Heart
                className="inline size-4 fill-red-500 text-red-500"
                aria-hidden="true"
              />{' '}
              from the entire {SITE.parentName} team
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* 6. Legal bar. white/75 rather than /55: this line sits on the brightest
               part of the glow, where a dimmer white stops clearing 4.5:1. */}
        <div className="container-site pb-10 text-center text-[13px] text-white/75">
          <p>
            Copyright © {SITE.buildYear} {SITE.parentName}. All Rights Reserved. |{' '}
            <Link href="/about" className="hover:text-white">
              About
            </Link>{' '}
            |{' '}
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </>
  )
}
