export function serializeEnvironment(
  volumes: Record<string, number>,
  stationId: string,
  isPlaying: boolean,
): string {
  const params = new URLSearchParams()

  const activeSounds = Object.entries(volumes)
    .filter(([, v]) => v > 0)
    .map(([id, v]) => `${id}:${v.toFixed(2)}`)
    .join(',')

  if (activeSounds) params.set('sounds', activeSounds)
  if (stationId) params.set('radio', stationId)
  params.set('playing', String(isPlaying))

  return params.toString()
}

export function deserializeEnvironment(searchParams: URLSearchParams): {
  volumes: Record<string, number>
  stationId: string | null
  isPlaying: boolean
} {
  const volumes: Record<string, number> = {}

  const rawSounds = searchParams.get('sounds')
  if (rawSounds) {
    for (const token of rawSounds.split(',')) {
      const [id, raw] = token.split(':')
      const v = parseFloat(raw)
      if (id && !isNaN(v) && v > 0 && v <= 1) {
        volumes[id] = v
      }
    }
  }

  return {
    volumes,
    stationId: searchParams.get('radio'),
    isPlaying: searchParams.get('playing') === 'true',
  }
}
