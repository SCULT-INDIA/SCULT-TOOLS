import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/site'
import { getTool, TOOLS } from '@/lib/tools/registry'

const TITLE = 'Security'
const DESCRIPTION =
  'What this site actually does for security: client-side tools that transmit nothing, SSRF-blocked server tools, the real response headers, and how to report a vulnerability.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/security' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/security'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const CONTACT_EMAIL = 'connect@scult.in'

const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

/**
 * Every claim on this page maps to something checkable in the codebase — the
 * SSRF guards in `lib/tools/ai-visibility-checker/logic.ts` and
 * `lib/tools/website-speed-test/logic.ts`, the headers in `next.config.ts` —
 * rather than a compliance-page template. We do not run penetration tests, do
 * not hold SOC 2 or ISO 27001, and do not run a WAF or automated dependency
 * scanning, so none of that is claimed here.
 */
export default function SecurityPage() {
  const clientSideCount = TOOLS.filter((t) => t.runtime === 'client').length
  const aiVisibilityChecker = getTool('ai-visibility-checker')
  const websiteSpeedTest = getTool('website-speed-test')

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Security', path: '/security' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Security</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          What we actually do to keep this secure
        </h1>
        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          Most tools on this site have nothing to breach, because nothing is stored or
          transmitted. The two that do call a server validate the target first and refuse
          anything on a private network before making a single request. This page states
          what is actually implemented — not what a security page usually says.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Most tools never leave your browser
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            {clientSideCount} of our {TOOLS.length} tools process everything — files,
            text, numbers — inside your own browser tab, using its own Canvas and text
            parsers. There is no upload step and no server that ever sees your input, so
            there is nothing on our side that could leak it. The full breakdown of which
            tools touch the network and which do not is on the{' '}
            <Link href="/privacy" className={LINK_CLASS}>
              privacy page
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            The two tools that call a server
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            {aiVisibilityChecker !== undefined ? (
              <Link
                href={`/${aiVisibilityChecker.category}/${aiVisibilityChecker.slug}`}
                className={LINK_CLASS}
              >
                {aiVisibilityChecker.title}
              </Link>
            ) : (
              'AI Visibility Checker'
            )}{' '}
            and{' '}
            {websiteSpeedTest !== undefined ? (
              <Link
                href={`/${websiteSpeedTest.category}/${websiteSpeedTest.slug}`}
                className={LINK_CLASS}
              >
                {websiteSpeedTest.title}
              </Link>
            ) : (
              'Website Speed Test'
            )}{' '}
            take a URL and fetch it on your behalf, which is exactly the kind of feature
            that can be tricked into fetching an internal address instead — a
            server-side-request-forgery (SSRF) attack. Both reject a target before doing
            anything with it: only http/https, no embedded credentials (
            <code>user:password@host</code>), and no hostname that only makes sense inside
            a private network — <code>localhost</code>, anything ending in{' '}
            <code>.localhost</code>, <code>.local</code>, <code>.internal</code> or{' '}
            <code>.home.arpa</code>, and any literal IP address in the loopback,
            private-use (RFC 1918), link-local or carrier-NAT ranges, including the IPv6
            and IPv4-mapped equivalents.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            A hostname passing that check can still resolve to a private address, so we
            also resolve the DNS name and reject the request if any address it returns is
            private — closing the gap where an attacker points a public-looking domain at
            127.0.0.1 or a cloud metadata endpoint. For the AI Visibility Checker, which
            fetches robots.txt, llms.txt and the homepage directly from our own server,
            that check runs again on every redirect hop, requests time out after 10
            seconds, redirects stop after 3 hops, and the response body is capped at 2 MB
            so a huge or hanging response cannot tie up the server. The Website Speed Test
            hands the actual page fetch to Google's PageSpeed Insights infrastructure
            rather than fetching it from our own server, but the same URL validation and
            DNS check run first regardless. Both endpoints are also rate-limited per
            connection, so a script cannot hammer either one indefinitely.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Response headers, set on every page
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            These are set site-wide in <code>next.config.ts</code>, not just on the tool
            pages:
          </p>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <code className="text-ink">X-Content-Type-Options: nosniff</code> — stops
              the browser from guessing a file's type and running it as something other
              than what we declared.
            </li>
            <li>
              <code className="text-ink">X-Frame-Options: DENY</code> — this site can
              never be loaded inside an <code>iframe</code> on another page, which rules
              out clickjacking.
            </li>
            <li>
              <code className="text-ink">
                Referrer-Policy: strict-origin-when-cross-origin
              </code>{' '}
              — sends the full URL as a referrer only to our own origin; other sites get
              just the origin, and nothing at all over a downgrade to plain HTTP.
            </li>
            <li>
              <code className="text-ink">
                Permissions-Policy: camera=(), microphone=(), geolocation=()
              </code>{' '}
              — this site has no legitimate use for the camera, microphone or your
              location, so all three are switched off at the browser level.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            No accounts, so nothing to leak
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            There is no signup on this site. We hold no passwords, no user profiles and no
            payment details, because none of that is ever collected in the first place —
            the usual account-database breach has nothing to steal here.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Where this fits into data protection law
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            These are the "reasonable security safeguards" that India's DPDP Act, the older
            IT Rules, GDPR and CCPA all separately require in some form. How each of those
            specific laws maps to this site is on the{' '}
            <Link href="/compliance" className={LINK_CLASS}>
              compliance page
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Report a vulnerability
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            If you find a real security issue — an SSRF bypass, a header that is not doing
            what it claims, anything else — email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
              {CONTACT_EMAIL}
            </a>{' '}
            with what you found and how to reproduce it. We would ask for reasonable time
            to fix it before any public disclosure. To be upfront: there is no bug bounty
            program, so we cannot offer a payout — just a real read and a real fix.
          </p>
        </section>
      </article>
    </>
  )
}
