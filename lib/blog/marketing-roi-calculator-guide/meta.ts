import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'marketing-roi-calculator-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/**
 * Every formula checked against lib/tools/marketing-roi-calculator/logic.ts
 * directly — this tool computes ROI, ROAS, break-even ROAS, gross/net
 * profit only. No CPC/CPM/CAC/LTV tabs exist, and there is no currency
 * toggle (rupees only) — both corrected here, matching the earlier
 * fact-check on this tool's own meta.ts.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'tool',
  title: 'ROI vs ROAS: Why a "Good" 3x ROAS Can Still Be Losing Money',
  h1: 'Your ROAS looks great and your campaign is still losing money — here is why',
  targetKeyword: 'roi vs roas',
  description:
    'ROAS credits every rupee of revenue as profit. ROI charges your real margin and costs. A 3x ROAS at 25% margin is actually a -25% ROI — a free calculator that shows both, side by side.',
  dek: 'A 3x return on ad spend sounds like an obvious win. It can also be a campaign that is quietly losing money, and the only way to know which is true is to run the numbers through your actual gross margin — something ROAS, by definition, never does.',
  sections: [
    {
      heading: "The gap between 'revenue back' and 'profit back'",
      body: [
        [
          'ROAS (Return on Ad Spend) is revenue from the campaign divided by spend, full stop — a straightforward, useful number that answers exactly one question: how many rupees of revenue came back per rupee spent. What it never accounts for is what that revenue actually cost you to deliver. A ₹1,50,000 sale from a ₹50,000 ad spend is a clean 3x ROAS, and read in isolation, 3x sounds unambiguously good.',
        ],
        [
          'ROI (Return on Investment) asks a different, harder question: after the actual cost of delivering that revenue — cost of goods, service delivery time, whatever your real margin structure is — and after every other campaign cost beyond just the ad spend, is there real profit left over? The ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' on this site computes both figures side by side from the same inputs specifically so the gap between them cannot hide: enter spend, revenue, your gross margin percentage, and any other campaign costs (agency fees, tools, creative production), and it shows you the ROAS number next to the ROI number that same campaign actually produced.',
        ],
      ],
    },
    {
      heading: 'The exact maths behind the "3x ROAS, -25% ROI" example',
      body: [
        [
          'Take that same ₹1,50,000-revenue, ₹50,000-spend campaign, and assume a 25% gross margin — meaning 25% of revenue is actual profit after the real cost of delivering it, and the other 75% covers what it cost to produce or deliver. Gross profit is revenue times margin: ₹1,50,000 × 25% = ₹37,500. Total cost is spend plus any other costs: ₹50,000. Net profit is gross profit minus total cost: ₹37,500 − ₹50,000 = −₹12,500. ROI percent is net profit divided by total cost, times 100: −₹12,500 ÷ ₹50,000 × 100 = −25%.',
        ],
        [
          'Same campaign, same numbers, two completely opposite verdicts: ROAS says 3x and looks like a clear win; ROI says −25% and reveals an actual loss. The entire gap is the margin — ROAS credits every rupee of revenue as if it were pure profit, while ROI correctly charges the 75% that revenue cost to actually deliver.',
        ],
      ],
    },
    {
      heading: 'Break-even ROAS: the one number that reframes everything',
      body: [
        [
          'Break-even ROAS is one divided by your gross margin — the exact ROAS a campaign needs to hit before it breaks even on profit, given your specific margin, not some generic benchmark from a blog post. At a 25% margin, break-even ROAS is 1 ÷ 0.25 = 4x — meaning any campaign returning less than 4x ROAS at that margin is actively losing money, no matter how good 3x or even 3.5x might sound in isolation. At a 50% margin, break-even ROAS drops to 2x. At a thin 10% margin, break-even ROAS jumps to a demanding 10x.',
        ],
        [
          'This single number is why "what\'s a good ROAS" has no universal answer, and why borrowing an industry benchmark from a blog post is actively risky: a "good ROAS" is entirely a function of your specific margin, and a business with a 15% margin needs a dramatically higher ROAS to actually profit than a business with a 60% margin selling the exact same revenue number.',
        ],
      ],
    },
    {
      heading: 'What this calculator deliberately does not do',
      body: [
        [
          'Two honest scope limits worth knowing before you rely on it. First, it uses last-click attribution: revenue you enter gets full credit toward that one campaign, so if you are summing results across a multi-touch customer journey — several campaigns each contributing to one eventual sale — adding those campaign-level figures together will overstate your true total ROI, since more than one campaign is claiming credit for overlapping revenue.',
        ],
        [
          'Second, and more deliberate: there is no lifetime-value or incrementality adjustment, and that is a considered choice rather than a missing feature. LTV is one of the easiest ways to make a genuinely losing campaign look like a winner on paper — multiply first-purchase revenue by an optimistic assumed repeat-purchase rate, and almost any number turns green. This calculator measures only what a campaign actually, verifiably earned on the numbers you enter. If LTV genuinely matters for your specific business model, model retention separately using real cohort data, not an assumption bolted onto a single-campaign calculator.',
        ],
        [
          'One more scope note: this tool computes exactly ROI, ROAS, break-even ROAS, and gross/net profit — not separate CPC, CPM, CAC or LTV calculators bundled into the same interface. If those are the numbers you need, they belong in dedicated calculations built around their own specific inputs (click data, impression data, full acquisition-cost accounting) rather than folded into a margin-based ROI tool that would only approximate them poorly.',
        ],
      ],
    },
    {
      heading: 'A note on GST that quietly inflates both numbers',
      body: [
        [
          'GST is collected on behalf of the government and passed through — it was never revenue you actually kept, so including it in your revenue figure inflates both ROAS and ROI in a way that overstates real performance. At the common 18% GST slab, that inflation is close to a fifth of the reported figure — not a rounding error, a meaningfully misleading number if left in. Enter revenue net of GST, and keep your spend figure net of GST too, so both sides of the calculation match on the same basis.',
        ],
      ],
    },
    {
      heading: 'Worked example: deciding whether to scale a campaign',
      body: [
        [
          'Say a campaign is spending ₹80,000 with ₹2,80,000 in attributed revenue, ₹10,000 in other costs (creative production, a small agency retainer), and your business runs a genuine 30% gross margin after real delivery costs. Enter those four figures into the calculator and read both numbers side by side: the ROAS (3.5x) and the ROI percentage the same inputs actually produce once margin and total costs are correctly applied. Compare the ROI figure specifically against your break-even ROAS at that 30% margin (1 ÷ 0.30 ≈ 3.33x) before deciding whether "scale this campaign" is actually the right call or a decision made on the flattering ROAS number alone.',
        ],
        [
          "If you are running this campaign across multiple channels and need consistent attribution to actually trust the revenue figure you're entering here, tag every campaign link first with the ",
          { text: 'UTM Campaign URL Builder', href: '/seo/utm-builder' },
          ' — the ROI number is only as trustworthy as the revenue attribution feeding it.',
        ],
      ],
    },
    {
      heading: 'When margin-based ROI stops being enough',
      body: [
        [
          "A single-campaign calculator answers 'was this specific campaign profitable.' It cannot decide which channels deserve more budget across an entire marketing programme, cannot correct for multi-touch attribution across a real customer journey, and cannot model genuine lifetime value with real cohort data rather than an optimistic assumption. That level of analysis is where ",
          { text: "Scult's ad management team", href: SERVICE.href, external: true },
          ' actually operates — reading real, multi-channel performance data and making the budget-allocation calls a single-campaign ROI number cannot make on its own.',
        ],
        [
          'Want a second opinion on whether your current ad spend is actually profitable once margin is properly accounted for? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' and bring your real numbers.',
        ],
      ],
    },
  ],
  relatedTools: [
    'marketing-roi-calculator',
    'utm-builder',
    'invoice-generator',
    'website-speed-test',
  ],
  relatedPrompts: ['campaign-metrics-to-performance-narrative'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
