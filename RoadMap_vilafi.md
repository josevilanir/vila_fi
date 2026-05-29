# Vila Fi — Roadmap de Produto & Implementação

> **Para o Claude Code:** Leia este documento inteiro antes de executar qualquer tarefa. Cada fase tem pré-requisitos, decisões de arquitetura e critérios de aceite. Nunca pule uma fase sem confirmar com o desenvolvedor. Sempre rode `npm run build` ao final de cada fase e corrija todos os erros de tipo antes de marcar como concluída.
>
> **Stack do projeto:** Seguir estritamente o definido no `claude.md`. Não introduzir nenhuma dependência nova sem aprovação explícita do desenvolvedor.

---

## Contexto do Projeto

**Vila Fi** é um Web Environment Hub focado em produtividade e foco. O usuário monta seu ambiente sonoro-visual ideal combinando rádios lo-fi (via YouTube IFrame API), sons ambientes (via Howler.js + Freesound API) e vídeos de fundo que reagem dinamicamente às escolhas sonoras.

**Stack confirmada (claude.md — não desviar):**

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Zustand (estado global)
- Howler.js (SFX engine)
- YouTube IFrame API (rádio)
- **Next.js API Routes** (backend — monolith leve, lógica server-side)
- **Prisma** (ORM — type-safe, migrations)
- **PostgreSQL via Neon DB** (banco de dados)
- **JWT + bcryptjs** (auth stateless)
- **Zod** (validação na boundary da API)
- **Vercel** (deploy)

**Estrutura de pastas atual:**

```
app/
  layout.tsx
  page.tsx
  globals.css
  api/
    v1/
      auth/
        register/route.ts
        login/route.ts
        me/route.ts
      presets/
        route.ts
        [id]/route.ts
components/
  ui/                  (Button, Card, Slider)
  AmbientMixer/        (AmbientMixer, SoundCard)
  RadioPlayer/         (RadioPlayer, StationSelector, YoutubePlayer)
  VideoBackground/     (VideoBackground, VideoLayer)
  PomodoroTimer/       (TimerDisplay, TimerControls, TimerModeSelector, PomodoroTimer)
  ShareButton/         (ShareButton)
  Auth/                (LoginForm, RegisterForm, AuthModal, UserMenu)
  Presets/             (PresetCard, PresetList, SavePresetModal, PresetsPanel)
data/
  sounds.ts            (10 sons)
  radios.ts            (7 estações)
  videoMappings.ts     (8 regras)
hooks/
  useAudioEngine.ts
  useAmbientMixer.ts
  useRadioPlayer.ts
  useVideoReactor.ts
  useTimer.ts
  useEnvironmentSync.ts
  useAuth.ts
  usePresets.ts
store/
  ambientStore.ts      (+ setAllVolumes para carregar presets)
  radioStore.ts
  timerStore.ts
  authStore.ts
  presetsStore.ts
lib/
  utils.ts             (cn() helper)
  shareUrl.ts          (serialize/deserialize URL)
  prisma.ts            (singleton PrismaClient + pg adapter)
  auth.ts              (signToken / verifyToken JWT)
  getAuthUser.ts       (extrai payload do Bearer token)
  api-response.ts      (helpers ok() / err() padronizados)
  types.ts             (SafeUser, FrontendPreset, ApiResponse<T>)
  schemas/
    auth.ts            (RegisterSchema, LoginSchema — Zod v4)
    preset.ts          (CreatePresetSchema, UpdatePresetSchema)
services/
  auth.service.ts      (registerUser, loginUser, getUserById)
  preset.service.ts    (listPresets, createPreset, getPreset, updatePreset, deletePreset)
prisma/
  schema.prisma        (models User, Preset)
  migrations/
    20260529165839_init/migration.sql
prisma.config.ts       (Prisma v7 config — carrega .env/.env.local manualmente)
tasks/
  todo.md
  lessons.md
```

**Notas técnicas para sessões futuras:**

- **Prisma v7:** `url` saiu do `schema.prisma` — fica em `prisma.config.ts`. O CLI não carrega `.env` automaticamente; o config faz isso manualmente via `readFileSync`.
- **Zod v4:** usa `.issues[0]?.message`, **não** `.errors[0]?.message`.
- **`prisma.config.ts`** está excluído do `tsconfig.json` (é CLI-only, não é compilado pelo Next.js).
- **Adapter pg:** `lib/prisma.ts` usa `@prisma/adapter-pg` + `pg.Pool` para a conexão runtime. Para Vercel, considerar migrar para `@prisma/adapter-neon` + `@neondatabase/serverless` na Fase 5.
- **Migrations:** rodar com `npx prisma migrate dev --name <nome>` no terminal. O `.env` (cópia do DATABASE_URL) é necessário para o CLI.

**Assets pendentes (adicionar manualmente):**

- `public/videos/`: `forest-day.mp4`, `beach-sunset.mp4`, `storm-night.mp4`
- `public/audio/sfx/bell.mp3` (Pomodoro)

---

## Status das Fases

| Fase | Descrição                                 | Status       |
| ---- | ----------------------------------------- | ------------ |
| 1    | Catálogo expandido (sons, rádios, vídeos) | ✅ Concluída |
| 2    | Timer Pomodoro                            | ✅ Concluída |
| 3    | Compartilhar ambiente via URL             | ✅ Concluída |
| 4    | Autenticação + Presets salvos             | ✅ Concluída |
| 5    | Monetização — Planos + Stripe             | ✅ Concluída |
| 6    | Upload de background personalizado        | 🔜 Próxima   |
| 7    | Widgets extras                            | ⬜ Pendente  |
| 8    | Landing page + SEO                        | ⬜ Pendente  |

---

## Fase 4 — Autenticação & Persistência de Presets

**Objetivo:** Permitir ao usuário salvar seus ambientes favoritos com nome e carregá-los em qualquer sessão. Pré-requisito obrigatório para monetização.

**Estimativa:** 2–3 dias

**Decisão de arquitetura (claude.md):** Next.js API Routes para o backend (monolith simples, sem servidor separado), Prisma como ORM, PostgreSQL hospedado no **Neon DB**.

---

### 4.0 — Setup: Neon DB + Prisma

**Instalar dependências:**

```bash
npm install @prisma/client prisma bcryptjs jsonwebtoken zod
npm install -D @types/bcryptjs @types/jsonwebtoken
npx prisma init
```

**Variáveis de ambiente (`.env.local`):**

```env
# Neon DB — pegar a connection string no dashboard do Neon (formato pooled)
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/vilafi?sslmode=require"

# JWT — gerar com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="seu_secret_aqui_minimo_64_chars"
JWT_EXPIRES_IN="7d"
```

> **Regra do claude.md:** `.env.local` deve estar no `.gitignore` antes do primeiro commit. Nunca commitar credenciais.

**`prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  presets      Preset[]
}

model Preset {
  id          String   @id @default(cuid())
  name        String
  sounds      Json     // Record<soundId, number> — ex: { "rain": 0.8, "cafe": 0.5 }
  radioId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Rodar a primeira migration:

```bash
npx prisma migrate dev --name init
```

---

### 4.1 — Instância Singleton do Prisma Client

Criar `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> **Motivo:** Next.js em dev recria módulos a cada hot reload. Sem o singleton, estoura o limite de conexões do Neon.

---

### 4.2 — Validação com Zod (Schemas)

Criar `lib/schemas/auth.ts`:

```typescript
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  name: z.string().min(2).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
```

Criar `lib/schemas/preset.ts`:

```typescript
import { z } from "zod";

export const CreatePresetSchema = z.object({
  name: z.string().min(1).max(50),
  sounds: z.record(z.string(), z.number().min(0).max(1)),
  radioId: z.string().min(1),
});

export const UpdatePresetSchema = CreatePresetSchema.partial();

export type CreatePresetInput = z.infer<typeof CreatePresetSchema>;
```

---

### 4.3 — Auth: JWT Stateless

Criar `lib/auth.ts`:

```typescript
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export interface JWTPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}
```

Criar `lib/getAuthUser.ts` — helper para extrair o usuário autenticado em qualquer API Route:

```typescript
import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "./auth";

export function getAuthUser(req: NextRequest): JWTPayload | null {
  try {
    const header = req.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) return null;
    const token = header.slice(7);
    return verifyToken(token);
  } catch {
    return null;
  }
}
```

> **Regra do claude.md:** Validação de token DEVE estar em middleware/helper — nunca dentro de Controllers ou Services.

---

### 4.4 — API Routes: Auth

**Arquitetura por camadas (obrigatório conforme claude.md):**

- `route.ts` → recebe request, delega para Service, retorna response (zero lógica)
- `services/auth.service.ts` → toda lógica de negócio (hash, comparação, busca)
- `lib/prisma.ts` → acesso ao banco (Repository implícito via Prisma)

Criar `app/api/v1/auth/register/route.ts`:

```typescript
// Responsabilidade: receber POST, validar com Zod, chamar AuthService, retornar resposta
// NUNCA colocar lógica de hash ou busca no banco aqui
```

Criar `app/api/v1/auth/login/route.ts`:

```typescript
// Responsabilidade: receber POST, validar com Zod, chamar AuthService, retornar token JWT
```

Criar `app/api/v1/auth/me/route.ts`:

```typescript
// GET autenticado — retorna dados do usuário logado
// Usar getAuthUser() para extrair o payload do token
// Retornar 401 se não autenticado
```

Criar `services/auth.service.ts`:

```typescript
// Funções:
// - registerUser(input: RegisterInput): Promise<{ token: string, user: SafeUser }>
//   - Verifica se email já existe → lança erro 409
//   - Faz hash da senha com bcryptjs (rounds: 12)
//   - Cria User no banco via prisma
//   - Retorna token JWT + user sem passwordHash
//
// - loginUser(input: LoginInput): Promise<{ token: string, user: SafeUser }>
//   - Busca user por email → 401 se não encontrar (mensagem genérica)
//   - Compara senha com bcrypt.compare → 401 se inválida (mesma mensagem genérica)
//   - Retorna token JWT + user sem passwordHash
//
// REGRA: nunca retornar passwordHash para o cliente — sempre omitir do objeto de resposta
```

**Formato de resposta padronizado (claude.md — API como contrato):**

```typescript
// Sucesso
{ "data": { ... }, "error": null }

// Erro
{ "data": null, "error": { "code": "INVALID_CREDENTIALS", "message": "E-mail ou senha inválidos" } }
```

---

### 4.5 — API Routes: Presets

Criar `app/api/v1/presets/route.ts`:

- `GET` → lista todos os presets do usuário autenticado (401 se não autenticado)
- `POST` → cria novo preset — validar com `CreatePresetSchema`, checar limite do plano free (máx 2 presets)

Criar `app/api/v1/presets/[id]/route.ts`:

- `GET` → retorna preset por ID (verificar que pertence ao usuário logado — nunca expor preset alheio)
- `PUT` → atualiza nome/sons/radio do preset
- `DELETE` → deleta preset

Criar `services/preset.service.ts`:

```typescript
// Funções:
// - listPresets(userId: string): Promise<Preset[]>
// - createPreset(userId: string, input: CreatePresetInput): Promise<Preset>
//   - Verificar contagem atual → lançar erro 403 se free e já tem 2
// - updatePreset(id: string, userId: string, input: Partial<CreatePresetInput>): Promise<Preset>
//   - Verificar ownership antes de atualizar
// - deletePreset(id: string, userId: string): Promise<void>
//   - Verificar ownership antes de deletar
//
// REGRA: toda verificação de ownership (preset pertence ao userId?) acontece aqui, no Service
// NUNCA verificar ownership no Controller (route.ts)
```

---

### 4.6 — Store de Auth no Frontend

Criar `store/authStore.ts` com Zustand:

```typescript
interface AuthState {
  user: SafeUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => void; // lê token do localStorage na montagem
}
```

> **Regra do claude.md:** Token JWT armazenado em `localStorage` somente se não houver alternativa melhor — avaliar `httpOnly` cookie via API Route no futuro. Por ora, `localStorage` é aceitável para MVP.

Criar `hooks/useAuth.ts` — wrapper do store para uso nos componentes (nunca acessar o store diretamente em componentes UI).

---

### 4.7 — Store de Presets no Frontend

Criar `store/presetsStore.ts`:

```typescript
interface PresetsState {
  presets: Preset[];
  isLoading: boolean;
  fetchPresets: () => Promise<void>;
  savePreset: (name: string) => Promise<void>; // captura estado atual dos stores ambient + radio
  loadPreset: (preset: Preset) => void; // aplica nos stores ambient + radio
  deletePreset: (id: string) => Promise<void>;
}
```

Criar `hooks/usePresets.ts` — wrapper do store para componentes.

---

### 4.8 — Componentes de Auth

Criar `components/Auth/`:

**`LoginForm.tsx`** — formulário de login:

- Campos: email, senha
- Validação client-side com Zod antes de submeter
- Estado de loading no botão durante a requisição
- Exibir erros inline (não alert/toast por ora)

**`RegisterForm.tsx`** — formulário de cadastro:

- Campos: nome (opcional), email, senha, confirmar senha
- Validação client-side com Zod

**`AuthModal.tsx`** — modal que alterna entre Login e Register:

- Toggle "Entrar" / "Criar conta"
- Fecha ao autenticar com sucesso

**`UserMenu.tsx`** — quando logado: avatar + nome + dropdown com "Meus Presets" e "Sair"

---

### 4.9 — Componentes de Presets

Criar `components/Presets/`:

**`PresetCard.tsx`** — card de um preset:

- Nome + data de criação
- Preview: ícones dos sons ativos
- Botões: Carregar, Deletar

**`PresetList.tsx`** — lista de presets com empty state e loading skeleton

**`SavePresetModal.tsx`** — modal para salvar:

- Input de nome do preset
- Preview do ambiente atual (sons ativos + rádio selecionada)
- Alerta se usuário free já tem 2 presets (com link para upgrade)

**`PresetsPanel.tsx`** — painel colapsável no hub, acessível pelo header

---

### 4.10 — Integração no Hub

Em `app/page.tsx`:

- Adicionar botão de auth no header (abre `AuthModal` se não logado, `UserMenu` se logado)
- Adicionar botão "Presets" no header (abre `PresetsPanel`)
- Chamar `authStore.restoreSession()` na montagem para reidratar sessão do localStorage

**Critério de aceite da Fase 4:**

- [x] Registro com email/senha cria usuário no Neon DB
- [x] Login retorna token JWT válido e persiste no localStorage
- [x] `GET /api/v1/auth/me` retorna 401 sem token e dados do usuário com token válido
- [x] Usuário consegue salvar preset (captura estado atual do ambient + radio)
- [x] Presets são listados e carregáveis (restaura sons + rádio nos stores)
- [x] Usuário free vê aviso ao tentar criar 3º preset
- [x] Preset de outro usuário retorna 403 se acessado diretamente
- [x] `passwordHash` nunca aparece em nenhuma resposta da API
- [x] `npm run build` sem erros de tipo
- [x] Migration Prisma aplicada com sucesso no Neon (`20260529165839_init`)

---

## Fase 5 — Monetização: Planos + Stripe

**Objetivo:** Converter usuários recorrentes em pagantes com plano Premium.

**Estimativa:** 2–3 dias

> **Pré-requisito:** Fase 4 concluída.

### 5.1 — Modelo de Planos

```
FREE
  - Todos os sons e rádios
  - Pomodoro timer
  - Compartilhar ambiente
  - Até 2 presets salvos

PREMIUM (R$19/mês ou R$149/ano)
  - Tudo do Free
  - Presets ilimitados
  - Cenas exclusivas
  - Upload de background personalizado (Fase 6)
  - Widgets extras (Fase 7)
```

### 5.2 — Schema: Assinatura

Adicionar ao `prisma/schema.prisma`:

```prisma
model Subscription {
  id                     String    @id @default(cuid())
  userId                 String    @unique
  user                   User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  stripeCustomerId       String    @unique
  stripeSubscriptionId   String?   @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?
  status                 String    @default("inactive") // active | inactive | canceled | past_due
  plan                   String    @default("free")     // free | premium
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt
}
```

Rodar migration:

```bash
npx prisma migrate dev --name add_subscription
```

### 5.3 — Variáveis de Ambiente

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
NEXT_PUBLIC_APP_URL=https://vilafi.com
```

**Instalar:**

```bash
npm install stripe @stripe/stripe-js
```

### 5.4 — API Routes: Stripe

Criar `app/api/v1/stripe/`:

**`create-checkout/route.ts` (POST — autenticado):**

- Cria ou recupera `stripeCustomerId` para o usuário
- Cria sessão de checkout Stripe com `price_id` e `success_url`/`cancel_url`
- Retorna `{ checkoutUrl }` para o frontend redirecionar

**`webhook/route.ts` (POST — público, validado):**

```typescript
// CRÍTICO: sempre validar assinatura do webhook
// stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)
// NUNCA processar webhook sem esta validação

// Eventos a processar:
// checkout.session.completed  → criar/ativar Subscription no banco
// invoice.payment_succeeded   → renovar stripeCurrentPeriodEnd
// customer.subscription.deleted → status = 'canceled', plan = 'free'
// customer.subscription.updated → atualizar status e plan
```

**`portal/route.ts` (POST — autenticado):**

- Cria sessão do portal de gerenciamento Stripe (cancelar, trocar plano)
- Retorna `{ portalUrl }` para o frontend redirecionar

Criar `services/subscription.service.ts`:

```typescript
// Funções:
// - getOrCreateStripeCustomer(userId, email): Promise<string> — retorna stripeCustomerId
// - activateSubscription(stripeCustomerId, subscriptionId, priceId, periodEnd): Promise<void>
// - cancelSubscription(stripeSubscriptionId): Promise<void>
// - getUserPlan(userId): Promise<'free' | 'premium'>
```

### 5.5 — Feature Flags

Criar `lib/planFeatures.ts`:

```typescript
export function isPremium(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return (
    subscription.plan === "premium" &&
    subscription.status === "active" &&
    subscription.stripeCurrentPeriodEnd != null &&
    subscription.stripeCurrentPeriodEnd > new Date()
  );
}

export function canSaveMorePresets(
  subscription: Subscription | null,
  currentCount: number,
): boolean {
  if (isPremium(subscription)) return true;
  return currentCount < 2;
}
```

> **Regra:** Usar `isPremium()` tanto no backend (nas API Routes, para bloquear de verdade) quanto no frontend (para mostrar locks na UI). O backend é a fonte da verdade — o frontend só melhora a UX.

### 5.6 — UI de Upgrade

Criar `components/Upgrade/UpgradeBanner.tsx`:

- Exibido quando usuário free tenta ação premium
- Lista os benefícios do Premium
- Botão "Assinar Premium" → chama `/api/v1/stripe/create-checkout` e redireciona

**Critério de aceite da Fase 5:**

- [ ] Checkout Stripe abre com cartão de teste `4242 4242 4242 4242`
- [ ] Após pagamento, banco registra `plan = 'premium'` e `status = 'active'`
- [ ] Webhook validado com `constructEvent` (testar com Stripe CLI: `stripe listen --forward-to localhost:3000/api/v1/stripe/webhook`)
- [ ] Cancelamento via portal revoga acesso (plan volta a `'free'`)
- [ ] Usuário free vê `UpgradeBanner` ao tentar criar 3º preset
- [ ] `isPremium()` usado no backend para bloquear — não apenas no frontend
- [ ] `npm run build` sem erros

---

## Fase 6 — Upload de Background Personalizado

**Objetivo:** Feature Premium de alto valor percebido. Usuário sobe sua própria foto ou vídeo.

**Estimativa:** 1–2 dias

> **Pré-requisito:** Fase 5 concluída. Exclusivo para Premium.

### 6.1 — Storage: Cloudflare R2

R2 é S3-compatible e tem free tier generoso (10GB/mês). Usar o SDK AWS S3 (compatível).

**Instalar:**

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Variáveis de ambiente:**

```env
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vilafi-backgrounds
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 6.2 — Flow de Upload (Presigned URL)

**Nunca fazer upload de arquivo pelo servidor Next.js.** O arquivo vai direto do browser para o R2.

Fluxo:

1. `POST /api/v1/upload/presign` → API valida usuário Premium, valida tipo/tamanho, retorna `{ uploadUrl, publicUrl }`
2. Frontend faz `PUT` direto para o R2 via `uploadUrl`
3. `POST /api/v1/upload/confirm` → API salva `publicUrl` no campo `customBackgroundUrl` do `User`

**Validações obrigatórias no servidor (nunca confiar no cliente):**

- Usuário é Premium? → 403 se não
- `contentType` aceito: `image/jpeg`, `image/png`, `image/webp`, `video/mp4`
- Tamanho máximo: imagem 10MB, vídeo 50MB

### 6.3 — Schema: Campo no User

Adicionar ao model `User` no Prisma:

```prisma
customBackgroundUrl String?
```

Migration:

```bash
npx prisma migrate dev --name add_custom_background
```

### 6.4 — Integração no VideoBackground

Em `hooks/useVideoReactor.ts`: se usuário tem `customBackgroundUrl` e modo custom está ativo, retornar essa URL como background ativo.

Em `components/VideoBackground/VideoLayer.tsx`: diferenciar URL externa (`http`) de caminho local. Para imagens, renderizar `<img>` com `object-fit: cover` em vez de `<video>`.

### 6.5 — UI de Upload

Criar `components/CustomBackground/BackgroundUploader.tsx`:

- Dropzone com fallback de `<input type="file">`
- Preview antes do upload
- Barra de progresso via `XMLHttpRequest` (não `fetch` — não expõe progresso nativo)
- Botão de remover background customizado

**Critério de aceite da Fase 6:**

- [ ] Usuário Premium sobe imagem e ela aparece como background imediatamente
- [ ] URL do background persiste entre sessões (salva no banco)
- [ ] Usuário free recebe 403 na API ao tentar fazer presign
- [ ] Tipos inválidos são rejeitados com mensagem clara
- [ ] `npm run build` sem erros

---

## Fase 7 — Widgets Extras (Premium)

**Objetivo:** Aumentar valor percebido do Premium com widgets visuais no hub.

**Estimativa:** 1–2 dias

### 7.1 — Widget: Relógio Analógico

Criar `components/Widgets/AnalogClock.tsx`:

- SVG puro com ponteiros animados via `transform: rotate()`
- `useEffect` + `setInterval` de 1 segundo
- Sem dependências externas

### 7.2 — Widget: Clima Atual

Criar `hooks/useWeather.ts`:

- API **Open-Meteo** (gratuita, sem API key): `https://api.open-meteo.com/v1/forecast`
- Pede geolocalização com `navigator.geolocation.getCurrentPosition()`
- Cache de 30 minutos no `sessionStorage`
- **Integração:** se está chovendo na cidade do usuário e som de chuva não está ativo → exibir sugestão de ativar

Criar `components/Widgets/WeatherWidget.tsx`.

### 7.3 — Widget: Contador de Foco

Criar `components/Widgets/FocusStats.tsx`:

- Persiste em `localStorage` (sem backend)
- Incrementa baseado nos ciclos Pomodoro completos (`timerStore`)
- Reset automático à meia-noite

### 7.4 — Sistema de Widgets

Criar `store/widgetsStore.ts`:

```typescript
interface WidgetsState {
  visible: { clock: boolean; weather: boolean; focusStats: boolean };
  toggle: (widget: keyof WidgetsState["visible"]) => void;
}
```

Criar `components/Widgets/WidgetsPanel.tsx` — menu de toggles para ativar/desativar cada widget.

**Critério de aceite da Fase 7:**

- [ ] Relógio atualiza em tempo real
- [ ] Clima exibe temperatura e condição correta
- [ ] Sugestão de chuva aparece quando chovendo e som desativado
- [ ] Contador persiste ao recarregar
- [ ] Widgets são Premium — usuário free vê lock
- [ ] `npm run build` sem erros

---

## Fase 8 — Landing Page + SEO

**Objetivo:** Página de marketing para aquisição e conversão.

**Estimativa:** 1–2 dias

### 8.1 — Rota `/`

Transformar a página raiz em landing page. Mover o hub para `/app`. Criar redirecionamento para `/app` após login.

**Seções:**

1. Hero — headline + CTA "Começar Grátis"
2. Demonstração visual — gif/vídeo do produto
3. Features — cards com ícones
4. Planos — Free vs Premium com toggle mensal/anual
5. Footer

### 8.2 — SEO

Configurar em `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Vila Fi — Seu Ambiente de Foco Perfeito",
  description:
    "Combine rádio lo-fi, sons ambientes e vídeos reativos para criar seu ambiente ideal de estudo e produtividade.",
  openGraph: {
    title: "Vila Fi — Web Environment Hub",
    images: ["/og-image.png"], // 1200x630px
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
```

Criar `app/sitemap.ts` e `app/robots.ts`.

**Critério de aceite da Fase 8:**

- [ ] Landing page renderiza sem erros
- [ ] Hub acessível em `/app`
- [ ] Metadados OpenGraph corretos (validar em opengraph.xyz)
- [ ] `npm run build` sem erros

---

## Checklist de Deploy (Produção)

### Segurança

- [ ] Nenhuma secret key em `NEXT_PUBLIC_*`
- [ ] Webhook Stripe validado com `constructEvent` (nunca pular)
- [ ] Rate limiting nas rotas de auth (`/api/v1/auth/*`) — usar `next-rate-limit` ou middleware simples
- [ ] Inputs validados com Zod em todas as rotas

### Banco de Dados

- [ ] Connection string Neon com `sslmode=require`
- [ ] Migrations aplicadas em produção: `npx prisma migrate deploy`
- [ ] `DATABASE_URL` configurada no Vercel (não commitar)

### Monitoramento

- [ ] Sentry configurado: `npm install @sentry/nextjs`
- [ ] Vercel Analytics ativado

### Variáveis de Ambiente no Vercel

Configurar todas as variáveis em: Vercel Dashboard → Project → Settings → Environment Variables

---

## Ordem de Prioridade

| Fase | Feature            | Impacto        | Esforço | Receita       |
| ---- | ------------------ | -------------- | ------- | ------------- |
| ✅ 1 | Catálogo expandido | Alto           | Baixo   | Indireta      |
| ✅ 2 | Pomodoro Timer     | Alto           | Baixo   | Indireta      |
| ✅ 3 | Share via URL      | Alto viral     | Baixo   | Indireta      |
| ✅ 4 | Auth + Presets     | Médio          | Médio   | Pré-requisito |
| 🔜 5 | Stripe + Planos    | Alto           | Médio   | **Direta**    |
| ⬜ 6 | Upload background  | Alto percebido | Médio   | Via Premium   |
| ⬜ 7 | Widgets extras     | Médio          | Baixo   | Via Premium   |
| ⬜ 8 | Landing page       | Alto           | Médio   | Aquisição     |

---

_Documento gerado para uso do Claude Code no projeto Vila Fi. Stack definida pelo `claude.md` — não introduzir tecnologias fora do listado sem aprovação do desenvolvedor._
