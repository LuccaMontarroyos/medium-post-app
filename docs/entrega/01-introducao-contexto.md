# 1. Introdução e Contexto

## 1.1 Visão geral

O **Medium Post App** é uma aplicação web inspirada em plataformas de publicação de artigos (como o Medium). O sistema permite que usuários se cadastrem, autentiquem-se, publiquem posts com imagem, interajam por meio de curtidas e naveguem em um feed de conteúdo com paginação eficiente e busca textual.

O problema que o sistema resolve é oferecer um **ambiente simples de blogging social**: centralizar publicações, expor um feed consumível com boa performance (cache Redis, paginação por cursor) e garantir regras de negócio básicas (apenas o autor edita/remove seu post; likes por usuário com toggle lógico via `is_deleted`).

A solução é composta por:

- **Frontend:** SPA em AngularJS 1.8 (MVC no cliente: controllers, services, views).
- **Backend:** API REST em Node.js + Express 5, organizada em camadas.
- **Persistência:** PostgreSQL via Sequelize ORM.
- **Cache:** Redis para listagens de posts.

Este documento registra a **evolução arquitetural** do backend e o foco da análise de projeto aplicada na disciplina, não apenas a descrição funcional inicial do repositório.

## 1.2 Escopo da análise de projeto

Foram definidos como **módulos e funcionalidades em foco** na análise e na refatoração:

| Módulo / funcionalidade | Motivo do foco |
|-------------------------|----------------|
| **Feed de posts** (`GET /posts`) | Domínio rico; múltiplas regras de ordenação; uso de Strategy, Factory e Facade; cache. |
| **Sistema de likes** (`POST /posts/:id/like`) | Transação de banco; invalidação de cache; fluxo crítico para diagrama de sequência. |
| **Camada de serviços e repositórios** | Extração de responsabilidades (SRP, GRASP Especialista). |
| **Serialização de resposta** (`PostSerializer`) | Separação entre modelo de domínio e DTO de API. |
| **Métricas** | Métricas operacionais (runtime) e estáticas (análise de código). |
| **Testes unitários (Vitest)** | Verificação da evolução do feed e componentes desacoplados. |

**Fora do escopo principal** (mencionados, mas não detalhados neste memorial): upload Multer, documentação Swagger, telas do frontend AngularJS e migrações Sequelize — permanecem como suporte ao sistema, sem ser o núcleo da argumentação de padrões GoF.

## 1.3 Contextualização do sistema escolhido

Trata-se de um sistema **já existente em desenvolvimento**, evoluído para demonstrar maturidade em Análise e Projeto de Software. A versão inicial concentrava regras de listagem e formatação em poucos artefatos; a versão atual distribui responsabilidades em camadas e aplica padrões de projeto no fluxo do feed.

A equipe utilizou o repositório `medium-post-app` como base real, aplicando refatorações orientadas a baixo acoplamento, alta coesão e testabilidade — alinhadas aos critérios de avaliação da disciplina.

---

*Integrantes da equipe (preencher):*  
1. __________________________  
2. __________________________  
3. __________________________  
4. __________________________  
5. __________________________  

*Instituição:* UNICAP — Análise e Projeto de Software  
*Data:* Maio/2026
