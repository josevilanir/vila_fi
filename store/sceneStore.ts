import { create } from 'zustand'

interface SceneState {
  currentScene: 'town' | 'fireplace'
  setScene: (scene: 'town' | 'fireplace') => void
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: 'town',
  setScene: (scene) => set({ currentScene: scene }),
}))
