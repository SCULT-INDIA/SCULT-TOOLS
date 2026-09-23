import { notFound } from 'next/navigation'
import { getAdminPrompt } from '@/lib/admin/prompts'
import { requireAdminPageSession } from '@/lib/admin/require-session'
import { StatusActions } from '../../StatusActions'
import { PromptForm } from '../PromptForm'

/** `instant = false` didn't cascade down from `app/admin/layout.tsx`'s own
 * copy — each /admin/* page still needs its own. See that file's
 * docblock for the full explanation. */
export const instant = false

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminPageSession()
  const { id } = await params
  const prompt = await getAdminPrompt(decodeURIComponent(id))
  if (!prompt) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-bold text-2xl text-[var(--color-ink)]">{prompt.title}</h1>
        <div className="flex items-center gap-3">
          <a
            href={`/admin-preview/prompts/${encodeURIComponent(prompt.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-violet-700 hover:underline"
          >
            Preview
          </a>
          <StatusActions
            apiBase={`/api/admin/prompts/${encodeURIComponent(prompt.id)}`}
            status={prompt.status}
            title={prompt.title}
            listHref="/admin/prompts"
          />
        </div>
      </div>
      {prompt.status === 'published' && (
        <p className="mb-6 text-sm">
          Live at{' '}
          <a
            href={`/prompts/${prompt.category}/${prompt.slug}`}
            className="text-violet-700 hover:underline"
          >
            /prompts/{prompt.category}/{prompt.slug}
          </a>
        </p>
      )}
      <PromptForm initial={prompt} />
    </div>
  )
}
