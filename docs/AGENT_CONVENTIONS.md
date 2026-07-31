# Tool implementation conventions — tools.scult.in

You are implementing ONE tool for this Next.js app. Follow every rule here exactly;
they are enforced by tests and review, not suggestions. Repo root: `D:\CLAUDE\tools.scult.in`.

## Read these reference files FIRST — they are the pattern to match

- `lib/tools/utm-builder/meta.ts` — registry metadata reference
- `lib/tools/utm-builder/logic.ts` + `logic.test.ts` — pure logic + test reference
- `components/tools/UtmBuilder.tsx` — component reference
- `components/tools/ResultPanel.tsx` — shared `ResultPanel`, `ResultRow`, `CopyButton`
- `app/globals.css` — the ONLY design tokens/classes available
- `lib/tools/types.ts` — the `Tool` type your meta must satisfy

## Stack

Next.js 16.2.12 (App Router, `cacheComponents: true`), React 19.2.8,
TypeScript 6 strict + `noUncheckedIndexedAccess`, Tailwind CSS v4, Vitest, Biome.

## Files you create (exact paths; DO NOT touch any other file)

1. `lib/tools/<slug>/meta.ts` — registry metadata (see contract below)
2. `lib/tools/<slug>/logic.ts` — PURE functions. No React, no DOM, no I/O.
3. `lib/tools/<slug>/logic.test.ts` — Vitest; `import { describe, expect, it } from 'vitest'`
4. `components/tools/<ComponentName>.tsx` — `'use client'`, named export
5. ONLY IF your spec says so: `app/api/<name>/route.ts` — a Route Handler

Never modify: `lib/tools/registry.ts`, `components/tools/index.tsx`,
`components/ui/Icon.tsx`, `lib/tools/categories.ts`, `app/globals.css`, any other
tool's files, or shared components. They already reference your files by exact name.

## meta.ts contract

```ts
import type { Tool } from '../types'

export const meta: Tool = { /* every field below */ }
```

Field floors — the registry test FAILS THE BUILD if violated:
- `description`: hand-written, 71–200 chars, unique across the site
- `howToUse`: 3–5 imperative steps
- `howItWorks`: > 200 chars of REAL explanation (the algorithm/standard/formula —
  this is where E-E-A-T is earned; write it like an engineer explaining to a peer)
- `limitations`: ≥ 2 honest entries
- `faq`: 3–8 entries; every `q` ends with `?`; every `a` > 40 chars, substantive
- `keywords`: ≥ 1, real search phrasings
- `updatedAt`: `'2026-07-29'`
- `wave`: 1
- If `runtime: 'client'` → `monthlyCostCeiling: 0` and `runsInBrowser: true`
- If runtime is NOT client → `monthlyCostCeiling` > 0 and `runsInBrowser: false`
- If `leadTier: 'A'` → `serviceTarget` required
- `slug`, `category`, `icon`, `related`, `title`, `h1` — use EXACTLY the values in
  your tool spec. The `related` list is a designed site-wide graph; do not edit it.

Write `title`/`h1` as the phrase a person actually types into Google.

## Hard rules

TYPES
- `noUncheckedIndexedAccess` is ON: indexing yields `T | undefined`. Guard it. Never `!`.
- No `any` (Biome errors). No unused locals/params. `import type` for types.

PURE LOGIC
- Invalid/incomplete input NEVER throws — return a result object with `error?: string`.
  The caller re-renders per keystroke; half-typed input is the normal case.
- Guard `Number.isFinite`, negatives, absurd magnitudes.
- Money/precision: integer minor units, round ONCE at the end; components must
  reconcile exactly to totals.
- Anything random takes an injected `rng: () => number` parameter so tests can seed it.

COMPONENT
- All computation in logic.ts via `useMemo`/handlers; component = state + markup.
- Use ONLY existing classes: `field`, `label`, `hint`, `btn-brutal`, `btn-brutal-sm`,
  `btn-violet`, `btn-white`, `chip-tool`, `card-flat`, `eyebrow`, `container-site`,
  `tile-pastel` + standard Tailwind utilities.
- Colour tokens: `violet-50/100/400/500/600/700/800/900`, `cta`, `cta-pure`, `mint`,
  `green`, `lime`, `peach`, `cyan`, `tile-yellow/blue/lavender/green`, `cream`,
  `offwhite`, `ice`, `ink`, `ink-body`, `ink-muted`, `ink-subtle`, `ink-subtle-onice`,
  `line`, `line-grey`.
- Numeric/text output goes in `<ResultPanel>`/`<ResultRow>`; copyable output uses
  `<CopyButton text={...} />`. ResultPanel already has the aria-live region — never
  add a second one.
- Imports use the `@/` alias.

PREMIUM UX BAR (this site must beat its competitors — these are the table stakes)
- Instant feedback: results update as you type (no "submit" step unless the spec
  says the tool calls a server).
- Sensible, realistic DEFAULT VALUES so the first paint already shows a real result
  — never an empty form staring at the user.
- Empty, error and success states all designed; errors are specific and adjacent to
  the field they concern.
- Loading states for anything async (skeleton or staged progress text, never a bare
  spinner).
- Copy/download actions confirm in text ("Copied") not just an icon swap.
- Keyboard: everything reachable and operable; visible focus comes free from
  globals.css — do not suppress it.
- Mobile: single column stacks cleanly; inputs are ≥16px font (the `field` class
  handles it); touch targets ≥44px.

ACCESSIBILITY — verified, non-negotiable
- Every input has a real `<label htmlFor>`. Groups use `<fieldset><legend className="label">`.
- Toggle buttons use `aria-pressed`; `<button>` always `type="button"`.
- NEVER white text on `cta`/`mint`/`lime`/`peach`/`cyan` (all light — use `text-ink`).
- Inside `tile-*` pastels, accent text is `text-violet-700` (violet-500 fails AA on lavender).
- On `bg-ice` use `text-ink-subtle-onice` (plain `ink-subtle` fails AA there).
- Icons decorative: `aria-hidden="true"`; import named icons from `lucide-react`.
- Colour is never the only signal — pair pass/fail colours with text.

SEO CONTENT PLACEMENT
- The interactive tool is FIRST. All explanatory prose lives in meta.ts
  (howItWorks/limitations/faq) and is rendered below the tool by the shared shell.
  Do not put SEO copy inside the tool UI.

ROUTE HANDLERS (only if your spec includes one)
- Validate the target URL: `http:`/`https:` only; reject credentials in URL;
  hostname must not be localhost/`*.local`/`*.internal`; resolve and reject private
  and link-local ranges (127/8, 10/8, 172.16/12, 192.168/16, 169.254/16, ::1, fc00::/7).
- `AbortSignal.timeout(...)`, response size cap, redirect cap (manual, ≤3).
- Cache aggressively (`fetch` with `next: { revalidate: ... }`).
- Honest User-Agent: `ScultToolsBot/1.0 (+https://tools.scult.in)`.
- Never expose secrets client-side; read keys from `process.env`.

TESTS
- 12+ real assertions: happy path, edge cases, invalid input, and the specific
  correctness claims your meta's `howItWorks` makes. Test logic.ts only (no jsdom
  component rendering). Seed any randomness.

## Verify before you finish — do not report success you have not seen

From the repo root:

```
npx vitest run lib/tools/<slug>
npx tsc --noEmit
npx biome check lib/tools/<slug> components/tools/<ComponentName>.tsx
```

Iterate until YOUR files are clean. Ignore tsc errors that originate in OTHER
tools' not-yet-written files (other agents are working concurrently) — but zero
errors may originate in yours.
