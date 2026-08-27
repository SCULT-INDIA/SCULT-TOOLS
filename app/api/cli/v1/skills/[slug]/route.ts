import { cliJson, withCliTracking } from '@/lib/cli/track'
import { getSkillBySlug } from '@/lib/skills/db'
import type { SkillExportFormat } from '@/lib/skills/export'
import { exportSkillAs, SKILL_EXPORT_FORMATS } from '@/lib/skills/export'

/**
 * GET /api/cli/v1/skills/<slug>[?format=skill-md|agents-md|cursorrules|copilot-instructions]
 *
 * One skill in full for the Scult CLI, rendered in the requested export
 * format (default `skill-md`). License-gated skills return the source URL
 * instead of the body — the same rule the site's SkillCopyBlock and the MCP
 * server's get_skill enforce.
 */
export const GET = withCliTracking('skills_get', async (request) => {
  const url = new URL(request.url)
  const slug = decodeURIComponent(url.pathname.split('/').pop() ?? '').slice(0, 200)
  const formatParam = url.searchParams.get('format') ?? 'skill-md'
  const known = SKILL_EXPORT_FORMATS.find((f) => f.format === formatParam)
  if (!known) {
    return cliJson(
      {
        error: `Unknown format "${formatParam}". One of: ${SKILL_EXPORT_FORMATS.map((f) => f.format).join(', ')}.`,
      },
      400,
    )
  }

  const skill = await getSkillBySlug(slug)
  if (skill === undefined) {
    return cliJson({ error: `No skill with slug "${slug}".` }, 404)
  }

  if (skill.licenseGated) {
    return cliJson({
      skill: {
        slug: skill.slug,
        name: skill.name,
        description: skill.description,
        category: skill.category,
        licenseGated: true,
        note: "This skill's source license is not confirmed to permit redistribution, so its body is withheld here. View it at the source instead.",
        sourceUrl: skill.sourceUrl,
      },
    })
  }

  return cliJson({
    skill: {
      slug: skill.slug,
      name: skill.name,
      description: skill.description,
      category: skill.category,
      licenseGated: false,
      license: skill.license,
      installs: skill.installs,
      source: `${skill.sourceOwner}/${skill.sourceRepo}`,
      sourceUrl: skill.sourceUrl,
      format: known.format as SkillExportFormat,
      filename: known.filename,
      content: exportSkillAs(skill, known.format),
    },
  })
})
