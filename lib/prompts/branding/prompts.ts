import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'define-brand-positioning-before-naming',
    category: 'branding',
    title: "Define your brand's positioning before you start naming it",
    description:
      'A structured positioning brief — category, customer, benefit and competitive alternative — so a name generator has an actual strategic target to hit instead of guessing at vibes.',
    promptText:
      'Act as a brand strategist running a positioning workshop. I\'m about to name a business and I want the strategic thinking locked down first, using the classic positioning framework: competitive alternatives, unique attributes, value, target customer, market category.\n\nHere\'s what I know:\n- What the business does: {{business_description}}\n- Who it\'s for: {{target_customer}}\n- The main benefit customers get: {{key_benefit}}\n- What customers currently do instead of using us: {{competitive_alternative}}\n- Words that should describe the brand\'s personality: {{personality_words}}\n\nDo this:\n1. Write a one-sentence positioning statement in the form: "For [target customer], [business] is the [market category] that [key benefit], unlike [competitive alternative], because [reason to believe]."\n2. List 3 points of difference (things only we credibly offer) and 3 points of parity (things customers expect from anyone in this category) — keep the two lists separate, don\'t blend them.\n3. Translate the positioning into 5 naming directions in plain English (e.g. "lean into the speed angle," "borrow credibility from the traditional/expert space," "signal approachability over expertise") — not actual names yet, just the strategic angle each name should chase.\n4. Flag anything in my inputs that contradicts itself (e.g. a "premium" personality word next to a "cheapest alternative" positioning) before I waste a naming session on a confused brief.\n\nOutput as a short brief I could hand to someone else, not prose paragraphs.',
    variables: [
      {
        name: 'business_description',
        description: 'What the business actually does, in plain language.',
        example:
          'A subscription box that ships single-origin coffee beans roasted the week they ship.',
        required: true,
      },
      {
        name: 'target_customer',
        description: 'Who the business serves — specific, not "everyone."',
        example:
          'Home coffee enthusiasts who already own a grinder and are bored of supermarket bags.',
        required: true,
      },
      {
        name: 'key_benefit',
        description:
          'The main outcome the customer gets, stated as a benefit, not a feature.',
        example:
          "Coffee that actually tastes like the tasting notes on the bag, because it's never stale.",
        required: true,
      },
      {
        name: 'competitive_alternative',
        description: 'What the customer does today instead of buying from this business.',
        example:
          'Buying whatever bag is on the supermarket shelf, or a big-name subscription that ships pre-ground.',
        required: true,
      },
      {
        name: 'personality_words',
        description:
          "Up to three adjectives describing the brand's intended personality.",
        example: 'Precise, warm, unpretentious',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'positioning',
      'brand-strategy',
      'naming',
      'differentiation',
      'points-of-parity',
    ],
    whyItWorks:
      'This is built on the standard SaaS/startup positioning canvas — competitive alternatives, unique attributes, points of difference vs. points of parity, target customer, market category — the same structure used to keep positioning work from collapsing into adjectives. Naming without this step produces names that sound pleasant but chase no strategy; separating points of difference from points of parity stops a brand from accidentally claiming credit for something every competitor already offers. The contradiction check exists because a naming session run on a self-contradicting brief (premium personality, cheapest-alternative claim) wastes the whole exercise before it starts.',
    exampleOutput:
      'Positioning statement: "For home coffee enthusiasts tired of stale supermarket bags, [Brand] is the roast-to-order subscription that tastes like its own tasting notes, unlike big-name subscriptions that ship pre-ground and stale, because every bag ships within 48 hours of roasting."\nNaming directions: (1) lean into freshness/time, (2) borrow craft/precision language from specialty coffee culture, (3) avoid generic "bean/roast" wordplay already owned by category leaders...',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-30' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
    relatedToolSlug: 'business-name-generator',
  },
  {
    slug: 'turn-example-sentences-into-tone-of-voice-guide',
    category: 'branding',
    title: 'Turn three example sentences into a documented tone-of-voice guide',
    description:
      'Reverse-engineers a one-page, enforceable voice guide from copy you already know sounds right — instead of inventing tone rules from scratch.',
    promptText:
      'Act as a brand-voice strategist. I\'m going to give you three sentences that sound exactly like how {{brand_name}} should talk, and I want you to reverse-engineer a documented tone-of-voice guide from them — not invent one from scratch.\n\nExample sentences that sound right:\n1. {{sentence_1}}\n2. {{sentence_2}}\n3. {{sentence_3}}\n\nAudience these sentences are aimed at: {{audience}}\n\nDo this:\n1. Score the voice on four spectrums, each as a position with a one-line justification quoting the examples directly: funny ↔ serious, formal ↔ casual, respectful ↔ irreverent, enthusiastic ↔ matter-of-fact.\n2. Extract 5 concrete "do" rules (e.g. "use contractions," "address the reader as you, never \'the user\'") and 5 "don\'t" rules, each grounded in a specific word choice or sentence structure from the examples above — not generic advice like "be authentic."\n3. Invent one generic, voice-neutral sentence yourself (e.g. a shipping confirmation or an error message) and rewrite it twice: once in the voice you just documented, once in its opposite. If the two rewrites don\'t read meaningfully different, the guide isn\'t specific enough — say so and tighten it.\n4. Flag if the three examples actually contradict each other (e.g. sentence 1 is playful, sentence 3 is corporate) before presenting a guide that papers over a real inconsistency.\n\nFormat as a one-page voice guide: the four spectrum scores at the top, then do/don\'t rules, then the before/after rewrite.',
    variables: [
      {
        name: 'brand_name',
        description: "The brand whose voice you're documenting.",
        example: 'Ledger&Co',
        required: true,
      },
      {
        name: 'sentence_1',
        description:
          'A real sentence (from any existing copy) that sounds exactly right for the brand.',
        example:
          "We read the fine print so you don't have to — then we tell you what it actually means.",
        required: true,
      },
      {
        name: 'sentence_2',
        description: 'A second real, on-voice sentence.',
        example:
          "No, we won't upsell you a plan you don't need. We'd rather you stay a customer.",
        required: true,
      },
      {
        name: 'sentence_3',
        description: 'A third real, on-voice sentence.',
        example: "Late invoice? Happens. Here's the two-line email that gets it paid.",
        required: true,
      },
      {
        name: 'audience',
        description: 'Who this voice is speaking to.',
        example:
          'Freelance bookkeepers who are skeptical of anything that sounds like corporate finance-speak.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['tone-of-voice', 'voice-guide', 'brand-voice', 'copywriting', 'consistency'],
    whyItWorks:
      'This uses the four-dimension tone-of-voice framework popularized by Nielsen Norman Group\'s writing research — funny/serious, formal/casual, respectful/irreverent, enthusiastic/matter-of-fact — because a spectrum position with a quoted justification is falsifiable in a way "friendly and professional" never is. Deriving the guide from copy you already approved, rather than inventing rules top-down, means the guide describes what the brand already does right, which makes it something a team can actually be held to. The opposite-voice rewrite is a deliberate discriminant test: a voice guide vague enough to describe any brand will produce two rewrites that don\'t actually sound different, which is the tell that it needs tightening before anyone tries to enforce it.',
    exampleOutput:
      'Formal ↔ Casual: strongly casual (contractions in all three examples, "you" address, no jargon)\nDo: use contractions; address the reader directly as "you"; keep sentences short enough to read in one breath...\nBefore (neutral): "Your invoice payment is overdue." After (brand voice): "Late invoice? Happens. Let\'s get it sorted."',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
    relatedToolSlug: 'slogan-generator',
  },
  {
    slug: 'tagline-brief-before-slogan-generator',
    category: 'branding',
    title: 'Write the strategic brief a tagline needs before you generate one',
    description:
      "The creative-brief step most people skip: decide what the tagline is claiming and why it's defensible, before running a batch through a generator.",
    promptText:
      'Act as a copy strategist writing the creative brief for a tagline, not the tagline itself. I\'ll feed this brief into a slogan generator afterward, so I need the strategic decisions made first — a generator can produce lines all day, but it can\'t decide what the brand should be claiming.\n\nBrand: {{brand_name}}\nMain benefit to claim: {{key_benefit}}\nTarget customer: {{target_customer}}\nTone to write in: {{chosen_tone}} (bold / friendly / premium / playful / minimal)\nWords, clichés or claims to avoid: {{must_avoid}}\n\nDo this:\n1. Write a one-sentence "single most important thing to communicate" — if the tagline can only land one idea, what is it? Reject vague answers like "quality" or "trust"; force a specific, ownable claim.\n2. Run 3 risk checks: is this benefit something a competitor already owns as their own tagline\'s territory, is it a claim we can actually substantiate, and is it generic enough that it could belong to any business in this category?\n3. Translate "{{chosen_tone}}" into 3 concrete copy rules for this brand specifically (e.g. for "minimal": max 5 words, no adjectives, no wordplay) — not a dictionary definition of the tone.\n4. Write 2 sample sentences in that tone as a calibration check, so I can confirm the tone reads right before generating a full batch.\n\nOutput as a short numbered brief, not paragraphs — I\'ll paste the benefit and tone straight into the generator afterward.',
    variables: [
      {
        name: 'brand_name',
        description: 'The brand the tagline is for.',
        example: 'Northlane Fitness',
        required: true,
      },
      {
        name: 'key_benefit',
        description: 'The one benefit the tagline should be built around.',
        example:
          "You get a coach's attention in a group class, not just a room full of strangers doing the same reps.",
        required: true,
      },
      {
        name: 'target_customer',
        description: 'Who the tagline needs to land with.',
        example:
          'Adults who tried big-box gyms and quit within a month because nobody noticed if they left.',
        required: true,
      },
      {
        name: 'chosen_tone',
        description: 'One of the five tones a slogan generator typically offers.',
        example: 'bold',
        required: true,
      },
      {
        name: 'must_avoid',
        description:
          'Words, clichés or claims the brand explicitly wants to steer away from.',
        example:
          '"Transform your life," "no pain no gain," anything implying weight loss is the point.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['tagline', 'creative-brief', 'positioning', 'copywriting', 'differentiation'],
    whyItWorks:
      "This separates strategy (what the tagline is allowed to claim) from execution (how it's phrased) — the same discipline behind a one-sentence creative brief in agency practice, where the brief is judged on whether it forces a specific, ownable claim rather than a generic value word like \"quality.\" The three risk checks exist because a generator like this site's own Slogan Generator will happily produce ten polished lines around a claim that's either indefensible or already owned by a competitor — volume without judgment. Calibrating the tone with two sample sentences before generating a full batch catches a mis-specified tone early, rather than after reviewing forty lines that all feel slightly wrong.",
    exampleOutput:
      'Single most important thing: "You\'re not anonymous here — the coach notices if you\'re not in the room."\nRisk check: benefit is specific and substantiated (small class caps), not generic; competitors mostly claim "results," not attention, so this is open territory...',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-29' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
    relatedToolSlug: 'slogan-generator',
  },
  {
    slug: 'visual-identity-mood-board-brief',
    category: 'branding',
    title: 'Brief your visual identity in words before you touch a colour picker',
    description:
      'Turns brand personality into a written colour, type and imagery direction — including a base colour and harmony choice — so a palette tool has a strategic starting point instead of a random hex code.',
    promptText:
      'Act as a visual-identity strategist writing a mood-board brief in words — no images yet. I need a direction I can hand to a colour-palette tool and a type search, not finished assets.\n\nBrand personality (up to three words): {{brand_personality}}\nIndustry: {{industry}}\nWhat competitors in this space visually look like, that we should NOT look like: {{competitor_look}}\nWhere this identity will mostly be seen: {{primary_use_context}}\n\nDo this:\n1. Translate each personality word into a colour direction: describe the hue family, whether the palette should lean high-chroma/saturated or low-chroma/muted, and light or dark in overall lightness. Justify each choice against the personality word, not just taste.\n2. Recommend one starting base colour (a named colour, e.g. "a deep teal" or "a warm terracotta") and which harmony to build it from — complementary, analogous, triadic, or a monochrome ramp — and say why, given the personality and the "don\'t look like competitors" constraint.\n3. Describe a typography pairing in words (e.g. "a humanist sans for body text, a high-contrast serif for headlines") that reinforces the same personality — describe the shape and feel, not specific font names, so a designer can pick a real typeface later.\n4. Describe imagery and photography direction in one paragraph: subject matter, framing, colour treatment, and what to avoid.\n5. Name the single biggest visual risk of this direction (e.g. "this could read as generic startup blue" or "this muted palette might look low-energy on a small mobile screen") and one concrete way to avoid it.\n\nOutput as a structured brief with headers for colour, type, imagery and risk.',
    variables: [
      {
        name: 'brand_personality',
        description: 'Up to three words describing the intended feel of the brand.',
        example: 'Grounded, warm, unfussy',
        required: true,
      },
      {
        name: 'industry',
        description: 'The category or industry the brand sits in.',
        example: 'Sustainable packaging for D2C food brands',
        required: true,
      },
      {
        name: 'competitor_look',
        description:
          'The visual style already common in this category, to deliberately avoid.',
        example:
          'Pastel green-and-cream, hand-drawn leaf icons, rounded eco-friendly sans-serifs — everyone in this space looks the same.',
        required: true,
      },
      {
        name: 'primary_use_context',
        description:
          'Where the identity will be seen most — packaging, app UI, storefront, etc.',
        example:
          'Shipping boxes and a product label seen for two seconds while unboxing.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'visual-identity',
      'mood-board',
      'colour-palette',
      'typography',
      'brand-strategy',
    ],
    whyItWorks:
      "Colour direction is asked for in perceptual terms (hue family, chroma, lightness) rather than a guessed hex code because that maps directly onto how this site's own Colour Palette Generator actually works — it builds harmonies in OKLCH specifically because HSL's lightness doesn't match perceived lightness, so describing intent in those terms produces a base colour and harmony choice that translates cleanly into the tool rather than a vibe that has to be re-interpreted. The \"don't look like competitors\" constraint is a deliberate differentiation step: category visual codes (every sustainable-packaging brand defaulting to pastel green and hand-drawn leaves) are exactly the kind of point-of-parity-by-accident a distinct identity needs to consciously break from, not repeat.",
    exampleOutput:
      'Colour: warm, low-to-mid chroma earth tones (terracotta, clay, warm cream) instead of category-standard pastel green — signals "grounded" without repeating the eco-pastel cliché.\nBase colour + harmony: a warm terracotta as base, built as an analogous ramp (terracotta → ochre → deep clay) for warmth without competing hues...',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-27' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-07-24' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
    relatedToolSlug: 'color-palette-generator',
  },
  {
    slug: 'brand-story-for-about-page',
    category: 'branding',
    title: 'Turn your founding story into an About page that earns trust',
    description:
      "Builds an About-page outline using the customer-as-hero framework, so the founder's story supports the reader's problem instead of upstaging it.",
    promptText:
      'Act as a brand storyteller using a customer-as-hero framework, where the customer is the hero of the story and the brand is the guide — not the other way around. Write the strategic skeleton for an About page, not final copy.\n\nThe moment or problem that led to starting this: {{founding_moment}}\nWho we\'re trying to help: {{audience}}\nWhat we believe that\'s different from how this industry usually operates: {{key_belief}}\nEvidence we can actually back up — numbers, credentials, results, not vibes: {{proof_points}}\n\nDo this:\n1. Identify the customer\'s external problem (the practical issue), internal problem (how it makes them feel), and philosophical problem (why it\'s just wrong that this problem exists) — three distinct layers, not one restated three times.\n2. Position the brand as guide, not hero: write one paragraph showing empathy for the problem, and one paragraph establishing authority using only the proof points given — do not invent credentials that weren\'t provided.\n3. Write a 3-step plan the customer would follow working with us, phrased from their point of view ("First you..., then..., then...").\n4. Draft an About-page outline (headers only, 5-7 sections) that follows this structure, ending with a call to action. Explicitly flag if "{{key_belief}}" reads like generic mission-statement language ("we believe in quality") rather than a specific, arguable position, and suggest a sharper version if so.\n\nOutput the outline with a one-line note under each header describing what goes there — not full paragraphs yet.',
    variables: [
      {
        name: 'founding_moment',
        description: 'The specific problem or moment that led to starting the business.',
        example:
          "Our founder spent 11 hours on hold trying to dispute a bank fee that shouldn't have existed.",
        required: true,
      },
      {
        name: 'audience',
        description: 'Who the business is trying to help.',
        example:
          "Small business owners who don't have time to fight their own bank over fees and errors.",
        required: true,
      },
      {
        name: 'key_belief',
        description:
          'A specific, arguable belief that differs from how the industry usually operates.',
        example:
          "Banking support should default to believing the customer, not making them prove they're not lying.",
        required: true,
      },
      {
        name: 'proof_points',
        description: 'Real, checkable evidence — numbers, credentials, results.',
        example:
          'Resolved 40,000+ disputes since 2023; average resolution time of 2 business days vs. an industry average of 3 weeks.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['brand-story', 'about-page', 'storytelling', 'positioning', 'copywriting'],
    whyItWorks:
      'This applies Donald Miller\'s StoryBrand structure, where the most common About-page failure is making the founder the hero of their own story instead of the customer — a page full of "our journey" reads as self-congratulation to a visitor who arrived looking for their own problem to be understood. Splitting the customer\'s problem into external, internal and philosophical layers is a concrete narrative tool for making empathy specific rather than generic ("we get it"), and restricting the authority paragraph to the proof points actually supplied is a deliberate guardrail against an LLM inventing credentials the business doesn\'t have. Flagging generic mission-statement language catches the single most common About-page failure: a belief so safe it could sit on any competitor\'s page unchanged.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-23' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-20' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
  },
  {
    slug: 'logo-brief-for-designer-or-image-generator',
    category: 'branding',
    title: 'Write a logo brief a designer — or an image generator — can actually use',
    description:
      "A constraint-first logo brief that front-loads legibility, cliché-avoidance and deliverables, so a designer or image-gen tool doesn't waste a round guessing at what you actually need.",
    promptText:
      'Act as a design director briefing a logo project — for a human designer or an image-generation tool — not designing the logo yourself. A good design brief front-loads constraints so nobody wastes a round of revisions guessing at them.\n\nBrand name: {{brand_name}}\nPersonality (up to three words): {{personality_words}}\nIndustry: {{industry}}\nWhere this logo needs to work, smallest to largest: {{usage_contexts}}\nExisting marks or styles we admire, for reference only, not to copy: {{style_references}}\n\nDo this:\n1. Recommend a logo type — wordmark, lettermark, pictorial mark, abstract mark, or combination mark — and justify it against the smallest usage context given. A mark that only works at billboard size is a brief failure if the smallest context is a 16px favicon.\n2. Write 3 "must survive at 16px" tests specific to this brief (e.g. "no more than 2 letters visible if it\'s a lettermark," "no stroke thinner than a defined weight") — concrete constraints, not general advice.\n3. List 3 visual clichés to explicitly avoid for this specific industry (e.g. a generic swoosh for "fast," a globe icon for "global") so a designer or image generator doesn\'t default to category clichés absent from explicit instruction otherwise.\n4. Describe colour and shape direction in one paragraph, consistent with the personality words, without picking exact colours — that\'s a separate step.\n5. Write the brief\'s deliverables section: format expectations (vector vs. raster), required variations (icon-only, horizontal lockup, dark-background version), and what "done" looks like.\n\nOutput as a numbered brief a freelancer or design tool could execute against without a follow-up call.',
    variables: [
      {
        name: 'brand_name',
        description: 'The brand the logo is for.',
        example: 'Marrow & Co.',
        required: true,
      },
      {
        name: 'personality_words',
        description: "Up to three words describing the brand's intended feel.",
        example: 'Handmade, confident, warm',
        required: true,
      },
      {
        name: 'industry',
        description: 'The category the brand operates in.',
        example: 'Small-batch leather goods',
        required: true,
      },
      {
        name: 'usage_contexts',
        description: 'Every place the logo must work, from smallest to largest.',
        example:
          'App icon and browser favicon, embossed leather stamp, storefront signage.',
        required: true,
      },
      {
        name: 'style_references',
        description: 'Existing marks admired for reference — not to be copied.',
        example:
          "The restraint of Aesop's wordmark; the confidence of Patagonia's mountain icon.",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['logo-brief', 'visual-identity', 'design-brief', 'favicon', 'brand-strategy'],
    whyItWorks:
      'The "must survive at 16px" test is a real, well-established logo-design constraint — a mark that only reads at billboard scale fails the moment it has to become a favicon or an app icon, so specifying the smallest use case first (rather than designing large and hoping it shrinks) prevents the single most common logo-brief failure. Naming category clichés explicitly matters because both human designers under deadline pressure and image-generation tools default to the visual shorthand of a category (swooshes for speed, globes for "global") unless a brief actively rules them out — an unwritten constraint isn\'t a constraint. Separating logo type and shape direction from exact colour choices keeps the brief decision-ordered: a designer needs to know it\'s a wordmark before colour matters at all.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-21' },
      { tool: 'Gemini', version: '3 Pro', date: '2026-07-19' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
    relatedToolSlug: 'favicon-generator',
  },
  {
    slug: 'competitor-positioning-map',
    category: 'branding',
    title: 'Map where you sit against competitors before you claim a difference',
    description:
      "Builds a 2x2 perceptual positioning map from what you actually know about competitors, to find real unclaimed territory instead of assuming you're already differentiated.",
    promptText:
      "Act as a competitive-strategy analyst building a 2x2 perceptual positioning map — the kind used to find unclaimed territory, not to catalogue every possible detail about competitors.\n\nOur brand: {{your_brand}}\nCompetitors to map against (comma-separated): {{competitors}}\nFirst axis, a dimension customers actually decide on: {{axis_1}}\nSecond axis, a different decision dimension: {{axis_2}}\nWhat you actually know about these competitors — their own marketing, pricing pages, reviews, not speculation: {{evidence_sources}}\n\nDo this:\n1. For each competitor plus us, place a position on both axes (e.g. \"low/high\" or a 1-10 estimate) with a one-line citation of what evidence supports that placement. If you're inferring rather than working from the evidence given, say so explicitly rather than presenting a guess as fact.\n2. Identify which quadrant is crowded (multiple competitors clustered together) and which quadrant is empty.\n3. Judge honestly whether the empty quadrant is empty because it's a genuine opportunity, or because nobody wants what's there — an empty quadrant isn't automatically good news. Give the reasoning either way.\n4. Write the one-sentence positioning claim we could credibly make if we moved toward the empty-but-viable quadrant, and name the point of parity we'd still need to maintain even while differentiating — customers rarely forgive a brand that differentiates by dropping something they consider table stakes.\n5. Flag if the two axes chosen aren't actually independent (e.g. \"premium\" and \"expensive\" measuring almost the same thing produces a fake map) and suggest a better second axis if so.\n\nOutput the map as a text-based grid — quadrant labels plus who's in each — followed by the written analysis.",
    variables: [
      {
        name: 'your_brand',
        description: 'Your own brand or business name.',
        example: 'Fernweg Coworking',
        required: true,
      },
      {
        name: 'competitors',
        description: 'The competitors to map against, comma-separated.',
        example: 'WeWork, a local independent coworking space, Regus',
        required: true,
      },
      {
        name: 'axis_1',
        description: 'A real dimension customers weigh when choosing between options.',
        example: 'Price, from budget to premium',
        required: true,
      },
      {
        name: 'axis_2',
        description: 'A second, genuinely different decision dimension.',
        example: 'Community/social atmosphere vs. quiet, heads-down focus',
        required: true,
      },
      {
        name: 'evidence_sources',
        description: 'What you actually know about competitors, and where it came from.',
        example:
          'Their published pricing pages, and Google reviews mentioning noise levels and event frequency.',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'competitor-analysis',
      'positioning-map',
      'brand-strategy',
      'market-research',
      'differentiation',
    ],
    whyItWorks:
      'A 2x2 perceptual map is a standard strategic-positioning tool precisely because it forces a claim of differentiation to be checked against a picture, rather than asserted in a sentence — a crowded quadrant makes it visually obvious when a brand\'s "unique" claim is actually shared by three competitors. Requiring the model to distinguish evidence-based placement from inference is a groundedness safeguard specific to this exercise: fabricated claims about named competitors are a real reputational risk if this analysis gets reused externally, so the brief explicitly asks for an admission of uncertainty rather than confident-sounding invention. The independent-axes check exists because the most common self-deceiving version of this exercise picks two axes that are secretly measuring the same thing, which produces a map that looks rigorous but tells you nothing new.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-07-18' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-15' },
    ],
    changelog: [{ date: '2026-08-01', note: 'Initial publish.' }],
  },
  {
    slug: 'brand-consistency-audit-across-touchpoints',
    category: 'branding',
    title: 'Audit your brand for inconsistency across every touchpoint you own',
    description:
      'Turns a plain list of where your brand appears into a prioritised checklist of concrete, yes/no-answerable mismatches — the due-diligence pass before any rebrand.',
    promptText:
      'Act as a brand auditor. I\'m going to list every place our brand currently shows up, and I want you to find the inconsistencies I\'m too close to the brand to notice myself — not redesign anything yet.\n\nEvery place the brand currently appears: {{touchpoints}}\nCurrent tagline or standard description, if any: {{current_tagline}}\nPlaces you already suspect are inconsistent: {{known_pain_points}}\n\nDo this:\n1. For each touchpoint listed, ask me 1 specific, yes/no-answerable question that would reveal a mismatch — e.g. for "email signature": "does the job-title format match how titles appear on the About page?"; for "invoices": "does the business name on invoices match the registered/trading name shown everywhere else?" Don\'t ask vague questions like "is it on-brand?"\n2. List the 5 most common rebrand-audit failure points from real practice — name/legal-entity mismatches, old logo files still live on third-party listings, inconsistent tone between formal documents and social copy, colour drift between print and digital, outdated taglines lingering on old collateral — and mark which of these my touchpoint list is at risk for, based on what I described.\n3. Prioritise the findings into "fix this week" (cheap, high-visibility) versus "fix during the next full redesign" (expensive, or requires new assets) — don\'t treat every inconsistency as equally urgent.\n4. Write 3 follow-up questions I should answer before doing anything else, if my answers above revealed I don\'t actually have a single source of truth for the current brand — e.g. no documented tone-of-voice guide, no locked colour values.\n\nOutput as a checklist I can literally work through, grouped by touchpoint.',
    variables: [
      {
        name: 'touchpoints',
        description: 'Every place the brand currently appears.',
        example:
          'Website, Instagram bio, email signatures, invoices, storefront sign, printed packaging.',
        required: true,
      },
      {
        name: 'current_tagline',
        description:
          'The tagline or standard description currently in use, if there is one.',
        example: '"Handmade goods, made to last."',
        required: false,
      },
      {
        name: 'known_pain_points',
        description: 'Places you already suspect are inconsistent with the rest.',
        example:
          "The storefront sign still has the old logo; invoices use the founder's personal name, not the trading name.",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['brand-audit', 'rebrand', 'consistency', 'touchpoints', 'brand-strategy'],
    whyItWorks:
      'Consistency audits fail when they stay at the level of "does this feel on-brand," a question too vague to act on — forcing each finding into a specific, yes/no-answerable question (does the job title format match, does the legal name match) produces something that can actually be checked and closed out, not just felt. The named failure-point list (legal-entity mismatches, stale third-party logo files, print/digital colour drift) comes from how real rebrand audits are actually run, and cross-checking the visitor\'s own touchpoint list against it catches risks they wouldn\'t think to ask about unprompted. Splitting findings into "fix this week" versus "fix at next redesign" matters because treating every inconsistency as equally urgent is the single most common reason audits get read once and never acted on.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Sonnet 5', date: '2026-08-02' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-31' },
    ],
    changelog: [{ date: '2026-08-03', note: 'Initial publish.' }],
    relatedToolSlug: 'email-signature-generator',
  },
  {
    slug: 'branding-design-system-token-audit-and-component-inventory',
    category: 'branding',
    title: `Turn a pile of inconsistent screens into a design system starter kit with a token audit and a component priority list`,
    description: `Feeds ChatGPT a description of your current, inconsistent UI and gets back a proposed token structure (color, spacing, type, radius), a prioritized list of which components to systematize first, and the specific inconsistencies to kill before anyone touches Figma.`,
    promptText: `You are acting as a design systems lead brought in to propose the starting structure for a design system for a product that currently has none — just screens built ad hoc by different people over time.

PRODUCT AND CURRENT STATE
{{product_and_current_state}}

KNOWN INCONSISTENCIES
{{known_inconsistencies}}

TEAM SIZE AND TOOLING
{{team_and_tooling}}

WHAT MUST SHIP FIRST
{{first_deliverable_deadline}}

Do not propose a full token taxonomy lifted from a well-known public design system (Material, Carbon, Polaris) and relabeled — propose a token structure sized to the inconsistencies actually described above, and say explicitly which layers (primitive tokens, semantic tokens, component tokens) this team genuinely needs versus which would be premature abstraction for a team this size. For each known inconsistency listed, name the specific token or rule that would have prevented it, not a generic "establish a color palette" recommendation — trace the fix back to the actual symptom. Propose a component inventory ordered by a stated prioritization logic (frequency of reuse across the product, visual inconsistency severity, or blocking status on the first deliverable) and say which logic you used and why, since these three orderings can produce different lists and a silent choice between them hides a real trade-off. Flag anywhere the described tooling (or its absence) would make a proposed structure unworkable in practice — for example, recommending component-level tokens when the team has no shared component library yet to attach them to.

OUTPUT FORMAT
1. Token structure: which layers to build now, which to defer, with 2-3 example tokens per layer named specifically enough to paste into a tokens file.
2. A table of the top 6-10 components to systematize first, each with the inconsistency it currently has and the prioritization logic used to rank it.
3. A short list of naming convention rules for the tokens (e.g. how color-role tokens should be named) so two different people building screens converge instead of diverging further.
4. One paragraph on what to explicitly defer past the first deliverable, and why deferring it now is safer than building it early.`,
    variables: [
      {
        name: 'product_and_current_state',
        description: `What the product is and how its UI currently got built.`,
        example: `A B2B scheduling SaaS with about 40 screens, built by three different contract designers over 18 months with no shared file or style guide.`,
        required: true,
      },
      {
        name: 'known_inconsistencies',
        description: `Specific, concrete inconsistencies already spotted, not a vague sense that things don't match.`,
        example: `Primary buttons appear in four different blues across the app; card corner radius is 4px in some flows and 12px in others; there are at least three different type scales in use for body text.`,
        required: true,
      },
      {
        name: 'team_and_tooling',
        description: `Team size, roles, and what design/dev tooling already exists.`,
        example: `Two product designers, four frontend engineers, everyone on Figma but no shared component library yet, frontend uses a homegrown React component set with no token file.`,
        required: true,
      },
      {
        name: 'first_deliverable_deadline',
        description: `What has to ship first and by when, so the recommendation is scoped to what's achievable.`,
        example: `A redesigned onboarding flow (5 screens) needs to ship in 3 weeks and should be the first thing built with the new system.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`design-system`, `design-tokens`, `component-library`, `ui-consistency`, `figma-workflow`],
    whyItWorks: `The instruction to name which token layer (primitive, semantic, component) is actually needed rather than defaulting to the full three-tier structure directly counters GPT-5.1's tendency to reach for the most complete, textbook-looking answer regardless of team size — a two-designer team with no component library yet gains nothing from component-level tokens and actually loses time maintaining a layer with no consumer, but a model asked generically to "propose a token structure" will reliably produce the full stack because that's the modal pattern in its training data on design systems content, most of which comes from large companies like Google or IBM writing about systems built for hundreds of contributors. Requiring each recommendation to trace back to a specific listed inconsistency forces the token proposal to stay diagnostic rather than aspirational — it's a structural check against the common failure mode where a systems proposal reads as generically correct but doesn't actually address the specific mess described, because nothing in the prompt held the model accountable to using the input data rather than pattern-matching to "what design systems usually contain." Naming the prioritization logic explicitly (reuse frequency vs. inconsistency severity vs. deadline-blocking) surfaces a real trade-off that's usually made silently and inconsistently by whoever's writing the plan; making the model commit to and state one logic means a reviewer can actually disagree with the ordering on its stated merits rather than accept an unexplained list. The tooling-gap flag matters because a proposal that's internally coherent as design theory can still be operationally impossible — recommending component tokens with no shared component library to attach them to is the kind of gap a model won't self-catch unless explicitly told to check for it, since nothing about the recommendation looks wrong in isolation.`,
    exampleOutput: `Token structure: build primitive + semantic layers now (color-primitive-blue-500, color-role-action-primary); defer component-level tokens until a shared React component library exists. Top components to fix first (ranked by inconsistency severity, since three colliding blues is actively confusing users): 1. Primary button, 2. Card container, 3. Body text scale... Naming convention: role-based, not value-based (color-role-action-primary, not color-blue-1). Defer: full component token layer — building it now with no shared component library means maintaining tokens nothing consumes yet.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'branding-color-palette-accessible-brand-system-from-one-anchor-color',
    category: 'branding',
    title: `Expand one brand anchor color into a full, contrast-checked palette instead of guessing at five more hex codes`,
    description: `Takes one anchor brand color plus context on where it'll be used and produces a working palette (primary, secondary, neutrals, semantic states) with explicit WCAG contrast reasoning, not just a swatch grid that looks nice and fails accessibility review later.`,
    promptText: `Act as a color systems consultant. I have one anchor brand color already decided (not negotiable, do not suggest replacing it) and need it expanded into a working palette for a real product, not a moodboard.

ANCHOR COLOR
{{anchor_color}}

WHERE IT WILL BE USED
{{usage_contexts}}

BRAND FEELING TO PRESERVE
{{brand_feeling}}

ACCESSIBILITY REQUIREMENT
{{accessibility_requirement}}

Step 1 — Diagnose the anchor color first: state its approximate hue/saturation/lightness character and what that means for how far it can shift before it stops reading as "the brand color" versus becoming a believable tint or shade of it. Do this before proposing anything, since a palette built without first understanding the anchor's own limits tends to either drift too far (loses brand recognition) or stay too close (fails contrast requirements).
Step 2 — Propose a full palette: 2-3 tints/shades of the anchor for primary UI use, one secondary/accent color that is NOT simply the anchor's complement unless you argue for why complementary is right here, a neutral gray scale with a hint of the anchor's hue rather than a pure gray (state the hex), and semantic colors for success/warning/error/info that read as their own category rather than random hues that happen to be red or green.
Step 3 — For every color intended for text-on-background or button-on-background use, state the actual contrast ratio against both a light and dark surface and flag explicitly which combinations fail the stated accessibility requirement, rather than presenting a swatch grid where contrast has to be checked later by someone else.
Step 4 — Name one realistic scenario where this palette would visibly break (e.g., a disabled-state button becoming indistinguishable from its enabled state, or a success/error pair that reads identically to a colorblind user) and propose the specific fix.

Do not present hex codes as a flat list with no reasoning attached — every color must be traceable to a stated purpose and a stated contrast result.

OUTPUT FORMAT
1. Anchor diagnosis (2-3 sentences).
2. Full palette as a table: role, hex, contrast ratio against white and against near-black, pass/fail against the stated requirement.
3. The one realistic failure scenario and its fix.
4. A one-paragraph note on what NOT to do with this palette (e.g. don't use the accent color for large background fills).`,
    variables: [
      {
        name: 'anchor_color',
        description: `The one brand color already locked in, as a hex code or clear description.`,
        example: `#2F6FED, a mid-tone blue used in the logo, already approved by the founders — cannot be changed.`,
        required: true,
      },
      {
        name: 'usage_contexts',
        description: `Where the palette actually needs to work — surfaces, not just "the website."`,
        example: `A web app dashboard (light mode default, dark mode planned for later), plus marketing site hero sections and email templates.`,
        required: true,
      },
      {
        name: 'brand_feeling',
        description: `The feeling the brand is going for, so tints/shades don't drift into a different mood.`,
        example: `Trustworthy fintech feel — calm and precise, not playful or loud; avoid anything that reads as a consumer social app.`,
        required: true,
      },
      {
        name: 'accessibility_requirement',
        description: `The specific standard to check against, so pass/fail has a real bar.`,
        example: `WCAG 2.1 AA for all text and interactive elements (4.5:1 for normal text, 3:1 for large text and UI components).`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`color-palette`, `brand-identity`, `accessibility`, `wcag-contrast`, `ui-color-system`],
    whyItWorks: `Forcing the anchor-color diagnosis as an explicit first step before any palette proposal counters a specific failure mode in how language models handle color: without being told to reason about the anchor's own HSL character first, GPT-5.1 tends to generate palettes by free-associating adjacent hues that look plausible in isolation but drift the brand's actual hue family, producing a palette that reads as generically "blue-ish tech company" rather than as recognizably this brand's blue. Requiring a stated contrast ratio for every text/button color, rather than a swatch grid, matters because contrast ratio is a real calculable number (relative luminance of foreground versus background) and a model asked only to "make an accessible palette" will describe colors as accessible in prose without the arithmetic actually working out — stating the ratio forces the kind of reasoning where a wrong claim is falsifiable by anyone who runs the same two hex codes through a contrast checker afterward, which keeps the answer honest in a way vague accessibility language doesn't. The instruction to justify rather than default to a complementary accent color addresses the reflexive habit (both in human design tutorials and in what the model has absorbed from them) of reaching for color-wheel complements as an unexamined default; naming a realistic failure scenario like a disabled-versus-enabled button collision forces consideration of state variations that a static five-swatch palette never has to confront, since palettes are usually evaluated as pretty grids rather than as systems that have to survive real interactive states like hover, disabled, and error simultaneously present on one screen.`,
    exampleOutput: `Anchor diagnosis: #2F6FED is a mid-saturation, mid-lightness blue — it has room to go two steps lighter before losing blue identity, but only one step darker before reading as navy/black. Palette: Primary-600 #2F6FED (4.6:1 on white, pass), Primary-100 #E8F0FE (background only, do not use for text)... Failure scenario: the proposed success-green and the primary blue both sit at similar lightness, which would read as near-identical for a deuteranopia user — fix: shift success green darker by one step to widen the perceptual gap.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'branding-typography-pairing-and-scale-for-brand-voice-consistency',
    category: 'branding',
    title: `Pick a typeface pairing and scale that actually matches how the brand talks, instead of two fonts that just look nice together`,
    description: `Gets ChatGPT to reason from your brand voice and real content examples to a heading/body typeface pairing, a type scale, and specific rules for where each font is allowed to appear, so typography reinforces the brand instead of just being a font-pairing pick.`,
    promptText: `Help me choose a typography system — not just "a nice font pairing," but a full decision covering typeface pairing, a type scale, and usage rules, reasoned from how this brand actually communicates.

BRAND VOICE
{{brand_voice}}

REAL CONTENT SAMPLE
{{content_sample}}

CONSTRAINTS
{{constraints}}

WHAT NEEDS TO SUPPORT THIS DECISION
{{platforms_needing_type}}

First, extract from the real content sample what the brand voice actually does on the page — is it terse and declarative, does it lean on long explanatory sentences, does it use a lot of numbers and data callouts — and connect specific typeface characteristics (x-height, contrast between thick/thin strokes, geometric versus humanist letterforms) to that observed voice, rather than describing fonts in isolation with adjectives like "modern" or "friendly" that don't connect back to anything concrete about this brand. Propose exactly one heading typeface and one body typeface (not a shortlist to choose from later), and justify the pairing specifically in terms of contrast that serves a purpose — different enough that headings are instantly distinguishable from body text at a glance, similar enough in mood that they don't read as two unrelated brands sharing a page. State whether both fonts are freely licensed for the listed platforms or whether a licensing check is needed before this becomes final — do not assume licensing is fine. Propose a type scale (the actual size/weight/line-height steps from H1 down to caption text) using a stated ratio or rationale, not arbitrary numbers. Write explicit rules for where the heading font is and is not allowed to appear — a common failure is a heading typeface creeping into body copy or UI buttons where it hurts readability at small sizes.

WHAT NOT TO DO
Do not recommend a currently-trendy pairing purely because it's popular in the design community right now — every recommendation must trace back to the voice analysis or the stated constraints. Do not propose more than one option per role; a shortlist defers the actual decision rather than making it.

OUTPUT FORMAT
1. Voice-to-letterform reasoning (short paragraph).
2. The chosen pairing (heading + body) with the specific justification.
3. Licensing status for the listed platforms, flagged if unconfirmed.
4. The type scale as a table (level, size, weight, line-height).
5. Usage rules: where the heading font is and isn't allowed to appear.`,
    variables: [
      {
        name: 'brand_voice',
        description: `How the brand is described, in the team's own words.`,
        example: `Confident and no-nonsense — we're a data infrastructure company that talks to engineers directly, not a consumer brand trying to be warm.`,
        required: true,
      },
      {
        name: 'content_sample',
        description: `An actual excerpt of real brand writing, not a description of the voice.`,
        example: `'Your pipeline drops packets under load. We show you exactly which node, at exactly which second, with a one-command rollback.' — from the homepage hero.`,
        required: true,
      },
      {
        name: 'constraints',
        description: `Budget, licensing, or technical constraints that narrow real options.`,
        example: `Must be free for commercial web use (Google Fonts or equivalent) and must render well at small sizes in a data-dense dashboard UI.`,
        required: true,
      },
      {
        name: 'platforms_needing_type',
        description: `Every place this typography actually needs to work, since coverage varies by platform.`,
        example: `Marketing website, product dashboard UI, and PDF export of usage reports.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`typography`, `font-pairing`, `brand-voice`, `type-scale`, `design-system`],
    whyItWorks: `Anchoring the typeface reasoning in an actual content excerpt rather than an abstract voice description matters because adjectives like "modern" or "approachable" are exactly the vocabulary GPT-5.1 defaults to when asked to reason about fonts in the abstract, and that vocabulary doesn't actually constrain which typeface gets picked — dozens of typefaces could plausibly be called modern. Giving it a real sentence of brand writing to analyze first forces the reasoning chain through something concrete and checkable: a terse, declarative sentence with specific numbers in it ("exactly which node, at exactly which second") points toward a typeface with higher legibility at small sizes and less decorative contrast than one would pick for a brand whose real writing is long and warm, and that connection is something a reader can actually verify against the sample rather than take on faith. Requiring exactly one recommendation per role rather than a shortlist closes off the model's tendency to hedge by presenting three options "to choose from" — a shortlist looks thorough but actually defers the decision back to the person who asked for it made, defeating the point of asking in the first place. The explicit licensing check matters because a font recommendation that sounds authoritative can still be commercially unusable, and a model asked generically about typefaces has no built-in incentive to flag licensing unless told to, since the aesthetic recommendation and the legal usability of a font are two entirely separate facts it isn't otherwise prompted to reconcile. The usage-rules section addresses a specific, common real-world failure — a striking display headline font that was never designed for body sizes ending up applied to UI buttons or dense paragraph text where its low x-height or heavy stroke contrast actively hurts readability — a failure that only gets caught if the prompt explicitly asks where the font should NOT go, since "where to use it" alone leaves the boundary undefined.`,
    exampleOutput: `Voice-to-letterform: the sample is terse, numeric, and declarative — this points toward a typeface with a large x-height and low stroke contrast for legibility at small dashboard sizes, not a high-contrast editorial serif. Pairing: heading — Inter Tight (Bold); body — Inter (Regular)... Licensing: both free for commercial use via Google Fonts, confirmed for all three listed platforms. Usage rule: heading font never appears below 16px or inside UI buttons — use body font at all UI control sizes.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
