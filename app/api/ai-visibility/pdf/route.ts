import { type DocumentProps, renderToBuffer } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'
import { createElement, type ReactElement } from 'react'
import { slugifyUrlForFilename } from '@/lib/download-file'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { type ApiError, isApiError } from '@/lib/tools/ai-visibility-checker/logic'
import { AiVisibilityPdfDocument } from '@/lib/tools/ai-visibility-checker/pdf-document'
import { runAiVisibilityCheck } from '../route'

/**
 * GET /api/ai-visibility/pdf?url=<target>
 *
 * The AI visibility report as a PDF file, rendered here on the server.
 *
 * Why server-side (2026-09-23): the report used to be rendered in the
 * browser with `@react-pdf/renderer` and saved through a synthetic
 * `<a download>` click. That click fired only after several awaits
 * (loading the library, laying out the document, producing the blob), and
 * Safari on macOS and iOS treats a download started that long after the
 * real tap as not user-initiated and silently drops it — the button did
 * nothing on Mac and on phones, and a swallowed generation error looked the
 * same. Serving the file from a URL turns the button into an ordinary
 * link: the browser itself performs the download, which works identically
 * on every engine, OS and device, and the ~1MB PDF library leaves the
 * client bundle entirely.
 *
 * The report is recomputed via `runAiVisibilityCheck` rather than accepted
 * from the client: every outbound fetch that check makes is cached for six
 * hours (see ../route.ts), so a download right after a check is almost
 * always served from that cache, and this endpoint can never be made to
 * render arbitrary caller-supplied content into a Scult-branded PDF.
 *
 * Rate limit: tighter than the check itself. A PDF render is real CPU
 * (react-pdf lays out and compresses the whole document) and one visitor
 * needs at most a couple per report — 2 at once, then one every 20s.
 */

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_BURST = 2

// (No `runtime` export: Node is the default, and Cache Components rejects
// the option outright.) The check's outbound fetches can take up to 10s
// each on a cold site before the PDF is even laid out.
export const maxDuration = 30

function errorStatus(error: ApiError): number {
  return error.code === 'invalid-url' || error.code === 'private-address' ? 400 : 502
}

export async function GET(request: Request): Promise<NextResponse> {
  const clientIp = clientIpFromHeaders(request.headers)
  const rateLimit = checkRateLimit(
    `ai-visibility-pdf:${clientIp}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_BURST,
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        code: 'rate-limited' satisfies ApiError['code'],
        error: `Too many PDF downloads from this connection — wait ${rateLimit.retryAfterSeconds}s and try again.`,
      },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const rawUrl = new URL(request.url).searchParams.get('url') ?? ''
  const result = await runAiVisibilityCheck(rawUrl)
  if (isApiError(result)) {
    return NextResponse.json(result, { status: errorStatus(result) })
  }

  const generatedAt = `${new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  })} UTC`
  // `renderToBuffer` is typed against the `<Document>` element itself;
  // AiVisibilityPdfDocument is a component that renders one, which react-pdf
  // accepts at runtime (the old client code passed the same element to
  // `pdf()`), so the cast only bridges the two type signatures.
  const pdf = await renderToBuffer(
    createElement(AiVisibilityPdfDocument, {
      report: result,
      generatedAt,
    }) as unknown as ReactElement<DocumentProps>,
  )
  const filename = `${slugifyUrlForFilename(result.url)}-ai-visibility-report.pdf`

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${filename}"`,
      'content-length': String(pdf.byteLength),
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}
