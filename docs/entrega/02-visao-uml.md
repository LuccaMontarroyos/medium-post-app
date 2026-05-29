# 2. Visão de Projeto (UML)

## 2.1 Diagrama de classes de projeto

O diagrama de classes de projeto enfatiza as classes de negócio, os pontos de entrada HTTP (controllers), a camada de serviço, repositórios, serializer e o pacote de **padrões GoF** aplicados ao feed.

**Artefato fonte:** `apps/backend/src/uml-class-diagram.puml`

**Elementos principais:**

- **Controllers:** `PostController`, `LikeController`, `UserController`, `SessionController`, `MetricsController` — recebem requisições e delegam serviços.
- **Services:** `PostService`, `LikeService`, `UserService`, `AuthService` — orquestram regras de negócio.
- **Repositories:** `PostRepository`, `LikeRepository`, `UserRepository` — especialistas em persistência (GRASP).
- **Padrões (pacote dedicado no diagrama):**
  - `FeedStrategyFactory` (criacional)
  - `FeedFacade` (estrutural)
  - `FeedStrategy` ← `NewestPostsStrategy`, `MostLikedPostsStrategy`, `TrendingPostsStrategy` (comportamental)
- **Models:** `User`, `Post`, `PostLike` — entidades Sequelize.
- **Apoio:** `PostSerializer`, `MetricsService`.

**Relações relevantes:**

- `PostService` → `FeedFacade` → `FeedStrategyFactory` → `FeedStrategy`
- Estratégias concretas utilizam `PostRepository` para `findPosts`
- Agregações de domínio: `User` 1—* `Post`; `Post` 1—* `PostLike`

> **[INSERIR FIGURA 1]** — Export PNG de `uml-class-diagram.puml`  
> Legenda: *Figura 1 — Diagrama de classes de projeto (backend).*

## 2.2 Diagramas de interação (sequência)

Foram produzidos **dois diagramas de sequência** para fluxos críticos que envolvem padrões e transações.

### 2.2.1 Listagem do feed com Strategy e cache

**Artefato:** `apps/backend/src/uml-sequence-feed.puml`  
**Endpoint:** `GET /posts?limit&cursor&search&sort`

**Resumo do fluxo:**

1. `PostController` chama `PostService.listPosts`.
2. `PostService` consulta Redis; em *cache hit*, retorna e incrementa métrica de hit.
3. Em *cache miss*, chama `FeedFacade.getFeed(sort, params)`.
4. `FeedFacade` usa `FeedStrategyFactory.create(sort)` e executa a estratégia.
5. A estratégia delega a `PostRepository.findPosts` e ao banco.
6. `PostSerializer.serializeMany` formata a resposta; resultado é gravado no Redis.

Este diagrama evidencia o padrão **Strategy** no ponto de decisão de ordenação e o **Facade** como interface simplificada para o serviço.

> **[INSERIR FIGURA 2]** — Export PNG de `uml-sequence-feed.puml`  
> Legenda: *Figura 2 — Sequência da listagem do feed.*

### 2.2.2 Toggle de like com transação

**Artefato:** `apps/backend/src/uml-sequence-like.puml`  
**Endpoint:** `POST /posts/{post_id}/like`

**Resumo do fluxo:**

1. `LikeController` → `LikeService.toggleLike`.
2. Abertura de transação Sequelize.
3. `LikeRepository.findPostLike`; criação ou atualização lógica (`is_deleted`).
4. Commit; `delCache("posts:*")` invalida listagens cacheadas.

Este fluxo não usa Strategy, mas demonstra **consistência transacional** e integração com cache — complementar ao diagrama do feed.

> **[INSERIR FIGURA 3]** — Export PNG de `uml-sequence-like.puml`  
> Legenda: *Figura 3 — Sequência do toggle de like.*

## 2.3 Diagrama de arquitetura (camadas)

**Artefato:** `apps/backend/src/uml-architecture.puml`

Representa a organização em camadas do backend Express:

`Client → Routes → Middlewares → Controllers → Services → (Facade/Factory/Strategies | Repositories | Serializer) → Database / Redis`

Também indica integrações: JWT, Swagger, Multer/uploads.

> **[INSERIR FIGURA 4]** — Export PNG de `uml-architecture.puml`  
> Legenda: *Figura 4 — Arquitetura em camadas do backend.*

## 2.4 Modelo de dados (complementar)

**Artefato:** `apps/backend/src/der-dbdiagram.dbml` — DER para dbdiagram.io (usuários, posts, post_likes).

## 2.5 Consistência entre diagramas

| Elemento | Classe | Seq. Feed | Seq. Like | Arquitetura |
|----------|--------|-----------|-----------|-------------|
| PostService.listPosts | ✓ | ✓ | — | ✓ (Services) |
| FeedFacade / Factory / Strategy | ✓ | ✓ | — | ✓ |
| LikeService / LikeRepository | ✓ | — | ✓ | ✓ |
| Redis | ✓ | ✓ | ✓ | ✓ |
| PostSerializer | ✓ | ✓ | — | ✓ |

Os diagramas seguem a notação UML via PlantUML e estão versionados junto ao código para facilitar manutenção conjunta.
