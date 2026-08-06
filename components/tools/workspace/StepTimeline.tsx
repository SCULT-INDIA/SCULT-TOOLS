/**
 * Horizontal connected-step progress row — docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * `overflow-x-auto` on the row plus `shrink-0` on every step, rather than
 * squeezing steps to fit the viewport — the plan's mobile note for this
 * component: forcing N steps into a narrow screen makes every label wrap or
 * truncate, letting the row scroll keeps every label readable.
 */

export type TimelineStep = {
  label: string
  sublabel?: string
  status: 'done' | 'active' | 'pending'
}

export function StepTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex items-start overflow-x-auto pb-1">
      {steps.map((step, i) => (
        <li key={step.label} className="flex shrink-0 items-start">
          <div className="flex w-24 flex-col items-center gap-2 text-center sm:w-28">
            <span
              data-status={step.status}
              aria-current={step.status === 'active' ? 'step' : undefined}
              className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
                step.status === 'done'
                  ? 'border border-ink bg-violet-700'
                  : step.status === 'active'
                    ? 'border-2 border-violet-700 bg-cream'
                    : 'border border-line-grey bg-cream'
              }`}
            >
              {step.status === 'active' ? (
                <span className="size-1.5 rounded-full bg-violet-700" />
              ) : null}
            </span>
            <div>
              <p
                className={`text-[13px] leading-tight ${
                  step.status === 'pending' ? 'text-ink-subtle' : 'font-medium text-ink'
                }`}
              >
                {step.label}
              </p>
              {step.sublabel ? (
                <p className="mt-0.5 text-[11px] text-ink-subtle">{step.sublabel}</p>
              ) : null}
            </div>
          </div>

          {i < steps.length - 1 ? (
            <div
              aria-hidden="true"
              className={`mt-[7px] h-px w-8 shrink-0 sm:w-12 ${
                step.status === 'done' ? 'bg-violet-500' : 'bg-line-grey'
              }`}
            />
          ) : null}
        </li>
      ))}
    </ol>
  )
}
