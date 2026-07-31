import type { Tool } from '../types'

export const meta: Tool = {
  slug: 'marketing-roi-calculator',
  category: 'seo',
  title: 'Marketing ROI Calculator',
  h1: 'Marketing ROI Calculator',
  description:
    'Calculate campaign ROI and ROAS together, with gross margin and hidden costs in the maths — so a 3× ROAS that quietly loses money cannot slip past you.',
  tagline: 'ROI and ROAS side by side, with margin — so the real number shows.',
  keywords: [
    'marketing roi calculator',
    'campaign roi calculator',
    'roas calculator',
    'roi vs roas',
    'return on ad spend calculator',
  ],
  related: [
    'utm-builder',
    'invoice-generator',
    'business-name-generator',
    'website-speed-test',
  ],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'B',
  serviceTarget: 'performance-marketing',
  updatedAt: '2026-07-29',
  owner: 'scult-growth',
  icon: 'TrendingUp',
  runsInBrowser: true,
  howToUse: [
    'Enter the campaign spend and the revenue attributed to it.',
    'Set your gross margin — the percentage of revenue you actually keep after delivering the product or service.',
    'Add any other campaign costs: agency fees, tools, creative production.',
    'Read the verdict, then compare the ROI and ROAS rows to see why they disagree.',
    'Open “Show the maths” to check every step with your own numbers plugged in.',
  ],
  howItWorks:
    'ROI = (revenue × gross margin − spend − other costs) ÷ (spend + other costs) × 100. ROAS = revenue ÷ spend. The two diverge because ROAS pretends every revenue rupee is a rupee kept, while ROI keeps only your margin and charges you for every cost. That makes break-even ROAS = 1 ÷ margin: at a 25% margin you need 4× ROAS before the first rupee of profit exists, so a campaign with a “good” 3× ROAS is losing 25 paise on every rupee spent. All arithmetic runs in integer paise and basis points, rounded once, and the verdict is derived from the same rounded profit figure that is displayed — so the label can never contradict the numbers beside it.',
  limitations: [
    'This is last-click, single-touch arithmetic: whatever revenue you attribute to the campaign gets full credit. Across multi-touch journeys, summing per-campaign ROI this way overstates the total.',
    'No incrementality adjustment. Some attributed revenue would have arrived without the campaign (brand searches, returning customers), so true ROI is usually lower than the number shown.',
    'Customer lifetime value is deliberately excluded: with a generous enough LTV multiplier, any campaign looks profitable. If repeat purchases matter, model them explicitly rather than inflating first-purchase revenue.',
  ],
  faq: [
    {
      q: 'What is a good marketing ROI?',
      a: 'Above 0% means the campaign is profitable after margin and costs; most teams aim for 100%+ — two rupees of gross profit back for every rupee spent. The often-quoted 5:1 revenue rule only holds near 20% margins, so always compute with your own margin instead of borrowing a benchmark.',
    },
    {
      q: 'What is the difference between ROI and ROAS?',
      a: 'ROAS is revenue ÷ spend and ignores what the revenue cost you to deliver. ROI applies your gross margin and subtracts every campaign cost, so it measures actual profit. A 3× ROAS at 25% margin is a −25% ROI — the same campaign, two opposite stories.',
    },
    {
      q: 'Should GST be included in the revenue figure?',
      a: 'No. GST is collected on behalf of the government and passed through, so it is not revenue you keep. Including it inflates both ROAS and ROI — at the 18% slab, by nearly a fifth. Use revenue net of GST, and keep spend net of GST too so both sides match.',
    },
    {
      q: 'Why does the calculator exclude customer lifetime value?',
      a: 'Because LTV is the easiest way to make a losing campaign look like a winner: multiply first-purchase revenue by an optimistic repeat rate and everything turns green. This tool measures what the campaign actually earned. If LTV genuinely matters in your business, model retention separately with real cohort data.',
    },
    {
      q: 'What gross margin should I use?',
      a: 'Gross margin = (revenue − direct cost of delivering it) ÷ revenue. For e-commerce that means after COGS, shipping and payment fees; for services, after delivery labour. If you only know your blended company margin, use that — it is far closer to the truth than the 100% that a plain ROAS number silently assumes.',
    },
  ],
}
