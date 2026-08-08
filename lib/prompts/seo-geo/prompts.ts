import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'audit-robots-txt-and-llms-txt-for-ai-crawler-access',
    category: 'seo-geo',
    title: `Audit whether your robots.txt and llms.txt actually let AI crawlers in`,
    description: `A line-by-line robots.txt and llms.txt audit that applies the real AI-crawler precedence rules — most-specific User-agent group wins, longest matching path wins — so you get an exact verdict per bot instead of a guess.`,
    promptText: `You are an AI-crawler access auditor. You understand that robots.txt directives are resolved by two rules, not by reading top to bottom: (1) the most specific matching User-agent group wins over \`User-agent: *\`, and (2) within a group, the longest matching Disallow/Allow path wins. Apply those two rules literally — do not guess or summarize casually.

DOMAIN: {{domain}}

ROBOTS.TXT:
{{robots_txt_content}}

LLMS.TXT:
{{llms_txt_content}}

TASK
For each of the following AI crawlers, determine whether it can currently fetch {{domain}}'s homepage, and cite the exact directive (group + line) that decides it:
1. GPTBot (OpenAI — model training)
2. OAI-SearchBot (OpenAI — ChatGPT search and citations, a separate bot from GPTBot)
3. PerplexityBot (Perplexity — live answers)
4. ClaudeBot (Anthropic — training and Claude's web search)
5. Google-Extended (Google — Gemini and AI Overviews grounding, separate from classic Googlebot)
6. CCBot (Common Crawl — feeds many downstream AI datasets)

OUTPUT FORMAT
A table: Bot | Purpose (training / live search / both) | Allowed or Blocked | Deciding rule (quote the exact line) | One-line fix if blocked.
Then answer: does an /llms.txt exist, and if not, what three pages should it list first for {{domain}}?`,
    variables: [
      {
        name: 'domain',
        description: `The site's root domain or URL you're auditing.`,
        example: 'https://example.com',
        required: true,
      },
      {
        name: 'robots_txt_content',
        description: `The full, raw text of the site's /robots.txt file — paste it exactly, including comments.`,
        example: 'User-agent: *\nDisallow: /private/\n\nUser-agent: GPTBot\nDisallow: /',
        required: true,
      },
      {
        name: 'llms_txt_content',
        description: `The full raw text of /llms.txt if one exists. Leave as "none found" if the site doesn't have one.`,
        example: 'none found',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'robots.txt',
      'llms.txt',
      'ai-crawlers',
      'geo-audit',
      'gptbot',
      'technical-seo',
    ],
    whyItWorks: `Robots.txt precedence is famously counter-intuitive: most site owners assume a blanket \`Disallow: /\` under \`User-agent: *\` blocks everything, when in fact a bot with its own explicit group is entirely unaffected by it, and ties within a group are broken by whichever path is longest, not whichever line comes first. This is the exact algorithm the site's own AI Visibility Checker runs server-side against a homepage fetch. Forcing the model to quote the deciding line, rather than assert a verdict, turns a guess into a checkable claim — and separating GPTBot (training) from OAI-SearchBot (live ChatGPT citations) surfaces the single most common self-inflicted AI-invisibility mistake: blocking the training bot on purpose while never noticing the search bot got blocked too.`,
    exampleOutput: `| Bot | Purpose | Status | Deciding rule | Fix |
|---|---|---|---|---|
| GPTBot | Training | Blocked | \`User-agent: GPTBot\` / \`Disallow: /\` | Remove or narrow the GPTBot-specific Disallow if training inclusion is wanted |
| OAI-SearchBot | ChatGPT search citations | Allowed | No GPTBot-specific rule applies to it; falls through to \`User-agent: *\` / no Disallow | None needed |
| PerplexityBot | Live answers | Blocked | \`User-agent: PerplexityBot\` / \`Disallow: /\` | Add an explicit Allow for the paths you want cited |

No /llms.txt found. Suggested first three entries: /pricing, /docs, /blog.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: `Initial publish. Added the explicit "quote the deciding line" instruction after testing showed models will otherwise state a verdict without actually checking group-specificity or path-length precedence.`,
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'structure-faq-content-for-ai-citation',
    category: 'seo-geo',
    title: `Turn raw FAQ content into schema and copy AI engines can cite`,
    description: `Turns rough Q&A content into answer-first visible copy and valid FAQPage JSON-LD, structured for AI engines that still parse FAQ schema even after Google retired FAQ rich results.`,
    promptText: `You are an AEO (answer-engine-optimization) editor. Google retired FAQPage rich results on 7 May 2026, but AI answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews) still parse FAQPage JSON-LD and still quote well-structured Q&A prose directly. Your job is to make this content easy for both to lift.

PAGE TOPIC: {{page_topic}}

RAW Q&A:
{{raw_qa_content}}

TARGET ANSWER LENGTH: {{max_answer_length}} characters (if blank, keep each answer under roughly 300 characters)

RULES FOR EACH ANSWER
- The first sentence is the complete direct answer — no "Great question," no throat-clearing.
- One claim per answer. If the raw content bundles two ideas, split it into two Q&A pairs.
- The answer must be understandable on its own, with no pronoun referring back to the question ("it," "this," "that") — restate the subject.
- Keep any numbers, timeframes, or conditions from the source content exactly as given — never invent or round them.

OUTPUT
1. The cleaned Q&A as answer-first visible copy (what a human reads on the page).
2. The equivalent schema.org FAQPage JSON-LD block, one Question/acceptedAnswer pair per Q&A, ready to paste inside a <script type="application/ld+json"> tag.`,
    variables: [
      {
        name: 'page_topic',
        description: 'What the page or section is about, in a few words.',
        example: 'Return and refund policy for a DTC skincare brand',
        required: true,
      },
      {
        name: 'raw_qa_content',
        description:
          'Your existing questions and answers, in any rough form — bullet list, transcript, support-doc copy.',
        example:
          'Q: Can I return an opened product? A: Yes within 30 days if... Q: How long do refunds take? A: 5-7 business days...',
        required: true,
      },
      {
        name: 'max_answer_length',
        description:
          'Target character length per answer, if you want one enforced. Leave blank for no hard limit.',
        example: '300',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity', 'Google AI Overviews'],
    tags: ['faq schema', 'structured data', 'json-ld', 'answer-first', 'aeo'],
    whyItWorks: `An answer engine that retrieves a chunk of text and quotes it can only quote what stands alone — a chunk that opens with "It depends on..." with no restated subject is unusable out of context, which is why answer-first, pronoun-free single-claim answers are the retrievable unit, not a style preference. FAQPage schema still matters even though Google retired the FAQ rich result on 7 May 2026, because AI engines parse structured data independently of whether Google renders it as a visual snippet — it removes any ambiguity about what kind of content the block is. The never-invent-numbers rule matters because a rewrite optimized to "sound more specific" is otherwise a direct incentive to fabricate a figure that was never in the source.`,
    exampleOutput: `Q: Can I return an opened product?
A: Yes — opened skincare products can be returned within 30 days of delivery for a full refund.

Q: How long do refunds take to process?
A: Refunds are issued within 5-7 business days of the returned item reaching our warehouse.

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I return an opened product?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — opened skincare products can be returned within 30 days of delivery for a full refund."
      }
    }
  ]
}
\`\`\``,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-25' },
      {
        tool: 'Google AI Overviews',
        version: 'Gemini 3.0 grounding',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: `Initial publish, dated to Google's 7 May 2026 FAQ rich-result retirement so the prompt explains why FAQ schema still matters instead of assuming it earns a visual Google rich result.`,
      },
    ],
    relatedToolSlug: 'faq-schema-generator',
  },
  {
    slug: 'write-a-quotable-paragraph-ai-engines-will-cite',
    category: 'seo-geo',
    title: `Rewrite a vague claim into the exact sentence AI engines quote`,
    description: `Rewrites one vague, adjective-heavy paragraph into a single specific, self-contained, quotable claim — the exact unit AI answer engines lift and attribute.`,
    promptText: `You are a GEO copy editor. Your only job is to turn one vague paragraph into one specific, self-contained, quotable claim — the unit AI answer engines (Perplexity, Google AI Overviews, ChatGPT) actually lift and attribute, as opposed to generic marketing language, which has nothing verifiable to quote.

CLAIM TO MAKE CITABLE: {{topic_or_claim}}

CURRENT DRAFT:
{{vague_paragraph}}

SUPPORTING DATA: {{supporting_data_or_source}}

REWRITE RULES
1. Sentence one states the claim directly, using the concrete number, date, or named entity from the supporting data. If no supporting data was given, write the sentence with a placeholder in [brackets] instead of inventing a figure, and say so.
2. One idea only — no second claim riding along in the same sentence or paragraph.
3. Delete unfalsifiable adjectives ("industry-leading," "best-in-class," "world-class") unless followed immediately by the evidence that earns them.
4. Keep it under 50 words total, so it can be extracted and quoted whole without trimming.
5. The paragraph must make sense with zero surrounding context — no "this," "it," or "our approach" without restating the subject.

OUTPUT
The rewritten paragraph, followed by one line flagging anything you had to bracket because no real data was supplied.`,
    variables: [
      {
        name: 'topic_or_claim',
        description: 'The specific claim or fact you want AI engines to be able to cite.',
        example: 'Our checkout redesign cut cart abandonment',
        required: true,
      },
      {
        name: 'vague_paragraph',
        description:
          'The existing draft — usually marketing prose with no numbers or dates.',
        example:
          'We pride ourselves on delivering industry-leading checkout experiences that customers love.',
        required: true,
      },
      {
        name: 'supporting_data_or_source',
        description: `A real stat, date, or source that backs the claim. Leave blank if you don't have one yet — the rewrite flags where one is needed instead of inventing it.`,
        example:
          'Cart abandonment dropped from 68% to 51% between Feb and May 2026, per internal Shopify analytics',
        required: false,
      },
    ],
    targetTools: ['Perplexity', 'Google AI Overviews', 'ChatGPT', 'Claude'],
    tags: ['citable content', 'geo copywriting', 'specificity', 'quotability'],
    whyItWorks: `Answer engines are far more likely to quote a sentence built around a verifiable number, date, or proper noun, because it reads as a checkable fact rather than an opinion — "industry-leading" has nothing for a citation to point at, while "cart abandonment dropped from 68% to 51% between Feb and May 2026" is a claim someone could go verify. The 50-word ceiling roughly matches how much text an answer engine tends to lift whole into a citation snippet rather than paraphrase. The bracket-instead-of-invent rule exists because a prompt engineered to make text sound more citable is otherwise a direct incentive for a model to fabricate a plausible-sounding stat — the exact failure this whole category has to guard against.`,
    exampleOutput: `Before: "We pride ourselves on delivering industry-leading checkout experiences that customers love."

After: "A checkout redesign cut cart abandonment from 68% to 51% between February and May 2026, per internal Shopify analytics."

No brackets needed — supporting data was supplied and used as given.`,
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: `Initial publish. Added the "bracket instead of invent" rule after early drafts of this prompt fabricated a plausible-sounding stat when none was supplied.`,
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'check-if-chatgpt-and-perplexity-can-see-a-page',
    category: 'seo-geo',
    title: `Check whether ChatGPT and Perplexity can see a specific page right now`,
    description: `A direct test that forces ChatGPT or Perplexity to use their live browsing tool on one exact URL and prove it with a verbatim title/heading quote, instead of answering from stale training data.`,
    promptText: `Use your live browsing or search tool now — do not answer from memory or training data. If you cannot fetch the URL live, say so plainly instead of guessing.

URL TO CHECK: {{page_url}}

Fetch this exact URL right now and report:
1. Can you access it — yes or no. If no, state the exact error (blocked, 404, timeout, JavaScript-only content with nothing in the initial HTML, and so on).
2. Quote the literal page <title> and the first visible heading, verbatim, in quotation marks. This proves a live fetch — a model without real access cannot produce the exact strings.
3. Check each of these expected facts and confirm present / not found / contradicted: {{expected_key_facts}}
4. State today's date as you understand it, so this result isn't confused with a cached or training-data answer from a different point in time.

Do not soften a "not found" into "likely" or "probably" — report exactly what you could and couldn't retrieve.`,
    variables: [
      {
        name: 'page_url',
        description: `The exact URL to test — not the homepage unless that's what you mean.`,
        example: 'https://example.com/pricing',
        required: true,
      },
      {
        name: 'expected_key_facts',
        description:
          '2-3 specific facts that should appear if the page is genuinely being fetched right now (a price, a heading, a date) — comma-separated.',
        example:
          'starting price is $49/month, page has a heading called "Simple, transparent pricing", last updated July 2026',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Perplexity'],
    tags: [
      'crawlability check',
      'live fetch test',
      'chatgpt search',
      'perplexity',
      'hallucination check',
    ],
    whyItWorks: `A chat model without an active browsing/search call will often answer confidently from stale training data rather than admit it can't see the live page — the trap this category most needs to catch. Forcing it to quote the literal <title> and first heading verbatim is a built-in hallucination check: a model that hasn't actually fetched the page cannot reliably produce those exact strings. This also catches failure modes a static homepage crawl can't fully simulate for an in-product search experience — robots.txt blocks on a specific path, JavaScript-only rendering with nothing in the initial HTML, or a noindex tag — on any URL, not just the homepage the automated checker inspects.`,
    exampleOutput: `1. Access: Yes.
2. Title: "Pricing — Example" / First heading: "Simple, transparent pricing"
3. Starting price $49/month: confirmed. Heading text: confirmed, exact match. Last updated July 2026: not found — no visible update date on the page.
4. Today's date (per this fetch): August 2026.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1 (Search)', date: '2026-07-30' },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: `Initial publish, built around the verbatim-title-and-heading check after seeing both engines occasionally answer from stale cached knowledge instead of admitting a fetch failed.`,
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'compare-google-ai-overviews-vs-perplexity-citations',
    category: 'seo-geo',
    title: `Compare how Google AI Overviews and Perplexity cite the same query`,
    description: `Feeds the same query's Google AI Overview and Perplexity answers into a structured side-by-side, showing which sources got cited, how, and what content shape is winning on each engine.`,
    promptText: `You are an AEO analyst comparing citation behavior across answer engines for the identical query.

QUERY: {{target_query}}
DOMAIN BEING TRACKED: {{your_domain}}

GOOGLE AI OVERVIEW RESPONSE:
{{google_ai_overview_text}}

PERPLEXITY RESPONSE:
{{perplexity_answer_text}}

For each response, extract:
- Number of distinct sources cited
- Whether {{your_domain}} appears, and if so, what exactly was quoted or paraphrased from it
- Citation style: inline numbered footnotes, named-source-in-prose, hyperlinked source cards, or no visible attribution
- The structural shape of the most-cited source (definition paragraph, FAQ list, comparison table, ranked listicle, stat-led claim)

OUTPUT
1. A side-by-side comparison table (Google AI Overview vs. Perplexity) across the four points above.
2. One paragraph: which engine currently cites more sources, which content shape is winning on each, and — if {{your_domain}} didn't appear in either — the single most likely structural reason why.`,
    variables: [
      {
        name: 'target_query',
        description: 'The exact search query both engines answered.',
        example: 'best project management software for small teams',
        required: true,
      },
      {
        name: 'your_domain',
        description:
          'Your domain, so the analysis can flag whether you were cited at all.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'google_ai_overview_text',
        description:
          'Paste the full text of the Google AI Overview response, including any visible source links or names.',
        example: '[paste the AI Overview box text and its linked sources]',
        required: true,
      },
      {
        name: 'perplexity_answer_text',
        description:
          'Paste the full Perplexity answer, including its numbered citations.',
        example: '[paste the Perplexity answer with its [1][2][3] citation markers]',
        required: true,
      },
    ],
    targetTools: ['Google AI Overviews', 'Perplexity', 'Claude', 'ChatGPT'],
    tags: ['ai overviews', 'perplexity citations', 'geo comparison', 'citation behavior'],
    whyItWorks: `The AI Overview and organic results below it converge on the same underlying format — short headers, numbered claims, structured copy — but the two engines still diverge sharply in how they attribute it. Perplexity's transparency model shows near-inline numbered citations for almost every sentence, while Google AI Overviews synthesizes more broadly and cites more selectively, leaning on sources it already trusts through the structured-data and authority signals classic Search already relies on. A page can be heavily cited by one engine and completely absent from the other for the same query, which is why diagnosing which engine's specific pattern is missing is more actionable than a single generic "get cited more" goal.`,
    exampleOutput: `| | Google AI Overview | Perplexity |
|---|---|---|
| Sources cited | 3 | 7 |
| example.com present | No | Yes — one paraphrased sentence, citation [4] |
| Citation style | Named-source-in-prose, no numbering | Inline numbered footnotes on nearly every sentence |
| Winning content shape | Comparison table on a competitor's page | Stat-led claim on example.com |

Perplexity currently cites far more sources and rewards specific, stat-led sentences; Google AI Overviews is citing fewer, more structurally "complete" pages (comparison tables) — example.com's missing comparison table is the likely gap on that engine specifically.`,
    verifiedAgainst: [
      {
        tool: 'Google AI Overviews',
        version: 'Gemini 3.0 grounding',
        date: '2026-08-01',
      },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: `Initial publish. Framed as a paste-both-answers analysis rather than a live dual-fetch, since no single assistant can currently query both engines directly inside one session.`,
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'rewrite-a-page-section-to-be-more-ai-citable',
    category: 'seo-geo',
    title: `Rewrite an existing page section to get cited by AI answers`,
    description: `Rewrites an existing page section into answer-first, single-claim, specific copy without inventing any new facts — plus a change list explaining which citability rule each edit satisfies.`,
    promptText: `You are a GEO editor rewriting existing copy to be more likely to be cited by AI answer engines, without changing any facts.

TOPIC: {{page_topic}}
QUESTION THIS SECTION SHOULD ANSWER: {{primary_keyword_or_question}}

EXISTING COPY:
{{existing_copy}}

REWRITE RULES
- If a question is given, the very first sentence of the rewrite must directly answer it.
- Split any sentence carrying two or more claims into separate sentences — one claim each.
- Where the existing copy already contains a number, date, or named specific, keep it and move it earlier in the sentence. Never add a number, date, or stat that wasn't already in the source — flag it as [needs a real figure] instead.
- Replace vague qualifiers with the concrete detail already present in the source, if any exists.
- If the section explains a concept, open with a one-sentence definition before any elaboration.

OUTPUT
1. The rewritten section.
2. A short change list: for each change, one line naming what changed and which citability rule it satisfies (answer-first / one-claim-per-sentence / specificity / self-contained).`,
    variables: [
      {
        name: 'existing_copy',
        description:
          'The actual paragraph(s) or section you want rewritten — paste as-is.',
        example: '[paste the section of page copy you want made more citable]',
        required: true,
      },
      {
        name: 'page_topic',
        description: 'What this section is about.',
        example: 'Shipping times for international orders',
        required: true,
      },
      {
        name: 'primary_keyword_or_question',
        description:
          'The specific question this section should directly answer, if there is one.',
        example: 'How long does international shipping take?',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Google AI Overviews'],
    tags: ['content rewrite', 'answer-first', 'geo editing', 'citability'],
    whyItWorks: `Answer-first structure and one-claim-per-sentence copy match how answer engines actually extract a citable chunk — grabbing the first sentence of a section or paragraph as the candidate quote, so that sentence has to be the direct answer, not a preamble. The never-fabricate rule matters more here than almost anywhere else in this category: a rewrite task explicitly optimizing for "sounds more specific" is a direct incentive for a model to invent a supporting number, so the prompt flags gaps instead of filling them. Surfacing a per-change reasoning list, rather than a silent rewrite, matches the site's own review-before-publish discipline — a rewrite is only trustworthy to ship once a human can see exactly why each sentence changed.`,
    exampleOutput: `Rewritten: "International orders arrive in 7-10 business days. Customs processing in the destination country can add [needs a real figure] on top of shipping time."

Change list:
- Moved "7-10 business days" to the front of sentence one — answer-first.
- Split the original two-claim sentence (shipping + customs) into two sentences — one-claim-per-sentence.
- Flagged customs delay instead of guessing a number — specificity without fabrication.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-08-03' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: `Initial publish, with the "flag instead of fabricate" rule carried over from the citable-paragraph prompt — rewriting for citability is exactly the task most likely to tempt a model into inventing a supporting number.`,
      },
    ],
  },
  {
    slug: 'audit-a-competitors-ai-visibility-gap',
    category: 'seo-geo',
    title: `Audit a competitor's AI visibility to find your citation gap`,
    description: `Compares your AI-crawler access, llms.txt, and answer-engine citation presence against a named competitor on a shared topic, producing three ranked fixes instead of a vague sense that they're winning.`,
    promptText: `You are a competitive AEO analyst with live browsing/search access. Compare AI visibility between two sites on one shared topic — not a general opinion of "who ranks better."

YOUR DOMAIN: {{your_domain}}
COMPETITOR: {{competitor_domain}}
SHARED TOPIC/QUERY: {{shared_topic_or_query}}

STEPS
1. Fetch both domains' /robots.txt. For each, check whether GPTBot, PerplexityBot, ClaudeBot, and Google-Extended are allowed or blocked, and note any difference between the two sites.
2. Check both domains for a public /llms.txt.
3. Actually search or ask about "{{shared_topic_or_query}}" using your live tool, and report which domain (if either) gets cited, and how — quoted stat, linked source, named but not quoted, or not mentioned at all.
4. Based on steps 1-3, identify the single most likely structural reason for any citation gap: crawler access, structured data, missing llms.txt, page freshness, or content specificity.

OUTPUT
1. A crawler-access table for both domains.
2. The citation-presence result from step 3.
3. Three ranked fixes for {{your_domain}}, ordered by how much of the gap each is likely to close.`,
    variables: [
      {
        name: 'your_domain',
        description: 'Your own domain.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'competitor_domain',
        description: 'The competitor domain to compare against.',
        example: 'competitor.com',
        required: true,
      },
      {
        name: 'shared_topic_or_query',
        description:
          'A specific question or topic you both plausibly compete to get cited for.',
        example: 'how to calculate customer acquisition cost',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: ['competitor audit', 'ai visibility', 'geo gap analysis', 'crawler access'],
    whyItWorks: `This mirrors the AI Visibility Checker's own scoring weights — crawler access 40%, structured data 20%, page basics 20%, llms.txt 10%, sitemap 10% — so a competitor gap almost always traces back to one of exactly five buckets, turning "they show up more" into one concrete, fixable difference instead of a vague impression. It also acts on the tool's own stated finding that classic Google ranking and AI-crawler access are decided by entirely separate bot rules: a competitor can rank behind you in Google Search while still being the one AI engines cite, because their robots.txt treats GPTBot or PerplexityBot differently than yours does — a gap invisible to any classic rank tracker.`,
    exampleOutput: `| | example.com | competitor.com |
|---|---|---|
| GPTBot | Allowed | Allowed |
| PerplexityBot | Blocked | Allowed |
| ClaudeBot | Allowed | Allowed |
| Google-Extended | Allowed | Allowed |
| /llms.txt | Not found | Found |

Citation result: competitor.com was cited by Perplexity with a quoted definition; example.com was not mentioned.

Ranked fixes: 1) unblock PerplexityBot, 2) publish /llms.txt, 3) add a definition-style opening sentence matching the cited competitor pattern.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-08-04' },
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: `Initial publish. Anchored the five-bucket framing to the AI Visibility Checker's own scoring weights so the audit produces the same vocabulary the tool's report uses.`,
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'turn-your-ai-visibility-score-into-a-fix-plan',
    category: 'seo-geo',
    title: `Turn your AI Visibility Checker score into a 30-day fix plan`,
    description: `Turns a raw AI Visibility Checker score and its failed checks into a plain-English explanation and a ranked 30-day fix plan, ordered by score points recovered per unit of effort.`,
    promptText: `You are an AEO consultant. A visitor ran the AI Visibility Checker and got a score with specific failed checks — turn that into a plan they can actually execute, not a restatement of the number.

SCORE: {{visibility_score}} / 100
SITE TYPE: {{site_type}}

FAILED CHECKS:
{{failed_checks}}

The score is weighted: crawler access 40%, structured data 20%, page basics 20%, llms.txt 10%, sitemap 10%.

TASK
1. Identify which weighted bucket above is most responsible for the current score, based on the failed checks given.
2. For every failed check listed, give one plain-English sentence on what it actually means, and the concrete fix — not "improve SEO," the literal change (for example: "remove Disallow: / from the GPTBot group in robots.txt").
3. Produce a ranked 30-day plan, ordering fixes by estimated score points recovered versus how much work each takes.
4. Close with one honest sentence: a higher score means the site is eligible to be cited by AI engines, not guaranteed to be — content quality and topical authority still decide the rest.`,
    variables: [
      {
        name: 'visibility_score',
        description: 'The 0-100 score the AI Visibility Checker returned.',
        example: '54',
        required: true,
      },
      {
        name: 'failed_checks',
        description:
          'Paste the specific flagged check cards or findings text from your report, not just the score.',
        example:
          'GPTBot: Blocked (Disallow: / under User-agent: GPTBot). No /llms.txt found. FAQPage schema missing on homepage.',
        required: true,
      },
      {
        name: 'site_type',
        description: 'What kind of site this is, for context on which fixes matter most.',
        example: 'B2B SaaS marketing site',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'ai visibility checker',
      'geo fix plan',
      'score interpretation',
      'prioritization',
    ],
    whyItWorks: `The prompt reasons directly over the checker's own published weighting (40/20/20/10/10) instead of duplicating or second-guessing its scoring logic, so the fix plan uses the same vocabulary as the report itself. Ordering fixes by score points recovered per unit of effort converts a diagnostic list into an actual work order a non-technical site owner can hand to a developer. The closing caveat is load-bearing, not boilerplate — it's the tool's own stated limitation (eligible to be cited, not guaranteed to be), and repeating it here stops a rising score from being mistaken for a guarantee the fix plan can't actually make.`,
    exampleOutput: `Most responsible bucket: crawler access (40% weight) — GPTBot is fully blocked, which alone caps the score well below what structured-data and llms.txt fixes could recover.

1. Remove \`Disallow: /\` from the \`User-agent: GPTBot\` group in robots.txt — recovers the largest single chunk of the crawler-access weight, ~15 minutes of work.
2. Publish /llms.txt listing your top 5 pages — recovers the full llms.txt weight, under an hour.
3. Add FAQPage schema to the homepage — recovers structured-data points, half a day including review.

A higher score means AI engines are able to fetch and parse the site, not that they will choose to cite it — that still depends on content quality and topical authority.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: `Initial publish, built directly around the checker's published 40/20/20/10/10 weighting so the fix plan uses the same scoring language as the report itself.`,
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'content-brief-from-topic-with-search-intent',
    category: 'seo-geo',
    title: 'Turn a topic into a content brief with search-intent notes',
    description:
      'Feed in a target keyword and your audience, and get a structured content brief back — intent classification, the SERP features to design around, a heading outline mapped to what each section needs to do, and the E-E-A-T signals worth including — before you write a single sentence.',
    promptText: `Act as a senior SEO content strategist. I need a content brief for a page targeting: {{target_keyword}}

Audience: {{audience}}
Business context: {{business_context}}
Target length: {{word_count_target}}

Do this in order:

1. Classify search intent. State whether this query is informational, commercial-investigation, transactional, or navigational, and justify it in one sentence based on what kind of page would actually satisfy it.
2. List the SERP features likely present (featured snippet, People Also Ask, AI Overview, video carousel, local pack, shopping results) and what each implies about the format the winning page needs.
3. Build a heading outline (H1-H3) that answers the query completely at the depth this intent expects — not padded, not thin. For every H2, note in brackets what job that section does for the reader, e.g. "[addresses the objection that stops conversion]".
4. List the sub-questions a genuinely thorough page would answer that the searcher hasn't typed but is implicitly asking — the unstated-intent layer.
5. Flag the E-E-A-T signals worth including: what experience, credentials, data, or first-hand specifics would make this page read as more trustworthy than a rewrite of the top 10 results.
6. Name one differentiation angle — something the top-ranking pages are likely missing that my business context makes uniquely easy to include.

Output as a structured brief with clear section headers, not prose paragraphs.`,
    variables: [
      {
        name: 'target_keyword',
        description: 'The primary keyword or topic you want the page to rank for',
        example: 'best project management software for agencies',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who the page is written for',
        example: 'marketing agency owners with 5-20 employees',
        required: true,
      },
      {
        name: 'business_context',
        description: 'What you sell, or the business goal this page serves',
        example: 'we sell a project management SaaS with a 14-day free trial',
        required: false,
      },
      {
        name: 'word_count_target',
        description: 'A rough length target, if you have one',
        example: '1,800-2,200 words',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    tags: [
      'content brief',
      'search intent',
      'content strategy',
      'on-page seo',
      'outline',
    ],
    whyItWorks:
      'Intent classification comes first because Google ranks primarily on satisfying intent, not keyword match — a page shaped for the wrong intent (a listicle where the SERP wants a calculator) rarely breaks into the top results no matter how well-written it is. Naming the likely SERP features turns that classification into a concrete format decision instead of a guess. The unstated-intent layer and E-E-A-T checklist both map to the same target: Google’s Quality Rater Guidelines explicitly reward depth, first-hand expertise and trust signals over content that just restates the top 10 in different words — briefing for those before writing is cheaper than discovering the gap after a page fails to rank.',
    exampleOutput: `Intent: Commercial-investigation. The query implies comparing options before buying, not learning a concept or navigating to a brand.

Likely SERP features: featured snippet (a definition-style answer), People Also Ask, possibly an AI Overview summarizing 3-4 tools by price tier.

Outline:
H1: Best Project Management Software for Agencies in 2026
H2: What agencies actually need that generic PM tools miss [sets the evaluation criteria before naming tools]
H2: Top picks by team size [addresses "which one for me," the real decision point]
H2: Pricing comparison table [SERP feature match — searchers screenshot these]
H2: Common switching mistakes [E-E-A-T: first-hand migration experience]

Unstated questions: "Will my client see this tool?", "What happens to my data if I cancel?"

Differentiation angle: most competitor pages are generic top-10 lists; your 14-day trial context lets you honestly note which tools have the shortest real onboarding time — something reviewers who haven't run an agency can't credibly claim.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-06' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against ChatGPT and Gemini.',
      },
      {
        date: '2026-08-06',
        note: 'Re-verified against Claude Sonnet 5; added the explicit "don’t pad, don’t skip depth" instruction after a test run over-trimmed a commercial-investigation brief.',
      },
    ],
  },
  {
    slug: 'mine-real-faq-questions-for-schema',
    category: 'seo-geo',
    title: 'Mine the real questions searchers ask, ready for FAQ schema',
    description:
      'Generate the actual long-tail questions people type into search, forums and AI chatbots about your topic — tagged by source, flagged for intent, and deduplicated — so the strongest ones can go straight into the FAQ Schema Generator.',
    promptText: `Act as a search-behavior researcher, not a generic FAQ writer. Topic: {{topic}}
Who's asking: {{audience}}
Already covered — don't repeat these: {{existing_questions}}

Generate 20 real questions this audience actually asks about this topic, pulling from these distinct phrasing sources:

1. "People Also Ask" style — the direct, short questions Google surfaces (What/How/Can/Does/Is).
2. Forum/community phrasing — how someone would type this into Reddit or a community forum, including hesitations and edge cases ("is it worth it if...", "what happens when...").
3. Comparison and decision questions — "X vs Y", "when should I", "is it better to."
4. Post-purchase/troubleshooting questions — what someone asks after they already have the thing and something isn't working as expected.
5. Cost, timeline and risk questions — the practical questions that stall a decision.

For each question:
- Write it exactly as a real person would type it, not formalized.
- Tag which source category it came from (1-5 above).
- Mark [HIGH INTENT] on the 5 questions most likely to be the actual reason someone abandons the page without an answer.

Then deduplicate: merge any two questions a single FAQ answer would satisfy, and tell me which ones you merged and why.`,
    variables: [
      {
        name: 'topic',
        description: 'The product, service or subject the FAQ section covers',
        example: 'installing a tankless water heater',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who is asking — this changes which questions actually surface',
        example: 'homeowners doing it themselves for the first time',
        required: true,
      },
      {
        name: 'existing_questions',
        description: "Questions already on your page, so the model doesn't repeat them",
        example: 'How much does a tankless water heater cost?; Do I need a permit?',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'faq schema',
      'question research',
      'people also ask',
      'long-tail keywords',
      'structured data',
    ],
    whyItWorks:
      'FAQPage schema and AI answer engines both parse content as discrete question-answer pairs, so a FAQ section built from real search phrasing has a much better chance of matching what a person or model actually queries than one built from a writer’s own vocabulary. Pulling from five distinct phrasing sources — PAA syntax, forum hesitations, comparison framing, post-purchase troubleshooting, and cost/risk questions — surfaces the "unstated but implied" questions a single brainstorm misses, since each source encodes a different stage of the buying or research journey. The deduplication pass matters mechanically, not just for tidiness: the FAQ Schema Generator flags near-duplicate questions, and Google’s own guidance discourages FAQ content that pads a page with restated variants rather than genuinely distinct answers.',
    exampleOutput: `1. "how much does a tankless water heater cost installed" — [source: 5] [HIGH INTENT]
2. "is a tankless water heater worth it for a family of 4" — [source: 2] [HIGH INTENT]
3. "tankless vs tank water heater which is better" — [source: 3]
4. "why is my tankless water heater not getting hot enough" — [source: 4]
5. "do i need a permit to install a tankless water heater myself" — [source: 1] [HIGH INTENT]
...
Merged: #1 and "what's the total cost including installation" — both resolved by one cost-breakdown answer.`,
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-30' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Perplexity for live search-behavior grounding.',
      },
      {
        date: '2026-08-05',
        note: 'Re-verified against Claude Sonnet 5; added the [HIGH INTENT] tagging step after early drafts buried the most decision-blocking questions in the middle of the list.',
      },
    ],
    relatedToolSlug: 'faq-schema-generator',
  },
  {
    slug: 'choose-the-right-schema-org-type',
    category: 'seo-geo',
    title: 'Choose the right schema.org type before you mark up a page',
    description:
      'Describe a page and get a reasoned recommendation for which schema.org type — and which nested types — genuinely fits it, plus a clear split between the properties Google actually requires for rich-result eligibility and the ones that are just decorative schema.org detail.',
    promptText: `Act as a structured-data specialist who has memorized Google's supported rich-result types, not just the full schema.org vocabulary. Page: {{page_url_or_description}}
My current guess: {{page_type_guess}}

1. Recommend the primary schema.org type for this page. If more than one type is plausible, name the runner-up and explain the specific detail about this page that settles it — for example "Course, not Product — nothing is purchased and taken home; the deliverable is instruction."
2. List the nested types required — does the primary type need a Person, Organization, Offer or AggregateRating nested inside it, and where.
3. Separate "required for Google eligibility" from "valid schema.org but cosmetic." Tell me exactly which properties are mandatory for this type to even be considered for a rich result, versus which are optional schema.org properties that help disambiguation but change nothing visually.
4. Flag anything on this page that would make the markup invalid if I'm not careful: content that exists only in the schema and not visibly on the page, price or availability that could go stale, or a type Google has restricted to certain site categories — the way FAQPage and HowTo eligibility were both restricted after 2023.
5. Tell me if this page should carry more than one schema type at once (for example Article + BreadcrumbList + Organization) and how they should nest or sit side by side.

Give me a decision, not a survey of every possible type.`,
    variables: [
      {
        name: 'page_url_or_description',
        description: "The URL, or a description of the page's content and purpose",
        example:
          'a page listing our 6-week UX bootcamp: price, dates, instructor bio and a syllabus',
        required: true,
      },
      {
        name: 'page_type_guess',
        description:
          'Your best guess at the type, if you have one — helps the model correct you rather than start blind',
        example: "I was going to use Product, but it's a course, not a physical item",
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'schema markup',
      'structured data',
      'json-ld',
      'rich results',
      'technical seo',
    ],
    whyItWorks:
      'Schema.org itself is a huge, permissive vocabulary, but Google Rich Results only rewards a specific supported subset with a required-property checklist — picking a plausible-sounding but wrong type (or the right type missing a nested Offer or AggregateRating) produces markup that validates against schema.org yet is functionally invisible in search. The eligibility-vs-cosmetic split matters because most generic advice conflates "valid schema" with "eligible for a rich result," which are different bars entirely. The staleness and visibility warnings exist because Google’s structured-data guidelines require markup to match what a user actually sees on the page — a mismatch (or schema-only content) risks a manual action, not just a missed rich result, so it’s worth catching before publishing rather than after a Search Console warning.',
    exampleOutput: `Primary type: Course (not Product — nothing ships or is owned; the deliverable is instruction and a completion outcome).

Nested types required: Organization (provider), and if you show pricing, Offer nested under hasCourseInstance.

Required for eligibility: name, description, provider. Cosmetic-only: educationalCredentialAwarded, coursePrerequisites — helpful for disambiguation, no visual effect.

Watch for: your syllabus PDF isn't rendered as page text — if you mark up its contents in schema without showing them visibly, that's a schema/visible-content mismatch.

Also add: BreadcrumbList alongside Course — no conflict, common pairing.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-04' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-04',
        note: 'Re-verified against Claude Sonnet 5; added the explicit eligibility-vs-cosmetic property split after a draft answer buried required properties inside a long undifferentiated list.',
      },
    ],
    relatedToolSlug: 'schema-markup-generator',
  },
  {
    slug: 'cluster-keywords-into-content-groups',
    category: 'seo-geo',
    title: 'Turn a messy keyword list into intent-based content clusters',
    description:
      'Paste a raw keyword export and get it grouped into distinct content clusters by search intent, not shared words — so you know how many pages to actually build, which keywords would cannibalize each other, and which cluster is the pillar.',
    promptText: `Act as an SEO information architect. Site context: {{site_context}}

Raw keyword list:
{{keyword_list}}

1. Group these into distinct content clusters, where a cluster means keywords one single page could realistically satisfy without cannibalizing another page on the same site. Use search intent as the primary grouping signal, not shared words — "crm pricing" and "crm software comparison" look similar but serve different intents and should NOT be forced into one cluster unless you can justify it.
2. Name each cluster with the page title it implies — outcome-first, not just the seed keyword.
3. For each cluster, state the dominant intent (informational / commercial-investigation / transactional) and the single keyword that should be the page's primary target. The rest become secondary targets the page ranks for through topical depth, not separate H1s.
4. Flag cannibalization risks: any two keywords in my list that look like they'd want the same page, where I should pick one primary target and fold the other in rather than building two competing pages.
5. Flag anything you can't confidently cluster — ambiguous keywords where intent depends on the searcher's stage — and tell me what additional context would resolve it.
6. Suggest the pillar-cluster hierarchy: if any clusters are naturally subtopics of a broader pillar page, name the pillar.

Output as a table: Cluster name | Primary keyword | Secondary keywords | Intent | Suggested page type.`,
    variables: [
      {
        name: 'keyword_list',
        description:
          'The raw keyword list, one per line, with search volume if you have it',
        example:
          'best crm for small business (2400)\ncrm software comparison (1900)\nfree crm for startups (1600)\ncrm pricing (880)\nhow to choose a crm (720)',
        required: true,
      },
      {
        name: 'site_context',
        description:
          "What the site/business is, so clusters map to pages you'd actually build",
        example: 'we sell CRM software aimed at small teams under 20 people',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'keyword clustering',
      'keyword research',
      'content architecture',
      'topical authority',
      'search intent',
    ],
    whyItWorks:
      'Clustering by intent instead of shared words is the difference between building a site architecture and building a pile of similar pages — two pages chasing the same intent split ranking signals between them (cannibalization) instead of compounding into one authoritative result. The pillar-cluster structure this produces mirrors how search engines increasingly reward topical depth: a hub page surrounded by well-linked subtopic pages signals comprehensive coverage of a subject in a way isolated thin pages don’t, because semantically related queries get treated as one intent cluster even when the phrasing differs. Explicitly flagging ambiguous keywords instead of forcing a confident-sounding cluster prevents the most common failure mode in DIY keyword clustering: architecture decisions made on a guess that only surface as a problem once two pages are already live and competing.',
    exampleOutput: `Cluster name | Primary keyword | Secondary keywords | Intent | Suggested page type
"Best CRM for Small Business" | best crm for small business | free crm for startups | Commercial-investigation | Comparison/listicle
"CRM Pricing Explained" | crm pricing | — | Commercial-investigation | Pricing breakdown page

Cannibalization risk: "crm software comparison" and "best crm for small business" want the same page — merge, pick "best crm for small business" as primary.

Pillar: "CRM Pricing Explained" is a natural subtopic of "Best CRM for Small Business" — link it as supporting content, not a competing target.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-18' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against ChatGPT and Gemini.',
      },
    ],
  },
  {
    slug: 'content-gap-analysis-vs-top-ranking-pages',
    category: 'seo-geo',
    title: 'Find the content gaps between your page and what’s outranking it',
    description:
      'Paste your page next to the 2-3 pages currently beating it, and get a specific, prioritized list of the subtopics, data points and structural elements they cover that you don’t — not a generic "add more content" verdict.',
    promptText: `Act as a content auditor doing a competitive gap analysis, not a generic rewrite. Target keyword: {{target_keyword}}

My current page:
{{your_content}}

Pages currently outranking me:
{{competitor_content}}

1. List subtopics or questions the competitors cover that my page doesn't. Be specific — not "more detail," but "they include a pricing range table broken down by project size; I only mention 'it depends.'"
2. List anything unique my page already covers that none of the competitors do — don't let me cut it while closing gaps.
3. Compare structural elements: do competitors use comparison tables, FAQs, calculators, real examples, downloadable templates, or original data and screenshots that mine lacks?
4. Compare depth of expertise signals — named authors or credentials, first-hand case studies, specific numbers versus vague claims, citations to sources — and tell me honestly whether my page reads as less authoritative, and why.
5. Identify redundant or outdated sections in my page that add length without adding value. Cutting these matters as much as adding gaps.
6. Prioritize the gaps: which 3 changes would most plausibly move the needle, versus which are minor polish.

Do not suggest padding with generic filler. Every gap you flag must point to a specific thing to add, backed by what a competitor page actually does.`,
    variables: [
      {
        name: 'target_keyword',
        description: "The keyword you're trying to rank for",
        example: 'how to price a website redesign',
        required: true,
      },
      {
        name: 'your_content',
        description:
          "Your page's current content — paste the full text or a close summary",
        example: '[paste your page text here]',
        required: true,
      },
      {
        name: 'competitor_content',
        description:
          'The content of 2-3 pages currently outranking you, labeled by source',
        example: 'Competitor A: [text]\nCompetitor B: [text]',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: [
      'content gap analysis',
      'competitor analysis',
      'content audit',
      'topical coverage',
      'on-page seo',
    ],
    whyItWorks:
      'A page-by-page gap analysis targets the same thing search engines’ relevance and topical-completeness models effectively reward: comprehensive coverage of a subject rather than a shorter, thinner treatment of it. The structural-elements check matters separately from raw text coverage, because tables, calculators and original data also drive on-page engagement — a signal that reinforces rankings even when it isn’t itself the ranking factor. The expertise-depth comparison is a direct proxy for Google’s Quality Rater Guidelines, which explicitly instruct raters to weigh first-hand experience and credentials against generic, uncredited claims. Explicitly protecting what your page already does better — step 2 — matters because a blind "close every gap" pass tends to dilute a page’s actual differentiation in the process of chasing parity with competitors.',
    exampleOutput: `Gaps: Competitor A includes a cost-by-project-size table (small/medium/large agency); your page only states "costs vary." Competitor B cites a named senior designer with 8 years' experience; your page has no byline.

Unique to you: your page is the only one that addresses redesign cost for nonprofits specifically — keep this.

Priority: (1) add the pricing table, (2) add a named author with credentials, (3) cut the 200-word history-of-web-design section, which adds length with no ranking or reader value.`,
    verifiedAgainst: [
      { tool: 'Perplexity', version: 'Sonar Pro', date: '2026-07-27' },
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Perplexity.',
      },
      {
        date: '2026-08-03',
        note: "Re-verified against Claude Sonnet 5; added step 2 (protect existing unique content) after a test run recommended cutting a page's only genuine differentiator.",
      },
    ],
  },
  {
    slug: 'internal-linking-suggestions-for-a-new-page',
    category: 'seo-geo',
    title: 'Generate internal-linking suggestions for a new page',
    description:
      'Give the model your new page’s topic and a list of your existing URLs, and get specific internal-link suggestions back — which pages should link to the new one, with what anchor text, which of the new page’s sections should link out, and whether it’s at risk of becoming an orphan.',
    promptText: `Act as an information architect optimizing internal link equity, not just adding random links. New page: {{new_page}}

Existing pages on the site:
{{existing_pages}}

1. Which existing pages should link TO the new page, and why? Prioritize pages that are topically close and already carry meaningful traffic or authority — a high-traffic blog post is worth more as a linking source than an orphaned one.
2. Suggest the exact anchor text for each of those links. Descriptive and topically relevant, never "click here" or a bare URL, and varied enough across sources that it doesn't read as manipulated.
3. Which sections of the new page should link OUT to existing pages? Map specific paragraphs or subtopics in the new page to the most relevant existing page — not a generic "related posts" dump.
4. Flag any existing page that's a natural pillar for this new page to feed into, versus pages that are more like lateral siblings.
5. Flag if the new page risks becoming an orphan — if too few existing pages are topically close enough to justify a natural link, which usually means it needs a home in the nav or category structure, not just inline links.

Output as a table: Source page | Anchor text | Links to | Reason.`,
    variables: [
      {
        name: 'new_page',
        description: "The new page's title, target keyword, and a one-line summary",
        example:
          'Title: "How Much Does a Website Redesign Cost in 2026?" — target keyword: website redesign cost — summarizes pricing ranges by project size',
        required: true,
      },
      {
        name: 'existing_pages',
        description:
          'A list of your existing page titles/URLs, ideally with a one-line topic note each',
        example:
          '/services/web-development — service overview page\n/blog/signs-you-need-a-website-redesign — blog post\n/pricing — general pricing page',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'internal linking',
      'site architecture',
      'anchor text',
      'crawl depth',
      'technical seo',
    ],
    whyItWorks:
      'Internal links distribute authority from a site’s stronger pages to newer or weaker ones — a new page linked from a high-traffic post inherits some of that page’s crawl priority and topical signal, while an unlinked page can sit un-crawled or under-indexed regardless of how good the content is. Descriptive, varied anchor text gives search engines an explicit topical signal about the destination page that goes beyond what the destination page says about itself, which is why generic anchors like "click here" waste the opportunity entirely. The orphan-risk check exists because it’s a genuinely common and easy-to-miss failure mode: a page with no natural topical siblings to link from needs a structural fix (nav, category, hub page) rather than more inline links forced into unrelated pages.',
    exampleOutput: `Source page | Anchor text | Links to | Reason
/blog/signs-you-need-a-website-redesign | "what a redesign typically costs" | new page | High-traffic post, directly upstream in the reader's decision path
/services/web-development | "see current redesign pricing" | new page | Service page already discusses redesign; natural pillar

Orphan risk: none — /pricing and the service page both provide strong natural anchors.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-19' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against ChatGPT and Gemini.',
      },
    ],
  },
  {
    slug: 'write-meta-descriptions-with-character-discipline',
    category: 'seo-geo',
    title: 'Write meta descriptions that earn the click and don’t get truncated',
    description:
      'Generate 3 meta description variants for a page, each fitted to real snippet length limits, front-loaded with the target keyword, built around one specific differentiator instead of a generic claim, and reported with an exact character count next to each.',
    promptText: `Act as an SEO copywriter who treats the character limit as a real design constraint, not a suggestion. Page topic: {{page_topic}}
The one specific reason to click: {{unique_value}}
Tone: {{cta_style}}

Write 3 meta description variants. For each one:

1. Keep it between 120-155 characters. Google's snippet truncates on pixel width, not a fixed character count, but rendering studies put the safe zone there for most devices — don't write anything you'd have to trim later.
2. Front-load the target keyword or a close variant within the first 60 characters — that's the part most reliably shown even on narrower mobile snippets.
3. Include the specific differentiator from {{unique_value}}, not a generic claim. "Comprehensive guide" and "everything you need to know" are banned phrases.
4. End with a concrete reason to click, not a vague CTA. State what the reader gets, not "learn more."
5. Report the exact character count next to each variant.

After the 3 variants, tell me which one you'd ship as the default, and name the specific generic phrase you deliberately avoided reusing — the kind that shows up verbatim across half of any given SERP.`,
    variables: [
      {
        name: 'page_topic',
        description: 'What the page is about and its target keyword',
        example: 'a comparison page: "Squarespace vs Wix for small business websites"',
        required: true,
      },
      {
        name: 'unique_value',
        description:
          "The one specific reason to click THIS result over a competitor's — a number, a differentiator, an outcome",
        example:
          'we tested load speed and pricing on both platforms ourselves, June 2026',
        required: true,
      },
      {
        name: 'cta_style',
        description: 'The tone or CTA style you want',
        example: 'direct and practical, no hype',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['meta description', 'ctr optimization', 'serp snippet', 'on-page seo'],
    whyItWorks:
      'A meta description isn’t a ranking factor, but it is the single biggest lever over organic click-through rate on a result you already rank for, and CTR feeds back into how a page performs relative to its position over time. The 120-155 character discipline exists because Google truncates on rendered pixel width, not character count — writing to a safe zone instead of a hard limit avoids the common failure of a description that measures fine in a text editor but gets cut mid-word on a phone. Front-loading the keyword matters because Google frequently rewrites or shortens descriptions and only bolds matched terms within whatever it actually displays. Banning generic phrases directly targets a real, observable problem: a large share of any SERP’s snippets are functionally interchangeable, so a genuinely specific differentiator is often the only thing left that can move a click decision.',
    exampleOutput: `1. "Squarespace vs Wix (2026): we tested load speed and pricing ourselves so you don't have to guess." — 97 characters
2. "Squarespace vs Wix for small business: real speed tests, real pricing, tested June 2026." — 90 characters
3. "We ran Squarespace and Wix side by side in June 2026 — here's which one loads faster and costs less." — 102 characters

Ship: #1 — leads with the comparison keyword and the specific "tested ourselves" differentiator in the first 60 characters.
Avoided: "everything you need to know about choosing a website builder."`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-02' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against ChatGPT.',
      },
      {
        date: '2026-08-02',
        note: 'Re-verified against Claude Sonnet 5; tightened the safe character range from a flat 155-character rule to 120-155 after checking current mobile snippet rendering.',
      },
    ],
    relatedToolSlug: 'word-counter',
  },
  {
    slug: 'rewrite-paragraph-to-be-ai-overview-citable',
    category: 'seo-geo',
    title: 'Rewrite a paragraph so an AI Overview can actually cite it',
    description:
      'Take a paragraph that’s accurate but hard to extract, and restructure it into a self-contained, quotable passage — the shape AI Overviews, featured snippets and voice answers actually pull from — without turning your copy into a robotic list. Focused on on-page structure, not GEO strategy.',
    promptText: `Act as an editor optimizing for passage-level extraction, not just readability. Target question this paragraph should answer if lifted on its own: {{target_question}}

Current paragraph:
{{paragraph}}

1. Rewrite it so the first sentence alone would fully answer {{target_question}} if nothing else in the paragraph were read. Lead with the direct answer — a number, a named factor, a clear yes or no — not a throat-clearing setup sentence.
2. Remove vague hedging that carries no extractable information: "it depends," "a lot of factors," "generally speaking." Replace each with the actual specific factor or number it was standing in for. If you genuinely don't have the specific number, say so instead of inventing one.
3. Keep it one self-contained unit — a passage that makes sense with zero surrounding context, since that's what gets pulled into an AI Overview or a voice answer, not a sentence that only makes sense after the sentence before it.
4. Preserve natural prose. This should not read as a robotic list or bullet-fragment; it should still sound like a person wrote it, just a person who leads with the answer.
5. Show both versions side by side, and in one sentence name the specific vague phrase you eliminated and what concrete claim replaced it.

If the original paragraph doesn't actually contain a specific answer to extract, tell me that directly instead of fabricating a number or fact — flag it as a content gap, not a rewrite problem.`,
    variables: [
      {
        name: 'paragraph',
        description: 'The paragraph you want restructured, as currently written',
        example:
          'When it comes to pricing, there are a lot of factors that go into it, and it really depends on your specific situation, but generally speaking most agencies will find that costs can vary quite a bit depending on scope.',
        required: true,
      },
      {
        name: 'target_question',
        description:
          'The specific question this paragraph should answer if extracted on its own',
        example: 'How much does a website redesign cost?',
        required: true,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'ai overview',
      'answer engine optimization',
      'passage extraction',
      'on-page structure',
      'featured snippets',
    ],
    whyItWorks:
      'AI Overviews and classic featured snippets both work by extracting a short, self-contained passage rather than reading a full page — leading with the direct answer mirrors the inverted-pyramid structure that passage-ranking systems already reward, so the same rewrite helps both surfaces at once, not just AI citation specifically. Removing hedging language matters because extraction systems preferentially select declarative, specific statements over ones that defer the real answer to context the extraction step may not carry forward. This is deliberately scoped to sentence-level, on-page structure rather than a broader GEO strategy — it’s the same discipline that makes a paragraph eligible for a rich result or a snippet, just applied at the sentence level. The instruction to flag missing specifics rather than invent them matters because AI Overview citation is exactly the surface where a confidently wrong number gets repeated at scale — a bad rewrite here doesn’t just fail to get cited, it actively misinforms whoever reads the citation.',
    exampleOutput: `Before: "When it comes to pricing, there are a lot of factors that go into it, and it really depends on your specific situation, but generally speaking most agencies will find that costs can vary quite a bit depending on scope."

After: "A website redesign typically costs $3,000-$15,000 for a small business site, with the biggest swing factor being how many custom page templates you need versus reusing a theme. Larger sites with e-commerce or custom features can run well past $25,000."

Eliminated "it really depends on your specific situation" and replaced it with the actual driver (custom templates vs. theme reuse) and a real price range.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-06' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Gemini.',
      },
      {
        date: '2026-08-06',
        note: 'Re-verified against Claude Sonnet 5; added the explicit "flag it, don’t fabricate it" guardrail after a test rewrite invented a plausible-sounding but unsupported statistic.',
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
  {
    slug: 'optimize-google-business-profile-for-local-pack-rankings',
    category: 'seo-geo',
    title: `Optimize a Google Business Profile to win the local 3-pack`,
    description: `Turns a business's raw details into a primary/secondary category decision, a description that survives the 750-character truncation, seeded Q&A, and review-response templates — the profile-level inputs Google's own local ranking factors actually weigh.`,
    promptText: `You are a local SEO specialist optimizing a Google Business Profile (GBP), not writing generic marketing copy. Google's own local-ranking guidance names three factors — relevance, distance, and prominence — and every recommendation below should point at one of those, not at vague "more visibility."

BUSINESS: {{business_name}}
YOUR GUESS AT THE RIGHT PRIMARY CATEGORY: {{primary_category_guess}}
SERVICES OR PRODUCTS OFFERED: {{services_or_products}}
LOCATION / SERVICE AREA: {{location_and_service_area}}
TARGET LOCAL SEARCH TERMS: {{target_local_keywords}}
WHAT COMPETITORS' PROFILES DO DIFFERENTLY: {{competitor_gbp_notes}}

TASK

1. PRIMARY CATEGORY: GBP allows exactly one primary category plus up to 9 secondary categories. Recommend the primary category. If a plausible alternative exists, name it and explain the specific detail that settles the choice in favor of your pick — category match is one of the most heavily weighted relevance signals for "near me" and service-type queries, ahead of nearly every other profile field. Then list up to 9 relevant secondary categories.
2. BUSINESS DESCRIPTION: Write one under the 750-character limit. Put the core service and the location in the first ~250 characters — that's roughly what shows before a visitor has to tap "more." No URLs, no phone numbers, no prices, no superlatives ("best," "#1"), no limited-time offers — Google's guidelines reject or hide descriptions that read as an ad instead of a description.
3. Q&A SEEDING: The Q&A section is public and editable by any Google user, including competitors — an unanswered or wrongly-answered question sits there hurting conversion until someone corrects it. Write 5 self-seeded Q&A pairs covering the highest-friction real questions a buyer would have before contacting {{business_name}}.
4. REVIEW RESPONSE TEMPLATES: Draft one template for a 5-star review and one for a 3-star-or-below review. Each should sound like a real owner, not a script — naturally mention the specific service and location without stuffing either in, and never offer compensation for a changed or removed review, which violates Google's review policies and risks profile suspension.
5. POST IDEAS: Suggest 3 Google Posts (What's New / Offer / Event style) tied to {{services_or_products}}, each under 1,500 characters with one clear next step.
6. NAP FLAG: Note anything in the inputs above that looks likely to create a Name/Address/Phone mismatch against how this business is probably already listed elsewhere (directories, the website footer) — inconsistent NAP undermines the "prominence" signal even when the profile itself is fully optimized.

OUTPUT
Structured sections matching the 6 tasks above, in order.`,
    variables: [
      {
        name: 'business_name',
        description: 'The exact legal/trading name as it should appear on the profile.',
        example: 'Denver Rapid Plumbing',
        required: true,
      },
      {
        name: 'primary_category_guess',
        description:
          'Your current best guess at the primary category, so the model can confirm or correct it rather than start blind.',
        example: 'Plumber',
        required: true,
      },
      {
        name: 'services_or_products',
        description: 'The core services or products this business actually sells.',
        example: 'emergency pipe repair, water heater installation, drain cleaning',
        required: true,
      },
      {
        name: 'location_and_service_area',
        description:
          'Whether this is a storefront address or a service-area business, and the area covered.',
        example:
          'service-area business, no walk-in storefront, covers Denver metro within a 25-mile radius',
        required: true,
      },
      {
        name: 'target_local_keywords',
        description: 'The specific local search terms you want to show up for.',
        example:
          '24 hour plumber near me, emergency plumber Denver, burst pipe repair Denver',
        required: true,
      },
      {
        name: 'competitor_gbp_notes',
        description:
          "Anything you've noticed a competitor's profile doing differently — categories, posts, review volume.",
        example:
          'top-ranking competitor lists both "Plumber" and "Drainage Service" and posts weekly',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'google business profile',
      'local seo',
      'local pack',
      'gbp optimization',
      'map pack',
    ],
    whyItWorks: `Google's own "how local results are ranked" documentation names exactly three factors — relevance, distance, and prominence — and independent local-ranking-factor surveys have consistently found primary category to be one of the single heaviest-weighted relevance signals, ahead of the description text, which Google has stated doesn't directly influence category matching. That's why the primary-category decision comes first and gets an explicit justification, while the description is scoped to conversion and to being good raw material for the AI-generated business-overview summaries Google now surfaces on some profiles and in Maps — it still matters, just for a different reason than ranking. The Q&A seeding step exists because that section is genuinely public-editable, a real and often-missed vulnerability where a stale, wrong, or competitor-planted answer sits visible until someone with edit access corrects it. The review-response guardrail against offering anything for a changed review isn't stylistic caution — it's Google's stated policy ground for profile suspension.`,
    exampleOutput: `PRIMARY CATEGORY: "Emergency Plumber" over the more generic "Plumber" — the target terms ("24 hour plumber near me," "burst pipe repair Denver") are urgency-specific, and category match against that phrasing outweighs the broader term's higher search volume. Secondary categories: Plumber, Drainage Service, Water Damage Restoration Service.

DESCRIPTION (312 characters): "24/7 emergency plumbing in Denver, CO — burst pipes, no heat, and water damage calls answered live, day or night. Licensed and insured, on-site within the hour for most Denver metro addresses..." [continues with credentials and service list before the 750-character limit].

Q&A seeded: "Do you charge extra for night calls?" / "No overtime surcharge — the emergency rate is flat regardless of time of day."

NAP flag: confirm "Denver Rapid Plumbing" (not "Denver Rapid Plumbing LLC" or any variant) matches the website footer and every existing directory listing exactly.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: `Initial publish, anchored to Google's documented relevance/distance/prominence local-ranking factors and the 750-character description limit.`,
      },
    ],
  },
  {
    slug: 'track-whether-geo-fixes-earned-real-ai-citations',
    category: 'seo-geo',
    title: `Turn a citation-check log into a verdict on whether your GEO fixes actually worked`,
    description: `Feeds in a dated log of citation checks alongside the GEO fixes you shipped, and returns a before/after verdict per fix — working, no effect yet, or inconclusive — with confounds flagged instead of crediting whichever change happened most recently.`,
    promptText: `You are an AEO analyst evaluating causation over time, not running a fresh audit. Your job is to say, per fix, whether the evidence actually supports "this fix caused a citation" — and to say "not enough evidence yet" when that's the honest answer.

DOMAIN: {{domain}}

GEO FIXES SHIPPED (dated):
{{fixes_shipped}}

CITATION CHECK LOG (dated, one line per check):
{{citation_check_log}}

OTHER CHANGES IN THE SAME WINDOW (content edits, new backlinks, PR — anything not itself a GEO fix): {{other_changes}}

STEPS
1. Merge the fixes and the checks into one chronological timeline.
2. For each fix, find the nearest check before its ship date and the nearest check after it, for the same engine + query pair where possible. Classify the fix as one of:
   - WORKING — not cited in the nearest check before, clearly cited in a check after (allow re-crawl lag: give it at least 2-4 weeks before ruling out "no effect yet").
   - ALREADY WORKING BEFORE — cited before the fix too, so this fix cannot be the cause of that citation.
   - NO EFFECT YET — still not cited after, and enough time has passed that re-crawl lag isn't a plausible excuse anymore.
   - TOO EARLY TO TELL — less time has passed since the fix than a reasonable re-crawl/reindex window.
   - INCONCLUSIVE — either too few check data points around this fix's ship date, or another fix shipped within roughly the same week, making individual attribution unreliable.
3. Explicitly call out any window where two or more fixes shipped close together — state plainly that a citation appearing after that window cannot be credited to one specific fix without more isolated data.
4. Note any gap in the check log itself that weakens the verdict (checks stopped right when a fix shipped, only one data point total for an engine/query pair, and so on).
5. Close with one honest sentence: which fix, if any, has evidence strong enough to act on (keep doing more of it), and which fixes still need more data before anyone should draw a conclusion.

OUTPUT
A table: Fix | Ship date | Nearest check before | Nearest check after | Verdict | Confidence (High/Med/Low). Then the confound notes and the closing sentence.`,
    variables: [
      {
        name: 'domain',
        description: 'The domain these fixes and checks apply to.',
        example: 'example.com',
        required: true,
      },
      {
        name: 'fixes_shipped',
        description: 'A dated list of the specific GEO fixes shipped, one per line.',
        example:
          '2026-06-01: unblocked PerplexityBot in robots.txt\n2026-06-15: published /llms.txt\n2026-07-01: added FAQPage schema to the pricing page',
        required: true,
      },
      {
        name: 'citation_check_log',
        description:
          'A dated log of citation checks, one per line: date, engine, query, cited yes/no, and what was quoted if cited.',
        example:
          '2026-05-20 | Perplexity | best project management software | not cited\n2026-06-25 | Perplexity | best project management software | cited - paraphrased pricing sentence\n2026-07-10 | ChatGPT | best project management software | not cited',
        required: true,
      },
      {
        name: 'other_changes',
        description:
          'Anything else that changed in the same window that could confound attribution, if anything.',
        example:
          'redesigned the pricing page layout on 2026-06-20; picked up 3 new backlinks from a roundup post in late June',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude'],
    tags: [
      'ai citation tracking',
      'geo measurement',
      'ai visibility monitoring',
      'citation attribution',
      'aeo',
    ],
    whyItWorks: `Different engines re-fetch and re-index on different cadences — Perplexity's live search can reflect a page change within days, Google AI Overviews grounding tracks the core Search index's own refresh cycle, and a citation sourced from a chat model's training data rather than a live browsing call won't move at all until its next knowledge cutoff — so "did the fix work" is fundamentally a time-series attribution question, not something a single before/after snapshot can answer honestly. Forcing a before-and-after check per fix, rather than one end-state citation count, is the structure that avoids the specific fallacy this category is most prone to: crediting whichever fix happened to ship most recently when a citation finally appears. The explicit confound flag for fixes shipped close together matters because that's the realistic case — teams ship several GEO changes in the same sprint — and a report that quietly picks a favorite without saying so is less useful than one that admits the data can't isolate it yet.`,
    exampleOutput: `| Fix | Ship date | Check before | Check after | Verdict | Confidence |
|---|---|---|---|---|---|
| Unblocked PerplexityBot in robots.txt | 2026-06-01 | 2026-05-20: not cited (Perplexity) | 2026-06-25: cited, paraphrased pricing line (Perplexity) | WORKING | High |
| Published /llms.txt | 2026-06-15 | 2026-05-20: not cited (Perplexity) | 2026-06-25: cited (Perplexity) | INCONCLUSIVE | Low — shipped two weeks after the robots.txt fix in the same check window; can't isolate which one caused the 06-25 citation |
| Added FAQPage schema to the pricing page | 2026-07-01 | 2026-06-25: not cited (ChatGPT) | 2026-07-10: not cited (ChatGPT) | TOO EARLY TO TELL | Low — only 9 days elapsed |

The PerplexityBot unblock has the strongest standalone evidence. The llms.txt publish landed too close to it to credit separately — rerun the check in another 2-3 weeks isolating that variable before claiming it worked.`,
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Sonnet 5', date: '2026-08-07' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-05' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: `Initial publish, built as the measurement sequel to the fix-plan prompt — designed to stop teams from crediting whichever GEO change shipped most recently instead of the one the data actually supports.`,
      },
    ],
    relatedToolSlug: 'ai-visibility-checker',
  },
]
