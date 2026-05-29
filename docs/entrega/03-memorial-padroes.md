# 3. Memorial Descritivo de Padrões e Princípios

## 3.1 Tabela de padrões GoF

| Padrão | Categoria | Classe / Módulo | Justificativa da escolha |
|--------|-----------|-----------------|---------------------------|
| **Factory Method** | Criacional | `FeedStrategyFactory` (`apps/backend/src/factories/FeedStrategyFactory.js`) | O parâmetro `sort` (`newest`, `most_liked`, `trending`) exige instanciar algoritmos diferentes. A factory centraliza a decisão de criação, evitando `switch` espalhado em controllers ou no serviço principal. |
| **Facade** | Estrutural | `FeedFacade` (`apps/backend/src/facades/FeedFacade.js`) | `PostService` precisa apenas de “obter feed ordenado”. A facade encapsula factory + estratégia + repositório, reduzindo o acoplamento do serviço aos detalhes de ordenação. |
| **Strategy** | Comportamental | `FeedStrategy`, `NewestPostsStrategy`, `MostLikedPostsStrategy`, `TrendingPostsStrategy` (`apps/backend/src/strategies/feed/`) | Cada tipo de ordenação é um algoritmo intercambiável com interface comum (`execute(repository, params)`). Novas ordenações podem ser adicionadas criando uma classe e registrando na factory, sem alterar `PostService.listPosts` inteiro (OCP). |

### Observação sobre Singleton

Classes como `PostService`, `FeedFacade` e `MetricsService` são exportadas como instância única (`export default new X()`), o que se aproxima do padrão **Singleton** em Node.js. Porém, para a obrigatoriedade da disciplina, os três padrões formalmente adotados e justificados são **Factory, Facade e Strategy**, por serem os que estruturam a funcionalidade evoluída do feed.

## 3.2 Princípios SOLID (mínimo 3)

### S — Single Responsibility Principle (Responsabilidade Única)

Cada camada/classe possui um motivo claro de mudança:

- `PostController`: HTTP (status, query params, erros de transporte).
- `PostService`: regras de listagem, cache, cursor, orquestração.
- `PostRepository`: consultas Sequelize.
- `PostSerializer`: formato JSON de saída (URLs de imagem, flags `allowEdit`, `totalLikes`).

*Exemplo:* o controller não monta SQL nem formata DTO; delega ao serviço e serializer.

### O — Open/Closed Principle (Aberto/Fechado)

O feed está **aberto à extensão** (nova `XPostsStrategy` + case na factory) e **fechado à modificação** em `PostService` para cada nova ordenação — o serviço continua chamando `FeedFacade.getFeed(sort, params)` sem crescer com condicionais de `order`.

### D — Dependency Inversion Principle (Inversão de Dependência)

Módulos de alto nível (`PostService`, `FeedFacade`) dependem de abstrações comportamentais (`FeedStrategy.execute`) e de contratos de repositório (`findPosts`), não de detalhes de implementação SQL dentro do controller.

Na prática JavaScript, as dependências são concretas (`PostRepository`), mas a **direção de dependência** respeita camadas: controllers → services → facades/strategies/repositories → models. Isso permitiu **testes unitários com mocks** (`tests/unit/PostService.feed.test.js`) sem subir servidor HTTP nem Redis.

### Resumo SOLID

| Princípio | Onde se manifesta | Benefício |
|-----------|-------------------|-----------|
| SRP | Controller / Service / Repository / Serializer | Manutenção localizada |
| OCP | Strategy + Factory no feed | Novas ordenações sem explosão de `if` |
| DIP | Services dependem de facades e contratos | Testabilidade com Vitest |

## 3.3 Padrões GRASP (mínimo 2)

### GRASP — Controller

`PostController` e `LikeController` recebem requisições HTTP e coordenam a resposta, sem executar persistência direta. São o ponto de entrada da camada de apresentação na API, alinhado ao papel de **Controller** do GRASP.

### GRASP — Information Expert (Especialista na Informação)

`PostRepository` concentra o conhecimento de como buscar posts com `include` de usuário, atributos calculados (`totalLikes`, `isLikedByUser`) e `order` definido pela estratégia. `LikeRepository` é especialista em `PostLike`.

Quem tem a informação necessária para persistir/consultar é quem implementa a operação — evitando que controllers dupliquem queries.

### GRASP complementar — Baixo acoplamento

A introdução de `FeedFacade` reduziu o acoplamento entre `PostService` e as três estratégias concretas: o serviço conhece apenas a facade.

## 3.4 Code smells identificados e refatorações aplicadas

| Code smell | Sintoma (antes) | Técnica de refatoração | Resultado (depois) |
|------------|-----------------|------------------------|---------------------|
| **Long Method** | `listPosts` com lógica de ordenação, query e formatação misturadas | **Extract Class** + **Replace Conditional with Strategy** | Ordenação em `*PostsStrategy`; queries em `PostRepository` |
| **Duplicate Code** | Três blocos `order` semelhantes para cada `sort` | **Strategy** | Uma classe por algoritmo de ordenação |
| **Feature Envy / God Class** | Controller ou serviço acessando Sequelize diretamente | **Move Method** para Repository | `PostRepository.findPosts` |
| **Primitive Obsession** na resposta | Montagem manual de JSON no serviço | **Extract Class** | `PostSerializer` |
| **Shotgun Surgery** (risco) | Alterar formato de post exigiria vários pontos | **Serializer** centralizado | Um único módulo de serialização |

Detalhamento com trechos *antes/depois* na **Seção 5** e no arquivo `05-log-refatoracao.md`.

## 3.5 Referências conceituais

- Gamma, E. et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley, 1994.
- Larman, C. *Applying UML and Patterns*. Prentice Hall (GRASP).
- Martin, R. C. *Clean Architecture* / princípios SOLID.
