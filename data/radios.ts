export interface RadioStation {
  id: string
  label: string
  youtubeId: string
}

export const RADIO_STATIONS: RadioStation[] = [
  { id: 'lofi-girl',    label: 'Lofi Girl',        youtubeId: 'X4VbdwhkE10' },
  { id: 'lofi-chill',   label: 'Chillhop',         youtubeId: '5yx6BWlEVcY' },
  { id: 'lofi-jazz',    label: 'Jazz Lofi',         youtubeId: 'Dx5qFachd3A' },
  { id: 'smooth-jazz',  label: 'Smooth Jazz',       youtubeId: 'csg53CHpvVs' },
  { id: 'classical',    label: 'Classical Focus',   youtubeId: 'jXAEIWcGXwE' },
  { id: 'synthwave',    label: 'Synthwave',         youtubeId: '4xDzrJKXOOY' },
  { id: 'study-beats',  label: 'Study Beats',       youtubeId: 'lTRiuFIWV54' },
]
