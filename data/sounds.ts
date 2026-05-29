export interface SoundDef {
  id: string
  label: string
  freesoundId: number
  icon: string
}

// IDs curados do Freesound (freesound.org) — todos CC licenciados
export const SOUNDS: SoundDef[] = [
  { id: 'rain',       label: 'Chuva',        freesoundId: 238911, icon: '🌧️' }, // Seamless Rain Loop — qubodup
  { id: 'whitenoise', label: 'Ruído Branco', freesoundId: 147300, icon: '🌊' }, // Room White Noise — Littleboot
  { id: 'keyboard',   label: 'Teclado',      freesoundId: 361639, icon: '⌨️' }, // Keyboard typing loop — cabled_mess
  { id: 'cafe',       label: 'Cafeteria',    freesoundId: 394702, icon: '☕' }, // Café Atmo_loop — hannagreen
  { id: 'fireplace',  label: 'Lareira',      freesoundId:  44322, icon: '🔥' }, // Fireplace.WAV — inchadney
]
