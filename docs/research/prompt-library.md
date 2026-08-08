# Prompt Library — research brief & implementation plan

> **Provenance.** This brief is synthesized from seven parallel research passes
> (market landscape, competitor deep-dive, SEO/search-intent, prompt-engineering
> UX, codebase architecture, business-model fit, differentiation thesis) run
> August 2026. Several findings **corrected assumptions I would otherwise have
> carried in from training data** — flagged inline with ⚠️. **§10 records the
> decisions made after this brief was reviewed** — the scope actually being
> built (all categories at launch, not the narrower 3-category pilot this
> brief originally recommended) is set there, not in §0/§4 below.
>
> **§12 records a later restructure.** After the launch described in §4/§10
> shipped (13 use-case-first categories, 104 prompts), the taxonomy was
> rebuilt tool-first — 9 display groups over 46 categories named after the
> specific tool people actually search for ("cursor prompts", not "ai coding
> prompts") — and a first content wave brought the library to 254 prompts.
> §4's category tables and §10's decisions remain accurate as a record of the
> *original* launch reasoning; §12 is the current state.

## 0. Executive summary

Build a **Prompt Library** as a new content section (`/prompts`), organized
**by use-case first, by AI tool second** (multiple independent research
threads converge on this — a taxonomy of "prompts for writing cold emails"
beats "ChatGPT prompts" as both an SEO shape and a UX shape). This brief's
original recommendation was to launch narrow — **3 flagship categories that
don't exist anywhere else in this quality** (AI agent/automation building,
GEO/AI-visibility prompts, AI-coding workflows) — because those are
simultaneously the least-served categories in the entire competitive
landscape *and* the highest-business-value traffic for Scult's actual
services, adding 3-4 high-traffic-but-lower-intent categories (general LLM
writing, image generation, video/audio generation) only for SEO surface area.
**The actual decision (§10) is to launch across every category in §4 at
once**, including a newly-scoped companion-prompts category — the
category-priority reasoning below still determines build order, CTA
intensity, and how hard each category is pushed, even though all of them
ship together rather than in tiers.

The single best-evidenced differentiator across all competitor research is
almost embarrassingly simple: **every other major prompt library either gates
content behind accounts/paywalls, or never tells you which model version a
prompt was tested against, or both.** Nearly every documented failure in this
category is a *maintenance and honesty* failure, not a missing feature — which
means the winning move is to build less, verify it, and say so, rather than
to out-scale FlowGPT's 220,000 prompts or PromptBase's marketplace.

Do **not** build: a static screenshot-only prompt list, a generic un-dated
"ChatGPT prompts" grab-bag, anything gated behind an account or email capture,
or content built around Sora, Tome, or Jasper/Copy.ai as tool-specific
targets — all three are dead, discontinued, or pivoted out of this use case
as of mid-2026 (see §1).

---

## 1. Market landscape: what's actually trending in mid/late 2026

Full findings in the appendix (§11.1). Headline corrections to prior
assumptions, each confirmed via live search this session:

| Assumption | Reality (Aug 2026) |
|---|---|
| Sora is a current flagship video tool | ⚠️ **Discontinued.** Web/app shut down Apr 26 2026, API follows Sept 24 2026 (~$1M/day burn vs. ~$2.1M total revenue, collapsed Disney deal, deepfake liability). Do not build content around it. |
| Tome is a live presentation-AI competitor | ⚠️ **Dead** — shut down its Slides product April 2025. |
| ChatGPT has majority chatbot market share | ⚠️ Fell **below 50% for the first time** (46.4%, May 2026) as Gemini surged to 27.7%. |
| DeepSeek is a rising Chinese LLM threat | ⚠️ **Declined sharply** in 2026 (downloads 171M → 35M YTD) as Qwen and others undercut price. |
| Jasper/Copy.ai are relevant "prompt target" tools | Both pivoted to narrow enterprise niches (brand-voice governance, GTM workflows) after losing individual creators to free ChatGPT/Claude. Fold into general-LLM writing content, don't build tool-specific categories. |
| Manus is a minor agent tool | ⚠️ **Acquired by Meta for $2B+** (Jan 2026) after $100M ARR in under a year. |
| "Nano Banana" is a meme, not a product | It's Google's Gemini 3.1 Flash Image model, now free in the Gemini app, 5B+ images generated — the single biggest 2026 story in image generation and a real, current SEO opportunity (newly exploded, still underserved in search). |

**Prompt-culture strength by category** (does a real audience search for or
share "prompts for [X]," vs. just using the tool with plain questions):

- **Strong, mature**: general chat/LLM (ChatGPT/Claude/Gemini/Grok), image
  generation (Midjourney + Nano Banana + Flux/Ideogram), voice/music (Suno,
  ElevenLabs — both have genuinely template-shaped two-field or structured
  prompt conventions).
- **Real but narrower**: presentation/design (Gamma runs its own public
  prompt library already — strong validation of fit), no-code app builders
  (Lovable/Bolt.new/v0 — single-shot "describe your app" makes initial-prompt
  quality matter a lot), video (Veo/Kling/Runway — reframed away from Sora).
- **Real but structurally different — templates, not flat prompts**: AI
  coding assistants. Practitioners increasingly write reusable rules/skills
  (`.cursorrules`, `CLAUDE.md`, `SKILL.md`) rather than one-off prompts — the
  standalone "Prompt Engineer" title has declined ~40% in *developer/agent*
  contexts specifically as the skill folds into "context engineering." This
  does **not** apply to consumer prompting (chat/image/video), which remains
  healthy. Build the coding category as instruction-file/rules templates, not
  flat copy-paste prompts.
- **Thin or should be excluded**: AI search/research tools (mostly natural
  questions, not crafted prompts — NotebookLM is a possible single-post
  angle, not a category), AI agents/automation via n8n/Zapier/Make (drag-drop
  node config, not prompting — skip), AI companions (Character.AI/Replika —
  genuinely large prompt culture but editorially sensitive romantic/roleplay
  territory that doesn't fit a B2B tools site), AI shopping agents and
  vertical-enterprise agents (transactional/configured, zero prompt culture).

---

## 2. Competitive landscape

Fourteen sites/products fetched and researched directly (full per-site notes
in §11.2). Cross-cutting pattern, confirmed independently by every research
thread that touched it:

**Nobody currently owns the "prompts for X" SEO territory.** Searches for
"best midjourney prompts for portraits," "chatgpt prompts for business," and
"best chatgpt prompts" surfaced **zero** results from PromptHero, FlowGPT,
PromptBase, Awesome ChatGPT Prompts, Anthropic, or OpenAI on page one —
every ranking result was a third-party SEO listicle (Forbes, HubSpot,
Writesonic, "God of Prompt," etc.) repackaging prompts as content marketing.
The category-defining sites win *branded/navigational* searches ("prompthero,"
"midjourney prompts gallery") but have functionally ceded the actual
commercial search territory to blog-shaped competitors. **This is the
opportunity**: a well-optimized, individually-indexed page per use-case can
plausibly outrank the incumbents, because the incumbents aren't even trying
to win that fight.

Individual findings worth acting on directly:

- **Midjourney's own showcase** pairs rendered output beside the exact,
  unedited prompt text with parameters as clickable chips — the single best
  "prompt + result" pairing pattern found anywhere. Steal this shape.
- **Notion's template marketplace** opens the *live artifact itself* as the
  preview (not a screenshot) — the strongest trust signal found. Not directly
  portable to text prompts, but validates "show the real thing, not a
  stand-in" as a principle.
- **Claude Code's own prompt library** (`code.claude.com/docs/en/prompt-library`)
  is the most sophisticated single example found: `{fill-in-the-blank}`
  variables that render as live form fields, a collapsible "Why this works"
  panel, and a "Make it stick" tip turning a one-off correction into a
  reusable rule. This is a direct signal from a model vendor that a bare
  prompt-text dump is considered insufficient.
- ⚠️ **Anthropic's own consumer-facing prompt library was retired** — the old
  individually-themed pages (Tongue Twister, Master Moderator, etc.) now
  301-redirect into one generic "prompting best practices" mega-guide,
  losing per-prompt indexable URLs. **OpenAI's `/examples` gallery is now
  fully login-gated** and not crawlable at all. Two of the three most
  authoritative possible competitors have *actively vacated* this space in
  2026 — a second confirmation of the opportunity above.
- **FlowGPT / AIPRM / Snack Prompt** all suffer the same documented failure:
  volume without curation ("I spent more time searching AIPRM's library than
  I would have just writing my own prompt" — paraphrased user complaint),
  plus account walls and paywalled "good" content.
- **PromptBase** has real structural trust problems: no independent audit of
  its "130,000+ rigorously reviewed" claim, unmoderated fake-review disputes,
  seller payout complaints.
- ⚠️ **The two biggest marketplaces hide the actual product.** Confirmed by
  direct fetch, not inference: **FlowGPT never renders the prompt/system text
  at all** — the only interaction is "Start Chat," which burns a live
  conversation before you can even see what the prompt says, and its own
  schema.org markup tags listings as `Product`/`AggregateRating` rather than
  content, so Google has almost nothing substantive to index either.
  **PromptBase hides the full prompt pre-purchase** too — only a one-line
  "example input" and a truncated example output render before you pay
  $2.99–$24.99. Both undermine the basic trust and portability a prompt
  "library" implies, and both are directly, mechanically solvable by simply
  showing the prompt (§9, differentiator #2).
- **AIPRM's partial-gate is smarter than a full paywall**: the listing page,
  category breadcrumb, and a teaser/variable-hint (e.g.
  `[enter URL of content to be scraped]`) are public and indexable; only the
  full prompt body sits behind its Elite tier. This captures SEO value from a
  real page while still holding back the paid part — worth noting as a
  monetization pattern even though this brief recommends against paywalling
  anything (§8).
- **Snack Prompt's per-listing $1 tip** (no subscription, no paywall — a
  creator gets paid each time their public prompt is used) is the one
  monetization model seen that doesn't fight the "everything free and
  visible" principle — noted for completeness, not recommended for this
  site given the "no accounts" stance, but the shape (frictionless,
  per-item, optional) is the right family if monetization is ever revisited.
- ⚠️ **PromptPerfect (Jina AI's prompt-optimizer) is shutting down entirely**
  — new signups disabled June 2026, fully offline September 1 2026, user
  data deleted October 1 2026, after being spun out of Jina's Elastic
  acquisition. Its failure mode is instructive: it was a single-use
  optimizer tool with no library/community/network effect — "one user, one
  prompt, no reason to return." A pure utility with nothing to browse doesn't
  retain visitors; a browsable library does.
- **cursor.directory** (the closest existing "AI-coding prompt directory")
  quietly pivoted from a focused "Rules + Jobs" directory into an
  undifferentiated "Plugins" feed mixing coding rules with unrelated MCP
  servers (crypto wallets, real-estate tools), and dropped its Jobs board
  entirely. It still ranks (#6 for "cursor rules for react"), proving the
  category is winnable, but the pivot diluted what used to be a clean,
  single-purpose product — a cautionary tale against scope creep once a
  focused directory starts working.
- **github.com/x1xhlol/system-prompts-and-models-of-ai-tools** (142.6k
  stars) is the closest thing to a "verified against version X" precedent
  found anywhere: one folder per AI tool (Cursor, Claude Code, Devin, v0,
  Manus, Lovable, 25+ others), with **dated, versioned raw system-prompt
  files** tracking exactly how each vendor's prompt changed over time (e.g.
  `Agent Prompt v1.0.txt`, `Agent Prompt 2.0.txt`, `Agent CLI Prompt
  2025-08-07.txt`). It validates that version-dated provenance is something
  a real audience wants enough to star 142k times — but it has zero UX for
  anyone who isn't already a developer comfortable navigating raw GitHub
  file trees: no search, no per-item page, no categorization beyond
  folder-by-vendor.

---

## 3. SEO & search-intent strategy

Full findings in §11.3. Three decisions this directly drives:

1. **A generic "Prompt Library" hub page is not the SEO target — it's the
   index.** Bare "prompt library" search results are dominated by
   prompt-*management* SaaS tools (a Mac app to store your own prompts, a
   Copilot Studio feature), not content — the intent is ambiguous and product
   tools currently win it. The actual ranking unit is many **narrow,
   job-specific pages** ("prompts for writing cold emails," "chatgpt prompts
   for resume bullet points," "ai prompts for real estate listings") — each
   targeting one job-to-be-done, individually indexed. `/prompts` should be
   an internal hub/directory, not the page optimized to rank.
2. **AI Overviews already fully answer "give me prompts for X" queries
   inline** — confirmed by direct observation (a Bing Copilot query for
   "chatgpt prompts for marketing" returned a complete categorized,
   numbered, bracket-variable prompt list before any organic result).
   Informational queries trigger AI Overviews ~36% of the time, the highest
   rate of any intent class — this is a real cannibalization risk for the
   exact content type being planned.
3. **The mitigation is also the opportunity**: the AI answer and the organic
   results below it converge on the *same format* — short headers, numbered
   prompts, quoted copy-pasteable text, bracketed variables. A standalone,
   well-structured, individually-quotable prompt block is exactly the unit
   that gets lifted into an AI answer *with attribution* (GEO/AEO citation
   behavior). **This site already ships an AI Visibility Checker** — every
   prompt-library page should double as GEO-bait, and the AI Visibility
   Checker becomes a natural contextual link from every prompt page ("see if
   your own content gets cited like this").
4. A separate, distinct opportunity: **"[tool] prompt generator"** queries
   (e.g. "chatgpt prompt generator," ~37,600 results) are dominated by
   *interactive tools*, not listicles — a different intent than "prompts for
   X." This site already ships interactive generators for other categories;
   an actual **prompt-builder tool** (fill in your goal/audience/tone → get a
   structured prompt) is a better-fitting deliverable for this query pattern
   than a static list, and could become tool #16+ in the existing registry
   rather than living only in the new prompts section. Flagged as a
   **future/phase-2 idea**, not part of this launch.

---

## 4. Category strategy — what to cover and why

This is the deliverable most directly requested: a curated list, not an
exhaustive one, scored across three lenses — **prompt-culture strength**
(§1), **SEO/traffic potential** (§3), and **business value** (§6, mapped to
Scult's actual `serviceTarget` categories and existing tool line-up). Ordered
by launch priority.

### Tier 1 — flagship categories (launch with these; novel + highest business value)

| Category | Why it wins | Existing tool tie-in |
|---|---|---|
| **Build & ship AI agents/automations** | Highest business-value category found in any research thread — the visitor is mid-build on something Scult's `ai-agents-automation` service sells directly. Zero existing tool counterpart today (no cannibalization). Genuinely underserved: real prompt-culture strength for autonomous agents (Manus, browser agents) is still emerging, meaning less entrenched competition than chat/image. | None yet — net-new `serviceTarget` traffic |
| **Get found by AI (GEO/AEO prompts)** | Directly extends the site's own stated differentiator. Almost no competitor covers this at all (it's a 2026-native content need). Structurally doubles as the strongest anti-cannibalization play in §3 — GEO-optimized prompt pages that explain how to *get* AI-cited pair naturally with prompts that *are* AI-cited. | `ai-visibility-checker` → `ai-consulting` |
| **AI-coding & dev workflows** | Real, mature prompt/template culture; underserved as "templates not flat prompts" positioning (most competitors still frame this category as one-off prompts, missing the 2026 shift to rules/skills files). High-intent visitor signal (someone deep in an AI coding workflow reads as "building something real"). | `invoice-generator` (currently the only tool with `custom-software` target) |

### Tier 2 — supporting business categories (extend existing tools)

| Category | Existing tool tie-in | serviceTarget |
|---|---|---|
| SEO & structured-content prompts (briefs, schema, clustering) | `schema-markup-generator`, `faq-schema-generator` | seo-companies-for-small-business |
| Marketing/ads/analytics prompts (campaign copy, UTM, ROAS analysis) | `utm-builder`, `marketing-roi-calculator` | google-ads-management |
| Brand & identity prompts (naming, slogans, palette/visual briefs) | `business-name-generator`, `slogan-generator`, `color-palette-generator` | branding-agency |
| Business-ops & client-comms prompts (proposals, invoicing language, signatures) | `invoice-generator`, `email-signature-generator` | custom-software / branding-agency |

### Tier 3 — traffic & authority categories (build thin, for SEO surface area — not growth bets)

| Category | Rationale |
|---|---|
| Write & communicate with AI (general ChatGPT/Claude/Gemini prompts — emails, resumes, content, study help) | Highest raw search volume of anything researched, but near-zero conversion — mirrors the registry's own existing `LeadTier: C` tools (json-formatter, word-counter). Absorbs the "writing assistant" (Jasper/Copy.ai) demand that no longer belongs to those tools specifically. |
| Create images with AI (Midjourney, Nano Banana/Gemini, Flux, Ideogram — **not** Sora) | Strong, mature prompt culture and real search volume; low business intent but valuable for topical breadth and internal linking. |
| Create video & audio with AI (Veo, Kling, Runway, Suno, ElevenLabs — explicitly **not** Sora) | Real but thinner culture than image; include narrowly. |
| Design & presentations with AI (Gamma, Canva) | Moderate culture, touches `branding-agency` lightly; Gamma's own public prompt library validates the fit. |
| Build an app without code (Lovable, Bolt.new, v0, Replit) | Emerging, real prompt-quality-matters culture; loosely touches `custom-software`. |

### Explicitly excluded (do not build, at least not at launch)

- **Sora-specific content** — product is discontinued.
- **AI companion/roleplay prompts** (Character.AI, Replika) — real demand,
  but editorially sensitive (romantic/companion framing) and off-brand for a
  B2B tools site; flagged as a genuine judgment call for the user, not a
  unilateral decision (see §10).
- **n8n/Zapier/Make node-config "prompts"** — not actually a prompting
  interaction; would be mislabeled content.
- **AI shopping agents, vertical/enterprise agents** (legal, healthcare,
  finance) — transactional/configured, no consumer prompt culture, wrong
  audience for this site entirely.
- **Jasper/Copy.ai/Tome as tool-specific categories** — dead, pivoted, or
  absorbed into general-LLM writing above.

---

## 5. Content model

Extending the pattern research found in the codebase (§11.4), but as a
**separate, parallel data module** — never inside `lib/tools/` or the
`TOOLS`/`CATEGORIES` arrays, which are mechanically pinned to exactly 15/6 by
`registry.test.ts`.

```ts
// Illustrative sketch — not a final schema, decisions in §10 affect this.

type PromptCategorySlug =
  | 'ai-agents' | 'geo-aeo' | 'coding'          // Tier 1
  | 'seo-content' | 'marketing-ads' | 'branding' | 'business-ops' // Tier 2
  | 'writing' | 'image' | 'video-audio' | 'design' | 'no-code-apps' // Tier 3

interface PromptVariable {
  readonly name: string          // e.g. "company_name" — descriptive, not "text"
  readonly description: string
  readonly example: string
  readonly required: boolean
}

interface Prompt {
  readonly slug: string
  readonly category: PromptCategorySlug
  readonly title: string                     // outcome-first, e.g. "Turn a messy meeting transcript into action items"
  readonly promptText: string                // the template body, {{variable}} placeholders
  readonly variables: readonly PromptVariable[]
  readonly targetTools: readonly string[]    // open, not a closed union — density matters more than curation here
  readonly tags: readonly string[]
  readonly description: string
  readonly whyItWorks: string                // the Claude-Code-library-style teaching block
  readonly exampleOutput?: string
  readonly verifiedAgainst: { readonly tool: string; readonly version: string; readonly date: string }[]
  readonly changelog: readonly { readonly date: string; readonly note: string }[]  // instead of star ratings
  readonly serviceTarget?: string            // reuses lib/tools/service-links.ts resolveServiceLink()
  readonly relatedToolSlug?: string          // cross-link to an existing free tool, e.g. 'slogan-generator'
}
```

Deliberate departures from the existing `Tool` type, each justified by
research:

- **`targetTools`/`tags` are open string arrays, not closed unions** — a
  prompt library's value is tag density; a hand-approved closed union (like
  `CategorySlug`) is the wrong shape once past a handful of entries.
- **`verifiedAgainst` + dated changelog, not a star rating** — directly
  answers the single best-evidenced competitor failure (§2, §11.5): no
  competitor reliably tells you which model version a prompt was tested
  against, and star ratings on PromptBase became a moderation liability. A
  changelog has no adversarial incentive and is more useful anyway.
- **`whyItWorks` is required, not optional** — the Claude Code library and
  the Ahrefs "$80 blind test" finding (premium prompts only beat simple ones
  2 of 5 times) both point the same direction: an unexplained prompt is
  selling an illusion. Teaching the pattern is more durable than the string.
- **`variables` is a typed array with example values**, not raw
  `[BRACKETS]` in prose — enables an interactive fill-in form that live-updates
  the copy button, the single most-cited "how to do variables well" finding.

---

## 6. Technical architecture

1. **Routing**: `/prompts` (hub, mirrors `/all`'s anchor-jump pattern) →
   `/prompts/[category]` (mirrors `app/[category]/page.tsx`) →
   `/prompts/[category]/[slug]` (mirrors `app/[category]/[slug]/page.tsx`).
   Nesting under `/prompts` (rather than bare-root categories like the
   existing tools) sidesteps `RESERVED_SLUGS` collision risk entirely —
   `'prompts'` needs adding to that list once, and prompt slugs never need to
   collision-check against tool/category slugs.
2. **JSON-LD**: reuse `breadcrumbJsonLd` and the `PUBLISHER`→parent-`@id`
   convention verbatim. Do **not** reuse `SoftwareApplication` (a prompt
   isn't an application) — use `CreativeWork` per prompt, `CollectionPage`/
   `ItemList` for hub and category pages, matching the existing
   "only emit what's visible" discipline (`FAQPage` only if a prompt page
   visibly shows FAQs).
3. **Search**: the existing `search.ts`/`SearchBox.tsx` ARIA-combobox UI
   shell is reusable as-is, but the underlying AND-only linear scan is
   explicitly sized (per its own doc comment) for ~15 items and will not
   hold at "hundreds of prompts." Needs real faceted filtering (category ×
   target-tool × tag) and OR-with-relevance ranking, not a bigger version of
   the same index.
4. **Content authoring — the one genuinely open architectural fork**: the
   existing site has zero CMS/MDX tooling (confirmed by dependency and file
   search) and deliberately chose hand-authored TypeScript data files at
   15-tool scale specifically because "40 tools maintained by engineers do
   not need [a CMS]." A prompt library at "hundreds of entries," authored
   more frequently, arguably crosses that threshold — but adopting MDX/a
   content-collection layer is a real new-dependency decision this brief
   should surface, not silently make. **See §10, question 1.**
5. **Must not touch**: `lib/tools/registry.ts`, `categories.ts`,
   `registry.test.ts`, or the `TOOLS`/`CATEGORIES` arrays — the prompt
   library needs its own parallel data module and its own test suite,
   deliberately outside the "exactly 15 tools" CI gate's jurisdiction.

---

## 7. UX / design spec

Matching the existing design system (Fraunces/Cabin, violet/cta tokens,
`chip-tool`/`card-flat` patterns) rather than introducing a new visual
language:

- **Hub page** (`/prompts`): mirrors `/all`'s category-jump-nav pattern —
  short intro, jump nav to the categories in §4's order (Tier 1 first),
  one card grid per category using a `PromptCard` sibling of `ToolCard`.
- **Prompt card**: title (outcome-first phrasing, per the Gemini-gallery
  finding), 1-2 target-tool tag chips, category tag, a small "verified
  [date]" indicator.
- **Prompt detail page**: title/description → the prompt block itself
  (large, monospace-adjacent, one-click copy with inline button-state
  feedback — label flips "Copy" → "Copied!" for ~2s, not a toast, per the
  accessibility research) → if variables exist, an interactive fill-in form
  above the block that live-updates what gets copied → collapsible
  "Why this works" panel (closed by default — progressive disclosure, not
  forced reading) → "verified against [tool v.] on [date]" badge, with an
  honest "not re-verified since [tool] shipped [version] — may need
  adjustment" state if stale → changelog list → related tool + CTA (see §8)
  → 2-4 related prompts.
- **Accessibility specifics to build in from day one** (all directly
  sourced, not generic): copy buttons must be real `<button>` elements with
  a visible focus indicator (never `outline: none` without an equally
  visible replacement); copy-success must be announced via
  `aria-live="polite"` (not `role="alert"`) since a label-only change is
  silent to screen readers; debounce search input 150-300ms and cancel
  stale requests.
- **Filtering**: faceted sidebar (category, target tool, tags) with active
  filters shown as removable chips and a persistent "clear all" — never
  present a filter combination that would return zero results.

---

## 8. Business integration

- **No email gate, ever** — every researched precedent that gated content
  (HubSpot's multi-field form, AIPRM's paywalled "good" templates) contradicts
  this site's own stated "no signup" voice, already used as marketing copy
  on multiple existing tools. Every prompt is instantly copyable.
- **CTA mechanics reuse existing infrastructure exactly**: attach a
  `serviceTarget` per category (§4 tables) and resolve it through the
  existing `resolveServiceLink()` / `parentLink()` helpers, so UTM
  attribution (`utm_campaign=<prompt-slug>`) works identically to how tool
  attribution already works. Tier 1 categories earn assertive CTA copy
  ("building this for real? we do this for a living"); Tier 3 categories get
  a soft link or none, mirroring how `json-formatter`/`word-counter` already
  have no `serviceTarget` today.
- **Cross-link into the existing 15 tools** wherever a natural counterpart
  exists (tables in §4) — this is what prevents the library from being an
  isolated silo and is the direct opposite of Awesome ChatGPT Prompts' fate
  (166K GitHub stars, zero lead-capture mechanism, pure traffic converting at
  ~zero — the exact `LeadTier: C` outcome to design against for the Tier 1/2
  categories specifically).

---

## 9. Differentiation thesis — how this beats every existing prompt library

Ranked by strength of evidence and how sustainably a small team can actually
maintain each commitment (full research in §11.5):

1. **Per-prompt "verified" stamp** (model + version + date), with an honest
   stale-badge instead of silence once a window passes. The single
   best-evidenced gap in the entire category — only one competitor (a paid
   marketplace) treats this as even a premium feature, and the closest real
   precedent (github.com/x1xhlol's 142.6k-star versioned system-prompt
   archive) proves the demand exists but ships it with zero usable UX.
2. **Zero accounts, zero paywalls, plain copyable text, always.** Confirmed,
   not assumed: **FlowGPT never shows the prompt text at all** (you must
   burn a live chat to find out what it says) and **PromptBase hides the
   full prompt behind a paywall** (only a one-line teaser is public). Simply
   showing the real prompt, in full, for free, on the page — the bar every
   visitor to a "prompt library" should reasonably expect — is already a
   differentiator against the two largest dedicated marketplaces in the
   category.
3. **"Why this works" on every entry** — not a raw text dump.
4. **Radical metrics honesty** — no vague "used 50k times" claims (the
   PromptBase "no independent audit" problem); either show nothing or label
   exactly what's real.
5. **Curate small, publish the maintenance cadence as the pitch** — the
   opposite of FlowGPT/Snack Prompt's volume-without-curation trap.
6. **A public per-prompt changelog instead of star ratings** — no adversarial
   incentive, more useful than an average.
7. **Real, small taxonomy with fast faceted filtering** — achievable
   specifically *because* of #5.

The common thread: almost every real, well-evidenced failure in this
category is a **maintenance and honesty failure**, not a missing feature —
which means the differentiator is "build less and don't lie about it," not a
feature arms race against 220,000-prompt incumbents.

---

## 10. Decisions (resolved before implementation)

1. **Content authoring model: TypeScript data files.** Matches every
   existing convention exactly (§6, §5's schema sketch stands as written).
   Accepted trade-off: content additions go through the same review path as
   code, same as the 15 tools today. Revisit an MDX/content-collection layer
   only if volume genuinely outgrows engineer-reviewed authorship later.
2. **Launch scope: all categories from §4 at once** (Tiers 1-3, including
   the companion category below) — not the narrower 3-category launch this
   brief recommended. Per-category count is set at **8 prompts to start**
   (a deliberately honest, "curate small" number per §9's differentiator #5,
   not a ceiling — grows category by category as each is verified) —
   104 prompts across 13 categories at launch, not hundreds.
3. **AI companion/roleplay prompts: included, explicitly scoped.** Content
   boundary: **persona-description and roleplay-scenario prompts only**
   (e.g. "prompt Character.AI/Replika to role-play a specific job
   interviewer," "design a consistent companion persona") — no
   romantic/intimate framing, no NSFW-adjacent content of any kind. This
   boundary is a hookable rule, not just a style note: content review should
   reject anything drifting past it, same rigor as the site's existing
   "never fabricate" content discipline.
4. **Content sourcing: first batch drafted directly, for review before it
   ships.** Each category's prompts draw on the model-specific structural
   conventions from §11.4 (chat/LLM role-context-task-format vs. image-gen
   descriptor-stacking vs. video-gen layered-brief vs. coding-assistant
   constraint-blocks) rather than one generic template reused across
   categories.
5. **Nav placement**: given the launch is now full-width (all categories,
   not a narrow pilot), add "Prompts" as its own top-level nav item next to
   "Tools"/"All tools" — a narrow-launch-only internal-links-first approach
   no longer fits the scope decided in point 2.
6. **Prompt-builder interactive tool** (§3, point 4): deferred to phase 2,
   out of scope for this launch. The static library is already a large
   surface area; an interactive builder is a genuinely separate engineering
   lift (a candidate tool #16) that shouldn't block shipping the content.

---

## 11. Appendix — full research notes

### 11.1 AI tool landscape (full)

*[Full per-category findings — coding assistants, chat/LLM, image, video,
voice/audio, agents/automation, writing, presentation/design, no-code
builders, search/research, companions/shopping/vertical-enterprise — with
market-share figures, acquisition news, and sourced links, as gathered
during this research pass. Condensed into §1 above; ask for the unabridged
version if needed for deeper category-by-category planning.]*

### 11.2 Competitor deep-dive (full)

*[Full per-site findings, all fetched/browsed live this session: PromptHero,
FlowGPT, PromptBase, Awesome ChatGPT Prompts/prompts.chat, Anthropic's prompt
library (and its retirement), OpenAI's cookbook/examples (and its login
wall), Google's Gemini prompt gallery, Midjourney's community showcase,
Notion's template marketplace, PromptPerfect (and its shutdown), Snack
Prompt, AIPRM, cursor.directory, and the
github.com/x1xhlol/system-prompts-and-models-of-ai-tools archive — content
structure, UX, monetization, and SEO signal per site, plus two direct SERP
checks ("best midjourney prompts for portraits" / "chatgpt prompts for
business" and "cursor rules for react") showing none of the dedicated
marketplaces rank for the exact queries they exist to answer. Condensed into
§2 and §9 above.]*

### 11.3 SEO & search-intent (full)

*[Full query-by-query findings — phrase-pattern demand signals, generic-hub
vs. specific-page SERP comparison, AI Overview direct observation, adjacent
query clusters for internal linking. Condensed into §3 above.]*

### 11.4 Prompt engineering & UX best practices (full)

*[Full findings on prompt structure conventions per tool type (chat/LLM vs.
image vs. video vs. coding), variable/placeholder syntax conventions,
model-version-specific breakage examples (Claude prefill/thinking-budget
deprecations, Midjourney V6→V7), and browsing/discovery/accessibility UX
patterns. Condensed into §4, §5, §7 above.]*

### 11.5 Codebase architecture fit (full)

*[Full notes on `lib/tools/types.ts`/`categories.ts`/`registry.ts`, routing
and JSON-LD conventions, `search.ts`'s scaling ceiling, and the MDX/CMS
tooling gap. Condensed into §5, §6 above.]*

### 11.6 Business-model & traffic-funnel fit (full)

*[Full lead-tier category analysis, CTA-mechanics recommendation,
tool-cross-linking table, and real-world agency precedents (Siege Media,
HubSpot, Orbit Media, Semrush, Zapier/n8n template galleries). Condensed
into §4, §8 above.]*

### 11.7 Differentiation thesis (full)

*[Full evidence log — prompt-drift/staleness documentation, FlowGPT/AIPRM/
Snack Prompt curation complaints, PromptBase trust/moderation issues,
account-wall friction, the Ahrefs premium-prompt blind test, and the
Civitai hidden-prompt precedent. Condensed into §9 above.]*

---

## 12. 2026-08 restructure: tool-first taxonomy (current state)

The launch described in §4/§10 shipped as 13 use-case-first categories and
104 prompts. It was then rebuilt tool-first: **URLs and pages are organized
by the specific tool someone searches for — "cursor prompts," "midjourney
prompts," "chatgpt prompts" — rather than by the underlying use case.**
`lib/prompts/types.ts`'s own comment states the reasoning plainly: groups
are a display layer only and never appear in the URL, because "cursor
prompts" is what people search, not "ai models cursor prompts." This is a
narrower, more literal reading of the same SEO principle §3 already argued
for (specific pages beat generic hubs) — applied one level down, to the
tool name itself rather than the use case wrapping it.

### 12.1 Structure

Two layers, defined in `lib/prompts/types.ts`:

- **`PromptGroupSlug`** — 9 top-level groups, display/organization only,
  power the hub page's jump-nav and section headings. Never appear in a URL.
- **`PromptCategorySlug`** — 46 flat categories, one per tool or tight
  cluster, routed at `/prompts/<category>/<slug>` exactly as before.

| Group | Categories |
|---|---|
| AI Models & Assistants | chatgpt, claude, claude-code, cursor, github-copilot, gemini, perplexity, grok, ai-companions |
| Development | ai-engineering, react, nextjs, python, devops, no-code-apps |
| Marketing & SEO | seo-geo, ads, email-marketing, sales, linkedin |
| Design | figma, framer, ui-design, branding, presentations |
| Business | startup, finance, consulting, business-ops |
| Content Creation | youtube, instagram, x-twitter, blog-writing, writing |
| Education & Study | students, research, exam-prep |
| Image Generation | midjourney, nano-banana, flux, ideogram, dalle |
| Video & Audio | veo, kling, runway, ai-audio |

### 12.2 Migration of the original 13 categories

Every one of the original 104 prompts was kept — none dropped, none
duplicated — and re-tagged with a new `category` literal per this mapping:

| Original category | New category(ies) |
|---|---|
| `ai-agents` | `ai-engineering` |
| `geo-aeo` + `seo-content` | merged into `seo-geo` |
| `coding` | `claude-code` |
| `marketing-ads` | `ads` |
| `branding` | `branding` (unchanged) |
| `business-ops` | `business-ops` (unchanged) |
| `writing` | `writing` (unchanged) |
| `image` | split across `midjourney`, `nano-banana`, `flux`, `ideogram` |
| `video-audio` | split across `veo`, `kling`, `runway`, `ai-audio` |
| `design` | `presentations` |
| `no-code-apps` | `no-code-apps` (unchanged) |
| `ai-companions` | `ai-companions` (unchanged) |

### 12.3 Content wave 1

A first content wave added 150 new prompts on top of the migrated 104,
targeting the categories with the highest expected search volume that
still had thin or no coverage: `chatgpt`, `claude`, `cursor`,
`github-copilot`, `gemini`, `perplexity`, `react`, `nextjs`, `python`,
`startup`, `sales`, and `linkedin` each received 12 new prompts; `claude-code`
and `seo-geo` — already populated from the migration — each received a
small top-up (+4 and +2) rather than a full fresh batch. **Current total:
254 prompts across 32 populated categories** (the remaining 14 — `devops`,
`figma`, `framer`, `ui-design`, `presentations` beyond its migrated 8,
`finance`, `consulting`, `youtube`, `instagram`, `x-twitter`, `blog-writing`,
`students`, `research`, `exam-prep`, `grok`, `dalle` — still export an empty
array and are simply not linked or rendered, matching the site's
no-disabled-buttons convention rather than shipping a "coming soon" page).

### 12.4 What did not change

The `Prompt`/`PromptVariable`/`PromptVerification`/`PromptChangelogEntry`
shape, the per-prompt JSON-LD (`CreativeWork`), the copy-block/variable-fill
UX, the staleness badge, and the tier-aware CTA are all unchanged from §5–§9
above — this was a taxonomy and content-volume change, not a product-model
change.
