/**
 * The one place every SCULT Studio (studio.scult.in) call actually happens —
 * tool feedback and tool/prompt/skill requests both funnel through
 * `postToStudio` rather than each route duplicating auth, error mapping, and
 * logging. Replaces the earlier Resend-based "email connect@scult.in" path
 * entirely: feedback and requests now land in Studio as structured records,
 * not an inbox.
 *
 * `SCULT_STUDIO_API_KEY` is read only here, server-side, and never appears in
 * any response body — the same contract the old `lib/resend.ts` held for
 * `RESEND_API_KEY`.
 */

const STUDIO_BASE_URL = 'https://studio.scult.in'
const STUDIO_TIMEOUT_MS = 10_000

export type StudioResult =
  | { readonly ok: true; readonly id: string }
  | { readonly ok: false; readonly status: number; readonly message: string }

interface StudioErrorBody {
  readonly message?: string
  readonly error?: string
}

async function postToStudio(
  path: string,
  body: Record<string, unknown>,
): Promise<StudioResult> {
  const apiKey = process.env.SCULT_STUDIO_API_KEY
  if (!apiKey) {
    console.error(
      `postToStudio: SCULT_STUDIO_API_KEY is not configured — ${path} dropped.`,
    )
    return { ok: false, status: 502, message: 'Not accepting submissions right now.' }
  }

  try {
    const upstream = await fetch(`${STUDIO_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(STUDIO_TIMEOUT_MS),
    })

    const rawBody = await upstream.text().catch(() => '')
    let parsed: (StudioErrorBody & { id?: string }) | undefined
    try {
      parsed = rawBody ? JSON.parse(rawBody) : undefined
    } catch {
      parsed = undefined
    }

    if (!upstream.ok) {
      // Logged detail can be the full raw body — this only ever reaches
      // Vercel's function logs. `userMessage` below is what a visitor sees,
      // and must never be that raw body: if Studio's error shape doesn't
      // put a plain string at `message`/`error` (e.g. a field-map like
      // `{errors:{title:[...]}}`), falling back to `rawBody` would render
      // literal JSON as the visitor-facing error text.
      const detail = parsed?.message ?? parsed?.error ?? rawBody
      console.error(
        `postToStudio: Studio rejected ${path} (${upstream.status}): ${detail}`,
      )
      // Length-capped even though Studio is first-party: this string is
      // reflected verbatim into OUR response body, so it should never be
      // able to carry more than one short human sentence, whatever the
      // upstream sends.
      const cleanMessage = (
        typeof parsed?.message === 'string'
          ? parsed.message
          : typeof parsed?.error === 'string'
            ? parsed.error
            : undefined
      )?.slice(0, 300)

      // 401/403 are a misconfigured key on our end — never worth surfacing
      // to the visitor as their fault. 429 is Studio's own rate limit
      // (60/min per key, shared across every visitor hitting this key, not
      // a per-visitor limit) — reported as 502/"try again" rather than a
      // literal 429, since telling one visitor "YOU are rate limited" would
      // be misleading when the real cause is site-wide volume. 400/422 are
      // real input validation, worth passing through so the caller can show
      // something specific.
      if (upstream.status === 401 || upstream.status === 403) {
        return { ok: false, status: 502, message: 'Not accepting submissions right now.' }
      }
      if (upstream.status === 429) {
        return {
          ok: false,
          status: 502,
          message: 'Too many submissions right now — try again shortly.',
        }
      }
      if (upstream.status >= 400 && upstream.status < 500) {
        return {
          ok: false,
          status: 400,
          message: cleanMessage ?? 'Could not submit that.',
        }
      }
      return {
        ok: false,
        status: 502,
        message: 'Could not submit that. Try again in a moment.',
      }
    }

    const id = typeof parsed?.id === 'string' ? parsed.id : ''
    // The one line that answers "did this actually reach Studio, and with
    // what id" from Vercel's function logs — mirrors what `lib/resend.ts`
    // used to log on its success path.
    console.log(`postToStudio: Studio accepted ${path}: id=${id || '(none)'}`)
    return { ok: true, id }
  } catch (err) {
    console.error(`postToStudio: request to Studio failed for ${path}:`, err)
    return {
      ok: false,
      status: 502,
      message: 'Could not submit that. Try again in a moment.',
    }
  }
}

export interface StudioFeedbackInput {
  readonly toolId?: string
  readonly toolName: string
  readonly category?: string
  readonly message: string
  readonly rating?: number | null
  readonly name?: string | null
  readonly email?: string | null
  readonly pageUrl?: string | null
  readonly visitorId?: string | null
}

export function submitToolFeedback(input: StudioFeedbackInput): Promise<StudioResult> {
  return postToStudio('/api/v1/tools/feedback', {
    tool_id: input.toolId ?? null,
    tool_name: input.toolName,
    category: input.category ?? 'General',
    message: input.message,
    rating: input.rating ?? null,
    name: input.name ?? null,
    email: input.email ?? null,
    page_url: input.pageUrl ?? null,
    visitor_id: input.visitorId ?? null,
  })
}

export type StudioRequestKind = 'tool_request' | 'prompt_request' | 'skill_request'

export interface StudioRequestInput {
  readonly kind: StudioRequestKind
  readonly title: string
  readonly description: string
  readonly affectedTool?: string | null
  readonly name?: string | null
  readonly email?: string | null
  readonly pageUrl?: string | null
  readonly visitorId?: string | null
}

export function submitToolRequest(input: StudioRequestInput): Promise<StudioResult> {
  return postToStudio('/api/v1/tools/requests', {
    kind: input.kind,
    title: input.title,
    description: input.description,
    affected_tool: input.affectedTool ?? null,
    name: input.name ?? null,
    email: input.email ?? null,
    page_url: input.pageUrl ?? null,
    visitor_id: input.visitorId ?? null,
  })
}
