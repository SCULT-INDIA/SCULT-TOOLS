export const meta = {
  name: 'content-engine-phase6-verification',
  description: '5 agents independently verify 20 articles each (10 at a time to reduce burst spend), fixing real problems, scoring against a 90/100 bar',
  phases: [{ title: 'Verification batch A' }, { title: 'Verification batch B' }],
}

const GROUPS = args.groups // 5 groups of 20 article numbers, length 5
const TODAY = '2026-08-21'
const DRAFTS_DIR = 'D:\\PABLO ESCOBAR\\tools.scult.in\\content-engine\\05-drafts'
const VERIFY_DIR = 'D:\\PABLO ESCOBAR\\tools.scult.in\\content-engine\\06-verification'

const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    reports: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          article_num: { type: 'number' },
          title: { type: 'string' },
          scores: {
            type: 'object',
            properties: {
              research_quality: { type: 'number' },
              factual_accuracy: { type: 'number' },
              search_intent: { type: 'number' },
              original_value: { type: 'number' },
              seo: { type: 'number' },
              aeo: { type: 'number' },
              geo: { type: 'number' },
              readability: { type: 'number' },
              internal_linking: { type: 'number' },
              total: { type: 'number' },
            },
          },
          problems_found: { type: 'array', items: { type: 'string' } },
          corrections_made: { type: 'array', items: { type: 'string' } },
          publication_decision: { type: 'string', enum: ['publish', 'hold_for_revision'] },
        },
      },
    },
  },
}

function verificationPrompt(nums, agentLabel) {
  const fileList = nums.map((n) => `article-${String(n).padStart(3, '0')}.md`).join(', ')
  return `You are Verification Agent ${agentLabel} (part of the same 20-agent pool reused across this content engine's phases) for tools.scult.in — an independent editorial QA pass, not the agent who wrote these articles.

Your job: independently verify EXACTLY these ${nums.length} articles in ${DRAFTS_DIR}: ${fileList}

Internal links (tool/prompt-category paths and slugs) have ALREADY been mechanically validated against the real site registries — do not spend time re-checking those. Focus your effort on judgment calls a script cannot make. Be efficient — this is a smaller batch specifically so each of you stays within a reasonable spend budget, so do not over-research; 2-4 targeted searches per article for the biggest claims is enough, not an exhaustive re-research of the whole topic.

For EACH article:
1. Read the full file.
2. Spot-check the article's 2-4 most load-bearing factual claims/statistics against real sources (WebSearch/WebFetch via ToolSearch). If a claim doesn't hold up or should be hedged, FIX IT DIRECTLY with the Edit tool rather than just noting the problem.
3. Check the FAQ: 50 genuinely distinct, correctly-bucketed questions with answers that actually answer what's asked. Fix padding/duplication if found.
4. Check for keyword stuffing and generic filler vs genuine original analysis — fix if found.
5. Check structural completeness (frontmatter, H1, executive summary, TOC, core explanation, examples, data/evidence, comparisons where relevant, use cases, mistakes, best practices, 50-question FAQ, takeaways, resource links, sources). Fix anything missing or thin.
6. Score the article AFTER your fixes on this exact rubric (sum to /100): Research Quality /20, Factual Accuracy /20, Search Intent /10, Original Value /10, SEO /10, AEO /10, GEO /10, Readability /5, Internal Linking /5.
7. Publication decision: "publish" if total >= 90, else "hold_for_revision" — prefer to actually fix what's dragging the score down and re-score, rather than just flagging. Only "hold_for_revision" when the underlying research evidence is genuinely too thin to fix by editing (a real, allowed outcome).
8. Write a verification report to ${VERIFY_DIR}\\article-<NNN>-verification.md (date: ${TODAY}) with: Article, Reviewer, Date, Sources checked, Claims checked, Questions checked, the 9 scores + total, Problems found, Corrections made, Final score, Publication decision.

Do not spawn any sub-agents — do all reading, research, editing, and scoring yourself, directly.

When done, return via the required schema: one entry per article with article_num, title, the 9 scores + total, problems_found, corrections_made, publication_decision.`
}

// Split each 20-article group into two 10-article halves, and run the 5 first
// halves together, THEN the 5 second halves — same 5 conceptual agents, half
// the concurrent burst size, to stay under the spend-limit threshold that
// tripped when all 5 ran their full 20-article load at once.
function halves(nums) {
  const mid = Math.ceil(nums.length / 2)
  return [nums.slice(0, mid), nums.slice(mid)]
}

const splitGroups = GROUPS.map(halves)
const firstHalves = splitGroups.map((h) => h[0])
const secondHalves = splitGroups.map((h) => h[1])

phase('Verification batch A')
const batchA = await parallel(
  firstHalves.map((nums, i) => () =>
    agent(verificationPrompt(nums, `${i + 11}a`), {
      label: `verification-agent-${i + 11}a`,
      schema: RESULT_SCHEMA,
      effort: 'high',
    }),
  ),
)
log(`Batch A done: ${batchA.filter(Boolean).length}/5 agents succeeded`)

phase('Verification batch B')
const batchB = await parallel(
  secondHalves.map((nums, i) => () =>
    agent(verificationPrompt(nums, `${i + 11}b`), {
      label: `verification-agent-${i + 11}b`,
      schema: RESULT_SCHEMA,
      effort: 'high',
    }),
  ),
)
log(`Batch B done: ${batchB.filter(Boolean).length}/5 agents succeeded`)

const allReports = [...batchA, ...batchB]
  .filter(Boolean)
  .flatMap((b) => (b && Array.isArray(b.reports) ? b.reports : []))

log(`Verification complete: ${allReports.length} reports across 10 agent-calls`)

return { reports: allReports }
