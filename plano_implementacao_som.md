# Plano de Implementação: Modais de Som Interativos e Localizados

## Objetivo
Mudar o paradigma atual de "um único modal de mixagem de som global" (`AmbientMixer`) para "vários modais de volume pequenos e localizados, ativados ao clicar em áreas específicas (hotspots) do cenário/vídeo". Vamos começar substituindo o sistema atual por um hotspot de Chuva posicionado no céu do vídeo default.

## Etapa 1: Remoção do Modal de Som Atual
1. **Limpeza do `Hub.tsx`**
   - Remover as importações e instâncias de `AmbientMixer` em `components/Hub.tsx`.
   - Remover os painéis de som da visualização Desktop e Mobile.
   - O botão do Pomodoro, Share e Player de Rádio permanecem.
2. **Limpeza do `BottomNavigation.tsx`**
   - Remover o botão/tab 'sounds' no `components/BottomNavigation/BottomNavigation.tsx`.
3. **Deprecação**
   - Marcar para exclusão (ou deletar diretamente) a pasta `components/AmbientMixer`, já que a interface consolidada não existirá mais.

## Etapa 2: Estruturação dos Hotspots e Modais Específicos
Em vez de uma lista no lado da tela, os sons serão botões invisíveis (ou muito sutis, com indicadores de hover) espalhados na cena.
1. **Componente `SoundHotspot`**
   - Criar `components/Hotspots/SoundHotspot.tsx` (ou estrutura semelhante).
   - O componente deve aceitar um `soundId` (que linka com o `useAmbientStore`/`useAmbientMixer`).
   - Deve ser posicionado de forma absoluta por CSS ou props (ex: `top`, `left`, `right`, `bottom`).
   - Visual: Um ícone minimalista (ex: botão de + ou ícone translúcido do som) que fica mais visível no `hover`.
2. **O Mini-Modal de Volume (Popover)**
   - Ao clicar no `SoundHotspot`, um pequeno popover de controle deve aparecer ao lado/embaixo.
   - O popover contém apenas:
     - Toggle de On/Off (ou Play/Pause).
     - Slider de volume para ajustar a intensidade.
   - O popover utilizará a lógica existente do `hooks/useAmbientMixer.ts` para aplicar as modificações.

## Etapa 3: Implementação da Chuva (Rain) na Cena Inicial
O usuário informou que quer um botão posicionado no "céu" para a cena inicial (vídeo default `town-default.mp4`) acionando o som de chuva (`id: 'rain'`).

1. **Camada de Overlay no Cenário**
   - Dentro de `components/Hub.tsx`, adicionar uma camada (ex: `<div className="absolute inset-0 z-10 pointer-events-none">`) para posicionar os hotspots em cima do vídeo, mas atrás da UI principal.
2. **Adicionando o Hotspot da Chuva**
   - Inserir o novo `SoundHotspot` nesta camada com `pointer-events-auto`.
   - Posicionar usando Tailwind no céu. Exemplo: `top-[15%] left-[60%]` (precisará de ajuste visual durante a implementação).
   - O `soundId` passado será `rain`.

## Etapa 4: Ordem de Execução Recomendada (Para o Claude Code)
1. Apague o painel atual `AmbientMixer` do `Hub.tsx` e mobile tabs.
2. Crie os novos componentes de `SoundHotspot` e popover de volume (usando estilos minimalistas e Framer Motion para transições).
3. Insira o primeiro `SoundHotspot` (Chuva) no overlay da tela `Hub.tsx`, configurado na posição do céu do vídeo default.
4. Ajuste as classes responsivas (posicionamento absoluto em % normalmente funciona melhor para ajustar desktop vs mobile, ou desabilite alguns hotspots em mobile se ficarem muito juntos).
5. (Futuro) Após validar a chuva, expanda a camada com outros sons interativos mapeados (ex: lareira, café) com base no vídeo em exibição (`useVideoReactor`).
