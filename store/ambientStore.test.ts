import { describe, it, expect, beforeEach } from 'vitest'
import { useAmbientStore } from './ambientStore'

beforeEach(() => {
  useAmbientStore.setState({ volumes: {} })
})

describe('ambientStore', () => {
  describe('setVolume', () => {
    it('sets the volume for a given sound id', () => {
      useAmbientStore.getState().setVolume('rain', 0.5)
      expect(useAmbientStore.getState().volumes['rain']).toBe(0.5)
    })

    it('does not affect other sounds', () => {
      useAmbientStore.setState({ volumes: { wind: 0.8 } })
      useAmbientStore.getState().setVolume('rain', 0.5)
      expect(useAmbientStore.getState().volumes['wind']).toBe(0.8)
    })
  })

  describe('toggle', () => {
    it('adds a sound at default volume when not active', () => {
      useAmbientStore.getState().toggle('rain')
      expect(useAmbientStore.getState().volumes['rain']).toBe(0.7)
    })

    it('removes a sound when already active', () => {
      useAmbientStore.setState({ volumes: { rain: 0.7 } })
      useAmbientStore.getState().toggle('rain')
      expect('rain' in useAmbientStore.getState().volumes).toBe(false)
    })
  })

  describe('isActive', () => {
    it('returns true when sound is in volumes', () => {
      useAmbientStore.setState({ volumes: { rain: 0.5 } })
      expect(useAmbientStore.getState().isActive('rain')).toBe(true)
    })

    it('returns false when sound is not in volumes', () => {
      expect(useAmbientStore.getState().isActive('rain')).toBe(false)
    })
  })

  describe('activeIds', () => {
    it('returns all active sound ids', () => {
      useAmbientStore.setState({ volumes: { rain: 0.5, wind: 0.8 } })
      const ids = useAmbientStore.getState().activeIds()
      expect(ids).toContain('rain')
      expect(ids).toContain('wind')
      expect(ids).toHaveLength(2)
    })

    it('returns an empty array when no sounds are active', () => {
      expect(useAmbientStore.getState().activeIds()).toHaveLength(0)
    })
  })

  describe('setAllVolumes', () => {
    it('replaces the entire volumes map', () => {
      useAmbientStore.setState({ volumes: { rain: 0.5 } })
      useAmbientStore.getState().setAllVolumes({ wind: 0.3, fire: 0.6 })
      const { volumes } = useAmbientStore.getState()
      expect(volumes).toEqual({ wind: 0.3, fire: 0.6 })
      expect('rain' in volumes).toBe(false)
    })
  })
})
