import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'free-utm-builder-no-account'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/utm-builder/meta.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free UTM Builder — No Account, No Team Plan Required',
  h1: "Building consistent UTM links doesn't require a paid marketing platform",
  targetKeyword: 'free utm builder no account',
  description:
    'Consistent, correctly encoded UTM links without signing up for a marketing platform. Free, lowercases and hyphenates automatically, works with any destination URL.',
  dek: 'Some marketing platforms bundle UTM building behind a paid seat as one small feature among dozens. Most teams just need the one thing: a link builder that enforces consistency automatically so reports never fragment.',
  sections: [
    {
      heading: 'What a paid marketing platform bundles UTM building into',
      body: [
        [
          'Full marketing platforms often include a UTM or campaign-link builder as one small feature buried inside a much larger, paid suite — campaign management, ad spend tracking, team collaboration, reporting dashboards. If UTM tagging is the only piece you actually need regularly, paying for or provisioning a full team seat on a platform just to reach that one feature is a lot of overhead for a genuinely simple task: appending a handful of correctly-formatted query parameters to a URL.',
        ],
        [
          'The ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' does exactly that one job, free, with no account: paste a destination URL, fill in source, medium and campaign, and get a correctly tagged link back — lowercased and hyphenated automatically, since GA4 is case-sensitive and mixed casing is the single most common cause of a fragmented marketing report.',
        ],
      ],
    },
    {
      heading: 'What you would be paying for, honestly',
      body: [
        [
          'A full platform genuinely adds value once a team needs shared campaign presets across many people, a saved history of every link ever built, or the link builder integrated directly into a broader campaign-management workflow with approval steps. For a single marketer or small team that just needs every link tagged the same consistent way, those extras are real but often unnecessary weight.',
        ],
      ],
    },
    {
      heading: 'The mechanics that actually prevent fragmented reports',
      body: [
        [
          'Parameters are appended via the URL API rather than naive string concatenation, so tagging works correctly even when a destination URL already carries its own query string or a fragment — a common real-world case a naive builder can silently break. Values get lowercased and spaces converted to hyphens automatically, closing the exact gap that causes "Facebook", "facebook" and "FB" to become three separate, fragmented rows in a GA4 report instead of one clean one.',
        ],
      ],
    },
    {
      heading: 'Worked example: tagging a campaign without touching a platform login',
      body: [
        [
          'Paste your landing page URL, fill in source (google, facebook, newsletter — whichever applies), medium (cpc, paid-social, email), and a campaign name following a fixed pattern like season-offer-year. Copy the tagged link and use it directly in your ad platform, email tool or social post — no login, no seat, no platform to configure first. Once real clicks start arriving, feed the resulting spend and revenue into the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' to see whether the campaign a clean UTM report is now showing you is actually profitable once margin is accounted for.',
        ],
      ],
    },
    {
      heading: 'When tagging discipline is not the actual bottleneck',
      body: [
        [
          'A consistent naming convention fixes messy reports. It does not tell you which channels deserve more budget, or turn clean data into an actual media-spend decision — that is where ',
          { text: "Scult's ad management team", href: SERVICE.href, external: true },
          ' picks up once the tagging itself is no longer standing between you and a trustworthy report.',
        ],
        [
          'Want a second opinion on what your current campaign data is telling you? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['utm-builder', 'marketing-roi-calculator', 'qr-code-generator'],
  relatedPrompts: ['utm-naming-convention-for-a-campaign'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
