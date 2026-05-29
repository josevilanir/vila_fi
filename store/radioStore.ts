import { create } from 'zustand'
import { RADIO_STATIONS } from '@/data/radios'

interface RadioState {
  stationId: string
  isPlaying: boolean
  setStation: (id: string) => void
  togglePlay: () => void
}

export const useRadioStore = create<RadioState>((set) => ({
  stationId: RADIO_STATIONS[0].id,
  isPlaying: false,
  setStation: (id) => set({ stationId: id }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
}))
