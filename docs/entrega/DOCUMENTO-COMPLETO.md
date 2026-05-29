---
title: "Documento de Arquitetura e Design"
subtitle: "Medium Post App — Projeto Final"
author: "Equipe APS (preencher nomes)"
date: "Maio/2026"
---

# Documento de Arquitetura e Design

**Disciplina:** Análise e Projeto de Software  
**Trabalho:** Projeto Final — Análise e Evolução de Sistemas de Software  
**Sistema:** Medium Post App  
**Repositório:** `medium-post-app`  
**Entrega:** 28/05/2026 | **Apresentação:** 29/05/2026  

**Integrantes (preencher):**

1. __________________________
2. __________________________
3. __________________________
4. __________________________
5. __________________________

---

> **Figuras a inserir no PDF:** exportar os arquivos `.puml` em `apps/backend/src/` e os prints de `coverage/index.html`. Marcadores `[INSERIR FIGURA n]` estão ao longo do texto.

---



# Índice

1. [Introdução e Contexto](#1-introdução-e-contexto)
2. [Visão de Projeto (UML)](#2-visão-de-projeto-uml)
3. [Memorial Descritivo de Padrões e Princípios](#3-memorial-descritivo-de-padrões-e-princípios)
4. [Arquitetura e Qualidade](#4-arquitetura-e-qualidade)
5. [Log de Refatoração](#5-log-de-refatoração)
6. [Referências](#6-referências)

---

# 1. Introdução e Contexto

## 1.1 Visão geral

O **Medium Post App** é uma aplicação web inspirada em plataformas de publicação de artigos (como o Medium). O sistema permite que usuários se cadastrem, autentiquem-se, publiquem posts com imagem, interajam por meio de curtidas e naveguem em um feed de conteúdo com paginação eficiente e busca textual.

O problema que o sistema resolve é oferecer um **ambiente simples de blogging social**: centralizar publicações, expor um feed consumível com boa performance (cache Redis, paginação por cursor) e garantir regras de negócio básicas (apenas o autor edita/remove seu post; likes por usuário com toggle lógico via `is_deleted`).

A solução é composta por:

- **Frontend:** SPA em AngularJS 1.8 (MVC no cliente: controllers, services, views).
- **Backend:** API REST em Node.js + Express 5, organizada em camadas.
- **Persistência:** PostgreSQL via Sequelize ORM.
- **Cache:** Redis para listagens de posts.

## 1.2 Escopo


| Módulo / funcionalidade        | Motivo do foco                   |
| ------------------------------ | -------------------------------- |
| Feed de posts (`GET /posts`)   | Strategy, Factory, Facade, cache |
| Likes (`POST /posts/:id/like`) | Transação + sequência UML        |
| Services / Repositories        | SRP, GRASP Expert                |
| PostSerializer                 | DTO de API                       |
| Métricas e testes Vitest       | Qualidade e V&V                  |


## 1.3 Contextualização

Sistema **existente**, evoluído para a disciplina: da concentração de regras em poucos arquivos para arquitetura em camadas com padrões GoF no feed.

---

# 2. Visão de Projeto (UML)

## 2.1 Diagrama de classes

**Fonte:** `apps/backend/src/uml-class-diagram.puml`

Pacotes: Controllers, Services, Patterns (Facade + Factory + Strategy), Repositories, Serializer/Metrics, Models.

> **[INSERIR FIGURA 1]** — Diagrama de classes exportado (PNG).

## 2.2 Diagramas de sequência


| Diagrama | Arquivo                  | Fluxo                       |
| -------- | ------------------------ | --------------------------- |
| Feed     | `uml-sequence-feed.puml` | GET /posts, cache, Strategy |
| Like     | `uml-sequence-like.puml` | POST like, transação, Redis |


> **[INSERIR FIGURA 2]** — Sequência do feed.  
> **[INSERIR FIGURA 3]** — Sequência do like.

## 2.3 Arquitetura em camadas

**Fonte:** `apps/backend/src/uml-architecture.puml`

> **[INSERIR FIGURA 4]** — Diagrama de arquitetura.

---

# 3. Memorial Descritivo de Padrões e Princípios

## 3.1 Tabela GoF


| Padrão         | Categoria      | Classe/Módulo         | Justificativa                                    |
| -------------- | -------------- | --------------------- | ------------------------------------------------ |
| Factory Method | Criacional     | `FeedStrategyFactory` | Centraliza criação da estratégia conforme `sort` |
| Facade         | Estrutural     | `FeedFacade`          | Interface única `getFeed` para o `PostService`   |
| Strategy       | Comportamental | `*PostsStrategy`      | Algoritmos de ordenação intercambiáveis (OCP)    |


## 3.2 SOLID (3 princípios)

- **SRP:** Controller / Service / Repository / Serializer com responsabilidades distintas.  
- **OCP:** Novas ordenações via nova Strategy + Factory, sem inflar `PostService`.  
- **DIP:** Serviços dependem de facades e contratos; testes com mocks (Vitest) sem HTTP/Redis real.

## 3.3 GRASP (2 padrões)

- **Controller:** `PostController`, `LikeController` — entrada HTTP.  
- **Information Expert:** `PostRepository`, `LikeRepository` — persistência e queries.

## 3.4 Code smells e refatoração

Long Method, Switch em `sort`, Feature Envy no ORM → Strategy, Extract Class (Repository, Serializer), Facade. Detalhes na Seção 5.

---

# 4. Arquitetura e Qualidade

## 4.1 Arquitetura

Camadas: Routes → Middlewares → Controllers → Services → (Facade|Repositories|Serializers) → Models → DB/Redis. Frontend MVC (AngularJS).

## 4.2 Métricas estáticas (`npm run metrics`)


| Métrica                     | Valor                                   |
| --------------------------- | --------------------------------------- |
| CC média (por módulo)       | **4,69**                                |
| Acoplamento efferente médio | **1,33**                                |
| Acoplamento afferente médio | **1,21**                                |
| Coesão (strategies)         | Maintainability médio **137,76** (alta) |


Relatório completo: `apps/backend/reports/static-metrics.md`

> **[INSERIR FIGURA 5]** — Resumo de métricas.

## 4.3 Testes e cobertura

```bash
cd apps/backend && npm test && npm run test:coverage
```

- **25 testes** unitários (Vitest)  
- Cobertura global: **35,11%** statements  
- **100%** em: Facade, Factory, Strategies, LikeService, MetricsService, PostSerializer

TDD: `tests/unit/PostService.feed.test.js` — feed ordenável + cache.

> **[INSERIR FIGURA 6]** — Resumo cobertura.  
> **[INSERIR FIGURA 7]** — Cobertura 100% em `strategies/feed`.

---

# 5. Log de Refatoração

## 5.1 Antes — condicionais de ordenação no serviço

```javascript
let order;
if (sort === "most_liked") {
  order = [[literal('"totalLikes"'), "DESC"]];
} else if (sort === "trending") {
  order = [[literal('"totalLikes"'), "DESC"]], ["post_date", "DESC"]];
} else {
  order = [["post_date", "DESC"], ["id", "DESC"]];
}
const posts = await Post.findAll({ where, include, order, limit });
const formatted = posts.map((post) => ({ /* montagem manual */ }));
```

**Smells:** Long Method, Switch Statements, Feature Envy.

## 5.2 Depois — Strategy + Facade + Serializer

```javascript
const posts = await FeedFacade.getFeed(sort, { where, attributesToInclude, limit });
const formatted = PostSerializer.serializeMany(posts, currentUserId, backendUrl);
```

```javascript
// NewestPostsStrategy.js
return repository.findPosts({
  ...params,
  order: [["post_date", "DESC"], ["id", "DESC"]],
});
```

**Técnicas:** Replace Conditional with Strategy, Extract Class, Move Method (Repository), Facade.

> **[INSERIR FIGURA 8–9]** — Prints IDE antes/depois (opcional: `git history`).

---

# 6. Referências

- Gamma, E. et al. *Design Patterns*. Addison-Wesley, 1994.  
- Larman, C. *Applying UML and Patterns*.  
- Martin, R. C. *Clean Architecture* / SOLID.  
- Documentação: [Express](https://expressjs.com/), [Sequelize](https://sequelize.org/), [Vitest](https://vitest.dev/).  
- Repositório do projeto: `https://github.com/LuccaMontarroyos/medium-post-app` (ajustar URL se necessário).

---

*Documento gerado para a disciplina APS — UNICAP. Revisar e personalizar pela equipe antes do envio em PDF.*