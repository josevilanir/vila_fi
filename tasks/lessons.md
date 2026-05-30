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
