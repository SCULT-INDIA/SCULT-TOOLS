import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'gemini-prompts-guide'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/gemini/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Gemini Prompts: Using Long Context and Multimodal Input Properly',
  h1: 'Most Gemini prompts waste its two real advantages: context length and multimodal input',
  targetKeyword: 'gemini prompts',
  description:
    'Gemini prompts built around what actually differentiates it — a very long context window and native multimodal input — not generic chat prompts with the model name swapped.',
  dek: 'A prompt written for a generic chatbot and then just run through Gemini leaves its two biggest advantages on the table: how much it can hold in context at once, and what it can directly see, hear or extract from a photo or PDF.',
  sections: [
    {
      heading: 'Long context: analysis a shorter-context model literally cannot do',
      body: [
        [
          "Gemini's context window is large enough to hold genuinely long inputs — multiple full documents, a full contract, an entire codebase's worth of files — in one pass. The ",
          { text: 'Gemini prompt library', href: '/prompts/gemini' },
          "'s entries lean directly on that: ",
          {
            text: 'turning multiple long documents into one decision memo',
            href: '/prompts/gemini/gemini-long-context-multi-document-decision-memo',
          },
          ', a ',
          {
            text: 'contract redline diff analysis',
            href: '/prompts/gemini/gemini-contract-redline-diff-analysis',
          },
          ', a ',
          {
            text: 'multi-source comparison table',
            href: '/prompts/gemini/gemini-multi-source-comparison-table',
          },
          ', and ',
          {
            text: 'onboarding documentation generated from a full repository',
            href: '/prompts/gemini/gemini-codebase-onboarding-doc-full-repo',
          },
          ' — all tasks that specifically require holding a lot of material in view at once, not something a shorter-context model handles as well.',
        ],
      ],
    },
    {
      heading: 'Multimodal input: video, audio, photos, handled directly',
      body: [
        [
          'Gemini takes video, audio and images natively, which the library uses for genuinely practical tasks: ',
          {
            text: 'timestamped notes from a recorded meeting video',
            href: '/prompts/gemini/gemini-video-meeting-timestamped-notes',
          },
          ', ',
          {
            text: 'structured notes from lecture audio',
            href: '/prompts/gemini/gemini-lecture-audio-structured-notes',
          },
          ', turning ',
          {
            text: 'a photo of a whiteboard into an actual action plan',
            href: '/prompts/gemini/gemini-whiteboard-photo-action-plan',
          },
          ', and converting ',
          {
            text: 'a screenshot directly into frontend code',
            href: '/prompts/gemini/gemini-screenshot-to-frontend-code',
          },
          '. None of these require a separate transcription or OCR step first — Gemini processes the raw media directly.',
        ],
      ],
    },
    {
      heading: 'Document and image extraction: receipts, PDFs, papers, menus',
      body: [
        [
          'A batch of receipt photos becomes a structured expense list via ',
          {
            text: 'this extraction prompt',
            href: '/prompts/gemini/gemini-receipt-batch-expense-extraction',
          },
          ", and a financial PDF's embedded charts turn into actual usable data through ",
          {
            text: 'a dedicated chart-extraction prompt',
            href: '/prompts/gemini/gemini-financial-pdf-chart-data-extraction',
          },
          '. For research specifically, ',
          {
            text: 'critiquing figures in an academic paper',
            href: '/prompts/gemini/gemini-academic-paper-figure-critique',
          },
          ' and ',
          {
            text: 'translating and localising a photographed menu',
            href: '/prompts/gemini/gemini-photo-menu-translation-localization',
          },
          ' both lean on the same direct-image-understanding capability.',
        ],
      ],
    },
    {
      heading: 'Deep Research and grounding: verified, not just fluent',
      body: [
        [
          "Gemini's Deep Research mode produces a genuinely researched report rather than a fluent guess, briefed correctly via ",
          {
            text: 'this prompt',
            href: '/prompts/gemini/gemini-deep-research-report-brief',
          },
          '. Grounding — checking a claim against real, cited sources rather than trusting an unverified model assertion — is covered directly by ',
          {
            text: 'a fact-check and verification prompt',
            href: '/prompts/gemini/gemini-grounding-fact-check-verification',
          },
          ', worth using specifically when accuracy matters more than speed.',
        ],
      ],
    },
    {
      heading: 'Workspace integration: Gmail, Sheets, Docs, meetings',
      body: [
        [
          'Because Gemini is built into Google Workspace, several prompts lean on that integration directly: drafting ',
          {
            text: 'Gmail thread replies',
            href: '/prompts/gemini/gemini-gmail-thread-reply-drafting',
          },
          ', pulling an ',
          {
            text: 'insight brief from Sheets data',
            href: '/prompts/gemini/gemini-sheets-data-insight-brief',
          },
          ', a ',
          {
            text: 'meeting-prep brief',
            href: '/prompts/gemini/gemini-workspace-meeting-prep-brief',
          },
          ', and ',
          {
            text: 'structured review comments in Docs',
            href: '/prompts/gemini/gemini-docs-structured-review-comments',
          },
          ' — workflows a model without Workspace integration simply cannot replicate the same way.',
        ],
      ],
    },
    {
      heading: 'Structured extraction and Thinking mode',
      body: [
        [
          'For pulling data into a strict schema rather than loose prose, ',
          {
            text: 'structured JSON schema extraction',
            href: '/prompts/gemini/gemini-structured-json-schema-extraction',
          },
          " ensures the output actually parses. And Gemini's Thinking mode, calibrated for constraint-heavy planning tasks via ",
          {
            text: 'this prompt',
            href: '/prompts/gemini/gemini-thinking-mode-constraint-planning',
          },
          ', is worth reaching for specifically when a task has many interacting constraints a shallower pass would miss.',
        ],
      ],
    },
    {
      heading: 'When Gemini needs to be part of a real workflow, not a one-off task',
      body: [
        [
          "These prompts cover individual tasks well. Building Gemini's multimodal and long-context capabilities into an actual recurring business workflow — automated document processing, a research pipeline — is real engineering. ",
          {
            text: "That's what Scult's AI agents team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through what that would look like.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'word-counter'],
  relatedPrompts: [
    'gemini-long-context-multi-document-decision-memo',
    'gemini-grounding-fact-check-verification',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
