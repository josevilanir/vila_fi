# Vila Fi — Todo

## Fase 0 — Bootstrap ✅
- [x] `create-next-app` com TypeScript + Tailwind + App Router
- [x] Instalar: `framer-motion`, `zustand`, `howler`, `@types/howler`, `@types/youtube`, `clsx`, `tailwind-merge`
- [x] Criar estrutura de pastas
- [x] Criar `tasks/todo.md` e `tasks/lessons.md`

## Fase 1 — Data Layer & Stores ✅
- [x] `data/sounds.ts` — catálogo de 5 SFX
- [x] `data/radios.ts` — catálogo de rádios com youtubeId
- [x] `data/videoMappings.ts` — regras de prioridade sons → vídeo
- [x] `store/ambientStore.ts` — Zustand: `Record<soundId, number | null>`
- [x] `store/radioStore.ts` — Zustand: `{ stationId, isPlaying }`

## Fase 2 — Engine de Áudio ✅
- [x] `hooks/useAudioEngine.ts` — Howler.js wrapper (SFX)
- [x] `hooks/useAmbientMixer.ts` — toggle + volume por SFX
- [x] `hooks/useRadioPlayer.ts` — YouTube IFrame API
- [x] `components/RadioPlayer/YoutubePlayer.tsx` — iframe oculto

## Fase 3 — Sistema de Vídeo Reativo ✅
- [x] `hooks/useVideoReactor.ts` — sons ativos → vídeo ativo
- [x] `components/VideoBackground/VideoLayer.tsx`
- [x] `components/VideoBackground/VideoBackground.tsx` — crossfade AnimatePresence

## Fase 4 — Componentes de UI ✅
- [x] `components/ui/Slider.tsx`
- [x] `components/ui/Button.tsx`
- [x] `components/ui/Card.tsx`
- [x] `lib/utils.ts` — cn() helper
- [x] `components/AmbientMixer/SoundCard.tsx`
- [x] `components/AmbientMixer/AmbientMixer.tsx`
- [x] `components/RadioPlayer/RadioPlayer.tsx`
- [x] `components/RadioPlayer/StationSelector.tsx`

## Fase 5 — Layout & Polish ✅
- [x] `app/layout.tsx` — metadados, fonte Inter
- [x] `app/page.tsx` — hub principal com painéis flutuantes
- [x] Build sem erros de tipo (`npm run build` ✅)

## Pendente (assets)
- [ ] Adicionar vídeos em `public/videos/` (town-default.mp4, town-rain.mp4, cozy-indoor.mp4, cafe-day.mp4, rainy-cafe.mp4)
- [ ] Adicionar SFX em `public/audio/sfx/` (rain.mp3, whitenoise.mp3, keyboard.mp3, cafe.mp3, fireplace.mp3)
