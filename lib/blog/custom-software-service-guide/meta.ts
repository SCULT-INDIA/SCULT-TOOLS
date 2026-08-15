import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'custom-software-service-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'service',
  title: 'No-Code Prototype vs. Custom Software: When to Make the Switch',
  h1: 'Your Lovable or Bolt prototype works. Is it ready for real users?',
  targetKeyword: 'custom software development company',
  description:
    "A generated prototype from Lovable or Bolt.new is a real starting point, not a finished product. Here's the honest checklist for when it needs to become custom software.",
  dek: 'No-code tools generate a genuinely working app from one description now — which is exactly why the decision of when to move to custom software has gotten harder to see clearly, not easier.',
  sections: [
    {
      heading: 'What a generated prototype gets right',
      body: [
        [
          'Tools like Lovable, Bolt.new and Replit Agent produce something that actually works from a single description — a real, clickable app, not a mockup. For validating an idea, testing with early users, or building an internal tool fast, that speed is a genuine advantage over starting from scratch, and there is no reason to skip it. The ',
          { text: 'no-code app builder prompt library', href: '/prompts/no-code-apps' },
          ' covers exactly this workflow, and the ',
          { text: 'JSON Formatter', href: '/dev/json-formatter' },
          ' is worth keeping bookmarked the moment you start inspecting what a generator actually produced under the hood.',
        ],
      ],
    },
    {
      heading: 'The specific things a generated prototype usually gets wrong',
      body: [
        [
          'A generator makes fast decisions under its own assumptions, and those assumptions do not always hold up under real production load or real security scrutiny. Data model decisions made quickly during generation often need genuine review once real user data is involved — a schema that seemed fine for a demo can be wrong for actual scale or actual access-control requirements. Auth and multi-tenant isolation, if generated quickly, deserve a real security review before real customer data touches them.',
        ],
      ],
    },
    {
      heading: 'The honest checklist for whether a prototype is ready for real users',
      body: [
        [
          "Five questions worth answering honestly before a prototype goes live with real users and real data: Has the data model been reviewed by someone who understands the actual production requirements, not just the demo case? Is authentication and access control genuinely secure, or does it work because nobody has tried to break it yet? Can it handle real concurrent load, or has it only ever been tested by one person clicking through it? Is there a real deployment and backup process, or does the app exist only inside the generator's own hosting? And does anyone actually understand the generated code well enough to debug it when something breaks in production?",
        ],
        [
          'If most of those come back uncertain, that is the honest signal that hardening the prototype into real software — not necessarily starting over, but genuinely reviewing and rebuilding the parts that need it — is the right next step before more real users depend on it.',
        ],
      ],
    },
    {
      heading: 'What "hardening a prototype" actually involves',
      body: [
        [
          'This is exactly the work ',
          {
            text: "Scult's custom software team does",
            href: SERVICE.href,
            external: true,
          },
          ': taking a generated prototype and reviewing the data model, auth, and architecture against real production requirements — sometimes keeping most of the generated code and fixing specific gaps, sometimes rebuilding the parts that do not hold up, always starting from what already works rather than throwing it all away.',
        ],
      ],
    },
    {
      heading: 'When it makes sense to build custom from the start',
      body: [
        [
          'Some projects are better started as custom software from day one rather than generated and then hardened — genuinely complex domain logic a generator would not model correctly, strict regulatory or compliance requirements that need architecture decisions made deliberately from the start, or integration with existing systems complex enough that a generic generated app would need a near-total rewrite anyway. Knowing which category a project falls into before starting saves real time either way.',
        ],
      ],
    },
    {
      heading: 'Get an honest read on your prototype',
      body: [
        [
          'Have a working prototype and unsure whether it needs hardening or a rebuild? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          " and bring it — we'll tell you honestly what it actually needs, not the maximum amount of work we could bill for.",
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'ai-visibility-checker', 'website-speed-test'],
  relatedPrompts: [
    'lovable-multitenant-saas-rls-billing',
    'replit-agent-add-auth-to-existing-app',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
