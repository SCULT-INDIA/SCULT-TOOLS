import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createZip } from '../skills/zip'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))
const getCustomCategoryMock = vi.fn().mockResolvedValue(undefined)
vi.mock('../custom-categories', () => ({ getCustomCategory: getCustomCategoryMock }))

const REAL_CATEGORY = 'testing'

function validZip(overrides?: { name?: string; description?: string }) {
  return createZip([
    {
      name: 'SKILL.md',
      content: [
        '---',
        `name: "${overrides?.name ?? 'my-skill'}"`,
        `description: "${overrides?.description ?? 'Does a thing.'}"`,
        'license: "MIT"',
        '---',
        '',
        '# My Skill',
        '',
        'Body content here.',
      ].join('\n'),
    },
  ])
}

const VALID_METADATA = {
  slug: 'my-skill',
  category: REAL_CATEGORY,
  tags: ['testing'],
}

describe('validateSkillZip', () => {
  it('accepts a well-formed zip and returns the parsed SKILL.md fields', async () => {
    const { validateSkillZip } = await import('./skills')
    const result = validateSkillZip(validZip())
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.parsed.name).toBe('my-skill')
      expect(result.parsed.description).toBe('Does a thing.')
      expect(result.parsed.license).toBe('MIT')
    }
  })

  it('rejects an empty upload', async () => {
    const { validateSkillZip } = await import('./skills')
    const result = validateSkillZip(new Uint8Array(0))
    expect(result.ok).toBe(false)
  })

  it('rejects a zip with no SKILL.md inside', async () => {
    const { validateSkillZip } = await import('./skills')
    const zip = createZip([{ name: 'README.md', content: 'not a skill' }])
    const result = validateSkillZip(zip)
    expect(result.ok).toBe(false)
  })

  it('rejects a SKILL.md with no frontmatter, surfacing the parser message', async () => {
    const { validateSkillZip } = await import('./skills')
    const zip = createZip([{ name: 'SKILL.md', content: '# No frontmatter here' }])
    const result = validateSkillZip(zip)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.message).toContain('SKILL.md:')
  })

  it('rejects a zip over the size cap', async () => {
    const { validateSkillZip } = await import('./skills')
    const oversized = new Uint8Array(15 * 1024 * 1024 + 1)
    const result = validateSkillZip(oversized)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.message).toContain('too large')
  })
})

describe('validateSkillMetadata', () => {
  it('accepts valid metadata against a real built-in skill category', async () => {
    const { validateSkillMetadata } = await import('./skills')
    const result = await validateSkillMetadata(VALID_METADATA)
    expect(result.ok).toBe(true)
  })

  it('repairs a slug carrying a Mac smart dash instead of rejecting it', async () => {
    const { validateSkillMetadata } = await import('./skills')
    const result = await validateSkillMetadata({
      ...VALID_METADATA,
      slug: 'ats–friendly-resume-audit-skill',
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.slug).toBe('ats-friendly-resume-audit-skill')
  })

  it('rejects a slug with nothing usable in it', async () => {
    const { validateSkillMetadata } = await import('./skills')
    const result = await validateSkillMetadata({ ...VALID_METADATA, slug: '★★★' })
    expect(result.ok).toBe(false)
  })

  it('rejects an unknown category after checking custom_categories', async () => {
    getCustomCategoryMock.mockResolvedValueOnce(undefined)
    const { validateSkillMetadata } = await import('./skills')
    const result = await validateSkillMetadata({
      ...VALID_METADATA,
      category: 'not-real',
    })
    expect(result.ok).toBe(false)
    expect(getCustomCategoryMock).toHaveBeenCalledWith('skill', 'not-real')
  })

  it('accepts a category found only in custom_categories', async () => {
    getCustomCategoryMock.mockResolvedValueOnce({ slug: 'my-custom' })
    const { validateSkillMetadata } = await import('./skills')
    const result = await validateSkillMetadata({
      ...VALID_METADATA,
      category: 'my-custom',
    })
    expect(result.ok).toBe(true)
  })
})

describe('createDraftSkill / status transitions', () => {
  const queryMock = vi.fn()

  beforeEach(() => {
    queryMock.mockReset()
    vi.doMock('./pg', () => ({ adminPool: () => ({ query: queryMock }) }))
  })

  afterEach(() => {
    vi.doUnmock('./pg')
    vi.resetModules()
  })

  it('inserts with origin=admin, status=draft, installs=0', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'admin/testing/my-skill' }] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { createDraftSkill } = await import('./skills')
    const result = await createDraftSkill(validZip(), VALID_METADATA)
    expect(result).toEqual({ ok: true, id: 'admin/testing/my-skill', slug: 'my-skill' })
    const insertSql = queryMock.mock.calls[0]?.[0] as string
    expect(insertSql).toContain("'admin', 'draft'")
  })

  it('reports a duplicate (category, slug) as a slug field error', async () => {
    vi.resetModules()
    queryMock.mockRejectedValueOnce({ code: '23505' })
    const { createDraftSkill } = await import('./skills')
    const result = await createDraftSkill(validZip(), VALID_METADATA)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('slug')
  })

  it('never touches the database when the zip itself is invalid', async () => {
    vi.resetModules()
    const { createDraftSkill } = await import('./skills')
    const badZip = createZip([{ name: 'README.md', content: 'no skill' }])
    await createDraftSkill(badZip, VALID_METADATA)
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('never touches the database when the metadata is invalid', async () => {
    vi.resetModules()
    const { createDraftSkill } = await import('./skills')
    await createDraftSkill(validZip(), { ...VALID_METADATA, slug: '★★★' })
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('publishSkill only matches an admin-authored row — a synced skill id is refused', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [] }) // the `and origin = 'admin'` filter excludes it
    const { publishSkill } = await import('./skills')
    const result = await publishSkill('some-synced/repo/skill')
    expect(result.ok).toBe(false)
  })

  it('publishSkill sets status=published for a real admin-authored row', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 's1', slug: 'x', status: 'draft' }] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { publishSkill } = await import('./skills')
    const result = await publishSkill('s1')
    expect(result).toEqual({ ok: true, id: 's1', slug: 'x' })
    expect(queryMock.mock.calls[1]?.[0]).toContain("status = 'published'")
  })

  it('unpublishSkill and archiveSkill set the corresponding status', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 's1', slug: 'x' }] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { unpublishSkill } = await import('./skills')
    const result = await unpublishSkill('s1')
    expect(result).toEqual({ ok: true, id: 's1', slug: 'x' })
    expect(queryMock.mock.calls[1]?.[1]).toEqual(['s1', 'unpublished'])
  })

  it('getAdminSkill normalizes pg bigint/timestamptz values into the public Skill shape', async () => {
    vi.resetModules()
    const seen = new Date('2026-09-23T10:00:00.000Z')
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'admin/testing/my-skill',
          slug: 'my-skill',
          category: 'testing',
          name: 'My Skill',
          description: 'Does a thing.',
          body: '# My Skill',
          tags: ['testing'],
          license: 'MIT',
          license_gated: false,
          source_owner: null,
          source_repo: null,
          source_skill_id: null,
          source_url: null,
          installs: '0',
          first_seen_at: seen,
          last_synced_at: seen,
          related_tools: [],
          related_prompts: [],
          status: 'draft',
        },
      ],
    })
    const { getAdminSkill } = await import('./skills')
    const skill = await getAdminSkill('admin/testing/my-skill')
    expect(skill?.installs).toBe(0)
    expect(skill?.firstSeenAt).toBe('2026-09-23T10:00:00.000Z')
    expect(skill?.status).toBe('draft')
    expect(queryMock.mock.calls[0]?.[0]).toContain("origin = 'admin'")
  })

  const EDIT = {
    name: 'My Skill',
    slug: 'my-skill',
    category: REAL_CATEGORY,
    description: 'Does a thing.',
    body: '# My Skill\n\nUpdated body.',
  }

  it('updateSkill writes the edited fields, only for an admin-authored row, and logs it', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rowCount: 1, rows: [] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { updateSkill } = await import('./skills')
    const result = await updateSkill('admin/testing/my-skill', EDIT, 'connect@scult.in')
    expect(result).toEqual({ ok: true, id: 'admin/testing/my-skill', slug: 'my-skill' })
    const [sql, values] = queryMock.mock.calls[0] ?? []
    expect(sql).toContain("origin = 'admin'")
    expect(values).toEqual([
      'admin/testing/my-skill',
      'my-skill',
      REAL_CATEGORY,
      'My Skill',
      'Does a thing.',
      '# My Skill\n\nUpdated body.',
    ])
    expect(queryMock.mock.calls[1]?.[1]?.[1]).toBe('update')
  })

  it('updateSkill rejects an empty SKILL.md body without touching the database', async () => {
    vi.resetModules()
    const { updateSkill } = await import('./skills')
    const result = await updateSkill('s1', { ...EDIT, body: '   ' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('body')
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('updateSkill rejects an unknown category', async () => {
    vi.resetModules()
    const { updateSkill } = await import('./skills')
    const result = await updateSkill('s1', { ...EDIT, category: 'not-a-category' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('category')
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('updateSkill reports a slug collision as a slug field error', async () => {
    vi.resetModules()
    queryMock.mockRejectedValueOnce({ code: '23505' })
    const { updateSkill } = await import('./skills')
    const result = await updateSkill('s1', EDIT)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('slug')
  })

  it('updateSkill reports a missing or synced id instead of silently succeeding', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rowCount: 0, rows: [] })
    const { updateSkill } = await import('./skills')
    const result = await updateSkill('some-synced/repo/skill', EDIT)
    expect(result.ok).toBe(false)
  })

  it('deleteSkill removes an admin-authored row and logs the deletion', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 's1', slug: 'x', status: 'draft' }] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { deleteSkill } = await import('./skills')
    const result = await deleteSkill('s1')
    expect(result).toEqual({ ok: true, id: 's1', slug: 'x' })
    expect(queryMock.mock.calls[1]?.[0]).toContain('delete from skills')
    expect(queryMock.mock.calls[1]?.[0]).toContain("origin = 'admin'")
    expect(queryMock.mock.calls[2]?.[1]?.[1]).toBe('delete')
  })

  it('deleteSkill never deletes a synced skill', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { deleteSkill } = await import('./skills')
    const result = await deleteSkill('some-synced/repo/skill')
    expect(result.ok).toBe(false)
    expect(queryMock).toHaveBeenCalledTimes(1)
  })

  it('getAdminSkill returns undefined for an unknown or synced id', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { getAdminSkill } = await import('./skills')
    expect(await getAdminSkill('nope')).toBeUndefined()
  })
})
