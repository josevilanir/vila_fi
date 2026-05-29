import { create } from 'zustand'
import { FrontendPreset } from '@/lib/types'
import { useAmbientStore } from './ambientStore'
import { useRadioStore } from './radioStore'
import { useAuthStore } from './authStore'

interface PresetsState {
  presets: FrontendPreset[]
  isLoading: boolean
  fetchPresets: () => Promise<void>
  savePreset: (name: string) => Promise<void>
  loadPreset: (preset: FrontendPreset) => void
  deletePreset: (id: string) => Promise<void>
}

function authHeaders() {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const usePresetsStore = create<PresetsState>((set) => ({
  presets: [],
  isLoading: false,

  fetchPresets: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/v1/presets', { headers: authHeaders() })
      const json = await res.json()
      if (!json.error) set({ presets: json.data })
    } finally {
      set({ isLoading: false })
    }
  },

  savePreset: async (name) => {
    const sounds = useAmbientStore.getState().volumes
    const radioId = useRadioStore.getState().stationId
    const res = await fetch('/api/v1/presets', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, sounds, radioId }),
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    set((state) => ({ presets: [json.data, ...state.presets] }))
  },

  loadPreset: (preset) => {
    useAmbientStore.getState().setAllVolumes(preset.sounds)
    useRadioStore.getState().setStation(preset.radioId)
  },

  deletePreset: async (id) => {
    const res = await fetch(`/api/v1/presets/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    set((state) => ({ presets: state.presets.filter((p) => p.id !== id) }))
  },
}))
