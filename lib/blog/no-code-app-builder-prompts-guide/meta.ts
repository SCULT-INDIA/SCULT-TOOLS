import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'no-code-app-builder-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/no-code-apps/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Lovable, Bolt.new, v0 & Replit Agent: Prompts for a Working App in One Shot',
  h1: "The first prompt matters more here than in a chat interface — here's why",
  targetKeyword: 'lovable bolt v0 prompts',
  description:
    'Structured prompts for Lovable, Bolt.new, v0 and Replit Agent — describing scope, data model and UI in one shot, since these tools build a full working app from one description.',
  dek: 'Tools like Lovable and Bolt.new generate a working app from your first description, which raises the stakes on that description in a way a back-and-forth chat interface never has.',
  sections: [
    {
      heading: 'Why the first prompt matters more here than anywhere else',
      body: [
        [
          'In a chat interface, a vague first message just gets clarified in the next turn. In Lovable, Bolt.new, v0 or Replit Agent, a vague first description generates an entire working app structure — data model, screens, logic — that then has to be reworked rather than refined. The ',
          { text: 'no-code app builder prompt library', href: '/prompts/no-code-apps' },
          ' is written around getting scope, data model and UI right in that first shot.',
        ],
      ],
    },
    {
      heading: 'Lovable: SaaS features that need real architectural decisions upfront',
      body: [
        [
          'A multi-tenant SaaS with row-level security and billing — ',
          {
            text: 'this Lovable prompt',
            href: '/prompts/no-code-apps/lovable-multitenant-saas-rls-billing',
          },
          ' — bakes tenant isolation into the initial data model rather than retrofitting it. A two-sided marketplace with Stripe Connect for split payments — ',
          {
            text: 'covered here',
            href: '/prompts/no-code-apps/lovable-two-sided-marketplace-stripe-connect',
          },
          ' — and membership content gating — ',
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/lovable-membership-content-gating',
          },
          ' — both need the access model decided before the first screen is built, not after.',
        ],
      ],
    },
    {
      heading: 'Lovable: building against an existing schema, not a blank slate',
      body: [
        [
          'An internal ops dashboard built against a database schema that already exists — ',
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/lovable-internal-ops-dashboard-existing-schema',
          },
          ' — needs to respect existing structure rather than generating a fresh, incompatible one. And ',
          {
            text: 'a schema migration to add a new feature',
            href: '/prompts/no-code-apps/lovable-schema-migration-add-feature',
          },
          ' needs the same care a hand-written migration would get, since a generated one touching production data carries the same real risk.',
        ],
      ],
    },
    {
      heading: 'Bolt.new: from a figma screenshot to a real prototype',
      body: [
        [
          'An e-commerce storefront with a working cart — ',
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/bolt-new-ecommerce-storefront-cart-prototype',
          },
          ' — and a dashboard built from a CSV with real charts — ',
          {
            text: 'covered here',
            href: '/prompts/no-code-apps/bolt-new-csv-api-dashboard-charts',
          },
          ' — are two common Bolt.new use cases. Turning a Figma screenshot directly into a working prototype — ',
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/bolt-new-figma-screenshot-to-prototype',
          },
          ' — closes the gap between a static design and something clickable, and handing a prototype off cleanly via GitHub export — ',
          {
            text: 'covered here',
            href: '/prompts/no-code-apps/bolt-new-github-export-handoff',
          },
          ' — matters the moment a prototype needs to become a real, maintained codebase.',
        ],
      ],
    },
    {
      heading: 'v0: UI components that actually match your design system',
      body: [
        [
          'A data table with real filters and charts — ',
          {
            text: 'this v0 prompt',
            href: '/prompts/no-code-apps/v0-dashboard-data-table-filters-charts',
          },
          ' — and a multi-step form wizard — ',
          {
            text: 'covered here',
            href: '/prompts/no-code-apps/v0-multistep-form-wizard',
          },
          " — are common UI-generation targets. Getting auth screens to actually match an existing design system, not v0's default aesthetic — ",
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/v0-auth-screens-design-system-match',
          },
          ' — and a documented component-variant system — ',
          {
            text: 'covered here',
            href: '/prompts/no-code-apps/v0-component-variant-system-documented',
          },
          ' — both keep generated UI consistent with what already exists rather than introducing a visibly different style.',
        ],
      ],
    },
    {
      heading: 'Replit Agent: backend, auth, and internal automation',
      body: [
        [
          'A deployed FastAPI backend — ',
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/replit-agent-fastapi-backend-deploy',
          },
          " — debugging an existing app's real bug — ",
          {
            text: 'covered here',
            href: '/prompts/no-code-apps/replit-agent-debug-existing-app-bug',
          },
          ' — and adding auth to an app that did not have it — ',
          {
            text: 'this prompt',
            href: '/prompts/no-code-apps/replit-agent-add-auth-to-existing-app',
          },
          ' — cover the three most common Replit Agent tasks beyond initial generation. A scheduled scraper pipeline and an internal tool with a real automation UI round out the practical, ongoing-operations side of what Replit Agent handles well.',
        ],
      ],
    },
    {
      heading: 'What these tools genuinely cannot replace',
      body: [
        [
          "A generated prototype is a real starting point, not a finished product — data model decisions made quickly under a generator's assumptions often need real review before production traffic hits them, and genuine scale, security and compliance requirements are a different level of rigor than any generator defaults to.",
        ],
      ],
    },
    {
      heading: 'When a generated app needs to become a real, maintained product',
      body: [
        [
          'Taking a generated prototype from these tools and hardening it into something production-ready — real auth, real data architecture, real testing — is exactly the kind of engineering work ',
          { text: "Scult's software team does", href: SERVICE.href, external: true },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' if you have a prototype ready to go further.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'website-speed-test'],
  relatedPrompts: [
    'lovable-multitenant-saas-rls-billing',
    'bolt-new-figma-screenshot-to-prototype',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 13,
}
