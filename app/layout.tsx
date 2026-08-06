import type { Metadata, Viewport } from 'next'
import { Cabin, Fraunces, Permanent_Marker } from 'next/font/google'
import Script from 'next/script'
import { Footer } from '@/components/layout/Footer'
import { HeaderGate } from '@/components/layout/HeaderGate'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { FloatingActions } from '@/components/ui/FloatingActions'
import { SITE } from '@/lib/site'
import './globals.css'

/**
 * Standard no-flash-of-wrong-theme bootstrap (the same idea `next-themes`
 * ships, hand-rolled here since that package is not a dependency of this
 * project — see package.json). Must run synchronously, before anything
 * paints, and must agree byte-for-byte with the storage key and value set
 * read by `components/theme/ThemeProvider.tsx`.
 *
 * A plain `<script dangerouslySetInnerHTML>`, not `next/script` — `next/script`'s
 * default strategy is `afterInteractive`, which defers execution until after
 * hydration and would let the wrong theme paint first. This has to block.
 */
const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k='theme';var s=localStorage.getItem(k);var t=s==='light'||s==='dark'||s==='system'?s:'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`

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
  // Preloaded because it renders the LCP element on nearly every route.
  preload: true,
})

const cabin = Cabin({
  subsets: ['latin'],
  variable: '--font-cabin',
  display: 'swap',
  preload: true,
})

const marker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marker-raw',
  display: 'swap',
  // Decorative accent only — never on the critical path.
  preload: false,
})

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
      // The theme bootstrap script below sets `data-theme` on this element
      // before hydration, which will never match the attribute-less markup
      // React rendered on the server. That mismatch is the entire point
      // (it's what avoids a flash of the wrong theme), so it has to be told
      // not to warn about it.
      suppressHydrationWarning
    >
      <head>
        {/* Must be the very first thing in <head> — a blocking, synchronous
            script that runs before any themed content paints. See the
            THEME_BOOTSTRAP_SCRIPT comment above for why this can't be a
            next/script. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
        <OrganizationJsonLd />
        {/* No <link rel="canonical"> here on purpose. A hardcoded canonical in the
            root layout applies to EVERY route, which would declare every tool page
            a duplicate of the homepage. Each page sets its own via
            `alternates.canonical` in generateMetadata. */}
      </head>
      <body>
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <HeaderGate />
          <main id="main" tabIndex={-1} className="scroll-mt-28">
            {children}
          </main>
          <Footer />
          <FloatingActions />

          {/* GA4 loads after interaction so it never competes with the LCP.
              Same property as the parent site, so a tools -> agency journey is one
              session rather than a referral that resets attribution. */}
          {SITE.gaId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga4" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${SITE.gaId}',{cookie_domain:'.scult.in'});`}
              </Script>
            </>
          ) : null}
        </ThemeProvider>
      </body>
    </html>
  )
}
