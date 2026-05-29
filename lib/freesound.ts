const BASE_URL = 'https://freesound.org/apiv2'

interface FreesoundPreviews {
  'preview-hq-mp3': string
  'preview-lq-mp3': string
  'preview-hq-ogg': string
  'preview-lq-ogg': string
}

interface FreesoundSoundResponse {
  previews: FreesoundPreviews
}

export async function fetchSoundPreviewUrl(
  soundId: number,
  apiKey: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/sounds/${soundId}/?token=${apiKey}&fields=previews`,
    )
    if (!res.ok) {
      console.warn(`[Freesound] Failed to fetch sound ${soundId}: ${res.status}`)
      return null
    }
    const data: FreesoundSoundResponse = await res.json()
    return (
      data.previews?.['preview-hq-mp3'] ??
      data.previews?.['preview-lq-mp3'] ??
      null
    )
  } catch (err) {
    console.warn(`[Freesound] Network error for sound ${soundId}:`, err)
    return null
  }
}
