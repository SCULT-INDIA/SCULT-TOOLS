'use client'

import { useEffect } from 'react'
import { trackSkillEvent } from '@/lib/analytics'

/**
 * Fires the skill-viewed signal once when the skill detail page mounts —
 * the smallest possible client island for that one event, embedded inside
 * an otherwise server-rendered page (same pattern as `CtaClickTracker`/
 * `FeedbackButton` elsewhere in this codebase). Renders nothing.
 *
 * Reported as `skill_action`/`action: 'view'` through the existing
 * `trackSkillEvent`, not a bespoke `skill_viewed` event name — this
 * codebase's own convention (see `trackSkillEvent`'s docblock) is one event
 * name per content type with an `action` parameter, specifically so GA4's
 * Explore/Funnel reports pivot on parameters rather than needing yet
 * another distinctly-named event.
 */
export function SkillViewTracker({ category, slug }: { category: string; slug: string }) {
  useEffect(() => {
    trackSkillEvent(category, slug, 'view')
  }, [category, slug])
  return null
}
