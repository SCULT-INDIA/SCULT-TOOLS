import { beforeEach, describe, expect, it, vi } from 'vitest'

const hasValidSession = vi.fn()
vi.mock('./auth', () => ({ hasValidSession }))

let ipCounter = 0
function request(
  method: string,
  headers: Record<string, string> = {},
  ip = `10.2.0.${++ipCounter}`,
): Request {
  return new Request('http://localhost/api/admin/things', {
    method,
    headers: { 'x-forwarded-for': ip, ...headers },
  })
}
const ctx = { params: Promise.resolve({}) }

describe('adminRoute', () => {
  beforeEach(() => {
    hasValidSession.mockReset()
    hasValidSession.mockResolvedValue(true)
  })

  it('runs the handler and marks the response no-store', async () => {
    const { adminRoute } = await import('./route')
    const GET = adminRoute(async () => Response.json({ ok: true }))
    const res = await GET(request('GET'), ctx)
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('answers 401 in the shared error shape when there is no session', async () => {
    hasValidSession.mockResolvedValue(false)
    const { adminRoute } = await import('./route')
    const GET = adminRoute(async () => Response.json({ ok: true }))
    const res = await GET(request('GET'), ctx)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.code).toBe('unauthenticated')
    expect(body.errors[0].field).toBe('(root)')
  })

  it('skips the session check for public routes', async () => {
    hasValidSession.mockResolvedValue(false)
    const { adminRoute } = await import('./route')
    const POST = adminRoute(async () => Response.json({ ok: true }), { public: true })
    const res = await POST(request('POST', { origin: 'http://localhost' }), ctx)
    expect(res.status).toBe(200)
  })

  it('blocks a mutation with no Origin/Referer, and one from another host', async () => {
    const { adminRoute } = await import('./route')
    const POST = adminRoute(async () => Response.json({ ok: true }))
    expect((await POST(request('POST'), ctx)).status).toBe(403)
    expect(
      (await POST(request('POST', { origin: 'https://evil.example' }), ctx)).status,
    ).toBe(403)
    expect(
      (await POST(request('DELETE', { referer: 'https://evil.example/x' }), ctx)).status,
    ).toBe(403)
  })

  it('allows a mutation from the same host, by Origin or by Referer', async () => {
    const { adminRoute } = await import('./route')
    const POST = adminRoute(async () => Response.json({ ok: true }))
    expect(
      (await POST(request('POST', { origin: 'http://localhost' }), ctx)).status,
    ).toBe(200)
    expect(
      (await POST(request('PATCH', { referer: 'http://localhost/admin/prompts/1' }), ctx))
        .status,
    ).toBe(200)
  })

  it('names a missing environment variable instead of returning a bare 500', async () => {
    const { adminRoute } = await import('./route')
    const GET = adminRoute(async () => {
      throw new Error('adminPool(): SUPABASE_DB_URL is not set — see .env.example')
    })
    const res = await GET(request('GET'), ctx)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.code).toBe('not-configured')
    expect(body.errors[0].message).toContain('SUPABASE_DB_URL')
  })

  it('reports a database connection failure by its code, without leaking the raw error', async () => {
    const { adminRoute } = await import('./route')
    const GET = adminRoute(async () => {
      throw Object.assign(
        new Error('connect ECONNREFUSED 1.2.3.4:5432 with secret sauce'),
        {
          code: 'ECONNREFUSED',
        },
      )
    })
    const body = await (await GET(request('GET'), ctx)).json()
    expect(body.code).toBe('database-unreachable')
    expect(body.errors[0].message).toContain('ECONNREFUSED')
    expect(body.errors[0].message).not.toContain('secret sauce')
  })

  it('keeps any other error generic, with a reference id', async () => {
    const { adminRoute } = await import('./route')
    const GET = adminRoute(async () => {
      throw new Error('column "foo" does not exist')
    })
    const body = await (await GET(request('GET'), ctx)).json()
    expect(body.code).toBe('server-error')
    expect(body.errors[0].message).not.toContain('column')
    expect(body.errors[0].message).toMatch(/Ref [a-z0-9]+/)
  })

  it('rate limits a flood from one address', async () => {
    const { adminRoute } = await import('./route')
    const GET = adminRoute(async () => Response.json({ ok: true }))
    const ip = '10.3.3.3'
    let limited = 0
    for (let i = 0; i < 70; i++) {
      if ((await GET(request('GET', {}, ip), ctx)).status === 429) limited++
    }
    expect(limited).toBeGreaterThan(0)
  })
})
