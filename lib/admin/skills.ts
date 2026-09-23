import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getCustomCategory } from '../custom-categories'
import { getSkillCategory } from '../skills/categories'
import { rowToSkill, SKILL_COLUMNS } from '../skills/row'
import type { Skill } from '../skills/types'
import { logAdminAction } from './audit'
import { adminPool } from './pg'
import { type ParsedSkillMd, parseSkillMd } from './skill-md-parser'
import { isValidSlugShape } from './slug'
import { readZipEntry } from './zip-reader'

/**
 * Admin write path for `skills` (migration 0007's additive columns:
 * `origin`, `status`, `author_name`). A published admin skill is a row in
 * the exact same table `getSkill`/`searchSkills`/every other read in
 * lib/skills/db.ts already queries — nothing there needed to change to
 * start serving admin content (see migration 0007's own docblock).
 *
 * STORAGE DECISION, a deliberate departure from the plan's original
 * "Supabase Storage bucket" line item: the uploaded .zip's bytes are
 * parsed and discarded, never archived. Two reasons, found only once
 * actually building this:
 *   1. Nothing needs them to persist. This site's existing download
 *      button (SkillCopyBlock.tsx) already regenerates a skill's export
 *      ZIP on demand from its stored `name`/`description`/`body` — the
 *      exact fields extracted from the upload below — for every one of
 *      the 10,000 synced skills already. An admin-published skill needs
 *      those same fields in the same row shape, not a stashed original
 *      file nothing ever reads back.
 *   2. Actually storing raw files would need real write authorization on
 *      Supabase Storage, which (by design — see lib/admin/pg.ts) means
 *      either a service_role key this app deliberately has none of, or a
 *      storage policy letting the public anon key accept uploads — a real
 *      abuse surface for no functional gain. Cheaper AND safer to just
 *      not do it.
 *
 * A .zip is still genuinely required at upload time (per §2's "Upload
 * .zip" requirement) — this only concerns what happens to it after
 * parsing.
 */

const MAX_ZIP_BYTES = 15 * 1024 * 1024 // 15MB — generous for a markdown-only SKILL.md plus a few small reference files, well below anything that would strain a serverless function's request body.

export interface FieldError {
  readonly field: string
  readonly message: string
}
type WriteResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; errors: FieldError[] }

const MetadataSchema = z.object({
  slug: z
    .string()
    .refine(isValidSlugShape, 'Slug must be lowercase-hyphenated, e.g. "my-skill".'),
  category: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
  licenseGated: z.boolean().default(false),
  relatedTools: z.array(z.string().trim().min(1)).default([]),
  relatedPrompts: z.array(z.string().trim().min(1)).default([]),
  authorName: z.string().trim().max(80).optional(),
})
export type SkillMetadataInput = z.infer<typeof MetadataSchema>

/** Validates the .zip itself: present, within size, a real zip containing
 * a parseable SKILL.md. Returns the parsed fields on success. Checked
 * before any DB touch, same "don't blindly trust uploaded file names or
 * contents" rule §37 states — MIME/extension are checked by the Route
 * Handler that receives the multipart upload (see
 * app/api/admin/skills/route.ts) before the bytes ever reach here; this
 * function is the content-level check underneath that. */
export function validateSkillZip(
  zipBytes: Uint8Array,
): { ok: true; parsed: ParsedSkillMd } | { ok: false; errors: FieldError[] } {
  if (zipBytes.byteLength === 0) {
    return {
      ok: false,
      errors: [{ field: 'zip', message: 'The uploaded file is empty.' }],
    }
  }
  if (zipBytes.byteLength > MAX_ZIP_BYTES) {
    return {
      ok: false,
      errors: [
        {
          field: 'zip',
          message: `The .zip is too large (max ${MAX_ZIP_BYTES / 1024 / 1024}MB).`,
        },
      ],
    }
  }
  const entry = readZipEntry(zipBytes, 'SKILL.md')
  if (!entry.ok) {
    return { ok: false, errors: [{ field: 'zip', message: entry.message }] }
  }
  const parsed = parseSkillMd(entry.content)
  if (!parsed.ok) {
    return {
      ok: false,
      errors: [{ field: 'zip', message: `SKILL.md: ${parsed.message}` }],
    }
  }
  return { ok: true, parsed: parsed.value }
}

/** Shape + category-existence validation for the metadata form fields
 * that accompany a .zip upload — separate from `validateSkillZip` so the
 * admin UI can validate the metadata form and the file independently
 * (e.g. re-validate the form on every keystroke without re-parsing the
 * zip each time). */
export async function validateSkillMetadata(
  input: unknown,
): Promise<
  { ok: true; value: SkillMetadataInput } | { ok: false; errors: FieldError[] }
> {
  const result = MetadataSchema.safeParse(input)
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
    getSkillCategory(result.data.category) ??
    (await getCustomCategory('skill', result.data.category))
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

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === '23505'
  )
}

/**
 * Creates a skill as a draft from a validated .zip + metadata. Both must
 * already be validated (`validateSkillZip`/`validateSkillMetadata`) —
 * this function trusts its inputs rather than re-parsing, so a Route
 * Handler can show field-level errors from either check before ever
 * reaching here.
 */
export async function createDraftSkill(
  zipBytes: Uint8Array,
  metadata: unknown,
  actor?: string,
): Promise<WriteResult> {
  const zipResult = validateSkillZip(zipBytes)
  if (!zipResult.ok) return zipResult
  const metaResult = await validateSkillMetadata(metadata)
  if (!metaResult.ok) return metaResult
  const { parsed } = zipResult
  const m = metaResult.value

  let id: string
  try {
    const { rows } = await adminPool().query<{ id: string }>(
      `insert into skills
         (id, category, slug, name, description, body, tags, license, license_gated,
          related_tools, related_prompts, origin, status, author_name, installs)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'admin', 'draft', $12, 0)
       returning id`,
      [
        `admin/${m.category}/${m.slug}`,
        m.category,
        m.slug,
        parsed.name,
        parsed.description ?? '',
        parsed.body,
        m.tags,
        parsed.license ?? null,
        m.licenseGated,
        m.relatedTools,
        m.relatedPrompts,
        m.authorName ?? null,
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
            message: `A skill already exists at "${m.category}/${m.slug}".`,
          },
        ],
      }
    }
    throw error
  }

  await logAdminAction({
    actor,
    action: 'create',
    contentType: 'skill',
    contentId: id,
    contentSlug: m.slug,
  })
  return { ok: true, id, slug: m.slug }
}

interface SkillRow {
  readonly id: string
  readonly slug: string
  readonly status: string
}

async function fetchAdminSkillRow(id: string): Promise<SkillRow | undefined> {
  const { rows } = await adminPool().query<SkillRow>(
    "select id, slug, status from skills where id = $1 and origin = 'admin'",
    [id],
  )
  return rows[0]
}

export async function publishSkill(id: string, actor?: string): Promise<WriteResult> {
  const row = await fetchAdminSkillRow(id)
  if (!row)
    return {
      ok: false,
      errors: [{ field: '(root)', message: 'No admin-authored skill with that id.' }],
    }
  await adminPool().query("update skills set status = 'published' where id = $1", [id])
  await logAdminAction({
    actor,
    action: 'publish',
    contentType: 'skill',
    contentId: id,
    contentSlug: row.slug,
  })
  revalidateTag('skills', 'skillsRegistry')
  return { ok: true, id, slug: row.slug }
}

async function setStatus(
  id: string,
  status: 'unpublished' | 'archived',
  action: 'unpublish' | 'archive',
  actor?: string,
): Promise<WriteResult> {
  const row = await fetchAdminSkillRow(id)
  if (!row)
    return {
      ok: false,
      errors: [{ field: '(root)', message: 'No admin-authored skill with that id.' }],
    }
  await adminPool().query('update skills set status = $2 where id = $1', [id, status])
  await logAdminAction({
    actor,
    action,
    contentType: 'skill',
    contentId: id,
    contentSlug: row.slug,
  })
  revalidateTag('skills', 'skillsRegistry')
  return { ok: true, id, slug: row.slug }
}

export async function unpublishSkill(id: string, actor?: string): Promise<WriteResult> {
  return setStatus(id, 'unpublished', 'unpublish', actor)
}
export async function archiveSkill(id: string, actor?: string): Promise<WriteResult> {
  return setStatus(id, 'archived', 'archive', actor)
}

const UpdateSkillSchema = z.object({
  slug: z
    .string()
    .refine(isValidSlugShape, 'Slug must be lowercase-hyphenated, e.g. "my-skill".'),
  category: z.string().trim().min(1),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(''),
  body: z.string().trim().min(1, 'The SKILL.md content cannot be empty.'),
})
export type SkillUpdateInput = z.infer<typeof UpdateSkillSchema>

/**
 * Edits an admin-authored skill's content at any status — the fields a
 * visitor actually sees or downloads. Status changes stay on their own
 * endpoints, same split as `updatePrompt`. The row `id` never changes, even
 * when slug or category do, so every admin link to it stays valid; the
 * public URL does follow the new slug/category.
 */
export async function updateSkill(
  id: string,
  input: unknown,
  actor?: string,
): Promise<WriteResult> {
  const parsed = UpdateSkillSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(root)',
        message: issue.message,
      })),
    }
  }
  const s = parsed.data
  const category =
    getSkillCategory(s.category) ?? (await getCustomCategory('skill', s.category))
  if (!category) {
    return {
      ok: false,
      errors: [{ field: 'category', message: `Unknown category "${s.category}".` }],
    }
  }

  try {
    const { rowCount } = await adminPool().query(
      `update skills set slug = $2, category = $3, name = $4, description = $5, body = $6
       where id = $1 and origin = 'admin'`,
      [id, s.slug, s.category, s.name, s.description, s.body],
    )
    if (rowCount === 0) {
      return {
        ok: false,
        errors: [{ field: '(root)', message: 'No admin-authored skill with that id.' }],
      }
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        errors: [
          {
            field: 'slug',
            message: `A skill already exists at "${s.category}/${s.slug}".`,
          },
        ],
      }
    }
    throw error
  }

  await logAdminAction({
    actor,
    action: 'update',
    contentType: 'skill',
    contentId: id,
    contentSlug: s.slug,
  })
  revalidateTag('skills', 'skillsRegistry')
  return { ok: true, id, slug: s.slug }
}

/** Permanently removes an admin-authored skill. The `origin = 'admin'`
 * filter means a synced skill can never be deleted from here. */
export async function deleteSkill(id: string, actor?: string): Promise<WriteResult> {
  const row = await fetchAdminSkillRow(id)
  if (!row)
    return {
      ok: false,
      errors: [{ field: '(root)', message: 'No admin-authored skill with that id.' }],
    }
  await adminPool().query("delete from skills where id = $1 and origin = 'admin'", [id])
  await logAdminAction({
    actor,
    action: 'delete',
    contentType: 'skill',
    contentId: id,
    contentSlug: row.slug,
  })
  revalidateTag('skills', 'skillsRegistry')
  return { ok: true, id, slug: row.slug }
}

/** One admin-authored skill in full, any status — what the admin preview
 * page renders through the real `SkillDetailShell`. Goes through
 * `rowToSkill` (the same conversion every public read uses) so the preview
 * can't drift from the live page. `pg` returns `bigint` as a string and
 * `timestamptz` as a Date, where Supabase's REST reads return a number and
 * ISO strings — normalized first so the shape matches exactly. */
export async function getAdminSkill(
  id: string,
): Promise<(Skill & { status: string }) | undefined> {
  const { rows } = await adminPool().query(
    `select ${SKILL_COLUMNS}, status from skills where id = $1 and origin = 'admin'`,
    [id],
  )
  const r = rows[0]
  if (!r) return undefined
  const toIso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v))
  return {
    ...rowToSkill({
      ...r,
      installs: Number(r.installs),
      first_seen_at: toIso(r.first_seen_at),
      last_synced_at: toIso(r.last_synced_at),
    }),
    status: r.status,
  }
}

/** Every admin-authored skill (any status), newest first — the admin
 * list view. Synced skills never appear here; this is specifically the
 * content an admin can actually manage. */
export async function listAdminSkills(): Promise<
  readonly {
    id: string
    slug: string
    category: string
    name: string
    status: string
    updatedAt: string
  }[]
> {
  const { rows } = await adminPool().query(
    "select id, slug, category, name, status, updated_at from skills where origin = 'admin' order by updated_at desc",
  )
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    category: r.category,
    name: r.name,
    status: r.status,
    updatedAt: r.updated_at,
  }))
}
