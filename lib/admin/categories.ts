import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { logAdminAction } from './audit'
import { adminPool } from './pg'
import { isValidSlugShape } from './slug'

/**
 * Admin-side create for `custom_categories` — the write half of
 * lib/custom-categories.ts. Reading a category (for the site, or for the
 * admin's own picker UI) always goes through that public, anon-key module;
 * only creation goes through the elevated connection here.
 */

const TileSchema = z.enum(['yellow', 'blue', 'lavender', 'green'])

export const CreateCategorySchema = z.object({
  contentType: z.enum(['prompt', 'skill']),
  slug: z
    .string()
    .refine(isValidSlugShape, 'Slug must be lowercase-hyphenated, e.g. "my-category".'),
  name: z.string().trim().min(1).max(80),
  blurb: z.string().trim().min(1).max(240),
  intro: z.string().trim().min(1).max(2000),
  icon: z.string().trim().min(1),
  // A data: URL for an admin-uploaded logo image — see this file's
  // `createCustomCategory` docblock and migration 0010 for why this lives
  // directly in Postgres rather than a Storage bucket. Capped well above
  // any reasonable small icon/logo image but far below anything that would
  // strain a request body or bloat the table.
  logoDataUrl: z.string().trim().min(1).max(2_000_000).optional(),
  tile: TileSchema,
  // Only meaningful for contentType 'prompt'. No longer required at
  // create time — the admin form intentionally doesn't ask for it
  // (simplicity over letting every category pick a nav grouping), and
  // lib/prompts/category-resolver.ts's read path already treats a missing
  // group as 'development'; `createCustomCategory` below writes that same
  // default explicitly so the stored row and the read-time fallback agree.
  group: z.string().trim().min(1).max(40).optional(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  serviceTarget: z.string().trim().min(1).optional(),
  contentBoundary: z.string().trim().min(1).max(2000).optional(),
})
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>

export interface CategoryValidationError {
  readonly field: string
  readonly message: string
}

/** Parses and validates without writing — the admin UI's "check before
 * you submit" path, and what `createCustomCategory` itself calls first. */
export function validateCategory(
  input: unknown,
):
  | { ok: true; value: CreateCategoryInput }
  | { ok: false; errors: CategoryValidationError[] } {
  const result = CreateCategorySchema.safeParse(input)
  if (result.success) return { ok: true, value: result.data }
  return {
    ok: false,
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    })),
  }
}

/**
 * Creates a custom category, or reports the exact field that's wrong —
 * per §10's "DO NOT PUBLISH; show the exact field that needs correction"
 * rule. A duplicate (content_type, slug) is reported the same way (as a
 * `slug` field error), not as an unhandled DB exception.
 */
export async function createCustomCategory(
  input: unknown,
  actor?: string,
): Promise<
  { ok: true; slug: string } | { ok: false; errors: CategoryValidationError[] }
> {
  const validated = validateCategory(input)
  if (!validated.ok) return validated
  const c = validated.value

  const group = c.contentType === 'prompt' ? (c.group ?? 'development') : null

  try {
    await adminPool().query(
      `insert into custom_categories
         (content_type, slug, name, blurb, intro, icon, logo_data_url, tile, "group", tier, service_target, content_boundary)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        c.contentType,
        c.slug,
        c.name,
        c.blurb,
        c.intro,
        c.icon,
        c.logoDataUrl ?? null,
        c.tile,
        group,
        c.tier ?? null,
        c.serviceTarget ?? null,
        c.contentBoundary ?? null,
      ],
    )
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        errors: [
          {
            field: 'slug',
            message: `A ${c.contentType} category with slug "${c.slug}" already exists.`,
          },
        ],
      }
    }
    throw error
  }

  await logAdminAction({
    actor,
    action: 'create',
    contentType: 'category',
    contentId: c.slug,
    contentSlug: c.slug,
    details: { categoryContentType: c.contentType, name: c.name },
  })
  // Both the public read path (lib/custom-categories.ts) and any admin
  // picker built on it share this tag — a brand-new category is visible
  // to the next request instead of waiting out cacheLife('skillsRegistry')'s
  // full window. The second argument must name the same cache profile the
  // tagged reads used (Next 16's Cache Components requires it — a plain
  // `revalidateTag(tag)` is a type error).
  revalidateTag('custom-categories', 'skillsRegistry')

  return { ok: true, slug: c.slug }
}

/** Postgres unique_violation is SQLSTATE 23505 — checked structurally
 * rather than by message text, which varies by locale/driver version. */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === '23505'
  )
}
