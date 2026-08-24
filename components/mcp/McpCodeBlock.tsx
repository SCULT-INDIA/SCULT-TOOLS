'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

/**
 * A copyable code snippet, styled as the same dark "editor card" used by
 * PromptCopyBlock/SkillCopyBlock — this page needs several short,
 * independent snippets (CLI command, two JSON configs), not one big prompt
 * body, so it's its own small component rather than reusing either of those
 * domain-specific ones.
 */
export function McpCodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (permissions, insecure context) — the code stays selectable either way.
    }
  }

  return (
    <div className="overflow-hidden rounded-panel border border-ink shadow-brutal-sm">
      <div className="flex items-center justify-between gap-3 border-[#2c2743] border-b bg-[#191527] px-4 py-2.5">
        <span className="flex items-center gap-2" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-cta" />
          <span className="size-2.5 rounded-full bg-green" />
          <span className="ml-2 font-bold font-mono text-[11px] text-white/50 uppercase tracking-[0.18em]">
            {label}
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
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="max-h-[24rem] overflow-auto whitespace-pre bg-[#131020] p-6 font-mono text-[13px] text-[#e8e5f5] leading-[1.8]">
        {code}
      </pre>
    </div>
  )
}
