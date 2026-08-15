import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'nextjs-server-client-component-boundary-audit',
    category: 'nextjs',
    title:
      'Decide exactly where the client/server boundary belongs in your component tree',
    description:
      "Reviews a component tree and pushes every 'use client' directive down to the smallest leaf that actually needs it, with a named trigger for each boundary instead of a gut-feel call.",
    promptText: `You are auditing a Next.js App Router component tree to decide, component by component, whether each one should stay a Server Component (the default, no directive) or become a Client Component ('use client'). The goal is to push every client boundary down to the smallest leaf that genuinely needs it, never up to a shared ancestor for convenience.

COMPONENT TREE
{{component_tree}}

WHAT ACTUALLY NEEDS TO RUN IN THE BROWSER
{{interactivity_requirements}}

CURRENT BOUNDARY PLACEMENT
{{current_boundary_placement}}

REACT VERSION
{{react_version}}

DECISION RULES
Mark a component 'use client' only if it directly does at least one of the following: calls a stateful hook such as useState, useReducer, or a hook that reads a browser API; attaches a real event handler like onClick, onChange, or a client-side onSubmit; reads window, document, localStorage, navigator, or any other browser-only global; imports a third-party library that itself requires the client runtime, such as most charting libraries, rich-text editors, and drag-and-drop libraries; or consumes a React Context created with createContext for a value that changes at runtime. Every other component defaults to a Server Component, including anything that only fetches data, reads environment variables or secrets, or renders markup with no runtime behavior of its own, regardless of how deep it sits in the tree.

When a single component needs both server-fetched data and client interactivity, do not resolve the tension by making the whole thing a Client Component and fetching data with useEffect instead. Split it: keep the data fetch in a Server Component parent or grandparent, and pass the fetched data down as props or children into a small Client Component that owns only the interactive slice. Never move the 'use client' boundary higher in the tree than the smallest node that actually needs it, because everything imported beneath a client boundary in the module graph ships to the browser as JavaScript, including modules that look server-safe on their own — a chart library imported by a client-marked parent bundles into the client even if the specific component rendering the chart does nothing browser-specific itself.

If a component that is already marked 'use client' today does not actually meet any trigger in the rules above, treat that as a real finding, not a stylistic nitpick. Name what it currently costs — a heavier client bundle, a subtree that could have streamed server-rendered HTML but instead ships as an empty shell waiting for hydration — and recommend converting it back to a Server Component rather than leaving it as a safe-looking default.

OUTPUT FORMAT
A table: Component | Current marking | Recommended marking | Trigger from the rules that justifies Client (or "none — revert to Server") | One-line reason. Then, for every component you would restructure by splitting a mixed component into a server parent plus a client leaf, show the before/after boundary as a short tree diagram, not full code. Close with one paragraph describing what actually changes in the client JavaScript bundle if every recommendation here is applied, naming which specific dependency stops shipping to the browser.`,
    variables: [
      {
        name: 'component_tree',
        description: 'The component file(s), or a description of the tree to review.',
        example:
          "app/checkout/page.tsx renders <OrderSummary>, <PromoCodeForm>, <ShippingAddressPicker>, and <PaymentButton>, all currently imported into one page component marked 'use client' at the top.",
        required: true,
      },
      {
        name: 'interactivity_requirements',
        description: 'What in the tree genuinely needs to run in the browser.',
        example:
          'PromoCodeForm needs an input and an apply button with pending state; ShippingAddressPicker needs a client-side address autocomplete widget; PaymentButton opens a third-party payment SDK modal on click.',
        required: true,
      },
      {
        name: 'current_boundary_placement',
        description: "Where 'use client' currently sits, and what that is costing today.",
        example:
          "The entire page.tsx has 'use client' at the top, so OrderSummary re-fetches and re-renders on the client via useEffect instead of being server-rendered with the order data it already had at request time.",
        required: true,
      },
      {
        name: 'react_version',
        description:
          'The React version in use, since some interactivity triggers shifted across versions.',
        example: '19',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'app-router',
      'server-components',
      'client-components',
      'react-19',
      'bundle-size',
      'architecture',
    ],
    whyItWorks:
      '"use client" is not a per-component opt-in evaluated in isolation — it marks a boundary in the module graph, and every module imported beneath that boundary ships to the browser as JavaScript regardless of whether that specific module does anything browser-specific on its own. A generic "is this interactive?" review tends to mark parents defensively, which drags entire subtrees — including server-safe children imported alongside the one component that actually needs the browser — into the client bundle without anyone deciding that on purpose. Giving the model a closed, checkable list of the actual triggers that require \'use client\' turns a vague architectural judgment call into a per-component checklist it can apply consistently instead of pattern-matching on "this looks like it might need state." The explicit split-don\'t-lift rule targets the single most common App Router mistake directly: a page gets marked \'use client\' because one child has an onClick handler, and everything else in that page — including data-fetching logic that worked fine as a plain async function — gets rewritten around useEffect and a loading state that didn\'t need to exist. Requiring a finding, not a shrug, when an existing client boundary doesn\'t meet any real trigger matters because these boundaries accumulate silently: a component gets marked \'use client\' once for a reason that gets refactored away later, and nothing in a normal code review flags that the directive is now dead weight, since the code still runs correctly either way — it just runs in the wrong place, shipping bytes to every visitor\'s browser for no behavior anyone can observe. Naming the actual bundle consequence at the end, rather than stopping at "this should be a Server Component," is what makes the recommendation actionable to someone who has to justify the change in a PR — "remove this boundary" is a stylistic ask, while "this stops shipping a 40KB charting library to visitors who never open the chart panel" is a reviewable claim with a real, measurable payoff attached to it.',
    exampleOutput: `Component | Current | Recommended | Trigger | Reason
OrderSummary | Client (inherited) | Server | none | Only renders order data, no hooks or handlers of its own
PromoCodeForm | Client | Client | useState + onSubmit | Owns the input value and the pending state of the apply button
ShippingAddressPicker | Client | Client | third-party autocomplete library | The autocomplete widget itself requires the browser
PaymentButton | Client | Client | onClick opens a client-only SDK modal | Correctly scoped already — no change needed

Restructure: split the page into a Server Component that fetches the order and renders <OrderSummary> directly, wrapping only <PromoCodeForm>, <ShippingAddressPicker>, and <PaymentButton> in their own small client leaves. Bundle impact: the payment SDK and the autocomplete library still ship (they're genuinely needed), but OrderSummary's rendering logic and any data-formatting helpers it used no longer cross into the client bundle at all.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on Next.js 16 App Router projects.',
      },
    ],
  },
  {
    slug: 'nextjs-cache-components-use-cache-trap-audit',
    category: 'nextjs',
    title:
      'Catch the Date.now()-in-cache trap before Cache Components ships it to production',
    description:
      "Audits routes and 'use cache' functions for the frozen-timestamp trap and cross-user cache-key leaks under the Cache Components model, where dynamic is now the default and caching is the explicit opt-in.",
    promptText: `You are auditing Next.js code for caching correctness under the Cache Components model, where a component or function is dynamic — it re-runs on every request — by default, unless it explicitly opts into caching with a 'use cache' directive at the top of the file or the function. Treat that inversion as the baseline for this audit; do not assume the older static-unless-opted-out model still applies anywhere in this codebase.

CACHING MODE AND VERSION
{{nextjs_caching_mode}}

CODE TO AUDIT
{{route_code}}

FRESHNESS REQUIREMENTS
{{freshness_requirements}}

KNOWN CACHE-RELATED INCIDENTS
{{known_incidents}}

THE TRAP TO CHECK FOR
Inside every function or component marked 'use cache', search for a call to a dynamic API: Date.now(), new Date(), Math.random(), cookies(), headers(), or a searchParams value read directly inside the cached scope. Flag every instance as a bug, not a style note. Once a function is cached, whatever value one of these calls happened to return on the request that populated that specific cache entry is frozen into every response served from that entry until its cacheLife profile expires or a matching cacheTag triggers revalidation — a "last updated" timestamp, a per-user greeting, or a randomized A/B assignment computed inside a 'use cache' scope will show the same frozen value to every visitor who hits that cache entry, not just the first one who happened to populate it. For every instance found, state exactly what value gets frozen, for how long given any cacheLife profile that's actually set (or the platform default if none is), and the fix: either move the dynamic read outside the 'use cache' boundary and pass it in as an argument from the uncached caller, or confirm explicitly that the staleness is genuinely intended and the cacheLife profile is scoped tightly enough to match that intent.

OTHER CHECKS
Confirm every 'use cache' function has an explicit cacheLife() profile rather than silently relying on the platform default — call this out either way, since an unnamed default is itself a decision nobody actually made on purpose. Check that cacheTag() calls are specific enough to invalidate correctly given the freshness requirements above — a single global tag covering an entire collection means any one item's update invalidates everything cached under that tag, which technically works but defeats the purpose of caching at the granularity the underlying data actually changes at. Flag anything cached that reads request-specific data — a user ID, a session token, a role, a tenant identifier — without that value being part of what determines the cache key, since that is a cross-user cache leak: one user's cached response getting served back to a completely different user who happens to hit the same cache entry next.

OUTPUT FORMAT
A findings table: File or function | Issue | Severity — bug, needs-profile, or leak-risk | Fix. Follow the table with one paragraph stating plainly whether the current caching setup, taken as a whole, actually matches the stated freshness requirements, and naming the single highest-risk finding first if more than one bug was found.`,
    variables: [
      {
        name: 'nextjs_caching_mode',
        description: 'Next.js version and whether Cache Components is enabled.',
        example: 'Next.js 16.1, cacheComponents: true in next.config.ts',
        required: true,
      },
      {
        name: 'route_code',
        description: "The route, layout, or 'use cache'-annotated functions to audit.",
        example:
          "app/account/page.tsx plus lib/get-account-summary.ts, which is wrapped in 'use cache' and calls new Date() to build a 'balance as of' string.",
        required: true,
      },
      {
        name: 'freshness_requirements',
        description:
          "What's allowed to be stale and for how long, in plain business terms.",
        example:
          "Account balance must always be current; the 'member since' date can be cached indefinitely; notification counts can be up to 2 minutes stale.",
        required: true,
      },
      {
        name: 'known_incidents',
        description:
          'Any real bug reports or support tickets tied to stale or leaked cached data, if there are any.',
        example:
          'A support ticket reported two different users seeing the same account balance figure for about six minutes after a manual cache warm-up script ran.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude'],
    tags: [
      'caching',
      'cache-components',
      'use-cache',
      'app-router',
      'performance',
      'cache-invalidation',
    ],
    whyItWorks:
      "This targets one specific, well-documented failure mode instead of asking generically to \"review the caching,\" a prompt vague enough that a model can nod along without checking anything concrete. The Cache Components model inverts the old default — static unless opted out via export const dynamic — into dynamic unless opted in via 'use cache', and that inversion is exactly where the Date.now() trap lives: code written under the old mental model assumed a timestamp read at request time would just work, and it did, right up until that same function got wrapped in 'use cache' for a performance win and the timestamp froze into the cache entry instead of staying live. Naming the exact dynamic APIs to search for — Date.now, new Date, Math.random, cookies, headers, a direct searchParams read — gives the model a grep-able checklist instead of a vibe, which matters because these calls look completely ordinary in isolation; nothing about new Date() looks dangerous unless the reviewer specifically knows it is sitting inside a cached scope, which is precisely the kind of local-looks-fine, global-is-broken bug that a line-by-line read easily misses without being told to look for this exact pattern. The cross-user cache-leak check catches a second, distinct failure mode that the timestamp trap doesn't cover at all: caching is correct in the sense that nothing froze incorrectly, but the cache key itself doesn't include the identity that actually varies the response, so one user's fetched data gets served to the next user who happens to land on the same cache entry — a bug that a staleness-only audit would walk right past because nothing in it is stale, it's simply attributed to the wrong person. Requiring an explicit statement of whether every 'use cache' function has a named cacheLife profile, rather than silently accepting the default, forces a decision that's easy to skip during a first pass at adopting the model — an unset profile isn't neutral, it's a real default duration that nobody chose on purpose, and surfacing that as its own checkable item is what stops it from being discovered later as a production incident instead of a review comment.",
    exampleOutput: `lib/get-account-summary.ts, marked 'use cache': calls new Date() to compute "balance as of {date}" — frozen at whatever moment first populated the cache entry. No cacheLife() is set, so it falls back to the platform default profile, meaning every visitor who hits that cache entry sees a stale "as of" timestamp presented as current until the entry expires. Fix: pass the current timestamp in as an argument from the calling Server Component, which is uncached, or drop caching on this specific field entirely if it must always be live.

Summary: freshness requirements are not currently met — the balance figure itself is fetched fresh, but the "as of" label attached to it is cached and can silently misrepresent how current the balance actually is. Highest-risk finding: the frozen timestamp, since it directly contradicts the stated "must always be current" requirement for balance-related data.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on Next.js 16.1 Cache Components.',
      },
      {
        date: '2026-08-01',
        note: 'Added the cross-user cache-key leak check after a review missed a session-scoped value cached without the session in the key.',
      },
    ],
  },
  {
    slug: 'nextjs-route-handler-rest-api-design',
    category: 'nextjs',
    title: "Design a Route Handler that doesn't leak Express habits into the App Router",
    description:
      'Turns an API requirement into a properly structured app/api route.ts — Web-standard Request/Response, an explicit runtime choice, real status codes, and scoped cache invalidation — instead of a ported Express handler.',
    promptText: `You are designing one or more Next.js Route Handlers for an API requirement, to be written as app/api/.../route.ts files. These use the Web-standard Request and Response objects, via NextRequest and NextResponse, not an Express-style (req, res) signature — there is no res object anywhere in this code, and nothing here should reach for one.

ENDPOINT PURPOSE
{{endpoint_purpose}}

HTTP METHODS NEEDED
{{http_methods}}

REQUEST AND RESPONSE SHAPE
{{request_response_shape}}

RUNTIME CONSTRAINTS
{{runtime_constraints}}

EXISTING AUTH PATTERN
{{auth_pattern}}

DESIGN RULES
Export one named async function per HTTP method actually needed — GET, POST, PATCH, DELETE — never a single catch-all handler that branches internally on request.method; the App Router resolves methods by export name, and a branching catch-all just reimplements what the routing layer already does for you, with worse readability and no benefit. Validate the request body or query parameters against a schema before any business logic runs; on a validation failure, return a 400 with field-level error detail, never a generic 500, and never a 200 with the actual error message buried in the response body where a caller has to parse prose to find out what went wrong. Choose the runtime explicitly with export const runtime set to nodejs or edge, and justify the choice against what the handler actually needs — the edge runtime has no access to Node-only APIs such as fs, most native modules, and some crypto functions, so choose edge only if nothing in this handler's dependency chain genuinely needs those, not by default on the assumption that edge is always faster. If this handler performs a mutation that makes data cached elsewhere in the app stale, call revalidatePath or revalidateTag for the specific affected paths or tags, only after the mutation has actually succeeded, never before, and never a broad revalidation call when a narrowly scoped one would do the identical job with less collateral invalidation. Return real, specific HTTP status codes: 201 on a successful create, 204 with an empty body on a successful delete, 409 on a genuine conflict such as a duplicate unique field, 404 when the target resource genuinely does not exist, rather than 200 for every outcome with the real result encoded only in the body's shape. Apply the existing auth pattern consistently across every exported method in this file, including read-only GET handlers — a Route Handler with an unauthenticated GET sitting next to an authenticated POST on the same resource is a common and easy-to-miss access-control gap that a per-method review can walk right past if auth isn't checked as a cross-cutting rule.

OUTPUT FORMAT
The complete route.ts code. Then a short list covering: which status codes are used and in which specific situation each one fires, which runtime was chosen and the specific reason tied to this handler's actual dependencies, and exactly what gets revalidated after a successful mutation, named by path or tag rather than described vaguely as "the relevant cache."`,
    variables: [
      {
        name: 'endpoint_purpose',
        description: 'What this endpoint does, in one sentence.',
        example:
          'Lets a project admin invite a new team member by email and assign their role',
        required: true,
      },
      {
        name: 'http_methods',
        description: 'Which HTTP methods this route needs to support.',
        example: 'POST to create an invite, DELETE to revoke a pending one',
        required: true,
      },
      {
        name: 'request_response_shape',
        description: 'The request body/query and response shape, roughly.',
        example:
          'POST body: { email, role }; response: the created invite object including its id and expiresAt. DELETE takes an inviteId route param and returns no body.',
        required: true,
      },
      {
        name: 'runtime_constraints',
        description: 'What the handler actually needs that determines edge vs Node.js.',
        example:
          'Needs the nodejs runtime — the handler sends a transactional email through a Node-only mailer SDK',
        required: true,
      },
      {
        name: 'auth_pattern',
        description:
          'The auth check already used elsewhere in the API, to apply consistently here.',
        example:
          "Every route in app/api/ reads a verified session via getServerSession() and rejects with 401 if there's no session, and 403 if the session's role isn't admin",
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'GitHub Copilot', 'Cursor'],
    tags: [
      'route-handlers',
      'rest-api',
      'edge-runtime',
      'app-router',
      'http-status-codes',
      'cache-invalidation',
    ],
    whyItWorks:
      "Route Handlers use the standard Web Request/Response objects, not Express's (req, res) pair, and a generic \"build me an API endpoint\" prompt routinely gets this wrong because a large share of Next.js training data on API routes predates the App Router or was written for the Pages Router's req/res-style handlers — the model has to actively override a strong, plausible-looking pattern it has seen far more often than the correct one. Naming the exact export shape — one async function per HTTP method, resolved by name rather than by branching on request.method — turns a stylistic preference into a structural constraint the model can't quietly drift away from mid-response the way it might drift toward a familiar if/else chain if left unconstrained. Forcing an explicit runtime choice, justified against actual dependencies rather than chosen for perceived speed, stops a specific and expensive mistake: defaulting to edge because it sounds faster and then silently failing on a Node-only dependency at deploy time or, worse, at first real production traffic, rather than catching the mismatch during review where it costs nothing to fix. The revalidatePath/revalidateTag requirement closes a gap that's easy to forget entirely: a Route Handler that mutates data doesn't automatically invalidate anything cached elsewhere in the app — that has to be called explicitly, scoped to the specific path or tag the mutation actually affects, and a model asked only to \"handle the POST\" has no reason to think about cache invalidation at all unless the prompt makes it part of the definition of a correct mutation handler, not an optional afterthought. Requiring the same auth pattern across every method in the file, including GET, targets a gap that a per-endpoint review tends to miss precisely because it isn't a bug in any single line — a GET handler with no auth check compiles, returns data, and looks correct in isolation, and the actual problem only becomes visible when someone compares it against the POST handler sitting three lines below it in the same file.",
    exampleOutput: `POST /api/teams/[id]/invites returns 400 with { errors: { email: 'must be a valid email' } } on a bad payload, 201 with the created invite on success, and 409 if an active invite for that email already exists. DELETE /api/teams/[id]/invites/[inviteId] returns 204 with no body on success, 404 if the invite doesn't exist or was already revoked. Runtime: nodejs, because the mailer SDK used to send the invite email has no edge-compatible build. Auth: both methods call the same requireAdmin(session) check used by every other route under app/api/teams/, so a GET added later to this same file would inherit the identical check rather than needing it re-added by hand.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' },
      { tool: 'GitHub Copilot', version: '2026.7', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot on Next.js 16 route handlers.',
      },
    ],
    relatedToolSlug: 'json-formatter',
  },
  {
    slug: 'nextjs-server-action-form-validation-buildout',
    category: 'nextjs',
    title:
      'Build a Server Action form with real validation, not a client fetch call in disguise',
    description:
      'Wires a form directly to a Server Action with server-side schema validation, per-field errors via useActionState, and a pending button via useFormStatus, instead of a client onSubmit handler pretending to be one.',
    promptText: `You are building a form wired directly to a Next.js Server Action, not a client component that calls preventDefault and fetches an API route from inside an onSubmit handler. The form element's action prop points at a function marked 'use server', and pending/error state comes from useActionState and useFormStatus, not hand-rolled useState.

FORM FIELDS
{{form_fields}}

MUTATION
{{mutation_description}}

VALIDATION LIBRARY
{{validation_library}}

SUCCESS AND FAILURE BEHAVIOR
{{success_failure_behavior}}

EXISTING CLIENT-SIDE VALIDATION
{{existing_client_validation}}

BUILD RULES
Validate the submitted FormData against a schema inside the Server Action itself, every time, regardless of whatever validation already runs client-side — a Server Action is a callable server endpoint that can be invoked directly, bypassing the form component entirely, so client-side validation alone is not validation, it is a UX nicety layered on top of a server boundary that must enforce the real rule on its own. Return field-level errors from the action in the shape useActionState expects — a small object keyed by field name — so each input can render its own error message next to itself, rather than one generic banner at the top of the form that leaves the user guessing which field actually failed. After a successful mutation, call revalidatePath or revalidateTag for whatever page or cached data this action affects, inside the action itself, so the UI reflects the change on its own without the client having to trigger a manual refetch afterward. Read pending state with useFormStatus inside a separate child component nested under the form — never in the same component that renders the form element itself, since useFormStatus only returns real pending status when called from a descendant of the form it is tracking, and returns default, always-false values everywhere else, a bug that a quick manual click-test will not catch because the developer usually only tests the one render path they happened to write. Do not add useOptimistic unless the interface genuinely needs to show a result before the server confirms it; if it does not, say so explicitly and leave it out rather than adding it because the API happens to be available and looks like the more modern choice. Keep the JavaScript-disabled path working: since this is a real HTML form submission through a 'use server' action, do not add a preventDefault call or a manual fetch anywhere in the flow, because that silently reintroduces the exact client-fetch pattern this build is meant to replace, and defeats the progressive-enhancement guarantee the action prop provides for free the moment it's used correctly.

OUTPUT FORMAT
Two code blocks: the Server Action file, including its validation and its fully typed return shape, and the form component using useActionState alongside its separate submit-button child component using useFormStatus. Close with one line stating exactly what gets revalidated on success, named by path or tag rather than described vaguely.`,
    variables: [
      {
        name: 'form_fields',
        description: 'The fields in the form and their types.',
        example:
          'title (text, required, max 120 chars), dueDate (date, optional), assigneeId (select, required)',
        required: true,
      },
      {
        name: 'mutation_description',
        description: 'What the Server Action actually does when it succeeds.',
        example:
          "Creates a new task row scoped to the current project and the signed-in user's workspace",
        required: true,
      },
      {
        name: 'validation_library',
        description: 'Which schema validation library to use.',
        example: 'Zod',
        required: false,
      },
      {
        name: 'success_failure_behavior',
        description: 'What happens on success and on failure.',
        example:
          'On success, clear the form and show the new task at the top of the list without a page reload; on failure, keep whatever was typed and show the specific field error inline.',
        required: true,
      },
      {
        name: 'existing_client_validation',
        description:
          'Whatever client-side validation already runs, for context on what the server check must not contradict.',
        example:
          'A simple required-field check already runs on blur in the browser, mostly for instant feedback while typing.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'v0 by Vercel'],
    tags: [
      'server-actions',
      'forms',
      'react-19',
      'validation',
      'progressive-enhancement',
      'useactionstate',
    ],
    whyItWorks:
      "The load-bearing fact here is that a Server Action is a callable server endpoint the client can invoke directly, independent of whatever form component happens to be rendering it — which is exactly why client-side validation, however thorough, is not a substitute for validating inside the action itself; a request can hit the action's server boundary without ever passing through the form's onChange handlers that would normally catch a bad value on the way. The useFormStatus descendant requirement is not a stylistic preference — it reflects a documented and specific behavior: the hook reads pending status from the nearest parent form only when called from a component rendered inside that form, and returns inert default values everywhere else, including the component that renders the form tag itself, which means a naive placement compiles cleanly, renders without error, and simply never shows a pending state once shipped, a failure mode invisible to a quick manual test that doesn't specifically watch for the pending UI under real network latency. Restricting useOptimistic to cases where the interface genuinely displays an unconfirmed result targets a different mistake — adding it reflexively because it is the newer, more discussed API — and the requirement to justify its absence turns that into an explicit judgment call instead of a silent default in either direction, which is exactly the same discipline a careful reviewer would apply by hand. The progressive-enhancement note carries real, measurable weight rather than being a nicety: React's form action prop is specifically designed so the browser can execute the submission as a real HTTP request before hydration finishes, a meaningfully different guarantee than the onSubmit-plus-preventDefault pattern it replaces, and a build that keeps a preventDefault call anywhere in the flow defeats that guarantee completely while still looking, on the surface, like a correct React 19 migration — the bug is invisible until someone tests on a slow connection with JavaScript not yet loaded, which is precisely the scenario this API exists to protect.",
    exampleOutput: `async function createTaskAction(prevState, formData) {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, task: null };
  const task = await db.task.create({ data: parsed.data });
  revalidatePath('/projects/' + parsed.data.projectId);
  return { errors: {}, task };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Adding…' : 'Add task'}</button>;
}

Revalidates: /projects/[projectId] via revalidatePath, so the task list reflects the new row on next render without a client-triggered refetch. useOptimistic was left out — the task list is short enough that a brief pending state on the button is sufficient, and there's nothing here that needs to appear before the server confirms it.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' },
      { tool: 'v0 by Vercel', version: '2026.7', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and v0 by Vercel on React 19 / Next.js 16 forms.',
      },
    ],
  },
  {
    slug: 'nextjs-middleware-auth-guard-latency-budget',
    category: 'nextjs',
    title:
      'Write Next.js middleware that gates routes without slowing down every request',
    description:
      'Produces a middleware.ts auth guard scoped with a real matcher config, doing only a light signature-and-expiry check at the edge instead of a full database round trip on every matched request.',
    promptText: `You are writing middleware.ts to gate a set of protected routes with a cheap session check, scoped so it only runs where it's actually needed and does no more work than that check requires.

PROTECTED ROUTE PATTERNS
{{protected_route_patterns}}

SESSION CHECK METHOD
{{auth_check_method}}

REDIRECT DESTINATION
{{redirect_destination}}

RUNTIME
{{middleware_runtime}}

TRAFFIC PROFILE
{{traffic_profile}}

CONSTRAINTS
Middleware runs before any page renders, on every request that matches its scope, and on the edge runtime by default — treat that as a hard latency and API-surface budget, not a place to prove how much validation logic can be packed in. Do only a light, cheap check here: read the session cookie or token and verify its signature and expiry. Never make a database call, an external API call, or anything else with meaningful and variable latency directly inside middleware, because that latency now applies to every single matched navigation on the site, not just the ones that actually needed the deeper check. If deeper validation is genuinely required — confirming a session against a revocation list, loading full role-based permissions — split the work: middleware does the cheap signature-and-expiry check and redirects anything obviously invalid immediately, and the actual page or a layout beneath it does the heavier check, which only runs for requests that already passed the cheap gate and therefore pays that heavier cost far less often than every single request would. Scope the middleware with the matcher config, or an equivalent explicit path check, rather than relying on a manual pathname branch inside the middleware body to skip static assets, image optimization requests, and public routes — an unscoped or loosely-scoped middleware silently adds its check to every asset request too, not just page navigations, a cost that shows up in real latency metrics without ever showing up in a code review of the auth logic itself, since the auth logic in isolation looks perfectly correct. On redirect, preserve the original destination as a callback query parameter so the user returns to where they meant to go after authenticating, rather than always landing on a generic default page regardless of where the request actually originated. If the stated traffic profile includes a route with very high request volume, name the specific cost of any check running there, however cheap it looks in isolation — a check that's trivial at low volume can still be worth optimizing further once it's multiplied across tens of thousands of daily requests.

OUTPUT FORMAT
The middleware.ts file including its config.matcher, followed by one paragraph naming exactly what this middleware does not check, and exactly where that heavier check actually lives instead — a specific layout or page file, not a vague "later in the request."`,
    variables: [
      {
        name: 'protected_route_patterns',
        description: 'Which routes require an authenticated session.',
        example:
          '/dashboard/* and /billing/*, but not /dashboard/status, which is a public health page',
        required: true,
      },
      {
        name: 'auth_check_method',
        description: 'How the middleware identifies a valid session cheaply.',
        example:
          'A signed JWT in a cookie named __session, verified against an edge-compatible HMAC secret',
        required: true,
      },
      {
        name: 'redirect_destination',
        description: 'Where unauthenticated requests get redirected.',
        example: '/login',
        required: true,
      },
      {
        name: 'middleware_runtime',
        description:
          'The runtime the middleware executes on, and why it fits the check being done.',
        example:
          'Edge (the default) — no Node-only dependency needed for the cheap signature check',
        required: false,
      },
      {
        name: 'traffic_profile',
        description:
          'Roughly how much traffic the protected routes get, so cost tradeoffs are grounded in real numbers.',
        example:
          '/dashboard/* gets roughly 40,000 requests/day; /billing/* is low-traffic but security-sensitive',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'middleware',
      'authentication',
      'edge-runtime',
      'app-router',
      'security',
      'latency',
    ],
    whyItWorks:
      "Middleware's biggest practical risk isn't getting the auth logic wrong, it's putting the wrong kind of work in it: because middleware runs on every matched request on the edge runtime before any caching or rendering happens, a database call or third-party API check placed there adds that latency to every single navigation that matches the scope, not just the ones that needed deep validation, and that cost is invisible in a code review that only checks whether the auth logic is correct rather than where it physically executes. The explicit light-then-heavy split — a cheap signature and expiry check in middleware, anything expensive pushed to a layout or page that only runs for requests already past the cheap gate — is the concrete fix, and stating it as a rule rather than a suggestion stops the model from reaching for the more \"thorough-looking\" single-function version that happens to be slow at scale even though it looks more complete on the page. Requiring the matcher config instead of manual pathname checks matters operationally in a way that's easy to miss during development: an unscoped middleware silently runs on _next/static and _next/image requests too, adding its check's latency to every asset load on the protected pages, not just the page navigation itself — a cost that's essentially invisible locally, where asset requests are near-instant, and only shows up as a measurable regression once real network latency and real request volume are involved. Tying the traffic profile into the constraints, rather than treating cost as an abstract concern, is what turns \"middleware should be cheap\" from a platitude into a number worth checking against — a signature check that costs a fraction of a millisecond is genuinely free at low volume, but the same check run 40,000 times a day against a route that could have been scoped more narrowly is a real, summable cost, and naming the actual traffic figure is what lets that tradeoff get evaluated concretely instead of asserted in the abstract.",
    exampleOutput: `config.matcher: ['/dashboard/:path*', '/billing/:path*']. Middleware verifies the __session JWT's signature and expiry only, and redirects to /login?callbackUrl=<original path> if either check fails. It does NOT check whether the session's role still has billing access to a specific sub-page — that permission check happens in app/billing/layout.tsx, which does have database access to load full role data and only runs for requests middleware already let through, so it pays that cost far less often than every request to /billing/* would.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on Next.js 16 edge middleware.',
      },
    ],
  },
  {
    slug: 'nextjs-parallel-routes-multi-panel-dashboard',
    category: 'nextjs',
    title:
      'Build a multi-panel dashboard with parallel routes instead of client-side tab state',
    description:
      'Structures independent dashboard panels as parallel route slots that each stream, load, and error on their own, with the default.tsx behavior on hard versus soft navigation spelled out explicitly.',
    promptText: `You are structuring a multi-panel dashboard using parallel routes, the @slotName folder convention, under a shared layout.tsx, instead of one page component that fetches everything up front and manages an "active panel" with client-side tab state.

DASHBOARD PANELS
{{dashboard_panels}}

NAVIGATION REQUIREMENTS
{{navigation_requirements}}

CURRENT IMPLEMENTATION
{{current_implementation}}

ROUTE BASE
{{route_base}}

REQUIREMENTS
Create one @slotName folder per independent panel directly under the shared layout, each with its own page.tsx that fetches only that panel's data — never a parent component that fetches everything up front and distributes it down as props to children that could have fetched it themselves. Give each slot its own loading.tsx so a slow panel shows its own skeleton and streams in on its own schedule; a slow analytics query must never block a fast activity feed from rendering just because they happen to share a layout. Give each slot its own error.tsx too, so a failure in one panel's data fetch renders an inline error scoped to that panel, not a full-page crash that takes every other panel down with it. Add a default.tsx to every slot, returning either null or a sensible fallback view. This matters for two distinct reasons: on a hard navigation or full page reload, where the current URL only matches one slot's most specific route, Next.js needs default.tsx to know what to render for every other slot that has no matching segment in that URL — without it, that mismatch produces a 404 for the entire layout, not just for the one unmatched slot. On a soft, client-side navigation, Next.js instead preserves whichever content an unmatched slot was already showing rather than falling back to default.tsx at all, which is a real behavioral difference worth confirming your panels actually handle correctly rather than assuming either mode covers both cases. The layout.tsx itself receives all slots as named props alongside children and is responsible only for arranging them into the visual grid — it does not fetch data of its own, and any data genuinely needed by the layout chrome, such as a page title or a global filter bar, should be treated as its own concern rather than folded into whichever slot happens to load fastest.

OUTPUT FORMAT
The folder structure as a tree, the layout.tsx showing exactly how the slots are composed as props, and one paragraph walking through what happens on a hard refresh versus a soft in-app navigation when only one slot's URL segment is present in the current path.`,
    variables: [
      {
        name: 'dashboard_panels',
        description:
          'The independent panels the dashboard needs, and roughly what each shows.',
        example:
          'a revenue trend chart (last 90 days), a support-ticket queue list, and a team-utilization heatmap',
        required: true,
      },
      {
        name: 'navigation_requirements',
        description:
          'Whether panels need independent URLs/deep-linking or just independent rendering.',
        example:
          "The support-ticket queue needs its own filter state reflected in the URL and shareable via link; the other two panels don't need deep-linking",
        required: true,
      },
      {
        name: 'current_implementation',
        description: 'What the dashboard looks like today, before this restructure.',
        example:
          'One DashboardPage component fetches all three datasets in parallel with Promise.all, then renders all three children behind a single shared loading boolean — nothing is actually gated by tab state, but one slow query still blocks the whole page.',
        required: true,
      },
      {
        name: 'route_base',
        description: 'The route this dashboard lives under.',
        example: '/dashboard',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'v0 by Vercel'],
    tags: [
      'parallel-routes',
      'app-router',
      'dashboard',
      'streaming',
      'layouts',
      'default-tsx',
    ],
    whyItWorks:
      "Parallel routes solve a specific problem generic React tab-state can't: each @slot is its own independent route segment with its own data fetching, its own loading.tsx, and its own error.tsx, which means a slow panel streams in on its own schedule and a failed panel shows its own scoped error boundary, none of which requires the layout component to hand-coordinate loading or error state the way a single fetch-everything-then-render-conditionally component would have to. The default.tsx requirement is the part most first attempts miss, and the part that actually breaks in production rather than in development: without it, refreshing the browser on a URL that only specifies one slot's segment causes Next.js to 404 the entire layout, because the other slots have no matching route for that navigation and no fallback content to render instead — a bug that's invisible during normal client-side navigation, where the previous slot content is simply preserved, and only surfaces the moment someone hits refresh or shares a deep link, which is exactly the scenario a dashboard needs to handle correctly since links to specific panels get shared constantly. Separating the hard-navigation behavior (fall back to default.tsx or 404 without one) from the soft-navigation behavior (preserve whatever the unmatched slot was already showing) matters because these are genuinely two different code paths with two different failure modes, and a build that only tests one — usually soft navigation, since that's what clicking around in development actually exercises — will ship with the other silently broken until a refresh or a shared link surfaces it in front of a real user. Keeping data fetching out of layout.tsx entirely, and pushing it down into each slot's own page.tsx, is what actually delivers the independence the pattern promises — a layout that fetches shared data itself reintroduces exactly the single point of failure parallel routes exist to eliminate, since a slow or failed fetch in the layout now blocks or breaks every slot underneath it regardless of how well each individual slot is structured.",
    exampleOutput: `app/dashboard/layout.tsx (with @revenue, @tickets, @utilization slots) receives { children, revenue, tickets, utilization } as props and arranges them in a CSS grid — it makes no fetch calls of its own. Refreshing on /dashboard/tickets/open renders @tickets' matching segment with the open-ticket filter applied, while @revenue and @utilization fall back to their own default.tsx (rendering their default view) instead of 404ing the whole page. Clicking between panels client-side, by contrast, preserves whichever content each slot last showed rather than resetting to default.tsx at all — the two behaviors are genuinely different and both need to render something sensible.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-26' },
      { tool: 'v0 by Vercel', version: '2026.7', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and v0 by Vercel on a Next.js 16 App Router dashboard with three parallel slots.',
      },
    ],
  },
  {
    slug: 'nextjs-isr-revalidation-strategy-selection',
    category: 'nextjs',
    title:
      'Pick a revalidation strategy instead of defaulting every page to revalidate: 60',
    description:
      'Matches ISR revalidation to how content actually changes — on-demand via revalidateTag, time-based sized to real update frequency, or no caching at all — instead of a copy-pasted 60-second default.',
    promptText: `You are recommending a revalidation strategy for a specific piece of content, grounded in how that content source actually behaves rather than a guessed round-number interval.

CONTENT TYPE AND SOURCE
{{content_type}}

UPDATE FREQUENCY
{{update_frequency}}

TRAFFIC PATTERN
{{traffic_pattern}}

WEBHOOK AVAILABILITY
{{cms_webhook_availability}}

CURRENT REVALIDATION SETTING
{{current_revalidation_setting}}

DECISION FRAMEWORK
If the content source can fire a webhook on publish or update, prefer on-demand revalidation: call revalidateTag, tagged per content item rather than one tag covering the whole collection, from a Route Handler the webhook hits, instead of guessing at a time interval that will either be too slow for a real change or too frequent for a quiet week. This keeps pages fresh immediately on an actual change and avoids serving stale content for the length of an arbitrary time window between real updates. If no webhook is available, use time-based revalidation — the route segment's revalidate export or fetch's next.revalidate option — but size the interval to the stated update frequency rather than a round default; content that changes a handful of times a day doesn't need a 60-second check, and a 60-second check on content that changes weekly just refetches identical data on a schedule for no benefit. For pages with heavy traffic and rarely-changing content, a longer revalidate window combined with an on-demand revalidateTag or revalidatePath call for the rare actual update is usually a better fit than a short polling-style interval that spends most of its checks re-serving the same cached page anyway. Flag any content where staleness carries a real cost — pricing, live inventory counts, an account's current status — as a candidate for no caching at all, or a very short window scoped only to that specific field, rather than forcing ISR onto something that genuinely needs to be live on every request.

OUTPUT FORMAT
A recommendation with the specific revalidate value, or the revalidateTag/webhook design if on-demand is the right fit, one sentence justifying the choice against the stated update frequency and traffic pattern specifically, and a note on which cache tags to use, at what granularity, if on-demand revalidation applies here.`,
    variables: [
      {
        name: 'content_type',
        description: 'What the content is and where it is authored.',
        example: 'Product detail pages, backed by a headless commerce CMS',
        required: true,
      },
      {
        name: 'update_frequency',
        description: 'How often this content actually changes.',
        example:
          'Prices and stock counts update several times a day; product descriptions and images rarely change after launch',
        required: true,
      },
      {
        name: 'traffic_pattern',
        description:
          'Roughly how much traffic these pages get and how it is distributed.',
        example:
          'Most traffic goes to the top 200 best-selling products; the long tail of older listings gets occasional search traffic',
        required: true,
      },
      {
        name: 'cms_webhook_availability',
        description:
          'Whether the content source can call a webhook on publish or update.',
        example: 'Yes — the commerce platform supports a product.updated webhook',
        required: false,
      },
      {
        name: 'current_revalidation_setting',
        description:
          'Whatever revalidation setting is in place today, for context on what would change.',
        example:
          'revalidate: 60 is set at the top of every product page file, copied from an early prototype',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude'],
    tags: [
      'isr',
      'revalidation',
      'caching',
      'performance',
      'app-router',
      'revalidatetag',
    ],
    whyItWorks:
      "A flat revalidate: 60 is the single most copy-pasted line in ISR examples, and it's usually wrong in both directions at once for the same reason: it's too slow for content that just changed and needs to be live immediately, and too frequent for content that only changes a few times a week, which means most of those 60-second checks refetch identical data for zero user-visible benefit while still paying the cost of a network round trip on the server. Framing the choice as a decision tree — webhook available means prefer on-demand revalidateTag, no webhook means size the interval to the actual stated update frequency — replaces a guessed number with a strategy grounded in how the specific content source actually behaves, which is the difference between a recommendation someone can defend in a design review and one that was picked because it was the number in the last tutorial anyone read. Tagging per content item rather than per collection is the detail that keeps on-demand revalidation useful at any real scale: a single global products tag means updating one item's price invalidates every cached product page on the site simultaneously, which technically satisfies \"on-demand\" but defeats the actual purpose of caching by forcing a full recompute across unrelated pages every time any one item changes. Separating pricing and stock — the fields where staleness has a real, quantifiable cost — from descriptions and images, which can tolerate a long cache window, is what stops the recommendation from collapsing into an all-or-nothing choice for the entire page: caching the whole product page uniformly under one setting means either the price is sometimes wrong, or the rarely-changing description gets refetched as often as the price does, and naming the split explicitly is what lets each field get the caching behavior it actually needs rather than settling for whichever compromise setting hurts the least.",
    exampleOutput: `Recommendation: split by field. Stock and price stay uncached (cache: 'no-store' on that specific fetch), since the traffic pattern concentrates on best-sellers where a stale price is a real, visible cost. Descriptions and images use on-demand revalidation via revalidateTag('product-' + slug), fired from a Route Handler the product.updated webhook hits — tagged per product, not one 'products' tag for the whole catalog, so updating one listing's description doesn't force a recompute of the other 199 best-sellers. Fallback revalidate: 3600 stays as a safety net in case a webhook call is ever missed, not as the primary freshness mechanism.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on a Next.js 16 commerce catalog with per-item revalidateTag.',
      },
    ],
  },
  {
    slug: 'nextjs-generate-metadata-dynamic-seo-tags',
    category: 'nextjs',
    title: 'Wire up generateMetadata so every page actually gets dynamic SEO tags',
    description:
      'Adds a proper generateMetadata function per route — real fetched data, metadataBase, canonical URLs, and explicit noindex handling — instead of a static metadata object copied across every page.',
    promptText: `You are adding or fixing generateMetadata for a specific route. If the page's title or description depend on real data — a product name, a post title — generateMetadata must be an async function that fetches that same data using the exact same shared data-fetching function the page component itself uses, so the request gets deduped against the page's own fetch instead of firing as a second, separate query.

PAGE TYPE AND ROUTE
{{page_type}}

DATA SOURCE
{{page_data_source}}

SITE DOMAIN
{{site_domain}}

INDEXING RULES
{{indexing_rules}}

REQUIREMENTS
Export generateMetadata as an async function accepting the same params and searchParams the page component receives, and return title, description, and openGraph fields built from the real fetched data, never placeholder text left in as a stand-in. Set metadataBase in the root layout's metadata export to the domain given above, so that relative Open Graph and Twitter image paths resolve to absolute URLs — do not hardcode the domain into every individual page's metadata export, since that duplicates a single fact across every route and drifts the moment the domain changes. Set a canonical URL per page via alternates.canonical, especially for any route reachable through more than one URL pattern, such as query-parameter variants or a trailing-slash difference, since search engines otherwise treat those as separate, competing pages. For any page that shouldn't be indexed — draft content, an internal tool, a duplicate parameterized view — set robots: { index: false } explicitly on that page's own metadata rather than relying on it being excluded from a sitemap alone, since exclusion from a sitemap doesn't stop a crawler from finding and indexing the page through some other link path. If the data fetch inside generateMetadata fails or returns nothing — a deleted product, a post that no longer exists — return sensible fallback metadata, such as a generic title paired with noindex, rather than letting the function throw and take down the entire page render over what should only affect the page's metadata.

OUTPUT FORMAT
The generateMetadata function code, plus one line confirming the fetch it makes is the exact same cached, deduped call the page component uses, named by function, and one line listing which routes on this app should be marked noindex and why each one qualifies.`,
    variables: [
      {
        name: 'page_type',
        description: 'What kind of page this is.',
        example: 'A blog post detail page at /blog/[slug]',
        required: true,
      },
      {
        name: 'page_data_source',
        description: "Where the page's data comes from.",
        example:
          'getPost(slug) — a shared, memoized data-fetching function used by both the page component and generateMetadata',
        required: true,
      },
      {
        name: 'site_domain',
        description:
          "The site's production domain, for metadataBase and absolute OG URLs.",
        example: 'https://blog.example.com',
        required: true,
      },
      {
        name: 'indexing_rules',
        description: 'Which routes should or should not be indexed, and why.',
        example:
          'Published posts should be indexed; draft posts (reachable via a share link with ?preview=true) must never be indexed',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'generatemetadata',
      'seo',
      'open-graph',
      'metadata',
      'app-router',
      'canonical-urls',
    ],
    whyItWorks:
      "generateMetadata runs on the server and resolves before the page's HTML shell is sent, and it has to use the same shared data-fetching function as the page component rather than its own separate query for a concrete performance reason, not a style preference: Next.js's fetch memoization dedupes identical requests made during the same render pass, so calling getPost(slug) from both generateMetadata and the page component costs exactly one network request, not two, but only if it's genuinely the same function call with the same arguments, not a copy-pasted variant that happens to fetch equivalent data through a slightly different code path that memoization can't recognize as identical. The metadataBase requirement fixes a mistake that's specifically invisible during local development and only breaks in production: a relative Open Graph image path resolves fine against localhost during testing, and only fails once a social platform's crawler tries to fetch that same relative path with no origin to resolve it against, which means this bug ships clean through every local check and only surfaces the first time someone shares a link and the preview card comes back broken. The explicit noindex-on-the-page-itself rule, rather than relying on sitemap exclusion alone, closes a gap that a sitemap-only approach genuinely can't cover: a sitemap tells a crawler what to prioritize, but it does nothing to stop that same crawler from discovering and indexing a page through an entirely different path, such as an internal link or a shared URL, so a draft page excluded from the sitemap but missing its own robots directive can still end up indexed the moment anything else on the web links to it. And the mandatory fallback-on-failure rule matters because generateMetadata throwing on a deleted or not-yet-published item would otherwise take down the entire page render, not just its metadata — an error in a function whose only job is to produce two or three text fields shouldn't be capable of turning into a full 500 for the visitor.",
    exampleOutput: `generateMetadata for /blog/[slug] returns { title: post.title + ' — Example Blog', description: post.excerpt, openGraph: { images: [post.heroImage] } } using the exact same getPost(slug) call the page component uses, so the two calls dedupe into one fetch. If getPost returns null (post not found or unpublished), metadata falls back to { title: 'Post not found', robots: { index: false } } instead of throwing. Noindex routes: /blog/[slug]?preview=true (draft posts, reachable only via a private share link) — flagged robots: { index: false } directly on the page's own metadata, not left to sitemap exclusion alone.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-20' },
      { tool: 'GitHub Copilot', version: '2026.7', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot on Next.js 16 dynamic blog and product pages.',
      },
    ],
    relatedToolSlug: 'schema-markup-generator',
  },
  {
    slug: 'nextjs-next-image-core-web-vitals-audit',
    category: 'nextjs',
    title: 'Audit a page for next/image misuse before Lighthouse catches it',
    description:
      "Scans a page's images for missing priority hints, wrong fill/dimension usage, and un-allow-listed remote domains — the specific mistakes that quietly tank LCP and CLS without erroring at build time.",
    promptText: `You are auditing every image on a specific page for next/image correctness, checking for the mistakes that hurt Core Web Vitals or fail silently in production without ever showing up as a build error.

PAGE OR COMPONENT CODE
{{page_code}}

EXTERNAL IMAGE DOMAINS
{{image_hosting_domains}}

LAYOUT BREAKPOINTS
{{layout_breakpoints}}

CHECKLIST
Flag every plain img tag used for a content image, recommending conversion to next/image, unless there's a specific reason not to — an SVG icon, or an image whose dimensions genuinely can't be known ahead of time — and name that reason explicitly if you're leaving one as-is rather than silently skipping it. Identify the largest above-the-fold image, the likely LCP element, and confirm it has priority set to disable lazy loading; if it's currently lazy-loaded by default because priority is missing, flag that as a direct LCP regression at high severity, not a minor style note. Confirm every other next/image usage on the page does NOT have priority set — marking every image priority defeats the entire point of lazy loading and front-loads bandwidth for images the user may never actually scroll down to see. For any image using the fill prop, confirm its parent element has a defined position (relative or similar) and defined dimensions; fill combined with an unsized or statically-positioned parent causes the image to collapse to zero height or overflow its container unpredictably. For any image using explicit width and height instead of fill, confirm those values match, or are proportional to, the actual source image's real aspect ratio — mismatched dimensions cause either a distorted image or a layout shift the moment the real image loads and the browser reserves space based on values that don't match what actually renders. For any image sourced from an external domain, confirm that domain is listed in next.config's images.remotePatterns; flag any that aren't, since an un-allow-listed domain fails at request time in production, not at build time, meaning this specific mistake passes every local check and every CI build cleanly and only surfaces after deploy when a real request to that image actually gets made. For any image that resizes significantly across the breakpoints given above, confirm a sizes attribute is set so the browser downloads an appropriately sized file at each breakpoint rather than the largest variant everywhere regardless of how small the image actually renders on a given screen.

OUTPUT FORMAT
A findings table: Image or location | Issue | Severity — LCP-impacting, CLS-impacting, will-fail-in-prod, or minor | Fix.`,
    variables: [
      {
        name: 'page_code',
        description: 'The page or component containing the images to audit.',
        example:
          'app/blog/[slug]/page.tsx — a hero image plus several inline images inside the post body',
        required: true,
      },
      {
        name: 'image_hosting_domains',
        description:
          'External domains images are served from, to check against remotePatterns.',
        example: 'images.ctfassets.net (Contentful), cdn.example-cms.com',
        required: false,
      },
      {
        name: 'layout_breakpoints',
        description:
          "How the page's layout changes across screen widths, for the sizes-attribute check.",
        example:
          'Hero image is full-width on mobile, roughly 60% width on tablet, and capped at 800px on desktop',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'next-image',
      'performance',
      'core-web-vitals',
      'lcp',
      'image-optimization',
      'cls',
    ],
    whyItWorks:
      'Most next/image mistakes are invisible in local development and only show up in a Lighthouse report or a production error weeks later, which is exactly why a targeted checklist beats a general "optimize my images" request: the priority-on-the-LCP-image rule catches a lazy-loaded hero image that\'s actively hurting the LCP score in a way that renders correctly and looks fine to the eye, the fill-needs-a-sized-relative-parent rule catches a collapse bug that only appears at certain viewport widths rather than in the specific one the developer happened to test in, and the remotePatterns check catches a failure mode that genuinely doesn\'t exist at build time at all — an un-allow-listed external domain builds and deploys successfully, and only fails the first time a real request actually hits that specific image URL in production, which can be days after deploy if that image happens to sit below the fold on a low-traffic page. Distinguishing "every image should have priority" from "exactly the LCP image should" matters because the naive, well-intentioned fix — add priority everywhere, on the theory that faster-loading images are always better — removes the lazy-loading benefit for every image below the fold simultaneously, trading one measurable performance problem for a different and often worse one: a page that now front-loads bandwidth for images most visitors will never scroll far enough to see, which shows up as a slower initial load rather than a faster one. Checking the sizes attribute against actual layout breakpoints, rather than treating it as an optional detail, closes a gap that\'s easy to miss because the image still displays correctly without it — without sizes, the browser has no signal about how large the image will actually render at each breakpoint, so it downloads the largest configured variant even on a narrow mobile viewport where a much smaller file would have looked identical, a waste that never shows up as a visible bug, only as unnecessary bytes on every mobile page load.',
    exampleOutput: `Hero image at app/blog/[slug]/page.tsx line 14: plain <img> tag, no priority equivalent, and it's the likely LCP element for this page — convert to next/image with priority set. Severity: LCP-impacting.
Inline post-body images: correctly using next/image, but sourced from cdn.example-cms.com, which is not listed in images.remotePatterns — will build and deploy successfully but fail at request time in production the first time a real image request hits that domain. Severity: will-fail-in-prod.
Hero image sizing: no sizes attribute set despite resizing from full-width on mobile to 800px on desktop — currently downloads the desktop-sized file even on mobile viewports. Severity: minor (bandwidth waste, not a layout or LCP break).`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-29' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on a Next.js 16 blog with a CMS-hosted image domain.',
      },
    ],
    relatedToolSlug: 'website-speed-test',
  },
  {
    slug: 'nextjs-pages-router-to-app-router-migration-plan',
    category: 'nextjs',
    title:
      'Turn a Pages Router codebase into a phased App Router migration, not a risky rewrite',
    description:
      'Produces a route-by-route migration plan that runs Pages Router and App Router side by side, ordered by risk, converting data-fetching methods and shared layout as it goes.',
    promptText: `You are producing a phased migration plan from the Pages Router to the App Router for an existing codebase. Pages Router (pages/) and App Router (app/) can coexist in the same Next.js project, with Next.js resolving routes across both simultaneously, so plan this as an incremental, route-by-route migration that ships on the main branch continuously — not a big-bang rewrite done on one long-lived branch that has to land all at once.

CURRENT PAGES DIRECTORY
{{pages_directory_listing}}

DATA-FETCHING METHODS IN USE
{{data_fetching_methods_used}}

SHARED LAYOUT ELEMENTS
{{shared_layout_elements}}

TRAFFIC AND RISK PROFILE
{{traffic_and_risk_profile}}

MIGRATION PLAN REQUIREMENTS
Order routes by risk and traffic, not alphabetically or by file size: recommend migrating low-traffic, low-risk routes first to validate the approach against this specific codebase's quirks, and the highest-traffic or most business-critical routes last, once the pattern has actually been proven rather than assumed to work. For each data-fetching method currently in use, state its App Router equivalent and the actual mental-model shift involved, not just a mechanical rename: getStaticProps becomes an async Server Component that fetches directly, with the equivalent caching behavior expressed through fetch's own cache and revalidate options rather than a dedicated special function; getServerSideProps becomes an async Server Component with a fetch call that explicitly opts out of caching, or one that reads a dynamic API like cookies() or headers() that forces the whole route to render dynamically; getInitialProps should be flagged explicitly as needing the most rework of the three, since it historically ran on both the server and the client and has no direct one-to-one App Router equivalent at all. Move shared elements out of _app.tsx and _document.tsx into app/layout.tsx, the root layout, once, early in the plan rather than per-route later — both routers can share global styles and providers through careful setup, but running duplicate providers during the transition period is a common and specifically confusing source of bugs that's worth eliminating before it has a chance to compound across multiple migrated routes. Convert pages/api routes to app/api/.../route.ts one at a time, matching whatever order the page migration is already following, rather than treating API route conversion as one separate all-at-once phase disconnected from the pages that actually call them. Call out any Pages Router-only API still in active use — next/router's useRouter behaves differently from next/navigation's, a custom _error.tsx has no direct App Router file to move into — that needs a genuine behavioral adjustment during migration, not just a file move to a new location.

OUTPUT FORMAT
A phased table: Phase | Routes and files migrated | Data-fetching conversion needed | Risk notes. Then a short "do this first, regardless of phase" list specifically for the _app.tsx and _document.tsx to root layout move.`,
    variables: [
      {
        name: 'pages_directory_listing',
        description: 'The current pages/ structure, or a summary of it.',
        example:
          'pages/index.tsx, pages/blog/[slug].tsx (getStaticProps), pages/dashboard.tsx (getServerSideProps, behind auth), pages/account.tsx (getInitialProps, legacy), pages/api/checkout.ts',
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
          'A ThemeProvider, a global Header/Footer, and a custom <Html lang> attribute in _document.tsx',
        required: true,
      },
      {
        name: 'traffic_and_risk_profile',
        description:
          'Which routes carry the most traffic or business risk, to inform migration order.',
        example:
          'The dashboard is the highest-traffic authenticated route and directly affects billing; the blog is low-traffic and low-risk if something briefly breaks',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'migration',
      'pages-router',
      'app-router',
      'getserversideprops',
      'incremental-adoption',
    ],
    whyItWorks:
      "The single fact that makes this migration tractable instead of terrifying is one most teams don't realize going into it: pages/ and app/ coexist in the same Next.js project, and Next.js resolves routes across both, which means the migration can genuinely happen one route at a time on the main branch instead of on a long-lived branch that has to land all at once, and a plan that doesn't lead with this fact tends to default to the riskier big-bang framing by omission rather than by an actual decision anyone made. Mapping each data-fetching method to its App Router equivalent as a mental-model shift, rather than a mechanical rename, matters because getServerSideProps and a no-store fetch inside a Server Component aren't quite the same construct wearing different syntax — the latter is one fetch call opting out of caching, while the entire component around it defaults to static unless something else forces it dynamic, which is a genuinely different way of reasoning about what makes a given render dynamic versus cached, and a migration guide that treats this as find-and-replace will produce code that compiles but doesn't behave the way the original page did. Explicitly flagging getInitialProps as the hard case, rather than letting it slot into the same conversion pattern as the other two, matters because it's structurally different — it ran on both server and client, which has no App Router analog at all — and a migration plan that doesn't call this out by name tends to discover the problem mid-migration, after the surrounding route has already been restructured around an assumption that turns out not to hold for this one file. Ordering by risk and traffic rather than by file size or alphabetical convenience is the same practical bias that shows up in any real production migration: prove the pattern, including whatever this specific codebase's own quirks turn out to be, on something that doesn't matter much before touching the route that generates revenue or gates a paying customer's dashboard.",
    exampleOutput: `Phase 1: migrate pages/blog/[slug].tsx (getStaticProps to an async Server Component with a cached fetch) — low traffic, low risk, validates the pattern against this codebase's actual conventions. Phase 2: move _app.tsx's ThemeProvider and Header/Footer into app/layout.tsx once, shared by both routers going forward — done early specifically to avoid duplicate providers during Phases 3 and 4. Phase 3: pages/dashboard.tsx (getServerSideProps to a Server Component using cookies() to force dynamic rendering, since it's behind auth) — higher risk, scheduled after the pattern is proven. Phase 4 (last, highest risk): pages/account.tsx using getInitialProps — flagged for an actual rewrite rather than a mechanical conversion, since it has no direct App Router equivalent and needs to be reasoned about from scratch.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-23' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on a mixed Pages/App Router Next.js 16 project.',
      },
    ],
  },
  {
    slug: 'nextjs-suspense-streaming-loading-boundaries',
    category: 'nextjs',
    title: "Design loading UI so one slow query doesn't block a whole page from painting",
    description:
      "Places loading.tsx and granular Suspense boundaries around a page's actual data dependencies so fast content streams in immediately, instead of waiting on the single slowest fetch on the page.",
    promptText: `You are designing the loading UI for a specific page using route-level loading.tsx and granular Suspense boundaries, so the page streams in as each piece of data resolves rather than showing one full-page spinner until the single slowest fetch finishes.

PAGE DATA DEPENDENCIES
{{page_data_dependencies}}

SLOWEST DATA SOURCE
{{slowest_data_source}}

DATA FETCHING APPROACH
{{data_fetching_approach}}

REQUIREMENTS
Use loading.tsx at the route segment level for the initial navigation fallback — this file automatically wraps the entire segment in a Suspense boundary, which is exactly why it should show a skeleton that roughly matches the eventual layout rather than a generic centered spinner, since it's the very first thing a visitor sees on that route. Identify which pieces of the page are genuinely independent of each other's data, meaning neither needs to wait on the other, and wrap each independent piece in its own Suspense boundary with its own fallback so each can resolve and stream in on its own schedule. The slowest data source named above must never be awaited at the top of the page component in a way that blocks everything else on the page from rendering — its fetch should start as early as possible, but nothing else on the page should be gated behind its resolution. Give each Suspense boundary a fallback that's sized and shaped like the real content it's replacing — a skeleton with matching approximate dimensions, not a generic centered spinner that causes a visible layout jump the moment the real content swaps in and claims a different amount of space. If a section legitimately needs to wait on another — a detail panel that needs to know which item was selected before it can fetch anything — don't force it into a parallel Suspense boundary alongside unrelated content just for the sake of consistency; nest it inside the boundary it genuinely depends on, or leave it sequential, and say so explicitly rather than parallelizing something that has a real, unavoidable data dependency. Note explicitly where this interacts with caching, since the two are easy to conflate: a Suspense boundary around a component changes only when the browser sees that component's result, not whether the underlying data is cached — caching is a separate decision made through the data-fetching approach itself, not something Suspense boundary placement affects one way or the other.

OUTPUT FORMAT
The page's Suspense structure as a component tree, described in text with fallback components sketched rather than fully styled, plus a one-line note on which sections are genuinely independent versus genuinely sequential and why each was placed the way it was.`,
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
          'The inventory sync status — it calls a third-party API with roughly 2 seconds of typical latency',
        required: true,
      },
      {
        name: 'data_fetching_approach',
        description: 'The library or pattern used to fetch and expose data to Suspense.',
        example:
          'Async Server Components fetching directly, with each section as its own async function component',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'v0 by Vercel'],
    tags: ['suspense', 'streaming', 'loading-ui', 'app-router', 'react-19'],
    whyItWorks:
      'The mechanism worth naming explicitly is that loading.tsx isn\'t just a fallback file that happens to render while data loads — it automatically wraps the entire route segment in a Suspense boundary, which is exactly why a single loading.tsx at the page level still produces an all-or-nothing spinner if nothing inside the page has its own, more granular boundaries beneath it: the page-level boundary resolves only when every async component inside it has resolved, so the slowest one still gates the whole segment even though loading.tsx looks, on the surface, like it\'s already solving the streaming problem. The actual fix is structural, not decorative: identifying which sections are truly independent and giving each its own Suspense boundary means the fast profile header can paint and become interactive immediately while the slow third-party inventory check is still pending, instead of the entire page waiting on whichever promise in the tree happens to resolve last, regardless of how unrelated that slow section is to what the visitor actually came to see. Explicitly separating "independent — parallelize" from "genuinely sequential — don\'t force it" stops the model from over-applying Suspense boundaries to sections that have a real data dependency on each other, which would just add waterfall complexity — a detail panel nested in its own boundary before it even knows which item was selected has nothing useful to fetch yet, so wrapping it in a parallel boundary anyway adds structure without adding any of the streaming benefit that structure is supposed to buy. And calling out that Suspense affects only when content is shown, not whether it\'s cached, prevents conflating two decisions that are easy to blur together in practice but are actually orthogonal: a component can be wrapped in a tight, well-placed Suspense boundary and still refetch uncached data on every request, and a build that only gets the boundary placement right without checking the caching strategy separately will still feel slow, just with better-organized loading states around the slowness.',
    exampleOutput: `Suspense tree: <ProfileHeader> resolves fast and renders without its own boundary if it's genuinely not a bottleneck anywhere in testing. A Suspense boundary around <OrderHistory> (fallback: OrderHistorySkeleton, matching the table's approximate row height) and a separate one around <InventoryStatus> (fallback: InventoryStatusSkeleton) sit as siblings, so the order history table appears well before the roughly 2-second inventory check resolves, instead of both being gated behind whichever one happens to be slower. Independent: OrderHistory and InventoryStatus don't share any data. Sequential: none on this page — if a future detail panel is added that depends on a selected order, it should nest inside OrderHistory's boundary rather than sit as a sibling.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' },
      { tool: 'v0 by Vercel', version: '2026.7', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and v0 by Vercel on a Next.js 16 dashboard page with an external API dependency.',
      },
    ],
  },
  {
    slug: 'nextjs-turborepo-monorepo-shared-packages-layout',
    category: 'nextjs',
    title:
      'Structure a monorepo running multiple Next.js apps without duplicating your design system',
    description:
      'Lays out a Turborepo workspace for several Next.js apps sharing UI, types, and config through internal packages linked via the workspace protocol, instead of code copy-pasted between app directories.',
    promptText: `You are designing the monorepo layout for several Next.js apps that need to share code, using Turborepo and {{package_manager}} workspaces, with shared code living in internal packages that each app depends on via the workspace protocol rather than files copy-pasted between app directories.

APPS NEEDED
{{apps_list}}

SHARED CODE NEEDED
{{shared_packages_needed}}

DEPLOYMENT MODEL
{{deployment_model}}

STRUCTURE REQUIREMENTS
Put apps/ at the repo root, holding one folder per deployable Next.js app, each with its own next.config file, package.json, and env files — Next.js resolves .env files relative to each app's own root directory, not the monorepo root, so every app needs its own env files even for values that happen to be identical across apps; a shared .env file sitting at the repo root silently does nothing for any of them. Put packages/ at the repo root too, holding shared, non-deployable code: a UI package for shared components, a config package for shared eslint, tsconfig, and Tailwind config, a types package if there's a shared domain model worth centralizing, each with its own package.json so it can be versioned and depended on independently. Wire apps to internal packages via the workspace protocol — for example "@repo/ui": "workspace:*" — so a change to a shared package is picked up by every app that depends on it without a publish step in between; without this live link, "shared" UI components tend to get copy-pasted at the first point of divergence, since there's no actual dependency forcing consumers to stay in sync. Configure turbo.json's task pipeline so build, lint, and test tasks declare their real dependencies — a shared package's build must complete before an app that depends on it builds — so Turborepo's caching can actually skip rebuilding an app when nothing it depends on has changed; don't leave every task marked as depending on the whole repo by default, since that defeats the caching benefit that's the entire reason to accept a monorepo's coordination overhead in the first place. Decide, and state explicitly, whether each app deploys independently as separate projects and domains or as part of one coordinated deployment, since this affects whether environment variables and preview deployments get configured per-app or centrally.

OUTPUT FORMAT
The folder tree showing apps/ and packages/ with their contents, an example turbo.json pipeline entry showing the dependency between a shared package's build and an app's build, and one paragraph specifically explaining the env-file resolution gotcha above and how it changes what each app's setup instructions need to say.`,
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
          'A design-system UI package, shared TypeScript types for the API, shared eslint/tsconfig config',
        required: true,
      },
      {
        name: 'deployment_model',
        description:
          'Whether the apps deploy independently or as one coordinated release.',
        example:
          'Each app deploys independently as its own Vercel project with its own domain and preview deployments',
        required: false,
      },
      {
        name: 'package_manager',
        description: 'Which package manager the workspace uses.',
        example: 'pnpm',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['monorepo', 'turborepo', 'pnpm-workspaces', 'multi-app', 'shared-packages'],
    whyItWorks:
      "The env-file detail is the one that actually bites teams in production and rarely shows up in a generic monorepo tutorial: Next.js resolves .env files relative to each app's own root, not the monorepo root, so a shared .env file at the repo root silently does nothing for any app — every app needs its own env files even for variables that are identical across every one of them, and a setup guide that doesn't say this explicitly leads to a very confusing debugging session where a variable that's clearly set in the repo appears completely undefined inside a specific app's build. The workspace-protocol dependency is what makes shared packages actually useful rather than aspirational: without a live link like \"@repo/ui\": \"workspace:*\", a shared UI package is just a folder that happens to sit next to the apps that use it, and the moment one app needs a slightly different variant of a shared component, the path of least resistance is copy-pasting it locally rather than modifying the shared version — workspace:* is what makes modifying the shared version the actually convenient choice instead. Making the turbo.json task graph reflect real build dependencies, rather than defaulting every task to depend on the whole repo, is what makes the monorepo's build genuinely faster than separate repos would have been, which is the entire reason to accept a monorepo's coordination overhead at all — a task graph that treats every package as a dependency of every app means Turborepo's caching has nothing meaningful to skip, since a single commit to any file anywhere invalidates the cache for everything, and the team pays every cost of coordinating a monorepo while getting none of the caching benefit that's supposed to offset it.",
    exampleOutput: `apps/web, apps/dashboard, apps/admin each have their own next.config.ts, package.json, and .env.local. packages/ui (shared components), packages/config (shared eslint-config, tsconfig-base), packages/types (shared API types). turbo.json: the dashboard app's build task lists ['^build'] as a dependency, meaning packages/ui and packages/types build first, and Turborepo only rebuilds dashboard when its own files or one of those two packages' outputs actually changed — not on every commit to apps/admin, which shares neither package with dashboard's current dependency graph.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-31' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) laying out a three-app Turborepo/pnpm workspace with Next.js 16 apps.',
      },
    ],
  },
  {
    slug: 'nextjs-diagnose-forced-dynamic-rendering',
    category: 'nextjs',
    title:
      'Find out why a route you expected to be static is rendering dynamically on every request',
    description:
      'Traces which specific API call or import is forcing an otherwise-static route into dynamic rendering, instead of guessing at a fix from the build output symbol alone.',
    promptText: `You are diagnosing why a specific route is rendering dynamically on every request when it was expected to be static or ISR-cached. Rendering mode in the App Router is determined by what a route actually does, not by an explicit setting alone, so the fix has to name the specific code responsible, not just restate that the route "is dynamic."

ROUTE
{{route_path}}

EXPECTED RENDERING MODE
{{expected_rendering_mode}}

BUILD OUTPUT EVIDENCE
{{build_output_evidence}}

CODE INVOLVED
{{route_code}}

DIAGNOSIS RULES
Search the route's component tree, including every layout above it, for a call to a dynamic API: cookies(), headers(), a direct read from searchParams, connection(), or a fetch call with cache: 'no-store' or an explicit revalidate: 0. Any one of these, called anywhere in the tree that renders for this route, including a shared layout the route doesn't own directly, forces the entire route to render dynamically — a static-looking page component can be made dynamic entirely by something in its layout, which is exactly the kind of cause that's easy to miss when the search only looks at the page file itself. Check whether a component is unconditionally calling one of these APIs when it's actually only needed conditionally — a component that reads cookies() to personalize content for logged-in users, but calls it unconditionally even for anonymous visitors who could have gotten a static response, is forcing dynamic rendering for a case that didn't actually need it. If a third-party library or internal utility is the actual source, name that specific import, not just the file that happens to import it, since the fix is either replacing that dependency's usage in this route or accepting the dynamic rendering it requires as a deliberate tradeoff rather than an accidental one. Distinguish between something that must genuinely force dynamic rendering, given what the route actually does — a page that shows the signed-in user's own data has to read a cookie or a session to know who that is — and something that's forcing it unnecessarily where a narrower fix, such as moving the dynamic read into a smaller, isolated Server Component wrapped in its own Suspense boundary, would let the rest of the route stay static or cached while only that one piece renders per-request.

OUTPUT FORMAT
A table: File | Dynamic trigger found | Is it a genuine requirement or an avoidable cause | Fix if avoidable. Then one paragraph confirming whether, after any recommended fixes, the route would actually render statically or with ISR, or whether it should stay dynamic on purpose given what it does — state that conclusion plainly rather than leaving it implied by the table alone.`,
    variables: [
      {
        name: 'route_path',
        description:
          'The route that is rendering dynamically when it was expected to be static.',
        example: '/pricing',
        required: true,
      },
      {
        name: 'expected_rendering_mode',
        description: 'What rendering mode this route was supposed to have, and why.',
        example:
          'Fully static — pricing content is the same for every visitor and rarely changes',
        required: true,
      },
      {
        name: 'build_output_evidence',
        description: 'What the build output or route info actually showed.',
        example:
          "The build output marks /pricing with the dynamic symbol instead of the static one, and Next.js's route info logged 'Dynamic server usage: cookies' during the build",
        required: true,
      },
      {
        name: 'route_code',
        description: 'The page file and any shared layouts above it in the tree.',
        example:
          'app/pricing/page.tsx plus app/layout.tsx, which reads cookies() unconditionally in a top-of-tree A/B test check',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude'],
    tags: [
      'rendering',
      'static-generation',
      'dynamic-rendering',
      'app-router',
      'performance',
    ],
    whyItWorks:
      "Rendering mode in the App Router is a derived fact, not a setting a developer flips directly in most cases — it's determined by whether anything in the route's actual render path, including every shared layout above it, touches a dynamic API, which means the true cause is very often not in the page file a developer opens first to investigate. Searching the entire tree the route renders through, rather than just the page component, targets exactly this: a route can be forced dynamic by something in a root layout three levels up that has nothing to do with the page's own content, and a diagnosis that only reads the page file will conclude, incorrectly, that nothing explains the dynamic build output at all. Separating a genuine requirement from an avoidable cause matters because the correct fix is completely different depending on which one applies — a page that must read a session to show personalized content has no fix beyond accepting dynamic rendering as the right tradeoff, while a page that reads cookies() unconditionally for an A/B test that could have been resolved at the edge, or isolated into a small dynamic component wrapped in its own boundary, has a real fix available, and conflating the two leads either to over-engineering a route that was correctly dynamic all along, or to giving up on making a fixable route static because the unconditional call looked load-bearing when it wasn't. Naming the specific import or call responsible, rather than describing the route generally as \"has dynamic behavior,\" is what makes the finding actionable in a way a reviewer can verify against the actual code — \"cookies() in app/layout.tsx, called unconditionally for a check that only matters for a small subset of visitors\" is a claim someone can open the file and confirm or refute, while \"this route has some dynamic dependencies\" isn't, and a diagnosis that isn't checkable doesn't actually save the time a manual investigation would have taken anyway.",
    exampleOutput: `File | Trigger | Genuine or avoidable | Fix
app/layout.tsx | cookies() called unconditionally to check an A/B test cookie for every visitor, including anonymous ones | Avoidable | Move the A/B check into a small Client Component that reads the cookie via document.cookie instead, or isolate it into its own dynamic Server Component wrapped in Suspense so app/pricing/page.tsx itself stays static

Conclusion: after moving the A/B check out of the root layout, /pricing has nothing left forcing dynamic rendering and should build as fully static — the pricing content itself never reads a dynamic API anywhere in its own tree.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on a Next.js 16 route forced dynamic by a root-layout cookie read.',
      },
    ],
  },
  {
    slug: 'nextjs-parallel-data-fetching-eliminate-waterfalls',
    category: 'nextjs',
    title:
      'Restructure sequential awaits in a Server Component into real parallel fetches',
    description:
      'Finds independent data requests being awaited one after another inside a Server Component and restructures them to start concurrently, without breaking the ones that genuinely depend on an earlier result.',
    promptText: `You are restructuring data fetching inside a Server Component to eliminate a request waterfall — one fetch's await blocking the start of the next fetch when the two don't actually depend on each other's result.

COMPONENT CODE
{{component_code}}

DATA DEPENDENCIES
{{data_dependencies}}

FRAMEWORK CONTEXT
{{fetching_context}}

RESTRUCTURING RULES
Identify every fetch or data call in this component and classify each as either independent — its inputs don't depend on any other fetch in this component resolving first — or genuinely dependent, meaning it needs a value produced by an earlier fetch's result, such as an ID it doesn't have until a prior lookup returns. For every group of independent fetches currently written as sequential awaits, one after another, restructure them to start together: call all of them first without awaiting immediately, then await the results, either individually where each result is used at a different point in the component, or together with a helper like Promise.all when they're consumed together. Do not force a fetch that's genuinely dependent on an earlier one into this pattern — if fetch B needs a value only fetch A's result provides, sequential is not a mistake there, and restructuring it to look parallel would either be impossible or would require guessing at a value fetch A hasn't produced yet. Where the component passes fetched data down to a child component that also fetches, check whether the child's fetch could have started earlier — for instance, by having the parent start the request and pass a promise down rather than the awaited value, letting the child await it independently — rather than gating the child fetch's start entirely behind the parent finishing its own render. Note explicitly where Next.js's request memoization already deduplicates a repeated fetch call across this component tree, since restructuring should not accidentally introduce a second, differently-shaped request for data another part of the tree already requested with the exact same arguments — that's not a fix, it's a second cache-miss disguised as an optimization.

OUTPUT FORMAT
The restructured component code, followed by one line naming which fetches were genuinely sequential and were left as such, and an estimate of the wall-clock time saved by parallelizing the rest, given the approximate latency of each fetch if that's known.`,
    variables: [
      {
        name: 'component_code',
        description:
          'The Server Component with the sequential data fetching to restructure.',
        example:
          'An async OrderDetailPage component that awaits getOrder(id), then awaits getCustomer(order.customerId), then awaits getShippingStatus(id), with getShippingStatus not actually needing anything from the first two calls.',
        required: true,
      },
      {
        name: 'data_dependencies',
        description:
          'Which fetches actually need a value from another fetch, and which are independent.',
        example:
          "getCustomer needs order.customerId from the first call, so it's genuinely sequential; getShippingStatus only needs the order id, which is already known upfront, so it doesn't need to wait on either of the other two",
        required: true,
      },
      {
        name: 'fetching_context',
        description: 'The rendering context and any relevant latency figures.',
        example:
          'Server Component in the App Router; getOrder averages 80ms, getCustomer averages 60ms, getShippingStatus (an external carrier API) averages 400ms',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'data-fetching',
      'server-components',
      'performance',
      'request-waterfalls',
      'promise-all',
    ],
    whyItWorks:
      "A request waterfall in a Server Component is easy to write by accident because the code that produces it looks completely ordinary — a sequence of await calls reads as a natural, linear description of what the component needs, and nothing about the syntax signals that two of those awaits could have started at the same moment instead of one after the other; the bug is entirely about timing, not correctness, so it never shows up as an error, only as a slower page than the code's own logic required. Classifying each fetch as independent or genuinely dependent before touching any code is what prevents the two most common overcorrections in either direction: parallelizing something that actually needs an earlier result, which either breaks outright or silently uses a stale or missing value, and leaving something sequential out of caution when it never depended on anything at all, which just leaves the original waterfall in place under the guise of being careful. The pass-a-promise-down technique for child components targets a subtler version of the same problem: a parent that awaits its own data fully before rendering a child effectively delays the start of the child's fetch until the parent's fetch has completely finished, even when the child's fetch has nothing to do with the parent's data — starting the child's request as early as possible and letting it resolve independently, on its own schedule, is what actually collapses two sequential network round trips into one overlapping window instead of two consecutive ones. Flagging Next.js's request memoization explicitly matters because a restructuring pass focused purely on parallelizing awaits can, without meaning to, introduce a fetch call shaped slightly differently from an identical one elsewhere in the tree — different argument order, an extra option key — which defeats memoization's automatic deduplication and turns what should have been one shared request into two separate ones, adding a request rather than removing a delay.",
    exampleOutput: `async function OrderDetailPage({ id }) {
  const orderPromise = getOrder(id);
  const shippingPromise = getShippingStatus(id); // independent of order/customer, started immediately
  const order = await orderPromise;
  const [customer, shipping] = await Promise.all([getCustomer(order.customerId), shippingPromise]);
  // getCustomer is genuinely sequential (needs order.customerId) — left as-is, just no longer blocking shipping's start
  return (/* render using order, customer, shipping */);
}

Sequential (left as-is): getCustomer, since it needs order.customerId. Parallelized: getShippingStatus now starts alongside getOrder instead of after both getOrder and getCustomer resolve. Estimated savings: roughly 400ms — getShippingStatus's ~400ms latency now overlaps with getOrder and getCustomer's combined ~140ms instead of adding on top of it.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on a Next.js 16 order-detail Server Component.',
      },
    ],
  },
  {
    slug: 'nextjs-error-boundary-hierarchy-design',
    category: 'nextjs',
    title:
      'Design an error.tsx hierarchy that fails at the right scope instead of taking down the whole page',
    description:
      'Places error.tsx boundaries at the segment that actually owns each failure mode, distinguishes handled not-found cases from real crashes, and scopes global-error.tsx to what it can actually catch.',
    promptText: `You are designing the error-handling hierarchy for a route tree, deciding where error.tsx boundaries belong and what global-error.tsx is actually responsible for, so a failure in one section degrades only that section instead of crashing the whole page.

ROUTE TREE
{{route_tree}}

FAILURE MODES TO HANDLE
{{failure_modes}}

CURRENT ERROR HANDLING
{{current_error_handling}}

DESIGN RULES
Place an error.tsx at the route segment that actually owns the operation most likely to fail — a data fetch, a mutation — rather than only at the top of the tree, since an error.tsx catches errors thrown by anything beneath it in the same segment, including its own children, but a boundary placed too high catches the error just as correctly while taking a much larger, unrelated portion of the page down with it as collateral. Every error.tsx file must be a Client Component — it needs 'use client' at the top, since it receives an error object and a reset function as props and needs interactivity, specifically a retry button that calls reset(), to be useful rather than just a static message. Distinguish an expected, handled absence from a genuine unexpected error: calling notFound() for a resource that legitimately doesn't exist should render the segment's not-found.tsx, a deliberate, calm UI state, not error.tsx, which is meant for something that actually went wrong and wasn't supposed to happen; conflating the two means a normal, everyday case like a bad URL slug renders through the same alarming error UI as a genuine crash. Reserve global-error.tsx, which must live directly in the app directory and also be a Client Component, for errors thrown by the root layout itself — it's the only boundary that can catch a failure in the root layout, precisely because every other error.tsx in the tree is rendered as a child of that same root layout and therefore can't catch an error the layout itself throws before any child ever mounts. Log every caught error with enough context to actually debug it later — the route segment, the error's own message and digest if one exists, and any relevant identifiers from the request, such as which resource was being fetched — rather than only rendering a generic apology to the user with nothing captured server-side for whoever has to investigate the failure afterward.

OUTPUT FORMAT
A tree diagram showing where each error.tsx (and any not-found.tsx) sits, paired with what specifically triggers each one and what its fallback UI does — including whether it offers a retry via reset(). Close with one line confirming what global-error.tsx here is actually scoped to catch, and confirming it is not being relied on as a catch-all for errors that already have a more specific boundary lower in the tree.`,
    variables: [
      {
        name: 'route_tree',
        description: 'The route segments and their nesting.',
        example:
          'app/layout.tsx (root) wraps app/dashboard/layout.tsx, which wraps app/dashboard/projects/[id]/page.tsx and app/dashboard/billing/page.tsx',
        required: true,
      },
      {
        name: 'failure_modes',
        description: 'The specific things that can actually go wrong in this tree.',
        example:
          "A project id in the URL that doesn't exist or the user can't access; the billing page's payment-provider API occasionally timing out; a genuinely unexpected exception anywhere in the dashboard layout's own data fetch",
        required: true,
      },
      {
        name: 'current_error_handling',
        description: 'What error handling exists today, if any, and its gaps.',
        example:
          "There's one error.tsx at app/dashboard/layout.tsx today — a billing API timeout currently crashes the entire dashboard, including the unrelated projects list",
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude'],
    tags: [
      'error-boundaries',
      'error-handling',
      'app-router',
      'not-found',
      'global-error',
    ],
    whyItWorks:
      'An error.tsx boundary catches any error thrown by its own segment and everything nested beneath it, which is exactly why placement is the whole decision here — a single boundary at a shared layout technically satisfies "there is error handling" while still taking down every unrelated sibling segment the moment any one of them throws, since the boundary has no way to know which specific child actually failed once it\'s caught the error at that scope; moving the boundary down to the segment that owns the actual risky operation is what turns "the dashboard crashed" into "the billing panel shows a retry button while the projects list keeps working normally." The distinction between notFound() and a thrown error reflects a real, separate rendering path Next.js provides on purpose: notFound() is a deliberate signal meaning this specific, expected case has no content, and it renders not-found.tsx, a calm, designed-for state, while error.tsx is reserved for something that wasn\'t supposed to happen at all — collapsing the two into one error.tsx means a visitor who mistyped a URL sees the same alarming "something went wrong, try again" UI as a visitor who hit an actual server crash, which is both a worse experience for the common case and a false alarm for whoever monitors error rates if not-found hits get logged as errors. The global-error.tsx scoping rule is grounded in a structural fact about how the tree nests, not a convention: every other error.tsx in the app is itself rendered as a descendant of the root layout, so none of them can catch an error the root layout throws before any child has even mounted — global-error.tsx, sitting outside and above that layout, is the only boundary physically positioned to catch that one specific class of failure, and treating it as a general catch-all for errors that already have a more specific boundary elsewhere just means two boundaries are now theoretically eligible to catch the same error with no clear reason to prefer one\'s fallback UI over the other\'s.',
    exampleOutput: `app/dashboard/billing/error.tsx — catches a payment-provider timeout or any other billing-fetch failure; shows "Couldn't load billing right now" with a retry button wired to reset(). app/dashboard/projects/[id]/not-found.tsx — handles a project id that doesn't exist or isn't accessible via notFound(), showing "Project not found" with a link back to the project list, not an error state. app/global-error.tsx — scoped only to a failure in app/layout.tsx itself, such as a broken root-level data fetch; it is not relied on to catch the billing timeout, which already has its own, more specific boundary two levels down.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-29' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on a Next.js 16 dashboard with a shared parent layout and independent child segments.',
      },
    ],
  },
  {
    slug: 'nextjs-environment-variable-architecture-multi-env',
    category: 'nextjs',
    title: 'Set up environment variables so a secret never ends up in the client bundle',
    description:
      'Designs a NEXT_PUBLIC_ vs server-only variable split across local, staging, and production, catching the specific mistake of a secret prefixed for client exposure by habit.',
    promptText: `You are designing the environment variable setup for a Next.js app across its local, staging, and production environments, with the goal of making it structurally difficult for a secret to end up exposed in the client bundle by accident.

VARIABLES NEEDED
{{variables_needed}}

ENVIRONMENTS
{{environments}}

DEPLOYMENT PLATFORM
{{deployment_platform}}

CURRENT SETUP
{{current_env_setup}}

DESIGN RULES
Classify every variable as either genuinely needed in the browser or server-only, and treat that classification as the single fact that decides its name — a variable prefixed with NEXT_PUBLIC_ gets inlined into the client JavaScript bundle at build time, which means it is not a runtime secret in any environment, no matter how sensitive the value or how tightly the deployment platform's dashboard access is restricted, and prefixing an API secret key with NEXT_PUBLIC_ out of habit or because the client code happens to need some related, genuinely public value is a real leak, not a naming inconsistency. Never let a server-only variable get read from a Client Component, even indirectly through a shared config module imported by both server and client code — a config file that reads process.env.DATABASE_URL and exports it as a named constant will bundle that value into the client if any client-rendered code imports from the same file, even code that never actually touches the DATABASE_URL export; keep server-only config in a module that a Client Component file cannot import at all, not just one where the specific export happens to go unused there. For each of the stated environments, specify whether the platform reads env vars at build time or at runtime, since this materially changes the deployment story: a variable baked in at build time requires a rebuild to change, while a runtime-read variable can be updated by changing the platform's configuration and restarting the app, and mixing up which category a given variable actually falls into is a common cause of "I changed the environment variable but nothing changed" reports. Use a single, checked-in .env.example listing every variable name with a placeholder or description but no real value, so a new environment's setup is copy-and-fill rather than reverse-engineered from whichever teammate remembers what's needed; never commit an actual .env file with real values to version control regardless of how private the repository is. State explicitly which variables differ in value across the three environments and which are identical, since a variable that's identical everywhere except accidentally in one environment is a specific and common source of an environment-specific bug that looks like application logic but is actually a config mismatch.

OUTPUT FORMAT
A table: Variable name | Client-exposed or server-only | Build-time or runtime | Differs across environments (yes/no, and how) | Where it's actually read in the codebase. Then the .env.example file content, and one paragraph flagging any variable in the current setup that's misclassified today.`,
    variables: [
      {
        name: 'variables_needed',
        description: 'The environment variables the app actually needs.',
        example:
          'DATABASE_URL, STRIPE_SECRET_KEY, NEXT_PUBLIC_ANALYTICS_ID, SESSION_SECRET, NEXT_PUBLIC_API_BASE_URL',
        required: true,
      },
      {
        name: 'environments',
        description: 'Which environments this setup needs to cover.',
        example:
          'local development, a staging environment on a preview branch, and production',
        required: true,
      },
      {
        name: 'deployment_platform',
        description:
          'Where the app is deployed, since build-time vs runtime env behavior differs by platform.',
        example:
          'Vercel for staging and production; local development runs with next dev',
        required: true,
      },
      {
        name: 'current_env_setup',
        description:
          "What's actually in place today, including anything suspicious worth flagging.",
        example:
          'A single .env file with all variables, and STRIPE_SECRET_KEY is currently prefixed NEXT_PUBLIC_ because an early prototype needed it in a client component that has since been refactored to a Server Action',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: ['environment-variables', 'security', 'secrets', 'configuration', 'deployment'],
    whyItWorks:
      "The NEXT_PUBLIC_ prefix is not a permissions setting or an access-control decision, it's a build-time instruction to inline that value directly into the JavaScript bundle shipped to every visitor's browser, which means the moment a secret carries that prefix, it is exposed in the same sense as if it had been printed on the page — restricting who can view the deployment platform's dashboard afterward does nothing to undo that, since the value is already sitting in a script tag on every page load, readable by anyone who opens their browser's developer tools. The transitive-import warning targets a specific and genuinely surprising bundling behavior: a shared config module that reads a server-only variable and re-exports it can leak that value into the client bundle if any client-rendered file imports from that same module at all, even for a completely unrelated export, because the bundler doesn't understand that one export is unused in that particular consumer — it only sees that the module, as a whole, was pulled into a client bundle, and it includes what's needed to make every export in that module work, not just the one the client code actually references. Distinguishing build-time from runtime variable resolution matters because it determines what \"changing a config value\" actually requires in each environment — a variable read only at build time genuinely cannot be updated by editing a platform dashboard and restarting the app, since the value is already frozen into the built output, and treating it as if a restart would pick up the change leads to a debugging session spent looking for a bug in application logic that's actually a deployment-pipeline misunderstanding. Requiring an explicit statement of which variables differ across environments, rather than leaving that implicit in three separate .env files, surfaces the specific and common failure where a value is supposed to be identical everywhere but silently isn't in one environment — a typo in a staging API base URL, for instance — which otherwise only gets discovered when staging behaves subtly differently from production for a reason nobody thought to check because nothing about the setup flagged that these two values were even supposed to match.",
    exampleOutput: `STRIPE_SECRET_KEY | server-only | runtime (read inside a Server Action, never bundled) | identical across staging/production, different in local (test-mode key) | lib/payments.ts, called only from 'use server' actions
NEXT_PUBLIC_API_BASE_URL | client-exposed | build-time (inlined at build) | differs per environment (staging vs production API host) | read directly in app/providers/api-client.ts, a Client Component

Flag: STRIPE_SECRET_KEY is currently prefixed NEXT_PUBLIC_ in the existing .env file, a leftover from a client component that has since been removed — this is exposing a live Stripe secret key in the production JavaScript bundle right now and should be renamed and rotated immediately, not just renamed on the next deploy.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1, including the transitive-import bundling check on a Next.js 16 app.',
      },
    ],
  },
  {
    slug: 'nextjs-font-optimization-next-font-setup',
    category: 'nextjs',
    title: 'Self-host fonts with next/font without the layout-shift and FOIT tradeoffs',
    description:
      'Sets up next/font to self-host and subset fonts at build time with the right fallback metrics and font-display behavior, instead of a runtime Google Fonts request or an unconfigured default that still shifts layout.',
    promptText: `You are setting up font loading for a Next.js app using next/font, so fonts are self-hosted and optimized at build time rather than fetched from a runtime request to an external font host, and configured to actually avoid the layout shift and invisible-text tradeoffs a naive setup still produces.

FONTS NEEDED
{{fonts_needed}}

USAGE CONTEXT
{{usage_context}}

CURRENT FONT LOADING
{{current_font_loading}}

STYLING APPROACH
{{styling_approach}}

SETUP RULES
Use next/font/google or next/font/local rather than a manually added <link> tag or an @import in a CSS file pointed at an external font host — next/font downloads the font files at build time and self-hosts them alongside the app's other static assets, which removes the runtime network request to the font provider entirely and means no request to an external domain ever happens at page load, which is also why there's no need to add that domain to any connect-src or similar allowlist. Only load the specific font weights and styles the design actually uses, not the full available range by default — each additional weight is a separate font file that has to be fetched and parsed, and a page that only ever renders 400 and 600 weight text gains nothing from also loading 300, 500, and 700. Configure a fallback font stack with adjustFontFallback left enabled, which is the default, so next/font can automatically adjust the fallback system font's metrics — its size, its line height — to closely match the actual web font's metrics; this is what prevents the visible reflow that happens when a fallback font displays first and then gets swapped for the real font once it loads, since a fallback with mismatched metrics changes how much space the same text occupies the moment the swap happens. If the styling approach uses CSS variables, generate the font as a CSS variable via the variable option and reference it in the site's Tailwind config or global CSS, rather than applying the font's generated className prop by hand to every component that needs it — a single CSS variable applied once at the root layout covers the whole tree, while a className applied per-component is easy to forget on a new component added later. For local, self-hosted font files not available through Google Fonts, use next/font/local with the correct format and weight declarations matching the actual files provided, and confirm variable font files are declared as a single font-weight range rather than as several separate static-weight entries, if the file itself is genuinely variable.

OUTPUT FORMAT
The font configuration file (or the relevant section of layout.tsx), the CSS variable or className wiring into the root layout, and one paragraph confirming that no runtime request to any external font host occurs anywhere in the resulting setup.`,
    variables: [
      {
        name: 'fonts_needed',
        description: 'Which fonts and weights the design actually uses.',
        example:
          'Inter at 400 and 600 weight for body and UI text; a display serif (Fraunces) at 500 weight for headings',
        required: true,
      },
      {
        name: 'usage_context',
        description:
          'Where each font is used, to help decide scoping and variable naming.',
        example:
          'Inter is used app-wide for body copy and UI chrome; Fraunces is used only for h1/h2 headings on marketing pages',
        required: true,
      },
      {
        name: 'current_font_loading',
        description: 'How fonts are loaded today, including anything worth flagging.',
        example:
          "A <link> tag to Google Fonts' CDN in the root layout's <head>, loading Inter at all nine available weights",
        required: true,
      },
      {
        name: 'styling_approach',
        description:
          'Whether styling uses Tailwind, CSS Modules, or another approach, since that affects how the font variable gets wired in.',
        example: 'Tailwind CSS with a custom theme extending fontFamily',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'v0 by Vercel'],
    tags: ['next-font', 'performance', 'core-web-vitals', 'fonts', 'cls', 'self-hosting'],
    whyItWorks:
      "next/font's actual mechanism is a build-time download and self-host, not a runtime optimization layered on top of an external request — the font files get fetched once, during the build, and served from the app's own domain from then on, which is why a setup using next/font correctly has zero runtime connections to any font provider at all, closing off an entire category of privacy and performance concern that a <link> tag to an external CDN carries by design, since every visitor's browser would otherwise make its own separate request to that third-party host. Loading only the weights actually used in the design targets a cost that's invisible in a visual review of the rendered page — a page that visually uses only two weights but has five loaded looks completely correct, and the extra three weights' cost shows up only in the network tab as extra font files downloaded for text that was never going to render in those weights anywhere on the page. The adjustFontFallback behavior is the specific, documented mechanism that prevents layout shift during a font swap: without matched fallback metrics, the browser initially lays out text using a system font's size and line-height, and when the real web font finishes loading and swaps in, any difference between the two fonts' actual character widths and line heights shifts every element positioned relative to that text — adjustFontFallback works by generating an adjusted fallback font specifically calibrated to approximate the real font's metrics as closely as possible, so the swap changes how the text looks without changing how much space it occupies, which is what actually eliminates the visible jump rather than just making it happen sooner. The CSS-variable wiring recommendation over a per-component className exists because a className has to be manually reapplied everywhere a font is used, and a new component added six months later by someone unfamiliar with the setup will very plausibly render in the browser's default font simply because nobody remembered to import and apply the className — a CSS variable set once at the root and referenced through the site's existing CSS or Tailwind config inherits automatically, with no per-component step that can be forgotten.",
    exampleOutput: `const inter = Inter({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-inter' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['500'], variable: '--font-fraunces' });
// applied once in app/layout.tsx: <html className={\${inter.variable} \${fraunces.variable}}>
// Tailwind config: fontFamily.sans = ['var(--font-inter)'], fontFamily.display = ['var(--font-fraunces)']

No runtime font requests: both fonts are downloaded once at build time and served as static assets from the app's own domain — the network tab on any page shows zero requests to fonts.googleapis.com or fonts.gstatic.com.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-31' },
      { tool: 'v0 by Vercel', version: '2026.7', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and v0 by Vercel on a Next.js 16 app migrating off a Google Fonts <link> tag.',
      },
    ],
    relatedToolSlug: 'website-speed-test',
  },
  {
    slug: 'nextjs-app-router-i18n-locale-routing',
    category: 'nextjs',
    title:
      'Structure locale-aware routing in the App Router without reaching for a heavy i18n framework',
    description:
      'Designs [locale] segment routing with middleware-based locale negotiation and generateStaticParams for pre-rendering, scoped honestly to whether a dedicated i18n library is actually warranted.',
    promptText: `You are structuring locale-aware routing for a Next.js App Router site, deciding the segment structure, the locale-detection strategy, and whether the stated needs actually justify a dedicated i18n library or are simple enough for a lighter, hand-rolled approach.

LOCALES SUPPORTED
{{locales_supported}}

CONTENT TRANSLATION APPROACH
{{content_translation_approach}}

DEFAULT LOCALE BEHAVIOR
{{default_locale_behavior}}

CURRENT STRUCTURE
{{current_structure}}

DESIGN RULES
Nest every localized route under a [locale] dynamic segment — app/[locale]/page.tsx, app/[locale]/about/page.tsx — so the locale is a first-class part of the URL and the route structure, rather than inferred from a cookie or a header alone with no reflection in the path; a locale that isn't in the URL can't be shared via a link, can't be indexed separately by search engines for each language, and breaks the browser's own back button expectation when a visitor switches languages. Use generateStaticParams at the [locale] segment level to pre-render each supported locale's static pages at build time rather than resolving locale-specific content only at request time, for any content that doesn't need to be dynamic per-request beyond varying by locale. Do the initial locale negotiation, meaning deciding which locale an unprefixed request like the bare root path should redirect to, in middleware — reading the Accept-Language header and any existing locale preference cookie, then issuing a redirect to the matching [locale] path — rather than duplicating that negotiation logic inside every page component that might receive an unprefixed request. Decide explicitly, and state the decision, on default-locale URL behavior: whether the default locale gets its own visible segment in the URL (/en/about) or is treated as the unprefixed default (/about, with /es/about for the non-default locale) — both are legitimate choices, but leaving it undecided produces inconsistent internal links as different pages get built by different people making different implicit assumptions. Assess honestly whether the actual translation need here — a handful of static strings, or full pluralization rules, date/number formatting, and rich message interpolation across many locales — justifies a dedicated library like next-intl, versus a much simpler hand-rolled dictionary object keyed by locale; recommend the lighter approach when the stated need doesn't go beyond static string lookup, and say plainly why a heavier library would be unjustified overhead rather than defaulting to it because it's the more commonly cited solution.

OUTPUT FORMAT
The folder structure showing the [locale] segment and where generateStaticParams lives, the middleware's locale-negotiation logic, and one paragraph stating the default-locale URL decision and the translation-approach recommendation, each with its reasoning made explicit rather than left implied.`,
    variables: [
      {
        name: 'locales_supported',
        description: 'Which locales the site needs to support.',
        example: 'en (default), es, fr',
        required: true,
      },
      {
        name: 'content_translation_approach',
        description: 'How translated content is currently stored or would be stored.',
        example:
          'Marketing copy lives in per-locale JSON dictionaries; no pluralization or rich formatting needs beyond simple string interpolation for a name or count',
        required: true,
      },
      {
        name: 'default_locale_behavior',
        description: 'Whether the default locale should have a visible URL segment.',
        example:
          'Undecided today — some internal links point to /about, others to /en/about, inconsistently',
        required: true,
      },
      {
        name: 'current_structure',
        description: 'What routing exists today, if anything, and its gaps.',
        example:
          'Locale is currently read from a cookie only, with no [locale] segment in the URL at all — every page is served at the same path regardless of language, which breaks sharing a Spanish-language link with someone whose browser defaults to English',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'i18n',
      'localization',
      'middleware',
      'app-router',
      'generatestaticparams',
      'routing',
    ],
    whyItWorks:
      "Putting the locale in the URL path, rather than resolving it silently from a cookie or header, is the decision that actually determines whether the site's internationalization is real or cosmetic: a locale that lives only in a cookie means two visitors on the same device but different browser profiles, or the same visitor after clearing cookies, land on a different language with no way to deliberately choose or share a specific one, and search engines have no way to index the Spanish and French versions of a page as the distinct, separately rankable pages they actually are, since from a crawler's perspective there's only ever been one URL. Using generateStaticParams at the locale segment level, rather than resolving translated content only at request time inside each page, is what lets locale-specific pages get the same static-generation and caching benefits as a single-locale site would — a site that treats locale as just another piece of request-time data, fetched inside every page component regardless of whether the underlying content ever changes, gives up build-time pre-rendering for every localized page even when nothing about the content is actually dynamic beyond which language it's written in. Doing locale negotiation once in middleware, rather than reimplementing an Accept-Language check inside every page that might receive an unprefixed request, matters because that logic has real edge cases — a malformed header, a locale the site doesn't actually support, a returning visitor's saved preference that should override the header — and duplicating a from-scratch implementation of those edge cases across many page files is exactly how two pages end up disagreeing about which locale an ambiguous request should resolve to, a bug that only surfaces when someone happens to test the specific unprefixed page that got the negotiation logic slightly wrong. The honest library-versus-hand-rolled assessment matters because the default answer in most i18n advice is to reach for a full framework regardless of actual need, and a site with a handful of static strings across three locales gets real, measurable complexity — a new dependency, a new set of APIs to learn, a build step to configure — for a problem a plain object literal keyed by locale solves completely, while a site that genuinely needs plural rules, date formatting per locale, and nested message interpolation across a dozen languages would be taking on real risk trying to hand-roll those correctly instead of using a library that's already solved them.",
    exampleOutput: `app/[locale]/layout.tsx (generateStaticParams returns [{ locale: 'en' }, { locale: 'es' }, { locale: 'fr' }]), app/[locale]/page.tsx, app/[locale]/about/page.tsx. middleware.ts reads the Accept-Language header and a saved locale cookie for any request to '/', then redirects to the matching /[locale] path — this negotiation logic exists in exactly one place. Decision: default locale (en) gets its own visible /en segment, matching es and fr, rather than an unprefixed exception — this keeps every internal link generation function consistent instead of special-casing one locale. Translation approach: a hand-rolled dictionary object per locale is sufficient here — there's no pluralization or date formatting need stated, so next-intl would add a dependency and a learning curve for a problem three JSON files already solve.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-01' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on a Next.js 16 marketing site adding a [locale] segment.',
      },
    ],
  },
  {
    slug: 'nextjs-optimistic-mutations-server-actions-useoptimistic',
    category: 'nextjs',
    title:
      'Add optimistic UI to a Server Action mutation without letting the UI lie on failure',
    description:
      'Wires useOptimistic to a Server Action so a mutation appears instantly with a real temporary identity, and defines exactly what happens to that optimistic state when the server rejects it.',
    promptText: `You are adding optimistic UI to a specific mutation that already runs through a Server Action, using useOptimistic to show the result before the server has actually confirmed it — and you are defining, explicitly, what happens to that optimistic state if the mutation fails, rather than leaving the failure path unhandled.

MUTATION
{{mutation_description}}

CURRENT SERVER ACTION
{{server_action_code}}

WHY OPTIMISTIC UI IS NEEDED HERE
{{optimistic_ui_justification}}

FAILURE BEHAVIOR
{{failure_behavior}}

BUILD RULES
Confirm first that this mutation actually warrants useOptimistic before building anything: the interface has to render a visible result — a new item appearing in a list, a count changing, a toggled state flipping — before the server has confirmed the mutation succeeded, for the added complexity to earn its place; if the UI would be showing a pending spinner either way and nothing changes about what's rendered once the optimistic value lands, useOptimistic isn't buying anything here and a plain pending state is the correct, simpler choice. When constructing the optimistic value inside the updater function passed to useOptimistic, give it a genuine temporary identity — a locally generated id, clearly distinguishable from a real server-assigned one, such as a prefixed string or a negative placeholder number — so the optimistic item can be found and reconciled or removed later without accidentally colliding with a real id a concurrent request might assign. Reconcile the optimistic state with the actual server response the moment the Server Action resolves successfully: replace the temporary item with the real one returned by the action, including its real id and any server-computed fields the optimistic guess couldn't have known, rather than leaving the temporary version rendered indefinitely alongside or instead of the confirmed one. Define the failure path explicitly and make it visible to the user, not silent: when the Server Action's returned state indicates failure, the optimistic value must be rolled back — removed from the list, or reverted to its prior value — and the user needs a clear, specific signal that their action didn't actually take effect, not just a state that quietly reverts with no explanation, which reads as a bug rather than a handled failure. Keep the optimistic update itself free of business logic the server is responsible for — don't have the client-side optimistic guess attempt to validate the input or compute a value only the server can correctly determine, such as a price that depends on tax rules; the optimistic value should be the client's best guess at what the confirmed result will look like, not a parallel reimplementation of server logic that can disagree with the real computation.

OUTPUT FORMAT
The Server Action's return type, the component using useOptimistic including the updater function, and one paragraph specifically describing what a user sees, step by step, if the mutation fails after the optimistic value has already rendered.`,
    variables: [
      {
        name: 'mutation_description',
        description: 'What the mutation does.',
        example:
          'Adds a comment to a task and should appear in the comment list immediately as the user submits it',
        required: true,
      },
      {
        name: 'server_action_code',
        description: 'The existing Server Action this optimistic UI wraps around.',
        example:
          'addCommentAction(taskId, formData), which validates the comment text, inserts a row, and returns { comment } on success or { error } on failure',
        required: true,
      },
      {
        name: 'optimistic_ui_justification',
        description:
          'Why this specific mutation needs to show a result before confirmation.',
        example:
          'Comments are posted frequently during active discussions, and waiting even a second for each one to appear makes the thread feel unresponsive compared to how instant it feels elsewhere in the app',
        required: true,
      },
      {
        name: 'failure_behavior',
        description:
          'What should happen, visibly, if the mutation fails after the optimistic value has already rendered.',
        example:
          "The optimistic comment should disappear from the list and a small inline message should say 'Failed to post — try again' next to where the comment box is, with the typed text restored into the box",
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'v0 by Vercel'],
    tags: ['useoptimistic', 'server-actions', 'react-19', 'optimistic-ui', 'forms'],
    whyItWorks:
      "Requiring a justification for useOptimistic before building anything targets the same overcorrection this hook invites everywhere it's discussed as a React 19 highlight: it's genuinely useful specifically when the interface renders a different, visible result before versus after the optimistic value lands, and completely wasted complexity when the UI would show identical content in both cases, such as a form that just disables its submit button either way — a build that skips the justification step tends to add useOptimistic reflexively because it's the newer API, which produces real indirection (a second, temporary state to reason about, reconcile, and roll back) for a mutation that never needed it. Giving the optimistic value a genuine, distinguishable temporary identity matters because two things can legitimately be true at once during the pending window — the optimistic item is rendering locally, and a real server-assigned id doesn't exist yet — and if the optimistic id isn't clearly marked as temporary, reconciling it with the eventual real response becomes ambiguous the moment more than one mutation is in flight at once, since there's no reliable way to tell which rendered item corresponds to which pending request without a marker that says so explicitly. The mandatory, visible failure path is the part a first pass at useOptimistic most commonly skips, precisely because the sunny-day case — mutation succeeds, optimistic value gets confirmed — is what every basic example demonstrates, and a hook that silently reverts state on failure with no accompanying message produces a genuinely confusing experience: a comment appears, then vanishes a moment later with no explanation, which reads to the person who just typed it as the app randomly deleting their input rather than as a failed request being handled correctly. Keeping business logic out of the optimistic guess — not letting the client-side update attempt to compute something only the server can correctly determine — prevents a specific and subtle class of bug where the optimistic value and the eventual real value disagree not because of network timing but because the client's guess used different logic than the server's actual computation, which shows up as a visible, jarring correction the moment the real value replaces the optimistic one, even when the mutation itself succeeded exactly as intended.",
    exampleOutput: `const [optimisticComments, addOptimisticComment] = useOptimistic(comments, (state, newComment) => [...state, { ...newComment, id: 'temp-' + Date.now(), pending: true }]);

async function handleSubmit(formData) {
  const text = formData.get('text');
  addOptimisticComment({ text, author: currentUser });
  const result = await addCommentAction(taskId, formData);
  if (result.error) {
    // optimistic entry is removed on next render since it's not in the real 'comments' prop;
    // show inline "Failed to post — try again" and restore the typed text into the input
  }
}

Failure path: the user submits a comment, sees it appear instantly with a subtle pending indicator, and if addCommentAction returns an error, that comment disappears from the list on the next render (since the confirmed comments array never included it) while an inline message appears where the comment box is, and the originally typed text is restored into the box rather than lost.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' },
      { tool: 'v0 by Vercel', version: '2026.7', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and v0 by Vercel on a Next.js 16 comment thread using useOptimistic with a Server Action.',
      },
    ],
  },
  {
    slug: 'nextjs-self-hosting-standalone-docker-deployment',
    category: 'nextjs',
    title:
      'Package a Next.js app for self-hosted deployment without guessing at a Dockerfile',
    description:
      "Sets up output: 'standalone' with a multi-stage Dockerfile sized to what the trace-based build actually includes, and names the ISR cache-persistence problem a naive container setup silently gets wrong.",
    promptText: `You are packaging a Next.js app for self-hosted deployment in a container, using output: 'standalone' in next.config so the resulting image ships only what the app actually traces as needed at runtime, rather than the entire node_modules tree or a Dockerfile improvised from a generic Node.js template.

APP DETAILS
{{app_details}}

DEPENDENCIES WITH NATIVE OR BUILD-STEP REQUIREMENTS
{{native_dependencies}}

CACHING NEEDS
{{caching_needs}}

CONTAINER PLATFORM
{{container_platform}}

BUILD RULES
Set output: 'standalone' in next.config so the build produces a minimal, traced .next/standalone directory containing only the files and dependencies the app actually needs at runtime, then structure the Dockerfile as a genuine multi-stage build: one stage installs dependencies and runs the build, a second, much smaller final stage copies only .next/standalone, .next/static, and the public directory into a lean base image, rather than copying the entire repository including devDependencies and source files that have no runtime purpose into the final image. Run the container as a non-root user in the final stage, and explicitly copy in and use whatever Node.js version matches what the app was built and tested against, rather than floating on whatever "latest" tag a base image happens to resolve to at build time, since an unpinned base image can silently change the app's runtime environment between builds with no code change at all. Address the ISR cache-persistence question directly rather than leaving it implicit: a standalone container's filesystem cache for revalidated pages lives inside that specific container instance, so a fresh container — from a restart, a redeploy, or a horizontally scaled second instance — starts with an empty cache and has to regenerate every ISR page from scratch on its next request, which is a real, working behavior but a different one than a long-running single server would have, and if this container needs to run as multiple replicas, either accept that each replica regenerates its own cache independently, or configure a custom cache handler backed by a shared store such as Redis so all replicas share one cache instead of each maintaining its own. Confirm which environment variables the app needs at build time versus runtime, since a value baked into the standalone build during the image build stage cannot be changed later just by setting a different environment variable when the container starts — if a variable genuinely needs to differ per deployment without rebuilding the image, it has to be read at runtime inside the app, not consumed only during the build.

OUTPUT FORMAT
The complete multi-stage Dockerfile, the exact next.config.ts change, and one paragraph specifically addressing what happens to ISR-cached pages across a container restart or a horizontally scaled second replica, given the caching needs stated above.`,
    variables: [
      {
        name: 'app_details',
        description: 'Basic facts about the app being containerized.',
        example:
          'A Next.js 16 App Router app using the pnpm package manager, with a mix of static and ISR-revalidated pages',
        required: true,
      },
      {
        name: 'native_dependencies',
        description:
          'Any dependency that needs a native build step or specific system libraries.',
        example:
          "sharp for image processing, which needs its native binary matched to the container's target platform architecture",
        required: true,
      },
      {
        name: 'caching_needs',
        description:
          'Whether the app will run as a single instance or multiple replicas, and how that affects ISR caching.',
        example:
          'Will run as 2-3 horizontally scaled replicas behind a load balancer, so per-replica ISR cache regeneration is a real concern, not a hypothetical',
        required: true,
      },
      {
        name: 'container_platform',
        description: 'Where the container will actually run.',
        example: 'A self-managed Kubernetes cluster',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'docker',
      'self-hosting',
      'standalone-output',
      'deployment',
      'isr',
      'containers',
    ],
    whyItWorks:
      "output: 'standalone' works by statically tracing the app's actual runtime dependency graph and copying only what's genuinely reachable at runtime into a minimal output directory, which is meaningfully different from a Dockerfile that just copies the whole repository including node_modules — the traced output is dramatically smaller, and a multi-stage Dockerfile that copies only .next/standalone, .next/static, and public into its final stage is what actually captures that size benefit; a Dockerfile that copies everything into a single stage regardless of standalone output defeats the entire point of tracing, since the final image ends up carrying the same devDependencies and unused files the traced build was specifically designed to exclude. Pinning the Node.js version explicitly rather than floating on a \"latest\" base-image tag closes a specific and hard-to-diagnose class of bug: an image built today and an identical-looking image built next month from the same Dockerfile can end up running on genuinely different Node.js versions if the base image's latest tag moved in between, which means a container that behaved one way in staging can behave differently in production for a reason that has nothing to do with any actual code change, and is very difficult to trace back to \"the base image resolved differently\" without already suspecting that specifically. The ISR cache-persistence detail is the one that's easy to miss entirely because a single-container local test doesn't expose it at all — a container running as one long-lived instance behaves exactly like a traditional long-running Next.js server would, and the cache-loss-on-restart and cache-fragmentation-across-replicas problems only become visible once the app is actually deployed at the replica count and restart frequency it's designed to run at, by which point it's a production incident report about a page occasionally showing stale or inconsistent content rather than a design decision made deliberately during setup. Separating build-time from runtime environment variable resolution matters here for the same reason it matters in any deployment context, but it's specifically sharp-edged in a container workflow, where \"just change the environment variable and restart\" is the instinctive fix for a config problem, and that instinct is simply wrong for any variable the standalone build already consumed and baked in during the image build stage.",
    exampleOutput: `# Stage 1: deps + build
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: minimal runtime
FROM node:20-slim AS runner
WORKDIR /app
RUN addgroup --system nodejs && adduser --system nextjs --ingroup nodejs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

ISR caching: with 2-3 replicas behind a load balancer, each container's filesystem cache is independent — a restart or a request routed to a different replica can regenerate the same ISR page redundantly rather than reusing a cache another replica already has. Given the stated multi-replica need, this setup should move to a custom cache handler backed by Redis so all replicas share one cache, rather than accepting per-replica regeneration as a permanent tradeoff.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' },
      { tool: 'GitHub Copilot', version: '2026.7', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: "Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot packaging a Next.js 16 app with output: 'standalone' for a multi-replica deployment.",
      },
    ],
  },
  {
    slug: 'nextjs-auth-js-session-architecture-app-router',
    category: 'nextjs',
    title:
      'Wire Auth.js session checks correctly across Server Components, Route Handlers, and middleware',
    description:
      'Splits Auth.js session verification by layer — a light JWT check in middleware versus a full session load in a Server Component — and flags the specific database-session-strategy trap that breaks in edge middleware.',
    promptText: `You are wiring Auth.js (NextAuth) session checks across a Next.js App Router app, deciding what runs in middleware versus what runs in a Server Component or Route Handler, and specifically checking whether the session strategy in use is even compatible with where each check is being placed.

SESSION STRATEGY
{{session_strategy}}

ROUTES NEEDING PROTECTION
{{protected_routes}}

CURRENT AUTH CHECKS
{{current_auth_checks}}

ROLE OR PERMISSION MODEL
{{role_permission_model}}

DESIGN RULES
Confirm the session strategy before deciding what middleware can actually check: a JWT session strategy encodes the session directly in a signed, stateless token, which middleware running on the edge runtime can verify on its own with no database call, but a database session strategy stores the session server-side and requires a lookup to confirm it's still valid — if the app uses the database strategy, middleware genuinely cannot verify a full, current session on its own without adding a database round trip to every matched request, which reintroduces the exact latency problem middleware exists to avoid; in that case, middleware should either not attempt full session verification at all, or the app should use a lighter, edge-compatible check (verifying only that a session cookie exists and is well-formed) in middleware while the actual, authoritative check happens in a Server Component or Route Handler that does have full database access. Use the auth() helper (or the session-reading utility Auth.js exposes for this) inside Server Components and Route Handlers for the authoritative check, reading the full session including whatever role or permission data the app's callbacks attach to it, since this is where a real database lookup, if the strategy requires one, is actually affordable — it runs once per request that reaches this layer, not on every request including ones middleware would otherwise reject before they get here. Keep role and permission logic out of middleware entirely unless the session strategy and the specific role data genuinely allow a stateless check — middleware's job here is presence and basic validity of a session, not authorization decisions that depend on data which may need a fresh lookup to be trustworthy, such as a role that could have changed since the token was issued. Apply the same session-reading pattern consistently across every protected Server Component and Route Handler rather than letting different routes call auth() with slightly different assumptions about what fields are guaranteed to exist on the returned session object — a route that assumes session.user.role is always present will throw or misbehave the moment it's hit by a session shape that predates a schema change, if that possibility hasn't been guarded against explicitly.

OUTPUT FORMAT
A table: Layer (middleware, Server Component, Route Handler) | What it checks | Why that check is affordable at this layer given the session strategy | What it explicitly does NOT check. Then one paragraph stating plainly whether the current session strategy and the current middleware implementation are actually compatible, or whether the middleware is attempting something the chosen strategy can't support on the edge runtime.`,
    variables: [
      {
        name: 'session_strategy',
        description: 'The Auth.js session strategy in use.',
        example:
          'JWT strategy — sessions are signed tokens stored in a cookie, no database lookup needed to verify signature and expiry',
        required: true,
      },
      {
        name: 'protected_routes',
        description: 'Which routes need session protection.',
        example:
          '/dashboard/* requires any signed-in session; /dashboard/admin/* additionally requires an admin role',
        required: true,
      },
      {
        name: 'current_auth_checks',
        description: 'What auth checks exist today, including anything suspicious.',
        example:
          "middleware currently calls auth() directly and checks session.user.role === 'admin' inside it — this works today but the team is considering switching to the database session strategy for revocation support",
        required: true,
      },
      {
        name: 'role_permission_model',
        description: 'How roles or permissions are attached to a session.',
        example:
          'A jwt callback attaches role to the token at sign-in, and a session callback copies it onto session.user.role',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude'],
    tags: [
      'auth-js',
      'nextauth',
      'authentication',
      'middleware',
      'app-router',
      'sessions',
    ],
    whyItWorks:
      "The session-strategy distinction is the single fact that decides whether a given auth check is even architecturally possible at the layer it's placed in, not just whether it's a good idea: a JWT session is a signed, self-contained token that middleware running on the edge runtime can verify with no external lookup, while a database session strategy's whole point is that the session can be revoked or updated server-side, which structurally requires a database round trip to confirm current validity — no amount of clever middleware code makes that check free on the edge runtime, because the constraint isn't about code quality, it's about what data is physically available without a network call. This is exactly why a role check running directly inside middleware today, using session.user.role read off a JWT, quietly stops being safe to run there the moment the strategy switches to database-backed sessions — the middleware code doesn't change, doesn't error, and doesn't warn anyone, it just becomes a decision made on data that might already be stale relative to what the database would say, since a revoked or role-changed session issued before the switch might still carry an old JWT until it naturally expires. Separating \"does a session exist and look well-formed\" from \"is this specific role or permission still current\" gives each layer a check it's actually equipped to answer correctly: middleware's cheap, stateless check is well-suited to presence and basic validity, while a Server Component's or Route Handler's ability to hit the database on every request that actually reaches it, at a request volume already filtered down by middleware's cheap gate, is exactly where an authoritative, potentially-database-backed check belongs without the latency cost of running it on every request unconditionally. Requiring the same session-reading assumptions across every protected route closes a gap that tends to open gradually as an app grows — an early route written when every session guaranteed a role field, and a later route written after a schema change made that field optional for a new user type, can both compile and both look correct individually while actually disagreeing about what a session object is allowed to look like, a mismatch that only surfaces as a runtime error for the specific user whose session doesn't match whichever route's unstated assumption happens to be wrong.",
    exampleOutput: `Layer | Checks | Why affordable here | Does NOT check
middleware | session cookie exists and is a well-formed JWT with a valid signature and unexpired timestamp | Stateless verification, no database call, safe on the edge runtime for every matched request | Whether the role encoded in the token is still current, or whether the session has been revoked server-side
Server Component (app/dashboard/admin/layout.tsx) | Full session via auth(), including session.user.role, checked against the required admin role | Runs once per request that already passed middleware's cheap gate — affordable to do a real, current check here | N/A — this is the authoritative check for this route

Compatibility: the current setup is consistent because the strategy is JWT-based, so middleware's role check is reading data that's genuinely as current as the token itself. If the strategy switches to database sessions as the team is considering, the role check inside middleware would need to move to the Server Component layer, since middleware would no longer be able to confirm the role is current without a database call it isn't equipped to make.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on a Next.js 16 app using Auth.js with a JWT session strategy.',
      },
    ],
  },
  {
    slug: 'nextjs-testing-route-handlers-server-components',
    category: 'nextjs',
    title:
      "Write a test strategy for App Router code that doesn't pretend Server Components unit-test like hooks",
    description:
      'Separates what App Router code is actually directly testable — Route Handlers, Server Actions — from what genuinely needs an integration or end-to-end approach, instead of forcing everything through the same unit-test pattern.',
    promptText: `You are designing a test strategy for a piece of App Router code, and the first job is classifying what kind of test that specific code actually supports, rather than defaulting to the same unit-test pattern used for client-side hooks and components regardless of what's actually being tested.

CODE TO TEST
{{code_to_test}}

CODE TYPE
{{code_type}}

EXISTING TEST SETUP
{{existing_test_setup}}

KEY BEHAVIORS TO COVER
{{key_behaviors}}

TESTING RULES
If this is a Route Handler, test it directly and cheaply: import the exported GET, POST, or other method function and call it with a real, constructed Request object, then assert on the returned Response's status and body — this needs no browser, no rendering, and no test server, since a Route Handler is just an async function that takes a Request and returns a Response, and testing it as exactly that is both the simplest and the most accurate representation of what it actually does in production. If this is a Server Action, test it the same way: it's a plain async function once you have a reference to it, so call it directly with constructed FormData or arguments and assert on its returned value, mocking only the actual external dependency named below, such as a database client or an external API call — do not reach for a browser-based test to exercise a Server Action's own logic when a direct function call tests the identical code path with far less setup and far less flakiness. If this is a Server Component, be honest about the real limitation: it's an async function that can't be rendered synchronously the way React Testing Library renders a client component, and there's no first-party, widely adopted pattern for unit-rendering an async Server Component the way there is for a client one — the realistic options are testing the plain data-fetching and transformation logic it calls as ordinary functions, separate from the JSX it returns, or verifying the actual rendered output through an integration or end-to-end tool like Playwright that runs a real browser against a real running instance of the app; recommend whichever fits the specific behavior being verified, and say plainly if the honest answer is that a given behavior is better covered by end-to-end testing than forced into a unit test that would only prove the function didn't throw. Mock only at the actual external boundary — the database client, the third-party API, the mailer — never by reaching into the framework's own internals (a Request/Response implementation, Next.js's own caching layer) to fake behavior that a real Request/Response object already provides correctly and for free. Cover both the success path and every named failure mode explicitly — a Route Handler test suite that only exercises a 200 response has not actually tested the validation-failure or not-found branches that live in the same function, even though those branches are just as reachable as the success path in real traffic.

OUTPUT FORMAT
For each piece of code listed, state which category it falls into (directly testable, or needs integration/e2e) and why, then the actual test code for whatever is directly testable, and a one-line note on what the untestable-at-the-unit-level parts should be verified with instead.`,
    variables: [
      {
        name: 'code_to_test',
        description: 'The specific code that needs a test strategy.',
        example:
          'app/api/orders/route.ts (POST handler that validates and creates an order) and app/orders/[id]/page.tsx (an async Server Component that fetches and renders order details)',
        required: true,
      },
      {
        name: 'code_type',
        description: 'What kind of App Router code each piece is.',
        example:
          'The route.ts file is a Route Handler; the page.tsx file is a Server Component',
        required: true,
      },
      {
        name: 'existing_test_setup',
        description: 'What testing tools are already in the project.',
        example:
          'Vitest for unit tests, Playwright already configured for a small number of existing e2e flows',
        required: true,
      },
      {
        name: 'key_behaviors',
        description:
          'The specific behaviors that must be verified, across both success and failure.',
        example:
          'POST /api/orders returns 400 on an invalid payload, 201 with the created order on success; the order detail page shows a not-found state for a deleted or inaccessible order id',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'testing',
      'route-handlers',
      'server-components',
      'server-actions',
      'vitest',
      'playwright',
    ],
    whyItWorks:
      "A Route Handler is, structurally, just an async function that accepts a Request and returns a Response — nothing about testing it correctly requires a browser, a rendering step, or a running server, and treating it as exactly what it is lets a test call the exported function directly with a real, constructed Request object and assert on the real returned Response, which is both simpler to write and a more accurate representation of what actually happens in production than any test double for the framework's routing layer could be. Server Actions share the same underlying reality once the reference to the function exists: they're plain async functions, and testing them by calling them directly with constructed input tests the identical code path a real form submission would exercise, without needing to render a form, simulate a click, or wait on any of the DOM machinery that a component-level test would otherwise require just to reach a function this directly callable. The honest treatment of Server Components is the part a generic testing prompt tends to paper over, and it matters precisely because pretending otherwise wastes real engineering time: there is no equivalent of React Testing Library's synchronous render for an async Server Component, so a testing strategy that insists on unit-testing one anyway typically ends up either mocking away everything interesting about what the component does, which proves nothing beyond \"the function didn't throw,\" or fighting the tooling to force a pattern it wasn't built for — separating the component's own data-fetching and transformation logic (genuinely unit-testable as plain functions) from its actual rendered output (better verified through integration or end-to-end testing against a real running app) gives each part a testing approach that actually tells you something true, instead of one approach stretched to cover both badly. Requiring both the success and failure paths as explicit, separately-named coverage targets closes the common gap where a Route Handler test suite exercises only the 200 response and calls the handler tested, even though the validation-failure and not-found branches live in the exact same function and are exactly as reachable by real traffic — a suite that never calls the handler with a deliberately invalid payload has not actually verified that the 400 path returns a 400 at all, it's simply never been asked to.",
    exampleOutput: `describe('POST /api/orders', () => {
  it('returns 400 with field errors on an invalid payload', async () => {
    const req = new Request('http://localhost/api/orders', { method: 'POST', body: JSON.stringify({ items: [] }) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).errors.items).toBeDefined();
  });

  it('returns 201 with the created order on a valid payload', async () => {
    const req = new Request('http://localhost/api/orders', { method: 'POST', body: JSON.stringify({ items: [{ sku: 'ABC', qty: 1 }] }) });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});

app/orders/[id]/page.tsx: category is integration/e2e, not unit-testable directly as an async Server Component. Recommend extracting getOrder(id) as its own tested function for the fetch/transform logic, and covering the actual "shows a not-found state for a deleted order" behavior with a Playwright test that navigates to a real deleted order's URL against a running instance and asserts on the rendered not-found UI.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on a Next.js 16 app with Vitest for Route Handlers and Playwright for Server Component pages.',
      },
    ],
  },
  {
    slug: 'nextjs-bundle-size-code-splitting-audit',
    category: 'nextjs',
    title:
      'Audit a page for bundle bloat before reaching for next/dynamic as a reflex fix',
    description:
      'Traces a bundle-analyzer report back to specific imports and asks whether the real fix is converting a component to a Server Component, dynamically importing it, or replacing an oversized dependency — instead of wrapping everything in next/dynamic by default.',
    promptText: `You are auditing a page's client bundle size using the output of a bundle analyzer, tracing specific large entries back to the actual import responsible, and matching each finding to the fix that's genuinely correct for its cause rather than reaching for next/dynamic as a default response to every large entry.

BUNDLE ANALYZER OUTPUT
{{bundle_analyzer_output}}

PAGE CODE
{{page_code}}

USER-FACING TIMING NEEDS
{{timing_needs}}

AUDIT RULES
For every large entry in the bundle analyzer output, trace it back to the specific import statement responsible, not just the file it appears in — a large chunk attributed to a page file is very often actually one specific import inside that file, and the fix differs completely depending on which import it is. If the large entry is a Client Component that's marked 'use client' but doesn't actually meet any of the real triggers for needing the client — no hooks, no event handlers, no browser APIs — the fix is removing the directive and letting it render as a Server Component, which removes its JavaScript from the client bundle entirely rather than deferring when that JavaScript loads; this is a different and better fix than dynamically importing something that never needed to be client-side JavaScript at all. If the large entry is a genuinely client-side dependency that's only needed for a specific, deferred interaction — a modal that opens on a rare click, a rich-text editor that's only needed once the user starts actually editing — use next/dynamic with a loading fallback to defer loading that specific chunk until the interaction that actually needs it occurs, rather than including it in the initial bundle for every visitor regardless of whether they ever trigger that interaction. If the large entry is a full library import where only one or two specific functions are actually used, check whether that library supports named, tree-shakeable imports, and whether the current import statement is written in a way that actually allows tree-shaking to work — importing from a library's barrel file (its main index re-exporting everything) can silently defeat tree-shaking even when the code only references one export, because the bundler may not be able to prove the rest of the barrel file's side effects are safe to drop, whereas importing directly from the specific submodule path usually resolves this. If the timing needs above state that a specific interaction must feel instant with no visible loading delay, do not recommend next/dynamic for the component behind that specific interaction without also addressing how its fallback state is handled, since a dynamically imported component still has to load before it can render, and an interaction that's supposed to feel instant now has a real, if brief, loading window that wasn't there when the code shipped eagerly.

OUTPUT FORMAT
A table: Bundle entry | Actual import responsible | Root cause (unnecessary client boundary, deferred-interaction candidate, un-tree-shaken library import) | Recommended fix. Close with one paragraph naming the single largest opportunity and its estimated bundle-size impact if the analyzer output includes size figures.`,
    variables: [
      {
        name: 'bundle_analyzer_output',
        description:
          'The relevant portion of the bundle analyzer report — largest chunks and what they contain.',
        example:
          "First load JS for /dashboard is 340KB. Largest contributors: a charting library (110KB) inside DashboardPage, a rich-text editor (95KB) inside a 'CommentEditor' component, and a date-utility library (40KB) imported via its default barrel export for two date-formatting functions",
        required: true,
      },
      {
        name: 'page_code',
        description: 'The page and the flagged components.',
        example:
          "app/dashboard/page.tsx, marked 'use client' at the top even though it only renders static layout and passes props down; it imports <RevenueChart> (the charting library) and <CommentEditor> (the rich-text editor, only rendered once a 'Add comment' button is clicked)",
        required: true,
      },
      {
        name: 'timing_needs',
        description: 'Any interaction that has a real requirement to feel instant.',
        example:
          "Clicking a data point on RevenueChart to drill into detail should feel instant, since it's used constantly during a live walkthrough with stakeholders; opening CommentEditor has no such requirement",
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    tags: [
      'bundle-size',
      'code-splitting',
      'next-dynamic',
      'performance',
      'tree-shaking',
      'client-components',
    ],
    whyItWorks:
      "Tracing a large bundle entry back to the specific import responsible, rather than stopping at the file it appears in, is what prevents the single most common mistake in a bundle-size fix: applying next/dynamic to an entire page file when the actual weight is concentrated in one import inside it, which either fails to help because the rest of the file still loads eagerly, or helps by accident while leaving the real, reusable lesson — which specific dependency was actually heavy — undiscovered for the next page that imports the same thing. Distinguishing an unnecessary client boundary from a genuinely client-side but deferrable dependency matters because these have completely different correct fixes: a component wrongly marked 'use client' with no real trigger for needing the browser should simply become a Server Component, which removes its JavaScript from the client bundle entirely and doesn't even show up as a chunk to defer, while a genuinely client-only dependency that's only needed for a specific interaction is exactly what next/dynamic is for — reaching for next/dynamic on the first case is a working but wasteful fix, since the code still ships to the browser, just slightly later, when it could have not needed to ship there at all. The barrel-file tree-shaking detail closes a gap that looks correct in the source code and only shows up in the bundle analyzer's actual output: importing one named function from a library's main index file can still pull in the whole barrel's contents if the bundler can't prove the unused exports have no side effects worth preserving, which means a developer who wrote what looks like a minimal, single-function import can still be shipping the entire library, and the fix — importing from the specific submodule path instead of the barrel — is invisible from reading the import statement alone unless the actual bundle output is checked. Tying the recommendation for the drill-down interaction to its explicit instant-feel requirement, rather than treating next/dynamic as a universal free win, is what stops a well-intentioned bundle-size fix from introducing a small but real and noticeable delay into exactly the interaction the business explicitly cares most about feeling fast — dynamic import genuinely defers load time, and pretending that deferral has zero cost for an interaction that's used constantly in front of stakeholders would be trading one measured problem for a different, unmeasured one.",
    exampleOutput: `Bundle entry | Import | Root cause | Fix
DashboardPage wrapper (part of the 340KB) | 'use client' on the page itself, no real trigger | Unnecessary client boundary | Remove 'use client' from the page; keep it on RevenueChart and CommentEditor only, where it's actually needed
CommentEditor (95KB) | Rich-text editor, only rendered after a button click | Deferred-interaction candidate | next/dynamic with a small loading fallback — no instant-feel requirement stated for opening it
date-utility import (40KB for 2 functions) | Barrel import (import { formatDate, parseDate } from 'date-lib') | Un-tree-shaken library import | Import from 'date-lib/format' and 'date-lib/parse' directly if the library exposes submodule paths, instead of the barrel

Largest opportunity: removing the unnecessary 'use client' from DashboardPage itself doesn't reduce RevenueChart's 110KB (it's needed, and its drill-down interaction has a stated instant-feel requirement, so it should stay eager, not dynamic), but combined with fixing the date-utility barrel import, this removes roughly 40KB+ from the initial bundle with no functional change and no new loading state to manage.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-26' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on a Next.js 16 dashboard page with an @next/bundle-analyzer report.',
      },
    ],
    relatedToolSlug: 'website-speed-test',
  },
  {
    slug: 'nextjs-app-router-feature-implementation-plan',
    category: 'nextjs',
    title: `Turn a one-line feature request into an App Router implementation plan before touching a single file`,
    description: `Produces a server/client component boundary, data-fetching strategy, and file-by-file change list for a new Next.js App Router feature, so Claude Code implements it with the right rendering model instead of guessing and defaulting everything to a client component.`,
    promptText: `You are a senior Next.js engineer planning a new feature for an existing App Router codebase before any code gets written. Your job is not to write the feature yet — it's to produce a implementation plan specific enough that writing the code afterward is mechanical, not exploratory.

FEATURE REQUEST
{{feature_request}}

RELEVANT EXISTING ROUTES / FILES
{{existing_routes}}

DATA SOURCE
{{data_source}}

RENDERING CONSTRAINT
{{rendering_constraint}}

OUT OF SCOPE
{{out_of_scope}}

PLANNING RULES
For every new or modified route segment, state explicitly whether it is a Server Component or a Client Component, and justify the choice by what the segment actually needs — interactivity, browser APIs, or hooks force Client; everything else defaults to Server. Never mark something Client Component by default just because it's simpler to reason about; that habit is exactly what produces bloated client bundles in App Router codebases, and every unnecessary 'use client' boundary drags its entire subtree of imports into the client bundle with it. Name the specific data-fetching approach per segment — a Server Component fetching directly with async/await, a Route Handler backing a client-side call, or a Server Action for a mutation — and state which one, since these are not interchangeable and picking wrong means rewriting the boundary later. Identify every place a loading.tsx, error.tsx, or Suspense boundary is needed, and say why that segment specifically needs one rather than adding boilerplate everywhere by habit. Flag any place the plan would require prop-drilling data through more than two layers of Server Components, and propose colocating the fetch closer to where it's used instead. If the feature touches an existing route, list the exact files that need to change and what changes in each one — do not describe the feature in the abstract without anchoring it to the actual file tree given.

WHAT NOT TO DO
Do not write any actual component code, JSX, or TypeScript in this pass — this is a plan only. Do not suggest a new library, framework feature, or Next.js version bump unless the stated rendering constraint genuinely cannot be met without it, and if you do suggest one, name the specific trade-off it introduces.

OUTPUT FORMAT
1. A short paragraph restating the feature in terms of what changes for the end user.
2. A table: route segment | Server or Client | why | data-fetching approach | new loading/error/Suspense boundary needed (yes/no + why).
3. A file-by-file list of exact changes for existing files, and new files to create with their paths.
4. Any prop-drilling or colocation issue found, with the fix.
5. One line confirming nothing in the plan silently expands scope beyond what was asked.`,
    variables: [
      {
        name: 'feature_request',
        description: `The feature in plain language, as it was actually requested.`,
        example: `Add a 'saved searches' panel to the /dashboard route that lets a logged-in user save their current filter combination and re-apply it later.`,
        required: true,
      },
      {
        name: 'existing_routes',
        description: `The actual route segments and files this feature touches or lives near.`,
        example: `app/dashboard/page.tsx (Server Component, fetches results server-side), app/dashboard/filters.tsx (Client Component, holds filter state in useState).`,
        required: true,
      },
      {
        name: 'data_source',
        description: `Where the data this feature reads or writes actually lives.`,
        example: `Postgres via a \`saved_searches\` table, accessed through an existing \`db\` client already used in Server Actions elsewhere in the app.`,
        required: true,
      },
      {
        name: 'rendering_constraint',
        description: `Any hosting, caching, or rendering-mode constraint the plan must respect.`,
        example: `Deployed on Vercel with the dashboard route currently using dynamic rendering (\`export const dynamic = 'force-dynamic'\`) because results are per-user.`,
        required: false,
      },
      {
        name: 'out_of_scope',
        description: `What this feature explicitly should not include, to stop the plan from scope-creeping.`,
        example: `No sharing saved searches between users, no notification when a saved search has new matching results — that's a later ticket.`,
        required: false,
      },
    ],
    targetTools: [`Claude Code (Sonnet 4.6)`],
    tags: [`nextjs`, `app-router`, `server-components`, `architecture-planning`, `claude-code`],
    whyItWorks: `Claude Code, like most coding agents, will happily start writing a component before it has decided whether that component should be a Server or Client Component, and its default under ambiguity in an App Router codebase skews toward adding 'use client' at the top of the file because that unlocks useState and event handlers without the agent having to reason about the boundary at all — this is the single most common architectural regression an unscoped feature request produces, and it silently bloats the client JS bundle by pulling every import in that subtree along with it. Forcing a route-segment-by-route-segment table with an explicit Server/Client decision and a justification means the agent has to commit to a rendering model before generation starts, which is exactly the point where the decision is cheap to get right and expensive to unwind afterward once event handlers and hooks are already threaded through a component that should have stayed on the server. Naming the specific data-fetching mechanism per segment (direct async fetch in a Server Component versus a Route Handler versus a Server Action) matters because these three have different revalidation, caching, and error-surfacing behavior in Next.js, and an agent that picks one without being asked to justify it tends to default to Route Handlers even when a direct server-side fetch would be simpler and avoid an extra network hop. The prop-drilling check catches a specific failure mode of Server Component composition: because Server Components can't hold client-side context providers to pass data down, agents often thread fetched data through multiple layers of props instead of just fetching again closer to where it's consumed, and colocating the fetch is usually cheaper than the plumbing since Next.js dedupes identical fetch calls within a single render pass automatically.`,
    exampleOutput: `Feature: adds a persistent saved-searches panel so a user's filter combination survives a page refresh and can be reapplied with one click.

| Segment | Server/Client | Why | Data fetching | Boundary needed |
|---|---|---|---|---|
| app/dashboard/saved-searches/list.tsx | Server | Read-only render of saved rows, no interactivity | Direct async fetch in the Server Component | loading.tsx yes — query can be slow on first load |
| app/dashboard/saved-searches/save-button.tsx | Client | Needs onClick + optimistic UI state | Server Action \`saveSearch()\` | none |

Files to change: app/dashboard/page.tsx (import and render the new list), new files: app/dashboard/saved-searches/list.tsx, save-button.tsx, actions.ts.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Claude Code Sonnet 4.6.`,
      },
    ],
  },
]
