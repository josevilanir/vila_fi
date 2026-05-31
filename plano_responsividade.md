# Plano de Responsividade Mobile — Vila Fi

Este documento apresenta a estratégia e o plano de implementação detalhado para tornar o **Vila Fi** totalmente responsivo e otimizado para dispositivos móveis (smartphones e tablets), mantendo a integridade estética premium e a conformidade com as diretrizes do `claude.md`.

---

## 1. Diagnóstico do Estado Atual

Atualmente, o projeto foi concebido com foco prioritário no desktop. No mobile, identificamos os seguintes gargalos:
1. **Colisão de Painéis (Hub Principal):** O rádio (`RadioPlayer`), o mixer (`AmbientMixer`) e o timer (`PomodoroTimer`) são posicionados de forma absoluta ou distribuídos horizontalmente. Em telas menores que `768px`, eles colidem, extrapolam a tela horizontalmente ou cobrem todo o plano de fundo.
2. **Poluição Visual no Cabeçalho:** O cabeçalho abriga o título "Vila Fi", botão de Compartilhar, botão de Presets/Entrar e botão de Pomodoro em uma linha simples (`flex-row`). Em telas estreitas, isso quebra a linha ou sobrepõe elementos.
3. **Interações Touch Difíceis:** Os controles de volume (sliders) e os pequenos botões foram projetados para cliques de mouse e carecem de áreas de toque (hit targets) apropriadas para dispositivos móveis.
4. **Persistência de Estados Hover ("Sticky Hover"):** Efeitos CSS `:hover` permanecem ativos após o toque em smartphones, quebrando a sensação tátil nativa.

---

## 2. Solução Proposta: Sistema de Abas (Mobile Workspace)

Para o workspace principal (`/app`), a melhor solução estética e funcional é **não tentar empilhar tudo na tela simultaneamente**. Em vez disso, adotaremos um **Layout Adaptável com Navegação por Abas** para dispositivos móveis.

### 2.1. Arquitetura de Layout do Hub (`components/Hub.tsx`)

* **Desktop (≥ 768px):** Mantém a interface atual — painéis flutuantes nas laterais inferiores e timer no topo direito, maximizando a visualização do vídeo reativo.
* **Mobile (< 768px):**
  * Introduzir um estado local de aba ativa: `activeTab` (`'radio' | 'sounds' | 'timer'`).
  * Renderizar uma **Barra de Navegação Inferior (Bottom Nav)** flutuante, translúcida (efeito *glassmorphism*), que permite alternar a aba ativa.
  * Exibir apenas o painel correspondente à aba ativa centralizado horizontalmente no rodapé, flutuando logo acima da barra de navegação.
  * Ocultar o título e subtítulo do cabeçalho ou reduzi-los para ícone/sigla, focando o espaço do topo apenas em ações essenciais.

---

## 3. Detalhamento das Alterações por Componente

### 3.1. Hub Principal e Cabeçalho
* **Arquivo:** [Hub.tsx](file:///home/jose/Projetos/vila_fi/components/Hub.tsx)
* **Alterações:**
  * Implementar hook/media query para detectar tela móvel (`isMobile`).
  * Adicionar lógica de estado `activeTab` para controlar qual painel exibir no mobile.
  * Adaptar o cabeçalho:
    * Reduzir `px-8 pt-6` para `px-4 pt-4` em telas pequenas.
    * No mobile, reduzir o tamanho da fonte do título "Vila Fi" e ocultar o subtítulo "Seu ambiente de foco".
    * Agrupar botões do cabeçalho de forma compacta (usar apenas ícones com *tooltips* ou menus de contexto se necessário).
  * Renderizar a `BottomNavigation` no mobile.

### 3.2. Painel de Rádio e Seleção de Estações
* **Arquivos:**
  * [RadioPlayer.tsx](file:///home/jose/Projetos/vila_fi/components/RadioPlayer/RadioPlayer.tsx)
  * [StationSelector.tsx](file:///home/jose/Projetos/vila_fi/components/RadioPlayer/StationSelector.tsx)
* **Alterações:**
  * Ajustar a largura do `Card` no mobile para se adaptar ao container pai (ex: `w-full max-w-sm` em vez de `w-64` fixo).
  * Otimizar a listagem de estações (`StationSelector`) para permitir rolagem vertical suave com `touch-action` adequado ou transformá-lo em uma lista recolhível se o espaço exigir.

### 3.3. Mixer de Sons Ambientes
* **Arquivos:**
  * [AmbientMixer.tsx](file:///home/jose/Projetos/vila_fi/components/AmbientMixer/AmbientMixer.tsx)
  * [SoundCard.tsx](file:///home/jose/Projetos/vila_fi/components/AmbientMixer/SoundCard.tsx)
* **Alterações:**
  * Limitar a altura do painel de sons no mobile (ex: `max-h-[50vh] overflow-y-auto`) para que o usuário possa rolar a lista de sons sem perder o contexto do resto da tela.
  * Otimizar o componente [Slider.tsx](file:///home/jose/Projetos/vila_fi/components/ui/Slider.tsx): aumentar ligeiramente a altura da barra e o tamanho do cursor (*thumb*) no mobile para facilitar o arrasto com o dedo.

### 3.4. Timer Pomodoro
* **Arquivo:** [PomodoroTimer.tsx](file:///home/jose/Projetos/vila_fi/components/PomodoroTimer/PomodoroTimer.tsx)
* **Alterações:**
  * **Desktop:** Mantém-se posicionado no canto superior direito (`absolute top-20 right-8`).
  * **Mobile:** Exibido centralizado no meio da tela como uma aba ativa ou como um modal *overlay* flutuante quando ativado, impedindo conflitos de posicionamento e facilitando o toque nos botões de controle de ciclo.

### 3.5. Componentes de Transição e Modais (Autenticação e Presets)
* **Arquivos:**
  * [AuthModal.tsx](file:///home/jose/Projetos/vila_fi/components/Auth/AuthModal.tsx)
  * [PresetsPanel.tsx](file:///home/jose/Projetos/vila_fi/components/Presets/PresetsPanel.tsx)
* **Alterações:**
  * O `PresetsPanel` (que desliza lateralmente) deve ocupar `w-full max-w-[280px]` ou se comportar como um *Bottom Sheet* (deslizar de baixo para cima) no mobile para melhor ergonomia de uso.
  * O `AuthModal` deve garantir margens adequadas (`mx-4`) e não estourar a altura da viewport caso o teclado virtual do celular seja ativado.

### 3.6. Landing Page (`/`)
* **Arquivos:**
  * [LandingNav.tsx](file:///home/jose/Projetos/vila_fi/components/Landing/LandingNav.tsx)
  * [HeroSection.tsx](file:///home/jose/Projetos/vila_fi/components/Landing/HeroSection.tsx)
  * [FeaturesSection.tsx](file:///home/jose/Projetos/vila_fi/components/Landing/FeaturesSection.tsx)
  * [PlansSection.tsx](file:///home/jose/Projetos/vila_fi/components/Landing/PlansSection.tsx)
  * [LandingFooter.tsx](file:///home/jose/Projetos/vila_fi/components/Landing/LandingFooter.tsx)
* **Alterações:**
  * **HeroSection:** A animação e a rotação do card de simulação (atualmente `hidden lg:block`) podem ser mantidas apenas no desktop. Para mobile, garantir que os textos principais se adaptem a tamanhos de tela extremamente pequenos sem quebras indesejadas (ex: usando `text-[clamp(2rem,7vw,4rem)]`).
  * **FeaturesSection:** A listagem de features em formato de linhas deve se comportar como coluna no mobile, reduzindo espaçamentos laterais.
  * **PlansSection:** O layout de grade de planos deve quebrar para `grid-cols-1` em telas menores que `md` (768px). Reduzir margens internas das tabelas/cartões de preço.

---

## 4. Otimizações de UX e Estilo

1. **Combate ao "Sticky Hover":**
   * Configurar classes utilitárias do Tailwind para aplicar efeitos de hover somente em dispositivos apontadores (desktop).
   * Exemplo: `hover:bg-white/10` deve ser substituído ou configurado para `@media (hover: hover) { ... }` ou utilizando a diretiva `@media (pointer: fine)` do CSS. No Tailwind CSS v4, podemos usar o modificador `hover:` com segurança ou combiná-lo com `@media (hover: hover)`.
2. **Área de Toque Mínima:**
   * Garantir que todos os elementos clicáveis (botões de play, botões do timer, abas) tenham um tamanho mínimo de toque de `44px x 44px` conforme as diretrizes da Apple/Google.
3. **Impedir Zoom Automático (iOS):**
   * Configurar os inputs de texto (login/cadastro) com tamanho de fonte mínimo de `16px` para evitar que o iOS faça zoom automático indesejado ao focar no campo.

---

## 5. Plano de Validação e Testes

Para garantir que a responsividade não introduza regressões e que o design permaneça premium, seguiremos o fluxo abaixo:

### 5.1. Testes Automatizados (Vitest)
* Garantir que as lógicas de estado (como a alternância de abas e a visibilidade de modais no mobile) continuem passando nos testes unitários existentes.

### 5.2. Testes Manuais com Ferramentas do Navegador
* **Inspeção de Dispositivos (Chrome DevTools):**
  * Validar layout nas dimensões de aparelhos comuns: iPhone SE (375px), iPhone 12/13/14 Pro (390px), Pixel 7 (412px) e iPad (768px).
* **Verificação de Performance & Layout:**
  * Testar o redimensionamento dinâmico da janela do desktop para verificar a transição fluida entre o layout desktop e as abas do mobile.
  * Verificar se os vídeos em loop (`VideoBackground`) se ajustam e cobrem toda a tela (`object-cover`) sem distorção em orientações de tela retrato (portrait).
