import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'python-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/python/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Python Prompts for AI Assistants: Type Hints and Error Handling in the Ask',
  h1: 'Ask for type hints and error handling upfront, not bolted on after',
  targetKeyword: 'python prompts for ai coding assistants',
  description:
    'Python prompts across scripting, data, APIs and tests — written with type hints and real error handling in the initial ask, not requested as an afterthought.',
  dek: 'A Python function generated without type hints and proper error handling in the original prompt usually gets both bolted on afterward, worse than if they had been part of the spec from the start.',
  sections: [
    {
      heading:
        'Why "add type hints" as a follow-up produces worse code than asking upfront',
      body: [
        [
          'Requesting type hints and error handling as a second pass, after a function already exists, tends to produce hints that describe what the code happens to do rather than what it should guarantee — and error handling that catches whatever the existing code path might throw, rather than the specific failure modes worth handling deliberately. The ',
          { text: 'Python prompt library', href: '/prompts/python' },
          ' bakes both into the initial spec instead.',
        ],
        [
          'The foundational entry, turning ',
          {
            text: 'a function spec into typed code from the start',
            href: '/prompts/python/python-function-spec-to-typed-code',
          },
          ', treats types as part of the contract, not a formatting pass applied after the logic already exists.',
        ],
      ],
    },
    {
      heading: 'APIs: FastAPI endpoints and Pydantic v2 models',
      body: [
        [
          'Building a ',
          {
            text: 'FastAPI endpoint directly from requirements',
            href: '/prompts/python/python-fastapi-endpoint-from-requirements',
          },
          ' keeps validation and error responses part of the initial design rather than patched in later. Designing ',
          {
            text: 'Pydantic v2 models from a real domain description',
            href: '/prompts/python/python-pydantic-v2-model-design-from-domain',
          },
          ' — not just guessed field types — is the difference between a model that validates real business rules and one that only checks that a field is technically a string.',
        ],
      ],
    },
    {
      heading: 'Data work: pandas cleaning, streaming, and validation pipelines',
      body: [
        [
          'A ',
          {
            text: 'pandas dataframe cleaning pipeline',
            href: '/prompts/python/python-pandas-dataframe-cleaning-pipeline',
          },
          ' built with the actual messy-data cases in mind (nulls, mixed types, duplicates) beats one written for a clean sample. For data too large to load into memory at once, ',
          {
            text: 'streaming large-file processing',
            href: '/prompts/python/python-streaming-large-file-processing',
          },
          ' avoids the crash a naive read_csv call would eventually hit, and a ',
          {
            text: 'data validation pipeline at ingestion',
            href: '/prompts/python/python-data-validation-pipeline-ingestion',
          },
          ' catches bad data at the door rather than downstream where it is harder to trace back.',
        ],
      ],
    },
    {
      heading: 'Testing: behaviour-driven and property-based',
      body: [
        [
          'A ',
          {
            text: 'pytest suite generated from actual function behaviour',
            href: '/prompts/python/python-pytest-suite-from-function-behavior',
          },
          ' tests what the function is supposed to do, not just its current implementation quirks. ',
          {
            text: 'Hypothesis property-based tests',
            href: '/prompts/python/python-hypothesis-property-based-tests',
          },
          ' find edge cases a hand-written example-based test would never think to check.',
        ],
      ],
    },
    {
      heading: 'Refactoring: async, dataclasses, and idiomatic review',
      body: [
        [
          'Converting a sync codebase to async correctly — ',
          {
            text: 'this refactor prompt',
            href: '/prompts/python/python-sync-to-async-refactor',
          },
          ' — is a real behavioural change, not a mechanical find-and-replace of function keywords. An ',
          {
            text: 'idiomaticity review',
            href: '/prompts/python/python-idiomaticity-review',
          },
          ' catches code that works but does not read like Python a experienced developer would write, and ',
          {
            text: 'converting a class to a dataclass',
            href: '/prompts/python/python-dataclass-conversion-from-class',
          },
          ' removes boilerplate a hand-written __init__ often accumulates.',
        ],
      ],
    },
    {
      heading: 'Diagnosis: circular imports, dependency conflicts, performance',
      body: [
        [
          'A ',
          {
            text: 'circular-import diagnosis',
            href: '/prompts/python/python-circular-import-diagnosis',
          },
          ' finds the actual import cycle rather than a superficial workaround. ',
          {
            text: 'Dependency conflict diagnosis',
            href: '/prompts/python/python-dependency-conflict-diagnosis',
          },
          ' does the same for version conflicts, and a ',
          {
            text: 'performance profiling plan',
            href: '/prompts/python/python-performance-profiling-plan',
          },
          ' finds the actual bottleneck before optimising the wrong function entirely.',
        ],
      ],
    },
    {
      heading: 'Production concerns: logging, config, resilience',
      body: [
        [
          'Migrating to ',
          {
            text: 'structured logging',
            href: '/prompts/python/python-structured-logging-migration',
          },
          ' makes production logs actually queryable. ',
          {
            text: 'Multi-environment settings configuration',
            href: '/prompts/python/python-settings-multi-environment-config',
          },
          ' avoids the classic "works on my machine" gap between local and production config. A ',
          {
            text: 'retry-with-backoff decorator',
            href: '/prompts/python/python-retry-backoff-decorator',
          },
          ' and a ',
          {
            text: 'resilient web scraper',
            href: '/prompts/python/python-resilient-web-scraper',
          },
          ' both handle the reality that external calls fail, rather than assuming they always succeed.',
        ],
      ],
    },
    {
      heading: 'When Python code needs to become a real production system',
      body: [
        [
          'These prompts sharpen individual pieces of code. A full production backend — with the deployment, monitoring and architecture that requires — is a bigger engineering project. ',
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
  relatedTools: ['json-formatter', 'faq-schema-generator'],
  relatedPrompts: [
    'python-function-spec-to-typed-code',
    'python-fastapi-endpoint-from-requirements',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
