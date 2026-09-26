import { NextResponse } from 'next/server'
import { getSessionEmail } from '@/lib/admin/auth'
import { adminRoute } from '@/lib/admin/route'
import { createDraftSkill, listAdminSkills } from '@/lib/admin/skills'

/** GET /api/admin/skills — every admin-authored skill (any status),
 * newest first. Synced skills never appear here. */
export const GET = adminRoute(async () => {
  const skills = await listAdminSkills()
  return NextResponse.json({ skills })
})

/**
 * POST /api/admin/skills — creates a skill as a draft from an uploaded
 * `.zip` plus metadata. `multipart/form-data`: a `zip` file field and a
 * `metadata` field holding the JSON-encoded `SkillMetadataInput`
 * (lib/admin/skills.ts).
 *
 * MIME/extension are checked here, at the HTTP boundary, before the bytes
 * ever reach lib/admin/skills.ts's content-level ZIP validation (§37's
 * "don't blindly trust an uploaded file's name or contents" — both layers
 * matter: a `.zip` extension on a file that isn't really one is still
 * caught downstream by `validateSkillZip` actually trying to parse it).
 */
export const POST = adminRoute(async (request) => {
  const form = await request.formData().catch(() => null)
  if (!form) {
    return NextResponse.json(
      { errors: [{ field: '(root)', message: 'Expected multipart/form-data.' }] },
      { status: 400 },
    )
  }

  const zipFile = form.get('zip')
  if (!(zipFile instanceof File)) {
    return NextResponse.json(
      { errors: [{ field: 'zip', message: 'A .zip file is required.' }] },
      { status: 400 },
    )
  }
  const nameLooksLikeZip = zipFile.name.toLowerCase().endsWith('.zip')
  const mimeLooksLikeZip =
    zipFile.type === '' ||
    zipFile.type === 'application/zip' ||
    zipFile.type === 'application/x-zip-compressed'
  if (!nameLooksLikeZip || !mimeLooksLikeZip) {
    return NextResponse.json(
      { errors: [{ field: 'zip', message: 'File must be a .zip archive.' }] },
      { status: 400 },
    )
  }

  const metadataRaw = form.get('metadata')
  if (typeof metadataRaw !== 'string') {
    return NextResponse.json(
      { errors: [{ field: '(root)', message: 'metadata field is required.' }] },
      { status: 400 },
    )
  }
  let metadata: unknown
  try {
    metadata = JSON.parse(metadataRaw)
  } catch {
    return NextResponse.json(
      { errors: [{ field: '(root)', message: 'metadata is not valid JSON.' }] },
      { status: 400 },
    )
  }

  const zipBytes = new Uint8Array(await zipFile.arrayBuffer())
  const result = await createDraftSkill(zipBytes, metadata, await getSessionEmail())
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ id: result.id, slug: result.slug }, { status: 201 })
})
