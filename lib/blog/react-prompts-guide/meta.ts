import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'react-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/react/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'React Prompts for AI Assistants: Real Component Contracts, Not Hand-Waving',
  h1: 'A generic React prompt gets you a generic component. These get you a real one.',
  targetKeyword: 'react prompts for ai coding assistants',
  description:
    'React prompts with real prop contracts, hook extraction, performance passes and migration briefs — for AI coding assistants, naming actual React APIs rather than hand-waving.',
  dek: 'Ask an AI assistant to "build a React component" and you get something that compiles but ignores your existing patterns, state architecture and accessibility requirements. These prompts name the actual decision points instead.',
  sections: [
    {
      heading: 'Why React prompts need more structure than a feature description',
      body: [
        [
          'A vague React request produces a component that technically works and ignores everything else — existing conventions, the right state-management choice, accessibility. The ',
          { text: 'React prompt library', href: '/prompts/react' },
          ' names the actual decision points instead: component generation with real prop contracts, hook extraction, performance passes, and migration briefs that reference genuine React APIs.',
        ],
      ],
    },
    {
      heading: 'Refactoring: extracting hooks and decomposing god components',
      body: [
        [
          'Tangled component logic that has grown past a maintainable size benefits from ',
          {
            text: 'extracting a custom hook from tangled logic',
            href: '/prompts/react/react-extract-custom-hook-from-tangled-logic',
          },
          ' — genuinely separating concerns rather than just moving code around. A component that has become a "god component" doing too much benefits from ',
          {
            text: 'decomposing it into a proper tree',
            href: '/prompts/react/react-decompose-god-component-into-tree',
          },
          ' with clear boundaries between pieces.',
        ],
      ],
    },
    {
      heading: 'Performance: diagnosing before reaching for memo',
      body: [
        [
          'The instinct to wrap everything in memo() without first understanding why a component re-renders leads to code that is harder to read without measurably improving performance. ',
          {
            text: 'Diagnosing unnecessary re-renders before reaching for memo',
            href: '/prompts/react/react-diagnose-unnecessary-rerenders-before-memo',
          },
          ' forces the diagnosis first. Virtualising a genuinely large list is covered separately by ',
          {
            text: 'this prompt',
            href: '/prompts/react/react-virtualize-a-large-list-or-table',
          },
          ', and debouncing search input the modern way — with useDeferredValue rather than a manual setTimeout — is covered by ',
          {
            text: 'a dedicated prompt',
            href: '/prompts/react/react-build-debounced-search-with-usedeferredvalue',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'State architecture: choosing the right home for state',
      body: [
        [
          'Deciding whether state belongs lifted to a parent, in Context, or in a dedicated store is a real architectural decision most "add state management" requests skip entirely — ',
          {
            text: 'choosing the right state home',
            href: '/prompts/react/react-choose-state-home-lift-context-or-store',
          },
          ' forces that decision explicitly. And fixing prop drilling correctly, without reflexively reaching for Redux the moment it becomes annoying, is covered by ',
          {
            text: 'this prompt',
            href: '/prompts/react/react-fix-prop-drilling-before-reaching-for-redux',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Modern React: Actions, Suspense, and View Transitions',
      body: [
        [
          "Migrating a form to React 19's Actions model is a genuine API change, not a cosmetic one — ",
          {
            text: 'this migration prompt',
            href: '/prompts/react/react-migrate-form-to-react-19-actions',
          },
          ' covers it directly. Designing Suspense boundaries for a data-heavy page — ',
          {
            text: 'that prompt',
            href: '/prompts/react/react-design-suspense-boundaries-for-data-heavy-page',
          },
          ' — decides where loading states actually belong. And implementing a transition with the View Transitions API, covered by ',
          {
            text: 'this prompt',
            href: '/prompts/react/react-implement-transition-with-view-transitions-api',
          },
          ', uses a genuinely newer browser capability most generic advice has not caught up to.',
        ],
      ],
    },
    {
      heading: 'Testing, accessibility, and hydration debugging',
      body: [
        [
          'Behavior-driven Testing Library tests — ',
          {
            text: 'this prompt',
            href: '/prompts/react/react-write-behavior-driven-testing-library-tests',
          },
          ' — test what a user actually experiences, not implementation details. A real ',
          {
            text: 'accessibility audit for a component',
            href: '/prompts/react/react-accessibility-audit-for-component',
          },
          ' catches issues a purely visual review misses. And debugging a hydration mismatch — a specifically tricky class of bug in server-rendered React — has ',
          {
            text: 'a dedicated diagnostic prompt',
            href: '/prompts/react/react-debug-a-hydration-mismatch',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Design systems: component APIs built to be reused, not just to work',
      body: [
        [
          'Designing a component API specifically for a design system — ',
          {
            text: 'this prompt',
            href: '/prompts/react/react-design-component-api-for-design-system',
          },
          ' — thinks about consumers beyond the current page. Building a compound component with Context, covered by ',
          {
            text: 'this prompt',
            href: '/prompts/react/react-build-compound-component-with-context',
          },
          ', and a polymorphic component with asChild, covered by ',
          {
            text: 'this one',
            href: '/prompts/react/react-build-polymorphic-component-with-aschild',
          },
          ', are two patterns that show up constantly in real design-system code and rarely in generic tutorials.',
        ],
      ],
    },
    {
      heading: 'When React work needs a real engineering team',
      body: [
        [
          'Prompts help write better individual pieces of code. A full application build, a design system, or a genuinely complex migration is a bigger engineering effort. ',
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
    'react-extract-custom-hook-from-tangled-logic',
    'react-diagnose-unnecessary-rerenders-before-memo',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
