export interface VideoRule {
  requires: string[]
  video: string
  priority: number
}

// Primeira regra com maior priority cujos sons estão todos ativos ganha.
// requires: [] é o fallback (sempre satisfeita).
export const VIDEO_RULES: VideoRule[] = [
  { requires: ['rain', 'cafe'],  video: 'rainy-cafe.mp4',   priority: 10 },
  { requires: ['rain'],          video: 'town-rain.mp4',    priority:  5 },
  { requires: ['fireplace'],     video: 'cozy-indoor.mp4',  priority:  5 },
  { requires: ['cafe'],          video: 'cafe-day.mp4',     priority:  3 },
  { requires: [],                video: 'town-default.mp4', priority:  0 },
]
