import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getCustomCategory } from '../custom-categories'
import { getPromptCategory } from '../prompts/categories'
import { logAdminAction } from './audit'
import { adminPool } from './pg'
import { isValidSlugShape } from './slug'

/**
 * Admin write path for `prompts` (migration 0007) — the counterpart to
 * lib/prompts/db.ts's public reads. Every function here goes through
 * lib/admin/pg.ts's elevated connection; nothing here is importable from
 * a client component or reachable without a checked admin session (every
 * caller is a Route Handler that already called requireAdminSession()).
 *
 * Schema mirrors lib/prompts/types.ts's `Prompt` interface field for
 * field — not the simplified example schema from the original planning
 * doc — because the existing PromptDetailShell template (unchanged by
 * this work) renders every one of these fields already, and an
 * admin-published prompt needs to be indistinguishable from a compiled
 * one once it reaches that template.
 */

const VariableSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  example: z.string().trim().min(1),
  required: z.boolean(),
})

const ExampleImageSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().min(1),
  aspectRatio: z.enum(['9:16', '3:4', '4:3', '16:9']).optional(),
  modelCredit: z
    .object({
      name: z.string().trim().min(1),
      instagram: z.string().trim().optional(),
      linkedin: z.string().trim().optional(),
    })
    .optional(),
})

const VideoPromptSchema = z.object({
  promptText: z.string().trim().min(1),
  targetTools: z.array(z.string().trim().min(1)),
})

const VerificationSchema = z.object({
  tool: z.string().trim().min(1),
  version: z.string().trim().min(1),
  date: z.string().trim().min(1),
})

const ChangelogEntrySchema = z.object({
  date: z.string().trim().min(1),
  note: z.string().trim().min(1),
})

export const PromptInputSchema = z.object({
  slug: z
    .string()
    .refine(isValidSlugShape, 'Slug must be lowercase-hyphenated, e.g. "my-prompt".'),
  category: z.string().trim().min(1),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(400),
  promptText: z.string().trim().min(1),
  variables: z.array(VariableSchema).default([]),
  targetTools: z.array(z.string().trim().min(1)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  whyItWorks: z.string().trim().min(1),
  exampleOutput: z.string().trim().optional(),
  exampleImage: ExampleImageSchema.optional(),
  videoPrompt: VideoPromptSchema.optional(),
  // Required to PUBLISH (checked separately, below), not to save a draft
  // — an admin should be able to save partial work before a verification
  // pass is done.
  verifiedAgainst: z.array(VerificationSchema).default([]),
  changelog: z.array(ChangelogEntrySchema).default([]),
  serviceTarget: z.string().trim().optional(),
  relatedToolSlug: z.string().trim().optional(),
  authorName: z.string().trim().max(80).optional(),
})
export type PromptInput = z.infer<typeof PromptInputSchema>

export interface FieldError {
  readonly field: string
  readonly message: string
}
type ValidationResult =
  | { ok: true; value: PromptInput }
  | { ok: false; errors: FieldError[] }

/** Shape validation plus the category cross-check — checked against BOTH
 * the built-in TypeScript category list and any admin-created
 * `custom_categories` row, exactly how a route resolving `/prompts/<cat>`
 * will look it up (see getPromptCategory's own updated docblock). */
export async function validatePromptInput(input: unknown): Promise<ValidationResult> {
  const result = PromptInputSchema.safeParse(input)
  if (!result.success) {
    return {
      ok: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(root)',
        message: issue.message,
      })),
    }
  }
  const category =
    getPromptCategory(result.data.category) ??
    (await getCustomCategory('prompt', result.data.category))
  if (!category) {
    return {
      ok: false,
      errors: [
        { field: 'category', message: `Unknown category "${result.data.category}".` },
      ],
    }
  }
  return { ok: true, value: result.data }
}

/** §9's rule enforced here, at publish time specifically — a draft can be
 * saved with an empty verifiedAgainst, but publishing without at least
 * one real verification is exactly the "unexplained prompt selling an
 * illusion" the existing registry's own type docblock warns against. */
function publishReadinessErrors(p: PromptInput): FieldError[] {
  const errors: FieldError[] = []
  if (p.verifiedAgainst.length === 0) {
    errors.push({
      field: 'verifiedAgainst',
      message: 'At least one verification is required to publish.',
    })
  }
  return errors
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === '23505'
  )
}

type WriteResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; errors: FieldError[] }

/** Creates a prompt as a draft — always draft, never published, on
 * create; publishing is `publishPrompt`'s own explicit, separate step
 * (§11's draft -> preview -> publish flow, not a single form checkbox). */
export async function createDraftPrompt(
  input: unknown,
  actor?: string,
): Promise<WriteResult> {
  const validated = await validatePromptInput(input)
  if (!validated.ok) return validated
  const p = validated.value

  let id: string
  try {
    const { rows } = await adminPool().query<{ id: string }>(
      `insert into prompts
         (slug, category, title, description, prompt_text, variables, target_tools, tags,
          why_it_works, example_output, example_image, video_prompt, verified_against,
          changelog, service_target, related_tool_slug, author_name, status)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'draft')
       returning id`,
      [
        p.slug,
        p.category,
        p.title,
        p.description,
        p.promptText,
        JSON.stringify(p.variables),
        p.targetTools,
        p.tags,
        p.whyItWorks,
        p.exampleOutput ?? null,
        p.exampleImage ? JSON.stringify(p.exampleImage) : null,
        p.videoPrompt ? JSON.stringify(p.videoPrompt) : null,
        JSON.stringify(p.verifiedAgainst),
        JSON.stringify(p.changelog),
        p.serviceTarget ?? null,
        p.relatedToolSlug ?? null,
        p.authorName ?? null,
      ],
    )
    id = rows[0]?.id as string
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        errors: [
          {
            field: 'slug',
            message: `A prompt already exists at "${p.category}/${p.slug}".`,
          },
        ],
      }
    }
    throw error
  }

  await logAdminAction({
    actor,
    action: 'create',
    contentType: 'prompt',
    contentId: id,
    contentSlug: p.slug,
  })
  return { ok: true, id, slug: p.slug }
}

/** Edits an existing prompt's content, at any status. Does not change
 * status — use `publishPrompt`/`unpublishPrompt`/`archivePrompt` for that,
 * so an edit and a status change are always two distinct, individually
 * audited actions. */
export async function updatePrompt(
  id: string,
  input: unknown,
  actor?: string,
): Promise<WriteResult> {
  const validated = await validatePromptInput(input)
  if (!validated.ok) return validated
  const p = validated.value

  try {
    const { rowCount } = await adminPool().query(
      `update prompts set
         slug = $2, category = $3, title = $4, description = $5, prompt_text = $6,
         variables = $7, target_tools = $8, tags = $9, why_it_works = $10,
         example_output = $11, example_image = $12, video_prompt = $13,
         verified_against = $14, changelog = $15, service_target = $16,
         related_tool_slug = $17, author_name = $18
       where id = $1`,
      [
        id,
        p.slug,
        p.category,
        p.title,
        p.description,
        p.promptText,
        JSON.stringify(p.variables),
        p.targetTools,
        p.tags,
        p.whyItWorks,
        p.exampleOutput ?? null,
        p.exampleImage ? JSON.stringify(p.exampleImage) : null,
        p.videoPrompt ? JSON.stringify(p.videoPrompt) : null,
        JSON.stringify(p.verifiedAgainst),
        JSON.stringify(p.changelog),
        p.serviceTarget ?? null,
        p.relatedToolSlug ?? null,
        p.authorName ?? null,
      ],
    )
    if (rowCount === 0) {
      return {
        ok: false,
        errors: [{ field: '(root)', message: 'No prompt with that id.' }],
      }
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        errors: [
          {
            field: 'slug',
            message: `A prompt already exists at "${p.category}/${p.slug}".`,
          },
        ],
      }
    }
    throw error
  }

  await logAdminAction({
    actor,
    action: 'update',
    contentType: 'prompt',
    contentId: id,
    contentSlug: p.slug,
  })
  revalidateTag('prompts', 'skillsRegistry')
  return { ok: true, id, slug: p.slug }
}

interface PromptRow {
  readonly id: string
  readonly slug: string
  readonly category: string
  readonly title: string
  readonly status: string
  readonly variables: unknown
  readonly verified_against: unknown
}

async function fetchPromptRow(id: string): Promise<PromptRow | undefined> {
  const { rows } = await adminPool().query<PromptRow>(
    'select id, slug, category, title, status, variables, verified_against from prompts where id = $1',
    [id],
  )
  return rows[0]
}

/** draft/unpublished/archived -> published. Refuses (rather than silently
 * publishing something incomplete) when publish-readiness fails — see
 * `publishReadinessErrors`. Sets `published_at` only the first time a
 * prompt is published, so re-publishing after an unpublish doesn't reset
 * its original publish date. */
export async function publishPrompt(id: string, actor?: string): Promise<WriteResult> {
  const row = await fetchPromptRow(id)
  if (!row)
    return {
      ok: false,
      errors: [{ field: '(root)', message: 'No prompt with that id.' }],
    }

  const readinessErrors = publishReadinessErrors({
    verifiedAgainst: (row.verified_against as unknown[] | null) ?? [],
  } as PromptInput)
  if (readinessErrors.length > 0) return { ok: false, errors: readinessErrors }

  await adminPool().query(
    `update prompts set status = 'published', published_at = coalesce(published_at, now()) where id = $1`,
    [id],
  )
  await logAdminAction({
    actor,
    action: 'publish',
    contentType: 'prompt',
    contentId: id,
    contentSlug: row.slug,
  })
  revalidateTag('prompts', 'skillsRegistry')
  return { ok: true, id, slug: row.slug }
}

async function setStatus(
  id: string,
  status: 'unpublished' | 'archived',
  action: 'unpublish' | 'archive',
  actor?: string,
): Promise<WriteResult> {
  const row = await fetchPromptRow(id)
  if (!row)
    return {
      ok: false,
      errors: [{ field: '(root)', message: 'No prompt with that id.' }],
    }
  await adminPool().query('update prompts set status = $2 where id = $1', [id, status])
  await logAdminAction({
    actor,
    action,
    contentType: 'prompt',
    contentId: id,
    contentSlug: row.slug,
  })
  revalidateTag('prompts', 'skillsRegistry')
  return { ok: true, id, slug: row.slug }
}

export async function unpublishPrompt(id: string, actor?: string): Promise<WriteResult> {
  return setStatus(id, 'unpublished', 'unpublish', actor)
}

export async function archivePrompt(id: string, actor?: string): Promise<WriteResult> {
  return setStatus(id, 'archived', 'archive', actor)
}

/** Permanently removes a prompt row. Unlike status changes, there is no
 * undo — the admin UI is expected to confirm with the user before ever
 * calling this. `admin_audit_log.content_id` is a plain text column, not
 * a foreign key to `prompts.id` (see migration 0007), so the audit trail
 * survives the delete intact; the row is fetched and logged BEFORE the
 * delete for exactly that reason — there is nothing left to join against
 * afterward. */
export async function deletePrompt(id: string, actor?: string): Promise<WriteResult> {
  const row = await fetchPromptRow(id)
  if (!row)
    return {
      ok: false,
      errors: [{ field: '(root)', message: 'No prompt with that id.' }],
    }
  await adminPool().query('delete from prompts where id = $1', [id])
  await logAdminAction({
    actor,
    action: 'delete',
    contentType: 'prompt',
    contentId: id,
    contentSlug: row.slug,
  })
  revalidateTag('prompts', 'skillsRegistry')
  return { ok: true, id, slug: row.slug }
}

/** One prompt's full editable content, for the admin edit form — every
 * column `updatePrompt` writes, shaped back into `PromptInput` so the form
 * can round-trip it through the same PATCH endpoint unchanged. */
export async function getAdminPrompt(
  id: string,
): Promise<(PromptInput & { id: string; status: string }) | undefined> {
  const { rows } = await adminPool().query(
    `select id, slug, category, title, description, prompt_text, variables, target_tools, tags,
            why_it_works, example_output, example_image, video_prompt, verified_against,
            changelog, service_target, related_tool_slug, author_name, status
       from prompts where id = $1`,
    [id],
  )
  const r = rows[0]
  if (!r) return undefined
  return {
    id: r.id,
    slug: r.slug,
    category: r.category,
    title: r.title,
    description: r.description,
    promptText: r.prompt_text,
    variables: r.variables ?? [],
    targetTools: r.target_tools ?? [],
    tags: r.tags ?? [],
    whyItWorks: r.why_it_works,
    exampleOutput: r.example_output ?? undefined,
    exampleImage: r.example_image ?? undefined,
    videoPrompt: r.video_prompt ?? undefined,
    verifiedAgainst: r.verified_against ?? [],
    changelog: r.changelog ?? [],
    serviceTarget: r.service_target ?? undefined,
    relatedToolSlug: r.related_tool_slug ?? undefined,
    authorName: r.author_name ?? undefined,
    status: r.status,
  }
}

/** All prompts, any status — the admin list view. `status` narrows it;
 * omitted returns everything, newest first. */
export async function listAdminPrompts(status?: string): Promise<
  readonly {
    id: string
    slug: string
    category: string
    title: string
    status: string
    updatedAt: string
  }[]
> {
  const { rows } = await adminPool().query(
    status
      ? 'select id, slug, category, title, status, updated_at from prompts where status = $1 order by updated_at desc'
      : 'select id, slug, category, title, status, updated_at from prompts order by updated_at desc',
    status ? [status] : [],
  )
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    category: r.category,
    title: r.title,
    status: r.status,
    updatedAt: r.updated_at,
  }))
}
