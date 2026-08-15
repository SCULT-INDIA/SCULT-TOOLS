import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'dev-prompts-roundup'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'AI Prompts for Developers: RAG, React, Next.js, Python and No-Code',
  h1: 'Six development prompt libraries, six genuinely different jobs',
  targetKeyword: 'ai coding prompts for developers',
  description:
    'RAG and agent architecture, React refactoring, Next.js App Router specifics, typed Python, and no-code app builders — six free prompt libraries, each scoped to a real engineering decision.',
  dek: 'AI-assisted development spans genuinely different problems — architecting a RAG pipeline is not the same job as refactoring a React component or briefing a no-code app builder. Six libraries, six real scopes.',
  sections: [
    {
      heading: 'AI Agents & RAG: the mid-build engineering decisions',
      body: [
        [
          'The ',
          { text: 'AI Agents & RAG library', href: '/prompts/ai-engineering' },
          ' targets someone actually mid-build on a real agent or RAG pipeline — chunking strategy, hybrid retrieval tuning, evaluation harnesses, guardrail policy design — the decisions that determine whether a production system actually works, not tutorial-level basics.',
        ],
      ],
    },
    {
      heading: 'React and Next.js: real component contracts and App Router specifics',
      body: [
        [
          'The ',
          { text: 'React library', href: '/prompts/react' },
          ' names real prop contracts and hook patterns rather than hand-waving component generation. The ',
          { text: 'Next.js library', href: '/prompts/nextjs' },
          ' covers what generic React advice misses entirely — server-client component boundaries, cache semantics, route handlers — the App Router-specific concepts a Pages Router mental model gets wrong.',
        ],
      ],
    },
    {
      heading: 'Python: type hints and error handling from the start',
      body: [
        [
          'The ',
          { text: 'Python library', href: '/prompts/python' },
          ' bakes type hints and real error handling into the initial spec rather than requesting them as a bolted-on second pass — across scripting, FastAPI, pandas, testing and production concerns like structured logging.',
        ],
      ],
    },
    {
      heading: 'No-code builders: the first prompt matters more here',
      body: [
        [
          'The ',
          { text: 'no-code app builder library', href: '/prompts/no-code-apps' },
          ' covers Lovable, Bolt.new, v0 and Replit Agent — tools that generate a working app from one description, which raises the stakes on getting scope, data model and UI right in the first shot rather than iterating in a chat.',
        ],
      ],
    },
    {
      heading: 'Coding assistants: the sixth library, covered separately',
      body: [
        [
          'Claude Code, Cursor and GitHub Copilot each have their own dedicated prompt library, since they solve a genuinely different problem — augmenting an existing codebase rather than generating one from scratch, with their own reusable-rules and constraint-brief conventions.',
        ],
      ],
    },
    {
      heading: 'When AI-assisted development needs a real engineering team',
      body: [
        [
          'These prompts sharpen individual pieces of work. A full production system — architected, tested, deployed and maintained — is real engineering. ',
          {
            text: "That's exactly what Scult's software team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your project.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'website-speed-test'],
  relatedPrompts: [
    'rag-chunking-strategy-design',
    'nextjs-server-client-component-boundary-audit',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
