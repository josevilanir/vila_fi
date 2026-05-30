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

## RoadMap Fase 4 — Auth + Presets ✅

## RoadMap Fase 5 — Monetização: Planos + Stripe ✅
- [x] `prisma/schema.prisma` — model Subscription adicionado
- [x] `npx prisma generate` — client regenerado
- [x] `npm install stripe @stripe/stripe-js`
- [x] `lib/stripe.ts` — getStripe() lazy singleton
- [x] `lib/planFeatures.ts` — isPremium(), canSaveMorePresets()
- [x] `lib/types.ts` — SafeSubscription adicionado
- [x] `services/subscription.service.ts` — CRUD Stripe customer + subscription
- [x] `services/preset.service.ts` — verifica plano via canSaveMorePresets()
- [x] `app/api/v1/stripe/create-checkout/route.ts` — cria sessão Stripe Checkout
- [x] `app/api/v1/stripe/webhook/route.ts` — processa eventos Stripe (dahlia API)
- [x] `app/api/v1/stripe/portal/route.ts` — portal de gerenciamento
- [x] `app/api/v1/auth/me/route.ts` — inclui subscription na resposta
- [x] `store/authStore.ts` — subscription no estado global
- [x] `components/Upgrade/UpgradeBanner.tsx` — banner de upgrade premium
- [x] `components/Presets/SavePresetModal.tsx` — mostra UpgradeBanner no limite
- [x] `components/Auth/UserMenu.tsx` — badge PRO + link portal/upgrade
- [x] `npm run build` sem erros ✅
> **PENDENTE:** developer criar migration `npx prisma migrate dev --name add_subscription` após configurar Neon DB

## RoadMap Fase 6 — Landing Page ✅
- [x] `app/app/page.tsx` — hub movido para /app
- [x] `app/app/layout.tsx` — layout com overflow-hidden para o hub
- [x] `app/page.tsx` — landing page (LandingNav + HeroSection + FeaturesSection + PlansSection + LandingFooter)
- [x] `components/Landing/LandingNav.tsx` — navbar sticky com efeito de scroll
- [x] `components/Landing/HeroSection.tsx` — hero com CTA e preview do app
- [x] `components/Landing/FeaturesSection.tsx` — 6 features com ícones e animações
- [x] `components/Landing/PlansSection.tsx` — Free vs Premium com toggle mensal/anual
- [x] `components/Landing/LandingFooter.tsx` — footer com links
- [x] `app/layout.tsx` — metadata OpenGraph + Twitter Cards + keywords
- [x] `app/sitemap.ts` — sitemap.xml gerado automaticamente
- [x] `app/robots.ts` — robots.txt
- [x] `npm run build` sem erros ✅

## Pendente (assets)
- [ ] Adicionar vídeos em `public/videos/` (town-default.mp4, town-rain.mp4, cozy-indoor.mp4, cafe-day.mp4, rainy-cafe.mp4, forest-day.mp4, beach-sunset.mp4, storm-night.mp4)
- [ ] Adicionar SFX em `public/audio/sfx/` (rain.mp3, whitenoise.mp3, keyboard.mp3, cafe.mp3, fireplace.mp3, bell.mp3)
