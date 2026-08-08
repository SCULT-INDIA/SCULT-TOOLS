import type {
  PromptCategory,
  PromptCategorySlug,
  PromptGroup,
  PromptGroupSlug,
} from './types'

/**
 * The nine top-level groups, in hub display order. Groups organize the hub
 * page and nav; they never appear in URLs.
 */
export const PROMPT_GROUPS: readonly PromptGroup[] = [
  {
    slug: 'ai-models',
    name: 'AI Models & Assistants',
    blurb: 'Prompts tuned to a specific model or assistant.',
  },
  {
    slug: 'development',
    name: 'Development',
    blurb: 'Framework, stack and AI-engineering prompts.',
  },
  {
    slug: 'marketing',
    name: 'Marketing & SEO',
    blurb: 'Search, ads, email, sales and social prompts.',
  },
  {
    slug: 'design',
    name: 'Design',
    blurb: 'UI, brand and presentation prompts.',
  },
  {
    slug: 'business',
    name: 'Business',
    blurb: 'Startup, finance, consulting and ops prompts.',
  },
  {
    slug: 'content',
    name: 'Content Creation',
    blurb: 'Platform-specific content and writing prompts.',
  },
  {
    slug: 'education',
    name: 'Education & Study',
    blurb: 'Student, research and exam-prep prompts.',
  },
  {
    slug: 'image-ai',
    name: 'Image Generation',
    blurb: 'Model-specific image prompts, versioned honestly.',
  },
  {
    slug: 'video-ai',
    name: 'Video & Audio',
    blurb: 'Video, music and voice generation prompts.',
  },
] as const

/**
 * The tool-first category set (2026-08 restructure). Ordered by group, then
 * demand tier within the group, matching the demand research in
 * docs/research/prompt-library.md §10.
 */
export const PROMPT_CATEGORIES: readonly PromptCategory[] = [
  // ---- AI Models & Assistants ----
  {
    slug: 'chatgpt',
    group: 'ai-models',
    name: 'ChatGPT',
    blurb: 'General-purpose ChatGPT prompts that survive model updates.',
    intro:
      'The highest-volume prompt search there is — these are structured, reusable ChatGPT prompts with the role, context and format constraints spelled out, so they keep working as the underlying model versions change.',
    tier: 1,
    tile: 'green',
    icon: 'MessageSquare',
  },
  {
    slug: 'claude',
    group: 'ai-models',
    name: 'Claude',
    blurb: 'Prompts built for how Claude actually parses structure.',
    intro:
      'Claude responds measurably better to explicit structure — XML-style tags, imperative instructions, stated output formats. These prompts are written for that, not generic copy pasted from a ChatGPT list.',
    tier: 1,
    tile: 'lavender',
    icon: 'Sparkles',
  },
  {
    slug: 'claude-code',
    group: 'ai-models',
    name: 'Claude Code',
    blurb: 'CLAUDE.md templates, constraint blocks and review rubrics.',
    intro:
      'Framed as reusable rules/skills templates, not one-off copy-paste prompts — practitioners have shifted toward CLAUDE.md-style context files over flat prompts, and a library that still treats this as "type a prompt" is already behind.',
    tier: 1,
    tile: 'blue',
    icon: 'Code',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'cursor',
    group: 'ai-models',
    name: 'Cursor',
    blurb: '.cursorrules files and agent-mode prompts for Cursor.',
    intro:
      'Cursor-specific rules files, agent-mode task briefs and review prompts — written against Cursor 2.x behavior, with the constraint blocks that stop an agentic editor from wandering.',
    tier: 2,
    tile: 'blue',
    icon: 'SquareTerminal',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'github-copilot',
    group: 'ai-models',
    name: 'GitHub Copilot',
    blurb: 'Repository instructions and chat prompts for Copilot.',
    intro:
      'Repository custom-instruction files and Copilot Chat prompts — the difference between Copilot autocompleting your habits and Copilot following your standards.',
    tier: 2,
    tile: 'blue',
    icon: 'GitPullRequest',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'gemini',
    group: 'ai-models',
    name: 'Gemini',
    blurb: 'Prompts for Gemini chat, long context and multimodal input.',
    intro:
      'Gemini-specific prompts that lean on what it does differently — very long context windows, native multimodal input, and tight Google Workspace integration.',
    tier: 2,
    tile: 'green',
    icon: 'Gem',
  },
  {
    slug: 'perplexity',
    group: 'ai-models',
    name: 'Perplexity',
    blurb: 'Research and source-checking prompts for Perplexity.',
    intro:
      'Perplexity is a research engine, not a chatbot — these prompts are structured for citation-first answers, source triangulation and honest "what does the evidence actually say" work.',
    tier: 2,
    tile: 'lavender',
    icon: 'Telescope',
  },
  {
    slug: 'grok',
    group: 'ai-models',
    name: 'Grok',
    blurb: 'Prompts for Grok and its real-time X data access.',
    intro:
      'Grok prompts that use what makes it distinct — real-time access to X/Twitter data and a looser conversational register — without pretending it is something it is not.',
    tier: 3,
    tile: 'yellow',
    icon: 'Zap',
  },
  {
    slug: 'ai-companions',
    group: 'ai-models',
    name: 'AI Companions & Personas',
    blurb: 'Persona-design and role-play scenario prompts for companion apps.',
    intro:
      'Persona-design and role-play scenario prompts for tools like Character.AI and Replika — scoped deliberately narrow, see the content boundary below.',
    tier: 3,
    tile: 'lavender',
    icon: 'Smile',
    contentBoundary:
      'Persona-description and role-play-scenario prompts only — no romantic or intimate framing, no NSFW-adjacent content of any kind. Anything drifting past this line is rejected in review, not published and revisited later.',
  },

  // ---- Development ----
  {
    slug: 'ai-engineering',
    group: 'development',
    name: 'AI Agents & RAG',
    blurb: 'Prompts for building agents, RAG pipelines and support bots.',
    intro:
      'The visitor here is mid-build on something real — an autonomous agent, a browser agent, an internal support bot, a RAG pipeline — not asking a chatbot a casual question. No existing prompt library covers this well.',
    tier: 1,
    tile: 'lavender',
    icon: 'Bot',
    serviceTarget: 'ai-consulting',
  },
  {
    slug: 'react',
    group: 'development',
    name: 'React',
    blurb: 'Component, hook and state-management prompts for React.',
    intro:
      'React-specific prompts for AI coding assistants — component generation with real prop contracts, hook extraction, performance passes and migration briefs that name actual React APIs instead of hand-waving.',
    tier: 2,
    tile: 'blue',
    icon: 'Atom',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'nextjs',
    group: 'development',
    name: 'Next.js',
    blurb: 'App Router, caching and rendering-strategy prompts.',
    intro:
      'Next.js prompts that get the App Router era right — server components vs client components, caching semantics, route handlers — the places where generic React advice actively misleads.',
    tier: 2,
    tile: 'blue',
    icon: 'Layers',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'python',
    group: 'development',
    name: 'Python',
    blurb: 'Scripting, data and API prompts for Python work.',
    intro:
      'Python prompts across the real day-to-day — scripts, data wrangling, FastAPI services, tests — written with type hints and error handling in the ask, not bolted on after.',
    tier: 2,
    tile: 'green',
    icon: 'FileCode',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'devops',
    group: 'development',
    name: 'DevOps & Cloud',
    blurb: 'Docker, CI/CD, Kubernetes and cloud-config prompts.',
    intro:
      'Infrastructure prompts where precision matters most — Dockerfiles, CI pipelines, Kubernetes manifests, cloud configs — with the guardrails spelled out because a plausible-but-wrong YAML file costs real money.',
    tier: 3,
    tile: 'yellow',
    icon: 'Container',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'no-code-apps',
    group: 'development',
    name: 'Build Apps Without Code',
    blurb: 'Lovable, Bolt.new, v0 and Replit Agent prompts.',
    intro:
      'These tools generate a working app from a single description, so the initial prompt matters more than in a chat interface — templates for describing scope, data model and UI in one shot.',
    tier: 2,
    tile: 'green',
    icon: 'Blocks',
    serviceTarget: 'custom-software',
  },

  // ---- Marketing & SEO ----
  {
    slug: 'seo-geo',
    group: 'marketing',
    name: 'SEO & GEO/AEO',
    blurb: 'Search optimization prompts for Google and AI answer engines.',
    intro:
      'Two searches are converging: classic SEO and getting cited by AI answer engines. These prompts cover both — briefs, schema, keyword clustering, plus auditing and writing AI-citable content. Pairs directly with this site’s own AI Visibility Checker.',
    tier: 1,
    tile: 'green',
    icon: 'Radar',
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'ads',
    group: 'marketing',
    name: 'Ads & Campaigns',
    blurb: 'Ad copy, campaign briefs and UTM-planning prompts.',
    intro:
      'Campaign copy with real platform constraints, attribution planning and performance narratives — the thinking that happens before the UTM Builder and Marketing ROI Calculator, and the analysis after.',
    tier: 2,
    tile: 'yellow',
    icon: 'TrendingUp',
    serviceTarget: 'google-ads-management',
  },
  {
    slug: 'email-marketing',
    group: 'marketing',
    name: 'Email Marketing',
    blurb: 'Sequences, subject lines and newsletter prompts.',
    intro:
      'Email prompts for the formats that actually get sent — welcome sequences, subject-line testing, newsletters, re-engagement — with deliverability and length discipline built into the ask.',
    tier: 2,
    tile: 'yellow',
    icon: 'Mail',
    serviceTarget: 'google-ads-management',
  },
  {
    slug: 'sales',
    group: 'marketing',
    name: 'Sales & Outreach',
    blurb: 'Cold outreach, follow-up and objection-handling prompts.',
    intro:
      'Sales prompts that respect the reader’s inbox — cold outreach that earns a reply, follow-ups that don’t nag, discovery-call prep and objection handling grounded in what was actually said.',
    tier: 2,
    tile: 'yellow',
    icon: 'Handshake',
    serviceTarget: 'google-ads-management',
  },
  {
    slug: 'linkedin',
    group: 'marketing',
    name: 'LinkedIn',
    blurb: 'Post, profile and thought-leadership prompts for LinkedIn.',
    intro:
      'LinkedIn prompts calibrated to the platform’s actual register — posts that read like a person, profile rewrites, comment strategies — without the engagement-bait clichés the feed is drowning in.',
    tier: 2,
    tile: 'blue',
    icon: 'AtSign',
    serviceTarget: 'google-ads-management',
  },

  // ---- Design ----
  {
    slug: 'figma',
    group: 'design',
    name: 'Figma',
    blurb: 'Figma AI and design-workflow prompts.',
    intro:
      'Prompts for Figma’s AI features and the design work around them — component naming, auto-layout cleanup briefs, design-system documentation and handoff notes.',
    tier: 2,
    tile: 'lavender',
    icon: 'PencilRuler',
    serviceTarget: 'branding-agency',
  },
  {
    slug: 'framer',
    group: 'design',
    name: 'Framer',
    blurb: 'Framer AI site-generation and interaction prompts.',
    intro:
      'Framer prompts for AI site generation and interaction design — structured briefs that produce a usable starting site instead of a generic template.',
    tier: 3,
    tile: 'lavender',
    icon: 'Frame',
    serviceTarget: 'branding-agency',
  },
  {
    slug: 'ui-design',
    group: 'design',
    name: 'UI & UX Design',
    blurb: 'Wireframe, design-system and UX-research prompts.',
    intro:
      'Tool-agnostic UI/UX prompts — wireframe briefs, design-system audits, UX-research plans, usability-test scripts — the thinking layer above any specific design tool.',
    tier: 2,
    tile: 'blue',
    icon: 'PenTool',
    serviceTarget: 'branding-agency',
  },
  {
    slug: 'branding',
    group: 'design',
    name: 'Brand & Identity',
    blurb: 'Naming, slogan and visual-identity brief prompts.',
    intro:
      'Naming direction, tone-of-voice briefs and visual-identity prompts that extend the Business Name Generator, Slogan Generator and Colour Palette Generator with the strategic thinking behind each one.',
    tier: 2,
    tile: 'yellow',
    icon: 'Palette',
    serviceTarget: 'branding-agency',
  },
  {
    slug: 'presentations',
    group: 'design',
    name: 'Decks & Presentations',
    blurb: 'Gamma and Canva prompts for decks and visual documents.',
    intro:
      'Deck and presentation-generation prompts for Gamma and Canva, the two tools where prompt quality visibly changes the output the most.',
    tier: 3,
    tile: 'lavender',
    icon: 'Presentation',
    serviceTarget: 'branding-agency',
  },

  // ---- Business ----
  {
    slug: 'startup',
    group: 'business',
    name: 'Startup & Strategy',
    blurb: 'Idea validation, pitch and strategy prompts for founders.',
    intro:
      'Founder prompts that force rigor — idea validation with real disconfirming questions, pitch-deck narratives, competitive analysis, pricing thinking — instead of cheerleading.',
    tier: 2,
    tile: 'yellow',
    icon: 'Rocket',
    serviceTarget: 'custom-software',
  },
  {
    slug: 'finance',
    group: 'business',
    name: 'Finance & Analysis',
    blurb: 'Budgeting, forecasting-narrative and analysis prompts.',
    intro:
      'Finance prompts scoped honestly: structuring analysis, explaining numbers you already have, building budget narratives — never a substitute for actual calculation or licensed advice.',
    tier: 3,
    tile: 'green',
    icon: 'ChartColumn',
  },
  {
    slug: 'consulting',
    group: 'business',
    name: 'Consulting & Frameworks',
    blurb: 'Structured problem-solving and framework prompts.',
    intro:
      'Consulting-style prompts — issue trees, MECE decompositions, stakeholder maps, executive summaries — the structured-thinking toolkit, applied through AI.',
    tier: 3,
    tile: 'lavender',
    icon: 'Network',
  },
  {
    slug: 'business-ops',
    group: 'business',
    name: 'Business Ops & Client Comms',
    blurb: 'Proposals, invoicing language and client-communication prompts.',
    intro:
      'The unglamorous writing every small business repeats — proposals, invoice line-item language, client follow-ups — extending the Invoice Generator and Email Signature Generator.',
    tier: 2,
    tile: 'yellow',
    icon: 'Briefcase',
    serviceTarget: 'custom-software',
  },

  // ---- Content Creation ----
  {
    slug: 'youtube',
    group: 'content',
    name: 'YouTube',
    blurb: 'Script, title, hook and thumbnail-brief prompts.',
    intro:
      'YouTube prompts across the full production loop — scripts with real retention structure, title/thumbnail concepting, hooks, descriptions — grounded in how the platform actually surfaces videos.',
    tier: 2,
    tile: 'yellow',
    icon: 'SquarePlay',
  },
  {
    slug: 'instagram',
    group: 'content',
    name: 'Instagram',
    blurb: 'Reels, carousel and caption prompts for Instagram.',
    intro:
      'Instagram prompts by format — Reels scripts, carousel outlines, captions with a real hook — because the formats reward different writing, not one generic "social post".',
    tier: 3,
    tile: 'lavender',
    icon: 'Camera',
  },
  {
    slug: 'x-twitter',
    group: 'content',
    name: 'X (Twitter)',
    blurb: 'Post, thread and hook prompts for X.',
    intro:
      'X prompts for the writing the platform rewards — tight single posts, threads that earn the next tap, hooks without bait — calibrated to how the feed actually distributes.',
    tier: 3,
    tile: 'blue',
    icon: 'MessageCircle',
  },
  {
    slug: 'blog-writing',
    group: 'content',
    name: 'Blog Writing',
    blurb: 'Outline, draft and editing prompts for long-form posts.',
    intro:
      'Long-form prompts that produce something worth publishing — outlines driven by search intent, drafts with a real point of view, editing passes that cut the AI-flavored filler.',
    tier: 2,
    tile: 'green',
    icon: 'NotebookPen',
    serviceTarget: 'seo-companies-for-small-business',
  },
  {
    slug: 'writing',
    group: 'content',
    name: 'Everyday Writing',
    blurb: 'Emails, resumes and everyday writing prompts.',
    intro:
      'Emails, resumes, study help, everyday writing — the highest-volume, lowest-intent category here, included for topical breadth rather than as a growth bet.',
    tier: 3,
    tile: 'lavender',
    icon: 'Type',
  },

  // ---- Education & Study ----
  {
    slug: 'students',
    group: 'education',
    name: 'Students & Study',
    blurb: 'Note-taking, summarizing and study-plan prompts.',
    intro:
      'Study prompts that build understanding instead of shortcutting it — active-recall questions, summaries you check against the source, study plans with honest time budgets.',
    tier: 3,
    tile: 'green',
    icon: 'GraduationCap',
  },
  {
    slug: 'research',
    group: 'education',
    name: 'Research',
    blurb: 'Literature-review, synthesis and citation-checking prompts.',
    intro:
      'Research prompts with the skepticism built in — literature mapping, claim-vs-evidence tables, citation verification — because a fluent summary of sources you never checked is worse than no summary.',
    tier: 3,
    tile: 'lavender',
    icon: 'BookOpen',
  },
  {
    slug: 'exam-prep',
    group: 'education',
    name: 'Exam Prep',
    blurb: 'Flashcard, mock-test and revision prompts.',
    intro:
      'Exam preparation prompts — spaced-repetition flashcards, mock questions at the right difficulty, weak-area diagnosis — for school exams, IELTS, GRE and professional certifications.',
    tier: 3,
    tile: 'yellow',
    icon: 'ClipboardCheck',
  },

  // ---- Image Generation ----
  {
    slug: 'midjourney',
    group: 'image-ai',
    name: 'Midjourney',
    blurb: 'V7-era natural-language and parameter prompts.',
    intro:
      'Midjourney prompts written for the V7 era — natural-language briefs over keyword stacks, with --stylize/--chaos/--ar parameter guidance that matches how the current model actually behaves.',
    tier: 2,
    tile: 'blue',
    icon: 'ImageIcon',
  },
  {
    slug: 'nano-banana',
    group: 'image-ai',
    name: 'Nano Banana',
    blurb: 'Product-photo and editing prompts for Gemini’s image model.',
    intro:
      'Prompts for Nano Banana (Gemini’s image model) — photorealistic product shots, precise edits, consistent characters — the strengths that made it 2026’s breakout image tool.',
    tier: 2,
    tile: 'green',
    icon: 'Banana',
  },
  {
    slug: 'flux',
    group: 'image-ai',
    name: 'Flux',
    blurb: 'Positive-description prompts for Flux models.',
    intro:
      'Flux prompts written correctly for the model — everything steered through positive description, since Flux has no negative-prompt field, with the photographic vocabulary it responds to.',
    tier: 3,
    tile: 'lavender',
    icon: 'Aperture',
  },
  {
    slug: 'ideogram',
    group: 'image-ai',
    name: 'Ideogram',
    blurb: 'Text-in-image and typography prompts for Ideogram.',
    intro:
      'Ideogram prompts leaning on its documented strength — legible text inside images: posters, logos, signage, social graphics with real typography.',
    tier: 3,
    tile: 'yellow',
    icon: 'LetterText',
  },
  {
    slug: 'dalle',
    group: 'image-ai',
    name: 'DALL·E / GPT Image',
    blurb: 'Prompts for OpenAI’s image generation in ChatGPT.',
    intro:
      'Prompts for image generation inside ChatGPT — conversational iteration, in-context edits and style references, written for how GPT-native image generation differs from dedicated image models.',
    tier: 3,
    tile: 'blue',
    icon: 'Wand',
  },

  // ---- Video & Audio ----
  {
    slug: 'veo',
    group: 'video-ai',
    name: 'Veo',
    blurb: 'Layered video briefs with native audio for Veo.',
    intro:
      'Veo prompts structured as layered briefs — subject and action, one camera move, environment, style, native audio — the structure that separates a usable clip from a lottery ticket.',
    tier: 2,
    tile: 'blue',
    icon: 'Clapperboard',
  },
  {
    slug: 'kling',
    group: 'video-ai',
    name: 'Kling',
    blurb: 'High-motion and physics-heavy video prompts for Kling.',
    intro:
      'Kling prompts that use its documented strength — high-motion scenes and physical realism — action beats, product-in-motion sequences, dynamic camera work.',
    tier: 3,
    tile: 'lavender',
    icon: 'Film',
  },
  {
    slug: 'runway',
    group: 'video-ai',
    name: 'Runway',
    blurb: 'Reference-driven and character-consistent prompts for Runway.',
    intro:
      'Runway prompts built around reference-driven generation — consistent characters across shots, controlled style transfer, brand-safe clips.',
    tier: 3,
    tile: 'yellow',
    icon: 'Video',
  },
  {
    slug: 'ai-audio',
    group: 'video-ai',
    name: 'Music & Voice',
    blurb: 'Suno and ElevenLabs prompts for music and voice design.',
    intro:
      'Audio prompts for the two tools that matter — Suno’s two-field Style + tagged-Lyrics format for music, and ElevenLabs’ description-driven voice design.',
    tier: 3,
    tile: 'green',
    icon: 'AudioLines',
  },
] as const

export const PROMPT_GROUP_BY_SLUG = new Map(
  PROMPT_GROUPS.map((g) => [g.slug, g] as const),
)

export const PROMPT_CATEGORY_BY_SLUG = new Map(
  PROMPT_CATEGORIES.map((c) => [c.slug, c] as const),
)

export function getPromptCategory(slug: string): PromptCategory | undefined {
  return PROMPT_CATEGORY_BY_SLUG.get(slug as PromptCategorySlug)
}

export function getPromptGroup(slug: string): PromptGroup | undefined {
  return PROMPT_GROUP_BY_SLUG.get(slug as PromptGroupSlug)
}

export function getCategoriesByGroup(group: PromptGroupSlug): readonly PromptCategory[] {
  return PROMPT_CATEGORIES.filter((c) => c.group === group)
}
