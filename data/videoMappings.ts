export interface VideoRule {
  requires: string[]
  video: string
  priority: number
}

// Primeira regra com maior priority cujos sons estão todos ativos ganha.
// requires: [] é o fallback (sempre satisfeita).
export const VIDEO_RULES: VideoRule[] = [
  { requires: ['rain', 'thunder'], video: 'storm-night.mp4',  priority: 12 },
  { requires: ['rain', 'cafe'],    video: 'cafe-rainy.mp4',   priority: 10 },
  { requires: ['rain'],            video: 'town-rain.mp4',    priority:  5 },
  { requires: ['forest'],          video: 'forest-day.mp4',   priority:  5 },
  { requires: ['waves'],           video: 'beach-sunset.mp4', priority:  5 },
  { requires: ['cafe'],            video: 'cafe-default.mp4',     priority:  3 },
  { requires: [],                  video: 'town-default.mp4', priority:  0 },
]
