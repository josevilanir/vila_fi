export interface RadioStation {
  id: string
  label: string
  youtubeId: string
}

export const RADIO_STATIONS: RadioStation[] = [
  { id: 'lofi-girl',   label: 'Lofi Girl',        youtubeId: 'jfKfPfyJRdk' },
  { id: 'lofi-chill',  label: 'Chillhop',         youtubeId: '5yx6BWlEVcY' },
  { id: 'lofi-jazz',   label: 'Jazz Lofi',         youtubeId: 'Dx5qFachd3A' },
]
