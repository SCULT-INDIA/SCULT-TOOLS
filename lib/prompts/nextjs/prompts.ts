import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'nextjs-server-vs-client-component-boundary-audit',
    category: 'nextjs',
    title:
      'Decide exactly where the client/server boundary belongs in your component tree',
    description:
      'Reviews a component tree and pushes every "use client" boundary down to the smallest leaf that actually needs interactivity, with a named reason for each one.',
    promptText: `<context>
Framework: Next.js App Router, React {{react_version}}.
Component tree to review: {{component_tree}}
What actually needs to be interactive (state, event handlers, browser APIs): {{interactivity_requirements}}
</context>

<task>
Go through the component tree above and decide, component by component, whether it should be a Server Component (the default — no directive) or a Client Component ('use client'). Do not default to marking a whole page or layout as a Client Component because one child needs interactivity.
</task>

<decision_rules>
Mark a component 'use client' ONLY if it directly does at least one of:
- calls useState, useReducer, useEffect, or any other React hook that needs the browser
- attaches an event handler (onClick, onChange, onSubmit as a client handler, etc.)
- reads browser-only APIs (window, localStorage, navigator, IntersectionObserver)
- imports a third-party library that itself requires the client (a charting library, a rich-text editor, most drag-and-drop libraries)
- uses React context created with createContext for state that changes at runtime

Everything else stays a Server Component by default, including anything that only fetches data, reads env vars/secrets, or renders static markup.
When a component needs both — server-fetched data AND client interactivity — split it: fetch in a Server Component parent, pass the data down as props/children to a small Client Component that only handles the interactive part. Never lift the boundary higher than the smallest node that actually needs it.
</decision_rules>

<output_format>
A table: Component | Server or Client | One-line reason | If Client, which specific trigger from decision_rules applies.
Then, for any component you'd restructure (split a mixed component into a server parent + client leaf), show the before/after component boundary as a short tree diagram, not full code.
</output_format>`,
    variables: [
      {
        name: 'component_tree',
        description:
          'The component file(s) or a description of the tree you want reviewed.',
        example:
          'app/dashboard/page.tsx renders <Header>, <RevenueChart interactive filters>, <RecentOrdersTable> with a sort-by-column click handler',
        required: true,
      },
      {
        name: 'interactivity_requirements',
        description:
          'What in the tree genuinely needs to respond to user input in the browser.',
        example:
          'Users can filter the revenue chart by date range and click a table header to re-sort orders client-side',
        required: true,
      },
      {
        name: 'react_version',
        description:
          'The React version in use, since hook/Suspense behavior differs slightly.',
        example: '19',
        required: false,
      },
    ],
    targetTools: ['Cursor 2.1', 'Claude Code', 'GitHub Copilot'],
    tags: [
      'app-router',
      'server-components',
      'client-components',
      'react-19',
      'architecture',
    ],
    whyItWorks:
      '"use client" is not a per-component opt-in in isolation — it marks a boundary, and everything imported beneath that boundary in the module graph ships to the browser as JS, even server-only-looking children. A generic "is this interactive?" prompt tends to over-mark parents defensively, dragging entire subtrees into the client bundle. Giving the model a closed, checkable list of the actual triggers that require "use client" — hooks, event handlers, browser APIs, client-only libraries — turns a vague architectural judgment call into a per-component checklist it can apply consistently, and the explicit "split, don\'t lift" rule is the concrete fix for the single most common App Router mistake: marking a whole page "use client" because one child has an onClick handler.',
    exampleOutput: `Component | Type | Reason
Header | Server | Static nav, no state or handlers
RevenueChart | Client | Filter state (useState) + onChange handlers for the date range
RecentOrdersTable | Split | The table body renders server-fetched rows; only the column-header click handler needs "use client" — split into <OrdersTable> (server, fetches + renders rows) wrapping a small <SortableHeader> (client, owns sort state only)`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-14' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-14',
        note: 'Initial version, tested against Claude Code (Sonnet 4.6) and Cursor 2.1 on Next.js 15/16 App Router projects.',
      },
    ],
  },
  {
    slug: 'nextjs-cache-components-caching-strategy-audit',
    category: 'nextjs',
    title:
      'Catch the Date.now()-in-cache trap before Cache Components ships it to production',
    description:
      'Audits a route or component for caching correctness under the Cache Components model, flagging any dynamic API call trapped inside a "use cache" boundary.',
    promptText: `<context>
Next.js version and caching mode: {{nextjs_caching_mode}}
Code to audit (routes, layouts, components, and any 'use cache' functions): {{route_code}}
Freshness requirements in plain language — what's allowed to be stale, and for how long: {{freshness_requirements}}
</context>

<task>
Audit this code for caching correctness under the Cache Components model, where a component or function is dynamic (re-runs per request) by default UNLESS it's explicitly opted into caching with a 'use cache' directive at the top of the file or function. Do not assume the old "static unless you opt out" model — that default flipped.
</task>

<the_trap_to_check_for>
Inside any function or component marked 'use cache', flag every call to a dynamic API — Date.now(), new Date(), Math.random(), cookies(), headers(), searchParams read directly — as a bug, not a style note. Once that function is cached, whatever value those calls returned on the request that populated the cache entry gets frozen into every cached response until the entry's cacheLife expires or a matching cacheTag is revalidated. A "last updated" timestamp or a per-user value computed inside a 'use cache' scope will silently show the same frozen value to everyone who hits the cache, not just the first requester.
For each instance found, explain: what gets frozen, for how long (based on any cacheLife profile set), and the fix — either move the dynamic read outside the 'use cache' boundary (pass it in as an argument instead), or confirm the staleness is actually intended and the profile is scoped tightly enough.
</the_trap_to_check_for>

<other_checks>
- Does every 'use cache' function have an explicit cacheLife() profile, or is it relying on the default (call this out either way)?
- Are cacheTag() calls specific enough to invalidate correctly (e.g. tagged per-item, not one global tag for an entire dataset) given the freshness requirements above?
- Is anything cached that reads request-specific data (a user ID, an auth token) without that data being part of the cache key — a cross-user cache leak risk?
</other_checks>

<output_format>
A findings table: File/function | Issue | Severity (bug / needs-profile / leak-risk) | Fix. Then a one-paragraph summary of whether the current caching setup matches the stated freshness requirements.
</output_format>`,
    variables: [
      {
        name: 'route_code',
        description: "The route, layout, or 'use cache'-annotated functions to audit.",
        example:
          "app/products/[id]/page.tsx plus lib/get-product.ts which is wrapped in 'use cache'",
        required: true,
      },
      {
        name: 'freshness_requirements',
        description:
          "What's allowed to be stale and for how long, in plain business terms.",
        example:
          "Product descriptions can be up to 10 minutes stale; stock count and 'last updated' timestamp must always be current",
        required: true,
      },
      {
        name: 'nextjs_caching_mode',
        description: 'Next.js version and whether Cache Components/dynamicIO is enabled.',
        example: 'Next.js 16, cacheComponents enabled in next.config',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'Claude (Sonnet 4.6)'],
    tags: ['caching', 'cache-components', 'use-cache', 'performance', 'app-router'],
    whyItWorks:
      "This targets one specific, well-documented failure mode instead of asking generically 'review my caching' — a prompt vague enough to let the model nod along without checking anything concrete. The Cache Components model inverts the old default (static unless opted out, via export const dynamic) to dynamic unless opted in (via 'use cache'), and that inversion is exactly where the Date.now() trap lives: code written under the old mental model assumed a timestamp read at request time would just work, but once that same function gets wrapped in 'use cache' for a performance win, the timestamp freezes into the cache entry. Naming the exact dynamic APIs to search for (Date.now, new Date, Math.random, cookies, headers) gives the model a grep-able checklist instead of a vibe, and the cross-user cache-leak check catches the second most common Cache Components mistake: caching something keyed by a user without that user being part of the cache key.",
    exampleOutput:
      "lib/get-dashboard-summary.ts, marked 'use cache': calls new Date() to compute 'as of {date}' — frozen into the cache entry. With no cacheLife() set, this defaults to Next.js's default profile, so every dashboard visitor sees the same 'as of' date until the entry ages out or is revalidated, not the actual current time. Fix: pass the current date in as an argument from the (uncached) caller, or drop the caching if this value must always be live.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' },
      { tool: 'Cursor', version: '2.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: "Initial version, written against Next.js 16's stable Cache Components model and tested with Claude Code.",
      },
      {
        date: '2026-08-02',
        note: 'Added the cross-user cache-leak check after a review missed a cache key that omitted the session user ID.',
      },
    ],
  },
  {
    slug: 'nextjs-route-handler-api-design',
    category: 'nextjs',
    title: "Design a Route Handler that doesn't leak Express habits into the App Router",
    description:
      'Turns an API requirement into a properly structured app/api route.ts — right runtime, right status codes, right cache invalidation, not a copy-pasted Express handler.',
    promptText: `<context>
Endpoint purpose: {{endpoint_purpose}}
HTTP methods needed: {{http_methods}}
Request/response shape: {{request_response_shape}}
Runtime preference, if any: {{runtime_preference}}
</context>

<task>
Design the Route Handler(s) for this endpoint as they'd live in app/api/.../route.ts, using the Web-standard Request/Response APIs (NextRequest/NextResponse), not an Express-style (req, res) signature — there is no res object here.
</task>

<requirements>
- Export one named async function per HTTP method actually needed (GET, POST, PATCH, DELETE, etc.) — never a single catch-all handler that branches on req.method internally.
- Validate the request body/query against a schema before touching any business logic; return a 400 with field-level errors on validation failure, not a generic 500.
- Choose and state the runtime explicitly (export const runtime = 'nodejs' | 'edge') based on what the handler actually needs — edge runtime has no access to Node.js-only APIs (fs, most native modules, some crypto), so justify edge only if nothing in the handler needs those.
- If this handler causes data that's cached elsewhere in the app to go stale (a mutation), call revalidatePath or revalidateTag for the specific affected paths/tags after the mutation succeeds — never before, and never a broad revalidation when a narrow one would do.
- Return real HTTP status codes (201 on create, 204 on empty delete response, 409 on conflict, etc.) — not 200 for everything with an error message in the body.
</requirements>

<output_format>
The route.ts code, followed by a short list: which status codes are used and when, which runtime was chosen and why, and exactly what gets revalidated after a mutation.
</output_format>`,
    variables: [
      {
        name: 'endpoint_purpose',
        description: 'What this endpoint does, in one sentence.',
        example: "Lets an authenticated user update their team's billing address",
        required: true,
      },
      {
        name: 'http_methods',
        description: 'Which HTTP methods this route needs to support.',
        example: 'GET and PATCH',
        required: true,
      },
      {
        name: 'request_response_shape',
        description: 'The request body/query and response shape, roughly.',
        example:
          'PATCH body: { line1, city, postalCode, country }; response: the updated team object',
        required: true,
      },
      {
        name: 'runtime_preference',
        description: 'Edge or Node.js runtime, if it matters for this endpoint.',
        example:
          "Needs Node.js — the handler calls a Postgres client that isn't edge-compatible",
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'GitHub Copilot', 'Cursor 2.1'],
    tags: ['route-handlers', 'api-design', 'edge-runtime', 'rest', 'app-router'],
    whyItWorks:
      "Route Handlers use the standard Web Request/Response objects, not Express's (req, res) — a distinction generic 'build me an API endpoint' prompts routinely get wrong because most training data on Next.js APIs predates the App Router, or was written for the Pages Router's req/res-style API routes. Naming the exact export shape (one async function per HTTP method) and forcing an explicit runtime choice stops the model from defaulting to edge for convenience and then silently failing on a Node-only dependency at deploy time instead of at review time. The revalidatePath/revalidateTag requirement closes the gap that's easy to forget: a Route Handler that mutates data doesn't automatically invalidate anything cached elsewhere in the app — that has to be called explicitly, and scoped to the specific path or tag rather than nuked broadly.",
    exampleOutput:
      "PATCH /api/teams/[id]/billing-address returns 400 with { errors: { postalCode: 'required' } } on a bad payload, 200 with the updated team on success, then calls revalidateTag('team-' + id) so the team settings page (which reads the same data via a tagged fetch) picks up the change on next load instead of serving a stale cached copy.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' },
      { tool: 'GitHub Copilot', version: '2026.7', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial version, tested against Claude Code on Next.js 16 route handlers.',
      },
    ],
    relatedToolSlug: 'json-formatter',
  },
  {
    slug: 'nextjs-server-action-form-with-validation',
    category: 'nextjs',
    title:
      'Build a Server Action form with real validation, not a client fetch call in disguise',
    description:
      'Produces a form wired to a Server Action with schema validation, per-field errors, and useActionState-driven pending/error UI instead of hand-rolled loading state.',
    promptText: `<context>
Form fields: {{form_fields}}
What the submission actually does (the mutation): {{mutation_description}}
Validation library preference: {{validation_library}}
</context>

<task>
Build this as a real Server Action form: a <form action=(serverAction)> whose action prop is a function marked 'use server', not a client-side onSubmit handler that fetches an API route. Wire up pending and error state with useActionState (and useFormStatus for the submit button) instead of manual isLoading/error useState.
</task>

<requirements>
- Validate the submitted FormData against a schema server-side, inside the Server Action itself — never trust client-side validation alone, since the action can be invoked directly.
- Return field-level errors from the action in the shape useActionState expects, so each input can show its own error message instead of one generic banner.
- After a successful mutation, call revalidatePath (or revalidateTag) for whatever page/data this action affects, so the UI reflects the change without a manual client-side refetch.
- Keep the submit button disabled and showing a pending label via useFormStatus while the action is in flight — don't hand-roll this with a separate useState your Server Action has to remember to update.
- The form should still submit successfully with JavaScript disabled, since it's a real HTML form action — don't add anything (like preventDefault + fetch) that would break that.
</requirements>

<output_format>
Two files: the Server Action ('use server' function with validation), and the form component using useActionState/useFormStatus. Then one line confirming what gets revalidated on success.
</output_format>`,
    variables: [
      {
        name: 'form_fields',
        description: 'The fields in the form and their types.',
        example: 'displayName (text, required), bio (textarea, optional, max 280 chars)',
        required: true,
      },
      {
        name: 'mutation_description',
        description: 'What the Server Action actually does when it succeeds.',
        example: "Updates the current user's profile row in the database",
        required: true,
      },
      {
        name: 'validation_library',
        description: 'Which schema validation library to use.',
        example: 'Zod',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'v0 by Vercel'],
    tags: [
      'server-actions',
      'forms',
      'react-19',
      'validation',
      'progressive-enhancement',
    ],
    whyItWorks:
      "The load-bearing distinction here is that a Server Action attached directly to a form's action prop is a real HTML form submission the browser can execute natively — that's what makes it work with JavaScript disabled, and it's also exactly the property a client-side onSubmit-plus-fetch reimplementation throws away for no benefit. Requiring server-side validation inside the action itself (not just in the client form) matters because a Server Action is a callable server endpoint the client can invoke directly, bypassing whatever validation lives in the form component. And routing pending/error state through useActionState and useFormStatus instead of hand-rolled useState removes an entire class of bugs where the loading spinner and the actual action state drift out of sync — the hook is wired directly to the action's lifecycle, not to a variable the developer has to remember to flip.",
    exampleOutput:
      "Submitting a bio over 280 characters returns { errors: { bio: 'Must be 280 characters or fewer' } } from the action, which useActionState surfaces under the bio field specifically — the displayName field shows no error and its value is preserved. On success, revalidatePath('/profile') runs inside the action so the profile page shows the new bio immediately.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-18' },
      { tool: 'v0 by Vercel', version: '2026.6', date: '2026-07-19' },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial version, tested against Claude Code and v0 on React 19 / Next.js 16 forms.',
      },
    ],
  },
  {
    slug: 'nextjs-middleware-auth-guard',
    category: 'nextjs',
    title:
      'Write Next.js middleware that gates routes without slowing down every request',
    description:
      'Produces a middleware.ts auth guard scoped with a real matcher config, doing only a light session check at the edge instead of a full database round trip on every request.',
    promptText: `<context>
Routes that need protection: {{protected_route_patterns}}
How a valid session is identified: {{auth_check_method}}
Where to send unauthenticated users: {{redirect_destination}}
</context>

<task>
Write middleware.ts to gate the protected routes above. Scope it with a matcher config so it only runs on routes that actually need it — never a blanket middleware that runs on every request including static assets and public pages.
</task>

<constraints>
- Middleware runs on the Edge runtime by default, on every matched request, before any page renders — treat that as a hard latency and API-surface budget. Do only a light check here: read a session cookie/token and verify its signature/expiry. Do not make a database call, an external API call, or anything else with meaningful latency inside middleware.
- If deeper validation is needed (checking the session against a revocation list, loading full user permissions), do that light-then-heavy split: middleware does the cheap signature/expiry check and redirects obviously-invalid requests immediately; the actual page or a layout does the heavier check for anything that passed the cheap gate.
- Use the matcher config (or an explicit path check) to exclude _next/static, _next/image, favicon, and any public routes — don't rely on checking pathname manually inside the middleware body for exclusions that the matcher can handle declaratively.
- On redirect, preserve the original destination (e.g. as a callbackUrl query param) so the user lands back where they meant to go after authenticating.
</constraints>

<output_format>
The middleware.ts file with its config.matcher, followed by one sentence explaining what the middleware does NOT check (and where that heavier check actually lives instead).
</output_format>`,
    variables: [
      {
        name: 'protected_route_patterns',
        description: 'Which routes require an authenticated session.',
        example: '/dashboard/* and /settings/*, but not /dashboard/public-status',
        required: true,
      },
      {
        name: 'auth_check_method',
        description: 'How the middleware identifies a valid session cheaply.',
        example:
          "A signed JWT in a session cookie named __session, verified with the app's edge-compatible secret",
        required: true,
      },
      {
        name: 'redirect_destination',
        description: 'Where unauthenticated requests get redirected.',
        example: '/login',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'GitHub Copilot'],
    tags: ['middleware', 'authentication', 'edge-runtime', 'security', 'app-router'],
    whyItWorks:
      "Middleware's biggest practical risk isn't getting the auth logic wrong, it's putting the wrong kind of work in it: because middleware runs on every matched request on the Edge runtime before any caching or rendering happens, a database call or third-party API check placed there adds that latency to every single navigation, not just the ones that need deep validation. The explicit light-then-heavy split — cheap signature/expiry check in middleware, anything expensive pushed to a layout or page that only runs for requests that already passed the cheap gate — is the concrete fix, and stating it as a rule stops the model from reaching for the more 'thorough-looking' single-function version that happens to be slow. Requiring the matcher config instead of manual pathname checks also matters operationally: an unscoped middleware silently runs on _next/static and _next/image requests too, adding latency to every asset load on the site, not just page navigations.",
    exampleOutput:
      "config.matcher: ['/dashboard/:path*', '/settings/:path*']. Middleware verifies the __session JWT's signature and expiry only; it does NOT check whether the user's role still has access to a specific settings sub-page — that permission check happens in app/settings/layout.tsx, which does have database access and only runs for requests middleware already let through.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-11' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-16' },
    ],
    changelog: [
      {
        date: '2026-07-11',
        note: 'Initial version, tested against Claude Code on Next.js 16 middleware with edge JWT verification.',
      },
    ],
  },
  {
    slug: 'nextjs-parallel-routes-dashboard-layout',
    category: 'nextjs',
    title:
      'Build a multi-panel dashboard with parallel routes instead of client-side tab state',
    description:
      'Structures independent dashboard panels as parallel route slots that each stream, load, and error on their own, instead of one component juggling tab state and a single spinner.',
    promptText: `<context>
Dashboard panels needed, and roughly what each one shows: {{dashboard_panels}}
Independent navigation requirements — can panels change without a full page reload, do they need their own URLs: {{navigation_requirements}}
</context>

<task>
Structure this dashboard using parallel routes (the @folder convention) inside a shared layout.tsx, with one slot per independent panel, instead of a single page component that fetches everything and manages which panel is "active" with client-side state.
</task>

<requirements>
- Create one @slotName folder per panel under the layout, each with its own page.tsx that fetches only that panel's data.
- Give each slot its own loading.tsx so a slow panel shows its own skeleton and streams in independently — a slow analytics query should never block the activity feed panel from rendering.
- Give each slot its own error.tsx so one panel's fetch failure shows an inline error in that panel only, not a full-page crash.
- Add a default.tsx in each slot that returns null (or a sensible fallback) for the case where a hard navigation/refresh doesn't match that slot's most specific route — without it, Next.js 404s the whole layout on refresh for any slot that doesn't have a matching segment.
- The layout.tsx receives all slots as props (children plus each named slot) and arranges them in the grid/panel layout — it does not itself fetch data.
</requirements>

<output_format>
The folder structure (as a tree), the layout.tsx showing how slots are composed, and one paragraph confirming what happens on a hard refresh when only one slot's URL segment is present.
</output_format>`,
    variables: [
      {
        name: 'dashboard_panels',
        description: 'The independent panels the dashboard needs, and what each shows.',
        example: 'revenue chart (last 30 days), recent activity feed, team member list',
        required: true,
      },
      {
        name: 'navigation_requirements',
        description:
          'Whether panels need independent URLs/deep-linking or just independent rendering.',
        example:
          "The activity feed panel should support its own filter state in the URL; the others don't need deep-linking",
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'v0 by Vercel'],
    tags: ['parallel-routes', 'app-router', 'dashboard', 'streaming', 'layouts'],
    whyItWorks:
      "Parallel routes solve a specific problem generic React tab-state doesn't: each @slot is its own independent route segment with its own data fetching, loading.tsx, and error.tsx, which means a slow panel streams in on its own schedule and a failed panel shows its own error boundary — none of that requires the layout component to coordinate loading/error state by hand. The default.tsx requirement is the part most first attempts miss and the part that actually breaks in production: without it, refreshing the browser on a URL that only specifies one slot's segment causes Next.js to 404 the entire layout, because the other slots have no matching route for that navigation and no fallback to render instead.",
    exampleOutput:
      "app/dashboard/layout.tsx (with @revenue, @activity, @team slots) receives { children, revenue, activity, team } as props and arranges them in a CSS grid. Refreshing on /dashboard/activity/filtered renders @activity's matching segment, while @revenue and @team fall back to their default.tsx (rendering their last-known default view) instead of 404ing the page.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'v0 by Vercel', version: '2026.6', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial version, tested against Claude Code on a Next.js 16 App Router dashboard with three parallel slots.',
      },
    ],
  },
  {
    slug: 'nextjs-isr-revalidation-strategy',
    category: 'nextjs',
    title:
      'Pick a revalidation strategy instead of defaulting every page to revalidate: 60',
    description:
      'Matches ISR revalidation to how content actually changes — time-based, on-demand via revalidateTag, or a mix — instead of a copy-pasted 60-second default.',
    promptText: `<context>
Content type and where it lives: {{content_type}}
How often the underlying content actually changes, and who changes it: {{update_frequency}}
Traffic pattern for these pages: {{traffic_pattern}}
Does the CMS/data source support outgoing webhooks on publish/update: {{cms_webhook_availability}}
</context>

<task>
Recommend a revalidation strategy for this content — don't default to a flat time-based revalidate value without checking whether on-demand revalidation fits better.
</task>

<decision_framework>
- If the content source can fire a webhook on publish/update, prefer on-demand revalidation: call revalidateTag (tagged per content item, not one tag for the whole collection) from a Route Handler the webhook hits, instead of guessing a time interval. This keeps pages fresh immediately on change and avoids serving stale content between arbitrary time windows.
- If there's no webhook available, use time-based revalidation (the revalidate export or fetch's { next: { revalidate } } option), but set the interval based on the stated update frequency, not a round-number default — content that changes a few times a day doesn't need a 60-second check.
- For pages with heavy traffic and rarely-changing content, a longer revalidate window plus an on-demand revalidateTag/revalidatePath call for the rare actual update is usually better than a short polling-style interval that mostly serves the same cached page anyway.
- Flag any content where staleness has a real cost (pricing, inventory, live status) as a candidate for no caching at all (or a very short window) rather than trying to force ISR onto something that needs to be live.
</decision_framework>

<output_format>
A recommendation with the specific revalidate value or revalidateTag/webhook design, one sentence justifying the choice against the stated update frequency and traffic pattern, and a note on which cache tags to use if on-demand revalidation applies.
</output_format>`,
    variables: [
      {
        name: 'content_type',
        description: 'What the content is and where it is authored.',
        example: 'Blog posts authored in a headless CMS',
        required: true,
      },
      {
        name: 'update_frequency',
        description: 'How often this content actually changes.',
        example:
          'A handful of posts published or edited per week, at unpredictable times',
        required: true,
      },
      {
        name: 'traffic_pattern',
        description:
          'Roughly how much traffic these pages get and how it is distributed.',
        example:
          'Most traffic goes to the 10 most recent posts; older posts get occasional search traffic',
        required: true,
      },
      {
        name: 'cms_webhook_availability',
        description: 'Whether the content source can call a webhook on publish/update.',
        example: 'Yes — the CMS supports a publish webhook',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'Claude (Sonnet 4.6)'],
    tags: ['isr', 'revalidation', 'caching', 'performance', 'app-router'],
    whyItWorks:
      "A flat revalidate: 60 is the single most copy-pasted line in ISR examples, and it's usually wrong in both directions at once: too slow for content that just changed and needs to be live now, and too frequent for content that only changes a few times a week, which means most of those 60-second checks refetch identical data for no benefit. Framing the choice as a decision tree — webhook available means prefer on-demand revalidateTag, no webhook means size the interval to the actual update frequency — replaces a guessed number with a strategy grounded in how the content source actually behaves. Tagging per content item rather than per collection is the detail that keeps on-demand revalidation useful at scale: a single global tag means every update invalidates everything, which defeats the purpose of caching in the first place.",
    exampleOutput:
      "Recommendation: on-demand. The CMS supports a publish webhook, so a Route Handler at /api/revalidate calls revalidateTag('post-' + slug) when that webhook fires, tagged per post rather than one 'posts' tag for the whole blog. Fallback revalidate: 3600 (1 hour) stays as a safety net in case a webhook call is ever missed — not the primary freshness mechanism.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-09' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-15' },
    ],
    changelog: [
      {
        date: '2026-07-09',
        note: 'Initial version, tested against Claude Code on a Next.js 16 blog with on-demand revalidation via a CMS publish webhook.',
      },
    ],
  },
  {
    slug: 'nextjs-generate-metadata-seo-setup',
    category: 'nextjs',
    title: 'Wire up generateMetadata so every page actually gets dynamic SEO tags',
    description:
      'Adds a proper generateMetadata function per route — dynamic title/description from real data, canonical URLs, and Open Graph images — instead of a static object copied across pages.',
    promptText: `<context>
Page type and route: {{page_type}}
Where the page's data comes from (same source generateMetadata should read): {{page_data_source}}
Site domain, for absolute URLs: {{site_domain}}
</context>

<task>
Add or fix generateMetadata for this route. If the page's title/description depend on data (a product name, a blog post title), generateMetadata must be an async function that fetches that same data — using the shared fetch/data function so the request gets deduped against the page component's own fetch, not a second separate query.
</task>

<requirements>
- Export generateMetadata as an async function accepting the same params/searchParams the page receives, and return title, description, and openGraph fields built from real fetched data, not placeholder text.
- Set metadataBase in the root layout's metadata export to {{site_domain}} so relative OG/Twitter image paths resolve to absolute URLs — don't hardcode the domain into every individual page's metadata.
- Set a canonical URL per page via alternates.canonical, especially for any route reachable through more than one URL pattern (query params, trailing slash variants).
- For pages that shouldn't be indexed (draft content, internal tools, duplicate parameterized views), set robots: { index: false } explicitly rather than relying on it being excluded from a sitemap alone.
- If the data fetch inside generateMetadata fails or returns nothing (e.g. a deleted product), return sensible fallback metadata (a generic title, noindex) instead of letting the function throw and take down the whole page render.
</requirements>

<output_format>
The generateMetadata function code, plus one line confirming the fetch it makes is the same cached/deduped call the page component uses (name the shared function), and one line listing which routes on this app should be marked noindex.
</output_format>`,
    variables: [
      {
        name: 'page_type',
        description: 'What kind of page this is.',
        example: 'A product detail page at /products/[slug]',
        required: true,
      },
      {
        name: 'page_data_source',
        description: "Where the page's data comes from.",
        example:
          'getProduct(slug) — a shared data-fetching function used by both the page and generateMetadata',
        required: true,
      },
      {
        name: 'site_domain',
        description:
          "The site's production domain, for metadataBase and absolute OG URLs.",
        example: 'https://shop.example.com',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'GitHub Copilot'],
    tags: ['generatemetadata', 'seo', 'open-graph', 'metadata', 'app-router'],
    whyItWorks:
      "generateMetadata runs on the server and resolves before the page's HTML shell is sent, which is exactly why it has to use the same shared data-fetching function as the page component rather than its own separate query — Next.js's fetch memoization dedupes identical requests made during the same render, so calling getProduct(slug) from both generateMetadata and the page costs one network request, not two, but only if it's actually the same function call, not a copy-pasted variant. The metadataBase requirement fixes a mistake that's invisible in local dev (relative image paths resolve fine against localhost) and only breaks in production when a social platform tries to fetch an OG image from a relative path with no origin. And the explicit fallback-on-failure rule matters because generateMetadata throwing on a 404'd product would otherwise take down the entire page render, not just the metadata.",
    exampleOutput:
      "generateMetadata for /products/[slug] returns { title: product.name + ' | Example Shop', description: product.shortDescription, openGraph: { images: [product.heroImage] } } using the same getProduct(slug) call the page uses. If getProduct returns null, metadata falls back to { title: 'Product not found', robots: { index: false } } instead of throwing.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-05' },
      { tool: 'GitHub Copilot', version: '2026.7', date: '2026-07-10' },
    ],
    changelog: [
      {
        date: '2026-07-05',
        note: 'Initial version, tested against Claude Code on Next.js 16 dynamic product pages.',
      },
    ],
    relatedToolSlug: 'schema-markup-generator',
  },
  {
    slug: 'nextjs-image-optimization-audit',
    category: 'nextjs',
    title: 'Audit a page for next/image misuse before Lighthouse catches it',
    description:
      "Scans a page's images for missing priority hints, wrong fill/dimension usage, and un-allow-listed remote domains — the mistakes that quietly tank LCP and CLS.",
    promptText: `<context>
Page or component code to audit: {{page_code}}
External image domains in use, if any: {{image_hosting_domains}}
</context>

<task>
Audit every image on this page for next/image correctness. Flag anything using a plain <img> tag where next/image should be used, and anything using next/image incorrectly in a way that would hurt Core Web Vitals.
</task>

<checklist>
- Plain <img> tags for content images: flag for conversion to next/image, unless there's a specific reason (e.g. an SVG icon, or an image whose dimensions genuinely can't be known ahead of time) — name that reason if you're leaving one as-is.
- The largest above-the-fold image (the likely LCP element): must have priority set to disable lazy-loading; if it's currently lazy-loaded by default, that's a direct LCP regression, flag it as high severity.
- Every other next/image usage: should NOT have priority set — marking every image priority defeats the point and front-loads bandwidth for images the user may never scroll to.
- Any image using fill: confirm its parent element has position: relative (or similar) and defined dimensions; fill with an unsized/static parent causes the image to collapse or overflow.
- Any image using explicit width/height instead of fill: confirm the values match (or are proportional to) the actual source image's aspect ratio — mismatched dimensions cause layout shift or a distorted image.
- Any image sourced from an external domain: confirm that domain is in next.config's images.remotePatterns; flag any that aren't — those requests fail at request time in production, not at build time, so this often only surfaces after deploy.
- Images that resize significantly across breakpoints (e.g. full-width on mobile, one-third width on desktop): confirm a sizes attribute is set so the browser downloads an appropriately sized file at each breakpoint, not the largest variant everywhere.
</checklist>

<output_format>
A findings table: Image/location | Issue | Severity (LCP-impacting / CLS-impacting / will-fail-in-prod / minor) | Fix.
</output_format>`,
    variables: [
      {
        name: 'page_code',
        description: 'The page or component containing the images to audit.',
        example:
          'app/blog/[slug]/page.tsx — hero image plus inline images in the post body',
        required: true,
      },
      {
        name: 'image_hosting_domains',
        description:
          'External domains images are served from, to check against remotePatterns.',
        example: 'images.ctfassets.net (Contentful), cdn.example-cms.com',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'GitHub Copilot'],
    tags: ['next-image', 'performance', 'core-web-vitals', 'lcp', 'image-optimization'],
    whyItWorks:
      "Most next/image mistakes are invisible in local development and only show up in a Lighthouse report or a production error weeks later, which is exactly why a targeted checklist beats a general 'optimize my images' ask: the priority-on-the-LCP-image rule catches a lazy-loaded hero image that's actively hurting LCP score, the fill-needs-a-sized-relative-parent rule catches a collapse bug that only appears at certain viewport widths, and the remotePatterns check catches a failure mode that doesn't exist at build time at all — an un-allow-listed external domain builds successfully and only fails when a real request hits it in production. Distinguishing 'every image should have priority' from 'exactly the LCP image should' also matters because the naive fix (add priority everywhere) removes the lazy-loading benefit for every image below the fold, trading one performance problem for a worse one.",
    exampleOutput:
      "Hero image at app/blog/[slug]/page.tsx line 14: plain <img>, no priority equivalent, likely the LCP element — convert to next/image with priority. Inline post-body images: using next/image correctly but sourced from cdn.example-cms.com, which isn't in remotePatterns — will fail in production despite working in local dev if that domain happens to be cached.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial version, tested against Claude Code on a Next.js 16 blog with a CMS-hosted image domain.',
      },
    ],
    relatedToolSlug: 'website-speed-test',
  },
  {
    slug: 'nextjs-pages-to-app-router-migration-plan',
    category: 'nextjs',
    title:
      'Turn a Pages Router codebase into a phased App Router migration, not a risky rewrite',
    description:
      'Produces a route-by-route migration plan that runs Pages Router and App Router side by side, converting data-fetching methods and shared layout as it goes.',
    promptText: `<context>
Current pages/ directory structure: {{pages_directory_listing}}
Data-fetching methods currently used and where: {{data_fetching_methods_used}}
Shared layout/elements currently in _app.tsx / _document.tsx: {{shared_layout_elements}}
</context>

<task>
Produce a phased migration plan from the Pages Router to the App Router for this codebase. Pages Router (pages/) and App Router (app/) can coexist in the same Next.js project, so plan this as an incremental, route-by-route migration — not a big-bang rewrite done on one branch all at once.
</task>

<migration_plan_requirements>
- Order routes by risk and traffic: recommend migrating low-traffic, low-risk routes first to validate the approach, and the highest-traffic/most-critical routes last, once the pattern is proven.
- For each data-fetching method in use, state its App Router equivalent and the mental model shift, not just a mechanical swap:
  - getStaticProps becomes an async Server Component that fetches directly, with the equivalent caching behavior expressed via fetch's cache/revalidate options, not a special function.
  - getServerSideProps becomes an async Server Component with a fetch call that opts out of caching (cache: 'no-store'), or reads a dynamic API like cookies()/headers() that forces dynamic rendering.
  - getInitialProps: flag this one explicitly as needing the most rework, since it ran on both server and client and has no direct App Router equivalent.
- Move shared elements from _app.tsx/_document.tsx into app/layout.tsx (the root layout) once, not per-route — this should happen early, since both routers can share global styles/providers through careful setup, but duplicate providers during the transition is a common source of bugs.
- Convert pages/api routes to app/api/.../route.ts one at a time, in whatever order matches the page migration, not as a separate all-at-once phase.
- Call out any Pages Router-only APIs still in use (next/router's useRouter differs from next/navigation's, custom _error.tsx handling, etc.) that need a direct behavioral adjustment, not just a file move.
</migration_plan_requirements>

<output_format>
A phased table: Phase | Routes/files migrated | Data-fetching conversion needed | Risk notes. Then a short "do this first, regardless of phase" list for the _app.tsx/_document.tsx to root layout move.
</output_format>`,
    variables: [
      {
        name: 'pages_directory_listing',
        description: 'The current pages/ structure, or a summary of it.',
        example:
          'pages/index.tsx, pages/blog/[slug].tsx (getStaticProps), pages/dashboard.tsx (getServerSideProps, behind auth), pages/api/checkout.ts',
        required: true,
      },
      {
        name: 'data_fetching_methods_used',
        description: 'Which data-fetching methods are used, and roughly where.',
        example:
          'getStaticProps on the blog, getServerSideProps on the dashboard, getInitialProps on the legacy account page',
        required: true,
      },
      {
        name: 'shared_layout_elements',
        description: "What's currently in _app.tsx/_document.tsx that needs a new home.",
        example:
          'A ThemeProvider, a global Header/Footer, and a custom <Html lang> in _document.tsx',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'GitHub Copilot'],
    tags: [
      'migration',
      'pages-router',
      'app-router',
      'getserversideprops',
      'incremental-adoption',
    ],
    whyItWorks:
      "The single fact that makes this migration tractable instead of terrifying is one most teams don't realize going in: pages/ and app/ coexist in the same Next.js project, and Next.js resolves routes across both, so migration can happen one route at a time on main instead of on a long-lived branch that has to land all at once. Mapping each data-fetching method to its App Router equivalent as a mental-model shift rather than a mechanical rename matters because getServerSideProps and a no-store fetch in a Server Component aren't quite the same thing — the latter is just one fetch call opting out of caching, while the whole component around it defaults to static unless something forces it dynamic, which is a different way of thinking about the page. Explicitly flagging getInitialProps as the hard case, and ordering the plan by risk rather than alphabetically, both come from the same practical bias: prove the pattern on something that doesn't matter much before touching the route that generates revenue.",
    exampleOutput:
      "Phase 1: migrate pages/blog/[slug].tsx (getStaticProps to an async Server Component with a cached fetch) — low traffic, low risk, validates the pattern. Phase 2: move _app.tsx's ThemeProvider and Header/Footer into app/layout.tsx once, shared by both routers going forward. Phase 3: pages/dashboard.tsx (getServerSideProps to a Server Component using cookies() to force dynamic rendering, since it's behind auth). Phase 4 (last, highest risk): the legacy account page using getInitialProps — flagged for a rewrite, not a mechanical conversion, since it has no direct equivalent.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-19' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-19',
        note: 'Initial version, tested against Claude Code on a mixed Pages/App Router Next.js 16 project.',
      },
    ],
  },
  {
    slug: 'nextjs-streaming-suspense-loading-ui',
    category: 'nextjs',
    title: "Design loading UI so one slow query doesn't block a whole page from painting",
    description:
      "Places loading.tsx and granular Suspense boundaries around a page's actual data dependencies, so fast content streams in immediately instead of waiting on the slowest fetch.",
    promptText: `<context>
Page and its data dependencies, roughly in order of how fast each one resolves: {{page_data_dependencies}}
The slowest data source on this page: {{slowest_data_source}}
</context>

<task>
Design the loading UI for this page using route-level loading.tsx and granular Suspense boundaries, so the page streams in as each piece of data resolves instead of showing one full-page spinner until the slowest fetch finishes.
</task>

<requirements>
- Use loading.tsx at the route segment level for the initial navigation fallback — this automatically wraps the segment in a Suspense boundary, so it should show a skeleton that roughly matches the eventual layout, not a generic spinner.
- Identify which pieces of the page are independent of each other's data (don't need to wait on one another) and wrap each in its own Suspense boundary with its own fallback, so they can resolve and stream in on their own schedule. The slowest data source above should never be awaited at the top of the page component in a way that blocks everything else from rendering.
- Give each Suspense boundary a fallback that's sized and shaped like the real content (a skeleton with matching dimensions), not a generic centered spinner that causes a layout jump when the real content swaps in.
- If a section legitimately needs to wait on another (e.g. a detail panel that needs to know which item was selected first), don't force it into a parallel Suspense boundary — nest it, or leave it sequential, and say so explicitly rather than parallelizing something that has a real dependency.
- Note where this interacts with caching: a Suspense boundary around a component doesn't change whether that component's data is cached — that's a separate decision — it only changes when the browser sees the result.
</requirements>

<output_format>
The page's Suspense structure (as a component tree, fallback components sketched not fully styled), plus a one-line note on which sections are truly independent vs. genuinely sequential.
</output_format>`,
    variables: [
      {
        name: 'page_data_dependencies',
        description:
          "The page's data dependencies and roughly how they compare in speed.",
        example:
          'user profile header (fast, cached), order history table (medium), real-time inventory sync status (slow, external API)',
        required: true,
      },
      {
        name: 'slowest_data_source',
        description: 'Which data source is the slowest, and why if known.',
        example:
          'The inventory sync status — it calls a third-party API with ~2s typical latency',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'v0 by Vercel'],
    tags: ['suspense', 'streaming', 'loading-ui', 'app-router', 'react-19'],
    whyItWorks:
      "The mechanism worth naming explicitly is that loading.tsx isn't just a fallback file — it automatically wraps the whole route segment in a Suspense boundary, which is why a single loading.tsx at the page level still produces an all-or-nothing spinner if nothing inside the page has its own, more granular boundaries. The fix is structural, not decorative: identifying which sections are actually independent and giving each its own Suspense means the fast profile header can paint immediately while the slow third-party inventory check is still pending, instead of the whole page waiting on the slowest promise in the tree. Explicitly separating 'independent — parallelize' from 'genuinely sequential — don't force it' stops the model from over-applying Suspense boundaries to sections that have a real data dependency on each other, which just adds waterfall complexity without the streaming benefit. And calling out that Suspense affects when content is shown, not whether it's cached, prevents conflating two decisions that are easy to blur together but are actually orthogonal.",
    exampleOutput:
      "Suspense tree: <ProfileHeader> resolves fast, renders immediately, no boundary needed if it's not the bottleneck. A Suspense boundary around <OrderHistory> (fallback: OrderHistorySkeleton) and a separate one around <InventoryStatus> (fallback: InventoryStatusSkeleton) sit as siblings, so the order history table appears well before the 2-second inventory check resolves, instead of both being gated behind the slower one.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' },
      { tool: 'v0 by Vercel', version: '2026.6', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial version, tested against Claude Code on a Next.js 16 dashboard page with an external API dependency.',
      },
    ],
  },
  {
    slug: 'nextjs-monorepo-multi-app-structure',
    category: 'nextjs',
    title:
      'Structure a monorepo running multiple Next.js apps without duplicating your design system',
    description:
      'Lays out a Turborepo/pnpm workspace for several Next.js apps sharing UI, types, and config through internal packages instead of copy-pasted code.',
    promptText: `<context>
Apps that need to live in this monorepo: {{apps_list}}
What should be shared across them (UI components, types, config, utilities): {{shared_packages_needed}}
Package manager: {{package_manager}}
</context>

<task>
Design the monorepo layout for these apps using Turborepo and {{package_manager}} workspaces, with shared code living in internal packages that each app depends on via the workspace protocol — not copy-pasted between app directories.
</task>

<structure_requirements>
- apps/ holds one folder per deployable Next.js app, each with its own next.config, package.json, and env files — Next.js only loads .env files from the app's own root directory, not the repo root, so each app manages its own environment variables even for values that happen to be the same across apps.
- packages/ holds shared, non-deployable code: a UI package for shared components, a config package for shared eslint/tsconfig/tailwind config, a types package if there's a shared domain model, each with its own package.json.
- Apps depend on internal packages via the workspace protocol (e.g. "@repo/ui": "workspace:*"), so changes to a shared package are picked up by every app that depends on it without a publish step.
- Configure turbo.json's task pipeline so that build/lint/test tasks declare their real dependencies (a package's build must complete before an app that depends on it builds), and so turbo's caching can skip rebuilding an app when nothing it actually depends on changed — don't leave every task marked as depending on the whole repo.
- Decide, and state explicitly, whether each app deploys independently (separate Vercel projects/domains) or as part of one deployment — this affects whether env vars and preview deployments are configured per-app or centrally.
</structure_requirements>

<output_format>
The folder tree (apps/ and packages/ with their contents), an example turbo.json pipeline entry showing the dependency between a shared package's build and an app's build, and one paragraph on the env-file gotcha above.
</output_format>`,
    variables: [
      {
        name: 'apps_list',
        description: 'The Next.js apps that need to live in the monorepo.',
        example:
          'marketing site (apps/web), customer dashboard (apps/dashboard), internal admin tool (apps/admin)',
        required: true,
      },
      {
        name: 'shared_packages_needed',
        description: 'What should be shared across the apps instead of duplicated.',
        example:
          'A design-system UI package, shared TypeScript types for the API, shared eslint/tsconfig',
        required: true,
      },
      {
        name: 'package_manager',
        description: 'Which package manager the workspace uses.',
        example: 'pnpm',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor 2.1', 'GitHub Copilot'],
    tags: ['monorepo', 'turborepo', 'pnpm-workspaces', 'multi-app', 'shared-packages'],
    whyItWorks:
      "The env-file detail is the one that actually bites teams in production and rarely shows up in a generic monorepo tutorial: Next.js resolves .env files relative to each app's own root, not the monorepo root, so a shared .env file at the repo root silently does nothing for any app — every app needs its own env files even for variables that are identical across apps. The workspace-protocol dependency (workspace:*) is what makes shared packages actually useful instead of aspirational: without it, 'shared' UI components just get copy-pasted at the first divergence because there's no live link between the package and its consumers. And making the turbo.json task graph reflect real dependencies, rather than defaulting every task to depend on the whole repo, is what makes the monorepo's build actually faster than separate repos would have been — the entire reason to accept the coordination overhead of a monorepo in the first place.",
    exampleOutput:
      "apps/web, apps/dashboard, apps/admin each with their own next.config.ts, package.json, .env.local. packages/ui (shared components), packages/config (shared eslint-config, tsconfig-base), packages/types (shared API types). turbo.json: dashboard's build task lists ['^build'] as a dependency, meaning packages/ui and packages/types build first, and turbo only rebuilds dashboard when its own files or one of those two packages' outputs actually changed — not on every commit to apps/admin.",
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-13' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-17' },
    ],
    changelog: [
      {
        date: '2026-07-13',
        note: 'Initial version, tested against Claude Code laying out a three-app Turborepo/pnpm workspace with Next.js 16 apps.',
      },
    ],
  },
]
