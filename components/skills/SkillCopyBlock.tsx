'use client'

import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { trackSkillEvent } from '@/lib/analytics'
import { exportSkillAs, SKILL_EXPORT_FORMATS, type SkillExportFormat } from '@/lib/skills/export'
import type { Skill } from '@/lib/skills/types'

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

  if (licenseGated) {
    return (
      <div className="rounded-panel border border-ink bg-offwhite p-6 text-center">
        <p className="text-[15px] text-ink-muted leading-6">
          This skill's source license couldn't be confirmed as safe to mirror here, so
          it isn't inlined. View the full skill directly on its source repository.
        </p>
        <a
          href={skill.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-pill border border-ink bg-cta px-5 py-2 font-medium text-[14px] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-white hover:shadow-none"
        >
          View on GitHub
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Export format">
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

      <div className="overflow-hidden rounded-panel border border-ink shadow-brutal-sm">
        <div className="flex items-center justify-between gap-3 border-[#2c2743] border-b bg-[#191527] px-4 py-2.5">
          <span className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-cta" />
            <span className="size-2.5 rounded-full bg-green" />
            <span className="ml-2 font-bold font-mono text-[11px] text-white/50 uppercase tracking-[0.18em]">
              {activeFormat?.filename}
            </span>
          </span>
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
