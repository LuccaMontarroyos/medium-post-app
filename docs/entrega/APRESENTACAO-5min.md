# Roteiro de apresentação oral (5 minutos)

**Foco:** decisões de projeto, não demo longa da aplicação.

| Tempo | Tópico | O que falar |
|-------|--------|-------------|
| 0:00–0:40 | Contexto | Medium Post App: feed, likes, JWT; monólito em camadas + SPA AngularJS. |
| 0:40–1:30 | Problema e escopo | Feed com 3 ordenações + cache; por que esse fluxo suporta GoF. |
| 1:30–2:30 | Padrões GoF | Factory escolhe Strategy; Facade simplifica PostService; mostrar diagrama de sequência do feed. |
| 2:30–3:20 | SOLID/GRASP | SRP (camadas), OCP (nova ordenação), Expert (Repository); Controller no PostController. |
| 3:20–4:10 | Qualidade | CC média 4,69; Ce/Ca; 25 testes; 100% nos padrões do feed; TDD no PostService.feed.test. |
| 4:10–4:40 | Refatoração | Antes: if/sort no serviço; Depois: Strategy + Repository + Serializer. |
| 4:40–5:00 | Fechamento | Próximos passos: testes de integração; PDF e repositório GitHub. |

**Slides sugeridos (6–8):** capa → arquitetura → classe UML → sequência feed → tabela GoF → métricas → cobertura → antes/depois.

**Demonstração opcional (30 s):** `GET /posts?sort=trending` no Swagger (`/api-docs`).
