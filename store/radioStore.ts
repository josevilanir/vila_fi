import { create } from 'zustand'
import { RADIO_STATIONS } from '@/data/radios'

interface RadioState {
  stationId: string
  isPlaying: boolean
  volume: number
  setStation: (id: string) => void
  nextStation: () => void
  prevStation: () => void
  togglePlay: () => void
  setVolume: (volume: number) => void
}

export const useRadioStore = create<RadioState>((set) => ({
  stationId: RADIO_STATIONS[0].id,
  isPlaying: false,
  volume: 0.7,
  setStation: (id) => set({ stationId: id }),
  nextStation: () => set((state) => {
    const currentIndex = RADIO_STATIONS.findIndex(r => r.id === state.stationId)
    const nextIndex = (currentIndex + 1) % RADIO_STATIONS.length
    return { stationId: RADIO_STATIONS[nextIndex].id }
  }),
  prevStation: () => set((state) => {
    const currentIndex = RADIO_STATIONS.findIndex(r => r.id === state.stationId)
    const prevIndex = (currentIndex - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length
    return { stationId: RADIO_STATIONS[prevIndex].id }
  }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setVolume: (volume) => set({ volume }),
}))
