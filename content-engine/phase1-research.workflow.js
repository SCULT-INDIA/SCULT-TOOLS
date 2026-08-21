export const meta = {
  name: 'content-engine-phase1-research',
  description: '20 agents research 5-6 candidate topics each with real web evidence',
  phases: [{ title: 'Research' }],
}

// 111 grounded candidates, split into 20 groups (11 groups of 6, 9 groups of 5)
// so the research workload maps onto exactly 20 agents as specified.
const GROUPS = args.groups // array of arrays of candidate objects, length 20

const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          candidate_id: { type: 'string' },
          topic: { type: 'string' },
          status: { type: 'string', enum: ['accepted', 'rejected'] },
          rejection_reason: { type: 'string' },
          target_keyword: { type: 'string' },
          secondary_keywords: { type: 'array', items: { type: 'string' } },
          long_tail_keywords: { type: 'array', items: { type: 'string' } },
          question_keywords: { type: 'array', items: { type: 'string' } },
          comparison_keywords: { type: 'array', items: { type: 'string' } },
          how_to_keywords: { type: 'array', items: { type: 'string' } },
          problem_keywords: { type: 'array', items: { type: 'string' } },
          commercial_keywords: { type: 'array', items: { type: 'string' } },
          entities: { type: 'array', items: { type: 'string' } },
          primary_intent: { type: 'string' },
          secondary_intent: { type: 'string' },
          audience: { type: 'string' },
          countries: { type: 'array', items: { type: 'string' } },
          topic_cluster: { type: 'string' },
          connects_to_tools: { type: 'array', items: { type: 'string' } },
          connects_to_prompts: { type: 'array', items: { type: 'string' } },
          connects_to_service: { type: 'string' },
          scores: {
            type: 'object',
            properties: {
              demand: { type: 'number' },
              intent: { type: 'number' },
              relevance: { type: 'number' },
              question_density: { type: 'number' },
              search_opportunity: { type: 'number' },
              ai_answer_opportunity: { type: 'number' },
              tool_discovery_opportunity: { type: 'number' },
              competitive_gap: { type: 'number' },
              conversion_potential: { type: 'number' },
              evidence_quality: { type: 'number' },
              total: { type: 'number' },
            },
          },
          evidence_strength: { type: 'string', enum: ['strong', 'moderate', 'weak'] },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                answer_summary: { type: 'string' },
                sources: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          sources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                title: { type: 'string' },
                source_type: { type: 'string' },
                used_for: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
}

function researchPrompt(group, agentIndex) {
  const list = group
    .map((c) => `- [${c.candidate_id}] "${c.topic}" (hypothesized keyword: ${c.target_keyword_hypothesis}; connects to: ${c.connects_to})`)
    .join('\n')

  return `You are Research Agent ${agentIndex} of 20 for a SEO/GEO/AEO content project for tools.scult.in (an open-source project of the agency SCULT.IN — 15 free browser tools, an AI prompt library, and paid services in web dev, custom software, branding, local SEO, Google Ads, and AI agents/automation).

Your job: deeply research EXACTLY these ${group.length} candidate topics, using REAL web research (load WebSearch and WebFetch via ToolSearch if they are not already available to you, and use them — do not answer from memory alone):

${list}

For EACH topic, do real research and produce:
1. A verdict: "accepted" (genuine, researchable, real demand/discussion found) or "rejected" (evidence insufficient — explain why in rejection_reason). Do NOT invent search volume, Reddit sentiment, YC trends, or statistics. If you cannot verify something, do not include it — omit it rather than guess.
2. Keyword architecture: target_keyword, secondary_keywords, long_tail_keywords, question_keywords, comparison_keywords, how_to_keywords, problem_keywords, commercial_keywords, entities. These must be phrases you have actual reason to believe are how people search for this (from autocomplete-style patterns, forum phrasing, or the topic's own natural language) — not invented for volume.
3. Search intent classification (primary + secondary from: Informational, Navigational, Commercial Investigation, Transactional, Comparative, Problem-solving, Tutorial, Opinion/research, Tool discovery), target audience, and any countries where this topic has genuinely different search intent, terminology, pricing, or regulation (most topics are global — only name a country when you found a real reason to).
4. topic_cluster (a short label), and which tools.scult.in tools/prompt-categories/service this topic should realistically link to (confirm or correct the hypothesis given).
5. A qualitative 1-10 score (not fabricated volume) for each of: demand, intent, relevance, question_density, search_opportunity, ai_answer_opportunity, tool_discovery_opportunity, competitive_gap, conversion_potential, evidence_quality — plus their sum as total. Base these on what you actually found (forum activity, how many distinct real sources discuss it, how many genuine sub-questions it has), and set evidence_strength honestly (strong/moderate/weak).
6. Between 12 and 20 REAL, evidence-backed questions this topic's audience actually asks (from Reddit threads, Hacker News, Stack Overflow, forums, documentation, or search-result patterns you actually found) — each with a short answer_summary and the source URL(s) it came from. Do not invent questions merely to hit a count. Fewer real questions is better than padded fake ones.
7. A sources list: every URL you actually used, with its title, a source_type (primary/official, government/academic, company docs, industry publication, community, aggregator), and what you used it for.

Be skeptical and disciplined. A topic with weak real evidence should be marked rejected or scored low, not inflated. Spend real research effort per topic — this feeds a production pipeline that will write ~4,500-word articles from your output, so shallow research here becomes a shallow article later.

Do not spawn any sub-agents or delegate any part of this to another agent — do all research yourself, directly, using your own tool calls.

Return your findings via the required structured schema — one entry per topic, ${group.length} entries total.`
}

phase('Research')
const batches = await parallel(
  GROUPS.map((group, i) => () =>
    agent(researchPrompt(group, i + 1), {
      label: `research-agent-${i + 1}`,
      schema: RESEARCH_SCHEMA,
      effort: 'high',
    }),
  ),
)

const allResults = batches
  .filter(Boolean)
  .flatMap((b) => (b && Array.isArray(b.results) ? b.results : []))

log(`Research complete: ${allResults.length} topic results returned across ${GROUPS.length} agents`)

return { results: allResults }
