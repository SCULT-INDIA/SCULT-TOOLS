import type { SupportBlock, SupportSection } from '@/lib/tools/types'

/**
 * Renders a tool's `supportContent` — examples, formulas, cheat sheets,
 * checklists — on the how-it-works page, between "What it doesn't do" and
 * "Frequently asked". A small closed set of block types (see `SupportBlock`)
 * rather than markdown: every shape this content actually needs is covered
 * here without adding a markdown-rendering dependency for four block shapes.
 *
 * Each block renders inside the same `.card-modern` treatment
 * `HowItWorksShell` already uses for "The method" and "Step by step" —
 * visual consistency with the rest of the page mattered more here than
 * inventing a distinct look for one more content type.
 */
export function SupportSections({ sections }: { sections: readonly SupportSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.heading}
          aria-labelledby={`support-${slugify(section.heading)}`}
          className="mt-10"
        >
          <h2
            id={`support-${slugify(section.heading)}`}
            className="text-[24px] tracking-[-0.5px] md:text-[28px]"
          >
            {section.heading}
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {section.blocks.map((block, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: blocks within one section have no natural unique key
              <SupportBlockView key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function SupportBlockView({ block }: { block: SupportBlock }) {
  if (block.type === 'prose') {
    return (
      <div className="card-modern p-6 md:p-7">
        <div className="flex flex-col gap-3">
          {block.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 60)}
              className="text-[15px] text-ink-body leading-6 md:text-[16px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === 'list') {
    return (
      <div className="card-modern p-6 md:p-7">
        {block.intro ? (
          <p className="text-[15px] text-ink-body leading-6 md:text-[16px]">
            {block.intro}
          </p>
        ) : null}
        <ul className={`flex flex-col gap-2.5 ${block.intro ? 'mt-4' : ''}`}>
          {block.items.map((item) => (
            <li key={item.slice(0, 60)} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-400"
              />
              <span className="text-[15px] text-ink-body leading-6">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (block.type === 'table') {
    return (
      <div className="card-modern overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left">
            <thead>
              <tr className="border-line-grey border-b bg-offwhite">
                {block.columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 font-medium text-[13px] text-ink-subtle uppercase tracking-[0.05em]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr
                  // biome-ignore lint/suspicious/noArrayIndexKey: rows share no unique cell across every table shape
                  key={i}
                  className={i % 2 === 1 ? 'bg-offwhite' : 'bg-white'}
                >
                  {row.map((cell, ci) => (
                    <td
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-width row, column order never changes
                      key={ci}
                      className="px-4 py-3 text-[14px] text-ink-body"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // block.type === 'code'
  return (
    <div className="card-modern p-6 md:p-7">
      {block.intro ? (
        <p className="mb-4 text-[15px] text-ink-body leading-6 md:text-[16px]">
          {block.intro}
        </p>
      ) : null}
      <div className="flex flex-col gap-4">
        {block.snippets.map((snippet) => (
          <div key={snippet.label}>
            <p className="mb-1.5 font-bold text-[12px] text-ink-subtle uppercase tracking-[0.08em]">
              {snippet.label}
            </p>
            <pre className="overflow-x-auto rounded-sm border border-line-grey bg-cream p-4 font-mono text-[13px] text-ink-body leading-[1.6]">
              <code>{snippet.code}</code>
            </pre>
            {snippet.note ? (
              <p className="mt-1.5 text-[13px] text-ink-subtle leading-5">
                {snippet.note}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
