import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

const SOUND_ID = '1234'
const PREVIEW_URL = 'https://cdn.freesound.org/previews/1234-hq.mp3'

function ctx(id: string) {
  return { params: Promise.resolve({ id }) }
}

function req(range?: string) {
  return new Request(`http://localhost/api/v1/freesound/${SOUND_ID}`, {
    headers: range ? { Range: range } : undefined,
  })
}

function metadataRes(status: number, previews?: Record<string, string>) {
  return new Response(JSON.stringify(previews ? { previews } : {}), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function audioRes(status = 200) {
  return new Response('fake-audio-bytes', {
    status,
    headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': '16' },
  })
}

const okPreviews = { 'preview-hq-mp3': PREVIEW_URL }

beforeEach(() => {
  process.env.FREESOUND_API_KEY = 'test-key'
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('GET /api/v1/freesound/[id]', () => {
  it('returns 400 for a non-numeric id', async () => {
    const res = await GET(req(), ctx('abc'))
    expect(res.status).toBe(400)
  })

  it('returns 500 when the API key is not configured', async () => {
    delete process.env.FREESOUND_API_KEY
    delete process.env.NEXT_PUBLIC_FREESOUND_API_KEY
    const res = await GET(req(), ctx(SOUND_ID))
    expect(res.status).toBe(500)
  })

  it('returns 404 when the sound does not exist upstream', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(metadataRes(404)))
    const res = await GET(req(), ctx(SOUND_ID))
    expect(res.status).toBe(404)
  })

  it('returns 404 when the sound has no mp3 preview', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(metadataRes(200, {})))
    const res = await GET(req(), ctx(SOUND_ID))
    expect(res.status).toBe(404)
  })

  it('streams audio bytes on the happy path', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(metadataRes(200, okPreviews))
      .mockResolvedValueOnce(audioRes(200))
    vi.stubGlobal('fetch', fetchMock)

    const res = await GET(req(), ctx(SOUND_ID))

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('audio/mpeg')
    expect(res.headers.get('Accept-Ranges')).toBe('bytes')
    // metadata URL first, then the resolved preview URL
    expect(fetchMock.mock.calls[1][0]).toBe(PREVIEW_URL)
  })

  it('forwards the Range header to the upstream audio request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(metadataRes(200, okPreviews))
      .mockResolvedValueOnce(audioRes(206))
    vi.stubGlobal('fetch', fetchMock)

    await GET(req('bytes=0-1023'), ctx(SOUND_ID))

    const audioInit = fetchMock.mock.calls[1][1]
    expect(audioInit.headers).toMatchObject({ Range: 'bytes=0-1023' })
  })

  it('retries transient 5xx on metadata and succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(metadataRes(503))
      .mockResolvedValueOnce(metadataRes(200, okPreviews))
      .mockResolvedValueOnce(audioRes(200))
    vi.stubGlobal('fetch', fetchMock)

    const res = await GET(req(), ctx(SOUND_ID))

    expect(res.status).toBe(200)
    // 2 metadata attempts (1 failed + 1 retry) + 1 audio
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('maps a persistent upstream 5xx to a 502', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(metadataRes(503)))
    const res = await GET(req(), ctx(SOUND_ID))
    expect(res.status).toBe(502)
  })

  it('maps a network failure to a 502', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const res = await GET(req(), ctx(SOUND_ID))
    expect(res.status).toBe(502)
  })
})
