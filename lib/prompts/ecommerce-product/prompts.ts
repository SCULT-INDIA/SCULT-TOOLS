import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'ecommerce-product-description-benefit-ladder',
    category: 'ecommerce-product',
    title: `Turn a spec sheet into a product description that sells the outcome, not the feature list`,
    description: `Builds a product description by laddering every raw spec up to the concrete outcome it produces for one named buyer, so the page reads as a reason to buy instead of a restated data sheet.`,
    promptText: `You are writing a product description page for an ecommerce listing. My biggest risk is writing a features list with adjectives sprinkled on top instead of copy that tells a specific buyer why this specific spec matters to them.

PRODUCT
{{product_name}}

RAW SPECS OR FEATURES
{{raw_specs}}

TARGET BUYER
{{target_buyer}}

MAIN OBJECTION TO OVERCOME
{{main_objection}}

BRAND VOICE
{{brand_voice}}

RULES
For every spec I gave you, ladder it up through "which means" until you reach a concrete, physical or emotional outcome the target buyer experiences — a spec that stops at "which means it's more durable" hasn't finished laddering; keep going until you hit something the buyer would actually notice in their life. Do not invent a benefit that isn't supportable by the spec I gave you — if a spec has no clear buyer-facing consequence, say so instead of manufacturing one. Open the description with the single outcome that most directly answers the main objection, not with a generic hook about the product category. Write in the specified brand voice but never let voice override clarity — a joke or flourish is cut before a fact is cut. Do not use the words "revolutionary," "game-changing," "premium quality," or "perfect for" — these are the words that make ecommerce copy indistinguishable from every competitor's.

WHAT NOT TO DO
Do not write a bullet list disguised as prose — this is a description, and it should read as 2-4 short paragraphs a real person would read before checkout, not a wall of comma-separated adjectives.

OUTPUT FORMAT
1. The finished product description (120-220 words).
2. A table mapping each raw spec to its laddered outcome, so I can see the reasoning and cut anything that feels like a stretch.
3. One line naming which sentence most directly addresses the main objection.`,
    variables: [
      {
        name: 'product_name',
        description: `The exact product being described.`,
        example: `Aria 3-in-1 stainless steel pour-over kettle`,
        required: true,
      },
      {
        name: 'raw_specs',
        description: `The bare specs or features as they exist in your spec sheet.`,
        example: `0.9L capacity, gooseneck spout, thermometer built into lid, 304 stainless steel, induction-compatible base`,
        required: true,
      },
      {
        name: 'target_buyer',
        description: `Who is actually going to click buy on this listing.`,
        example: `Home coffee hobbyists who already own a burr grinder but have been using a standard kettle and getting inconsistent pour speed`,
        required: true,
      },
      {
        name: 'main_objection',
        description: `The specific hesitation stopping this buyer from purchasing.`,
        example: `They think a gooseneck kettle is a gimmick that won't actually change how their coffee tastes`,
        required: true,
      },
      {
        name: 'brand_voice',
        description: `How the brand talks, in a few words or a reference.`,
        example: `Direct and a little dry, no exclamation points, talks to the buyer like a knowledgeable friend not a salesperson`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-description`,
      `ecommerce-copywriting`,
      `conversion-copy`,
      `benefit-driven`,
      `listing-optimization`,
    ],
    whyItWorks: `GPT-5.1 defaults to a feature-forward register when it's handed a spec sheet, because specs are the most information-dense part of the input and the model naturally optimizes for including everything it was given rather than deciding what a buyer actually needs to hear — the explicit "which means" laddering instruction forces a second inference pass per spec instead of a single restatement pass, which is the mechanical difference between a spec sheet with better adjectives and copy that argues a case. Requiring the model to stop only when it reaches something the buyer would actually notice, rather than an intermediate abstraction like "more durable," closes the most common failure mode of AI-generated product copy: benefits that are technically true but still too abstract to move anyone, because the model stopped laddering one step too early. Banning specific words like "premium quality" and "game-changing" matters because these are exactly the phrases GPT-5.1 reaches for as a default intensifier when it doesn't have a concrete outcome to state instead — removing the escape hatch forces the substantive answer. The output table forcing a visible spec-to-outcome mapping exists because it's the only way to audit whether a claimed benefit is actually supportable by the given spec or whether the model quietly stretched — a failure mode transformer language models are especially prone to when asked to sound persuasive under a word-count constraint.`,
    exampleOutput: `Most kettles pour in one uncontrollable rush, which is why your first thirty seconds of blooming coffee grounds never come out even. The Aria's gooseneck spout narrows that rush into a thin, steady stream you can actually aim — so the water hits the grounds in the slow spiral your recipe actually calls for, instead of flooding one side of the filter...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-amazon-listing-a9-compliant',
    category: 'ecommerce-product',
    title: `Draft an Amazon listing that survives A9's keyword-stuffing filters instead of getting suppressed`,
    description: `Produces an Amazon title, five bullet points, and backend search terms sized to Amazon's actual character limits and written to avoid the repetition patterns that trigger listing suppression.`,
    promptText: `You are writing an Amazon product listing — title, five bullet points, and backend search terms — for a seller who has previously had a listing flagged for keyword stuffing and wants this one to read naturally to a shopper while still surfacing for the right searches.

PRODUCT
{{product_name}}

CATEGORY
{{amazon_category}}

PRIMARY KEYWORDS TO RANK FOR
{{primary_keywords}}

KEY DIFFERENTIATOR VS COMPETITORS
{{key_differentiator}}

COMPLIANCE CONSTRAINTS
{{compliance_constraints}}

PHASE 1 — TITLE
Write a title at or under 200 characters (adjust down if the category has a tighter Amazon limit and say so) in the format: Brand + Product Type + Key Attribute + Quantity/Size, using each primary keyword exactly once and never repeating a keyword across the title and reserving the rest for bullets and backend terms. Do not include subjective claims ("best," "#1") or promotional language ("free shipping," "sale") — these violate Amazon style guidelines and are a common suppression trigger.

PHASE 2 — FIVE BULLET POINTS
Each bullet leads with a capitalized 2-4 word benefit tag, then one sentence of proof or mechanism. Distribute the primary keywords across bullets so no single bullet is keyword-dense — one natural keyword mention per bullet is enough. Reserve exactly one bullet for the key differentiator versus competitors, argued specifically, not just asserted.

PHASE 3 — BACKEND SEARCH TERMS
List backend search terms (under 249 bytes total) covering keyword variants, misspellings-a-buyer-might-search, and synonyms not already used in the title or bullets — never repeat a word already spent in the visible listing, since backend space is wasted on redundant terms.

WHAT NOT TO DO
Do not stack keywords as a bare comma list anywhere in the title or bullets — every keyword must sit inside a grammatically real sentence a shopper would read without noticing it was there for search.

OUTPUT FORMAT
Title / five bullets / backend terms, each in its own labeled section, followed by a one-line character/byte count check for each.`,
    variables: [
      {
        name: 'product_name',
        description: `The product's brand and product type.`,
        example: `Kettlebright brand adjustable dumbbell set`,
        required: true,
      },
      {
        name: 'amazon_category',
        description: `The Amazon category the listing sits in, since title limits vary by category.`,
        example: `Sports & Outdoors > Exercise & Fitness > Strength Training Equipment`,
        required: true,
      },
      {
        name: 'primary_keywords',
        description: `The search terms you actually want to rank for.`,
        example: `adjustable dumbbell set, home gym dumbbells, dumbbell weight set 5-25 lbs`,
        required: true,
      },
      {
        name: 'key_differentiator',
        description: `What makes this listing's product different from the top competing ASINs.`,
        example: `Weight changes with a single dial turn in under 3 seconds, versus competitors' pin-and-plate systems that take 20+ seconds per change`,
        required: true,
      },
      {
        name: 'compliance_constraints',
        description: `Any category-specific Amazon restrictions to respect.`,
        example: `No health claims allowed since this isn't an FDA-regulated category exemption; avoid implying injury prevention`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `amazon-listing`,
      `amazon-seo`,
      `a9-algorithm`,
      `ecommerce-copywriting`,
      `marketplace-optimization`,
    ],
    whyItWorks: `Amazon's A9 ranking system and its separate style-compliance review are two different systems with different failure modes, and most AI-generated listings fail the second one even when they'd rank fine on the first — a title or bullet that reads as a comma-stacked keyword list gets caught by Amazon's automated style scanners regardless of relevance, which is why the instruction to keep every keyword inside a real sentence matters mechanically more than keyword density does. Splitting keyword distribution explicitly across the title, five separate bullets, and backend terms, with an instruction never to repeat a keyword already spent, addresses GPT-5.1's default behavior of front-loading every important term into the title because it reads as the highest-value real estate — which is exactly the pattern that gets a listing suppressed for stuffing, since backend search term space exists precisely so visible copy doesn't have to carry that burden. Requiring the differentiator bullet to argue the claim specifically rather than assert it addresses a separate, common weakness: GPT-5.1 will happily write "unmatched quality" as a bullet if not constrained, which is both a compliance risk (unsubstantiated superlative) and commercially useless against a shopper comparing two similar-looking ASINs. The explicit character/byte counting step at the end matters because Amazon enforces hard limits that vary by category and are easy for a model to miscalculate when generating text to a target length rather than measuring it after the fact.`,
    exampleOutput: `Title: Kettlebright Adjustable Dumbbell Set, Home Gym Dumbbells 5-25 lbs, Single-Dial Quick Change... Bullet 1: QUICK-CHANGE DIAL — Switch weights in under 3 seconds with one turn, no loose plates or pins to sort through mid-set...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-shopify-page-conversion-blocks',
    category: 'ecommerce-product',
    title: `Write a Shopify product page section by section, matched to where shoppers actually drop off`,
    description: `Produces Shopify product page copy broken into the specific content blocks (hero, trust bar, comparison, objection-handling FAQ) rather than one long description, so each section does one conversion job.`,
    promptText: `You are writing the copy for a Shopify product page, broken into the distinct content blocks a modern Shopify theme actually renders as separate sections, not a single scrolling description.

PRODUCT
{{product_name}}

PRICE POINT
{{price_point}}

WHERE SHOPPERS CURRENTLY DROP OFF
{{drop_off_point}}

SOCIAL PROOF AVAILABLE
{{social_proof}}

SHIPPING/RETURN POLICY
{{shipping_policy}}

For each block below, write only what that block should say — do not blend blocks together:

1. HERO (above the fold, next to the product image): One headline stating the core outcome, one subheadline handling the price point directly if it's a premium price versus alternatives, and a single CTA button label.
2. TRUST BAR (directly under hero): 3-4 short trust signals (shipping speed, return window, warranty, certification) as scannable fragments, not sentences — this block exists to reduce anxiety in the first five seconds, not to persuade.
3. THE CASE (mid-page): 2-3 short paragraphs making the actual argument for the product, addressing the specific drop-off point directly — if shoppers are dropping off at a price objection, this section must earn the price, not just describe features.
4. SOCIAL PROOF BLOCK: If real social proof was provided, format it as a short, specific pull-quote plus context (not a generic 5-star blurb); if none was provided, write a placeholder instruction for what proof to go collect instead of inventing a fake quote.
5. FAQ (bottom): 4 questions that pre-empt real objections, written as a shopper would actually phrase them, not as marketing questions in disguise ("Why is this the best?" is not a real shopper question).

WHAT NOT TO DO
Never fabricate a customer quote, review count, or statistic in the social proof block — if I didn't give you real proof, say so explicitly and flag it as a gap to fill before launch.

OUTPUT FORMAT
Five labeled sections in the order above, each ready to paste into its corresponding Shopify section.`,
    variables: [
      {
        name: 'product_name',
        description: `The product this page is for.`,
        example: `Solace weighted blanket, 15lb`,
        required: true,
      },
      {
        name: 'price_point',
        description: `The price and how it compares to alternatives shoppers might be considering.`,
        example: `$129, roughly 40% above the big-box weighted blankets on the same search results page`,
        required: true,
      },
      {
        name: 'drop_off_point',
        description: `Where analytics or user feedback show shoppers actually leave the page.`,
        example: `Heatmap shows most exits happen right after scrolling past the price, before reaching the FAQ`,
        required: true,
      },
      {
        name: 'social_proof',
        description: `Any real testimonials, review stats, or press mentions you actually have.`,
        example: `4.8 stars across 340 reviews on the current listing; one verified review specifically mentions it staying cool overnight`,
        required: false,
      },
      {
        name: 'shipping_policy',
        description: `The actual shipping and return terms to state as trust signals.`,
        example: `Free shipping over $75, 100-night trial with free returns`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `shopify-copywriting`,
      `product-page-cro`,
      `ecommerce-copywriting`,
      `conversion-optimization`,
      `page-structure`,
    ],
    whyItWorks: `Shopify themes render a product page as discrete, independently-scrolling sections rather than one flowing document, so copy that reads well as continuous prose often fails on the actual page because each section gets seen in isolation, sometimes out of order on mobile depending on theme layout — instructing GPT-5.1 to treat each block as a separate brief with its own single job prevents the common failure of one long description that has to be manually chopped up after the fact and loses its logical flow in the process. Anchoring "the case" section directly to the named drop-off point, rather than a generic mid-page pitch, matters because GPT-5.1 without that constraint will write a balanced, general persuasion paragraph that doesn't specifically address why real shoppers on this exact page are leaving — the model has no way to prioritize the price objection over five other plausible objections unless told which one the data actually shows. The explicit ban on fabricating a testimonial or review count addresses a specific and well-documented failure mode: generative models asked for "social proof" copy will produce plausible-sounding but entirely invented quotes and numbers if not told to flag the absence of real data, which on a real commerce page is both a trust risk and, in several jurisdictions, a deceptive-advertising risk the merchant would be legally exposed to, not the model.`,
    exampleOutput: `HERO: Sleep under real weight, not a marketing claim. At $129, it costs more than the blanket next to it in your search results — because that one won't still be evenly weighted in six months. [Try It For 100 Nights]
TRUST BAR: Free shipping over $75 · 100-night trial · Free returns · Machine washable...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-title-variant-testing-set',
    category: 'ecommerce-product',
    title: `Generate a set of testable product title variants instead of one guess at the best title`,
    description: `Produces 5 structurally distinct product title candidates, each optimized for a different plausible buyer trigger, so you have a real A/B test set instead of five reworded versions of the same idea.`,
    promptText: `Give me 5 product title variants for {{product_name}} that I can actually A/B test against each other — not five versions of the same title with synonyms swapped, but five titles built on genuinely different hypotheses about what makes a buyer click.

PRODUCT AND KEY ATTRIBUTES
{{product_attributes}}

PLATFORM THIS TITLE WILL RUN ON
{{platform}}

CHARACTER LIMIT
{{character_limit}}

COMPETING TITLES ON THE SAME RESULTS PAGE
{{competing_titles}}

Build each variant around a different trigger, and label which trigger it's testing:
Variant A — SPECIFICITY: leads with the single most concrete, differentiating attribute (a number, a material, a mechanism).
Variant B — USE CASE: leads with who it's for or when it's used, not what it is.
Variant C — COMPARISON IMPLICIT: structured to read as a clear upgrade over what the competing titles on the page are offering, without naming a competitor.
Variant D — OUTCOME: leads with the result the buyer gets, with the product category named second.
Variant E — MINIMAL: strips to the fewest words that still fully identify the product, betting that clarity beats persuasion at the title stage.

Each variant must respect the character limit exactly and must not repeat the same opening word as another variant — if two variants would naturally start the same way, force a genuine structural difference instead.

WHAT NOT TO DO
Do not use any variant as a dumping ground for every attribute — a title is not the place to list everything; each variant tests one hypothesis and should stay disciplined to it even if that means leaving out a true, positive fact.

OUTPUT FORMAT
A table: variant letter, trigger name, the title text, character count, and one sentence on what result would tell you this variant won (e.g., "higher CTR would mean buyers respond to concreteness over outcome framing").`,
    variables: [
      {
        name: 'product_name',
        description: `The product needing a title.`,
        example: `Hyprflow reusable water bottle, 32oz`,
        required: true,
      },
      {
        name: 'product_attributes',
        description: `The concrete facts available to build titles from.`,
        example: `Vacuum insulated, keeps cold 24hrs, leak-proof straw lid, fits standard car cup holders, made from recycled stainless steel`,
        required: true,
      },
      {
        name: 'platform',
        description: `Where this title will actually appear, since limits and norms differ.`,
        example: `Shopify collection page and Google Shopping feed`,
        required: true,
      },
      {
        name: 'character_limit',
        description: `The hard character limit to respect.`,
        example: `70 characters for Google Shopping title field`,
        required: true,
      },
      {
        name: 'competing_titles',
        description: `What similar products' titles look like on the same results page, so a comparison-implicit variant has something real to differentiate against.`,
        example: `"HydroPro Insulated Bottle 32oz" and "EcoSteel Water Bottle - BPA Free"`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-title`,
      `ab-testing`,
      `ecommerce-copywriting`,
      `conversion-optimization`,
      `google-shopping`,
    ],
    whyItWorks: `Asked for "five title options" without structural constraints, GPT-5.1 tends to produce five paraphrases clustered around the same underlying idea, because the model is sampling from the same region of its output distribution each time rather than being pointed at genuinely different strategies — naming five distinct psychological triggers up front forces the sampling into different regions and produces variants that are actually informative to test against each other, rather than five near-duplicates that would just split traffic without teaching you anything. Requiring each variant to name what winning would prove is what turns this from a copywriting exercise into an actual experiment design — without that line, a merchant running an A/B test on five similar-looking titles has no way to interpret a result beyond "this one word choice happened to work," which doesn't generalize to the next product. The explicit instruction against dumping every attribute into each variant addresses GPT-5.1's tendency, under a hard character limit, to try to maximize information density rather than commit to one clear angle — a title that tries to be concrete, use-case-driven, and outcome-focused simultaneously within 70 characters usually ends up saying nothing clearly, which defeats the point of testing hypotheses in isolation.`,
    exampleOutput: `A (Specificity): Hyprflow 32oz Steel Bottle, Cold 24 Hrs, Leak-Proof Straw — 54 chars — tests whether the cold-retention number alone drives clicks.
B (Use Case): Hyprflow Bottle for Commutes — Fits Any Car Cup Holder — 58 chars — tests whether context beats spec...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-feature-bullets-skeptic-proof',
    category: 'ecommerce-product',
    title: `Write feature bullets that hold up against the specific skeptic reading your listing, not a generic shopper`,
    description: `Produces five feature bullets each built to survive one real objection a skeptical buyer would raise, rather than five feature statements that only work if the reader is already convinced.`,
    promptText: `Write five feature bullets for {{product_name}} aimed at the most skeptical realistic version of my buyer — someone who has been burned by an overhyped listing before and reads bullets looking for the catch, not the pitch.

FEATURES TO COVER
{{features_list}}

WHAT SKEPTICS SPECIFICALLY DOUBT ABOUT THIS PRODUCT CATEGORY
{{category_skepticism}}

PROOF POINTS AVAILABLE
{{proof_points}}

For each of the five features, write the bullet in this shape: a bolded 2-5 word claim tag, then one sentence that answers the specific skeptical question a doubtful reader would silently ask about that exact claim — not a generic elaboration, the actual doubt. If I gave you a real proof point (a test result, a spec, a certification) that supports the claim, use it; if I didn't give you one for a particular feature, write the bullet honestly with a softer, defensible claim rather than inventing a number or certification to sound more convincing.

Before the five bullets, name in one line what you believe the single most common silent objection is for this category, based on what I told you about category skepticism — this is what each bullet is being written to survive.

WHAT NOT TO DO
Do not write a bullet that is just the feature restated with an intensifier ("incredibly durable" is not an answer to "will this actually last"). Do not use unverifiable superlatives ("the best," "unmatched") anywhere — a skeptical reader treats an unverifiable superlative as a red flag, not reassurance, and it will cost more trust than it buys attention.

OUTPUT FORMAT
One line naming the core skeptical objection, followed by the five bullets, followed by a short note flagging any bullet where you had to soften the claim because no proof point was given for it.`,
    variables: [
      {
        name: 'product_name',
        description: `The product the bullets are for.`,
        example: `Denveo memory foam office chair`,
        required: true,
      },
      {
        name: 'features_list',
        description: `The raw features to turn into bullets.`,
        example: `Adjustable lumbar support, breathable mesh back, 5-year frame warranty, weight-tested to 350lbs, tool-free assembly`,
        required: true,
      },
      {
        name: 'category_skepticism',
        description: `What buyers in this exact category have learned to doubt from past bad experiences.`,
        example: `Office chair buyers have been burned by 'ergonomic' chairs that looked adjustable in photos but had lumbar support that didn't actually move, and warranties that excluded the part that broke`,
        required: true,
      },
      {
        name: 'proof_points',
        description: `Any real test data, certifications, or specs backing up the claims.`,
        example: `Frame load-tested by an independent lab to 350lbs static load; warranty explicitly covers frame, gas lift, and armrests, not just fabric`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `feature-bullets`,
      `ecommerce-copywriting`,
      `objection-handling`,
      `trust-building`,
      `listing-optimization`,
    ],
    whyItWorks: `GPT-5.1's default mode for a bullet list is enumerative and additive — restate the feature, attach a positive adjective, move to the next one — which produces bullets that sound fine to a neutral reader but do nothing for the specific reader who has already been disappointed by similar claims before; naming the category-level skepticism explicitly and requiring each bullet to answer the silent doubt behind it forces the model to write toward a specific reader's mental objection instead of toward the feature itself. The instruction to soften a claim rather than invent a proof point when none was given directly counters a well-documented tendency of language models under a persuasive-writing brief to manufacture specificity (a percentage, a lab name, a certification) because specific-sounding claims score as more convincing in the model's training signal, even when nothing in the prompt supports them — for ecommerce copy this isn't just a style problem, it's a claim a merchant could be held legally accountable for making. Banning unverifiable superlatives matters mechanically for the stated skeptical reader specifically: a shopper primed to distrust the listing reads "the best" as evidence the seller has nothing more specific to say, which makes the superlative actively counterproductive rather than neutral filler, unlike with a more credulous reader where it might pass unnoticed.`,
    exampleOutput: `Core objection: that 'adjustable ergonomic' features are cosmetic and don't actually move once you sit down.
**Lumbar support that actually slides** — the pad moves up to 3 inches on a separate track from the recline mechanism, so it stays where you set it instead of resetting when you lean back...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-comparison-honest-tradeoffs',
    category: 'ecommerce-product',
    title: `Build a product comparison that names the real tradeoff instead of quietly stacking the deck`,
    description: `Produces a comparison table and short verdict between your product and a named alternative that states one honest disadvantage of your product, so the comparison reads as credible rather than obviously self-serving.`,
    promptText: `Build a comparison between {{your_product}} and {{alternative_product}} for shoppers actively deciding between the two.

YOUR PRODUCT'S REAL ADVANTAGES
{{your_advantages}}

WHERE THE ALTERNATIVE GENUINELY WINS
{{alternative_advantages}}

WHO SHOULD ACTUALLY PICK THE ALTERNATIVE
{{when_alternative_wins}}

STEP 1 — COMPARISON TABLE
Build a table across the dimensions that actually matter to a buyer choosing between these two (price, the specific advantages and disadvantages I gave you, and any dimension you can reasonably infer matters here) — not a padded table with dimensions invented just to make ours look better on more rows.

STEP 2 — THE HONEST CONCESSION
Write one short paragraph stating plainly where the alternative genuinely wins, using the information I gave you. This paragraph must be written with the same confidence and specificity as the rest of the copy — not buried, hedged, or written in noticeably weaker language than the paragraphs praising our product, since a visibly hedged concession reads as more deceptive than no concession at all.

STEP 3 — WHO SHOULD BUY THE ALTERNATIVE INSTEAD
Using what I told you about when the alternative wins, write one or two sentences explicitly telling the reader to go buy the alternative if that describes them. Yes, this means sending some readers away — that is the point, and it's what makes the rest of the comparison credible.

STEP 4 — VERDICT
One paragraph stating who should pick our product and why, referencing the tradeoff directly rather than ignoring it.

WHAT NOT TO DO
Do not let the comparison table include a dimension where the alternative's disadvantage was invented or exaggerated beyond what I told you — if you're not confident in a comparison point I didn't explicitly give you, flag it as an assumption rather than stating it as fact.

OUTPUT FORMAT
Table, then the four labeled paragraphs in order.`,
    variables: [
      {
        name: 'your_product',
        description: `The product you're selling.`,
        example: `Corvo electric standing desk converter`,
        required: true,
      },
      {
        name: 'alternative_product',
        description: `The specific competing product or category shoppers are weighing against yours.`,
        example: `A full electric standing desk frame from a competitor brand`,
        required: true,
      },
      {
        name: 'your_advantages',
        description: `Where your product genuinely wins.`,
        example: `One-third the price, no assembly or desk replacement needed, works on any existing desk surface`,
        required: true,
      },
      {
        name: 'alternative_advantages',
        description: `Where the competing option genuinely wins — stated honestly, not softened.`,
        example: `More stable at max height with heavy dual-monitor setups, larger work surface overall, cleaner cable management built into the frame`,
        required: true,
      },
      {
        name: 'when_alternative_wins',
        description: `The specific buyer profile who should actually choose the alternative.`,
        example: `Anyone running two 27-inch monitors plus a laptop stand who needs full desk stability at standing height all day`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-comparison`,
      `competitive-positioning`,
      `ecommerce-copywriting`,
      `trust-building`,
      `conversion-copy`,
    ],
    whyItWorks: `GPT-5.1 given a comparison brief without explicit instruction defaults to a subtly one-sided output, because the framing of "comparison for our product's page" reads as an implicit goal to make our product win, and the model satisfies that goal by hedging the competitor's real advantages into weaker language even when told to state them — which is precisely the pattern that makes AI-written comparison pages read as untrustworthy marketing rather than genuine buying guidance to a discerning shopper. Explicitly instructing the concession paragraph to be written with equal confidence and specificity as the rest of the copy is the mechanism that actually prevents this, because it removes the model's default escape hatch of technically including the concession while still tonally undermining it through hedged phrasing ("admittedly, some users might find..."). Telling the model to actively send certain readers to the alternative is the strongest form of this correction — a comparison confident enough to redirect some of its own traffic reads as credible specifically because self-interested copy never does that, and shoppers researching a considered purchase have generally seen enough comparison pages to recognize the ones that never admit a real downside. The instruction to flag unconfirmed comparison points as assumptions addresses the separate risk of the model padding out the alternative's weaknesses beyond what was actually provided, which would just recreate the dishonesty problem from the opposite direction.`,
    exampleOutput: `Where the frame desk wins: at full standing height with two 27-inch monitors and a laptop stand, a dedicated frame desk is measurably more stable — the Corvo converter can show slight flex under that exact load, which a full frame doesn't. If that's your setup, the frame desk is the better buy...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-category-page-copy-scent-trail',
    category: 'ecommerce-product',
    title: `Write category page copy that helps shoppers self-sort instead of repeating what the products already say`,
    description: `Produces category page intro copy and a filter-guidance blurb that helps a shopper narrow down which product in the category is right for them, instead of restating what each product page already covers.`,
    promptText: `Write the intro copy and filter guidance for a category page — the goal is helping a shopper who landed here without a specific product in mind narrow down to the right one, not repeating what each individual product page already says.

CATEGORY
{{category_name}}

PRODUCTS IN THIS CATEGORY AND HOW THEY DIFFER
{{product_range}}

MOST COMMON CONFUSION SHOPPERS HAVE IN THIS CATEGORY
{{common_confusion}}

AVAILABLE FILTERS
{{available_filters}}

PART 1 — INTRO (40-70 words)
Open by naming the confusion shoppers actually have when browsing this category, then state the one distinction that resolves most of it. Do not describe the category in general terms ("we offer a wide range of great products") — that wastes the one paragraph a shopper will actually read before scrolling to products.

PART 2 — FILTER GUIDANCE
For each available filter, write one short line explaining what question that filter actually answers for the shopper, in the shopper's language, not the internal product-attribute language a merchandiser would use. A filter like "resistance level" should be explained as what it changes about their experience, not just defined.

PART 3 — QUICK-SORT GUIDE
Write a short table: 3-4 shopper situations (drawn from the product range and common confusion I gave you) mapped to which product or filter combination fits that situation — this is the actual payoff of the page, giving an undecided shopper a fast, confident starting point instead of forcing them to compare every product manually.

WHAT NOT TO DO
Do not repeat product-level copy that belongs on the individual product pages — this page's only job is routing the shopper to the right one faster, not selling any single product in depth.

OUTPUT FORMAT
Three labeled sections as specified above.`,
    variables: [
      {
        name: 'category_name',
        description: `The category page this is for.`,
        example: `Resistance Bands`,
        required: true,
      },
      {
        name: 'product_range',
        description: `What products sit in this category and the actual differences between them.`,
        example: `Light/medium/heavy loop bands for warmups, long fabric bands for strength training, tube bands with handles for upper-body isolation work`,
        required: true,
      },
      {
        name: 'common_confusion',
        description: `What shoppers most often get wrong or stuck on when browsing this category.`,
        example: `Most first-time buyers don't realize loop bands and tube bands with handles are for completely different exercises, and end up buying the wrong type for what they actually want to do`,
        required: true,
      },
      {
        name: 'available_filters',
        description: `The actual filter options on the category page.`,
        example: `Resistance level, band type (loop/tube/fabric), exercise focus (legs/upper body/full body), price`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `category-page-copy`,
      `ecommerce-copywriting`,
      `site-merchandising`,
      `shopper-navigation`,
      `seo-content`,
    ],
    whyItWorks: `A category page and a product page have structurally different jobs, and GPT-5.1 asked for "category copy" without that distinction drawn explicitly tends to write a compressed, generic version of product-page copy — a warm overview paragraph followed by vague praise — because that's the more common pattern in its training data for the phrase "category description," which is usually SEO boilerplate rather than genuine navigation help. Naming the actual shopper confusion up front and requiring the intro to resolve it directly forces the model to write toward the page's real job — reducing the search space for an undecided shopper — rather than toward generically describing the category, which a shopper who's already on the page doesn't need explained to them. Requiring filter explanations in the shopper's language rather than the internal attribute name matters because merchandising filters are usually named for the database schema ("resistance level: medium") rather than for what a shopper experiences, and GPT-5.1 left to its own devices will often just restate the filter label with slightly more words rather than translating it into a felt difference. The quick-sort table is the section that actually earns the page's existence — it's the concrete output a shopper scans for before doing any manual comparison work themselves, and without explicitly requesting it the model tends to leave this kind of page as pure atmosphere copy with no actionable payoff.`,
    exampleOutput: `Most first-time buyers grab a loop band expecting it to work like the tube bands with handles they've seen in workout videos — it won't. Loop bands are for warmups and lower-body activation; tube bands with handles are what you want for upper-body strength work.
Resistance level: how much effort the exercise takes, not how 'advanced' you are — most people use medium for warmups regardless of fitness level...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-collection-copy-seasonal-curation',
    category: 'ecommerce-product',
    title: `Write collection page copy that justifies why these specific products were grouped together`,
    description: `Produces a collection intro and per-product one-liners that explain the actual curation logic behind a themed collection, rather than a generic seasonal blurb bolted onto an arbitrary product grid.`,
    promptText: `Write the intro and per-product blurbs for a themed collection page. The collection is only worth having a separate page for if the copy explains why these specific products belong together — otherwise it's just a filtered product grid with extra words on top.

COLLECTION THEME
{{collection_theme}}

PRODUCTS INCLUDED
{{products_included}}

WHY THESE WERE GROUPED (the real internal logic)
{{curation_logic}}

TIME SENSITIVITY
{{time_sensitivity}}

PART 1 — COLLECTION INTRO (50-80 words)
State the curation logic directly and specifically — not "perfect picks for the season" but the actual reasoning (a shared use case, a shared constraint they all solve, a shared occasion). If the time sensitivity means this collection will feel stale or irrelevant after a certain point, write the copy so it doesn't age into something obviously wrong to read later (avoid "this week only" type framing unless it's literally true and I confirmed it).

PART 2 — PER-PRODUCT ONE-LINERS
For each product, write one line explaining specifically why it earned a place in this collection — not a restated feature from its own product page, but its role within this particular grouping (e.g., "the one for small spaces," "the splurge pick," "the one you buy if you only buy one"). Two products should never get functionally the same one-liner — if you can't find a distinct role for one, flag it as possibly not belonging in this collection.

WHAT NOT TO DO
Do not write generic seasonal filler ("cozy vibes for the season ahead") as a substitute for actually explaining the curation logic — a shopper can tell the difference between a real reason and a mood board caption.

OUTPUT FORMAT
Collection intro, then a labeled one-liner per product, then (if applicable) a flagged note on any product whose fit in the collection seems weak.`,
    variables: [
      {
        name: 'collection_theme',
        description: `The stated theme of the collection.`,
        example: `Small-space living room essentials`,
        required: true,
      },
      {
        name: 'products_included',
        description: `The list of products in the collection.`,
        example: `A slim console table, a wall-mounted media unit, a folding accent chair, a nesting coffee table set`,
        required: true,
      },
      {
        name: 'curation_logic',
        description: `The actual reasoning behind why these specific products were grouped, even if it's internal shorthand.`,
        example: `All four are under 14 inches deep or fold flat, chosen specifically for apartments under 700 sq ft where every piece has to justify its footprint`,
        required: true,
      },
      {
        name: 'time_sensitivity',
        description: `Whether this collection is evergreen or tied to a specific window, and how firm that window is.`,
        example: `Evergreen collection, not tied to a sale or season, just an ongoing curated grouping`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `collection-copy`,
      `ecommerce-merchandising`,
      `seasonal-marketing`,
      `site-content`,
      `curation`,
    ],
    whyItWorks: `A themed collection page is only doing real merchandising work if it can answer "why are these specific items grouped, and not those other ones" — and GPT-5.1 asked to write generic "collection copy" reliably falls back on mood-based seasonal language ("cozy," "perfect for," "vibes") precisely because that's the dominant register for this content type in its training data, even when the actual curation logic given to it is concrete and specific, like a shared footprint constraint. Requiring the intro to state the real logic directly closes that gap by giving the model a specific fact to lead with instead of a mood to evoke. The instruction that no two products can get a functionally identical one-liner is what prevents the most common lazy pattern in AI-written collection copy — five products each described as "a great choice for anyone who loves X" — by forcing the model to actually differentiate each item's role within the specific grouping, which also surfaces a genuinely useful signal: if the model can't find a distinct role for a product, that's often a real sign the product doesn't belong in the collection and the merchant should reconsider it, not just a prompting failure. The time-sensitivity handling matters commercially because evergreen collection pages that read as urgent, dated seasonal copy erode trust the moment they're seen a second time in an unrelated month — a specific and common failure of templated seasonal-sounding copy applied to a page meant to last.`,
    exampleOutput: `Everything here is chosen for one constraint: under 14 inches deep, or it folds flat when you're not using it. This isn't a 'small space aesthetic' collection — every piece in it was picked because it gives back its footprint the moment you don't need it.
Slim console table — the one you put against the wall you thought had no room for furniture at all.
Folding accent chair — the one you buy if you only ever need extra seating twice a month...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-faq-real-support-tickets',
    category: 'ecommerce-product',
    title: `Build a product FAQ from actual support questions instead of marketing questions in disguise`,
    description: `Produces a product page FAQ section sourced from real recurring support tickets or reviews, so it actually reduces pre-purchase questions and returns instead of restating the product description as fake Q&A.`,
    promptText: `Build a product FAQ section from the real recurring questions and concerns below — not invented marketing questions like "why should I buy this?" dressed up as an FAQ.

PRODUCT
{{product_name}}

RECURRING SUPPORT QUESTIONS / REVIEW CONCERNS
{{recurring_questions}}

FACTS NEEDED TO ANSWER THEM ACCURATELY
{{answer_facts}}

QUESTIONS WE CANNOT ANSWER DEFINITIVELY
{{unanswerable_questions}}

For each recurring question or concern I gave you, write it as a real shopper would actually phrase it (contractions, plain language, not marketing-polished grammar), then answer it using only the facts I gave you — directly, in 1-3 sentences, leading with the actual answer before any supporting detail. If a question implies a real limitation or downside of the product, do not answer around it — state the limitation plainly and then, if there's a genuine mitigation, offer it after.

For anything in the unanswerable list, do not guess or generate a plausible-sounding answer — write a short honest response that says what we don't know or what depends on the buyer's specific situation, and where they should actually go to get a real answer (a support contact, a spec they should check themselves).

WHAT NOT TO DO
Do not include a question whose real purpose is just to restate a selling point ("What makes this product special?") — every question here should be something a person would type into a support chat or ask a friend before buying, not something a marketer wrote to sound like a question.

OUTPUT FORMAT
A Q&A list, each question bolded, each answer directly below it. Flag with a note any question where the given facts were insufficient to answer confidently.`,
    variables: [
      {
        name: 'product_name',
        description: `The product the FAQ is for.`,
        example: `Nimbus air purifier, 500 sq ft coverage`,
        required: true,
      },
      {
        name: 'recurring_questions',
        description: `The actual recurring questions or concerns from support tickets, reviews, or pre-sale chat logs.`,
        example: `How loud is it on the highest setting? Does it actually help with pet odor or just dust? Will it work in a room with high ceilings? Do I need to buy filters separately and how often?`,
        required: true,
      },
      {
        name: 'answer_facts',
        description: `The real facts needed to answer accurately.`,
        example: `54dB on highest setting (comparable to a quiet conversation), HEPA + activated carbon filter handles odor and dust both, rated for 500 sq ft at 8ft ceiling height (may underperform above that), filters sold separately, replace every 6-8 months depending on use`,
        required: true,
      },
      {
        name: 'unanswerable_questions',
        description: `Any recurring question you genuinely can't answer with a general FAQ response.`,
        example: `Whether it will be loud enough to disturb a light sleeper specifically — this depends on the individual and the room's baseline noise level`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-faq`,
      `customer-support`,
      `ecommerce-copywriting`,
      `conversion-optimization`,
      `returns-reduction`,
    ],
    whyItWorks: `A product FAQ only reduces pre-purchase hesitation and post-purchase returns if it answers what people are actually confused or worried about, and GPT-5.1 asked to "write an FAQ" for a product with no real question data supplied will reliably generate marketing questions in Q&A clothing — "What makes this product unique?" — because it has no genuine question bank to draw from and defaults to restructuring the product description as a false dialogue, which is why sourcing the actual recurring questions from support and reviews is the load-bearing part of this prompt, not a nice-to-have. Instructing the model to state a real limitation plainly before offering any mitigation matters because the default persuasive-writing instinct is to answer around a downside with a positive reframe, and a shopper reading a product FAQ specifically because they're worried about that downside will notice the evasion immediately — an FAQ that dodges its own hard questions is worse than not having one, because it signals the seller is hiding something the reviews already made obvious. The explicit unanswerable-questions handling addresses the single most damaging failure mode for FAQ content specifically: a model filling a knowledge gap with a fabricated specific number (a decibel rating, a coverage area) reads as authoritative to a shopper but creates a real support liability the moment a buyer holds the seller to a number that was never actually tested.`,
    exampleOutput: `**How loud is it on the highest setting?** About 54dB — roughly the volume of a quiet conversation. It's not silent, but most customers run it on medium overnight and save the highest setting for a quick clean-air boost during the day.
**Will it work in a room with high ceilings?** It's rated for 500 sq ft at 8ft ceiling height. Above that, coverage may drop off since air volume increases faster than floor area — if your ceilings are notably taller, size up to the next model rather than assuming this one will keep pace...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-review-analysis-theme-extraction',
    category: 'ecommerce-product',
    title: `Extract the real recurring themes from a batch of product reviews instead of a generic sentiment summary`,
    description: `Analyzes a pasted batch of product reviews to surface specific recurring praise and complaint themes with supporting quotes and rough frequency, instead of a vague 'customers love the quality' summary.`,
    promptText: `Analyze the batch of product reviews below and extract the actual recurring themes — not a generic sentiment summary like "most customers are satisfied with the quality."

PRODUCT
{{product_name}}

REVIEWS (paste as many as you have)
{{review_batch}}

WHAT I ALREADY SUSPECT (to check, not to confirm blindly)
{{existing_hypothesis}}

STEP 1 — THEME EXTRACTION
Group the reviews into specific recurring themes (not "positive" and "negative" as categories — actual topics: a specific feature working or failing, a specific use case it excels or struggles at, a specific comparison customers keep making to something else). For each theme, note roughly how many reviews mention it and pull 1-2 short direct quotes as evidence — do not summarize a theme you can't actually point to quotes for.

STEP 2 — CHECK THE HYPOTHESIS
Evaluate what I said I suspected against what the reviews actually show — confirm it, contradict it, or say the evidence is mixed/insufficient. Do not tell me what I want to hear; if the reviews don't support my hypothesis, say so plainly.

STEP 3 — SURPRISES
Name anything in the reviews that doesn't fit an obvious theme but seems important — an unexpected use case, a recurring minor gripe that isn't a dealbreaker but shows up often enough to matter, a demographic or use pattern I might not have expected.

WHAT NOT TO DO
Do not round every complaint into a single generic "some customers had issues" bucket — a complaint about slow shipping and a complaint about a product defect are different problems requiring different fixes, and collapsing them loses the actionable signal.

OUTPUT FORMAT
Themes table (theme, approximate frequency, sample quotes), hypothesis check paragraph, surprises list.`,
    variables: [
      {
        name: 'product_name',
        description: `The product the reviews are for.`,
        example: `Trailblaze hiking backpack, 40L`,
        required: true,
      },
      {
        name: 'review_batch',
        description: `The actual review text, pasted in bulk.`,
        example: `[Pasted block of 30-80 real customer reviews with star ratings]`,
        required: true,
      },
      {
        name: 'existing_hypothesis',
        description: `What you already suspect the reviews will show, stated honestly so the model can check it rather than confirm it.`,
        example: `I suspect the hip belt padding is the most common complaint, based on a handful of recent one-star reviews I noticed`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `review-analysis`,
      `customer-insights`,
      `voice-of-customer`,
      `product-feedback`,
      `qualitative-analysis`,
    ],
    whyItWorks: `Asked to "summarize customer sentiment" without further constraint, GPT-5.1 tends to produce a high-level, evenly-hedged paragraph ("customers generally appreciate the quality, though a few had concerns") because that's the safest, most broadly-true statement it can make across a mixed batch of reviews — which is exactly the output that gives a merchant nothing actionable, since it could describe almost any product's reviews. Requiring specific themes with a frequency estimate and supporting quotes forces the model to actually cluster the review text by topic rather than by sentiment polarity, which is the structural difference between a summary and an analysis — sentiment polarity (positive/negative) is nearly always available from any review batch, but topic clustering (which specific feature or use case is driving that sentiment) requires the model to do real categorization work it will skip unless explicitly told the output has to be organized that way. The instruction to check a stated hypothesis rather than confirm it addresses a real and common failure mode: a model given a leading suggestion in the prompt ("I suspect X is the problem") will often bias its summary toward confirming X even when the evidence is mixed, simply because the hypothesis primed what the model looks for first — explicitly telling it to potentially contradict the hypothesis counteracts that anchoring. The ban on collapsing complaints into one generic bucket matters operationally because a shipping complaint and a manufacturing defect complaint point a business toward completely different fixes, and losing that distinction in an AI-generated summary directly costs the merchant time diagnosing the wrong problem.`,
    exampleOutput: `Theme: Hip belt padding compresses after ~2 months of regular use — mentioned in roughly 9 of 62 reviews, concentrated in 3-star and below. Quote: 'Loved it for the first month, then the padding went flat on long days.' Hypothesis check: Partially confirmed — hip belt padding is a real recurring theme, but it's the third most common complaint, not the first; strap adjustment difficulty is mentioned more often...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-review-response-drafts-by-severity',
    category: 'ecommerce-product',
    title: `Draft review responses matched to how bad the review actually is, not one polite template for everything`,
    description: `Produces a public review response drafted to the specific severity and content of one review — genuine acknowledgment for a real defect, a brief thank-you for a routine positive review, a firm but respectful correction for an inaccurate claim.`,
    promptText: `Draft a public response to the customer review below, matched to what this specific review actually needs — not a one-size-fits-all polite template.

PRODUCT
{{product_name}}

THE REVIEW
{{review_text}}

STAR RATING
{{star_rating}}

IS THE COMPLAINT ACCURATE
{{complaint_accuracy}}

WHAT WE CAN ACTUALLY OFFER
{{available_resolution}}

First, classify this review in one line: is it (a) a legitimate product or service failure, (b) a routine positive review needing only brief acknowledgment, (c) a review based on a misunderstanding or inaccurate claim about the product, or (d) something else — say what.

Then draft the response matched to that classification:
- If (a): Open by acknowledging the specific issue named in the review, not a generic apology — reference what they actually said happened. State plainly what we can do about it (using only what I told you is actually available, never promise a resolution I didn't confirm). Do not over-apologize past the point of sincerity — one clear acknowledgment, then action.
- If (b): Keep it short and specific — thank them for one concrete detail they mentioned, not a generic "thanks for your review!" Do not pad a five-star review with a long response; that reads as try-hard.
- If (c): Correct the inaccuracy respectfully and factually, without being defensive or implying the customer is wrong to have been confused — if the confusion is understandable (unclear packaging, ambiguous listing copy), say so, since a defensive correction reads worse publicly than the original bad review.

WHAT NOT TO DO
Never offer a specific discount, refund, or replacement I didn't tell you is actually available — an unauthorized promise made publicly in a review response is a real commitment the business now has to honor.

OUTPUT FORMAT
Classification line, then the drafted response (60-120 words), ready to post as-is or after my edit.`,
    variables: [
      {
        name: 'product_name',
        description: `The product the review is about.`,
        example: `Solterra patio umbrella, 9ft`,
        required: true,
      },
      {
        name: 'review_text',
        description: `The actual review text.`,
        example: `"Umbrella arrived with a bent rib and the crank mechanism won't tilt at all. Really disappointed, this was expensive."`,
        required: true,
      },
      {
        name: 'star_rating',
        description: `The star rating given.`,
        example: `2 stars`,
        required: true,
      },
      {
        name: 'complaint_accuracy',
        description: `Whether the complaint reflects a real product/service issue, a misunderstanding, or something you're unsure about.`,
        example: `Accurate — we've had a handful of reports of bent ribs from this shipping carrier specifically, likely a packaging issue on our end`,
        required: true,
      },
      {
        name: 'available_resolution',
        description: `What you can actually offer, so the model never invents a promise.`,
        example: `Free replacement unit and a prepaid return label for the damaged one, already approved by the CX team for shipping-damage cases`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `review-response`,
      `customer-service`,
      `reputation-management`,
      `ecommerce-copywriting`,
      `brand-voice`,
    ],
    whyItWorks: `GPT-5.1's default register for "respond to this negative review" is uniformly apologetic and conciliatory regardless of what actually happened, because that's the safest tone across the enormous range of review-response examples in its training distribution — which is exactly why AI-drafted review responses often read as interchangeable corporate boilerplate that doesn't actually engage with what the specific customer said, whether the review describes a shipping delay or a genuine safety defect. Requiring an explicit severity classification before drafting forces the model to actually read and categorize the review rather than pattern-match to a generic apology template, and produces a structurally different response for a five-star review than a two-star one instead of the same warm tone stretched or compressed to fit. The instruction never to offer an unconfirmed discount or replacement is the single highest-stakes rule in this prompt: a public review response is a public commitment, and a model optimizing for "sounds appropriately resolving" will readily generate a specific offer ("we'd like to send you a replacement") that the business never authorized, creating a real obligation the merchant now has to either honor at cost or walk back publicly, which is worse than the original review. Handling the inaccurate-claim case with an instruction to acknowledge understandable confusion rather than defend the brand addresses the second most common failure — an AI-drafted correction that reads as defensive or condescending toward the reviewer typically does more reputational damage in front of other readers than the original negative review did.`,
    exampleOutput: `Classification: (a) legitimate product/service failure.
We're sorry the umbrella arrived with a bent rib and a crank that won't tilt — that shouldn't have made it through our packaging, and we know it's frustrating on something you were excited to use. We'd like to send a free replacement along with a prepaid return label for the damaged unit; you should have an email from our team shortly to arrange it.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-review-mining-roadmap-signals',
    category: 'ecommerce-product',
    title: `Mine reviews for product roadmap signal, separating what's fixable from what's just a mismatch`,
    description: `Analyzes a batch of reviews specifically to identify actionable product or listing changes, sorting findings into fixable design issues, listing/expectation-setting fixes, and non-issues, so the output feeds a roadmap instead of a vague complaints list.`,
    promptText: `Mine the review batch below for actual product development and listing signal — I want output I can hand to a product team and a merchandising team separately, not a general complaints summary.

PRODUCT
{{product_name}}

REVIEWS
{{review_batch}}

KNOWN PRODUCT CONSTRAINTS (things that can't realistically change)
{{fixed_constraints}}

CURRENT LISTING COPY / IMAGES
{{current_listing_summary}}

Sort every recurring complaint or confusion in the reviews into exactly one of these three buckets, and justify the sorting:

BUCKET 1 — ACTUAL PRODUCT ISSUE: A real design, quality, or manufacturing problem that a product team could plausibly fix in a future revision. Do not put something here if it conflicts with a stated fixed constraint — flag those separately instead as a known tradeoff customers should be warned about rather than a fixable issue.

BUCKET 2 — EXPECTATION MISMATCH (listing fix): The product is working as designed, but customers are arriving with a wrong expectation the current listing copy or images could have prevented — quote what in the current listing likely caused the mismatch, or note if nothing in the listing explains the gap and it may be a marketplace-wide assumption instead.

BUCKET 3 — NOT ACTIONABLE: A complaint that's a one-off, unrelated to the product (shipping carrier issue, unrelated account problem), or too vague to act on — do not force something into bucket 1 or 2 just to seem thorough.

WHAT NOT TO DO
Do not inflate a single mentioned complaint into a "trend" — only call something a pattern if it appears across multiple independent reviews, and state the actual count.

OUTPUT FORMAT
Three labeled sections (one per bucket), each as a list of issue, supporting quote count, and one-line recommended next step per item.`,
    variables: [
      {
        name: 'product_name',
        description: `The product being mined for feedback.`,
        example: `Ferro cast iron griddle pan`,
        required: true,
      },
      {
        name: 'review_batch',
        description: `The actual review text in bulk.`,
        example: `[Pasted block of 40+ reviews]`,
        required: true,
      },
      {
        name: 'fixed_constraints',
        description: `Real constraints that mean some complaints can't become product changes, so they route to a different bucket instead of a false roadmap item.`,
        example: `Cast iron is inherently heavy (weight complaints can't be engineered away without changing the material entirely, which we won't do) and requires seasoning maintenance by design`,
        required: true,
      },
      {
        name: 'current_listing_summary',
        description: `What the current product listing actually says and shows, so expectation-mismatch complaints can be traced to a specific cause.`,
        example: `Listing photos show the pan on a large 6-burner range and don't show scale next to common objects; description mentions 'lightweight enough to handle daily' without a weight figure stated anywhere`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `review-mining`,
      `product-development`,
      `voice-of-customer`,
      `listing-optimization`,
      `qualitative-analysis`,
    ],
    whyItWorks: `The single most common failure in AI-assisted review mining is producing one flat list of complaints with no distinction between a genuine design flaw and a customer expectation the listing itself set up wrongly, because both surface as similarly-worded negative sentiment in the raw text — a complaint about weight and a complaint about seasoning maintenance can read almost identically in tone even though one is an unfixable material property and the other might be solved entirely by changing a product photo. Forcing a three-way sort with an explicit rule that a complaint conflicting with a stated fixed constraint gets routed away from the product-fix bucket is what prevents a roadmap document from filling up with "fix" items the product team can't actually act on, which is exactly the kind of low-credibility deliverable that gets a review-mining exercise ignored by a busy product team the next time it's handed to them. Requiring the expectation-mismatch bucket to trace back to a specific line in the current listing (or explicitly note when it can't) turns a vague "customers were confused" complaint into an assignable task for whoever owns the listing copy, which is the actual mechanism by which this kind of analysis produces a fix rather than just documenting a problem. The explicit ban on inflating a single mention into a trend addresses GPT-5.1's tendency, when summarizing qualitative text, to generalize from a vivid single example because a strongly-worded individual complaint is more salient in the text than a duller pattern repeated across many milder mentions — requiring an actual count per item forces the model to check its own generalization before presenting it as a pattern.`,
    exampleOutput: `BUCKET 1 — Actual product issue: Handle heat retention — 11 reviews mention the handle staying hot long after cooking, several noting they were surprised since 'cast iron handles are supposed to cool faster.' Recommended: evaluate a handle material or design change in next revision.
BUCKET 2 — Expectation mismatch: Perceived weight — 14 reviews call it 'way heavier than expected'; listing photos show it on a large range with no scale reference and the description says 'lightweight enough to handle daily' with no actual weight stated. Recommended: add exact weight to listing and a photo showing it held one-handed for scale.
BUCKET 3 — Not actionable: 3 reviews mention a damaged box on arrival, tied to one specific shipping carrier route, not the product itself...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-positioning-against-named-alternative',
    category: 'ecommerce-product',
    title: `Sharpen a product's positioning against the specific alternative it's actually losing sales to`,
    description: `Produces a positioning statement and supporting proof points built specifically against the real alternative your product loses deals to, rather than a generic positioning statement that could apply to any competitor.`,
    promptText: `Sharpen the positioning for {{product_name}} — specifically against {{losing_to}}, since that's the real alternative it's actually losing sales to, not competitors in the abstract.

HOW WE'RE CURRENTLY LOSING THESE DEALS
{{loss_pattern}}

WHAT'S ACTUALLY TRUE ABOUT OUR PRODUCT VS THIS ALTERNATIVE
{{comparative_truth}}

WHO WE SHOULDN'T BOTHER TRYING TO WIN
{{unwinnable_segment}}

STEP 1 — DIAGNOSE THE REAL GAP
Based on the loss pattern, state in one or two sentences what you believe is the actual reason buyers are choosing the alternative — price, a specific feature, brand trust, distribution/availability, or something else. Be willing to conclude the gap is something we can't easily message our way out of (e.g., a genuinely lower price) rather than forcing a positioning angle onto a problem that positioning can't solve.

STEP 2 — POSITIONING STATEMENT
Write a one-sentence positioning statement in the form: "For [specific buyer], [product] is the [category] that [key differentiator], unlike [alternative] which [alternative's real limitation]." Use only the comparative truths I gave you — do not invent a limitation of the alternative that isn't in what I told you.

STEP 3 — THREE PROOF POINTS
Three specific, concrete facts (not adjectives) that a skeptical buyer already inclined toward the alternative would need to see to reconsider.

STEP 4 — WHO TO STOP CHASING
Given the unwinnable segment I named, write one or two sentences on how to explicitly deprioritize marketing spend or sales effort toward that segment rather than trying to out-position a fundamentally lost cause — chasing an unwinnable segment with sharper messaging just wastes the sharper messaging.

WHAT NOT TO DO
Do not write a positioning statement so broad it could apply against any competitor in the category — every clause must be specific enough that it would be false if pointed at a different alternative.

OUTPUT FORMAT
Four labeled sections as above.`,
    variables: [
      {
        name: 'product_name',
        description: `The product being positioned.`,
        example: `Basecamp project management software, small-team tier`,
        required: true,
      },
      {
        name: 'losing_to',
        description: `The actual specific alternative deals are being lost to.`,
        example: `Teams sticking with a shared spreadsheet and Slack instead of adopting a dedicated tool`,
        required: true,
      },
      {
        name: 'loss_pattern',
        description: `What actually happens in the deals you're losing — the observed pattern, not a guess.`,
        example: `Prospects say the tool looks fine in the demo but 'we already kind of have a system' and the switch never happens; it's an inertia loss, not a feature loss`,
        required: true,
      },
      {
        name: 'comparative_truth',
        description: `What's genuinely true about your product relative to this specific alternative.`,
        example: `A spreadsheet+Slack setup has no single source of truth for task status, so status updates require someone manually asking; our tool surfaces status automatically without anyone having to ask`,
        required: true,
      },
      {
        name: 'unwinnable_segment',
        description: `A segment realistically not worth chasing given this specific alternative.`,
        example: `Teams of 2-3 people with under 10 recurring tasks a month — the coordination overhead a spreadsheet creates for them is genuinely small enough that switching isn't worth their time`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-positioning`,
      `competitive-strategy`,
      `messaging`,
      `b2b-ecommerce`,
      `go-to-market`,
    ],
    whyItWorks: `Positioning work asked for in the abstract ("position our product against the market") gets GPT-5.1 to produce a statement that's true but generic enough to apply to almost any competitor in the category, because without a named, specific alternative the model has nothing concrete to differentiate against and defaults to category-level claims like "the most powerful solution" — naming the actual thing you're losing to, and specifically an informal alternative like a spreadsheet rather than a named competitor product, forces every clause of the positioning statement to be checked against a real, specific comparison rather than a hypothetical one. The diagnose-the-real-gap step matters because positioning exercises reflexively assume the fix is always a messaging problem, when the loss pattern given here (inertia, not a features gap) actually calls for a completely different intervention than sharper copy would provide — instructing the model to be willing to conclude the gap isn't solvable by positioning at all prevents it from forcing an artificial messaging angle onto what might really be a pricing, distribution, or switching-cost problem. Requiring the deprioritization step for an explicitly named unwinnable segment addresses a real strategic cost that's easy to overlook: sharper positioning applied uniformly to every prospect, including ones who were never going to switch regardless of message quality, burns sales and marketing effort on the lowest-probability conversions instead of concentrating it where the diagnosed gap is actually persuadable.`,
    exampleOutput: `Diagnosed gap: this isn't a features loss, it's inertia — teams already have a working-enough system and the switching cost of moving off it feels higher than the pain it solves.
Positioning: For small teams who've outgrown tracking work in Slack threads, Basecamp is the project tool that shows task status without anyone having to ask, unlike a spreadsheet-and-Slack setup where status only exists if someone remembers to update it manually...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-pricing-test-design',
    category: 'ecommerce-product',
    title: `Design a pricing test that will actually tell you something, instead of a price change you can't interpret afterward`,
    description: `Produces a structured pricing experiment design — hypothesis, price points, control variables, and the read-out criteria — so a price test produces a decision rather than an ambiguous result you can't act on.`,
    promptText: `Design a pricing test for {{product_name}} — I don't just want price ideas, I want a test structure that will actually tell me something afterward, because my last price change taught me nothing since too many other things changed at the same time.

CURRENT PRICE AND CONTEXT
{{current_price_context}}

WHAT I'M ACTUALLY UNCERTAIN ABOUT
{{pricing_uncertainty}}

CONSTRAINTS ON THE TEST
{{test_constraints}}

WHAT ELSE IS CHANGING AROUND THE SAME TIME
{{concurrent_changes}}

STEP 1 — SHARPEN THE HYPOTHESIS
Restate my pricing uncertainty as a specific, falsifiable hypothesis ("raising price by X% will not reduce conversion rate by more than Y%" — not "see if a higher price works"). If what I described is actually two different questions bundled together, split them and say so, since a test can't cleanly answer two hypotheses stacked into one price change.

STEP 2 — PRICE POINTS AND STRUCTURE
Propose the specific price point(s) to test against the current price, and the test structure (simple A/B, sequential before/after, or a specific reason one is better suited than the other given the constraints).

STEP 3 — CONFOUND CHECK
Given what else is changing around the same time, name specifically what could contaminate the result and make the test uninterpretable, and propose either a way to isolate the pricing change from that confound or an honest statement that the test result will need to be read with that limitation in mind.

STEP 4 — READ-OUT CRITERIA
State in advance, before the test runs, what specific result would count as a clear win, a clear loss, and an inconclusive result requiring a longer test — decide this now, not after seeing the data, since deciding the bar after the result invites rationalizing whatever number comes back.

WHAT NOT TO DO
Do not propose a test design requiring a sample size or timeframe I haven't confirmed is realistic — ask me for current traffic/order volume if you need it to sanity-check whether this test can reach a meaningful result at all before treating the design as final.

OUTPUT FORMAT
Four labeled sections above, plus a one-line flag if you don't have enough volume information to confirm the test is statistically viable.`,
    variables: [
      {
        name: 'product_name',
        description: `The product whose price is being tested.`,
        example: `Everstitch canvas tote bag`,
        required: true,
      },
      {
        name: 'current_price_context',
        description: `Current price and relevant context like margin or recent history.`,
        example: `Currently $38, roughly 55% margin, price hasn't changed in 14 months`,
        required: true,
      },
      {
        name: 'pricing_uncertainty',
        description: `What you're actually unsure about, in your own words even if it's not yet a clean hypothesis.`,
        example: `Not sure if we're leaving money on the table at $38 or if raising it would tank conversion — also wondering if a $42 price with free shipping included would do better than either flat option`,
        required: true,
      },
      {
        name: 'test_constraints',
        description: `Real limits on how the test can run.`,
        example: `Can only run a geo-split test since we're on a platform without proper A/B pricing infrastructure; roughly 3,000 monthly orders total across all regions`,
        required: true,
      },
      {
        name: 'concurrent_changes',
        description: `Anything else changing around the same time that could confound the result.`,
        example: `A new paid ad campaign launches in the same window targeting a similar audience, and it's not easily paused`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `pricing-strategy`,
      `ab-testing`,
      `conversion-optimization`,
      `ecommerce-analytics`,
      `experiment-design`,
    ],
    whyItWorks: `Asked for "pricing test ideas," GPT-5.1 tends to produce a plausible-sounding list of price points to try without addressing the actual reason most merchant-run pricing tests fail to produce a usable answer — not picking the wrong price, but running a test whose result can't be cleanly attributed to the price change because something else moved at the same time, or deciding what counts as a win only after seeing a number that's convenient to rationalize. Requiring the hypothesis to be restated as a specific, falsifiable statement rather than a vague "see if it works" question forces a decision about what result the test is actually trying to produce before any price point is chosen, which is the same discipline a real experimentation team applies and that ad hoc merchant price changes almost always skip. The confound-check step, built around whatever concurrent change was actually named (a new ad campaign in this example), directly targets the single most common reason merchants misread their own pricing tests: attributing a conversion change to the price when a simultaneous traffic-quality or channel-mix shift was the real driver — without explicitly naming and checking for that overlap, GPT-5.1 has no way to know a concurrent change exists at all, since it isn't implied by the pricing question alone. Setting read-out criteria in advance, before the test data exists, is a deliberate defense against a well-documented human bias (not a model failure) — deciding after the fact what counts as "good enough" tends to fit whatever number came back, and locking the bar in beforehand, in the AI-assisted design document itself, gives the merchant something concrete to hold themselves to later.`,
    exampleOutput: `Hypothesis: Raising price from $38 to $42 will not reduce conversion rate by more than 8% (the margin gain at $42 breaks even against an 8% conversion drop; anything worse than that is a net loss). Confound check: the new ad campaign launching in the same window will shift traffic mix toward a colder audience regardless of price, which could depress conversion independent of the price change — recommend holding the ad campaign to existing geos only during the test window, or explicitly noting in the read-out that a conversion drop can't be fully attributed to price alone otherwise...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-bundle-ideas-margin-checked',
    category: 'ecommerce-product',
    title: `Generate product bundle ideas that are checked against margin and inventory before you fall in love with one`,
    description: `Produces bundle concepts built from actual inventory and margin data, each flagged for viability, instead of a list of plausible-sounding bundle names that ignore whether the combination actually makes financial sense.`,
    promptText: `Generate bundle ideas from the product catalog below — but every bundle idea needs to survive a margin and inventory sanity check, not just sound like a good pairing.

PRODUCTS AVAILABLE TO BUNDLE
{{catalog_with_margins}}

CUSTOMER BEHAVIOR DATA (what's actually bought together, if known)
{{purchase_patterns}}

INVENTORY CONSTRAINTS
{{inventory_constraints}}

TARGET DISCOUNT OR PRICE ANCHOR
{{bundle_discount_target}}

STEP 1 — GENERATE 5 BUNDLE CONCEPTS
Propose 5 bundles, prioritizing ones supported by actual purchase pattern data over ones that just sound logically complementary — a data-backed pairing beats a plausible-sounding one you invented from category logic alone. For each, name the bundle, list the included products, and state in one line the actual reason a customer would want these together (a genuine use-case reason, not "customers who like A also like B" restated).

STEP 2 — MARGIN CHECK
For each bundle, using the margins I gave you, calculate roughly whether the bundle can absorb the target discount and still hit a reasonable blended margin, or flag it as margin-negative at the stated discount. Do not propose a discount percentage for me without checking it against the actual margins provided.

STEP 3 — INVENTORY CHECK
Flag any bundle that pairs a healthy-stock item with a constrained or low-stock item, since a bundle can create artificial demand pressure on the scarce component and cause stockouts on the item you can least afford to run out of.

STEP 4 — RANK
Rank the 5 bundles by overall viability (customer appeal + margin health + inventory safety combined), not just by which sounds most appealing on its own.

WHAT NOT TO DO
Do not recommend a bundle discount deep enough to be margin-negative just because it would look attractive to a customer — a bundle that loses money per unit sold isn't a promotion, it's a pricing mistake wearing a bundle's clothing.

OUTPUT FORMAT
Five bundles with the checks above, then a final ranked list with one-line reasoning per rank.`,
    variables: [
      {
        name: 'catalog_with_margins',
        description: `The products available to bundle, with their approximate margins.`,
        example: `Ceramic mug ($12, 60% margin), pour-over dripper ($28, 45% margin), bag of coffee beans ($16, 35% margin), travel tumbler ($22, 55% margin)`,
        required: true,
      },
      {
        name: 'purchase_patterns',
        description: `Any actual data on what gets bought together, if available.`,
        example: `Order data shows the dripper and coffee beans are co-purchased in about 40% of dripper orders; the mug is rarely bought alongside either`,
        required: false,
      },
      {
        name: 'inventory_constraints',
        description: `Which items are low-stock or hard to restock quickly.`,
        example: `Coffee beans are a fast-moving, easily restocked item; the pour-over dripper is on a 6-week reorder lead time and currently at 3 weeks of stock left`,
        required: true,
      },
      {
        name: 'bundle_discount_target',
        description: `What discount level you're hoping to offer on bundles.`,
        example: `Aiming for a 15% discount off combined individual prices to make the bundle feel like a clear deal`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-bundling`,
      `merchandising-strategy`,
      `margin-analysis`,
      `inventory-management`,
      `ecommerce-strategy`,
    ],
    whyItWorks: `Asked generically for "bundle ideas," GPT-5.1 reliably produces plausible-sounding category pairings (mug and coffee, phone and case) because that's the pattern-matching task the request implies, without any mechanism to check whether the pairing is actually financially or operationally sound — bundle ideation and bundle viability are two different problems, and a prompt that only asks for the first will get confident-sounding recommendations that ignore the second entirely. Requiring the margin check to run against the actual numbers provided, rather than trusting the model's sense of what discount "sounds reasonable," matters because GPT-5.1 has no way to know a bundle's real cost structure unless the margins are given explicitly, and left unconstrained it will happily suggest an attractive-sounding 20-25% discount without any awareness that this could make a bundle unprofitable per unit — a mistake that looks like a promotion but functions as a pricing error once it ships. The inventory check step surfaces a failure mode specific to bundling that a purely creative brainstorm would never catch: pairing a healthy-stock item with a constrained one accelerates demand on exactly the component the merchant can least afford to run out of, potentially creating stockouts that then force the entire bundle offline mid-promotion. Prioritizing purchase-pattern data over category logic in the ranking step matters because two products can sound complementary by category (a mug and a dripper) while actual order data shows customers don't buy them together at any meaningful rate — the model has no way to know this unless told to weight real behavioral evidence over its own plausible-sounding inference.`,
    exampleOutput: `Bundle: Pour-Over Starter Set (dripper + coffee beans) — supported by real data (40% co-purchase rate). Margin check: combined price $44, blended margin roughly 41% before discount; at 15% off ($37.40), blended margin holds around 30% — still healthy, proceed. Inventory check: caution — dripper has only 3 weeks of stock at a 6-week reorder lead time; a successful bundle promotion could sell through remaining dripper stock before restock arrives. Recommend capping bundle promotion to available dripper units or expediting the reorder before launch...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-cross-sell-recommendation-copy-by-purchase-context',
    category: 'ecommerce-product',
    title: `Turn one purchase into a specific cross-sell pitch instead of a generic 'you may also like' rail`,
    description: `Builds cross-sell copy and product pairings tied to the exact item just bought and the problem it doesn't fully solve on its own, for use on the order-confirmation page or a post-purchase email.`,
    promptText: `You are writing cross-sell recommendation copy for one specific purchase moment — not a generic "customers also bought" widget, but a short, reasoned pitch for 2-3 companion products that make the item just bought actually work as intended.

ITEM JUST PURCHASED
{{purchased_item}}

WHAT IT DOESN'T FULLY SOLVE ALONE
{{unsolved_gap}}

CANDIDATE COMPANION PRODUCTS
{{companion_products}}

PLACEMENT
{{placement_surface}}

MARGIN OR INVENTORY PRIORITY
{{priority_note}}

RULES
For each companion product, write one sentence that names the specific gap left by the original purchase and how this item closes it — never a vague benefit statement that would apply to any add-on ever bought alongside anything. If a candidate product doesn't actually address the stated gap, say so explicitly and drop it rather than including it anyway to fill out a list of three. Rank the 2-3 you keep by how directly they close the gap, not by which one has the highest margin — if there's a margin or inventory priority that should break a tie between two options that are otherwise equally relevant, apply it only as a tiebreaker and say where you applied it. Write the actual on-page or email copy in the buyer's voice of urgency: someone who already decided to buy once should be pitched as "complete what you started," not as a fresh sales pitch starting from zero. Do not suggest more than 3 items regardless of how many candidates were given — a longer list reads as upselling everything in the catalog rather than a considered pairing.

WHAT NOT TO DO
Do not write "frequently bought together" as a justification on its own — that's a statistic, not a reason, and it doesn't tell the buyer why this specific gap exists. Do not recommend a product that competes with or replaces the item just bought.

OUTPUT FORMAT
1. A table: companion product | one-line reason tied to the specific gap | where it ranks and why.
2. The actual copy block ready to paste onto the stated placement surface, sized appropriately (a two-line blurb for a checkout page, a short paragraph for an email).
3. Any candidate you dropped and the one-line reason it didn't actually close the gap.`,
    variables: [
      {
        name: 'purchased_item',
        description: `The specific product that was just bought.`,
        example: `A 4-person dome tent, single unit, no footprint or stakes bundle included.`,
        required: true,
      },
      {
        name: 'unsolved_gap',
        description: `What the buyer still needs to actually use the item as intended.`,
        example: `No ground protection — the tent floor voids its waterproofing warranty if pitched directly on rocky or wet ground without a footprint.`,
        required: true,
      },
      {
        name: 'companion_products',
        description: `The candidate add-ons you're considering recommending.`,
        example: `Tent footprint ($24), inflatable sleeping pad ($59), citronella lantern ($18), a second identical tent ($140).`,
        required: true,
      },
      {
        name: 'placement_surface',
        description: `Where this copy will actually appear.`,
        example: `Order confirmation page, directly under the order summary, before the buyer closes the tab.`,
        required: true,
      },
      {
        name: 'priority_note',
        description: `A business reason to break a tie between two equally relevant options, if one exists.`,
        example: `We're overstocked on the footprint after a supplier minimum order — prefer it over the sleeping pad if both are equally relevant.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `cross-sell`,
      `post-purchase`,
      `product-copy`,
      `merchandising`,
      `conversion-copy`,
    ],
    whyItWorks: `The instruction to name the specific unsolved gap rather than lean on "frequently bought together" forces the model out of its default pattern-matching mode, where GPT-5.1 will happily generate plausible-sounding companion-product copy purely from category co-occurrence (tents pair with camping chairs, camping chairs pair with coolers) without ever checking whether the pairing addresses an actual functional hole in the first purchase — that co-occurrence reasoning produces technically true but persuasively empty copy, since "other campers also bought this" gives the buyer no new reason to add it to this specific order. Requiring the model to explicitly drop a candidate that doesn't close the stated gap counters a related failure mode: left unconstrained, GPT-5.1 tends to keep every item offered in the prompt because removing one feels like discarding user-supplied information, even when a candidate is actually irrelevant or competitive with the original purchase; stating the drop rule upfront gives it permission to prune instead of rationalizing inclusion. Capping the list at three and ranking by gap-closure rather than margin also blocks a subtler bias — language models trained on marketing copy tend to over-index on whichever product in a list has the strongest sales-adjective density (bundle deals, premium tiers), which silently promotes margin-heavy items over the pairing a buyer would actually recognize as necessary. Framing the copy as "complete what you started" rather than a fresh pitch matters because a buyer who just converted is in a different psychological state than a cold browser, and generic upsell phrasing written for browsing-stage shoppers reads as tone-deaf immediately after checkout.`,
    exampleOutput: `1. Footprint ($24) — protects the tent floor from the exact ground damage that voids its waterproof warranty; ranked first, it's the only item that prevents an outright product failure. 2. Sleeping pad ($59) — the tent keeps you dry, not comfortable; ranked second as the next most direct gap. Lantern dropped — a nice-to-have, not a gap this purchase actually left open. Copy: "Your tent's floor isn't warrantied against rocky or wet ground on its own — add the matching footprint before your first trip out."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-upsell-tier-comparison-checkout-copy',
    category: 'ecommerce-product',
    title: `Write an upsell comparison that argues from the buyer's actual use case, not a generic 'go premium' nudge`,
    description: `Produces a tier-comparison upsell block for the cart or checkout step that ties the higher tier to a concrete failure mode of the base option, so the pitch reads as relevant rather than a margin grab.`,
    promptText: `You are writing an upsell block that appears while someone has a base-tier product in their cart, offering the next tier up. The pitch has to earn its place — it should read as "here's something you'd actually want to know before you check out," not a markup attempt.

BASE PRODUCT IN CART
{{base_product}}

UPGRADE TIER
{{upgrade_tier}}

PRICE DIFFERENCE
{{price_delta}}

WHERE THE BASE TIER ACTUALLY FALLS SHORT
{{base_tier_limitation}}

BUYER SIGNAL AVAILABLE
{{buyer_signal}}

STEP 1 — DECIDE IF THE UPSELL IS EVEN RELEVANT
Before writing any copy, check the buyer signal against the base tier limitation. If nothing in the buyer signal suggests they'd actually hit that limitation, say so plainly and write a one-line recommendation to suppress the upsell for this buyer rather than show it anyway — a mistargeted upsell shown to someone who'd never notice the limitation just adds friction and looks like sales pressure with no basis.

STEP 2 — IF RELEVANT, WRITE THE COMPARISON
Write exactly one sentence stating the specific situation where the base tier fails or falls short, phrased as something the buyer would recognize from their own use case, not a spec-sheet difference they'd have to translate themselves. Follow with one sentence on what the upgrade tier changes, in plain outcome terms. State the price delta as "$X more for [outcome]" — never bury it or make the buyer hunt for the number. Do not use urgency language ("upgrade now", "limited time") unless a real time constraint exists — an upsell about a use-case fit doesn't need artificial urgency and adding it undercuts the case-based reasoning you just made.

STEP 3 — GIVE THE DECLINE PATH EQUAL WEIGHT
Write the "no thanks, keep the base tier" option in neutral, non-shaming language — it should read as a legitimate, complete choice, not a lesser path the buyer has to push past.

OUTPUT FORMAT
1. Relevance check verdict (show / suppress) and the one-line reason.
2. If showing: the two-sentence comparison, the price-delta line, and the decline-path microcopy, all ready to paste into a checkout modal.`,
    variables: [
      {
        name: 'base_product',
        description: `The base-tier item currently in the cart.`,
        example: `Standard 600W blender, single-serve cups only, no vacuum-seal jar.`,
        required: true,
      },
      {
        name: 'upgrade_tier',
        description: `The higher tier being offered instead.`,
        example: `Pro 1200W blender with a 64oz vacuum jar that reduces oxidation for make-ahead smoothies.`,
        required: true,
      },
      {
        name: 'price_delta',
        description: `The actual price difference between the two tiers.`,
        example: `$45 more than the standard model.`,
        required: true,
      },
      {
        name: 'base_tier_limitation',
        description: `The specific situation where the base tier underperforms.`,
        example: `The single-serve cup only holds enough for one smoothie at a time, so batch-prepping a week of smoothies isn't possible with the base unit.`,
        required: true,
      },
      {
        name: 'buyer_signal',
        description: `Any behavioral or cart signal available about this specific buyer.`,
        example: `Cart also contains a 2-week frozen fruit variety pack and they searched 'meal prep smoothie' before landing on this product.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `upsell`,
      `checkout-copy`,
      `tier-comparison`,
      `conversion-copy`,
      `cart-optimization`,
    ],
    whyItWorks: `The relevance-check step exists because GPT-5.1, asked directly for upsell copy, will produce persuasive comparison text regardless of whether the underlying pairing makes sense for the specific buyer — it optimizes for the shape of a convincing upsell rather than for whether an upsell should be shown at all, since nothing in a bare "write upsell copy" instruction gives it permission to conclude the answer is no. Forcing the model to check the buyer signal against the stated limitation before writing anything reframes the task from copywriting to a gated decision, which changes what the model actually produces: a suppression recommendation is now a valid, in-scope output rather than an implicit failure to complete the task. Requiring the base-tier limitation to be phrased as something the buyer would personally recognize, rather than a spec-sheet delta, matters because upsell copy that lists technical differences (wattage, jar volume) forces the buyer to do the translation work themselves, and most buyers won't bother mid-checkout — translating the spec into the exact failure scenario ('can't batch a week of smoothies at once') does that work for them and is the actual mechanism by which relevant upsells convert while irrelevant ones get dismissed as noise. The instruction against artificial urgency addresses a known pattern where language models default to scarcity language whenever the word 'upsell' appears in context, even when no real constraint exists — for a use-case-fit pitch, manufactured urgency actively undermines the credibility of the reasoning just given, since a genuinely relevant recommendation doesn't need a countdown timer to be compelling.`,
    exampleOutput: `Relevance check: show — the cart contains a frozen fruit variety pack and a 'meal prep smoothie' search, both consistent with the base tier's limitation. Copy: "The standard cup holds one smoothie at a time, so a week of frozen-fruit prep means blending daily. $45 more gets you the 64oz vacuum jar built for batching a week at once." Decline path: "Keep the standard blender — you can always add the jar separately later."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-abandoned-cart-recovery-email-sequence',
    category: 'ecommerce-product',
    title: `Draft a three-email abandoned-cart sequence that escalates reasons, not just reminders`,
    description: `Generates three distinct abandoned-cart emails — nudge, objection-handling, and final incentive — each doing a different job instead of repeating the same 'you left something' message three times.`,
    promptText: `Write a three-email abandoned-cart recovery sequence for the cart below. Each email must do a genuinely different job — this is not one email resent three times with a bigger discount each round.

ABANDONED CART CONTENTS
{{cart_contents}}

LIKELY REASON FOR ABANDONMENT
{{likely_reason}}

SEND TIMING
{{send_timing}}

DISCOUNT POLICY
{{discount_policy}}

BRAND VOICE
{{brand_voice}}

EMAIL 1 — THE NUDGE (send per the first timing given)
A short, low-pressure reminder. State exactly what's in the cart (not vague "your items") and nothing else — no discount, no urgency. Assume the most likely explanation is simply distraction, not price hesitation, so don't undercut the price before you know that's the issue.

EMAIL 2 — THE OBJECTION HANDLER (send per the second timing)
Address the likely reason for abandonment directly and by name — if it's price, show value or a payment-plan option before a discount; if it's shipping cost or delivery time, state the actual policy; if it's simply uncertainty about fit or quality, include something that reduces that specific uncertainty (a return policy line, a review excerpt). Do not default to a discount here unless the likely reason given is actually price — matching the wrong lever to the actual objection wastes the strongest email in the sequence.

EMAIL 3 — THE FINAL ONE (send per the third timing)
Only at this point introduce a discount, and only if the discount policy allows one — if it doesn't, use a real closing signal instead (limited stock if true, or simply state this is the last reminder) rather than inventing urgency. State the discount plainly with an expiry, no stacked exclamation points or manufactured scarcity language beyond what's actually true.

WHAT NOT TO DO
Do not open any email with "we noticed you left something in your cart" verbatim — vary the opening across all three so the sequence doesn't read as templated. Do not repeat the same product description language across all three emails.

OUTPUT FORMAT
Three complete emails, each labeled with its send timing, subject line, and body — ready to load into an ESP.`,
    variables: [
      {
        name: 'cart_contents',
        description: `What's actually sitting in the abandoned cart.`,
        example: `One pair of leather ankle boots, size 8, in cognac — $189.`,
        required: true,
      },
      {
        name: 'likely_reason',
        description: `Your best read on why they didn't complete checkout.`,
        example: `Shipping cost — cart abandonment rate spikes right after the shipping cost is shown at $12.99, based on funnel analytics.`,
        required: true,
      },
      {
        name: 'send_timing',
        description: `When each of the three emails should go out.`,
        example: `1 hour after abandonment, 24 hours after, 72 hours after.`,
        required: true,
      },
      {
        name: 'discount_policy',
        description: `What discount, if any, you're actually allowed to offer.`,
        example: `Up to 10% off on the third email only, never on the first two, per brand pricing policy.`,
        required: true,
      },
      {
        name: 'brand_voice',
        description: `The tone this brand actually writes in.`,
        example: `Warm and understated, like a small independent boutique — never exclamation-heavy or hypey.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `abandoned-cart`,
      `email-marketing`,
      `lifecycle-email`,
      `conversion-copy`,
      `ecommerce-email`,
    ],
    whyItWorks: `Assigning each email in the sequence a distinct job counters the single most common failure in AI-generated cart-recovery sequences: without an explicit constraint, GPT-5.1 will produce three emails that are structurally identical — reminder plus escalating discount — because that's the dominant pattern in the training data for 'abandoned cart email sequence,' and it's also the laziest way to satisfy a three-email request without doing the harder work of differentiating intent per email. Requiring the second email to match its lever to the actual stated abandonment reason, rather than defaulting to a discount, addresses a specific and costly mistake: offering a discount to someone who abandoned over shipping cost or fit uncertainty (not price) trains that segment to expect discounts on future purchases while never actually addressing why they left, which depresses full-price conversion over time even as the immediate recovery email 'works.' Delaying the discount to only the final email, and gating it on the stated discount policy rather than assuming one exists, prevents the model from inventing a markdown lever that may not reflect real margin constraints — a common failure when a model is asked to write persuasive copy without an explicit boundary on what levers are actually available. The instruction against a templated opening line addresses a surface-level tell that undermines trust in the whole sequence: if all three emails visibly share the same generator, the brand-voice work in the rest of the copy is wasted, since recipients pattern-match templated bulk email at the subject-line and opening-line level before reading further.`,
    exampleOutput: `Email 1 subject: "Still deciding on the cognac boots?" — no discount, no urgency, just the fact of what's saved. Email 2 subject: "About that $12.99 shipping" — addresses the actual likely objection with the real shipping policy, no discount. Email 3 subject: "Last call — 10% off before these go back to stock" — states the discount plainly with a real expiry.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-post-purchase-usage-onboarding-email',
    category: 'ecommerce-product',
    title: `Write a post-purchase email that gets a new buyer to first successful use, not just a thank-you`,
    description: `Produces a post-purchase onboarding email focused on getting the buyer to a working first experience with the product, aimed at cutting the return rate that comes from people never actually using what they bought.`,
    promptText: `Write one post-purchase email whose actual job is getting the buyer to a successful first use of the product they just bought — not a generic thank-you, and not a review request, since a buyer who hasn't used the product yet has nothing honest to review.

PRODUCT
{{product}}

COMMON FIRST-USE MISTAKE
{{common_mistake}}

WHAT 'SUCCESSFUL FIRST USE' LOOKS LIKE
{{success_definition}}

SEND TIMING
{{send_timing}}

SUPPORT CHANNEL
{{support_channel}}

RULES
Open by naming the specific first-use moment, not the purchase itself — the buyer already knows they bought it; thanking them for buying is wasted words in the first line. Include one clear instruction or tip that directly prevents the common first-use mistake given — state it as a positive action to take, not just a warning about what goes wrong. Define success in the buyer's terms (what they should notice or be able to do) rather than in the brand's terms (what the product's spec sheet claims). Include exactly one path to help if something isn't working, pointing to the actual support channel given — do not list multiple contact options, which dilutes which one to actually use. Do not ask for a review, a photo, or a referral anywhere in this email — those requests belong in a later email once success is confirmed, and asking before that point gets reviews from people who haven't really used the thing yet.

WHAT NOT TO DO
Do not open with "Thank you for your order" or "Your package is on its way" — both are already covered by the shipping confirmation email and repeating them here wastes the one email actually meant to drive usage. Do not pad the email with unrelated product recommendations.

OUTPUT FORMAT
Subject line, then the full email body, under 150 words — this email should be short enough to read on a phone in the time it takes to unbox the product.`,
    variables: [
      {
        name: 'product',
        description: `The product this onboarding email is for.`,
        example: `A cold-brew coffee maker with a removable steel mesh filter.`,
        required: true,
      },
      {
        name: 'common_mistake',
        description: `The most common way new buyers get a bad first experience.`,
        example: `Using a fine drip-grind coffee instead of a coarse grind, which clogs the mesh filter and makes the brew taste bitter and muddy.`,
        required: true,
      },
      {
        name: 'success_definition',
        description: `What a good first outcome actually looks like to the buyer.`,
        example: `A smooth, non-bitter cold brew concentrate ready in 12-18 hours, filter easy to rinse clean afterward.`,
        required: true,
      },
      {
        name: 'send_timing',
        description: `When this email goes out relative to delivery.`,
        example: `The morning after the delivery confirmation, assuming a 1-day unboxing lag.`,
        required: true,
      },
      {
        name: 'support_channel',
        description: `The one place to point people if something goes wrong.`,
        example: `A reply-to email routed to the actual support inbox, monitored same-day.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `post-purchase-email`,
      `customer-onboarding`,
      `retention`,
      `returns-reduction`,
      `lifecycle-email`,
    ],
    whyItWorks: `Explicitly banning the review or referral ask forces a separation that GPT-5.1 doesn't make on its own: asked generically for a 'post-purchase email,' it defaults to a template that thanks the buyer, nudges a review, and suggests related products all in one message, because that's the most common shape of post-purchase email in its training distribution, and that shape treats the purchase itself as the success event rather than actual product use — for anything with a real first-use learning curve, that conflation is the direct cause of both bad early reviews (written before the buyer figured out the coarse-grind requirement) and unnecessary returns (from buyers who never got a good result and assumed the product was defective rather than misused). Requiring the common mistake to be addressed as a positive instruction rather than a warning matters mechanically: warnings phrased as 'don't do X' get skimmed and ignored at a higher rate in transactional email, whereas 'use a coarse grind, roughly the texture of raw sugar' gives the buyer something concrete to act on during the moment they're actually unboxing and about to make the mistake. Restricting the email to a single support channel, rather than the multi-channel list a model defaults to when asked to be 'helpful,' removes the decision-paralysis cost of a confused new buyer having to guess which of three listed channels actually gets a fast response — a single clear path converts a would-be return into a resolved support ticket instead.`,
    exampleOutput: `Subject: "Before your first cold brew: one grind size makes all the difference" — body opens on the grind tip, states what a good 12-18 hour result should taste and look like, and closes with a single reply-to line for help, no review ask.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-new-sku-launch-plan-checklist',
    category: 'ecommerce-product',
    title: `Build a launch plan for one new SKU that accounts for what could actually go wrong on launch day`,
    description: `Produces a phased launch checklist for a single new product — pre-launch, launch day, and post-launch — with an explicit risk section instead of a generic marketing calendar.`,
    promptText: `Build a launch plan for one specific new SKU going live on an existing store — not a general 'how to launch a product' guide, a plan scoped to this launch's actual constraints.

PRODUCT
{{product}}

LAUNCH DATE
{{launch_date}}

EXISTING AUDIENCE
{{existing_audience}}

INVENTORY CONSTRAINT
{{inventory_constraint}}

DEPENDENCIES NOT YET CONFIRMED
{{unconfirmed_dependencies}}

PHASE 1 — PRE-LAUNCH (working backward from launch date)
List the concrete tasks that must be done before launch, each with a rough lead time before launch day and who it depends on (you, a vendor, a platform). Anything that depends on one of the unconfirmed dependencies must be flagged as at-risk, with what happens to the plan if it slips.

PHASE 2 — LAUNCH DAY
List what actually needs to happen on the day itself, in order — listing to go live, first announcement channel, any time-zone consideration for the existing audience. Do not include tasks that are really pre-launch prep restated.

PHASE 3 — FIRST 72 HOURS
List what to monitor and what specific numbers would signal a problem worth acting on (e.g., sell-through pace against the inventory constraint, return-to-cart abandonment on the new PDP) rather than a vague "monitor performance."

RISK SECTION (mandatory, do not skip)
Given the inventory constraint and unconfirmed dependencies, name the single most likely way this specific launch underperforms or breaks, and one concrete mitigation for it — not a generic list of possible risks, the one that's actually most likely given what's stated above.

OUTPUT FORMAT
Three phased checklists as specified, then the risk section as a short standalone paragraph.`,
    variables: [
      {
        name: 'product',
        description: `The new SKU being launched.`,
        example: `A limited first run of 400 units of a new ceramic pour-over dripper, a new color variant of an existing bestseller.`,
        required: true,
      },
      {
        name: 'launch_date',
        description: `The target go-live date.`,
        example: `September 3, 10am ET.`,
        required: true,
      },
      {
        name: 'existing_audience',
        description: `Who you're launching to and through what channels you already have.`,
        example: `42,000-subscriber email list, 18,000-follower Instagram, no paid ads budget for this launch.`,
        required: true,
      },
      {
        name: 'inventory_constraint',
        description: `The actual stock situation for this launch.`,
        example: `Only 400 units in this first run, next restock is 6 weeks out.`,
        required: true,
      },
      {
        name: 'unconfirmed_dependencies',
        description: `Anything the launch depends on that isn't locked in yet.`,
        example: `Product photography from an external photographer, due 5 days before launch but not yet confirmed as on schedule.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-launch`,
      `launch-plan`,
      `project-checklist`,
      `ecommerce-ops`,
      `risk-planning`,
    ],
    whyItWorks: `The mandatory risk section, scoped to name the single most likely failure rather than a generic list, counters GPT-5.1's default behavior on planning tasks, which is to produce an exhaustive, hedge-everything risk list ('supply chain issues, weather delays, platform outages, negative reviews') that reads as thorough but gives the operator no actual prioritization — a launch plan with twelve equally-weighted risks is functionally identical to one with none, because nobody can act on all twelve simultaneously with finite launch-week attention. Forcing the model to reason from the specific inventory constraint and unconfirmed dependency stated in the prompt, rather than general e-commerce launch risks, produces a genuinely different answer for a 400-unit limited run than it would for an unlimited-stock SKU — the former's dominant risk is selling out and disappointing the announcement audience, which is a different problem requiring a different mitigation (a waitlist mechanism) than a generic 'launch could underperform' risk. Flagging pre-launch tasks that depend on the unconfirmed dependencies, with an explicit 'what happens if it slips' consequence, prevents the common planning failure where a dependency risk is noted once at the top of a document and then silently ignored in every subsequent phase that actually depends on it — tying the consequence directly to the task in Phase 1 keeps the risk live in the plan rather than treated as boilerplate.`,
    exampleOutput: `Risk section: "With only 400 units and a 6-week restock lag, the most likely failure is selling out within hours of the email send and disappointing the Instagram audience who see it later — mitigate by loading a waitlist form on the PDP the moment stock hits zero, framed as 'notify me for restock' rather than a dead sold-out page."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-category-page-seo-content-brief',
    category: 'ecommerce-product',
    title: `Write a category-page SEO brief that fixes thin content without turning the page into a blog post`,
    description: `Produces an SEO content brief for a product category page — target query, on-page elements, and internal linking — scoped to keep the page shoppable rather than accidentally rewriting it as an article.`,
    promptText: `Write an SEO content brief for one category page on an online store. The goal is fixing thin or purely templated content without turning a shopping page into a blog post the buyer has to scroll past to actually shop.

CATEGORY PAGE
{{category_page}}

CURRENT CONTENT STATE
{{current_state}}

TARGET QUERY
{{target_query}}

COMPETING PAGES RANKING ABOVE IT
{{competing_pages}}

PRODUCT COUNT ON THIS PAGE
{{product_count}}

STEP 1 — TARGET QUERY FIT CHECK
Confirm the target query is actually a category-level intent (someone wants to browse and compare options) rather than a single-product or purely informational intent that belongs on a different page type — if it's the wrong intent for a category page, say so and suggest the correct page type instead of writing a brief around a mismatched query.

STEP 2 — ON-PAGE ELEMENTS
Specify the H1, meta title, and meta description, each incorporating the target query naturally. Specify a short category description (2-3 sentences max, placed above the product grid, not a 400-word essay) that states what distinguishes this category's products from the adjacent categories a shopper might confuse it with.

STEP 3 — FILTER AND FACET COPY
Given the product count, note which filter attributes are worth surfacing prominently (the ones that actually split the {{product_count}} products into meaningfully different groups) rather than listing every possible facet.

STEP 4 — INTERNAL LINKING
Specify 2-3 internal links this page should receive from elsewhere on the site (not links this page sends out) to build its relevance for the target query, naming realistic source pages.

WHAT NOT TO DO
Do not recommend adding a long-form buying-guide block below the product grid unless nothing else in the brief can plausibly close the content gap — that's the generic fallback every SEO tool suggests, and it often just adds words without addressing why the page is thin.

OUTPUT FORMAT
The four steps as labeled sections, in order.`,
    variables: [
      {
        name: 'category_page',
        description: `The specific category page being optimized.`,
        example: `/collections/mens-running-shoes on a mid-size running gear store.`,
        required: true,
      },
      {
        name: 'current_state',
        description: `What's actually on the page today.`,
        example: `Auto-generated title tag, no category description, just a product grid and filter sidebar.`,
        required: true,
      },
      {
        name: 'target_query',
        description: `The search query this page should rank for.`,
        example: `'best mens running shoes for overpronation'`,
        required: true,
      },
      {
        name: 'competing_pages',
        description: `What's actually outranking this page right now.`,
        example: `Two affiliate 'best running shoes' roundup articles and one competitor's category page with a detailed buying guide.`,
        required: true,
      },
      {
        name: 'product_count',
        description: `How many products are on this category page.`,
        example: `34 SKUs across 6 brands.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ecommerce-seo`,
      `category-page`,
      `content-brief`,
      `on-page-seo`,
      `internal-linking`,
    ],
    whyItWorks: `The query-intent check as a gated first step matters because GPT-5.1, given a target query and asked directly for a category-page brief, will write the brief regardless of whether the query actually matches category-level intent — a query like 'best running shoes for overpronation' carries comparison-and-advice intent that a thin category page structurally cannot satisfy as well as an article can, and no amount of on-page copywriting closes that gap, so surfacing the mismatch before writing the rest of the brief prevents wasted effort optimizing the wrong page type. The explicit cap on the category description length, and the instruction to place it above the grid rather than let it expand, counters a strong default tendency: language models treat 'thin content' as a word-count problem and respond by generating long descriptive blocks, when the actual SEO and UX fix for a shopping page is a tight, differentiating description plus better structured signals (filters, internal links), not more prose competing with the product grid for attention. Scoping filter-facet recommendations to the actual product count prevents a generic answer that lists every conceivable running-shoe facet (color, brand, price, width, drop, terrain) regardless of whether 34 SKUs actually split meaningfully across all of them — recommending facets that don't create meaningfully different result sets adds sidebar clutter without helping either users or crawlers. The explicit ban on defaulting to a buying-guide block addresses the single most common SEO-tool suggestion for thin category pages, which is often applied reflexively without checking whether the actual ranking gap is content depth versus something structural like internal link equity.`,
    exampleOutput: `Step 1: query fit confirmed — 'best running shoes for overpronation' has comparison intent that a filterable category page can serve if overpronation-support is a real, filterable attribute. Step 2: H1 "Men's Running Shoes for Overpronation", meta title/description with the query, 2-sentence category blurb distinguishing stability shoes from neutral-cushion shoes in the adjacent category.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-marketplace-listing-keyword-map',
    category: 'ecommerce-product',
    title: `Map backend and title keywords for a marketplace listing without stuffing the title into gibberish`,
    description: `Builds a keyword placement map for a marketplace product listing — title, backend search terms, and bullet points — that respects the platform's actual character limits and search-relevance rules.`,
    promptText: `Build a keyword placement map for one marketplace product listing. The output has to respect the actual character limits and indexing rules of the named platform — a keyword list on its own is not the deliverable, placement is.

PRODUCT
{{product}}

MARKETPLACE
{{marketplace}}

CANDIDATE KEYWORDS (with rough search-volume signal if known)
{{candidate_keywords}}

CURRENT TITLE
{{current_title}}

CHARACTER LIMITS
{{character_limits}}

STEP 1 — SORT KEYWORDS BY PLACEMENT
Sort the candidate keywords into three buckets: title-worthy (high relevance, should be human-readable in the title), bullet-worthy (relevant but would make the title unreadable if forced in), and backend-only (relevant for indexing but not natural language a shopper would read). Say explicitly why each keyword landed where it did.

STEP 2 — WRITE THE TITLE
Rewrite the title using only the title-worthy keywords, staying within the stated character limit, and keep it readable as an actual sentence a shopper would parse at a glance — do not chain keywords with no grammar between them just to fit more in. If the current title already does this reasonably well, say so rather than rewriting for the sake of rewriting.

STEP 3 — BULLET POINTS
Draft bullet points that each work in one or two bullet-worthy keywords naturally, phrased as a benefit or spec a buyer would actually read, not a keyword dump with commas.

STEP 4 — BACKEND SEARCH TERMS
List the backend-only keywords as a comma-or-space-separated string within the platform's actual backend character limit, removing any duplicate word stems already covered by the title or bullets (repeating a word already indexed elsewhere wastes limited backend character space).

OUTPUT FORMAT
The four steps as labeled sections in order, with the final title and bullets shown as ready-to-paste text.`,
    variables: [
      {
        name: 'product',
        description: `The product being listed.`,
        example: `A stainless steel 32oz insulated water bottle with a straw lid.`,
        required: true,
      },
      {
        name: 'marketplace',
        description: `Which marketplace this listing is for.`,
        example: `Amazon US, Sports & Outdoors category.`,
        required: true,
      },
      {
        name: 'candidate_keywords',
        description: `The keyword candidates to place, with volume signal if you have it.`,
        example: `'insulated water bottle' (high), 'water bottle with straw' (high), '32 oz tumbler' (medium), 'gym water bottle' (medium), 'leak proof' (low).`,
        required: true,
      },
      {
        name: 'current_title',
        description: `The listing's current title.`,
        example: `"Water Bottle 32oz Stainless Steel Insulated with Straw Lid Leak Proof Gym Sports"`,
        required: true,
      },
      {
        name: 'character_limits',
        description: `The platform's actual title and backend field limits.`,
        example: `200-character title limit, 249-byte backend search term field.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `marketplace-seo`,
      `amazon-listing`,
      `keyword-mapping`,
      `product-listing`,
      `search-optimization`,
    ],
    whyItWorks: `Sorting keywords into title/bullet/backend buckets before writing anything counters GPT-5.1's default behavior when asked to 'optimize a listing title with these keywords,' which is to chain every given keyword into the title regardless of whether the result reads as a sentence — that produces the exact keyword-stuffed, comma-free title strings that dominate marketplace listings and that marketplace ranking algorithms increasingly discount relative to natural-language titles with strong click-through, since a title nobody can parse at a glance suppresses the click-through signal the algorithm also weighs. Explicitly permitting the model to say the current title is already fine, rather than always producing a rewrite, matters because a model asked to 'improve' something will almost always generate a changed version even when the original was adequate, since producing no change can read as an incomplete response — stating this permission upfront removes that pressure and lets a genuinely fine title stay as is. Requiring duplicate word stems to be stripped from the backend terms once they're covered by the title or bullets addresses a specific and well-documented Amazon indexing rule: backend search term fields have a hard byte limit, and most marketplace search algorithms already index visible on-page text (title, bullets) separately from backend terms, so repeating an already-covered word there is a pure waste of a scarce, non-renewable character budget that could otherwise hold a genuinely new search term the listing isn't yet indexed for.`,
    exampleOutput: `Step 2 title: "32oz Insulated Water Bottle with Straw Lid – Leak-Proof Stainless Steel, Gym & Sports" (98 chars, within limit, reads as a sentence). Step 4 backend terms: "tumbler 32 oz sports outdoor hydration flask" — duplicate stems like 'water bottle' and 'insulated' dropped since they're already indexed via the title.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-photography-shot-list-brief',
    category: 'ecommerce-product',
    title: `Write a product photography shot list that a photographer can shoot from without a follow-up call`,
    description: `Produces a complete photo shoot brief for one product — shot list, angle and prop notes, and platform-specific sizing — precise enough that an external photographer can execute it without needing clarifying questions.`,
    promptText: `Write a photography brief for one product shoot, detailed enough that an external photographer who has never seen the product could shoot it correctly without a clarifying call.

PRODUCT
{{product}}

WHERE THE IMAGES WILL BE USED
{{usage_destinations}}

KEY FEATURES THAT MUST BE VISIBLE
{{key_features}}

BRAND VISUAL STYLE
{{brand_style}}

KNOWN PROBLEM FROM PAST SHOOTS
{{past_shoot_problem}}

SHOT LIST
List every required shot as a numbered item: angle, whether it's on a plain background or in a styled/lifestyle setting, and what specifically must be in frame and sharp. Base the required count and type of shots on the usage destinations given — a marketplace listing needs a specific minimum shot set (main image on pure white, angle shots, scale/size reference, packaging); a homepage hero needs a different aspect ratio and framing than a PDP gallery image. Do not propose a generic "5-7 lifestyle shots" list that ignores what these images are actually for.

TECHNICAL SPECS PER DESTINATION
For each usage destination, state the aspect ratio and minimum resolution actually required by that platform or page template — do not give one blanket spec for all destinations if they differ.

ADDRESS THE KNOWN PROBLEM
Given the known problem from past shoots, add one explicit instruction to this brief that directly prevents it from recurring — state it as a directive to the photographer, not a note to yourself.

PROPS AND STYLING
List only props that support showing the key features or the brand style — flag anything that would visually compete with or obscure a key feature.

OUTPUT FORMAT
A numbered shot list with angle/background/focus notes, a technical specs table by destination, and a short props section — ready to send to an external photographer as-is.`,
    variables: [
      {
        name: 'product',
        description: `The product being photographed.`,
        example: `A leather laptop sleeve with a hidden magnetic clasp and a felt interior lining.`,
        required: true,
      },
      {
        name: 'usage_destinations',
        description: `Every place these photos will actually be used.`,
        example: `Amazon listing main + 6 secondary images, Shopify PDP gallery, and one homepage hero banner (16:9).`,
        required: true,
      },
      {
        name: 'key_features',
        description: `The features that must be visible and legible in at least one shot.`,
        example: `The magnetic clasp mechanism when open, and the felt lining texture when the sleeve is turned inside-out slightly.`,
        required: true,
      },
      {
        name: 'brand_style',
        description: `The visual style this brand's photography should match.`,
        example: `Warm, natural light, minimal props, no harsh studio white — matches the brand's existing Instagram grid.`,
        required: true,
      },
      {
        name: 'past_shoot_problem',
        description: `A specific issue from a previous shoot that shouldn't repeat.`,
        example: `Last shoot's main image had a shadow across the clasp that made it look broken in thumbnail size on mobile.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-photography`,
      `shot-list`,
      `creative-brief`,
      `visual-merchandising`,
      `marketplace-images`,
    ],
    whyItWorks: `Deriving the shot list from the actual usage destinations, rather than a generic 'lifestyle plus studio shots' list, matters because GPT-5.1's default photography brief output pulls from the most common pattern in its training data — a roughly uniform 5-7 shot set regardless of where the images end up — which misses that a marketplace main image has a hard white-background requirement most lifestyle shots can't satisfy, and a 16:9 homepage hero has framing constraints a square PDP thumbnail doesn't share; treating destination as an input the shot list must derive from, rather than an afterthought mentioned once, forces the model to actually cross-reference platform requirements against the shot list it produces. The requirement to turn the past-shoot problem into an explicit photographer-facing directive, rather than leaving it as background context, addresses a common failure where a model acknowledges a stated constraint in its reasoning but doesn't translate it into an actionable instruction in the final brief — a photographer reading the brief cold has no way to infer 'avoid the clasp-shadow problem from last time' unless it's written as a direct lighting or angle instruction they can act on without knowing the shoot's history. Scoping props to only those supporting the key features or brand style, with an explicit instruction to flag anything visually competing with a key feature, counters the tendency of styled product photography briefs to add decorative props by default for visual interest — appropriate for a lifestyle hero shot, actively harmful for a detail shot whose entire purpose is making a specific mechanical feature legible in a marketplace thumbnail.`,
    exampleOutput: `Shot 1: main marketplace image, pure white background (255,255,255), sleeve closed, 3/4 angle, clasp visible with even diffused lighting to avoid shadow across the clasp (directly addressing the prior shoot's shadow issue). Shot 4: detail shot, clasp open, macro focus on the magnetic mechanism, no props in frame.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-ugc-creator-video-brief',
    category: 'ecommerce-product',
    title: `Write a UGC creator brief that gets an authentic-feeling video without scripting away the authenticity`,
    description: `Produces a brief for a UGC creator making a short product video — talking points and required beats, not a word-for-word script — tuned so the result still feels like a real person's honest take.`,
    promptText: `Write a brief for a UGC creator who will film a short product video for paid social. This is a talking-points brief, not a word-for-word script — a creator reading a script on camera is the exact failure mode that makes UGC stop feeling authentic and start looking like an ad, which defeats the point of hiring a creator instead of doing a studio ad.

PRODUCT
{{product}}

PLATFORM AND FORMAT
{{platform_format}}

MUST-HIT POINTS (the only non-negotiable content)
{{must_hit_points}}

CREATOR'S OWN CONTEXT
{{creator_context}}

THINGS THAT MUST NOT BE CLAIMED
{{compliance_limits}}

STRUCTURE (beats, not lines)
Give the creator a beat structure: hook (what problem or moment opens the video), the honest reaction or demo moment, the must-hit points woven in as things the creator would naturally say, and a close. For each beat, describe what should happen and why, in enough detail that a creator understands the intent — but do not write dialogue for them to read verbatim; leave the actual words to the creator's own voice.

USE THE CREATOR'S OWN CONTEXT
Work the creator's own stated context into the hook or reaction beat specifically — a UGC brief that ignores who this particular creator is and could apply to any creator is indistinguishable from a script, which is the thing being avoided.

COMPLIANCE GUARDRAILS
State the things that must not be claimed as a plain do-not-say list, and briefly explain why each matters (a specific regulatory, medical, or overstatement risk) so the creator understands the boundary rather than just following a rule blindly — a creator who understands why a claim is off-limits is less likely to accidentally rephrase into something equally risky.

WHAT NOT TO DO
Do not write more than one example line per beat, and label any example line clearly as "example phrasing only, say it your way" — never present example lines as the required script.

OUTPUT FORMAT
Beat-by-beat structure with intent notes, the do-not-say list with reasons, and any example phrasing clearly labeled as optional.`,
    variables: [
      {
        name: 'product',
        description: `The product this UGC video is for.`,
        example: `An overnight retinol serum for first-time retinol users.`,
        required: true,
      },
      {
        name: 'platform_format',
        description: `Where this runs and the format constraints.`,
        example: `TikTok/Reels, 30-45 seconds, vertical, native-feeling not polished.`,
        required: true,
      },
      {
        name: 'must_hit_points',
        description: `The specific facts or claims that must appear somewhere.`,
        example: `Start with the lowest concentration (0.25%) for first-time users, apply only at night, always follow with SPF the next morning.`,
        required: true,
      },
      {
        name: 'creator_context',
        description: `What's actually true and specific about this particular creator.`,
        example: `The creator has documented sensitive, acne-prone skin on their channel before and has an audience that specifically asks about gentle skincare.`,
        required: true,
      },
      {
        name: 'compliance_limits',
        description: `Claims that legally or factually cannot be made.`,
        example: `Cannot say it 'cures' or 'reverses' aging, cannot claim visible results in a specific number of days without a substantiated study behind that claim.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ugc-brief`,
      `creator-brief`,
      `social-video`,
      `product-marketing`,
      `compliance`,
    ],
    whyItWorks: `The explicit prohibition on writing dialogue counters GPT-5.1's strong default when asked for a 'video brief' — without that constraint, it tends to produce a beat structure that's actually a disguised script, complete with specific sentences meant to be delivered close to verbatim, because that's the easiest way to guarantee the must-hit points get said and it mirrors the shape of most ad-script examples in its training data; the problem is that a UGC creator reading assigned lines produces the flat, over-articulated delivery audiences have learned to recognize and scroll past, which is precisely the outcome paying for 'user-generated' content is meant to avoid. Requiring the creator's own stated context to be worked into a specific beat, rather than left as unused background, forces the brief to actually be creator-specific rather than a generic template that happens to name this creator in the header — a brief that would read identically for any creator given the same product has failed at the one thing that makes UGC different from a script read by an actor. Pairing the do-not-say list with the reason behind each restriction, rather than a bare rule list, matters because a creator who understands that 'reverses aging' is a legally risky claim (not just an arbitrary brand preference) is far less likely to accidentally say something equally non-compliant in their own words during an ad-libbed take — a bare prohibition list only blocks the exact phrase given, while an understood reason generalizes to phrasing the brief-writer never anticipated.`,
    exampleOutput: `Hook beat: open on the creator's own documented sensitive-skin story — "you've talked about your skin freaking out before, start there and show why you were nervous to try retinol at all." Example phrasing (optional, say it your way): "I was so scared retinol would wreck my skin like everything else has."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-shopify-homepage-copy-wireframe',
    category: 'ecommerce-product',
    title: `Plan a store homepage section-by-section, tied to what first-time visitors actually don't know yet`,
    description: `Produces a section-by-section homepage plan with copy for each block, built around what a cold first-time visitor genuinely needs answered before they'll browse further, rather than a generic hero-plus-grid template.`,
    promptText: `Plan the homepage for an online store, section by section, with actual copy for each block. Build it around what a completely new visitor genuinely doesn't know yet about this brand, not a generic homepage template.

STORE
{{store_description}}

WHAT A NEW VISITOR DOESN'T KNOW YET
{{visitor_knowledge_gap}}

BEST-SELLING PRODUCTS OR COLLECTIONS
{{bestsellers}}

TRUST SIGNAL AVAILABLE
{{trust_signal}}

COMPETITOR THIS STORE GETS CONFUSED WITH
{{competitor_confusion}}

SECTION 1 — HERO
Write the hero headline and subheadline to close the specific knowledge gap stated above — a first-time visitor's biggest open question, answered in one line, beats a generic brand tagline. If the confusion with a competitor is a real risk, the hero or the section immediately after it should make the actual point of difference legible within the first screen, without naming the competitor directly.

SECTION 2 — BESTSELLERS OR FEATURED COLLECTION
Decide whether to lead with a single hero product or a curated collection based on the bestsellers given, and justify the choice in one line.

SECTION 3 — TRUST SIGNAL
Place the trust signal where it addresses hesitation, not just wherever a template puts a review-stars widget — state specifically what buying hesitation this exact trust signal is meant to reduce.

SECTION 4 — HOW IT ACTUALLY WORKS OR WHAT MAKES IT DIFFERENT
One short block making the point of differentiation from the confused competitor concrete and specific, not abstract brand language.

WHAT NOT TO DO
Do not include a generic "as seen in" press-logo section or newsletter signup block unless one is specifically relevant here — don't pad the plan with sections copied from an unrelated homepage template just to hit a standard section count.

OUTPUT FORMAT
Four labeled sections, each with the actual copy (headline, subheadline, and any supporting line) plus a one-line rationale for why that section is placed and worded that way.`,
    variables: [
      {
        name: 'store_description',
        description: `What this store actually sells and its general positioning.`,
        example: `A direct-to-consumer brand selling refillable glass cleaning-product bottles with concentrate refill pods.`,
        required: true,
      },
      {
        name: 'visitor_knowledge_gap',
        description: `What a brand-new visitor doesn't understand yet that's stopping them from browsing further.`,
        example: `Most visitors don't realize the bottles are reusable and the ongoing cost is just the small refill pods, not a new bottle each time — they assume it's a one-time novelty purchase.`,
        required: true,
      },
      {
        name: 'bestsellers',
        description: `The actual top-performing products or collections.`,
        example: `The all-purpose cleaner starter kit outsells everything else 3-to-1.`,
        required: true,
      },
      {
        name: 'trust_signal',
        description: `A real, specific trust signal you can use.`,
        example: `4.8 stars across 3,200 reviews, plus a 'B-corp certified' badge.`,
        required: true,
      },
      {
        name: 'competitor_confusion',
        description: `A competitor or category this store is often mistaken for.`,
        example: `Visitors often assume it's the same as single-use plastic spray bottle cleaners, missing that the whole model is refill-based.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `homepage-copy`,
      `shopify`,
      `landing-page`,
      `conversion-copy`,
      `brand-positioning`,
    ],
    whyItWorks: `Anchoring the hero section to the specific stated knowledge gap, rather than asking for a generic hero headline, counters the strongest default in GPT-5.1's homepage-copy output — a broad, benefit-forward tagline ('Clean smarter, live better') that sounds finished but doesn't actually address what's stopping a specific first-time visitor from understanding the offer, since generic taglines are trained to sound good across every brand simultaneously and therefore say nothing brand-specific. Making the competitor-confusion point implicit within the first screen, rather than a named comparison, matters because directly naming a competitor on a homepage creates legal and brand-tone risk and also does the competitor's marketing work by putting their name on your own page — describing the actual mechanical difference (refillable model versus single-use) lets the visitor draw the comparison themselves without the store ever needing to name who they mean. Requiring a stated rationale for where the trust signal is placed, tied to a specific hesitation it addresses, prevents the common pattern of dropping a review-stars widget reflexively near the top of the page regardless of what's actually causing purchase hesitation at that story's specific stage — a B-corp badge addresses an ethical-brand-fit hesitation, not a product-efficacy hesitation, and placing it without that reasoning is decoration rather than persuasion. The explicit ban on padding with unrelated generic sections (press logos, newsletter signup) addresses a language-model tendency to round out any list-shaped output to a 'standard' length or section count regardless of whether every section earns its place for this specific brand.`,
    exampleOutput: `Hero: "One bottle. Refill forever." / subheadline: "Skip buying a new spray bottle every month — just drop in a $4 concentrate pod and refill with water." Rationale: directly closes the 'is this a one-time novelty' knowledge gap in the first line, without naming any single-use competitor.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-pdp-conversion-audit',
    category: 'ecommerce-product',
    title: `Audit a product page for the specific reason it's leaking buyers, not a generic best-practices checklist`,
    description: `Runs a structured conversion audit on one product detail page, diagnosing the most likely specific reason it underperforms against the given funnel data instead of returning a generic PDP best-practices checklist.`,
    promptText: `Audit one product detail page for conversion issues. The output must diagnose the most likely specific cause of underperformance given the actual funnel numbers below — not a generic 'add trust badges, add urgency, improve photos' checklist that would apply to any PDP.

PRODUCT PAGE CONTENT
{{page_content}}

FUNNEL DATA
{{funnel_data}}

WHAT'S ALREADY BEEN TRIED
{{already_tried}}

TRAFFIC SOURCE
{{traffic_source}}

STEP 1 — LOCATE THE ACTUAL DROP-OFF
Using the funnel data, identify exactly where in the page (or the flow) the biggest relative drop happens — view-to-add-to-cart, or add-to-cart-to-purchase — since the fix for one is usually different from the fix for the other, and a generic audit that addresses both equally usually fixes neither well.

STEP 2 — DIAGNOSE, DON'T JUST LIST SYMPTOMS
Given where the drop-off is and the actual page content, name the one or two most probable specific causes — reference actual content on the page (a specific missing spec, an unclear price break, a shipping cost surprise) rather than generic categories like "trust" or "clarity." Cross-check against what's already been tried — do not recommend something already attempted unless you have a specific reason the prior attempt likely failed and a different approach would work.

STEP 3 — TRAFFIC-SOURCE CONTEXT
Consider whether the traffic source changes the diagnosis — a page converting poorly from paid social cold traffic often has a different root cause (unmet expectation set by the ad) than the same page converting poorly from returning-customer email traffic.

STEP 4 — RECOMMENDATION
Give exactly the top 2 fixes to test first, each with the specific change and the specific reason it addresses the diagnosed cause — not a long list of every possible PDP improvement.

WHAT NOT TO DO
Do not include generic PDP best practices ("add more reviews," "use high-quality images," "add scarcity messaging") unless the funnel data and page content actually point to that specific gap.

OUTPUT FORMAT
Four labeled steps as specified, ending with the top 2 prioritized fixes.`,
    variables: [
      {
        name: 'page_content',
        description: `What's actually on the page — description, images, price presentation, shipping info.`,
        example: `Title, 4 product photos (no size-comparison shot), price shown without mention of shipping cost until checkout, no size guide link, 12 reviews averaging 4.2 stars.`,
        required: true,
      },
      {
        name: 'funnel_data',
        description: `The actual conversion numbers at each funnel stage for this page.`,
        example: `View-to-add-to-cart rate is 8.5% (roughly in line with category average), but add-to-cart-to-purchase is only 19% versus a 34% site average.`,
        required: true,
      },
      {
        name: 'already_tried',
        description: `What's already been attempted to fix this.`,
        example: `Added a free-shipping banner site-wide two months ago; add-to-cart-to-purchase rate didn't move.`,
        required: true,
      },
      {
        name: 'traffic_source',
        description: `Where most of this page's traffic actually comes from.`,
        example: `70% from a paid Instagram campaign showing the product on a model, cold audience, first-time visitors.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `conversion-audit`,
      `product-page`,
      `cro`,
      `funnel-analysis`,
      `ecommerce-optimization`,
    ],
    whyItWorks: `Requiring the audit to locate the specific drop-off stage before diagnosing anything counters GPT-5.1's default behavior on CRO requests, which is to return a comprehensive best-practices checklist spanning the entire page (photos, trust signals, urgency, shipping) regardless of where the actual leak is — that checklist is defensible in the abstract since every item is plausibly good practice, but it wastes testing effort on stages that aren't actually the problem, and a 19% add-to-cart-to-purchase rate against a 34% site average is specifically a checkout-stage or price-surprise problem, not a browse-stage photo problem, which the funnel data makes diagnosable if the model is forced to actually use it rather than treat it as color commentary. Cross-checking against what's already been tried, with the requirement to explain why a repeated fix might now work differently rather than just re-suggesting it, prevents the model from recommending the free-shipping banner again in slightly different words — a generic CRO checklist has no memory of what's already failed, so without this explicit instruction the model will happily re-suggest an already-disproven fix because it's a category-correct suggestion, even though it's specifically known not to work here. Factoring in the traffic source addresses a real and specific CRO pattern: a page underperforming specifically for cold paid-social traffic is frequently an expectation-mismatch problem between what the ad promised and what the PDP delivers, which is a different root cause than the same conversion metrics would suggest for warm, already-familiar traffic, and conflating the two produces a diagnosis that only fits one segment.`,
    exampleOutput: `Step 1: the leak is add-to-cart-to-purchase (19% vs 34% average), not view-to-cart. Step 2: most likely cause is the shipping cost surprise at checkout — the free-shipping banner change didn't address it because shipping cost isn't disclosed until the final step regardless of the banner's presence elsewhere on the site. Top fix: surface actual shipping cost or free-shipping threshold directly on the PDP near the price, not just in a site-wide banner.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-collection-page-merchandising-plan',
    category: 'ecommerce-product',
    title: `Set a collection-page sort order and merchandising rule that reflects actual store priorities, not just 'best-selling first'`,
    description: `Produces a merchandising plan for a collection page's product order and featured placements, reasoned from actual margin, inventory, and seasonal priorities instead of defaulting to a flat best-seller sort.`,
    promptText: `Set the merchandising plan for one collection page — the order products appear in, which get featured placement, and which get demoted — reasoned from this store's actual current priorities, not a default best-sellers-first sort.

COLLECTION
{{collection}}

PRODUCTS IN THIS COLLECTION (with sales rank, margin, and stock level)
{{product_data}}

CURRENT BUSINESS PRIORITY
{{business_priority}}

SEASONAL OR TIME-BOUND FACTOR
{{seasonal_factor}}

STEP 1 — IDENTIFY THE TENSION
State plainly where a pure best-seller sort would conflict with the stated business priority or seasonal factor — if there's no real conflict, say so and recommend the simple best-seller sort rather than overengineering a plan where none is needed.

STEP 2 — FEATURED SLOTS (top of grid, typically 3-4 positions)
Assign the featured slots by resolving that tension explicitly — which products earn a boost above their natural sales rank and why, referencing the actual margin, stock, or seasonal data given, not a vague "promote strategic items."

STEP 3 — DEMOTIONS
Name any product that should be pushed down despite decent sales rank (e.g., low stock risking a sold-out grid item, or a product being phased out) and state the reason specifically.

STEP 4 — THE REST OF THE GRID
Confirm the remaining products should default to sales-rank order unless there's a specific reason given above to deviate — do not invent additional manual overrides beyond what the stated priorities actually justify.

WHAT NOT TO DO
Do not promote every high-margin item to a featured slot regardless of stock or relevance — a stockout on a featured position is worse for conversion than a slightly lower-margin bestseller sitting there instead.

OUTPUT FORMAT
The four steps as labeled sections, ending with a simple ordered list of the final grid position 1 through the number of featured/demoted items, with a one-line reason next to each.`,
    variables: [
      {
        name: 'collection',
        description: `The specific collection page being merchandised.`,
        example: `Women's Winter Coats collection, 22 SKUs.`,
        required: true,
      },
      {
        name: 'product_data',
        description: `Sales rank, margin, and stock for the relevant products.`,
        example: `Puffer Coat A: #1 sales rank, 38% margin, 140 units in stock. Wool Coat B: #2 sales rank, 55% margin, only 6 units in stock. Puffer Coat C: #7 sales rank, 61% margin, 300 units in stock.`,
        required: true,
      },
      {
        name: 'business_priority',
        description: `What the business actually wants to prioritize right now.`,
        example: `Push higher-margin wool coats where reasonable, since puffer coats have thinner margins due to a recent supplier cost increase.`,
        required: true,
      },
      {
        name: 'seasonal_factor',
        description: `Any time-bound factor relevant right now.`,
        example: `Late-season — need to clear remaining puffer coat inventory before markdown season starts in 3 weeks.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `merchandising`,
      `collection-page`,
      `product-sort`,
      `inventory-strategy`,
      `ecommerce-strategy`,
    ],
    whyItWorks: `Requiring an explicit tension check before assigning any featured slot counters a default failure mode: GPT-5.1 asked to 'merchandise this collection to prioritize margin' will happily rearrange every product by margin alone, without noticing that a high-margin item with only 6 units in stock is a bad candidate for a featured slot regardless of margin, because running out of stock on a prominently featured position produces a broken-looking grid (a 'sold out' badge in the most visible spot) that actively hurts conversion for everyone who sees that page while it's out — margin and prominence pull in the same direction only when stock supports the exposure, and a model not explicitly told to check stock against featured-slot risk will optimize margin in isolation. Allowing the model to conclude there's no real tension and recommend the plain best-seller sort matters because collection merchandising requests almost always get an elaborate manual-override answer whether or not the underlying data actually calls for one — a model asked to build a merchandising plan treats 'just use the default sort' as an unsatisfying non-answer, so without explicit permission to reach that conclusion it will invent minor justifications for reordering products that didn't need to move. The seasonal-clearance factor changes the correct answer in a specific, checkable way: a puffer coat needing to clear before markdown season is a legitimate reason to keep it prominent even at a thinner margin than the wool coat, since the cost of unsold late-season inventory (forced markdown, storage) outweighs the margin difference the business priority would otherwise favor — the plan has to weigh these two competing signals against each other rather than mechanically applying just one.`,
    exampleOutput: `Step 1: real tension — Wool Coat B (#2 rank, 55% margin) fits the margin priority but only has 6 units, risking a stockout in a featured slot; Puffer Coat A (#1 rank, thinner margin) needs to clear before markdown season. Step 2: feature Puffer Coat A first (clearance priority overrides margin here), Wool Coat B second but flagged to auto-demote once stock drops below 3 units.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-low-stock-and-backorder-messaging-plan',
    category: 'ecommerce-product',
    title: `Write low-stock and backorder messaging that's honest enough to survive a customer checking the actual restock date`,
    description: `Produces site and email copy for low-stock, sold-out, and backorder situations that states real timelines instead of vague scarcity language, so customers aren't misled into a purchase they'll regret or dispute.`,
    promptText: `Write the messaging for a product currently affected by a stock issue, across the site and any relevant email. This has to be accurate enough that a customer who checks back in a week isn't misled by what was said now — no vague scarcity language standing in for a real number when a real number exists.

PRODUCT AND STOCK SITUATION
{{stock_situation}}

ACTUAL RESTOCK OR FULFILLMENT TIMELINE
{{restock_timeline}}

CONFIDENCE IN THAT TIMELINE
{{timeline_confidence}}

SURFACES NEEDING COPY
{{surfaces}}

CUSTOMERS ALREADY WAITING
{{existing_waitlist}}

RULES
If a specific restock date exists and is reasonably confident, state it plainly ("back in stock around March 14") rather than a vague "coming soon" — vague language when a real date exists just creates unnecessary customer-service contacts from people asking what you could have told them upfront. If the timeline confidence is low, say so honestly with a wider window ("expected within 3-4 weeks, could shift") rather than either a fake-precise date or an unhelpfully vague one — match the specificity of the message to the actual specificity of the information. For a true low-stock-but-available situation, state real urgency only if the number remaining is genuinely low and known ("only 4 left") — never a generic "selling fast" if you don't actually have a number to back it up. For backorder situations where the customer would pay now and wait, be explicit that this is a preorder against future stock, not a normal in-stock purchase, and state what happens if the timeline slips (refund option, updated ETA notice) — leaving this unstated is what turns a delay into a chargeback dispute.

WHAT NOT TO DO
Do not write "back in stock soon" if an actual date or window was given in the timeline field — that's strictly less useful than what you were given and shouldn't be a fallback default.

OUTPUT FORMAT
One message per surface listed, each labeled, plus one line addressing the existing waitlist if one exists.`,
    variables: [
      {
        name: 'stock_situation',
        description: `The actual current stock state.`,
        example: `Completely sold out, a viral moment tripled demand overnight.`,
        required: true,
      },
      {
        name: 'restock_timeline',
        description: `The actual known or estimated restock date.`,
        example: `Confirmed by the supplier for the week of March 10-14.`,
        required: true,
      },
      {
        name: 'timeline_confidence',
        description: `How solid that timeline actually is.`,
        example: `High confidence — supplier has already shipped the batch, just in transit.`,
        required: true,
      },
      {
        name: 'surfaces',
        description: `Where this messaging needs to appear.`,
        example: `The sold-out PDP itself, a waitlist confirmation email, and an Instagram Story reply template for DM questions.`,
        required: true,
      },
      {
        name: 'existing_waitlist',
        description: `Whether people are already signed up to be notified.`,
        example: `2,400 people already on the restock waitlist for this SKU.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `inventory-messaging`,
      `backorder`,
      `customer-communication`,
      `stock-alerts`,
      `trust-and-transparency`,
    ],
    whyItWorks: `The explicit ban on defaulting to vague phrasing when a real date exists counters GPT-5.1's strong default register for stock messaging, which leans toward safe, hedged language ('back in stock soon,' 'check back for updates') even when given a specific date in the prompt — that hedging instinct comes from training on marketing copy where vagueness is usually the safer choice, but it actively discards information the business already has and is willing to share, producing a support burden of customers asking a question the brand could have answered proactively. Tying message specificity to actual timeline confidence, rather than always defaulting to either maximum precision or maximum vagueness, matters because a fake-precise date stated with unwarranted confidence creates a specific trust cost when it's missed (a customer who was told 'March 14' and doesn't get the product until April has a legitimate grievance in a way someone told 'within a few weeks' does not), while an unnecessarily vague message when the date is actually solid wastes real information the business has and gives customers no reason to trust future restock claims. The explicit instruction to state backorder terms as a preorder against future stock, with what happens if the timeline slips, addresses a genuine dispute-and-chargeback risk: a customer who paid believing they were buying an in-stock item and then waits three weeks with no proactive communication has real grounds to dispute the charge, and stating the wait-and-slip terms upfront is what legally and practically distinguishes a preorder from a delayed normal order.`,
    exampleOutput: `PDP: "Sold out — back in stock around March 10-14, confirmed shipping from our supplier now." Waitlist email: "You're one of 2,400 people we'll notify the moment this is back — expect an email the week of March 10." DM template: "Yes, it's coming back the week of March 10-14, already in transit — want me to add you to the restock list?"`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-returns-policy-plain-language-explainer',
    category: 'ecommerce-product',
    title: `Rewrite a returns policy into a plain-language explainer that actually answers what customers search for before contacting support`,
    description: `Turns dense legal-sounding returns policy text into a plain-language customer-facing explainer, organized around the actual questions customers ask, to reduce support tickets for questions the policy already answers.`,
    promptText: `Rewrite this returns policy into a plain-language explainer page. The goal is reducing support contacts from people who couldn't find the answer in the existing policy text, not producing a shorter version of the same legal document.

CURRENT POLICY TEXT
{{current_policy_text}}

MOST COMMON SUPPORT QUESTIONS ABOUT RETURNS
{{common_questions}}

ACTUAL POLICY TERMS THAT MUST STAY ACCURATE
{{policy_terms}}

EXCEPTIONS OR EDGE CASES
{{exceptions}}

STRUCTURE
Organize the explainer around the actual common questions given, as a Q&A or short-section format, rather than the policy's original legal-document structure (definitions, then conditions, then process) — customers search for answers to specific questions, not for a document structure. Every factual claim in the rewrite (timeframes, condition requirements, who pays return shipping, refund method and timing) must match the actual policy terms given exactly — do not simplify a specific number or condition into a softer, vaguer version, since that creates a real gap between what the page says and what the policy actually allows, which is exactly the kind of mismatch that generates disputed support tickets. State each named exception clearly rather than folding it into a blanket "see terms for exceptions" — a customer whose situation is the exception needs to be able to find that out from this page directly.

TONE
Write it as if a helpful support agent were explaining the policy out loud, not as if a lawyer were stating conditions — but never at the cost of precision on the actual terms.

WHAT NOT TO DO
Do not add a legal disclaimer stating this explainer supersedes or is separate from the official policy unless one is specifically requested — that undermines the point of the page, which is to be the thing customers can actually rely on.

OUTPUT FORMAT
A short intro line, then the common questions each as its own short-answer section, then a clearly labeled exceptions section.`,
    variables: [
      {
        name: 'current_policy_text',
        description: `The existing returns policy, as written today.`,
        example: `"Items may be returned within thirty (30) calendar days of the delivery date provided they are unworn, unwashed, and in original condition with tags attached. Return shipping costs are the responsibility of the customer except where the return is due to a defect or fulfillment error, in which case a prepaid label will be issued. Refunds are processed to the original payment method within 5-10 business days of the returned item being received and inspected."`,
        required: true,
      },
      {
        name: 'common_questions',
        description: `The actual most-asked support questions related to returns.`,
        example: `"Do I have to pay for return shipping?", "How long do I have to return something?", "Can I return something I already wore once to try it?", "When will I get my money back?"`,
        required: true,
      },
      {
        name: 'policy_terms',
        description: `The specific terms that must remain accurate in the rewrite.`,
        example: `30-day window from delivery, unworn/unwashed/tags-attached condition, customer pays return shipping except defects/fulfillment errors, 5-10 business day refund processing after inspection.`,
        required: true,
      },
      {
        name: 'exceptions',
        description: `Any special-case rules that need their own clear callout.`,
        example: `Final sale items (marked as such at purchase) cannot be returned at all; swimwear must have the hygiene liner still attached.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `returns-policy`,
      `customer-support`,
      `plain-language`,
      `faq`,
      `policy-communication`,
    ],
    whyItWorks: `Organizing the rewrite around the actual common support questions, rather than the policy document's original legal structure, matters because a customer searching a help center is trying to answer one specific question ('do I pay for return shipping') and the original definitions-then-conditions structure buries that answer inside a paragraph written to be legally complete, not fast to scan — restructuring around real questions is the actual mechanism by which a self-service page reduces support volume, since it shortens the path between the question in someone's head and the sentence that answers it. The instruction requiring every factual claim to match the given terms exactly, with no softening of specific numbers or conditions, addresses a real risk in how GPT-5.1 handles 'make this more plain-language' requests: simplifying legal text for readability commonly drifts a hard boundary condition into a softer, friendlier-sounding approximation ('within about a month' for a hard 30-day cutoff, or 'lightly used is usually fine' for a strict unworn requirement), and that drift creates a genuine discrepancy between the customer-facing page and the actual enforceable policy — a discrepancy that produces exactly the disputed-return support tickets the rewrite was meant to prevent. Requiring each exception to get its own explicit callout, rather than a blanket 'see terms for exceptions' line, matters because the person most likely to read a returns FAQ carefully is someone in a genuinely ambiguous situation (a final-sale item, a worn-once swimsuit) — folding the one thing they actually need into a vague pointer back to the legal document defeats the purpose of writing a plain-language page for them in the first place.`,
    exampleOutput: `"Do I have to pay for return shipping? Yes, unless the item arrived defective or we shipped you the wrong thing — in either of those cases we'll send you a prepaid label. Can I return something I wore once to try it? Only if it's still unworn in the sense of being unwashed with tags attached — a quick try-on at home is fine, wearing it out isn't."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ecommerce-product-new-sku-opportunity-research-brief',
    category: 'ecommerce-product',
    title: `Stress-test a new product idea against real demand signals before it becomes a launch plan`,
    description: `Produces a structured research brief evaluating whether a proposed new SKU idea is actually worth developing, weighing the demand signals and risks given rather than defaulting to an optimistic go-ahead.`,
    promptText: `Evaluate a proposed new product idea before it goes any further into development. The job here is an honest go/no-go/modify read based on the actual signals given, not a cheerleading brief that assumes the idea is good because someone proposed it.

PROPOSED PRODUCT IDEA
{{product_idea}}

WHERE THIS IDEA CAME FROM
{{idea_source}}

DEMAND SIGNALS AVAILABLE
{{demand_signals}}

EXISTING CATALOG OVERLAP
{{catalog_overlap}}

CONSTRAINTS
{{constraints}}

STEP 1 — WEIGH THE DEMAND SIGNAL
Given where the idea came from and the actual demand signals, state plainly how strong the evidence for real demand actually is — a single customer request is a much weaker signal than a recurring pattern across support tickets or search data, and the brief should say which kind of signal this is rather than treating any stated demand signal as automatically sufficient.

STEP 2 — CHECK CATALOG OVERLAP
Given the existing catalog, assess whether this would meaningfully expand what the store offers or largely cannibalize an existing product's sales — if overlap is high, say so plainly rather than treating a new SKU as pure incremental revenue by default.

STEP 3 — CHECK AGAINST CONSTRAINTS
Given the stated constraints (budget, minimum order quantity, timeline, or capability), flag anything about the idea as proposed that doesn't fit within them, and note what would have to change about the idea itself to fit — not just a restatement that the constraint exists.

STEP 4 — VERDICT
Give one of three verdicts — proceed, proceed with a specific modification, or don't proceed — with the single main reason. Do not hedge into "it depends" without naming what it actually depends on and what evidence would resolve that dependency.

WHAT NOT TO DO
Do not treat the fact that an idea was proposed as evidence it's a good idea — the brief's job is specifically to test that assumption, not confirm it.

OUTPUT FORMAT
Four labeled steps as specified, ending with the verdict stated in one clear sentence.`,
    variables: [
      {
        name: 'product_idea',
        description: `The proposed new product.`,
        example: `A travel-size version of the brand's bestselling 16oz body lotion, in a 2oz TSA-compliant bottle.`,
        required: true,
      },
      {
        name: 'idea_source',
        description: `Where this idea actually originated.`,
        example: `Recurring pattern in support tickets and Instagram comments over the last 4 months, roughly 30 separate mentions asking for a travel size.`,
        required: true,
      },
      {
        name: 'demand_signals',
        description: `Any concrete evidence of demand beyond anecdote.`,
        example: `30+ unprompted customer requests logged in support, plus the top competitor's travel-size version has 800+ reviews on its own listing.`,
        required: true,
      },
      {
        name: 'catalog_overlap',
        description: `What's already in the catalog that this might compete with.`,
        example: `The existing 16oz bottle is the top seller in the skincare category; a travel size would likely be bought by the same repeat customers rather than new ones.`,
        required: true,
      },
      {
        name: 'constraints',
        description: `The real limits this idea has to fit inside.`,
        example: `Supplier minimum order is 5,000 units for any new bottle mold, and there's no budget allocated for a new SKU until next quarter.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `product-research`,
      `new-product-development`,
      `demand-validation`,
      `opportunity-assessment`,
      `ecommerce-strategy`,
    ],
    whyItWorks: `The explicit instruction not to treat a proposed idea as inherently good counters a strong default bias in how GPT-5.1 handles evaluation requests framed around someone's existing idea — asked to 'evaluate this product idea,' it tends toward a structurally polite, mostly affirming analysis that surfaces a token risk or two but ultimately validates the premise, because the prompt's framing implicitly signals that a positive answer is expected, and disagreeing with the premise of a request reads as an unhelpful response unless explicitly invited. Requiring the demand-signal step to distinguish types of evidence (a recurring documented pattern versus a single anecdote) rather than accept any stated demand signal at face value addresses a real failure mode in product decisions: 30 unprompted mentions across four months is meaningfully different evidence than one enthusiastic customer email, and a brief that doesn't force this distinction will happily build a confident-sounding case on thin evidence because the prompt handed it a 'demand signal' without qualifying its strength. The catalog-overlap check exists because new-SKU proposals are almost always pitched and evaluated as incremental revenue, when a travel-size version of an existing bestseller is a textbook cannibalization risk — the same repeat customers buying a smaller size instead of the full size, not new customers being reached — and a brief that skips this check will overstate the idea's actual revenue impact by counting cannibalized sales as new sales. Forcing a specific verdict rather than allowing an 'it depends' non-answer matters because product development discussions frequently stall in exactly this kind of unresolved ambiguity, and a brief that names precisely what evidence would resolve the dependency turns a vague hedge into an actionable next step.`,
    exampleOutput: `Verdict: proceed with modification — demand signal is genuinely strong (recurring documented pattern, not anecdote), but the 5,000-unit minimum order and cannibalization risk mean this should launch as a value-add with a full-size purchase (travel size as a paid add-on or gift-with-purchase) rather than a standalone SKU competing with the 16oz bestseller.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
