export interface RadioStation {
  id: string
  label: string
  youtubeId: string
}

export const RADIO_STATIONS: RadioStation[] = [
  { id: 'lofi-girl',    label: 'Lofi Girl',        youtubeId: 'jfKfPfyJRdk' },
  { id: 'lofi-chill',   label: 'Chillhop',         youtubeId: '5yx6BWlEVcY' },
  { id: 'lofi-jazz',    label: 'Jazz Lofi',         youtubeId: 'Dx5qFachd3A' },
  { id: 'smooth-jazz',  label: 'Smooth Jazz',       youtubeId: 'Ac_jHfGfMoY' },
  { id: 'classical',    label: 'Classical Focus',   youtubeId: '4To3pxWNOCk' },
  { id: 'synthwave',    label: 'Synthwave',         youtubeId: '4xDzrJKXOOY' },
  { id: 'study-beats',  label: 'Study Beats',       youtubeId: 'lTRiuFIWV54' },
]
