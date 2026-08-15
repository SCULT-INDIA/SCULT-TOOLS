import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'free-marketing-roi-calculator-no-dashboard'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Every claim checked against lib/tools/marketing-roi-calculator/logic.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'Free Marketing ROI Calculator — No Analytics Dashboard Subscription',
  h1: "Do you need a full analytics platform just to check one campaign's real ROI?",
  targetKeyword: 'free marketing roi calculator',
  description:
    'ROI and ROAS side by side, with margin and costs correctly applied — free, no dashboard subscription. For checking one campaign right now, not building an ongoing analytics system.',
  dek: 'Full marketing analytics platforms earn their subscription managing dozens of channels over time. For checking whether one specific campaign is actually profitable right now, that is more infrastructure than the question needs.',
  sections: [
    {
      heading: 'What a paid analytics platform is actually for',
      body: [
        [
          'Marketing analytics and attribution platforms genuinely earn a subscription fee at real scale: pulling data automatically from many ad platforms, tracking dozens of campaigns over months, and modelling multi-touch attribution across a real customer journey. That is substantial, valuable infrastructure for a team running continuous, complex campaigns across many channels.',
        ],
        [
          'For a single, specific question — is this one campaign, right now, with these numbers, actually profitable once real margin is applied — the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' answers it directly: enter spend, revenue, margin and other costs, and see ROI, ROAS, and break-even ROAS side by side, for free, in seconds.',
        ],
      ],
    },
    {
      heading: 'The one calculation a dashboard often glosses over',
      body: [
        [
          'Many analytics dashboards surface ROAS prominently because it is simple to compute from ad-platform data alone (revenue divided by spend) — but ROAS credits every rupee of revenue as profit, which it is not. This calculator forces the margin question by requiring it as an input, showing the real ROI figure the same numbers produce once your actual cost of delivering that revenue is accounted for.',
        ],
      ],
    },
    {
      heading: 'Break-even ROAS: the number worth checking before trusting any dashboard',
      body: [
        [
          'Break-even ROAS — 1 divided by your gross margin — is the ROAS your specific business needs just to avoid losing money, and it varies enormously by margin: 2x at 50% margin, 4x at 25%, 10x at 10%. A dashboard showing "3x ROAS, looking good" without that context can be actively misleading if your real margin puts break-even above 3x.',
        ],
      ],
    },
    {
      heading: 'What this free tool honestly does not replace',
      body: [
        [
          'No automatic data pulls from ad platforms — you enter figures manually, ideally tagged consistently with the ',
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' first so the revenue figure you enter is trustworthy. No multi-touch attribution, no ongoing trend tracking across months. Those are real, different capabilities a dedicated platform provides at scale.',
        ],
      ],
    },
    {
      heading: 'When a real platform and real strategy become worth it',
      body: [
        [
          'Once you are managing enough channels that manual entry becomes the bottleneck, or need genuine multi-touch attribution across a complex journey, ',
          {
            text: "that's the scale Scult's ad management team operates at",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          " to talk through whether you're there yet.",
        ],
      ],
    },
  ],
  relatedTools: ['marketing-roi-calculator', 'utm-builder', 'invoice-generator'],
  relatedPrompts: ['campaign-metrics-to-performance-narrative'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 9,
}
