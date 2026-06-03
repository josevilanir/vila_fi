# Lessons Learned

<!-- Template:
## [YYYY-MM-DD] — <short title>
**Context**: <what was being built or done>
**Mistake**: <what went wrong>
**Root Cause**: <why it happened>
**Rule**: <rule to follow from now on>
-->

## [2026-05-30] — Ler skill frontend-design antes de implementar qualquer UI

**Context**: Implementação da landing page (Fase 6) do Vila Fi.
**Mistake**: Criei a landing page completa usando Inter, gradiente indigo/roxo e layout centralizado padrão — exatamente os padrões genéricos que a skill proíbe.
**Root Cause**: Pulei a etapa de leitura da skill `frontend-design` e fui direto para o código, assumindo que sabia o que fazer.
**Rule**: Antes de escrever qualquer componente de UI, SEMPRE ler `frontend-design/SKILL.md`. A checklist do CLAUDE.md é obrigatória — "mandatory, not optional". Commitar a direção estética (tipografia, paleta, layout) ANTES de escrever código.

## [2026-06-03] — Cache do Next.js/Turbopack desatualizado após erros de compilação

**Context**: Refatoração/componentização da landing page e correção de dependência ausente (`styled-components`).
**Mistake**: Deixar o servidor de desenvolvimento rodando com cache corrompido/desatualizado na pasta `.next`, o que fez com que o compilador ignorasse e omitisse silenciosamente as novas regras de CSS do `globals.css` mesmo após instalar a dependência e rodar o build com sucesso.
**Root Cause**: O Next.js com Turbopack realiza cache agressivo e falhou em reprocessar as alterações e regras personalizadas da folha de estilos global após se recuperar de uma falha de compilação causada por pacotes ausentes.
**Rule**: Se classes ou regras de CSS personalizadas forem ignoradas/omitidas pelo navegador após a correção de erros de compilação ou instalação de novos pacotes npm, sempre remova o diretório `.next` antes de reiniciar o servidor de desenvolvimento para garantir uma compilação limpa do zero.
