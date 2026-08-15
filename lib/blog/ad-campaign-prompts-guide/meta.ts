import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ad-campaign-prompts-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/ads/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Ad Campaign Prompts: The Thinking Before the UTM Tag',
  h1: 'Before you tag a link, you have to decide what the campaign actually says',
  targetKeyword: 'ad campaign prompts',
  description:
    'Campaign copy, creative briefs and performance narratives with real platform constraints — the thinking that happens before UTM tagging, and the analysis after.',
  dek: 'A UTM Builder tags a link correctly. It has nothing to say about what the ad actually says, who it targets, or what the resulting numbers mean — that thinking happens before and after the tagging step.',
  sections: [
    {
      heading: 'What comes before and after a tagged link',
      body: [
        [
          'Tagging a URL correctly is a small, mechanical step. The real work is deciding what the campaign says, who it targets, and what the resulting numbers actually mean once traffic arrives — the ',
          { text: 'Ads & Campaigns prompt library', href: '/prompts/ads' },
          ' covers exactly that thinking, before and after the ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' does its own narrower job.',
        ],
        [
          'The naming-convention prompt itself — ',
          {
            text: 'a UTM naming convention for a campaign',
            href: '/prompts/ads/utm-naming-convention-for-a-campaign',
          },
          ' — lives in this category precisely because naming discipline is a strategic decision made once, not a mechanical tagging task repeated per link.',
        ],
      ],
    },
    {
      heading: 'Creative: from goal to brief to actual copy',
      body: [
        [
          'Turning a campaign goal into a real creative brief — ',
          { text: 'this prompt', href: '/prompts/ads/campaign-goal-to-creative-brief' },
          ' — is the step most teams skip, jumping straight to writing ad copy without first agreeing on what the creative is actually meant to achieve. Once the brief exists, generating ',
          {
            text: 'Google and Meta ad copy variants',
            href: '/prompts/ads/google-meta-ad-copy-variants',
          },
          " respects each platform's real character constraints rather than writing one generic version and hoping it fits both.",
        ],
      ],
    },
    {
      heading: 'Audience and landing page: the two things creative alone cannot fix',
      body: [
        [
          'Brainstorming audience segmentation — ',
          { text: 'this prompt', href: '/prompts/ads/audience-segmentation-brainstorm' },
          ' — matters because even great creative underperforms against the wrong audience. And testing landing page headline variants — ',
          {
            text: 'covered here',
            href: '/prompts/ads/landing-page-headline-ab-test-variants',
          },
          " — recognises that the ad's job ends at the click; the landing page has to close what the ad opened.",
        ],
      ],
    },
    {
      heading: 'Email and competitive intelligence',
      body: [
        [
          'Writing campaign email subject lines — ',
          { text: 'this prompt', href: '/prompts/ads/campaign-email-subject-lines' },
          " — applies the same platform-aware thinking to a different channel. And analysing a competitor's actual ad copy — ",
          { text: 'covered here', href: '/prompts/ads/competitor-ad-copy-analysis' },
          ' — turns what a rival is running into genuine competitive intelligence rather than a vague impression.',
        ],
      ],
    },
    {
      heading: 'After the campaign runs: turning numbers into a narrative',
      body: [
        [
          'Once real data comes in, turning campaign metrics into an actual performance narrative — ',
          {
            text: 'this prompt',
            href: '/prompts/ads/campaign-metrics-to-performance-narrative',
          },
          ' — is what makes a report genuinely useful to a stakeholder rather than a spreadsheet of numbers with no story attached. Feed those same numbers into the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' first, so the narrative is built on real ROI and ROAS figures rather than raw spend and revenue alone.',
        ],
      ],
    },
    {
      heading: 'What good prompting cannot fix: the media plan itself',
      body: [
        [
          'These prompts sharpen the thinking around a campaign. They cannot decide the actual media plan, budget allocation across channels, or bidding strategy — decisions that need real, ongoing account management. ',
          {
            text: "That's exactly what Scult's ad management team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your current campaigns.',
        ],
      ],
    },
  ],
  relatedTools: ['utm-builder', 'marketing-roi-calculator'],
  relatedPrompts: [
    'campaign-goal-to-creative-brief',
    'campaign-metrics-to-performance-narrative',
  ],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
