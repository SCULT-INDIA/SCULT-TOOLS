import { describe, expect, it } from 'vitest'
import {
  assessQrColors,
  buildQrPayload,
  capacityFor,
  escapeWifiValue,
  exceedsCapacity,
  isValidVpa,
  QR_BYTE_CAPACITY,
  QR_MIN_CONTRAST,
  qrFileName,
  utf8ByteLength,
} from './logic'

describe('assessQrColors', () => {
  it('accepts black on white without complaint', () => {
    const r = assessQrColors('#000000', '#ffffff')
    expect(r.error).toBeUndefined()
    expect(r.warnings).toHaveLength(0)
    expect(r.ratio).toBe(21)
  })

  it('rejects an inverted pair, because many scanners will not read one', () => {
    const r = assessQrColors('#ffffff', '#000000')
    expect(r.error).toContain('inverts the code')
  })

  it('rejects a pair a human can distinguish but a scanner cannot', () => {
    // Mid-blue on mid-green: obviously different hues, close in luminance.
    const r = assessQrColors('#3355aa', '#22aa66')
    expect(r.ratio).toBeLessThan(QR_MIN_CONTRAST)
    expect(r.error).toBeDefined()
  })

  it('warns rather than blocks in the screen-fine, print-risky band', () => {
    const r = assessQrColors('#7030f8', '#ffffff') // 6.06:1
    expect(r.error).toBeUndefined()
    expect(r.warnings).toHaveLength(1)
    expect(r.warnings[0]).toContain('printed')
  })

  it('reports the ratio it judged on, so the UI can show its working', () => {
    expect(assessQrColors('#4b20de', '#ffffff').ratio).toBeCloseTo(8.2, 1)
  })

  it('errors on unparseable input instead of assuming a default', () => {
    expect(assessQrColors('nope', '#ffffff').error).toBeDefined()
    expect(assessQrColors('#000', 'nope').error).toBeDefined()
    expect(assessQrColors('nope', '#ffffff').ratio).toBeNull()
  })

  it('accepts shorthand hex', () => {
    expect(assessQrColors('#000', '#fff').ratio).toBe(21)
  })

  it('treats an identical pair as unscannable', () => {
    const r = assessQrColors('#7030f8', '#7030f8')
    expect(r.ratio).toBe(1)
    expect(r.error).toBeDefined()
  })
})

describe('buildQrPayload — url mode', () => {
  it('encodes a full https URL unchanged', () => {
    const r = buildQrPayload({ mode: 'url', url: 'https://scult.in/tools' })
    expect(r.error).toBeUndefined()
    expect(r.payload).toBe('https://scult.in/tools')
  })

  it('rejects an invalid URL instead of encoding nonsense', () => {
    const r = buildQrPayload({ mode: 'url', url: 'not a valid url' })
    expect(r.error).toBeDefined()
    expect(r.payload).toBe('')
  })

  it('rejects a scheme with no host', () => {
    expect(buildQrPayload({ mode: 'url', url: 'https://' }).error).toBeDefined()
  })

  it('rejects a non-web scheme and points at text mode', () => {
    const r = buildQrPayload({ mode: 'url', url: 'javascript:alert(1)' })
    expect(r.error).toContain('Text mode')
  })

  it('adds https:// to a bare domain and says so', () => {
    const r = buildQrPayload({ mode: 'url', url: 'scult.in' })
    expect(r.payload).toBe('https://scult.in')
    expect(r.warnings.join(' ')).toContain('https://')
  })

  it('does not append a trailing slash the user did not type', () => {
    // new URL('https://scult.in').toString() would be 'https://scult.in/' — an
    // extra byte and a visible change to what was typed.
    expect(buildQrPayload({ mode: 'url', url: 'https://scult.in' }).payload).toBe(
      'https://scult.in',
    )
  })

  it('warns about a dotless hostname rather than silently encoding it', () => {
    const r = buildQrPayload({ mode: 'url', url: 'http://intranet' })
    expect(r.error).toBeUndefined()
    expect(r.warnings.some((w) => w.includes('no dot'))).toBe(true)
  })

  it('reports empty input as an error, never as a throw', () => {
    expect(() => buildQrPayload({ mode: 'url' })).not.toThrow()
    expect(buildQrPayload({ mode: 'url', url: '   ' }).error).toBeDefined()
  })
})

describe('buildQrPayload — text mode', () => {
  it('encodes text verbatim after trimming the edges', () => {
    const r = buildQrPayload({ mode: 'text', text: '  Table 4 — ask for Priya  ' })
    expect(r.payload).toBe('Table 4 — ask for Priya')
  })

  it('rejects empty text', () => {
    expect(buildQrPayload({ mode: 'text', text: '' }).error).toBeDefined()
  })
})

describe('buildQrPayload — wifi mode', () => {
  it('builds the WIFI: URI in T, S, P, H order', () => {
    const r = buildQrPayload({
      mode: 'wifi',
      ssid: 'CafeGuest',
      password: 'flatwhite1',
      security: 'WPA',
    })
    expect(r.error).toBeUndefined()
    expect(r.payload).toBe('WIFI:T:WPA;S:CafeGuest;P:flatwhite1;H:false;;')
  })

  it('escapes a semicolon and a colon in the SSID', () => {
    const r = buildQrPayload({
      mode: 'wifi',
      ssid: 'Cafe;Wing:2',
      password: 'flatwhite1',
    })
    expect(r.payload).toContain('S:Cafe\\;Wing\\:2;')
    // The escapes must not leak into the structural separators around the value.
    expect(r.payload).toBe('WIFI:T:WPA;S:Cafe\\;Wing\\:2;P:flatwhite1;H:false;;')
  })

  it('escapes a backslash exactly once, not twice', () => {
    // A two-pass escaper would turn 'a\b' into 'a\\\\b' by re-escaping the
    // backslashes it just introduced.
    expect(escapeWifiValue('a\\b')).toBe('a\\\\b')
    expect(escapeWifiValue('a,b"c')).toBe('a\\,b\\"c')
  })

  it('omits the P field entirely for an open network', () => {
    const r = buildQrPayload({ mode: 'wifi', ssid: 'FreeAirport', security: 'nopass' })
    expect(r.error).toBeUndefined()
    expect(r.payload).toBe('WIFI:T:nopass;S:FreeAirport;H:false;;')
    expect(r.payload).not.toContain('P:')
  })

  it('warns when an open network is given a password that will be dropped', () => {
    const r = buildQrPayload({
      mode: 'wifi',
      ssid: 'FreeAirport',
      security: 'nopass',
      password: 'ignored',
    })
    expect(r.payload).not.toContain('ignored')
    expect(r.warnings.length).toBeGreaterThan(0)
  })

  it('marks a hidden network as H:true', () => {
    const r = buildQrPayload({
      mode: 'wifi',
      ssid: 'BackOffice',
      password: 'flatwhite1',
      hidden: true,
    })
    expect(r.payload).toContain(';H:true;;')
  })

  it('requires a password unless the network is open', () => {
    expect(buildQrPayload({ mode: 'wifi', ssid: 'CafeGuest' }).error).toBeDefined()
  })

  it('rejects an SSID over the 32-byte 802.11 limit', () => {
    const r = buildQrPayload({
      mode: 'wifi',
      ssid: 'x'.repeat(33),
      password: 'flatwhite1',
    })
    expect(r.error).toBeDefined()
  })

  it('measures the SSID limit in bytes, not characters', () => {
    // 12 Devanagari characters are 36 UTF-8 bytes — over the limit despite being
    // well under 32 characters.
    const r = buildQrPayload({
      mode: 'wifi',
      ssid: 'क'.repeat(12),
      password: 'flatwhite1',
    })
    expect(r.error).toBeDefined()
  })

  it('warns about a WPA passphrase outside 8–63 characters', () => {
    const r = buildQrPayload({ mode: 'wifi', ssid: 'CafeGuest', password: 'short' })
    expect(r.error).toBeUndefined()
    expect(r.warnings.some((w) => w.includes('8–63'))).toBe(true)
  })
})

describe('buildQrPayload — upi mode', () => {
  it('builds the NPCI deep link with pa, pn, am and cu in order', () => {
    const r = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@okhdfcbank',
      payeeName: 'Scult Studio',
      amount: '1200',
    })
    expect(r.error).toBeUndefined()
    expect(r.payload).toBe(
      'upi://pay?pa=scult@okhdfcbank&pn=Scult%20Studio&am=1200.00&cu=INR',
    )
  })

  it('rejects a malformed VPA', () => {
    for (const bad of ['notavpa', 'user@', '@handle', 'a b@paytm', 'user@@paytm']) {
      expect(
        buildQrPayload({ mode: 'upi', vpa: bad, payeeName: 'Scult' }).error,
      ).toBeDefined()
    }
  })

  it('accepts a phone-number VPA', () => {
    expect(isValidVpa('9876543210@ybl')).toBe(true)
    expect(isValidVpa('name.surname-1@okaxis')).toBe(true)
  })

  it('omits the amount when blank and includes it when set', () => {
    const blank = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@ybl',
      payeeName: 'Scult',
      amount: '',
    })
    expect(blank.error).toBeUndefined()
    expect(blank.payload).toBe('upi://pay?pa=scult@ybl&pn=Scult&cu=INR')
    expect(blank.payload).not.toContain('am=')

    const set = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@ybl',
      payeeName: 'Scult',
      amount: '49.5',
    })
    expect(set.payload).toContain('am=49.50')
  })

  it('leaves the @ in the VPA literal rather than percent-encoding it', () => {
    const r = buildQrPayload({ mode: 'upi', vpa: 'scult@ybl', payeeName: 'Scult' })
    expect(r.payload).toContain('pa=scult@ybl')
    expect(r.payload).not.toContain('%40')
  })

  it('formats the amount to exactly two decimals with no float drift', () => {
    const r = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@ybl',
      payeeName: 'Scult',
      amount: '1200.10',
    })
    expect(r.payload).toContain('am=1200.10')
  })

  it('accepts a comma-grouped amount', () => {
    const r = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@ybl',
      payeeName: 'Scult',
      amount: '1,20,000',
    })
    expect(r.payload).toContain('am=120000.00')
  })

  it('rejects a zero, negative or non-numeric amount', () => {
    const base = { mode: 'upi', vpa: 'scult@ybl', payeeName: 'Scult' } as const
    expect(buildQrPayload({ ...base, amount: '0' }).error).toBeDefined()
    expect(buildQrPayload({ ...base, amount: '-50' }).error).toBeDefined()
    expect(buildQrPayload({ ...base, amount: 'fifty' }).error).toBeDefined()
  })

  it('warns above the practical per-transaction UPI ceiling', () => {
    const r = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@ybl',
      payeeName: 'Scult',
      amount: '150000',
    })
    expect(r.error).toBeUndefined()
    expect(r.warnings.length).toBeGreaterThan(0)
  })

  it('percent-encodes a payee name containing an ampersand so it cannot inject a parameter', () => {
    const r = buildQrPayload({
      mode: 'upi',
      vpa: 'scult@ybl',
      payeeName: 'Rao & Sons&am=1',
    })
    expect(r.payload).toContain('pn=Rao%20%26%20Sons%26am%3D1')
    expect(r.payload).not.toContain('&am=1')
  })

  it('requires a payee name', () => {
    expect(buildQrPayload({ mode: 'upi', vpa: 'scult@ybl' }).error).toBeDefined()
  })
})

describe('buildQrPayload — capacity', () => {
  it('warns that a very long payload needs a larger printed size', () => {
    const r = buildQrPayload({ mode: 'text', text: 'a'.repeat(900) })
    expect(r.error).toBeUndefined()
    const joined = r.warnings.join(' ')
    expect(joined).toContain('larger')
    expect(joined).toContain('print')
  })

  it('does not warn about size for a short payload', () => {
    const r = buildQrPayload({ mode: 'url', url: 'https://scult.in' })
    expect(r.warnings).toHaveLength(0)
  })

  it('refuses a payload past the absolute QR byte ceiling', () => {
    const r = buildQrPayload({ mode: 'url', url: `https://scult.in/${'a'.repeat(3000)}` })
    expect(r.error).toBeDefined()
    expect(r.payload).toBe('')
  })

  it('reports capacity per correction level, highest at L and lowest at H', () => {
    expect(capacityFor('L')).toBeGreaterThan(capacityFor('M'))
    expect(capacityFor('M')).toBeGreaterThan(capacityFor('Q'))
    expect(capacityFor('Q')).toBeGreaterThan(capacityFor('H'))
  })

  it('flags a payload that fits at M but not at H', () => {
    const payload = 'a'.repeat(QR_BYTE_CAPACITY.H + 1)
    expect(exceedsCapacity(payload, 'H')).toBe(true)
    expect(exceedsCapacity(payload, 'M')).toBe(false)
  })
})

describe('utf8ByteLength', () => {
  it('counts ASCII as one byte each', () => {
    expect(utf8ByteLength('hello')).toBe(5)
  })

  it('counts the rupee sign as three bytes', () => {
    expect(utf8ByteLength('₹')).toBe(3)
  })

  it('counts an astral-plane emoji as four bytes, not six', () => {
    // '🙂'.length is 2 UTF-16 units; a per-unit counter would report 6.
    expect(utf8ByteLength('🙂')).toBe(4)
  })

  it('is zero for an empty string', () => {
    expect(utf8ByteLength('')).toBe(0)
  })
})

describe('qrFileName', () => {
  it('names the download after the mode and format', () => {
    expect(qrFileName('upi', 'png')).toBe('qr-code-upi.png')
    expect(qrFileName('wifi', 'svg')).toBe('qr-code-wifi.svg')
  })
})
