import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'react-extract-custom-hook-from-tangled-logic',
    category: 'react',
    title: 'Extract a reusable hook without changing what the component does',
    description:
      'Pulls one piece of stateful logic out of a component into a properly named, typed custom hook with a minimal return contract, while treating any behavior change as a bug, not a byproduct.',
    promptText: `You are a senior React engineer extracting a single piece of stateful logic out of an existing component into a custom hook. This is a mechanical extraction, not a redesign — the component's rendered output and runtime behavior must be identical before and after the change.

COMPONENT
{{component_code}}

LOGIC TO EXTRACT
{{logic_to_extract}}

WHY THIS NEEDS TO BE A HOOK
{{pain_point}}

TARGET LANGUAGE
{{typescript_or_javascript}}

HOOK NAMING AND CONTRACT
Name the hook use<Something> based on what it does for the caller, never how it happens to be implemented internally — useDebouncedSearch, not useStateAndEffect. The hook must return a small, explicit object or tuple with named fields; nothing in the calling component should have to reach into an unrelated piece of returned state to make sense of what came back. If the hook needs configuration — a delay, an initial value, a callback — make those explicit parameters with sane defaults, not a hidden module-level constant or a context read the caller can't see or override.

DEPENDENCY-ARRAY DISCIPLINE
Preserve every effect's dependency array exactly as it is today unless you can name the specific stale-closure or missing-dependency bug the current array causes. Extraction is not license to "fix" timing nobody asked you to fix — a dependency array that changes when an effect fires is a behavior change wearing a refactor's clothes.

REUSABILITY HONESTY
If the logic depends on something specific to this one component — a particular prop name, a DOM ref only this component happens to have, a string hardcoded for this one screen — do not silently generalize it into a fake-generic parameter, and do not silently leave it hardcoded either. Leave an explicit TODO comment naming exactly what would need to become a parameter before another component could genuinely reuse this hook.

TYPE SAFETY
If the target language is TypeScript, type the hook's parameters and return value explicitly. No implicit any on the returned object, and no widening a specific union the original code relied on (a status of 'idle' | 'loading' | 'error' | 'success') into a bare string.

OUTPUT FORMAT
1. The new hook, in its own code block, with a one-line comment directly above its signature stating its contract (inputs to outputs).
2. The component's render body, updated to call the hook instead of containing the extracted logic — nothing else about the component should change, including formatting you didn't need to touch.
3. A short note listing anything deliberately left component-specific per the TODO rule, or an explicit statement that nothing was left coupled if that's genuinely true.
4. Any judgment call you had to make where these rules didn't fully cover the case, and why you made it.`,
    variables: [
      {
        name: 'component_code',
        description: 'The full component you are extracting logic from.',
        example:
          'function ProductSearch() { const [query, setQuery] = useState(""); const [results, setResults] = useState([]); useEffect(() => { const id = setTimeout(() => fetch("/api/search?q=" + query).then(r => r.json()).then(setResults), 300); return () => clearTimeout(id); }, [query]); return (/* JSX */); }',
        required: true,
      },
      {
        name: 'logic_to_extract',
        description: 'Which piece of logic should become the hook.',
        example:
          'The debounced search input state and the effect that fires the API call and stores the results.',
        required: true,
      },
      {
        name: 'pain_point',
        description:
          'Why this extraction matters right now — the concrete cost of leaving it inline.',
        example:
          'We just added a second component (TagSearch) that needs the identical debounced-fetch behavior, and copy-pasting the effect a second time is how the two will drift out of sync.',
        required: true,
      },
      {
        name: 'typescript_or_javascript',
        description: 'Which language the hook and component are written in.',
        example: 'TypeScript, strict mode enabled',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: [
      'custom-hooks',
      'refactoring',
      'react-hooks',
      'code-quality',
      'separation-of-concerns',
      'typescript',
    ],
    whyItWorks:
      "The use<Something>-by-behavior naming rule forces the model to design the hook's contract before its implementation, which is the actual difference between a genuinely reusable hook and a chunk of code that was just moved to a new file with a use prefix stapled on. Preserving the dependency array unless a specific bug is named stops a common and specific failure mode where an LLM quietly \"fixes\" a useEffect dependency array during an unrelated extraction, changing when the effect fires without being asked to — a change that passes a quick visual diff review because the extraction itself looks clean. The mandatory TODO for component-specific coupling matters because the most common lie in hook extraction is pretending something is generic when it still reads a prop only the original component has; naming that explicitly is what lets a future engineer actually reuse the hook on a second component instead of copy-pasting it, hitting a runtime error, and reverse-engineering what was actually hidden inside. The explicit TypeScript instruction closes a specific and frequent gap: models extracting a hook will often return an object typed as Record<string, unknown> or let the return type get inferred as a bare string, silently discarding a narrower union type (like a request status) the original inline code was implicitly relying on through control flow, which downstream consumers of the hook then can't rely on either. There is also a testability payoff that is easy to miss and expensive to lose: a hook with a small, explicit, named contract can be exercised directly with @testing-library/react's renderHook, asserting on returned values and calling returned setters or handlers without mounting the whole component tree the logic used to live inside, whereas the identical logic buried in a component's body can only be reached by rendering that entire component and simulating a user interaction just to hit a code path that has nothing to do with rendering at all. It also pays off in review: because the hook's inputs and outputs are now named and typed instead of implicit in a block of component logic, a reviewer looking at a future diff to just the hook can understand what changed without re-reading the whole component around it, which is the actual maintenance benefit extraction is supposed to buy and frequently does not when the \"extraction\" is really just a copy-paste with a use prefix added on top.",
    exampleOutput: `function useDebouncedSearch(delayMs = 300) {
  // Inputs: delayMs (optional). Outputs: { query, setQuery, results }.
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  useEffect(() => {
    const id = setTimeout(() => {
      fetch('/api/search?q=' + query).then(r => r.json()).then(setResults);
    }, delayMs);
    return () => clearTimeout(id);
  }, [query, delayMs]);
  return { query, setQuery, results };
}

function ProductSearch() {
  const { query, setQuery, results } = useDebouncedSearch();
  return (/* unchanged JSX */);
}

Note: no component-specific coupling found — the endpoint string is the only hardcoded piece, left as a TODO parameter (endpoint: string) since TagSearch will need a different URL.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-decompose-god-component-into-tree',
    category: 'react',
    title: 'Break a 600-line component into a maintainable tree',
    description:
      'Splits an overgrown component along its actual seams — data, layout, and interaction — instead of by line count, and flags where the split reveals a real prop-drilling or context problem instead of hiding it.',
    promptText: `You are refactoring an overgrown React component into a tree of smaller components, without changing what the user sees or how the component behaves. This is a structural refactor, not a rewrite — every piece of existing logic keeps its current behavior unless a bug is named explicitly.

COMPONENT
{{component_code}}

CURRENT RESPONSIBILITIES
{{responsibilities}}

WHY THIS NEEDS TO SPLIT NOW
{{size_context}}

SHARED STATE NOTES
{{shared_state_notes}}

DECOMPOSITION RULES
Split along actual seams, not line count or an arbitrary target size: a data-fetching concern, a piece of layout that repeats or could stand alone, a self-contained interactive widget such as a dropdown, a modal, or a form section. Every new component needs a name that describes what it renders, never "PartOne" or "Section2" or "DashboardInner". State stays as close to where it is used as possible — only lift state to a parent when two or more of the new children genuinely need to read or write it, not preemptively "in case a future feature needs it." Pass data down as typed props with names that describe the data itself, not generic names like data, config, or props. If two extracted components end up needing five or more props in common, that is a signal they should be one component, or that the shared props belong in a scoped context — say so explicitly in your output rather than silently implementing either fix without flagging it. Decide file layout by reuse boundary, not by a blanket one-component-per-file rule: a small subcomponent that is only ever rendered by its immediate parent and will never plausibly be imported elsewhere can live in the same file as that parent, while a component with a broader potential reuse boundary — even if nothing reuses it yet — should get its own file so it does not carry the parent's unrelated imports along with it.

WHAT NOT TO CHANGE
Do not rename existing event handlers, change existing prop names on components that stay intact, reformat code you did not need to touch, or introduce a new state-management library as part of this pass — that is a separate decision, not a side effect of a decomposition.

OUTPUT FORMAT
1. A one-paragraph plan: the new component tree, named, with a one-line reason for each split.
2. The extracted components, each in its own code block, with typed props.
3. The original component, now composing the new pieces and holding only the state that genuinely could not be pushed down.
4. Anything you noticed that violates the five-shared-props rule above, even if you did not act on it, plus any other coupling you spotted but left alone because fixing it was out of scope for this pass.`,
    variables: [
      {
        name: 'component_code',
        description: 'The oversized component to decompose.',
        example:
          'A 640-line AccountDashboard component that fetches account data, renders a filter bar, a stats grid, a sortable data table, and an edit-row modal, all in one file.',
        required: true,
      },
      {
        name: 'responsibilities',
        description: 'Plain-language list of what the component currently does.',
        example:
          'Fetches account data on mount, renders a filter bar with three dropdowns, renders a stats summary row, renders a sortable table with pagination, opens an edit modal per row, and handles the save request and its error state.',
        required: true,
      },
      {
        name: 'size_context',
        description:
          'What is actually forcing this split — a real cost, not "it feels big."',
        example:
          'Two engineers hit merge conflicts in this file three times last sprint because unrelated features (the filter bar and the edit modal) both touch it.',
        required: true,
      },
      {
        name: 'shared_state_notes',
        description:
          'Anything about how state currently flows that the model should know before splitting it.',
        example:
          'selectedRowId and the edit-modal open/close flag are the only two pieces of state read by more than one section; everything else is local to a single visual area.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'Claude'],
    tags: [
      'component-decomposition',
      'refactoring',
      'component-architecture',
      'code-quality',
      'maintainability',
    ],
    whyItWorks:
      'Splitting along "seams" — data-fetching, repeated layout, self-contained widgets — instead of a line-count target is what prevents the common bad outcome of a decomposition that produces several equally arbitrary chunks with no independent reason to exist, each still coupled to the others through five different props because the split never asked what actually varies independently. The rule against lifting state preemptively directly targets the most common overcorrection that follows a god-component review: once a component is flagged as "too big," the reflex is to lift everything to a shared parent to be safe, which just recreates the exact same prop-drilling problem one level higher in the tree instead of fixing it. The five-shared-props heuristic gives the model a concrete, countable trigger for "this split created a coupling problem" instead of a vague appeal to judgment, so it has to notice and report a real signal rather than silently produce one and call the job done. Explicitly forbidding renamed handlers, reformatted untouched code, and a smuggled-in state-management library keeps the diff reviewable — the single biggest reason engineers distrust an AI-generated refactor is a diff three times larger than the actual structural change, where the real edit is buried under unrelated churn a reviewer now has to comb through line by line. The file-layout guidance — co-locating a genuinely single-use subcomponent instead of mechanically giving every extracted piece its own file — targets a secondary but real cost of automated decomposition: a reviewer opening a pull request with eight new files for one component split has to context-switch eight times to understand a single change, and most of those files will only ever be imported from the one parent that was just split, so the extra file boundary buys nothing beyond navigation friction. Treating file layout as a judgment call tied to an actual reuse boundary, rather than a fixed one-file-per-component convention, keeps the decomposition proportional to what the component tree actually needs rather than to a rule that looks tidy on one PR but adds real navigation cost across dozens of components over a codebase\'s lifetime.',
    exampleOutput: `Plan: split AccountDashboard into FilterBar (filter state + controls), AccountStatsRow (pure display of summary numbers), AccountTable (sorting, pagination, row selection), and EditAccountModal (its own open/close state, receiving the selected account as a prop). Data fetching stays in AccountDashboard since only it and AccountTable need the raw list — passed down as a typed accounts: Account[] prop.

Flag: AccountTable and EditAccountModal share six props (account, onSave, onClose, isOpen, errors, isSaving) — recommend either merging them into one AccountRowEditor component, or lifting those six into a small scoped EditContext provided just above both, rather than two components wired together by a growing prop list.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-diagnose-unnecessary-rerenders-before-memo',
    category: 'react',
    title: 'Diagnose wasted re-renders before wrapping everything in memo',
    description:
      'A diagnosis-first performance audit that names the actual re-render trigger and branches its entire recommendation set on whether React Compiler is enabled, instead of reflexively prescribing useMemo, useCallback, and memo.',
    promptText: `You are auditing a React component for unnecessary re-renders. You diagnose before you prescribe — you do not wrap the component in memo, useMemo, and useCallback as a reflex response to a vague "it feels slow."

COMPONENT
{{component_code}}

PROFILING EVIDENCE
{{profiler_evidence}}

REACT COMPILER STATUS
{{react_compiler_enabled}}

OBSERVED IMPACT
{{observed_impact}}

DIAGNOSTIC STEPS
If React Compiler is enabled, most hand-written useMemo, useCallback, and memo in this file is likely redundant — flag any manual memoization the compiler already subsumes and recommend removing it rather than adding more, since redundant memoization is not free: it is extra code the compiler has to reconcile against and a place a stale dependency array can silently drift from what the compiler now assumes. If React Compiler is not enabled, identify the actual re-render trigger for each suspected problem area: a new object, array, or function literal created on every render and passed as a prop, a parent re-rendering for unrelated reasons and dragging this component along with it, or a genuinely expensive computation running on every render regardless of whether its inputs changed. Only recommend useMemo for computations you can name as expensive — not "might be slow," but the actual work: sorting a large array, running a regex over long text, building a derived object from several props. Only recommend useCallback where the function is passed to a component wrapped in memo or used as a dependency in another hook's dependency array — a useCallback with no memoized consumer downstream is nearly always dead weight, not a fix. If the real problem is architectural — state held too high in the tree, a context value that changes on every keystroke — say so plainly instead of reaching for memoization to paper over a structural issue that memoization cannot actually solve. Also check whether the re-render is actually wasteful in the first place: a component with a cheap render function re-rendering one extra time costs a fraction of a millisecond and is not automatically worth fixing just because the Profiler shows it lit up — reserve the fix for renders that do real, measurable work, not every render that merely occurred. Distinguish a re-render from a remount: if a component's key prop is changing on every parent render, React is destroying and recreating the whole subtree rather than re-rendering it in place, and no amount of memo will fix that — the actual bug lives in whatever logic is generating a new key value, not in a missing memoization call.

OUTPUT FORMAT
Produce a table with these columns: Location | Suspected issue | Root cause | Recommendation | Confidence (high, medium, or low). Follow it with a one-paragraph summary naming the single highest-impact fix, and a second short paragraph naming anything you deliberately did not recommend even though it was tempting, and why.`,
    variables: [
      {
        name: 'component_code',
        description: 'The component (and, if relevant, its direct parent) to audit.',
        example:
          'A ProductList component wrapped in React.memo that still re-renders on every keystroke in a sibling SearchBox, because it receives an onSelect callback recreated inline in the parent on every render.',
        required: true,
      },
      {
        name: 'profiler_evidence',
        description:
          'What React DevTools Profiler (or console.count, why-did-you-render) actually showed.',
        example:
          'Profiler flame graph shows ProductList re-rendering 1:1 with every SearchBox keystroke, even though ProductList props besides onSelect are unchanged between renders.',
        required: true,
      },
      {
        name: 'react_compiler_enabled',
        description:
          'Whether React Compiler is enabled in this project — changes the whole recommendation set.',
        example: 'No, project is on plain React 18 with no compiler plugin configured.',
        required: true,
      },
      {
        name: 'observed_impact',
        description: 'The real, user-facing symptom this re-render is causing, if any.',
        example:
          'Typing in the search box feels laggy on a mid-range Android device — visible input delay of roughly 150ms per keystroke.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: [
      'performance',
      'usememo',
      'usecallback',
      'react-compiler',
      'profiling',
      'rendering',
    ],
    whyItWorks:
      'React Compiler auto-memoizes components and values it can prove are safe to memoize, so once it is enabled, hand-written useMemo, useCallback, and memo calls are usually redundant, and occasionally a correctness risk if their dependency arrays drift out of sync with assumptions the compiler is now making on the same values — which is why this prompt branches its entire recommendation set on compiler status instead of giving one generic, compiler-agnostic answer. The requirement to name the actual expensive computation rather than accept "might be slow" mirrors React\'s own documented caution that memoization has a real cost — extra comparisons on every render, extra retained memory for cached values — and should never be applied speculatively as a default safety habit. The useCallback-needs-a-memoized-consumer rule targets the single most common mistake in AI-generated performance audits: recommending useCallback reflexively on every handler in a file without checking whether anything downstream is actually wrapped in memo to benefit from a stable reference, which means the useCallback call adds overhead on every render while preventing zero re-renders. Tying the diagnosis to a concrete observed_impact (a measured 150ms input lag on a specific device class) instead of an abstract "it feels slow" is what keeps the fix proportional to a real, reproducible cost instead of chasing a re-render count that has no actual user-facing consequence. Separately flagging renders that are real but harmless — a component whose render function is cheap enough that an extra pass costs a fraction of a millisecond — matters because "it re-rendered" and "it re-rendered wastefully" are different claims, and a Profiler flame graph on its own only proves the first one; treating every visible render as evidence of a problem is how a codebase ends up wrapping components that were never actually slow. The key-versus-render distinction closes a specific misdiagnosis: a component whose key prop changes on every parent render is being unmounted and remounted from scratch, not merely re-rendered, and no combination of memo, useMemo, or useCallback touches that code path at all, since none of them can prevent React from tearing down and rebuilding a subtree whose identity, per its key, has changed — the actual fix lives in whatever logic generates that key value, not in the render-optimization toolkit this prompt otherwise reaches for.',
    exampleOutput: `Location | Suspected issue | Root cause | Recommendation | Confidence
ProductList | Re-renders every keystroke | onSelect prop is a new arrow function created on every SearchBox render | Wrap onSelect in useCallback in the parent — ProductList's own memo is already correct and doesn't need touching | high
SearchBox | none flagged | — | — | —

Summary: the highest-impact fix is a single useCallback in the parent around onSelect. ProductList's React.memo is working as intended; it is being defeated by an unstable prop reference one level up, not by anything inside ProductList itself.

Deliberately not recommended: wrapping SearchBox's own input handler in useCallback — nothing consumes it as a memoized dependency, so it would add overhead with zero measurable benefit.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-design-suspense-boundaries-for-data-heavy-page',
    category: 'react',
    title: "Design Suspense boundaries that don't collapse into one big spinner",
    description:
      'Places Suspense boundaries around real independently-loading regions of a page so it reveals content progressively, instead of either waterfalling requests behind nested boundaries or blocking everything behind one top-level spinner.',
    promptText: `You are designing where Suspense boundaries go on a data-heavy page, so the page reveals content progressively instead of either waterfalling requests or blocking everything behind one top-level spinner.

PAGE
{{page_description}}

DATA DEPENDENCIES
{{data_dependencies}}

FETCHING APPROACH
{{data_fetching_approach}}

NON-CRITICAL SECTIONS
{{non_critical_sections}}

DESIGN RULES
Start every request as early as possible — as close to the route or component entry point as the fetching approach allows — even when the component that renders the result sits deep in the tree behind its own Suspense boundary. Never gate the start of a fetch behind the boundary that will display its result; that ordering is what turns Suspense into a self-inflicted waterfall. Use one Suspense boundary per independently-loading region of the UI, not one boundary per component — group things that should visually appear together and can tolerate loading together into the same boundary. Never put a slow, non-critical section such as comments, related items, or a sidebar widget in the same boundary as the primary content; an unrelated slow request should never delay what the user actually came to the page for. Name a fallback for every boundary that matches the shape of what it is replacing — a skeleton with the right layout and approximate dimensions, not a generic centered spinner — so the loading state does not cause a visible layout jump when real content arrives. Call out any place where two sibling boundaries would race in a way that produces a confusing partial layout — one section rendering above another that hasn't loaded yet in an order that looks broken rather than intentional — and resolve it by grouping them into one boundary instead of leaving the race in place. Pair every data-fetching Suspense boundary with an error boundary scoped immediately around it, not shared broadly across unrelated boundaries — a rejected promise inside a Suspense boundary propagates as a thrown error that the nearest error boundary must catch, and without one scoped to just that region, a single failed request can crash the whole page instead of degrading only its own section. Keep the key prop on a boundary's contents stable across re-renders that should not restart it — an accidentally changing key remounts the subtree and re-triggers its fallback even though the underlying data never actually became unavailable.

OUTPUT FORMAT
1. A tree diagram, text is fine, showing where each Suspense boundary sits and exactly what is inside it.
2. For each boundary: what triggers its fallback, and a description of what the fallback should look like.
3. Any request-waterfall risk you found in the original data-fetching approach and how the boundary placement avoids or fixes it.
4. Anything from the non-critical sections list you deliberately isolated into its own boundary and why grouping it with primary content would have been the wrong call.`,
    variables: [
      {
        name: 'page_description',
        description: 'What the page shows and its main sections.',
        example:
          'A creator profile page: header with avatar and follow button, a stats row, a paginated grid of posts, and a "similar creators" rail below the fold.',
        required: true,
      },
      {
        name: 'data_dependencies',
        description: 'What data the page needs and which parts depend on which.',
        example:
          'Profile header needs a fast /profile call; stats row needs a separate, usually slower /stats call; posts grid needs /posts?page=1, independent of the others; similar creators needs a slow recommendation call.',
        required: true,
      },
      {
        name: 'data_fetching_approach',
        description: 'The library or pattern used to fetch and expose data to Suspense.',
        example:
          'TanStack Query hooks with suspense: true, called from route-level loader components.',
        required: true,
      },
      {
        name: 'non_critical_sections',
        description: 'Which parts of the page are not what the user actually came for.',
        example:
          'The "similar creators" rail — nice to have, but nobody visits this page to see it.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude', 'ChatGPT'],
    tags: [
      'suspense',
      'concurrent-rendering',
      'data-fetching',
      'loading-states',
      'performance',
    ],
    whyItWorks:
      'The "start the fetch before the boundary that displays it" rule targets React\'s own documented render-as-you-fetch guidance directly: if a component only starts fetching inside its own effect or on mount, and that same component is the thing hidden by a Suspense fallback, the fetch physically cannot begin until the boundary above it has already resolved something else first — that is a self-inflicted waterfall, and it is the single most common Suspense mistake in real codebases, not a hypothetical one. Grouping boundaries by what should visually appear together, rather than one boundary per component, is the documented fix for the "popcorn" effect, where unrelated pieces of a page pop in one at a time in a distracting order nobody actually designed. Separating a slow, non-critical section like a recommendations rail into its own isolated boundary is what actually delivers the promised benefit of Suspense — a fast primary experience — instead of accidentally recreating one big spinner because the primary content and the slowest request on the page happen to share a boundary. Requiring a fallback shaped like the real content, not a generic spinner, is a direct response to a measurable UX cost: a skeleton with the wrong dimensions still causes the same layout shift a spinner does the moment real content swaps in, defeating half the point of a progressive-loading design. Pairing each Suspense boundary with its own scoped error boundary reflects a documented and easy-to-miss detail of how Suspense actually behaves: a rejected fetch inside a boundary surfaces to React as a thrown error, not as a resolved-with-error state, so without an error boundary sitting at the same scope, that single failure propagates upward until it hits whatever error boundary is nearest — often the entire page\'s root boundary — turning one section\'s network hiccup into a total page crash instead of a contained, section-level failure message. The key-stability rule addresses a specific and common regression introduced by refactors that add a Suspense boundary without auditing what feeds its key prop: a key that changes for an unrelated reason, such as a parent re-rendering with a freshly-created object identity, remounts the subtree and re-shows the fallback even though the data the component already had was still perfectly valid, manufacturing a flash of loading state a user never should have seen.',
    exampleOutput: `<ProfilePage>
  <Suspense fallback={<HeaderSkeleton />}>        header + stats, fetch started at route entry
    <ProfileHeader />
    <StatsRow />
  </Suspense>
  <Suspense fallback={<PostsGridSkeleton />}>     independent, can resolve before or after header
    <PostsGrid page={1} />
  </Suspense>
  <Suspense fallback={<SimilarCreatorsSkeleton />}> slow recommendation call, isolated so it never blocks the above
    <SimilarCreators />
  </Suspense>
</ProfilePage>

Waterfall risk: header and stats were originally two separate effects, each starting its fetch inside its own component — moved to start both at route entry instead, merged into one boundary since they are requested together and always appear together, avoiding a two-step pop-in for content that reads as one visual unit.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code and Claude on Sonnet 4.6 with TanStack Query.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-migrate-form-to-react-19-actions',
    category: 'react',
    title: "Convert a form's manual state juggling to React 19 Actions",
    description:
      'Migrates an onSubmit-plus-useState form to useActionState, useFormStatus, and useOptimistic only where each genuinely earns its place, instead of hand-rolled pending and error booleans.',
    promptText: `You are migrating a React form from manual onSubmit plus useState plumbing to React 19's Actions APIs — the form action prop, useActionState, useFormStatus, and useOptimistic where it genuinely helps and not by default.

CURRENT FORM
{{form_code}}

VALIDATION RULES
{{validation_rules}}

SUBMIT BEHAVIOR
{{submit_behavior}}

OPTIMISTIC UI NEED
{{needs_optimistic_ui}}

MIGRATION RULES
Replace the manual isSubmitting, error, and success useState trio with useActionState wrapping a single async action function that performs both the validation and the submission. The action function must return a typed result object — for example { error: string | null } or a field-level error map — and must never throw past the action boundary for expected validation failures; only genuinely unexpected errors (a thrown network exception, a programming bug) should propagate as a thrown error. Use useFormStatus inside a child submit-button component, never inside the same component that renders the form tag itself — useFormStatus only reads pending status from the nearest parent form when it is called from a descendant of that form, and it silently returns default, non-pending values when called anywhere else, which looks like it works in a quick manual test and then never shows a pending state once shipped. Only add useOptimistic if the interface needs to show the result of an action before the server has confirmed it — a new message appearing instantly in a list, a like count incrementing before the request resolves. Do not add it just because it is available; most forms should simply wait for the real result and show a pending state instead. Keep client-side validation for instant per-field feedback while typing, but treat the action's own validation as the actual source of truth — the two must never be allowed to disagree, so if a rule exists client-side, the same rule must exist inside the action function too. If the form is rendered on the server and the action is passed directly to the form element's own action prop rather than triggered from an onClick handler, this preserves basic progressive enhancement — the form can still submit as a real HTTP request even if JavaScript has not finished hydrating yet — so avoid manually calling preventDefault or intercepting the submit event in a way that would defeat that; let the form's action prop own the submission. After a successful action that should clear the form, trigger the reset from the action's own returned state — for example by changing a key on the form or calling a ref's reset method in response to the new state — rather than manually clearing individual field values one at a time, which is easy to leave out of sync with whatever fields the form actually has.

OUTPUT FORMAT
1. The migrated form component and its separate submit-button child component, each in its own code block.
2. The action function, with its return type made fully explicit.
3. A short note on which useState calls were removed and precisely what replaced each one.
4. If useOptimistic was not added, one sentence confirming why it was correctly left out given the stated need.`,
    variables: [
      {
        name: 'form_code',
        description: 'The current form component using onSubmit and manual useState.',
        example:
          'A NewsletterSignup form with useState for email, isSubmitting, and error, an onSubmit handler that calls preventDefault, sets isSubmitting, awaits a fetch, and sets error or clears the field on success.',
        required: true,
      },
      {
        name: 'validation_rules',
        description: 'What must be true for the submission to succeed.',
        example:
          'Email must be non-empty and match a basic email pattern; must not already be subscribed.',
        required: true,
      },
      {
        name: 'submit_behavior',
        description: 'What happens on success and on failure.',
        example:
          'On success, clear the field and show a confirmation message inline for five seconds; on failure, show the server error message next to the field without clearing what was typed.',
        required: true,
      },
      {
        name: 'needs_optimistic_ui',
        description:
          'Whether the interface should show a result before the server confirms it, and what.',
        example:
          'No — this is a low-frequency signup form, waiting a second for a real confirmation is fine.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: [
      'react-19',
      'actions',
      'forms',
      'useactionstate',
      'useoptimistic',
      'useformstatus',
    ],
    whyItWorks:
      "The child-component rule for useFormStatus is load-bearing, not stylistic: React's own documentation is explicit that useFormStatus must be called from a component rendered inside the form, and calling it in the same component that renders the form tag itself returns the default, always-false pending state — a bug that passes a quick manual click-test because the developer usually tests the happy path once, and then silently never shows a pending state in production under real network latency. Collapsing three separate useState calls into one useActionState call removes an entire class of bug where isSubmitting, error, and the actual in-flight request drift out of sync — a fetch that resolves after a component has already re-rendered for an unrelated reason, for instance — because the pending state now comes directly from the transition React itself is tracking, not from a boolean a developer has to remember to flip back in every code path, including the error path that's easy to forget. Restricting useOptimistic to cases where the interface genuinely renders a result before confirmation stops the common mistake of adding it to a form where nothing is actually shown optimistically, which adds real indirection — a second, temporary state to reason about — for zero visible benefit, and the requirement to justify not using it forces that judgment call to be explicit rather than defaulted into either direction. The progressive-enhancement note is not a theoretical nicety: React 19's form action prop is specifically designed so a submission can proceed as a real HTTP navigation before hydration completes, a meaningfully different guarantee than the onSubmit-plus-preventDefault pattern it replaces, and a migration that keeps an onClick handler intercepting the submit defeats that guarantee silently, leaving the app no better off on a slow connection than before the migration despite now using the newer API. Triggering the post-success reset from the action's own returned state, rather than manually clearing each field, matters because a hand-maintained reset list drifts the same way a hand-maintained validation list does — a field added to the form later is easy to forget adding to the reset call, and the resulting bug, a stale value lingering after a supposedly successful and cleared submission, is exactly the kind of thing that only surfaces when a real user reports it, not during a quick manual test of the one field the developer happened to check.",
    exampleOutput: `async function subscribeAction(prevState, formData) {
  const email = formData.get('email');
  if (!email || !/^[^@]+@[^@]+\\.[^@]+$/.test(String(email))) {
    return { error: 'Enter a valid email address.' };
  }
  const res = await fetch('/api/subscribe', { method: 'POST', body: formData });
  if (!res.ok) return { error: 'Something went wrong — try again.' };
  return { error: null };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Subscribing…' : 'Subscribe'}</button>;
}

Removed: isSubmitting, replaced by useFormStatus's pending, read only inside SubmitButton. error, replaced by useActionState's returned state.error. success, replaced by checking state.error === null after a submission has actually occurred.

useOptimistic correctly omitted: this form has no list or counter to update ahead of confirmation — there is nothing to show optimistically.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on React 19.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-accessibility-audit-for-component',
    category: 'react',
    title: 'Run an accessibility audit on a component before it ships',
    description:
      'A component-level a11y audit that checks role-specific WCAG success criteria against the actual JSX, not a generic "add aria-label everywhere" pass, and states plainly what static code review cannot verify.',
    promptText: `You are auditing a single React component for accessibility issues that would actually fail a screen-reader or keyboard-only user, not producing a generic checklist that would apply equally to any component.

COMPONENT
{{component_code}}

COMPONENT TYPE
{{component_type}}

TARGET CONFORMANCE LEVEL
{{wcag_level}}

KNOWN USER REPORTS
{{known_user_reports}}

AUDIT FOCUS
For this specific component type, check the following, and only flag issues that actually apply to what this component is: keyboard operability — can every interactive element be reached and operated with Tab, Shift+Tab, Enter, Space, Escape, and arrow keys as appropriate for its role, with no keyboard trap that leaves focus stuck inside. Focus management — if this is a modal, menu, or disclosure, does focus move to the correct place on open and return to the trigger element on close. Semantics — does it use the correct native element or ARIA role for what it actually is, rather than a styled div with an onClick handler standing in for a button or a link. Name and state exposed to assistive technology — does every control have an accessible name, and do state changes such as expanded, collapsed, selected, or invalid get exposed through ARIA attributes and not only through a visual change. Color and motion — is any information conveyed by color alone, and does any animation respect prefers-reduced-motion. Touch and zoom — for any component likely to be used on a touch device, are interactive targets at least roughly 24 by 24 CSS pixels per WCAG's target-size guidance, and does the layout stay usable rather than clipping or overlapping when the page is zoomed or text is resized up to 200%.

SEVERITY CALIBRATION
Calibrate blocker versus major versus minor by actual user impact, not by how technically precise the WCAG citation sounds. An issue that makes the component completely unusable for a group of users — no way to open it at all via keyboard — is a blocker. An issue that makes it usable but noticeably harder, such as a confusing but not-impossible focus order, is major. An issue that is a real deviation from best practice but causes no concrete failure for any user, such as a redundant ARIA attribute that does not contradict the visual state, is minor. Do not inflate a finding to blocker to seem thorough, and do not downgrade a real keyboard trap to minor just because its fix happens to be a single line — severity reflects user impact, not fix effort.

OUTPUT FORMAT
Produce a table with these columns: Issue | WCAG criterion, cited by number and name | Who it affects | Severity — blocker, major, or minor | Fix. After the table, list which issues you could not fully assess from static code alone — real rendered color-contrast values, actual screen-reader announcement order, real focus-visible styling — and name the specific manual check that would confirm each one. Do not silently skip this section even if everything else looked clean.`,
    variables: [
      {
        name: 'component_code',
        description: 'The full component to audit.',
        example:
          'A custom Dropdown component built from a styled div with an onClick handler, an absolutely positioned list of divs for options, and no keyboard handling of any kind.',
        required: true,
      },
      {
        name: 'component_type',
        description:
          'What kind of UI element this is — sets which failure modes actually matter.',
        example: 'combobox / custom select dropdown',
        required: true,
      },
      {
        name: 'wcag_level',
        description: 'The target conformance level, if different from the default AA.',
        example: 'AA',
        required: false,
      },
      {
        name: 'known_user_reports',
        description:
          'Any real complaints or bug reports about this component, if there are any.',
        example:
          'A support ticket says a screen-reader user could not tell which option was currently selected.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Claude', 'ChatGPT', 'GitHub Copilot Chat'],
    tags: ['accessibility', 'a11y', 'wcag', 'aria', 'keyboard-navigation'],
    whyItWorks:
      'Grounding the audit in component_type is what makes the checklist specific instead of generic: a modal\'s real failure modes — a focus trap on open, Escape closing it, focus returning to the trigger — are entirely different from a combobox\'s — arrow-key navigation between options, aria-activedescendant tracking the highlighted item, aria-expanded reflecting open state — and a plain "check accessibility" prompt tends to default to boilerplate aria-label suggestions regardless of what the component actually is, because it has no signal for which failure modes are even relevant here. Citing real WCAG success-criterion numbers keeps every finding falsifiable: a reviewer can look up 2.1.1 Keyboard or 4.1.2 Name, Role, Value and confirm or reject the specific finding, instead of being handed an unverifiable "this might be an issue" that either gets rubber-stamped or ignored. The explicit instruction to name what cannot be assessed from static code alone matters because color contrast against a real rendered background, and actual screen-reader announcement order through a specific screen reader and browser combination, are things a code review genuinely cannot verify from source alone — naming that boundary honestly is what stops the model from confidently asserting a pass or fail it is not actually in a position to make, and gives the reviewer a concrete next action instead of false confidence. The severity-calibration rule matters because severity is the field a rushed review actually acts on — a team triaging a long finding list will fix every blocker and often defer everything else, so a model that inflates minor cosmetic deviations to blocker status to look thorough gets exactly the wrong items fixed first, while one that downgrades a real keyboard trap because the code fix happens to be a single line leaves the actual highest-impact issue sitting in a backlog labeled low-priority. Including touch-target size and reflow-under-zoom as their own explicit checks closes a common gap in audits that quietly treat accessibility as synonymous with screen-reader support: WCAG\'s target-size and reflow criteria exist specifically for users with limited fine motor control or low vision who never touch a screen reader at all, and a component that passes every keyboard and ARIA check can still fail these users badly if its click targets are a few pixels across or its layout breaks at 200% zoom, a failure mode a screen-reader-only mental model of accessibility will never catch.',
    exampleOutput: `Issue | WCAG criterion | Who it affects | Severity | Fix
Div used as trigger, no role or keyboard support | 2.1.1 Keyboard, 4.1.2 Name/Role/Value | Keyboard and screen-reader users | blocker | Use a real button element with aria-haspopup="listbox" and aria-expanded
No focus moves into the option list on open | 2.4.3 Focus Order | Keyboard and screen-reader users | blocker | Move focus to the first option or the listbox itself on open, return focus to the trigger on close
Selected option shown only via a checkmark icon | 1.4.1 Use of Color | Low-vision users | major | Add aria-selected and a text or shape cue, not color alone

Not assessable from code alone: actual contrast ratio of the checkmark icon against its background — confirm with a contrast checker on the rendered page. Actual screen-reader announcement of the selected state — confirm by testing with VoiceOver or NVDA against the fix above.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1) against WCAG 2.2 AA.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-choose-state-home-lift-context-or-store',
    category: 'react',
    title: 'Decide whether this state needs lifting, context, or an external store',
    description:
      'A decision-framework prompt that picks the right home for a specific piece of shared state based on update frequency, consumer spread, and persistence needs, instead of defaulting to context for everything.',
    promptText: `You are deciding where one specific piece of state should live in a React app — lifted to a common parent, placed in Context, or moved into an external store such as Zustand, Jotai, or Redux Toolkit — based on how it is actually used, not by default habit or whatever the last piece of state used.

STATE
{{state_description}}

COMPONENT TREE
{{component_tree_shape}}

UPDATE FREQUENCY
{{update_frequency}}

PERSISTENCE REQUIREMENT
{{persistence_requirement}}

DECISION FRAMEWORK
Before applying any rule below, check whether this state actually belongs in the URL rather than in any in-tree home at all — a filter, a selected tab, a search query, or anything else the user would expect to survive a page refresh or be shareable via a link is arguably not component state, Context state, or store state, but a URL search parameter or route segment, and forcing it into one of the three in-tree homes when a link should have captured it is a UX regression dressed up as an architecture decision. If the URL genuinely does not apply, walk through these in order and stop at the first rule that applies, rather than evaluating all of them and picking your favorite. First, if only one component and its direct children need this state, lift it to their nearest common parent — do not reach for Context for a two-level prop pass just because Context exists. Second, if many components across distant branches of the tree need to read the state, but it changes rarely — a theme, the current user, feature flags — Context is appropriate, but split it into its own provider rather than bundling it with other, more frequently-changing state inside the same context value. Third, if the state changes frequently — on every keystroke, every scroll event, every animation frame — and is read by components that should not re-render on every single change, Context is the wrong tool regardless of how rarely it changes elsewhere in the app: every consumer of a context re-renders on every value change, regardless of which slice of that value the particular consumer actually reads. Use an external store with selector-based subscriptions instead. Fourth, if the state needs to persist across route changes, survive a full remount, or be read from outside the React tree entirely — analytics code, a service worker — it belongs in an external store, not component state or Context, regardless of how few components currently read it.

OUTPUT FORMAT
1. Which rule applied and why, in one paragraph, including which earlier rules you checked and ruled out first.
2. The recommended approach with a short code sketch, not a full implementation, showing the actual shape of the solution.
3. What would change your answer — the specific condition that would push this recommendation to a different tier if it later turned out to be untrue.`,
    variables: [
      {
        name: 'state_description',
        description: 'What the state represents.',
        example:
          'The current selected rows in a large data table, used for bulk actions.',
        required: true,
      },
      {
        name: 'component_tree_shape',
        description: 'Where the state currently lives and which components need it.',
        example:
          'DataTable owns it today; a BulkActionsBar sibling and a SelectionCount badge in a totally separate header component both need to read it.',
        required: true,
      },
      {
        name: 'update_frequency',
        description: 'How often the state actually changes.',
        example:
          'Changes on every row checkbox click — could be dozens of times per session, but never per keystroke or per animation frame.',
        required: true,
      },
      {
        name: 'persistence_requirement',
        description:
          'Whether this state needs to survive a route change, remount, or be read outside React.',
        example:
          'No — selection should reset the moment the user navigates away from this table.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT', 'Claude'],
    tags: [
      'state-management',
      'react-context',
      'zustand',
      'architecture',
      'decision-framework',
    ],
    whyItWorks:
      "The re-render mechanic cited in the third rule is a real, documented React behavior, not folklore: every component that calls useContext on a given context re-renders whenever that context's Provider value changes, regardless of which slice of the value that particular consumer actually reads — there is no built-in selector mechanism in Context itself — which is exactly why high-frequency state in Context becomes a measurable performance problem while low-frequency state in Context, like a theme or the current user, is genuinely fine and does not need an external store at all. Structuring the answer as an ordered list with an explicit stop condition prevents the most common failure mode for this exact class of question: an LLM listing all three options with generic pros and cons for each and never actually committing to one for the specific case in front of it, which reads as thorough but leaves the real decision right back with the person who asked. Requiring persistence and out-of-React access as their own separate, later-checked rule matters because these needs can exist even when update frequency and consumer spread would otherwise both say Context is fine — a rarely-changing piece of state that nonetheless needs to survive a full page remount is still wrong for Context, since Context state lives inside the React tree and disappears when that tree unmounts. Asking for \"what would change your answer\" forces the recommendation to name its own falsification condition, turning an architectural opinion into something a reviewer can actually check against reality months later instead of an unfalsifiable preference. Naming the URL as a candidate home before evaluating lift, Context, or a store closes a gap most state-placement frameworks skip entirely: a piece of state that determines what the user sees but is not reflected in the URL cannot be shared via a link, cannot survive a refresh, and breaks the browser's own back-button expectation, and no amount of getting the Context-versus-store decision right fixes any of that, because the underlying problem was never really where the state lives in React's tree — it is that the state was modeled as React state at all instead of as navigation state the router already manages.",
    exampleOutput: `Rule 2 applies: SelectionCount and BulkActionsBar sit in distant branches, and the state changes only on checkbox clicks (dozens of times per session), not on every keystroke or animation frame, so rule 3's re-render concern doesn't bite here. Persistence isn't required either, so rule 4 doesn't apply. A scoped SelectionContext — not an app-wide context — provided just above DataTable, BulkActionsBar, and SelectionCount is the right fit.

const SelectionContext = createContext<{ selected: Set<string>; toggle: (id: string) => void } | null>(null);
// Provider wraps only the DataTable + BulkActionsBar + SelectionCount subtree, not the whole app.

What would change this: if the table grows to thousands of rows with per-row visual state tied to selection — every row re-rendering on any selection change becomes visibly janky — move to a Zustand store with a per-row selector instead, since that's rule 3's condition arriving late.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-write-behavior-driven-testing-library-tests',
    category: 'react',
    title: 'Write component tests that check behavior, not implementation details',
    description:
      'Generates React Testing Library tests driven by accessible queries and user-visible behavior, with a guard against testing internal state, CSS classes, or props directly.',
    promptText: `You are writing tests for a React component using React Testing Library and {{test_runner}}. You test what a user can see and do, never internal state, prop values, or implementation details a user has no way to observe.

COMPONENT
{{component_code}}

KEY INTERACTIONS TO COVER
{{key_interactions}}

MOCKING BOUNDARY
{{mocking_boundary}}

TESTING RULES
Query elements the way a real user would find them: getByRole, getByLabelText, getByText, in that rough order of preference. Only fall back to a test-id when there is genuinely no accessible way to find the element, and say so explicitly in a comment at that exact line when you do, since a test-id fallback is often a signal of a real accessibility gap in the component, not just a testing inconvenience. Never query or assert on component internal state, prop values, or CSS class names directly — if a behavior is worth testing, it is worth testing through what actually renders on screen or what happens when a user interacts with it. Use userEvent, not fireEvent, for every interaction, and always await it — userEvent's interaction methods are asynchronous by design to accurately simulate real browser event timing, and a missing await is the single most common cause of an intermittent, hard-to-reproduce flaky test in this exact stack. Write one test per meaningful behavior listed in the key interactions, named as a plain sentence describing the behavior — "shows an error when the field is left empty" — never as "test 1" or "renders correctly." Where the component does something conditionally, write both the positive case and the negative case explicitly; never test only the happy path and assume the conditional branch is covered by implication. Mock only at the exact boundary named above — a network call, a store — never by reaching into the component's internals to fake a piece of its own state. Avoid an arbitrary waitFor with a fixed timeout as a substitute for waiting on the actual condition that matters — prefer an assertion inside waitFor, or a query variant like findByRole, that resolves the moment the real DOM state changes, rather than a bare delay that either flakes on a slow CI machine or wastes time waiting past when the assertion could already have passed. When a test needs to wait for an element to disappear, use waitForElementToBeRemoved rather than polling queryBy* in a hand-written loop.

OUTPUT FORMAT
A complete test file, imports included, written for {{test_runner}}. Group related tests with describe blocks named after the feature being tested, not after the component's file name. If any test-id fallback was needed, list it separately at the end as a flagged accessibility gap worth fixing in the component itself.`,
    variables: [
      {
        name: 'component_code',
        description: 'The component to test.',
        example:
          'A SearchableList component with a text input that filters a list of items client-side, and a "Clear" button.',
        required: true,
      },
      {
        name: 'key_interactions',
        description: 'The specific behaviors that must be covered.',
        example:
          'Typing in the search box filters the visible list to matching items; clicking Clear resets the input and shows the full list; typing something with no matches shows a "No results" message.',
        required: true,
      },
      {
        name: 'mocking_boundary',
        description:
          'Exactly what should be mocked, and how, if the component depends on anything external.',
        example:
          'Items are passed in as a prop in these tests — no network mocking needed for this component.',
        required: true,
      },
      {
        name: 'test_runner',
        description: 'The test runner or framework in use.',
        example: 'Vitest',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: ['testing', 'react-testing-library', 'vitest', 'user-events', 'test-quality'],
    whyItWorks:
      "The query-by-role-first rule operationalizes Testing Library's own guiding principle — tests should resemble how a real user interacts with the app — and it doubles as an incidental accessibility check: if an element genuinely cannot be found by getByRole or getByLabelText, that is frequently a real a11y gap the component itself should fix, not just a testing inconvenience to route around silently with a test-id, which is exactly why the fallback has to be flagged rather than used quietly. The mandatory await on every userEvent call targets a specific, well-documented bug class: Testing Library's userEvent methods return promises to accurately simulate real browser event timing rather than firing events synchronously, and a missing await is Testing Library's own most commonly cited cause of intermittent, hard-to-reproduce test failures that pass locally and fail in CI under different timing. Requiring both the positive and negative case for every conditional behavior closes the specific gap where an LLM writes a technically-passing test suite that only ever exercises the happy path and never actually proves the \"No results\" message appears when it should — a suite that looks complete by line count while leaving the exact branch most likely to regress silently untested. The preference for findByRole and condition-based waitFor over a fixed-duration wait targets a second, distinct source of test flakiness beyond the missing-await problem: a hardcoded delay is either too short, and fails intermittently on a loaded CI runner, or too long, and silently slows the whole suite down while adding no confidence, whereas a condition-based wait resolves the instant the actual DOM state it checks for becomes true, which is both faster on a fast machine and more reliable on a slow one. Naming waitForElementToBeRemoved specifically, rather than leaving removal-testing to whichever polling pattern the model reaches for, matters because a naive queryBy*-in-a-loop implementation is exactly the kind of test-of-the-test code Testing Library already solved with a dedicated utility — reinventing it inline adds surface area for a subtly wrong loop condition to hide in, for no benefit over calling the function that already exists for precisely this case.",
    exampleOutput: `describe('filtering the list', () => {
  it('shows only matching items when typing in the search box', async () => {
    const user = userEvent.setup();
    render(<SearchableList items={['Apple', 'Banana', 'Cherry']} />);
    await user.type(screen.getByRole('textbox', { name: /search/i }), 'ban');
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows a "No results" message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<SearchableList items={['Apple', 'Banana']} />);
    await user.type(screen.getByRole('textbox', { name: /search/i }), 'zzz');
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });
});

No test-id fallback needed — every element in this component was reachable via getByRole or getByLabelText.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 using React Testing Library 16 and Vitest 3.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-fix-prop-drilling-before-reaching-for-redux',
    category: 'react',
    title: 'Fix prop drilling without reaching for Redux as the first move',
    description:
      'Fixes a prop-drilling chain with composition or a narrowly-scoped context first, and only escalates to an external store if the data is needed outside the subtree or updates too frequently for context.',
    promptText: `You are fixing a prop-drilling problem in a React component tree. You try composition first, then a narrowly-scoped context, and only recommend an external store if neither one actually solves the real problem in front of you.

COMPONENT TREE
{{component_tree_code}}

DRILLED PROPS
{{drilled_props}}

NEEDED OUTSIDE THIS SUBTREE
{{cross_subtree_needed}}

UPDATE FREQUENCY
{{update_frequency}}

FIX ORDER
Check first whether the intermediate components that just forward the props even need to know about them at all — if a middle component only passes the drilled props through without reading any of them, consider passing the already-composed JSX down instead, as children or a render prop, so the data goes directly from the top to where it is actually used and the middle component's own prop list shrinks to nearly nothing. If composition does not fit because the intermediate components genuinely branch on the data — real conditional rendering based on it, not just passing it along untouched — create a context scoped to just this subtree, not a new top-level app-wide context, and provide it at the lowest common ancestor that actually has the data. Only recommend an external store if the same data is also needed outside this subtree per the cross-subtree requirement above, or if the update frequency makes context genuinely problematic because every consumer of a context re-renders on every value change regardless of which part of that value it reads. Do not default to "just use Redux" or "just use Zustand" as a first response — that is a deliberate escalation with a real cost in added dependency and indirection, applied only once the first two options have been checked and ruled out for a stated reason. When a scoped context ends up being the right fit, wrap its useContext call in a small custom hook that throws a clear error if used outside the provider, rather than having every consuming component call the raw useContext(SomeContext) directly and silently receive undefined if the provider is missing somewhere up the tree. Do not fix prop drilling by bundling several unrelated props into one options or config object passed down instead — that changes the drilling's shape without reducing it, and it actively hides which individual pieces of data each intermediate component or the final consumer actually needs.

OUTPUT FORMAT
1. Which fix you applied and, explicitly, why each earlier option in the fix order did not fit — do not skip straight to the answer without showing the elimination.
2. The updated component tree with the fix applied, as real code.
3. The props list for each affected component, shown before and after — the actual point of the exercise is a visibly shorter list, and if it isn't visibly shorter, say why.`,
    variables: [
      {
        name: 'component_tree_code',
        description: 'The component tree showing the props being passed through.',
        example:
          'Layout receives user, theme, and onUpdateUser as props and passes all three to Sidebar, which passes all three to Panel, which passes all three to Widget, the only component that actually reads onUpdateUser and theme.',
        required: true,
      },
      {
        name: 'drilled_props',
        description: 'The specific props being passed through multiple layers.',
        example:
          'user, theme, onUpdateUser — passed through Layout, Sidebar, Panel, down to Widget.',
        required: true,
      },
      {
        name: 'cross_subtree_needed',
        description:
          'Whether the same data is also needed by anything outside this component tree.',
        example:
          'No — user and theme are read elsewhere in the app, but through a separate top-level AuthContext already; this drilling is purely internal to the Layout subtree.',
        required: true,
      },
      {
        name: 'update_frequency',
        description: 'How often the drilled data actually changes.',
        example:
          'theme changes a handful of times per session at most; user rarely changes at all during a session.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT'],
    tags: [
      'prop-drilling',
      'component-composition',
      'react-context',
      'refactoring',
      'state-management',
    ],
    whyItWorks:
      "Passing already-composed children through the tree is React's own documented alternative to Context for the specific case where intermediate components don't need to read the drilled data, only pass it along — a component that receives finished JSX as a prop doesn't need to know the shape of user or theme at all, which shrinks the middle components' prop lists to essentially nothing rather than just relocating the same prop names into a useContext call one layer down. Scoping the fallback context to the exact subtree that needs it, instead of hoisting it into a new top-level provider, keeps the fix proportional to the actual problem and avoids widening the re-render blast radius to parts of the app that never had this issue in the first place. Making \"try composition, then scoped context, then a store\" an explicit sequence with a stated rule against defaulting to a store directly targets the most common overreaction in exactly this prompt category: reaching for the heaviest available tool as the first answer to a problem composition alone would have fixed for free, which is how small apps accumulate a state-management dependency and a mental-model tax that a two-line children prop would have avoided entirely. Wrapping the scoped context's useContext call in a dedicated hook that throws on a missing provider is the same defensive pattern that makes any context genuinely safe to consume: without it, a component that calls useContext outside its provider gets undefined silently, and the resulting bug — a crash on the first property access, or a mysteriously blank render — surfaces far from the actual mistake, which was forgetting to wrap a route or a test in the provider, not anything in the component that crashed. Flagging the bundle-everything-into-one-object move as a non-fix matters because it is the single most common way prop drilling gets \"solved\" without actually being solved: the prop count at each layer drops to one, which looks like success in a shallow before-and-after comparison, but every intermediate component still has to know the bundled object's shape to pass it through, and the actual coupling the fix order exists to reduce — components depending on data they don't use — is completely unchanged underneath the cosmetic prop-count improvement.",
    exampleOutput: `Fix applied: composition. Sidebar and Panel never read user, theme, or onUpdateUser — they only forwarded them — so Layout now renders Widget directly, passed as pre-composed children through Sidebar and Panel: <Sidebar><Panel><Widget user={user} theme={theme} onUpdateUser={onUpdateUser} /></Panel></Sidebar>.

Composition fit because neither intermediate component branches on the drilled values; context wasn't needed at all, and a store was never on the table since the data isn't needed outside this subtree and barely changes.

Props before: Sidebar(user, theme, onUpdateUser, children?), Panel(user, theme, onUpdateUser, children?).
Props after: Sidebar(children), Panel(children) — both down to a single prop.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-design-component-api-for-design-system',
    category: 'react',
    title: "Design a component API that won't need a breaking change in six months",
    description:
      "Designs a design-system component's public prop contract by working backward from real use cases, with explicit composition slots instead of a new boolean prop for every variant, and a written out-of-scope list.",
    promptText: `You are designing the public prop API for a design-system component, before implementation. The goal is an API that covers the real use cases below without a boolean-prop explosion, and without a breaking change the moment the next legitimate use case shows up.

COMPONENT NAME
{{component_name}}

USE CASES
{{use_cases}}

CONSTRAINTS
{{design_constraints}}

EXISTING SIMILAR COMPONENTS
{{existing_similar_components}}

API DESIGN RULES
Start from the use cases, not from a guess at every possible variant someone might want someday. Every prop you propose must trace back to at least one listed use case; if you cannot name which use case a prop serves, drop the prop. Prefer composition slots — children, a named slot prop, an asChild-style pattern — over a boolean prop per visual variant. If you are about to propose a fourth boolean like isCompact, isCentered, or isBordered on the same component, stop and ask whether a variant prop with a closed set of string values, or a composition slot, actually fits better; three or more independent booleans on one component is the concrete signal that the API has stopped being designed and started being accreted. Every prop needs a default that makes the component usable with zero configuration for the single most common use case in the list. Name props for what they mean to the person using the component, not for the CSS or implementation detail behind them — status, not colorScheme, when the actual intent being expressed is semantic, not decorative. Explicitly list what this component will deliberately not support — the use cases you are choosing not to design for right now — so that scope creep in a future review has something concrete to push against instead of an unstated assumption. Where the component wraps or extends a native HTML element, do not repurpose a native attribute name for a different meaning than it has natively — a prop called disabled should behave like the native disabled attribute a consumer already knows, not toggle some unrelated visual state, since reusing a familiar name for a different contract is a worse trap than inventing an unfamiliar one. Decide upfront, and state explicitly, which native HTML attributes and event handlers pass through untouched to the underlying element versus which ones this component intercepts or overrides — a consumer reaching for a standard prop like onClick or aria-label needs to know, without reading the implementation, whether it will reach the DOM node directly or get intercepted by internal logic first.

OUTPUT FORMAT
1. The prop table: name, type, default, and which specific use case it serves.
2. A short usage example for the three most common use cases from the list, as real code.
3. The explicit out-of-scope list, with one line on why each item was deliberately excluded rather than just forgotten.`,
    variables: [
      {
        name: 'component_name',
        description: 'The component being designed.',
        example: 'Banner',
        required: true,
      },
      {
        name: 'use_cases',
        description: 'The concrete scenarios this component must support.',
        example:
          '1) An info banner at the top of a page. 2) A dismissible warning banner inline in a form. 3) An error banner with a retry action. 4) A success confirmation that auto-dismisses after a few seconds.',
        required: true,
      },
      {
        name: 'design_constraints',
        description: 'Hard constraints the API must respect.',
        example:
          'Must not depend on a specific styling library beyond CSS variables already defined in the design tokens; must work inside a form without stealing focus; must support RTL layouts.',
        required: true,
      },
      {
        name: 'existing_similar_components',
        description:
          'Anything already in the design system this new component needs to stay distinct from.',
        example:
          'A separate Toast component already handles transient, corner-positioned notifications — Banner is only for inline, in-flow content.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Claude', 'ChatGPT', 'Figma'],
    tags: [
      'design-systems',
      'component-api',
      'component-composition',
      'prop-design',
      'ui-architecture',
    ],
    whyItWorks:
      'Boolean-prop explosion is the single most common way a design-system component\'s API rots over time — isCompact plus isCentered plus isBordered eventually produce combinations nobody ever actually tested and some that aren\'t even valid together — so giving the model a concrete, countable trigger ("about to write a fourth boolean, stop") is measurably more effective than a vague instruction to "keep the API simple," which every design system already claims to want and few actually achieve in practice. Requiring every prop to trace back to a specific listed use case is what actually prevents speculative generality: the temptation to add a prop for a use case nobody has asked for yet is exactly how component APIs accumulate surface area that no consumer uses but every maintainer still has to support, test, and document forever. The explicit out-of-scope list matters specifically because a design-system component is a shared contract other teams build against without talking to the person who designed it — writing down what it deliberately does not support is the concrete artifact that lets a reviewer six months later say "that\'s a genuinely new use case, it needs its own design review" instead of quietly bolting another prop onto an already-overloaded component because the original scope was never actually written down anywhere. Forbidding a repurposed native attribute name targets a trap that is worse than an unfamiliar API, not merely annoying: a consumer who already knows what disabled means on a native button will apply that exact mental model to a design-system component\'s disabled prop, and if the component quietly means something else by it — dimmed but still clickable, for instance — the resulting bug is invisible in code review because the prop name itself looks completely ordinary, surfacing only when a real user clicks something they were visually told was off. Requiring an explicit statement of which native props and handlers pass through untouched versus which ones the component intercepts closes the single most common integration complaint against design-system components: a consumer passes a standard prop expecting standard behavior, discovers weeks later that the component silently swallowed or transformed it, and has no way to find that out except by reading the component\'s source — which defeats the entire point of a documented, reusable API in the first place.',
    exampleOutput: `Prop | Type | Default | Use case
variant | 'info' | 'warning' | 'error' | 'success' | 'info' | all four listed use cases
dismissible | boolean | false | warning banner (2)
onDismiss | () => void | undefined | warning banner (2)
action | { label: string; onClick: () => void } | undefined | error banner with retry (3)
autoDismissMs | number | undefined | success confirmation (4)

Out of scope: stacked or queued multiple banners shown at once, and a persistent banner-history log — both deliberately left for a separate NotificationCenter component so Banner stays a single, stateless piece of inline content.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-20' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-migrate-class-component-to-hooks',
    category: 'react',
    title:
      'Migrate a class component to hooks without silently dropping lifecycle behavior',
    description:
      "A class-to-function migration that maps each lifecycle method to its hook equivalent explicitly, and names the cases where the mapping isn't 1:1 rather than papering over them.",
    promptText: `You are migrating a class component to a function component with hooks. You preserve the exact same behavior — this is a mechanical migration, not an opportunity to also redesign the component or fix unrelated issues you notice along the way.

CLASS COMPONENT
{{class_component_code}}

LIFECYCLE METHODS IN USE
{{lifecycle_methods_used}}

ERROR BOUNDARY LOGIC
{{has_error_boundary_logic}}

TARGET REACT VERSION
{{target_react_version}}

MIGRATION MAP
Map each lifecycle method explicitly, and flag any that do not have a clean 1:1 hook equivalent rather than inventing a workaround to claim full completion. The constructor's this.state becomes one or more useState calls, split by what actually changes together, not collapsed by default into one giant state object just because that mirrors the original this.state shape. componentDidMount and componentDidUpdate, when they run the exact same logic, become a single useEffect with the correct dependency array; if they run genuinely different logic in the class version, that is a sign they need to become two separate useEffect calls in the function version rather than one merged effect with awkward conditionals recreating the class's implicit branching inside it. componentWillUnmount becomes the cleanup function returned from the relevant useEffect. shouldComponentUpdate becomes React.memo on the component, with a custom comparator only if the default shallow-equality comparison is provably insufficient for this specific component's props. getDerivedStateFromProps is usually a sign the value should be computed during render instead of stored in state at all — if that is true here, recommend removing the state entirely rather than mechanically translating it into a hook. Instance variables that do not trigger a re-render, such as this.someRef or a mutable counter, become useRef. Error boundaries — componentDidCatch and static getDerivedStateFromError — have no hook equivalent as of the target React version; leave that logic as a class component and state that explicitly rather than inventing a hook-based substitute that would silently stop catching errors. static contextType or a Context.Consumer render-prop pattern used to read context becomes a direct useContext(SomeContext) call at the top of the function body — a strict simplification with no behavior difference, worth naming explicitly since a static class property is easy to miss when scanning a class component specifically for lifecycle methods. defaultProps defined as a static class property becomes default values in the function's own parameter destructuring — function Component({ size = 'medium' }) — rather than a separate defaultProps object kept alongside a function component, where recent React versions no longer give it any special meaning at all.

OUTPUT FORMAT
1. The migrated function component, as complete code.
2. A mapping table: old lifecycle method to new hook, with one line on any behavior difference, however small, introduced by the change.
3. Anything left as a class component per the error-boundary rule above, and exactly why.`,
    variables: [
      {
        name: 'class_component_code',
        description: 'The class component to migrate.',
        example:
          'class UserPanel extends React.Component { constructor(props) { super(props); this.state = { user: null, loading: true }; } componentDidMount() { this.fetchUser(); } componentDidUpdate(prevProps) { if (prevProps.userId !== this.props.userId) this.fetchUser(); } componentWillUnmount() { this.controller?.abort(); } }',
        required: true,
      },
      {
        name: 'lifecycle_methods_used',
        description:
          'Which lifecycle methods are in use, if not immediately obvious from the code.',
        example:
          'componentDidMount, componentDidUpdate, componentWillUnmount, shouldComponentUpdate',
        required: false,
      },
      {
        name: 'has_error_boundary_logic',
        description:
          'Whether this component or a nearby one implements componentDidCatch or getDerivedStateFromError.',
        example: 'No, this specific component has no error-boundary logic.',
        required: true,
      },
      {
        name: 'target_react_version',
        description:
          'The React version this migration targets, since it affects which APIs are available.',
        example: 'React 19',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: [
      'class-components',
      'hooks-migration',
      'refactoring',
      'lifecycle-methods',
      'legacy-code',
    ],
    whyItWorks:
      "The biggest real risk in this migration isn't syntax, it's timing: componentDidMount and componentDidUpdate get collapsed into one useEffect constantly, and if the dependency array doesn't exactly capture what previously triggered componentDidUpdate's own internal comparison, the effect now runs either on mount only or on every render instead of specifically on the one prop change the class version handled — a silent behavior change that a naive line-by-line migration will not catch because the code still compiles and still looks plausible. Requiring the model to name any lifecycle method without a clean hook equivalent, especially the error-boundary carve-out, stops it from inventing a broken workaround just to claim a complete function-component migration — componentDidCatch genuinely has no hook equivalent in current React, and a migration that pretends otherwise ships something that silently stops catching render errors the moment it's merged, which is exactly the kind of regression that only surfaces in production when it's too late to trace back to this specific change. Naming getDerivedStateFromProps as usually a sign of unnecessary state pushes the model toward React's own recommended fix — compute the value during render instead of storing a derived copy — rather than a purely mechanical hook swap that would just relocate the same anti-pattern into a useEffect and call the migration done without actually improving anything. The static contextType callout matters because it is genuinely easy to miss during a lifecycle-focused migration: a reviewer scanning for componentDidMount and componentDidUpdate can walk right past a static contextType assignment sitting quietly near the top of the class, and if it is missed, the migrated function component silently loses its subscription to that context and starts rendering with undefined where a real value used to be — a regression a lifecycle-mapping table alone would never surface unless context reads were checked as their own category. The defaultProps translation is worth stating explicitly because it is not merely a stylistic mismatch: recent React versions do not honor a defaultProps static property on function components the way they did on classes, so a mechanical copy-paste of the same pattern does not just look different, it silently stops working, and default values have to move into the destructured parameters themselves to have any effect at all.",
    exampleOutput: `Old lifecycle | New hook | Behavior note
constructor's this.state | useState(null) for user, useState(true) for loading | split into two calls since loading and user don't always change together
componentDidMount + componentDidUpdate (prevProps.userId check) | useEffect(() => { /* fetch */ }, [userId]) | identical trigger condition, now expressed as a dependency instead of a manual prop comparison
componentWillUnmount (abort controller) | cleanup function returned from the same useEffect | identical behavior
shouldComponentUpdate | React.memo(UserPanel) | default shallow comparison covers the same fields the original method checked

Left as a class component: none — this component has no componentDidCatch, so a full function migration was possible without any carve-out.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-implement-transition-with-view-transitions-api',
    category: 'react',
    title: 'Implement a smooth transition between two UI states in React',
    description:
      'Implements an enter/exit or shared-element transition using the lightest mechanism that actually produces the described motion — CSS, startTransition, or the View Transition API — instead of defaulting to a heavy animation library.',
    promptText: `You are implementing a specific UI transition in React. You pick the lightest mechanism that actually produces the described motion, not a default reach for a full animation library because it's the most familiar tool.

TRANSITION
{{transition_description}}

CURRENT CODE
{{current_code}}

PREFERRED ANIMATION LIBRARY
{{animation_library}}

BROWSER SUPPORT REQUIREMENT
{{browser_support_requirement}}

SELECTION RULES
If the transition is a simple property change — opacity, transform, color — tied to a class or data-attribute toggle, implement it with a plain CSS transition and let React only toggle the class or state; do not reach for a JavaScript animation library for something CSS already animates natively and more cheaply. If the transition needs to happen while a state update or navigation would otherwise cause a jarring instant swap, wrap the state update in startTransition, or useTransition's returned function, so React can keep showing the old UI, marked as pending, until the new content is actually ready — this addresses the timing of the swap, not the visual motion itself, and should not be confused with an animation mechanism. If the transition is a genuine shared-element or cross-DOM-tree animation — an item visually morphing from a list into a detail view — and the target platform supports it per the stated browser requirement, use the View Transition API: React's ViewTransition integration if the project's React version has it, or the native browser API directly otherwise, since this is the one case plain CSS transitions and startTransition genuinely cannot produce on their own. Only bring in an external animation library when the transition involves physics-based motion — spring, drag, gesture-driven interaction — that neither CSS nor the View Transition API can model. Respect prefers-reduced-motion for any transition longer than a subtle micro-interaction, either skipping it entirely or replacing it with an instant or cross-fade equivalent for users who have opted out of motion. Prefer animating transform and opacity over properties like width, height, or top and left that trigger layout recalculation on every frame — a transition on a layout-affecting property forces the browser to recompute surrounding elements' positions on every frame, which is measurably more expensive than compositing a transform, and the visual difference is rarely worth that cost when translate or scale achieves the same motion. When combining startTransition with a CSS transition — for instance, fading in newly-committed content — attach the transition to the element that actually persists across the state change, not to a freshly-mounted element with no prior state, since a transition needs an initial and a final value on the same element to have anything to animate between.

OUTPUT FORMAT
1. Which mechanism you chose and the one-sentence reason it is the lightest fit for this specific transition, not a generic justification that would apply to any transition.
2. The implementation, as real code.
3. The prefers-reduced-motion fallback, implemented, not just described.`,
    variables: [
      {
        name: 'transition_description',
        description: 'The actual motion wanted, described concretely.',
        example:
          "When a card in a grid is clicked, it should visually expand into a full detail view that appears to grow from the card's position, not just appear instantly in a new location.",
        required: true,
      },
      {
        name: 'current_code',
        description: 'The component(s) involved in the transition.',
        example:
          'A CardGrid component that renders CardPreview items, and a separate CardDetail route that currently just replaces the whole page instantly on click.',
        required: true,
      },
      {
        name: 'animation_library',
        description: 'A constraint if the team already standardizes on one.',
        example:
          'Motion (formerly Framer Motion), already a dependency elsewhere in the app.',
        required: false,
      },
      {
        name: 'browser_support_requirement',
        description:
          'Which browsers must work correctly, including ones that lack newer APIs.',
        example:
          'Must degrade gracefully on Safari versions that do not support the View Transition API — an instant swap is an acceptable fallback there.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'animation',
      'transitions',
      'view-transitions-api',
      'usetransition',
      'css-transitions',
    ],
    whyItWorks:
      'This is a decision-tree prompt before it\'s a code-generation prompt, and the actual failure mode it prevents is the default reach for a full animation library on a transition a plain CSS transition already handles for free — a real, avoidable bundle-size and complexity cost for zero additional visual benefit, and the most common outcome of asking an AI assistant to "add an animation" without constraints. Separating startTransition from the View Transition API matters because they solve genuinely different problems that get conflated constantly in practice: startTransition changes when React commits new content and keeps the old UI interactive while marked pending, but it does not animate anything by itself, while the View Transition API is the one mechanism that can actually morph an element\'s position and size across a DOM change — treating them as interchangeable, which a less constrained prompt reliably produces, is a specific and common mistake this prompt heads off by naming both mechanisms and their distinct jobs explicitly. The prefers-reduced-motion rule is included because it is a real, testable accessibility requirement with a documented user population that has explicitly opted out of motion for vestibular or attention reasons, not a nice-to-have, and it is the exact detail a plain "make it animate" request reliably skips because nothing about that request signals it matters. The transform-and-opacity preference reflects a real, measurable browser rendering cost, not a stylistic one: animating width, height, or an offset property forces the browser\'s layout engine to recompute affected elements\' geometry on every frame, a cost that scales with how much of the page is affected, while transform and opacity changes can be handled by compositing alone on modern browsers, skipping layout and paint entirely for the animated element — the practical result is a transition that stays smooth under load with transform where the equivalent width or top animation visibly stutters. The requirement that a CSS transition attach to a persisting element, not a freshly-mounted one, addresses a specific and common mistake: a CSS transition has nothing to interpolate between if the element it\'s attached to has no prior state on the page to transition from, so a transition class on a brand-new element that just mounted produces no visible animation at all, and the fix is either mounting the element in its "before" state and toggling a class on the next tick, or using the View Transition API, which is specifically designed to capture a before/after snapshot across exactly the mount and unmount boundary plain CSS transitions cannot bridge.',
    exampleOutput: `Chosen mechanism: the View Transition API — this is a genuine shared-element case (the card needs to visually morph into the detail view), which CSS transitions and startTransition alone cannot produce; a graceful instant-swap fallback covers the stated Safari support gap.

function CardGrid({ cards }) {
  const navigate = useNavigate();
  const openCard = (id) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate('/card/' + id));
    } else {
      navigate('/card/' + id);
    }
  };
  // each CardPreview gets style={{ viewTransitionName: 'card-' + card.id }}
  // and CardDetail's root element gets the matching viewTransitionName
}

Reduced-motion fallback: check window.matchMedia('(prefers-reduced-motion: reduce)').matches before calling startViewTransition — if true, navigate directly with no transition, since the API's default cross-fade is still enough visual motion to be worth skipping for users who have opted out.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code and Claude on Sonnet 4.6.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-virtualize-a-large-list-or-table',
    category: 'react',
    title:
      'Virtualize a long list or table without losing keyboard and screen-reader support',
    description:
      'Windows a large dataset with react-window or TanStack Virtual, choosing between fixed and measured row heights correctly and preserving roving-tabindex keyboard navigation and ARIA row semantics that off-screen virtualization would otherwise silently break.',
    promptText: `You are adding virtualization to a React list or table that is currently rendering every row into the DOM at once. You pick a windowing strategy that fits the actual data shape, and you explicitly preserve keyboard navigation and screen-reader semantics that virtualization can silently break if the rows outside the viewport simply don't exist in the DOM.

LIST OR TABLE
{{list_description}}

ITEM COUNT AND SHAPE
{{item_count_and_shape}}

ROW HEIGHT BEHAVIOR
{{row_height_behavior}}

INTERACTION REQUIREMENTS
{{interaction_requirements}}

CURRENT IMPLEMENTATION
{{current_implementation}}

VIRTUALIZATION RULES
Choose a fixed-size list implementation only if every row is genuinely the same height; choose a variable-size or dynamically-measured implementation if row height depends on content, and be explicit that measured rows require an actual measurement pass — usually a ResizeObserver-backed hook — not a guessed average height, since a guessed height causes visible jump-scrolling the moment a real measurement replaces the estimate. Set overscan to render a small number of extra rows above and below the visible window, large enough that fast scrolling or arrow-key navigation doesn't visibly flash empty space, but not so large that it defeats the purpose of virtualizing in the first place. If the list needs to be keyboard-navigable, implement roving tabindex on the visible, rendered rows only, and make sure focus is explicitly re-established on the correct row after a scroll-triggered re-render swaps which DOM nodes exist — a naive virtualization will drop focus entirely the moment the focused row scrolls out of the rendered window and gets unmounted. Expose the correct ARIA semantics for the container's actual role — aria-rowcount and aria-rowindex on a table-like structure, or aria-setsize and aria-posinset on a listbox-like structure — set to the full logical count and index, not just the count of rows currently mounted in the DOM, so a screen-reader user is told "row 340 of 12,000" and not "row 4 of 9." If the table has a sticky header row, keep it outside the virtualized scroll container so it never gets unmounted along with off-screen body rows, and account for its height separately when calculating the visible window instead of treating it as just another row the virtualizer manages.

OUTPUT FORMAT
1. Which virtualization library and row-height mode you chose, and the one-sentence reason tied to the stated row height behavior.
2. The implementation, as real code, including the overscan value chosen and why.
3. The keyboard-navigation and ARIA handling, called out as its own section, not folded silently into the general implementation.
4. Anything about the current implementation that will need to change beyond just wrapping it in the virtualizer — a CSS assumption that every row is in normal flow, for instance.`,
    variables: [
      {
        name: 'list_description',
        description: 'What the list or table shows and roughly how large it gets.',
        example:
          'A transaction history table for an accounting tool, showing every line item for an account.',
        required: true,
      },
      {
        name: 'item_count_and_shape',
        description: 'Roughly how many items, and whether each row is uniform.',
        example:
          'Typically 5,000 to 40,000 rows per account; every row has the same three-line layout.',
        required: true,
      },
      {
        name: 'row_height_behavior',
        description: 'Whether every row is the same height or content-dependent.',
        example: 'Fixed height, 56px per row, no wrapping text.',
        required: true,
      },
      {
        name: 'interaction_requirements',
        description: 'What keyboard or screen-reader behavior the list must support.',
        example:
          'Must support arrow-key row navigation and Enter to open a row, and must announce total row count to screen readers.',
        required: true,
      },
      {
        name: 'current_implementation',
        description: 'How the list is rendered today, before virtualization.',
        example:
          'A plain .map() over the full array rendering a <TransactionRow> for each item inside a scrollable div — no virtualization at all today.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: [
      'virtualization',
      'performance',
      'react-window',
      'tanstack-virtual',
      'accessibility',
      'large-lists',
    ],
    whyItWorks:
      "The fixed-versus-measured row-height decision is the actual fork in the road for this entire class of problem, not a minor implementation detail: a fixed-size virtualizer can compute exact scroll positions instantly because every row's height is known up front, while a variable-size list has to measure real rendered content, which means the very first render of any row is necessarily a guess that then gets corrected — building this without acknowledging that guess-then-correct cycle is why so many hand-rolled virtualized lists visibly jump or overshoot when the user scrolls fast, and naming it explicitly forces the model to either commit to a fixed height, honestly, or implement the ResizeObserver-based measurement pass a variable list actually requires. The keyboard-focus rule targets a failure mode that is invisible in a quick visual test but breaks the feature entirely for a real keyboard user: the whole mechanism of virtualization is unmounting DOM nodes that scroll out of view, and if the currently-focused row is one of them, the browser's focus silently falls back to the document body with no visible indication anything went wrong, which a sighted mouse user testing the feature will never notice and a keyboard-only user will hit on literally every scroll. Setting ARIA row count and index to the full logical dataset size rather than the currently-mounted DOM count matters because a screen reader has no other way to know a virtualized list even has 12,000 rows — from its perspective, without the correct attributes, the list simply looks like it has nine items, which is a materially false statement about the data, not just a minor omission. The sticky-header caveat matters because a header naively rendered inside the same virtualized list as the body rows will itself scroll out of the rendered window under fast scrolling, and a missing header is an especially visible failure since it's the one part of the table every user is looking at, unlike a missing off-screen row nobody was looking at anyway.",
    exampleOutput: `Chosen: react-window's FixedSizeList — every row is a uniform 56px per the stated row height behavior, so a fixed-size virtualizer avoids the measurement pass entirely and gives exact scroll-position math. Overscan set to 6 rows above and below the viewport, enough to avoid visible flashing on a fast arrow-key repeat without rendering hundreds of unneeded rows.

<FixedSizeList height={600} itemCount={transactions.length} itemSize={56} overscanCount={6} outerElementType={TableBody} itemData={transactions}>
  {Row}
</FixedSizeList>

Keyboard/ARIA: roving tabindex tracked in a ref (not per-row state, since rows unmount), re-applied via a scroll-to-item + focus() call after any arrow-key move that would scroll the target row into view. Container gets role="grid" with aria-rowcount={transactions.length}; each rendered Row gets aria-rowindex set to its real index in the full array, not its position among currently-mounted rows.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-26' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 using react-window 2 and TanStack Virtual 3.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-implement-optimistic-update-with-rollback',
    category: 'react',
    title: 'Add an optimistic update that actually rolls back cleanly on failure',
    description:
      'Implements an optimistic UI update for a specific action — a like, a save, a reorder — with a real rollback and error surface for the failure path, not just the happy-path demo most optimistic-update examples show.',
    promptText: `You are adding an optimistic update to a specific user action in a React app. The action should visually complete instantly, before the server confirms it, but you are equally responsible for the failure path — what the user sees and what state the app is left in when the server rejects the request.

ACTION
{{action_description}}

CURRENT CODE
{{current_code}}

FAILURE BEHAVIOR
{{failure_behavior}}

CONCURRENT UPDATE RISK
{{concurrent_update_risk}}

IMPLEMENTATION RULES
If this is a form submission wrapped in an Action, use useOptimistic to show the pending value merged over the real state; be precise about its actual mechanics — useOptimistic renders the optimistic value only while the associated action is in flight, and automatically reverts to whatever the real state resolves to once that action settles, whether it succeeded or failed. That automatic revert is not the same as a rollback with user feedback — it silently makes the optimistic UI disappear, so you must add explicit failure handling on top of it: an inline error message, a toast, or a visible undo state, so the user sees why their like count just dropped back down instead of experiencing an unexplained flicker. If this is not a form Action — a button click, a drag-drop reorder — implement the optimistic update manually: apply the new state immediately, fire the request, and on failure explicitly revert to a snapshot of the previous state taken before the optimistic update was applied, not to some assumed default. Guard against the concurrent-update risk named above: if a background refetch or a second user action could resolve after the optimistic update and overwrite it with stale data, decide explicitly whether the optimistic value or the fetched value should win, and implement whichever you chose — do not leave it to whichever happens to finish last by accident. Never let the UI sit in an ambiguous state where the user cannot tell whether their action succeeded, is still pending, or failed — one of those three must always be visually distinguishable. If the same action can be triggered again while a previous attempt is still in flight — a user double-clicking a like button, or tapping retry before the first request has resolved — decide explicitly whether to disable the control for the duration of the request or to let a second optimistic update stack on top of the first, and implement whichever choice you made rather than leaving both requests to race with no coordination between them.

OUTPUT FORMAT
1. The implementation, as real code, covering the optimistic apply, the success path, and the failure path with rollback.
2. What exactly the user sees in each of the three states — optimistic/pending, confirmed success, and rolled-back failure.
3. How the concurrent-update risk is resolved, specifically, or a note that none exists for this action and why.`,
    variables: [
      {
        name: 'action_description',
        description: 'The specific action getting the optimistic treatment.',
        example:
          'Clicking a heart icon to like a post in a feed — should fill in and the count should increment instantly on click.',
        required: true,
      },
      {
        name: 'current_code',
        description: 'The component and current request logic for this action.',
        example:
          'A PostCard component with a LikeButton child that calls an onLike prop, which fires a POST /posts/:id/like and only updates the UI after the response resolves.',
        required: true,
      },
      {
        name: 'failure_behavior',
        description: 'What should happen, visibly, when the server rejects the action.',
        example:
          'Heart icon and count revert to their prior state, and a small inline toast reads "Couldn\'t like this post — try again."',
        required: true,
      },
      {
        name: 'concurrent_update_risk',
        description:
          'Whether anything else could update the same data while the optimistic action is in flight.',
        example:
          'The feed also polls for fresh like counts every 30 seconds — a poll landing mid-request could momentarily show a stale count before the like request resolves.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: ['optimistic-ui', 'useoptimistic', 'error-handling', 'state-management', 'ux'],
    whyItWorks:
      "The precise mechanics of useOptimistic are the crux of this prompt, and they are widely misunderstood in exactly the direction that causes bugs: developers often assume it handles the failure case gracefully because it \"reverts automatically,\" but that automatic revert is silent — it removes the optimistic value the instant the action settles, success or failure, with zero built-in user feedback, so a naive implementation that only calls useOptimistic and stops there produces a UI that flickers back to the old state on failure with no explanation, which reads to the user as a bug rather than an intentional rejection. Requiring an explicit pre-update snapshot for the manual, non-Action case targets the second most common mistake in hand-rolled optimistic updates: reverting to a hardcoded or assumed default value on failure instead of the actual prior state, which is wrong the moment the prior state wasn't the default — a like count that was already at 47 before the optimistic increment should roll back to 47 on failure, not to 0. Naming the concurrent-update risk explicitly and forcing a stated resolution matters because this is the class of bug that never shows up in a quick manual test — it only appears under real timing, when a background poll or a second tab's action happens to land during the optimistic window — and a prompt that doesn't ask about it will get an implementation that works perfectly in every demo and occasionally shows a genuinely wrong number in production. Forcing an explicit decision on double-triggering — disable versus let a second optimistic update stack — closes a related race that shares the same root cause as the concurrent-update risk: two in-flight requests for the same action with no coordination between them can resolve in either order, and whichever response lands second silently overwrites whatever the first one set, which for a like button might just flicker the count but for a reorder or a payment-adjacent action can leave the UI showing a result that neither request actually produced.",
    exampleOutput: `function LikeButton({ postId, initialLiked, initialCount, onLikeRequest }) {
  const [state, setState] = useState({ liked: initialLiked, count: initialCount });
  const [optimisticState, setOptimisticState] = useOptimistic(state);

  async function handleLike() {
    const snapshot = state;
    setOptimisticState({ liked: !state.liked, count: state.count + (state.liked ? -1 : 1) });
    try {
      const confirmed = await onLikeRequest(postId);
      setState(confirmed);
    } catch {
      setState(snapshot); // explicit rollback to the real prior value, not a default
      showToast("Couldn't like this post — try again.");
    }
  }
  return <button onClick={handleLike} aria-pressed={optimisticState.liked}>{optimisticState.count}</button>;
}

Concurrent risk resolved: the 30-second poll's response is discarded (not applied to state) while a like request for the same post is in flight, tracked via a ref flag, so the poll can never stomp the optimistic value mid-request.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-01' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Claude Code and Claude on Sonnet 4.6 with React 19.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-build-debounced-search-with-usedeferredvalue',
    category: 'react',
    title: 'Build search-as-you-type that stays responsive without lagging the input',
    description:
      'Implements a live-filtering search box choosing correctly between useDeferredValue, manual debouncing, or both — because they solve different problems and neither one alone covers a network-backed search.',
    promptText: `You are implementing a search-as-you-type input in React. You choose between useDeferredValue, manual debouncing, or a combination of both based on where the actual cost of each keystroke lives — in expensive client-side rendering, in a network request, or in both — rather than reaching for whichever one you used last time.

SEARCH BEHAVIOR
{{search_description}}

DATA SOURCE
{{data_source}}

LATENCY BUDGET
{{latency_budget}}

CURRENT IMPLEMENTATION
{{current_implementation}}

SELECTION RULES
If the cost is entirely in client-side rendering — filtering or sorting a large already-loaded array on every keystroke — use useDeferredValue on the search term and render the expensive list against the deferred value, not the raw input value. This keeps the input itself always responsive because React can interrupt and deprioritize the expensive re-render triggered by the deferred value without ever blocking the actual keystroke from appearing; it does not delay when the underlying value updates, only when the expensive re-render is allowed to catch up to it. If the cost is in a network request, useDeferredValue alone does not help — it does not reduce how many requests fire, since the value itself still updates on every keystroke. Add an actual debounce on the value used to trigger the fetch, so a request only fires after typing pauses for the given interval, and cancel any in-flight request that a newer keystroke has superseded so a slow, stale response can never overwrite a faster response to a more recent query. If both a large in-memory dataset and a network refinement are involved, combine them: debounce the network trigger, and separately use useDeferredValue for the render itself so the input never stutters while either the debounce timer or the network request is pending. Show an isPending or isStale indicator during the deferred or debounced window so the user can tell displayed results might not yet reflect their latest keystroke, rather than silently presenting possibly-outdated results as current. Never wrap the input's own value in useDeferredValue or a debounce — the character the user just typed must render in the input on every keystroke with zero delay regardless of which mechanism is deferring the expensive work downstream; deferring or debouncing the input's own displayed value, rather than only the value used to drive the filter or the fetch, is what actually causes the perceptible typing lag this whole prompt exists to prevent.

OUTPUT FORMAT
1. Which mechanism or combination you chose and the specific reason tied to where the cost actually lives.
2. The implementation, as real code, including request cancellation if a network call is involved.
3. What the stale/pending indicator looks like and exactly when it appears and disappears.`,
    variables: [
      {
        name: 'search_description',
        description: 'What is being searched and how results should update.',
        example:
          'A command-palette style search over a list of 3,000 in-app actions, filtered client-side as the user types.',
        required: true,
      },
      {
        name: 'data_source',
        description:
          'Whether results come from an already-loaded array or a network call.',
        example:
          'Fully client-side — all 3,000 actions are loaded once at app start and kept in memory.',
        required: true,
      },
      {
        name: 'latency_budget',
        description:
          'How fast the input must feel, and any acceptable delay for results.',
        example:
          'Input must never visibly lag on any keystroke; results can lag the keystroke by up to roughly 100ms without feeling broken.',
        required: true,
      },
      {
        name: 'current_implementation',
        description: 'How the search currently works, before this change.',
        example:
          'A single useState for the query, filtering the full 3,000-item array inline in the render body on every keystroke — noticeably laggy on older laptops.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'usedeferredvalue',
      'debouncing',
      'search',
      'performance',
      'concurrent-rendering',
    ],
    whyItWorks:
      "The distinction this prompt insists on — useDeferredValue changes when an expensive re-render is allowed to happen, not when the underlying value updates — is the exact point most explanations of this hook get subtly wrong, and getting it wrong leads directly to using useDeferredValue for a network-backed search and being confused when the same number of requests still fire on every keystroke, because the hook never touched the update itself, only the rendering work downstream of it. Requiring actual request cancellation for the network case targets a real, common race condition: without cancellation, a slow response to an earlier, now-irrelevant query can resolve after a faster response to the user's actual latest query, and overwrite the correct results on screen with stale ones, which is a bug that only appears under real variable network latency and is invisible in a fast local-dev environment where every request returns in roughly the same order it was sent. Requiring a visible pending or stale indicator during the deferred or debounced window matters because both mechanisms create a genuine, if brief, gap between what the user typed and what's currently displayed — silently presenting that in-between state as final, current information is a small but real trust cost, and the fix is one boolean and a bit of UI, not a structural change, so leaving it out is a choice, not a limitation. The rule against deferring or debouncing the input's own displayed value targets the exact mistake that reintroduces the lag both mechanisms are supposed to eliminate: if the value bound to the input element is itself the deferred or debounced value rather than a separate raw state updated on every keystroke, the character on screen now waits for the same deprioritized render or timer the filter results wait for, which defeats the entire premise of using either mechanism in the first place and produces the visibly laggy typing experience the prompt was written to avoid.",
    exampleOutput: `const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;

const results = useMemo(
  () => actions.filter(a => a.label.toLowerCase().includes(deferredQuery.toLowerCase())),
  [deferredQuery]
);

// input always reflects 'query' directly — never lags
<input value={query} onChange={e => setQuery(e.target.value)} />
<ResultsList results={results} className={isStale ? 'opacity-60' : ''} />

Since this case is fully client-side with no network call, no debounce or request cancellation was needed — useDeferredValue alone covers the stated latency budget by letting React deprioritize the 3,000-item filter behind every keystroke.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-build-compound-component-with-context',
    category: 'react',
    title:
      'Build a compound component that lets the consumer control markup, not just props',
    description:
      'Implements a Tabs- or Accordion-style compound component using a narrowly-scoped context so subcomponents share implicit state while the consumer keeps full control over composition and order.',
    promptText: `You are building a compound component — a family of subcomponents that share implicit state through context, so the consumer composes the markup directly while the state and behavior stay coordinated behind the scenes.

COMPONENT FAMILY
{{component_name}}

SUBCOMPONENTS
{{subcomponent_list}}

SHARED STATE
{{shared_state}}

CONSUMER CUSTOMIZATION NEEDS
{{consumer_customization_needs}}

IMPLEMENTATION RULES
Create one context scoped exclusively to this component family — never reuse or extend an app-wide context for this — and provide it from the root component of the family, never from an individual subcomponent. Each subcomponent reads only the specific piece of the shared context it actually needs; do not have every subcomponent destructure the entire context value if only one field is relevant to it, since that couples subcomponents to internal shape changes they don't actually depend on. The consumer must be able to reorder, omit, or wrap individual subcomponents in their own markup without breaking the shared state — if a subcomponent's position or presence is hardcoded into the root component's own render logic instead of left to the consumer's JSX, that defeats the actual purpose of a compound component and should be flagged, not implemented that way. Throw a clear, descriptive error — not a silent undefined — if a subcomponent is rendered outside its required root component, so a consumer mistake fails loudly during development rather than producing a confusing runtime bug. Keep the context value stable across renders where possible — memoize the object passed to the provider so subcomponents that don't care about a particular state change don't re-render needlessly, especially since this is exactly the context re-render behavior that makes an unscoped, unmemoized context expensive at scale. Do not let this pattern quietly grow into project-wide global state — if a future feature needs data from outside this component family, that is a sign this state has outgrown the compound-component pattern and needs a different home, not a widened context. If the family needs to expose an imperative action to the consumer — programmatically opening a specific tab, or scrolling a specific accordion panel into view — prefer a controlled prop pattern (an activeTab plus onActiveTabChange pair the consumer can own) over reaching for useImperativeHandle and a ref, since a controlled prop keeps the family's state consistent with whatever the consumer's own state management expects, while an imperative ref-based API creates a second, parallel way to change the same state that can drift out of sync with the first.

OUTPUT FORMAT
1. The root component and its context provider, as real code.
2. Each subcomponent, showing exactly what slice of context it reads.
3. A usage example showing the consumer's actual JSX, demonstrating the customization named above.
4. The explicit error thrown for misuse, with its message text.`,
    variables: [
      {
        name: 'component_name',
        description: 'The compound component family being built.',
        example: 'Tabs',
        required: true,
      },
      {
        name: 'subcomponent_list',
        description: 'The individual pieces that make up the family.',
        example: 'Tabs.List, Tabs.Tab, Tabs.Panels, Tabs.Panel',
        required: true,
      },
      {
        name: 'shared_state',
        description: 'What implicit state the subcomponents need to coordinate on.',
        example:
          'Which tab is currently active, and whether the active tab was set by click versus keyboard arrow navigation.',
        required: true,
      },
      {
        name: 'consumer_customization_needs',
        description: 'What the consumer needs to be free to control.',
        example:
          'Must be able to render tabs in any order, wrap an individual Tab in a custom badge component, and render panels lazily so an inactive panel is not mounted until first selected.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'Claude', 'ChatGPT'],
    tags: [
      'compound-components',
      'react-context',
      'component-composition',
      'design-patterns',
      'accessibility',
    ],
    whyItWorks:
      "Scoping the context strictly to this one component family, and providing it only from the family's own root, is what actually delivers the pattern's core promise — a consumer who can freely reorder or wrap subcomponents in their own JSX without touching a single prop, because the coordination lives in context rather than in an explicit parent-managed prop chain that would otherwise force a fixed rendering order. The rule against each subcomponent destructuring the entire context value is a direct, practical application of the same re-render mechanic relevant to any React context: even inside a small, well-scoped compound component, a subcomponent that reads the whole context object re-renders on every state change in that context regardless of relevance, and at a large enough tab or accordion count that adds up to a measurable cost for a pattern specifically chosen for its ergonomics, not its performance ceiling. Throwing a loud, descriptive error when a subcomponent renders outside its root targets the single most common consumer mistake with any compound component — rendering Tabs.Tab somewhere it isn't wrapped in Tabs — and the difference between a clear thrown error naming the exact problem and a silent undefined deep in a context read is the difference between a five-second fix and a confusing debugging session for whoever hits it, often not the original author. Preferring a controlled prop pair over an imperative ref-based API for external control matters for the same reason controlled inputs are generally preferred over uncontrolled ones with escape-hatch refs: a consumer who can set activeTab directly and read updates through onActiveTabChange has exactly one source of truth to reason about, whereas a ref exposing an imperative openTab(id) method creates a second write path into the same state that the family's own internal state can silently disagree with the moment the two are driven from different places — a bug that specifically tends to surface only when a consumer starts combining the imperative method with the family's own default uncontrolled behavior in the same integration.",
    exampleOutput: `const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.Tab and Tabs.Panel must be rendered inside a <Tabs> component.');
  return ctx;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useTabsContext();
  return <button role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}>{children}</button>;
}

// Consumer usage — full control over order and wrapping:
<Tabs defaultTab="billing">
  <Tabs.List>
    <Tabs.Tab id="billing">Billing</Tabs.Tab>
    <Badge count={2}><Tabs.Tab id="alerts">Alerts</Tabs.Tab></Badge>
  </Tabs.List>
</Tabs>`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-29' },
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude and Claude Code on Sonnet 4.6.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-build-polymorphic-component-with-aschild',
    category: 'react',
    title:
      'Build a polymorphic component that renders as any element without losing types',
    description:
      "Implements an asChild-style polymorphic component that merges its props and ref onto the consumer's chosen child element instead of wrapping it in an extra DOM node, with TypeScript generics that keep the merged props fully typed.",
    promptText: `You are building a polymorphic component that can render as different underlying elements depending on what the consumer needs, using an asChild-style pattern that merges props and refs onto the consumer's own child element instead of wrapping it in an extra DOM node.

COMPONENT
{{component_name}}

TARGET USE CASES
{{target_use_cases}}

UNDERLYING ELEMENT OPTIONS
{{underlying_element_options}}

TYPESCRIPT STRICTNESS
{{typescript_strictness}}

IMPLEMENTATION RULES
When asChild is true, clone the single child element passed in and merge this component's own props, event handlers, and className onto it, rather than rendering the component's default element around the child — the entire point of asChild is that no extra DOM node gets introduced, which matters for cases like a styled Button that needs to actually be an anchor tag for semantics and SEO, not a button wrapping an anchor. Merge event handlers by calling both the child's original handler and this component's own handler, in that order, rather than letting one silently overwrite the other — a consumer who passed an onClick to the child element should never have it silently discarded because the parent component also wanted to attach one. Forward the ref correctly so a consumer's own ref to the child element still works after the merge; a naive clone that doesn't handle ref forwarding will leave the consumer's ref pointing at nothing. Type the component so that when asChild is used, the props allowed on the component still make sense for whatever element the consumer actually passed as the child — do not let the type system silently widen to any so a consumer loses autocomplete and type-checking on the merged result. When asChild is false or omitted, render the component's own default element normally, fully typed for exactly that element's real DOM attributes and ARIA properties, not a generic React.HTMLAttributes<HTMLElement> catch-all that would accept invalid props. Warn, in development only, if asChild is true and the child is not a single valid React element — zero children, multiple children, or a plain text node — rather than letting React.cloneElement throw its own generic internal error with no indication of which component or which usage site caused it.

OUTPUT FORMAT
1. The component implementation, including the asChild branch, as real code.
2. The TypeScript types, showing how props stay meaningful in both the default-element and asChild cases.
3. Two usage examples: one using the default element, one using asChild to render as a different element.
4. Any limitation of this specific implementation you are aware of — for example, that asChild requires exactly one child element and will need to fail loudly, not silently, if given zero or more than one.`,
    variables: [
      {
        name: 'component_name',
        description: 'The component being made polymorphic.',
        example: 'Button',
        required: true,
      },
      {
        name: 'target_use_cases',
        description: 'The real scenarios that require rendering as different elements.',
        example:
          'A Button that is sometimes a real <a> tag for navigation links styled identically to buttons, and sometimes a real <button> for in-page actions.',
        required: true,
      },
      {
        name: 'underlying_element_options',
        description: 'Which concrete elements this component needs to support.',
        example:
          'button (default), a (via asChild with a Link or anchor child), and occasionally a custom RouterLink component from the routing library.',
        required: true,
      },
      {
        name: 'typescript_strictness',
        description: 'How strict the typing needs to be for the merged props.',
        example:
          'Strict — no any, no unchecked type assertions; props specific to the anchor case (href) must only be allowed when rendering as an anchor.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'polymorphic-components',
      'aschild',
      'typescript',
      'component-composition',
      'design-systems',
    ],
    whyItWorks:
      "The no-extra-DOM-node rule is the entire reason asChild exists rather than a simpler wrapper approach, and it has a real, concrete consequence: a Button that wraps its child in its own button element instead of merging onto it produces invalid HTML the moment the child is itself an interactive element like an anchor — an interactive element nested inside another interactive element — which breaks keyboard navigation and screen-reader semantics in ways a purely visual check will never catch, since it renders and looks correct while being structurally wrong underneath. Requiring both the child's original handler and the component's own handler to fire, in that order, targets a specific and easy-to-miss regression: a consumer who passes onClick to the anchor they're using as the child expects that handler to still run, and a naive prop-merge implementation that does {...childProps, ...componentProps} will silently let the component's handler replace the consumer's without either side ever raising an error, so the bug only surfaces as \"my click handler stopped firing\" days after the component shipped. The typing requirement — that props stay meaningful for whichever element is actually rendered, rather than collapsing to a generic any or a catch-all HTML attributes type — is what keeps a polymorphic component's ergonomics from silently degrading over time: without it, every consumer loses real autocomplete and compile-time checking on exactly the component they're most likely to reach for repeatedly across a design system, which is the opposite of what a design-system primitive is supposed to deliver. The development-only warning for an invalid asChild child matters because React.cloneElement's own failure mode here is unhelpful by default: it throws a generic error about the argument it received, with no reference to which design-system component or which call site in the consumer's code triggered it, so a consumer debugging a crash three components away from their own usage of Button asChild has to work backward through a stack trace instead of reading a message that names the actual constraint that was violated and where.",
    exampleOutput: `type ButtonOwnProps = { asChild?: boolean; variant?: 'primary' | 'secondary' };
type ButtonProps<T extends React.ElementType = 'button'> = ButtonOwnProps &
  Omit<React.ComponentPropsWithRef<T>, keyof ButtonOwnProps>;

function Button<T extends React.ElementType = 'button'>(
  { asChild, variant = 'primary', className, onClick, children, ...rest }: ButtonProps<T>
) {
  const classes = cn(buttonStyles({ variant }), className);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className),
      onClick: (e: React.MouseEvent) => { children.props.onClick?.(e); onClick?.(e as any); },
      ...rest,
    });
  }
  return <button className={classes} onClick={onClick} {...rest}>{children}</button>;
}

// Default: <Button onClick={save}>Save</Button>
// Polymorphic: <Button asChild><a href="/docs">Read the docs</a></Button>

Limitation: asChild requires exactly one valid React element as a child — passing zero children or a text node throws a descriptive error rather than failing silently on React.cloneElement.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-31' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-build-error-boundary-with-recovery-ux',
    category: 'react',
    title: 'Build an error boundary that lets the user actually recover',
    description:
      'Implements a class-based error boundary — the one place hooks genuinely have no equivalent — with a real retry-and-reset UX and error reporting, instead of a static crash screen that leaves the only recovery option as a full page reload.',
    promptText: `You are implementing a React error boundary. Error boundaries have no hook equivalent as of the current React version — componentDidCatch and static getDerivedStateFromError are only available on class components — so this must be a class component, wired into an otherwise fully functional-component codebase, with a real recovery path for the user, not just a static fallback message.

BOUNDARY SCOPE
{{boundary_scope}}

CURRENT CODE
{{current_code}}

RECOVERY BEHAVIOR
{{recovery_behavior}}

ERROR REPORTING REQUIREMENT
{{error_reporting_requirement}}

IMPLEMENTATION RULES
Implement both static getDerivedStateFromError, to render the fallback UI, and componentDidCatch, to report the error, since they serve different purposes and neither one alone is sufficient — getDerivedStateFromError cannot perform side effects like network calls, and componentDidCatch cannot return a value to change what renders. Be explicit that this boundary only catches errors thrown during rendering, in lifecycle methods, and in constructors of the components below it in the tree — it does not catch errors inside event handlers, inside asynchronous code such as a promise callback or a setTimeout, or during server-side rendering; if the actual bug report describes an error inside a click handler or an async fetch callback, name that this boundary will not catch it and that a try/catch at that specific call site is the correct fix instead. Implement a real reset mechanism, not just a fallback that renders forever once tripped: expose a resetErrorBoundary function the fallback UI can call, and use React's key prop or the boundary's own resetKeys pattern so that changing a relevant piece of state — navigating to a new route, retrying a failed data fetch — actually remounts the children fresh rather than leaving them permanently in the crashed state until a full page reload. Report every caught error to the stated error-reporting destination inside componentDidCatch, including the component stack it provides, and never swallow an error silently just because a fallback UI is now showing — the fallback is for the user, the report is for you, and skipping the report loses the exact information needed to fix the actual bug later.

OUTPUT FORMAT
1. The error boundary class component, as real code, with both required lifecycle methods.
2. The fallback UI component, showing the retry/reset action wired to the boundary.
3. How the boundary is mounted around the scope named above.
4. An explicit note on what kinds of errors in this codebase this boundary will not catch, and where the corresponding try/catch needs to live instead.`,
    variables: [
      {
        name: 'boundary_scope',
        description: 'What part of the tree this boundary wraps.',
        example:
          'Around each individual dashboard widget, so one broken widget does not take down the whole dashboard page.',
        required: true,
      },
      {
        name: 'current_code',
        description:
          'The component(s) this boundary needs to wrap and any existing crash-handling attempt.',
        example:
          'A grid of WidgetCard components, each rendering a different data visualization; currently a single uncaught error anywhere crashes the entire dashboard to a white screen.',
        required: true,
      },
      {
        name: 'recovery_behavior',
        description: 'What the user should be able to do when a widget crashes.',
        example:
          "Show \"This widget couldn't load\" with a Retry button inside just that widget's space, and retrying should refetch that widget's data and remount it fresh.",
        required: true,
      },
      {
        name: 'error_reporting_requirement',
        description: 'Where caught errors should be sent.',
        example:
          'Send to the existing Sentry client already initialized elsewhere in the app, tagged with the widget name.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'error-boundaries',
      'error-handling',
      'resilience',
      'class-components',
      'reliability',
    ],
    whyItWorks:
      "Naming the exact scope of what an error boundary catches is not a pedantic caveat — it is the single most common reason error boundaries get blamed for \"not working\" in production: a team adds a boundary, an error still crashes the app, and the actual cause is that the error originated in an event handler or an async callback, which error boundaries were never designed to catch by React's own documented behavior, and without stating this explicitly the model will happily wire up a boundary that gives a false sense of coverage for exactly the errors most likely to occur in a real app with real user interactions and real network calls. Requiring both getDerivedStateFromError and componentDidCatch, and explaining why neither one alone suffices, prevents a common half-implementation where only the rendering fallback exists and errors are never actually reported anywhere, which means the team discovers a production crash from a user complaint instead of a monitoring alert, days or weeks after it started happening. The explicit reset mechanism is what separates a genuinely recoverable error boundary from the extremely common broken pattern where the boundary's own internal hasError state, once set to true, has no way back to false short of a full page reload — because a class component's state persists across re-renders of its parent by design, a fallback UI with no resetKeys or key-based remount strategy traps the user in the crashed view even after whatever caused the original error (a bad response, a stale token) has resolved. Reporting the error inside componentDidCatch rather than only inside getDerivedStateFromError is also a placement forced by React's own lifecycle contract, not an arbitrary choice: getDerivedStateFromError runs during the render phase, before commit, where side effects like a network call to an error-tracking service are explicitly unsafe and can be abandoned partway through if React discards that render pass, while componentDidCatch runs during the commit phase specifically so it is safe to perform exactly this kind of side effect — treating the two as interchangeable, or trying to report from inside getDerivedStateFromError to save a method, is the kind of shortcut that produces error reports that intermittently never arrive for reasons that have nothing to do with the reporting code itself.",
    exampleOutput: `class WidgetErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) {
    reportToSentry(error, { widget: this.props.widgetName, componentStack: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return <WidgetErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

// Mounted per-widget, keyed so a retry remounts fresh state:
<WidgetErrorBoundary widgetName="revenue-chart" key={retryCount}>
  <RevenueChartWidget />
</WidgetErrorBoundary>

Not caught by this boundary: an error thrown inside RevenueChartWidget's own onClick export-button handler, or inside its data-fetching promise's .catch — both need their own try/catch at the call site, since neither runs during React's render phase.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-23' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Claude Code and Claude on Sonnet 4.6.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-debug-a-hydration-mismatch',
    category: 'react',
    title: 'Find and fix a hydration mismatch instead of silencing the warning',
    description:
      'Diagnoses a server-rendered React app where the client-rendered output disagrees with the server-rendered HTML, names the real cause from the actual common list, and fixes it at the source instead of reaching for suppressHydrationWarning.',
    promptText: `You are debugging a hydration mismatch in a server-rendered React application. The server-rendered HTML and the client's first render disagree, and your job is to find the actual source of the disagreement, not to make the warning go away by any means available.

COMPONENT
{{component_code}}

HYDRATION WARNING TEXT
{{hydration_warning_text}}

SSR SETUP
{{ssr_setup}}

SUSPECTED CAUSE
{{suspected_cause}}

DIAGNOSTIC RULES
Check, in order, the actual common causes of hydration mismatches, since the fix is different for each and guessing wrong wastes a debugging cycle: a value that differs between server and client because it depends on time (Date.now(), new Date() formatted without a fixed timezone) or randomness (Math.random(), a randomly-generated id) evaluated separately during the server render and the client's initial render; a check for a browser-only global such as window, document, or localStorage that is reachable on the client but throws or returns undefined on the server, causing genuinely different branches to render in each environment; invalid HTML nesting that the browser silently repairs when parsing the server-sent markup — a <div> nested inside a <p>, for instance — so the DOM the browser actually builds no longer matches what React's virtual tree expects to find when it hydrates; and third-party browser extensions or scripts that mutate the DOM after the server response arrives but before React hydrates it, which is a real cause outside your own code's control. For a value that is genuinely only knowable on the client — the actual viewport width, a value read from localStorage — the correct fix is to render a server-safe default on the initial render and update it inside a useEffect after mount, accepting that the visible UI will update once, deliberately, right after hydration; that is the standard pattern, not a hack. Reserve suppressHydrationWarning strictly for cases where the mismatch is provably harmless and unavoidable — a timestamp formatted as relative time ("2 minutes ago") is the textbook example — and never use it to silence a mismatch you have not first actually diagnosed, since it will hide a real bug just as readily as a harmless one.

OUTPUT FORMAT
1. The specific cause you identified, citing the exact line or pattern responsible, not a generic category.
2. The fix, as real code, and which of the standard patterns above it follows.
3. Why suppressHydrationWarning was or was not the right tool here, stated explicitly rather than left implicit in the fix.`,
    variables: [
      {
        name: 'component_code',
        description: 'The component producing the mismatch.',
        example:
          'function LastUpdated({ timestamp }) { return <span>Updated {new Date(timestamp).toLocaleTimeString()}</span>; } — rendered inside a server-rendered page.',
        required: true,
      },
      {
        name: 'hydration_warning_text',
        description: 'The exact console warning or error React produced, if available.',
        example:
          'Warning: Text content did not match. Server: "Updated 3:04:12 PM" Client: "Updated 3:04:15 PM"',
        required: true,
      },
      {
        name: 'ssr_setup',
        description: 'What renders the app on the server and hydrates it on the client.',
        example:
          'A custom Node/Express server calling ReactDOMServer.renderToString, hydrated client-side with hydrateRoot; not a metaframework.',
        required: true,
      },
      {
        name: 'suspected_cause',
        description:
          'Your own best guess so far, if you have one, so the model can confirm or correct it.',
        example:
          "Suspect it's the toLocaleTimeString() call producing a different exact second on the server versus the client, a few seconds apart.",
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: ['hydration', 'ssr', 'debugging', 'server-side-rendering', 'react-dom'],
    whyItWorks:
      "Walking the actual common-cause list in order, rather than jumping straight to a fix, matters because hydration mismatches have several genuinely distinct root causes that produce nearly identical symptoms — a mismatched text warning looks the same on the surface whether the cause is a timestamp, a browser-only API check, or malformed HTML the browser silently repaired — and a model that guesses the wrong category will confidently ship a fix, like wrapping the value in useEffect, that does nothing for a case actually caused by invalid nesting, leaving the real bug in place while looking resolved. The explicit two-step pattern for genuinely client-only values — render a server-safe default first, then update after mount in an effect — is the standard, documented fix specifically because it is honest about a real constraint: the server cannot know the client's viewport width or localStorage contents, so pretending otherwise by trying to guess or fake a value server-side just relocates the mismatch instead of resolving it, while a deliberate one-time post-hydration update is a known, accepted tradeoff. Restricting suppressHydrationWarning to provably harmless, unavoidable cases — and requiring that restriction be justified explicitly rather than applied by default — targets the actual failure mode this prompt exists to prevent: suppressHydrationWarning silences the exact signal that would otherwise reveal a real bug, so reaching for it before diagnosing the cause is functionally indistinguishable from hiding a defect rather than fixing one, and it will do exactly that for whichever future case doesn't happen to be the timestamp example everyone already knows about. Naming the specific SSR setup before diagnosing anything is also load-bearing, not throat-clearing: a custom Node server calling renderToString has different failure modes and different available fixes than a streaming renderToPipeableStream setup or a metaframework's own data-loading convention, since the point at which a server-only value becomes available, and whether partial hydration or streaming is even in play, changes which of the standard patterns actually applies here rather than being a generic hydration-mismatch fix copied from a different rendering setup entirely.",
    exampleOutput: `Cause identified: new Date(timestamp).toLocaleTimeString() is called once during the server render and again during the client's initial render — a few seconds apart in real wall-clock time — producing genuinely different text on each side, exactly matching the warning's server/client second mismatch.

function LastUpdated({ timestamp }) {
  const [display, setDisplay] = useState(() => formatStable(timestamp)); // server-safe, deterministic
  useEffect(() => { setDisplay(new Date(timestamp).toLocaleTimeString()); }, [timestamp]);
  return <span>Updated {display}</span>;
}

suppressHydrationWarning was not used here: the mismatch is fixable at the source (defer the wall-clock-dependent formatting to after mount) rather than provably unavoidable, so suppressing it would have hidden a real, fixable discrepancy instead of accepting a truly unavoidable one.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1) on React 19 SSR.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-wire-react-hook-form-with-zod-validation',
    category: 'react',
    title:
      'Build a multi-step form where client feedback and real validation never disagree',
    description:
      'Wires React Hook Form to a Zod schema per step, with cross-field rules expressed at the schema level rather than scattered across handlers, so the instant client-side feedback and the actual submission validation are provably the same rules.',
    promptText: `You are building a multi-step form using React Hook Form with Zod for validation. The schema is the single source of truth for what counts as valid — the instant per-field feedback the user sees while typing and the validation that runs at actual submission time must be provably the same rules, not two hand-maintained copies that can drift apart.

FORM STEPS
{{form_steps}}

FIELD LIST
{{field_list}}

CROSS-FIELD RULES
{{cross_field_rules}}

SUBMIT BEHAVIOR
{{submit_behavior}}

IMPLEMENTATION RULES
Define one Zod schema per step, and compose them into a single schema for final submission using a discriminated approach or .merge(), so a rule never has to be written twice for the per-step case and the whole-form case. Wire the schema to React Hook Form through zodResolver, and do not additionally hand-write field-level validate functions that duplicate a rule already expressed in the schema — every validation rule belongs in exactly one place. For cross-field rules — a confirmation field matching a password field, an end date that must fall after a start date — implement them with the schema's own .refine() or .superRefine(), attached to the specific field path via the second argument so the resulting error attaches to the right field and not to the form as a whole; a cross-field rule implemented instead as a scattered onChange handler comparing two field values manually is exactly the kind of duplicate logic this schema-first approach is meant to eliminate. Use React Hook Form's default uncontrolled-registration approach (register) for plain text and number fields to get its documented performance benefit of not re-rendering the whole form on every keystroke, and only use Controller for fields that genuinely need to be controlled — a third-party component that only accepts a value/onChange pair and has no ref-based API of its own. For the multi-step flow, validate only the current step's fields when the user clicks Next, using the appropriate schema slice, but validate the full combined schema at the final submission regardless of which step introduced a since-corrected error, so a user cannot bypass a rule by fixing it, going back, and resubmitting from a step where it now appears satisfied in isolation.

OUTPUT FORMAT
1. The per-step Zod schemas and the composed full-form schema.
2. The form component wiring, showing register usage, any Controller usage and why it was needed there specifically, and the step-by-step validation trigger.
3. The cross-field rule implementation, shown as real code attached to the correct field path.
4. Confirmation that no validation rule exists in more than one place across the client feedback and the submission path.`,
    variables: [
      {
        name: 'form_steps',
        description: 'The steps the multi-step form is broken into.',
        example:
          '1) Account details (email, password, confirm password). 2) Company details (company name, size). 3) Billing (plan, start date, end date for a trial).',
        required: true,
      },
      {
        name: 'field_list',
        description: 'The fields across all steps, with their types and constraints.',
        example:
          'email (string, valid email), password (string, min 10 chars, one number), confirmPassword (string, must match password), companyName (string, required), planStartDate (date), planEndDate (date)',
        required: true,
      },
      {
        name: 'cross_field_rules',
        description: 'Rules that depend on more than one field at once.',
        example:
          'confirmPassword must exactly match password; planEndDate must be strictly after planStartDate.',
        required: true,
      },
      {
        name: 'submit_behavior',
        description:
          'What happens on final successful submission and on a submission-time failure.',
        example:
          'On success, POST the combined payload and redirect to /welcome; on a server-side rejection (e.g., email already registered), show the error attached to the email field on step 1, even if the user is currently on step 3.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: [
      'react-hook-form',
      'zod',
      'form-validation',
      'multi-step-forms',
      'schema-validation',
    ],
    whyItWorks:
      "Treating the Zod schema as the single source of truth, and explicitly forbidding a duplicate hand-written validate function for a rule the schema already expresses, closes the most common real-world bug in multi-step forms: the client-side feedback rule and the actual server-accepted rule quietly drift apart over a few sprints as someone tweaks one and forgets the other, and users start seeing a field marked valid on screen that the backend then rejects, or vice versa, with no code change ever intentionally introducing that disagreement. Requiring cross-field rules to live in .refine() or .superRefine() attached to the correct field path, rather than in a scattered onChange comparison, matters because Zod's schema-level refinement is what lets the exact same rule run identically whether it's triggered by live per-field feedback, a step transition, or the final submission — a handler-based comparison, by contrast, only runs when that specific handler fires, which means it can be silently skipped by a different code path (autofill, a paste event, a programmatic value set) that never triggers the handler at all. The register-versus-Controller distinction is a real, documented React Hook Form performance mechanism, not a style preference: register wires a field through an uncontrolled ref so most keystrokes never trigger a form-wide re-render, while Controller necessarily re-renders on every value change to keep a controlled component in sync, so defaulting every field to Controller — a common AI-generated pattern — silently reintroduces the exact per-keystroke re-render cost React Hook Form was chosen specifically to avoid. Composing per-step schemas with .merge() into one full-form schema, rather than writing the full-form schema by hand as a second document, is what actually guarantees the final-submission validation and the per-step validation can never fall out of sync with each other — since the full schema is derived from the same step schemas the per-step Next-button check already uses, a rule added to step one's schema is automatically part of the final validation with no second edit required, whereas two independently maintained schemas covering overlapping fields are exactly the kind of duplication this whole prompt is designed to eliminate in the first place.",
    exampleOutput: `const step1Schema = z.object({
  email: z.string().email(),
  password: z.string().min(10).regex(/\\d/),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

const step3Schema = z.object({
  planStartDate: z.coerce.date(),
  planEndDate: z.coerce.date(),
}).refine(data => data.planEndDate > data.planStartDate, {
  message: 'End date must be after the start date',
  path: ['planEndDate'],
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
const { register, trigger, formState: { errors } } = useForm({ resolver: zodResolver(fullSchema) });

// Next button on step 1: await trigger(['email', 'password', 'confirmPassword']) before advancing.
// Final submit validates against fullSchema automatically via the resolver.

No duplicate rules: password confirmation and date ordering exist only inside their respective .refine() calls — no matching onChange comparison exists anywhere else in the form component.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 using React Hook Form 7 and Zod 4.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-build-accessible-drag-and-drop-reordering',
    category: 'react',
    title: 'Build drag-and-drop reordering that works without a mouse',
    description:
      'Implements a reorderable list with pointer-based drag-and-drop plus a full keyboard-operable fallback and live-region announcements, since drag interactions are invisible to screen readers and unusable without a pointer unless built in from the start.',
    promptText: `You are implementing drag-and-drop reordering for a list of items. The pointer-based drag interaction is only half the requirement — you are equally responsible for a keyboard-operable path that produces the identical reordering result, and for announcing what happened to assistive technology, since a drag gesture by itself is invisible to a screen reader and unusable without a pointing device.

LIST
{{list_description}}

DRAG-AND-DROP APPROACH
{{dnd_approach}}

KEYBOARD REQUIREMENT
{{keyboard_requirement}}

ITEM COUNT
{{item_count}}

IMPLEMENTATION RULES
If using native HTML5 drag-and-drop, be aware of and account for its real, documented limitations before building on it: it has inconsistent and generally poor support on touch devices, no built-in keyboard interaction at all, and famously fiddly default drag-image and drop-effect behavior across browsers — most of these limitations are why a dedicated library is usually the better default for anything beyond a quick desktop-only prototype. Implement the keyboard path as its own, real interaction, not an afterthought bolted onto the pointer path: focus an item, press a designated key such as Space or Enter to pick it up, use arrow keys to move it up or down the list while it's picked up, and press the same key again to drop it in its new position — this is a documented WAI-ARIA design pattern for reorderable lists, not an invented convention, and it must produce exactly the same final order a pointer drag would produce for the same move. Announce every state change to assistive technology through an ARIA live region — when an item is picked up, when it moves to a new position during either pointer or keyboard interaction, and when it is dropped — stating the item's name and its new position out of the total count, since none of this is otherwise perceivable without sight. Persist the reordered result the same way regardless of which interaction method produced it — the backend or state update must never know or care whether the reorder came from a pointer drag or a keyboard move. Use aria-live="polite" rather than "assertive" for the position announcements unless the reorder is the sole focus of the whole screen, since an assertive live region interrupts whatever the screen reader is already announcing, and a rapid sequence of arrow-key moves through an assertive region produces a jarring stream of interruptions rather than the calm running commentary a polite region provides.

OUTPUT FORMAT
1. The pointer-based drag implementation, as real code, naming the library or native API used and why.
2. The keyboard-operable implementation, as real code, showing the pick-up, move, and drop key bindings.
3. The live-region announcement logic, showing the exact text pattern announced.
4. Confirmation that both interaction paths call the same underlying reorder function, so the persisted result cannot diverge based on input method.`,
    variables: [
      {
        name: 'list_description',
        description: 'What is being reordered.',
        example:
          'A list of 12 dashboard widgets a user can rearrange to customize their layout.',
        required: true,
      },
      {
        name: 'dnd_approach',
        description:
          'The library or native API planned or already in use for the pointer interaction.',
        example:
          'dnd-kit, already a dependency elsewhere in the app for a different drag-and-drop feature.',
        required: true,
      },
      {
        name: 'keyboard_requirement',
        description: 'What level of keyboard support is required.',
        example:
          'Must fully match WCAG 2.2 AA — keyboard users must be able to reach the same final states a mouse user can.',
        required: true,
      },
      {
        name: 'item_count',
        description: 'Roughly how many items are typically in the list.',
        example: 'Usually 8 to 15 widgets; never more than 30.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'drag-and-drop',
      'accessibility',
      'keyboard-navigation',
      'aria-live',
      'dnd-kit',
    ],
    whyItWorks:
      "Naming HTML5 native drag-and-drop's real, specific limitations up front — no keyboard support at all, unreliable touch behavior — is what stops the model from defaulting to the browser-native API purely because it requires no extra dependency, which is a common but incomplete choice: it produces a feature that works for a mouse user and silently excludes touch and keyboard users from a capability everyone else has, without any error or warning ever surfacing to signal the gap. Specifying the pick-up, arrow-move, drop key sequence as a documented WAI-ARIA pattern, not an invented one, matters because it is what a screen-reader user or assistive-technology vendor actually expects from a reorderable list — inventing a different keyboard scheme, however reasonable it seems in isolation, creates a UI that technically has keyboard support but doesn't match the interaction pattern real assistive technology users already know, which is nearly as bad as having none. The live-region requirement addresses something a pointer drag genuinely cannot communicate on its own: a sighted mouse user sees the item visually move and settle into a new position, but that entire signal is invisible without sight, so without an explicit announcement of the item's name and new position, a screen-reader user who successfully executes a keyboard reorder has functionally no way to confirm what just happened or where the item actually ended up. The polite-versus-assertive distinction matters because it is the difference between an announcement pattern that scales to real keyboard use and one that only looks correct in a single-move test: a user who presses the arrow key five times in quick succession to move an item from position two to position seven will trigger five separate live-region updates, and an assertive region interrupts and restarts the screen reader's speech for each one, producing a garbled overlapping mess, while a polite region queues them so each announcement finishes before the next begins, which is the actual, tested behavior real screen-reader users rely on for exactly this kind of rapid, repeated update.",
    exampleOutput: `// Pointer path (dnd-kit): SortableContext + useSortable per item, standard drag handlers.

// Keyboard path — bound to the same item's handle button:
function handleKeyDown(e, index) {
  if (e.key === ' ' || e.key === 'Enter') { setPickedUpIndex(index); announce(\`Picked up \${items[index].name}\`); }
  if (pickedUpIndex !== null && e.key === 'ArrowUp') { moveItem(pickedUpIndex, pickedUpIndex - 1); setPickedUpIndex(pickedUpIndex - 1); announce(\`\${items[pickedUpIndex - 1].name}, position \${pickedUpIndex} of \${items.length}\`); }
  // ArrowDown mirrors ArrowUp; Space/Enter again drops: setPickedUpIndex(null); announce(\`Dropped \${items[pickedUpIndex].name}\`);
}

// Both paths call the same reorderWidgets(fromIndex, toIndex) function that updates state and persists the new order — the backend has no visibility into which interaction produced the call.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-26' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1) using dnd-kit.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-build-infinite-scroll-with-cursor-pagination',
    category: 'react',
    title: 'Build infinite scroll that never shows duplicate or skipped items',
    description:
      'Implements an infinite-scroll list backed by cursor-based pagination and an IntersectionObserver trigger, guarding explicitly against the duplicate-fetch and page-drift bugs that offset-based pagination and naive scroll listeners both produce under real, concurrent data.',
    promptText: `You are implementing infinite scroll for a paginated list. You use cursor-based pagination, not offset-based, and an IntersectionObserver to trigger the next fetch — and you explicitly guard against the duplicate-fetch and stale-request bugs that make naive infinite scroll implementations unreliable under real-world timing and real concurrent data changes.

LIST
{{list_description}}

API PAGINATION SHAPE
{{api_pagination_shape}}

FETCH LIBRARY
{{fetch_library}}

SCROLL RESTORATION REQUIREMENT
{{scroll_restoration_requirement}}

IMPLEMENTATION RULES
If the API supports cursor-based pagination — a token or an id marking where the next page should start — use it instead of an offset or page number, and explain why if the API only offers offset-based pagination: offset pagination is provably incorrect when items are inserted or removed between page fetches, because every subsequent page's starting position shifts by exactly the number of items that changed, producing either a duplicate item repeated across two pages or a skipped item that never appears at all, while a cursor tied to a specific item's identity is unaffected by insertions or deletions elsewhere in the list. Trigger the next page fetch using an IntersectionObserver watching a sentinel element near the end of the rendered list, not a scroll event listener — scroll events fire far more frequently than needed and require manual throttling to avoid janking the main thread, while IntersectionObserver is purpose-built for exactly this and fires only when the sentinel's visibility actually changes. Guard against firing a duplicate fetch for the same page: track whether a fetch for the next cursor is already in flight, in a ref or the fetch library's own status, and ignore any additional intersection trigger that fires while one is already pending — a fast scroll or a layout shift can trigger the observer's callback multiple times in quick succession before the first request even resolves. If the fetch library maintains its own cache and pagination state, such as TanStack Query's useInfiniteQuery, use its built-in mechanisms for tracking pages, next cursors, and in-flight status rather than duplicating that bookkeeping by hand alongside it. If scroll position must be restored — returning from a detail view back to the exact scroll position in the list — persist enough information to re-fetch or re-render every previously-loaded page up to that point, not just to set the numeric scrollTop value against a list that no longer has the same items loaded.

OUTPUT FORMAT
1. The pagination approach and fetch trigger, as real code.
2. The specific duplicate-fetch guard, shown explicitly, not left implicit in the fetch library's defaults.
3. Why cursor pagination was used, or an explicit note if the API only supports offset and what the accepted risk is as a result.
4. The scroll-restoration implementation, if required, or a note that it was not required and was left out.`,
    variables: [
      {
        name: 'list_description',
        description: 'What is being infinitely scrolled.',
        example:
          'An activity feed showing new posts from followed accounts, ordered newest first.',
        required: true,
      },
      {
        name: 'api_pagination_shape',
        description: 'What the backend API actually returns for pagination.',
        example:
          'GET /feed?cursor=<opaque_string>&limit=20 returns { items: [...], nextCursor: string | null }.',
        required: true,
      },
      {
        name: 'fetch_library',
        description: 'What is used to make and cache the requests.',
        example: 'TanStack Query v5, already used elsewhere in the app.',
        required: true,
      },
      {
        name: 'scroll_restoration_requirement',
        description: 'Whether returning to this list needs to restore scroll position.',
        example:
          'Yes — tapping a post to view its detail and pressing back must return to the exact same scroll position with the same items still loaded.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'infinite-scroll',
      'pagination',
      'intersectionobserver',
      'tanstack-query',
      'performance',
    ],
    whyItWorks:
      'The offset-versus-cursor distinction is not a stylistic preference, it is a provable correctness issue under a specific, common real-world condition: if even one item is inserted at the top of a feed between two page fetches, every offset-based page after that point shifts by one, which means the next fetch, still asking for "items 20 through 40," now returns an item already shown on the previous page and silently omits one further down the list — a bug that is invisible in a static demo with no new data arriving and appears specifically in production, on a live, frequently-updated feed, which is exactly the situation infinite scroll is usually built for in the first place. Requiring an explicit in-flight guard against duplicate fetches targets a real, common IntersectionObserver quirk: a fast scroll, a layout shift from an image loading, or even React re-rendering the sentinel element can cause the observer\'s callback to fire more than once in quick succession before the first triggered request has resolved, and without an explicit guard this produces either a duplicate page fetch or, worse, out-of-order pages appended in the wrong sequence if the second request happens to resolve before the first. Calling out useInfiniteQuery\'s built-in cursor and status tracking, rather than having the model reimplement the same bookkeeping by hand next to it, matters because a hand-rolled parallel tracking mechanism is exactly where these implementations tend to drift out of sync with the library\'s own internal state — two sources of truth for the same "is a fetch currently pending" question is a subtle, recurring source of the exact duplicate-fetch bug this whole prompt is built to prevent. The scroll-restoration requirement to re-render every previously-loaded page, rather than jump straight to a saved numeric scrollTop, matters because scrollTop is meaningless against a DOM that does not yet contain the same content it was measured against — restoring a raw pixel offset to a list that currently has only its first twenty items mounted places the viewport partway down content that has not been fetched yet, which either shows blank space or, on a list with variable-height items, lands the user at a visually wrong position entirely, whereas re-fetching or re-rendering the same pages first guarantees the DOM the scrollTop value was originally measured against actually exists again before the restoration happens.',
    exampleOutput: `const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => fetchFeed({ cursor: pageParam }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

const sentinelRef = useRef(null);
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); // isFetchingNextPage guard prevents a duplicate trigger mid-request
    }
  });
  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

Cursor pagination used per the API's own nextCursor field — no offset risk here. Scroll restoration: persisted the full list of loaded page cursors in the router's navigation state, so returning to the feed re-renders every previously-loaded page before restoring scrollTop, rather than restoring a raw scroll number against a list that would otherwise only have its first page loaded.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-29' },
      { tool: 'Cursor', version: 'Cursor 2.1', date: '2026-08-06' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 using TanStack Query 5.',
      },
    ],
    serviceTarget: 'custom-software',
  },
  {
    slug: 'react-subscribe-to-external-store-with-usesyncexternalstore',
    category: 'react',
    title: 'Replace an ad hoc useEffect subscription with useSyncExternalStore',
    description:
      'Migrates a manual useEffect-plus-useState subscription to an external, non-React data source onto useSyncExternalStore, closing the tearing risk under concurrent rendering that the manual pattern cannot rule out.',
    promptText: `You are migrating a component's subscription to an external, non-React data source — a browser API, a third-party SDK, a plain module-level store — from a manual useEffect-plus-useState pattern to useSyncExternalStore, React's dedicated primitive for exactly this case.

EXTERNAL SOURCE
{{external_source_description}}

CURRENT SUBSCRIPTION CODE
{{current_subscription_code}}

SNAPSHOT SHAPE
{{snapshot_shape}}

SSR REQUIREMENT
{{ssr_requirement}}

MIGRATION RULES
Write a getSnapshot function that reads the current value directly from the external source, synchronously, with no side effects — it must be pure and fast, since React may call it many times per render to check whether the value has changed. The value getSnapshot returns must be either a primitive or a stable reference that only changes identity when the underlying data has actually changed; if getSnapshot constructs a brand-new object or array on every call even when the underlying data is identical, React will conclude the snapshot changed on every single render and useSyncExternalStore will fall into an infinite re-render loop — cache or memoize the snapshot at the source so the same underlying state always produces the same reference. Write a subscribe function that registers a listener with the external source and returns an unsubscribe cleanup function; React calls this once and manages calling your provided callback whenever it needs to re-check the snapshot, so this function's only job is wiring the listener, not tracking any state of its own. Do not keep the old useEffect-plus-useState version running alongside the new hook "just in case" — the entire point of this migration is to remove the specific class of bug the old pattern cannot rule out: under concurrent rendering, a component using useEffect-plus-useState to mirror external state can render with a value that is momentarily inconsistent with what a sibling component reading the same external source renders in the same commit, a phenomenon called tearing, which useSyncExternalStore is specifically designed to prevent by construction. If this component can render on the server, provide a third argument, getServerSnapshot, that returns a safe, deterministic value for the server render — never assume getSnapshot itself is safe to call in an environment where the external source (a browser global, typically) does not exist.

OUTPUT FORMAT
1. The getSnapshot and subscribe functions, as real code, with the stable-reference caching explained inline as a comment where it happens.
2. The updated component using useSyncExternalStore, replacing the removed useEffect and useState entirely.
3. The getServerSnapshot implementation if SSR applies, or an explicit note that it was omitted and why that's safe here.
4. A one-line description of the specific tearing scenario this migration prevents for this exact external source.`,
    variables: [
      {
        name: 'external_source_description',
        description: 'What the non-React data source is.',
        example:
          'A module-level WebSocket client that maintains a live connectionStatus (connected/reconnecting/disconnected) shared across the whole app.',
        required: true,
      },
      {
        name: 'current_subscription_code',
        description: 'The existing useEffect-plus-useState pattern being replaced.',
        example:
          'useEffect(() => { const handler = s => setStatus(s); wsClient.on("statusChange", handler); setStatus(wsClient.status); return () => wsClient.off("statusChange", handler); }, []);',
        required: true,
      },
      {
        name: 'snapshot_shape',
        description:
          'What shape the read value takes, and whether it is already a stable reference.',
        example:
          "A string enum: 'connected' | 'reconnecting' | 'disconnected' — already a primitive, so no extra caching is needed for reference stability.",
        required: true,
      },
      {
        name: 'ssr_requirement',
        description: 'Whether this component can render on the server.',
        example:
          'Yes — this status indicator appears in a server-rendered header; the WebSocket obviously does not exist during the server render.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'ChatGPT', 'Claude'],
    tags: [
      'usesyncexternalstore',
      'external-stores',
      'concurrent-rendering',
      'ssr',
      'state-management',
    ],
    whyItWorks:
      'The stable-reference requirement on getSnapshot is the single most common bug in a hand-rolled useSyncExternalStore migration, and it is worth stating explicitly rather than assuming: because React calls getSnapshot repeatedly to check for changes, a getSnapshot that builds a new object or array literal on every call — even one that is deeply equal to the last one — reads as "changed" every single time under React\'s default reference-equality check, which produces an infinite render loop that looks like a performance bug but is actually a correctness bug in the snapshot function itself, and it is exactly the kind of mistake a model will make by default when translating a useState value that used to be freely recreated into a getSnapshot function with no comment warning against it. Tearing — the actual problem useSyncExternalStore exists to solve — is a real, documented consequence of concurrent rendering that the plain useEffect-plus-useState pattern genuinely cannot rule out: React can pause a render mid-way through, let an external mutation happen, and resume, which means two components both mirroring the same external value through separate useEffect subscriptions can end up rendering different values within what the user experiences as a single, atomic UI update, and useSyncExternalStore is specifically the primitive React itself uses internally, and that libraries like Redux and Zustand build on, to guarantee all consumers of one external source stay consistent within a single render. Requiring an explicit getServerSnapshot rather than letting getSnapshot run unguarded on the server closes a specific and common SSR crash: a getSnapshot that reads window.someGlobal or a similar browser-only value throws immediately during a server render where that global was never defined, and a model that has only ever seen this pattern used client-side will not reach for the third argument unless it\'s asked to consider SSR explicitly. Removing the old useEffect-plus-useState version entirely, rather than leaving it in place "just in case," matters because a codebase with both patterns subscribing to the same external source side by side is worse than either one alone: the two can now individually pass their own tests while still tearing relative to each other, since useSyncExternalStore\'s consistency guarantee only covers components that actually use it, and a straggling useEffect-based subscriber elsewhere is exactly the kind of leftover that undoes the whole point of migrating in the first place.',
    exampleOutput: `function subscribe(callback) {
  wsClient.on('statusChange', callback);
  return () => wsClient.off('statusChange', callback);
}
function getSnapshot() {
  return wsClient.status; // already a primitive string — no extra caching needed for reference stability
}
function getServerSnapshot() {
  return 'disconnected'; // deterministic, safe default — the WebSocket never exists during SSR
}

function ConnectionIndicator() {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span className={statusStyles[status]}>{status}</span>;
}

Tearing scenario this prevents: without useSyncExternalStore, a header indicator and a footer indicator both mirroring wsClient.status through separate useEffect calls could, under concurrent rendering, briefly show "connected" and "reconnecting" simultaneously within the same commit if the status changed mid-render — useSyncExternalStore guarantees both read the identical value in that render.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code and Claude on Sonnet 4.6.',
      },
    ],
    serviceTarget: 'custom-software',
  },
]
