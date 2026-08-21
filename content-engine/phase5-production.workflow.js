export const meta = {
  name: 'content-engine-phase5-production',
  description: '10 agents write 10 full ~4500-word articles each from the Phase 1 research',
  phases: [{ title: 'Production' }],
}

const GROUPS = args.groups // 10 groups of 10 {candidate_id, article_num} pairs, length 10
const TODAY = '2026-08-21'
const TOPICS_DIR = 'D:\\PABLO ESCOBAR\\tools.scult.in\\content-engine\\01-research\\topics'
const DRAFTS_DIR = 'D:\\PABLO ESCOBAR\\tools.scult.in\\content-engine\\05-drafts'

const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    articles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          article_num: { type: 'number' },
          candidate_id: { type: 'string' },
          slug: { type: 'string' },
          title: { type: 'string' },
          word_count: { type: 'number' },
          question_count: { type: 'number' },
          file_path: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
  },
}

function productionPrompt(group, agentIndex) {
  const assignments = group
    .map((g) => `- Article ${String(g.article_num).padStart(3, '0')}: read \`${TOPICS_DIR}\\${g.candidate_id}.json\` for the full research brief (topic, keyword architecture, intent, audience, countries, cluster, connects_to tools/prompts/service, evidence_strength, seed questions with sources, sources list) -> write \`${DRAFTS_DIR}\\article-${String(g.article_num).padStart(3, '0')}.md\``)
    .join('\n')

  return `You are Production Agent ${agentIndex} of 20 (reusing the same 20-agent pool from the research phase) for tools.scult.in's SEO/GEO/AEO content engine. tools.scult.in is an open-source project of the agency SCULT.IN — 15 free browser tools (ai-visibility-checker, business-name-generator, color-palette-generator, email-signature-generator, faq-schema-generator, favicon-generator, invoice-generator, json-formatter, marketing-roi-calculator, qr-code-generator, schema-markup-generator, slogan-generator, utm-builder, website-speed-test, word-counter), a large AI prompt library (43 categories including chatgpt, claude, claude-code, cursor, github-copilot, gemini, perplexity, grok, ai-engineering, seo-geo, startup, ecommerce-product, branding, hr-management, legal-compliance, customer-support, career-jobsearch, youtube, instagram, x-twitter, and more), and paid services (web-development, custom-software, branding-agency, local SEO, google-ads-management, ai-agents-automation) at scult.in.

Your job: write EXACTLY 10 complete, ~4,500-word articles. Start by reading each research brief JSON file listed below with the Read tool — it has everything the research phase already verified (real sources, real seed questions with citations, keyword architecture, intent, scoring). Use it as your factual foundation, then do REAL ADDITIONAL WEB RESEARCH yourself (load WebSearch/WebFetch via ToolSearch) wherever you need more evidence than what's provided — especially to responsibly expand each topic's FAQ toward 50 real questions, and to find concrete data/examples for the body. Do NOT invent statistics, quotes, Reddit sentiment, YC/Product Hunt trends, or company facts. Where you cannot verify something even after searching, either omit the claim or write "Evidence not sufficiently verified" — never silently convert an uncertain claim into a stated fact.

Your 10 assignments (read the brief, then write the article):
${assignments}

For EACH article, write a complete markdown file with this exact structure, and save it directly with the Write tool to its exact file path (today's date is ${TODAY}, use it for last_verified):

\`\`\`
---
id: <article_XXX, matching the article number above>
title: <SEO title, keyword-front-loaded>
slug: <kebab-case slug derived from the target keyword, unique>
description: <meta description, 120-160 chars>
primary_keyword: <the target keyword from the brief>
secondary_keywords: [<3-6 secondary keywords>]
intent: <primary intent classification from the brief>
audience: <target audience from the brief>
topic_cluster: <topic cluster from the brief>
countries: [<countries with genuine relevance, or empty if global>]
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "${TODAY}"
sources: [<every source URL actually used, real ones only>]
---

# <H1 — phrased how someone would actually search>

<Short answer / executive summary — 2-4 sentences that directly answer the core question, before anything else>

## Table of contents
<list of the H2 sections below>

## <Core explanation section(s) — as many H2s as the topic genuinely needs>
<Real, evidence-grounded explanation. Cite sources inline or in a sources section, not invented.>

## Practical examples
<Concrete, real examples — not invented company names/case studies presented as real. If you don't have a real example, say so and give a hypothetical clearly labeled as illustrative.>

## Data and evidence
<Real numbers/findings from your research, each attributed to its source. If no real data exists for a sub-claim, say "Evidence not sufficiently verified" rather than inventing a number.>

## Comparisons
<If genuinely relevant to this topic — comparing real named tools/approaches/models with attributed facts>

## Real-world use cases
<Grounded in your research, not invented>

## Common mistakes

## Best practices

## Frequently asked questions
<50 questions, organized in these buckets (adapt a bucket if the topic genuinely doesn't fit it rather than inventing irrelevant questions):
1-10 beginner, 11-20 core understanding, 21-30 practical/how-to, 31-35 advanced, 36-40 comparison, 41-45 problem/troubleshooting, 46-50 commercial/decision.
Each question gets a concise, direct answer. Cite a source URL where the answer rests on an external fact; for questions you're answering from established/well-known technical knowledge (e.g. "what does JSON stand for"), no citation is needed, but do not fabricate URLs for a citation that doesn't exist.>

## Key takeaways
<3-6 bullet points>

## Relevant tools.scult.in resources
<Real links to the connected tools/prompts named in the brief, phrased as genuinely useful next steps, e.g. "[Tool name](/category/tool-slug)" using the exact slugs given in the brief — never invent a slug>

<If the brief gave a service connection: one natural, contextual paragraph linking to that service at scult.in, framed as "why this might be worth a conversation" — never a hard sell, and skip this section entirely if no service connection genuinely fits>

## Sources
<Every real source URL used in this article, one per line>
\`\`\`

Word count target ~4,500 — do not pad with filler to hit this; if the topic is genuinely well-covered in less, that's fine, but most of these topics have enough real depth (given the research brief) to reach it honestly.

Do not spawn any sub-agents — do all reading, writing, and research yourself, directly.

When done, return via the required schema: one entry per article with article_num, candidate_id, slug, title, word_count (your own honest estimate), question_count (should be 50, or explain in notes if fewer because a bucket didn't apply), file_path, and notes (anything worth flagging — a weak evidence area, a bucket you adapted, a service link you omitted).`
}

phase('Production')
const batches = await parallel(
  GROUPS.map((group, i) => () =>
    agent(productionPrompt(group, i + 1), {
      label: `production-agent-${i + 1}`,
      schema: RESULT_SCHEMA,
      effort: 'high',
    }),
  ),
)

const allArticles = batches
  .filter(Boolean)
  .flatMap((b) => (b && Array.isArray(b.articles) ? b.articles : []))

log(`Production complete: ${allArticles.length} articles reported across ${GROUPS.length} agents`)

return { articles: allArticles }
