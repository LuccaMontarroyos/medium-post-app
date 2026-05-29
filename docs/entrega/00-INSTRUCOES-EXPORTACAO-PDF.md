# Instruções para montagem e envio do PDF

**Disciplina:** Análise e Projeto de Software  
**Trabalho:** Projeto Final — Análise e Evolução de Sistemas de Software  
**Prazo de envio:** 28/05/2026 → monique.soares@unicap.br  
**Apresentação oral:** 29/05/2026 (5 minutos por equipe)

---

## Como gerar o PDF

1. Abra o arquivo **`DOCUMENTO-COMPLETO.md`** (nesta pasta) no VS Code/Cursor ou no Word (importar Markdown).
2. Exporte os diagramas PlantUML para PNG:
   - `apps/backend/src/uml-class-diagram.puml`
   - `apps/backend/src/uml-sequence-feed.puml`
   - `apps/backend/src/uml-sequence-like.puml`
   - `apps/backend/src/uml-architecture.puml`  
   Use a extensão PlantUML → **Export Current Diagram** (ver `apps/backend/src/uml-README.md`).
3. Insira as imagens nas seções indicadas com `[INSERIR FIGURA: ...]`.
4. Gere prints de cobertura:
   - Abra `apps/backend/coverage/index.html` no navegador após `npm run test:coverage`.
   - Capture a tela do resumo e da pasta `strategies/feed` (100%).
5. Salve como **PDF** com nome sugerido:  
   `APS_MediumPostApp_Equipe[N].pdf`

## Arquivos desta entrega

| Arquivo | Conteúdo |
|---------|----------|
| `01-introducao-contexto.md` | Seção 1 do template |
| `02-visao-uml.md` | Seção 2 do template |
| `03-memorial-padroes.md` | Seção 3 do template |
| `04-arquitetura-qualidade.md` | Seção 4 do template |
| `05-log-refatoracao.md` | Seção 5 do template |
| `DOCUMENTO-COMPLETO.md` | Documento único para PDF |
| `APRESENTACAO-5min.md` | Roteiro da defesa oral |

## Antes de enviar

- [ ] Preencher nomes da equipe na capa do documento completo.
- [ ] Inserir figuras exportadas dos diagramas.
- [ ] Inserir prints de cobertura de testes.
- [ ] Revisar ortografia e referências bibliográficas.
- [ ] Confirmar que o texto foi revisado pela equipe (evitar cópia integral de IA sem adaptação).
