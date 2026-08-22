import { buildLlmsFullTxt } from '@/lib/seo/llms'

/**
 * llms-full.txt — the fuller companion to /llms.txt, with tool and guide
 * detail inlined. See `lib/seo/llms.ts` for how this is assembled.
 */
export async function GET(): Promise<Response> {
  return new Response(await buildLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
