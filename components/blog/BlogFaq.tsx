import { renderInlineSegments } from '@/components/blog/BlogBody'
import type { BlogFaqItem } from '@/lib/blog/types'

/**
 * Same disclosure pattern as `HowItWorksShell`'s tool FAQ (plain `<details>`,
 * `.card-modern` wrapper) — this is the content-engine batch's equivalent,
 * rendered so the `FAQPage` JSON-LD this page also emits (see
 * `app/blog/[slug]/page.tsx`) describes content a visitor can actually see,
 * not invisible structured data.
 */
export function BlogFaq({ items }: { items: readonly BlogFaqItem[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="blog-faq" className="mt-12">
      <h2 id="blog-faq" className="text-[26px] tracking-[-0.5px] md:text-[30px]">
        Frequently asked questions
      </h2>
      <div className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <details key={item.question} className="card-modern group p-5">
            <summary className="cursor-pointer list-none font-semibold text-[16px] text-ink marker:content-none">
              {item.question}
            </summary>
            <p className="mt-3 text-[15px] text-ink-muted leading-6">
              {renderInlineSegments(item.answer)}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
