import { create } from 'zustand'

interface AmbientState {
  volumes: Record<string, number>
  setVolume: (id: string, volume: number) => void
  setAllVolumes: (volumes: Record<string, number>) => void
  toggle: (id: string) => void
  isActive: (id: string) => boolean
  activeIds: () => string[]
}

const DEFAULT_VOLUME = 0.7

export const useAmbientStore = create<AmbientState>((set, get) => ({
  volumes: {},

  setVolume: (id, volume) =>
    set((state) => ({ volumes: { ...state.volumes, [id]: volume } })),

  setAllVolumes: (volumes) => set({ volumes }),

  toggle: (id) =>
    set((state) => {
      const next = { ...state.volumes }
      if (id in next) {
        delete next[id]
      } else {
        next[id] = DEFAULT_VOLUME
      }
      return { volumes: next }
    }),

  isActive: (id) => id in get().volumes,

  activeIds: () => Object.keys(get().volumes),
}))
