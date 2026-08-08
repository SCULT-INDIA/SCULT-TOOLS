import { ShieldCheck } from 'lucide-react'
import { PROMPTS } from '@/lib/prompts/registry'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Reference: band 1 — a laurel "best unlimited design" badge + star rating +
 * client-logo row + "560,200+ hours completed" counter, directly under the hero.
 *
 * We do not fabricate a rating or a usage counter — there is no review platform
 * behind this site and no real-user telemetry to quote yet. Every number here is
 * instead something a visitor can verify themselves in under a minute: the tool
 * count, the test count, and the WCAG target. That is the honest version of the
 * same "we take this seriously" signal the badge cluster sends on the reference.
 */
export function TrustStrip() {
  const testCount = 500 // floor of the last verified full-suite run; see CI badge in README
  return (
    <div className="container-site flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-line border-t py-8 text-center">
      <Stat value={`${TOOLS.length}`} label="tools shipped" />
      <Divider />
      <Stat value={`${PROMPTS.length}`} label="verified AI prompts" />
      <Divider />
      <Stat value={`${testCount}+`} label="tests passing in CI" />
      <Divider />
      <Stat value="0" label="signups required" />
      <Divider />
      <div className="inline-flex items-center gap-2 text-[14px] text-ink-muted">
        <ShieldCheck className="size-4 text-green" aria-hidden="true" />
        Built to WCAG 2.2 AA
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display font-bold text-[22px] text-ink">{value}</span>
      <span className="text-[14px] text-ink-subtle">{label}</span>
    </div>
  )
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-4 w-px bg-line-grey sm:block" />
}
