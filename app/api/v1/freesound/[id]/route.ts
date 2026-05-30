import { NextResponse } from 'next/server'

const API_BASE = 'https://freesound.org/apiv2'

// Resilience knobs for talking to Freesound. The maintenance episode that
// surfaced as upstream 502s is exactly what these guard against: a slow or
// flaky Freesound no longer hangs the serverless function or drops the sound on
// the first transient blip.
const REQUEST_TIMEOUT_MS = 10_000
const MAX_RETRIES = 2 // 3 attempts total
const BACKOFF_BASE_MS = 300

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// fetch wrapper with an explicit timeout + exponential backoff on transient
// failures (network errors / 5xx). 4xx are returned as-is — retrying a 404 or
// 401 is pointless. The last attempt's response (even a 5xx) is returned so the
// caller can map it to a user-facing error.
async function fetchWithRetry(
  url: string,
  init: RequestInit & { next?: { revalidate: number } } = {},
): Promise<Response> {
  let lastError: unknown

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      // Opt out of AbortController when using Next.js cache — passing a signal
      // disables the Data Cache in Next.js 15, which defeats revalidate entirely.
      const fetchInit = { ...init }
      if (!fetchInit.next) {
        fetchInit.signal = controller.signal
      }
      const res = await fetch(url, fetchInit)
      if (res.status >= 500 && attempt < MAX_RETRIES) {
        await delay(BACKOFF_BASE_MS * 2 ** attempt)
        continue
      }
      return res
    } catch (err) {
      lastError = err
      if (attempt < MAX_RETRIES) {
        await delay(BACKOFF_BASE_MS * 2 ** attempt)
        continue
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError
}

// This route runs server-side, so its egress IP (Vercel) is what reaches
// Freesound — not the client's. Both the metadata lookup AND the audio bytes
// are proxied here, because freesound.org and cdn.freesound.org share the same
// (potentially IP-blocked) infrastructure.
//
// It's inherently dynamic (reads the Range header), so caching is set per-fetch:
// metadata is revalidated daily, audio bytes are never cached.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // Server-only secret. NEXT_PUBLIC_ kept as a fallback for legacy envs, but it
  // leaks the token into the client bundle — prefer FREESOUND_API_KEY.
  const apiKey =
    process.env.FREESOUND_API_KEY || process.env.NEXT_PUBLIC_FREESOUND_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid sound id' }, { status: 400 })
  }

  // 1. Resolve the preview URL server-side. Cached so Howler's repeated range
  //    requests don't burn the Freesound API rate limit.
  const previewUrl = await resolvePreviewUrl(id, apiKey)
  if (previewUrl instanceof NextResponse) return previewUrl

  // 2. Stream the audio bytes through our server, forwarding Range for seeking.
  const range = request.headers.get('range')
  try {
    const upstream = await fetchWithRetry(previewUrl, {
      headers: range ? { Range: range } : undefined,
      cache: 'no-store',
    })

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 502 })
    }

    const headers = new Headers()
    headers.set('Content-Type', upstream.headers.get('Content-Type') ?? 'audio/mpeg')
    headers.set('Accept-Ranges', 'bytes')
    headers.set('Cache-Control', 'public, max-age=86400, immutable')

    const contentLength = upstream.headers.get('Content-Length')
    if (contentLength) headers.set('Content-Length', contentLength)
    const contentRange = upstream.headers.get('Content-Range')
    if (contentRange) headers.set('Content-Range', contentRange)

    return new Response(upstream.body, { status: upstream.status, headers })
  } catch {
    return NextResponse.json({ error: 'Failed to stream audio' }, { status: 502 })
  }
}

async function resolvePreviewUrl(
  id: string,
  apiKey: string,
): Promise<string | NextResponse> {
  try {
    const res = await fetchWithRetry(
      `${API_BASE}/sounds/${id}/?token=${apiKey}&fields=previews`,
      { next: { revalidate: 86400 } },
    )

    if (!res.ok) {
      console.error(`[freesound] metadata ${res.status} for sound ${id}`)
      return NextResponse.json(
        { error: 'Freesound metadata error' },
        { status: res.status === 404 ? 404 : 502 },
      )
    }

    const data = await res.json()
    const url: string | undefined =
      data?.previews?.['preview-hq-mp3'] ?? data?.previews?.['preview-lq-mp3']

    if (!url) {
      return NextResponse.json({ error: 'No preview available' }, { status: 404 })
    }
    return url
  } catch {
    return NextResponse.json({ error: 'Failed to reach Freesound' }, { status: 502 })
  }
}
