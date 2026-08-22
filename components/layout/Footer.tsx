import { ArrowUpRight, Heart, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { RequestButton } from '@/components/ui/RequestButton'
import { SaashubBadge } from '@/components/ui/SaashubBadge'
import { UneedBadge } from '@/components/ui/UneedBadge'
import { getCategoriesByGroup, PROMPT_GROUPS } from '@/lib/prompts/categories'
import { getPromptsByCategory } from '@/lib/prompts/registry'
import { parentLink, SITE } from '@/lib/site'
import { CATEGORIES } from '@/lib/tools/categories'
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry'
import { SERVICE_PAGES } from '@/lib/tools/service-links'
import scultLogo from '@/public/brand/scult-tools-white.png'
import { LiveUptime } from './LiveUptime'

/**
 * The reference's closing footer, reproduced as ONE atomic unit:
 *
 *   1. Dual CTA cards  — yellow + green, floating on the arc
 *   2. Dome            — a pale arc behind a dark indigo one
 *   3. Credibility bar — wordmark left · live counter centre · badges right
 *   4. Link grid       — one block per header (bold label + a thin rule,
 *                        then its flat link list): Site+socials, every tool
 *                        category with every one of its tools (the full
 *                        sitemap, not a teaser), every published
 *                        prompt-library group, then Scult's own services.
 *                        `buildFooterColumns()` assembles the list;
 *                        `FooterColumn` is the one shape every block shares.
 *                        Laid out with CSS multi-columns (`columns-*`), not
 *                        a grid — see the comment at the render site for why.
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
 *
 * One of those did become real: the Uneed listing below is an actual directory
 * placement (uneed.best/tool/scult-tool), not a fabricated equivalent, so it
 * renders their own embed artwork rather than being reshaped into our chip
 * style — it's their badge, not a claim we're making about ourselves.
 */

/** Verifiable claims, standing in for the reference's third-party badges. */
const BADGES = [
  { Icon: ShieldCheck, title: 'WCAG 2.2 AA', sub: 'contrast verified' },
  // Count verified by `npx vitest run` after the 2026-08 trust/GEO-AEO page
  // build-out (26 files, 781 tests). Update it when the suite grows — a
  // stale number here is a checkable claim that has quietly become false.
  { Icon: Sparkles, title: '781 tests', sub: 'passing in CI' },
]

const CONTACT_EMAIL = 'connect@scult.in'

/** Real logos via BrandIcon, each on a small white disc for legibility on
 * the indigo field — same pattern as the tool-link marks below. */
const SOCIALS = [
  {
    brand: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/scult-india/',
  },
  { brand: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/scult.in/' },
  { brand: 'x-twitter', label: 'X', href: 'https://x.com/scult_india' },
]

/**
 * Display names for `SERVICE_PAGES` (lib/tools/service-links.ts), keyed by the
 * same `serviceTarget` strings. That map's own `label` field is a CTA
 * fragment ("Explore {label}"), lower-cased on purpose for that sentence —
 * wrong case for a stand-alone footer link, so this is a presentation-only
 * duplicate, not a second source of truth for the URL or which services
 * exist.
 */
const SERVICE_LABELS: Record<string, string> = {
  'web-development': 'Web Development',
  'custom-software': 'Custom Software Development',
  'branding-agency': 'UI/UX Design & Branding',
  'seo-companies-for-small-business': 'Local SEO Services',
  'google-ads-management': 'Google Ads Management',
  'ai-consulting': 'AI Agents & Automation',
}

/**
 * The two-arc transition from the white body into the indigo footer.
 *
 * Geometry measured directly off the reference (draftss.com bakes this curve
 * into a static background image — `Group-1171275088-1-1-1.webp`, 7680×4592 —
 * so it was sampled pixel-by-pixel: scan each column for where the pale rim
 * and then the dark indigo begin). Mapped into this 1440×180 viewBox:
 *
 *   dark arc:  y=180 at the edges → y≈64 at centre  (the original hill path
 *              `C420,25 1020,25` evaluates to exactly 63.75 at t=0.5 — the
 *              deep dome was right all along)
 *   pale arc:  y≈133 at the edges → y≈0 at centre — NOT a translated copy of
 *              the dark arc. It is a second, deeper curve, which is what makes
 *              the rim a bold crescent ~50 units thick even at the far edges
 *              (vs 64 at centre) instead of a thin stripe.
 *
 * Two earlier mistakes, kept here so they aren't retried:
 *   1. A thin translated copy (16 units) for the pale rim — at the viewport
 *      edges, where the dark hill thins to nothing, it read as a stray light
 *      diagonal, the "edges not designed properly" artifact.
 *   2. Papering over that with `bg-violet-900` on this wrapper — that fills
 *      the area ABOVE the curves too, collapsing the whole dome into a flat
 *      dark band with a faint lip. The strip above the pale arc must stay
 *      transparent so the page background shows through and the curve reads
 *      as a curve.
 *
 * The pale arc's control points are negative (−44) but the curve itself stays
 * inside the viewBox: by symmetry its extremum is the t=0.5 midpoint, which
 * evaluates to (133 + 3·(−44)·2 + 133)/8 ≈ 0. It is closed down to y=180 and
 * painted first; the dark arc paints over its lower half, leaving the crescent.
 *
 * The negative top margin is what lets the arc rise *behind* the CTA cards. The
 * cards carry `relative z-45` for the same reason — without a stacking context
 * the arc paints over their lower halves instead of under them. z-45 (not the
 * original z-10) additionally clears `FloatingActions.tsx`'s fixed `z-40`
 * WhatsApp/Scult corner buttons: this section renders on every page in the
 * site, and its cards are tall enough to sit directly behind that bottom
 * corner on a full scroll-through — confirmed live via
 * `document.elementFromPoint()` at the exact overlap coordinates, same method
 * used for the prompt-detail-page fix in `PromptDetailShell.tsx`. `-mb-px`
 * closes the sub-pixel seam against the footer body, which is the same
 * violet-900.
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
          d="M0,133 C420,-44 1020,-44 1440,133 L1440,180 L0,180 Z"
          fill="var(--color-violet-100)"
        />
        <path d="M0,180 C420,25 1020,25 1440,180 Z" fill="var(--color-violet-900)" />
      </svg>
    </div>
  )
}

/** One footer column: a header (plain label, or a link when it has its own
 * page) over a flat list of links. Every column in `buildFooterColumns()`
 * below is this same shape, which is what lets one grid render all of them
 * identically — site links, each tool category, each live prompt-library
 * group and the services list. */
type FooterColumn = {
  key: string
  header: string
  headerHref?: string
  items: readonly { key: string; label: string; href: string; external?: boolean }[]
}

/**
 * Every footer column, in display order: Site, then one column per tool
 * category (all of its tools, not a teaser), then one column per
 * prompt-library group that has at least one published category — the same
 * `getPromptsByCategory(c.slug).length > 0` gate app/prompts/[category]/
 * page.tsx uses for generateStaticParams, so a dead category can never get a
 * link here — then Scult's own services. Computed fresh on every render
 * (all inputs are static registries), never a hand-kept snapshot.
 */
function buildFooterColumns(): readonly FooterColumn[] {
  const siteColumn: FooterColumn = {
    key: 'site',
    header: 'Site',
    items: [
      { key: 'home', label: 'Home', href: '/' },
      { key: 'all', label: 'All tools', href: '/all' },
      { key: 'prompts', label: 'Prompt library', href: '/prompts' },
      { key: 'skills', label: 'Skills library', href: '/skills' },
      { key: 'pricing', label: 'Pricing', href: '/pricing' },
      { key: 'guides', label: 'Guides', href: '/guides' },
      { key: 'blog', label: 'Blog', href: '/blog' },
      { key: 'collections', label: 'Collections', href: '/collections' },
      { key: 'about', label: 'About', href: '/about' },
      { key: 'faq', label: 'FAQ', href: '/faq' },
      { key: 'terms', label: 'Terms', href: '/terms' },
      { key: 'privacy', label: 'Privacy', href: '/privacy' },
    ],
  }

  // Everything else that doesn't earn its own column: the 2026-08 trust/GEO
  // build-out pages. Grouped here rather than folded into `siteColumn` so
  // that block stays a short, primary-navigation list.
  const resourcesColumn: FooterColumn = {
    key: 'resources',
    header: 'Resources',
    items: [
      { key: 'sitemap', label: 'Sitemap', href: '/sitemap' },
      { key: 'contact', label: 'Contact', href: '/contact' },
      { key: 'changelog', label: 'Changelog', href: '/changelog' },
      { key: 'roadmap', label: 'Roadmap', href: '/roadmap' },
      { key: 'glossary', label: 'Glossary', href: '/glossary' },
      { key: 'security', label: 'Security', href: '/security' },
      { key: 'accessibility', label: 'Accessibility', href: '/accessibility' },
      { key: 'compliance', label: 'Compliance', href: '/compliance' },
      { key: 'brand', label: 'Brand & press', href: '/brand' },
    ],
  }

  const toolColumns: FooterColumn[] = CATEGORIES.map((category) => ({
    key: `cat-${category.slug}`,
    header: category.name,
    headerHref: `/${category.slug}`,
    items: getToolsByCategory(category.slug).map((tool) => ({
      key: tool.slug,
      label: tool.title,
      href: `/${tool.category}/${tool.slug}`,
    })),
  }))

  const promptColumns: FooterColumn[] = PROMPT_GROUPS.map((group) => ({
    group,
    categories: getCategoriesByGroup(group.slug).filter(
      (category) => getPromptsByCategory(category.slug).length > 0,
    ),
  }))
    .filter((entry) => entry.categories.length > 0)
    .map(({ group, categories }) => ({
      key: `group-${group.slug}`,
      header: group.name,
      items: categories.map((category) => ({
        key: category.slug,
        label: category.name,
        href: `/prompts/${category.slug}`,
      })),
    }))

  const servicesColumn: FooterColumn = {
    key: 'services',
    header: 'What Scult builds',
    items: Object.entries(SERVICE_PAGES).map(([key, entry]) => ({
      key,
      label: SERVICE_LABELS[key] ?? entry.label,
      href: parentLink(entry.path, `footer-service-${key}`),
      external: true,
    })),
  }

  return [siteColumn, resourcesColumn, ...toolColumns, ...promptColumns, servicesColumn]
}

export function Footer() {
  const clientSideCount = TOOLS.filter((t) => t.runsInBrowser).length
  const footerColumns = buildFooterColumns()

  return (
    <>
      {/* 1. Dual closing CTA cards. `relative z-10` is load-bearing — see Dome. */}
      <section aria-label="Get started" className="container-site relative z-[45] pt-16">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* bg-cta / bg-green are theme-fixed brand fills — text on them must
              be literal black, not adaptive ink (which flips near-white in
              dark mode and vanishes against the light fill). */}
          <div className="rounded-panel bg-cta px-8 py-12 text-center md:px-10 md:py-14">
            <h2 className="mx-auto max-w-[13ch] text-[34px] text-black leading-[1.05] tracking-[-1px] md:text-[44px]">
              Check your AI visibility
            </h2>
            <p className="mx-auto mt-4 max-w-[34ch] text-[15px] text-black/75 leading-6">
              One URL in, a 0–100 score and the exact fixes out.
            </p>
            <Link href="/geo/ai-visibility-checker" className="btn-brutal btn-white mt-7">
              RUN THE CHECK
            </Link>
          </div>

          <div className="rounded-panel bg-green px-8 py-12 text-center md:px-10 md:py-14">
            <h2 className="mx-auto max-w-[13ch] text-[34px] text-black leading-[1.05] tracking-[-1px] md:text-[44px]">
              Browse all the tools
            </h2>
            <p className="mt-4 text-[15px] text-black/75 leading-6">
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
              it cannot slide behind the page background. `z-[45]`: same reason
              as the CTA cards above — this body (credibility bar, link grid,
              "Made with" pill, legal bar) is tall enough on a full page to sit
              behind `FloatingActions.tsx`'s fixed `z-40` corner buttons
              without it, confirmed live the same way. */}
      <footer className="relative z-[45] isolate overflow-hidden bg-violet-900 text-white">
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
            <p className="flex items-center justify-center md:justify-start">
              {/* Explicit width/height, same fix and reason as Header.tsx's
                  logo: without them next/image serves the source PNG's full
                  6000x3375 intrinsic size instead of a footer-appropriate one. */}
              <Image
                src={scultLogo}
                alt="SCULT Tools"
                width={114}
                height={64}
                className="h-12 w-auto md:h-16"
              />
            </p>
            <p className="mt-3 text-[14px] text-white/70">
              {clientSideCount} of {TOOLS.length} tools run entirely in your browser.
            </p>
          </div>

          <LiveUptime />

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            {BADGES.map(({ Icon, title, sub }) => (
              // Literal black text: the badge chip is fixed white in both
              // themes, so adaptive ink (near-white in dark mode) vanishes
              // against it.
              <div
                key={title}
                className="flex items-center gap-2 rounded-sm bg-white px-3.5 py-2.5 text-black"
              >
                <Icon className="size-5 shrink-0 text-violet-700" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block font-bold text-[12px]">{title}</span>
                  <span className="block text-[11px] text-black/60">{sub}</span>
                </span>
              </div>
            ))}
            <UneedBadge />
            <SaashubBadge />
          </div>
        </div>

        {/* 4. Link grid — one block per header: Site, then every tool
            category (all of its tools), then every live prompt-library
            group, then Scult's services. Every block carries the same
            treatment: a bold header — a link where it has its own page,
            plain text where it doesn't — over a thin rule, then its flat
            list of links.

            CSS multi-column, not CSS grid: a grid row locks to its tallest
            cell, so a short block (Productivity, one link) sitting beside a
            tall one (Site, nine links) leaves a huge dead gap before the
            next row starts — sixteen blocks of wildly different lengths
            made that gap enormous. `columns-*` flows blocks top-to-bottom
            and balances total height across columns instead, so two short
            blocks stack into the space one tall block used to waste.
            `break-inside-avoid-column` keeps a header glued to its own list
            rather than splitting across the column break. An ideal width
            rather than a fixed count is what makes this "more horizontal"
            on request — more, narrower columns appear as the viewport
            widens; one column on mobile. */}
        <nav aria-label="Footer" className="container-site pb-14">
          <div className="columns-[9.5rem] gap-x-8">
            {footerColumns.map((column) => (
              <div key={column.key} className="mb-7 break-inside-avoid-column">
                {column.headerHref ? (
                  <Link
                    href={column.headerHref}
                    className="block border-white/15 border-b pb-2.5 font-semibold text-[15px] text-white transition-colors hover:text-white/80"
                  >
                    {column.header}
                  </Link>
                ) : (
                  <p className="border-white/15 border-b pb-2.5 font-semibold text-[15px] text-white">
                    {column.header}
                  </p>
                )}

                <ul className="mt-3 space-y-2">
                  {column.items.map((item) =>
                    item.external ? (
                      <li key={item.key}>
                        <a
                          href={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-[14px] text-white/70 hover:text-white"
                        >
                          {item.label}
                          <ArrowUpRight
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ) : (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          className="text-[14px] text-white/70 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ),
                  )}
                  {/* The one sitewide entry point for the generalized
                      request dialog (components/ui/RequestButton.tsx) — tool
                      pages and prompt pages already trigger it in their own
                      context, this is the catch-all for a visitor who isn't
                      on either (or wants to ask for a skill, which has no
                      page of its own at all). Same plain-text-link styling
                      as the rest of this list, not the icon-disc treatment
                      the contact/social row below uses. */}
                  {column.key === 'site' && (
                    <li>
                      <RequestButton
                        defaultKind="tool_request"
                        trackContext="footer"
                        triggerLabel="Request a tool, prompt, or skill"
                        triggerClassName="inline-flex items-center gap-1.5 text-[14px] text-white/70 hover:text-white"
                      />
                    </li>
                  )}
                </ul>

                {/* Contact + social row, under the Site block only — each
                    mark on a small white disc because X's official mark is
                    near-black and would vanish bare on this indigo field. */}
                {column.key === 'site' && (
                  <ul className="mt-5 space-y-2">
                    <li>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="inline-flex items-center gap-2.5 text-[14px] text-white/70 transition-colors hover:text-white"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                          <Mail className="size-3.5 text-violet-700" aria-hidden="true" />
                        </span>
                        {CONTACT_EMAIL}
                      </a>
                    </li>
                    {SOCIALS.map(({ brand, label, href }) => (
                      <li key={label}>
                        <a
                          href={href}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="inline-flex items-center gap-2.5 text-[14px] text-white/70 transition-colors hover:text-white"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                            <BrandIcon brand={brand} size={14} />
                          </span>
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* 5. "Made with ❤️" pill */}
        <div className="container-site flex justify-center pb-10">
          <a
            href={parentLink('/', 'footer-byline')}
            className="inline-flex items-center gap-2 rounded-pill bg-white px-8 py-4 text-[15px] text-black transition-transform hover:scale-[1.02]"
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
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>{' '}
            |{' '}
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="/compliance" className="hover:text-white">
              Compliance
            </Link>
          </p>
        </div>
      </footer>
    </>
  )
}
