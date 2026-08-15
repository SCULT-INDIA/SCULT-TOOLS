import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'sales-outreach-prompts-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/sales/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Sales Prompts for Every Stage: Outreach, Discovery, Negotiation, Renewal',
  h1: "Sales prompts that respect the reader's inbox, not spray-and-pray outreach",
  targetKeyword: 'sales outreach prompts',
  description:
    'Cold outreach that earns a reply, discovery-call scripts grounded in MEDDIC, objection handling, and renewal talk tracks — prompts for every real stage of a deal.',
  dek: "A full sales cycle has a dozen distinct moments that each need different writing — a cold email is not a discovery script is not a renewal conversation. This library treats each stage as genuinely different, not one generic 'sales prompt' template.",
  sections: [
    {
      heading: 'Outreach: earning a reply, not blasting a template',
      body: [
        [
          'A ',
          {
            text: 'cold email built around a single, specific trigger signal',
            href: '/prompts/sales/sales-cold-email-single-trigger-signal',
          },
          ' beats a generic template blasted to a list — genuine relevance is what earns a reply. A ',
          {
            text: 'cold call opener with a voicemail-drop backup',
            href: '/prompts/sales/sales-cold-call-opener-and-voicemail-drop',
          },
          ' handles both outcomes of an outreach call. A ',
          {
            text: 'two-touch LinkedIn prospecting sequence',
            href: '/prompts/sales/sales-linkedin-two-touch-prospecting',
          },
          ', a ',
          {
            text: 'personalized video outreach script',
            href: '/prompts/sales/sales-personalized-video-outreach-script',
          },
          ', and a ',
          {
            text: 'warm referral introduction request',
            href: '/prompts/sales/sales-warm-referral-intro-request',
          },
          ' round out the channels a real outreach cadence actually uses.',
        ],
      ],
    },
    {
      heading: 'Discovery: MEDDIC, multi-threading, and real objections',
      body: [
        [
          'A ',
          {
            text: 'MEDDIC-structured discovery call question script',
            href: '/prompts/sales/sales-meddic-discovery-call-question-script',
          },
          ' uncovers real qualification criteria rather than a surface-level needs list. Multi-threading a single-threaded deal — ',
          {
            text: 'this prompt',
            href: '/prompts/sales/sales-multi-threading-single-threaded-deal',
          },
          ' — is often what actually saves a deal that stalls with only one contact. And isolating the real objection behind a stated one — ',
          {
            text: 'covered here',
            href: '/prompts/sales/sales-isolate-real-objection-response-script',
          },
          ' — beats responding to whatever objection was said out loud, which is frequently not the actual concern.',
        ],
      ],
    },
    {
      heading: 'Building the case: proposals, demos, and business cases',
      body: [
        [
          'Tailoring ',
          {
            text: 'a proposal to actual discovery findings',
            href: '/prompts/sales/sales-tailor-proposal-to-discovery-findings',
          },
          ' beats a generic template with the company name swapped in. A ',
          {
            text: 'demo agenda built from discovery findings',
            href: '/prompts/sales/sales-demo-agenda-from-discovery-findings',
          },
          ' shows exactly what the specific prospect cares about rather than a generic feature tour. And a ',
          {
            text: 'CFO-facing ROI business case one-pager',
            href: '/prompts/sales/sales-cfo-roi-business-case-onepager',
          },
          ' — pair the resulting figures with the ',
          { text: 'Marketing ROI Calculator', href: '/seo/marketing-roi-calculator' },
          ' for real numbers — speaks the specific language a finance stakeholder actually evaluates a deal by.',
        ],
      ],
    },
    {
      heading: 'Closing: negotiation, stalls, and mutual action plans',
      body: [
        [
          'A genuine ',
          {
            text: 'negotiation and concession strategy',
            href: '/prompts/sales/sales-negotiation-concession-strategy',
          },
          ' plans concessions in advance rather than improvising under pressure. Recovering ',
          {
            text: 'a deal that stalled after real interest',
            href: '/prompts/sales/sales-stall-after-interest-recovery',
          },
          ' addresses the specific, common pattern of a prospect going quiet post-demo. And a ',
          {
            text: 'mutual action plan builder',
            href: '/prompts/sales/sales-mutual-action-plan-builder',
          },
          ' gets both sides genuinely committed to a closing timeline rather than one side chasing.',
        ],
      ],
    },
    {
      heading: 'Internal alignment: champions, risk, and forecast honesty',
      body: [
        [
          'An internal ',
          {
            text: 'champion enablement one-pager',
            href: '/prompts/sales/sales-champion-enablement-internal-pitch-onepager',
          },
          ' arms a buyer-side advocate to sell internally on your behalf. A ',
          {
            text: 'deal risk assessment before a forecast call',
            href: '/prompts/sales/sales-deal-risk-assessment-before-forecast-call',
          },
          ' keeps a forecast honest rather than optimistic, and a ',
          {
            text: 'competitor battle card',
            href: '/prompts/sales/sales-competitor-battle-card-builder',
          },
          ' prepares for objections a competitor is likely to raise before they come up live.',
        ],
      ],
    },
    {
      heading: 'After the close: handoff, renewal, and post-mortems',
      body: [
        [
          'A ',
          {
            text: 'sales-to-CS handoff brief at close',
            href: '/prompts/sales/sales-to-cs-handoff-brief-at-close',
          },
          ' prevents context loss the moment a deal closes. A ',
          {
            text: 'renewal QBR agenda',
            href: '/prompts/sales/sales-qbr-agenda-for-renewing-account',
          },
          ' and a ',
          {
            text: 'renewal/upsell value talk track',
            href: '/prompts/sales/sales-renewal-upsell-value-talk-track',
          },
          ' keep an existing account genuinely engaged rather than treating renewal as an afterthought. And a ',
          {
            text: 'lost-deal post-mortem analysis',
            href: '/prompts/sales/sales-lost-deal-post-mortem-analysis',
          },
          ' turns a loss into a real, specific lesson rather than a vague "the timing wasn\'t right."',
        ],
      ],
    },
    {
      heading: 'When sales prompts need a real, run pipeline behind them',
      body: [
        [
          'Good scripts and templates improve individual conversations. A genuinely full-funnel sales and marketing operation — lead generation feeding a pipeline these prompts then work — is a bigger, ongoing programme. ',
          {
            text: "That's exactly what Scult's ad management and growth team runs",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your pipeline.',
        ],
      ],
    },
  ],
  relatedTools: ['marketing-roi-calculator', 'invoice-generator'],
  relatedPrompts: [
    'sales-cold-email-single-trigger-signal',
    'sales-meddic-discovery-call-question-script',
  ],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
