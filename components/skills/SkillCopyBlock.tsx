'use client'

import { Check, Copy, Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { trackSkillEvent } from '@/lib/analytics'
import { downloadBinaryFile } from '@/lib/download-file'
import {
  buildInstallMd,
  exportSkillAs,
  SKILL_EXPORT_FORMATS,
  type SkillExportFormat,
} from '@/lib/skills/export'
import type { Skill } from '@/lib/skills/types'
import { createZip } from '@/lib/skills/zip'

/**
 * The skill's real content, styled as the same dark editor card
 * `PromptCopyBlock` uses so the two libraries read as one visual system —
 * but simpler: a skill has no `{{variable}}` slots to fill in, so instead of
 * a customize side-panel, the toolbar carries the export-format picker
 * (`lib/skills/export.ts`'s pure formatting transform, not per-agent
 * authored content).
 */
export function SkillCopyBlock({
  skill,
  licenseGated,
}: {
  skill: Skill
  licenseGated: boolean
}) {
  const [format, setFormat] = useState<SkillExportFormat>('skill-md')
  const [copied, setCopied] = useState(false)

  const text = useMemo(() => exportSkillAs(skill, format), [skill, format])
  const activeFormat = SKILL_EXPORT_FORMATS.find((f) => f.format === format)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackSkillEvent(skill.category, skill.slug, 'copy_skill', { format })
    } catch {
      // Clipboard API can fail (permissions, insecure context) — the text
      // is still fully selectable/visible below, so nothing is truly lost.
    }
  }

  /**
   * The real "Skill Page → Download ZIP → Install/Use" flow. The skill's
   * own sync only ever stores one file (SKILL.md's body — see the `Skill`
   * type's docblock), so a multi-file package would have to invent
   * structure that doesn't exist; instead the ZIP bundles the real
   * `SKILL.md` alongside a genuinely useful `INSTALL.md` this site
   * generates (real installation mechanics, not fabricated per-skill
   * content — see `buildInstallMd`'s own docblock).
   */
  function handleDownloadZip() {
    const zip = createZip([
      { name: 'SKILL.md', content: exportSkillAs(skill, 'skill-md') },
      { name: 'INSTALL.md', content: buildInstallMd(skill) },
    ])
    downloadBinaryFile(`${skill.slug}.zip`, zip, 'application/zip')
    trackSkillEvent(skill.category, skill.slug, 'download_zip')
  }

  if (licenseGated) {
    return (
      <div className="rounded-panel border border-ink bg-offwhite p-6 text-center">
        <p className="text-[15px] text-ink-muted leading-6">
          This skill's source license couldn't be confirmed as safe to mirror here, so it
          isn't inlined. View the full skill directly on its source repository.
        </p>
        <TrackedLink
          href={skill.sourceUrl}
          external
          event="skill_action"
          params={{
            category: skill.category,
            skill: skill.slug,
            action: 'open_repository',
            context: 'license-gated',
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-pill border border-ink bg-cta px-5 py-2 font-medium text-[14px] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-white hover:shadow-none"
        >
          View on GitHub
        </TrackedLink>
      </div>
    )
  }

  return (
    <div>
      <div
        className="mb-3 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Export format"
      >
        {SKILL_EXPORT_FORMATS.map((f) => (
          <button
            key={f.format}
            type="button"
            role="tab"
            aria-selected={format === f.format}
            onClick={() => setFormat(f.format)}
            className={`rounded-pill border px-3.5 py-1.5 font-medium text-[13px] transition-colors ${
              format === f.format
                ? 'border-ink bg-cta text-black'
                : 'border-line-grey bg-offwhite text-ink-muted hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* What the selected shape is actually for. The picker used to offer
          four tabs whose output was near-identical, so naming each one's
          purpose is half of what stops them reading as duplicates. */}
      {activeFormat ? (
        <p className="mb-3 text-[13px] text-ink-muted">{activeFormat.note}</p>
      ) : null}

      <div className="overflow-hidden rounded-panel border border-ink shadow-brutal-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-[#2c2743] border-b bg-[#191527] px-4 py-2.5">
          <span className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-cta" />
            <span className="size-2.5 rounded-full bg-green" />
            <span className="ml-2 font-bold font-mono text-[11px] text-white/50 uppercase tracking-[0.18em]">
              {activeFormat?.filename}
            </span>
          </span>
          <div className="flex items-center gap-2">
            {/* Real "Skill Page → Download ZIP → Install/Use" flow — a
                genuine .zip (SKILL.md + a generated INSTALL.md), not a
                relabelled copy button. Quiet outline so Copy stays the
                primary action for the common case. */}
            <button
              type="button"
              onClick={handleDownloadZip}
              className="flex min-h-[36px] items-center gap-1.5 rounded-pill border border-white/25 px-3.5 py-1 font-medium text-[13px] text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download ZIP
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex min-h-[36px] items-center gap-1.5 rounded-pill border border-ink bg-cta px-4 py-1 font-medium text-[13px] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-white hover:shadow-none"
            >
              {copied ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
              {copied ? 'Copied!' : `Copy ${activeFormat?.label}`}
            </button>
          </div>
        </div>

        <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap bg-[#131020] p-6 font-mono text-[14px] text-[#e8e5f5] leading-[1.8]">
          {text}
        </pre>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {copied ? 'Skill copied to clipboard' : ''}
      </p>
    </div>
  )
}
