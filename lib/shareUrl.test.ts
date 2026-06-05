import { describe, it, expect } from 'vitest'
import { serializeEnvironment, deserializeEnvironment } from './shareUrl'

describe('serializeEnvironment', () => {
  it('includes active sounds as "id:volume" pairs', () => {
    const qs = serializeEnvironment({ rain: 0.5, wind: 0.8 }, 'station-1', true)
    const params = new URLSearchParams(qs)
    expect(params.get('sounds')).toContain('rain:0.50')
    expect(params.get('sounds')).toContain('wind:0.80')
  })

  it('omits the sounds param when the volumes map is empty', () => {
    const qs = serializeEnvironment({}, 'station-1', false)
    const params = new URLSearchParams(qs)
    expect(params.has('sounds')).toBe(false)
  })

  it('omits sounds with volume 0', () => {
    const qs = serializeEnvironment({ rain: 0, wind: 0.5 }, '', false)
    const params = new URLSearchParams(qs)
    const sounds = params.get('sounds') ?? ''
    expect(sounds).not.toContain('rain')
  })

  it('includes the radio station id', () => {
    const qs = serializeEnvironment({}, 'jazz-fm', false)
    expect(new URLSearchParams(qs).get('radio')).toBe('jazz-fm')
  })

  it('serializes the playing flag', () => {
    const qs = serializeEnvironment({}, '', true)
    expect(new URLSearchParams(qs).get('playing')).toBe('true')
  })
})

describe('deserializeEnvironment', () => {
  it('parses volumes correctly', () => {
    const params = new URLSearchParams('sounds=rain:0.50,wind:0.80&radio=jazz&playing=true')
    const result = deserializeEnvironment(params)
    expect(result.volumes['rain']).toBeCloseTo(0.5)
    expect(result.volumes['wind']).toBeCloseTo(0.8)
  })

  it('parses the radio station id', () => {
    const params = new URLSearchParams('radio=jazz-fm&playing=false')
    expect(deserializeEnvironment(params).stationId).toBe('jazz-fm')
  })

  it('returns stationId = null when radio param is absent', () => {
    expect(deserializeEnvironment(new URLSearchParams('playing=false')).stationId).toBeNull()
  })

  it('parses the playing flag', () => {
    expect(deserializeEnvironment(new URLSearchParams('playing=true')).isPlaying).toBe(true)
    expect(deserializeEnvironment(new URLSearchParams('playing=false')).isPlaying).toBe(false)
  })

  it('ignores tokens with volume out of the (0, 1] range', () => {
    const params = new URLSearchParams('sounds=rain:1.50,wind:-0.1,fire:0.00')
    const { volumes } = deserializeEnvironment(params)
    expect(Object.keys(volumes)).toHaveLength(0)
  })

  it('is a round-trip with serializeEnvironment', () => {
    const original = { rain: 0.5, wind: 0.8 }
    const qs = serializeEnvironment(original, 'jazz', true)
    const { volumes, stationId, isPlaying } = deserializeEnvironment(new URLSearchParams(qs))
    expect(volumes['rain']).toBeCloseTo(0.5)
    expect(volumes['wind']).toBeCloseTo(0.8)
    expect(stationId).toBe('jazz')
    expect(isPlaying).toBe(true)
  })
})
