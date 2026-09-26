import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PromptDetailShell } from '@/components/prompts/PromptDetailShell'
import { getAdminPrompt, publishBlockers } from '@/lib/admin/prompts'
import { requireAdminPageSession } from '@/lib/admin/require-session'
import { getPromptCategoryOrCustom } from '@/lib/prompts/category-resolver'
import type { PromptCategorySlug } from '@/lib/prompts/types'
import { PublishFromPreview } from '../../PublishFromPreview'

export const metadata: Metadata = {
  title: 'Preview — tools.scult.in',
  robots: { index: false, follow: false },
}

/** Session-gated (`requireAdminPageSession()` below reads `cookies()`) and
 * wrapped by the root layout's `HeaderGate`, which reads `usePathname()`
 * — both unavailable at prerender time, and together they escalate from a
 * harmless console warning into a real blocking dev-server error. See
 * `app/admin/layout.tsx`'s matching `instant = false` for the full
 * explanation; this route needs the same opt-out since it deliberately
 * sits outside that layout's subtree. */
export const instant = false

/**
 * The exact same rendering a real visitor gets at
 * `/prompts/<category>/<slug>` — `PromptDetailShell` itself, not a
 * hand-built mockup that could drift from the real page over time — run
 * against the draft's current saved fields, whatever its status.
 *
 * Deliberately a top-level route, NOT nested under `app/admin/` — that
 * directory's own `layout.tsx` wraps every page in the admin nav and a
 * narrow `max-w-[64rem]` content column, which would make this render
 * nothing like the real page. Sitting here instead, this page inherits
 * only the root layout — the same Header/Footer chrome the real page
 * gets — while still being session-gated via its own
 * `requireAdminPageSession()` call, noindexed, and excluded from the
 * sitemap/robots the same way `/admin` and `/search` are (see
 * app/robots.ts and tests/sitemap-coverage.test.ts).
 *
 * Reached right after "Create draft" (PromptForm.tsx's redirect) and from
 * a persistent "Preview" link on the edit page. `previewMode` on the
 * shell suppresses the page-view analytics event — see that prop's own
 * docblock — the only difference from the real page.
 */
export default async function PromptPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdminPageSession(`/admin-preview/prompts/${encodeURIComponent(id)}`)
  const prompt = await getAdminPrompt(decodeURIComponent(id))
  if (!prompt) notFound()

  // An auto-saved draft is often unfinished (no category yet, say) —
  // there is no page to render, so say what's missing rather than 404.
  const category = prompt.category
    ? await getPromptCategoryOrCustom(prompt.category)
    : undefined
  const blockers = await publishBlockers(prompt)
  if (!category) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-bold text-2xl text-ink">{prompt.title}</h1>
        <p className="mt-3 text-ink-muted">
          This draft is saved, but it isn&rsquo;t finished enough to preview yet.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {blockers.map((b) => (
            <li key={b.field}>{b.message}</li>
          ))}
        </ul>
        <Link
          href={`/admin/prompts/${encodeURIComponent(prompt.id)}`}
          className="btn-brutal btn-brutal-sm mt-6 inline-flex"
        >
          Finish it in the editor
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-ink border-b-2 bg-cta px-4 py-2.5">
        <span className="font-bold text-[13px] text-ink uppercase tracking-wide">
          {prompt.status === 'published'
            ? 'Preview — this prompt is live'
            : `Preview — ${prompt.status}, not published`}
        </span>
        <div className="flex items-center gap-2">
          <PublishFromPreview
            blockers={blockers.map((b) => b.message)}
            status={prompt.status}
            publishUrl={`/api/admin/prompts/${encodeURIComponent(prompt.id)}/publish`}
            liveHref={`/prompts/${prompt.category}/${prompt.slug}`}
          />
          <Link
            href={`/admin/prompts/${encodeURIComponent(prompt.id)}`}
            className="rounded-pill border border-ink bg-white px-3 py-1 font-semibold text-[13px] text-ink hover:bg-cream"
          >
            Back to edit
          </Link>
        </div>
      </div>
      <PromptDetailShell
        // `category` here is a plain string on an admin-authored draft
        // (checked against the real category list, but not narrowed to
        // the closed union at the type level) — the same cast
        // `lib/prompts/category-resolver.ts`'s own fallback already uses,
        // for the same reason: a route boundary that only ever displays
        // the value, never switches on it exhaustively.
        prompt={{ ...prompt, category: prompt.category as PromptCategorySlug }}
        category={category}
        previewMode
      />
    </div>
  )
}
