import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

/**
 * Global test setup — runs once per test file, before its tests.
 *
 * Two things a component-testing suite needs that a pure-logic one doesn't:
 *
 *   - `@testing-library/jest-dom/vitest` extends `expect` with DOM matchers
 *     (`toBeDisabled`, `toBeInTheDocument`, `toHaveAttribute`, …). Without it,
 *     these compile — TypeScript sees `Assertion<HTMLElement>` — but fail at
 *     runtime with "is not a function", which is exactly the class of error
 *     three separate redesign agents hit and had to work around.
 *   - `cleanup()` unmounts whatever the previous test rendered into jsdom.
 *     React Testing Library normally registers this itself via a framework's
 *     global `afterEach`, but this project runs vitest with `globals: false`
 *     (every existing test explicitly imports `describe`/`it`/`expect` rather
 *     than relying on ambient globals), so that auto-registration never fires.
 *     Skipping this step doesn't break the first test in a file — it breaks
 *     the second, which inherits DOM nodes the first one rendered.
 */
afterEach(() => {
  cleanup()
})
