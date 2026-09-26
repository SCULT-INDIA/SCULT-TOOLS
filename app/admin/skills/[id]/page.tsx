import { notFound } from 'next/navigation'
import { requireAdminPageSession } from '@/lib/admin/require-session'
import { getAdminSkill } from '@/lib/admin/skills'
import { StatusActions } from '../../StatusActions'
import { SkillEditForm } from './SkillEditForm'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdminPageSession(`/admin/skills/${encodeURIComponent(id)}`)
  const skill = await getAdminSkill(decodeURIComponent(id))
  if (!skill) notFound()

  const encodedId = encodeURIComponent(skill.id)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-bold text-2xl text-[var(--color-ink)]">{skill.name}</h1>
        <div className="flex items-center gap-3">
          <a
            href={`/admin-preview/skills/${encodedId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-violet-700 hover:underline"
          >
            Preview
          </a>
          <StatusActions
            apiBase={`/api/admin/skills/${encodedId}`}
            status={skill.status}
            title={skill.name}
            listHref="/admin/skills"
          />
        </div>
      </div>
      {skill.status === 'published' && (
        <p className="mb-6 text-sm">
          Live at{' '}
          <a
            href={`/skills/${skill.category}/${skill.slug}`}
            className="text-violet-700 hover:underline"
          >
            /skills/{skill.category}/{skill.slug}
          </a>
        </p>
      )}
      <SkillEditForm
        initial={{
          id: skill.id,
          slug: skill.slug,
          category: skill.category,
          name: skill.name,
          description: skill.description,
          body: skill.body,
        }}
      />
    </div>
  )
}
