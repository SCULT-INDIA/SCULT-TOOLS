import { beforeEach, describe, expect, it, vi } from 'vitest'

const runAiVisibilityCheck = vi.fn()
vi.mock('../route', () => ({ runAiVisibilityCheck }))
vi.mock('@react-pdf/renderer', () => ({
  renderToBuffer: vi.fn(async () => Buffer.from('%PDF-1.4 test')),
}))
vi.mock('@/lib/tools/ai-visibility-checker/pdf-document', () => ({
  AiVisibilityPdfDocument: () => null,
}))

const REPORT = { url: 'https://example.com/', score: 80 }

let ipCounter = 0
/** A fresh client IP per test so the in-memory rate limiter starts empty. */
function requestFor(url: string, ip = `10.0.0.${++ipCounter}`): Request {
  return new Request(
    `http://localhost/api/ai-visibility/pdf?url=${encodeURIComponent(url)}`,
    {
      headers: { 'x-forwarded-for': ip },
    },
  )
}

describe('GET /api/ai-visibility/pdf', () => {
  beforeEach(() => {
    runAiVisibilityCheck.mockReset()
    runAiVisibilityCheck.mockResolvedValue(REPORT)
  })

  it('serves the report as a downloadable PDF file with a per-site filename', async () => {
    const { GET } = await import('./route')
    const res = await GET(requestFor('https://example.com'))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/pdf')
    expect(res.headers.get('content-disposition')).toBe(
      'attachment; filename="example.com-ai-visibility-report.pdf"',
    )
    expect(res.headers.get('cache-control')).toBe('private, no-store')
    expect(new TextDecoder().decode(await res.arrayBuffer())).toMatch(/^%PDF/)
    expect(runAiVisibilityCheck).toHaveBeenCalledWith('https://example.com')
  })

  it("passes the check's own typed error through instead of rendering a PDF of it", async () => {
    runAiVisibilityCheck.mockResolvedValue({ code: 'invalid-url', error: 'Not a URL.' })
    const { GET } = await import('./route')
    const res = await GET(requestFor('nope'))
    expect(res.status).toBe(400)
    expect(res.headers.get('content-type')).toContain('application/json')
  })

  it('rate limits harder than the check itself: two at once, then 429 with Retry-After', async () => {
    const { GET } = await import('./route')
    const ip = '10.9.9.9'
    expect((await GET(requestFor('https://example.com', ip))).status).toBe(200)
    expect((await GET(requestFor('https://example.com', ip))).status).toBe(200)
    const third = await GET(requestFor('https://example.com', ip))
    expect(third.status).toBe(429)
    expect(Number(third.headers.get('retry-after'))).toBeGreaterThan(0)
    // The limit is checked before any work happens.
    expect(runAiVisibilityCheck).toHaveBeenCalledTimes(2)
  })
})
