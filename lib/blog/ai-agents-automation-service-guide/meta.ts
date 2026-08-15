import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-agents-automation-service-guide'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'service',
  title: 'From a Working ChatGPT Prompt to a Real AI Agent in Production',
  h1: 'A prompt that works in a chat window and an agent in production are not the same thing',
  targetKeyword: 'ai agent development company',
  description:
    'A well-crafted prompt handles one task well, once, in a chat window. A real production agent needs guardrails, observability, and evaluation — genuine engineering, not a longer prompt.',
  dek: "Free prompt libraries and a checker score your site's AI visibility. Neither builds the actual production system a business-critical AI agent needs to run reliably, safely, and observably at real scale.",
  sections: [
    {
      heading: 'What a really good prompt gets you',
      body: [
        [
          'A well-structured, tested prompt handles a specific task reliably in a chat interface — the ',
          { text: 'AI Agents & RAG prompt library', href: '/prompts/ai-engineering' },
          ' covers the genuine architectural decisions behind chunking strategy, retrieval, agent planning and guardrails. Used well, that gets a prototype or a personal workflow working convincingly, fast.',
        ],
      ],
    },
    {
      heading: 'The gap between a working prototype and a production agent',
      body: [
        [
          'A prototype tested by one person, a handful of times, in a controlled setting is a genuinely different reliability bar than an agent handling real customer interactions or business-critical tasks unattended. Production needs guardrails that actually prevent the specific bad outcomes a business cannot tolerate, not just a hopeful instruction the model might follow. It needs observability — real tracing so a failure can be debugged after the fact, not guessed at. And it needs a genuine evaluation suite that catches regressions before they reach real users, not a vibe check run once during development.',
        ],
      ],
    },
    {
      heading: 'Why AI visibility and agent-readiness are related, not the same',
      body: [
        [
          'The ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          ' answers a genuinely different question: can AI crawlers read your public site content. Building an agent that acts on behalf of your business — answering support questions, processing internal requests, automating a workflow — is a separate engineering problem with its own security, reliability and monitoring requirements that a public-content visibility score does not touch at all.',
        ],
      ],
    },
    {
      heading: 'What real production-grade agent work looks like',
      body: [
        [
          'This is exactly the work ',
          {
            text: "Scult's AI agents and automation team does",
            href: SERVICE.href,
            external: true,
          },
          ': taking a validated prompt or a working prototype and building the actual production system around it — guardrails against the specific failure modes that matter for your use case, observability so problems are debuggable, and an evaluation harness that catches regressions before real users see them.',
        ],
      ],
    },
    {
      heading: 'The honest signal for when a prompt needs to become a real build',
      body: [
        [
          'If an AI workflow is personal or low-stakes — helping you draft something, summarising a document for your own use — a good prompt genuinely is the whole solution, and building more around it would be pure overhead. The signal that real engineering is warranted: the agent is customer-facing, handles anything sensitive, or a failure would have a real business cost — at that point, the guardrails and observability stop being nice-to-haves and become the actual point.',
        ],
      ],
    },
    {
      heading: 'A worked example: a support bot that needs to actually be trusted',
      body: [
        [
          "A prompt that answers customer questions well in testing still needs real guardrails before going live: what happens when a customer asks something the bot should not answer unilaterally, how is a hallucinated or wrong answer caught before it reaches a customer, and how do you know, weeks later, whether the bot's accuracy has quietly degraded. None of those are prompt-writing problems — they are the actual engineering work of a production AI system.",
        ],
      ],
    },
    {
      heading: 'Talk through what your specific use case actually needs',
      body: [
        [
          'Have a prompt or prototype that works and want to know what it takes to run it safely in production? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' and we\'ll give you a real, specific answer rather than a generic "yes, build an agent" pitch.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'json-formatter'],
  relatedPrompts: [
    'ai-agent-guardrail-policy-design',
    'ai-agent-observability-tracing-spec',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
