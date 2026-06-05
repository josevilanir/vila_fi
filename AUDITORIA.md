# Auditoria — Vila Fi

> Relatório de arquitetura, qualidade de código e infraestrutura.
> Itens para implementar ao longo de várias sessões. Marque com `[x]` conforme concluir.

**Stack:** Next.js 16 (App Router) · React 19 · Prisma 7 / Postgres · Stripe · Zustand · Tailwind v4 · Zod

**Avaliação geral:** arquitetura sólida e bem separada (rotas finas → `services` → `prisma`, schemas Zod, `ApiResponse<T>` tipado, testes unit/component/e2e). Os pontos abaixo são o que merece atenção.

---

## 🔴 Segurança

### [x] 1. JWT no `localStorage` → roubo de token via XSS
**Arquivo:** `store/authStore.ts:33,50`
Token de 7 dias guardado em `localStorage` é legível por qualquer script injetado. Sem rotação nem revogação. Para um app com Stripe/billing, o ideal é cookie `httpOnly` + `SameSite`. Hoje, um único XSS = sequestro de sessão de 7 dias.

### [x] 2. Zero rate limiting / sem middleware
**Arquivo:** não existe `middleware.ts`
`/auth/login` e `/auth/register` estão abertos a brute-force e credential-stuffing. Em Vercel, o caminho natural é Routing Middleware ou Vercel Firewall (rate limit), ou um limiter via Upstash/Redis. É a lacuna mais explorável do projeto.

### [x] 3. `JWT_SECRET!` sem validação
**Arquivo:** `lib/auth.ts:3`
O `!` só falha no primeiro request (erro 500 genérico), não no boot. Se a env faltar em produção, a app sobe "saudável" e quebra silenciosamente no login. Validar as envs na inicialização (um `lib/env.ts` com Zod cobrindo `JWT_SECRET`, `DATABASE_URL`, `STRIPE_*`, `NEXT_PUBLIC_APP_URL`).

### [x] 4. `.env.local.example` documenta só `FREESOUND_API_KEY`
Faltam `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`. Quem clonar o repo não sobe o ambiente. Risco de misconfig em deploy.

---

## 🟠 Bugs / Correção

### [x] 5. Carregar preset não para sons removidos
**Arquivo:** `hooks/useAmbientMixer.ts:15-23`
O `useEffect` só dá `play` nos sons presentes em `volumes` — nunca chama `engine.stop` para os que saíram. `stop` só é acionado via `handleToggle`. Quando `loadPreset` chama `setAllVolumes` (`store/presetsStore.ts:52-53`) com um conjunto que **omite** um som tocando, esse som **continua tocando**. O próprio comentário no código admite a fragilidade. Bug real no fluxo central de presets.

### [x] 6. Webhook do Stripe sem idempotência nem tolerância a ordem
**Arquivo:** `app/api/v1/stripe/webhook/route.ts`
- Não deduplica por `event.id` — Stripe entrega *at-least-once*, então eventos repetidos reprocessam.
- `renewSubscription`/`updateSubscriptionStatus` fazem `update` por `stripeSubscriptionId`; se `invoice.payment_succeeded` chegar **antes** de `checkout.session.completed` (coluna ainda nula), o Prisma lança → 500 → Stripe re-tenta. Funciona por retry, mas é frágil. Considerar `upsert` ou tratar "registro não encontrado" como retry explícito.

### [x] 7. `customer.subscription.updated` rebaixa `trialing`/`past_due` para free
**Arquivo:** `services/subscription.service.ts:81`
`plan = status === 'active' ? 'premium' : 'free'`. Um trial pago ou um `past_due` temporário viram `free` imediatamente. Decidir conscientemente quais status mantêm premium.

---

## 🟡 Redundância

### [x] 8. Limite do plano free hardcoded em 3 lugares
- `lib/planFeatures.ts:20` (`< 2`)
- `components/Presets/SavePresetModal.tsx:15` (`FREE_LIMIT = 2`)
- `components/Presets/PresetsPanel.tsx:43` (`{presets.length}/2`)

Mude a regra de negócio e você esquece um. Centralizar numa constante exportada (ex.: `FREE_PRESET_LIMIT` em `planFeatures.ts`).

### [x] 9. `styled-components` para 1 único componente
**Arquivo:** `next.config.ts:5` + `components/ThemeSwitch/ThemeSwitch.tsx`
O compiler está ativo e a dep está no bundle, mas só `ThemeSwitch.tsx` usa. Tudo o mais é Tailwind v4. Uma biblioteca CSS-in-JS inteira (+ overhead de SSR) por um switch. Reescrever o ThemeSwitch em Tailwind e remover `styled-components` + o compiler.

### [x] 10. Três classes de erro idênticas
`AuthError`, `PresetError`, `SubscriptionError` (`services/*.ts`) são byte-a-byte iguais (`code`, `message`, `status`). Virar uma só `AppError` em `lib/`.

### [x] 11. Boilerplate de auth+try/catch repetido em toda rota
O padrão `getAuthUser → 401 → try → instanceof XError → err → console.error → 500` se repete em ~8 rotas. Um wrapper `withAuth(handler)` / `handleRoute` eliminaria dezenas de linhas e padronizaria o logging.

### [x] 12. `SafeSubscription` montado à mão
**Arquivo:** `app/api/v1/auth/me/route.ts:17-26`
Existe `toSafeUser` mas o equivalente da subscription é remontado inline. Criar `toSafeSubscription`.

---

## ⚙️ Infraestrutura / Performance

### [x] 13. Falta índice em `Preset.userId`
**Arquivo:** `prisma/schema.prisma` (migrations confirmam: nenhum índice)
`listPresets` e `count` filtram por `userId` (`services/preset.service.ts:16,23`) — as queries mais quentes — sem índice. Adicionar `@@index([userId])` no `schema.prisma`. Ganho direto conforme a base cresce.

### [x] 14. Sem CI
Não há `.github/workflows`. Há suíte unit/component/e2e (15 arquivos de teste), mas nada a executa no PR. Testes que não rodam automaticamente apodrecem. Um workflow simples rodando `test` + `lint` + `build` fecha isso.

### [x] 15. Sem `engines` no `package.json`
Sem pin de versão do Node, builds locais e Vercel podem divergir.

### [x] 16. Getters derivados dentro do estado Zustand
**Arquivo:** `store/ambientStore.ts:33-35`
`isActive`/`activeIds` como funções no store recriam funções a cada chamada e não são reativos. Convencional é derivar no componente ou via selector. Funciona, mas é um anti-padrão que pode confundir.

---

## Resumo de prioridade

| # | Item | Severidade |
|---|------|-----------|
| 1, 2 | JWT em localStorage + zero rate limiting | 🔴 atacável |
| 5 | Preset não para sons removidos | 🟠 bug visível |
| 6, 7 | Webhook sem idempotência / rebaixa trial | 🟠 billing |
| 3, 4 | Validação/documentação de envs | 🟠 deploy |
| 13 | Índice `Preset.userId` | 🟡 perf |
| 8, 9, 10, 11 | Redundâncias (limite, styled-components, classes de erro, boilerplate) | 🟡 manutenção |

**Sugestão de início rápido (alto retorno, baixo esforço):** itens **5** (bug de preset), **8** (limite duplicado) e **13** (índice).

---

## Pontos positivos (não mexer)

- Separação de camadas limpa (rota → service → prisma).
- Proxy do Freesound com retry/timeout/backoff bem pensado (`lib/freesound.ts`).
- Uso correto de `ref` contra stale closure no player do YouTube (`hooks/useRadioPlayer.ts`).
- Singletons do Prisma e do Howler corretos para React StrictMode.
