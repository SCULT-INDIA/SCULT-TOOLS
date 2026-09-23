import { Fragment } from 'react'

/**
 * A deliberately narrow markdown-to-JSX renderer — `**bold**` spans and
 * `- ` bullet lists, blank-line-separated paragraphs, nothing else. Not a
 * general markdown library: the one real need is admin-published prose
 * fields (a prompt's description, "why it works", example output) that
 * come from pasting an LLM's reply into a plain textarea (see
 * app/admin/prompts/PromptForm.tsx's meta-prompt template) — an LLM
 * reaches for `**emphasis**` and `- ` lists by default, and those need to
 * actually render instead of showing up as literal asterisks and dashes
 * on the public page. `promptText` itself is deliberately NOT run through
 * this — it's copy-pasted verbatim into the admin's own tool, so
 * markdown syntax in it must survive exactly as typed.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>
    ),
  )
}

export function SimpleMarkdown({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const blocks = text.trim().split(/\n\s*\n/)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
        const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l))
        const spacing = i > 0 ? 'mt-3' : ''
        if (isList) {
          return (
            <ul
              key={block}
              className={`${className ?? ''} ${spacing} list-disc space-y-1 pl-5`}
            >
              {lines.map((line) => (
                <li key={line}>{renderInline(line.replace(/^[-*]\s+/, ''), line)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={block} className={`${className ?? ''} ${spacing}`}>
            {renderInline(block, block)}
          </p>
        )
      })}
    </>
  )
}
