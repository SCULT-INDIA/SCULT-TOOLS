'use client'

import Link from 'next/link'

/**
 * Replaces Next's blank error screen for anything thrown while rendering
 * an /admin page (a database that isn't reachable, a missing environment
 * variable). In production Next strips the thrown message from what a
 * client boundary receives, so this can't say WHY — it points at the
 * dashboard, whose health check can.
 */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-red-300 bg-red-50 p-5 text-red-800">
      <h1 className="font-bold text-lg">This admin page could not load</h1>
      <p className="mt-2 text-sm">
        Usually this means the admin database is not reachable or an environment variable
        is missing on this deployment. The{' '}
        <Link href="/admin" className="underline">
          dashboard
        </Link>{' '}
        runs a health check and names the exact problem.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full border border-red-800 px-3 py-1 text-sm hover:bg-red-100"
      >
        Try again
      </button>
    </div>
  )
}
