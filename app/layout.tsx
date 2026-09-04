import type { Metadata, Viewport } from 'next'
import { Cabin, Fraunces, Permanent_Marker } from 'next/font/google'
import { CtaClickTracker } from '@/components/layout/CtaClickTracker'
import { DeferredAnalyticsScripts } from '@/components/layout/DeferredAnalyticsScripts'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HeaderGate } from '@/components/layout/HeaderGate'
import { FloatingActions } from '@/components/ui/FloatingActions'
import { SITE } from '@/lib/site'
import './globals.css'

/**
 * Fonts are self-hosted: next/font downloads them at build time and serves them
 * from our own origin, so there is no request to Google at runtime and no
 * third-party origin on the critical path.
 *
 * Fraunces stands in for Recoleta, which is commercial-licence-only and cannot
 * ship on a commercial property without a purchased licence. Fraunces is
 * OFL-1.1, carries no Reserved Font Name, and its SOFT and WONK axes pull it
 * toward Recoleta's soft 1970s serifs — set on :root in globals.css.
 *
 * opsz is kept live because the display face runs from 70px down to 16px; a
 * single optical size would give display-weight hairlines to small headings.
 *
 * `preload: false` on purpose, despite Fraunces rendering the LCP element on
 * nearly every route: this specific combination of variable axes (full
 * SOFT/WONG/opsz ranges — next/font/google has no API to narrow a requested
 * axis to the one fixed value globals.css actually uses) makes the file
 * ~118KB, and preloading put it on the critical path competing for bandwidth
 * against render-blocking CSS under throttled conditions, directly delaying
 * first paint. `display: 'swap'` plus next/font's automatically-generated,
 * metrics-matched fallback (ascent/descent/line-gap-override, size-adjust —
 * confirmed in the compiled output) already means the LCP text paints
 * immediately in the fallback face with no layout shift; Fraunces itself now
 * loads at normal (not elevated) priority and swaps in whenever it arrives.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
  display: 'swap',
  // Roman only. The hero's accent word is deliberately upright (per the
  // approved mockup), so no italic face is used anywhere — loading one would
  // be dead weight on the critical path. If a true italic is ever wanted,
  // add `style: ['normal', 'italic']` here first, or the browser will fake
  // it with a synthetic oblique.
  preload: false,
})

// Same reasoning as Fraunces above: the metrics-matched fallback makes
// preloading unnecessary for avoiding layout shift, so it's off to keep body
// text out of the critical-path bandwidth contest.
const cabin = Cabin({
  subsets: ['latin'],
  variable: '--font-cabin',
  display: 'swap',
  preload: false,
})

const marker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marker-raw',
  display: 'swap',
  // Decorative accent only — never on the critical path.
  preload: false,
})

/**
 * The Microsoft Clarity queue shim, and nothing else.
 *
 * Clarity ships one snippet that does two jobs: it defines `window.clarity` as
 * a queue, then injects the remote tag. Shipping that snippet through
 * `next/script` looked equivalent and was not — in production `window.clarity`
 * was `undefined` by the time the tag ran, and the tag's very first statement
 * is a call to it:
 *
 *     a[c]("metadata", …)          // a = window, c = "clarity"
 *
 * so it threw `TypeError: a[c] is not a function` on line 1, never reached the
 * line that loads the actual recorder (`scripts.clarity.ms/…/clarity.js`), and
 * Clarity recorded nothing at all. The tag itself was fetched fine — 200, and
 * the correct project — which is what made this so quiet: every check short of
 * opening the console said it was installed.
 *
 * Splitting the snippet fixes it by removing the ordering assumption entirely.
 * This half is server-rendered into <head> as a plain synchronous script, so
 * it has run during HTML parse, before anything `afterInteractive` can
 * execute. The tag half is a `next/script` `src` in <body>, so it still stays
 * off the LCP path.
 *
 * Do not "simplify" this back into one inline `next/script`. It reads as
 * tidier and silently collects no data.
 */
const CLARITY_QUEUE_SCRIPT = `window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};`

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.tagline} | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  creator: SITE.parentName,
  publisher: SITE.parentName,
  // Explicit rather than left to the `app/icon.png` file convention. Next's
  // App Router treats a root `favicon.ico` special file as an unconditional
  // link injected on every page — it is not part of the mergeable Metadata
  // icons resolution, so a tool page's `generateMetadata` returning its own
  // `icons` could not suppress it: both the site mark and the tool's icon
  // would render as competing `<link rel="icon">` tags, and which one a
  // browser actually used was not guaranteed. `app/favicon.ico` has been
  // moved to `public/favicon.ico` (still served at the same URL for the
  // direct `/favicon.ico` requests some older clients make, bypassing the
  // HTML entirely) so this explicit declaration is the only source of the
  // default icon, and tool pages overriding `icons` now fully replace it
  // with nothing left behind to compete with. `apple` is deliberately NOT
  // set per-tool from the tool page — "add to home screen" bookmarks the
  // whole site, not one page, so it keeps the Scult mark everywhere.
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  // Deliberately NO `alternates` here. Root-layout metadata is inherited by every
  // page that does not override it, so a canonical of '/' set here would declare
  // any such page a duplicate of the homepage. Each page sets its own.
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.tagline} | ${SITE.name}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.tagline} | ${SITE.name}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Organization JSON-LD deliberately points at the PARENT's @id.
 *
 * This is the most important structured-data decision on the project: subdomains
 * are treated as related-but-distinct hosts, so without this the authority this
 * site earns accrues to an orphan entity instead of Scult's Knowledge Graph
 * entry. Getting it wrong is invisible for months and expensive to unwind.
 */
function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.locale,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE.parentUrl}/#organization`,
      name: SITE.parentName,
      url: SITE.parentUrl,
      sameAs: [SITE.parentUrl],
      telephone: SITE.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.locality,
        addressRegion: SITE.address.region,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.country,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/all?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={SITE.locale}
      // Next 16 removed automatic smooth scrolling; opt back in explicitly.
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${cabin.variable} ${marker.variable}`}
    >
      <head>
        {/* Must be a plain synchronous <script>, and must be in <head> —
            see CLARITY_QUEUE_SCRIPT. */}
        {SITE.clarityId ? (
          <script dangerouslySetInnerHTML={{ __html: CLARITY_QUEUE_SCRIPT }} />
        ) : null}
        <OrganizationJsonLd />
        {/* No <link rel="canonical"> here on purpose. A hardcoded canonical in the
            root layout applies to EVERY route, which would declare every tool page
            a duplicate of the homepage. Each page sets its own via
            `alternates.canonical` in generateMetadata. */}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <HeaderGate>
          <Header />
        </HeaderGate>
        <main id="main" tabIndex={-1} className="scroll-mt-28">
          {children}
        </main>
        <Footer />
        <FloatingActions />

        {/* One delegated listener for every outbound conversion link on the
            site — see the component for why it is not an onClick per link. */}
        <CtaClickTracker />

        {/* GA4 + Clarity + SCULT Studio's track.js, deferred to the visitor's
            first interaction (or a short fallback delay) rather than
            mounted unconditionally — see DeferredAnalyticsScripts for why,
            and for the GA4 bootstrap / Clarity ordering details, both
            unchanged from before. Same GA4 property as the parent site, so
            a tools -> agency journey is one session rather than a referral
            that resets attribution.

            PRIVACY: this site's whole promise is that tool input stays in the
            browser, and session replay is the one thing that could quietly
            break it — people paste real client JSON and real invoice figures
            into these tools. Masking is therefore NOT left at Clarity's
            "Balanced" default; the project is set to Strict masking in the
            Clarity dashboard, which redacts page text and all input values
            before anything is transmitted. app/privacy/page.tsx discloses
            this, and the two must be kept in sync — if masking is ever
            relaxed, that page stops being true. */}
        <DeferredAnalyticsScripts
          gaId={SITE.gaId}
          clarityId={SITE.clarityId}
          studioSiteId={SITE.studioSiteId}
          openaiAdsPixelId={SITE.openaiAdsPixelId}
        />
      </body>
    </html>
  )
}
