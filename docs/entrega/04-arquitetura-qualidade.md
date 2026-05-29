# 4. Arquitetura e Qualidade

## 4.1 Descrição arquitetural

### 4.1.1 Visão geral

O sistema adota **arquitetura em camadas** no backend (variante próxima de **MVC estendido** para APIs REST):

| Camada | Responsabilidade | Exemplos no projeto |
|--------|------------------|---------------------|
| **Rotas** | Mapeamento URL → middlewares/controller | `postRoutes.js`, `routes/index.js` |
| **Middlewares** | Autenticação JWT, validação Yup, métricas, upload | `auth.js`, `SchemaValidator`, `metricsMiddleware` |
| **Controllers** | Adaptação HTTP; sem regra de negócio pesada | `PostController`, `LikeController` |
| **Services** | Casos de uso e orquestração | `PostService`, `LikeService` |
| **Facades / Factories / Strategies** | Padrões GoF no domínio do feed | `FeedFacade`, `FeedStrategyFactory`, `*PostsStrategy` |
| **Repositories** | Acesso a dados (GRASP Expert) | `PostRepository`, `LikeRepository` |
| **Models** | Entidades ORM | `Post`, `User`, `PostLike` |
| **Serializers** | DTO de saída | `PostSerializer` |
| **Infraestrutura** | DB, Redis, arquivos | Sequelize, `config/redis.js`, Multer |

O **frontend** segue **MVC clássico do AngularJS**: `FeedController` + `PostService` (cliente HTTP) + templates HTML.

Não se trata de microsserviços: é um **monólito modular** em `apps/backend` + SPA estática em `apps/frontend/public`.

### 4.1.2 Fluxo de dependência entre camadas

Regra adotada: dependências apontam **para dentro** (em direção ao domínio/dados):

```
Controllers → Services → (Facade | Repositories | Serializers | Metrics) → Models → Database
```

Controllers **não** importam Models diretamente para o fluxo refatorado do feed.

## 4.2 Relatório de métricas de software

Ferramenta: **typhonjs-escomplex** (análise estática de AST).  
Script: `npm run metrics` → gera `apps/backend/reports/static-metrics.json` e `.md`.  
Data da análise registrada no relatório: **28/05/2026**.

### 4.2.1 Complexidade ciclomática

| Indicador | Valor |
|-----------|-------|
| Arquivos analisados | 42 |
| **Complexidade ciclomática média (por módulo)** | **4,69** |
| Módulo mais complexo | `PostService.js` (CC = 24) |
| Segundo mais complexo | `PostController.js` (CC = 19) |

**Interpretação:** a média geral (4,69) indica módulos moderados. `PostService.listPosts` concentra ramificações (cache, busca, cursor, integração com facade) — candidato a futuras refatorações (*Extract Method*), mas já reduzido em relação ao monólito original graças à extração de Strategy e Repository.

### 4.2.2 Acoplamento

| Indicador | Valor |
|-----------|-------|
| Módulos no grafo | 42 |
| Arestas de dependência | 56 |
| **Acoplamento efferente médio (Ce)** | **1,33** |
| **Acoplamento afferente médio (Ca)** | **1,21** |
| Índice de instabilidade Ce/(Ce+Ca) | 0,52 |

**Dependências entre camadas (amostra relevante):**

- `controllers → services`: 4
- `services → repositories`: 3
- `services → facades`: 1
- `facades → factories`: 1
- `factories → strategies`: 3
- `repositories → models`: 4

**Interpretação:** o acoplamento efferente médio baixo (~1,33) sugere que cada módulo depende de poucos outros — coerente com a separação em camadas. O fluxo do feed mostra cadeia clara Factory → Strategy → Repository, sem dependências circulares entre services e controllers.

### 4.2.3 Coesão

Utilizou-se o **índice de manutenibilidade** por camada como *proxy* de coesão (quanto maior, melhor legibilidade/manutenção na ferramenta):

| Camada | Módulos | Maintainability médio | Avaliação de coesão |
|--------|---------|---------------------|---------------------|
| strategies | 4 | 137,76 | Alta |
| facades | 1 | 134,04 | Responsabilidade única |
| factories | 1 | 126,41 | Responsabilidade única |
| repositories | 3 | 123,37 | Alta |
| models | 3 | 119,26 | Alta |
| services | 4 | 104,62 | Alta |
| controllers | 5 | 107,77 | Moderada |

**Interpretação:** pacotes de padrões (`strategies`, `facades`, `factories`) e `repositories` apresentam alta coesão — cada módulo agrupa responsabilidades relacionadas ao feed ou à persistência.

> **[INSERIR FIGURA 5]** — Tabela ou gráfico copiado de `apps/backend/reports/static-metrics.md`  
> Legenda: *Figura 5 — Resumo das métricas estáticas.*

### 4.2.4 Métricas operacionais (complemento)

Além da análise estática, o sistema expõe métricas de **runtime** via `MetricsService` e `GET /metrics` (total de requisições, cache hit/miss, tempo por rota). Isso complementa a qualidade em produção, mas a disciplina exige principalmente métricas de **análise estática** — atendidas pelo relatório acima.

## 4.3 Verificação e validação (V&V)

### 4.3.1 Scripts de testes de unidade

Framework: **Vitest** (ESM nativo).  
Localização: `apps/backend/tests/unit/`

| Arquivo de teste | O que valida |
|------------------|--------------|
| `FeedStrategyFactory.test.js` | Criação correta por `sort` |
| `feedStrategies.test.js` | `order` de cada estratégia |
| `FeedFacade.test.js` | Integração facade + repository |
| `PostService.feed.test.js` | Cache hit/miss, facade, cursor inválido |
| `PostService.getPost.test.js` | `getPostById` |
| `LikeService.test.js` | Toggle create/update |
| `PostSerializer.test.js` | Formato e permissões |
| `MetricsService.test.js` | Contadores runtime |
| `SchemaValidator.test.js` | Mensagens de validação |

**Execução:**

```bash
cd apps/backend
npm test
```

Resultado esperado: **25 testes passando** (9 arquivos).

### 4.3.2 Cobertura de código

Comando:

```bash
npm run test:coverage
```

Relatório HTML: `apps/backend/coverage/index.html`

| Métrica global | Valor (última execução) |
|--------------|-------------------------|
| Statements | 35,11% |
| Branches | 55,71% |
| Functions | 37,93% |
| Lines | 35,11% |

**Cobertura destacada (foco da evolução):**

| Módulo | Cobertura |
|--------|-----------|
| `FeedFacade.js` | 100% |
| `FeedStrategyFactory.js` | 100% |
| `strategies/feed/*` | 100% |
| `LikeService.js` | 100% |
| `MetricsService.js` | 100% |
| `PostSerializer.js` | 100% |

A cobertura global é moderada porque controllers, rotas e integração Redis/DB não foram alvo de testes de integração — decisão consciente para priorizar **unidades do domínio refatorado** e padrões GoF, conforme escopo da disciplina.

> **[INSERIR FIGURA 6]** — Print do `coverage/index.html` (resumo geral)  
> **[INSERIR FIGURA 7]** — Print da pasta `strategies/feed` com 100%  
> Legenda: *Figuras 6 e 7 — Cobertura de testes.*

### 4.3.3 Evidência de TDD em funcionalidade nova

**Funcionalidade:** feed com ordenação configurável (`sort=newest|most_liked|trending`) + integração Strategy/Facade/Factory + cache Redis.

**Abordagem TDD (Test-Driven Development):**

1. **Red:** testes em `PostService.feed.test.js` e `feedStrategies.test.js` definindo comportamento esperado (ordenação, cache hit, cursor inválido) antes da estabilização final das classes.
2. **Green:** implementação de `FeedStrategyFactory`, estratégias concretas e ajuste de `FeedFacade`/`PostService` até os testes passarem.
3. **Refactor:** extração de `PostRepository` e `PostSerializer`; redução de condicionais no serviço.

O comentário no arquivo `tests/unit/PostService.feed.test.js` documenta explicitamente o vínculo com a evolução e TDD.

**Cenários testados (amostra):**

- Retorno imediato quando há cache (`incrementCacheHit`).
- Chamada a `FeedFacade.getFeed` em cache miss (`incrementCacheMiss`).
- Rejeição de cursor Base64 inválido.
- Ordem SQL distinta em `TrendingPostsStrategy` vs `NewestPostsStrategy`.

## 4.4 Plano de testes (resumo)

| ID | Cenário | Tipo | Prioridade |
|----|---------|------|------------|
| T01 | Factory retorna estratégia correta | Unitário | Alta |
| T02 | Estratégia chama `findPosts` com `order` esperado | Unitário | Alta |
| T03 | Facade delega ao repository | Unitário | Alta |
| T04 | PostService usa cache | Unitário | Alta |
| T05 | PostService rejeita cursor inválido | Unitário | Média |
| T06 | LikeService cria e alterna like | Unitário | Alta |
| T07 | Serializer monta URL e permissões | Unitário | Média |
| T08 | Listagem HTTP end-to-end | Integração | Futura (opcional) |

Documentação técnica dos testes: `apps/backend/TESTING.md`.
