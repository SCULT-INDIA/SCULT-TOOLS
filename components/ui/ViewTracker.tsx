'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Fires one event once when the page it's mounted on renders — the smallest
 * possible client island for a "content viewed" signal on an otherwise
 * server-rendered detail page (tool/prompt/skill), matching the pattern
 * `CtaClickTracker`/`FeedbackButton` already use elsewhere in this codebase.
 * Renders nothing.
 *
 * Generic over event name/params rather than one bespoke tracker per content
 * type: callers pass the exact shape `trackToolEvent`/`trackPromptEvent`/
 * `trackSkillEvent` already build (e.g. `{ tool_name, action: 'view' }`
 * under `tool_action`), so this stays consistent with this codebase's own
 * one-event-name-per-content-type-plus-action-parameter convention (see
 * `trackToolEvent`'s docblock) instead of inventing a new event name per
 * content type.
 */
export function ViewTracker({
  event,
  params,
}: {
  event: string
  params?: Record<string, string | number | boolean>
}) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: params is a fresh object literal at every call site by design (the caller builds it inline) — depending on it directly would re-fire on every render. The primitive fields callers actually vary (tool_name/category/skill/action) are listed explicitly instead.
  useEffect(() => {
    trackEvent(event, params)
  }, [
    event,
    params?.tool_name,
    params?.category,
    params?.skill,
    params?.prompt,
    params?.action,
  ])
  return null
}
