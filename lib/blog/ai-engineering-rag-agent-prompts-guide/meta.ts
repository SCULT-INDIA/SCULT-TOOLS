import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-engineering-rag-agent-prompts-guide'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/ai-engineering/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title:
    'Building a RAG Pipeline or AI Agent: Prompts for the Real Engineering Decisions',
  h1: "The hard parts of building a RAG pipeline aren't the ones tutorials cover",
  targetKeyword: 'rag pipeline prompts',
  description:
    'Chunking strategy, hybrid retrieval tuning, agent guardrails, observability — prompts for the genuine engineering decisions a RAG or agent build actually requires.',
  dek: 'Most RAG and agent tutorials cover the happy path. The prompts that matter are for the decisions that actually determine whether the thing works in production: chunking strategy, retrieval tuning, guardrails, and how you evaluate it at all.',
  sections: [
    {
      heading: 'Why this category exists: mid-build, not casual questions',
      body: [
        [
          'The visitor to this category is mid-build on something real — an autonomous agent, a RAG pipeline, an internal support bot — not asking a chatbot a casual question. The ',
          { text: 'AI Agents & RAG prompt library', href: '/prompts/ai-engineering' },
          ' is written for that, with prompts scoped to genuine architectural decisions rather than beginner tutorials.',
        ],
      ],
    },
    {
      heading: 'The RAG decisions that actually determine retrieval quality',
      body: [
        [
          'Chunking strategy — how documents get split before embedding — is the single most underrated lever in RAG quality, covered by a dedicated ',
          {
            text: 'chunking-strategy design prompt',
            href: '/prompts/ai-engineering/rag-chunking-strategy-design',
          },
          '. Retrieval itself benefits from combining dense vector similarity with sparse keyword matching rather than dense alone — ',
          {
            text: 'tuning hybrid retrieval',
            href: '/prompts/ai-engineering/rag-hybrid-retrieval-tuning',
          },
          ' covers exactly that combination. And picking the right ',
          {
            text: 'embedding model and vector database',
            href: '/prompts/ai-engineering/rag-embedding-model-vector-db-selection',
          },
          ' is a real trade-off decision, not a default to accept unexamined.',
        ],
      ],
    },
    {
      heading: 'Ingestion and multimodal content',
      body: [
        [
          'A ',
          {
            text: 'RAG ingestion pipeline metadata design',
            href: '/prompts/ai-engineering/rag-ingestion-pipeline-metadata-design',
          },
          ' prompt covers what metadata to preserve at ingestion time — provenance, source, access control — that becomes impossible to add back later. For documents with tables, images and charts embedded, ',
          {
            text: 'multimodal PDF handling',
            href: '/prompts/ai-engineering/rag-multimodal-pdf-tables-images',
          },
          ' addresses content a naive text-only pipeline would silently lose.',
        ],
      ],
    },
    {
      heading: 'Evaluation: the step most RAG builds skip entirely',
      body: [
        [
          'A RAG system that has never been evaluated against a real test set is a system nobody actually knows the quality of — ',
          {
            text: 'building an evaluation harness with RAGAS-style metrics',
            href: '/prompts/ai-engineering/rag-evaluation-harness-ragas',
          },
          ' is the prompt for closing that gap, and it belongs early in a build, not as an afterthought once something already feels broken.',
        ],
      ],
    },
    {
      heading: 'Agent architecture: planning, memory, and multi-agent systems',
      body: [
        [
          'Breaking a complex task into steps an agent can actually execute reliably is covered by ',
          {
            text: 'task decomposition and planning',
            href: '/prompts/ai-engineering/ai-agent-task-decomposition-planning',
          },
          '. A multi-agent system with a planner coordinating executors — ',
          {
            text: 'this architecture prompt',
            href: '/prompts/ai-engineering/ai-agent-multi-agent-planner-executor',
          },
          ' — needs a genuinely different design than a single agent. And an agent that needs to remember things across sessions needs a deliberate ',
          {
            text: 'memory architecture',
            href: '/prompts/ai-engineering/ai-agent-memory-architecture-design',
          },
          ', not an ad-hoc solution bolted on later.',
        ],
      ],
    },
    {
      heading: 'Safety: guardrails, sandboxing, and adversarial testing',
      body: [
        [
          'A ',
          {
            text: 'guardrail policy design',
            href: '/prompts/ai-engineering/ai-agent-guardrail-policy-design',
          },
          ' prompt covers what an agent should never be allowed to do, stated explicitly rather than assumed. ',
          {
            text: 'Code execution sandboxing',
            href: '/prompts/ai-engineering/ai-agent-code-execution-sandboxing',
          },
          ' addresses the real risk of letting an agent run generated code at all. And a ',
          {
            text: 'prompt-injection red-team exercise',
            href: '/prompts/ai-engineering/ai-agent-prompt-injection-redteam',
          },
          ' tests whether untrusted content an agent processes can actually hijack its behaviour — worth doing before an adversary finds the gap for you.',
        ],
      ],
    },
    {
      heading: 'Structured output, observability, and cost',
      body: [
        [
          'Getting an agent to reliably return ',
          {
            text: 'structured, schema-conformant output',
            href: '/prompts/ai-engineering/ai-agent-structured-extraction-schema',
          },
          ' rather than loose prose is foundational for anything downstream that parses the result. An ',
          {
            text: 'observability and tracing spec',
            href: '/prompts/ai-engineering/ai-agent-observability-tracing-spec',
          },
          ' is what lets you actually debug an agent in production rather than guessing at what happened. And ',
          {
            text: 'model routing for cost and latency',
            href: '/prompts/ai-engineering/llm-cost-latency-model-routing',
          },
          ' matters the moment a build moves from prototype to something with a real bill attached.',
        ],
      ],
    },
    {
      heading: 'MCP servers and voice agents',
      body: [
        [
          'Designing a proper ',
          {
            text: 'MCP server tool spec',
            href: '/prompts/ai-engineering/mcp-server-tool-spec-design',
          },
          ' matters as more agent tooling standardises on that protocol. And a voice agent has a genuinely different design problem than a text one — ',
          {
            text: 'turn-taking design',
            href: '/prompts/ai-engineering/ai-agent-voice-turn-taking-design',
          },
          ' addresses exactly that, plus a dedicated ',
          {
            text: 'evaluation benchmark suite',
            href: '/prompts/ai-engineering/ai-agent-evaluation-benchmark-suite',
          },
          ' for measuring agent quality systematically rather than by vibes.',
        ],
      ],
    },
    {
      heading: 'When these decisions need a real engineering team',
      body: [
        [
          'A prompt structures your thinking through one decision. Building the actual production system — with the infrastructure, monitoring and iteration that a real RAG pipeline or agent needs — is genuine engineering work. ',
          {
            text: "That's exactly what Scult's AI agents team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your specific build.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'ai-visibility-checker'],
  relatedPrompts: ['rag-chunking-strategy-design', 'ai-agent-guardrail-policy-design'],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
