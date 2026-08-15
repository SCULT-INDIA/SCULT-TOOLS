import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'internal-ai-support-bot-playbook'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Building an Internal AI Support Bot: Prototype to Production',
  h1: 'From a working prompt to a bot you can actually trust with customers',
  targetKeyword: 'build internal ai support bot',
  description:
    'RAG design, guardrails, observability and evaluation — the real path from a validated support-bot prompt to a production system worth deploying to real customers.',
  dek: 'A support-bot prompt that answers well in testing is a genuine starting point. Getting it production-ready needs specific, real engineering — not a longer prompt.',
  sections: [
    {
      heading: 'Step 1: chunking your knowledge base correctly',
      body: [
        [
          'Before anything else, get ',
          {
            text: 'chunking strategy',
            href: '/prompts/ai-engineering/rag-chunking-strategy-design',
          },
          ' right — this single decision affects retrieval quality more than almost any other choice in a RAG-based support bot.',
        ],
      ],
    },
    {
      heading: 'Step 2: hybrid retrieval, not vector search alone',
      body: [
        [
          'Tune ',
          {
            text: 'hybrid retrieval',
            href: '/prompts/ai-engineering/rag-hybrid-retrieval-tuning',
          },
          ' — combining dense vector similarity with sparse keyword matching catches exact-term queries a pure vector search sometimes misses, which matters a lot for support queries referencing specific product or error names.',
        ],
      ],
    },
    {
      heading: 'Step 3: guardrails for what the bot should never do',
      body: [
        [
          'Design a real ',
          {
            text: 'guardrail policy',
            href: '/prompts/ai-engineering/ai-agent-guardrail-policy-design',
          },
          ' — stated explicitly, covering what the bot should escalate to a human rather than answer unilaterally, not left to hopeful inference.',
        ],
      ],
    },
    {
      heading: 'Step 4: red-team it before customers do',
      body: [
        [
          'Run a genuine ',
          {
            text: 'prompt-injection red-team exercise',
            href: '/prompts/ai-engineering/ai-agent-prompt-injection-redteam',
          },
          " — testing whether malicious or unusual customer input can hijack the bot's behaviour before an actual adversary finds the gap.",
        ],
      ],
    },
    {
      heading: 'Step 5: observability so failures are debuggable',
      body: [
        [
          'Build a real ',
          {
            text: 'observability and tracing spec',
            href: '/prompts/ai-engineering/ai-agent-observability-tracing-spec',
          },
          ' — when a customer reports a wrong answer weeks later, you need to be able to trace exactly what happened, not guess.',
        ],
      ],
    },
    {
      heading: 'Step 6: an evaluation suite, run continuously',
      body: [
        [
          'Build an ',
          {
            text: 'evaluation benchmark suite',
            href: '/prompts/ai-engineering/ai-agent-evaluation-benchmark-suite',
          },
          " and run it on a schedule, not once at launch — a bot's accuracy can quietly degrade as your product or knowledge base changes underneath it.",
        ],
      ],
    },
    {
      heading: 'Where this genuinely needs a real engineering team',
      body: [
        [
          'Every step here is real engineering work, not a longer prompt — this is exactly what ',
          { text: "Scult's AI agents team builds", href: SERVICE.href, external: true },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' if you have a validated prompt ready to become a real production system.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'json-formatter'],
  relatedPrompts: ['rag-chunking-strategy-design', 'ai-agent-guardrail-policy-design'],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
