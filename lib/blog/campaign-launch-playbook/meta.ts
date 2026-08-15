import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'campaign-launch-playbook'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Running a Sale Campaign End to End: Tagging, Copy, ROI',
  h1: 'A seasonal sale campaign, done right from tagging through to the real ROI number',
  targetKeyword: 'seasonal sale campaign checklist',
  description:
    'A creative brief, platform-aware ad copy, consistent UTM tagging, and a real ROI check after — a complete seasonal campaign playbook using free tools and prompts.',
  dek: 'A seasonal sale campaign has a real order of operations — creative brief, then copy, then tagging, then a genuine ROI check afterward. Skipping any one step is exactly where campaigns quietly lose money.',
  sections: [
    {
      heading: 'Before the ads: a real creative brief',
      body: [
        [
          'Turn the campaign goal into an actual ',
          {
            text: 'creative brief',
            href: '/prompts/ads/campaign-goal-to-creative-brief',
          },
          ' before writing any ad copy — skipping straight to copy without a brief is the most common way campaign creative ends up generic.',
        ],
      ],
    },
    {
      heading: 'Copy: platform-aware, from day one',
      body: [
        [
          'Generate ',
          {
            text: 'Google and Meta ad copy variants',
            href: '/prompts/ads/google-meta-ad-copy-variants',
          },
          " respecting each platform's real character limits, and test landing page ",
          {
            text: 'headline variants',
            href: '/prompts/ads/landing-page-headline-ab-test-variants',
          },
          ' since the ad only earns the click — the landing page has to close it.',
        ],
      ],
    },
    {
      heading: 'Tagging: consistent, before the first click',
      body: [
        [
          'Tag every campaign link with the ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          " using a fixed naming convention decided once — this is the step that determines whether next month's report is trustworthy or fragmented.",
        ],
      ],
    },
    {
      heading: 'If the campaign extends offline: QR codes',
      body: [
        [
          'For any printed or in-store component, a static ',
          { text: 'QR code', href: '/dev/qr-code-generator' },
          ' encoding the tagged campaign URL extends the same attribution to offline placements without a redirect service.',
        ],
      ],
    },
    {
      heading: 'After the campaign: the real ROI check',
      body: [
        [
          'Run the actual spend and revenue through the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' with your real gross margin before deciding to scale — ROAS alone can look like a win while ROI is genuinely negative. Turn the numbers into a real ',
          {
            text: 'performance narrative',
            href: '/prompts/ads/campaign-metrics-to-performance-narrative',
          },
          ' for stakeholders.',
        ],
      ],
    },
    {
      heading: 'What this playbook does not replace',
      body: [
        [
          'This covers one campaign done well. Deciding budget allocation across multiple ongoing channels, and continuous bid management, is real active account work — ',
          {
            text: "the kind Scult's ad management team runs day to day",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Talk through your campaign plan',
      body: [
        [
          'Planning a bigger campaign than one channel can absorb alone? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['utm-builder', 'marketing-roi-calculator', 'qr-code-generator'],
  relatedPrompts: [
    'campaign-goal-to-creative-brief',
    'campaign-metrics-to-performance-narrative',
  ],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
