import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'perplexity-prompts-guide'
const SERVICE = resolveServiceLink('seo-companies-for-small-business', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/perplexity/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Perplexity Prompts for Research That Actually Cites Its Sources',
  h1: 'Perplexity is a research engine, not a chatbot — prompt it like one',
  targetKeyword: 'perplexity prompts',
  description:
    'Perplexity prompts structured for citation-first answers and source triangulation — not generic questions that waste its actual advantage over a plain chatbot.',
  dek: "Perplexity's real differentiator is citing real, checkable sources for every claim. A prompt that asks it a vague question the way you'd ask any chatbot wastes that entirely.",
  sections: [
    {
      heading: 'Why "just ask it a question" undersells Perplexity',
      body: [
        [
          'Perplexity exists specifically to answer with cited, checkable sources rather than an unverifiable fluent guess. Treating it like a generic chatbot and asking a loose question wastes that structural advantage. The ',
          { text: 'Perplexity prompt library', href: '/prompts/perplexity' },
          ' is written around citation-first, source-triangulating research, not casual conversation.',
        ],
        [
          'The foundational prompt for framing ',
          {
            text: 'a genuine deep-research question',
            href: '/prompts/perplexity/perplexity-deep-research-question-brief',
          },
          ' matters because a vague question produces a vague, thin research pass — the framing itself is most of the work.',
        ],
      ],
    },
    {
      heading: 'Verification: the specific job a citation-first tool is for',
      body: [
        [
          'Two prompts address verification directly: ',
          {
            text: 'checking sources against each other rather than trusting a single one',
            href: '/prompts/perplexity/perplexity-source-triangulation-check',
          },
          ', and ',
          {
            text: 'auditing whether cited sources actually say what a summary claims they say',
            href: '/prompts/perplexity/perplexity-citation-accuracy-audit',
          },
          ' — a real risk, since even a citation-first tool can occasionally misrepresent what a cited source actually states.',
        ],
        [
          'For claims specifically: ',
          {
            text: 'fact-checking a specific claim',
            href: '/prompts/perplexity/perplexity-claim-fact-check',
          },
          ', verifying ',
          {
            text: 'health claims against real evidence',
            href: '/prompts/perplexity/perplexity-health-claim-evidence-check',
          },
          ', and checking ',
          {
            text: 'breaking news claims',
            href: '/prompts/perplexity/perplexity-breaking-news-verification-check',
          },
          ' all lean on the same verification structure applied to different domains.',
        ],
      ],
    },
    {
      heading: 'Spaces and Labs: organised, ongoing research',
      body: [
        [
          'A Perplexity Space with ',
          {
            text: 'proper project instructions',
            href: '/prompts/perplexity/perplexity-space-project-instructions',
          },
          ' keeps ongoing research organised rather than scattered across disconnected chats. A ',
          {
            text: 'competitor-landscape Space',
            href: '/prompts/perplexity/perplexity-competitor-landscape-space',
          },
          ' applies that structure to competitive research specifically, and Perplexity Labs, briefed correctly for ',
          {
            text: 'a mini-report',
            href: '/prompts/perplexity/perplexity-labs-mini-report-brief',
          },
          ' or built into ',
          {
            text: 'a shareable Pages report',
            href: '/prompts/perplexity/perplexity-pages-shareable-report',
          },
          ', turns research into something presentable rather than a raw chat transcript.',
        ],
      ],
    },
    {
      heading: 'Business research: due diligence, trends, decisions',
      body: [
        [
          'A structured ',
          {
            text: 'company due-diligence brief',
            href: '/prompts/perplexity/perplexity-company-due-diligence-brief',
          },
          ', tracking ',
          {
            text: "what's changed since your last check on a topic",
            href: '/prompts/perplexity/perplexity-whats-changed-since-last-check',
          },
          ', ',
          {
            text: 'trend analysis with real citations',
            href: '/prompts/perplexity/perplexity-trend-analysis-with-citations',
          },
          ', and a ',
          {
            text: 'structured buying-decision comparison',
            href: '/prompts/perplexity/perplexity-structured-buying-decision-comparison',
          },
          ' cover the recurring business-research patterns worth having a template for rather than reinventing each time.',
        ],
      ],
    },
    {
      heading: 'Niche uses: Reddit sentiment, visual search, regulatory checklists',
      body: [
        [
          'Real-world experience threads on Reddit, surfaced through ',
          {
            text: 'a dedicated focus prompt',
            href: '/prompts/perplexity/perplexity-reddit-focus-real-world-experience',
          },
          ', capture a genuinely different signal than official sources. Visual search — identifying something from an image — is covered by ',
          {
            text: 'this prompt',
            href: '/prompts/perplexity/perplexity-visual-search-identification-brief',
          },
          ', and turning a regulation into ',
          {
            text: 'an actual compliance checklist',
            href: '/prompts/perplexity/perplexity-regulatory-compliance-checklist',
          },
          ' makes a dense document genuinely actionable.',
        ],
      ],
    },
    {
      heading: 'Comet and finding primary sources',
      body: [
        [
          'For a genuinely multi-step task, briefing Comet correctly (',
          {
            text: 'a multistep task brief',
            href: '/prompts/perplexity/perplexity-comet-multistep-task-brief',
          },
          ') matters more than for a single-question ask. And when a summary is not enough, ',
          {
            text: 'finding the actual primary source behind a claim',
            href: '/prompts/perplexity/perplexity-find-primary-source',
          },
          " is worth doing explicitly rather than trusting a secondary summary's framing.",
        ],
      ],
    },
    {
      heading: 'When Perplexity research needs to feed real content strategy',
      body: [
        [
          'Getting a well-researched, cited answer is the input. Turning that into content that ranks and gets cited by AI engines itself is a separate skill — ',
          { text: "the work Scult's SEO team does", href: SERVICE.href, external: true },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your content strategy.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'faq-schema-generator'],
  relatedPrompts: [
    'perplexity-deep-research-question-brief',
    'perplexity-citation-accuracy-audit',
  ],
  serviceTarget: 'seo-companies-for-small-business',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
