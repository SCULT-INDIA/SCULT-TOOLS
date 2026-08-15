import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'google-ads-service-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'service',
  title: 'Running Your Own Google Ads vs. Hiring an Agency: the Real ROI Question',
  h1: 'Your ROAS looks fine. Have you actually checked your ROI?',
  targetKeyword: 'google ads management agency',
  description:
    'A UTM Builder and an ROI calculator get your tracking right. What they cannot do is manage bids, write creative, or decide budget across channels — that is ongoing account management.',
  dek: "Correctly tagged links and an accurate ROI number tell you whether a campaign made money. They do not run the campaign, write the creative, or decide where next month's budget should actually go.",
  sections: [
    {
      heading: 'What the free tools here get right about your numbers',
      body: [
        [
          'Consistent, correctly-tagged campaign links from the ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' mean your reports actually reflect reality instead of fragmenting across inconsistent naming. The ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' then tells you the real story behind those numbers — specifically the gap between ROAS (which credits every rupee of revenue as profit) and ROI (which correctly charges your actual margin and costs). Getting both of those right is the difference between a report you can trust and one you cannot.',
        ],
      ],
    },
    {
      heading: 'What accurate reporting still does not do for you',
      body: [
        [
          "Knowing a campaign's real ROI is diagnostic, not prescriptive — it tells you whether last month's spend was profitable, not what to do about it. It does not decide bid strategy, write ad copy that actually converts, or allocate budget correctly across Search, Display, Shopping and YouTube for your specific business. Those are ongoing, active management decisions, not a number you check once a month.",
        ],
      ],
    },
    {
      heading: 'What ongoing account management actually involves',
      body: [
        [
          'Real Google Ads management means continuous bid and budget optimization as auction dynamics shift, ad copy testing and iteration — the ',
          { text: 'ad campaign prompt library', href: '/prompts/ads' },
          ' covers the creative-brief thinking behind this, but running the actual testing loop consistently is different work — audience refinement based on what the data is actually showing, and genuine cross-channel budget allocation decisions made with a full view of performance across every channel at once, not one campaign in isolation.',
        ],
        [
          'This is exactly what ',
          { text: "Scult's ad management team", href: SERVICE.href, external: true },
          ' does day to day — the ongoing, active management layer that sits on top of accurate ROI reporting, not a replacement for getting your own numbers right first.',
        ],
      ],
    },
    {
      heading: 'The honest gut-check on whether you need active management',
      body: [
        [
          'If you are running a small, occasional campaign with a modest budget and the time to check on it weekly yourself, self-managed campaigns with the free tools above genuinely work fine. The signal that active management starts paying for itself: your ad spend has grown large enough that a few percentage points of efficiency gain is worth real money, or you genuinely do not have the bandwidth to check performance and adjust bids consistently, and campaigns are drifting on autopilot as a result.',
        ],
      ],
    },
    {
      heading: 'Worked example: the ROI check that should happen before scaling spend',
      body: [
        [
          'Before increasing budget on a campaign that "looks like it\'s working," run its actual numbers through the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' with your real gross margin, not an assumed 100%. A campaign at 3x ROAS and a 25% margin is genuinely losing money — scaling that spend scales the loss, not the profit. Checking this before increasing budget is the single highest-leverage five minutes you can spend on a growing ad account.',
        ],
      ],
    },
    {
      heading: 'Talk through your actual numbers first',
      body: [
        [
          'Run your numbers through the calculator, then ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          " and bring the real figures — we'll tell you honestly whether active management would move the needle for your specific spend level.",
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
  readingMinutes: 12,
}
