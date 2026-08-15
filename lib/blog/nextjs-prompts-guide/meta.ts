import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'nextjs-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/nextjs/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Next.js App Router Prompts: Where Generic React Advice Goes Wrong',
  h1: 'Server components, caching, and the App Router mistakes generic advice misses',
  targetKeyword: 'nextjs app router prompts',
  description:
    'Next.js App Router prompts for server vs client component boundaries, cache semantics, and route handlers — the places where generic React advice actively misleads.',
  dek: 'A lot of "Next.js" advice online is really just React advice with a different import path. The App Router era introduced genuinely new concepts — server components, caching semantics, streaming — that generic React knowledge does not cover.',
  sections: [
    {
      heading: 'The App Router concepts generic React advice does not cover',
      body: [
        [
          'Server components, the caching model, and streaming are genuinely new concepts the App Router introduced — not just React with different file conventions. The ',
          { text: 'Next.js prompt library', href: '/prompts/nextjs' },
          ' is written specifically for those concepts, the places where advice written for classic React (or the old Pages Router) actively misleads rather than just being outdated.',
        ],
      ],
    },
    {
      heading: 'Server vs client: the boundary that determines everything else',
      body: [
        [
          "Getting the server/client component boundary wrong is the single most common App Router mistake — putting 'use client' too high in the tree, or fetching data client-side that should have been a server component from the start. ",
          {
            text: 'Auditing that boundary directly',
            href: '/prompts/nextjs/nextjs-server-client-component-boundary-audit',
          },
          ' catches this. A related, newer trap: the "use cache" directive in Cache Components has specific rules about what can and cannot be cached, and ',
          {
            text: 'auditing for that specific trap',
            href: '/prompts/nextjs/nextjs-cache-components-use-cache-trap-audit',
          },
          ' catches violations before they cause a confusing runtime error.',
        ],
      ],
    },
    {
      heading: 'Caching strategy: ISR, forced dynamic rendering, and revalidation',
      body: [
        [
          'Choosing the right ISR revalidation strategy — ',
          {
            text: 'covered here',
            href: '/prompts/nextjs/nextjs-isr-revalidation-strategy-selection',
          },
          " — decides how stale content can get before regenerating. And a page that should be statically generated but silently isn't, because of a hidden dynamic API call somewhere in its tree, is diagnosed by ",
          {
            text: 'this specific prompt',
            href: '/prompts/nextjs/nextjs-diagnose-forced-dynamic-rendering',
          },
          ' — a class of bug that is invisible until you specifically know to look for it.',
        ],
      ],
    },
    {
      heading: 'Route handlers, server actions, and middleware',
      body: [
        [
          'Designing a real REST-style API with Route Handlers — ',
          {
            text: 'this prompt',
            href: '/prompts/nextjs/nextjs-route-handler-rest-api-design',
          },
          ' — and building form validation into a Server Action — ',
          {
            text: 'covered here',
            href: '/prompts/nextjs/nextjs-server-action-form-validation-buildout',
          },
          ' — are two of the most common App Router backend patterns. Middleware specifically needs a latency budget in mind, since it runs on every matched request — ',
          {
            text: 'an auth-guard middleware prompt',
            href: '/prompts/nextjs/nextjs-middleware-auth-guard-latency-budget',
          },
          ' addresses that constraint directly rather than treating middleware as a free lunch.',
        ],
      ],
    },
    {
      heading: 'Performance: images, fonts, and eliminating waterfalls',
      body: [
        [
          'An ',
          {
            text: 'audit of next/image usage against Core Web Vitals',
            href: '/prompts/nextjs/nextjs-next-image-core-web-vitals-audit',
          },
          ' catches the most common image-performance mistakes before Lighthouse does. Setting up ',
          {
            text: 'next/font correctly',
            href: '/prompts/nextjs/nextjs-font-optimization-next-font-setup',
          },
          ' avoids layout shift from web fonts. And ',
          {
            text: 'parallel data fetching to eliminate waterfalls',
            href: '/prompts/nextjs/nextjs-parallel-data-fetching-eliminate-waterfalls',
          },
          ' fixes the specific, common mistake of sequential awaits that should have run concurrently.',
        ],
      ],
    },
    {
      heading: 'SEO and structured data, done the App Router way',
      body: [
        [
          'Wiring up generateMetadata so every page actually gets dynamic SEO tags — ',
          {
            text: 'this specific prompt',
            href: '/prompts/nextjs/nextjs-generate-metadata-dynamic-seo-tags',
          },
          ' — is the App Router-native way to handle metadata, replacing the old static meta tags approach entirely. Pair the resulting pages with the ',
          { text: 'Schema Markup Generator', href: '/seo/schema-markup-generator' },
          ' for structured data on top of correctly generated metadata.',
        ],
      ],
    },
    {
      heading: 'Migration, monorepos, and deployment',
      body: [
        [
          'A real migration plan from the Pages Router to the App Router — ',
          {
            text: 'this prompt',
            href: '/prompts/nextjs/nextjs-pages-router-to-app-router-migration-plan',
          },
          ' — sequences the change rather than attempting it in one enormous pass. A Turborepo monorepo with shared packages has its own layout considerations, covered ',
          {
            text: 'here',
            href: '/prompts/nextjs/nextjs-turborepo-monorepo-shared-packages-layout',
          },
          ', and self-hosting via a standalone Docker deployment — ',
          {
            text: 'this prompt',
            href: '/prompts/nextjs/nextjs-self-hosting-standalone-docker-deployment',
          },
          ' — matters for teams not deploying to a managed platform.',
        ],
      ],
    },
    {
      heading: 'When an App Router build needs real engineering',
      body: [
        [
          'These prompts sharpen individual decisions. A full production Next.js build — with the auth, testing and deployment architecture that decision requires holistically — is real engineering work. ',
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
  relatedTools: ['website-speed-test', 'schema-markup-generator'],
  relatedPrompts: [
    'nextjs-server-client-component-boundary-audit',
    'nextjs-generate-metadata-dynamic-seo-tags',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
