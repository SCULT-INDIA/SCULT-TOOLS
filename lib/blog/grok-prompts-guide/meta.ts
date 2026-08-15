import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'grok-prompts-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/grok/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Grok Prompts That Actually Use Its Real-Time X Access',
  h1: "Grok's real edge is live X data — most prompts never touch it",
  targetKeyword: 'grok prompts',
  description:
    'Grok prompts built around what actually makes it distinct — real-time X/Twitter access and a looser register — not generic chatbot prompts run through a different model.',
  dek: 'Grok without its X integration is just another chat model. The prompts worth having are the ones that specifically lean on live social data, not the ones that would work identically in any other assistant.',
  sections: [
    {
      heading: 'What actually makes Grok worth using specifically',
      body: [
        [
          "Grok's genuine differentiator is real-time access to X/Twitter data — what people are actually saying right now, not a training-data snapshot from months ago — combined with a looser conversational register than most assistants default to. The ",
          { text: 'Grok prompt library', href: '/prompts/grok' },
          ' uses that difference directly rather than pretending Grok is a generic chatbot with a different name.',
        ],
      ],
    },
    {
      heading: 'Real-time brand and sentiment monitoring',
      body: [
        [
          'A ',
          {
            text: 'real-time brand sentiment scan on X',
            href: '/prompts/grok/grok-x-realtime-brand-sentiment-scan',
          },
          ' catches what is being said about a brand right now, not last week. Tracking ',
          {
            text: 'competitor mentions on X',
            href: '/prompts/grok/grok-competitor-x-mentions-report',
          },
          ' applies the same live-data advantage to competitive monitoring, and ',
          {
            text: 'comparing the actual narrative against genuine crowd sentiment',
            href: '/prompts/grok/grok-narrative-vs-crowd-sentiment-gap',
          },
          ' catches the gap between an official story and what people are actually saying underneath it.',
        ],
      ],
    },
    {
      heading: 'Breaking news and trending topics, synthesized live',
      body: [
        [
          'Synthesizing ',
          {
            text: 'breaking news as it develops live',
            href: '/prompts/grok/grok-breaking-news-live-synthesis',
          },
          ' and turning a ',
          {
            text: 'trending topic into a real content angle',
            href: '/prompts/grok/grok-trending-topic-content-angle-brief',
          },
          ' both depend on data that is, by definition, too recent for a model without live access to have any real read on.',
        ],
      ],
    },
    {
      heading: 'Fact-checking a viral claim before it spreads further',
      body: [
        [
          'A viral claim spreading on X right now needs verification against live discussion, not a training-data snapshot — ',
          {
            text: 'this fact-check prompt',
            href: '/prompts/grok/grok-viral-claim-fact-check',
          },
          ' is built specifically for that timing pressure.',
        ],
      ],
    },
    {
      heading: 'DeepSearch, Heavy, and steelmanning a decision',
      body: [
        [
          'For structured research, ',
          {
            text: 'a DeepSearch research brief',
            href: '/prompts/grok/grok-deepsearch-structured-research-brief',
          },
          " and Grok Heavy's ",
          {
            text: 'multi-agent scenario analysis',
            href: '/prompts/grok/grok-heavy-multiagent-scenario-analysis',
          },
          ' tackle genuinely complex questions from multiple angles at once. And for a decision that deserves real scrutiny before committing to it, ',
          {
            text: 'a steelman/red-team decision prompt',
            href: '/prompts/grok/grok-steelman-red-team-decision',
          },
          ' forces the strongest counter-argument rather than accepting the first plausible reasoning.',
        ],
      ],
    },
    {
      heading: 'Code Fast, contract review, and voice mode',
      body: [
        [
          'For quick, agentic bug fixes, ',
          {
            text: "Grok Code Fast's agentic bug-fix brief",
            href: '/prompts/grok/grok-code-fast-agentic-bug-fix-brief',
          },
          ' is built for speed. Long-context contract risk scanning, ',
          {
            text: 'covered here',
            href: '/prompts/grok/grok-long-context-contract-risk-scan',
          },
          ', handles a genuinely long document in one pass. And ',
          {
            text: 'a voice-mode assistant script',
            href: '/prompts/grok/grok-voice-mode-assistant-script',
          },
          ' is written for spoken, not typed, interaction specifically.',
        ],
      ],
    },
    {
      heading: 'Customer replies and community digests, grounded in real posts',
      body: [
        [
          'Drafting ',
          {
            text: 'customer complaint replies on X',
            href: '/prompts/grok/grok-x-customer-complaint-reply-drafts',
          },
          ' works from actual real posts, not a hypothetical. A ',
          {
            text: 'daily digest of a niche X community',
            href: '/prompts/grok/grok-niche-x-community-daily-digest',
          },
          ' condenses genuine, current community discussion rather than a generic industry summary.',
        ],
      ],
    },
    {
      heading: 'When social monitoring needs to become a real ongoing programme',
      body: [
        [
          'A single Grok prompt catches a moment. Ongoing brand monitoring, crisis response planning and coordinated social strategy across channels is a bigger, continuous programme — ',
          {
            text: "the kind Scult's marketing team runs",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through what ongoing monitoring would actually need.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'utm-builder'],
  relatedPrompts: ['grok-x-realtime-brand-sentiment-scan', 'grok-viral-claim-fact-check'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
