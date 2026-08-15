import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'utm-builder-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/utm-builder/meta.ts and logic.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'UTM Parameters Explained: Naming Conventions That Do Not Break GA4',
  h1: 'Why your GA4 reports are fragmented (and the naming fix that ends it)',
  targetKeyword: 'utm naming convention',
  description:
    'A UTM naming convention that actually holds up in GA4 — why "Facebook" and "facebook" split into two rows, the five parameters that matter, and a free URL builder.',
  dek: 'The most common reason a marketing report looks fragmented is not a tracking failure — it is inconsistent capitalisation and spelling across UTM links built by different people at different times. Fix the convention once, and every report downstream gets simpler.',
  sections: [
    {
      heading: 'Why "Facebook", "facebook" and "FB" are three different sources',
      body: [
        [
          'GA4 is case-sensitive in how it stores UTM parameter values. That single fact explains the single most common cause of a fragmented marketing report: one team member tags a link with utm_source=Facebook, another uses facebook, a third uses FB, and GA4 dutifully records all three as genuinely distinct traffic sources rather than recognising them as the same channel. Nobody made a tracking mistake — the tags all technically work, they just do not match each other, and the report that results is three thin rows where there should have been one clear one.',
        ],
        [
          'The ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' on this site closes that gap by lowercasing values and converting spaces to hyphens automatically as you build a link — so "Spring Sale" becomes spring-sale rather than a value that later gets typed three slightly different ways by three different people. Parameters are appended using the URL API rather than naive string concatenation, so it appends correctly even when the destination URL already has an existing query string or a fragment, instead of accidentally breaking or duplicating what was already there.',
        ],
      ],
    },
    {
      heading: 'The five UTM parameters, and which three actually matter',
      body: [
        [
          'Five standard parameters exist: utm_source, utm_medium, utm_campaign, utm_term and utm_content. Only the first three are required for a report to be useful at all — source (where the traffic came from: google, facebook, newsletter), medium (what kind of channel: cpc, paid-social, email, referral), and campaign (which specific initiative: diwali-sale-2026, product-launch-q1). utm_term and utm_content are optional refinements, mostly useful for paid search keyword tracking and for distinguishing A/B ad-creative variants within the same campaign — genuinely useful when you need that granularity, entirely skippable when you do not.',
        ],
        [
          "A fixed reference table removes the guessing that causes drift in the first place: Google Ads traffic should always be source=google, medium=cpc. Facebook or Instagram paid ads should be source=facebook or instagram, medium=paid-social — distinct from an organic post on the same platforms, which should carry medium=social instead, since paid and organic performance need to be visible as separate rows, not blended into one. An email newsletter is source=newsletter, medium=email. A partner or affiliate link uses the partner's actual name as the source, with medium=referral.",
        ],
      ],
    },
    {
      heading: 'A campaign naming pattern that scales past one person',
      body: [
        [
          'Beyond source and medium, the utm_campaign value itself benefits from a fixed pattern rather than an improvised name each time: season-offer-year, for example diwali-sale-2026 or product-launch-q1-2027. The value of a fixed pattern compounds specifically once more than one person is building links — a shared, written-down convention (even just a note everyone on the team references) means every campaign name follows the same shape automatically, rather than becoming visible only in hindsight when a report shows five near-identical campaign names that were all meant to be the same thing.',
        ],
        [
          'Build every link through the tool rather than hand-typing tags directly into a URL bar — consistency by default beats consistency by discipline, since discipline is the thing that erodes first under a real deadline.',
        ],
      ],
    },
    {
      heading: 'Two mistakes that undermine even a perfect naming convention',
      body: [
        [
          "First: UTM parameters are visible in the URL and editable by anyone who looks at it — never use them to carry anything resembling access control or a secret, since a UTM tag has zero security properties whatsoever, it is purely a labelling mechanism for analytics. Second, and more likely to actually bite a real campaign: GA4 auto-reads gclid (Google's click identifier) and fbclid (Meta's) automatically from ad platforms, so manually adding UTM parameters on top of an already auto-tagged Google or Meta ad click can create double-counted or conflicting attribution — worth checking whether your ad platform is already auto-tagging before adding UTMs redundantly on top of paid traffic specifically.",
        ],
        [
          'A smaller but real SEO-adjacent issue: UTM-tagged URLs can create duplicate URLs if a crawler indexes them separately from the clean version. A canonical tag pointing back at the untagged URL handles this, and UTM parameters should never be added to internal site links in the first place — they exist to track where external traffic came from, not to decorate navigation within your own site.',
        ],
      ],
    },
    {
      heading: 'Worked example: tagging a Diwali sale campaign across three channels',
      body: [
        [
          'Say the same landing page is being promoted through a Google Ads campaign, an organic Instagram post, and an email newsletter. For the Google Ads link: source=google, medium=cpc, campaign=diwali-sale-2026. For the Instagram post: source=instagram, medium=social (not paid-social, since this one is organic), campaign=diwali-sale-2026 — same campaign name, different source and medium, so all three eventually roll up under one campaign in reporting while still being separately attributable by channel. For the newsletter: source=newsletter, medium=email, campaign=diwali-sale-2026.',
        ],
        [
          'Once real clicks start arriving, this data surfaces in GA4 under Traffic acquisition and the session source/medium reports specifically — that is where the three channels above will show up as three distinct, correctly labelled rows under the same campaign, rather than either merging into one indistinguishable blob or fragmenting into inconsistent near-duplicates.',
        ],
        [
          'If you print any of these campaigns on physical materials too, a ',
          { text: 'QR code', href: '/dev/qr-code-generator' },
          ' encoding the tagged URL directly lets you extend the same attribution to offline placements — posters, packaging, signage — without inventing a separate offline tracking method.',
        ],
      ],
    },
    {
      heading: 'What UTM tagging does not tell you',
      body: [
        [
          'Knowing which channel drove a click is only half the picture — it tells you nothing about whether that click was actually profitable once you account for what it cost to acquire and what margin the resulting sale actually carried. That is a separate calculation, deliberately not something a URL tagging tool attempts: run the resulting spend and revenue numbers through the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' to see the real ROI and ROAS side by side, including the margin math a raw click-attribution report leaves out entirely.',
        ],
      ],
    },
    {
      heading: "When tagging discipline isn't the actual bottleneck",
      body: [
        [
          'A consistent naming convention fixes messy reports. It does not fix a campaign that is fundamentally underperforming, or answer the harder question of which channels genuinely deserve more budget versus which are being kept alive by habit. That analysis — reading what clean, consistent UTM data is actually telling you and turning it into a real media-spend decision — is where ',
          { text: "Scult's ad management team", href: SERVICE.href, external: true },
          ' does its work, once the tagging itself is no longer the thing standing between you and a trustworthy report.',
        ],
        [
          'Want a second opinion on what your current campaign data is actually showing? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " — bring your GA4 reports and we'll help you read them honestly.",
        ],
      ],
    },
  ],
  relatedTools: [
    'utm-builder',
    'marketing-roi-calculator',
    'qr-code-generator',
    'website-speed-test',
  ],
  relatedPrompts: ['utm-naming-convention-for-a-campaign'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
