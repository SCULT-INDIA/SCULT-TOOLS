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
 *
 * Cache-Control (2026-09-16): under `cacheComponents`, a metadata-file image
 * route with no `'use cache'` of its own defaults to dynamic — re-running
 * the icon read and the full Satori render on every single request. Nothing
 * here is per-visitor (no params, no cookies/headers), so every one of those
 * was identical output for a billed Fluid Compute invocation; confirmed live
 * (`curl -I`) as `Cache-Control: max-age=0, must-revalidate` /
 * `X-Vercel-Cache: MISS` on every hit, including the repeat unfurl requests
 * social platforms make per share. The header below lets Vercel's edge cache
 * the rendered PNG instead — this route can't use `'use cache'` directly
 * (an `ImageResponse` isn't a cacheable value; see `search-index.json`'s
 * route for the same constraint on a plain `Response`), so the HTTP cache is
 * the only lever available for this specific route.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
const CACHE_CONTROL = 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'

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
    { ...size, headers: { 'Cache-Control': CACHE_CONTROL } },
  )
}
