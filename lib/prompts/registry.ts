import { prompts as adsPrompts } from './ads/prompts'
import { prompts as aiAudioPrompts } from './ai-audio/prompts'
import { prompts as aiCompanionsPrompts } from './ai-companions/prompts'
import { prompts as aiEngineeringPrompts } from './ai-engineering/prompts'
import { prompts as blogWritingPrompts } from './blog-writing/prompts'
import { prompts as brandingPrompts } from './branding/prompts'
import { prompts as businessOpsPrompts } from './business-ops/prompts'
import { prompts as chatgptPrompts } from './chatgpt/prompts'
import { prompts as claudePrompts } from './claude/prompts'
import { prompts as claudeCodePrompts } from './claude-code/prompts'
import { prompts as consultingPrompts } from './consulting/prompts'
import { prompts as cursorPrompts } from './cursor/prompts'
import { prompts as dallePrompts } from './dalle/prompts'
import { prompts as devopsPrompts } from './devops/prompts'
import { prompts as emailMarketingPrompts } from './email-marketing/prompts'
import { prompts as examPrepPrompts } from './exam-prep/prompts'
import { prompts as figmaPrompts } from './figma/prompts'
import { prompts as financePrompts } from './finance/prompts'
import { prompts as fluxPrompts } from './flux/prompts'
import { prompts as framerPrompts } from './framer/prompts'
import { prompts as geminiPrompts } from './gemini/prompts'
import { prompts as githubCopilotPrompts } from './github-copilot/prompts'
import { prompts as grokPrompts } from './grok/prompts'
import { prompts as ideogramPrompts } from './ideogram/prompts'
import { prompts as instagramPrompts } from './instagram/prompts'
import { prompts as klingPrompts } from './kling/prompts'
import { prompts as linkedinPrompts } from './linkedin/prompts'
import { prompts as midjourneyPrompts } from './midjourney/prompts'
import { prompts as nanoBananaPrompts } from './nano-banana/prompts'
import { prompts as nextjsPrompts } from './nextjs/prompts'
import { prompts as noCodeAppsPrompts } from './no-code-apps/prompts'
import { prompts as perplexityPrompts } from './perplexity/prompts'
import { prompts as presentationsPrompts } from './presentations/prompts'
import { prompts as pythonPrompts } from './python/prompts'
import { prompts as reactPrompts } from './react/prompts'
import { prompts as researchPrompts } from './research/prompts'
import { prompts as runwayPrompts } from './runway/prompts'
import { prompts as salesPrompts } from './sales/prompts'
import { prompts as seoGeoPrompts } from './seo-geo/prompts'
import { prompts as startupPrompts } from './startup/prompts'
import { prompts as studentsPrompts } from './students/prompts'
import type { PromptCategorySlug } from './types'
import { prompts as uiDesignPrompts } from './ui-design/prompts'
import { prompts as veoPrompts } from './veo/prompts'
import { prompts as writingPrompts } from './writing/prompts'
import { prompts as xTwitterPrompts } from './x-twitter/prompts'
import { prompts as youtubePrompts } from './youtube/prompts'

/**
 * THE source of truth for the prompt catalogue — the parallel sibling to
 * `lib/tools/registry.ts`'s `TOOLS`, deliberately never imported by it or
 * importing from it. One `prompts.ts` per category (mirroring the tool
 * registry's one-`meta.ts`-per-tool pattern), assembled and ordered here in
 * the same group order as PROMPT_CATEGORIES. Categories still awaiting their
 * content wave export an empty array — they contribute nothing and their
 * pages are hidden until filled. See docs/research/prompt-library.md §6/§10.
 */
export const PROMPTS = [
  // ai-models
  ...chatgptPrompts,
  ...claudePrompts,
  ...claudeCodePrompts,
  ...cursorPrompts,
  ...githubCopilotPrompts,
  ...geminiPrompts,
  ...perplexityPrompts,
  ...grokPrompts,
  ...aiCompanionsPrompts,
  // development
  ...aiEngineeringPrompts,
  ...reactPrompts,
  ...nextjsPrompts,
  ...pythonPrompts,
  ...devopsPrompts,
  ...noCodeAppsPrompts,
  // marketing
  ...seoGeoPrompts,
  ...adsPrompts,
  ...emailMarketingPrompts,
  ...salesPrompts,
  ...linkedinPrompts,
  // design
  ...figmaPrompts,
  ...framerPrompts,
  ...uiDesignPrompts,
  ...brandingPrompts,
  ...presentationsPrompts,
  // business
  ...startupPrompts,
  ...financePrompts,
  ...consultingPrompts,
  ...businessOpsPrompts,
  // content
  ...youtubePrompts,
  ...instagramPrompts,
  ...xTwitterPrompts,
  ...blogWritingPrompts,
  ...writingPrompts,
  // education
  ...studentsPrompts,
  ...researchPrompts,
  ...examPrepPrompts,
  // image-ai
  ...midjourneyPrompts,
  ...nanoBananaPrompts,
  ...fluxPrompts,
  ...ideogramPrompts,
  ...dallePrompts,
  // video-ai
  ...veoPrompts,
  ...klingPrompts,
  ...runwayPrompts,
  ...aiAudioPrompts,
]

export const PROMPT_BY_SLUG = new Map(PROMPTS.map((p) => [p.slug, p]))

export function getPrompt(slug: string) {
  return PROMPT_BY_SLUG.get(slug)
}

export function getPromptsByCategory(category: PromptCategorySlug) {
  return PROMPTS.filter((p) => p.category === category)
}

export function getPromptCountByCategory(category: PromptCategorySlug): number {
  return getPromptsByCategory(category).length
}

export { PROMPT_CATEGORIES, PROMPT_GROUPS } from './categories'
