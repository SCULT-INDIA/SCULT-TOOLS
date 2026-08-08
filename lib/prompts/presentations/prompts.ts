import type { Prompt } from '../types'

/**
 * "Design & Presentations" — Tier 3 (docs/research/prompt-library.md §4):
 * moderate prompt-culture strength, touches `branding-agency` lightly.
 * Gamma runs its own public prompt library on a Goal/Audience/Content/
 * Tone/Format framework — every Gamma prompt below is deliberately
 * structured around those five labels rather than a generic paragraph,
 * because that is the real, documented convention Gamma itself teaches.
 * Canva entries lean on the equally real Magic Design/Magic Write/Brand
 * Kit mechanics instead of a borrowed framework that doesn't apply to it.
 * Tome is dead (shut down its Slides product April 2025) and is
 * deliberately absent — see docs/research/prompt-library.md §1.
 *
 * Category default `serviceTarget` is 'branding-agency' (lib/prompts/
 * categories.ts) — omitted on every entry below rather than repeated,
 * per that category's "light touch" Tier 3 CTA intensity.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'gamma-investor-pitch-deck',
    category: 'presentations',
    title: 'Turn a startup idea into an investor-ready Gamma deck',
    description:
      'A Goal/Audience/Content/Tone/Format prompt — Gamma’s own structuring framework — that produces a proper investor-deck section order on the first pass instead of a generic 10-slide template.',
    promptText:
      'Goal: {{pitch_goal}}\n\nAudience: {{investor_audience}}\n\nContent: {{deck_content}}\n\nTone: {{deck_tone}}\n\nFormat: A {{slide_count}}-slide investor pitch deck (Presentation format). Structure it in this order: Problem, Solution, Market size, Product/demo, Business model, Traction, Competition, Team, The ask. One idea per card, minimal text per card, and leave room on the traction and market-size cards for a chart rather than a paragraph.',
    variables: [
      {
        name: 'pitch_goal',
        description:
          'What you need this specific deck to accomplish, not just "pitch investors."',
        example:
          'Raise a $1.5M seed round to hire two engineers and reach 500 paying customers within 12 months.',
        required: true,
      },
      {
        name: 'investor_audience',
        description: 'Who is actually reading this, and how they read decks.',
        example:
          'Pre-seed/seed VCs and angels who see 15-20 decks a week and skim before they read closely.',
        required: true,
      },
      {
        name: 'deck_content',
        description:
          'The raw material: one-liner, problem, solution, current traction numbers, team background, the ask.',
        example:
          'One-liner: an AI invoicing assistant for SMBs who waste 6 hrs/week on manual invoicing. Traction: 40 paying customers, $6k MRR, 18% MoM growth for 4 months. Team: ex-Stripe engineer + ex-QuickBooks PM. Ask: $1.5M at an $8M cap.',
        required: true,
      },
      {
        name: 'deck_tone',
        description: 'How it should read. Leave blank for Gamma’s neutral default.',
        example:
          'Confident and concrete — numbers over adjectives, no "revolutionary" or "game-changing."',
        required: false,
      },
      {
        name: 'slide_count',
        description:
          'Target card count. Leave blank to let Gamma size it to the content.',
        example: '12',
        required: false,
      },
    ],
    targetTools: ['Gamma'],
    tags: [
      'gamma',
      'pitch deck',
      'investor deck',
      'startup',
      'fundraising',
      'presentation',
    ],
    whyItWorks:
      'Gamma’s own prompting guidance is built around five labelled inputs — Goal, Audience, Content, Tone, Format — and each one is a real generation parameter, not decoration. Stating the Goal (raise money vs. update existing investors vs. recruit) changes which sections Gamma weights; naming the Audience changes information density, because "skims 15 decks a week" produces shorter cards than "wants full financials"; Content gives it facts to slot in rather than invent; Tone is enforced across every card, not just the intro, which is what actually suppresses generic hype language; and a specific Format — the exact investor-deck section order — is what stops Gamma from defaulting to a generic outline instead of the order VCs expect to see.',
    exampleOutput:
      'A 12-card Presentation: title card, then one card each for Problem, Solution, Market size (with a chart placeholder), Product/demo, Business model, Traction (with a growth chart), Competition (a 2x2), Team, and a closing Ask card with the raise amount and use of funds — short, numbers-led bullets throughout, no paragraph-length cards.',
    verifiedAgainst: [
      {
        tool: 'Gamma',
        version: 'Generate → Presentation format (web app)',
        date: '2026-08-01',
      },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Gamma’s current Generate flow and Goal/Audience/Content/Tone/Format input fields.',
      },
    ],
  },
  {
    slug: 'gamma-one-pager-from-doc',
    category: 'presentations',
    title: 'Turn a long doc into a one-page Gamma summary',
    description:
      'Paste an existing brief, spec, or report into Gamma and get back a single skimmable page instead of Gamma’s default instinct to spread it across a multi-card deck.',
    promptText:
      'Goal: {{one_pager_goal}}\n\nAudience: {{one_pager_audience}}\n\nContent: {{source_doc}}\n\nTone: {{one_pager_tone}}\n\nFormat: A single-page one-pager (Document format, one card/page only — do not split this into a multi-card deck). Headline, then a 2-3 sentence summary, then 3-5 subheaded sections with short bullets pulled from the content above, ending in a clearly boxed "Next step" callout.',
    variables: [
      {
        name: 'one_pager_goal',
        description: 'What the reader should walk away knowing or doing.',
        example:
          'Get a busy exec to approve the Q3 roadmap without reading the full 6-page spec.',
        required: true,
      },
      {
        name: 'one_pager_audience',
        description: 'Who is reading this and how much context they already have.',
        example:
          'The VP of Product, who has not read the underlying spec and has 3 minutes.',
        required: true,
      },
      {
        name: 'source_doc',
        description:
          'Paste the full source document or its key sections — not a summary of it.',
        example:
          '[Paste the full Q3 roadmap spec here: goals, workstreams, timeline, risks, and resourcing.]',
        required: true,
      },
      {
        name: 'one_pager_tone',
        description:
          'How formal or casual the summary should read. Leave blank for a neutral default.',
        example:
          'Direct and executive — lead with the decision needed, not the background.',
        required: false,
      },
    ],
    targetTools: ['Gamma'],
    tags: ['gamma', 'one-pager', 'document', 'executive summary', 'brief'],
    whyItWorks:
      'Left unconstrained, Gamma’s Generate flow defaults toward Presentation-style pagination — one idea per card across many cards — because that is its most common use case. Naming Format as "Document, one card only" explicitly overrides that default. Pasting the full source as Content (not a pre-written summary) matters because Gamma condenses better than it infers: it needs the actual detail to choose what to cut, the same reason a human editor asks for the full draft rather than your summary of it. The Goal field is what tells it which details are load-bearing for this specific reader versus safe to drop.',
    exampleOutput:
      'One scrollable page: a headline stating the ask, a 3-sentence summary, four subheaded sections (Workstreams, Timeline, Risks, Resourcing) each with 3-4 bullets pulled verbatim from the spec, and a bordered "Next step: approve by Friday" box at the bottom.',
    verifiedAgainst: [
      {
        tool: 'Gamma',
        version: 'Generate → Document format (web app)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Gamma’s Document format output and single-card pagination behaviour.',
      },
    ],
  },
  {
    slug: 'canva-magic-design-social-carousel',
    category: 'presentations',
    title: 'Turn one blog post into a Canva Magic Design carousel',
    description:
      'Feed Canva Magic Design a one-idea-per-slide brief and a platform format, and get a ready-to-edit carousel instead of one crammed slide of bullet points.',
    promptText:
      'Create a {{slide_count}}-slide {{platform}} carousel about: {{topic_summary}}\n\nAudience: {{audience}}\nTone: {{tone}}\n\nOne idea per slide only: a hook on slide 1, one point per slide after that, and end on a clear call-to-action slide: {{cta}}. Use my Brand Kit colours and fonts throughout — do not introduce colours outside the kit.',
    variables: [
      {
        name: 'slide_count',
        description: 'How many slides/cards the carousel should have.',
        example: '7',
        required: true,
      },
      {
        name: 'platform',
        description:
          'Which platform format to generate for — changes the canvas ratio Canva builds to.',
        example: 'Instagram',
        required: true,
      },
      {
        name: 'topic_summary',
        description:
          'The source content, condensed to its actual points — not just the blog post title.',
        example:
          'Our post "5 invoice mistakes that delay payment": late-fee clauses, missing PO numbers, vague line items, no accepted-payment-methods list, and no due date stated in words as well as a date.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is scrolling past this and what they already know.',
        example:
          'Small-business owners who send their own invoices and skim, not accountants.',
        required: true,
      },
      {
        name: 'tone',
        description: 'How it should read. Leave blank for Magic Design’s default.',
        example:
          'Punchy and a little wry — like a friend pointing out a mistake, not a lecture.',
        required: false,
      },
      {
        name: 'cta',
        description: 'The exact action the last slide should ask for.',
        example:
          'Save this and check your last invoice against it before you send the next one.',
        required: true,
      },
    ],
    targetTools: ['Canva Magic Design'],
    tags: ['canva', 'magic design', 'social media', 'carousel', 'instagram', 'linkedin'],
    whyItWorks:
      'Magic Design generates from a text brief plus a selected format, and it defaults to filling whatever slide count it thinks is reasonable with whatever content density fits — which is how you end up with slide 3 carrying four points and slide 6 carrying none. Explicitly capping it at "one idea per slide" and stating the exact slide count forces even pagination instead. "Use my Brand Kit colours and fonts" is not cosmetic phrasing: Magic Design only pulls a connected Brand Kit’s saved palette and type when the brief asks for it — left unstated, it falls back to its own template theme, which is the most common reason an AI-generated carousel looks off-brand on the first draft.',
    exampleOutput:
      'A 7-slide Instagram carousel: slide 1 is the hook ("Your invoice might be why you’re not getting paid on time"), slides 2-6 each cover one mistake with a short headline and one line of copy, slide 7 is the CTA — all in the connected Brand Kit’s colours and fonts.',
    verifiedAgainst: [
      {
        tool: 'Canva',
        version: 'Magic Design, carousel/social formats (web)',
        date: '2026-07-18',
      },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial publish, verified against Magic Design’s brief-plus-format generation flow and Brand Kit pull-through.',
      },
    ],
  },
  {
    slug: 'canva-brand-kit-consistent-deck',
    category: 'presentations',
    title: 'Generate an on-brand Canva deck from your Brand Kit',
    description:
      'Name your Brand Kit and its exact colours explicitly so Canva Magic Design builds the whole deck from your palette instead of its own template theme.',
    promptText:
      'Create a {{slide_count}}-slide presentation about: {{deck_topic}}\n\nBrand Kit: use the "{{brand_kit_name}}" Brand Kit. Apply its logo to the title and closing slides, use its saved colours ({{brand_colors}}) as the only palette, and use its saved fonts for every heading and body element. Do not introduce colours or fonts outside this kit.\n\nAudience: {{audience}}\nTone: {{tone}}',
    variables: [
      {
        name: 'slide_count',
        description: 'Target number of slides.',
        example: '10',
        required: true,
      },
      {
        name: 'deck_topic',
        description: 'What the deck is actually about.',
        example: 'Our Q3 product roadmap, for the all-hands meeting.',
        required: true,
      },
      {
        name: 'brand_kit_name',
        description: 'The exact name of the Brand Kit as saved in Canva.',
        example: 'Acme Co. — Primary',
        required: true,
      },
      {
        name: 'brand_colors',
        description:
          'The exact hex codes from that Brand Kit, stated explicitly rather than left implicit.',
        example: 'primary #1B4B43, secondary #F2C14E, neutral #FAFAF7',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is in the room.',
        example: 'The whole company, most of whom are not on the product team.',
        required: true,
      },
      {
        name: 'tone',
        description: 'How it should read. Leave blank for a neutral default.',
        example: 'Upbeat but specific — real dates and owners, not just themes.',
        required: false,
      },
    ],
    targetTools: ['Canva Magic Design'],
    tags: ['canva', 'brand kit', 'on-brand', 'magic design', 'presentation', 'branding'],
    whyItWorks:
      'Canva’s Brand Kit mechanics only bite when a generation prompt references the kit by name and states its assets explicitly — an unnamed "use my brand colours" request is exactly the phrasing Magic Design most often ignores in favour of its own template palette, because it has nothing concrete to apply. Stating the hex codes directly, not just the kit name, is a second layer of insurance: Magic Design snaps to explicit values far more reliably than it looks up a saved kit’s values on its own. "Do not introduce colours outside this kit" closes the most common failure mode — Magic Design adding an accent colour from its own default theme to a chart or icon it generates.',
    exampleOutput:
      'A 10-slide deck with the Acme Co. logo on the title and closing slides, every heading in the Brand Kit’s heading font, body copy in its body font, and every chart, icon and background pulling only from #1B4B43 / #F2C14E / #FAFAF7 — no stray template colours.',
    verifiedAgainst: [
      {
        tool: 'Canva',
        version: 'Magic Design with connected Brand Kit (web)',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified that naming the kit and stating explicit hex codes changes Magic Design’s output palette versus an unnamed "use my brand colours" request.',
      },
    ],
    relatedToolSlug: 'color-palette-generator',
  },
  {
    slug: 'gamma-sales-proposal-deck',
    category: 'presentations',
    title: 'Draft a client-ready sales proposal deck in Gamma',
    description:
      'Turn discovery notes and a price into a proposal deck structured around the client’s stated goals, not a generic capabilities overview.',
    promptText:
      'Goal: {{proposal_goal}}\n\nAudience: {{client_audience}}\n\nContent: {{discovery_notes}}\n\nTone: {{proposal_tone}}\n\nFormat: A {{slide_count}}-slide proposal deck structured as: Understanding your goals, Proposed approach, Scope & deliverables, Timeline, Investment, Why us (brief case study or proof point), Next steps. Keep the Investment slide to the number and payment terms only — no upsell language on that slide.',
    variables: [
      {
        name: 'proposal_goal',
        description: 'What this specific proposal needs to do — not just "win the deal."',
        example:
          'Get Riverside Dental to sign off on the 3-month engagement, not just circulate a capabilities overview internally.',
        required: true,
      },
      {
        name: 'client_audience',
        description: 'The specific stakeholder reading this and what they care about.',
        example:
          'A non-technical Head of Marketing who cares about outcomes and budget, not process.',
        required: true,
      },
      {
        name: 'discovery_notes',
        description: 'Raw discovery-call notes: scope, pain points, pricing, timeline.',
        example:
          'Pain: their landing pages convert at 1.1%, industry average is 2.8%. Scope: redesign + A/B test 3 pages over 6 weeks. Price: $9,500 flat. Timeline: kickoff within 2 weeks of signing.',
        required: true,
      },
      {
        name: 'proposal_tone',
        description: 'How it should read. Leave blank for a neutral default.',
        example:
          'Warm but precise, like a considered email — no "we are thrilled" or "excited to partner."',
        required: false,
      },
      {
        name: 'slide_count',
        description: 'Target slide count. Leave blank to let Gamma size it.',
        example: '9',
        required: false,
      },
    ],
    targetTools: ['Gamma'],
    tags: [
      'gamma',
      'sales proposal',
      'proposal deck',
      'client deck',
      'presentation',
      'business-ops',
    ],
    whyItWorks:
      'A proposal deck fails for a different reason than a pitch deck does: it reads as a reusable capabilities deck with the client’s name swapped in. Putting the actual discovery notes in Content — the real numbers and pain points from that specific call — forces Gamma to write the "Understanding your goals" and "Proposed approach" slides around this client’s stated problem rather than a generic service description. Naming the Goal ("get sign-off," not "impress them") is what keeps the Investment slide direct instead of padded with reassurance copy. The fixed Format order matters because clients skim proposals looking for scope and price first — burying either past slide 2 reads as evasive.',
    exampleOutput:
      'A 9-slide deck opening with a slide restating the client’s stated conversion problem in their own numbers, a proposed-approach slide mapped to that problem, a clean scope/timeline/investment sequence, a single relevant case study, and a next-steps slide with a specific signing date.',
    verifiedAgainst: [
      {
        tool: 'Gamma',
        version: 'Generate → Presentation format (web app)',
        date: '2026-08-03',
      },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Gamma’s current Generate flow with discovery-note content pasted directly into the Content field.',
      },
    ],
    relatedToolSlug: 'invoice-generator',
  },
  {
    slug: 'canva-magic-write-slide-copy',
    category: 'presentations',
    title: 'Write tighter slide copy with Canva Magic Write',
    description:
      'Give Magic Write a word cap and bullet count up front so slide copy fits the text box on the first draft instead of needing three rounds of "Shorten."',
    promptText:
      'Write slide copy for a slide titled "{{slide_title}}."\n\nKey point: {{key_point}}\nAudience: {{audience}}\nTone: {{tone}}\n\nLength: no more than {{max_words}} words total, as exactly {{bullet_count}} short bullet points. Fragments, not full sentences. No sub-bullets — if a point needs a qualifier, cut the qualifier rather than nest it.',
    variables: [
      {
        name: 'slide_title',
        description:
          'The slide’s heading, already decided — Magic Write is filling in the body.',
        example: 'Why churn dropped this quarter',
        required: true,
      },
      {
        name: 'key_point',
        description: 'The one thing this slide has to communicate, in your own words.',
        example:
          'We cut churn from 6.2% to 3.8% monthly by adding a cancellation-flow survey and a win-back offer triggered off it.',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is reading the slide.',
        example:
          'The leadership team, in a monthly metrics review — they want the number and the cause.',
        required: true,
      },
      {
        name: 'tone',
        description: 'How it should read. Leave blank for Magic Write’s default.',
        example:
          'Plain and confident — no hedging like "we believe this may have contributed."',
        required: false,
      },
      {
        name: 'max_words',
        description: 'Hard word cap for the whole slide body.',
        example: '25',
        required: true,
      },
      {
        name: 'bullet_count',
        description:
          'Exact number of bullets — controls how the copy paginates on the slide.',
        example: '3',
        required: true,
      },
    ],
    targetTools: ['Canva Magic Write'],
    tags: ['canva', 'magic write', 'slide copy', 'ai copywriting', 'presentations'],
    whyItWorks:
      'Magic Write’s default behaviour, left unconstrained, is to write in full sentences at roughly paragraph length — which is why the most common next click after using it is "Shorten," sometimes twice. Stating the word cap and exact bullet count in the initial brief gets a usable draft in one pass instead of one generation plus two refine-in-place edits, because Magic Write treats an explicit length instruction as a hard constraint on the first generation rather than something it only respects once asked to revise. "No sub-bullets" heads off its other default habit: nesting a qualifier under a bullet instead of cutting it, which is exactly what causes text to overflow a fixed-size slide text box.',
    exampleOutput:
      '"Churn: 6.2% → 3.8% monthly · Cause: cancellation-flow survey + triggered win-back offer · Rolled out mid-quarter, held through renewal cycle" — 3 bullets, 22 words, no sub-points.',
    verifiedAgainst: [
      {
        tool: 'Canva',
        version: 'Magic Write, slide/presentation editor (web)',
        date: '2026-07-15',
      },
    ],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Initial publish, verified that an explicit word cap and bullet count in the initial brief reduces the need for a follow-up "Shorten" pass.',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'gamma-webpage-from-outline',
    category: 'presentations',
    title: 'Turn a content outline into a Gamma webpage',
    description:
      'Gamma can generate a full, live, published webpage — not just a slide deck — from a section-by-section outline, complete with a hero and CTA.',
    promptText:
      'Goal: {{page_goal}}\n\nAudience: {{page_audience}}\n\nContent: {{page_outline}}\n\nTone: {{page_tone}}\n\nFormat: A Gamma webpage (Site format, not Presentation). A hero section with a headline and a "{{primary_cta}}" button, then one section per item in my outline, in the order given — including a testimonial/proof section if the outline has one — and a footer repeating the "{{primary_cta}}" button.',
    variables: [
      {
        name: 'page_goal',
        description: 'What a visitor should do on this page, specifically.',
        example: 'Get visitors to book a 15-minute demo call for our invoicing app.',
        required: true,
      },
      {
        name: 'page_audience',
        description: 'Who is landing on this page and from where.',
        example:
          'Small-business owners arriving from a Google Ads campaign, seeing this for the first time.',
        required: true,
      },
      {
        name: 'page_outline',
        description: 'Your section-by-section outline — paste it as-is, in order.',
        example:
          '1. Problem: invoicing takes hours. 2. Solution: our AI assistant. 3. How it works (3 steps). 4. Customer quote. 5. Pricing. 6. FAQ. 7. Final CTA.',
        required: true,
      },
      {
        name: 'page_tone',
        description: 'How the copy should read. Leave blank for a neutral default.',
        example: 'Clear and benefit-led — no jargon, short sentences.',
        required: false,
      },
      {
        name: 'primary_cta',
        description: 'The exact button/CTA text to repeat in the hero and footer.',
        example: 'Book a free demo',
        required: true,
      },
    ],
    targetTools: ['Gamma'],
    tags: ['gamma', 'webpage', 'landing page', 'site', 'gamma sites'],
    whyItWorks:
      'Gamma defaults its Generate flow to Presentation format unless a different Format is stated — asking for "Site" or "webpage" explicitly is what routes the same Goal/Audience/Content/Tone inputs into a scrollable page with a hero and CTA button instead of a card deck. Pasting the outline as an ordered list, rather than a paragraph description of the page, is what keeps Gamma from re-ordering or merging sections on its own judgement; it treats a numbered outline as a literal section order to follow. Repeating the exact CTA text in both Format instructions (hero and footer) matters because a page with two differently-worded CTAs reads as two different offers, not one page.',
    exampleOutput:
      'A published Gamma site: hero with headline + "Book a free demo" button, then Problem, Solution, How it works, a pull-quote testimonial section, Pricing, FAQ accordion, and a footer with the same CTA button repeated.',
    verifiedAgainst: [
      {
        tool: 'Gamma',
        version: 'Generate → Site/webpage format (web app)',
        date: '2026-08-05',
      },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Gamma’s Site format output and ordered-outline section mapping.',
      },
    ],
    relatedToolSlug: 'favicon-generator',
  },
  {
    slug: 'gamma-onboarding-training-deck',
    category: 'presentations',
    title: 'Build a new-hire onboarding deck in Gamma from your handbook',
    description:
      'Turn scattered handbook sections and pinned docs into one structured onboarding deck a new hire can actually get through in one sitting.',
    promptText:
      'Goal: {{onboarding_goal}}\n\nAudience: {{new_hire_audience}}\n\nContent: {{handbook_content}}\n\nTone: {{onboarding_tone}}\n\nFormat: A presentation structured as: Welcome & what we do, Your first-week checklist, Tools & access, Team & who to ask what, Culture & norms, Where to go if you’re stuck. One topic per card. Render the first-week checklist as literal checkboxes, not a paragraph.',
    variables: [
      {
        name: 'onboarding_goal',
        description:
          'What "done" looks like by the end of week one — functional, not just informed.',
        example:
          'A new support hire can handle a standard ticket alone by the end of their first week.',
        required: true,
      },
      {
        name: 'new_hire_audience',
        description: 'Who this is for and what they already know coming in.',
        example:
          'Brand-new support hires with no prior experience at this company, first day on the job.',
        required: true,
      },
      {
        name: 'handbook_content',
        description:
          'Paste the actual handbook sections, tool lists, and team directory — not a summary.',
        example:
          '[Paste: company handbook intro, list of tools with access instructions, team org chart with roles, and the internal support-ticket process doc.]',
        required: true,
      },
      {
        name: 'onboarding_tone',
        description: 'How it should read. Leave blank for a neutral default.',
        example:
          'Friendly and plain-spoken — like a helpful colleague explaining it over coffee, not HR boilerplate.',
        required: false,
      },
    ],
    targetTools: ['Gamma'],
    tags: [
      'gamma',
      'onboarding',
      'training deck',
      'new hire',
      'internal comms',
      'presentation',
    ],
    whyItWorks:
      'Onboarding material usually fails because it was written once, for everyone, in HR voice — the same handbook paragraph a new hire has to translate into "what do I actually do Monday morning." Structuring the Format around a literal first-week checklist forces Gamma to convert prose policy into actionable steps rather than reproducing the handbook’s own paragraph structure. Naming the Goal as "functional, not informed" changes what Gamma keeps versus trims from the handbook content — it prioritises access steps and who-to-ask information over the historical or philosophical sections a handbook often opens with, which matter far less on day one.',
    exampleOutput:
      'A deck opening with a one-card company overview, a checklist card with checkbox items ("Get Slack access," "Meet your onboarding buddy," "Complete tools setup"), a tools/access card with direct links, a simple org-chart-style team card, a culture/norms card, and a closing "who to ask" card mapped by topic.',
    verifiedAgainst: [
      {
        tool: 'Gamma',
        version: 'Generate → Presentation format (web app)',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Gamma’s checklist-style card rendering when the Format explicitly requests literal checkboxes.',
      },
    ],
  },
]
