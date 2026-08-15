import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'figma-component-brief-variant-and-props-spec',
    category: 'figma',
    title: `Turn a rough component idea into a variant and props spec a Figma builder can execute without guessing`,
    description: `Generates a full component brief — variant matrix, prop names, states, and auto-layout rules — for one specific reusable component, so whoever builds it in Figma (you, a junior designer, or the Figma AI companion) doesn't have to reverse-engineer intent from a vague Slack message.`,
    promptText: `You are writing a component brief for one specific reusable component that is about to be built in Figma — either by me directly, by a junior designer I'll hand this to, or by Figma's AI companion inside a file. The brief needs to be precise enough that the builder never has to guess a variant, a prop name, or a state that I didn't specify.

COMPONENT
{{component_name}}

WHERE IT'S USED
{{usage_context}}

KNOWN VARIANTS NEEDED
{{known_variants}}

EXISTING DESIGN TOKENS TO REUSE
{{existing_tokens}}

HARD CONSTRAINTS
{{hard_constraints}}

BRIEF RULES
Open with a one-sentence definition of the component's job — what it is FOR, not what it looks like, because a builder who understands the job can make a better call on an edge case I didn't think to specify. Build the variant matrix as an explicit grid: every property (like state, size, emphasis) crossed against every value it can take, and mark which combinations are actually valid — a component with 3 properties at 3 values each has 27 theoretical combinations, but maybe only 14 are real; naming the invalid ones prevents someone from dutifully building all 27. For every variant property, name it exactly as it should appear in the Figma variant panel (e.g. "state", not "Component State") since inconsistent naming here is what makes instance-swapping painful later. For every prop that should be exposed (text content, icon slot, boolean toggles), state the type and, for booleans, what showing true actually changes in the layout — not just that a toggle exists. Specify auto-layout behavior explicitly: which direction it resizes, what has a fixed size versus hug versus fill, and what the minimum viable size is before content starts clipping. Reuse existing tokens by exact name wherever {{existing_tokens}} covers the case, and only invent a new token when nothing in that list fits — name the gap explicitly rather than silently picking a new color or spacing value that could drift from the system. Call out interaction states that are easy to forget — disabled, loading, error, empty — and say whether each one is in scope for this pass or explicitly deferred, so a missing state reads as a decision, not an oversight.

WHAT NOT TO DO
Do not describe visual style in prose ("should look clean and modern") — every visual instruction must be a specific token, value, or exact match to an existing component. Do not invent variants beyond {{known_variants}} unless a stated hard constraint makes one clearly necessary — flag any variant you added and why, rather than quietly expanding scope.

OUTPUT FORMAT
1. One-sentence component job statement.
2. Variant matrix as a table: property, values, valid combinations, invalid combinations explicitly marked out.
3. Exposed props table: name, type, default, what changes when set.
4. Auto-layout spec: resize direction, fixed/hug/fill per axis, minimum size.
5. Token reuse list plus any new tokens proposed, each with a one-line justification.
6. States in scope for this pass and states explicitly deferred, with a one-line reason for each deferral.`,
    variables: [
      {
        name: 'component_name',
        description: `The specific component being briefed, not a category of components.`,
        example: `Primary action button used inside the checkout flow's order summary card`,
        required: true,
      },
      {
        name: 'usage_context',
        description: `Where this component actually appears and what triggers it to show up.`,
        example: `Sits at the bottom of the order summary card on desktop and mobile web; the only place in the product where a button sits directly above a price total`,
        required: true,
      },
      {
        name: 'known_variants',
        description: `The variant properties and values you already know you need, even if incomplete.`,
        example: `state: default, hover, pressed, disabled, loading; size: default, compact`,
        required: true,
      },
      {
        name: 'existing_tokens',
        description: `The design tokens (color, spacing, radius, type) already in the library that this component should pull from.`,
        example: `color/action/primary, color/action/primary-disabled, radius/md, spacing/8, spacing/12, type/label-md`,
        required: true,
      },
      {
        name: 'hard_constraints',
        description: `Any non-negotiable technical or brand constraint the component must satisfy.`,
        example: `Must stay a single auto-layout frame so it can be swapped into three different card widths without manual resizing, and the loading state must not change the button's height`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (Figma AI companion)`],
    tags: [`figma`, `design-systems`, `component-spec`, `variants`, `auto-layout`, `handoff`],
    whyItWorks: `The variant-matrix-as-grid instruction directly targets the most common failure mode in Figma component builds: someone builds every mathematically possible combination of a component's properties because nobody said which combinations are actually invalid, which bloats the variant panel and makes instance-swapping unreliable later — forcing the brief to explicitly enumerate invalid combinations turns an implicit judgment call into a checkable fact the builder can point back to. Naming variant properties exactly as they should appear in Figma's variant panel matters because Figma's property names are the literal strings shown in the instance-swap dropdown across the whole file; a property called "Component State" in the brief but "state" in the file creates a silent mismatch that only surfaces when someone else tries to swap an instance and can't find what they expect. Requiring the loading, disabled, error, and empty states to be marked in-scope-or-deferred rather than simply omitted works because an omitted state is ambiguous — a builder can't tell if it was forgotten or intentionally cut — while an explicit deferral is a decision that shows up in review and can be revisited on purpose later. Reusing existing tokens by exact name rather than restating values in prose ("a light blue") prevents the specific drift that happens when a builder eyeballs a color that's close to but not identical to the system token, which is invisible until a designer later notices two near-identical blues in the same file and has to figure out which one is canonical. Because Figma's AI companion and human builders alike work from whatever spec they're handed, a prose description of "clean and modern" gives either of them nothing to execute against, while a table of exact tokens, states, and auto-layout resize rules gives a concrete, buildable target with no interpretation gap.`,
    exampleOutput: `Job: A single-action button that commits the order total shown directly above it, in one auto-layout frame reusable across desktop and mobile card widths.
Variant matrix: state (default, hover, pressed, disabled, loading) x size (default, compact) = 10 combinations, all valid.
Props: label (text, default "Place order"), isLoading (boolean — swaps label for a spinner, disables press, height unchanged), icon (optional slot, default none).
Auto-layout: horizontal, hug width, fixed height 44px (default) / 36px (compact); minimum width 120px before label clips.
Tokens: color/action/primary, color/action/primary-disabled, radius/md, spacing/12, type/label-md — no new tokens needed.
States in scope: default, hover, pressed, disabled, loading. Deferred: error state (no error condition exists in this flow yet — revisit if refunds add one).`,
    verifiedAgainst: [
      { tool: 'ChatGPT (Figma AI companion)', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT (Figma AI companion) GPT-5.1.`,
      },
    ],
  },
]
