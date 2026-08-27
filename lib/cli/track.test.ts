import { describe, expect, it } from 'vitest'
import { parseCliClient } from './track'

/** The User-Agent contract between cli/src/api.ts and the server-side
 * measurement — if this shape drifts, Studio's version/OS breakdowns go
 * blank, so it is pinned here. */
describe('parseCliClient', () => {
  it('parses the CLI user-agent shape', () => {
    const headers = new Headers({
      'user-agent': 'scult-cli/0.1.0 (win32; x64) node/22.14.0',
      'x-scult-cid': '756eed4d-71f9-4a3a-8ea7-c830eed72aa6',
    })
    expect(parseCliClient(headers)).toEqual({
      cliVersion: '0.1.0',
      os: 'win32',
      arch: 'x64',
      nodeVersion: '22.14.0',
      cid: '756eed4d-71f9-4a3a-8ea7-c830eed72aa6',
    })
  })

  it('returns only a valid cid for non-CLI callers', () => {
    const headers = new Headers({
      'user-agent': 'Mozilla/5.0',
      'x-scult-cid': 'abcdefgh-1234',
    })
    expect(parseCliClient(headers)).toEqual({ cid: 'abcdefgh-1234' })
  })

  it('rejects malformed cids (charset / length)', () => {
    const short = new Headers({ 'x-scult-cid': 'abc' })
    expect(parseCliClient(short).cid).toBeUndefined()
    const hostile = new Headers({ 'x-scult-cid': 'abc"; drop table x; --00' })
    expect(parseCliClient(hostile).cid).toBeUndefined()
    const long = new Headers({ 'x-scult-cid': 'a'.repeat(65) })
    expect(parseCliClient(long).cid).toBeUndefined()
  })

  it('tolerates a UA without platform or node segments', () => {
    const headers = new Headers({ 'user-agent': 'scult-cli/0.2.0' })
    expect(parseCliClient(headers)).toEqual({
      cliVersion: '0.2.0',
      os: undefined,
      arch: undefined,
      nodeVersion: undefined,
      cid: undefined,
    })
  })
})
