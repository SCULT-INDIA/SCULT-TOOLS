import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkillDetailShell } from '@/components/skills/SkillDetailShell'
import { requireAdminPageSession } from '@/lib/admin/require-session'
import { getAdminSkill } from '@/lib/admin/skills'
import { getSkillCategoryOrCustom } from '@/lib/skills/category-resolver'
import { getSiblingSkills } from '@/lib/skills/db'
import { PublishFromPreview } from '../../PublishFromPreview'

export const metadata: Metadata = {
  title: 'Preview — tools.scult.in',
  robots: { index: false, follow: false },
}

/** Same opt-out as app/admin-preview/prompts/[id]/page.tsx — see
 * app/admin/layout.tsx's docblock for why. */
export const instant = false

/**
 * The skill counterpart of app/admin-preview/prompts/[id]/page.tsx: the
 * real `SkillDetailShell` a visitor gets at `/skills/<category>/<slug>`,
 * run against the draft's saved row whatever its status, with a banner to
 * publish from here. Top-level (outside app/admin/) for the same reason —
 * only the root layout's chrome, so it renders exactly like the live page.
 * Reached right after "Create draft" on the skill upload form, and from
 * the "Preview" link on the skill's edit page (app/admin/skills/[id]).
 */
export default async function SkillPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdminPageSession(`/admin-preview/skills/${encodeURIComponent(id)}`)
  const skill = await getAdminSkill(decodeURIComponent(id))
  if (!skill) notFound()

  const category = await getSkillCategoryOrCustom(skill.category)
  if (!category) notFound()

  const siblings = await getSiblingSkills(category.slug, skill.slug, 3)
  const isLive = skill.status === 'published'

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-ink border-b-2 bg-cta px-4 py-2.5">
        <span className="font-bold text-[13px] text-ink uppercase tracking-wide">
          {isLive
            ? 'Preview — this skill is live'
            : `Preview — ${skill.status}, not published`}
        </span>
        <div className="flex items-center gap-2">
          <PublishFromPreview
            status={skill.status}
            publishUrl={`/api/admin/skills/${encodeURIComponent(skill.id)}/publish`}
            liveHref={`/skills/${skill.category}/${skill.slug}`}
          />
          <Link
            href={`/admin/skills/${encodeURIComponent(skill.id)}`}
            className="rounded-pill border border-ink bg-white px-3 py-1 font-semibold text-[13px] text-ink hover:bg-cream"
          >
            Back to edit
          </Link>
        </div>
      </div>
      <SkillDetailShell
        skill={skill}
        category={category}
        siblings={siblings}
        previewMode
      />
    </div>
  )
}
