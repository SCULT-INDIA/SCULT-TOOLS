import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { PROMPTS } from '@/lib/prompts/registry'
import { SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Site-wide fallback social preview card — the one og:image the audit found
 * missing everywhere (no route set `openGraph.images`, no special file at any
 * level). Any route with its own `opengraph-image.tsx` overrides this; every
 * other page, including the homepage, falls back to this one. Real figures
 * (tool/prompt counts) rather than invented copy, same as every other claim
 * on this site.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const iconBuffer = await readFile(join(process.cwd(), 'app/icon.png'))
  const iconDataUrl = `data:image/png;base64,${iconBuffer.toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        backgroundColor: '#fcfbf3',
        fontFamily: 'sans-serif',
      }}
    >
      {/** biome-ignore lint/performance/noImgElement: next/og's ImageResponse renders its own image, not a browser DOM — next/image is not usable here. */}
      <img src={iconDataUrl} width={96} height={96} alt="" />
      <div
        style={{
          marginTop: 40,
          fontSize: 72,
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-0.02em',
        }}
      >
        {SITE.name}
      </div>
      <div style={{ marginTop: 16, fontSize: 32, color: '#4b20de', fontWeight: 600 }}>
        {SITE.tagline}
      </div>
      {/* A single interpolated string, not mixed text+expression children —
          Satori (this route's renderer) requires explicit display:flex on
          any node with more than one child, and splitting this across
          {TOOLS.length}/{PROMPTS.length} JSX expressions produces exactly
          that without it. */}
      <div style={{ marginTop: 32, fontSize: 26, color: '#5b5b5b' }}>
        {`${TOOLS.length} free tools · ${PROMPTS.length} AI prompts · zero signups`}
      </div>
    </div>,
    { ...size },
  )
}
