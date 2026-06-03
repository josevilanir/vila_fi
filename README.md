# Vila Fi

**Seu ambiente de foco ideal.**

Vila Fi é um hub de ambiente web que combina rádio lo-fi, sons atmosféricos e vídeos reativos para criar o cenário perfeito de estudo e trabalho. Sem anúncios, sem distrações.

---

## O que é

Uma aplicação web imersiva onde o usuário monta seu próprio ambiente de foco misturando diferentes camadas de áudio e visuais. O vídeo de fundo reage automaticamente aos sons ativos — ligar a chuva muda a cidade para uma noite chuvosa; adicionar o café transforma a cena em uma cafeteria molhada.

---

## Funcionalidades implementadas

### Rádio Lo-Fi
7 estações de rádio curadas via transmissão ao vivo no YouTube, sem anúncios e sem interrupções:

| Estação | Estilo |
|---|---|
| Lofi Girl | Lo-fi hip hop clássico |
| Chillhop | Instrumental relaxante |
| Jazz Lofi | Jazz com batidas lo-fi |
| Smooth Jazz | Jazz suave |
| Classical Focus | Música clássica para foco |
| Synthwave | Synthwave / retrowave |
| Study Beats | Beats para estudo |

### Sons Ambientes
10 sons atmosféricos provenientes do Freesound (licença CC), todos com volume individual ajustável:

| Som | Efeito visual associado |
|---|---|
| Chuva | Muda para cena da cidade na chuva |
| Ruído Branco | — |
| Teclado | — |
| Cafeteria | Muda para cena da cafeteria |
| Lareira | Cena interna aconchegante *(vídeo em produção)* |
| Floresta | Cena da floresta *(vídeo em produção)* |
| Ondas do Mar | Cena da praia ao entardecer *(vídeo em produção)* |
| Trem | — |
| Pássaros | — |
| Trovão | Combinado com chuva → tempestade noturna *(vídeo em produção)* |

O áudio é servido via proxy server-side com retry e exponential backoff — o IP do servidor é o que acessa o Freesound, nunca o cliente direto.

### Vídeos Reativos
O vídeo de fundo troca automaticamente com base nos sons ativos, usando um sistema de regras por prioridade:

| Combinação de sons | Cena |
|---|---|
| chuva + trovão | tempestade noturna |
| chuva + café | cafeteria com chuva |
| chuva | cidade na chuva |
| café | cafeteria |
| lareira | interior aconchegante |
| floresta | floresta |
| ondas | praia ao entardecer |
| dark mode ativo | cidade de noite |
| *(padrão)* | cidade de dia |

As transições entre cenas usam crossfade para evitar flashes pretos.

### Timer Pomodoro
- 3 modos: Foco (25 min), Pausa Curta (5 min), Pausa Longa (15 min)
- Contador regressivo com controles play/pause/reset
- Alerta sonoro ao final de cada ciclo
- Desktop: painel flutuante no canto superior direito
- Mobile: aba dedicada na navegação inferior

### Presets de Ambiente
- Salve qualquer combinação de sons + rádio com um nome customizado
- Restaure com um clique
- Plano grátis: até 2 presets salvos
- Plano premium: presets ilimitados

### Autenticação
- Cadastro e login com e-mail e senha
- JWT stateless validado via middleware
- Sessão restaurada automaticamente no carregamento

### Compartilhamento
- Copie um link com o estado atual do ambiente (sons ativos, volumes, estação de rádio)
- Quem abre o link entra exatamente na mesma configuração

### Dark Mode
- Toggle entre cena diurna e noturna da cidade
- Estado persiste globalmente via Zustand

### Layout Responsivo
- Desktop: rádio no canto inferior esquerdo, timer flutuante no superior direito
- Mobile: navegação inferior com abas para Rádio e Timer, respeitando `safe-area-inset`

### Planos e Pagamentos
- Integração completa com Stripe: checkout, webhooks e portal do cliente
- Plano Grátis: acesso a todos os sons e rádios + 2 presets
- Plano Premium: R$19/mês ou R$12/mês no anual (R$149/ano)

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Animações | Framer Motion |
| Estado global | Zustand |
| Áudio | Howler.js |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Autenticação | JWT + bcryptjs |
| Pagamentos | Stripe |
| Validação | Zod |
| Testes | Vitest |
| Deploy | Vercel |
| Sons ambientes | Freesound API (proxy server-side) |

---

## Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Preencha as variáveis listadas abaixo

# 3. Rodar as migrations e gerar o client
npx prisma migrate dev

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

```env
# Banco de dados
DATABASE_URL=

# JWT
JWT_SECRET=

# Freesound (https://freesound.org/apiv2/)
FREESOUND_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_MONTHLY=
STRIPE_PRICE_ID_ANNUAL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Estrutura do projeto

```
app/
  api/v1/            # Rotas de API (auth, presets, stripe, freesound)
  app/               # Rota da aplicação (/app)
  page.tsx           # Landing page
components/
  Auth/              # Modal de login, formulários, menu do usuário
  BottomNavigation/  # Navegação mobile com abas
  Hotspots/          # Hotspots de som sobrepostos ao vídeo
  Landing/           # Seções da landing page (Hero, Features, Plans)
  PomodoroTimer/     # Timer com display, controles e seletor de modo
  Presets/           # Lista, card e modal de salvar presets
  RadioPlayer/       # Player com seletor de estação e embed YouTube
  ThemeSwitch/       # Toggle dark/light mode
  VideoBackground/   # Camadas de vídeo com crossfade
  ui/                # Button, Card, Slider (componentes base reutilizáveis)
  Hub.tsx            # Orquestrador principal da aplicação
data/
  radios.ts          # Lista de estações de rádio
  sounds.ts          # Lista de sons com IDs do Freesound
  videoMappings.ts   # Regras de reatividade vídeo ↔ som
hooks/               # useAuth, useAmbientMixer, useVideoReactor, etc.
store/               # Zustand stores (ambient, timer, radio, auth, presets, theme)
```

---

## Roadmap

### Cenas em produção
- [ ] `storm-night.mp4` — chuva + trovão
- [ ] `cozy-indoor.mp4` — lareira
- [ ] `forest-day.mp4` — floresta com pássaros
- [ ] `beach-sunset.mp4` — praia ao entardecer

### Funcionalidades planejadas
- [ ] Hotspots interativos em todas as cenas (clicar em objetos do vídeo ativa sons)
- [ ] Mais sons ambientes (metrô, biblioteca, fogueira ao ar livre, chuva tropical)
- [ ] Mais estações de rádio (piano solo, jazz noturno, lo-fi estudo intenso)
- [ ] Cenas exclusivas para usuários premium
- [ ] Estatísticas de foco (tempo acumulado por dia/semana)
- [ ] Sons binaurais e frequências de foco (alpha, theta, 40Hz)
- [ ] Modo co-working — compartilhar ambiente em tempo real com outras pessoas
- [ ] PWA com suporte offline e instalação no celular
- [ ] Temas visuais sazonais (inverno, outono, madrugada)
- [ ] Integração com Notion/Obsidian para log de sessões Pomodoro
