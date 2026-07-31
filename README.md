# tools.scult.in

Free online tools hub for [Scult](https://scult.in), an AI-first digital agency in
Noida, Delhi NCR. Most tools run entirely in the browser, so they cost nothing per
use and never see your data.

## Approved scope — exactly 15 tools

The tool list is a **product decision, not a code convenience**. The registry test
suite fails the build if the catalogue deviates from the approved list:

| Category | Tools |
|---|---|
| SEO | Schema Markup Generator · FAQ Schema Generator · UTM Link Builder · Marketing ROI Calculator · Website Speed Test |
| Business | Invoice Generator · Business Name Generator · Slogan Generator · Email Signature Generator |
| Developer | JSON Formatter · QR Code Generator · Favicon Generator |
| Productivity | Word Counter |
| Design | Colour Palette Generator |
| GEO / AEO | AI Visibility Checker |

Adding a tool requires product approval first, then: one `meta.ts`, one `logic.ts`
(+ tests), one component, one line in `components/tools/index.tsx`, and an update to
the approved-list assertion in `lib/tools/registry.test.ts`.

[![CI](https://github.com/scult/tools.scult.in/actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Stack

| Area | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router, Cache Components) | 16.2.12 |
| UI | React | 19.2.8 |
| Language | TypeScript (strict) | 6.0.3 |
| Styling | Tailwind CSS (CSS-first `@theme`, no config file) | 4.3.3 |
| Bundler | Turbopack (default in Next 16) | bundled |
| Lint + format | Biome | 2.5.6 |
| Tests | Vitest | latest |
| Fonts | Fraunces + Cabin, self-hosted via `next/font` | — |

## Scripts

```bash
npm run dev         # Turbopack dev server
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # biome check
npm run lint:fix    # biome check --write
npm test            # vitest run
```

## Architecture

Presentation stays thin, tool logic stays pure. Every tool's computation is a
framework-free function in `lib/tools/<slug>/logic.ts` that can be unit-tested
without a browser — and, for 13 of the 15 tools, runs client-side at zero marginal
cost. The two URL diagnostics have thin Route Handlers under app/api/.

```
app/
  page.tsx                  hub home — hero, search, category grid
  [category]/page.tsx       6 category landings (/seo, /business, …)
  [category]/[slug]/page.tsx  canonical tool page
  all/page.tsx              complete directory
  privacy/  about/          trust pages
  sitemap.ts  robots.ts     generated from the registry
components/
  layout/                   Header (floating pill + aurora), Footer, drawer, search
  tools/                    one client component per tool + shared ToolShell
  ui/                       Icon, ToolCard
lib/
  tools/registry.ts         THE source of truth
  tools/<slug>/logic.ts     pure, tested tool logic
  seo/jsonld.tsx            structured-data builders
docs/
  PLAN.md                   the full build plan and its rationale
  design-preview.html       living style guide
  theme.css                 annotated token source
```

### The registry is the source of truth

Routing, `/all`, category pages, the search index, metadata, JSON-LD, sitemaps and
the internal-link graph all derive from `lib/tools/registry.ts`. Adding a tool is
one registry entry, one logic file and one component — never seven scattered edits.

`lib/tools/registry.test.ts` enforces the invariants that would otherwise rot:
no slug collisions with reserved routes, no dangling `related` references, at least
three inbound internal links per tool, no orphans, a component for every entry, and
content-quality floors on descriptions, FAQs and limitations.

## Icons

`app/favicon.ico` (16/32/48/64), `app/icon.png` (512) and `app/apple-icon.png` (180)
follow the App Router file convention, so Next emits the `<link>` tags itself — there
are no hand-written icon tags to drift.

All three are generated from the official 1024px Scult mark by
`scripts/make-favicon.py`, recoloured from the parent brand's acid lime to
violet-600 (`#631AFF`, the same violet as the header wordmark) on a white disc. The
16px frame is rendered at 16px rather than downscaled from 512, because that is the
size that actually has to stay legible.

## URL structure

There is no `/tools/` prefix — the subdomain already says "tools", so the segment
would cost crawl depth on every page. A permanent `/tools/* → /*` redirect is
configured so the alternative shape can never become duplicate content.

## Accessibility

Targets WCAG 2.2 AA. Contrast was computed for every palette pairing rather than
estimated, and several non-obvious rules fall out of that — they are documented in
`app/globals.css` next to the tokens they constrain. The load-bearing ones:

- Never white text on `#FAC44B` (1.61:1) or `#1AE39B` (1.68:1).
- The CTA's 1px black border is required for WCAG 1.4.11, not decoration: the
  yellow fill alone is 1.61:1 against white.
- The focus ring is two-tone. A single `#4432E2` ring is 1.96:1 on the indigo
  footer and 1.20:1 on the aurora — the white outer ring is what makes it pass.
- Inside pastel tiles, accent text must be `violet-700`; `violet-500` on lavender
  is 4.41:1 and fails.
- On the ice-blue surface use `ink-subtle-onice`; `ink-subtle` is 4.32:1 there.
- The nav pill's white fill is load-bearing — black nav text over the aurora core
  is 3.36:1.

## Adding a tool

1. Add an entry to `lib/tools/registry.ts` (including `related`, `howItWorks`,
   `limitations` and a real FAQ — the tests enforce these).
2. Write `lib/tools/<slug>/logic.ts` as pure functions, plus `logic.test.ts`.
3. Write `components/tools/<Component>.tsx` (`'use client'`).
4. Register it in `components/tools/index.tsx`.
5. `npm test && npm run typecheck && npm run build`.
