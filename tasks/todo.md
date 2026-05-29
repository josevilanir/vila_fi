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

## RoadMap Fase 1 — Expansão do Catálogo ✅
- [x] `data/sounds.ts` — 10 sons (+ forest, waves, train, birds, thunder)
- [x] `data/radios.ts` — 7 estações (+ smooth-jazz, classical, synthwave, study-beats)
- [x] `data/videoMappings.ts` — 8 regras (+ forest-day, beach-sunset, storm-night)
- [x] `npm run build` sem erros ✅

## RoadMap Fase 2 — Timer Pomodoro ✅
- [x] `store/timerStore.ts` — Zustand com estado completo do timer
- [x] `hooks/useTimer.ts` — setInterval + sino (Howler.js) ao completar ciclo
- [x] `components/PomodoroTimer/TimerDisplay.tsx` — SVG ring progress + MM:SS
- [x] `components/PomodoroTimer/TimerControls.tsx` — Play/Pause/Reset/Skip + indicadores
- [x] `components/PomodoroTimer/TimerModeSelector.tsx` — abas Foco/Pausa Curta/Pausa Longa
- [x] `components/PomodoroTimer/PomodoroTimer.tsx` — container com toggle no Hub
- [x] `npm run build` sem erros ✅

## RoadMap Fase 3 — Compartilhar via URL ✅
- [x] `lib/shareUrl.ts` — serializeEnvironment + deserializeEnvironment (funções puras)
- [x] `hooks/useEnvironmentSync.ts` — carrega estado da URL na montagem
- [x] `components/ShareButton/ShareButton.tsx` — copia URL + feedback visual
- [x] Hub integrado: ShareButton no header + useEnvironmentSync ativo
- [x] `npm run build` sem erros ✅

## RoadMap Fase 4 — Auth + Presets ⏳ (aguardando decisão de backend)
> Requer: decisão entre Next.js API Routes + Supabase vs Express separado.
> Confirmar com o desenvolvedor antes de iniciar.

## RoadMap Fases 5-8 — Stripe, Upload, Widgets, Landing ⏳ (dependem Fase 4)

## Pendente (assets)
- [ ] Adicionar vídeos em `public/videos/` (town-default.mp4, town-rain.mp4, cozy-indoor.mp4, cafe-day.mp4, rainy-cafe.mp4, forest-day.mp4, beach-sunset.mp4, storm-night.mp4)
- [ ] Adicionar SFX em `public/audio/sfx/` (rain.mp3, whitenoise.mp3, keyboard.mp3, cafe.mp3, fireplace.mp3, bell.mp3)
