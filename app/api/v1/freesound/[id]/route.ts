import { NextResponse } from 'next/server'

const API_BASE = 'https://freesound.org/apiv2'

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
    const upstream = await fetch(previewUrl, {
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
    const res = await fetch(
      `${API_BASE}/sounds/${id}/?token=${apiKey}&fields=previews`,
      { next: { revalidate: 86400 } },
    )

    if (!res.ok) {
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
