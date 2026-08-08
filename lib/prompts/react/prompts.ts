import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'extract-custom-hook-from-component-logic',
    category: 'react',
    title: 'Extract a reusable hook from tangled component logic',
    description:
      'Pulls one piece of stateful logic out of a component into a properly named custom hook with a minimal, typed return contract, without changing runtime behavior.',
    promptText: `<role>
You are a senior React engineer extracting a custom hook from an existing component without changing its runtime behavior.
</role>

<component>
{{component_code}}
</component>

<extraction_target>
Pull out the logic responsible for: {{logic_to_extract}}
</extraction_target>

<rules>
- Name the hook use<Something> based on what it does, not how it's implemented (useDebouncedSearch, not useStateAndEffect).
- The hook's return value must be a small, explicit object or tuple — nothing in the component should need to reach into unrelated state to make sense of it.
- Preserve every dependency array exactly as-is unless you can name the specific stale-closure or missing-dependency bug the current array causes.
- Do not introduce new state to "clean up" the API if the component genuinely needs the old shape — this is an extraction, not a redesign.
- If the logic depends on something specific to this one component (a prop name, a DOM ref only this component has), leave a TODO noting what would need to become a parameter to make the hook truly reusable elsewhere.
</rules>

<output_format>
1. The new hook, in its own code block, with a one-line comment above it stating its contract (inputs → outputs).
2. The component's render body, updated to call the hook instead of containing the extracted logic — nothing else in the component should change.
3. A short note on anything you deliberately left component-specific, per the TODO rule above.
</output_format>`,
    variables: [
      {
        name: 'component_code',
        description: 'The full component you are extracting logic from.',
        example:
          'function ProductSearch() { const [query, setQuery] = useState(""); const [results, setResults] = useState([]); useEffect(() => { const id = setTimeout(() => fetch("/api/search?q=" + query).then(r => r.json()).then(setResults), 300); return () => clearTimeout(id); }, [query]); return (...); }',
        required: true,
      },
      {
        name: 'logic_to_extract',
        description: 'Which piece of logic should become the hook.',
        example:
          'the debounced search input state and the effect that fires the API call and stores the results',
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
    ],
    whyItWorks:
      'The use<Something>-by-behavior naming rule forces the model to think about the hook\'s contract before its implementation, which is the actual difference between a genuinely reusable hook and a chunk of code that was just moved to a new file. Preserving the dependency array unless a specific bug is named stops a common failure mode where an LLM "fixes" a useEffect dependency array during an unrelated extraction and silently changes when the effect fires. The mandatory TODO for component-specific coupling matters because the biggest lie in hook extraction is pretending something is generic when it still reads a prop only the original component has — naming that explicitly is what lets a future reader actually reuse the hook instead of copy-pasting it and hoping.',
    exampleOutput: `function useDebouncedSearch(delay = 300) {
  // Inputs: none. Outputs: { query, setQuery, results }.
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  useEffect(() => {
    const id = setTimeout(() => {
      fetch('/api/search?q=' + query).then(r => r.json()).then(setResults);
    }, delay);
    return () => clearTimeout(id);
  }, [query, delay]);
  return { query, setQuery, results };
}

function ProductSearch() {
  const { query, setQuery, results } = useDebouncedSearch();
  return (/* unchanged JSX */);
}

Note: no component-specific coupling found — this hook is reusable as-is.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-14' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-14',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'decompose-a-god-component-into-smaller-pieces',
    category: 'react',
    title: 'Break a 600-line component into a maintainable tree',
    description:
      'Splits an overgrown component along its actual seams — data, layout, and interaction — instead of arbitrarily, and flags where props should become context.',
    promptText: `<role>
You are refactoring an overgrown React component into smaller components, without changing what the user sees or how the component behaves.
</role>

<component>
{{component_code}}
</component>

<context>
This component currently handles: {{responsibilities}}
</context>

<decomposition_rules>
- Split along actual seams, not line count: a data-fetching concern, a piece of layout that repeats or could stand alone, a self-contained interactive widget (a dropdown, a modal, a form section).
- Every new component must have a name that describes what it renders, not "PartOne" or "Section2".
- State stays as close to where it's used as possible. Only lift state to a parent when two or more of the new children genuinely need to read or write it — don't lift preemptively "in case."
- Pass data down as typed props with names that describe the data, not generic names like data or config.
- If two extracted components end up needing five or more shared props, that's a signal they should be one component or that the shared props belong in context — say so explicitly rather than just doing it.
</decomposition_rules>

<output_format>
1. A one-paragraph plan: the new component tree, named, with a one-line reason for each split.
2. The extracted components, each in its own code block.
3. The original component, now composing the new pieces.
4. Anything you noticed that violates the "five shared props" rule above, even if you didn't act on it.
</output_format>`,
    variables: [
      {
        name: 'component_code',
        description: 'The oversized component to decompose.',
        example:
          'A 600-line Dashboard component that fetches account data, renders a filter bar, a stats grid, a data table with sorting, and an edit-row modal, all in one file.',
        required: true,
      },
      {
        name: 'responsibilities',
        description: 'Plain-language list of what the component currently does.',
        example:
          'Fetches account data, renders filters, renders a stats summary, renders a sortable table, opens an edit modal per row, and handles the save request.',
        required: true,
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
      'Splitting along "seams" — data-fetching, repeated layout, self-contained widgets — instead of a line-count target is what prevents the common bad outcome of a decomposition that produces five equally arbitrary chunks with no independent reason to exist. The rule against lifting state preemptively directly targets the most common overcorrection after a god-component review: once someone decides a component is "too big," the reflex is to lift everything to be safe, which just recreates prop drilling one level up. The five-shared-props heuristic gives a concrete, countable trigger for "this split created a context problem" instead of a vague call for judgment, so the model has to notice and report a real coupling signal rather than silently produce it.',
    exampleOutput: `Plan: split Dashboard into FilterBar (filter state + controls), AccountStatsGrid (pure display of summary numbers), AccountTable (sorting + row rendering), and EditAccountModal (its own open/close state). Data fetching stays in Dashboard since only it and AccountTable need the raw list — passed down as a typed \`accounts: Account[]\` prop.

Flag: AccountTable and EditAccountModal need seven shared values (account, onSave, onClose, isOpen, errors, isSaving, fieldConfig) — recommend merging them into one AccountEditor component rather than two components wired together.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-16' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-16',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'audit-react-component-for-unnecessary-re-renders',
    category: 'react',
    title: 'Audit a component for wasted re-renders before adding memo everywhere',
    description:
      'A diagnosis-first performance audit that finds the actual re-render trigger and only recommends useMemo, useCallback, or memo where profiling evidence supports it.',
    promptText: `<role>
You are auditing a React component for unnecessary re-renders. You diagnose before you prescribe — you do not wrap everything in memo, useMemo, and useCallback as a reflex.
</role>

<component>
{{component_code}}
</component>

<profiling_context>
{{profiler_evidence}}
</profiling_context>

<react_compiler_status>
React Compiler is: {{react_compiler_enabled}}
</react_compiler_status>

<diagnostic_steps>
1. If React Compiler is enabled, most manual useMemo/useCallback/memo in this file is redundant — flag any hand-written memoization the compiler already handles, and recommend removing it rather than adding more.
2. If React Compiler is not enabled, identify the actual re-render trigger for each suspected problem area: a new object/array/function literal created on every render and passed as a prop, a parent re-rendering for unrelated reasons, or a genuinely expensive computation running on every render.
3. Only recommend useMemo for computations you can name as expensive (not "might be slow" — name the actual work: sorting a large array, a regex over long text, a derived object built from several props).
4. Only recommend useCallback where the function is passed to a memoized child or used as an effect dependency — a useCallback with no memoized consumer is nearly always dead weight, not a fix.
5. If the real problem is architectural (state that's too high in the tree, a context value that changes too often), say so instead of reaching for memoization to paper over it.
</diagnostic_steps>

<output_format>
A table: Location | Suspected issue | Root cause | Recommendation | Confidence (high/medium/low). Then a one-paragraph summary of the single highest-impact fix.
</output_format>`,
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
          'What React DevTools Profiler (or console.count / why-did-you-render) actually showed.',
        example:
          'Profiler flame graph shows ProductList re-rendering 1:1 with every SearchBox keystroke, even though ProductList props (besides onSelect) are unchanged.',
        required: true,
      },
      {
        name: 'react_compiler_enabled',
        description:
          'Whether React Compiler is enabled in this project — changes the whole recommendation set.',
        example: 'no',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: ['performance', 'usememo', 'usecallback', 'react-compiler', 'profiling'],
    whyItWorks:
      "React Compiler auto-memoizes components and values that are safe to memoize, so once it's enabled, hand-written useMemo/useCallback/memo calls are usually redundant and occasionally a correctness risk if their dependency arrays drift out of sync with what the compiler now assumes — which is why the prompt branches the entire recommendation set on compiler status instead of giving one generic answer. The requirement to name the actual expensive computation, rather than accept \"might be slow,\" mirrors the React team's own documented caution that memoization has a real cost (extra comparisons, extra memory) and shouldn't be applied speculatively. The useCallback-needs-a-memoized-consumer rule targets the single most common mistake in AI-generated performance audits: recommending useCallback reflexively on every handler without checking whether anything downstream is actually memoized to benefit from a stable reference.",
    exampleOutput: `Location | Suspected issue | Root cause | Recommendation | Confidence
ProductList | Re-renders every keystroke | onSelect prop is a new arrow function on every SearchBox render | Wrap onSelect in useCallback in the parent (ProductList's memo is already correct) | high
SearchBox | none flagged | — | — | —

Summary: the highest-impact fix is a single useCallback in the parent around onSelect — ProductList's own React.memo is working as intended, it's being defeated by an unstable prop reference one level up.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'design-suspense-boundaries-for-a-data-heavy-page',
    category: 'react',
    title: "Design Suspense boundaries that don't turn into one big spinner",
    description:
      'Places Suspense boundaries around real data-fetching seams so a page reveals content progressively instead of waterfalling requests or blocking on one top-level spinner.',
    promptText: `<role>
You are designing where Suspense boundaries go on a data-heavy page, so the page reveals content progressively instead of either waterfalling requests or blocking everything behind one top-level spinner.
</role>

<page>
{{page_description}}
</page>

<data_dependencies>
{{data_dependencies}}
</data_dependencies>

<fetching_approach>
{{data_fetching_approach}}
</fetching_approach>

<design_rules>
- Start requests as early as possible — as close to the route/component entry point as the fetching approach allows — even if the component that renders the result is deep in the tree and behind its own Suspense boundary. Never gate the start of a fetch behind the boundary that displays it.
- One Suspense boundary per independently-loading region of the UI, not one boundary per component. Group things that should visually appear together and can tolerate loading together.
- Never put a slow, non-critical section (comments, related items, a sidebar widget) in the same boundary as the primary content — an unrelated slow request should not delay what the user actually came for.
- Name a fallback for every boundary that matches the shape of what it's replacing (a skeleton with the right layout, not a generic spinner), so the loading state doesn't cause a visible layout jump.
- Call out any place where two sibling boundaries would race in a way that produces a confusing partial layout, and resolve it by grouping them into one boundary instead.
</design_rules>

<output_format>
1. A tree diagram (text is fine) showing where each Suspense boundary sits and what's inside it.
2. For each boundary: what triggers its fallback, and what the fallback should look like.
3. Any request-waterfall risk you found and how the boundary placement avoids it.
</output_format>`,
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
          'Profile header needs a fast /profile call; stats row needs a separate /stats call that is usually slower; posts grid needs /posts?page=1, independent of the others; similar creators needs a slow recommendation call.',
        required: true,
      },
      {
        name: 'data_fetching_approach',
        description: 'The library or pattern used to fetch and expose data to Suspense.',
        example: 'TanStack Query hooks with suspense: true',
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
      'The "start the fetch before the boundary that displays it" rule targets React\'s own documented render-as-you-fetch guidance: if a component only starts fetching inside its own effect or on mount, and that component is the thing hidden by a Suspense fallback, the fetch can\'t even begin until the boundary above it has already resolved something else — that\'s a self-inflicted waterfall, and it\'s the single most common Suspense mistake. Grouping boundaries by what should visually appear together, rather than one boundary per component, is the documented fix for the "popcorn" effect where unrelated pieces of a page pop in one at a time in a distracting, unplanned order. Separating a slow non-critical section (recommendations, comments) into its own boundary is what actually delivers the promised benefit of Suspense — a fast primary experience — instead of accidentally re-creating one big spinner because everything shares a boundary with the slowest request on the page.',
    exampleOutput: `<ProfilePage>
  <Suspense fallback={<HeaderSkeleton />}>       ← header + stats, fetch started at route entry
    <ProfileHeader />
    <StatsRow />
  </Suspense>
  <Suspense fallback={<PostsGridSkeleton />}>    ← independent, can resolve before or after header
    <PostsGrid page={1} />
  </Suspense>
  <Suspense fallback={<SimilarCreatorsSkeleton />}> ← slow recommendation call, isolated so it never blocks the above
    <SimilarCreators />
  </Suspense>
</ProfilePage>

Waterfall risk: header and stats were originally one call each — merged into one boundary since they're requested together and always appear together, avoiding a two-step pop-in for content that reads as one unit.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code and Claude on Sonnet 4.6 with TanStack Query.',
      },
    ],
  },
  {
    slug: 'convert-a-form-to-react-19-actions',
    category: 'react',
    title: "Convert a form's manual state juggling to React 19 Actions",
    description:
      'Migrates an onSubmit-plus-useState form to useActionState, useFormStatus, and useOptimistic where it genuinely helps, instead of hand-rolled pending and error booleans.',
    promptText: `<role>
You are migrating a React form from manual onSubmit + useState plumbing to React 19's Actions APIs — the form action prop, useActionState, useFormStatus, and useOptimistic where it genuinely helps.
</role>

<current_form>
{{form_code}}
</current_form>

<validation_rules>
{{validation_rules}}
</validation_rules>

<submit_behavior>
{{submit_behavior}}
</submit_behavior>

<migration_rules>
- Replace the manual isSubmitting/error/success useState trio with useActionState wrapping a single async action function that does the validation and the submission.
- The action function returns a typed result object (e.g. { error: string | null } or a field-level error map) — never throw past the action boundary for expected validation failures, only for genuinely unexpected errors.
- Use useFormStatus inside a child submit-button component, not the form component itself, to disable the button and show pending state — useFormStatus only reads status from the nearest parent form when called from a descendant of it, and returns default (non-pending) values if called in the same component that renders the form.
- Only add useOptimistic if the UI needs to show the result before the server confirms it (a message appearing instantly in a list). Don't add it just because it's available — most forms should wait for the real result.
- Keep client-side validation for instant per-field feedback, but the action's own validation is the source of truth — don't let the two disagree.
</migration_rules>

<output_format>
1. The migrated form component and its submit-button child component, in separate code blocks.
2. The action function, with its return type made explicit.
3. A short note on which useState calls were removed and what replaced each one.
</output_format>`,
    variables: [
      {
        name: 'form_code',
        description: 'The current form component using onSubmit and manual useState.',
        example:
          'A NewsletterSignup form with useState for email, isSubmitting, and error, an onSubmit handler that calls preventDefault, sets isSubmitting, awaits a fetch, and sets error or success.',
        required: true,
      },
      {
        name: 'validation_rules',
        description: 'What must be true for the submission to succeed.',
        example: 'Email must be non-empty and match a basic email pattern.',
        required: true,
      },
      {
        name: 'submit_behavior',
        description: 'What happens on success and on failure.',
        example:
          'On success, clear the field and show a confirmation message inline; on failure, show the server error message next to the field without clearing it.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: ['react-19', 'actions', 'forms', 'useactionstate', 'useoptimistic'],
    whyItWorks:
      "The child-component rule for useFormStatus is load-bearing, not stylistic: React's own documentation is explicit that useFormStatus must be called from a component rendered inside the form, and calling it in the same component that renders the <form> tag itself returns the default, always-false pending state — a bug that looks like it works in a quick test and then silently never shows a pending state in production. Collapsing three separate useState calls into one useActionState call removes an entire class of bug where isSubmitting, error, and the actual in-flight request can drift out of sync (a fetch that finishes after a component update, for instance) because the pending state now comes directly from the transition React is already tracking, not from a boolean the developer has to remember to flip back. Restricting useOptimistic to cases where the UI genuinely shows a result before confirmation stops the common mistake of adding it to a form where nothing is actually rendered optimistically, which just adds indirection with no visible benefit.",
    exampleOutput: `async function subscribeAction(prevState, formData) {
  const email = formData.get('email');
  if (!email || !/^[^@]+@[^@]+\\.[^@]+$/.test(String(email))) {
    return { error: 'Enter a valid email address.' };
  }
  const res = await fetch('/api/subscribe', { method: 'POST', body: formData });
  if (!res.ok) return { error: 'Something went wrong — try again.' };
  return { error: null };
}

// SubmitButton.tsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Subscribing…' : 'Subscribe'}</button>;
}

Removed: isSubmitting → replaced by useFormStatus's pending. error → replaced by useActionState's returned state. success → replaced by state.error === null after a submission has occurred.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-18' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on React 19.',
      },
    ],
  },
  {
    slug: 'accessibility-audit-for-a-react-component',
    category: 'react',
    title: 'Run an accessibility audit on a component before it ships',
    description:
      'A component-level a11y audit that checks role-specific WCAG success criteria against actual JSX — not a generic "add aria-label everywhere" pass.',
    promptText: `<role>
You are auditing a single React component for accessibility issues that would actually fail a screen-reader or keyboard-only user, not producing a generic checklist.
</role>

<component>
{{component_code}}
</component>

<component_type>
{{component_type}}
</component_type>

<target_level>
Target: {{wcag_level}}
</target_level>

<audit_focus>
For this component type, check specifically:
- Keyboard operability: can every interactive element be reached and operated with Tab/Shift+Tab/Enter/Space/Escape/arrow keys as appropriate for its role, with no keyboard trap?
- Focus management: on open/close (if this is a modal, menu, or disclosure), does focus move to the right place and return to the trigger on close?
- Semantics: does it use the correct native element or ARIA role for what it is, rather than a styled div with onClick standing in for a button or link?
- Name and state exposed to assistive tech: does every control have an accessible name, and do state changes (expanded/collapsed, selected, invalid) get exposed via ARIA attributes, not just visually?
- Color and motion: any information conveyed by color alone, and any animation that should respect prefers-reduced-motion?
</audit_focus>

<output_format>
A table: Issue | WCAG criterion (number and name) | Who it affects | Severity (blocker/major/minor) | Fix. Then flag which issues you couldn't fully assess from static code alone (real color-contrast values, actual screen-reader announcement order) and what manual check would confirm them.
</output_format>`,
    variables: [
      {
        name: 'component_code',
        description: 'The full component to audit.',
        example:
          'A custom Dropdown component built from a styled div with an onClick handler, an absolutely positioned list of divs for options, no keyboard handling.',
        required: true,
      },
      {
        name: 'component_type',
        description: 'What kind of UI element this is — sets which failure modes matter.',
        example: 'combobox / custom select dropdown',
        required: true,
      },
      {
        name: 'wcag_level',
        description: 'The target conformance level, if different from the default AA.',
        example: 'AA',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'Claude', 'ChatGPT', 'GitHub Copilot Chat'],
    tags: ['accessibility', 'a11y', 'wcag', 'aria', 'keyboard-navigation'],
    whyItWorks:
      'Grounding the audit in component_type is what makes the checklist specific instead of generic: a modal\'s real failure modes (focus trap on open, Escape to close, focus returning to the trigger) are different from a combobox\'s (arrow-key navigation between options, aria-activedescendant tracking the highlighted item, aria-expanded reflecting open state) — a plain "check accessibility" prompt tends to default to boilerplate aria-label suggestions regardless of what the component actually is. Citing real WCAG success-criterion numbers keeps every finding falsifiable — a reviewer can go look up 2.1.1 Keyboard or 4.1.2 Name, Role, Value and confirm or reject the finding — instead of an unverifiable "this might be an issue." The explicit instruction to flag what can\'t be assessed from static code alone matters because color contrast against a real rendered background and actual screen-reader announcement order are things a code review genuinely cannot verify, and naming that boundary stops the model from confidently asserting a pass/fail it isn\'t in a position to make.',
    exampleOutput: `Issue | WCAG criterion | Who it affects | Severity | Fix
Div used as trigger, no role/keyboard support | 2.1.1 Keyboard, 4.1.2 Name/Role/Value | Keyboard and screen-reader users | blocker | Use a real <button> with aria-haspopup="listbox" and aria-expanded
No focus moves into the option list on open | 2.4.3 Focus Order | Keyboard and screen-reader users | blocker | Move focus to the first option (or the listbox) on open, return focus to the trigger on close
Selected option shown only via a checkmark icon | 1.4.1 Use of Color | Low-vision users | major | Add aria-selected and a text/shape cue, not color alone

Not assessable from code: actual contrast ratio of the checkmark icon against its background — confirm with a contrast checker on the rendered page.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-19' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-19',
        note: 'Initial publish, verified against Claude (Sonnet 4.6) and ChatGPT (GPT-5.1) against WCAG 2.2 AA.',
      },
    ],
  },
  {
    slug: 'choose-between-lift-state-context-or-a-store',
    category: 'react',
    title: 'Decide whether this state needs lifting, context, or an external store',
    description:
      'A decision-framework prompt that picks the right home for shared state based on update frequency and consumer spread, instead of defaulting to context for everything.',
    promptText: `<role>
You are deciding where a specific piece of state should live in a React app — lifted to a common parent, in Context, or in an external store (Zustand/Jotai/Redux Toolkit) — based on how it's actually used, not by default habit.
</role>

<state>
{{state_description}}
</state>

<component_tree>
{{component_tree_shape}}
</component_tree>

<update_frequency>
{{update_frequency}}
</update_frequency>

<decision_framework>
Walk through in order and stop at the first rule that applies:
1. If only one component and its direct children need this state, lift it to their nearest common parent. Don't reach for Context for a two-level prop pass.
2. If many components across distant branches of the tree need to read it, but it changes rarely (theme, current user, feature flags), Context is appropriate — but split it into its own provider rather than bundling it with frequently-changing state in the same context value.
3. If the state changes frequently (on every keystroke, every scroll, every animation frame) AND is read by components that shouldn't re-render on every change, Context is the wrong tool — every consumer of a context re-renders on every value change regardless of which part of the value it actually uses. Use an external store with selector-based subscriptions instead.
4. If the state needs to persist across route changes, survive a remount, or be read outside the React tree entirely (analytics, a service worker), it belongs in an external store, not component state or Context.
</decision_framework>

<output_format>
1. Which rule applied and why, in one paragraph.
2. The recommended approach with a short code sketch (not a full implementation) showing the shape.
3. What would change your answer — the specific condition that would push this to a different tier if it turned out untrue.
</output_format>`,
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
          'Changes on every row checkbox click — could be dozens of times per session, but not per keystroke or per frame.',
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
      'The re-render mechanic cited in rule 3 is a real, documented React behavior, not folklore: every component that calls useContext on a given context re-renders whenever that context\'s Provider value changes, regardless of which slice of the value that particular consumer actually reads — there\'s no built-in selector mechanism, which is exactly why high-frequency state in Context becomes a measurable performance problem while low-frequency state in Context (theme, current user) is genuinely fine. Structuring the answer as an ordered list with an explicit stop condition prevents the most common failure mode for this kind of question: an LLM listing all three options with generic pros and cons and never committing to one for the actual case in front of it. Asking for "what would change your answer" forces the recommendation to name its own falsification condition, which turns an architectural opinion into something a reviewer can actually check against reality later.',
    exampleOutput: `Rule 2 applies: SelectionCount and BulkActionsBar are in distant branches, but the state changes on every checkbox click, not every keystroke or frame — right at the boundary between rule 2 and rule 3. Given dozens of updates per session rather than continuous updates, a scoped SelectionContext (not the app-wide context) is the right fit, provided BulkActionsBar and SelectionCount are the only consumers.

const SelectionContext = createContext<{ selected: Set<string>; toggle: (id: string) => void } | null>(null);
// Provider wraps only the DataTable + BulkActionsBar + SelectionCount subtree, not the whole app.

What would change this: if the table grows to thousands of rows with per-row visual state tied to selection (e.g. every row re-rendering on any selection change becomes visibly janky), move to a Zustand store with a per-row selector instead.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-17' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-17',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1).',
      },
    ],
  },
  {
    slug: 'write-react-testing-library-tests-for-a-component',
    category: 'react',
    title: 'Write component tests that check behavior, not implementation details',
    description:
      'Generates React Testing Library tests driven by accessible queries and user-visible behavior, with a guard against testing internal state or CSS classes.',
    promptText: `<role>
You are writing tests for a React component using React Testing Library and {{test_runner}}. You test what a user can see and do, not internal state or implementation details.
</role>

<component>
{{component_code}}
</component>

<key_interactions>
{{key_interactions}}
</key_interactions>

<testing_rules>
- Query elements the way a user would find them: getByRole, getByLabelText, getByText. Only fall back to a test-id when there's genuinely no accessible way to find the element, and say so in a comment when you do.
- Never query or assert on component internal state, prop values, or CSS class names directly — if a behavior is worth testing, it's worth testing through what renders or what happens on screen.
- Use userEvent (not fireEvent) for interactions, and always await it — userEvent's interactions are asynchronous, and a missing await is the single most common cause of a flaky test in this stack.
- Write one test per meaningful behavior from {{key_interactions}}, named as a sentence describing the behavior ("shows an error when the field is left empty"), not as "test 1", "test 2".
- Where the component does something conditionally (shows X only when Y), write both the positive and the negative case — don't only test the happy path.
- If the component depends on network requests or a store, mock at that boundary, not by reaching into the component's internals.
</testing_rules>

<output_format>
A complete test file, imports included, using {{test_runner}}. Group related tests with describe blocks that name the feature being tested, not the component's file name.
</output_format>`,
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
        name: 'test_runner',
        description: 'The test runner/framework in use.',
        example: 'Vitest',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'Cursor', 'GitHub Copilot Chat', 'ChatGPT'],
    tags: ['testing', 'react-testing-library', 'vitest', 'user-events', 'test-quality'],
    whyItWorks:
      "The query-by-role-first rule operationalizes Testing Library's actual guiding principle — tests should resemble how users interact with the app — and it doubles as an incidental accessibility check: if an element genuinely can't be found by getByRole or getByLabelText, that's frequently a real a11y gap the component should fix, not just a testing inconvenience to route around with a test-id. The mandatory await on userEvent targets a specific, well-documented bug class: Testing Library's userEvent v14+ methods return promises to accurately simulate real browser event timing, and a missing await is Testing Library's own most commonly cited cause of intermittent, hard-to-reproduce test failures. Requiring both the positive and negative case for every conditional behavior closes the gap where an LLM writes a technically-passing test suite that only ever exercises the happy path and never proves the \"No results\" message actually appears when it should.",
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
});`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-15' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 using React Testing Library 16 and Vitest 3.',
      },
    ],
  },
  {
    slug: 'fix-prop-drilling-without-reaching-for-redux',
    category: 'react',
    title: 'Fix prop drilling without reaching for Redux as the first move',
    description:
      'Fixes a prop-drilling chain with composition or a narrowly-scoped context first, and only escalates to an external store if neither actually solves it.',
    promptText: `<role>
You are fixing a prop-drilling problem in a React component tree. You try composition first, then a narrowly-scoped context, and only recommend an external store if neither one actually solves it.
</role>

<component_tree>
{{component_tree_code}}
</component_tree>

<drilled_props>
{{drilled_props}}
</drilled_props>

<fix_order>
1. Check if the intermediate components that just forward the props even need to know about them — if a middle component only passes the drilled props through without reading them, consider passing the already-composed JSX (children or a render prop) down instead, so the data goes directly from the top to where it's actually used and the middle component's own props shrink.
2. If composition doesn't fit because the intermediate components genuinely branch on the data (conditional rendering based on it, not just passing it along), create a context scoped to just this subtree — not a new top-level app-wide context — and provide it at the lowest common ancestor that has the data.
3. Only recommend an external store if the same data is also needed outside this subtree, or if the update frequency makes context problematic per the re-render-on-every-change behavior of context providers.
4. Do not default to "just use Redux/Zustand" — that's an escalation, not a first response.
</fix_order>

<output_format>
1. Which fix you applied and why the earlier options in the order didn't fit.
2. The updated component tree with the fix applied.
3. The props list for each component, before and after — the point is a visibly shorter list.
</output_format>`,
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
          'user, theme, onUpdateUser — passed through Layout > Sidebar > Panel > Widget',
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
      "Passing already-composed children through the tree is React's own documented alternative to Context for the specific case where intermediate components don't need to read the drilled data, only pass it along — a component that receives finished JSX as a prop doesn't need to know the shape of user or theme at all, which shrinks the middle components' prop lists to nothing rather than just moving the prop names into a context hook. Scoping the fallback context to the subtree that actually needs it, instead of hoisting it to a new top-level provider, keeps the fix proportional and avoids widening the re-render blast radius to the whole app. Making \"try composition, then scoped context, then a store\" an explicit sequence with a stated rule against defaulting to a store directly targets the most common overreaction in this exact prompt category: reaching for the heaviest tool as the first answer to a problem composition alone would have fixed.",
    exampleOutput: `Fix applied: composition. Sidebar and Panel never read user, theme, or onUpdateUser — they only forwarded them — so Layout now renders <Sidebar><Panel><Widget user={user} theme={theme} onUpdateUser={onUpdateUser} /></Panel></Sidebar> directly, passing Widget as pre-composed children through Sidebar and Panel.

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
  },
  {
    slug: 'design-a-component-api-for-a-design-system',
    category: 'react',
    title: "Design a component API that won't need a breaking change in six months",
    description:
      "Designs a design-system component's prop contract by working backward from real use cases, with explicit composition slots instead of a boolean prop for every variant.",
    promptText: `<role>
You are designing the public prop API for a design-system component, before implementation. The goal is an API that covers the real use cases below without a prop explosion or a breaking change when the next use case shows up.
</role>

<component_name>
{{component_name}}
</component_name>

<use_cases>
{{use_cases}}
</use_cases>

<constraints>
{{design_constraints}}
</constraints>

<api_design_rules>
- Start from the use cases, not from a guess at every possible variant. Every prop you propose must trace back to at least one listed use case.
- Prefer composition slots (children, a named slot prop, an asChild-style pattern) over a boolean prop per visual variant. If you're about to propose a fourth boolean like isCompact/isCentered/isBordered, stop and ask whether a variant prop with a closed set of string values, or a composition slot, fits better.
- Every prop needs a default that makes the component usable with zero configuration for the most common use case in the list.
- Name props for what they mean to the consumer, not for the CSS or implementation detail behind them (status, not colorScheme, when the intent is semantic).
- Explicitly list what this component will not support — the use cases you're deliberately not designing for — so scope creep in review has something concrete to push against.
</api_design_rules>

<output_format>
1. The prop table: name, type, default, which use case it serves.
2. A short usage example for the three most common use cases from the list.
3. The explicit out-of-scope list.
</output_format>`,
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
      'Boolean-prop explosion is the single most common way a design-system component\'s API rots over time — isCompact plus isCentered plus isBordered eventually produce combinations nobody actually tested and some that aren\'t even valid together — so giving the model a concrete trigger ("about to write a fourth boolean, stop") is more effective than a vague instruction to "keep it simple," which every design system already claims to want and few achieve. Requiring every prop to trace back to a listed use case is what actually prevents speculative generality: the temptation to add a prop for a use case nobody asked for yet is exactly how APIs accumulate surface area no one uses but everyone has to maintain. The explicit out-of-scope list matters specifically because a design-system component is a shared contract other teams build against — writing down what it deliberately doesn\'t support is the concrete artifact that lets a reviewer six months from now say "that\'s a new use case, it needs its own review" instead of quietly bolting another prop onto an already-overloaded component.',
    exampleOutput: `Prop | Type | Default | Use case
variant | 'info' | 'warning' | 'error' | 'success' | 'info' | all four
dismissible | boolean | false | warning banner (2)
onDismiss | () => void | undefined | warning banner (2)
action | { label: string; onClick: () => void } | undefined | error banner with retry (3)
autoDismissMs | number | undefined | success confirmation (4)

Out of scope: stacked/queued multiple banners at once, and a persistent "banner history" log — both deliberately left for a separate NotificationCenter component.`,
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
  },
  {
    slug: 'migrate-a-class-component-to-a-function-component',
    category: 'react',
    title:
      'Migrate a class component to hooks without silently dropping lifecycle behavior',
    description:
      "A class-to-function migration prompt that maps each lifecycle method to its hook equivalent explicitly, and calls out the cases where the mapping isn't 1:1.",
    promptText: `<role>
You are migrating a class component to a function component with hooks. You preserve the exact same behavior — this is a mechanical migration, not an opportunity to also redesign the component.
</role>

<class_component>
{{class_component_code}}
</class_component>

<lifecycle_notes>
{{lifecycle_methods_used}}
</lifecycle_notes>

<migration_map>
Map each lifecycle method explicitly, and flag any that don't have a clean 1:1 hook equivalent:
- constructor's this.state → one or more useState calls, split by what actually changes together, not one giant state object by default.
- componentDidMount + componentDidUpdate (when they run the same logic) → a single useEffect with the right dependency array. If they run genuinely different logic, that's a sign they need to become separate useEffect calls rather than one merged effect with awkward conditionals inside it.
- componentWillUnmount → the cleanup function returned from the relevant useEffect.
- shouldComponentUpdate → React.memo on the component, with a custom comparator only if the default shallow comparison is provably insufficient.
- getDerivedStateFromProps → usually a sign the value should be computed during render instead of stored in state at all — recommend removing the state entirely if that's true here.
- Instance variables that don't trigger a re-render (this.someRef, a mutable counter) → useRef.
- Error boundaries (componentDidCatch / static getDerivedStateFromError) → these have no hook equivalent — leave the error boundary as a class component and note it explicitly rather than inventing a hook-based substitute.
</migration_map>

<output_format>
1. The migrated function component.
2. A mapping table: old lifecycle method → new hook, with one line on any behavior difference, however small, introduced by the change.
3. Anything left as a class component (per the error-boundary note) and why.
</output_format>`,
    variables: [
      {
        name: 'class_component_code',
        description: 'The class component to migrate.',
        example:
          'class UserPanel extends React.Component { constructor(props) { super(props); this.state = { user: null, loading: true }; } componentDidMount() { this.fetchUser(); } componentDidUpdate(prevProps) { if (prevProps.userId !== this.props.userId) this.fetchUser(); } componentWillUnmount() { this.controller?.abort(); } ... }',
        required: true,
      },
      {
        name: 'lifecycle_methods_used',
        description: 'Which lifecycle methods are in use, if not obvious from the code.',
        example:
          'componentDidMount, componentDidUpdate, componentWillUnmount, shouldComponentUpdate',
        required: false,
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
      "The biggest real risk in this migration isn't syntax, it's timing: componentDidMount and componentDidUpdate get collapsed into one useEffect constantly, and if the dependency array doesn't exactly capture what previously triggered componentDidUpdate, the effect now runs on mount only, or on every render, instead of on the specific prop change the class version handled — a silent behavior change that a naive migration won't flag. Requiring the model to name any lifecycle method without a clean hook equivalent, especially the error-boundary carve-out, stops it from inventing a broken workaround just to claim full completion — componentDidCatch genuinely has no hook equivalent as of current React versions, and a migration that pretends otherwise ships something that silently stops catching errors. Naming getDerivedStateFromProps as usually a sign of unnecessary state pushes the model toward React's own recommended fix — compute the value during render — rather than a mechanical hook swap that would just relocate the same anti-pattern into a useEffect.",
    exampleOutput: `Old lifecycle | New hook | Behavior note
constructor's this.state | useState(null) for user, useState(true) for loading | split into two calls since loading and user don't always change together
componentDidMount + componentDidUpdate(prevProps.userId check) | useEffect(() => { ...fetch... }, [userId]) | identical trigger condition, now expressed as a dependency instead of a manual prop comparison
componentWillUnmount (abort controller) | cleanup function returned from the same useEffect | identical behavior
shouldComponentUpdate | React.memo(UserPanel) | default shallow comparison covers the same fields the original method checked

Left as a class component: none — this component had no componentDidCatch, so a full function migration was possible.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-13' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-13',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1.',
      },
    ],
  },
  {
    slug: 'implement-a-transition-with-react-view-transitions',
    category: 'react',
    title: 'Implement a smooth transition between two UI states in React',
    description:
      'Implements an enter/exit or shared-element transition using the lightest mechanism that actually produces the described motion — CSS, startTransition, or the View Transition API — instead of defaulting to a heavy animation library.',
    promptText: `<role>
You are implementing a specific UI transition in React. You pick the lightest mechanism that actually produces the described motion, not a default reach for a full animation library.
</role>

<transition>
{{transition_description}}
</transition>

<current_code>
{{current_code}}
</current_code>

<animation_approach>
Preferred approach, if specified: {{animation_library}}
</animation_approach>

<selection_rules>
- If the transition is a simple property change (opacity, transform, color) tied to a class or data-attribute toggle, implement it with a CSS transition and let React only toggle the class/state — don't reach for a JS animation library for something CSS already animates natively and more cheaply.
- If the transition needs to happen while a state update or navigation would otherwise cause a jarring instant swap, wrap the state update in startTransition (or useTransition's function) so React can keep showing the old UI, marked as pending, until the new content is ready — this addresses timing, not the visual motion itself.
- If the transition is a genuine shared-element or cross-DOM-tree animation (an item morphing from a list into a detail view), and the target platform supports it, use the View Transition API — React's experimental ViewTransition integration if the project's React version has it, or the native browser API directly otherwise — since this is the one case CSS transitions and startTransition genuinely can't do on their own.
- Only bring in an external animation library (for example Motion) when the transition involves physics-based motion — spring, drag, gesture-driven — that CSS and the View Transition API don't model.
- Respect prefers-reduced-motion for any transition longer than a subtle micro-interaction — either skip it or replace it with an instant or cross-fade equivalent.
</selection_rules>

<output_format>
1. Which mechanism you chose and the one-sentence reason it's the lightest fit for this specific transition.
2. The implementation.
3. The prefers-reduced-motion fallback.
</output_format>`,
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
        example: 'Motion (formerly Framer Motion)',
        required: false,
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
      "This is a decision-tree prompt before it's a code-generation prompt, and the actual failure mode it prevents is the default reach for a full animation library on a transition a CSS transition already handles for free — that's a real, avoidable bundle-size and complexity cost for zero additional visual benefit. Separating startTransition from the View Transition API matters because they solve genuinely different problems that get conflated constantly: startTransition changes when React commits new content and keeps the old UI interactive while marked pending, but it does not animate anything by itself, while the View Transition API is the one mechanism that can actually morph an element's position and size across a DOM change — treating them as interchangeable is a common and specific mistake this prompt heads off by name. The prefers-reduced-motion rule is included because it's a real, testable accessibility requirement, not a nice-to-have, and it's the detail a plain \"make it animate\" request reliably skips.",
    exampleOutput: `Chosen mechanism: the View Transition API — this is a genuine shared-element case (the card needs to visually morph into the detail view), which CSS transitions and startTransition alone can't produce.

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

Reduced-motion fallback: check window.matchMedia('(prefers-reduced-motion: reduce)').matches before calling startViewTransition — if true, navigate directly with no transition, since the API's default cross-fade is still enough visual change to be worth skipping for users who've opted out of motion.`,
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
  },
]
