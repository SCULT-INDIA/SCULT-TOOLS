import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enqueueCliEvent, flushCliEvents } from './studio-report'

/**
 * The reporter's contract, mirrored from the MCP reporter it clones:
 * inert without the API key, batches with one IP, never throws — a
 * telemetry failure must never surface to a CLI API caller.
 */
describe('CLI studio reporter', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
    fetchMock.mockResolvedValue(new Response(null, { status: 201 }))
  })

  afterEach(async () => {
    // Drain anything a test left buffered so cases stay independent.
    vi.stubEnv('SCULT_STUDIO_API_KEY', '')
    await flushCliEvents()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('is inert (no fetch, buffer dropped) when the API key is unset', async () => {
    vi.stubEnv('SCULT_STUDIO_API_KEY', '')
    enqueueCliEvent({ type: 'command', command: 'prompts_search', ts: Date.now() })
    await flushCliEvents()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the batch with bearer auth and the batch IP', async () => {
    vi.stubEnv('SCULT_STUDIO_API_KEY', 'test-key')
    vi.stubEnv('SCULT_STUDIO_CLI_EVENTS_URL', 'https://studio.example/api/v1/cli/events')
    enqueueCliEvent({
      type: 'command',
      command: 'skills_get',
      cli_version: '0.1.0',
      os: 'win32',
      cid: 'abc-123-def-456',
      status: 'ok',
      duration_ms: 42,
      ip: '203.0.113.9',
      ts: Date.now(),
    })
    enqueueCliEvent({ type: 'install', ip: '203.0.113.9', ts: Date.now() })
    await flushCliEvents()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://studio.example/api/v1/cli/events')
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer test-key')
    const body = JSON.parse(String(init.body)) as { events: unknown[]; ip: string }
    expect(body.events).toHaveLength(2)
    expect(body.ip).toBe('203.0.113.9')
  })

  it('swallows transport failures and clears the buffer', async () => {
    vi.stubEnv('SCULT_STUDIO_API_KEY', 'test-key')
    fetchMock.mockRejectedValueOnce(new Error('network down'))
    enqueueCliEvent({ type: 'command', command: 'prompts_get', ts: Date.now() })
    await expect(flushCliEvents()).resolves.toBeUndefined()
    // A second flush has nothing left to send.
    fetchMock.mockClear()
    await flushCliEvents()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
